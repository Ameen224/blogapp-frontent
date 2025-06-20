// src/components/Navbar.jsx
import React from 'react';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);

  return (
    <nav className="navbar">
      <h1>Readflow.</h1>
      <div className="actions">
        <span>{'📝 Write'}</span>
        <button>Get started</button>
      </div>
    </nav>
  );
}
