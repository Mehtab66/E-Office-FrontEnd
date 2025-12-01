// import { useState } from "react";
// import {
//   LayoutDashboard,
//   Users,
//   Settings,
//   LogOut,
//   Menu,
//   Building2,
//   ChevronDown,
//   Calendar,
// } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../components/ui/avatar";
// import { NavLink, Outlet, useLocation } from "react-router-dom";
// import { useAuthLogout } from "../../hooks/useAuth";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropDownMenu";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../../components/ui/card";
// import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// import { useEmployees, useDashboardStats } from "../../hooks/useEmployee"; // Import both hooks

// function AdminDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();
//   const { mutate: logout } = useAuthLogout();

//   // Fetch dashboard stats
//   const {
//     data: statsData,
//     isLoading: statsLoading,
//     error: statsError,
//   } = useDashboardStats();

//   // Fetch recent registrations (top 5, sorted by createdAt descending)
//   const {
//     data: recentData,
//     isLoading: recentLoading,
//     error: recentError,
//   } = useEmployees({
//     page: 1,
//     limit: 5,
//     sort: "-createdAt",
//   });

//   const handleLogout = () => {
//     logout();
//   };

//   const navigationItems = [
//     { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
//     { name: "Users", href: "/admin/users", icon: Users },
//     { name: "Settings", href: "/admin/settings", icon: Settings },
//   ];

//   // Designation data for pie chart
//   const designationData =
//     statsData?.designations?.map((entry: any, index: number) => ({
//       ...entry,
//       color: [
//         "#3b82f6",
//         "#8b5cf6",
//         "#10b981",
//         "#f59e0b",
//         "#ef4444",
//         "#6366f1",
//         "#64748b",
//       ][index % 7], // Assign colors
//     })) || [];

//   // Recent registrations
//   const recentRegistrations =
//     recentData?.users?.
//     map((user) => ({
//       name: user.name,
//       email: user.email,
//       role: user.designation || "Unknown",
//       date: user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "Unknown",
//     })) || [];

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar backdrop (mobile) */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/50 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-slate-900 to-slate-800
//         transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} shadow-xl`}
//       >
//         <div className="flex h-full flex-col">
//           {/* Logo */}
//           <div className="flex h-20 items-center gap-3 border-b border-slate-700 px-6">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 shadow-lg">
//               <Building2 className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-white">E-Office</h1>
//               <p className="text-xs text-slate-300">Admin Portal</p>
//             </div>
//           </div>

//           {/* Nav links */}
//           <nav className="flex-1 space-y-2 px-4 py-6">
//             {navigationItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <NavLink
//                   key={item.name}
//                   to={item.href}
//                   end={item.href === "/admin"}
//                   className={({ isActive }) =>
//                     `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium
//                     transition-all duration-200 hover:bg-slate-700/50 ${
//                       isActive
//                         ? "bg-blue-500 text-white shadow-md"
//                         : "text-slate-300 hover:text-white"
//                     }`
//                   }
//                 >
//                   <Icon className="h-5 w-5 shrink-0" />
//                   <span className="truncate">{item.name}</span>
//                 </NavLink>
//               );
//             })}
//           </nav>

//           {/* User info & Logout */}
//           <div className="border-t border-slate-700 p-4">
//             <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-slate-700/30">
//               <Avatar className="h-9 w-9 border-2 border-blue-400">
//                 <AvatarImage src="/" alt="Admin" />
//                 <AvatarFallback className="bg-blue-500 text-white">
//                   AD
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-white truncate">
//                   Admin User
//                 </p>
//                 <p className="text-xs text-slate-400 truncate">
//                   admin@eoffice.com
//                 </p>
//               </div>
//             </div>
//             <Button
//               onClick={handleLogout}
//               variant="ghost"
//               className="w-full justify-start gap-3 text-slate-300 hover:bg-slate-700/50 hover:text-white"
//             >
//               <LogOut className="h-5 w-5" />
//               <span>Logout</span>
//             </Button>
//           </div>
//         </div>
//       </aside>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="lg:hidden"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="h-5 w-5" />
//             <span className="sr-only">Open sidebar</span>
//           </Button>

