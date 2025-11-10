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
//   const totalHours = timeEntries.reduce(
//     (total, entry) => total + (entry.hours || 0), // Safer sum
//     0
//   );

//   // Helper: format a Date to YYYY-MM-DD for date input constraints
//   const formatDate = (d: Date) => {
//     const y = d.getFullYear();
//     const m = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${y}-${m}-${day}`;
//   };

//   const todayStr = formatDate(new Date());

//   // Enforce the rules:
//   // - No future dates: max = today for both inputs.
//   // - "To" cannot be before selected "From": min = dateFrom for To.
//   // - If user selects today's date in From, set To to today and lock both to today (min=max=today).
//   // - If From is changed such that To < From, auto-set To = From.
//   useEffect(() => {
//     if (!dateFrom) return;

//     // If from is in the future (shouldn't be possible because inputs have max),
//     // clamp it to today and set To to today.
//     if (dateFrom > todayStr) {
//       setDateFrom(todayStr);
//       setDateTo(todayStr);
//       return;
//     }

//     // If from is today -> force to = today and lock to = today
//     if (dateFrom === todayStr) {
//       if (dateTo !== todayStr) setDateTo(todayStr);
//       return;
//     }

//     // If a from is selected and to exists but is before from, bump to to = from
//     if (dateTo && dateTo < dateFrom) {
//       setDateTo(dateFrom);
//     }

//     // Also ensure to is not in the future
//     if (dateTo && dateTo > todayStr) {
//       setDateTo(todayStr);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateFrom]);

//   // Ensure dateTo doesn't exceed today (in case it was set externally)
//   useEffect(() => {
//     if (!dateTo) return;
//     if (dateTo > todayStr) {
//       setDateTo(todayStr);
//     }
//     // If somehow dateTo < dateFrom, adjust it (defensive)
//     if (dateFrom && dateTo < dateFrom) {
//       setDateTo(dateFrom);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateTo, dateFrom]);

//   // === NEW: local filtering control to avoid blink ===
//   // displayedEntries: what we actually render in the table.
//   const [displayedEntries, setDisplayedEntries] = useState<TimeEntry[]>(() => {
//     // Initialize: prefer actual timeEntries if present, otherwise try to restore from sessionStorage
//     try {
//       if (timeEntries && timeEntries.length > 0) return timeEntries;
//       const raw = sessionStorage.getItem(STORAGE_KEY);
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         if (Array.isArray(parsed) && parsed.length > 0) return parsed;
//       }
//     } catch {
//       // ignore parse errors
//     }
//     return timeEntries;
//   });

//   // isFiltering: overlay spinner state. We set it when user changes filters.
//   const [isFiltering, setIsFiltering] = useState(false);

//   // refs to manage timeouts
//   const maxTimeoutRef = useRef<number | null>(null);

//   // track entry IDs we optimistically deleted (so incoming props won't re-add them)
//   const pendingDeletesRef = useRef<Set<string>>(new Set());

//   const markPendingDelete = (id: string) => {
//     pendingDeletesRef.current.add(id);
//   };
//   const unmarkPendingDelete = (id: string) => {
//     pendingDeletesRef.current.delete(id);
//   };

//   // Called when user changes a filter control
//   const startFiltering = () => {
//     // show spinner
//     setIsFiltering(true);
//     // clear existing max timeout
//     if (maxTimeoutRef.current) {
//       window.clearTimeout(maxTimeoutRef.current);
//       maxTimeoutRef.current = null;
//     }
//     // safety: hide spinner automatically after 10s if nothing happens
//     maxTimeoutRef.current = window.setTimeout(() => {
//       setIsFiltering(false);
//       maxTimeoutRef.current = null;
//     }, 10000);
//   };

//   // When parent provides new timeEntries, update displayedEntries and stop spinner.
//   useEffect(() => {
//     const incomingArray = Array.isArray(timeEntries) ? timeEntries : [];
//     const incomingEmpty = incomingArray.length === 0;
//     const havePrevious = displayedEntries && displayedEntries.length > 0;

//     // Filter out any entries that are currently pending deletion
//     const filteredIncoming = incomingArray.filter((e) => {
//       const id = (e as any)._id || (e as any).id;
//       return !pendingDeletesRef.current.has(String(id));
//     });

