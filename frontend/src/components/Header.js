// Header.js (after commit 1)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
export default function Header() {
  return <header className="header"></header>;
}
// Header.js (after commit 2)

export default function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <span className="logo">
          <span className="logo--accent">V</span>aarush
        </span>
      </div>
    </header>
  );
}
// Header.js (after commit 3)
const navItems = [
  { name: 'Home', to: '/' },
  { name: 'Create Will', to: '/create' },
  { name: 'Dashboard', to: '/dashboard' },
];
export default function Header() {
  const location = useLocation();
  return (
    <header className="header">
      <div className="header__left">
        <span className="logo"><span className="logo--accent">V</span>aarush</span>
        <nav className="nav">
          {navItems.map(({ name, to }) => (
            <Link
              key={to}
              to={to}
              className={
                location.pathname === to
                  ? 'nav__link nav__link--active'
                  : 'nav__link'
              }
            >
              {name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

