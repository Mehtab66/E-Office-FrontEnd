// import React, { useState, useMemo, useEffect, useRef } from "react"; // Added useRef
// import {
//   FiClock,
//   FiEdit,
//   FiCalendar,
//   FiFilter,
//   FiUser,
//   FiPieChart,
//   FiDownload,
//   FiPrinter,
//   FiTrash2,
// } from "react-icons/fi";
// import AddEntityModal from "../AddEntity/AddEntityModal";
// import AddTimeEntryModal from "../AddTimeEntryModal/TimeEntry";

// import type { Project, TimeEntry, Deliverable } from "../../types";
// import apiClient from "../../apis/apiClient";

// interface ProjectTimesheetViewProps {
//   project: {
//     _id: string;
//     name: string;
//   };
//   timeEntries: TimeEntry[];
//   deliverables?: Deliverable[];
//   projects: Project[];
//   onAddDeliverable?: (data: Deliverable) => void;
//   onEditTime?: (entry: TimeEntry) => void;
//   onDeleteTime?: (projectId: string, timeEntryId: string) => void;
// }

// const ProjectTimesheetView: React.FC<ProjectTimesheetViewProps> = ({
//   project,
//   timeEntries,
//   deliverables = [],
//   projects,
//   onAddDeliverable,
//   onEditTime = () => console.warn("onEditTime handler not provided"),
//   onDeleteTime = () => console.warn("onDeleteTime handler not provided"),
// }) => {
//   void onAddDeliverable;
//   const [showDeliverableModal, setShowDeliverableModal] = useState(false);
//   const [editingDeliverable, setEditingDeliverable] =
//     useState<Deliverable | null>(null);
//   const [deliverableToDelete, setDeliverableToDelete] = useState<string | null>(
//     null
//   );
//   const [deliverableError, setDeliverableError] = useState<string | null>(null);
//   const [isSavingDeliverable, setIsSavingDeliverable] = useState(false);
//   const [isDeletingDeliverable, setIsDeletingDeliverable] = useState(false);
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [selectedEmployee, setSelectedEmployee] = useState("all");
//   const [activeTab, setActiveTab] = useState("timesheet");
//   const [userNameById, setUserNameById] = useState<Record<string, string>>({});
//   // --- filtering / disable logic ---
//   const [isFiltering, setIsFiltering] = useState(false);
//   const maxTimeoutRef = useRef<number | null>(null);
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

//   const [localDeliverables, setLocalDeliverables] = useState(deliverables);
//   useEffect(() => {
//     setLocalDeliverables(deliverables);
//   }, [deliverables]);

//   // local copy of time entries for optimistic UI updates & edit/delete
//   const [localTimeEntries, setLocalTimeEntries] = useState<TimeEntry[]>(
//     () => (Array.isArray(timeEntries) ? timeEntries : [])
//   );
//   useEffect(() => {
//     setLocalTimeEntries(Array.isArray(timeEntries) ? timeEntries : []);
//   }, [timeEntries]);

//   // clear filtering when local entries update (keeps overlay from getting stuck)
//   useEffect(() => {
//     if (isFiltering) {
//       setIsFiltering(false);
//     }
//     if (maxTimeoutRef.current) {
//       window.clearTimeout(maxTimeoutRef.current);
//       maxTimeoutRef.current = null;
//     }
//   }, [localTimeEntries]);

//   // For editing time entries modal
//   const [editingTimeEntry, setEditingTimeEntry] = useState<TimeEntry | null>(null);
//   const [showEditTimeModal, setShowEditTimeModal] = useState(false);
//   const [editInitialProjectId, setEditInitialProjectId] = useState<string | undefined>(undefined);
//   const [editInitialProject, setEditInitialProject] = useState<Project | undefined>(undefined);

//   // Fetch and cache user names for any user/employee ids present in entries
//   useEffect(() => {
//     const ids = new Set<string>();
//     localTimeEntries.forEach((entry) => {
//       const candidate = (entry as any).user ?? (entry as any).employee;
//       if (typeof candidate === "string") {
//         ids.add(candidate);
//       }
//     });
//     const idsToFetch = Array.from(ids).filter((id) => !userNameById[id]);
//     if (idsToFetch.length === 0) return;

//     let isCancelled = false;
//     (async () => {
//       const updates: Record<string, string> = {};
//       await Promise.all(
//         idsToFetch.map(async (id) => {
//           try {
//             const resp = await apiClient.get(`/api/users/${id}`);
//             const data = resp?.data;
//             const name =
//               data?.name ||
//               (data?.firstName || "") + (data?.lastName ? ` ${data.lastName}` : "");
//             if (name && !isCancelled) {
//               updates[id] = name;
//             }
//           } catch {
//             // ignore missing users
//           }
//         })
//       );
//       if (!isCancelled && Object.keys(updates).length > 0) {
//         setUserNameById((prev) => ({ ...prev, ...updates }));
//       }
//     })();

//     return () => {
//       isCancelled = true;
//     };
//   }, [localTimeEntries, userNameById]);

//   // Helper to resolve user name from user object or id
//   const resolveUserName = (entry: TimeEntry): string | null => {
//     const userLike = (entry as any).user ?? (entry as any).employee;
//     if (!userLike) return null;

//     if (typeof userLike === "object") {
//       if (userLike.name) return userLike.name;
//       if (userLike.fullName) return userLike.fullName;
//       if (userLike.firstName || userLike.lastName)
//         return `${userLike.firstName || ""} ${userLike.lastName || ""}`.trim() || null;
//       if (userLike.profile?.name) return userLike.profile.name;
//       return null;
//     }

//     if (typeof userLike === "string") {
//       if (userNameById[userLike]) return userNameById[userLike];

//       const match = localTimeEntries.find((e) => {
//         const u = (e as any).user ?? (e as any).employee;
//         return (
//           typeof u === "object" &&
//           (u._id === userLike ||
//             u.id === userLike ||
//             u._id?.toString() === userLike ||
//             u.id?.toString() === userLike)
//         );
//       });
//       if (match) {
//         const mUser = (match as any).user ?? (match as any).employee;
//         if (mUser?.name) return mUser.name;
//         if (mUser?.fullName) return mUser.fullName;
//         if (mUser?.firstName || mUser?.lastName)
//           return `${mUser.firstName || ""} ${mUser.lastName || ""}`.trim() || null;
//         if (mUser?.profile?.name) return mUser.profile.name;
//       }
//       return null;
//     }
//     return null;
//   };

//   // TEAM MEMBER NAMES
//   const allTeamMemberNames = useMemo(() => {
//     const employeeNames = new Set<string>();
//     localTimeEntries.forEach((entry) => {
//       const userName = resolveUserName(entry);
//       if (userName) employeeNames.add(userName);
//     });
//     return Array.from(employeeNames);
//   }, [localTimeEntries, userNameById]);

//   const employees = useMemo(() => {
//     return ["all", ...allTeamMemberNames];
//   }, [allTeamMemberNames]);

//   // FILTER for time entries
//   const filteredTimeEntries = useMemo(() => {
//     return localTimeEntries.filter((entry) => {
//       const userName = resolveUserName(entry);
//       if (selectedEmployee !== "all" && userName !== selectedEmployee) {
//         return false;
//       }
//       if (
//         dateRange.start &&
//         entry.date &&
//         new Date(entry.date) < new Date(dateRange.start)
//       )
//         return false;
//       if (
//         dateRange.end &&
//         entry.date &&
//         new Date(entry.date) > new Date(dateRange.end)
//       )
//         return false;
//       return true;
//     });
//   }, [localTimeEntries, selectedEmployee, dateRange, userNameById]);

//   // clear filtering as soon as filtered results update (fixes stuck overlay when user changes From/To)
//   useEffect(() => {
//     if (isFiltering) {
//       setIsFiltering(false);
//     }
//     if (maxTimeoutRef.current) {
//       window.clearTimeout(maxTimeoutRef.current);
//       maxTimeoutRef.current = null;
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filteredTimeEntries]);

