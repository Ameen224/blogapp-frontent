// src/components/Navbar.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignupModal from './SignupModal';
import  api  from "../utils/api"
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/user/logout", {
        withCredentials: true,
      });
      dispatch(logout());
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleGetStarted = () => {
    setShowModal(true);
  };

  return (
    <>
      <nav className="flex justify-between items-center p-8 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Readflow.</h1>
        <div className="flex gap-4 items-center">
          <span className="text-base">📝 Write</span>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full font-bold"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleGetStarted}
              className="bg-[#90cdf4] text-black px-4 py-2 rounded-full font-bold"
            >
              Get Started
            </button>
          )}
        </div>
      </nav>

      {showModal && <SignupModal onClose={() => setShowModal(false)} />}
    </>
  );
}
