import type { User } from "../apis/authService";

export interface Task {
  _id: string;
  project: string;
  title: string;
  description?: string;
  assignedTo: string | User;
  status: "todo" | "in_progress" | "done";
  dueDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
