import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import ManagerDashboard from "./pages/ManagerDashboard/ManagerDashboard";
import { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken") // Persist auth state
  );

  console.log("App: isAuthenticated =", isAuthenticated); // Debug log

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/manager"
        element={
          isAuthenticated ? <ManagerDashboard /> : <Navigate to="/login" />
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
