"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Eye,
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={user.name}
            onChange={(e) => onChange({ ...user, name: e.target.value })}
            placeholder="Enter full name"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => onChange({ ...user, email: e.target.value })}
            placeholder="user@example.com"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={user.phone}
            onChange={(e) => onChange({ ...user, phone: e.target.value })}
            placeholder="+12025550123 or +447911123456"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnic">CNIC</Label>
          <Input
            id="cnic"
            value={user.cnic}
            onChange={(e) =>
              onChange({ ...user, cnic: formatCNIC(e.target.value) })
            }
            placeholder="37405-2999873-3"
            maxLength={15}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {errors.cnic && (
            <p className="text-sm text-destructive">{errors.cnic}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            value={user.designation}
            onChange={(e) => onChange({ ...user, designation: e.target.value })}
            placeholder="Job title"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {errors.designation && (
            <p className="text-sm text-destructive">{errors.designation}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={user.department}
            onChange={(e) => onChange({ ...user, department: e.target.value })}
            placeholder="Department name"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {errors.department && (
            <p className="text-sm text-destructive">{errors.department}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grade">Grade (Number)</Label>
          <Input
            id="grade"
            type="number"
            min="1"
            max="20"
            value={user.grade}
            onChange={(e) =>
              onChange({ ...user, grade: parseInt(e.target.value) || 0 })
            }
            placeholder="Enter grade (1-20)"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {errors.grade && (
            <p className="text-sm text-destructive">{errors.grade}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">
            {isUpdate ? "New Password (Optional)" : "Password"}
          </Label>
          <Input
            id="password"
            type="password"
            value={user.password || ""}
            onChange={(e) => onChange({ ...user, password: e.target.value })}
            placeholder={
              isUpdate
                ? "Leave blank to keep current password"
                : "Enter password"
            }
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="hover:bg-gray-100 transition-colors"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? (isUpdate ? "Updating..." : "Adding...") : submitText}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
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
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: users = [], isLoading, error } = useEmployees();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  useEffect(() => {
    if (error) {
      console.error("Error fetching employees:", error);
    }
  }, [error]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = useMemo(
    () => Math.ceil(filteredUsers.length / itemsPerPage),
    [filteredUsers.length, itemsPerPage]
  );

  const paginatedUsers = useMemo(
    () =>
      filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredUsers, currentPage, itemsPerPage]
  );

  const handleAddUser = () => {
    createUserMutation.mutate(newUser, {
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
        });
        setIsAddModalOpen(false);
      },
      onError: (error) => {
        console.error("Failed to add user:", error);
      },
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user, password: "" } as UserFormData);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = () => {
    if (editingUser && editingUser._id) {
      // Find the original user data
      const originalUser = users.find((u) => u._id === editingUser._id);
      if (!originalUser) {
        toast.error("Original user data not found");
        return;
      }

      // Prepare the payload with only allowed fields
      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        grade: editingUser.grade,
        designation: editingUser.designation,
        cnic: editingUser.cnic,
        department: editingUser.department,
        password: editingUser.password?.trim() || undefined,
      };

      // Explicitly compare each field to detect changes
      const hasChanges =
        payload.name !== originalUser.name ||
        payload.email !== originalUser.email ||
        payload.phone !== originalUser.phone ||
        payload.grade !== originalUser.grade ||
        payload.designation !== originalUser.designation ||
        payload.cnic !== originalUser.cnic ||
        payload.department !== originalUser.department ||
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
          },
          onError: (error) => {
            console.error("Failed to update user:", error);
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
          const newFilteredUsers = filteredUsers.filter(
            (u) => u._id !== deleteUserId
          );
          const newTotalPages = Math.ceil(
            newFilteredUsers.length / itemsPerPage
          );
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          } else if (newTotalPages === 0) {
            setCurrentPage(1);
          }
          setDeleteUserId(null);
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
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                User Management
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage all system users and their permissions
              </CardDescription>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
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
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              variant="outline"
              className="gap-2 hover:bg-gray-100 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              className="gap-2 hover:bg-gray-100 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No users found matching your search.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          User
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Designation
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Department
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Grade
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-800">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-400" />
                              <span>{user.designation}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.department}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                getGradeBadgeVariant(user.grade) === "default"
                                  ? "bg-blue-100 text-blue-800"
                                  : getGradeBadgeVariant(user.grade) ===
                                    "secondary"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              Grade {user.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(user)}
                                className=" transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteUserId(user._id)}
                                className="hover:bg-red-600 text-red-500 transition-colors"
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
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredUsers.length}</span>{" "}
                  results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteUserId(null)}
              disabled={deleteUserMutation.isPending}
              className="hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteUserMutation.isPending}
              className="bg-red-600 hover:bg-red-700 transition-colors"
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
