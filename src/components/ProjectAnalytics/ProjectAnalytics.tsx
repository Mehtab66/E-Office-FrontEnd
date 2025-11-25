// import React, { useState, useMemo, useEffect } from "react";
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
//     BarChart,
//     Bar,
// } from "recharts";
// import { FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle, FiUser } from "react-icons/fi";
// import apiClient from "../../apis/apiClient";
// import type { TimeEntry, Deliverable, User } from "../../types";

// // Extended types if the API returns populated fields
// interface PopulatedTimeEntry extends Omit<TimeEntry, 'employee'> {
//     user?: { _id: string; name: string };
//     employee?: string | { _id: string; name: string };
// }

// interface PopulatedDeliverable extends Deliverable {
//     createdBy?: { _id: string; name: string };
// }

// interface ProjectAnalyticsProps { }

// type TimeSpan = "7days" | "30days" | "3months" | "all";
// type DataType = "timesheet" | "deliverables";

// const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = () => {
//     const [timeSpan, setTimeSpan] = useState<TimeSpan>("7days");
//     const [dataType, setDataType] = useState<DataType>("timesheet");
//     const [selectedUserId, setSelectedUserId] = useState<string>("");
//     const [users, setUsers] = useState<User[]>([]);
//     const [timeEntries, setTimeEntries] = useState<PopulatedTimeEntry[]>([]);
//     const [deliverables, setDeliverables] = useState<PopulatedDeliverable[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     // Fetch Users
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await apiClient.get("/api/analytics/users");
//                 setUsers(response.data);
//             } catch (err) {
//                 console.error("Error fetching users:", err);
//             }
//         };
//         fetchUsers();
//     }, []);

//     // Fetch Analytics Data
//     useEffect(() => {
//         const fetchAnalytics = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const params = new URLSearchParams();
//                 if (selectedUserId) params.append("userId", selectedUserId);
//                 params.append("timeSpan", timeSpan);

//                 const response = await apiClient.get(`/api/analytics?${params.toString()}`); const data = response.data;

//                 setTimeEntries(data.timeEntries || []);
//                 setDeliverables(data.deliverables || []);
//             } catch (err: any) {
//                 console.error("Error fetching analytics:", err);
//                 setError(err.response?.data?.message || err.message || "Failed to fetch analytics data");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchAnalytics();
//     }, [timeSpan, selectedUserId]);

//     // Helper to get start date based on time span
//     const getStartDate = (span: TimeSpan): Date | null => {
//         const now = new Date();
//         const start = new Date(now);
//         start.setHours(0, 0, 0, 0);
//         switch (span) {
//             case "7days":
//                 start.setDate(now.getDate() - 6);
//                 return start;
//             case "30days":
//                 start.setDate(now.getDate() - 29);
//                 return start;
//             case "3months":
//                 start.setMonth(now.getMonth() - 3);
//                 return start;
//             case "all":
//                 return null;
//             default:
//                 return null;
//         }
//     };

//     // Aggregate data for the chart
//     const chartData = useMemo(() => {
//         const dataMap = new Map<string, any>();
//         const startDate = getStartDate(timeSpan);
//         const endDate = new Date();

//         // Initialize map with all dates in range if not "all"
//         if (startDate) {
//             let current = new Date(startDate);
//             while (current <= endDate) {
//                 const dateKey = current.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//                 dataMap.set(dateKey, { name: dateKey, total: 0 });
//                 current.setDate(current.getDate() + 1);
//             }
//         }

//         if (dataType === "timesheet") {
//             timeEntries.forEach((entry) => {
//                 if (!entry.date) return;
//                 const dateKey = new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
//                 // If we are in "all" mode or date is within range
//                 if (!startDate || new Date(entry.date) >= startDate) {
//                     const existing = dataMap.get(dateKey) || { name: dateKey, total: 0 };
//                     existing.total += entry.hours || 0;
//                     dataMap.set(dateKey, existing);
//                 }
//             });
//         } else {
//             deliverables.forEach((d) => {
//                 if (!d.date) return;
//                 const dateKey = new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
//                 if (!startDate || new Date(d.date) >= startDate) {
//                     const existing = dataMap.get(dateKey) || { name: dateKey, total: 0 };
//                     existing.total += 1;
//                     dataMap.set(dateKey, existing);
//                 }
//             });
//         }