//           {/* Breadcrumb */}
//           <div className="flex-1">
//             <h1 className="text-xl font-semibold text-gray-900">
//               {location.pathname === "/admin"
//                 ? "Dashboard"
//                 : location.pathname === "/admin/users"
//                 ? "User Management"
//                 : location.pathname === "/admin/settings"
//                 ? "Settings"
//                 : "Admin Portal"}
//             </h1>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
//               <Calendar className="h-4 w-4 text-gray-500" />
//               <span className="text-sm font-medium text-gray-700">
//                 {new Date().toLocaleDateString("en-US", {
//                   weekday: "short",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </span>
//             </div>

//             {/* User dropdown */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="flex items-center gap-2 pl-1 pr-3 rounded-full"
//                 >
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src="/" alt="Admin" />
//                     <AvatarFallback className="bg-blue-100 text-blue-800">
//                       AD
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="text-sm font-medium text-gray-700">
//                     Admin
//                   </span>
//                   <ChevronDown className="h-4 w-4 text-gray-500" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 <DropdownMenuLabel className="font-normal">
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium">Admin User</p>
//                     <p className="text-xs text-muted-foreground">
//                       admin@eoffice.com
//                     </p>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <Settings className="mr-2 h-4 w-4" />
//                   <span>Settings</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={handleLogout}>
//                   <LogOut className="mr-2 h-4 w-4" />
//                   <span>Log out</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 p-6 bg-gray-50">
//           {location.pathname === "/admin" ? (
//             <div className="space-y-6 animate-fadeIn">
//               {/* Loading and Error States */}
//               {(statsLoading || recentLoading) && (
//                 <div className="text-center">Loading dashboard data...</div>
//               )}
//               {(statsError || recentError) && (
//                 <div className="text-center text-red-500">
//                   Error: {statsError?.message || recentError?.message}
//                 </div>
//               )}
//               {statsData && recentData && (
//                 <>
//                   {/* Stats grid */}
//                   <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
//                     <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
//                       <CardContent className="p-6">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-gray-600">
//                               Total Users
//                             </p>
//                             <h3 className="text-2xl font-bold mt-1 text-gray-900">
//                               {statsData.totalUsers.toLocaleString()}
//                             </h3>
//                           </div>
//                           <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
//                             <Users className="h-6 w-6 text-blue-600" />
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>

//                     <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
//                       <CardContent className="p-6">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-gray-600">
//                               Departments
//                             </p>
//                             <h3 className="text-2xl font-bold mt-1 text-gray-900">
//                               {statsData.totalDepartments}
//                             </h3>
//                           </div>
//                           <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
//                             <Building2 className="h-6 w-6 text-purple-600" />
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>

//                   {/* Charts and additional content */}
//                   <div className="grid gap-6 md:grid-cols-2">
//                     <Card className="border-0 shadow-md">
//                       <CardHeader>
//                         <CardTitle>Users by Designation</CardTitle>
//                         <CardDescription>
//                           Distribution of users across different roles
//                         </CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="h-80">
//                           <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                               <Pie
//                                 data={designationData}
//                                 cx="50%"
//                                 cy="50%"
//                                 innerRadius={60}
//                                 outerRadius={80}
//                                 paddingAngle={5}
//                                 dataKey="value"
//                                 label={({ name, percent }) =>
//                                   `${name}: ${((percent ?? 0) * 100).toFixed(
//                                     0
//                                   )}%`
//                                 }
//                               >
//                                 {designationData.map((entry: { color: string | undefined; }, index: any) => (
//                                   <Cell
//                                     key={`cell-${index}`}
//                                     fill={entry.color}
//                                   />
//                                 ))}
//                               </Pie>
//                               <Tooltip />
//                             </PieChart>
//                           </ResponsiveContainer>
//                         </div>
//                       </CardContent>
//                     </Card>

//                     <Card className="border-0 shadow-md">
//                       <CardHeader>
//                         <CardTitle>Recent Registrations</CardTitle>
//                         <CardDescription>
//                           New users joined in the last 7 days
//                         </CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="space-y-4">
//                           {recentRegistrations.map((user, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
//                             >
//                               <div className="flex items-center gap-3">
//                                 <Avatar className="h-9 w-9">
//                                   <AvatarFallback className="bg-blue-100 text-blue-800">
//                                     {user.name
//                                       .split(" ")
//                                       .map((n) => n[0])
//                                       .join("")}
//                                   </AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                   <p className="text-sm font-medium">
//                                     {user.name}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     {user.role}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <p className="text-xs text-gray-500">
//                                   {user.date}
//                                 </p>
// 
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </>
//               )}
//             </div>
//           ) : (
//             <Outlet />
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;

