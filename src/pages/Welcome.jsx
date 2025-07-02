// src/pages/Welcome.jsx 

import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SignupModal from '../components/SignupModal';

export default function Welcome() {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for auth errors in URL
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'auth_failed':
          setAuthError('Authentication failed. Please try again.');
          break;
        case 'no_user':
          setAuthError('No user information received. Please try again.');
          break;
        case 'server_error':
          setAuthError('Server error occurred. Please try again later.');
          break;
        case 'processing_failed':
          setAuthError('Failed to process authentication. Please try again.');
          break;
        default:
          setAuthError('An error occurred during authentication.');
      }
      
      // Clear error from URL after showing it
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (!user.name || !user.category) {
        navigate("/profile-setup");
      } else {
        navigate('/home');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      
      <main className="flex flex-col items-center text-center mt-32 px-8">
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-md">
            {authError}
            <button
              onClick={() => setAuthError('')}
              className="ml-2 text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        )}
        
        <h1 className="text-5xl font-bold leading-tight mb-8">
          Write with purpose & <br />
          Read with curiosity.
        </h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#90cdf4] text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#7cc0e8] transition"
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