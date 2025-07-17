import React from "react";

export default function Hero() {
  return (
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
  );
}
