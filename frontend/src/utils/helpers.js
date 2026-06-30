// Date helpers
export const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

export const daysUntil = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const isOverdue = (date, status) => {
  if (!date || status === "Completed") return false;
  return new Date(date) < new Date();
};

// Number helpers
export const formatNumber = (num) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num?.toString() || "0";
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// String helpers
export const truncate = (str, length = 60) => {
  if (!str) return "";
  return str.length > length ? `${str.slice(0, length)}...` : str;
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (str) =>
  str.toLowerCase().trim().replace(/[\s]+/g, "-").replace(/[^\w-]+/g, "");

// Color helpers for categories / status
export const getCategoryColor = (category) => {
  const map = {
    Programming: "#6366f1",
    Frontend: "#06b6d4",
    Backend: "#8b5cf6",
    Database: "#f59e0b",
    DevOps: "#22c55e",
    Cloud: "#3b82f6",
    "AI/ML": "#ec4899",
    Tools: "#f97316",
    "Soft Skills": "#14b8a6",
    Others: "#94a3b8",
  };
  return map[category] || "#94a3b8";
};

export const getStatusColor = (status) => {
  const map = {
    "Not Started": "#64748b",
    Learning: "#6366f1",
    Completed: "#22c55e",
    "On Hold": "#f59e0b",
  };
  return map[status] || "#64748b";
};

export const getPriorityColor = (priority) => {
  const map = {
    Low: "#22c55e",
    Medium: "#f59e0b",
    High: "#f97316",
    Critical: "#ef4444",
  };
  return map[priority] || "#94a3b8";
};

// Progress color
export const getProgressColor = (progress) => {
  if (progress >= 80) return "#22c55e";
  if (progress >= 50) return "#6366f1";
  if (progress >= 25) return "#f59e0b";
  return "#ef4444";
};

// Extract error message from axios error
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.message ||
    "Something went wrong"
  );
};
