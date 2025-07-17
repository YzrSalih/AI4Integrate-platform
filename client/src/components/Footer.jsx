import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full text-sm text-gray-400 border-t pt-4 flex flex-col items-center gap-2 mt-auto">
      <div className="flex gap-6 justify-center mb-1">
        <a href="https://github.com/YzrSalih" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors"><FaGithub size={24} /></a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors"><FaTwitter size={24} /></a>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors"><FaLinkedin size={24} /></a>
      </div>
      <span>© 2025 AI4Integrate. All rights reserved.</span>
    </footer>
  );
}
