// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h1 className="text-3xl font-bold">Welcome to Readflow 🎉</h1>
        <p className="mt-4">This is your dashboard/homepage.</p>
      </main>
    </div>
  );
}
