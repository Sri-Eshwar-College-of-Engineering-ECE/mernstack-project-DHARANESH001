import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiFlashlightLine, RiArrowRightLine, RiBarChartLine,
  RiBrainLine, RiAwardLine, RiShieldCheckLine, RiGithubLine,
  RiLinkedinLine, RiCodeLine, RiRocketLine, RiStarLine,
} from "react-icons/ri";
import "./Landing.css";

const stats = [
  { value: "10K+", label: "Skills Tracked" },
  { value: "2.5K+", label: "Active Users" },
  { value: "98%", label: "Satisfaction" },
  { value: "500+", label: "Certificates" },
];

const features = [
  {
    icon: <RiBrainLine />,
    title: "Smart Skill Tracking",
    desc: "Track your progress with detailed metrics, levels, and visual progress indicators.",
    color: "#6366f1",
  },
  {
    icon: <RiBarChartLine />,
    title: "Advanced Analytics",
    desc: "Beautiful charts showing your learning trends, category distribution, and growth over time.",
    color: "#06b6d4",
  },
  {
    icon: <RiAwardLine />,
    title: "Certificate Manager",
    desc: "Upload, preview, and manage all your certificates in one professional dashboard.",
    color: "#22c55e",
  },
  {
    icon: <RiRocketLine />,
    title: "Goal Setting",
    desc: "Set target levels, deadlines, and priorities to stay on track with your learning journey.",
    color: "#8b5cf6",
  },
  {
    icon: <RiShieldCheckLine />,
    title: "Secure & Private",
    desc: "JWT authentication and bcrypt encryption keeps your data safe and private.",
    color: "#f59e0b",
  },
  {
    icon: <RiCodeLine />,
    title: "Developer-First",
    desc: "Built by developers for developers. Track Programming, DevOps, AI/ML, and more.",
    color: "#ef4444",
  },
];

const testimonials = [
  {
    name: "Arjun Sharma",
    role: "Full Stack Developer",
    text: "SkillForge completely changed how I track my learning. The analytics are insane!",
    avatar: "AS",
    color: "#6366f1",
  },
  {
    name: "Priya Patel",
    role: "DevOps Engineer",
    text: "Finally a skill tracker that looks premium and works perfectly. 10/10.",
    avatar: "PP",
    color: "#8b5cf6",
  },
  {
    name: "Rahul Kumar",
    role: "ML Engineer",
    text: "The certificate management feature is exactly what I needed for my portfolio.",
    avatar: "RK",
    color: "#06b6d4",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing__nav">
        <div className="landing__nav-inner">
          <div className="landing__logo">
            <div className="landing__logo-icon"><RiFlashlightLine /></div>
            <span>Skill<strong>Forge</strong></span>
          </div>
          <div className="landing__nav-links">
            <a href="#features">Features</a>
            <a href="#stats">Stats</a>
            <a href="#testimonials">Reviews</a>
          </div>
          <div className="landing__nav-actions">
            <button className="btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Get Started <RiArrowRightLine />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__hero-bg">
          <div className="landing__orb landing__orb--1" />
          <div className="landing__orb landing__orb--2" />
          <div className="landing__orb landing__orb--3" />
        </div>

        <motion.div
          className="landing__hero-content"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.div className="landing__badge" variants={fadeUp}>
            <RiStarLine /> Professional Skill Tracking Platform
          </motion.div>

          <motion.h1 className="landing__hero-title" variants={fadeUp}>
            Master Your Skills.<br />
            <span className="gradient-text">Build Your Future.</span>
          </motion.h1>

          <motion.p className="landing__hero-desc" variants={fadeUp}>
            SkillForge is the premium skill management platform for developers and professionals.
            Track progress, visualize growth, manage certificates, and showcase your expertise.
          </motion.p>

          <motion.div className="landing__hero-actions" variants={fadeUp}>
            <button className="btn-hero-primary" onClick={() => navigate("/signup")}>
              Start for Free <RiArrowRightLine />
            </button>
            <button className="btn-hero-secondary" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </motion.div>

          {/* Mini skill graph */}
          <motion.div className="landing__skill-preview" variants={fadeUp}>
            {[
              { name: "React", level: 85, color: "#06b6d4" },
              { name: "Node.js", level: 72, color: "#22c55e" },
              { name: "Python", level: 60, color: "#f59e0b" },
              { name: "DevOps", level: 48, color: "#8b5cf6" },
              { name: "AI/ML", level: 35, color: "#6366f1" },
            ].map((skill, i) => (
              <div key={skill.name} className="landing__skill-bar-row">
                <span className="landing__skill-bar-label">{skill.name}</span>
                <div className="landing__skill-bar-track">
                  <motion.div
                    className="landing__skill-bar-fill"
                    style={{ background: skill.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: 0.8 + i * 0.12, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <span className="landing__skill-bar-pct">{skill.level}%</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="landing__stats" id="stats">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="landing__stat"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="landing__stat-value">{s.value}</div>
            <div className="landing__stat-label">{s.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Features */}
      <section className="landing__features" id="features">
        <motion.div
          className="landing__section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Everything you need to <span className="gradient-text">grow faster</span></h2>
          <p>A complete toolkit for tracking, analyzing, and showcasing your skills.</p>
        </motion.div>

        <div className="landing__features-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="landing__feature-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
            >
              <div className="landing__feature-icon" style={{ background: `${f.color}22`, color: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing__testimonials" id="testimonials">
        <motion.div
          className="landing__section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Loved by <span className="gradient-text">developers</span></h2>
          <p>Join thousands of professionals already using SkillForge.</p>
        </motion.div>

        <div className="landing__testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="landing__testimonial-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
            >
              <p className="landing__testimonial-text">"{t.text}"</p>
              <div className="landing__testimonial-author">
                <div className="landing__testimonial-avatar" style={{ background: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="landing__testimonial-name">{t.name}</p>
                  <p className="landing__testimonial-role">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing__cta">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="landing__cta-card"
        >
          <h2>Ready to forge your skills?</h2>
          <p>Join 2,500+ professionals tracking their growth with SkillForge.</p>
          <button className="btn-hero-primary" onClick={() => navigate("/signup")}>
            Get Started Free <RiArrowRightLine />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__footer-inner">
          <div className="landing__logo">
            <div className="landing__logo-icon"><RiFlashlightLine /></div>
            <span>Skill<strong>Forge</strong></span>
          </div>
          <p className="landing__footer-copy">
            © 2024 SkillForge. Built with ❤️ for developers.
          </p>
          <div className="landing__footer-social">
            <a href="#" title="GitHub"><RiGithubLine /></a>
            <a href="#" title="LinkedIn"><RiLinkedinLine /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
