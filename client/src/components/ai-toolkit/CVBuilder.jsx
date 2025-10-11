import React, { useState } from "react";
import { Upload, Gauge, FileText as FileTextIcon, Wand2 } from "lucide-react";

export default function CVBuilder() {
  // Single-panel states
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [improvements, setImprovements] = useState("");

  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingCL, setLoadingCL] = useState(false);
  const [loadingImprove, setLoadingImprove] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Helper: safe JSON parse to avoid "Unexpected end of JSON input"
  const parseJsonSafe = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Bad response (${res.status}): ${text?.slice(0, 200) || "<empty>"}`);
    }
  };

  // PDF upload -> extract resume text via FastAPI
  const handlePdfUpload = async (file) => {
    if (!file) return;
    setUploadLoading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/ml/resume/extract-text", { method: "POST", body: form });
      const data = await parseJsonSafe(res);
      if (!res.ok || data.error) throw new Error(data.error || "Extract failed");
      setResumeText(data.text || "");
    } catch (e) {
      setUploadError(String(e.message || e));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleMatch = async () => {
    setLoadingMatch(true);
    setMatchResult(null);
    try {
      const res = await fetch("/ml/resume/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jdText,
          keywords
        })
      });
      const data = await parseJsonSafe(res);
      if (!res.ok || data.error) throw new Error(data.error || "Match failed");
      setMatchResult(data);
    } catch (e) {
      setMatchResult({ error: String(e.message || e) });
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleCoverLetter = async () => {
    setLoadingCL(true);
    setCoverLetter("");
    try {
      const res = await fetch("/ml/resume/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText })
      });
      const data = await parseJsonSafe(res);
      if (!res.ok || data.error) throw new Error(data.error || "Generation failed");
      setCoverLetter(data.coverLetter || "");
    } catch (e) {
      setCoverLetter(`Error: ${String(e.message || e)}`);
    } finally {
      setLoadingCL(false);
    }
  };

  const handleImprove = async () => {
    setLoadingImprove(true);
    setImprovements("");
    try {
      const res = await fetch("/ml/resume/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText })
      });
      const data = await parseJsonSafe(res);
      if (!res.ok || data.error) throw new Error(data.error || "Improve failed");
      setImprovements(data.improvements || "");
    } catch (e) {
      setImprovements(`Error: ${String(e.message || e)}`);
    } finally {
      setLoadingImprove(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] p-4">
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-blue-100">
        <div className="mb-6">
          <h2 className="font-extrabold text-2xl md:text-3xl text-blue-900 tracking-tight">AI Resume Matcher</h2>
          <p className="text-blue-700/80 text-sm md:text-base mt-1">Upload your resume, paste a job description, and get a match score, tailored cover letter, and clear improvement suggestions.</p>
        </div>

        {/* Upload Resume (PDF) */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2 text-blue-900">Upload Resume (PDF)</h3>
          <label htmlFor="resumePdf" className="group block w-full rounded-xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 text-blue-900 p-4 cursor-pointer transition-colors">
            <div className="flex items-center justify-center gap-2 pointer-events-none">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow group-hover:bg-blue-700 transition-colors">
                <Upload className="h-5 w-5" />
              </span>
              <div className="text-sm md:text-base">
                <span className="font-semibold">Choose PDF</span>
                <span className="text-blue-700/70 ml-2">or drag & drop</span>
              </div>
            </div>
          </label>
          <input
            id="resumePdf"
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={(e) => handlePdfUpload(e.target.files?.[0])}
          />
          {/* Status */}
          {uploadLoading && (<div className="text-blue-700 text-sm mt-2">Extracting text...</div>)}
          {uploadError && (<div className="text-red-600 bg-red-50 p-2 rounded border border-red-200 mt-2">{uploadError}</div>)}
        </div>

        {/* Extracted or manual resume text */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="font-semibold mb-1 text-blue-900 flex items-center gap-2"><FileTextIcon className="h-4 w-4"/> Resume Text (editable)</div>
            <div className="text-xs text-blue-600/70">{resumeText.length} chars</div>
          </div>
          <textarea
            className="border border-blue-200 bg-blue-50/60 focus:bg-white transition-colors p-3 w-full rounded-xl focus:outline-blue-400 text-base text-blue-900 resize-y min-h-[160px]"
            placeholder="Upload a PDF or paste your resume text here."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        {/* Job Description + Keywords */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2 text-blue-900">Job Description & Keywords</h3>
          <textarea
            className="border border-blue-200 bg-white p-3 mb-2 w-full rounded-xl focus:outline-blue-400 text-base text-blue-900"
            rows={5}
            placeholder="Paste Job Description here..."
            value={jdText}
            onChange={e => setJdText(e.target.value)}
          />
          <input
            className="border border-blue-200 bg-white p-3 w-full rounded-xl focus:outline-blue-400 text-base text-blue-900"
            placeholder="Role Keywords (comma-separated), e.g. React, Node.js, AWS, Python"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow transition disabled:opacity-60"
            onClick={handleMatch}
            disabled={loadingMatch || !jdText.trim() || !resumeText.trim()}
          >
            <Gauge className="h-5 w-5"/>
            {loadingMatch ? "Working..." : "Get Match Score"}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow transition disabled:opacity-60"
            onClick={handleCoverLetter}
            disabled={loadingCL || !jdText.trim() || !resumeText.trim()}
          >
            <FileTextIcon className="h-5 w-5"/>
            {loadingCL ? "Working..." : "Generate Cover Letter"}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow transition disabled:opacity-60"
            onClick={handleImprove}
            disabled={loadingImprove || !resumeText.trim()}
          >
            <Wand2 className="h-5 w-5"/>
            {loadingImprove ? "Working..." : "Suggest CV Improvements"}
          </button>
        </div>

        {/* Results */}
        {matchResult && (
          <div className="space-y-2 mb-4">
            {"error" in matchResult ? (
              <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{matchResult.error}</div>
            ) : (
              <>
                <div className="text-xl font-bold text-blue-900">
                  Match Score: <span className="text-green-700">{matchResult.score}%</span>
                </div>
                <div className="text-sm text-blue-700">
                  Components: Embedding {(matchResult.components.embeddingSim*100).toFixed(0)}%, Keywords {(matchResult.components.keywordCoverage*100).toFixed(0)}%, Rules {(matchResult.components.ruleBonus*100).toFixed(0)}%
                </div>
                <div className="whitespace-pre-wrap bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-900 text-sm max-h-64 overflow-y-auto">
                  {matchResult.analysis}
                </div>
              </>
            )}
          </div>
        )}

        {coverLetter && (
          <div className="mt-4">
            <div className="font-semibold mb-2 text-blue-900">Generated Cover Letter</div>
            <div className="whitespace-pre-wrap bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-900 text-sm max-h-64 overflow-y-auto">
              {coverLetter}
            </div>
            <button 
              className="mt-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm"
              onClick={() => navigator.clipboard?.writeText(coverLetter)}
            >
              Copy to Clipboard
            </button>
          </div>
        )}

        {improvements && (
          <div className="mt-6">
            <div className="font-semibold mb-2 text-blue-900">CV Improvements</div>
            <div className="whitespace-pre-wrap bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-900 text-sm max-h-64 overflow-y-auto">
              {improvements}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
