// src/pages/Welcome.jsx

import React from 'react';
import Navbar from "../components/Navbar";

export default function Welcome() {
  return (
    <div className="welcome">
      <Navbar />
      <main className="welcome-main">
        <h1>
          Write with purpose & <br />
          Read with curiosity.
        </h1>
        <button>Get Start</button>
      </main>
      <footer>
        © 2023 Blogger's Haven.
      </footer>
    </div>
  );
}
