import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import DashboardLayout from "../components/layout/DashboardLayout";
import { skillService } from "../services/skillService";
import { getCategoryColor } from "../utils/helpers";
import "./Analytics.css";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#3b82f6", "#14b8a6", "#94a3b8"];

const Analytics = () => {
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, statsRes] = await Promise.all([
          skillService.getSkills({ limit: 100 }), // get up to 100 skills for charts
          skillService.getStats()
        ]);
        setSkills(skillsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <DashboardLayout><div className="dashboard-loading"><div className="auth-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} /></div></DashboardLayout>;
  }

  // Prepare data for charts
  const categoryData = stats?.categoryDist?.map(c => ({ name: c._id, value: c.count })) || [];

  const topSkillsData = [...skills]
    .sort((a, b) => b.currentLevel - a.currentLevel)
    .slice(0, 10)
    .map(s => ({ name: s.name, Level: s.currentLevel, fill: getCategoryColor(s.category) }));

  const radarData = stats?.categoryDist?.slice(0, 6).map(c => ({
    subject: c._id, count: c.count, fullMark: Math.max(...stats.categoryDist.map(x => x.count)) + 2,
  })) || [];

  const progressData = [...skills]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((s, i) => ({ name: `Skill ${i + 1}`, Progress: s.progress }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="analytics-tooltip">
          <p className="label">{label || payload[0].name}</p>
          <p className="value">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Analytics & Insights</h1>
            <p className="page-subtitle">Visualize your learning progress and skill distribution.</p>
          </div>
        </div>

        <div className="analytics-grid">
          {/* Top Skills Bar Chart */}
          <motion.div className="analytics-card wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3>Top 10 Skills by Level</h3>
            {topSkillsData.length > 0 ? (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSkillsData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="Level" radius={[4, 4, 0, 0]}>
                      {topSkillsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="analytics-empty">Not enough data to display.</p>}
          </motion.div>

          {/* Category Distribution Pie */}
          <motion.div className="analytics-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3>Category Distribution</h3>
            {categoryData.length > 0 ? (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="value">
                      {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="analytics-empty">Not enough data to display.</p>}
          </motion.div>

          {/* Skill Radar */}
          <motion.div className="analytics-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3>Category Mastery</h3>
            {radarData.length > 0 ? (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(148,163,184,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Radar name="Skills" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                    <RechartsTooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="analytics-empty">Not enough data to display.</p>}
          </motion.div>

          {/* Progress Timeline */}
          <motion.div className="analytics-card wide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3>Overall Progress Timeline</h3>
            {progressData.length > 0 ? (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="Progress" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="analytics-empty">Not enough data to display.</p>}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
