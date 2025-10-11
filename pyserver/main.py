import os
import io
import numpy as np
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request
from dotenv import load_dotenv
from openai import OpenAI
from PyPDF2 import PdfReader
from pdfminer.high_level import extract_text as pdfminer_extract

# Load environment variables from .env (if present)
load_dotenv()

# Lazy OpenAI client (avoid failing at import time)
_client = None

def get_openai_client() -> OpenAI:
    global _client
    if _client is not None:
        return _client
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not set")
    _client = OpenAI(api_key=api_key)
    return _client

app = FastAPI(title="AI Resume Matcher", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler to avoid empty 500 responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log for server-side debugging
    print(f"[ERROR] {request.method} {request.url} -> {exc}")
    return JSONResponse(status_code=500, content={"error": "internal_server_error", "detail": str(exc)})

class MatchReq(BaseModel):
    resumeText: str = ""
    jdText: str = ""
    keywords: str = ""

class CLReq(BaseModel):
    resumeText: str = ""
    jdText: str = ""

class ImproveReq(BaseModel):
    resumeText: str = ""
    jdText: str = ""

def embed(text: str):
    """Generate embeddings using OpenAI API"""
    text = (text or "")[:8000]  # Limit text length for API
    try:
        oc = get_openai_client()
        resp = oc.embeddings.create(model="text-embedding-3-small", input=text)
        return np.array(resp.data[0].embedding, dtype=np.float32)
    except Exception as e:
        print(f"Embedding error: {e}")
        return np.zeros(1536, dtype=np.float32)  # Fallback

def cosine_similarity(a, b):
    """Calculate cosine similarity between two vectors"""
    na = np.linalg.norm(a)
    nb = np.linalg.norm(b)
    return float(np.dot(a, b) / (na * nb)) if na and nb else 0.0

@app.get("/")
def read_root():
    return {"message": "AI Resume Matcher API is running"}

@app.post("/resume/match")
def resume_match(req: MatchReq):
    """Analyze resume-job description match"""
    try:
        # Parse keywords
        kws = [k.strip().lower() for k in (req.keywords or "").split(",") if k.strip()]
        
        # Generate embeddings
        e_resume = embed(req.resumeText)
        e_jd = embed(req.jdText)
        
        # Calculate embedding similarity
        emb_sim = max(0.0, min(1.0, cosine_similarity(e_resume, e_jd)))
        
        # Calculate keyword coverage
        all_text = f"{req.resumeText} {req.jdText}".lower()
        kw_cov = (sum(1 for k in kws if k in all_text) / len(kws)) if kws else 0.0
        
        # Rule-based bonus (simplified)
        rule_bonus = kw_cov
        
        # Final score calculation
        final = max(0.0, min(1.0, 0.6*emb_sim + 0.25*kw_cov + 0.15*rule_bonus))
        
        # Generate LLM analysis
        oc = get_openai_client()
        messages = [
            {"role": "system", "content": "You are an expert resume coach and ATS screener. Be concise and actionable."},
            {"role": "user", "content": f"""Resume:
{req.resumeText}

Job Description:
{req.jdText}

Keywords: {", ".join(kws) or "-"}

Return sections:
- Strengths (bullet list)
- Gaps (bullet list)
- ATS Keywords (bullet list, include missing ones first)
- Suggested Bullets (3-5 tailored resume bullets)
- Rationale (2-3 sentences why this score makes sense)"""}
        ]
        
        chat = oc.chat.completions.create(
            model="gpt-4o-mini", 
            messages=messages, 
            temperature=0.3
        )
        analysis = chat.choices[0].message.content if chat.choices else ""
        
        return {
            "score": round(final * 100),
            "components": {
                "embeddingSim": emb_sim,
                "keywordCoverage": kw_cov,
                "ruleBonus": rule_bonus
            },
            "analysis": analysis
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/resume/cover-letter")
def cover_letter(req: CLReq):
    """Generate tailored cover letter"""
    try:
        oc = get_openai_client()
        messages = [
            {"role": "system", "content": "You write concise, tailored cover letters."},
            {"role": "user", "content": f"""Using the resume and job description below, write a 200-300 word tailored cover letter.

Resume:
{req.resumeText}

Job Description:
{req.jdText}"""}
        ]
        
        chat = oc.chat.completions.create(
            model="gpt-4o-mini", 
            messages=messages, 
            temperature=0.5
        )
        
        return {"coverLetter": chat.choices[0].message.content if chat.choices else ""}
    except Exception as e:
        return {"error": str(e)}

@app.post("/resume/improve")
def resume_improve(req: ImproveReq):
    """Generate actionable resume improvement suggestions"""
    try:
        oc = get_openai_client()
        messages = [
            {"role": "system", "content": "You are an expert resume coach. Return concise, actionable improvements as bullet points. Keep to max 10 bullets."},
            {"role": "user", "content": f"""Resume:
{req.resumeText}

Job Description (optional):
{req.jdText or '-'}

Return sections:
- Improvements (bullet list, specific edits and wording suggestions)
- Missing Keywords (if any)
- Formatting Tips (brief)
"""}
        ]
        chat = oc.chat.completions.create(model="gpt-4o-mini", messages=messages, temperature=0.3)
        return {"improvements": chat.choices[0].message.content if chat.choices else ""}
    except Exception as e:
        return {"error": str(e)}

@app.post("/resume/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        if not file or not file.filename.lower().endswith('.pdf'):
            return {"error": "invalid_file", "detail": "Please upload a PDF file."}
        data = await file.read()
        if not data:
            return {"error": "empty_file", "detail": "Uploaded file is empty."}
        # Try PyPDF2 first
        try:
            reader = PdfReader(io.BytesIO(data))
            if reader.pages:
                text = "\n".join((page.extract_text() or "") for page in reader.pages)
                if text and text.strip():
                    return {"text": text}
        except Exception as e:
            print(f"PyPDF2 failed: {e}")
        # Fallback to pdfminer.six
        try:
            text2 = pdfminer_extract(io.BytesIO(data))
            if text2 and text2.strip():
                return {"text": text2}
        except Exception as e:
            print(f"pdfminer failed: {e}")
        return {"error": "extract_failed", "detail": "Could not extract text from this PDF. It may be scanned or image-based."}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
