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
import { Link } from "react-router-dom";

const sidebarItems = [
  {
    icon: <FaChartBar className="text-blue-300 text-lg" />, title: "Dashboard", desc: "Overview: progress, module status, notifications"
  },
  {
    icon: <FaGraduationCap className="text-yellow-300 text-lg" />, title: "Learning Modules", desc: "All training videos, quizzes, contents"
  },
  {
    icon: <FaTools className="text-red-300 text-lg" />, title: "AI Toolkit", desc: "CV writing, document translation, interview simulation"
  },
  {
    icon: <FaRobot className="text-cyan-300 text-lg" />, title: "ChatGPT Practice", desc: "Prompt-based AI chat exercises"
  },
  {
    icon: <FaUser className="text-gray-200 text-lg" />, title: "Profile", desc: "Personal info, certificates, badges"
  },
  {
    icon: <FaCog className="text-gray-300 text-lg" />, title: "Settings", desc: "Language, theme, notification settings"
  },
  {
    icon: <FaQuestionCircle className="text-pink-300 text-lg" />, title: "Help & Support", desc: "FAQ, support request, contact channels"
  },
];

export default function Sidebar() {
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
          {sidebarItems.map((item, idx) => {
            if (item.title === "Learning Modules") {
              return (
                <Link to="/modules" key={item.title} className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-800 transition group">
                  <span><FaBook className="text-yellow-300 text-xl" /></span>
                  <span>
                    <span className="font-semibold text-base text-white group-hover:text-blue-200 block">{item.title}</span>
                    <span className="text-xs text-blue-200 opacity-80 block mt-0.5">{item.desc}</span>
                  </span>
                </Link>
              );
            }
            return (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-800 transition group">
                <span>{item.icon}</span>
                <span>
                  <span className="font-semibold text-base text-white group-hover:text-blue-200 block">{item.title}</span>
                  <span className="text-xs text-blue-200 opacity-80 block mt-0.5">{item.desc}</span>
                </span>
              </div>
            );
          })}
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
