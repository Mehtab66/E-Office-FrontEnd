import type { Key } from "react";

export interface Deliverable {
  _id: Key | null | undefined;
  id: string;
  project: string;
  date: string;
  description: string;
  notes?: string;
  status: "pending" | "delivered" | "approved";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  parent?: string; // Optional link to parent deliverable for revisions
}
