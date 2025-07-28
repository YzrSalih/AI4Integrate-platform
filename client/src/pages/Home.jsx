import React from "react";
import { FaBook, FaTools, FaRobot, FaMedal } from "react-icons/fa";
import { Link } from "react-router-dom";

// Simulated dynamic user/module data
const user = {
  name: "Alex",
  currentModule: {
    title: "AI in Daily Life",
    progress: 0,
    description: "Learn how AI impacts your everyday activities and future opportunities."
  },
  badges: [
    { icon: <FaMedal className="text-yellow-400 drop-shadow-lg" />, label: "Starter" },
    { icon: <FaMedal className="text-blue-400 drop-shadow-lg" />, label: "Active Learner" },
    { icon: <FaMedal className="text-green-400 drop-shadow-lg" />, label: "AI Explorer" },
    { icon: <FaMedal className="text-pink-400 drop-shadow-lg" />, label: "Innovator" },
    { icon: <FaMedal className="text-purple-400 drop-shadow-lg" />, label: "AI Mentor" }
  ]
};

const quickAccess = [
  {
    icon: <FaBook className="text-indigo-500 text-3xl group-hover:scale-110 transition-transform" />,
    label: "Learning Modules",
    to: "/modules",
    desc: "Explore all AI training modules, quizzes, and videos."
  },
  {
    icon: <FaTools className="text-pink-500 text-3xl group-hover:rotate-12 transition-transform" />,
    label: "AI Toolkit",
    to: "/ai-toolkit",
    desc: "Access CV Builder, Document Translation, and Interview Practice."
  },
  {
    icon: <FaRobot className="text-green-500 text-3xl group-hover:scale-125 transition-transform" />,
    label: "ChatGPT Practice",
    to: "/gpt-practice",
    desc: "Practice your language skills and AI chat exercises."
  }
];


// Dashboard'daki ile aynı modül listesi
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

export default function Home() {
  // Dashboard ile aynı şekilde ilerleme ve modül state'i
  const [completed, setCompleted] = React.useState([]);
  const [selected, setSelected] = React.useState(0);
  React.useEffect(() => {
    const c = localStorage.getItem("learningModules_completed");
    setCompleted(c ? JSON.parse(c) : []);
    const s = localStorage.getItem("learningModules_selected");
    setSelected(s !== null ? Number(s) : 0);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300 via-white to-green-200"></div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-500 to-green-600 drop-shadow-lg mb-4 z-10">
          Welcome, {user.name}!
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-8 z-10">
          Unlock your AI journey with creative learning, hands-on tools, and real achievements.
        </p>
        <Link to="/modules" className="inline-block bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold px-8 py-4 rounded-xl shadow-xl text-lg transition-transform hover:scale-105 z-10 hover:text-white focus:text-white active:text-white">
          Start Learning
        </Link>
      </section>

      {/* Quick Access Section */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-16">
        {quickAccess.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="group bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center hover:scale-105 hover:-translate-y-2 transition-all border-2 border-transparent hover:border-blue-300 cursor-pointer"
          >
            <div className="mb-3">{item.icon}</div>
            <div className="font-extrabold text-xl mb-1 text-gray-800 group-hover:text-blue-600 transition-colors">{item.label}</div>
            <div className="text-gray-500 text-base text-center group-hover:text-gray-700 transition-colors">{item.desc}</div>
          </Link>
        ))}
      </section>

      {/* Current Module and Badges - Side by Side on Desktop */}
      <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mb-20">
        {/* Current Module Card (Dashboard ile birebir aynı) */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-blue-100 min-w-[260px]">
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
        {/* Badges Grid */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl p-8 border border-blue-100 min-w-[260px]">
          <div className="text-lg font-bold text-gray-700 mb-4 text-center md:text-left">Your Badges</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {user.badges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center bg-blue-50 rounded-xl shadow p-4 border border-blue-100 hover:bg-blue-100 transition"
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <div className="text-sm font-semibold text-gray-700">{badge.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational Quote - Stylized Banner */}
      <section className="w-full bg-gradient-to-r from-blue-800 via-cyan-700 to-teal-500 py-10 text-center shadow-inner">
        <div className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg max-w-3xl mx-auto px-4">
          "Every step you take in learning AI brings you closer to new opportunities. Keep going!"
        </div>
      </section>
    </div>
  );
}
