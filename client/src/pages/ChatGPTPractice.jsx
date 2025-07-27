import React, { useState } from "react";

const defaultPrompts = [
  {
    title: "Summarize a news article",
    prompt: "Summarize the following news article in 3 sentences: ..."
  },
  {
    title: "Explain a concept simply",
    prompt: "Explain quantum computing to a 10-year-old."
  },
  {
    title: "Write an email",
    prompt: "Write a polite email to request a meeting with your manager."
  },
  {
    title: "Creative story",
    prompt: "Write a short story about a robot who learns to paint."
  }
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

  // Mini Quiz State (English only)
  const quizQuestions = [
    {
      q: "Which of the following is an example of ethical AI use?",
      options: [
        "Sharing private user data without consent",
        "Checking the accuracy of AI-generated content",
        "Creating harmful or discriminatory outputs"
      ],
      answer: 1
    },
    {
      q: "What should you do if AI gives a suspicious answer?",
      options: [
        "Share it immediately",
        "Trust it without question",
        "Verify the information from reliable sources"
      ],
      answer: 2
    }
  ];
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]); // [selectedIndex]
  const [quizShowResult, setQuizShowResult] = useState(false);

  const handleQuizOption = idx => {
    if (quizShowResult) return;
    setQuizAnswers(prev => {
      const next = [...prev];
      next[quizStep] = idx;
      return next;
    });
  };
  const handleQuizNext = () => {
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(s => s + 1);
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

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are ChatGPT, a helpful AI assistant." },
            { role: "user", content: userInput }
          ]
        })
      });
      if (!res.ok) throw new Error("AI response failed");
      const data = await res.json();
      const gptResponse = data.choices?.[0]?.message?.content || "No response received.";
      setResponse(gptResponse);
      setHistory(prev => [
        {
          prompt: userInput,
          response: gptResponse,
          date: new Date().toLocaleString()
        },
        ...prev
      ]);
    } catch {
      setResponse("AI response could not be retrieved.");
    }
    setLoading(false);
  };

  // Add custom prompt
  const handleAddCustomPrompt = () => {
    if (!customPrompt.trim()) return;
    setPrompts(prev => [
      { title: "Custom", prompt: customPrompt },
      ...prev
    ]);
    setCustomPrompt("");
    setSelectedPrompt({ title: "Custom", prompt: customPrompt });
    setUserInput(customPrompt);
  };

  // Favorite prompt toggle
  const toggleFavorite = (p) => {
    setFavoritePrompts(prev =>
      prev.includes(p)
        ? prev.filter(fav => fav !== p)
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
  const avgResponseLength = totalPrompts ? Math.round(history.reduce((acc, h) => acc + (h.response?.length || 0), 0) / totalPrompts) : 0;
  const lastPrompted = history[0]?.date;

return (
  <div className="flex flex-col md:flex-row w-full min-h-[80vh] bg-gradient-to-br from-blue-50 to-green-50">
    {/* Sidebar: Quiz & Info */}
    <aside className="md:w-1/3 w-full md:max-w-sm p-4 md:sticky md:top-8 flex-shrink-0">
      <div className="space-y-6">
        {/* Quiz Card */}
        <div className="bg-white border border-blue-200 rounded-2xl shadow p-5">
          <h3 className="font-bold text-blue-900 mb-2 text-lg flex items-center gap-2">
            <span>🧠</span> Ethical and Safe AI Use
          </h3>
          <div className="mb-2 text-blue-800 text-sm">
            Test your basic knowledge of ethical AI use with the mini quiz below.
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
                        ${quizAnswers[quizStep] === idx
                          ? idx === quizQuestions[quizStep].answer
                            ? 'bg-green-200 border-green-400 text-green-900'
                            : 'bg-red-200 border-red-400 text-red-900'
                          : 'bg-white border-blue-200 text-blue-900 hover:bg-blue-100'}
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
                <div className="font-semibold text-blue-900 mb-2">Quiz Result</div>
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
            <li>No-code Chatbot: Create your own chatbot scenarios with prompts.</li>
            <li>Prompt Engineering: Write clear, concise, and creative prompts for better results.</li>
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
            <li>Certificate: Earn a digital certificate after completing all exercises.</li>
          </ul>
        </div>
      </div>
    </aside>
    {/* Main Practice Area */}
    <main className="flex-1 p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-2xl text-blue-900">ChatGPT Practice</h2>
        </div>
        {/* Add custom prompt */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            className="border border-blue-200 bg-white rounded-lg px-3 py-2 flex-1 text-blue-900 placeholder:text-blue-400 focus:outline-blue-400"
            placeholder="Add your own prompt..."
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustomPrompt()}
          />
          <button
            className="bg-gradient-to-r from-blue-400 to-green-300 hover:from-blue-500 hover:to-green-400 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
            onClick={handleAddCustomPrompt}
          >Add</button>
        </div>
        {/* Prompts */}
        <div className="mb-6">
          <div className="font-semibold text-blue-800 mb-2">Try an example prompt:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prompts.map((ex, idx) => (
              <button
                key={idx}
                className={`rounded-lg px-4 py-3 text-left shadow font-medium transition border border-blue-200 hover:bg-blue-100 ${selectedPrompt === ex ? 'bg-blue-200' : 'bg-white'}`}
                onClick={() => handlePromptClick(ex)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">{ex.title}</span>
                  <button
                    type="button"
                    className={`ml-2 px-2 py-1 rounded text-xs ${favoritePrompts.includes(ex.prompt) ? 'bg-yellow-300 text-yellow-900' : 'bg-blue-100 text-blue-900 hover:bg-yellow-100'}`}
                    onClick={e => { e.stopPropagation(); toggleFavorite(ex.prompt); }}
                    title="Add to favorites"
                  >★</button>
                </div>
                <div className="text-xs text-blue-400 mt-1">{ex.prompt.slice(0, 40)}...</div>
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
          onChange={e => setUserInput(e.target.value)}
        />
        <div className="flex justify-end mb-2">
          <button
            className="bg-gradient-to-r from-blue-400 to-green-300 hover:from-blue-500 hover:to-green-400 text-white px-5 py-2 rounded-lg font-semibold transition shadow disabled:opacity-60"
            onClick={handleSubmit}
            disabled={loading || !userInput.trim()}
          >
            {loading ? "Asking..." : "Ask GPT"}
          </button>
        </div>
        {/* Response */}
        <div className="mt-4 bg-white border border-blue-100 rounded-lg p-4 min-h-[60px] text-blue-900 font-medium whitespace-pre-line">
          {response}
        </div>
        {/* Stats */}
        <div className="flex justify-end mt-2">
          <button
            className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition font-semibold"
            onClick={() => setShowStats(s => !s)}
          >{showStats ? 'Hide Stats' : 'Show Stats'}</button>
        </div>
        {showStats && (
          <div className="mt-2 bg-blue-100 rounded-lg p-4 text-blue-900 text-sm">
            <div><b>Total Prompts:</b> {totalPrompts}</div>
            <div><b>Average Response Length:</b> {avgResponseLength} chars</div>
            <div><b>Last Prompted:</b> {lastPrompted || '-'}</div>
            <div><b>Favorite Prompts:</b> {favoritePrompts.length}</div>
          </div>
        )}
        {/* History */}
        <div className="mt-8">
          <div className="font-semibold text-blue-800 mb-2">Prompt & Response History</div>
          {history.length === 0 && <div className="text-blue-400">No prompts yet.</div>}
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {history.map((item, idx) => (
              <div key={idx} className="bg-white border border-blue-100 rounded-lg p-3 text-blue-900">
                <div className="text-xs text-blue-400 mb-1">{item.date}</div>
                <div className="font-semibold mb-1">Prompt: {item.prompt}</div>
                <div className="mb-1"><b>GPT Response:</b> {item.response}</div>
                <div className="flex gap-2 mt-1">
                  <button className="text-xs text-blue-500 underline" onClick={() => handleShare(item)}>Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Favorite Prompts */}
        {favoritePrompts.length > 0 && (
          <div className="mt-8">
            <div className="font-semibold text-yellow-700 mb-2">Favorite Prompts</div>
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
