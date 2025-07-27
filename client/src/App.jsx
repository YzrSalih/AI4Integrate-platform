import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Curriculum from "./components/Curriculum";
import ToolkitAndChat from "./components/ToolkitAndChat";
import Footer from "./components/Footer";
import LearningModules from "./pages/LearningModules";
import AIToolkit from "./components/ai-toolkit/AIToolkit";
import ChatGPTPractice from "./pages/ChatGPTPractice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

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
                element={
                  <>
                    <Hero />
                    <Curriculum />
                    <ToolkitAndChat />
                    <Footer />
                  </>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
