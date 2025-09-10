import React from "react";
import { FiHome, FiBriefcase, FiClock, FiCalendar } from "react-icons/fi";
import type{ Employee } from "../../apis/authService";

interface SidebarProps {
  employee: Employee;
  activeView: string;
  setActiveView: (view: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  employee,
  activeView,
  setActiveView,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "projects", label: "My Projects", icon: <FiBriefcase /> },
    { id: "tasks", label: "Tasks", icon: <FiCalendar /> },
    { id: "timesheets", label: "Timesheets", icon: <FiClock /> },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Employee Dashboard</h1>
        <p className="text-sm text-gray-600">{employee.name}</p>
      </div>
      <nav className="p-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveView(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg text-sm font-medium ${
              activeView === item.id
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
