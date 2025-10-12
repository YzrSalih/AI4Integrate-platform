import React, { useState, useRef } from "react";
import { Upload, Gauge, FileText as FileTextIcon, Wand2, Copy as CopyIcon, CheckCircle2, AlertTriangle, Tag as TagIcon, Lightbulb, Info, FilePenLine as FilePenIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";

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
            {s.strengths.map((it, i) => (
              <li key={`str-${i}`} className="marker:text-emerald-500">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: (props) => <span {...props} />,
                    strong: (props) => <strong className="font-semibold text-emerald-900" {...props} />,
                    em: (props) => <em className="text-emerald-900/90" {...props} />,
                  }}
                >
                  {it}
                </ReactMarkdown>
              </li>
            ))}
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
              <span key={`kw-${i}`} className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs border border-sky-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: (props) => <span {...props} />,
                    strong: (props) => <strong className="font-semibold text-sky-800" {...props} />,
                    em: (props) => <em className="text-sky-800/90" {...props} />,
                  }}
                >
                  {k}
                </ReactMarkdown>
              </span>
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

// --- New: Blue themed Cover Letter view for consistent styling ---
function CoverLetterView({ text = "" }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
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
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// --- New: Parse and themed render for Improvements ---
function parseImprovementsSections(text = "") {
  const out = { suggestions: [], keywords: [], formatting: [] };
  const lines = text.split(/\r?\n/);
  let section = "";
  const isHeading = (s) => /^(\*\*|#+)?\s*(improvements|suggestions|missing keywords|keywords to add|keywords|formatting tips|formatting|style|layout|presentation|ats tips)\s*(\*\*|:)?\s*$/i.test(s.trim());
  const isListMarker = (s) => /^(?:[-*•]\s|\d+[)\s.])/i.test(s.trim());
  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (isHeading(line)) {
      const key = line.toLowerCase();
      if (/(improvements|suggestions)/.test(key)) section = "suggestions";
      else if (/(missing keywords|keywords to add|keywords|ats)/.test(key)) section = "keywords";
      else if (/(formatting|style|layout|presentation)/.test(key)) section = "formatting";
      continue;
    }
    const content = line.replace(/^[-*•]\s?/, "");
    if (section === "suggestions") {
      out.suggestions.push(content);
    } else if (section === "keywords") {
      // Merge continuation lines (non-bulleted) into previous keyword item to avoid separate colored chips
      if (out.keywords.length && !isListMarker(raw)) {
        out.keywords[out.keywords.length - 1] = `${out.keywords[out.keywords.length - 1]} ${content}`.trim();
      } else {
        // Split only by commas, bullets or pipes (avoid splitting by multiple spaces)
        const parts = content.split(/,|\u2022|\|/).map((s) => s.trim()).filter(Boolean);
        if (parts.length > 1) out.keywords.push(...parts); else out.keywords.push(content);
      }
    } else if (section === "formatting") {
      out.formatting.push(content);
    }
  }
  return out;
}

