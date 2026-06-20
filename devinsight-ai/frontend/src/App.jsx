import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import DashboardEnhanced from "./pages/DashboardEnhanced";
import HistoryEnhanced from "./pages/HistoryEnhanced";
import Layout from "./components/Layout"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected pages wrapped in shared Layout with Navbar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/dashboard-v2" element={<DashboardEnhanced />} />
          <Route path="/history-v2" element={<HistoryEnhanced />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;