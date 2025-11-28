import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiBriefcase,
  FiClock,
  FiCalendar,
  FiX,
  FiMenu,
  FiChevronRight,

  FiLogOut,
} from "react-icons/fi";
import type { Employee } from "../../apis/authService";
import "../../index.css";
import "../../App.css";
import { useAuthLogout } from "../../hooks/useAuth";

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
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const { mutate: logout } = useAuthLogout();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "projects", label: "My Projects", icon: <FiBriefcase /> },
    { id: "tasks", label: "Tasks", icon: <FiCalendar /> },
    { id: "timesheets", label: "Timesheets", icon: <FiClock /> },
  ];

  const resolveNavHighlight = (view: string) => {
    if (view.startsWith("project-")) {
      return "projects";
    }
    return view;
  };

  const normalizedActiveView = resolveNavHighlight(activeView);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector(".sidebar-container");
      if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        className={`fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/90 shadow-lg md:hidden transition-all duration-300 ${sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        onClick={() => setSidebarOpen(true)}
        style={{ backdropFilter: "blur(10px)" }}
      >
        <FiMenu className="text-gray-700 text-xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar-container fixed inset-y-0 left-0 w-64 bg-white/95 shadow-2xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-500 ease-in-out z-50 flex flex-col border-r border-gray-200/70`}
        style={{ backdropFilter: "blur(10px)" }}
      >
        {/* Header section */}
        <div className="p-5 border-b border-gray-200/50">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Employee Portal
            </h1>
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100/60 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX className="text-gray-500 text-lg" />
            </button>
          </div>


        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3 mt-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setSidebarOpen(false);
              }}
              onMouseEnter={() => setIsHovering(item.id)}
              onMouseLeave={() => setIsHovering(null)}
              className={`w-full flex items-center px-4 py-3.5 mb-1 rounded-xl text-sm font-medium transition-all duration-300 ${normalizedActiveView === item.id
                ? "bg-gray-900/5 text-gray-900 border-r-2 border-gray-900"
                : "text-gray-600/90 hover:bg-gray-100/50"
                }`}
              style={{
                transform:
                  isHovering === item.id ? "translateX(4px)" : "translateX(0)",
              }}
            >
              <span
                className={`mr-3 text-lg transition-colors ${normalizedActiveView === item.id ? "text-gray-900" : "text-gray-500"
                  }`}
              >
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {isHovering === item.id && (
                <FiChevronRight className="text-gray-400 ml-2 text-sm" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer section */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={() => {
              setActiveView("profile");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-2 ${activeView === "profile"
              ? "bg-gray-900/5 text-gray-900"
              : "text-gray-600/90 hover:bg-gray-100/50"
              }`}
          >
            {/* Avatar initial + name (clickable) */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium mr-3">
              {employee.name.charAt(0)}
            </div>
            <span className="flex-1 text-left truncate">{employee.name}</span>
          </button>
          <button
            onClick={() => logout()}
            className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-600/90 hover:bg-gray-100/50 transition-colors"
          >
            <FiLogOut className="mr-3 text-lg text-gray-500" />
            <span className="flex-1 text-left">Logout</span>
          </button>

          {/* <div className="text-xs text-gray-400/80 text-center mt-4 pt-3 border-t border-gray-200/30">
            © {new Date().getFullYear()} Company Name
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