function ImprovementsView({ text = "" }) {
  const s = parseImprovementsSections(text);
  const hasAny = s.suggestions.length || s.keywords.length || s.formatting.length;
  if (!hasAny) {
    // Fallback to styled markdown inside a blue themed panel
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
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
            {text}
          </ReactMarkdown>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {!!s.suggestions.length && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
          <div className="flex items-center gap-2 text-indigo-800 font-semibold mb-2">
            <Lightbulb className="h-4 w-4"/> Suggestions
          </div>
          <ul className="list-disc pl-5 space-y-1 text-indigo-900 text-sm">
            {s.suggestions.map((it, i) => (
              <li key={`sug-${i}`} className="marker:text-indigo-500">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: (props) => <span {...props} />,
                    strong: (props) => <strong className="font-semibold text-indigo-900" {...props} />,
                    em: (props) => <em className="text-indigo-900/90" {...props} />,
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
            <TagIcon className="h-4 w-4"/> Missing Keywords
          </div>
          <div className="flex flex-wrap gap-2">
            {s.keywords.slice(0, 80).map((k, i) => (
              <span key={`mkw-${i}`} className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs border border-sky-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: (props) => <span {...props} />,
                    strong: (props) => <strong className="font-semibold text-sky-800" {...props} />,
                    em: (props) => <em className="text-sky-800/90" {...props} />,
                  }}
                >
                  {k}
                </ReactMarkdown>
              </span>
            ))}
          </div>
        </div>
      )}
      {!!s.formatting.length && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 md:col-span-2">
          <div className="flex items-center gap-2 text-amber-800 font-semibold mb-2">
            <AlertTriangle className="h-4 w-4"/> Formatting Tips
          </div>
          <ul className="list-disc pl-5 space-y-1 text-amber-900 text-sm">
            {s.formatting.map((it, i) => (
              <li key={`fmt-${i}`} className="marker:text-amber-500">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
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
    </div>
  );
}

// Lightweight header/contact parser to keep personal info unchanged
function parseContactHeader(text = "") {
  const lines = (text || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const firstIdx = Math.max(0, lines.findIndex(l => /^(experience|work experience|summary|education|skills|projects|certifications|languages)\b/i.test(l)));
  const headerLines = firstIdx > 0 ? lines.slice(0, firstIdx) : lines.slice(0, Math.min(6, lines.length));
  const header = headerLines.join(" \u2022 ");
  const name = headerLines[0] || "";
  const email = (text.match(/[\w.+-]+@[^\s@]+/i) || [""])[0];
  const phone = (text.match(/\+?\d[\d()\-\s]{7,}\d/) || [""])[0];
  const linkedin = (text.match(/https?:\/\/[^\s]*linkedin[^\s)]+/i) || [""])[0];
  const github = (text.match(/https?:\/\/[^\s]*github[^\s)]+/i) || [""])[0];
  // pick first plausible location-looking token from header
  const location = (header.match(/([A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:[,\s]+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+)+)/) || [""])[0];
  return { name, email, phone, linkedin, github, header, location };
}

// Split markdown body into sections by headings
function splitSections(md = "") {
  const parts = [];
  const lines = (md || "").split(/\r?\n/);
  let cur = { title: "", body: [] };
  for (const raw of lines) {
    const m = raw.match(/^\s{0,3}#{1,6}\s+(.*)$/);
    if (m) {
      if (cur.title || cur.body.length) parts.push({ ...cur, body: cur.body.join("\n") });
      cur = { title: m[1].trim(), body: [] };
    } else {
      cur.body.push(raw);
    }
  }
  if (cur.title || cur.body.join("").trim()) parts.push({ ...cur, body: cur.body.join("\n") });
  return parts;
}

// --- New: ensure trailing periods and nicer spacing for Experience bullets ---
function ensureBulletsPeriod(md = "") {
  const lines = (md || "").split(/\r?\n/);
  const punctRe = /[.!?…]$/;
  return lines
    .map((l) => {
      const m = l.match(/^\s*([-*•])\s+(.*)$/);
      if (!m) return l;
      const bullet = m[1];
      let text = m[2].trim();
      // Append period if missing trailing punctuation
      if (text && !punctRe.test(text)) text = `${text}.`;
      return `${bullet} ${text}`;
    })
    .join("\n");
}

// Visual CV template renderer
function CVTemplate({ headerInfo, bodyMarkdown }) {
  const sections = splitSections(bodyMarkdown);
  const leftTitles = new Set(["summary", "experience", "work experience", "projects", "achievements"]);
  const rightTitles = new Set(["skills", "education", "certifications", "languages", "tools"]);
  const left = sections.filter(s => leftTitles.has((s.title || "").toLowerCase()));
  const right = sections.filter(s => rightTitles.has((s.title || "").toLowerCase()));
  const rest = sections.filter(s => !left.includes(s) && !right.includes(s));
  // Put unknown sections to left by default
  for (const s of rest) left.push(s);
  return (
    <div className="mx-auto bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
      {/* Top header */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-800 text-white p-6">
        <div className="text-2xl font-extrabold tracking-wide">{headerInfo.name || "Resume"}</div>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-blue-100/90">
          {headerInfo.location && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10">{headerInfo.location}</span>}
          {headerInfo.email && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10">{headerInfo.email}</span>}
          {headerInfo.phone && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10">{headerInfo.phone}</span>}
          {headerInfo.linkedin && <a href={headerInfo.linkedin} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20" target="_blank" rel="noreferrer">LinkedIn</a>}
          {headerInfo.github && <a href={headerInfo.github} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20" target="_blank" rel="noreferrer">GitHub</a>}
        </div>
      </div>
      {/* Two-column body (A4-ish width) */}
      <div className="grid grid-cols-3 gap-6 p-6 w-[794px]">
        <div className="col-span-2 space-y-6">
          {left.map((s, i) => {
            const isExp = ["experience", "work experience"].includes((s.title || "").toLowerCase());
            const body = isExp ? ensureBulletsPeriod(s.body) : s.body;
            return (
              <div key={`l-${i}`}>
                {s.title && <h3 className="text-sm font-bold tracking-wider text-slate-800 border-b border-slate-200 pb-1 uppercase">{s.title}</h3>}
                <div className="prose prose-sm max-w-none text-slate-800">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={
                      isExp
                        ? {
                            ul: (p) => <ul className="list-disc pl-6 space-y-2" {...p} />,
                            ol: (p) => <ol className="list-decimal pl-6 space-y-2" {...p} />,
                            li: (p) => <li className="marker:text-blue-600 leading-relaxed" {...p} />,
                          }
                        : { li: (p) => <li className="marker:text-blue-600" {...p} /> }
                    }
                  >
                    {body}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-span-1 space-y-6">
          {right.map((s, i) => (
            <div key={`r-${i}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              {s.title && <h3 className="text-xs font-bold tracking-wider text-slate-800 border-b border-slate-200 pb-1 uppercase">{s.title}</h3>}
              <div className="prose prose-sm max-w-none text-slate-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ li: (p) => <li className="marker:text-blue-600" {...p} /> }}>{s.body}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main CVBuilder component ---
export default function CVBuilder() {
  // Single-panel states
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [improvements, setImprovements] = useState("");
  const [tailored, setTailored] = useState("");

  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingCL, setLoadingCL] = useState(false);
  const [loadingImprove, setLoadingImprove] = useState(false);
  const [loadingTailor, setLoadingTailor] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [coverExpand, setCoverExpand] = useState(false);
  const [improveExpand, setImproveExpand] = useState(false);
  const [tailorExpand, setTailorExpand] = useState(false);

  // New: export target and contact
  const tailoredExportRef = useRef(null);
  const contactInfo = parseContactHeader(resumeText);

  // --- New: Header name override and Education editor state ---
  const [displayName, setDisplayName] = useState("Salih Yazar");
  const [showEduEditor, setShowEduEditor] = useState(false);
  const [eduDraft, setEduDraft] = useState("");

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

  const handleTailor = async () => {
    setLoadingTailor(true);
    setTailored("");
    try {
      const res = await fetch("/ml/resume/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jdText,
          analysis: (matchResult && matchResult.analysis) || "",
          improvements: improvements || "",
        }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok || data.error) throw new Error(data.error || "Tailor failed");
      setTailored(data.markdown || data.text || "");
    } catch (e) {
      setTailored(`Error: ${String(e.message || e)}`);
    } finally {
      setLoadingTailor(false);
    }
  };

  // Export handlers
  const handleDownloadPDF = async () => {
    if (!tailored || !tailoredExportRef.current) return;
    const htmlLen = (tailoredExportRef.current.innerHTML || "").trim().length;
    if (htmlLen < 50) {
      alert("Nothing to export. Please generate or edit your CV content first.");
      return;
    }
    const element = tailoredExportRef.current;
    const opt = {
      margin: [0.4, 0.4, 0.6, 0.4],
      filename: "Tailored-Resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };
    await html2pdf().set(opt).from(element).save();
  };

  // --- New: Utilities to get/replace a section body in markdown ---
  const getSectionBody = (md, targetTitle) => {
    const sections = splitSections(md || "");
    const s = sections.find((it) => (it.title || "").trim().toLowerCase() === (targetTitle || "").toLowerCase());
    return s ? s.body : "";
  };
  const replaceSectionBody = (md, targetTitle, newBody) => {
    const sections = splitSections(md || "");
    const updated = sections.map((it) => {
      if ((it.title || "").trim().toLowerCase() === (targetTitle || "").toLowerCase()) {
        return { ...it, body: newBody || "" };
      }
      return it;
    });
    return updated
      .map((it) => `${it.title ? `# ${it.title}\n` : ""}${it.body || ""}`)
      .join("\n");
  };

  const loadHtmlDocx = async () => {
    if (typeof window !== "undefined" && window.htmlDocx) return window.htmlDocx;
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-lib="html-docx-js"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.htmlDocx));
        existing.addEventListener("error", () => reject(new Error("Failed to load html-docx-js")));
      } else {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js";
        s.async = true;
        s.crossOrigin = "anonymous";
        s.setAttribute("data-lib", "html-docx-js");
        s.onload = () => resolve(window.htmlDocx);
        s.onerror = () => reject(new Error("Failed to load html-docx-js"));
        document.head.appendChild(s);
      }
    });
  };

  const handleDownloadDOCX = async () => {
    if (!tailored || !tailoredExportRef.current) return;
    const htmlLen = (tailoredExportRef.current.innerHTML || "").trim().length;
    if (htmlLen < 50) {
      alert("Nothing to export. Please generate or edit your CV content first.");
      return;
    }
    const htmlDocx = await loadHtmlDocx();
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #111827; }
        * { color: #111827 !important; }
        h1,h2,h3,h4,h5,h6 { color:#0f2167 !important; }
        ul { padding-left: 18px; }
        .bg-white { background: #ffffff !important; }
      </style>
    </head><body>${tailoredExportRef.current.innerHTML}</body></html>`;
    const blob = htmlDocx.asBlob(html);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Tailored-Resume.docx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
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
          <button
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow transition disabled:opacity-60"
            onClick={handleTailor}
            disabled={loadingTailor || !jdText.trim() || !resumeText.trim()}
            title="Pozisyona göre aynı formatta özelleştirilmiş CV üret"
          >
            <FilePenIcon className="h-5 w-5"/>
            {loadingTailor ? "Working..." : "Tailor CV to Role"}
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
                {/* Blue themed cover letter content */}
                <CoverLetterView text={coverLetter} />
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
                {/* Structured themed improvements with fallback */}
                <ImprovementsView text={improvements} />
              </div>
            </SectionCard>
          </div>
        )}

        {tailored && (
          <div className="mt-8">
            <SectionCard
              icon={FilePenIcon}
              title="Tailored CV (same format)"
              actions={
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs shadow-sm"
                    onClick={() => navigator.clipboard?.writeText(tailored)}
                  >
                    <CopyIcon className="h-4 w-4"/> Copy
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border border-blue-300 text-blue-700 bg-white/60 hover:bg-blue-50 shadow-sm"
                    onClick={handleDownloadPDF}
                  >
                    Download PDF
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border border-blue-300 text-blue-700 bg-white/60 hover:bg-blue-50 shadow-sm"
                    onClick={handleDownloadDOCX}
                  >
                    Download Word
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border border-blue-300 text-blue-700 bg-white/60 hover:bg-blue-50 shadow-sm"
                    onClick={() => setTailorExpand(v => !v)}
                  >
                    {tailorExpand ? "Collapse" : "View full"}
                  </button>
                </div>
              }
            >
              {/* --- New: Quick overrides panel --- */}
              <div className="mb-3 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-xs text-blue-800">Header name</label>
                  <input
                    className="px-2 py-1 text-xs rounded border border-blue-200 focus:outline-blue-400 bg-white text-blue-900 placeholder-blue-400"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={contactInfo?.name || "Salih Yazar"}
                  />
                  <button
                    className="text-xs px-2 py-1 rounded border border-blue-300 text-blue-700 bg-white/60 hover:bg-blue-50"
                    onClick={() => {
                      if (!showEduEditor) {
                        setEduDraft(getSectionBody(tailored, "education") || "");
                      }
                      setShowEduEditor((v) => !v);
                    }}
                  >
                    {showEduEditor ? "Close Education Editor" : "Edit Education"}
                  </button>
                </div>
                {showEduEditor && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-2">
                    <div className="text-xs text-blue-800 mb-1">Education (Markdown)</div>
                    <textarea
                      className="w-full min-h-[120px] text-sm p-2 rounded border border-blue-200 bg-white"
                      value={eduDraft}
                      onChange={(e) => setEduDraft(e.target.value)}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                          setTailored((prev) => replaceSectionBody(prev, "education", eduDraft));
                          setShowEduEditor(false);
                        }}
                      >
                        Apply
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-blue-300 text-blue-700 bg-white/60 hover:bg-blue-50"
                        onClick={() => setShowEduEditor(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className={`${tailorExpand ? "max-h-[90vh]" : "max-h-96"} overflow-y-auto rounded-xl bg-slate-100/50 p-4`}>
                {/* Designed CV preview */}
                <div ref={tailoredExportRef} className="bg-white mx-auto">
                  <CVTemplate headerInfo={{ ...contactInfo, name: displayName || contactInfo.name || "Salih Yazar" }} bodyMarkdown={tailored} />
                </div>
              </div>
            </SectionCard>
          </div>
        )}

      </div>
    </div>
  );
}
