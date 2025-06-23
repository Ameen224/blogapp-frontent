// src/pages/Welcome.jsx

import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SignupModal from '../components/SignupModal';

export default function Welcome() {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
        if(!user.name||!user.category){
            navigate("/profile-setup")
        }else{
             navigate('/');
        }
     
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      
      <main className="flex flex-col items-center text-center mt-32 px-8">
        <h1 className="text-5xl font-bold leading-tight mb-8">
          Write with purpose & <br />
          Read with curiosity.
        </h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#90cdf4] text-black px-8 py-3 rounded-full font-semibold text-lg"
        >
          Get Started
        </button>
      </main>
      
      <footer className="text-center mt-32 text-gray-500 text-sm py-4">
        © 2023 Blogger's Haven.
      </footer>

      {showModal && <SignupModal onClose={() => setShowModal(false)} />}
    </div>
  );
}