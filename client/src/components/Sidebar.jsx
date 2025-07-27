import {
  FaChartBar,
  FaGraduationCap,
  FaTools,
  FaRobot,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaHome,
  FaBook
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";


export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col p-6 space-y-4 h-screen justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-6">AI4Integrate</h1>
        <nav className="space-y-2">
          <Link to="/" className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-800 transition group">
            <span><FaHome className="text-blue-300 text-xl" /></span>
            <span>
              <span className="font-semibold text-base text-white group-hover:text-blue-200 block">Home</span>
              <span className="text-xs text-blue-200 opacity-80 block mt-0.5">Go to homepage</span>
            </span>
          </Link>
          {/* Learning Modules */}
          <Link to="/modules" className={`flex items-start gap-3 p-3 rounded-lg transition group ${location.pathname.startsWith('/modules') ? 'bg-blue-800' : 'hover:bg-blue-800'}`}> 
            <span><FaBook className="text-yellow-300 text-xl" /></span>
            <span>
              <span className="font-semibold text-base text-white group-hover:text-blue-200 block">Learning Modules</span>
              <span className="text-xs text-blue-200 opacity-80 block mt-0.5">All training videos, quizzes, contents</span>
            </span>
          </Link>
          {/* AI Toolkit */}
          <Link to="/ai-toolkit" className={`flex items-start gap-3 p-3 rounded-lg transition group ${location.pathname.startsWith('/ai-toolkit') ? 'bg-blue-800' : 'hover:bg-blue-800'}`}> 
            <span><FaTools className="text-red-300 text-lg" /></span>
            <span>
              <span className="font-semibold text-base text-white group-hover:text-blue-200 block">AI Toolkit</span>
              <span className="text-xs text-blue-200 opacity-80 block mt-0.5">CV writing, document translation, interview simulation</span>
            </span>
          </Link>
          {/* ChatGPT Practice */}
          <Link to="/gpt-practice" className={`flex items-start gap-3 p-3 rounded-lg transition group ${location.pathname.startsWith('/gpt-practice') ? 'bg-blue-800' : 'hover:bg-blue-800'}`}> 
            <span><FaRobot className="text-cyan-300 text-lg" /></span>
            <span>
              <span className="font-semibold text-base text-white group-hover:text-blue-200 block">ChatGPT Practice</span>
              <span className="text-xs text-blue-200 opacity-80 block mt-0.5">Prompt-based AI chat exercises</span>
            </span>
          </Link>
          {/* Diğer menüler */}
          <Link to="/dashboard" className={`flex items-start gap-3 p-3 rounded-lg transition group ${location.pathname.startsWith('/dashboard') ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
            <span><FaChartBar className="text-blue-300 text-lg" /></span>
            <span>
              <span className="font-semibold text-base text-white group-hover:text-blue-200 block">Dashboard</span>
              <span className="text-xs text-blue-200 opacity-80 block mt-0.5">Overview: progress, module status, notifications</span>
            </span>
          </Link>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-800 transition group">
            <span><FaUser className="text-gray-200 text-lg" /></span>
            <span>
              <span className="font-semibold text-base text-white group-hover:text-blue-200 block">Profile</span>
              <span className="text-xs text-blue-200 opacity-80 block mt-0.5">Personal info, certificates, badges</span>
            </span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-800 transition group">
            <span><FaCog className="text-gray-300 text-lg" /></span>
            <span>
              <span className="font-semibold text-base text-white group-hover:text-blue-200 block">Settings</span>
              <span className="text-xs text-blue-200 opacity-80 block mt-0.5">Language, theme, notification settings</span>
            </span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-800 transition group">
            <span><FaQuestionCircle className="text-pink-300 text-lg" /></span>
            <span>
              <span className="font-semibold text-base text-white group-hover:text-blue-200 block">Help & Support</span>
              <span className="text-xs text-blue-200 opacity-80 block mt-0.5">FAQ, support request, contact channels</span>
            </span>
          </div>
        </nav>
      </div>
      <div className="mt-auto">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition w-full">
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
