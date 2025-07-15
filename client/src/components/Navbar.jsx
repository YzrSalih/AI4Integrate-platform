import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">AI4Integrate</div>
        <div className="flex items-center gap-4">
          <select className="border rounded px-2 py-1 text-sm">
            <option value="en">EN</option>
            <option value="tr">TR</option>
            <option value="pl">PL</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
