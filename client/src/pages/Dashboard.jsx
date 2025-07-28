
import { FaChartLine, FaTasks, FaBell, FaCheckCircle, FaTools, FaRobot, FaBook } from "react-icons/fa";
import { BsFillBarChartFill } from "react-icons/bs";
import { MdOutlineIncompleteCircle } from "react-icons/md";
import { PiCertificateFill } from "react-icons/pi";

import React from "react";



// LearningModules verileri (modül başlıkları)
const learningModules = [
  { id: 1, title: "Introduction to AI", description: "Learn what AI is and see real-life examples." },
  { id: 2, title: "AI in Daily Life", description: "Learn how AI impacts your everyday activities and future opportunities." },
  { id: 3, title: "AI & Jobs of the Future", description: "Discover how AI is changing the job market and which skills are important." },
  { id: 4, title: "Ethics & Safety in AI", description: "Understand bias, privacy, and ethical behavior in AI." },
  { id: 5, title: "Using AI for Language Learning", description: "Practice language skills with AI-powered tools." },
  { id: 6, title: "Build Your First Chatbot (No-code)", description: "Create a simple chatbot without coding." },
  { id: 7, title: "Prompt Engineering Basics", description: "Learn how to write effective prompts for AI." },
  { id: 8, title: "AI for Education", description: "Explore AI-powered learning resources and tools." },
];

// Simüle edilen usage verileri (gerçek uygulamada context veya API'den alınır)
function getUsage(key, fallback = 0) {
  const val = localStorage.getItem(key);
  return val ? Number(val) : fallback;
}