//         // Sort by date if "all"
//         const result = Array.from(dataMap.values());
//         if (timeSpan === "all") {
//             result.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
//         }
//         return result;
//     }, [timeEntries, deliverables, dataType, timeSpan]);

//     // Calculate statistics
//     const stats = useMemo(() => {
//         const currentTotal = chartData.reduce((acc, curr) => acc + curr.total, 0);

//         // Simple trend calculation (placeholder as we don't have prev period data from backend yet)
//         const prevTotal = 0;
//         const diff = currentTotal - prevTotal;
//         const percentage = prevTotal === 0 ? 0 : Math.round((diff / prevTotal) * 100);
//         const isIncreasing = diff >= 0;

//         return {
//             total: currentTotal,
//             trend: Math.abs(percentage),
//             isIncreasing,
//         };
//     }, [chartData]);

//     return (
//         <div className="space-y-6 animate-in fade-in duration-500">
//             {/* Header Controls */}
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
//                 <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
//                     <button
//                         onClick={() => setDataType("timesheet")}
//                         className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${dataType === "timesheet"
//                             ? "bg-white text-blue-600 shadow-sm"
//                             : "text-gray-600 hover:text-gray-900"
//                             }`}
//                     >
//                         Timesheets
//                     </button>
//                     <button
//                         onClick={() => setDataType("deliverables")}
//                         className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${dataType === "deliverables"
//                             ? "bg-white text-blue-600 shadow-sm"
//                             : "text-gray-600 hover:text-gray-900"
//                             }`}
//                     >
//                         Deliverables
//                     </button>
//                 </div>

//                 <div className="flex items-center gap-4">
//                     {/* User Selector */}
//                     <div className="relative">
//                         <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                         <select
//                             value={selectedUserId}
//                             onChange={(e) => setSelectedUserId(e.target.value)}
//                             className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors cursor-pointer min-w-[200px]"
//                         >
//                             <option value="">All Users</option>
//                             {users.map(user => (
//                                 <option key={user._id} value={user._id}>{user.name}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <select
//                         value={timeSpan}
//                         onChange={(e) => setTimeSpan(e.target.value as TimeSpan)}
//                         className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors cursor-pointer"
//                     >
//                         <option value="7days">Last 7 Days</option>
//                         <option value="30days">Last 30 Days</option>
//                         <option value="3months">Last 3 Months</option>
//                         <option value="all">All Time</option>
//                     </select>
//                 </div>
//             </div>

//             {loading ? (
//                 <div className="flex justify-center items-center h-64">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 </div>
//             ) : error ? (
//                 <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">
//                     <p className="font-medium">Error loading data</p>
//                     <p className="text-sm mt-1">{error}</p>
//                 </div>
//             ) : (
//                 <>
//                     {/* Statistics Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm">
//                             <div className="flex justify-between items-start">
//                                 <div>
//                                     <p className="text-sm font-medium text-blue-600 mb-1">
//                                         Total {dataType === "timesheet" ? "Hours" : "Deliverables"}
//                                     </p>
//                                     <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
//                                 </div>
//                                 <div className={`p-2 rounded-lg ${dataType === "timesheet" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
//                                     {dataType === "timesheet" ? <FiClock size={24} /> : <FiCheckCircle size={24} />}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Placeholder for other stats if needed, or just layout filler */}
//                         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm md:col-span-2 flex items-center justify-center text-gray-400 text-sm">
//                             More detailed breakdown by employee coming soon...
//                         </div>
//                     </div>

