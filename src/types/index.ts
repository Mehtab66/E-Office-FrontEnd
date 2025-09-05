export interface User {
  _id: string;
  name: string;
  email: string;
  role: "manager" | "employee" | "admin";
  phone?: string;
  grade?: number;
  designation?: string;
  cnic?: string;
  projects?: string[];
}

export interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  currency: string;
  billingAddress: string;
  shippingAddress: string;
  projects: (string | Project)[];
}

export interface Project {
  _id: string;
  name: string;
  client: string | Client;
  status: "active" | "pending" | "completed";
  startDate: string;
  estimatedTime: string;
  teamLead: string | User;
  teamMembers: string[];
}

export interface TimeEntry {
  _id: string;
  employee: string;
  project: string;
  date: string;
  hours: number;
  description: string;
  task: string;
}

export interface Deliverable {
  _id: string;
  date: string;
  description: string;
  notes: string;
  status: "pending" | "in-progress" | "completed";
}
