import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import LearningModules from "./pages/LearningModules";
import AIToolkit from "./components/ai-toolkit/AIToolkit";
import ChatGPTPractice from "./pages/ChatGPTPractice";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import HelpAndSupport from "./pages/HelpAndSupport";
import Login from "./pages/Login";


function RequireAuth({ children }) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function HomePage() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <RequireAuth>
              <div className="flex h-screen text-gray-800" style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 100%)" }}>
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 p-8 space-y-10 overflow-y-auto">
                    <Routes>
                      <Route path="/modules" element={<LearningModules />} />
                      <Route path="/ai-toolkit" element={<AIToolkit />} />
                      <Route path="/gpt-practice" element={<ChatGPTPractice />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/" element={<Home />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Setting />} />
                      <Route path="/help-support" element={<HelpAndSupport />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}
