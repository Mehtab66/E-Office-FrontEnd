// import { useState, useEffect } from "react";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Textarea } from "../../components/ui/textarea";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../../components/ui/card";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../components/ui/avatar";
// import { Separator } from "../../components/ui/separator";
// import {
//   User,
//   Mail,
//   Phone,
//   Building,
//   MapPin,
// } from "lucide-react";
// import { useAuthStore } from "../../store/authStore";
// import apiClient from "../../apis/apiClient";

// export default function EmployeeProfile() {
//   const { user } = useAuthStore();
//   const [profile, setProfile] = useState<any | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch current logged-in employee from MongoDB via /auth/me endpoint
//   useEffect(() => {
//     let mounted = true;
//     const fetchCurrentUser = async () => {
//       try {
//         setIsLoading(true);
//         // Use the /auth/me endpoint which gets the current logged-in user from JWT token
//         const response = await apiClient.get("/auth/me");
//         const userData = response.data;

//         if (!mounted) return;

//         if (userData) {
//           // Shape the data for the frontend fields
//           setProfile({
//             name: userData.name || "",
//             email: userData.email || "",
//             phone: userData.phone || "",
//             title: userData.designation || "",
//             department: userData.department || "",
//             location: userData.location || "",
//             bio: userData.bio || "",
//             avatar: userData.avatar || "",
//             _id: userData._id || userData.id,
//           });
//         } else {
//           // Fallback to basic placeholder profile
//           setProfile({
//             name: user?.name || "User",
//             email: user?.email || "",
//             phone: "",
//             title: "",
//             department: "",
//             location: "",
//             bio: "",
//             avatar: "",
//             _id: user?._id || "",
//           });
//         }
//       } catch (err: any) {
//         console.error("Could not load current user:", err);
//         if (mounted) {
//           // Fallback to user from auth store if available
//           setProfile({
//             name: user?.name || "User",
//             email: user?.email || "",
//             phone: (user as any)?.phone || "",
//             title: (user as any)?.designation || "",
//             department: (user as any)?.department || "",
//             location: "",
//             bio: "",
//             avatar: "",
//             _id: user?._id || "",
//           });
//         }
//       } finally {
//         if (mounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchCurrentUser();
//     return () => {
//       mounted = false;
//     };
//   }, [user]);

//   // If profile not loaded yet, show placeholders
//   const displayProfile = profile ?? {
//     name: "Loading...",
//     email: "",
//     phone: "",
//     title: "",
//     department: "",
//     location: "",
//     bio: "",
//     avatar: "",
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
//           <p className="text-muted-foreground">View your profile information</p>
//         </div>
//         <div className="flex items-center justify-center py-12">
//           <div className="text-muted-foreground">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
//         <p className="text-muted-foreground">View your profile information</p>
//       </div>

//       {/* Profile Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Profile Information</CardTitle>
//           <CardDescription>Your personal information and profile details.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Avatar Section */}
//           <div className="flex items-center gap-6">
//             <Avatar className="h-20 w-20">
//               <AvatarImage src={displayProfile.avatar || "/placeholder.svg"} alt={displayProfile.name} />
//               <AvatarFallback className="text-lg">
//                 {(displayProfile.name || "").split(" ")
//                   .map((n: string) => n[0])
//                   .join("")
//                   .toUpperCase()}
//               </AvatarFallback>
//             </Avatar>

//             {/* PERSON ICON */}
//             <div className="flex items-center gap-2">
//               <User className="h-6 w-6 text-muted-foreground" />
//             </div>
//           </div>

//           <Separator />

//           {/* Personal Information - Read Only */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input id="name" value={displayProfile.name} readOnly className="bg-muted/50 cursor-not-allowed" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="title">Job Title</Label>
//               <Input id="title" value={displayProfile.title} readOnly className="bg-muted/50 cursor-not-allowed" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email Address</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input id="email" type="email" value={displayProfile.email} readOnly className="pl-10 bg-muted/50 cursor-not-allowed" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone Number</Label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input id="phone" value={displayProfile.phone} readOnly className="pl-10 bg-muted/50 cursor-not-allowed" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="department">Department</Label>
//               <div className="relative">
//                 <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input id="department" value={displayProfile.department} readOnly className="pl-10 bg-muted/50 cursor-not-allowed" />
//               </div>
//             </div>

