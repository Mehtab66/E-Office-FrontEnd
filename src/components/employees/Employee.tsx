// import React, { useState } from "react";
// import {
//   FiSearch,
//   FiChevronDown,
//   FiChevronUp,
//   FiChevronLeft,
//   FiChevronRight,
//   FiUser,
// } from "react-icons/fi";
// import type { User, Project } from "../../types";
// import { useEmployees } from "../../hooks/useEmployee";

// interface EmployeesViewProps {
//   employees: User[];
//   projects: Project[]; // Added projects prop
//   onEditEmployee: (employee: User) => void;
//   onDeleteEmployee: (id: string) => void;
// }

// const EmployeesView: React.FC<EmployeesViewProps> = ({
//   employees: propEmployees,
//   projects, // Added projects prop
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortField, setSortField] = useState<keyof User>("name");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const limit = 10; // Matches the default limit in the hook

//   // Map sortField to API-compatible sort string
//   const sortString = `${sortDirection === "asc" ? "" : "-"}${sortField}`;

//   // Fetch employees with pagination, search, and sort
//   const { data, isLoading } = useEmployees({
//     page: currentPage,
//     limit,
//     sort: sortString,
//     search: searchTerm,
//   });

//   // Map API users to local User type by adding 'id' property if missing
//   const employees: User[] = data?.users
//     ? data.users.map((user: any) => ({
//       ...user,
//       id: user.id ?? user._id, // Ensure 'id' exists
//     }))
//     : propEmployees;

//   const totalPages = data?.totalPages || 1;
//   const currentPageFromData = data?.currentPage || currentPage;

//   // Filter and sort employees (client-side fallback)
//   const filteredEmployees = employees
//     .filter(
//       (employee) =>
//         employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (employee.role &&
//           employee.role.toLowerCase().includes(searchTerm.toLowerCase()))
//     )
//     .sort((a, b) => {
//       const aValue = a[sortField] ?? "";
//       const bValue = b[sortField] ?? "";
//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return sortDirection === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
//       }
//       return 0;
//     });

//   const handleSort = (field: keyof User) => {
//     if (field === sortField) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//     setCurrentPage(1); // Reset to first page on sort change
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   // Map project IDs to names
//   const getProjectNames = (
//     projectIds: (string | { _id: string; name: string })[]
//   ) => {
//     if (!projectIds?.length) return "None";
//     return projectIds
//       .map((project) => {
//         if (typeof project === "string") {
//           const foundProject = projects.find((p) => p._id === project);
//           // Only return the project name if found; otherwise, skip invalid strings
//           return foundProject ? foundProject.name : null;
//         }
//         // Ensure it’s a valid project object with a name
//         return project?.name || null;
//       })
//       .filter(Boolean) // remove null/undefined entries
//       .join(", ") || "None";
//   };


