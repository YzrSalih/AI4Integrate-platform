import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import LearningModules from "./pages/LearningModules";
import AIToolkit from "./components/ai-toolkit/AIToolkit";
import ChatGPTPractice from "./pages/ChatGPTPractice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

export default function HomePage() {
  return (
    <Router>
      <div className="flex h-screen text-gray-800" style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 100%)" }}>
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-8 space-y-10 overflow-y-auto">
            <Routes>
              <Route
                path="/modules"
                element={<LearningModules />}
              />
              <Route
                path="/ai-toolkit"
                element={<AIToolkit />}
              />
              <Route
                path="/gpt-practice"
                element={<ChatGPTPractice />}
              />
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/profile"
                element={<Profile />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
