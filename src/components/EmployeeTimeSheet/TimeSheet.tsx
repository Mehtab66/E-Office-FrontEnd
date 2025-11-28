// import React, { useEffect, useRef, useState } from "react";
// import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
// import type { Project } from "../../types/project";
// import type { TimeEntry } from "../../types/timeEntry";

// interface TimesheetsViewProps {
//   timeEntries: TimeEntry[];
//   projects: Project[];
//   projectFilter: string;
//   dateFrom: string;
//   dateTo: string;
//   setProjectFilter: (value: string) => void;
//   setDateFrom: (value: string) => void;
//   setDateTo: (value: string) => void;
//   onAddTime: () => void;
//   onEditTime: (entry: TimeEntry) => void;
//   onDeleteTime: (projectId: string, timeEntryId: string) => void;
// }

// const STORAGE_KEY = "timesheets_displayed_entries_v1";

// const TimesheetsView: React.FC<TimesheetsViewProps> = ({
//   timeEntries,
//   projects,
//   projectFilter,
//   dateFrom,
//   dateTo,
//   setProjectFilter,
//   setDateFrom,
//   setDateTo,
//   onAddTime,
//   onEditTime,
//   onDeleteTime,
// }) => {
//   // DEBUG: log on every render
//   console.debug("[TimesheetsView] render", {
//     timeEntriesLength: Array.isArray(timeEntries) ? timeEntries.length : timeEntries,
//     projectFilter,
//     dateFrom,
//     dateTo,
//   });

//   const totalHours = timeEntries.reduce(
//     (total, entry) => total + (entry.hours || 0), // Safer sum
//     0
//   );

//   const formatDate = (d: Date) => {
//     const y = d.getFullYear();
//     const m = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${y}-${m}-${day}`;
//   };

//   const todayStr = formatDate(new Date());

//   useEffect(() => {
//     if (!dateFrom) return;

//     if (dateFrom > todayStr) {
//       setDateFrom(todayStr);
//       setDateTo(todayStr);
//       return;
//     }

//     if (dateFrom === todayStr) {
//       if (dateTo !== todayStr) setDateTo(todayStr);
//       return;
//     }

//     if (dateTo && dateTo < dateFrom) {
//       setDateTo(dateFrom);
//     }

//     if (dateTo && dateTo > todayStr) {
//       setDateTo(todayStr);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateFrom]);

//   useEffect(() => {
//     if (!dateTo) return;
//     if (dateTo > todayStr) {
//       setDateTo(todayStr);
//     }
//     if (dateFrom && dateTo < dateFrom) {
//       setDateTo(dateFrom);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateTo, dateFrom]);

//   const [displayedEntries, setDisplayedEntries] = useState<TimeEntry[]>(
//     () => (Array.isArray(timeEntries) ? timeEntries : [])
//   );

//   const [isFiltering, setIsFiltering] = useState(false);

//   const maxTimeoutRef = useRef<number | null>(null);
//   const pendingDeletesRef = useRef<Set<string>>(new Set());

//   const markPendingDelete = (id: string) => {
//     pendingDeletesRef.current.add(id);
//   };
//   const unmarkPendingDelete = (id: string) => {
//     pendingDeletesRef.current.delete(id);
//   };

//   const startFiltering = () => {
//     setIsFiltering(true);
//     if (maxTimeoutRef.current) {
//       window.clearTimeout(maxTimeoutRef.current);
//       maxTimeoutRef.current = null;
//     }
//     maxTimeoutRef.current = window.setTimeout(() => {
//       setIsFiltering(false);
//       maxTimeoutRef.current = null;
//     }, 10000);
//   };

//   // --- NEW: helper to find team member name by id across projects ---
//   const findMemberNameById = (id: string | number): string | null => {
//     if (!id) return null;
//     const sid = String(id);
//     for (const p of projects || []) {
//       const members = p.teamMembers || [];
//       for (const m of members) {
//         if (typeof m === "string") {
//           if (String(m) === sid) return m;
//         } else {
//           const mid = (m as any)._id || (m as any).id || (m as any).userId || null;
//           if (mid && String(mid) === sid) {
//             return (m as any).name || null;
//           }
//         }
//       }
//     }
//     return null;
//   };

