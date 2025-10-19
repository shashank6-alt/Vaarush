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
