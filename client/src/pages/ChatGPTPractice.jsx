import React, { useState, useEffect, useRef } from "react";

// Lightweight tooltip shown on hover immediately (no delay)
const InfoTip = ({ text }) => (
	<span className="relative inline-block group align-middle">
		<span
			className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold cursor-default select-none"
			aria-hidden="true"
		>
			i
		</span>
		<div
			className="absolute z-30 left-1/2 -translate-x-1/2 mt-2 w-72 max-w-xs px-3 py-2 text-[11px] leading-4 text-white bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-75"
			role="tooltip"
		>
			{text}
			<div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
		</div>
	</span>
);

const defaultPrompts = [
	{
		title: "Summarize a news article",
		prompt: "Summarize the following news article in 3 sentences: ...",
	},
	{
		title: "Explain a concept simply",
		prompt: "Explain quantum computing to a 10-year-old.",
	},
	{
		title: "Write an email",
		prompt: "Write a polite email to request a meeting with your manager.",
	},
	{
		title: "Creative story",
		prompt: "Write a short story about a robot who learns to paint.",
	},
];

export default function ChatGPTPractice() {
	const [prompts, setPrompts] = useState([...defaultPrompts]);
	const [selectedPrompt, setSelectedPrompt] = useState(null);
	const [userInput, setUserInput] = useState("");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);
	const [history, setHistory] = useState([]); // {prompt, response, date}
	const [favoritePrompts, setFavoritePrompts] = useState([]);
	const [customPrompt, setCustomPrompt] = useState("");
	const [showStats, setShowStats] = useState(false);

	// --- Restore Mini Quiz State ---
	const quizQuestions = [
		{
			q: "Which of the following is an example of ethical AI use?",
			options: [
				"Sharing private user data without consent",
				"Checking the accuracy of AI-generated content",
				"Creating harmful or discriminatory outputs",
			],
			answer: 1,
		},
		{
			q: "What should you do if AI gives a suspicious answer?",
			options: [
				"Share it immediately",
				"Trust it without question",
				"Verify the information from reliable sources",
			],
			answer: 2,
		},
	];
	const [quizStep, setQuizStep] = useState(0);
	const [quizAnswers, setQuizAnswers] = useState([]);
	const [quizShowResult, setQuizShowResult] = useState(false);

	// --- New: Model & sampling controls ---
	const [model, setModel] = useState("gemini-2.5-flash");
	const [temperature, setTemperature] = useState(0.5);
	const [topP, setTopP] = useState(0.9);

	// --- New: Context state (uploaded or manual) ---
	const [contextItems, setContextItems] = useState([]); // {name, sourceId, excerpt}
	const [contextManual, setContextManual] = useState("");
	// New: auto company research
	const [autoResearch, setAutoResearch] = useState(true);
	const [company, setCompany] = useState("");
	const [manualCompany, setManualCompany] = useState(false); // user manually edited company

	// Helper: detect company name from free text
	const detectCompanyFromText = (text) => {
		const t = (text || "").trim();
		if (!t) return "";
		const patterns = [
			/\b(?:at|to|regarding|about|for)\s+([A-Z][A-Za-z0-9&'().,-]*(?:\s+[A-Z][A-Za-z0-9&'().,-]*){0,3})/g,
			/\bDear\s+([A-Z][A-Za-z0-9&'().,-]*(?:\s+[A-Z][A-Za-z0-9&'().,-]*){0,3})/g,
			/\bSubject:\s.*?\b(?:at|to)\s+([A-Z][A-Za-z0-9&'().,-]*(?:\s+[A-Z][A-ZaZ0-9&'().,-]*){0,3})/g,
		];
		for (const re of patterns) {
			const m = re.exec(t);
			if (m && m[1]) {
				const candidate = m[1].trim().replace(/[.,]$/, "");
				const lw = candidate.toLowerCase();
				if (!/(hiring manager|recruiting team|human resources|recruiting|hr team|team|manager)/.test(lw)) {
					return candidate;
				}
			}
		}
		return "";
	};

	// STT/TTS support
	const [canSTT, setCanSTT] = useState(false);
	const [canTTS, setCanTTS] = useState(false);
	const [isListening, setIsListening] = useState(false);
	const recognitionRef = useRef(null);
	// Track TTS state
	const [isSpeaking, setIsSpeaking] = useState(false);

	useEffect(() => {
		const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
		setCanSTT(!!SR);
		setCanTTS(typeof window !== 'undefined' && 'speechSynthesis' in window);
		if (SR) {
			const rec = new SR();
			rec.lang = 'en-US';
			rec.interimResults = true;
			rec.maxAlternatives = 1;
			rec.onresult = (e) => {
				let txt = '';
				for (let i = e.resultIndex; i < e.results.length; i++) {
					txt += e.results[i][0].transcript;
				}
				// append to current input
				setUserInput((prev) => (prev ? `${prev} ${txt}` : txt));
			};
			rec.onend = () => setIsListening(false);
			rec.onerror = () => setIsListening(false);
			recognitionRef.current = rec;
		}
		return () => {
			try { if (recognitionRef.current) recognitionRef.current.stop(); } catch { /* ignore */ }
		};
	}, []);

	const toggleMic = () => {
		const rec = recognitionRef.current;
		if (!rec) return;
		if (isListening) {
			try { rec.stop(); } catch { /* ignore */ }
			setIsListening(false);
		} else {
			try { rec.start(); setIsListening(true); } catch { /* ignore */ }
		}
	};

	// Start reading the response aloud
	const speakResponse = () => {
		if (!canTTS || !response) return;
		try {
			window.speechSynthesis.cancel();
			const utt = new SpeechSynthesisUtterance(response);
			utt.lang = 'en-US';
			utt.onstart = () => setIsSpeaking(true);
			utt.onend = () => setIsSpeaking(false);
			utt.onerror = () => setIsSpeaking(false);
			window.speechSynthesis.speak(utt);
		} catch { /* ignore */ }
	};

	// Stop reading aloud
	const stopSpeaking = () => {
		try { window.speechSynthesis.cancel(); setIsSpeaking(false); } catch { /* ignore */ }
	};

	const handleQuizOption = (idx) => {
		if (quizShowResult) return;
		setQuizAnswers((prev) => {
			const next = [...prev];
			next[quizStep] = idx;
			return next;
		});
	};
	const handleQuizNext = () => {
		if (quizStep < quizQuestions.length - 1) {
			setQuizStep((s) => s + 1);
		} else {
			setQuizShowResult(true);
		}
	};
	const handleQuizRestart = () => {
		setQuizStep(0);
		setQuizAnswers([]);
		setQuizShowResult(false);
	};

	const handlePromptClick = (prompt) => {
		setSelectedPrompt(prompt);
		setUserInput(prompt.prompt);
		setResponse("");
	};

	// Heuristic extraction of profile fields from uploaded resume context
	const extractProfileFromContext = (items) => {
		const all = (items || []).map((i) => i.excerpt || "").join("\n").slice(0, 10000);
		if (!all) return {};
		const emailMatch = all.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
		const phoneMatch = all.match(/\+?\d[\d\s().-]{7,}/);
		const linkedinMatch = all.match(/https?:[/]{2}(?:[\w.-]*linkedin\.com)[/][\w/.?=&%-]+/i);
		// First non-link generic URL as portfolio/site (avoid linkedin)
		let portfolioMatch = null;
		const urlRegex = /https?:[/]{2}(?![\w.-]*linkedin\.com)[\w.-]+\.[a-z]{2,}(?:[/][\w/.?=&%-]*)?/ig;
		const urls = all.match(urlRegex);
		if (urls && urls.length) portfolioMatch = urls[0];
		// Guess name from first few lines that look like a name
		let name = "";
		const firstLines = all.split(/\n+/).slice(0, 6).map((l) => l.trim()).filter(Boolean);
		for (const line of firstLines) {
			if (/@|education|experience|skills|profile|summary|projects|certification/i.test(line)) continue;
			const clean = line.replace(/[^A-Za-z\s'-]/g, " ").replace(/\s+/g, " ").trim();
			const words = clean.split(" ");
			if (words.length >= 2 && words.length <= 5 && words.every((w) => /[A-Za-z'-]{2,}/.test(w))) {
				name = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
				break;
			}
		}
		// New: detect explicit years-of-experience claims in the resume text
		let years = null;
		const yearsMatch = all.match(/(\d+)\s*\+?\s*(?:years|yrs)\s+(?:of\s+)?(?:experience|exp)\b/i);
		if (yearsMatch) {
			years = parseInt(yearsMatch[1], 10);
		}
		return {
			name,
			email: emailMatch?.[0] || "",
			phone: phoneMatch?.[0]?.trim() || "",
			linkedin: linkedinMatch?.[0] || "",
			portfolio: portfolioMatch || "",
			years,
		};
	};

	const handleSubmit = async () => {
		setLoading(true);
		setResponse("");
		try {
			const inferredCompany = (company && company.trim()) || detectCompanyFromText(userInput) || "";
			const sys = `You are Gemini, a helpful AI assistant.
- The Context block contains the candidate's resume. Treat it as provided. Do NOT ask for the resume again. Use only facts from it for personal details (name, degree(s), years of experience, core skills, notable companies/roles, key achievements). Do not invent.
- Never fabricate years of experience. Only mention a number of years if it appears explicitly in Context. If not present, use early-career phrasing (e.g., “through coursework, projects, and internships”).
- Always use the candidate's real name from Context for the signature; do not replace it with an example name.
- If "Company Research" is provided or a target company is specified, reflect accurately what the company does (products, domain, mission) and tailor the message accordingly.
- For open-positions outreach emails: include a concise subject, 120–160 words body, one sentence on motivation, 3–5 CV‑grounded skills/technologies, and suggest 2–3 relevant role areas/teams that fit the candidate’s background (e.g., Backend, Web, Data, Platform). Avoid placeholders; write concrete text.`;

			// Build context payload and inject target company as a small explicit item so the model sees it
			const payloadContext = [...contextItems];
			if (inferredCompany) {
				payloadContext.unshift({ name: "Target Company", sourceId: "target-company", excerpt: `Target Company: ${inferredCompany}` });
			}

			// Use lower temperature for email-like tasks for reliability
			const isEmailTask = /\b(email|cover letter|open position|outreach)\b/i.test(userInput);
			const tempToUse = isEmailTask ? Math.min(0.4, Number(temperature) || 0.5) : Number(temperature);

			async function askOnce(extraInstruction = "") {
				const body = {
					prompt: extraInstruction ? `${userInput}\n\n${extraInstruction}` : userInput,
					system: sys,
					temperature: Number.isFinite(tempToUse) ? tempToUse : 0.5,
					top_p: Number(topP),
					model,
					context: payloadContext,
					autoResearch,
					company: inferredCompany || undefined,
				};
				const res = await fetch("/ml/chat/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
				if (!res.ok) throw new Error("Gemini response failed");
				const data = await res.json();
				return data.text || "";
			}

			let text = await askOnce();

			// If model incorrectly asks for resume despite context, re-ask with explicit directive
			if (payloadContext.length > 0 && /\b(provide|need|share).{0,40}(resume|cv)\b/i.test(text)) {
				text = await askOnce("Draft the outreach email now using the Context (candidate resume) and Company Research above. Do not ask for the resume; it is already provided.");
			}

			if (!text) text = "No response received.";

			// Replace placeholders from CV and company and sanitize hallucinated details
			const profile = extractProfileFromContext(contextItems);
			const replacements = [
				{ k: /\[Your Full Name\]/gi, v: profile.name },
				{ k: /\[Your Name\]/gi, v: profile.name },
				{ k: /\[Your Phone Number\]/gi, v: profile.phone },
				{ k: /\[Your Email Address\]/gi, v: profile.email },
				{ k: /\[Your LinkedIn Profile URL \(Optional, but recommended\)\]/gi, v: profile.linkedin },
				{ k: /\[Your Portfolio\/Website \(Optional, if applicable\)\]/gi, v: profile.portfolio },
				{ k: /\[Company Name\]/gi, v: inferredCompany },
				{ k: /\[Company\]/gi, v: inferredCompany },
				{ k: /\bCompany Name\b/gi, v: inferredCompany },
			];
			replacements.forEach(({ k, v }) => { if (v) { text = text.replace(k, v); } });

			// Normalize greeting variants
			if (inferredCompany) {
				text = text
					.replace(/Dear\s*\[[^\]]*Hiring[^\]]*\][,:]?/gi, `Dear Hiring Team at ${inferredCompany},`)
					.replace(/Dear\s*\[[^\]]*Manager[^\]]*\][,:]?/gi, `Dear Hiring Team at ${inferredCompany},`)
					.replace(/Dear\s*\[[^\]]+\][,:]?/gi, `Dear Hiring Team at ${inferredCompany},`)
					.replace(/\b\[Company Name\]\b/gi, inferredCompany);
			} else {
				text = text.replace(/Dear\s*\[[^\]]+\][,:]?/gi, `Dear Hiring Team,`);
			}

			// Broaden cleanup: remove bracketed examples like [e.g., ...] or slash lists
			text = text.replace(/\[(?:e\.g\.|i\.e\.).*?\]/gi, "").replace(/\[[^\]]*\/[^\]]*\]/g, "");
			// Keep earlier guidance cleanup
			text = text.replace(/\[[^\]]*(optional|mention|if known)[^\]]*\]/gi, "");

			// Remove sentences claiming an attached resume
			text = text.replace(/I (?:have\s)?attached my (?:resume|CV)[^.?!]*[.?!]/gi, "");

			// If resume doesn't state years explicitly, strip claims like "5+ years of experience"
			if (!profile.years) {
				const parts = text.split(/(?<=[.!?])\s+/);
				text = parts.filter((s) => !/\b\d+\s*\+?\s*(?:years|yrs)\b/i.test(s)).join(" ");
			}

			// Normalize signature to use the real candidate name
			if (profile.name) {
				text = text
					.replace(/(Best regards|Kind regards|Regards|Sincerely)[,]?\s*(?:\n|\s)*[A-Z][A-Za-z' -]+(?:\s+[A-Z][A-Za-z' -]+){0,3}\s*$/i, `$1,\n${profile.name}`)
					.replace(/(Best regards|Kind regards|Regards|Sincerely)[,]?\s*$/i, `$1,\n${profile.name}`)
					.replace(/(Best regards|Kind regards|Regards|Sincerely)[,]?\s+[A-Z][A-Za-z' -]+(?:\s+[A-Z][A-ZaZ' -]+){0,3}/gi, `$1, ${profile.name}`);
				if (!/\n\s*(Best regards|Kind regards|Regards|Sincerely)/i.test(text)) {
					text += `\n\nBest regards,\n${profile.name}`;
				}
			}

			// Ensure subject contains company if known
			if (inferredCompany) {
				const hasSubject = /^(Subject:\s*)(.*)$/im.test(text);
				if (hasSubject) {
					text = text.replace(/^(Subject:\s*)(.*)$/im, (m, p1, p2) => p2.includes(inferredCompany) ? m : `${p1}Inquiry Regarding Open Positions at ${inferredCompany}`);
				} else {
					text = `Subject: Inquiry Regarding Open Positions at ${inferredCompany}\n\n${text}`;
				}
			}

			text = text.replace(/\s{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
			setResponse(text);
			setHistory((prev) => [ { prompt: userInput, response: text, date: new Date().toLocaleString() }, ...prev ]);
		} catch {
			setResponse("AI response could not be retrieved.");
		}
		setLoading(false);
	};

	// Add custom prompt
	const handleAddCustomPrompt = () => {
		if (!customPrompt.trim()) return;
		setPrompts((prev) => [{ title: "Custom", prompt: customPrompt }, ...prev]);
		setCustomPrompt("");
		setSelectedPrompt({ title: "Custom", prompt: customPrompt });
		setUserInput(customPrompt);
	};

	// Favorite prompt toggle
	const toggleFavorite = (p) => {
		setFavoritePrompts((prev) =>
			prev.includes(p)
				? prev.filter((fav) => fav !== p)
				: [...prev, p]
		);
	};

	// Share prompt/response
	const handleShare = (item) => {
		const text = `Prompt: ${item.prompt}\n\nGPT Response: ${item.response}`;
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text);
			alert("Copied to clipboard!");
		}
	};

	// Stats
	const totalPrompts = history.length;
	const avgResponseLength = totalPrompts
		? Math.round(
				history.reduce((acc, h) => acc + (h.response?.length || 0), 0) /
					totalPrompts
		  )
		: 0;
	const lastPrompted = history[0]?.date;

	// New: Upload handler (PDF/TXT) → extract text → add to context
	const handleFileUpload = async (file) => {
		if (!file) return;
		const fd = new FormData();
		fd.append("file", file);
		try {
			const res = await fetch("/ml/resume/extract-text", { method: "POST", body: fd });
			const data = await res.json();
			if (data?.text) {
				setContextItems((prev) => [
					{ name: file.name, sourceId: Date.now().toString(), excerpt: data.text.slice(0, 6000) },
					...prev,
				]);
			} else {
				alert(data?.detail || "Failed to extract text from file");
			}
		} catch {
			alert("Upload failed");
		}
	};

	const removeContextItem = (sourceId) => {
		setContextItems((prev) => prev.filter((c) => c.sourceId !== sourceId));
	};

	const addManualContext = () => {
		if (!contextManual.trim()) return;
		setContextItems((prev) => [
			{ name: "Manual", sourceId: Date.now().toString(), excerpt: contextManual.trim() },
			...prev,
		]);
		setContextManual("");
	};

	const clearContext = () => setContextItems([]);
	const resetSampling = () => { setTemperature(0.5); setTopP(0.9); };

	// Try to detect company name from the user's prompt when autoResearch is on
	useEffect(() => {
		if (!autoResearch || manualCompany) return;
		const found = detectCompanyFromText(userInput);
		if (found) setCompany((prev) => prev || found);
	}, [userInput, autoResearch, manualCompany]);

	return (
		<div className="flex flex-col md:flex-row w-full min-h-[80vh] bg-gradient-to-br from-blue-50 to-green-50">
			{/* Sidebar: Quiz & Info */}
			<aside className="md:w-1/3 w-full md:max-w-sm p-4 md:sticky md:top-8 flex-shrink-0">
				<div className="space-y-6">
					{/* New: Context uploader */}
					<div className="bg-white border border-blue-200 rounded-2xl shadow p-5">
						<h3 className="font-bold text-blue-900 mb-2 text-lg">Add context (PDF/TXT)</h3>
						<input
							type="file"
							accept=".pdf,.txt"
							onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
							className="block w-full text-sm text-blue-900 bg-white file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
						/>
						<textarea
							className="mt-2 w-full border border-blue-200 rounded p-2 text-sm bg-white text-blue-900 placeholder:text-blue-400"
							rows={3}
							placeholder="Or paste context here..."
							value={contextManual}
							onChange={(e) => setContextManual(e.target.value)}
						/>
						<div className="flex items-center justify-between mt-2">
							<button onClick={addManualContext} className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold">Add</button>
							<button onClick={clearContext} className="text-xs px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Clear</button>
						</div>
						{contextItems.length > 0 && (
							<div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
								{contextItems.map((c) => (
									<div key={c.sourceId} className="border border-blue-100 rounded p-2 text-xs text-blue-900 bg-blue-50">
										<div className="flex justify-between mb-1">
											<span className="font-semibold">{c.name || c.sourceId}</span>
											<button className="text-blue-600 hover:underline" onClick={() => removeContextItem(c.sourceId)}>Remove</button>
										</div>
										<div className="line-clamp-3 whitespace-pre-wrap">{c.excerpt.slice(0, 300)}{c.excerpt.length>300?'…':''}</div>
									</div>
								))}
							</div>
						)}
						{/* New: Company research controls */}
						<div className="mt-3 border-t border-blue-100 pt-3">
							<label className="flex items-center gap-2 text-sm text-blue-900">
								<input type="checkbox" checked={autoResearch} onChange={(e)=>{ setAutoResearch(e.target.checked); }} />
								<span>Research company automatically (Wikipedia)</span>
							</label>
							<input
								type="text"
								placeholder="Company name (optional) — detected from your prompt if left blank"
								value={company}
								onChange={(e)=>{ setCompany(e.target.value); setManualCompany(true); }}
								className="mt-2 w-full border border-blue-200 rounded p-2 text-sm bg-white text-blue-900 placeholder:text-blue-400"
							/>
							<div className="text-[11px] text-blue-500 mt-1">You can also type the company directly into your prompt (e.g., “Write an email to {company || 'Zendesk'}”).</div>
						</div>
					</div>

					{/* Quiz Card */}
					<div className="bg-white border border-blue-200 rounded-2xl shadow p-5">
						<h3 className="font-bold text-blue-900 mb-2 text-lg flex items-center gap-2">
							<span>🧠</span> Ethical and Safe AI Use
						</h3>
						<div className="mb-2 text-blue-800 text-sm">
							Test your basic knowledge of ethical AI use with the mini quiz
							below.
						</div>
						<div className="bg-blue-50 rounded p-3 border border-blue-100">
							{!quizShowResult ? (
								<>
									<div className="font-semibold text-blue-900 mb-2">
										{quizQuestions[quizStep].q}
									</div>
									<div className="space-y-2 mb-2">
										{quizQuestions[quizStep].options.map((opt, idx) => (
											<button
												key={idx}
												className={`block w-full text-left px-4 py-2 rounded border transition font-medium
                        ${
							quizAnswers[quizStep] === idx
								? idx === quizQuestions[quizStep].answer
									? "bg-green-200 border-green-400 text-green-900"
									: "bg-red-200 border-red-400 text-red-900"
								: "bg-white border-blue-200 text-blue-900 hover:bg-blue-100"
						}
                      `}
												onClick={() => handleQuizOption(idx)}
												disabled={quizAnswers[quizStep] !== undefined}
											>
												{opt}
											</button>
										))}
									</div>
									{quizAnswers[quizStep] !== undefined && (
										<div className="flex justify-between items-center mt-2">
											<span className="text-sm font-semibold">
												{quizAnswers[quizStep] === quizQuestions[quizStep].answer
													? "Correct!"
													: "Incorrect."}
											</span>
											<button
												className="text-xs px-3 py-1 rounded bg-blue-200 text-blue-900 hover:bg-blue-300 font-semibold"
												onClick={handleQuizNext}
											>
												{quizStep < quizQuestions.length - 1
													? "Next Question"
													: "Show Results"}
											</button>
										</div>
									)}
								</>
							) : (
								<div className="text-center">
									<div className="font-semibold text-blue-900 mb-2">
										Quiz Result
									</div>
									<div className="mb-2 text-blue-800">
										{`Correct answers: ${quizAnswers.filter((a, i) => a === quizQuestions[i].answer).length} / ${quizQuestions.length}`}
									</div>
									<button
										className="text-xs px-3 py-1 rounded bg-blue-200 text-blue-900 hover:bg-blue-300 font-semibold"
										onClick={handleQuizRestart}
									>
										Try Again
									</button>
								</div>
							)}
						</div>
					</div>
					{/* Creative Digital Skills Info Card */}
					<div className="bg-white border border-green-200 rounded-2xl shadow p-5">
						<h3 className="font-bold text-green-900 mb-2 text-lg flex items-center gap-2">
							<span>💡</span> Creative Digital Skills
						</h3>
						<ul className="list-disc pl-5 text-green-900 text-sm">
							<li>
								No-code Chatbot: Create your own chatbot scenarios with prompts.
							</li>
							<li>
								Prompt Engineering: Write clear, concise, and creative prompts
								for better results.
							</li>
						</ul>
					</div>
					{/* Workshop & Certificate Info Card */}
					<div className="bg-white border border-yellow-200 rounded-2xl shadow p-5">
						<h3 className="font-bold text-yellow-900 mb-2 text-lg flex items-center gap-2">
							<span>🏆</span> Hands-on Workshops & Mini Tests
						</h3>
						<ul className="list-disc pl-5 text-yellow-900 text-sm">
							<li>Workshop: Practice using the example prompts below.</li>
							<li>Mini Test: You can start the ethics quiz above.</li>
							<li>
								Certificate: Earn a digital certificate after completing all
								exercises.
							</li>
						</ul>
					</div>
				</div>
			</aside>
			{/* Main Practice Area */}
			<main className="flex-1 p-4 md:p-10">
				<div className="max-w-3xl mx-auto">
					<div className="flex items-center justify-between mb-6">
						<h2 className="font-bold text-2xl text-blue-900">Gemini Practice</h2>
					</div>

					{/* New: Model & sampling controls */}
					<div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div>
							<label className="text-xs text-blue-700">Model</label>
							<select value={model} onChange={(e) => setModel(e.target.value)} className="w-full border border-blue-200 rounded px-2 py-1 text-blue-900 bg-white focus:outline-blue-400">
								<option value="gemini-2.5-flash">gemini-2.5-flash</option>
								<option value="gemini-2.5-pro">gemini-2.5-pro</option>
								<option value="gemini-1.5-flash">gemini-1.5-flash</option>
								<option value="gemini-1.5-pro">gemini-1.5-pro</option>
							</select>
						</div>
						<div>
							<label htmlFor="temperature" className="text-xs text-blue-700 inline-flex items-center gap-1">
								Temperature ({temperature}) <InfoTip text={"Controls the creativity/randomness of outputs. Near 0 = more deterministic and consistent; near 1 = more creative and varied. Suggested: factual tasks 0–0.3, creative writing 0.7–1.0."} />
							</label>
							<input
								id="temperature"
								type="range"
								min={0}
								max={1}
								step={0.1}
								value={temperature}
								onChange={(e)=>setTemperature(Number(e.target.value))}
								className="w-full accent-blue-600"
							/>
						</div>
						<div>
							<label htmlFor="topP" className="text-xs text-blue-700 inline-flex items-center gap-1">
								Top‑p ({topP}) <InfoTip text={"Top‑p (nucleus sampling): Choose from the most likely tokens until the cumulative probability reaches p. 0.8–0.95 is a balanced range; 1.0 is freer, 0.7 is more constrained."} />
							</label>
							<input
								id="topP"
								type="range"
								min={0}
								max={1}
								step={0.1}
								value={topP}
								onChange={(e)=>setTopP(Number(e.target.value))}
								className="w-full accent-blue-600"
							/>
						</div>
						<div className="sm:col-span-3 flex justify-end">
							<button onClick={resetSampling} className="text-xs px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Reset</button>
						</div>
					</div>

					{/* Add custom prompt */}
					<div className="mb-4 flex gap-2">
						<input
							type="text"
							className="border border-blue-200 bg-white rounded-lg px-3 py-2 flex-1 text-blue-900 placeholder:text-blue-400 focus:outline-blue-400"
							placeholder="Add your own prompt..."
							value={customPrompt}
							onChange={(e) => setCustomPrompt(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAddCustomPrompt()}
						/>
						<button
							className="bg-gradient-to-r from-blue-400 to-green-300 hover:from-blue-500 hover:to-green-400 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
							onClick={handleAddCustomPrompt}
						>
							Add
						</button>
					</div>
					{/* Prompts */}
					<div className="mb-6">
						<div className="font-semibold text-blue-800 mb-2">
							Try an example prompt:
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{prompts.map((ex, idx) => (
								<button
									key={idx}
									className={`rounded-lg px-4 py-3 text-left shadow font-medium transition border border-blue-200 hover:bg-blue-100 ${
										selectedPrompt === ex ? "bg-blue-200" : "bg-white"
									}`}
									onClick={() => handlePromptClick(ex)}
								>
									<div className="flex items-center justify-between">
										<span className="text-blue-700">{ex.title}</span>
										<button
											type="button"
											className={`ml-2 px-2 py-1 rounded text-xs ${
												favoritePrompts.includes(ex.prompt)
													? "bg-yellow-300 text-yellow-900"
													: "bg-blue-100 text-blue-900 hover:bg-yellow-100"
											}`}
											onClick={(e) => {
												e.stopPropagation();
												toggleFavorite(ex.prompt);
											}}
											title="Add to favorites"
										>
											★
										</button>
									</div>
									<div className="text-xs text-blue-400 mt-1">
										{ex.prompt.slice(0, 40)}...
									</div>
								</button>
							))}
						</div>
					</div>
					{/* User Input */}
					<textarea
						className="border border-blue-200 bg-white p-3 mb-3 w-full rounded-lg focus:outline-blue-400 text-base resize-none placeholder:text-blue-400 text-blue-900"
						rows={4}
						placeholder="Type your prompt here..."
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
					/>
					<div className="flex items-center justify-between mb-2">
						{canSTT ? (
							<button
								onClick={toggleMic}
								className={`text-xs px-3 py-1 rounded ${isListening ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} hover:opacity-90`}
								title="Voice input (speech to text)"
								aria-label="Voice input"
							>
								<span className="mr-1">🎙️</span>{isListening ? 'Stop Dictation' : 'Voice Input'}
							</button>
						) : <div />}
						<button
							className="bg-gradient-to-r from-sky-500 to-indigo-400 hover:from-sky-600 hover:to-indigo-500 text-white px-5 py-2 rounded-lg font-semibold transition shadow disabled:opacity-60"
							onClick={handleSubmit}
							disabled={loading || !userInput.trim()}
						>
							{loading ? "Asking..." : "Ask Gemini"}
						</button>
					</div>
					{/* Response */}
					<div className="mt-4 bg-white border border-blue-100 rounded-lg p-4 min-h-[60px] text-blue-900 font-medium whitespace-pre-line">
						{response}
					</div>
					{canTTS && (
						<div className="flex justify-end mt-2 gap-2">
							<button
								onClick={speakResponse}
								className="text-xs px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-60"
								title="Read the AI response aloud"
								aria-label="Read aloud"
								disabled={isSpeaking || !response}
							>
								<span className="mr-1">🔊</span>Read Aloud
							</button>
							<button
								onClick={stopSpeaking}
								className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-60"
								title="Stop reading aloud"
								aria-label="Stop reading"
								disabled={!isSpeaking}
							>
								<span className="mr-1">⏹</span>Stop
							</button>
						</div>
					)}
					{/* Stats */}
					<div className="flex justify-end mt-2">
						<button
							className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition font-semibold"
							onClick={() => setShowStats((s) => !s)}
						>
							{showStats ? "Hide Stats" : "Show Stats"}
						</button>
					</div>
					{showStats && (
						<div className="mt-2 bg-blue-100 rounded-lg p-4 text-blue-900 text-sm">
							<div>
								<b>Total Prompts:</b> {totalPrompts}
							</div>
							<div>
								<b>Average Response Length:</b> {avgResponseLength} chars
							</div>
							<div>
								<b>Last Prompted:</b> {lastPrompted || "-"}
							</div>
							<div>
								<b>Favorite Prompts:</b> {favoritePrompts.length}
							</div>
						</div>
					)}
					{/* History */}
					<div className="mt-8">
						<div className="font-semibold text-blue-800 mb-2">
							Prompt & Response History
						</div>
						{history.length === 0 && (
							<div className="text-blue-400">No prompts yet.</div>
						)}
						<div className="space-y-3 max-h-56 overflow-y-auto">
							{history.map((item, idx) => (
								<div
									key={idx}
									className="bg-white border border-blue-100 rounded-lg p-3 text-blue-900"
								>
									<div className="text-xs text-blue-400 mb-1">
										{item.date}
									</div>
									<div className="font-semibold mb-1">
										Prompt: {item.prompt}
									</div>
									<div className="mb-1">
										<b>GPT Response:</b> {item.response}
									</div>
									<div className="flex gap-2 mt-1">
										<button
											className="text-xs text-blue-500 underline"
											onClick={() => handleShare(item)}
										>
											Share
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
					{/* Favorite Prompts */}
					{favoritePrompts.length > 0 && (
						<div className="mt-8">
							<div className="font-semibold text-yellow-700 mb-2">
								Favorite Prompts
							</div>
							<ul className="list-disc pl-6 text-blue-900">
								{favoritePrompts.map((q, i) => (
									<li key={i}>{q}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