//   // helper to get the entry user's display name (keeps original precedence but resolves ids)
//   const getEntryUserName = (entry: any) => {
//     // if user object with name exists
//     if (entry.user && typeof entry.user === "object") {
//       return entry.user.name || entry.userName || "Unknown";
//     }
//     // if explicit userName field
//     if (entry.userName) return entry.userName;
//     // try common id fields
//     if (entry.user) {
//       const byId = findMemberNameById(entry.user);
//       return byId || String(entry.user);
//     }
//     if (entry.userId) {
//       const byId = findMemberNameById(entry.userId);
//       return byId || String(entry.userId);
//     }
//     // fallback
//     return "Unknown";
//   };

//   useEffect(() => {
//     console.debug("[TimesheetsView] timeEntries effect start", {
//       incomingLength: Array.isArray(timeEntries) ? timeEntries.length : timeEntries,
//       pendingDeletes: Array.from(pendingDeletesRef.current),
//       displayedBefore: displayedEntries.length,
//       isFiltering,
//     });

//     const incomingArray = Array.isArray(timeEntries) ? timeEntries : [];
//     const filteredIncoming = incomingArray.filter((e) => {
//       const id = (e as any)._id || (e as any).id;
//       return !pendingDeletesRef.current.has(String(id));
//     });

//     setDisplayedEntries(filteredIncoming);

//     try {
//       if (filteredIncoming && filteredIncoming.length > 0) {
//         sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filteredIncoming));
//       }
//     } catch { }

//     if (isFiltering) {
//       setIsFiltering(false);
//     }

//     if (incomingArray && incomingArray.length > 0) {
//       const incomingIds = new Set(
//         incomingArray.map((e) => String((e as any)._id || (e as any).id))
//       );
//       Array.from(pendingDeletesRef.current).forEach((pendingId) => {
//         if (!incomingIds.has(pendingId)) {
//           unmarkPendingDelete(pendingId);
//         }
//       });
//     }

//     if (maxTimeoutRef.current) {
//       window.clearTimeout(maxTimeoutRef.current);
//       maxTimeoutRef.current = null;
//     }

//     console.debug("[TimesheetsView] timeEntries effect end", {
//       displayedAfter: filteredIncoming.length,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [timeEntries]);

//   useEffect(() => {
//     try {
//       if (displayedEntries && displayedEntries.length > 0) {
//         sessionStorage.setItem(STORAGE_KEY, JSON.stringify(displayedEntries));
//       }
//     } catch { }
//   }, [displayedEntries]);

//   useEffect(() => {
//     return () => {
//       if (maxTimeoutRef.current) {
//         window.clearTimeout(maxTimeoutRef.current);
//       }
//     };
//   }, []);

//   const handleClearFilters = () => {
//     startFiltering();
//     setProjectFilter("");
//     setDateFrom("");
//     setDateTo("");
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Timesheets</h1>
//           <p className="text-gray-600">Track and manage your time entries</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={onAddTime}
//             className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md"
//           >
//             <FiPlus className="mr-2" /> Add Entry
//           </button>
//         </div>
//       </div>
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
//         {isFiltering && (
//           <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
//             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-dashed animate-spin" />
//           </div>
//         )}

//         <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
//           <div className="flex items-center">
//             <span className="text-sm text-gray-600 mr-2">Show:</span>
//             <select
//               value={projectFilter}
//               onChange={(e) => {
//                 startFiltering();
//                 setProjectFilter(e.target.value);
//               }}
//               className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             >
//               <option value="">All Projects</option>
//               {projects.map((project) => (
//                 <option key={project._id || project.id} value={project._id || project.id}>
//                   {project.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex items-center">
//             <span className="text-sm text-gray-600 mr-2">From:</span>
//             <input
//               type="date"
//               value={dateFrom}
//               max={todayStr}
//               onChange={(e) => {
//                 startFiltering();
//                 setDateFrom(e.target.value);
//                 if (e.target.value === todayStr) {
//                   setDateTo(todayStr);
//                 }
//               }}
//               className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>
//           <div className="flex items-center">
//             <span className="text-sm text-gray-600 mr-2">To:</span>
//             <input
//               type="date"
//               value={dateTo}
//               min={dateFrom || undefined}
//               max={todayStr}
//               onChange={(e) => {
//                 startFiltering();
//                 setDateTo(e.target.value);
//               }}
//               className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>

