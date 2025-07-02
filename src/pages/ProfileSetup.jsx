// src/pages/ProfileSetup.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import api from '../utils/api'


export default function ProfileSetup() {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/profile", { name, category });
       navigate("/"); 
      
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
     <Navbar />
        
      <h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Your name"
          className="w-full p-3 mb-4 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        >
          <option value="">Select a category</option>
          <option value="tech">Tech</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="education">Education</option>
        </select>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded"
        >
          Save and Continue
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
