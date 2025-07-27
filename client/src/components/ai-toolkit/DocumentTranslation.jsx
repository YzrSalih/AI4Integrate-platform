import React, { useState } from "react";

export default function DocumentTranslation() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [lang, setLang] = useState("en");

  // Dummy translation (replace with API integration)
  const handleTranslate = () => {
    setTranslated("Translation: " + text.split('').reverse().join(''));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      <div className="bg-blue-50 p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="font-bold text-xl mb-6 text-blue-900">Document Translation & Writing Support</h2>
        <select className="border border-blue-200 bg-white p-3 mb-3 w-full rounded-lg text-base text-blue-900" value={lang} onChange={e => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="de">German</option>
          <option value="tr">Turkish</option>
          <option value="pl">Polish</option>
        </select>
        <textarea className="border border-blue-200 bg-white p-3 mb-3 w-full rounded-lg focus:outline-blue-400 text-base resize-none placeholder:text-blue-400 text-blue-900" rows={4} placeholder="Enter text to translate..." value={text} onChange={e => setText(e.target.value)} />
        <button className="bg-gradient-to-r from-blue-400 to-green-300 hover:from-blue-500 hover:to-green-400 text-white px-5 py-2 rounded-lg font-semibold transition shadow" onClick={handleTranslate}>Translate</button>
        <div className="mt-4 text-blue-900 font-medium min-h-[32px]">{translated}</div>
        <div className="mt-6 text-blue-900">
          <strong>Sample Sentences:</strong>
          <ul className="list-disc ml-4 mt-2">
            <li>"Dear Sir/Madam, I am submitting my application attached."</li>
            <li>"Thank you for your attention."</li>
            <li>"If you need more information, please contact me."</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
