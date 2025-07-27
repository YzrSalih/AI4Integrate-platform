
import React, { useState, useRef, useEffect } from "react";

async function getAIFeedback(question, answer) {
  const res = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are an expert interview coach. Give concise, actionable feedback on the user's answer to the interview question. Only return feedback, do not repeat the question or answer." },
        { role: "user", content: `Question: ${question}\nAnswer: ${answer}` }
      ]
    })
  });
  if (!res.ok) throw new Error("AI feedback failed");
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No feedback received.";
}

const defaultQuestions = {
  General: [
    "Tell us about yourself.",
    "Why did you apply for this position?",
    "What are your strengths?"
  ],
  Technical: [
    "Explain a technical challenge you faced and how you solved it.",
    "Describe your experience with JavaScript.",
    "How do you keep your technical skills up to date?"
  ],
  Behavioral: [
    "Describe a time you worked in a team.",
    "How do you handle conflict at work?",
    "Give an example of when you showed leadership."
  ]
};


export default function InterviewPractice() {
  const [category, setCategory] = useState("General");
  const [questions, setQuestions] = useState({ ...defaultQuestions });
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [history, setHistory] = useState([]); // {question, answer, feedback, date}
  const [favoriteQuestions, setFavoriteQuestions] = useState([]);
  const [customQuestion, setCustomQuestion] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [customTimer, setCustomTimer] = useState(60);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Timer effect (only runs if timerActive)
  useEffect(() => {
    if (!timerActive || timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  // Reset timer and answer on question/category change
  useEffect(() => {
    setTimer(customTimer);
    setTimerActive(false);
    setAnswer("");
    setFeedback("");
    setAudioUrl(null);
  }, [current, category, customTimer]);

  // AI feedback integration
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setFeedback("");
    setLoading(true);
    try {
      const fb = await getAIFeedback(questions[category][current], answer);
      setFeedback(fb);
      setHistory(prev => [
        {
          question: questions[category][current],
          answer,
          feedback: fb,
          date: new Date().toLocaleString(),
          audioUrl
        },
        ...prev
      ]);
    } catch {
      setFeedback("AI feedback could not be retrieved.");
    }
    setLoading(false);
  };
  // Add custom question
  const handleAddCustomQuestion = () => {
    if (!customQuestion.trim()) return;
    setQuestions(prev => ({
      ...prev,
      [category]: [customQuestion, ...prev[category]]
    }));
    setCustomQuestion("");
    setCurrent(0);
  };

  // Favorite question toggle
  const toggleFavorite = (q) => {
    setFavoriteQuestions(prev =>
      prev.includes(q)
        ? prev.filter(fav => fav !== q)
        : [...prev, q]
    );
  };

  // Share answer/feedback
  const handleShare = (item) => {
    const text = `Interview Question: ${item.question}\n\nYour Answer: ${item.answer}\n\nAI Feedback: ${item.feedback}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  // Stats
  const totalAnswers = history.length;
  const avgFeedbackLength = totalAnswers ? Math.round(history.reduce((acc, h) => acc + (h.feedback?.length || 0), 0) / totalAnswers) : 0;
  const lastAnswered = history[0]?.date;

  // Voice recording handlers
  const handleStartRecording = async () => {
    setFeedback("");
    setAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(audioBlob));
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setFeedback("Microphone access denied or not available.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      <div className="bg-blue-50 p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-xl text-blue-900">Interview Practice</h2>
          <div>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="rounded px-2 py-1 text-blue-900 border border-blue-200 bg-white">
              <option value="EN">EN</option>
              <option value="TR">TR</option>
            </select>
          </div>
        </div>
        {/* Category Selector */}
        <div className="mb-4 flex gap-3 flex-wrap">
          {Object.keys(questions).map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg font-semibold transition shadow ${cat === category ? 'bg-blue-400 text-white' : 'bg-blue-100 text-blue-900 hover:bg-blue-200'}`}
              onClick={() => { setCategory(cat); setCurrent(0); }}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Add custom question */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            className="border border-blue-200 rounded-lg px-3 py-2 flex-1 text-blue-900"
            placeholder="Add your own question..."
            value={customQuestion}
            onChange={e => setCustomQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustomQuestion()}
          />
          <button
            className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
            onClick={handleAddCustomQuestion}
          >Add</button>
        </div>
        {/* Timer settings */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-blue-700 font-semibold">Time left: <span className={timer <= 10 && timerActive ? 'text-red-500' : ''}>{timer}s</span></div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min={10}
              max={300}
              value={customTimer}
              onChange={e => setCustomTimer(Number(e.target.value))}
              className="w-16 border border-blue-200 rounded px-2 py-1 text-blue-900 text-sm mr-2"
              title="Set timer (seconds)"
            />
            <button
              className={`px-3 py-1 rounded-lg font-semibold transition shadow ${timerActive ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-400 text-white hover:bg-blue-500'}`}
              onClick={() => setTimerActive(true)}
              disabled={timerActive || timer === 0}
            >
              Start Timer
            </button>
            <button
              className={`px-3 py-1 rounded-lg font-semibold transition shadow ${!timerActive ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-400 text-white hover:bg-red-500'}`}
              onClick={() => setTimerActive(false)}
              disabled={!timerActive}
            >
              Stop Timer
            </button>
          </div>
        </div>
        {/* Question */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-green-900 font-semibold flex items-center gap-2">
            <span>Question:</span>
            <span className="font-normal">{questions[category][current]}</span>
            <button
              className={`ml-2 px-2 py-1 rounded text-xs ${favoriteQuestions.includes(questions[category][current]) ? 'bg-yellow-300 text-yellow-900' : 'bg-blue-100 text-blue-900 hover:bg-yellow-100'}`}
              onClick={() => toggleFavorite(questions[category][current])}
              title="Add to favorites"
            >★</button>
          </div>
          <button
            className="text-xs text-blue-500 underline"
            onClick={() => setShowStats(s => !s)}
          >{showStats ? 'Hide Stats' : 'Show Stats'}</button>
        </div>
        {/* Text Answer */}
        <textarea
          className="border border-blue-200 bg-white p-3 mb-3 w-full rounded-lg focus:outline-blue-400 text-base resize-none placeholder:text-blue-400 text-blue-900"
          rows={4}
          placeholder="Type your answer..."
          value={answer}
          onChange={e => setAnswer(e.target.value)}
        />
        {/* Voice Answer */}
        <div className="flex items-center gap-3 mb-3">
          {!isRecording && (
            <button
              className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
              onClick={handleStartRecording}
            >
              Start Voice Answer
            </button>
          )}
          {isRecording && (
            <button
              className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow animate-pulse"
              onClick={handleStopRecording}
            >
              Stop Recording
            </button>
          )}
          {audioUrl && (
            <audio controls src={audioUrl} className="ml-2">
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3 mb-2">
          <button
            className="bg-gradient-to-r from-blue-400 to-green-300 hover:from-blue-500 hover:to-green-400 text-white px-5 py-2 rounded-lg font-semibold transition shadow disabled:opacity-60"
            onClick={handleSubmit}
            disabled={timer === 0 || !timerActive || loading || (!answer.trim() && !audioUrl)}
          >
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>
          <button
            className="bg-green-200 hover:bg-green-300 text-green-900 px-5 py-2 rounded-lg font-semibold transition shadow"
            onClick={() => setCurrent((current + 1) % questions[category].length)}
          >
            Next Question
          </button>
        </div>
        {/* Feedback */}
        <div className="mt-4 text-blue-900 font-medium min-h-[32px]">{feedback}</div>
        {/* Stats */}
        {showStats && (
          <div className="mt-4 bg-blue-100 rounded-lg p-4 text-blue-900 text-sm">
            <div><b>Total Answers:</b> {totalAnswers}</div>
            <div><b>Average Feedback Length:</b> {avgFeedbackLength} chars</div>
            <div><b>Last Answered:</b> {lastAnswered || '-'}</div>
            <div><b>Favorite Questions:</b> {favoriteQuestions.length}</div>
          </div>
        )}
        {/* History */}
        <div className="mt-8">
          <div className="font-semibold text-blue-800 mb-2">Answer & Feedback History</div>
          {history.length === 0 && <div className="text-blue-400">No answers yet.</div>}
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {history.map((item, idx) => (
              <div key={idx} className="bg-white border border-blue-100 rounded-lg p-3 text-blue-900">
                <div className="text-xs text-blue-400 mb-1">{item.date}</div>
                <div className="font-semibold mb-1">Q: {item.question}</div>
                <div className="mb-1"><b>Your Answer:</b> {item.answer}</div>
                {item.audioUrl && (
                  <audio controls src={item.audioUrl} className="mb-1">
                    Your browser does not support the audio element.
                  </audio>
                )}
                <div className="mb-1"><b>AI Feedback:</b> {item.feedback}</div>
                <div className="flex gap-2 mt-1">
                  <button className="text-xs text-blue-500 underline" onClick={() => handleShare(item)}>Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Favorite Questions */}
        {favoriteQuestions.length > 0 && (
          <div className="mt-8">
            <div className="font-semibold text-yellow-700 mb-2">Favorite Questions</div>
            <ul className="list-disc pl-6 text-blue-900">
              {favoriteQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
