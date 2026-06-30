import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { RiUserLine, RiUploadLine, RiGithubLine, RiLinkedinLine, RiGlobalLine, RiSaveLine, RiFilePaperLine } from "react-icons/ri";
import DashboardLayout from "../components/layout/DashboardLayout";
import { profileService } from "../services/skillService";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", bio: "", github: "", linkedin: "", portfolio: "", learningGoal: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        portfolio: user.portfolio || "",
        learningGoal: user.learningGoal || "",
      });
    }
  }, [user]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileService.updateProfile(form);
      updateUser(res.data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await profileService.uploadAvatar(fd);
      updateUser({ avatar: res.data.avatar });
      toast.success("Avatar updated!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingResume(true);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const res = await profileService.uploadResume(fd);
      updateUser({ resume: res.data.resume });
      toast.success("Resume updated!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploadingResume(false);
    }
  };

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "SF";

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">Manage your personal information and social links.</p>
          </div>
        </div>

        <div className="profile-content">
          <motion.div className="profile-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Avatar Section */}
            <div className="profile-avatar-sec">
              <div className="profile-avatar-wrap">
                {user?.avatar ? (
                  <img src={`/${user.avatar}`} alt="Avatar" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-placeholder">{initials}</div>
                )}
                <label className="profile-avatar-upload" title="Change Avatar">
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleAvatarUpload} style={{ display: "none" }} />
                  {uploadingAvatar ? <span className="auth-spinner" style={{ width: 20, height: 20 }} /> : <RiUploadLine />}
                </label>
              </div>
              <div>
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
                <div className="profile-stats-row">
                  <span className="profile-badge">XP: {user?.totalXP || 0}</span>
                  <span className="profile-badge">Streak: {user?.streak || 0} 🔥</span>
                </div>
              </div>
            </div>

            <hr className="divider" />

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <RiUserLine className="input-icon" />
                    <input name="name" value={form.name} onChange={handleChange} className="form-input with-icon" required />
                  </div>
                </div>
                <div className="form-field">
                  <label>Primary Learning Goal</label>
                  <div className="input-wrap">
                    <RiGlobalLine className="input-icon" />
                    <input name="learningGoal" value={form.learningGoal} onChange={handleChange} placeholder="e.g., Become a Senior Full Stack Engineer" className="form-input with-icon" />
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label>Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about yourself..." className="form-input form-textarea" rows={3} />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>GitHub</label>
                  <div className="input-wrap">
                    <RiGithubLine className="input-icon" />
                    <input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." className="form-input with-icon" />
                  </div>
                </div>
                <div className="form-field">
                  <label>LinkedIn</label>
                  <div className="input-wrap">
                    <RiLinkedinLine className="input-icon" />
                    <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="form-input with-icon" />
                  </div>
                </div>
                <div className="form-field">
                  <label>Portfolio</label>
                  <div className="input-wrap">
                    <RiGlobalLine className="input-icon" />
                    <input name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://..." className="form-input with-icon" />
                  </div>
                </div>
              </div>

              <hr className="divider" />

              <div className="profile-resume-sec">
                <div>
                  <h4>Resume</h4>
                  <p>Upload your latest resume (PDF).</p>
                </div>
                <div className="profile-resume-actions">
                  {user?.resume && (
                    <a href={`/${user.resume}`} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      <RiFilePaperLine /> View
                    </a>
                  )}
                  <label className="btn-secondary">
                    <input type="file" accept=".pdf" onChange={handleResumeUpload} style={{ display: "none" }} />
                    {uploadingResume ? <span className="auth-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : "Upload Resume"}
                  </label>
                </div>
              </div>

              <div className="profile-form-footer">
                <button type="submit" className="form-btn-save" disabled={saving}>
                  {saving ? <span className="auth-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><RiSaveLine /> Save Changes</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
