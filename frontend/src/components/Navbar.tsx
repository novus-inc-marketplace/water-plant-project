import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/about', label: 'About Project' },
    { path: '/tools', label: 'Tools & Formulas' },
    { path: '/reports', label: 'Reports' },
    { path: '/docs', label: 'API Docs' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={() => setOpen(false)}>
          💧 Water Quality Treatment
        </Link>
        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>
      <ul className={`navbar-links ${open ? 'open' : ''}`}>
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
