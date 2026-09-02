import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 24px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
