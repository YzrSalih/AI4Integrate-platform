import React from "react";
import { FaTools, FaComments } from "react-icons/fa";
import { Input } from "../components/ui/input";

export default function ToolkitAndChat() {
  return (
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
  );
}
