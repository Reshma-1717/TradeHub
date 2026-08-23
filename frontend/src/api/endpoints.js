import api from "./axios";

// ── Auth ─────────────────────────────────────────────────────────
export const authAPI = {
  register : (data) => api.post("/auth/register", data),
  login    : (data) => api.post("/auth/login", data),
  getMe    : ()     => api.get("/auth/me"),
};

// ── User ─────────────────────────────────────────────────────────
export const userAPI = {
  getProfile     : ()     => api.get("/user/profile"),
  updateProfile  : (data) => api.put("/user/profile", data),
  changePassword : (data) => api.put("/user/change-password", data),
};

// ── Stocks ───────────────────────────────────────────────────────
export const stockAPI = {
  getAll      : (params) => api.get("/stocks", { params }),
  getBySymbol : (symbol) => api.get(`/stocks/${symbol}`),
  getTopMovers: ()       => api.get("/stocks/top/movers"),
  create      : (data)   => api.post("/stocks", data),
  update      : (id, data) => api.put(`/stocks/${id}`, data),
  delete      : (id)     => api.delete(`/stocks/${id}`),
};

// ── Trade ────────────────────────────────────────────────────────
export const tradeAPI = {
  buy        : (data)   => api.post("/trade/buy", data),
  sell       : (data)   => api.post("/trade/sell", data),
  getHistory : (params) => api.get("/trade/history", { params }),
};

// ── Portfolio ────────────────────────────────────────────────────
export const portfolioAPI = {
  get       : () => api.get("/portfolio"),
  getSummary: () => api.get("/portfolio/summary"),
};

// ── Watchlist ────────────────────────────────────────────────────
export const watchlistAPI = {
  get    : ()       => api.get("/watchlist"),
  add    : (symbol) => api.post("/watchlist/add", { symbol }),
  remove : (symbol) => api.delete(`/watchlist/remove/${symbol}`),
};

// ── Admin ────────────────────────────────────────────────────────
export const adminAPI = {
  getStats         : ()       => api.get("/admin/stats"),
  getUsers         : (params) => api.get("/admin/users", { params }),
  toggleUserStatus : (id)     => api.put(`/admin/users/${id}/toggle`),
  resetBalance     : (id, balance) => api.put(`/admin/users/${id}/balance`, { balance }),
  getTransactions  : (params) => api.get("/admin/transactions", { params }),
  createStock      : (data)   => api.post("/stocks", data),
  updateStock      : (id, data) => api.put(`/stocks/${id}`, data),
  deleteStock      : (id)     => api.delete(`/stocks/${id}`),
};
