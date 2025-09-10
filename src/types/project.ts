import type { Key } from "react";
import type{ User } from "../apis/authService";

export interface Project {
  id?: Key | null | undefined; // For React compatibility
  _id: string;
  name: string;
  client: string | {
    _id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    currency: string;
    billingAddress: string;
    shippingAddress: string;
    projects: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
  status: "active" | "pending" | "completed";
  startDate: string;
  estimatedTime: string;
  teamLead: string | User;
  teamMembers: (string | User)[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
