import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();


    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.email === trimmedEmail && user.password === trimmedPassword);
    if (user) {
      alert('Login successful!');
      navigate('/skills');
    } else {
      setErrorMessage('Invalid email or password');
    }
  };
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

export default Login;
