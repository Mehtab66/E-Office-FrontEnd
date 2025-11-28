// import React, { useState, useMemo, useEffect } from "react";
// import {
//     LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
// } from "recharts";
// import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
// import apiClient from "../../apis/apiClient";
// import type { TimeEntry, Deliverable, User } from "../../types";

// interface ProjectAnalyticsProps {
//     projectId: string;
//     filterStartDate: string;
//     filterEndDate: string;
//     filterEmployeeName: string;
// }

// const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({
//     projectId,
//     filterStartDate,
//     filterEndDate,
//     filterEmployeeName
// }) => {
//     const [dataType, setDataType] = useState<"timesheet" | "deliverables">("timesheet");
//     const [users, setUsers] = useState<User[]>([]);
//     const [timeEntries, setTimeEntries] = useState<any[]>([]);
//     const [deliverables, setDeliverables] = useState<any[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     // 1. Fetch Users List (Essential for mapping Names to IDs)
//     useEffect(() => {
//         apiClient.get("/api/analytics/users")
//             .then(res => setUsers(res.data))
//             .catch(err => console.error("Failed to load users for mapping", err));
//     }, []);

//     // 2. MAIN FETCH LOGIC - Triggers whenever filters change
//     useEffect(() => {
//         if (!projectId) return;

//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const params = new URLSearchParams();
//                 params.append("projectId", projectId);

//                 // --- Date Filters ---
//                 if (filterStartDate) params.append("startDate", filterStartDate);
//                 if (filterEndDate) params.append("endDate", filterEndDate);
//                 // Default to 'all' if no dates selected to show history
//                 if (!filterStartDate && !filterEndDate) params.append("timeSpan", "all");

//                 // --- Employee Filter (Name -> ID Logic) ---
//                 if (filterEmployeeName && filterEmployeeName !== "all" && filterEmployeeName !== "All Employees") {
//                     // We need users to be loaded to perform this map
//                     if (users.length > 0) {
//                         const targetName = filterEmployeeName.toLowerCase().trim();

//                         const matchedUser = users.find(u => {
//                             const simpleName = (u.name || "").toLowerCase();
//                             const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().trim();
//                             const email = (u.email || "").toLowerCase();

//                             return simpleName === targetName || fullName === targetName || email.includes(targetName);
//                         });

//                         if (matchedUser) {
//                             params.append("userId", matchedUser._id);
//                             console.log(`✅ Filter: Mapped "${filterEmployeeName}" -> ID ${matchedUser._id}`);
//                         } else {
//                             console.warn(`⚠️ Filter Warning: Could not find User ID for "${filterEmployeeName}". Fetching all users.`);
//                         }
//                     }
//                 }

//                 console.log(`🚀 Fetching Analytics: ${params.toString()}`);

//                 const response = await apiClient.get(`/api/analytics?${params.toString()}`);

//                 setTimeEntries(response.data.timeEntries || []);
//                 setDeliverables(response.data.deliverables || []);
//                 setError(null);

//             } catch (err: any) {
//                 console.error("Fetch failed", err);
//                 setError("Failed to load analytics data");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         // If filtering by employee, wait for users list to load first
//         if (filterEmployeeName && filterEmployeeName !== "all" && users.length === 0) {
//             // Do nothing, wait for users useEffect to fire and update 'users' state
//             return;
//         }

//         fetchData();

//     }, [projectId, filterStartDate, filterEndDate, filterEmployeeName, users]); // Dependencies ensure this runs on ANY change

//     // 3. Process Chart Data
//     const chartData = useMemo(() => {
//         if (loading && timeEntries.length === 0) return [];

//         let startDate = new Date();
//         let endDate = new Date();

//         // Determine Start
//         if (filterStartDate) {
//             startDate = new Date(filterStartDate);
//         } else {
//             // Auto-scale
//             const allDates = [...timeEntries, ...deliverables].map(x => new Date(x.date).getTime());
//             if (allDates.length > 0) startDate = new Date(Math.min(...allDates));
//             else startDate.setDate(new Date().getDate() - 30);
//         }

//         // Determine End
//         if (filterEndDate) endDate = new Date(filterEndDate);

//         // Normalize
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(23, 59, 59, 999);

//         // Continuous Timeline
//         const dataMap = new Map<string, { displayDate: string; total: number }>();
//         let iter = new Date(startDate);

//         // Loop safety
//         let safety = 0;
//         while (iter <= endDate && safety < 5000) {
//             const iso = iter.toISOString().split('T')[0];
//             dataMap.set(iso, {
//                 displayDate: iter.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//                 total: 0
//             });
//             iter.setDate(iter.getDate() + 1);
//             safety++;
//         }

//         // Fill Data
//         const items = dataType === "timesheet" ? timeEntries : deliverables;
//         items.forEach(item => {
//             if (!item.date) return;
//             const k = new Date(item.date).toISOString().split('T')[0];
//             if (dataMap.has(k)) {
//                 const entry = dataMap.get(k)!;
//                 if (dataType === "timesheet") entry.total += item.hours || 0;
//                 else entry.total += 1;
//             }
//         });

//         return Array.from(dataMap.values());
//     }, [timeEntries, deliverables, dataType, filterStartDate, filterEndDate, loading]);

//     const totalCount = useMemo(() => chartData.reduce((acc, curr) => acc + curr.total, 0), [chartData]);

//     return (
//         <div className="space-y-6">
//             {!projectId && <div className="text-red-600">Error: Project ID Missing</div>}

