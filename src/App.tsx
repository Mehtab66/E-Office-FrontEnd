import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Users from "./pages/Users/Users";
import { useState } from "react";
import Settings from "./components/Setting/Setting";
import ManagerDashboard from "./pages/ManagerDashboard/ManagerDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/admin"
        element={
          isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />
        }
      >
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />

        <Route
          index
          element={<div className="p-4">Welcome to Admin Dashboard</div>}
        />
      </Route>
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
