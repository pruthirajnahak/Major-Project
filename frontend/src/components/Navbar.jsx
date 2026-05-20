import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="nav-logo">
        <CheckSquare size={26} strokeWidth={2.5} />
        <span>TaskFlow</span>
      </Link>

      <div className="nav-user">
        {user ? (
          <>
            <div className="user-profile">
              <div className="avatar" title={user.name}>
                {getInitials(user.name)}
              </div>
              <span className="username" style={{ display: 'none', md: 'inline' }}>
                {user.name}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-icon" title="Logout">
              <LogOut size={16} />
              <span style={{ fontSize: '0.85rem' }}>Sign Out</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '0.85rem' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '0.85rem' }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
