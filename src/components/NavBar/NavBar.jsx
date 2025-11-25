// src/components/NavBar/NavBar.jsx
import { useContext } from 'react';
import { NavLink, Link } from 'react-router'; // or react-router-dom if you're using that
import './NavBar.css';
import { UserContext } from '../../contexts/UserContext';
import logo from '../../../public/images/Logo.png';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand / logo */}
        <Link to="/" className="brand">
          <img src={logo} alt="ApplyWise logo" className="brand-logo" />
        </Link>

        {/* Right-side links */}
        <nav className="nav-links">
          {/* Show these only when logged in */}
          {user && (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link--active' : '')
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link--active' : '')
                }
              >
                Profile
              </NavLink>
              <NavLink
                to="/add-application"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link--active' : '')
                }
              >
                Add Application
              </NavLink>

              <NavLink
               to="/"
                type="button"
                className="nav-link nav-link--ghost"
                onClick={handleSignOut}
              >
                Sign Out
              </NavLink>
            </>
          )}

          {/* When signed out, simple Sign In / Sign Up */}
          {!user && (
            <>
              <NavLink
                to="/sign-in"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link--active' : '')
                }
              >
                Sign In
              </NavLink>
              <NavLink
                to="/sign-up"
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
