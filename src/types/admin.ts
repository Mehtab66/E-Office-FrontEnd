export interface Admin {
  _id: string;
  email: string;
  password: string; // Stored temporarily for fixed credentials
  name?: string;
}
