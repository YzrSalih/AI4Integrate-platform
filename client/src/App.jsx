import React from "react";
import { FaBook, FaRobot, FaShieldAlt, FaCheckCircle, FaLock, FaGithub, FaTwitter, FaLinkedin, FaUser, FaLifeRing, FaFolderOpen, FaPlay, FaTools, FaComments } from "react-icons/fa";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default function HomePage() {
  return (
    <div className="flex h-screen text-gray-800" style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 100%)" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-6">AI4Integrate</h1>
        <nav className="space-y-4">
          <a
            href="#"
            className="flex items-center gap-2 p-2 rounded bg-blue-700 text-white font-semibold"
          >
            📊 Dashboard
          </a>

          <a href="#" className="flex items-center gap-2 hover:text-blue-300">
            🧰 AI Toolkit
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-300">
            🤖 ChatGPT Practice
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-300">
            👤 Profile
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-300">
            ⚙️ Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white shadow">
          <div className="flex gap-3 items-center">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm transition-colors shadow-sm">
              <FaFolderOpen className="text-blue-500 text-base" />
              Resources
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-medium text-sm transition-colors shadow-sm">
              <FaLifeRing className="text-green-500 text-base" />
              Support
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-sm transition-colors shadow-sm">
              <FaPlay className="text-indigo-500 text-base" />
              Start Learning
            </button>
            <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
              <FaUser className="text-gray-400 text-xl" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 space-y-10 overflow-y-auto">
          <div className="relative flex flex-col items-center gap-6 mb-10 animate-fadein py-10 px-4 rounded-2xl overflow-hidden bg-white/60 shadow-lg">
            <img
              src="https://undraw.ai/undraw_ai_re_illustration.svg"
              alt="AI Education Illustration"
              className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-xl bg-transparent mb-2"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="w-full flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-3 text-center tracking-tight drop-shadow-sm">
                Welcome to <span className="text-blue-600">AI4Integrate</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-700 text-center max-w-2xl font-medium">
                AI Education for Migrant and Refugee Youth Through Micro-Modules
              </p>
            </div>
          </div>

          {/* Curriculum */}
          <section>
            <h3 className="text-xl font-semibold mb-2">
              AI Learning Curriculum
            </h3>
            <p className="text-gray-500 mb-4 text-sm max-w-xl">
              Explore our step-by-step micro-modules designed to introduce AI concepts, daily applications, and ethical considerations for youth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[
                {
                  title: "Module 1",
                  subtitle: "Introduction to AI",
                  icon: <FaBook className="text-white text-xl" />,
                  progress: 100,
                  status: "completed",
                  color: "from-blue-500 to-blue-700",
                },
                {
                  title: "AI in Daily Life",
                  subtitle: "",
                  icon: <FaRobot className="text-white text-xl" />,
                  progress: 40,
                  status: "inprogress",
                  color: "from-purple-500 to-purple-700",
                },
                {
                  title: "AI Ethics & Safety",
                  subtitle: "",
                  icon: <FaShieldAlt className="text-white text-xl" />,
                  progress: 0,
                  status: "locked",
                  color: "from-green-500 to-green-700",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-2xl shadow-lg border border-gray-100 bg-white p-6 flex flex-col gap-3 transition-transform hover:-translate-y-1 hover:shadow-2xl relative ${item.status === "locked" ? "opacity-60 pointer-events-none" : ""}`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`bg-gradient-to-br ${item.color} rounded-lg p-2 flex items-center justify-center shadow`}>
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                      {item.status === "completed" && <FaCheckCircle className="text-green-500 text-lg" title="Completed" />}
                      {item.status === "locked" && <FaLock className="text-gray-400 text-lg" title="Locked" />}
                      {item.title}
                    </h4>
                  </div>
                  {item.subtitle && item.subtitle !== "" && (
                    <p className="text-gray-600 mb-1 text-base font-medium">{item.subtitle}</p>
                  )}
                  {/* Progress Bar */}
                  <div className="w-full mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${item.status === "completed" ? "bg-green-500" : item.status === "locked" ? "bg-gray-300" : "bg-blue-500"}`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs mt-1 block font-semibold ${item.status === "completed" ? "text-green-600" : item.status === "locked" ? "text-gray-400" : "text-blue-600"}`}>
                      {item.status === "completed"
                        ? "Completed"
                        : item.status === "locked"
                        ? "Locked"
                        : `${item.progress}% completed`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Toolkit & Chat */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Toolkit Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 flex flex-col gap-4 border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-500 text-white rounded-full p-2 shadow">
                  <FaTools className="text-2xl" />
                </div>
                <h4 className="text-2xl font-extrabold text-blue-800 tracking-tight">AI Toolkit</h4>
              </div>
              <ul className="space-y-2 mt-2">
                <li className="flex items-center gap-2 text-base text-blue-900 font-medium">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                  Write a CV
                </li>
                <li className="flex items-center gap-2 text-base text-blue-900 font-medium">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                  Interview Practice
                </li>
                <li className="flex items-center gap-2 text-base text-blue-900 font-medium">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                  Document Translation
                </li>
              </ul>
            </div>

            {/* ChatGPT Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-8 flex flex-col gap-4 border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-500 text-white rounded-full p-2 shadow">
                  <FaComments className="text-2xl" />
                </div>
                <h4 className="text-2xl font-extrabold text-green-800 tracking-tight">ChatGPT</h4>
              </div>
              <p className="text-base text-green-900 font-medium mb-2">
                Hello! Ask me anything about AI or practice your language skills.
              </p>
              <Input
                placeholder="Type a message..."
                className="bg-white border border-green-200 text-green-900 placeholder-green-400 rounded-md focus:ring-2 focus:ring-green-300 transition"
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="w-full text-sm text-gray-400 border-t pt-4 flex flex-col items-center gap-2 mt-auto">
            <div className="flex gap-6 justify-center mb-1">
              <a href="https://github.com/YzrSalih" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors"><FaGithub size={24} /></a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors"><FaTwitter size={24} /></a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors"><FaLinkedin size={24} /></a>
            </div>
            <span>© 2025 AI4Integrate. All rights reserved.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
