import React from "react";
import { FaBook, FaRobot, FaShieldAlt, FaCheckCircle, FaLock } from "react-icons/fa";

const modules = [
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
];

export default function Curriculum() {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-2">AI Learning Curriculum</h3>
      <p className="text-gray-500 mb-4 text-sm max-w-xl">
        Explore our step-by-step micro-modules designed to introduce AI concepts, daily applications, and ethical considerations for youth.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {modules.map((item, i) => (
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
  );
}
