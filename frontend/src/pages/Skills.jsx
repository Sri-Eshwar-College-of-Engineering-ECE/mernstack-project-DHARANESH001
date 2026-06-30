import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiAddLine, RiSearchLine, RiFilterLine, RiGridLine,
  RiListCheck, RiRefreshLine, RiDownloadLine,
} from "react-icons/ri";
import DashboardLayout from "../components/layout/DashboardLayout";
import SkillCard from "../components/skills/SkillCard";
import SkillForm from "../components/skills/SkillForm";
import { skillService } from "../services/skillService";
import { getErrorMessage } from "../utils/helpers";
import "./Skills.css";

const CATEGORIES = [
  "All", "Programming", "Frontend", "Backend", "Database",
  "DevOps", "Cloud", "AI/ML", "Tools", "Soft Skills", "Others",
];
const STATUSES = ["All", "Not Started", "Learning", "Completed", "On Hold"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest-level", label: "Highest Level" },
  { value: "lowest-level", label: "Lowest Level" },
  { value: "deadline", label: "By Deadline" },
  { value: "alphabetical", label: "A → Z" },
  { value: "progress", label: "Most Progress" },
];

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSkill, setEditSkill] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    search: "", category: "", status: "", sortBy: "newest",
  });

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== "All") params.category = filters.category;
      if (filters.status && filters.status !== "All") params.status = filters.status;
      params.sortBy = filters.sortBy;
      const res = await skillService.getSkills(params);
      setSkills(res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(fetchSkills, 300);
    return () => clearTimeout(t);
  }, [fetchSkills]);

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await skillService.updateSkill(id, formData);
        toast.success("Skill updated!");
      } else {
        await skillService.createSkill(formData);
        toast.success("Skill added!");
      }
      fetchSkills();
      setShowForm(false);
      setEditSkill(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      await skillService.deleteSkill(id);
      toast.success("Skill deleted");
      fetchSkills();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleLevel = async (id, dir) => {
    try {
      if (dir === "up") await skillService.increaseLevel(id);
      else await skillService.decreaseLevel(id);
      fetchSkills();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleFavorite = async (id) => {
    try {
      await skillService.toggleFavorite(id);
      fetchSkills();
    } catch {}
  };

  const handleEdit = (skill) => {
    setEditSkill(skill);
    setShowForm(true);
  };

  const setFilter = (key, val) => setFilters((p) => ({ ...p, [key]: val }));

  return (
    <DashboardLayout>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Skills</h1>
            <p className="page-subtitle">{skills.length} skill{skills.length !== 1 ? "s" : ""} tracked</p>
          </div>
          <div className="skills-header-actions">
            <button className="skills-icon-btn" onClick={fetchSkills} title="Refresh">
              <RiRefreshLine />
            </button>
            <button
              className="dash-btn-primary"
              onClick={() => { setEditSkill(null); setShowForm(true); }}
            >
              <RiAddLine /> Add Skill
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="skills-filters">
          <div className="skills-search-wrap">
            <RiSearchLine />
            <input
              type="text"
              placeholder="Search skills..."
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              className="skills-search"
            />
          </div>

          <select
            className="skills-select"
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
          >
            {CATEGORIES.map((c) => <option key={c} value={c === "All" ? "" : c}>{c}</option>)}
          </select>

          <select
            className="skills-select"
            value={filters.status}
            onChange={(e) => setFilter("status", e.target.value)}
          >
            {STATUSES.map((s) => <option key={s} value={s === "All" ? "" : s}>{s}</option>)}
          </select>

          <select
            className="skills-select"
            value={filters.sortBy}
            onChange={(e) => setFilter("sortBy", e.target.value)}
          >
            {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <div className="skills-view-toggle">
            <button
              className={`skills-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            ><RiGridLine /></button>
            <button
              className={`skills-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            ><RiListCheck /></button>
          </div>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="skills-skeleton-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <motion.div
            className="skills-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="skills-empty-icon">🧠</div>
            <h3>No skills found</h3>
            <p>Add your first skill to start tracking your progress</p>
            <button className="dash-btn-primary" onClick={() => { setEditSkill(null); setShowForm(true); }}>
              <RiAddLine /> Add Your First Skill
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className={viewMode === "grid" ? "skills-grid" : "skills-list"}>
              {skills.map((skill, i) => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
                  index={i}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLevelUp={() => handleLevel(skill._id, "up")}
                  onLevelDown={() => handleLevel(skill._id, "down")}
                  onFavorite={() => handleFavorite(skill._id)}
                  onRefresh={fetchSkills}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Skill Form Modal */}
      <AnimatePresence>
        {showForm && (
          <SkillForm
            skill={editSkill}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditSkill(null); }}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Skills;
