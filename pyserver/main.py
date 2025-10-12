import os
import io
import numpy as np
from fastapi import FastAPI, UploadFile, File
from typing import Optional, List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request
from dotenv import load_dotenv
from pathlib import Path
from openai import OpenAI
from PyPDF2 import PdfReader
from pdfminer.high_level import extract_text as pdfminer_extract
from pdfminer.layout import LAParams
import shutil
import re

# Optional Gemini import (lazy usage)
try:
    import google.generativeai as genai
except Exception:
    genai = None

# Load environment variables from .env in both pyserver/ and repo root (if present)
try:
    here = Path(__file__).resolve().parent
    repo_root = here.parent
    # Load pyserver/.env first
    load_dotenv(here / '.env', override=False)
    # Then allow repo root .env to override
    load_dotenv(repo_root / '.env', override=True)
except Exception:
    # Fallback to default behavior
    load_dotenv()

# Lazy OpenAI client (avoid failing at import time)
_client = None


def use_gemini() -> bool:
    # Allow switching via env: LLM_PROVIDER=gemini
    return (os.environ.get("LLM_PROVIDER", "").lower() == "gemini") and bool(os.environ.get("GEMINI_API_KEY")) and genai is not None


def resolve_gemini_text_model(preferred: Optional[str] = None) -> str:
    """Resolve a valid Gemini text model by listing available models and applying fallbacks.
    Prefer 2.x models when available; keep 1.5 as fallback.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set")
    try:
        genai.configure(api_key=api_key)
    except Exception as e:
        print(f"Gemini configure failed: {e}")

    available: List[str] = []
    try:
        models = genai.list_models()
        for m in models:
            try:
                methods = getattr(m, "supported_generation_methods", []) or getattr(m, "supported_methods", [])
            except Exception:
                methods = []
            if methods and ("generateContent" in methods or "generate_content" in methods):
                name = getattr(m, "name", "") or ""
                if name.startswith("models/"):
                    name = name.split("/", 1)[1]
                if name:
                    available.append(name)
        if not available:
            print("Gemini list_models returned no generateContent-capable models.")
        else:
            print(f"Gemini available models: {available[:10]}{'...' if len(available)>10 else ''}")
    except Exception as e:
        print(f"Gemini list_models failed: {e}")

    # Build candidate list: normalize preferred and add known fallbacks
    candidates: List[str] = []
    if preferred:
        base = preferred.replace("-latest", "")
        candidates.extend([preferred, base, f"{base}-001"])  # try forms of preferred
    # Prefer 2.x first, then 1.5
    candidates.extend([
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-2.0-flash-001",
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-1.5-pro-001",
        "gemini-pro",
        "gemini-1.0-pro",
    ])

    # Prefer non-'-latest' matches first
    for cand in candidates:
        if "-latest" in cand:
            continue
        if cand in available:
            return cand
    # If none found, allow '-latest'
    for cand in candidates:
        if cand in available:
            return cand

    # If list_models failed or no matches, use a safe default
    return "gemini-2.0-flash"


def chat_with_gemini(prompt: str, model: Optional[str] = None) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set")
    genai.configure(api_key=api_key)

    preferred = model or os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
    resolved = resolve_gemini_text_model(preferred)

    def _gm(name: str):
        return genai.GenerativeModel(name if name.startswith("models/") else f"models/{name}")

    try:
        gm = _gm(resolved)
        resp = gm.generate_content(prompt)
        return getattr(resp, "text", "") or ""
    except Exception as e:
        print(f"Gemini chat error on {resolved}: {e}")
        # Try a second fallback model explicitly
        try:
            alt = resolve_gemini_text_model("gemini-1.5-pro")
            if alt != resolved:
                gm = _gm(alt)
                resp = gm.generate_content(prompt)
                return getattr(resp, "text", "") or ""
        except Exception as e2:
            print(f"Gemini fallback error: {e2}")
        return ""


def get_openai_client() -> OpenAI:
    global _client
    if _client is not None:
        return _client
    # Try to (re)load .env at call-time so adding .env doesn't require a server restart
    try:
        here = Path(__file__).resolve().parent
        repo_root = here.parent
        load_dotenv(here / '.env', override=False)
        load_dotenv(repo_root / '.env', override=True)
    except Exception:
        load_dotenv()
    api_key = (os.environ.get("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY") or "").strip()
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not set")
    # Remove unsupported proxy vars
    for k in ("OPENAI_PROXY", "OPENAI_PROXIES"):
        if k in os.environ:
            os.environ.pop(k, None)
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


class TailorReq(BaseModel):
    resumeText: str = ""
    jdText: str = ""
    analysis: str = ""
    improvements: str = ""


def embed(text: str):
    """Generate embeddings using Gemini or OpenAI based on provider"""
    text = (text or "")[:8000]
    try:
        if use_gemini():
            # Gemini embeddings
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key or genai is None:
                raise RuntimeError("GEMINI_API_KEY not set")
            genai.configure(api_key=api_key)
            model_id = os.environ.get("GEMINI_EMBED_MODEL", "text-embedding-004")
            # Some SDKs require full path "models/text-embedding-004"
            embed_model = model_id
            if not embed_model.startswith("models/"):
                embed_model_full = f"models/{model_id}"
            else:
                embed_model_full = embed_model
            resp = genai.embed_content(model=embed_model_full, content=text)
            vec = resp.get("embedding") if isinstance(resp, dict) else getattr(resp, "embedding", None)
            if not vec:
                raise RuntimeError("Gemini embedding failed")
            return np.array(vec, dtype=np.float32)
        else:
            # OpenAI embeddings
            oc = get_openai_client()
            resp = oc.embeddings.create(model="text-embedding-3-small", input=text)
            return np.array(resp.data[0].embedding, dtype=np.float32)
    except Exception as e:
        print(f"Embedding error: {e}")
        dim = 3072 if use_gemini() else 1536
        return np.zeros(dim, dtype=np.float32)


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
        final = max(0.0, min(1.0, 0.6 * emb_sim + 0.25 * kw_cov + 0.15 * rule_bonus))

        # Generate LLM analysis
        prompt = f"""You are an expert resume coach and ATS screener. Be concise and actionable.