//                     {/* Main Chart */}
//                     <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-6">
//                             {dataType === "timesheet" ? "Hours Logged" : "Deliverables Submitted"} Over Time
//                         </h3>
//                         <div className="h-[400px] w-full">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 {dataType === "timesheet" ? (
//                                     <LineChart data={chartData}>
//                                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
//                                         <XAxis
//                                             dataKey="name"
//                                             axisLine={false}
//                                             tickLine={false}
//                                             tick={{ fill: '#6b7280', fontSize: 12 }}
//                                             dy={10}
//                                         />
//                                         <YAxis
//                                             axisLine={false}
//                                             tickLine={false}
//                                             tick={{ fill: '#6b7280', fontSize: 12 }}
//                                         />
//                                         <Tooltip
//                                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
//                                         />
//                                         <Line
//                                             type="monotone"
//                                             dataKey="total"
//                                             stroke="#2563eb"
//                                             strokeWidth={3}
//                                             dot={{ fill: '#2563eb', strokeWidth: 2, r: 4, stroke: '#fff' }}
//                                             activeDot={{ r: 6, strokeWidth: 0 }}
//                                         />
//                                     </LineChart>
//                                 ) : (
//                                     <BarChart data={chartData}>
//                                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
//                                         <XAxis
//                                             dataKey="name"
//                                             axisLine={false}
//                                             tickLine={false}
//                                             tick={{ fill: '#6b7280', fontSize: 12 }}
//                                             dy={10}
//                                         />
//                                         <YAxis
//                                             axisLine={false}
//                                             tickLine={false}
//                                             tick={{ fill: '#6b7280', fontSize: 12 }}
//                                         />
//                                         <Tooltip
//                                             cursor={{ fill: '#f3f4f6' }}
//                                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
//                                         />
//                                         <Bar
//                                             dataKey="total"
//                                             fill="#8b5cf6"
//                                             radius={[4, 4, 0, 0]}
//                                             barSize={40}
//                                         />
//                                     </BarChart>
//                                 )}
//                             </ResponsiveContainer>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default ProjectAnalytics;

