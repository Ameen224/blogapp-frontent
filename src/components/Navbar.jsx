// src/components/Navbar.jsx
import React from 'react';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);

  return (
    <nav className=" flex justify-between items-center p-8 border-b border-gray-700">
      <h1 className="text-2xl font-bold">Readflow.</h1>
      <div className="flex gap-4 items-center">
        <span className="text-base">📝 Write</span>
        <button className="bg-[#90cdf4] text-black px-4 py-2 rounded-full font-bold">
          Get started
        </button>
        
      </div>
    </nav>
  );
}