//     if (incomingEmpty && isFiltering && havePrevious) {
//       // keep previous entries visible until a non-empty result or until filtering stops
//     } else {
//       // update displayed entries to whatever arrived (filtered)
//       setDisplayedEntries(filteredIncoming);
//     }

//     // persist non-empty displayed entries so we can restore after unmount/remount
//     try {
//       if (filteredIncoming && filteredIncoming.length > 0) {
//         sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filteredIncoming));
//       }
//     } catch {
//       // ignore storage errors
//     }

//     // new data arrived -> stop spinner
//     if (isFiltering) {
//       setIsFiltering(false);
//     }

//     // If a pending-delete has been removed from the server result, clear it from the set
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

//     // clear the safety timeout
//     if (maxTimeoutRef.current) {
//       window.clearTimeout(maxTimeoutRef.current);
//       maxTimeoutRef.current = null;
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [timeEntries]);

//   // persist displayedEntries to sessionStorage whenever it changes
//   useEffect(() => {
//     try {
//       if (displayedEntries && displayedEntries.length > 0) {
//         sessionStorage.setItem(STORAGE_KEY, JSON.stringify(displayedEntries));
//       } else {
//         // keep storage when empty to avoid clobbering other logic; optional:
//         // sessionStorage.removeItem(STORAGE_KEY);
//       }
//     } catch {
//       // ignore
//     }
//   }, [displayedEntries]);

//   // Clean up on unmount
//   useEffect(() => {
//     return () => {
//       if (maxTimeoutRef.current) {
//         window.clearTimeout(maxTimeoutRef.current);
//       }
//     };
//   }, []);
//   // === end new ===

//   // Clear filters handler
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

//           {/* Clear filters button (kept in header as before) */}
//           {/* <button
//             onClick={handleClearFilters}
//             className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center"
//           >
//             Clear filters
//           </button> */}
//         </div>
//       </div>
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
//         {/* Activity indicator overlay (only over this container) */}
//         {isFiltering && (
//           <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
//             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-dashed animate-spin">
//               {/* spinner via border + animate-spin */}
//             </div>
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
//                 // --- FIX: Use _id or id for key and value ---
//                 <option
//                   key={project._id || project.id}
//                   value={project._id || project.id}
//                 >
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
//               // Prevent selecting future dates by setting max to today
//               max={todayStr}
//               onChange={(e) => {
//                 startFiltering();
//                 setDateFrom(e.target.value);
//                 // If user picks today's date, we'll auto-set To via effect
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
//               // Min is the selected from date (if any); Max is today to prevent future dates
//               min={dateFrom || undefined}
//               max={todayStr}
//               onChange={(e) => {
//                 startFiltering();
//                 // Respect min/max enforced by attrs; just set value
//                 setDateTo(e.target.value);
//               }}
//               className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>

//           {/* NEW: Clear filters button placed at right side of the filters */}
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
//                 // --- FIX: Get the project ID safely ---
//                 const projectId =
//                   typeof entry.project === "object"
//                     ? entry.project?._id || entry.project?.id
//                     : entry.project;

//                 // --- FIX: Find project name safely ---
//                 const projectName =
//                   projects.find((p) => (p._id || p.id) === projectId)?.name ||
//                   "Project Not Found";

//                 // --- FIX: Use _id or id for the key ---
//                 const entryId = entry._id || entry.id;

