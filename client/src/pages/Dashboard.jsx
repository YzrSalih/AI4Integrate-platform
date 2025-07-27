
import { FaChartLine, FaTasks, FaBell, FaCheckCircle, FaTools, FaRobot, FaBook } from "react-icons/fa";
import { BsFillBarChartFill } from "react-icons/bs";
import { MdOutlineIncompleteCircle } from "react-icons/md";
import { PiCertificateFill } from "react-icons/pi";

import React from "react";


// Simüle edilen güncel veriler (gerçek uygulamada context veya API'den alınır)
const modules = [
  { id: 1, name: "Learning Modules", status: "inprogress", current: { title: "AI in Daily Life", video: "https://www.youtube.com/embed/8hly31xKli0" } },
  { id: 2, name: "AI Toolkit", status: "notstarted", usage: 18 }, // dakika
  { id: 3, name: "ChatGPT Practice", status: "completed", usage: 42 }, // dakika
];

const Dashboard = () => {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-green-50">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-900 tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Learning Modules Card */}
        <div className="bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-2xl shadow-lg p-7 flex flex-col items-center relative overflow-hidden w-full">
          <FaBook className="text-4xl mb-3 drop-shadow-lg" />
          <span className="text-lg font-semibold mb-1">Learning Modules</span>
          <span className="text-xl font-bold mb-2">{modules[0].current.title}</span>
          <span className="text-base mb-4 mt-2 text-center">You're making great progress! Keep going and complete <span className="font-bold">{modules[0].current.title}</span> to unlock new content.</span>
          <a
            href="/modules"
            className="mt-2 px-6 py-2 rounded-lg bg-white text-blue-700 font-bold shadow hover:bg-blue-100 transition"
          >
            Go to Learning Modules
          </a>
          <span className="text-sm font-bold mt-4">Status: <span className="capitalize">{modules[0].status}</span></span>
        </div>
        {/* AI Toolkit Usage Card */}
        <div className="bg-gradient-to-tr from-purple-400 to-purple-200 text-purple-900 rounded-2xl shadow-lg p-7 flex flex-col items-center relative overflow-hidden w-full">
          <FaTools className="text-4xl mb-3 drop-shadow-lg" />
          <span className="text-lg font-semibold mb-1">AI Toolkit</span>
          <div className="relative flex items-center justify-center w-24 h-24 mb-2">
            <svg className="absolute top-0 left-0" width="96" height="96">
              <circle cx="48" cy="48" r="40" stroke="#ddd6fe" strokeWidth="10" fill="none" />
              <circle cx="48" cy="48" r="40" stroke="#a78bfa" strokeWidth="10" fill="none" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - modules[1].usage / 60)} strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-bold">{modules[1].usage}m</span>
          </div>
          <a
            href="/ai-toolkit"
            className="mt-2 px-6 py-2 rounded-lg bg-white text-purple-700 font-bold shadow hover:bg-purple-100 transition"
          >
            Go to AI Toolkit
          </a>
          <span className="text-sm font-bold mt-4">Status: <span className="capitalize">{modules[1].status}</span></span>
        </div>
        {/* ChatGPT Practice Usage Card */}
        <div className="bg-gradient-to-tr from-cyan-200 to-cyan-100 text-cyan-900 rounded-2xl shadow-lg p-7 flex flex-col items-center relative overflow-hidden w-full">
          <FaRobot className="text-4xl mb-3 drop-shadow-lg" />
          <span className="text-lg font-semibold mb-1">ChatGPT Practice</span>
          <div className="relative flex items-center justify-center w-24 h-24 mb-2">
            <svg className="absolute top-0 left-0" width="96" height="96">
              <circle cx="48" cy="48" r="40" stroke="#bae6fd" strokeWidth="10" fill="none" />
              <circle cx="48" cy="48" r="40" stroke="#06b6d4" strokeWidth="10" fill="none" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - modules[2].usage / 60)} strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-bold">{modules[2].usage}m</span>
          </div>
          <a
            href="/gpt-practice"
            className="mt-2 px-6 py-2 rounded-lg bg-white text-cyan-700 font-bold shadow hover:bg-cyan-100 transition"
          >
            Go to ChatGPT Practice
          </a>
          <span className="text-sm font-bold mt-4">Status: <span className="capitalize">{modules[2].status}</span></span>
        </div>
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
