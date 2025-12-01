// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "../../components/ui/dialog";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../../components/ui/card";
// import {
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   UsersIcon,
//   ChevronLeft,
//   ChevronRight,
//   Filter,
//   Download,
//   Briefcase,
// } from "lucide-react";
// import { Avatar, AvatarFallback } from "../../components/ui/avatar";
// import { toast } from "react-toastify";
// import {
//   useEmployees,
//   useCreateUser,
//   useUpdateUser,
//   useDeleteUser,
//   type User,
// } from "../../hooks/useEmployee";
// import {
//   validateUser,
//   validateUpdateUser,
//   formatCNIC,
//   type UserFormData,
// } from "../../validators/employeeValidation";
// import { useDebounce } from "use-debounce";
// import "../../App.css";
// interface UserFormProps {
//   user: UserFormData;
//   onChange: (user: UserFormData) => void;
//   onSubmit: () => void;
//   onCancel: () => void;
//   submitText: string;
//   isSubmitting: boolean;
//   isUpdate: boolean;
// }

// const UserForm: React.FC<UserFormProps> = ({
//   user,
//   onChange,
//   onSubmit,
//   onCancel,
//   submitText,
//   isSubmitting,
//   isUpdate,
// }) => {
//   const [errors, setErrors] = useState<
//     Partial<Record<keyof UserFormData, string>>
//   >({});

//   const handleSubmit = () => {
//     const validator = isUpdate ? validateUpdateUser : validateUser;
//     const { isValid, errors } = validator(user);
//     if (!isValid) {
//       setErrors(errors);
//       return;
//     }
//     setErrors({});
//     onSubmit();
//   };

//   return (
//     <div className="grid gap-4 py-4">
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="name">Name</Label>
//           <Input
//             id="name"
//             value={user.name}
//             onChange={(e) => onChange({ ...user, name: e.target.value })}
//             placeholder="Enter full name"
//             className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.name && (
//             <p className="text-sm text-destructive">{errors.name}</p>
//           )}
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             type="email"
//             value={user.email}
//             onChange={(e) => onChange({ ...user, email: e.target.value })}
//             placeholder="user@example.com"
//             className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.email && (
//             <p className="text-sm text-destructive">{errors.email}</p>
//           )}
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="phone">Phone</Label>
//           <Input
//             id="phone"
//             value={user.phone}
//             onChange={(e) => onChange({ ...user, phone: e.target.value })}
//             placeholder="+12025550123 or +447911123456"
//             className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.phone && (
//             <p className="text-sm text-destructive">{errors.phone}</p>
//           )}
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="cnic">CNIC</Label>
//           <Input
//             id="cnic"
//             value={user.cnic}
//             onChange={(e) =>
//               onChange({ ...user, cnic: formatCNIC(e.target.value) })
//             }
//             placeholder="37405-2999873-3"
//             maxLength={15}
//             className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.cnic && (
//             <p className="text-sm text-destructive">{errors.cnic}</p>
//           )}
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="designation">Designation</Label>
//           <Input
//             id="designation"
//             value={user.designation}
//             onChange={(e) => onChange({ ...user, designation: e.target.value })}
//             placeholder="Job title"
//             className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.designation && (
//             <p className="text-sm text-destructive">{errors.designation}</p>
//           )}
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="department">Department</Label>
//           <Input
//             id="department"
//             value={user.department}
//             onChange={(e) => onChange({ ...user, department: e.target.value })}
//             placeholder="Department name"
//             className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.department && (
//             <p className="text-sm text-destructive">{errors.department}</p>
//           )}
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="grade">Grade (1–20)</Label>
//           <Input
//             id="grade"
//             type="number"
//             min="1"
//             max="20"
//             value={user.grade}
//             onChange={(e) =>
//               onChange({ ...user, grade: parseInt(e.target.value) || 0 })
//             }
//             placeholder="Enter grade"
//             className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.grade && (
//             <p className="text-sm text-destructive">{errors.grade}</p>
//           )}
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="role">Role</Label>
//           <Select
//             value={user.role || "employee"}
//             onValueChange={(value) =>
//               onChange({ ...user, role: value as "employee" | "manager" })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select role" />
//             </SelectTrigger>
//             <SelectContent className="z-99999999">
//               <SelectItem value="employee">Employee</SelectItem>
//               <SelectItem value="manager">Manager</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="password">
//           {isUpdate ? "New Password (Optional)" : "Password"}
//         </Label>
//         <Input
//           id="password"
//           type="password"
//           value={user.password || ""}
//           onChange={(e) => onChange({ ...user, password: e.target.value })}
//           placeholder={
//             isUpdate ? "Leave blank to keep current password" : "Enter password"
//           }
//           className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//         />
//         {errors.password && (
//           <p className="text-sm text-destructive">{errors.password}</p>
//         )}
//       </div>
//       <DialogFooter>
//         <Button
//           variant="outline"
//           onClick={onCancel}
//           disabled={isSubmitting}
//           className="hover:bg-gray-100 transition-colors"
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className="bg-blue-600 hover:bg-blue-700 transition-colors"
//         >
//           {isSubmitting ? (isUpdate ? "Updating..." : "Adding...") : submitText}
//         </Button>
//       </DialogFooter>
//     </div>
//   );
// };