Resume:
{req.resumeText}

Job Description:
{req.jdText}

Keywords: {', '.join(kws) or '-'}

Return sections:
- Strengths (bullet list)
- Gaps (bullet list)
- ATS Keywords (bullet list, include missing ones first)
- Suggested Bullets (3-5 tailored resume bullets)
- Rationale (2-3 sentences why this score makes sense)
"""
        if use_gemini():
            analysis = chat_with_gemini(prompt, model=os.environ.get("GEMINI_MODEL"))
        else:
            oc = get_openai_client()
            chat = oc.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}], temperature=0.3)
            analysis = chat.choices[0].message.content if chat.choices else ""

        return {
            "score": round(final * 100),
            "components": {
                "embeddingSim": emb_sim,
                "keywordCoverage": kw_cov,
                "ruleBonus": rule_bonus,
            },
            "analysis": analysis,
        }
    except Exception as e:
        return {"error": str(e)}


@app.post("/resume/cover-letter")
def cover_letter(req: CLReq):
    """Generate tailored cover letter"""
    try:
        prompt = f"""Using the resume and job description below, write a 200-300 word tailored cover letter.

Resume:
{req.resumeText}

Job Description:
{req.jdText}
"""
        if use_gemini():
            text = chat_with_gemini(prompt, model=os.environ.get("GEMINI_MODEL"))
            return {"coverLetter": text}
        else:
            oc = get_openai_client()
            chat = oc.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}], temperature=0.5)
            return {"coverLetter": chat.choices[0].message.content if chat.choices else ""}
    except Exception as e:
        return {"error": str(e)}


@app.post("/resume/improve")
def resume_improve(req: ImproveReq):
    """Generate actionable resume improvement suggestions"""
    try:
        prompt = f"""You are an expert resume coach. Return concise, actionable improvements as bullet points. Keep to max 10 bullets.

Resume:
{req.resumeText}

Job Description (optional):
{req.jdText or '-'}