//   // HOURS SUMMARY
//   const hoursSummary = useMemo(() => {
//     const summary: { [employee: string]: number } = {};
//     let totalHours = 0;

//     filteredTimeEntries.forEach((entry) => {
//       const userName = resolveUserName(entry) || "Unknown User";
//       if (userName && entry.hours != null) {
//         summary[userName] = (summary[userName] || 0) + entry.hours;
//         totalHours += entry.hours;
//       }
//     });

//     return { summary, totalHours };
//   }, [filteredTimeEntries, userNameById]);

//   // ---------------------
//   // NEW: filteredDeliverables (applies dateRange start/end to deliverables)
//   // ---------------------
//   const filteredDeliverables = useMemo(() => {
//     if (!Array.isArray(localDeliverables)) return [];
//     return localDeliverables.filter((d) => {
//       if (!d || !d.date) return false;
//       try {
//         const dDate = new Date(d.date);
//         if (dateRange.start) {
//           const start = new Date(dateRange.start);
//           if (dDate < start) return false;
//         }
//         if (dateRange.end) {
//           const end = new Date(dateRange.end);
//           // include entries on end date
//           if (dDate > end) return false;
//         }
//         return true;
//       } catch {
//         return false;
//       }
//     });
//   }, [localDeliverables, dateRange]);

//   // GROUP deliverables: parent + its revisions (use filteredDeliverables so filters apply)
//   // -> improved: if parent missing in filtered list, try to find parent in full deliverables prop and show its real values
//   const groupedDeliverables = useMemo(() => {
//     const arr = Array.isArray(filteredDeliverables) ? filteredDeliverables : [];
//     const map = new Map<string, { parent?: Deliverable | undefined; revisions: Deliverable[] }>();

//     // Ensure map entries for all deliverables in filtered set
//     arr.forEach((d) => {
//       const id = String((d as any)._id || (d as any).id || "");
//       if (!map.has(id)) {
//         map.set(id, { parent: undefined, revisions: [] });
//       }
//     });

//     // Populate parents and revisions; attempt to attach parent objects from full deliverables list when available
//     arr.forEach((d) => {
//       const id = String((d as any)._id || (d as any).id || "");
//       const parentRaw = (d as any).parent;
//       const parentId =
//         parentRaw == null
//           ? null
//           : typeof parentRaw === "string"
//           ? parentRaw
//           : String(parentRaw._id || parentRaw.id || "");

//       if (parentId) {
//         // this is a revision of parentId
//         if (!map.has(parentId)) {
//           map.set(parentId, { parent: undefined, revisions: [] });
//         }
//         map.get(parentId)!.revisions.push(d);
//       } else {
//         // this is a parent/standalone
//         const entry = map.get(id);
//         if (entry) {
//           entry.parent = d;
//         } else {
//           map.set(id, { parent: d, revisions: [] });
//         }
//       }
//     });

//     // try to locate parents from the original deliverables prop when parent objects are missing (so we can show a description instead of raw id)
//     map.forEach((value, key) => {
//       if (!value.parent) {
//         const foundParent = (deliverables || []).find(
//           (dv) => String(dv._id || (dv as any).id || "") === String(key)
//         );
//         if (foundParent) {
//           value.parent = foundParent;
//         }
//       }
//     });

//     // Build ordered array: preserve order from filteredDeliverables as much as possible
//     const result: Array<{ key: string; parent?: Deliverable; revisions: Deliverable[] }> = [];
//     const seen = new Set<string>();

//     arr.forEach((d) => {
//       const id = String((d as any)._id || (d as any).id || "");
//       if (map.has(id) && !seen.has(id)) {
//         const v = map.get(id)!;
//         result.push({ key: id, parent: v.parent, revisions: v.revisions });
//         seen.add(id);
//       }
//       const parentRaw = (d as any).parent;
//       const parentId =
//         parentRaw == null
//           ? null
//           : typeof parentRaw === "string"
//           ? parentRaw
//           : String(parentRaw._id || parentRaw.id || "");
//       if (parentId && map.has(parentId) && !seen.has(parentId)) {
//         const v = map.get(parentId)!;
//         result.push({ key: parentId, parent: v.parent, revisions: v.revisions });
//         seen.add(parentId);
//       }
//     });

//     // append any remaining map entries
//     for (const [k, v] of map.entries()) {
//       if (!seen.has(k)) {
//         result.push({ key: k, parent: v.parent, revisions: v.revisions });
//         seen.add(k);
//       }
//     }

//     return result;
//   }, [filteredDeliverables, deliverables]);

//   // clear filtering overlay also when deliverables results update
//   useEffect(() => {
//     if (isFiltering) {
//       setIsFiltering(false);
//     }
//     if (maxTimeoutRef.current) {
//       window.clearTimeout(maxTimeoutRef.current);
//       maxTimeoutRef.current = null;
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filteredDeliverables]);

//   // Deliverable form config (unchanged)
//   const handleSaveDeliverable = async (formValues: any) => {
//     if (!editingDeliverable || !project?._id || isSavingDeliverable) return;
//     setIsSavingDeliverable(true);
//     setDeliverableError(null);
//     const deliverableId = String(editingDeliverable._id || (editingDeliverable as any).id || "");
//     const payload = {
//       date: formValues.date,
//       description: formValues.description,
//       notes: formValues.notes || "",
//       status: formValues.status || editingDeliverable.status || "pending",
//     };

//     try {
//       const resp = await apiClient.put(
//         `/api/projects/${encodeURIComponent(project._id)}/deliverables/${encodeURIComponent(deliverableId)}`,
//         payload
//       );
//       const updatedDeliverable = resp?.data || { ...editingDeliverable, ...payload };
//       setLocalDeliverables((prev) =>
//         prev.map((d) =>
//           String(d._id || (d as any).id) === deliverableId ? updatedDeliverable : d
//         )
//       );
//       setShowDeliverableModal(false);
//       setEditingDeliverable(null);
//     } catch (error: any) {
//       console.error("Failed to update deliverable:", error);
//       setDeliverableError(
//         error?.response?.data?.error || "Failed to update deliverable. Please try again."
//       );
//     } finally {
//       setIsSavingDeliverable(false);
//     }
//   };

//   const deliverableConfig = {
//     type: "deliverable",
//     title: editingDeliverable ? "Edit Deliverable" : "Add Deliverable",
//     fields: [
//       { name: "date", label: "Delivery Date", type: "date", placeholder: "YYYY-MM-DD", required: true },
//       { name: "description", label: "Description", type: "text", placeholder: "Enter deliverable description", required: true },
//       { name: "notes", label: "Notes", type: "textarea", placeholder: "Enter additional notes", required: false },
//       { name: "status", label: "Status", type: "select", required: true, options: ["pending", "delivered", "approved"] },
//     ],
//     onSubmit: handleSaveDeliverable,
//     initialData: editingDeliverable || undefined,
//   };

//   const handleEditDeliverable = (deliverable: Deliverable) => {
//     setDeliverableError(null);
//     setEditingDeliverable(deliverable);
//     setShowDeliverableModal(true);
//   };

//   // IMMEDIATE DELETE (no confirmation) — replaces previous set-then-confirm flow
//   const handleDeleteDeliverable = async (id: string) => {
//     if (!id || !project?._id || isDeletingDeliverable) return;
//     setIsDeletingDeliverable(true);
//     setDeliverableError(null);
//     const previous = localDeliverables;
//     setLocalDeliverables((prev) =>
//       prev.filter((d) => String(d._id || (d as any).id) !== id)
//     );

//     try {
//       await apiClient.delete(
//         `/api/projects/${encodeURIComponent(project._id)}/deliverables/${encodeURIComponent(id)}`
//       );
//     } catch (error: any) {
//       console.error("Failed to delete deliverable:", error);
//       setDeliverableError(
//         error?.response?.data?.error || "Failed to delete deliverable. Please try again."
//       );
//       setLocalDeliverables(previous);
//     } finally {
//       setIsDeletingDeliverable(false);
//     }
//   };

