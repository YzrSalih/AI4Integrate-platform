import React, { useState } from "react";

export default function CVBuilder() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    experience: "",
    education: "",
    skills: "",
    certificates: ""
  });
  const [aiSuggestions, setAiSuggestions] = useState("");

  // OpenAI API integration (aktif)
  const handleGenerate = async () => {
    setAiSuggestions("Loading...");
    try {
      const prompt = `Give suggestions for a resume: Name: ${personalInfo.name}, Email: ${personalInfo.email}, Experience: ${personalInfo.experience}, Education: ${personalInfo.education}, Skills: ${personalInfo.skills}, Certificates: ${personalInfo.certificates}. What can be added to make the resume more effective?`;
      const response = await fetch("http://localhost:5000/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150
        })
      });
      const data = await response.json();
      setAiSuggestions(data.choices?.[0]?.message?.content || "No response from AI.");
    } catch (err) {
      setAiSuggestions("Error while getting AI suggestion: " + (err?.message || err));
      console.error("AI suggestion error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* Left: Personal Info */}
        <div className="flex-1 bg-blue-50 p-8 rounded-2xl shadow-lg flex flex-col justify-between min-h-[340px]">
          <h2 className="font-bold text-xl mb-4 text-blue-900">Personal Information</h2>
          <input className="border border-blue-200 bg-white p-3 mb-3 w-full rounded-lg focus:outline-blue-400 text-base placeholder:text-blue-400 text-blue-900" placeholder="Full Name" value={personalInfo.name} onChange={e => setPersonalInfo({ ...personalInfo, name: e.target.value })} />
          <input className="border border-blue-200 bg-white p-3 mb-3 w-full rounded-lg focus:outline-blue-400 text-base placeholder:text-blue-400 text-blue-900" placeholder="Email" value={personalInfo.email} onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
          <textarea className="border border-blue-200 bg-white p-3 mb-3 w-full rounded-lg focus:outline-blue-400 text-base resize-none placeholder:text-blue-400 text-blue-900" rows={2} placeholder="Experience" value={personalInfo.experience} onChange={e => setPersonalInfo({ ...personalInfo, experience: e.target.value })} />
          <textarea className="border border-blue-200 bg-white p-3 mb-3 w-full rounded-lg focus:outline-blue-400 text-base resize-none placeholder:text-blue-400 text-blue-900" rows={2} placeholder="Education" value={personalInfo.education} onChange={e => setPersonalInfo({ ...personalInfo, education: e.target.value })} />
          <textarea className="border border-blue-200 bg-white p-3 mb-3 w-full rounded-lg focus:outline-blue-400 text-base resize-none placeholder:text-blue-400 text-blue-900" rows={2} placeholder="Skills (comma separated)" value={personalInfo.skills} onChange={e => setPersonalInfo({ ...personalInfo, skills: e.target.value })} />
          <textarea className="border border-blue-200 bg-white p-3 mb-3 w-full rounded-lg focus:outline-blue-400 text-base resize-none placeholder:text-blue-400 text-blue-900" rows={2} placeholder="Certificates" value={personalInfo.certificates} onChange={e => setPersonalInfo({ ...personalInfo, certificates: e.target.value })} />
          <button className="bg-gradient-to-r from-blue-400 to-green-300 hover:from-blue-500 hover:to-green-400 text-white px-5 py-3 rounded-lg font-semibold transition mt-2 shadow" onClick={handleGenerate}>Get AI Suggestion</button>
        </div>
        {/* Middle: CV Preview */}
        <div className="flex-1 bg-green-50 p-8 rounded-2xl shadow-lg min-h-[340px]">
          <h2 className="font-bold text-xl mb-4 text-green-900">Resume Preview</h2>
          <div className="border border-green-200 rounded-lg p-4 bg-white min-h-[120px]">
            <strong className="text-lg text-green-900">{personalInfo.name}</strong><br />
            <span className="text-green-700">{personalInfo.email}</span><br />
            {personalInfo.experience && <><h4 className="mt-3 font-semibold text-green-800">Experience</h4><p className="text-green-800 whitespace-pre-line">{personalInfo.experience}</p></>}
            {personalInfo.education && <><h4 className="mt-3 font-semibold text-green-800">Education</h4><p className="text-green-800 whitespace-pre-line">{personalInfo.education}</p></>}
            {personalInfo.skills && <><h4 className="mt-3 font-semibold text-green-800">Skills</h4><p className="text-green-800 whitespace-pre-line">{personalInfo.skills}</p></>}
            {personalInfo.certificates && <><h4 className="mt-3 font-semibold text-green-800">Certificates</h4><p className="text-green-800 whitespace-pre-line">{personalInfo.certificates}</p></>}
          </div>
        </div>
        {/* Right: AI Suggestions */}
        <div className="flex-1 bg-blue-50 p-8 rounded-2xl shadow-lg min-h-[340px]">
          <h2 className="font-bold text-xl mb-4 text-blue-900">AI Suggestions</h2>
          <div className="border border-blue-200 rounded-lg p-4 bg-white min-h-[120px] text-blue-900 whitespace-pre-line">{aiSuggestions}</div>
        </div>
      </div>
    </div>
  );
}