import { useState } from "react";

import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  Building2,
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEmployees, useDashboardStats } from "../../hooks/useEmployee"; // Import both hooks
import { useAuthStore } from "../../store/authStore";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { mutate: logout } = useAuthLogout();
  const { user } = useAuthStore();

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
    recentData?.users
      ?.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.designation || "Unknown",
        date: user.createdAt
          ? new Date(user.createdAt).toISOString().split("T")[0]
          : "Unknown",
      })) || [];

  return (
    // 1. Theme Wrapper
    <div className="flex h-screen bg-[#0f172a] relative overflow-hidden text-slate-200">
      {/* 2. Background Effects */}
      <div className="absolute inset-0 bg-slate-950 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-900/10 rounded-[100%] blur-[100px] pointer-events-none z-0" />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:linear-gradient(to_bottom,transparent_40%,#000_100%)] pointer-events-none opacity-20 z-0"
        style={{ transform: "perspective(1000px) rotateX(20deg) scale(1.2)" }}
      />

      {/* Sidebar backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900/95 border-r border-slate-800 backdrop-blur-xl
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} shadow-2xl`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30 shadow-lg shadow-blue-900/20">
              <Building2 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">E-Office</h1>
              <p className="text-xs text-blue-400 font-medium">Admin Portal</p>
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
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium
                    transition-all duration-200 ${isActive
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
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
          <div className="border-t border-slate-800 p-4 bg-slate-950/30">
            <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Avatar className="h-9 w-9 ring-2 ring-slate-700">
                <AvatarImage src="/" alt="Admin" />
                <AvatarFallback className="bg-slate-700 text-blue-400 font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email || "admin@eoffice.com"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-400 hover:bg-slate-800 hover:text-red-400 hover:border-slate-700 border border-transparent transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          {/* Breadcrumb */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white tracking-tight">
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
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5 text-slate-300">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Static user display (dropdown removed) */}
            <div className="flex items-center gap-2 pl-1 pr-3 rounded-full hover:bg-slate-800">
              <Avatar className="h-8 w-8 ring-2 ring-slate-700">
                <AvatarImage src="/" alt="Admin" />
                <AvatarFallback className="bg-slate-700 text-blue-400">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-slate-200">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {location.pathname === "/admin" ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Loading and Error States */}
              {(statsLoading || recentLoading) && (
                <div className="text-center text-slate-400">Loading dashboard data...</div>
              )}
              {(statsError || recentError) && (
                <div className="text-center text-red-400 bg-red-900/20 p-2 rounded border border-red-900/50">
                  Error: {statsError?.message || recentError?.message}
                </div>
              )}
              {statsData && recentData && (
                <>
                  {/* Stats grid */}
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <Card className="overflow-hidden border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-sm hover:border-slate-700 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-400">
                              Total Users
                            </p>
                            <h3 className="text-2xl font-bold mt-1 text-white">
                              {statsData.totalUsers.toLocaleString()}
                            </h3>
                          </div>
                          <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-sm hover:border-slate-700 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-400">
                              Departments
                            </p>
                            <h3 className="text-2xl font-bold mt-1 text-white">
                              {statsData.totalDepartments}
                            </h3>
                          </div>
                          <div className="h-12 w-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-purple-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts and additional content */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">Users by Designation</CardTitle>
                        <CardDescription className="text-slate-400">
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
                                stroke="none"
                              >
                                {designationData.map((entry: { color: string | undefined; }, index: any) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#f8fafc' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">Recent Registrations</CardTitle>
                        <CardDescription className="text-slate-400">
                          New users joined in the last 7 days
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentRegistrations.map((user, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:bg-slate-900 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback className="bg-slate-800 text-blue-400 font-bold border border-slate-700">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium text-slate-200">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {user.role}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-500">
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
