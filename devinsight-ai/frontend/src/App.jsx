import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardEnhanced from "./pages/DashboardEnhanced";
import History from "./pages/History";
import HistoryEnhanced from "./pages/HistoryEnhanced";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-v2" element={<DashboardEnhanced />} />

        {/* History */}
        <Route path="/history" element={<History />} />
        <Route path="/history-v2" element={<HistoryEnhanced />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;