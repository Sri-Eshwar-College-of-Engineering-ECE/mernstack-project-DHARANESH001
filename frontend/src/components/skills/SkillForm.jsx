import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiCloseLine, RiSaveLine, RiAddLine } from "react-icons/ri";
import "./SkillForm.css";

const CATEGORIES = [
  "Programming", "Frontend", "Backend", "Database",
  "DevOps", "Cloud", "AI/ML", "Tools", "Soft Skills", "Others",
];
const STATUSES = ["Not Started", "Learning", "Completed", "On Hold"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

const defaultForm = {
  name: "", category: "Programming", description: "", currentLevel: 1,
  targetLevel: 10, priority: "Medium", difficulty: "Beginner",
  learningSource: "", estimatedHours: "", progress: 0,
  startDate: "", targetDate: "", status: "Not Started",
  notes: "", tags: "",
};

const SkillForm = ({ skill, onSave, onClose }) => {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const isEdit = !!skill;

  useEffect(() => {
    if (skill) {
      setForm({
        name: skill.name || "",
        category: skill.category || "Programming",
        description: skill.description || "",
        currentLevel: skill.currentLevel || 1,
        targetLevel: skill.targetLevel || 10,
        priority: skill.priority || "Medium",
        difficulty: skill.difficulty || "Beginner",
        learningSource: skill.learningSource || "",
        estimatedHours: skill.estimatedHours || "",
        progress: skill.progress || 0,
        startDate: skill.startDate ? skill.startDate.split("T")[0] : "",
        targetDate: skill.targetDate ? skill.targetDate.split("T")[0] : "",
        status: skill.status || "Not Started",
        notes: skill.notes || "",
        tags: (skill.tags || []).join(", "),
      });
    }
  }, [skill]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "number" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : 0,
        startDate: form.startDate || undefined,
        targetDate: form.targetDate || undefined,
      };
      await onSave(payload, skill?._id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="skill-form-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="skill-form-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        <div className="skill-form-header">
          <h2>{isEdit ? "Edit Skill" : "Add New Skill"}</h2>
          <button className="skill-form-close" onClick={onClose}><RiCloseLine /></button>
        </div>

        <form onSubmit={handleSubmit} className="skill-form-body">
          {/* Row 1: Name + Category */}
          <div className="form-row">
            <div className="form-field form-field--lg">
              <label>Skill Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g., React.js" className="form-input" required />
            </div>
            <div className="form-field">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="form-input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-field">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="What are you learning and why?" className="form-input form-textarea" rows={2} />
          </div>

          {/* Row 2: Levels */}
          <div className="form-row">
            <div className="form-field">
              <label>Current Level (1-10)</label>
              <input type="number" name="currentLevel" min={1} max={10}
                value={form.currentLevel} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label>Target Level (1-10)</label>
              <input type="number" name="targetLevel" min={1} max={10}
                value={form.targetLevel} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label>Est. Hours</label>
              <input type="number" name="estimatedHours" min={0}
                value={form.estimatedHours} onChange={handleChange}
                placeholder="0" className="form-input" />
            </div>
          </div>

          {/* Row 3: Priority + Difficulty + Status */}
          <div className="form-row">
            <div className="form-field">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="form-input">
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Difficulty</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className="form-input">
                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="form-input">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Row 4: Dates */}
          <div className="form-row">
            <div className="form-field">
              <label>Start Date</label>
              <input type="date" name="startDate" value={form.startDate}
                onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label>Target Date</label>
              <input type="date" name="targetDate" value={form.targetDate}
                onChange={handleChange} className="form-input" />
            </div>
          </div>

          {/* Learning Source */}
          <div className="form-field">
            <label>Learning Source</label>
            <input name="learningSource" value={form.learningSource} onChange={handleChange}
              placeholder="e.g., Udemy, YouTube, Books..." className="form-input" />
          </div>

          {/* Tags */}
          <div className="form-field">
            <label>Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange}
              placeholder="e.g., react, frontend, javascript" className="form-input" />
          </div>

          {/* Notes */}
          <div className="form-field">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              placeholder="Any notes or resources..." className="form-input form-textarea" rows={2} />
          </div>

          <div className="skill-form-footer">
            <button type="button" className="form-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="form-btn-save" disabled={saving}>
              {saving ? <span className="auth-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><RiSaveLine /> {isEdit ? "Update" : "Add Skill"}</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SkillForm;
