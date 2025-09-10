import type { Key } from "react";
import type { User } from "../apis/authService";

export interface Subtask {
  _id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  assignees: (string | User)[];
  priority: "urgent" | "high" | "medium" | "low";
}

export interface Task {
  id?: Key | null; // for React key usage
  _id: string;
  project: string; // ObjectId as string
  title: string;
  description?: string;
  assignedTo: string | User;
  priority: "urgent" | "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
  subtasks: Subtask[];
  dueDate?: string; // ISO string from backend
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}
