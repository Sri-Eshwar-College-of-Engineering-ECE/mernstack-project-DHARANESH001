import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiHeartLine, RiHeartFill, RiEditLine, RiDeleteBinLine,
  RiAwardLine, RiArrowUpLine, RiArrowDownLine, RiUploadLine,
  RiExternalLinkLine, RiBookmarkLine, RiBookmarkFill,
} from "react-icons/ri";
import { skillService } from "../../services/skillService";
import { getErrorMessage, getCategoryColor, getStatusColor, getPriorityColor, formatDate, daysUntil, isOverdue } from "../../utils/helpers";
import "./SkillCard.css";

const LEVEL_LABELS = ["", "Novice", "Beginner", "Elementary", "Intermediate",
  "Upper-Int", "Advanced", "Expert", "Master", "Grand Master", "Legend"];

const SkillCard = ({ skill, index, viewMode, onEdit, onDelete, onLevelUp, onLevelDown, onFavorite, onRefresh }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const categoryColor = getCategoryColor(skill.category);
  const statusColor = getStatusColor(skill.status);
  const priorityColor = getPriorityColor(skill.priority);
  const overdue = isOverdue(skill.targetDate, skill.status);
  const days = daysUntil(skill.targetDate);

  const handleCertUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("certificate", file);
      await skillService.uploadCertificate(skill._id, fd);
      toast.success("Certificate uploaded!");
      onRefresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCert = async () => {
    if (!confirm("Delete this certificate?")) return;
    try {
      await skillService.deleteCertificate(skill._id);
      toast.success("Certificate removed");
      onRefresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${skill.name}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(skill._id);
    } finally {
      setDeleting(false);
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        className="skill-list-row"
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ delay: index * 0.03 }}
      >
        <div className="skill-list-color" style={{ background: categoryColor }} />
        <div className="skill-list-info">
          <p className="skill-list-name">{skill.name}</p>
          <p className="skill-list-cat">{skill.category}</p>
        </div>
        <div className="skill-list-progress">
          <div className="skill-list-bar-track">
            <div className="skill-list-bar-fill" style={{ width: `${skill.progress}%`, background: categoryColor }} />
          </div>
          <span>{skill.progress}%</span>
        </div>
        <span className="skill-badge" style={{ background: `${statusColor}22`, color: statusColor }}>{skill.status}</span>
        <span className="skill-badge" style={{ background: `${priorityColor}22`, color: priorityColor }}>{skill.priority}</span>
        <div className="skill-list-actions">
          <button onClick={onLevelUp} disabled={skill.currentLevel >= 10} title="Level Up"><RiArrowUpLine /></button>
          <button onClick={onLevelDown} disabled={skill.currentLevel <= 1} title="Level Down"><RiArrowDownLine /></button>
          <button onClick={() => onEdit(skill)} title="Edit"><RiEditLine /></button>
          <button onClick={handleDelete} title="Delete"><RiDeleteBinLine /></button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`skill-card ${overdue ? "skill-card--overdue" : ""}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -4 }}
    >
      {/* Top accent bar */}
      <div className="skill-card__bar" style={{ background: categoryColor }} />

      {/* Header */}
      <div className="skill-card__header">
        <div className="skill-card__header-left">
          <span className="skill-badge" style={{ background: `${categoryColor}20`, color: categoryColor }}>
            {skill.category}
          </span>
          {skill.priority && (
            <span className="skill-badge" style={{ background: `${priorityColor}20`, color: priorityColor }}>
              {skill.priority}
            </span>
          )}
        </div>
        <div className="skill-card__header-actions">
          <button
            className={`skill-icon-btn ${skill.isFavorite ? "active-fav" : ""}`}
            onClick={onFavorite}
            title={skill.isFavorite ? "Unfavorite" : "Favorite"}
          >
            {skill.isFavorite ? <RiHeartFill style={{ color: "#ef4444" }} /> : <RiHeartLine />}
          </button>
          <button className="skill-icon-btn" onClick={() => onEdit(skill)} title="Edit">
            <RiEditLine />
          </button>
          <button className="skill-icon-btn skill-icon-btn--danger" onClick={handleDelete} title="Delete" disabled={deleting}>
            <RiDeleteBinLine />
          </button>
        </div>
      </div>

      {/* Name & Description */}
      <div className="skill-card__body">
        <h3 className="skill-card__name">{skill.name}</h3>
        {skill.description && (
          <p className="skill-card__desc">{skill.description}</p>
        )}
      </div>

      {/* Progress Ring + Level */}
      <div className="skill-card__progress-row">
        <div className="skill-card__level-display">
          <div className="skill-level-ring" style={{ "--clr": categoryColor }}>
            <svg viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke={categoryColor}
                strokeWidth="3"
                strokeDasharray={`${skill.progress} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="skill-level-ring-text">
              <span className="skill-level-ring-value">{skill.currentLevel}</span>
              <span className="skill-level-ring-max">/{skill.targetLevel}</span>
            </div>
          </div>
          <div>
            <p className="skill-level-label">{LEVEL_LABELS[skill.currentLevel]}</p>
            <p className="skill-progress-pct">{skill.progress}% complete</p>
          </div>
        </div>

        <div className="skill-card__level-btns">
          <button
            className="skill-level-btn skill-level-btn--up"
            onClick={onLevelUp}
            disabled={skill.currentLevel >= 10}
            title="Increase Level"
          ><RiArrowUpLine /></button>
          <button
            className="skill-level-btn skill-level-btn--down"
            onClick={onLevelDown}
            disabled={skill.currentLevel <= 1}
            title="Decrease Level"
          ><RiArrowDownLine /></button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="skill-card__progress-bar">
        <div className="skill-card__progress-fill" style={{ width: `${skill.progress}%`, background: categoryColor }} />
      </div>

      {/* Meta */}
      <div className="skill-card__meta">
        <span className="skill-badge" style={{ background: `${getStatusColor(skill.status)}20`, color: getStatusColor(skill.status) }}>
          {skill.status}
        </span>
        {skill.targetDate && (
          <span className={`skill-card__deadline ${overdue ? "overdue" : ""}`}>
            {overdue ? "⚠️ Overdue" : days !== null ? `${days}d left` : ""}
          </span>
        )}
        {skill.tags?.length > 0 && (
          <div className="skill-card__tags">
            {skill.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="skill-tag">{tag}</span>
            ))}
            {skill.tags.length > 2 && <span className="skill-tag">+{skill.tags.length - 2}</span>}
          </div>
        )}
      </div>

      {/* Certificate */}
      <div className="skill-card__cert-row">
        {skill.certificate ? (
          <div className="skill-cert-info">
            <RiAwardLine style={{ color: "#f59e0b" }} />
            <a
              href={`/${skill.certificate}`}
              target="_blank"
              rel="noopener noreferrer"
              className="skill-cert-link"
            >
              {skill.certificateName || "View Certificate"}
              <RiExternalLinkLine />
            </a>
            <button className="skill-cert-delete" onClick={handleDeleteCert} title="Remove certificate">
              <RiDeleteBinLine />
            </button>
          </div>
        ) : (
          <label className="skill-upload-btn">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleCertUpload}
              style={{ display: "none" }}
            />
            {uploading ? (
              <span className="auth-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
            ) : (
              <><RiUploadLine /> {skill.status === "Completed" ? "Add Certificate" : "Upload Cert"}</>
            )}
          </label>
        )}
      </div>

      {/* Dates */}
      {(skill.startDate || skill.targetDate) && (
        <div className="skill-card__dates">
          {skill.startDate && <span>Start: {formatDate(skill.startDate)}</span>}
          {skill.targetDate && <span>Target: {formatDate(skill.targetDate)}</span>}
        </div>
      )}
    </motion.div>
  );
};

export default SkillCard;
