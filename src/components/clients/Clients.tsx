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

  // Filter and sort clients
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
    <div className="container  px-4 py-6 bg-background min-h-screen">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FiUsers /> Clients
          </h1>
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-foreground">
            <thead className="bg-muted">
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
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr
                    key={client._id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{client.name}</td>
                    <td className="px-4 py-3">{client.email}</td>
                    <td className="px-4 py-3">{client.phone}</td>
                    <td className="px-4 py-3">{client.country}</td>
                    <td className="px-4 py-3">
                      {client.projects.length > 0
                        ? client.projects
                            .map((project) =>
                              typeof project === "string"
                                ? project
                                : project.name
                            )
                            .join(", ")
                        : "None"}
                    </td>
                    <td className="px-4 py-3">
                      {onEditClient && (
                        <button
                          onClick={() => onEditClient(client)}
                          className="text-primary hover:text-primary/80 transition-colors"
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
                    className="px-4 py-3 text-center text-muted-foreground"
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
