// src/components/SignInForm/SignInForm.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import './SignInForm.css';

import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="signin-container">
      <h1 className="signin-title">Sign In</h1>

      {message && <p className="error-message">{message}</p>}

      <form className="signin-form" autoComplete="off" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          id="username"
          value={formData.username}
          name="username"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Password"
          id="password"
          value={formData.password}
          name="password"
          onChange={handleChange}
          required
        />

        <button className="signin-btn">Sign In</button>
      </form>

      <p className="signup-text">
        Don’t have an account? <Link to="/sign-up">Sign up</Link>
      </p>
    </main>
  );
};

export default SignInForm;

