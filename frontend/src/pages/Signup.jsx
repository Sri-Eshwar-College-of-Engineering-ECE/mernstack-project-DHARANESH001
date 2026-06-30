import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiFlashlightLine, RiEyeLine, RiEyeOffLine,
  RiMailLine, RiLockLine, RiUserLine,
} from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";
import "./Auth.css";

const getPasswordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "#ef4444", "#f59e0b", "#06b6d4", "#22c55e"];

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success("Account created! Welcome to SkillForge 🚀");
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
          <h1>Create account</h1>
          <p>Start tracking your skills professionally</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Full name</label>
            <div className="auth-input-wrap">
              <RiUserLine className="auth-input-icon" />
              <input type="text" name="name" placeholder="John Doe"
                value={form.name} onChange={handleChange} className="auth-input" />
            </div>
          </div>

          <div className="auth-field">
            <label>Email address</label>
            <div className="auth-input-wrap">
              <RiMailLine className="auth-input-icon" />
              <input type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} className="auth-input" />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <RiLockLine className="auth-input-icon" />
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowPwd((p) => !p)}>
                {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
            {form.password && (
              <div className="auth-strength">
                <div className="auth-strength-bars">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="auth-strength-bar"
                      style={{ background: i <= strength ? strengthColors[strength] : "var(--border)" }}
                    />
                  ))}
                </div>
                <span style={{ color: strengthColors[strength], fontSize: 12 }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <div className="auth-field">
            <label>Confirm password</label>
            <div className="auth-input-wrap">
              <RiLockLine className="auth-input-icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
        <div className="auth-back">
          <Link to="/">← Back to home</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
