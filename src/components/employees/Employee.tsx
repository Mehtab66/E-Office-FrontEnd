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
//         ...user,
//         id: user.id ?? user._id, // Ensure 'id' exists
//       }))
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
//  const getProjectNames = (
//   projectIds: (string | { _id: string; name: string })[]
// ) => {
//   if (!projectIds?.length) return "None";
//   return projectIds
//     .map((project) => {
//       if (typeof project === "string") {
//         const foundProject = projects.find((p) => p._id === project);
//         // Only return the project name if found; otherwise, skip invalid strings
//         return foundProject ? foundProject.name : null;
//       }
//       // Ensure it’s a valid project object with a name
//       return project?.name || null;
//     })
//     .filter(Boolean) // remove null/undefined entries
//     .join(", ") || "None";
// };


//   return (
//     <div className="container  px-4 py-6 bg-background min-h-screen">
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
//                         className={`px-4 py-3 font-semibold text-muted-foreground ${
//                           header.key !== "projects"
//                             ? "cursor-pointer hover:text-foreground"
//                             : ""
//                         }`}
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
//                         className={`px-3 py-2 border border-border rounded-lg ${
//                           currentPageFromData === page
//                             ? "bg-primary text-primary-foreground"
//                             : "bg-card text-foreground"
//                         }`}
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
  projects: Project[]; // Added projects prop
  onEditEmployee: (employee: User) => void;
  onDeleteEmployee: (id: string) => void;
}

const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees: propEmployees,
  projects, // Added projects prop
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Matches the default limit in the hook

  // Map sortField to API-compatible sort string
  const sortString = `${sortDirection === "asc" ? "" : "-"}${sortField}`;

  // Fetch employees with pagination, search, and sort
  const { data, isLoading } = useEmployees({
    page: currentPage,
    limit,
    sort: sortString,
    search: searchTerm,
  });

  // Map API users to local User type by adding 'id' property if missing
  const employees: User[] = data?.users
    ? data.users.map((user: any) => ({
        ...user,
        id: user.id ?? user._id, // Ensure 'id' exists
      }))
    : propEmployees;

  const totalPages = data?.totalPages || 1;
  const currentPageFromData = data?.currentPage || currentPage;

  // Filter and sort employees (client-side fallback)
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
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Map project IDs to names
 const getProjectNames = (
  projectIds: (string | { _id: string; name: string })[]
) => {
  if (!projectIds?.length) return "None";
  return projectIds
    .map((project) => {
      if (typeof project === "string") {
        const foundProject = projects.find((p) => p._id === project);
        // Only return the project name if found; otherwise, skip invalid strings
        return foundProject ? foundProject.name : null;
      }
      // Ensure it’s a valid project object with a name
      return project?.name || null;
    })
    .filter(Boolean) // remove null/undefined entries
    .join(", ") || "None";
};
  

  return (
    <div className="container px-4 py-6 bg-background">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FiUser /> Employees
          </h1>
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-foreground">
                <thead className="bg-muted">
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
                        className={`px-4 py-3 font-semibold text-muted-foreground ${
                          header.key !== "projects"
                            ? "cursor-pointer hover:text-foreground"
                            : ""
                        }`}
                      >
                        <div className="flex items-center">
                          {header.label}
                          {sortField === header.key &&
                            header.key !== "projects" &&
                            (sortDirection === "asc" ? (
                              <FiChevronUp className="ml-1" />
                            ) : (
                              <FiChevronDown className="ml-1" />
                            ))}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr
                        key={employee._id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">
                          {employee.name}
                        </td>
                        <td className="px-4 py-3">
                          {employee.role.replace("_", " ").toUpperCase()}
                        </td>
                        <td className="px-4 py-3">{employee.email}</td>
                        <td className="px-4 py-3">
                          {getProjectNames(employee.projects || [])}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-3 text-center text-muted-foreground"
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
              <div className="flex justify-between items-center mt-6">
                <div className="text-muted-foreground">
                  Showing {(currentPageFromData - 1) * limit + 1} to{" "}
                  {Math.min(currentPageFromData * limit, data?.total || 0)} of{" "}
                  {data?.total || 0} employees
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPageFromData === 1}
                    className="px-3 py-2 border border-border rounded-lg bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border border-border rounded-lg ${
                          currentPageFromData === page
                            ? "bg-primary text-primary-foreground"
                            : "bg-card text-foreground"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPageFromData === totalPages}
                    className="px-3 py-2 border border-border rounded-lg bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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
