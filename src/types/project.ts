export interface Project {
  _id: string;
  name: string;
  client: string ; // Allow populated client
  status: "active" | "pending" | "completed";
  startDate: string;
  estimatedTime: string;
  teamLead: string; // Allow populated user
  teamMembers: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
