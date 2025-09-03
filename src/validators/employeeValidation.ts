import { z } from "zod";

export const userSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Valid email is required").trim(),
  phone: z.string().min(1, "Phone is required").trim(),
  grade: z.number().min(1, "Grade must be between 1 and 20").max(20),
  designation: z.string().min(1, "Designation is required").trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
  cnic: z
    .string()
    .regex(/^\d{5}-\d{7}-\d$/, "CNIC must be in the format 12345-1234567-1")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 13, "CNIC must be 13 digits"),
  department: z.string().min(1, "Department is required").trim(),
});

export const updateUserSchema = userSchema.extend({
  password: z.string().trim().min(0).optional().or(z.literal("")),
});

export type UserFormData = z.infer<typeof userSchema>;

export const validateUser = (data: Partial<UserFormData>) => {
  const result = userSchema.safeParse(data);
  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Partial<Record<keyof UserFormData, string>> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof UserFormData;
    errors[field] = issue.message;
  });
  return { isValid: false, errors };
};

export const validateUpdateUser = (data: Partial<UserFormData>) => {
  const result = updateUserSchema.safeParse(data);
  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Partial<Record<keyof UserFormData, string>> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof UserFormData;
    errors[field] = issue.message;
  });
  return { isValid: false, errors };
};

export const formatCNIC = (value: string): string => {
  const numbers = value.replace(/\D/g, "").slice(0, 13);
  if (numbers.length <= 5) return numbers;
  if (numbers.length <= 12) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12)}`;
};
