import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  Building2,
  ChevronDown,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropDownMenu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // User designation data for chart
  const designationData = [
    { name: "Developers", value: 35, color: "#3b82f6" },
    { name: "UI/UX Designers", value: 15, color: "#8b5cf6" },
    { name: "Project Managers", value: 10, color: "#10b981" },
    { name: "QA Engineers", value: 12, color: "#f59e0b" },
    { name: "DevOps", value: 8, color: "#ef4444" },
    { name: "Business Analysts", value: 7, color: "#6366f1" },
    { name: "Others", value: 13, color: "#64748b" },
  ];

  // Recent registrations data
  const recentRegistrations = [
    {
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Developer",
      date: "2023-10-15",
      status: "Active",
    },
    {
      name: "Maria Garcia",
      email: "maria@example.com",
      role: "UI Designer",
      date: "2023-10-14",
      status: "Active",
    },
    {
      name: "James Wilson",
      email: "james@example.com",
      role: "Project Manager",
      date: "2023-10-13",
      status: "Pending",
    },
    {
      name: "Sarah Chen",
      email: "sarah@example.com",
      role: "QA Engineer",
      date: "2023-10-12",
      status: "Active",
    },
    {
      name: "Michael Brown",
      email: "michael@example.com",
      role: "Developer",
      date: "2023-10-11",
      status: "Suspended",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-slate-900 to-slate-800
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} shadow-xl`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-slate-700 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">E-Office</h1>
              <p className="text-xs text-slate-300">Admin Portal</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === "/admin"}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium
                    transition-all duration-200 hover:bg-slate-700/50 ${
                      isActive
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-slate-300 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User info & Logout */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-slate-700/30">
              <Avatar className="h-9 w-9 border-2 border-blue-400">
                <AvatarImage src="/" alt="Admin" />
                <AvatarFallback className="bg-blue-500 text-white">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-slate-400 truncate">
                  admin@eoffice.com
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-300 hover:bg-slate-700/50 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          {/* Breadcrumb */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">
              {location.pathname === "/admin"
                ? "Dashboard"
                : location.pathname === "/admin/users"
                ? "User Management"
                : location.pathname === "/admin/settings"
                ? "Settings"
                : "Admin Portal"}
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 pl-1 pr-3 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/" alt="Admin" />
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">
                    Admin
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">
                      admin@eoffice.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50">
          {/* Show default dashboard only when at /admin exactly */}
          {location.pathname === "/admin" ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Stats grid */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Users
                        </p>
                        <h3 className="text-2xl font-bold mt-1 text-gray-900">
                          1,234
                        </h3>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-500 font-medium">
                            +12% from last month
                          </span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Departments
                        </p>
                        <h3 className="text-2xl font-bold mt-1 text-gray-900">
                          12
                        </h3>
                        <p className="text-xs text-gray-500 mt-2">
                          5 new this year
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and additional content */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Users by Designation</CardTitle>
                    <CardDescription>
                      Distribution of users across different roles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={designationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                            }
                          >
                            {designationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Recent Registrations</CardTitle>
                    <CardDescription>
                      New users joined in the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentRegistrations.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-blue-100 text-blue-800">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">
                                {user.role}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{user.date}</p>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                user.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
