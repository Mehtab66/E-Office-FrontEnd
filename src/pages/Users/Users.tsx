"use client";

import { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
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
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../libs/utils";
import React from "react";

// Table Component Definitions
const tableVariants = cva("w-full border-collapse border", {
  variants: {
    density: {
      default: "table-row",
      compact: "table-row [&>tr>td]:py-2 [&>tr>th]:py-2",
      comfortable: "table-row [&>tr>td]:py-4 [&>tr>th]:py-4",
    },
  },
  defaultVariants: {
    density: "default",
  },
});

interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, density, ...props }, ref) => (
    <table
      ref={ref}
      className={cn(tableVariants({ density, className }))}
      {...props}
    />
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-muted/50", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b", className)} {...props} />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("border px-4 py-3 text-left font-medium", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("border px-4 py-3 text-left", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  grade: string;
  designation: string;
  cnic: string;
}

interface UserFormProps {
  user: User;
  onChange: (user: User) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitText: string;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onChange,
  onSubmit,
  onCancel,
  submitText,
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  const formatCNIC = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 13);
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 12)
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(
      12
    )}`;
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof User, string>> = {};
    if (!user.name) newErrors.name = "Name is required";
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email))
      newErrors.email = "Valid email is required";
    if (!user.phone) newErrors.phone = "Phone is required";
    if (!user.cnic || user.cnic.replace(/\D/g, "").length !== 13)
      newErrors.cnic = "CNIC must be 13 digits";
    if (!user.designation) newErrors.designation = "Designation is required";
    if (!user.grade) newErrors.grade = "Grade is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={user.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...user, name: e.target.value })
            }
            placeholder="Enter full name"
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...user, email: e.target.value })
            }
            placeholder="user@example.com"
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...user, phone: e.target.value })
            }
            placeholder="123-456-7890"
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...user, cnic: formatCNIC(e.target.value) })
            }
            placeholder="37405-2999873-3"
            maxLength={15}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...user, designation: e.target.value })
            }
            placeholder="Job title"
          />
          {errors.designation && (
            <p className="text-sm text-destructive">{errors.designation}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Select
            value={user.grade}
            onValueChange={(value) => onChange({ ...user, grade: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Grade A</SelectItem>
              <SelectItem value="B">Grade B</SelectItem>
              <SelectItem value="C">Grade C</SelectItem>
            </SelectContent>
          </Select>
          {errors.grade && (
            <p className="text-sm text-destructive">{errors.grade}</p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{submitText}</Button>
      </DialogFooter>
    </div>
  );
};

function Users() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@eoffice.com",
      phone: "123-456-7890",
      grade: "A",
      designation: "Developer",
      cnic: "37405-2999873-3",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@eoffice.com",
      phone: "098-765-4321",
      grade: "B",
      designation: "Manager",
      cnic: "37405-2999873-4",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice@eoffice.com",
      phone: "555-123-4567",
      grade: "A",
      designation: "Designer",
      cnic: "37405-2999873-5",
    },
    {
      id: 4,
      name: "Bob Wilson",
      email: "bob@eoffice.com",
      phone: "444-987-6543",
      grade: "C",
      designation: "Analyst",
      cnic: "37405-2999873-6",
    },
    {
      id: 5,
      name: "Carol Davis",
      email: "carol@eoffice.com",
      phone: "333-555-7777",
      grade: "B",
      designation: "Team Lead",
      cnic: "37405-2999873-7",
    },
  ]);

  const [newUser, setNewUser] = useState<User>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    grade: "",
    designation: "",
    cnic: "",
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.designation.toLowerCase().includes(searchTerm.toLowerCase())
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
    const maxId = Math.max(...users.map((u) => u.id), 0);
    setUsers([...users, { ...newUser, id: maxId + 1 }]);
    setNewUser({
      id: 0,
      name: "",
      email: "",
      phone: "",
      grade: "",
      designation: "",
      cnic: "",
    });
    setIsAddModalOpen(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
    const newFilteredUsers = users
      .filter((u) => u.id !== id)
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.designation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const newTotalPages = Math.ceil(newFilteredUsers.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }
  };

  const getGradeBadgeVariant = (grade: string) => {
    switch (grade) {
      case "A":
        return "default";
      case "B":
        return "secondary";
      case "C":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage your organization's users and their information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Actions</CardTitle>
          <CardDescription>
            Find users by name, email, or designation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] z-[99999]">
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
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>
            {filteredUsers.length === 0
              ? "No users found"
              : `Showing ${Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredUsers.length
                )}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredUsers.length
                )} of ${filteredUsers.length} users`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No users found matching your search.
              </p>
            </div>
          ) : (
            <>
              <div className="w-full h-full rounded-xl border overflow-x-auto">
                <Table density="comfortable" className="w-full table-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>CNIC</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.cnic}
                        </TableCell>
                        <TableCell>{user.designation}</TableCell>
                        <TableCell>
                          <Badge variant={getGradeBadgeVariant(user.grade)}>
                            Grade {user.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-start gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              aria-label={`Edit ${user.name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive hover:text-destructive"
                              aria-label={`Delete ${user.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      aria-label="Previous page"
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
                      aria-label="Next page"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's information below.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserForm
              user={editingUser}
              onChange={setEditingUser}
              onSubmit={handleUpdateUser}
              onCancel={() => setIsEditModalOpen(false)}
              submitText="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Users;
