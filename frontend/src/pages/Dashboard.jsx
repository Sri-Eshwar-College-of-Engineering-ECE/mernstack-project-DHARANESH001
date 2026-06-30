import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiBrainLine, RiCheckboxCircleLine, RiLoaderLine,
  RiAwardLine, RiAlertLine, RiTimeLine, RiTrophyLine,
  RiArrowRightLine, RiAddLine, RiArrowUpLine,
} from "react-icons/ri";
import DashboardLayout from "../components/layout/DashboardLayout";
import { skillService } from "../services/skillService";
import { useAuth } from "../context/AuthContext";
import { formatDate, getCategoryColor, getStatusColor, daysUntil } from "../utils/helpers";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip,
} from "recharts";
import "./Dashboard.css";

const StatCard = ({ icon, label, value, sub, color, delay = 0 }) => (
  <motion.div
    className="stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
  >
    <div className="stat-card__icon" style={{ background: `${color}22`, color }}>
      {icon}
    </div>
    <div className="stat-card__body">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {sub && <p className="stat-card__sub">{sub}</p>}
    </div>
  </motion.div>
);

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6", "#94a3b8"];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await skillService.getStats();
        setStats(res.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const overview = stats?.overview || {};
  const categoryData = stats?.categoryDist?.map((c) => ({ name: c._id, value: c.count })) || [];
  const radarData = stats?.categoryDist?.slice(0, 6).map((c) => ({
    subject: c._id, count: c.count, fullMark: Math.max(...(stats?.categoryDist?.map((x) => x.count) || [1])) + 2,
  })) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-loading">
          <div className="auth-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Good morning, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="page-subtitle">Here's your learning overview for today.</p>
          </div>
          <button className="dash-btn-primary" onClick={() => navigate("/skills")}>
            <RiAddLine /> Add Skill
          </button>
        </div>

        {/* Stat Cards */}
        <div className="dashboard-stats">
          <StatCard icon={<RiBrainLine />} label="Total Skills" value={overview.total || 0}
            sub="All tracked skills" color="#6366f1" delay={0} />
          <StatCard icon={<RiCheckboxCircleLine />} label="Completed" value={overview.completed || 0}
            sub={`${overview.completionRate || 0}% completion rate`} color="#22c55e" delay={0.05} />
          <StatCard icon={<RiLoaderLine />} label="In Progress" value={overview.learning || 0}
            sub="Actively learning" color="#06b6d4" delay={0.1} />
          <StatCard icon={<RiTimeLine />} label="Avg Level" value={`${overview.avgLevel || 0}/10`}
            sub={`${overview.avgProgress || 0}% avg progress`} color="#8b5cf6" delay={0.15} />
          <StatCard icon={<RiAwardLine />} label="Certificates" value={overview.withCertificate || 0}
            sub="Earned certificates" color="#f59e0b" delay={0.2} />
          <StatCard icon={<RiAlertLine />} label="Overdue" value={stats?.overdueSkills?.length || 0}
            sub="Need attention" color="#ef4444" delay={0.25} />
        </div>

        {/* Charts Row */}
        <div className="dashboard-charts">
          {/* Pie Chart */}
          <motion.div
            className="dashboard-chart-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="chart-header">
              <h3>Category Distribution</h3>
            </div>
            {categoryData.length > 0 ? (
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                      paddingAngle={3} dataKey="value">
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#1e293b", border: "1px solid rgba(148,163,184,0.1)", borderRadius: 10, color: "#f1f5f9" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-legend">
                  {categoryData.slice(0, 5).map((c, i) => (
                    <div key={c.name} className="chart-legend-item">
                      <span className="chart-legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                      <span>{c.name}</span>
                      <span className="chart-legend-val">{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="chart-empty">Add skills to see distribution</div>
            )}
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            className="dashboard-chart-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="chart-header">
              <h3>Skill Radar</h3>
            </div>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(148,163,184,0.15)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Radar name="Skills" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">Add skills across categories</div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="dashboard-chart-card dashboard-chart-card--wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="chart-header">
              <h3>Recent Activity</h3>
              <button className="chart-view-all" onClick={() => navigate("/skills")}>
                View All <RiArrowRightLine />
              </button>
            </div>
            <div className="activity-list">
              {stats?.recentSkills?.length > 0 ? stats.recentSkills.map((skill) => (
                <div key={skill._id} className="activity-item">
                  <div className="activity-dot" style={{ background: getCategoryColor(skill.category) }} />
                  <div className="activity-info">
                    <p className="activity-name">{skill.name}</p>
                    <p className="activity-meta">{skill.category} · Level {skill.currentLevel}</p>
                  </div>
                  <div className="activity-right">
                    <span
                      className="activity-status"
                      style={{ background: `${getStatusColor(skill.status)}22`, color: getStatusColor(skill.status) }}
                    >
                      {skill.status}
                    </span>
                    <div className="activity-progress-bar">
                      <div style={{ width: `${skill.progress}%`, background: getCategoryColor(skill.category) }} />
                    </div>
                    <span className="activity-pct">{skill.progress}%</span>
                  </div>
                </div>
              )) : (
                <div className="chart-empty">No skills yet. <button onClick={() => navigate("/skills")}>Add your first skill →</button></div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Deadlines */}
        {stats?.upcomingDeadlines?.length > 0 && (
          <motion.div
            className="dashboard-deadlines"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="chart-header">
              <h3><RiTimeLine /> Upcoming Deadlines</h3>
              <button className="chart-view-all" onClick={() => navigate("/calendar")}>
                View Calendar <RiArrowRightLine />
              </button>
            </div>
            <div className="deadlines-list">
              {stats.upcomingDeadlines.map((skill) => {
                const days = daysUntil(skill.targetDate);
                return (
                  <div key={skill._id} className="deadline-item">
                    <div className="deadline-priority" style={{ background: getCategoryColor(skill.category) }} />
                    <div className="deadline-info">
                      <p className="deadline-name">{skill.name}</p>
                      <p className="deadline-date">{formatDate(skill.targetDate)}</p>
                    </div>
                    <div className={`deadline-days ${days <= 3 ? "deadline-days--urgent" : ""}`}>
                      {days}d left
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
