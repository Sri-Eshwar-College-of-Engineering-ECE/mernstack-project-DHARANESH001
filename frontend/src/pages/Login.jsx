import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { RiFlashlightLine, RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(form, rememberMe);
      toast.success("Welcome back! 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb--1" />
        <div className="auth-orb auth-orb--2" />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-logo">
          <div className="auth-logo-icon"><RiFlashlightLine /></div>
          <span>Skill<strong>Forge</strong></span>
        </div>

        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Email address</label>
            <div className="auth-input-wrap">
              <RiMailLine className="auth-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <RiLockLine className="auth-input-icon" />
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPwd((p) => !p)}
              >
                {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          <div className="auth-row">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup">Create one free</Link>
        </p>

        <div className="auth-back">
          <Link to="/">← Back to home</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
