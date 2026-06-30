import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  RiDashboardLine, RiBrainLine, RiBarChartLine, RiCalendarLine,
  RiAwardLine, RiUserLine, RiSettingsLine, RiLogoutBoxLine,
  RiMenuFoldLine, RiMenuUnfoldLine, RiFlashlightLine,
} from "react-icons/ri";
import "./Sidebar.css";

const navItems = [
  { path: "/dashboard", icon: <RiDashboardLine />, label: "Dashboard" },
  { path: "/skills", icon: <RiBrainLine />, label: "Skills" },
  { path: "/analytics", icon: <RiBarChartLine />, label: "Analytics" },
  { path: "/calendar", icon: <RiCalendarLine />, label: "Calendar" },
  { path: "/certificates", icon: <RiAwardLine />, label: "Certificates" },
  { path: "/profile", icon: <RiUserLine />, label: "Profile" },
  { path: "/settings", icon: <RiSettingsLine />, label: "Settings" },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "SF";

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <RiFlashlightLine />
        </div>
        {!collapsed && (
          <span className="sidebar__logo-text">Skill<span>Forge</span></span>
        )}
        <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? "sidebar__nav-item--active" : ""}`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar__nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="sidebar__footer">
        <div className="sidebar__user" onClick={() => navigate("/profile")}>
          {user?.avatar ? (
            <img src={`/${user.avatar}`} alt={user.name} className="sidebar__avatar" />
          ) : (
            <div className="sidebar__avatar-placeholder">{initials}</div>
          )}
          {!collapsed && (
            <div className="sidebar__user-info">
              <p className="sidebar__user-name">{user?.name || "User"}</p>
              <p className="sidebar__user-email">{user?.email || ""}</p>
            </div>
          )}
        </div>
        <button
          className="sidebar__logout"
          onClick={handleLogout}
          title="Logout"
        >
          <RiLogoutBoxLine />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