//             <div className="flex gap-4 items-center bg-gray-50 p-2 rounded-lg border export-exclude">
//                 <div className="flex bg-white rounded-md shadow-sm">
//                     <button onClick={() => setDataType("timesheet")} className={`px-4 py-2 text-sm font-medium rounded-l-md ${dataType === "timesheet" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}>Timesheets</button>
//                     <button onClick={() => setDataType("deliverables")} className={`px-4 py-2 text-sm font-medium rounded-r-md ${dataType === "deliverables" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}>Deliverables</button>
//                 </div>
//                 <span className="text-xs text-gray-500">
//                     Showing data for: <b>{filterEmployeeName === "all" ? "All Employees" : filterEmployeeName}</b>
//                     {filterStartDate ? ` from ${filterStartDate}` : ""}
//                     {filterEndDate ? ` to ${filterEndDate}` : ""}
//                 </span>
//             </div>

//             {loading ? (
//                 <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
//             ) : (
//                 <>
//                     <div className="bg-white p-6 rounded-xl border shadow-sm">
//                         <div className="flex justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-500">Total {dataType === "timesheet" ? "Hours" : "Deliverables"}</p>
//                                 <h3 className="text-3xl font-bold text-gray-900">{totalCount}</h3>
//                             </div>
//                             <FiClock className="text-blue-500 w-8 h-8" />
//                         </div>
//                     </div>

//                     <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px]">
//                         <ResponsiveContainer width="100%" height="100%">
//                             {dataType === "timesheet" ? (
//                                 <LineChart data={chartData}>
//                                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                                     <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} minTickGap={30} />
//                                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
//                                 </LineChart>
//                             ) : (
//                                 <BarChart data={chartData}>
//                                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                                     <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} minTickGap={30} />
//                                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
//                                 </BarChart>
//                             )}
//                         </ResponsiveContainer>
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

    // 1. Fetch Users List
    useEffect(() => {
        apiClient.get("/api/analytics/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error("Failed to load users for mapping", err));
    }, []);

    // 2. MAIN FETCH LOGIC
    useEffect(() => {
        if (!projectId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append("projectId", projectId);

                if (filterStartDate) params.append("startDate", filterStartDate);
                if (filterEndDate) params.append("endDate", filterEndDate);
                if (!filterStartDate && !filterEndDate) params.append("timeSpan", "all");

                if (filterEmployeeName && filterEmployeeName !== "all" && filterEmployeeName !== "All Employees") {
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

        if (filterEmployeeName && filterEmployeeName !== "all" && users.length === 0) {
            return;
        }

        fetchData();

    }, [projectId, filterStartDate, filterEndDate, filterEmployeeName, users]);

    // 3. Process Chart Data
    const chartData = useMemo(() => {
        if (loading && timeEntries.length === 0) return [];

        let startDate = new Date();
        let endDate = new Date();

        if (filterStartDate) {
            startDate = new Date(filterStartDate);
        } else {
            const allDates = [...timeEntries, ...deliverables].map(x => new Date(x.date).getTime());
            if (allDates.length > 0) startDate = new Date(Math.min(...allDates));
            else startDate.setDate(new Date().getDate() - 30);
        }

        if (filterEndDate) endDate = new Date(filterEndDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const dataMap = new Map<string, { displayDate: string; total: number }>();
        let iter = new Date(startDate);

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

    // Custom Tooltip for Dark Theme
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                    <p className="text-slate-300 text-sm mb-1">{label}</p>
                    <p className="text-white font-bold">
                        {payload[0].value} {dataType === "timesheet" ? "Hours" : "Items"}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        // THEME CONTAINER
        <div className="space-y-6 container">
            {!projectId && <div className="text-red-400 bg-red-900/20 p-3 rounded border border-red-900/50">Error: Project ID Missing</div>}

            <div className="flex gap-4 items-center bg-slate-900/80 p-2 rounded-lg border border-slate-800 backdrop-blur-sm export-exclude">
                <div className="flex bg-slate-950 rounded-md shadow-inner border border-slate-800">
                    <button
                        onClick={() => setDataType("timesheet")}
                        className={`px-4 py-2 text-sm font-medium rounded-l-md transition-all ${dataType === "timesheet"
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            }`}
                    >
                        Timesheets
                    </button>
                    <button
                        onClick={() => setDataType("deliverables")}
                        className={`px-4 py-2 text-sm font-medium rounded-r-md transition-all ${dataType === "deliverables"
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            }`}
                    >
                        Deliverables
                    </button>
                </div>
                <span className="text-xs text-slate-400">
                    Showing data for: <b className="text-slate-200">{filterEmployeeName === "all" ? "All Employees" : filterEmployeeName}</b>
                    {filterStartDate ? ` from ${filterStartDate}` : ""}
                    {filterEndDate ? ` to ${filterEndDate}` : ""}
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center h-64 items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-700 border-t-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-400">Total {dataType === "timesheet" ? "Hours" : "Deliverables"}</p>
                                <h3 className="text-3xl font-bold text-white mt-1">{totalCount}</h3>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <FiClock className="text-blue-400 w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 shadow-xl h-[400px] backdrop-blur-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            {dataType === "timesheet" ? (
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                    <XAxis
                                        dataKey="displayDate"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                                        dy={10}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#1e293b" }}
                                        activeDot={{ r: 6, fill: "#60a5fa" }}
                                    />
                                </LineChart>
                            ) : (
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                    <XAxis
                                        dataKey="displayDate"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                                        dy={10}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                                    <Bar
                                        dataKey="total"
                                        fill="#8b5cf6"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
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