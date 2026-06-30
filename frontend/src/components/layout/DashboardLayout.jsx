import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`layout ${collapsed ? "layout--collapsed" : ""}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="layout__overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
      />

      <div className="layout__main">
        <Navbar
          sidebarCollapsed={collapsed}
          onMobileMenuToggle={() => setMobileOpen((p) => !p)}
          mobileMenuOpen={mobileOpen}
        />
        <main className="layout__content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
