import React from "react";
import { FaFolderOpen, FaLifeRing, FaPlay, FaUser } from "react-icons/fa";

export default function Header() {
  return (
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
  );
}
