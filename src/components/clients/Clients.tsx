// import React, { useState } from "react";
// import {
//   FiUsers,
//   FiEdit2,
//   FiSearch,
//   FiChevronDown,
//   FiChevronUp,
// } from "react-icons/fi";
// import type { Client } from "../../types";

// interface ClientsViewProps {
//   clients: Client[];
//   onEditClient?: (client: Client) => void;
// }

// const ClientsView: React.FC<ClientsViewProps> = ({ clients, onEditClient }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortField, setSortField] = useState<keyof Client>("name");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

//   // Filter and sort clients
//   const filteredClients = clients
//     .filter(
//       (client) =>
//         client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         client.country.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       const aValue = a[sortField];
//       const bValue = b[sortField];
//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return sortDirection === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }
//       return 0;
//     });

//   const handleSort = (field: keyof Client) => {
//     if (field === sortField) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   return (
//     <div className="container px-4 py-6 bg-background">
//       <div className="bg-card rounded-xl shadow-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
//             <FiUsers /> Clients
//           </h1>
//           <div className="relative w-64">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//             <input
//               type="text"
//               placeholder="Search clients..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-foreground">
//             <thead className="bg-muted">
//               <tr>
//                 {[
//                   { key: "name", label: "Name" },
//                   { key: "email", label: "Email" },
//                   { key: "phone", label: "Phone" },
//                   { key: "country", label: "Country" },
//                   { key: "projects", label: "Projects" },
//                   { key: "", label: "Actions" },
//                 ].map((header) => (
//                   <th
//                     key={header.key}
//                     onClick={() =>
//                       header.key !== "projects" &&
//                       handleSort(header.key as keyof Client)
//                     }
//                     className={`px-4 py-3 font-semibold text-muted-foreground ${header.key !== "projects"
//                         ? "cursor-pointer hover:text-foreground"
//                         : ""
//                       }`}
//                   >
//                     <div className="flex items-center">
//                       {header.label}
//                       {sortField === header.key &&
//                         header.key !== "projects" &&
//                         (sortDirection === "asc" ? (
//                           <FiChevronUp className="ml-1" />
//                         ) : (
//                           <FiChevronDown className="ml-1" />
//                         ))}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredClients.length > 0 ? (
//                 filteredClients.map((client) => (
//                   <tr
//                     key={client._id}
//                     className="border-b border-border hover:bg-muted/50 transition-colors"
//                   >
//                     <td className="px-4 py-3 font-medium">{client.name}</td>
//                     <td className="px-4 py-3">{client.email}</td>
//                     <td className="px-4 py-3">{client.phone}</td>
//                     <td className="px-4 py-3">{client.country}</td>
//                     <td className="px-4 py-3">
//                       {client.projects.length > 0
//                         ? client.projects
//                           .map((project) =>
//                             typeof project === "string"
//                               ? project
//                               : project.name
//                           )
//                           .join(", ")
//                         : "None"}
//                     </td>
//                     <td className="px-4 py-3">
//                       {onEditClient && (
//                         <button
//                           onClick={() => onEditClient(client)}
//                           className="text-primary hover:text-primary/80 transition-colors"
//                           aria-label={`Edit client ${client.name}`}
//                         >
//                           <FiEdit2 />
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-4 py-3 text-center text-muted-foreground"
//                   >
//                     No clients found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientsView;
import React, { useState } from "react";
import {
  FiUsers,
  FiEdit2,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import type { Client } from "../../types";

interface ClientsViewProps {
  clients: Client[];
  onEditClient?: (client: Client) => void;
}

const ClientsView: React.FC<ClientsViewProps> = ({ clients, onEditClient }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Client>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredClients = clients
    .filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.country.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

  const handleSort = (field: keyof Client) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    // UPDATED: Theme Container
    <div className="container px-4 py-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl shadow-xl backdrop-blur-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiUsers className="text-purple-500" /> Clients
          </h1>
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-950/50 border-b border-slate-800">
              <tr>
                {[
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "country", label: "Country" },
                  { key: "projects", label: "Projects" },
                  { key: "", label: "Actions" },
                ].map((header) => (
                  <th
                    key={header.key}
                    onClick={() =>
                      header.key !== "projects" &&
                      handleSort(header.key as keyof Client)
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
                          <FiChevronUp className="ml-1 text-purple-400" />
                        ) : (
                          <FiChevronDown className="ml-1 text-purple-400" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr
                    key={client._id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-4 font-medium text-white">{client.name}</td>
                    <td className="px-4 py-4 text-slate-400">{client.email}</td>
                    <td className="px-4 py-4 text-slate-400">{client.phone}</td>
                    <td className="px-4 py-4 text-slate-400">{client.country}</td>
                    <td className="px-4 py-4 text-slate-400">
                      {client.projects.length > 0
                        ? client.projects
                          .map((project) =>
                            typeof project === "string"
                              ? project
                              : project.name
                          )
                          .join(", ")
                        : <span className="text-slate-600 italic">None</span>}
                    </td>
                    <td className="px-4 py-4">
                      {onEditClient && (
                        <button
                          onClick={() => onEditClient(client)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2 rounded-lg transition-all"
                          aria-label={`Edit client ${client.name}`}
                        >
                          <FiEdit2 />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientsView;