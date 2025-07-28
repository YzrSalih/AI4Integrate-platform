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


export default function Home() {
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
        {/* Current Module Card */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center md:items-start border border-blue-100 min-w-[260px]">
          <div className="text-sm text-gray-500 mb-1">Current Module</div>
          <div className="text-2xl font-extrabold text-blue-700 mb-2">{user.currentModule.title}</div>
          <div className="text-gray-700 mb-4 text-base">{user.currentModule.description}</div>
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-2">
              <svg className="w-20 h-20" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-blue-500"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${user.currentModule.progress}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">{user.currentModule.progress}<span className="text-base align-super">%</span></span>
              </div>
            </div>
            {user.currentModule.progress === 0 ? (
              <span className="bg-gray-200 text-gray-600 font-semibold px-5 py-1.5 rounded-lg shadow mt-2 text-sm">Not Started</span>
            ) : user.currentModule.progress === 100 ? (
              <span className="bg-green-500 text-white font-semibold px-5 py-1.5 rounded-lg shadow mt-2 text-sm">Completed</span>
            ) : (
              <Link
                to="/modules"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-1.5 rounded-lg shadow transition mt-2 text-sm"
              >
                Continue Module
              </Link>
            )}
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
