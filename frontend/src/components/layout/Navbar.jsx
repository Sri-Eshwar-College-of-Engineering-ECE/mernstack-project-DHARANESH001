import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  RiSearchLine, RiBellLine, RiSunLine, RiMoonLine,
  RiMenuLine, RiCloseLine,
} from "react-icons/ri";
import "./Navbar.css";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/skills": "Skills",
  "/analytics": "Analytics",
  "/calendar": "Calendar",
  "/certificates": "Certificates",
  "/profile": "Profile",
  "/settings": "Settings",
};

const Navbar = ({ sidebarCollapsed, onMobileMenuToggle, mobileMenuOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  const [searchVal, setSearchVal] = useState("");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next === "light" ? "light" : "");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "SF";

  const title = pageTitles[location.pathname] || "SkillForge";

  return (
    <header className={`navbar ${sidebarCollapsed ? "navbar--expanded" : ""}`}>
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMobileMenuToggle}>
          {mobileMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>
        <div>
          <h1 className="navbar__title">{title}</h1>
        </div>
      </div>

      <div className="navbar__center">
        <div className="navbar__search">
          <RiSearchLine className="navbar__search-icon" />
          <input
            type="text"
            placeholder="Search skills, categories..."
            className="navbar__search-input"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar__right">
        <button className="navbar__icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? <RiSunLine /> : <RiMoonLine />}
        </button>

        <button className="navbar__icon-btn" title="Notifications">
          <RiBellLine />
          <span className="navbar__notification-dot" />
        </button>

        <div className="navbar__user" onClick={() => navigate("/profile")}>
          {user?.avatar ? (
            <img src={`/${user.avatar}`} alt={user.name} className="navbar__avatar" />
          ) : (
            <div className="navbar__avatar-placeholder">{initials}</div>
          )}
          <span className="navbar__user-name">{user?.name?.split(" ")[0]}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
