// src/components/SignUpForm/SignUpForm.jsx

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import './SignUpForm.css'; // <-- shared styles

import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
  });

  const { username, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate('/profile');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className="auth-container">
      <h1 className="auth-title">Sign Up</h1>

      {message && <p className="error-message">{message}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          name="username"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          name="password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConf}
          name="passwordConf"
          onChange={handleChange}
          required
        />

        <button className="auth-btn" disabled={isFormInvalid()}>
          Sign Up
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/sign-in">Sign In</Link>
      </p>
    </main>
  );
};

export default SignUpForm;