//   return (
//     <div className="container px-4 py-6 bg-background">
//       <div className="bg-card rounded-xl shadow-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
//             <FiUser /> Employees
//           </h1>
//           <div className="relative w-64">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//             <input
//               type="text"
//               placeholder="Search employees..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1); // Reset to first page on search
//               }}
//               className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="text-center text-muted-foreground">Loading...</div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-foreground">
//                 <thead className="bg-muted">
//                   <tr>
//                     {[
//                       { key: "name", label: "Name" },
//                       { key: "role", label: "Role" },
//                       { key: "email", label: "Email" },
//                       { key: "projects", label: "Projects" },
//                     ].map((header) => (
//                       <th
//                         key={header.key}
//                         onClick={() =>
//                           header.key !== "projects" &&
//                           handleSort(header.key as keyof User)
//                         }
//                         className={`px-4 py-3 font-semibold text-muted-foreground ${header.key !== "projects"
//                             ? "cursor-pointer hover:text-foreground"
//                             : ""
//                           }`}
//                       >
//                         <div className="flex items-center">
//                           {header.label}
//                           {sortField === header.key &&
//                             header.key !== "projects" &&
//                             (sortDirection === "asc" ? (
//                               <FiChevronUp className="ml-1" />
//                             ) : (
//                               <FiChevronDown className="ml-1" />
//                             ))}
//                         </div>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredEmployees.length > 0 ? (
//                     filteredEmployees.map((employee) => (
//                       <tr
//                         key={employee._id}
//                         className="border-b border-border hover:bg-muted/50 transition-colors"
//                       >
//                         <td className="px-4 py-3 font-medium">
//                           {employee.name}
//                         </td>
//                         <td className="px-4 py-3">
//                           {employee.role.replace("_", " ").toUpperCase()}
//                         </td>
//                         <td className="px-4 py-3">{employee.email}</td>
//                         <td className="px-4 py-3">
//                           {getProjectNames(employee.projects || [])}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={5}
//                         className="px-4 py-3 text-center text-muted-foreground"
//                       >
//                         No employees found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="flex justify-between items-center mt-6">
//                 <div className="text-muted-foreground">
//                   Showing {(currentPageFromData - 1) * limit + 1} to{" "}
//                   {Math.min(currentPageFromData * limit, data?.total || 0)} of{" "}
//                   {data?.total || 0} employees
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPageFromData === 1}
//                     className="px-3 py-2 border border-border rounded-lg bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <FiChevronLeft />
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                     (page) => (
//                       <button
//                         key={page}
//                         onClick={() => handlePageChange(page)}
//                         className={`px-3 py-2 border border-border rounded-lg ${currentPageFromData === page
//                             ? "bg-primary text-primary-foreground"
//                             : "bg-card text-foreground"
//                           }`}
//                       >
//                         {page}
//                       </button>
//                     )
//                   )}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPageFromData === totalPages}
//                     className="px-3 py-2 border border-border rounded-lg bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <FiChevronRight />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeesView;
import React, { useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";
import type { User, Project } from "../../types";
import { useEmployees } from "../../hooks/useEmployee";

interface EmployeesViewProps {
  employees: User[];
  projects: Project[];
  onEditEmployee: (employee: User) => void;
  onDeleteEmployee: (id: string) => void;
}

const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees: propEmployees,
  projects,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const sortString = `${sortDirection === "asc" ? "" : "-"}${sortField}`;

  const { data, isLoading } = useEmployees({
    page: currentPage,
    limit,
    sort: sortString,
    search: searchTerm,
  });

  const employees: User[] = data?.users
    ? data.users.map((user: any) => ({
      ...user,
      id: user.id ?? user._id,
    }))
    : propEmployees;

  const totalPages = data?.totalPages || 1;
  const currentPageFromData = data?.currentPage || currentPage;

  const filteredEmployees = employees
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.role &&
          employee.role.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getProjectNames = (
    projectIds: (string | { _id: string; name: string })[]
  ) => {
    if (!projectIds?.length) return "None";
    return projectIds
      .map((project) => {
        if (typeof project === "string") {
          const foundProject = projects.find((p) => p._id === project);
          return foundProject ? foundProject.name : null;
        }
        return project?.name || null;
      })
      .filter(Boolean)
      .join(", ") || "None";
  };


  return (
    // UPDATED: Theme Container
    <div className="container px-4 py-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl shadow-xl backdrop-blur-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiUser className="text-emerald-500" /> Employees
          </h1>
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-slate-500 py-12">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-slate-300">
                <thead className="bg-slate-950/50 border-b border-slate-800">
                  <tr>
                    {[
                      { key: "name", label: "Name" },
                      { key: "role", label: "Role" },
                      { key: "email", label: "Email" },
                      { key: "projects", label: "Projects" },
                    ].map((header) => (
                      <th
                        key={header.key}
                        onClick={() =>
                          header.key !== "projects" &&
                          handleSort(header.key as keyof User)
                        }
                        className={`px-4 py-4 font-semibold text-slate-400 ${header.key !== "projects"
                          ? "cursor-pointer hover:text-white transition-colors"
                          : ""
                          }`}
                      >
                        <div className="flex items-center">
                          {header.label}
                          {sortField === header.key &&
                            header.key !== "projects" &&
                            (sortDirection === "asc" ? (
                              <FiChevronUp className="ml-1 text-emerald-400" />
                            ) : (
                              <FiChevronDown className="ml-1 text-emerald-400" />
                            ))}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr
                        key={employee._id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-4 font-medium text-white">
                          {employee.name}
                        </td>
                        <td className="px-4 py-4 text-slate-400">
                          {employee.role ? (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${employee.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                employee.role === 'manager' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                  'bg-slate-700/50 text-slate-300 border-slate-600/30'
                              }`}>
                              {employee.role.replace("_", " ").toUpperCase()}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-4 text-slate-400">{employee.email}</td>
                        <td className="px-4 py-4 text-slate-400">
                          {getProjectNames(employee.projects || [])}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800">
                <div className="text-slate-500 text-sm">
                  Showing {(currentPageFromData - 1) * limit + 1} to{" "}
                  {Math.min(currentPageFromData * limit, data?.total || 0)} of{" "}
                  {data?.total || 0} employees
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPageFromData === 1}
                    className="px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <FiChevronLeft />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border border-slate-700 rounded-lg text-sm font-medium transition-colors ${currentPageFromData === page
                          ? "bg-emerald-600 text-white border-emerald-500"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPageFromData === totalPages}
                    className="px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeesView;