import React, { useState } from "react";
import CVBuilder from "./CVBuilder";
import InterviewPractice from "./InterviewPractice";
import DocumentTranslation from "./DocumentTranslation";

const tools = [
  { name: "CV Builder", component: <CVBuilder /> },
  { name: "Interview Practice", component: <InterviewPractice /> },
  { name: "Document Translation", component: <DocumentTranslation /> },
];

export default function AIToolkit() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">AI Toolkit</h1>
      <div className="flex gap-4 mb-8">
        {tools.map((tool, idx) => (
          <button
            key={tool.name}
            className={`px-6 py-3 rounded shadow ${selected === idx ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
            onClick={() => setSelected(idx)}
          >
            {tool.name}
          </button>
        ))}
      </div>
      <div className="w-full max-w-5xl">
        {tools[selected].component}
      </div>
    </div>
  );
}
