import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { RiLockPasswordLine, RiNotification3Line, RiPaletteLine, RiSaveLine, RiShieldKeyholeLine } from "react-icons/ri";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/skillService";
import { getErrorMessage } from "../utils/helpers";
import "./Settings.css";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("security");
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handlePwdChange = (e) => setPwdForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      await profileService.updatePassword(pwdForm);
      toast.success("Password updated successfully");
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your account settings and preferences.</p>
          </div>
        </div>

        <div className="settings-layout">
          <div className="settings-sidebar">
            <button
              className={`settings-tab ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <RiShieldKeyholeLine /> Security
            </button>
            <button
              className={`settings-tab ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              <RiNotification3Line /> Notifications
            </button>
            <button
              className={`settings-tab ${activeTab === "appearance" ? "active" : ""}`}
              onClick={() => setActiveTab("appearance")}
            >
              <RiPaletteLine /> Appearance
            </button>
          </div>

          <div className="settings-content">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="settings-card"
            >
              {activeTab === "security" && (
                <div>
                  <h2 className="settings-title">Change Password</h2>
                  <p className="settings-desc">Ensure your account is using a long, random password to stay secure.</p>
                  
                  <form onSubmit={handlePwdSubmit} className="settings-form">
                    <div className="form-field">
                      <label>Current Password</label>
                      <div className="input-wrap">
                        <RiLockPasswordLine className="input-icon" />
                        <input
                          type="password" name="currentPassword" value={pwdForm.currentPassword}
                          onChange={handlePwdChange} className="form-input with-icon" required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>New Password</label>
                      <div className="input-wrap">
                        <RiLockPasswordLine className="input-icon" />
                        <input
                          type="password" name="newPassword" value={pwdForm.newPassword}
                          onChange={handlePwdChange} className="form-input with-icon" required minLength={6}
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Confirm New Password</label>
                      <div className="input-wrap">
                        <RiLockPasswordLine className="input-icon" />
                        <input
                          type="password" name="confirmPassword" value={pwdForm.confirmPassword}
                          onChange={handlePwdChange} className="form-input with-icon" required minLength={6}
                        />
                      </div>
                    </div>
                    
                    <div className="settings-footer">
                      <button type="submit" className="form-btn-save" disabled={loading}>
                        {loading ? <span className="auth-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><RiSaveLine /> Update Password</>}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h2 className="settings-title">Notification Preferences</h2>
                  <p className="settings-desc">Choose how you want to be notified about your skills.</p>
                  <div className="settings-placeholder">
                    <RiNotification3Line />
                    <p>Notification settings coming soon in v2.0</p>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div>
                  <h2 className="settings-title">Appearance</h2>
                  <p className="settings-desc">Customize how SkillForge looks on your device.</p>
                  <div className="settings-placeholder">
                    <RiPaletteLine />
                    <p>Theme customization coming soon in v2.0</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
