import { useContext } from 'react';
import { Link } from 'react-router';
import './NavBar.css';
import { UserContext } from '../../contexts/UserContext';
import logo from "../../../public/images/Logo.png";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);   // <-- this now triggers a re-render
  };

  return (
    <nav className="sidebar">
      <div className="logo-section">
        <img src={logo} alt="ApplyWise logo" />
      </div>

      <ul>
        {user ? (
          <>
            <li>Welcome, {user.username}</li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/add-application">Add Application</Link></li>

            <li>
              <button className="signout-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
          <div className="info">
          <p>Searching for a job can feel overwhelming, so ApplyWise brings everything together in one place. You can save roles, follow your progress, and keep all documents neatly arranged. With built-in AI support, you can also:</p>
          <ul>
            <li>Summarize job descriptions for quicker understanding</li>
            <li>Generate personalised cover letters</li>
            <li>Receive feedback to improve your CV</li>
            <li>Extract important keywords and required skills</li>
            <li>Prepare with tailored interview questions</li>
          </ul>
          <p>Whether you’re applying to your first role or managing multiple applications at once, ApplyWise helps you stay focused, organised, and ready for the next step of your career.</p>
          </div>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
