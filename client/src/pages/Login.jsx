import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    // Simple fake auth: accept any non-empty email/password
    if (email && password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } else {
      setError("Please enter both email and password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100">
      <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden border border-blue-100">
        {/* Left panel: Welcome */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-500 p-10 w-1/2 text-white relative">
          <div className="absolute top-6 left-6 text-2xl font-extrabold tracking-tight">AI4Integrate</div>
          <FaLock className="text-5xl mb-6 drop-shadow-lg" />
          <div className="text-3xl font-extrabold mb-2">Welcome Back!</div>
          <div className="text-lg opacity-90 mb-8 text-center max-w-xs">Access your AI learning platform. Please login to continue.</div>
          <div className="text-xs opacity-60 mt-auto">© {new Date().getFullYear()} AI4Integrate</div>
        </div>
        {/* Right panel: Login form */}
        <form onSubmit={handleSubmit} className="flex-1 bg-white flex flex-col justify-center p-10 gap-6">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-2 text-center md:text-left">Sign In</h2>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition text-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
