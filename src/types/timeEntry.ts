import type { User } from "../apis/authService";
import type { Task } from "./task";

export interface TimeEntry {
  _id: string;
  user: string | User;
  project: string;
  date: string;
  hours: number;
  title: string;
  note?: string;
  task?: string | Task;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}