//   // keep confirmDeleteDeliverable/cancel utilities present (unused) to avoid other changes
//   const confirmDeleteDeliverable = async () => {
//     if (!deliverableToDelete || !project?._id || isDeletingDeliverable) return;
//     setIsDeletingDeliverable(true);
//     setDeliverableError(null);
//     const previous = localDeliverables;
//     setLocalDeliverables((prev) =>
//       prev.filter((d) => String(d._id || (d as any).id) !== deliverableToDelete)
//     );

//     try {
//       await apiClient.delete(
//         `/api/projects/${encodeURIComponent(project._id)}/deliverables/${encodeURIComponent(deliverableToDelete)}`
//       );
//     } catch (error: any) {
//       console.error("Failed to delete deliverable:", error);
//       setDeliverableError(
//         error?.response?.data?.error || "Failed to delete deliverable. Please try again."
//       );
//       setLocalDeliverables(previous);
//     } finally {
//       setIsDeletingDeliverable(false);
//       setDeliverableToDelete(null);
//     }
//   };
//   const cancelDeleteDeliverable = () => setDeliverableToDelete(null);

//   const getStatusBadgeClass = (status: string | undefined) => {
//     switch (status) {
//       case "completed":
//       case "approved":
//         return "bg-green-100 text-green-800";
//       case "in-progress":
//       case "delivered":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-yellow-100 text-yellow-800";
//     }
//   };

//   const formatDate = (dateString: string | Date | undefined) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   // Edit & Delete API logic (unchanged)
//   const handleDeleteTime = async (entryId: string) => {
//     if (!project._id || !entryId) return;
//     const previous = localTimeEntries;
//     setLocalTimeEntries((prev) => prev.filter((e) => (e._id || e.id) !== entryId));
//     try {
//       const url = `/api/projects/${encodeURIComponent(project._id)}/time-entries/${encodeURIComponent(
//         entryId
//       )}`;
//       await apiClient.delete(url);
//       try {
//         onDeleteTime(project._id, entryId);
//       } catch (e) {
//         // ignore
//       }
//     } catch (err) {
//       console.error("Delete failed, rolling back UI:", err);
//       setLocalTimeEntries(previous);
//     }
//   };

//   const openEditTimeModal = (entry: TimeEntry) => {
//     const proj = (entry as any).project;
//     let pid: string | undefined = undefined;
//     let pObj: Project | undefined = undefined;
//     if (proj) {
//       if (typeof proj === "string") pid = proj;
//       else pid = proj._id || proj.id;
//       if (pid) {
//         pObj = projects.find((p) => (p._id || p.id) === pid);
//       }
//     }
//     if (!pid) {
//       pid = project._id;
//       pObj = projects.find((p) => (p._id || p.id) === project._id);
//     }

//     setEditInitialProjectId(pid);
//     setEditInitialProject(pObj);
//     setEditingTimeEntry(entry);
//     setShowEditTimeModal(true);
//   };

//   const handleEditTimeSubmit = async (formData: {
//     projectId: string;
//     data: Omit<
//       TimeEntry,
//       "_id" | "user" | "project" | "createdAt" | "updatedAt"
//     >;
//   }) => {
//     if (!editingTimeEntry) {
//       setShowEditTimeModal(false);
//       return;
//     }
//     const entryId = editingTimeEntry._id || (editingTimeEntry as any).id;
//     const previous = localTimeEntries;

//     setLocalTimeEntries((prev) =>
//       prev.map((e) =>
//         (e._id || (e as any).id) === entryId
//           ? { ...e, ...formData.data, project: formData.projectId ? formData.projectId : (e as any).project }
//           : e
//       )
//     );

//     setShowEditTimeModal(false);

//     try {
//       const url = `/api/projects/${encodeURIComponent(
//         formData.projectId
//       )}/time-entries/${encodeURIComponent(String(entryId))}`;
//       const resp = await apiClient.put(url, formData.data);
//       const updated = resp?.data || null;

//       if (updated) {
//         setLocalTimeEntries((prev) =>
//           prev.map((e) =>
//             (e._id || (e as any).id) === entryId ? updated : e
//           )
//         );
//       }

//       try {
//         onEditTime(updated || { ...(editingTimeEntry as any), ...(formData.data as any) });
//       } catch (e) {
//         // ignore
//       }
//     } catch (err) {
//       console.error("Edit update failed, rolling back UI:", err);
//       setLocalTimeEntries(previous);
//     } finally {
//       setEditingTimeEntry(null);
//       setShowEditTimeModal(false);
//       setEditInitialProjectId(undefined);
//       setEditInitialProject(undefined);
//     }
//   };

//   const handleModalSubmit = (modalPayload: any) => {
//     const payloadProjectId = modalPayload && modalPayload.projectId
//       ? modalPayload.projectId
//       : (editInitialProjectId ?? project._id);
//     const payloadData = modalPayload && modalPayload.data ? modalPayload.data : modalPayload;
//     handleEditTimeSubmit({
//       projectId: String(payloadProjectId),
//       data: payloadData,
//     });
//   };

//   // DATE VALIDATIONS: same "From" / "To" logic as TimesheetsView
//   const formatISODate = (d: Date) => {
//     const y = d.getFullYear();
//     const m = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${y}-${m}-${day}`;
//   };
//   const todayStr = formatISODate(new Date());

//   useEffect(() => {
//     const dateFrom = dateRange.start;
//     const dateTo = dateRange.end;

//     if (!dateFrom) return;

//     if (dateFrom > todayStr) {
//       setDateRange((prev) => ({ ...prev, start: todayStr, end: todayStr }));
//       return;
//     }

//     if (dateFrom === todayStr) {
//       if (dateTo !== todayStr) setDateRange((prev) => ({ ...prev, end: todayStr }));
//       return;
//     }

//     if (dateTo && dateTo < dateFrom) {
//       setDateRange((prev) => ({ ...prev, end: dateFrom }));
//     }

//     if (dateTo && dateTo > todayStr) {
//       setDateRange((prev) => ({ ...prev, end: todayStr }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateRange.start]);

//   useEffect(() => {
//     const dateFrom = dateRange.start;
//     const dateTo = dateRange.end;

//     if (!dateTo) return;

//     if (dateTo > todayStr) {
//       setDateRange((prev) => ({ ...prev, end: todayStr }));
//     }
//     if (dateFrom && dateTo < dateFrom) {
//       setDateRange((prev) => ({ ...prev, end: dateFrom }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateRange.end, dateRange.start]);

//   useEffect(() => {
//     return () => {
//       if (maxTimeoutRef.current) {
//         window.clearTimeout(maxTimeoutRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-lg relative">
//       {isFiltering && (
//         <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-xl">
//           <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-dashed animate-spin" />
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//           <FiClock className="text-blue-600" /> Timesheet for {project.name}
//         </h1>
//         <div className="flex gap-2 mt-4 md:mt-0">
//           <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50">
//             <FiDownload size={16} /> Export
//           </button>
//           <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50">
//             <FiPrinter size={16} /> Print
//           </button>
//         </div>
//       </div>

//       <div className="flex border-b border-gray-200 mb-6">
//         {["timesheet", "deliverables", "analytics"].map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 font-medium ${
//               activeTab === tab
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       <div className="bg-gray-50 p-4 rounded-lg mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//             <FiFilter /> Filters
//           </h2>
//           <button
//             onClick={() => {
//               startFiltering();
//               setDateRange({ start: "", end: "" });
//               setSelectedEmployee("all");
//             }}
//             className="text-sm text-blue-600 hover:text-blue-800"
//           >
//             Clear All
//           </button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//             <div className="relative">
//               <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="date"
//                 value={dateRange.start}
//                 max={todayStr}
//                 onChange={(e) => {
//                   startFiltering();
//                   const val = e.target.value;
//                   setDateRange((prev) => ({ ...prev, start: val }));
//                   if (val === todayStr) {
//                     setDateRange((prev) => ({ ...prev, end: todayStr }));
//                   }
//                 }}
//                 className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//             <div className="relative">
//               <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="date"
//                 value={dateRange.end}
//                 min={dateRange.start || undefined}
//                 max={todayStr}
//                 onChange={(e) => {
//                   startFiltering();
//                   setDateRange((prev) => ({ ...prev, end: e.target.value }));
//                 }}
//                 className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//             <div className="relative">
//               <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <select
//                 value={selectedEmployee}
//                 onChange={(e) => {
//                   startFiltering();
//                   setSelectedEmployee(e.target.value);
//                 }}
//                 className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {employees.map((employeeName) => (
//                   <option key={employeeName} value={employeeName}>
//                     {employeeName === "all" ? "All Employees" : employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {activeTab === "timesheet" && (
//         <div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task / Title</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredTimeEntries.length > 0 ? (
//                   filteredTimeEntries.map((entry) => {
//                     const entryId = entry._id || entry.id;
//                     const userName = resolveUserName(entry) || "Unknown User";