Return sections:
- Improvements (bullet list, specific edits and wording suggestions)
- Missing Keywords (if any)
- Formatting Tips (brief)
"""
        if use_gemini():
            text = chat_with_gemini(prompt, model=os.environ.get("GEMINI_MODEL"))
            return {"improvements": text}
        else:
            oc = get_openai_client()
            chat = oc.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}], temperature=0.3)
            return {"improvements": chat.choices[0].message.content if chat.choices else ""}
    except Exception as e:
        return {"error": str(e)}


def _normalize_extracted_text(text: str) -> str:
    """Normalize extracted PDF text: fix NBSP, hyphenated line breaks, collapse spaces."""
    if not text:
        return ""
    # Normalize line breaks and NBSP
    t = text.replace("\r\n", "\n").replace("\r", "\n").replace("\u00a0", " ")
    # Remove hyphen at end of line when it's a hard hyphenation (word-break)
    t = re.sub(r"(\w)-\n(\w)", r"\1\2", t)
    # Convert multiple spaces to single (but keep newlines)
    t = re.sub(r"[ \t\f\v]+", " ", t)
    # Trim spaces around newlines
    t = re.sub(r" *\n *", "\n", t)
    return t.strip()


def _score_text_quality(text: str) -> float:
    """Heuristic quality score: higher space ratio and token count indicate better spacing."""
    if not text:
        return 0.0
    ln = len(text)
    spaces = text.count(" ")
    space_ratio = spaces / max(1, ln)
    tokens = re.findall(r"\w+", text)
    avg_token = (sum(len(t) for t in tokens) / max(1, len(tokens))) if tokens else 0.0
    # Favor more spaces and reasonable token sizes; penalize very long average tokens
    return space_ratio * 2.0 + (len(tokens) / 1000.0) - max(0.0, (avg_token - 12)) * 0.05


def _extract_with_pdfminer(data: bytes) -> str:
    """Extract text using pdfminer with tuned LAParams to preserve word spacing."""
    best_text = ""
    best_score = -1e9
    # Try a couple of parameter sets
    params = [
        LAParams(char_margin=2.0, word_margin=0.2, line_margin=0.4, boxes_flow=None, all_texts=False),
        LAParams(char_margin=2.0, word_margin=0.5, line_margin=0.4, boxes_flow=None, all_texts=False),
        LAParams(char_margin=2.0, word_margin=0.3, line_margin=0.6, boxes_flow=0.5, all_texts=False),
    ]
    for lp in params:
        try:
            txt = pdfminer_extract(io.BytesIO(data), laparams=lp)
            txt = _normalize_extracted_text(txt or "")
            sc = _score_text_quality(txt)
            if txt and sc > best_score:
                best_text, best_score = txt, sc
        except Exception as e:
            print(f"pdfminer with LAParams {lp} failed: {e}")
    return best_text


def _extract_with_pymupdf(data: bytes) -> str:
    """Extract text using PyMuPDF (non-OCR). Often yields better spacing than PyPDF2."""
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=data, filetype="pdf")
        parts: List[str] = []
        for page in doc:
            try:
                parts.append(page.get_text("text"))
            except Exception:
                # Fallback to simple text
                parts.append(page.get_text())
        txt = "\n".join(parts)
        return _normalize_extracted_text(txt)
    except Exception as e:
        print(f"PyMuPDF text extraction failed: {e}")
        return ""


@app.post("/resume/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        if not file or not file.filename.lower().endswith('.pdf'):
            return {"error": "invalid_file", "detail": "Please upload a PDF file."}
        data = await file.read()
        if not data:
            return {"error": "empty_file", "detail": "Uploaded file is empty."}
        bio = io.BytesIO(data)
        # Try PyPDF2 first
        try:
            reader = PdfReader(bio)
            # Handle encrypted PDFs (try empty password)
            if getattr(reader, "is_encrypted", False):
                try:
                    reader.decrypt("")
                except Exception as de:
                    print(f"Decrypt attempt failed: {de}")
                    return {"error": "encrypted_pdf", "detail": "This PDF is encrypted/protected and cannot be read."}
            if reader.pages:
                text = "\n".join((page.extract_text() or "") for page in reader.pages)
                text = _normalize_extracted_text(text)
                # If spacing looks poor, try other extractors and choose best
                score_pdf2 = _score_text_quality(text)
                alt_pymupdf = _extract_with_pymupdf(data)
                score_pymu = _score_text_quality(alt_pymupdf)
                alt_pdfminer = _extract_with_pdfminer(data)
                score_pdfm = _score_text_quality(alt_pdfminer)
                best = max([(text, score_pdf2, "pypdf2"), (alt_pymupdf, score_pymu, "pymupdf"), (alt_pdfminer, score_pdfm, "pdfminer")], key=lambda x: x[1])
                if best[0] and best[1] > 0:
                    return {"text": best[0], "source": best[2]}
                if text and text.strip():
                    return {"text": text, "source": "pypdf2"}
        except Exception as e:
            print(f"PyPDF2 failed: {e}")
        # Next, try PyMuPDF direct text (non-OCR)
        try:
            alt = _extract_with_pymupdf(data)
            if alt:
                return {"text": alt, "source": "pymupdf"}
        except Exception as e:
            print(f"PyMuPDF non-OCR failed: {e}")
        # Fallback to tuned pdfminer.six
        try:
            text2 = _extract_with_pdfminer(data)
            if text2:
                return {"text": text2, "source": "pdfminer"}
        except Exception as e:
            print(f"pdfminer failed: {e}")
        # OCR Fallback (only if Tesseract is available)
        try:
            if shutil.which("tesseract") is not None:
                # Lazy import to avoid hard dependency at startup
                import fitz  # PyMuPDF
                from PIL import Image
                import pytesseract
                text_ocr_parts = []
                doc = fitz.open(stream=data, filetype="pdf")
                for page in doc:
                    # Render page to image
                    pix = page.get_pixmap(dpi=200)
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    txt = pytesseract.image_to_string(img)
                    if txt:
                        text_ocr_parts.append(txt)
                ocr_text = _normalize_extracted_text("\n".join(text_ocr_parts))
                if ocr_text:
                    return {"text": ocr_text, "source": "ocr"}
            else:
                print("Tesseract not found; skipping OCR fallback.")
        except Exception as e:
            print(f"OCR fallback failed: {e}")
        return {"error": "extract_failed", "detail": "Could not extract text from this PDF. It may be scanned/image-based or encrypted. If scanned, enable OCR (install Tesseract) and try again."}
    except Exception as e:
        return {"error": str(e)}


@app.get("/health")
def health():
    # Reload .env on each call so updates are reflected without restart
    try:
        here = Path(__file__).resolve().parent
        repo_root = here.parent
        load_dotenv(here / '.env', override=False)
        load_dotenv(repo_root / '.env', override=True)
    except Exception:
        load_dotenv()
    key_present = bool((os.environ.get("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY") or "").strip())
    # Include resolved Gemini model for debugging
    resolved_model = None
    try:
        if os.environ.get("LLM_PROVIDER", "").lower() == "gemini" and os.environ.get("GEMINI_API_KEY") and genai is not None:
            resolved_model = resolve_gemini_text_model(os.environ.get("GEMINI_MODEL"))
    except Exception as e:
        resolved_model = f"error: {e}"
    return {
        "ok": True,
        "openaiKey": key_present,
        "provider": os.environ.get("LLM_PROVIDER", "openai"),
        "geminiKey": bool(os.environ.get("GEMINI_API_KEY")),
        "geminiModel": resolved_model,
    }


def _infer_section_order(resume_text: str) -> list:
    """Infer a reasonable section order from raw resume text."""
    txt = (resume_text or "").lower()
    order = []
    def add(k):
        if k not in order:
            order.append(k)
    if any(w in txt for w in ["summary", "objective", "profile"]):
        add("Summary")
    if any(w in txt for w in ["experience", "work experience", "employment", "professional experience"]):
        add("Experience")
    if "projects" in txt:
        add("Projects")
    if any(w in txt for w in ["skills", "technical skills", "core skills"]):
        add("Skills")
    if any(w in txt for w in ["education", "bsc", "msc", "university", "college", "bs "]):
        add("Education")
    if any(w in txt for w in ["certification", "certifications"]):
        add("Certifications")
    if any(w in txt for w in ["languages", "language"]):
        add("Languages")
    # Fallback default order
    base = ["Summary", "Experience", "Projects", "Skills", "Education", "Certifications", "Languages"]
    for b in base:
        add(b)
    return order


@app.post("/resume/tailor")
def resume_tailor(req: TailorReq):
    """Generate a role-tailored resume body in Markdown, keeping user's personal info intact on client side.
    The output is ONLY markdown sections with # headings (no name/contact), suitable for rendering into a CV template.
    """
    try:
        sections = _infer_section_order(req.resumeText)
        sec_list = "\n".join(f"- {s}" for s in sections)
        prompt = f"""