//                 return (
//                   // --- FIX: Use the safe entryId for the key ---
//                   <tr key={entryId} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {/* --- FIX: Display the safe projectName --- */}
//                       {projectName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {/* --- FIX: Format date safely --- */}
//                       {entry.date
//                         ? new Date(entry.date).toLocaleDateString()
//                         : "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {entry.title || "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {entry.hours != null ? `${entry.hours}h` : "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {entry.note || "-"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-3 py-1 text-xs font-medium rounded-full ${
//                           entry.approved
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {entry.approved ? "Approved" : "Pending"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
//                       <button
//                         onClick={() => onEditTime(entry)}
//                         className="text-indigo-600 hover:text-indigo-800"
//                         disabled={!entryId} // Disable if no ID
//                       >
//                         <FiEdit />
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (!projectId || !entryId) {
//                             console.error("Missing project or entry ID for delete");
//                             return;
//                           }

//                           // optimistic removal from UI
//                           const prev = displayedEntries;
//                           setDisplayedEntries(prev.filter((e) => (e._id || e.id) !== entryId));

//                           // mark pending so incoming props don't re-add it
//                           markPendingDelete(String(entryId));

//                           // call parent delete handler; if it returns a promise, rollback on error
//                           try {
//                             const result: any = (onDeleteTime as any)(projectId, entryId);
//                             if (result && typeof result.then === "function") {
//                               result
//                                 .then(() => {
//                                   // successful: ensure pending id will be cleared by incoming props effect
//                                   // but clear as a safety
//                                   unmarkPendingDelete(String(entryId));
//                                 })
//                                 .catch((err: any) => {
//                                   console.error("Delete failed, rolling back UI:", err);
//                                   setDisplayedEntries(prev);
//                                   unmarkPendingDelete(String(entryId));
//                                 });
//                             } else {
//                               // Parent didn't return a promise — we'll unmark after a short timeout to avoid indefinite pending state
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
//           <p className="text-sm font-medium text-gray-900">
//             Total Hours: {totalHours.toFixed(1)}h
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Wrap in React.memo to avoid unnecessary re-mounts/re-renders from parent
// export default React.memo(TimesheetsView);
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
  // DEBUG: log on every render
  console.debug("[TimesheetsView] render", {
    timeEntriesLength: Array.isArray(timeEntries) ? timeEntries.length : timeEntries,
    projectFilter,
    dateFrom,
    dateTo,
  });

  const totalHours = timeEntries.reduce(
    (total, entry) => total + (entry.hours || 0), // Safer sum
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom]);

  useEffect(() => {
    if (!dateTo) return;
    if (dateTo > todayStr) {
      setDateTo(todayStr);
    }
    if (dateFrom && dateTo < dateFrom) {
      setDateTo(dateFrom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // DEBUG: show detailed effect activity and incoming payload
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
    } catch {}

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeEntries]);

  useEffect(() => {
    try {
      if (displayedEntries && displayedEntries.length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(displayedEntries));
      }
    } catch {}
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Timesheets</h1>
          <p className="text-gray-600">Track and manage your time entries</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddTime}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-md"
          >
            <FiPlus className="mr-2" /> Add Entry
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        {isFiltering && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-dashed animate-spin" />
          </div>
        )}

        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Show:</span>
            <select
              value={projectFilter}
              onChange={(e) => {
                startFiltering();
                setProjectFilter(e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            <span className="text-sm text-gray-600 mr-2">From:</span>
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
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">To:</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              max={todayStr}
              onChange={(e) => {
                startFiltering();
                setDateTo(e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="ml-auto">
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
            >
              Clear filters
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedEntries.map((entry) => {
                const projectId =
                  typeof entry.project === "object"
                    ? entry.project?._id || entry.project?.id
                    : entry.project;

                const projectName =
                  projects.find((p) => (p._id || p.id) === projectId)?.name ||
                  "Project Not Found";

                const entryId = entry._id || entry.id;

                return (
                  <tr key={entryId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{projectName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.title || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.hours != null ? `${entry.hours}h` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {entry.note || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          entry.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {entry.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                      <button
                        onClick={() => onEditTime(entry)}
                        className="text-indigo-600 hover:text-indigo-800"
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

                          console.debug("[TimesheetsView] delete click", { projectId, entryId });

                          const prev = displayedEntries;
                          setDisplayedEntries(prev.filter((e) => (e._id || e.id) !== entryId));
                          markPendingDelete(String(entryId));

                          try {
                            const result: any = (onDeleteTime as any)(projectId, entryId);
                            if (result && typeof result.then === "function") {
                              result
                                .then(() => {
                                  unmarkPendingDelete(String(entryId));
                                  console.debug("[TimesheetsView] delete succeeded", { entryId });
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
                        className="text-red-600 hover:text-red-800"
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
        <div className="p-5 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-900">Total Hours: {totalHours.toFixed(1)}h</p>
        </div>
      </div>
    </div>
  );
};

export default TimesheetsView;
