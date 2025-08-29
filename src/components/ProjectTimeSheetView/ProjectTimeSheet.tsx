import React, { useState, useMemo } from "react";
import {
  FiClock,
  FiPlus,
  FiEdit,
  FiX,
  FiCalendar,
  FiFileText,
  FiMessageSquare,
} from "react-icons/fi";
import AddEntityModal from "../AddEntity/AddEntityModal";

interface TimeEntry {
  id: string;
  employee: string;
  project: string;
  date: string;
  hours: number;
  description: string;
}

interface Deliverable {
  id: string;
  date: string;
  description: string;
  notes: string;
}

interface ProjectTimesheetViewProps {
  project: {
    id: string;
    name: string;
  };
  timeEntries: TimeEntry[];
  onAddDeliverable: (data: Deliverable) => void;
}

interface DeliverableFormConfig {
  type: "deliverable";
  title: string;
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
  }[];
  onSubmit: (data: any) => void;
}

const ProjectTimesheetView: React.FC<ProjectTimesheetViewProps> = ({
  project,
  timeEntries,
  onAddDeliverable,
}) => {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [editingDeliverable, setEditingDeliverable] =
    useState<Deliverable | null>(null);

  // Calculate total hours per employee and project
  const hoursSummary = useMemo(() => {
    const summary: { [employee: string]: number } = {};
    let totalHours = 0;
    timeEntries
      .filter((entry) => entry.project === project.name)
      .forEach((entry) => {
        summary[entry.employee] = (summary[entry.employee] || 0) + entry.hours;
        totalHours += entry.hours;
      });
    return { summary, totalHours };
  }, [timeEntries, project.name]);

  // Deliverable form configuration
  const deliverableConfig: DeliverableFormConfig = {
    type: "deliverable",
    title: editingDeliverable ? "Edit Deliverable" : "Add Deliverable",
    fields: [
      {
        name: "date",
        label: "Delivery Date",
        type: "date",
        placeholder: "YYYY-MM-DD",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "Enter deliverable description",
        required: true,
      },
      {
        name: "notes",
        label: "Notes",
        type: "text",
        placeholder: "Enter additional notes",
        required: false,
      },
    ],
    onSubmit: (data) => {
      const deliverable: Deliverable = {
        id: editingDeliverable
          ? editingDeliverable.id
          : (deliverables.length + 1).toString(),
        date: data.date,
        description: data.description,
        notes: data.notes || "",
      };
      if (editingDeliverable) {
        setDeliverables((prev) =>
          prev.map((d) => (d.id === deliverable.id ? deliverable : d))
        );
      } else {
        setDeliverables((prev) => [...prev, deliverable]);
        onAddDeliverable(deliverable);
      }
      setShowDeliverableModal(false);
      setEditingDeliverable(null);
    },
  };

  // Handle edit deliverable
  const handleEditDeliverable = (deliverable: Deliverable) => {
    setEditingDeliverable(deliverable);
    setShowDeliverableModal(true);
  };

  return (
    <div className="p-6 bg-card rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2 mb-6">
        <FiClock /> Timesheet for {project.name}
      </h1>

      {/* Hours Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Hours Summary
        </h2>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">
            Total Hours: {hoursSummary.totalHours.toFixed(2)} hours
          </p>
          <div className="mt-2">
            {Object.entries(hoursSummary.summary).map(([employee, hours]) => (
              <p key={employee} className="text-sm text-foreground">
                {employee}: {hours.toFixed(2)} hours
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Time Entries */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Time Entries
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-foreground">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Employee
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Hours
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.filter((entry) => entry.project === project.name)
                .length > 0 ? (
                timeEntries
                  .filter((entry) => entry.project === project.name)
                  .map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">{entry.employee}</td>
                      <td className="px-4 py-3">{entry.date}</td>
                      <td className="px-4 py-3">{entry.hours.toFixed(2)}</td>
                      <td className="px-4 py-3">{entry.description}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-3 text-center text-muted-foreground"
                  >
                    No time entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deliverables */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Deliverables
          </h2>
          <button
            onClick={() => setShowDeliverableModal(true)}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-1"
          >
            <FiPlus /> Add Deliverable
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-foreground">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Notes
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {deliverables.length > 0 ? (
                deliverables.map((deliverable) => (
                  <tr
                    key={deliverable.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">{deliverable.date}</td>
                    <td className="px-4 py-3">{deliverable.description}</td>
                    <td className="px-4 py-3">{deliverable.notes || "None"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditDeliverable(deliverable)}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-1"
                      >
                        <FiEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-3 text-center text-muted-foreground"
                  >
                    No deliverables found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deliverable Modal */}
      {showDeliverableModal && (
        <AddEntityModal
          config={deliverableConfig}
          onClose={() => {
            setShowDeliverableModal(false);
            setEditingDeliverable(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectTimesheetView;
