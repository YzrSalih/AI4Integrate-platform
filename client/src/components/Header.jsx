import React from "react";
import { FaCog, FaLifeRing, FaPlay, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <div className="flex gap-3 items-center">
        <Link
          to="/settings"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm transition-colors shadow-sm"
        >
          <FaCog className="text-blue-500 text-base" />
          Settings
        </Link>
        <Link
          to="/help-support"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-medium text-sm transition-colors shadow-sm"
        >
          <FaLifeRing className="text-green-500 text-base" />
          Support
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/modules" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-sm transition-colors shadow-sm">
          <FaPlay className="text-indigo-500 text-base" />
          Start Learning
        </Link>
        <Link to="/profile" className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition">
          <FaUser className="text-gray-400 text-2xl" />
        </Link>
      </div>
    </header>
  );
}