// export default function Users() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
//   const [editingUser, setEditingUser] = useState<
//     | (UserFormData & { _id?: string; createdAt?: string; updatedAt?: string })
//     | null
//   >(null);
//   const [newUser, setNewUser] = useState<UserFormData>({
//     name: "",
//     email: "",
//     phone: "",
//     grade: 5,
//     designation: "",
//     cnic: "",
//     department: "",
//     password: "",
//     role: "employee",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const {
//     data = { users: [], total: 0, totalPages: 1, currentPage: 1 },
//     isLoading,
//     error,
//   } = useEmployees({
//     page: currentPage,
//     limit: itemsPerPage,
//     sort: "-createdAt",
//     search: debouncedSearchTerm,
//   });

//   // Debugging logs to diagnose list rendering issues
//   useEffect(() => {
//     console.log("useEmployees data:", data);
//     console.log("isLoading:", isLoading);
//     console.log("error:", error);
//     console.log("searchTerm:", searchTerm);
//     console.log("debouncedSearchTerm:", debouncedSearchTerm);
//   }, [data, isLoading, error, searchTerm, debouncedSearchTerm]);

//   const createUserMutation = useCreateUser();
//   const updateUserMutation = useUpdateUser();
//   const deleteUserMutation = useDeleteUser();

//   useEffect(() => {
//     if (error) {
//       toast.error(`Error fetching employees: ${error.message}`);
//     }
//   }, [error]);

//   const handleAddUser = () => {
//     createUserMutation.mutate(
//       {
//         ...newUser,
//       },
//       {
//         onSuccess: () => {
//           setNewUser({
//             name: "",
//             email: "",
//             phone: "",
//             grade: 5,
//             designation: "",
//             cnic: "",
//             department: "",
//             password: "",
//             role: "employee",
//           });
//           setIsAddModalOpen(false);
//           toast.success("User added successfully!");
//         },
//         onError: (error: Error) => {
//           toast.error(`Failed to add user: ${error.message}`);
//         },
//       }
//     );
//   };