import React, { useState, useMemo, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import apiClient from "../../apis/apiClient";
import type { TimeEntry, Deliverable, User } from "../../types";

interface ProjectAnalyticsProps {
    projectId: string;
    filterStartDate: string;
    filterEndDate: string;
    filterEmployeeName: string;
}

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({
    projectId,
    filterStartDate,
    filterEndDate,
    filterEmployeeName
}) => {
    const [dataType, setDataType] = useState<"timesheet" | "deliverables">("timesheet");
    const [users, setUsers] = useState<User[]>([]);
    const [timeEntries, setTimeEntries] = useState<any[]>([]);
    const [deliverables, setDeliverables] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch Users List (Essential for mapping Names to IDs)
    useEffect(() => {
        apiClient.get("/api/analytics/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error("Failed to load users for mapping", err));
    }, []);

    // 2. MAIN FETCH LOGIC - Triggers whenever filters change
    useEffect(() => {
        if (!projectId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append("projectId", projectId);

                // --- Date Filters ---
                if (filterStartDate) params.append("startDate", filterStartDate);
                if (filterEndDate) params.append("endDate", filterEndDate);
                // Default to 'all' if no dates selected to show history
                if (!filterStartDate && !filterEndDate) params.append("timeSpan", "all");

                // --- Employee Filter (Name -> ID Logic) ---
                if (filterEmployeeName && filterEmployeeName !== "all" && filterEmployeeName !== "All Employees") {
                    // We need users to be loaded to perform this map
                    if (users.length > 0) {
                        const targetName = filterEmployeeName.toLowerCase().trim();

                        const matchedUser = users.find(u => {
                            const simpleName = (u.name || "").toLowerCase();
                            const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().trim();
                            const email = (u.email || "").toLowerCase();

                            return simpleName === targetName || fullName === targetName || email.includes(targetName);
                        });

                        if (matchedUser) {
                            params.append("userId", matchedUser._id);
                            console.log(`✅ Filter: Mapped "${filterEmployeeName}" -> ID ${matchedUser._id}`);
                        } else {
                            console.warn(`⚠️ Filter Warning: Could not find User ID for "${filterEmployeeName}". Fetching all users.`);
                        }
                    }
                }

                console.log(`🚀 Fetching Analytics: ${params.toString()}`);

                const response = await apiClient.get(`/api/analytics?${params.toString()}`);

                setTimeEntries(response.data.timeEntries || []);
                setDeliverables(response.data.deliverables || []);
                setError(null);

            } catch (err: any) {
                console.error("Fetch failed", err);
                setError("Failed to load analytics data");
            } finally {
                setLoading(false);
            }
        };

        // If filtering by employee, wait for users list to load first
        if (filterEmployeeName && filterEmployeeName !== "all" && users.length === 0) {
            // Do nothing, wait for users useEffect to fire and update 'users' state
            return;
        }

        fetchData();

    }, [projectId, filterStartDate, filterEndDate, filterEmployeeName, users]); // Dependencies ensure this runs on ANY change

    // 3. Process Chart Data
    const chartData = useMemo(() => {
        if (loading && timeEntries.length === 0) return [];

        let startDate = new Date();
        let endDate = new Date();

        // Determine Start
        if (filterStartDate) {
            startDate = new Date(filterStartDate);
        } else {
            // Auto-scale
            const allDates = [...timeEntries, ...deliverables].map(x => new Date(x.date).getTime());
            if (allDates.length > 0) startDate = new Date(Math.min(...allDates));
            else startDate.setDate(new Date().getDate() - 30);
        }

        // Determine End
        if (filterEndDate) endDate = new Date(filterEndDate);

        // Normalize
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        // Continuous Timeline
        const dataMap = new Map<string, { displayDate: string; total: number }>();
        let iter = new Date(startDate);

        // Loop safety
        let safety = 0;
        while (iter <= endDate && safety < 5000) {
            const iso = iter.toISOString().split('T')[0];
            dataMap.set(iso, {
                displayDate: iter.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                total: 0
            });
            iter.setDate(iter.getDate() + 1);
            safety++;
        }

        // Fill Data
        const items = dataType === "timesheet" ? timeEntries : deliverables;
        items.forEach(item => {
            if (!item.date) return;
            const k = new Date(item.date).toISOString().split('T')[0];
            if (dataMap.has(k)) {
                const entry = dataMap.get(k)!;
                if (dataType === "timesheet") entry.total += item.hours || 0;
                else entry.total += 1;
            }
        });

        return Array.from(dataMap.values());
    }, [timeEntries, deliverables, dataType, filterStartDate, filterEndDate, loading]);

    const totalCount = useMemo(() => chartData.reduce((acc, curr) => acc + curr.total, 0), [chartData]);

    return (
        <div className="space-y-6">
            {!projectId && <div className="text-red-600">Error: Project ID Missing</div>}

            <div className="flex gap-4 items-center bg-gray-50 p-2 rounded-lg border">
                <div className="flex bg-white rounded-md shadow-sm">
                    <button onClick={() => setDataType("timesheet")} className={`px-4 py-2 text-sm font-medium rounded-l-md ${dataType === "timesheet" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}>Timesheets</button>
                    <button onClick={() => setDataType("deliverables")} className={`px-4 py-2 text-sm font-medium rounded-r-md ${dataType === "deliverables" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}>Deliverables</button>
                </div>
                <span className="text-xs text-gray-500">
                    Showing data for: <b>{filterEmployeeName === "all" ? "All Employees" : filterEmployeeName}</b>
                    {filterStartDate ? ` from ${filterStartDate}` : ""}
                    {filterEndDate ? ` to ${filterEndDate}` : ""}
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
            ) : (
                <>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total {dataType === "timesheet" ? "Hours" : "Deliverables"}</p>
                                <h3 className="text-3xl font-bold text-gray-900">{totalCount}</h3>
                            </div>
                            <FiClock className="text-blue-500 w-8 h-8" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            {dataType === "timesheet" ? (
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} minTickGap={30} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            ) : (
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} minTickGap={30} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectAnalytics;