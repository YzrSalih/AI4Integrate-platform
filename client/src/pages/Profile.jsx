import React from "react";
import { FaUserCircle, FaMedal, FaCertificate } from "react-icons/fa";

// Simulated user data
const user = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  role: "Learner",
  certificates: [
    { title: "AI Fundamentals", date: "2025-06-10" },
    { title: "AI in Daily Life", date: "2025-07-01" }
  ],
  badges: [
    { icon: <FaMedal className="text-yellow-400 drop-shadow-lg" />, label: "Starter" },
    { icon: <FaMedal className="text-blue-400 drop-shadow-lg" />, label: "Active Learner" },
    { icon: <FaMedal className="text-green-400 drop-shadow-lg" />, label: "AI Explorer" }
  ]
};

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center py-12 px-4">
      {/* Profile Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-blue-100 mb-10">
        <FaUserCircle className="text-blue-500 text-7xl mb-4 drop-shadow-lg" />
        <div className="text-3xl font-extrabold text-blue-800 mb-1">{user.name}</div>
        <div className="text-gray-500 text-lg mb-2">{user.email}</div>
        <span className="bg-blue-100 text-blue-700 font-semibold px-4 py-1 rounded-full text-sm mb-4">{user.role}</span>
      </div>

      {/* Certificates Section */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-blue-100 mb-10">
        <div className="flex items-center mb-4">
          <FaCertificate className="text-indigo-500 text-2xl mr-2" />
          <span className="text-xl font-bold text-gray-700">Certificates</span>
        </div>
        {user.certificates.length === 0 ? (
          <div className="text-gray-400 text-center">No certificates yet.</div>
        ) : (
          <ul className="space-y-3">
            {user.certificates.map((cert) => (
              <li key={cert.title} className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 shadow border border-blue-100">
                <span className="font-semibold text-gray-700">{cert.title}</span>
                <span className="text-gray-500 text-sm">{cert.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Badges Section */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-blue-100 mb-10">
        <div className="flex items-center mb-4">
          <FaMedal className="text-yellow-400 text-2xl mr-2" />
          <span className="text-xl font-bold text-gray-700">Badges</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {user.badges.map((badge) => (
            <div
              key={badge.label}
              className="flex flex-col items-center bg-blue-50 rounded-xl shadow p-4 border border-blue-100 hover:bg-blue-100 transition"
            >
              <div className="text-3xl mb-1">{badge.icon}</div>
              <div className="text-sm font-semibold text-gray-700">{badge.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