//           <div className="ml-auto">
//             <button
//               onClick={handleClearFilters}
//               className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
//             >
//               Clear filters
//             </button>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 {/* NEW: Team Member column (shows avatar initial + name as in ProjectDetailsView) */}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Team Member
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Project
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Task
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Hours
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Notes
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {displayedEntries.map((entry) => {
//                 const projectId =
//                   typeof entry.project === "object"
//                     ? entry.project?._id || entry.project?.id
//                     : entry.project;

//                 const projectName =
//                   projects.find((p) => (p._id || p.id) === projectId)?.name ||
//                   "Project Not Found";

//                 const entryId = entry._id || entry.id;
//                 const userName = getEntryUserName(entry);
//                 const initial = (userName && userName[0]) ? userName[0].toUpperCase() : "?";

//                 return (
//                   <tr key={entryId} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
//                           <span className="text-sm font-medium text-indigo-700">{initial}</span>
//                         </div>
//                         <div className="text-sm font-medium text-gray-900">{userName}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">{projectName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">{entry.title || "N/A"}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {entry.hours != null ? `${entry.hours}h` : "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {entry.note || "-"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-3 py-1 text-xs font-medium rounded-full ${entry.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                           }`}
//                       >
//                         {entry.approved ? "Approved" : "Pending"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
//                       <button
//                         onClick={() => onEditTime(entry)}
//                         className="text-indigo-600 hover:text-indigo-800"
//                         disabled={!entryId}
//                       >
//                         <FiEdit />
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (!projectId || !entryId) {
//                             console.error("Missing project or entry ID for delete");
//                             return;
//                           }

//                           console.debug("[TimesheetsView] delete click", { projectId, entryId });

//                           const prev = displayedEntries;
//                           setDisplayedEntries(prev.filter((e) => (e._id || e.id) !== entryId));
//                           markPendingDelete(String(entryId));

//                           try {
//                             const result: any = (onDeleteTime as any)(projectId, entryId);
//                             if (result && typeof result.then === "function") {
//                               result
//                                 .then(() => {
//                                   unmarkPendingDelete(String(entryId));
//                                   console.debug("[TimesheetsView] delete succeeded", { entryId });
//                                 })
//                                 .catch((err: any) => {
//                                   console.error("Delete failed, rolling back UI:", err);
//                                   setDisplayedEntries(prev);
//                                   unmarkPendingDelete(String(entryId));
//                                 });
//                             } else {
//                               window.setTimeout(() => {
//                                 unmarkPendingDelete(String(entryId));
//                               }, 5000);
//                             }
//                           } catch (err) {
//                             console.error("Delete handler threw, rolling back UI:", err);
//                             setDisplayedEntries(prev);
//                             unmarkPendingDelete(String(entryId));
//                           }
//                         }}
//                         className="text-red-600 hover:text-red-800"
//                         disabled={!projectId || !entryId}
//                       >
//                         <FiTrash2 />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//         <div className="p-5 border-t border-gray-100">
//           <p className="text-sm font-medium text-gray-900">Total Hours: {totalHours.toFixed(1)}h</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TimesheetsView;
import React, { useEffect, useRef, useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import type { Project } from "../../types/project";
import type { TimeEntry } from "../../types/timeEntry";

interface TimesheetsViewProps {
  timeEntries: TimeEntry[];
  projects: Project[];
  projectFilter: string;
  dateFrom: string;
  dateTo: string;
  setProjectFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  onAddTime: () => void;
  onEditTime: (entry: TimeEntry) => void;
  onDeleteTime: (projectId: string, timeEntryId: string) => void;
}

const STORAGE_KEY = "timesheets_displayed_entries_v1";

const TimesheetsView: React.FC<TimesheetsViewProps> = ({
  timeEntries,
  projects,
  projectFilter,
  dateFrom,
  dateTo,
  setProjectFilter,
  setDateFrom,
  setDateTo,
  onAddTime,
  onEditTime,
  onDeleteTime,
}) => {
  console.debug("[TimesheetsView] render", {
    timeEntriesLength: Array.isArray(timeEntries) ? timeEntries.length : timeEntries,
    projectFilter,
    dateFrom,
    dateTo,
  });

  const totalHours = timeEntries.reduce(
    (total, entry) => total + (entry.hours || 0),
    0
  );

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const todayStr = formatDate(new Date());

  useEffect(() => {
    if (!dateFrom) return;

    if (dateFrom > todayStr) {
      setDateFrom(todayStr);
      setDateTo(todayStr);
      return;
    }

    if (dateFrom === todayStr) {
      if (dateTo !== todayStr) setDateTo(todayStr);
      return;
    }

    if (dateTo && dateTo < dateFrom) {
      setDateTo(dateFrom);
    }

    if (dateTo && dateTo > todayStr) {
      setDateTo(todayStr);
    }
  }, [dateFrom]);

  useEffect(() => {
    if (!dateTo) return;
    if (dateTo > todayStr) {
      setDateTo(todayStr);
    }
    if (dateFrom && dateTo < dateFrom) {
      setDateTo(dateFrom);
    }
  }, [dateTo, dateFrom]);

  const [displayedEntries, setDisplayedEntries] = useState<TimeEntry[]>(
    () => (Array.isArray(timeEntries) ? timeEntries : [])
  );

  const [isFiltering, setIsFiltering] = useState(false);

  const maxTimeoutRef = useRef<number | null>(null);
  const pendingDeletesRef = useRef<Set<string>>(new Set());

  const markPendingDelete = (id: string) => {
    pendingDeletesRef.current.add(id);
  };
  const unmarkPendingDelete = (id: string) => {
    pendingDeletesRef.current.delete(id);
  };

  const startFiltering = () => {
    setIsFiltering(true);
    if (maxTimeoutRef.current) {
      window.clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    maxTimeoutRef.current = window.setTimeout(() => {
      setIsFiltering(false);
      maxTimeoutRef.current = null;
    }, 10000);
  };

  const findMemberNameById = (id: string | number): string | null => {
    if (!id) return null;
    const sid = String(id);
    for (const p of projects || []) {
      const members = p.teamMembers || [];
      for (const m of members) {
        if (typeof m === "string") {
          if (String(m) === sid) return m;
        } else {
          const mid = (m as any)._id || (m as any).id || (m as any).userId || null;
          if (mid && String(mid) === sid) {
            return (m as any).name || null;
          }
        }
      }
    }
    return null;
  };

  const getEntryUserName = (entry: any) => {
    if (entry.user && typeof entry.user === "object") {
      return entry.user.name || entry.userName || "Unknown";
    }
    if (entry.userName) return entry.userName;
    if (entry.user) {
      const byId = findMemberNameById(entry.user);
      return byId || String(entry.user);
    }
    if (entry.userId) {
      const byId = findMemberNameById(entry.userId);
      return byId || String(entry.userId);
    }
    return "Unknown";
  };

  useEffect(() => {
    console.debug("[TimesheetsView] timeEntries effect start", {
      incomingLength: Array.isArray(timeEntries) ? timeEntries.length : timeEntries,
      pendingDeletes: Array.from(pendingDeletesRef.current),
      displayedBefore: displayedEntries.length,
      isFiltering,
    });

    const incomingArray = Array.isArray(timeEntries) ? timeEntries : [];
    const filteredIncoming = incomingArray.filter((e) => {
      const id = (e as any)._id || (e as any).id;
      return !pendingDeletesRef.current.has(String(id));
    });

    setDisplayedEntries(filteredIncoming);

    try {
      if (filteredIncoming && filteredIncoming.length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filteredIncoming));
      }
    } catch { }

    if (isFiltering) {
      setIsFiltering(false);
    }

    if (incomingArray && incomingArray.length > 0) {
      const incomingIds = new Set(
        incomingArray.map((e) => String((e as any)._id || (e as any).id))
      );
      Array.from(pendingDeletesRef.current).forEach((pendingId) => {
        if (!incomingIds.has(pendingId)) {
          unmarkPendingDelete(pendingId);
        }
      });
    }

    if (maxTimeoutRef.current) {
      window.clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }

    console.debug("[TimesheetsView] timeEntries effect end", {
      displayedAfter: filteredIncoming.length,
    });
  }, [timeEntries]);

  useEffect(() => {
    try {
      if (displayedEntries && displayedEntries.length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(displayedEntries));
      }
    } catch { }
  }, [displayedEntries]);

  useEffect(() => {
    return () => {
      if (maxTimeoutRef.current) {
        window.clearTimeout(maxTimeoutRef.current);
      }
    };
  }, []);

  const handleClearFilters = () => {
    startFiltering();
    setProjectFilter("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    // THEME CONTAINER
    <div className="space-y-6 container px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Timesheets</h1>
          <p className="text-slate-400">Track and manage your time entries</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddTime}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all flex items-center shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-500/50"
          >
            <FiPlus className="mr-2" /> Add Entry
          </button>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-xl shadow-xl border border-slate-800 overflow-hidden relative backdrop-blur-sm">
        {isFiltering && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-blue-500/50 border-t-blue-500 animate-spin" />
          </div>
        )}

        <div className="p-5 border-b border-slate-800 flex flex-wrap items-center gap-3 bg-slate-950/30">
          <div className="flex items-center">
            <span className="text-sm text-slate-400 mr-2">Show:</span>
            <select
              value={projectFilter}
              onChange={(e) => {
                startFiltering();
                setProjectFilter(e.target.value);
              }}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project._id || project.id} value={project._id || project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-slate-400 mr-2">From:</span>
            <input
              type="date"
              value={dateFrom}
              max={todayStr}
              onChange={(e) => {
                startFiltering();
                setDateFrom(e.target.value);
                if (e.target.value === todayStr) {
                  setDateTo(todayStr);
                }
              }}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-slate-400 mr-2">To:</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              max={todayStr}
              onChange={(e) => {
                startFiltering();
                setDateTo(e.target.value);
              }}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          <div className="ml-auto">
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider">Team Member</th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider">Task</th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {displayedEntries.map((entry) => {
                const projectId =
                  typeof entry.project === "object"
                    ? entry.project?._id || entry.project?.id
                    : entry.project;

                const projectName =
                  projects.find((p) => (p._id || p.id) === projectId)?.name ||
                  "Project Not Found";

                const entryId = entry._id || entry.id;
                const userName = getEntryUserName(entry);
                const initial = (userName && userName[0]) ? userName[0].toUpperCase() : "?";

                return (
                  <tr key={entryId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center mr-3 border border-slate-700">
                          <span className="text-sm font-medium text-slate-300">{initial}</span>
                        </div>
                        <div className="text-sm font-medium text-white">{userName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">{projectName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                      {entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{entry.title || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-400 font-medium">
                      {entry.hours != null ? `${entry.hours}h` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 italic">
                      {entry.note || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border ${entry.approved ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                      >
                        {entry.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                      <button
                        onClick={() => onEditTime(entry)}
                        className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-blue-500/10 rounded-lg transition-colors"
                        disabled={!entryId}
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (!projectId || !entryId) {
                            console.error("Missing project or entry ID for delete");
                            return;
                          }
                          const prev = displayedEntries;
                          setDisplayedEntries(prev.filter((e) => (e._id || e.id) !== entryId));
                          markPendingDelete(String(entryId));

                          try {
                            const result: any = (onDeleteTime as any)(projectId, entryId);
                            if (result && typeof result.then === "function") {
                              result
                                .then(() => {
                                  unmarkPendingDelete(String(entryId));
                                })
                                .catch((err: any) => {
                                  console.error("Delete failed, rolling back UI:", err);
                                  setDisplayedEntries(prev);
                                  unmarkPendingDelete(String(entryId));
                                });
                            } else {
                              window.setTimeout(() => {
                                unmarkPendingDelete(String(entryId));
                              }, 5000);
                            }
                          } catch (err) {
                            console.error("Delete handler threw, rolling back UI:", err);
                            setDisplayedEntries(prev);
                            unmarkPendingDelete(String(entryId));
                          }
                        }}
                        className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        disabled={!projectId || !entryId}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-slate-800 bg-slate-950/30">
          <p className="text-sm font-medium text-slate-300">Total Hours: <span className="text-blue-400">{totalHours.toFixed(1)}h</span></p>
        </div>
      </div>
    </div>
  );
};

export default TimesheetsView;