//           </div>

//           {/* <div className="space-y-2">
//             <Label htmlFor="bio">Bio</Label>
//             <Textarea id="bio" value={displayProfile.bio} readOnly placeholder="No bio available" className="min-h-[100px] bg-muted/50 cursor-not-allowed" />
//           </div> */}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import apiClient from "../../apis/apiClient";

export default function EmployeeProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current logged-in employee from MongoDB via /auth/me endpoint
  useEffect(() => {
    let mounted = true;
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        // Use the /auth/me endpoint which gets the current logged-in user from JWT token
        const response = await apiClient.get("/auth/me");
        const userData = response.data;

        if (!mounted) return;

        if (userData) {
          // Shape the data for the frontend fields
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            title: userData.designation || "",
            department: userData.department || "",
            location: userData.location || "",
            bio: userData.bio || "",
            avatar: userData.avatar || "",
            _id: userData._id || userData.id,
          });
        } else {
          // Fallback to basic placeholder profile
          setProfile({
            name: user?.name || "User",
            email: user?.email || "",
            phone: "",
            title: "",
            department: "",
            location: "",
            bio: "",
            avatar: "",
            _id: user?._id || "",
          });
        }
      } catch (err: any) {
        console.error("Could not load current user:", err);
        if (mounted) {
          // Fallback to user from auth store if available
          setProfile({
            name: user?.name || "User",
            email: user?.email || "",
            phone: (user as any)?.phone || "",
            title: (user as any)?.designation || "",
            department: (user as any)?.department || "",
            location: "",
            bio: "",
            avatar: "",
            _id: user?._id || "",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCurrentUser();
    return () => {
      mounted = false;
    };
  }, [user]);

  // If profile not loaded yet, show placeholders
  const displayProfile = profile ?? {
    name: "Loading...",
    email: "",
    phone: "",
    title: "",
    department: "",
    location: "",
    bio: "",
    avatar: "",
  };

  if (isLoading) {
    return (
      <div className="space-y-6 container px-4 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
          <p className="text-slate-400">View your profile information</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    // THEME CONTAINER
    <div className="space-y-6 container px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
        <p className="text-slate-400">View your profile information</p>
      </div>

      {/* Profile Information */}
      <Card className="bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription className="text-slate-400">Your personal information and profile details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 ring-2 ring-slate-700 shadow-lg">
              <AvatarImage src={displayProfile.avatar || "/placeholder.svg"} alt={displayProfile.name} />
              <AvatarFallback className="text-lg bg-slate-800 text-slate-200">
                {(displayProfile.name || "").split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* PERSON ICON */}
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-slate-500" />
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Personal Information - Read Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Full Name</Label>
              <Input
                id="name"
                value={displayProfile.name}
                readOnly
                className="bg-slate-950/50 border-slate-700 text-slate-400 cursor-not-allowed focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">Job Title</Label>
              <Input
                id="title"
                value={displayProfile.title}
                readOnly
                className="bg-slate-950/50 border-slate-700 text-slate-400 cursor-not-allowed focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={displayProfile.email}
                  readOnly
                  className="pl-10 bg-slate-950/50 border-slate-700 text-slate-400 cursor-not-allowed focus:ring-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                <Input
                  id="phone"
                  value={displayProfile.phone}
                  readOnly
                  className="pl-10 bg-slate-950/50 border-slate-700 text-slate-400 cursor-not-allowed focus:ring-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-slate-300">Department</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                <Input
                  id="department"
                  value={displayProfile.department}
                  readOnly
                  className="pl-10 bg-slate-950/50 border-slate-700 text-slate-400 cursor-not-allowed focus:ring-0"
                />
              </div>
            </div>

          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="bio" className="text-slate-300">Bio</Label>
            <Textarea id="bio" value={displayProfile.bio} readOnly placeholder="No bio available" className="min-h-[100px] bg-slate-950/50 border-slate-700 text-slate-400 cursor-not-allowed focus:ring-0" />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}