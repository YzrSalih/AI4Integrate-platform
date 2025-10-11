import React, { useState } from "react";
import { Upload, Gauge, FileText as FileTextIcon, Wand2, Copy as CopyIcon, CheckCircle2, AlertTriangle, Tag as TagIcon, Lightbulb, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Themed section wrapper
function SectionCard({ icon: Icon, title, children, actions }) {
  return (
    <div className="rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50/70 to-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-200/60 bg-white/60 rounded-t-2xl">
        <div className="flex items-center gap-2 text-blue-900">
          {Icon && <Icon className="h-5 w-5" />}
          <h4 className="font-extrabold tracking-tight">{title}</h4>
        </div>
        {actions}
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

// Simple progress row for components
function ProgressRow({ label, value, color = "bg-blue-500" }) {
  const pct = Math.max(0, Math.min(100, Math.round((value || 0) * 100)));
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-xs text-blue-800/80 mb-1">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-blue-100 overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Parse LLM analysis into themed sections
function parseAnalysisSections(text = "") {
  const out = { strengths: [], gaps: [], keywords: [], bullets: [], rationale: "" };
  const lines = text.split(/\r?\n/);
  let section = null;
  const setSection = (name) => (section = name);
  const isHeading = (s) => /^(\*\*|#+)?\s*(strengths|gaps|ats keywords|suggested bullets|rationale)\s*(\*\*|:)?\s*$/i.test(s.trim());
  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (isHeading(line)) {
      const key = line.toLowerCase();
      if (key.includes("strength")) setSection("strengths");
      else if (key.includes("gap")) setSection("gaps");
      else if (key.includes("ats")) setSection("keywords");
      else if (key.includes("suggested")) setSection("bullets");
      else if (key.includes("rationale")) setSection("rationale");
      continue;
    }
    const content = line.replace(/^[-*•]\s?/, "");
    if (section === "strengths") out.strengths.push(content);
    else if (section === "gaps") out.gaps.push(content);
    else if (section === "keywords") {
      // Try bullets or comma-separated
      const parts = content.split(/,|\u2022|\|/).map((s) => s.trim()).filter(Boolean);
      if (parts.length > 1) out.keywords.push(...parts); else out.keywords.push(content);
    }
    else if (section === "bullets") out.bullets.push(content);
    else if (section === "rationale") out.rationale += (out.rationale ? "\n" : "") + content;
  }
  return out;
}

function AnalysisView({ analysis = "" }) {
  const s = parseAnalysisSections(analysis);
  const hasAny = s.strengths.length || s.gaps.length || s.keywords.length || s.bullets.length || s.rationale;
  if (!hasAny) {
    // Fallback to markdown if parsing fails
    return (
      <div className="prose prose-sm prose-blue max-w-none leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {!!s.strengths.length && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
            <CheckCircle2 className="h-4 w-4"/> Strengths
          </div>
          <ul className="list-disc pl-5 space-y-1 text-emerald-900 text-sm">
            {s.strengths.map((it, i) => (<li key={`str-${i}`}>{it}</li>))}
          </ul>
        </div>
      )}
      {!!s.gaps.length && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
          <div className="flex items-center gap-2 text-amber-800 font-semibold mb-2">
            <AlertTriangle className="h-4 w-4"/> Gaps
          </div>
          <ul className="list-disc pl-5 space-y-1 text-amber-900 text-sm">
            {s.gaps.map((it, i) => (
              <li key={`gap-${i}`} className="marker:text-amber-500">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Render paragraphs inline within list item
                    p: (props) => <span {...props} />,
                    strong: (props) => <strong className="font-semibold text-amber-900" {...props} />,
                    em: (props) => <em className="text-amber-900/90" {...props} />,
                  }}
                >
                  {it}
                </ReactMarkdown>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!s.keywords.length && (
        <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3">
          <div className="flex items-center gap-2 text-sky-800 font-semibold mb-2">
            <TagIcon className="h-4 w-4"/> ATS Keywords
          </div>
          <div className="flex flex-wrap gap-2">
            {s.keywords.slice(0, 50).map((k, i) => (
              <span key={`kw-${i}`} className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs border border-sky-200">{k}</span>
            ))}
          </div>
        </div>
      )}
      {!!s.bullets.length && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
          <div className="flex items-center gap-2 text-indigo-800 font-semibold mb-2">
            <Lightbulb className="h-4 w-4"/> Suggested Bullets
          </div>
          <ul className="list-disc pl-5 space-y-1 text-indigo-900 text-sm">
            {s.bullets.map((it, i) => (<li key={`bul-${i}`}>{it}</li>))}
          </ul>
        </div>
      )}
      {!!s.rationale && (
        <div className="md:col-span-2 rounded-xl border border-blue-200 bg-blue-50/60 p-3">
          <div className="flex items-center gap-2 text-blue-900 font-semibold mb-1">
            <Info className="h-4 w-4"/> Rationale
          </div>
          <p className="text-blue-900/90 text-sm whitespace-pre-wrap leading-relaxed">{s.rationale}</p>
        </div>
      )}
    </div>
  );
}

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

  const [coverExpand, setCoverExpand] = useState(false);
  const [improveExpand, setImproveExpand] = useState(false);

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
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-blue-100">
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
          <div className="space-y-4 mb-6">
            {"error" in matchResult ? (
              <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{matchResult.error}</div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-extrabold text-blue-900">
                    Match Score: <span className="text-emerald-700">{matchResult.score}%</span>
                  </div>
                </div>
                <SectionCard title="Match Components">
                  <ProgressRow label="Embedding" value={matchResult.components.embeddingSim} color="bg-indigo-500" />
                  <ProgressRow label="Keywords" value={matchResult.components.keywordCoverage} color="bg-emerald-500" />
                  <ProgressRow label="Rules" value={matchResult.components.ruleBonus} color="bg-sky-500" />
                </SectionCard>
                <SectionCard title="Analysis">
                  {/* Replaced markdown block with structured themed view */}
                  <AnalysisView analysis={matchResult.analysis || ""} />
                </SectionCard>
              </>
            )}
          </div>
        )}

        {coverLetter && (
          <div className="mt-6">
            <SectionCard
              icon={FileTextIcon}
              title="Generated Cover Letter"
              actions={
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs shadow-sm"
                    onClick={() => navigator.clipboard?.writeText(coverLetter)}
                  >
                    <CopyIcon className="h-4 w-4"/> Copy
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border border-blue-300 text-blue-700 bg-white/60 hover:bg-blue-50 shadow-sm"
                    onClick={() => setCoverExpand(v => !v)}
                  >
                    {coverExpand ? "Collapse" : "View full"}
                  </button>
                </div>
              }
            >
              <div className={`${coverExpand ? "max-h-[70vh]" : "max-h-64"} overflow-y-auto rounded-xl`}> 
                <div className="prose prose-sm prose-blue max-w-none leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{coverLetter}</ReactMarkdown>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {improvements && (
          <div className="mt-8">
            <SectionCard
              icon={Wand2}
              title="CV Improvements"
              actions={
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs shadow-sm"
                    onClick={() => navigator.clipboard?.writeText(improvements)}
                  >
                    <CopyIcon className="h-4 w-4"/> Copy
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border border-blue-300 text-blue-700 bg-white/60 hover:bg-blue-50 shadow-sm"
                    onClick={() => setImproveExpand(v => !v)}
                  >
                    {improveExpand ? "Collapse" : "View full"}
                  </button>
                </div>
              }
            >
              <div className={`${improveExpand ? "max-h-[70vh]" : "max-h-64"} overflow-y-auto rounded-xl`}> 
                <div className="prose prose-sm prose-blue max-w-none leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: (props) => <h3 className="text-blue-900 font-bold text-base mt-2" {...props} />,
                      h2: (props) => <h4 className="text-blue-900 font-bold text-sm mt-2" {...props} />,
                      h3: (props) => <h5 className="text-blue-900 font-semibold text-sm mt-2" {...props} />,
                      strong: (props) => <strong className="text-blue-900" {...props} />,
                      li: (props) => <li className="marker:text-blue-500" {...props} />,
                      blockquote: (props) => (
                        <blockquote className="border-l-4 border-blue-300 bg-blue-50/70 rounded px-3 py-2" {...props} />
                      ),
                      ul: (props) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                      ol: (props) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                    }}
                  >
                    {improvements}
                  </ReactMarkdown>
                </div>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
