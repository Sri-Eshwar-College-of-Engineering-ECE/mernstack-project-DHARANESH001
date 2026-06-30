import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiCalendarEventLine, RiTimeLine, RiCheckboxCircleLine } from "react-icons/ri";
import DashboardLayout from "../components/layout/DashboardLayout";
import { skillService } from "../services/skillService";
import { formatDate, getCategoryColor, daysUntil, isOverdue } from "../utils/helpers";
import "./Calendar.css";

const Calendar = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await skillService.getSkills({ limit: 1000 });
        // Filter skills with target dates and sort by date ascending
        const withDates = res.data
          .filter(s => s.targetDate && s.status !== "Completed")
          .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
        setSkills(withDates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const overdueSkills = skills.filter(s => isOverdue(s.targetDate, s.status));
  const upcomingSkills = skills.filter(s => !isOverdue(s.targetDate, s.status));

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Calendar & Deadlines</h1>
            <p className="page-subtitle">Track your upcoming target dates and learning milestones.</p>
          </div>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="auth-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
          </div>
        ) : skills.length === 0 ? (
          <motion.div className="cal-empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <RiCalendarEventLine className="cal-empty-icon" />
            <h3>No Active Deadlines</h3>
            <p>Set target dates on your skills to see them here.</p>
          </motion.div>
        ) : (
          <div className="cal-content">
            
            {overdueSkills.length > 0 && (
              <motion.div className="cal-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="cal-section-title overdue-title"><RiTimeLine /> Overdue</h2>
                <div className="cal-list">
                  {overdueSkills.map(skill => (
                    <div key={skill._id} className="cal-item overdue-item">
                      <div className="cal-item-color" style={{ background: getCategoryColor(skill.category) }} />
                      <div className="cal-item-info">
                        <h3>{skill.name}</h3>
                        <p>{skill.category} • Target: {formatDate(skill.targetDate)}</p>
                      </div>
                      <div className="cal-item-status overdue-text">⚠️ Overdue</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {upcomingSkills.length > 0 && (
              <motion.div className="cal-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="cal-section-title"><RiCalendarEventLine /> Upcoming Deadlines</h2>
                <div className="cal-list">
                  {upcomingSkills.map(skill => {
                    const days = daysUntil(skill.targetDate);
                    return (
                      <div key={skill._id} className="cal-item">
                        <div className="cal-item-color" style={{ background: getCategoryColor(skill.category) }} />
                        <div className="cal-item-info">
                          <h3>{skill.name}</h3>
                          <p>{skill.category} • Target: {formatDate(skill.targetDate)}</p>
                        </div>
                        <div className={`cal-item-status ${days <= 3 ? "urgent-text" : "normal-text"}`}>
                          {days === 0 ? "Today" : `${days} days left`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