//   const handleEditUser = (user: User) => {
//     setEditingUser({
//       ...user,
//       password: "",
//       role: user.role || "employee", // Ensure role has a fallback
//     } as UserFormData);
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateUser = () => {
//     if (editingUser && editingUser._id) {
//       const originalUser = data.users.find((u) => u._id === editingUser._id);
//       if (!originalUser) {
//         toast.error("Original user data not found");
//         return;
//       }

//       const payload = {
//         name: editingUser.name,
//         email: editingUser.email,
//         phone: editingUser.phone,
//         grade: editingUser.grade,
//         designation: editingUser.designation,
//         cnic: editingUser.cnic,
//         department: editingUser.department,
//         role: editingUser.role,
//         password: editingUser.password?.trim() || undefined,
//       };

//       const hasChanges =
//         payload.name !== originalUser.name ||
//         payload.email !== originalUser.email ||
//         payload.phone !== originalUser.phone ||
//         payload.grade !== originalUser.grade ||
//         payload.designation !== originalUser.designation ||
//         payload.cnic !== originalUser.cnic ||
//         payload.department !== originalUser.department ||
//         payload.role !== originalUser.role ||
//         (payload.password !== undefined && payload.password !== "");

//       if (!hasChanges) {
//         toast.info("No changes made to user data");
//         setIsEditModalOpen(false);
//         return;
//       }

//       updateUserMutation.mutate(
//         { id: editingUser._id, data: payload as unknown as User },
//         {
//           onSuccess: () => {
//             setEditingUser(null);
//             setIsEditModalOpen(false);
//             toast.success("User updated successfully!");
//           },
//           onError: (error: Error) => {
//             toast.error(`Failed to update user: ${error.message}`);
//           },
//         }
//       );
//     }
//   };

//   const handleConfirmDelete = () => {
//     if (deleteUserId) {
//       deleteUserMutation.mutate(deleteUserId, {
//         onSuccess: () => {
//           if (data.users.length === 1 && currentPage > 1) {
//             setCurrentPage((prev) => prev - 1);
//           }
//           setDeleteUserId(null);
//           toast.success("User deleted successfully!");
//         },
//         onError: (error: Error) => {
//           toast.error(`Failed to delete user: ${error.message}`);
//         },
//       });
//     }
//   };

//   const getGradeBadgeVariant = (grade: number) => {
//     if (grade >= 1 && grade <= 5) return "default";
//     if (grade >= 6 && grade <= 10) return "secondary";
//     return "outline";
//   };

//   if (isLoading) {
//     return (
//       <div className="text-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="mt-2 text-gray-600">Loading users...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-destructive">
//         Error: {error.message}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div>
//               <CardTitle className="text-2xl font-bold text-gray-900">
//                 User Management
//               </CardTitle>
//               <CardDescription className="text-gray-600">
//                 Manage all system users and their permissions
//               </CardDescription>
//             </div>
//             <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//               <DialogTrigger asChild>
//                 <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 transition-colors">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add New User
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[800px]">
//                 <DialogHeader>
//                   <DialogTitle>Add New User</DialogTitle>
//                   <DialogDescription>
//                     Enter the user's information below. All fields are required.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <UserForm
//                   user={newUser}
//                   onChange={setNewUser}
//                   onSubmit={handleAddUser}
//                   onCancel={() => setIsAddModalOpen(false)}
//                   submitText="Add User"
//                   isSubmitting={createUserMutation.isPending}
//                   isUpdate={false}
//                 />
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <div className="relative flex-1">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//               <Input
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <Button
//               variant="outline"
//               className="gap-2 hover:bg-gray-100 transition-colors"
//             >
//               <Filter className="h-4 w-4" />
//               Filter
//             </Button>
//             <Button
//               variant="outline"
//               className="gap-2 hover:bg-gray-100 transition-colors"
//             >
//               <Download className="h-4 w-4" />
//               Export
//             </Button>
//           </div>
//           {data.users.length === 0 ? (
//             <div className="text-center py-8">
//               <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <p className="text-muted-foreground">
//                 {searchTerm
//                   ? "No users found matching your search."
//                   : "No users found."}
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="rounded-lg border border-gray-200 overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left font-medium text-gray-700">
//                           User
//                         </th>
//                         <th className="px-4 py-3 text-left font-medium text-gray-700">
//                           Designation
//                         </th>
//                         <th className="px-4 py-3 text-left font-medium text-gray-700">
//                           Department
//                         </th>
//                         <th className="px-4 py-3 text-left font-medium text-gray-700">
//                           Grade
//                         </th>
//                         <th className="px-4 py-3 text-left font-medium text-gray-700">
//                           Role
//                         </th>
//                         <th className="px-4 py-3 text-right font-medium text-gray-700">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {data.users.map((user) => (
//                         <tr
//                           key={user._id}
//                           className="hover:bg-gray-50 transition-colors duration-200"
//                         >
//                           <td className="px-4 py-3">
//                             <div className="flex items-center gap-3">
//                               <Avatar className="h-8 w-8">
//                                 <AvatarFallback className="bg-blue-100 text-blue-800">
//                                   {user.name
//                                     .split(" ")
//                                     .map((n) => n[0])
//                                     .join("")}
//                                 </AvatarFallback>
//                               </Avatar>
//                               <div>
//                                 <p className="font-medium text-gray-900">
//                                   {user.name}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                   {user.email}
//                                 </p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-4 py-3">
//                             <div className="flex items-center gap-2">
//                               <Briefcase className="h-4 w-4 text-gray-400" />
//                               <span>{user.designation}</span>
//                             </div>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                               {user.department}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span
//                               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                 getGradeBadgeVariant(user.grade) === "default"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : getGradeBadgeVariant(user.grade) ===
//                                     "secondary"
//                                   ? "bg-purple-100 text-purple-800"
//                                   : "bg-gray-100 text-gray-800"
//                               }`}
//                             >
//                               Grade {user.grade}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                               {user.role
//                                 ? user.role.charAt(0).toUpperCase() +
//                                   user.role.slice(1)
//                                 : "Unknown"}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 text-right">
//                             <div className="flex justify-end gap-2">
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => handleEditUser(user)}
//                                 className="transition-colors"
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => setDeleteUserId(user._id)}
//                                 className="hover:bg-red-600 text-red-500 transition-colors"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between mt-6">
//                 <p className="text-sm text-gray-700">
//                   Showing{" "}
//                   <span className="font-medium">
//                     {(currentPage - 1) * itemsPerPage + 1}
//                   </span>{" "}
//                   to{" "}
//                   <span className="font-medium">
//                     {Math.min(currentPage * itemsPerPage, data.total)}
//                   </span>{" "}
//                   of <span className="font-medium">{data.total}</span> results
//                 </p>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       setCurrentPage((prev) => Math.max(prev - 1, 1))
//                     }
//                     disabled={currentPage === 1}
//                     className="hover:bg-gray-100 transition-colors"
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                     Previous
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       setCurrentPage((prev) =>
//                         Math.min(prev + 1, data.totalPages)
//                       )
//                     }
//                     disabled={currentPage === data.totalPages}
//                     className="hover:bg-gray-100 transition-colors"
//                   >
//                     Next
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent className="sm:max-w-[800px]">
//           <DialogHeader>
//             <DialogTitle>Edit User</DialogTitle>
//             <DialogDescription>
//               Update the user's information below. Password is optional for
//               updates.
//             </DialogDescription>
//           </DialogHeader>
//           {editingUser && (
//             <UserForm
//               user={editingUser}
//               onChange={setEditingUser}
//               onSubmit={handleUpdateUser}
//               onCancel={() => setIsEditModalOpen(false)}
//               submitText="Save Changes"
//               isSubmitting={updateUserMutation.isPending}
//               isUpdate={true}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//       <Dialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this user? This action cannot be
//               undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setDeleteUserId(null)}
//               disabled={deleteUserMutation.isPending}
//               className="hover:bg-gray-100 transition-colors"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleConfirmDelete}
//               disabled={deleteUserMutation.isPending}
//               className="bg-red-600 hover:bg-red-700 transition-colors"
//             >
//               {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UsersIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Briefcase,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { toast } from "react-toastify";
import {
  useEmployees,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  type User,
} from "../../hooks/useEmployee";
import {
  validateUser,
  validateUpdateUser,
  formatCNIC,
  type UserFormData,
} from "../../validators/employeeValidation";
import { useDebounce } from "use-debounce";
import "../../App.css";

interface UserFormProps {
  user: UserFormData;
  onChange: (user: UserFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitText: string;
  isSubmitting: boolean;
  isUpdate: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onChange,
  onSubmit,
  onCancel,
  submitText,
  isSubmitting,
  isUpdate,
}) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  const handleSubmit = () => {
    const validator = isUpdate ? validateUpdateUser : validateUser;
    const { isValid, errors } = validator(user);
    if (!isValid) {
      setErrors(errors);
      return;
    }
    setErrors({});
    onSubmit();
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-300">Name</Label>
          <Input
            id="name"
            value={user.name}
            onChange={(e) => onChange({ ...user, name: e.target.value })}
            placeholder="Enter full name"
            className="bg-slate-950 border-slate-700 text-slate-200 focus:ring-blue-500/50"
          />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => onChange({ ...user, email: e.target.value })}
            placeholder="user@example.com"
            className="bg-slate-950 border-slate-700 text-slate-200 focus:ring-blue-500/50"
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-300">Phone</Label>
          <Input
            id="phone"
            value={user.phone}
            onChange={(e) => onChange({ ...user, phone: e.target.value })}
            placeholder="+12025550123"
            className="bg-slate-950 border-slate-700 text-slate-200 focus:ring-blue-500/50"
          />
          {errors.phone && (
            <p className="text-sm text-red-400">{errors.phone}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnic" className="text-slate-300">CNIC</Label>
          <Input
            id="cnic"
            value={user.cnic}
            onChange={(e) =>
              onChange({ ...user, cnic: formatCNIC(e.target.value) })
            }
            placeholder="37405-2999873-3"
            maxLength={15}
            className="bg-slate-950 border-slate-700 text-slate-200 focus:ring-blue-500/50"
          />
          {errors.cnic && (
            <p className="text-sm text-red-400">{errors.cnic}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="designation" className="text-slate-300">Designation</Label>
          <Input
            id="designation"
            value={user.designation}
            onChange={(e) => onChange({ ...user, designation: e.target.value })}
            placeholder="Job title"
            className="bg-slate-950 border-slate-700 text-slate-200 focus:ring-blue-500/50"
          />
          {errors.designation && (
            <p className="text-sm text-red-400">{errors.designation}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="department" className="text-slate-300">Department</Label>
          <Input
            id="department"
            value={user.department}
            onChange={(e) => onChange({ ...user, department: e.target.value })}
            placeholder="Department name"
            className="bg-slate-950 border-slate-700 text-slate-200 focus:ring-blue-500/50"
          />
          {errors.department && (
            <p className="text-sm text-red-400">{errors.department}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grade" className="text-slate-300">Grade (1–20)</Label>
          <Input
            id="grade"
            type="number"
            min="1"
            max="20"
            value={user.grade}
            onChange={(e) =>
              onChange({ ...user, grade: parseInt(e.target.value) || 0 })
            }
            placeholder="Enter grade"
            className="bg-slate-950 border-slate-700 text-slate-200 focus:ring-blue-500/50"
          />
          {errors.grade && (
            <p className="text-sm text-red-400">{errors.grade}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="role" className="text-slate-300">Role</Label>
          <Select
            value={user.role || "employee"}
            onValueChange={(value) =>
              onChange({ ...user, role: value as "employee" | "manager" })
            }
          >
            <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-300">
          {isUpdate ? "New Password (Optional)" : "Password"}
        </Label>
        <Input
          id="password"
          type="password"
          value={user.password || ""}
          onChange={(e) => onChange({ ...user, password: e.target.value })}
          placeholder={
            isUpdate ? "Leave blank to keep current password" : "Enter password"
          }
          className="bg-slate-950 border-slate-700 text-slate-200 focus:ring-blue-500/50"
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password}</p>
        )}
      </div>
      <DialogFooter className="mt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border border-blue-500/50"
        >
          {isSubmitting ? (isUpdate ? "Updating..." : "Adding...") : submitText}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<
    | (UserFormData & { _id?: string; createdAt?: string; updatedAt?: string })
    | null
  >(null);
  const [newUser, setNewUser] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    grade: 5,
    designation: "",
    cnic: "",
    department: "",
    password: "",
    role: "employee",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data = { users: [], total: 0, totalPages: 1, currentPage: 1 },
    isLoading,
    error,
  } = useEmployees({
    page: currentPage,
    limit: itemsPerPage,
    sort: "-createdAt",
    search: debouncedSearchTerm,
  });

  useEffect(() => {
    console.log("useEmployees data:", data);
  }, [data]);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching employees: ${error.message}`);
    }
  }, [error]);

  const handleAddUser = () => {
    createUserMutation.mutate(
      {
        ...newUser,
      },
      {
        onSuccess: () => {
          setNewUser({
            name: "",
            email: "",
            phone: "",
            grade: 5,
            designation: "",
            cnic: "",
            department: "",
            password: "",
            role: "employee",
          });
          setIsAddModalOpen(false);
          toast.success("User added successfully!");
        },
        onError: (error: Error) => {
          toast.error(`Failed to add user: ${error.message}`);
        },
      }
    );
  };

  const handleEditUser = (user: User) => {
    setEditingUser({
      ...user,
      password: "",
      role: user.role || "employee",
    } as UserFormData);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = () => {
    if (editingUser && editingUser._id) {
      const originalUser = data.users.find((u) => u._id === editingUser._id);
      if (!originalUser) {
        toast.error("Original user data not found");
        return;
      }

      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        grade: editingUser.grade,
        designation: editingUser.designation,
        cnic: editingUser.cnic,
        department: editingUser.department,
        role: editingUser.role,
        password: editingUser.password?.trim() || undefined,
      };

      const hasChanges =
        payload.name !== originalUser.name ||
        payload.email !== originalUser.email ||
        payload.phone !== originalUser.phone ||
        payload.grade !== originalUser.grade ||
        payload.designation !== originalUser.designation ||
        payload.cnic !== originalUser.cnic ||
        payload.department !== originalUser.department ||
        payload.role !== originalUser.role ||
        (payload.password !== undefined && payload.password !== "");

      if (!hasChanges) {
        toast.info("No changes made to user data");
        setIsEditModalOpen(false);
        return;
      }

      updateUserMutation.mutate(
        { id: editingUser._id, data: payload as unknown as User },
        {
          onSuccess: () => {
            setEditingUser(null);
            setIsEditModalOpen(false);
            toast.success("User updated successfully!");
          },
          onError: (error: Error) => {
            toast.error(`Failed to update user: ${error.message}`);
          },
        }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (deleteUserId) {
      deleteUserMutation.mutate(deleteUserId, {
        onSuccess: () => {
          if (data.users.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
          setDeleteUserId(null);
          toast.success("User deleted successfully!");
        },
        onError: (error: Error) => {
          toast.error(`Failed to delete user: ${error.message}`);
        },
      });
    }
  };

  const getGradeBadgeVariant = (grade: number) => {
    if (grade >= 1 && grade <= 5) return "default";
    if (grade >= 6 && grade <= 10) return "secondary";
    return "outline";
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-700 border-t-blue-500 mx-auto"></div>
        <p className="mt-4 text-slate-500">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400 bg-red-900/10 rounded-lg border border-red-900/50 m-6">
        Error: {error.message}
      </div>
    );
  }

  return (
    // THEME CONTAINER
    <div className="space-y-6 container px-4 py-6">
      <Card className="border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-white tracking-tight">
                User Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage all system users and their permissions
              </CardDescription>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500/50 transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] bg-slate-900 border-slate-800 text-slate-200">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New User</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Enter the user's information below. All fields are required.
                  </DialogDescription>
                </DialogHeader>
                <UserForm
                  user={newUser}
                  onChange={setNewUser}
                  onSubmit={handleAddUser}
                  onCancel={() => setIsAddModalOpen(false)}
                  submitText="Add User"
                  isSubmitting={createUserMutation.isPending}
                  isUpdate={false}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-slate-950 border-slate-700 text-slate-200 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            <Button
              variant="outline"
              className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          {data.users.length === 0 ? (
            <div className="text-center py-12 border border-slate-800 rounded-lg bg-slate-950/30">
              <UsersIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchTerm
                  ? "No users found matching your search."
                  : "No users found."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-950/50 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-slate-400">
                          User
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-400">
                          Designation
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-400">
                          Department
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-400">
                          Grade
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-400">
                          Role
                        </th>
                        <th className="px-6 py-4 text-right font-semibold text-slate-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/30">
                      {data.users.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-slate-800/50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 ring-2 ring-slate-800">
                                <AvatarFallback className="bg-slate-800 text-blue-400 border border-slate-700">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-slate-200">
                                  {user.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Briefcase className="h-4 w-4 text-slate-500" />
                              <span>{user.designation}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {user.department}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGradeBadgeVariant(user.grade) === "default"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  : getGradeBadgeVariant(user.grade) ===
                                    "secondary"
                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                    : "bg-slate-800 text-slate-400 border-slate-700"
                                }`}
                            >
                              Grade {user.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {user.role
                                ? user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)
                                : "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(user)}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteUserId(user._id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6 border-t border-slate-800 pt-6">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-300">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-300">
                    {Math.min(currentPage * itemsPerPage, data.total)}
                  </span>{" "}
                  of <span className="font-medium text-slate-300">{data.total}</span> results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, data.totalPages)
                      )
                    }
                    disabled={currentPage === data.totalPages}
                    className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[800px] bg-slate-900 border-slate-800 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-white">Edit User</DialogTitle>
            <DialogDescription className="text-slate-400">
              Update the user's information below. Password is optional for
              updates.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserForm
              user={editingUser}
              onChange={setEditingUser}
              onSubmit={handleUpdateUser}
              onCancel={() => setIsEditModalOpen(false)}
              submitText="Save Changes"
              isSubmitting={updateUserMutation.isPending}
              isUpdate={true}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteUserId(null)}
              disabled={deleteUserMutation.isPending}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteUserMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white border border-red-500/50"
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}