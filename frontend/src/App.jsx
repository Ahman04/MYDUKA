import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MerchantDashboard from "./pages/MerchantDashboard.jsx";
import Reports from "./pages/Reports.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/clerk" element={<Dashboard />} />
      <Route path="/merchant" element={<MerchantDashboard />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}