//                     const ep = (entry as any).project;
//                     let entryProjectId: string | undefined = undefined;
//                     let entryProjectName = "Project Not Found";
//                     if (ep) {
//                       if (typeof ep === "string") entryProjectId = ep;
//                       else entryProjectId = ep._id || ep.id;
//                     }
//                     if (!entryProjectId) {
//                       entryProjectId = project._id;
//                       entryProjectName = project.name;
//                     } else {
//                       const found = projects.find((p) => (p._id || p.id) === entryProjectId);
//                       entryProjectName = found ? found.name : String(entryProjectId);
//                     }

//                     return (
//                       <tr key={entryId} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entryProjectName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(entry.date)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.title || "N/A"}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.hours != null ? `${entry.hours}h` : "N/A"}</td>
//                         <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{entry.note || "-"}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${entry.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
//                             {entry.approved ? "Approved" : "Pending"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-3">
//                           <button onClick={() => openEditTimeModal(entry)} className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50" disabled={!entryId} title="Edit Time Entry"><FiEdit /></button>
//                           <button onClick={() => { if (project._id && entryId) handleDeleteTime(String(entryId)); }} className="text-red-600 hover:text-red-800 disabled:opacity-50" disabled={!project._id || !entryId} title="Delete Time Entry"><FiTrash2 /></button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No time entries found for this period or employee.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-6 border-t pt-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Hours Summary</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {Object.entries(hoursSummary.summary).map(([employeeName, hours]) => (
//                 <div key={employeeName} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center text-sm">
//                   <span className="font-medium text-gray-700">{employeeName}</span>
//                   <span className="text-gray-900">{hours} hours</span>
//                 </div>
//               ))}
//               <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center text-sm col-span-1 md:col-span-2">
//                 <span className="font-semibold text-blue-800">Total Hours</span>
//                 <span className="font-semibold text-blue-900">{hoursSummary.totalHours} hours</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {activeTab === "deliverables" && (
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-gray-800">Deliverables</h2>
//             <div className="text-sm text-gray-500">
//               <span className="font-medium">{groupedDeliverables.length}</span> group(s)
//             </div>
//           </div>
//           {deliverableError && (
//             <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{deliverableError}</div>
//           )}

//           {/* NEW UI: grouped deliverables that is clearer and more readable */}
//           <div className="space-y-5">
//             {groupedDeliverables.length > 0 ? (
//               groupedDeliverables.map((group) => {
//                 const parent = group.parent;
//                 const key = group.key || (parent ? String((parent as any)._id || (parent as any).id) : `parent-${Math.random()}`);
//                 const revisionCount = group.revisions ? group.revisions.length : 0;

//                 // If parent missing, attempt to find in full deliverables for display; else show short id
//                 const foundParent = parent ? parent : (deliverables || []).find(
//                   (dv) => String(dv._id || (dv as any).id || "") === String(group.key)
//                 );

//                 const parentLabel = foundParent ? (foundParent.description || "Untitled deliverable") : `${String(group.key).slice(0, 8)}...`;

//                 return (
//                   <div key={key} className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden">
//                     {/* Parent header */}
//                     <div className="p-4 md:p-5 flex items-start justify-between gap-4">
//                       <div className="min-w-0">
//                         <div className="flex items-center gap-3">
//                           <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight">
//                             {foundParent ? parentLabel : `Revision(s) of: ${parentLabel}`}
//                           </h3>
//                           <span className="text-xs text-gray-400">•</span>
//                           <span className="text-xs text-gray-500">
//                             {foundParent ? `Due: ${foundParent.date ? formatDate(foundParent.date) : "N/A"}` : "Parent not found locally"}
//                           </span>
//                         </div>

//                         {/* Parent ID (muted) */}
//                         <div className="text-xs text-gray-400 mt-1">
//                           {foundParent ? (
//                             <span title={String(foundParent._id || (foundParent as any).id || "")}>
//                               ID: {String(foundParent._id || (foundParent as any).id || "").slice(0, 10)}...
//                             </span>
//                           ) : (
//                             <span title={String(group.key)}>Parent ID: {String(group.key)}</span>
//                           )}
//                         </div>

//                         {/* Parent notes (if any) */}
//                         {foundParent?.notes && (
//                           <p className="text-sm text-gray-500 mt-2 max-w-2xl">{foundParent.notes}</p>
//                         )}
//                       </div>

//                       {/* Parent controls & status */}
//                       <div className="flex items-start gap-3">
//                         {foundParent && (
//                           <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(foundParent.status)}`}>
//                             {foundParent.status ? foundParent.status.charAt(0).toUpperCase() + foundParent.status.slice(1) : "Pending"}
//                           </span>
//                         )}
//                         <div className="flex items-center gap-2">
//                           {/* If there's a real parent we show edit/delete for it */}
//                           {foundParent && (
//                             <>
//                               <button onClick={() => handleEditDeliverable(foundParent)} className="text-indigo-600 hover:text-indigo-800" title="Edit Deliverable"><FiEdit size={16} /></button>
//                               <button onClick={() => handleDeleteDeliverable(String(foundParent._id || (foundParent as any).id || ""))} className="text-red-600 hover:text-red-800" title="Delete Deliverable"><FiTrash2 size={16} /></button>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Revisions area */}
//                     <div className="border-t border-gray-100 bg-gray-50 p-4 md:p-5">
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="text-sm text-gray-700 font-medium">Revisions ({revisionCount})</div>
//                         <div className="text-xs text-gray-400">Showing revisions that match current filters</div>
//                       </div>

//                       {revisionCount > 0 ? (
//                         <div className="space-y-3">
//                           {group.revisions.map((rev) => (
//                             <div key={(rev as any)._id || (rev as any).id} className="p-3 rounded-md bg-white border border-gray-100 flex items-start justify-between gap-4">
//                               <div className="min-w-0">
//                                 <p className="font-medium text-sm text-gray-900">{rev.description || "Untitled revision"}</p>
//                                 <p className="text-sm text-gray-500 mt-1">Due: {rev.date ? formatDate(rev.date) : "N/A"}</p>
//                                 {rev.notes && <p className="text-sm text-gray-400 mt-2">{rev.notes}</p>}
//                                 <div className="text-xs text-gray-400 mt-2">Revision ID: {(rev as any)._id ? String((rev as any)._id).slice(0,10) + "..." : (rev as any).id ? String((rev as any).id).slice(0,10) + "..." : "n/a"}</div>
//                               </div>
//                               <div className="flex flex-col items-end gap-2">
//                                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(rev.status)}`}>
//                                   {rev.status ? rev.status.charAt(0).toUpperCase() + rev.status.slice(1) : "Pending"}
//                                 </span>
//                                 <div className="flex items-center gap-2">
//                                   <button onClick={() => handleEditDeliverable(rev)} className="text-indigo-600 hover:text-indigo-800" title="Edit Revision"><FiEdit size={16} /></button>
//                                   <button onClick={() => handleDeleteDeliverable(String(rev._id || (rev as any).id || ""))} className="text-red-600 hover:text-red-800" title="Delete Revision"><FiTrash2 size={16} /></button>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="text-sm text-gray-500 py-3">No revisions found for this parent within the selected date range.</div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="p-6 text-center text-gray-500">No deliverables found for this project.</div>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === "analytics" && (
//         <div>
//           <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><FiPieChart /> Analytics</h2>
//           <p className="text-gray-600 mt-4">Analytics for {project.name} will be displayed here (e.g., charts, graphs).</p>
//         </div>
//       )}

