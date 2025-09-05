export interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  currency: string;
  billingAddress: string;
  shippingAddress: string;
  projects: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}