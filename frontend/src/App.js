import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/layout/Layout";

import Login         from "./pages/Login";
import Register      from "./pages/Register";
import Dashboard     from "./pages/Dashboard";
import Markets       from "./pages/Markets";
import StockDetail   from "./pages/StockDetail";
import Portfolio     from "./pages/Portfolio";
import WatchlistPage from "./pages/Watchlist";
import AdminPanel    from "./pages/Admin";
import NotFound      from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — wrapped in Layout (navbar + sidebar) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index               element={<Dashboard />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="markets"      element={<Markets />} />
          <Route path="stocks/:symbol" element={<StockDetail />} />
          <Route path="portfolio"    element={<Portfolio />} />
          <Route path="watchlist"    element={<WatchlistPage />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="dark"
      />
    </>
  );
}

export default App;