//       {showDeliverableModal && (
//         <AddEntityModal
//           config={deliverableConfig as any}
//           onClose={() => {
//             setShowDeliverableModal(false);
//             setEditingDeliverable(null);
//           }}
//         />
//       )}

//       {showEditTimeModal && editingTimeEntry && (
//         <AddTimeEntryModal
//           projects={projects}
//           employee={(editingTimeEntry as any).user || (editingTimeEntry as any).employee || null}
//           onSubmit={handleModalSubmit}
//           onClose={() => {
//             setShowEditTimeModal(false);
//             setEditingTimeEntry(null);
//             setEditInitialProjectId(undefined);
//             setEditInitialProject(undefined);
//           }}
//           initialProjectId={String((editInitialProjectId ?? project._id))}
//           initialProject={(editInitialProject ?? projects.find((p) => p._id === project._id)) || undefined}
//           projectSelectLabel="Selected Project"
//           initialData={editingTimeEntry as any}
//         />
//       )}

//     </div>
//   );
// };
// export default ProjectTimesheetView;

import React, { useState, useMemo, useEffect, useRef } from "react"; // Added useRef
import {
  FiClock,
  FiEdit,
  FiCalendar,
  FiFilter,
  FiUser,
  FiPieChart,
  FiDownload,
  FiPrinter,
  FiTrash2,
} from "react-icons/fi";
import AddEntityModal from "../AddEntity/AddEntityModal";
import AddTimeEntryModal from "../AddTimeEntryModal/TimeEntry";

import type { Project, TimeEntry, Deliverable } from "../../types";
import apiClient from "../../apis/apiClient";

interface ProjectTimesheetViewProps {
  project: {
    _id: string;
    name: string;
  };
  timeEntries: TimeEntry[];
  deliverables?: Deliverable[];
  projects: Project[];
  onAddDeliverable?: (data: Deliverable) => void;
  onEditTime?: (entry: TimeEntry) => void;
  onDeleteTime?: (projectId: string, timeEntryId: string) => void;
}

