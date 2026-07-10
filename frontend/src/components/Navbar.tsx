import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

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
        <Link to="/">💧 Water Quality Treatment</Link>
      </div>
      <ul className="navbar-links">
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