const Dashboard = () => {
  // LearningModules ilerleme ve mevcut modülünü localStorage'dan oku
  const [completed, setCompleted] = React.useState([]);
  const [selected, setSelected] = React.useState(0);
  const [aiToolkitUsage, setAiToolkitUsage] = React.useState(0); // dakika
  const [gptPracticeUsage, setGptPracticeUsage] = React.useState(0); // dakika

  React.useEffect(() => {
    const c = localStorage.getItem("learningModules_completed");
    setCompleted(c ? JSON.parse(c) : []);
    const s = localStorage.getItem("learningModules_selected");
    setSelected(s !== null ? Number(s) : 0);
    setAiToolkitUsage(getUsage("aiToolkit_usage", 0));
    setGptPracticeUsage(getUsage("gptPractice_usage", 0));
  }, []);

  const totalModules = learningModules.length;
  const completedCount = completed.length;
  const progress = Math.round((completedCount / totalModules) * 100);
  const currentModule = learningModules[selected] || learningModules[0];
  let status = "Not Started";
  if (completedCount === 0) status = "Not Started";
  else if (completedCount === totalModules) status = "Completed";
  else status = "In Progress";

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-green-50">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-900 tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Learning Modules Card */}
        <div className="bg-white rounded-2xl shadow-lg p-7 flex flex-col items-center relative overflow-hidden w-full border border-blue-100">
          <span className="text-sm text-gray-500 mb-1">Current Module</span>
          <span className="text-2xl font-extrabold text-blue-700 mb-1">{currentModule.title}</span>
          <span className="text-base text-gray-700 mb-4 text-center">{currentModule.description}</span>
          <div className="relative flex items-center justify-center w-24 h-24 mb-2">
            <svg className="absolute top-0 left-0" width="96" height="96">
              <circle cx="48" cy="48" r="44" stroke="#e0e7ef" strokeWidth="8" fill="none" />
              <circle cx="48" cy="48" r="44" stroke="#2563eb" strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 44} strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)} strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-bold text-blue-700">{progress}%</span>
          </div>
          <div className="flex gap-3 mt-4 w-full justify-center">
            <span className={`px-5 py-2 rounded-lg font-bold shadow text-base flex items-center ${status === "Completed" ? "bg-green-500 text-white" : status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}>{status}</span>
            <a
              href="/modules"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition flex items-center"
            >
              Devam Et
            </a>
          </div>
        </div>
        {/* AI Toolkit Usage Card */}
        <div className="bg-gradient-to-tr from-purple-400 to-purple-200 text-purple-900 rounded-2xl shadow-lg p-7 flex flex-col items-center relative overflow-hidden w-full">
          <FaTools className="text-4xl mb-3 drop-shadow-lg" />
          <span className="text-lg font-semibold mb-1">AI Toolkit</span>
          <div className="relative flex items-center justify-center w-24 h-24 mb-2">
            <svg className="absolute top-0 left-0" width="96" height="96">
              <circle cx="48" cy="48" r="40" stroke="#ddd6fe" strokeWidth="10" fill="none" />
              <circle cx="48" cy="48" r="40" stroke="#a78bfa" strokeWidth="10" fill="none" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - aiToolkitUsage / 60)} strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-bold">{aiToolkitUsage}m</span>
          </div>
          <a
            href="/ai-toolkit"
            className="mt-2 px-6 py-2 rounded-lg bg-white text-purple-700 font-bold shadow hover:bg-purple-100 transition"
          >
            Go to AI Toolkit
          </a>
          <span className="text-sm font-bold mt-4">Status: <span className="capitalize">{aiToolkitUsage > 0 ? "In Progress" : "Not Started"}</span></span>
        </div>
        {/* ChatGPT Practice Usage Card */}
        <div className="bg-gradient-to-tr from-cyan-200 to-cyan-100 text-cyan-900 rounded-2xl shadow-lg p-7 flex flex-col items-center relative overflow-hidden w-full">
          <FaRobot className="text-4xl mb-3 drop-shadow-lg" />
          <span className="text-lg font-semibold mb-1">ChatGPT Practice</span>
          <div className="relative flex items-center justify-center w-24 h-24 mb-2">
            <svg className="absolute top-0 left-0" width="96" height="96">
              <circle cx="48" cy="48" r="40" stroke="#bae6fd" strokeWidth="10" fill="none" />
              <circle cx="48" cy="48" r="40" stroke="#06b6d4" strokeWidth="10" fill="none" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - gptPracticeUsage / 60)} strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-bold">{gptPracticeUsage}m</span>
          </div>
          <a
            href="/gpt-practice"
            className="mt-2 px-6 py-2 rounded-lg bg-white text-cyan-700 font-bold shadow hover:bg-cyan-100 transition"
          >
            Go to ChatGPT Practice
          </a>
          <span className="text-sm font-bold mt-4">Status: <span className="capitalize">{gptPracticeUsage > 0 ? "In Progress" : "Not Started"}</span></span>
        </div>
        {/* ...existing code... */}
        {/* ...existing code... */}
      </div>
      {/* Goals Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2"><FaTasks className="text-blue-400" /> Weekly Goals</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          {/* Modules Completed */}
          <div className="flex-1 flex flex-col items-center bg-blue-50 rounded-xl p-6 shadow-sm">
            <div className="relative flex items-center justify-center w-20 h-20 mb-2">
              <svg className="absolute top-0 left-0" width="80" height="80">
                <circle cx="40" cy="40" r="32" stroke="#dbeafe" strokeWidth="8" fill="none" />
                <circle cx="40" cy="40" r="32" stroke="#2563eb" strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - 2/3)} strokeLinecap="round" />
              </svg>
              <span className="text-xl font-bold text-blue-700">2 / 3</span>
            </div>
            <span className="font-semibold text-lg mb-1 text-blue-900">Modules Completed</span>
            <span className="text-sm text-blue-500">Complete 1 more module to reach your goal!</span>
          </div>
          {/* Practice Time */}
          <div className="flex-1 flex flex-col items-center bg-green-50 rounded-xl p-6 shadow-sm">
            <div className="relative flex items-center justify-center w-20 h-20 mb-2">
              <svg className="absolute top-0 left-0" width="80" height="80">
                <circle cx="40" cy="40" r="32" stroke="#bbf7d0" strokeWidth="8" fill="none" />
                <circle cx="40" cy="40" r="32" stroke="#22c55e" strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - 60/90)} strokeLinecap="round" />
              </svg>
              <span className="text-xl font-bold text-green-700">60m</span>
            </div>
            <span className="font-semibold text-lg mb-1 text-green-900">Total Practice Time</span>
            <span className="text-sm text-green-500">Aim for 90 minutes this week!</span>
          </div>
          {/* Badges Earned */}
          <div className="flex-1 flex flex-col items-center bg-yellow-50 rounded-xl p-6 shadow-sm">
            <div className="relative flex items-center justify-center w-20 h-20 mb-2">
              <svg className="absolute top-0 left-0" width="80" height="80">
                <circle cx="40" cy="40" r="32" stroke="#fef9c3" strokeWidth="8" fill="none" />
                <circle cx="40" cy="40" r="32" stroke="#eab308" strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - 1/2)} strokeLinecap="round" />
              </svg>
              <span className="text-xl font-bold text-yellow-700">1</span>
            </div>
            <span className="font-semibold text-lg mb-1 text-yellow-900">Badges Earned</span>
            <span className="text-sm text-yellow-500">Earn 1 more badge to level up!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
