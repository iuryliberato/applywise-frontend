// src/components/NavBar/NavBar.jsx
import { useContext, useState } from 'react';
import { NavLink, Link } from 'react-router';
import './NavBar.css';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Brand */}
        <Link to="/dashboard" className="brand" onClick={closeMenu}>
          <p className="logo">Applio/</p>
        </Link>

        {/* BURGER BUTTON (MOBILE) */}
        <button
          className={`burger ${isOpen ? "burger--open" : ""}`}
          onClick={() => setIsOpen(prev => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* NAV LINKS */}
        <nav className={`nav-links ${isOpen ? "nav-links--open" : ""}`}>

          {user && (
            <>
              <NavLink
                to="/dashboard"
                end
                onClick={closeMenu}
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link--active' : '')
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/profile"
                onClick={closeMenu}
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link--active' : '')
                }
              >
                Profile
              </NavLink>

              <NavLink
                to="/add-application"
                onClick={closeMenu}
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link--active' : '')
                }
              >
                <span className="plus">+</span>Application
              </NavLink>

              <button
                className="nav-link nav-link--ghost signout-btn"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          )}

          {!user && (
            <>
              <NavLink
                to="/sign-in"
                onClick={closeMenu}
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link--active' : '')
                }
              >
                Sign In
              </NavLink>

              <NavLink
                to="/sign-up"
                onClick={closeMenu}
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link--active' : '')
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
