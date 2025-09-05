export interface Deliverable {
  _id: string;
  project: string;
  date: string;
  description: string;
  notes?: string;
  status: "pending" | "delivered" | "approved";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
