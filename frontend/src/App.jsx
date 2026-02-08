import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MerchantDashboard from "./pages/MerchantDashboard.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import PurchaseOrders from "./pages/PurchaseOrders.jsx";
import Transfers from "./pages/Transfers.jsx";
import Returns from "./pages/Returns.jsx";
import Sales from "./pages/Sales.jsx";
import Expenses from "./pages/Expenses.jsx";
import Analytics from "./pages/Analytics.jsx";
import {
  authApi,
  clearAuthSession,
  getDashboardRoute,
  getStoredToken,
  getStoredUser,
  normalizeRole,
  saveAuthSession,
} from "./services/api";

function ProtectedRoute({ allowedRoles, children }) {
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  const userRole = normalizeRole(user.role);
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={getDashboardRoute(userRole)} replace />;
  }

  return children;
}

export default function App() {
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isActive = true;
    const token = getStoredToken();

    if (!token) {
      setIsRestoringSession(false);
      return undefined;
    }

    authApi
      .me()
      .then((response) => {
        if (!isActive) {
          return;
        }
        const user = response.data;
        saveAuthSession(token, user);
        if (location.pathname === "/") {
          navigate(getDashboardRoute(user.role), { replace: true });
        }
      })
      .catch(() => {
        if (!isActive) {
          return;
        }
        clearAuthSession();
        if (location.pathname !== "/") {
          navigate("/", { replace: true });
        }
      })
      .finally(() => {
        if (isActive) {
          setIsRestoringSession(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [location.pathname, navigate]);

  if (isRestoringSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F0FDF4] text-[#064E3B]">
        Restoring session...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clerk"
        element={
          <ProtectedRoute allowedRoles={["clerk"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant"
        element={
          <ProtectedRoute allowedRoles={["merchant"]}>
            <MerchantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute allowedRoles={["admin", "merchant"]}>
            <Suppliers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchase-orders"
        element={
          <ProtectedRoute allowedRoles={["admin", "merchant"]}>
            <PurchaseOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfers"
        element={
          <ProtectedRoute allowedRoles={["admin", "merchant"]}>
            <Transfers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/returns"
        element={
          <ProtectedRoute allowedRoles={["admin", "merchant"]}>
            <Returns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute allowedRoles={["admin", "merchant"]}>
            <Sales />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute allowedRoles={["admin", "merchant"]}>
            <Expenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={["admin", "merchant"]}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
