import React, { useState } from "react";
import {
  FiUser,
  FiEdit2,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  projects: string[];
}

interface EmployeesViewProps {
  employees: Employee[];
  onEditEmployee?: (employee: Employee) => void;
}

const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  onEditEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Employee>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSort = (field: keyof Employee) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-background min-h-screen">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employees..."
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
                  { key: "role", label: "Role" },
                  { key: "email", label: "Email" },
                  { key: "projects", label: "Projects" },
                  { key: "", label: "Actions" },
                ].map((header) => (
                  <th
                    key={header.key}
                    onClick={() =>
                      header.key && handleSort(header.key as keyof Employee)
                    }
                    className="px-4 py-3 font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                  >
                    <div className="flex items-center">
                      {header.label}
                      {sortField === header.key &&
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
                    key={employee.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{employee.name}</td>
                    <td className="px-4 py-3">{employee.role}</td>
                    <td className="px-4 py-3">{employee.email}</td>
                    <td className="px-4 py-3">
                      {employee.projects.length > 0
                        ? employee.projects.join(", ")
                        : "None"}
                    </td>
                    <td className="px-4 py-3">
                      {onEditEmployee && (
                        <button
                          onClick={() => onEditEmployee(employee)}
                          className="text-primary hover:text-primary/80 transition-colors"
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
      </div>
    </div>
  );
};

export default EmployeesView;