Act as a senior resume writer and ATS expert. Rewrite the resume content to be tailored to the job description while preserving the candidate's identity and dates. Do NOT invent employment that doesn't exist; you may rephrase and reorder bullets, quantify with plausible metrics only if implied, and surface role-relevant achievements.

Return ONLY Markdown with these exact top-level headings (use #):
{sec_list}

Guidelines:
- Keep the writing concise and achievement-oriented (STAR-style). Max 5 bullets per role.
- Keep tech and ATS keywords from the JD where truly relevant.
- Keep original companies, roles, date ranges, education, certifications, languages.
- Use bullet markers '-' and keep clean markdown lists. No tables.
- Do NOT include personal header/contact; client will keep it. Output must start with a heading (e.g., '# Summary').

Original Resume:
{req.resumeText}

Job Description:
{req.jdText}

Analysis (optional):
{req.analysis or '-'}

Improvements (optional):
{req.improvements or '-'}
"""
        if use_gemini():
            text = chat_with_gemini(prompt, model=os.environ.get("GEMINI_MODEL"))
        else:
            oc = get_openai_client()
            chat = oc.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}], temperature=0.3)
            text = chat.choices[0].message.content if chat.choices else ""
        # Ensure it starts with a heading
        if text and not text.lstrip().startswith("#"):
            text = f"# Summary\n{text}"
        return {"markdown": text}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