const ProjectTimesheetView: React.FC<ProjectTimesheetViewProps> = ({
  project,
  timeEntries,
  deliverables = [],
  projects,
  onAddDeliverable,
  onEditTime = () => console.warn("onEditTime handler not provided"),
  onDeleteTime = () => console.warn("onDeleteTime handler not provided"),
}) => {
  void onAddDeliverable;
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [editingDeliverable, setEditingDeliverable] =
    useState<Deliverable | null>(null);
  const [deliverableToDelete, setDeliverableToDelete] = useState<string | null>(
    null
  );
  const [deliverableError, setDeliverableError] = useState<string | null>(null);
  const [isSavingDeliverable, setIsSavingDeliverable] = useState(false);
  const [isDeletingDeliverable, setIsDeletingDeliverable] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [activeTab, setActiveTab] = useState("timesheet");
  const [userNameById, setUserNameById] = useState<Record<string, string>>({});
  // --- filtering / disable logic ---
  const [isFiltering, setIsFiltering] = useState(false);
  const maxTimeoutRef = useRef<number | null>(null);
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

  const [localDeliverables, setLocalDeliverables] = useState(deliverables);
  useEffect(() => {
    setLocalDeliverables(deliverables);
  }, [deliverables]);

  // local copy of time entries for optimistic UI updates & edit/delete
  const [localTimeEntries, setLocalTimeEntries] = useState<TimeEntry[]>(
    () => (Array.isArray(timeEntries) ? timeEntries : [])
  );
  useEffect(() => {
    setLocalTimeEntries(Array.isArray(timeEntries) ? timeEntries : []);
  }, [timeEntries]);

  // clear filtering when local entries update (keeps overlay from getting stuck)
  useEffect(() => {
    if (isFiltering) {
      setIsFiltering(false);
    }
    if (maxTimeoutRef.current) {
      window.clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
  }, [localTimeEntries]);

  // For editing time entries modal
  const [editingTimeEntry, setEditingTimeEntry] = useState<TimeEntry | null>(null);
  const [showEditTimeModal, setShowEditTimeModal] = useState(false);
  const [editInitialProjectId, setEditInitialProjectId] = useState<string | undefined>(undefined);
  const [editInitialProject, setEditInitialProject] = useState<Project | undefined>(undefined);

  // TIMELINE FILTER: new state
  const [timeline, setTimeline] = useState<string>("all"); // "all" | "custom" | "7days" | "1month" | "3month" | "6month" | "1year"

  const calculateStartForTimeline = (tl: string) => {
    if (!tl || tl === "all" || tl === "custom") return "";
    const now = new Date();
    const start = new Date(now);
    switch (tl) {
      case "7days":
        // last 7 days including today
        start.setDate(now.getDate() - 6);
        break;
      case "1month":
        start.setMonth(now.getMonth() - 1);
        break;
      case "3month":
        start.setMonth(now.getMonth() - 3);
        break;
      case "6month":
        start.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return "";
    }
    // keep time portion normalized away
    start.setHours(0, 0, 0, 0);
    return formatISODate(start);
  };

  // When timeline changes, update dateRange accordingly (except for 'custom')
  useEffect(() => {
    if (timeline === "custom") {
      return;
    }
    if (timeline === "all") {
      startFiltering();
      setDateRange({ start: "", end: "" });
      return;
    }
    const start = calculateStartForTimeline(timeline);
    const end = formatISODate(new Date());
    startFiltering();
    setDateRange({ start, end });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline]);

  // Fetch and cache user names for any user/employee ids present in entries
  useEffect(() => {
    const ids = new Set<string>();
    localTimeEntries.forEach((entry) => {
      const candidate = (entry as any).user ?? (entry as any).employee;
      if (typeof candidate === "string") {
        ids.add(candidate);
      }
    });
    const idsToFetch = Array.from(ids).filter((id) => !userNameById[id]);
    if (idsToFetch.length === 0) return;

    let isCancelled = false;
    (async () => {
      const updates: Record<string, string> = {};
      await Promise.all(
        idsToFetch.map(async (id) => {
          try {
            const resp = await apiClient.get(`/api/users/${id}`);
            const data = resp?.data;
            const name =
              data?.name ||
              (data?.firstName || "") + (data?.lastName ? ` ${data.lastName}` : "");
            if (name && !isCancelled) {
              updates[id] = name;
            }
          } catch {
            // ignore missing users
          }
        })
      );
      if (!isCancelled && Object.keys(updates).length > 0) {
        setUserNameById((prev) => ({ ...prev, ...updates }));
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [localTimeEntries, userNameById]);

  // Helper to resolve user name from user object or id
  const resolveUserName = (entry: TimeEntry): string | null => {
    const userLike = (entry as any).user ?? (entry as any).employee;
    if (!userLike) return null;

    if (typeof userLike === "object") {
      if (userLike.name) return userLike.name;
      if (userLike.fullName) return userLike.fullName;
      if (userLike.firstName || userLike.lastName)
        return `${userLike.firstName || ""} ${userLike.lastName || ""}`.trim() || null;
      if (userLike.profile?.name) return userLike.profile.name;
      return null;
    }

    if (typeof userLike === "string") {
      if (userNameById[userLike]) return userNameById[userLike];

      const match = localTimeEntries.find((e) => {
        const u = (e as any).user ?? (e as any).employee;
        return (
          typeof u === "object" &&
          (u._id === userLike ||
            u.id === userLike ||
            u._id?.toString() === userLike ||
            u.id?.toString() === userLike)
        );
      });
      if (match) {
        const mUser = (match as any).user ?? (match as any).employee;
        if (mUser?.name) return mUser.name;
        if (mUser?.fullName) return mUser.fullName;
        if (mUser?.firstName || mUser?.lastName)
          return `${mUser.firstName || ""} ${mUser.lastName || ""}`.trim() || null;
        if (mUser?.profile?.name) return mUser.profile.name;
      }
      return null;
    }
    return null;
  };

  // TEAM MEMBER NAMES
  const allTeamMemberNames = useMemo(() => {
    const employeeNames = new Set<string>();
    localTimeEntries.forEach((entry) => {
      const userName = resolveUserName(entry);
      if (userName) employeeNames.add(userName);
    });
    return Array.from(employeeNames);
  }, [localTimeEntries, userNameById]);

  const employees = useMemo(() => {
    return ["all", ...allTeamMemberNames];
  }, [allTeamMemberNames]);

  // FILTER for time entries
  const filteredTimeEntries = useMemo(() => {
    return localTimeEntries.filter((entry) => {
      const userName = resolveUserName(entry);
      if (selectedEmployee !== "all" && userName !== selectedEmployee) {
        return false;
      }
      if (
        dateRange.start &&
        entry.date &&
        new Date(entry.date) < new Date(dateRange.start)
      )
        return false;
      if (
        dateRange.end &&
        entry.date &&
        new Date(entry.date) > new Date(dateRange.end)
      )
        return false;
      return true;
    });
  }, [localTimeEntries, selectedEmployee, dateRange, userNameById]);

  // clear filtering as soon as filtered results update (fixes stuck overlay when user changes From/To)
  useEffect(() => {
    if (isFiltering) {
      setIsFiltering(false);
    }
    if (maxTimeoutRef.current) {
      window.clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTimeEntries]);

  // HOURS SUMMARY
  const hoursSummary = useMemo(() => {
    const summary: { [employee: string]: number } = {};
    let totalHours = 0;

    filteredTimeEntries.forEach((entry) => {
      const userName = resolveUserName(entry) || "Unknown User";
      if (userName && entry.hours != null) {
        summary[userName] = (summary[userName] || 0) + entry.hours;
        totalHours += entry.hours;
      }
    });

    return { summary, totalHours };
  }, [filteredTimeEntries, userNameById]);

  // ---------------------
  // NEW: filteredDeliverables (applies dateRange start/end to deliverables)
  // ---------------------
  const filteredDeliverables = useMemo(() => {
    if (!Array.isArray(localDeliverables)) return [];
    return localDeliverables.filter((d) => {
      if (!d || !d.date) return false;
      try {
        const dDate = new Date(d.date);
        if (dateRange.start) {
          const start = new Date(dateRange.start);
          if (dDate < start) return false;
        }
        if (dateRange.end) {
          const end = new Date(dateRange.end);
          // include entries on end date
          if (dDate > end) return false;
        }
        return true;
      } catch {
        return false;
      }
    });
  }, [localDeliverables, dateRange]);

  // GROUP deliverables: parent + its revisions (use filteredDeliverables so filters apply)
  // -> improved: if parent missing in filtered list, try to find parent in full deliverables prop and show its real values
  const groupedDeliverables = useMemo(() => {
    const arr = Array.isArray(filteredDeliverables) ? filteredDeliverables : [];
    const map = new Map<string, { parent?: Deliverable | undefined; revisions: Deliverable[] }>();

    // Ensure map entries for all deliverables in filtered set
    arr.forEach((d) => {
      const id = String((d as any)._id || (d as any).id || "");
      if (!map.has(id)) {
        map.set(id, { parent: undefined, revisions: [] });
      }
    });

    // Populate parents and revisions; attempt to attach parent objects from full deliverables list when available
    arr.forEach((d) => {
      const id = String((d as any)._id || (d as any).id || "");
      const parentRaw = (d as any).parent;
      const parentId =
        parentRaw == null
          ? null
          : typeof parentRaw === "string"
          ? parentRaw
          : String(parentRaw._id || parentRaw.id || "");

      if (parentId) {
        // this is a revision of parentId
        if (!map.has(parentId)) {
          map.set(parentId, { parent: undefined, revisions: [] });
        }
        map.get(parentId)!.revisions.push(d);
      } else {
        // this is a parent/standalone
        const entry = map.get(id);
        if (entry) {
          entry.parent = d;
        } else {
          map.set(id, { parent: d, revisions: [] });
        }
      }
    });

    // try to locate parents from the original deliverables prop when parent objects are missing (so we can show a description instead of raw id)
    map.forEach((value, key) => {
      if (!value.parent) {
        const foundParent = (deliverables || []).find(
          (dv) => String(dv._id || (dv as any).id || "") === String(key)
        );
        if (foundParent) {
          value.parent = foundParent;
        }
      }
    });

    // Build ordered array: preserve order from filteredDeliverables as much as possible
    const result: Array<{ key: string; parent?: Deliverable; revisions: Deliverable[] }> = [];
    const seen = new Set<string>();

    arr.forEach((d) => {
      const id = String((d as any)._id || (d as any).id || "");
      if (map.has(id) && !seen.has(id)) {
        const v = map.get(id)!;
        result.push({ key: id, parent: v.parent, revisions: v.revisions });
        seen.add(id);
      }
      const parentRaw = (d as any).parent;
      const parentId =
        parentRaw == null
          ? null
          : typeof parentRaw === "string"
          ? parentRaw
          : String(parentRaw._id || parentRaw.id || "");
      if (parentId && map.has(parentId) && !seen.has(parentId)) {
        const v = map.get(parentId)!;
        result.push({ key: parentId, parent: v.parent, revisions: v.revisions });
        seen.add(parentId);
      }
    });

    // append any remaining map entries
    for (const [k, v] of map.entries()) {
      if (!seen.has(k)) {
        result.push({ key: k, parent: v.parent, revisions: v.revisions });
        seen.add(k);
      }
    }

    return result;
  }, [filteredDeliverables, deliverables]);

  // clear filtering overlay also when deliverables results update
  useEffect(() => {
    if (isFiltering) {
      setIsFiltering(false);
    }
    if (maxTimeoutRef.current) {
      window.clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredDeliverables]);

  // Deliverable form config (unchanged)
  const handleSaveDeliverable = async (formValues: any) => {
    if (!editingDeliverable || !project?._id || isSavingDeliverable) return;
    setIsSavingDeliverable(true);
    setDeliverableError(null);
    const deliverableId = String(editingDeliverable._id || (editingDeliverable as any).id || "");
    const payload = {
      date: formValues.date,
      description: formValues.description,
      notes: formValues.notes || "",
      status: formValues.status || editingDeliverable.status || "pending",
    };

    try {
      const resp = await apiClient.put(
        `/api/projects/${encodeURIComponent(project._id)}/deliverables/${encodeURIComponent(deliverableId)}`,
        payload
      );
      const updatedDeliverable = resp?.data || { ...editingDeliverable, ...payload };
      setLocalDeliverables((prev) =>
        prev.map((d) =>
          String(d._id || (d as any).id) === deliverableId ? updatedDeliverable : d
        )
      );
      setShowDeliverableModal(false);
      setEditingDeliverable(null);
    } catch (error: any) {
      console.error("Failed to update deliverable:", error);
      setDeliverableError(
        error?.response?.data?.error || "Failed to update deliverable. Please try again."
      );
    } finally {
      setIsSavingDeliverable(false);
    }
  };

  const deliverableConfig = {
    type: "deliverable",
    title: editingDeliverable ? "Edit Deliverable" : "Add Deliverable",
    fields: [
      { name: "date", label: "Delivery Date", type: "date", placeholder: "YYYY-MM-DD", required: true },
      { name: "description", label: "Description", type: "text", placeholder: "Enter deliverable description", required: true },
      { name: "notes", label: "Notes", type: "textarea", placeholder: "Enter additional notes", required: false },
      { name: "status", label: "Status", type: "select", required: true, options: ["pending", "delivered", "approved"] },
    ],
    onSubmit: handleSaveDeliverable,
    initialData: editingDeliverable || undefined,
  };

  const handleEditDeliverable = (deliverable: Deliverable) => {
    setDeliverableError(null);
    setEditingDeliverable(deliverable);
    setShowDeliverableModal(true);
  };

  // IMMEDIATE DELETE (no confirmation) — replaces previous set-then-confirm flow
  const handleDeleteDeliverable = async (id: string) => {
    if (!id || !project?._id || isDeletingDeliverable) return;
    setIsDeletingDeliverable(true);
    setDeliverableError(null);
    const previous = localDeliverables;
    setLocalDeliverables((prev) =>
      prev.filter((d) => String(d._id || (d as any).id) !== id)
    );

    try {
      await apiClient.delete(
        `/api/projects/${encodeURIComponent(project._id)}/deliverables/${encodeURIComponent(id)}`
      );
    } catch (error: any) {
      console.error("Failed to delete deliverable:", error);
      setDeliverableError(
        error?.response?.data?.error || "Failed to delete deliverable. Please try again."
      );
      setLocalDeliverables(previous);
    } finally {
      setIsDeletingDeliverable(false);
    }
  };

  // keep confirmDeleteDeliverable/cancel utilities present (unused) to avoid other changes
  const confirmDeleteDeliverable = async () => {
    if (!deliverableToDelete || !project?._id || isDeletingDeliverable) return;
    setIsDeletingDeliverable(true);
    setDeliverableError(null);
    const previous = localDeliverables;
    setLocalDeliverables((prev) =>
      prev.filter((d) => String(d._id || (d as any).id) !== deliverableToDelete)
    );

    try {
      await apiClient.delete(
        `/api/projects/${encodeURIComponent(project._id)}/deliverables/${encodeURIComponent(deliverableToDelete)}`
      );
    } catch (error: any) {
      console.error("Failed to delete deliverable:", error);
      setDeliverableError(
        error?.response?.data?.error || "Failed to delete deliverable. Please try again."
      );
      setLocalDeliverables(previous);
    } finally {
      setIsDeletingDeliverable(false);
      setDeliverableToDelete(null);
    }
  };
  const cancelDeleteDeliverable = () => setDeliverableToDelete(null);

  const getStatusBadgeClass = (status: string | undefined) => {
    switch (status) {
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800";
      case "in-progress":
      case "delivered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Edit & Delete API logic (unchanged)
  const handleDeleteTime = async (entryId: string) => {
    if (!project._id || !entryId) return;
    const previous = localTimeEntries;
    setLocalTimeEntries((prev) => prev.filter((e) => (e._id || e.id) !== entryId));
    try {
      const url = `/api/projects/${encodeURIComponent(project._id)}/time-entries/${encodeURIComponent(
        entryId
      )}`;
      await apiClient.delete(url);
      try {
        onDeleteTime(project._id, entryId);
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error("Delete failed, rolling back UI:", err);
      setLocalTimeEntries(previous);
    }
  };

  const openEditTimeModal = (entry: TimeEntry) => {
    const proj = (entry as any).project;
    let pid: string | undefined = undefined;
    let pObj: Project | undefined = undefined;
    if (proj) {
      if (typeof proj === "string") pid = proj;
      else pid = proj._id || proj.id;
      if (pid) {
        pObj = projects.find((p) => (p._id || p.id) === pid);
      }
    }
    if (!pid) {
      pid = project._id;
      pObj = projects.find((p) => (p._id || p.id) === project._id);
    }

    setEditInitialProjectId(pid);
    setEditInitialProject(pObj);
    setEditingTimeEntry(entry);
    setShowEditTimeModal(true);
  };

  const handleEditTimeSubmit = async (formData: {
    projectId: string;
    data: Omit<
      TimeEntry,
      "_id" | "user" | "project" | "createdAt" | "updatedAt"
    >;
  }) => {
    if (!editingTimeEntry) {
      setShowEditTimeModal(false);
      return;
    }
    const entryId = editingTimeEntry._id || (editingTimeEntry as any).id;
    const previous = localTimeEntries;

    setLocalTimeEntries((prev) =>
      prev.map((e) =>
        (e._id || (e as any).id) === entryId
          ? { ...e, ...formData.data, project: formData.projectId ? formData.projectId : (e as any).project }
          : e
      )
    );

    setShowEditTimeModal(false);

    try {
      const url = `/api/projects/${encodeURIComponent(
        formData.projectId
      )}/time-entries/${encodeURIComponent(String(entryId))}`;
      const resp = await apiClient.put(url, formData.data);
      const updated = resp?.data || null;

      if (updated) {
        setLocalTimeEntries((prev) =>
          prev.map((e) =>
            (e._id || (e as any).id) === entryId ? updated : e
          )
        );
      }

      try {
        onEditTime(updated || { ...(editingTimeEntry as any), ...(formData.data as any) });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error("Edit update failed, rolling back UI:", err);
      setLocalTimeEntries(previous);
    } finally {
      setEditingTimeEntry(null);
      setShowEditTimeModal(false);
      setEditInitialProjectId(undefined);
      setEditInitialProject(undefined);
    }
  };

  const handleModalSubmit = (modalPayload: any) => {
    const payloadProjectId = modalPayload && modalPayload.projectId
      ? modalPayload.projectId
      : (editInitialProjectId ?? project._id);
    const payloadData = modalPayload && modalPayload.data ? modalPayload.data : modalPayload;
    handleEditTimeSubmit({
      projectId: String(payloadProjectId),
      data: payloadData,
    });
  };

  // DATE VALIDATIONS: same "From" / "To" logic as TimesheetsView
  const formatISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const todayStr = formatISODate(new Date());

  useEffect(() => {
    const dateFrom = dateRange.start;
    const dateTo = dateRange.end;

    if (!dateFrom) return;

    if (dateFrom > todayStr) {
      setDateRange((prev) => ({ ...prev, start: todayStr, end: todayStr }));
      return;
    }

    if (dateFrom === todayStr) {
      if (dateTo !== todayStr) setDateRange((prev) => ({ ...prev, end: todayStr }));
      return;
    }

    if (dateTo && dateTo < dateFrom) {
      setDateRange((prev) => ({ ...prev, end: dateFrom }));
    }

    if (dateTo && dateTo > todayStr) {
      setDateRange((prev) => ({ ...prev, end: todayStr }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.start]);

  useEffect(() => {
    const dateFrom = dateRange.start;
    const dateTo = dateRange.end;

    if (!dateTo) return;

    if (dateTo > todayStr) {
      setDateRange((prev) => ({ ...prev, end: todayStr }));
    }
    if (dateFrom && dateTo < dateFrom) {
      setDateRange((prev) => ({ ...prev, end: dateFrom }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.end, dateRange.start]);

  useEffect(() => {
    return () => {
      if (maxTimeoutRef.current) {
        window.clearTimeout(maxTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg relative">
      {isFiltering && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-dashed animate-spin" />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiClock className="text-blue-600" /> Timesheet for {project.name}
        </h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50">
            <FiDownload size={16} /> Export
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50">
            <FiPrinter size={16} /> Print
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        {["timesheet", "deliverables", "analytics"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiFilter /> Filters
          </h2>
          <button
            onClick={() => {
              startFiltering();
              setDateRange({ start: "", end: "" });
              setSelectedEmployee("all");
              setTimeline("all");
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                max={todayStr}
                onChange={(e) => {
                  startFiltering();
                  const val = e.target.value;
                  setDateRange((prev) => ({ ...prev, start: val }));
                  setTimeline("custom");
                  if (val === todayStr) {
                    setDateRange((prev) => ({ ...prev, end: todayStr }));
                  }
                }}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateRange.end}
                min={dateRange.start || undefined}
                max={todayStr}
                onChange={(e) => {
                  startFiltering();
                  setDateRange((prev) => ({ ...prev, end: e.target.value }));
                  setTimeline("custom");
                }}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedEmployee}
                onChange={(e) => {
                  startFiltering();
                  setSelectedEmployee(e.target.value);
                }}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {employees.map((employeeName) => (
                  <option key={employeeName} value={employeeName}>
                    {employeeName === "all" ? "All Employees" : employeeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TIMELINE SELECT - new filter (applies to both timesheets and deliverables via dateRange) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
            <div className="relative">
              <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={timeline}
                onChange={(e) => {
                  const val = e.target.value;
                  setTimeline(val);
                }}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 days</option>
                <option value="1month">Last 1 month</option>
                <option value="3month">Last 3 months</option>
                <option value="6month">Last 6 months</option>
                <option value="1year">Last 1 year</option>
                <option value="custom">Custom (use From/To)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {activeTab === "timesheet" && (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task / Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTimeEntries.length > 0 ? (
                  filteredTimeEntries.map((entry) => {
                    const entryId = entry._id || entry.id;
                    const userName = resolveUserName(entry) || "Unknown User";

                    const ep = (entry as any).project;
                    let entryProjectId: string | undefined = undefined;
                    let entryProjectName = "Project Not Found";
                    if (ep) {
                      if (typeof ep === "string") entryProjectId = ep;
                      else entryProjectId = ep._id || ep.id;
                    }
                    if (!entryProjectId) {
                      entryProjectId = project._id;
                      entryProjectName = project.name;
                    } else {
                      const found = projects.find((p) => (p._id || p.id) === entryProjectId);
                      entryProjectName = found ? found.name : String(entryProjectId);
                    }

                    return (
                      <tr key={entryId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entryProjectName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(entry.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.title || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.hours != null ? `${entry.hours}h` : "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{entry.note || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${entry.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {entry.approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-3">
                          <button onClick={() => openEditTimeModal(entry)} className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50" disabled={!entryId} title="Edit Time Entry"><FiEdit /></button>
                          <button onClick={() => { if (project._id && entryId) handleDeleteTime(String(entryId)); }} className="text-red-600 hover:text-red-800 disabled:opacity-50" disabled={!project._id || !entryId} title="Delete Time Entry"><FiTrash2 /></button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No time entries found for this period or employee.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Hours Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(hoursSummary.summary).map(([employeeName, hours]) => (
                <div key={employeeName} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">{employeeName}</span>
                  <span className="text-gray-900">{hours} hours</span>
                </div>
              ))}
              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center text-sm col-span-1 md:col-span-2">
                <span className="font-semibold text-blue-800">Total Hours</span>
                <span className="font-semibold text-blue-900">{hoursSummary.totalHours} hours</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "deliverables" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Deliverables</h2>
            <div className="text-sm text-gray-500">
              <span className="font-medium">{groupedDeliverables.length}</span> group(s)
            </div>
          </div>
          {deliverableError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{deliverableError}</div>
          )}

          {/* NEW UI: grouped deliverables that is clearer and more readable */}
          <div className="space-y-5">
            {groupedDeliverables.length > 0 ? (
              groupedDeliverables.map((group) => {
                const parent = group.parent;
                const key = group.key || (parent ? String((parent as any)._id || (parent as any).id) : `parent-${Math.random()}`);
                const revisionCount = group.revisions ? group.revisions.length : 0;

                // If parent missing, attempt to find in full deliverables for display; else show short id
                const foundParent = parent ? parent : (deliverables || []).find(
                  (dv) => String(dv._id || (dv as any).id || "") === String(group.key)
                );

                const parentLabel = foundParent ? (foundParent.description || "Untitled deliverable") : `${String(group.key).slice(0, 8)}...`;

                return (
                  <div key={key} className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden">
                    {/* Parent header */}
                    <div className="p-4 md:p-5 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight">
                            {foundParent ? parentLabel : `Revision(s) of: ${parentLabel}`}
                          </h3>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {foundParent ? `Due: ${foundParent.date ? formatDate(foundParent.date) : "N/A"}` : "Parent not found locally"}
                          </span>
                        </div>

                        {/* Parent ID (muted) */}
                        <div className="text-xs text-gray-400 mt-1">
                          {foundParent ? (
                            <span title={String(foundParent._id || (foundParent as any).id || "")}>
                              ID: {String(foundParent._id || (foundParent as any).id || "").slice(0, 10)}...
                            </span>
                          ) : (
                            <span title={String(group.key)}>Parent ID: {String(group.key)}</span>
                          )}
                        </div>

                        {/* Parent notes (if any) */}
                        {foundParent?.notes && (
                          <p className="text-sm text-gray-500 mt-2 max-w-2xl">{foundParent.notes}</p>
                        )}
                      </div>

                      {/* Parent controls & status */}
                      <div className="flex items-start gap-3">
                        {foundParent && (
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(foundParent.status)}`}>
                            {foundParent.status ? foundParent.status.charAt(0).toUpperCase() + foundParent.status.slice(1) : "Pending"}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          {/* If there's a real parent we show edit/delete for it */}
                          {foundParent && (
                            <>
                              <button onClick={() => handleEditDeliverable(foundParent)} className="text-indigo-600 hover:text-indigo-800" title="Edit Deliverable"><FiEdit size={16} /></button>
                              <button onClick={() => handleDeleteDeliverable(String(foundParent._id || (foundParent as any).id || ""))} className="text-red-600 hover:text-red-800" title="Delete Deliverable"><FiTrash2 size={16} /></button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Revisions area */}
                    <div className="border-t border-gray-100 bg-gray-50 p-4 md:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-700 font-medium">Revisions ({revisionCount})</div>
                        <div className="text-xs text-gray-400">Showing revisions that match current filters</div>
                      </div>

                      {revisionCount > 0 ? (
                        <div className="space-y-3">
                          {group.revisions.map((rev) => (
                            <div key={(rev as any)._id || (rev as any).id} className="p-3 rounded-md bg-white border border-gray-100 flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="font-medium text-sm text-gray-900">{rev.description || "Untitled revision"}</p>
                                <p className="text-sm text-gray-500 mt-1">Due: {rev.date ? formatDate(rev.date) : "N/A"}</p>
                                {rev.notes && <p className="text-sm text-gray-400 mt-2">{rev.notes}</p>}
                                <div className="text-xs text-gray-400 mt-2">Revision ID: {(rev as any)._id ? String((rev as any)._id).slice(0,10) + "..." : (rev as any).id ? String((rev as any).id).slice(0,10) + "..." : "n/a"}</div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(rev.status)}`}>
                                  {rev.status ? rev.status.charAt(0).toUpperCase() + rev.status.slice(1) : "Pending"}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => handleEditDeliverable(rev)} className="text-indigo-600 hover:text-indigo-800" title="Edit Revision"><FiEdit size={16} /></button>
                                  <button onClick={() => handleDeleteDeliverable(String(rev._id || (rev as any).id || ""))} className="text-red-600 hover:text-red-800" title="Delete Revision"><FiTrash2 size={16} /></button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 py-3">No revisions found for this parent within the selected date range.</div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-gray-500">No deliverables found for this project.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><FiPieChart /> Analytics</h2>
          <p className="text-gray-600 mt-4">Analytics for {project.name} will be displayed here (e.g., charts, graphs).</p>
        </div>
      )}

      {showDeliverableModal && (
        <AddEntityModal
          config={deliverableConfig as any}
          onClose={() => {
            setShowDeliverableModal(false);
            setEditingDeliverable(null);
          }}
        />
      )}

      {showEditTimeModal && editingTimeEntry && (
        <AddTimeEntryModal
          projects={projects}
          employee={(editingTimeEntry as any).user || (editingTimeEntry as any).employee || null}
          onSubmit={handleModalSubmit}
          onClose={() => {
            setShowEditTimeModal(false);
            setEditingTimeEntry(null);
            setEditInitialProjectId(undefined);
            setEditInitialProject(undefined);
          }}
          initialProjectId={String((editInitialProjectId ?? project._id))}
          initialProject={(editInitialProject ?? projects.find((p) => p._id === project._id)) || undefined}
          projectSelectLabel="Selected Project"
          initialData={editingTimeEntry as any}
        />
      )}

    </div>
  );
};
export default ProjectTimesheetView;
