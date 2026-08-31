import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { FiLogOut, FiUser, FiTrendingUp } from "react-icons/fi";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Markets",   path: "/markets" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Watchlist", path: "/watchlist" },
  ];
  if (user?.role === "admin") {
    navLinks.push({ label: "Admin", path: "/admin" });
  }

  const isActive = (path) => location.pathname === path || (path === "/dashboard" && location.pathname === "/");

  return (
    <nav style={styles.navbar}>
      <Link to="/dashboard" style={styles.logo}>
        <div style={styles.logoIcon}><FiTrendingUp size={14} /></div>
        TRADEHUB
      </Link>

      <div style={styles.navLinks}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...styles.navLink,
              ...(isActive(link.path) ? styles.navLinkActive : {}),
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div style={styles.navRight}>
        <span style={styles.badge}>● Markets Open</span>
        <div style={styles.userMenu}>
          <div
            style={styles.avatar}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {user?.initials || <FiUser size={14} />}
          </div>
          {menuOpen && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <div style={styles.dropdownName}>{user?.name}</div>
                <div style={styles.dropdownEmail}>{user?.email}</div>
              </div>
              <div style={styles.dropdownDivider} />
              <button style={styles.dropdownItem} onClick={() => dispatch(logout())}>
                <FiLogOut size={13} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: "var(--bg-surface)",
    borderBottom: "0.5px solid var(--border)",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--gold)",
    letterSpacing: "0.05em",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    background: "linear-gradient(135deg, var(--gold), var(--gold-bright))",
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--bg-base)",
  },
  navLinks: { display: "flex", gap: 24 },
  navLink: {
    fontSize: 13,
    color: "var(--text-muted)",
    padding: "4px 0",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s",
  },
  navLinkActive: {
    color: "var(--gold)",
    borderBottom: "2px solid var(--gold)",
  },
  navRight: { display: "flex", alignItems: "center", gap: 14 },
  badge: {
    fontSize: 10,
    color: "var(--emerald)",
    background: "var(--emerald-dim)",
    border: "0.5px solid var(--emerald)",
    borderRadius: 20,
    padding: "4px 10px",
  },
  userMenu: { position: "relative" },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "var(--violet-dim)",
    color: "var(--violet)",
    border: "0.5px solid var(--violet)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: 44,
    right: 0,
    background: "var(--bg-elevated)",
    border: "0.5px solid var(--border)",
    borderRadius: 10,
    width: 200,
    boxShadow: "var(--shadow-md)",
    overflow: "hidden",
  },
  dropdownHeader: { padding: "12px 14px" },
  dropdownName: { fontSize: 13, fontWeight: 600, color: "var(--text-primary)" },
  dropdownEmail: { fontSize: 11, color: "var(--text-muted)", marginTop: 2 },
  dropdownDivider: { height: 0.5, background: "var(--border)" },
  dropdownItem: {
    width: "100%",
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "var(--red)",
    textAlign: "left",
  },
};

export default Navbar;
