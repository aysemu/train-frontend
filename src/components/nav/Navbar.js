// src/components/layout/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ handleLogout }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="navbar">
      <div className="nav-logo" style={{color: '#38bdf8', fontWeight: 'bold'}}>
        E5000 TELEMETRİ
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>Harita</Link>
        <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>Profil</Link>
        <Link to="/reports" className="nav-item">Raporlar</Link>
      </div>
      <button onClick={handleLogout} className="logout-btn-small">Çıkış</button>
    </nav>
  );
};

export default Navbar;