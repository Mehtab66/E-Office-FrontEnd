import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Users from "./pages/Users/Users";
import Settings from "./components/Setting/Setting";
import ManagerDashboard from "./pages/ManagerDashboard/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeDashboard";
import { useAuthStore } from "./store/authStore";
import type { JSX } from "react";
import "./App.css";
import "./index.css";
import { SocketProvider } from "./context/SocketContext";
function App() {
  const { isAuthenticated, user } = useAuthStore();

  // Protected route component
  const ProtectedRoute = ({
    children,
    allowedDesignations,
  }: {
    children: JSX.Element;
    allowedDesignations: string[];
  }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!user || !allowedDesignations.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <SocketProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedDesignations={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route
            index
            element={<div className="p-4">Welcome to Admin Dashboard</div>}
          />
        </Route>
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedDesignations={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedDesignations={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
