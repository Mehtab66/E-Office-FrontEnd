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
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthLogout } from "../../hooks/useAuth";
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
import { useEmployees, useDashboardStats } from "../../hooks/useEmployee"; // Import both hooks

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { mutate: logout } = useAuthLogout();

  // Fetch dashboard stats
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  // Fetch recent registrations (top 5, sorted by createdAt descending)
  const {
    data: recentData,
    isLoading: recentLoading,
    error: recentError,
  } = useEmployees({
    page: 1,
    limit: 5,
    sort: "-createdAt",
  });

  const handleLogout = () => {
    logout();
  };

  const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // Designation data for pie chart
  const designationData =
    statsData?.designations?.map((entry: any, index: number) => ({
      ...entry,
      color: [
        "#3b82f6",
        "#8b5cf6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#6366f1",
        "#64748b",
      ][index % 7], // Assign colors
    })) || [];

  // Recent registrations
  const recentRegistrations =
    recentData?.users?.
    map((user) => ({
      name: user.name,
      email: user.email,
      role: user.designation || "Unknown",
      date: user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "Unknown",
    })) || [];

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
          {location.pathname === "/admin" ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Loading and Error States */}
              {(statsLoading || recentLoading) && (
                <div className="text-center">Loading dashboard data...</div>
              )}
              {(statsError || recentError) && (
                <div className="text-center text-red-500">
                  Error: {statsError?.message || recentError?.message}
                </div>
              )}
              {statsData && recentData && (
                <>
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
                              {statsData.totalUsers.toLocaleString()}
                            </h3>
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
                              {statsData.totalDepartments}
                            </h3>
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
                                  `${name}: ${((percent ?? 0) * 100).toFixed(
                                    0
                                  )}%`
                                }
                              >
                                {designationData.map((entry: { color: string | undefined; }, index: any) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
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
                                  <p className="text-sm font-medium">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {user.role}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  {user.date}
                                </p>
                               
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
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
