import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { RiAwardLine, RiDownloadLine, RiDeleteBinLine, RiEyeLine } from "react-icons/ri";
import DashboardLayout from "../components/layout/DashboardLayout";
import { skillService } from "../services/skillService";
import { getErrorMessage, getCategoryColor } from "../utils/helpers";
import "./Certificates.css";

const Certificates = () => {
  const [skillsWithCerts, setSkillsWithCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewCert, setPreviewCert] = useState(null);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const res = await skillService.getSkills({ limit: 1000 });
      // Filter only skills that have a certificate
      setSkillsWithCerts(res.data.filter(s => s.certificate));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      await skillService.deleteCertificate(id);
      toast.success("Certificate deleted");
      fetchCerts();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Certificates</h1>
            <p className="page-subtitle">Manage and showcase your earned certificates.</p>
          </div>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="auth-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
          </div>
        ) : skillsWithCerts.length === 0 ? (
          <motion.div className="cert-empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <RiAwardLine className="cert-empty-icon" />
            <h3>No Certificates Yet</h3>
            <p>Complete skills and upload certificates to build your portfolio.</p>
          </motion.div>
        ) : (
          <div className="cert-grid">
            {skillsWithCerts.map((skill, index) => (
              <motion.div
                key={skill._id}
                className="cert-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="cert-card-header" style={{ borderTopColor: getCategoryColor(skill.category) }}>
                  <RiAwardLine className="cert-card-icon" style={{ color: getCategoryColor(skill.category) }} />
                  <div>
                    <h3 className="cert-card-title">{skill.name}</h3>
                    <p className="cert-card-subtitle">{skill.category}</p>
                  </div>
                </div>
                <div className="cert-card-body">
                  <p className="cert-filename">{skill.certificateName || "certificate.pdf"}</p>
                </div>
                <div className="cert-card-actions">
                  <button className="cert-btn" onClick={() => setPreviewCert(skill.certificate)}>
                    <RiEyeLine /> Preview
                  </button>
                  <a href={`/${skill.certificate}`} download className="cert-btn">
                    <RiDownloadLine /> Download
                  </a>
                  <button className="cert-btn cert-btn-danger" onClick={() => handleDelete(skill._id)}>
                    <RiDeleteBinLine /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewCert && (
          <div className="cert-modal-overlay" onClick={() => setPreviewCert(null)}>
            <motion.div
              className="cert-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cert-modal-header">
                <h3>Certificate Preview</h3>
                <button className="cert-modal-close" onClick={() => setPreviewCert(null)}>×</button>
              </div>
              <div className="cert-modal-body">
                {previewCert.endsWith('.pdf') ? (
                  <iframe src={`/${previewCert}`} title="Certificate Preview" className="cert-preview-frame" />
                ) : (
                  <img src={`/${previewCert}`} alt="Certificate Preview" className="cert-preview-img" />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Certificates;
