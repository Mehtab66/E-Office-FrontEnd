// import { useState, useEffect } from "react";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Switch } from "../../components/ui/switch";
// import { Textarea } from "../../components/ui/textarea";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../../components/ui/card";
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent,
// } from "../../components/ui/tabs";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../components/ui/avatar";
// import { Separator } from "../../components/ui/separator";
// import {
//   User,
//   Bell,
//   Mail,
//   Phone,
//   Building,
//   MapPin,
//   Camera,
// } from "lucide-react";

// import { useAuthStore } from "../../store/authStore";
// import apiClient from "../../apis/apiClient";

// export default function Settings() {
//   const { user } = useAuthStore();
//   const [profile, setProfile] = useState<any | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveError, setSaveError] = useState<string | null>(null);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   const [notifications, setNotifications] = useState({
//     emailNotifications: true,
//     weeklyReports: true,
//   });

//   // Fetch current logged-in user from MongoDB via /auth/me endpoint
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

//   // Handle save profile changes
//   const handleSaveProfile = async () => {
//     if (!profile || !profile._id) {
//       setSaveError("User ID not found");
//       return;
//     }

//     try {
//       setIsSaving(true);
//       setSaveError(null);
//       setSaveSuccess(false);

//       // Prepare update payload
//       const updateData = {
//         name: profile.name,
//         email: profile.email,
//         phone: profile.phone,
//         designation: profile.title,
//         department: profile.department,
//         location: profile.location,
//         bio: profile.bio,
//         avatar: profile.avatar,
//       };

//       // Update user via /api/users/:id endpoint
//       const response = await apiClient.put(`/api/users/${profile._id}`, updateData);

//       if (response.data) {
//         setSaveSuccess(true);
//         // Update profile with response data
//         const updatedData = response.data;
//         setProfile({
//           name: updatedData.name || profile.name,
//           email: updatedData.email || profile.email,
//           phone: updatedData.phone || profile.phone,
//           title: updatedData.designation || profile.title,
//           department: updatedData.department || profile.department,
//           location: updatedData.location || profile.location,
//           bio: updatedData.bio || profile.bio,
//           avatar: updatedData.avatar || profile.avatar,
//           _id: updatedData._id || profile._id,
//         });

//         // Clear success message after 3 seconds
//         setTimeout(() => setSaveSuccess(false), 3000);
//       }
//     } catch (err: any) {
//       console.error("Failed to save profile:", err);
//       setSaveError(err.response?.data?.message || "Failed to save profile changes");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Handle file upload for avatar
//   const handleAvatarUpload = (event: any) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result;
//         if (typeof result === "string") {
//           setProfile((p: any) => ({ ...(p || {}), avatar: result }));
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // If profile not loaded yet, show placeholders (but keep styling)
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

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
//         <p className="text-muted-foreground">Manage your account and system preferences</p>
//       </div>

//       <Tabs defaultValue="profile" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="profile" className="gap-2">
//             <User className="h-4 w-4" />
//             Profile
//           </TabsTrigger>
//           <TabsTrigger value="notifications" className="gap-2">
//             <Bell className="h-4 w-4" />
//             Notifications
//           </TabsTrigger>
//         </TabsList>

//         {/* Profile Settings */}
//         <TabsContent value="profile" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Profile Information</CardTitle>
//               <CardDescription>Update your personal information and profile details.</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Avatar Section */}
//               <div className="flex items-center gap-6">
//                 <Avatar className="h-20 w-20">
//                   <AvatarImage src={displayProfile.avatar || "/placeholder.svg"} alt={displayProfile.name} />
//                   <AvatarFallback className="text-lg">
//                     {(displayProfile.name || "").split(" ")
//                       .map((n: string) => n[0])
//                       .join("")
//                       .toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>

//                 {/* PERSON ICON added (keeps styling) */}
//                 <div className="flex items-center gap-2">
//                   <User className="h-6 w-6 text-muted-foreground" />
//                 </div>

//                 <div className="space-y-2">
//                   <label>
//                     <Button variant="outline" className="gap-2 bg-transparent">
//                       <Camera className="h-4 w-4" />
//                       Change Avatar
//                     </Button>
//                     <input type="file" accept="image/jpeg,image/gif,image/png" className="hidden" onChange={handleAvatarUpload} />
//                   </label>
//                   <p className="text-sm text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
//                 </div>
//               </div>

//               <Separator />

//               {/* Personal Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name</Label>
//                   <Input id="name" value={displayProfile.name} onChange={(e) => setProfile((p:any) => ({ ...(p || displayProfile), name: e.target.value }))} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Job Title</Label>
//                   <Input id="title" value={displayProfile.title} onChange={(e) => setProfile((p:any) => ({ ...(p || displayProfile), title: e.target.value }))} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                     <Input id="email" type="email" value={displayProfile.email} onChange={(e) => setProfile((p:any) => ({ ...(p || displayProfile), email: e.target.value }))} className="pl-10" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                     <Input id="phone" value={displayProfile.phone} onChange={(e) => setProfile((p:any) => ({ ...(p || displayProfile), phone: e.target.value }))} className="pl-10" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="department">Department</Label>
//                   <div className="relative">
//                     <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                     <Input id="department" value={displayProfile.department} onChange={(e) => setProfile((p:any) => ({ ...(p || displayProfile), department: e.target.value }))} className="pl-10" />
//                   </div>
//                 </div>

//               </div>

//               {/* <div className="space-y-2">
//                 <Label htmlFor="bio">Bio</Label>
//                 <Textarea id="bio" value={displayProfile.bio} onChange={(e) => setProfile((p:any) => ({ ...(p || displayProfile), bio: e.target.value }))} placeholder="Tell us about yourself..." className="min-h-[100px]" />
//               </div> */}

//               {saveError && (
//                 <div className="text-red-500 text-sm">{saveError}</div>
//               )}
//               {saveSuccess && (
//                 <div className="text-green-500 text-sm">Profile updated successfully!</div>
//               )}
//               {/* <div className="flex justify-end">
//                 <Button onClick={handleSaveProfile} disabled={isSaving || isLoading}>
//                   {isSaving ? "Saving..." : "Save Changes"}
//                 </Button>
//               </div> */}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Notifications Settings */}
//         <TabsContent value="notifications" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Notification Preferences</CardTitle>
//               <CardDescription>Choose how you want to be notified about updates and activities.</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <Label>Email Notifications</Label>
//                     <p className="text-sm text-muted-foreground">Receive notifications via email</p>
//                   </div>
//                   <Switch checked={notifications.emailNotifications} onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })} className="data-[state=checked]:bg-green-500" />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <Label>Weekly Reports</Label>
//                     <p className="text-sm text-muted-foreground">Get weekly summary reports</p>
//                   </div>
//                   <Switch checked={notifications.weeklyReports} onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })} className="data-[state=checked]:bg-green-500" />
//                 </div>
//               </div>
//               <div className="flex justify-end">
//                 <Button>Save Preferences</Button>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
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
  Camera,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import apiClient from "../../apis/apiClient";

export default function Settings() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch current logged-in user from MongoDB via /auth/me endpoint
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

  // Handle save profile changes
  const handleSaveProfile = async () => {
    if (!profile || !profile._id) {
      setSaveError("User ID not found");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Prepare update payload
      const updateData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        designation: profile.title,
        department: profile.department,
        location: profile.location,
        bio: profile.bio,
        avatar: profile.avatar,
      };

      // Update user via /api/users/:id endpoint
      const response = await apiClient.put(`/api/users/${profile._id}`, updateData);

      if (response.data) {
        setSaveSuccess(true);
        // Update profile with response data
        const updatedData = response.data;
        setProfile({
          name: updatedData.name || profile.name,
          email: updatedData.email || profile.email,
          phone: updatedData.phone || profile.phone,
          title: updatedData.designation || profile.title,
          department: updatedData.department || profile.department,
          location: updatedData.location || profile.location,
          bio: updatedData.bio || profile.bio,
          avatar: updatedData.avatar || profile.avatar,
          _id: updatedData._id || profile._id,
        });

        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      setSaveError(err.response?.data?.message || "Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle file upload for avatar
  const handleAvatarUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setProfile((p: any) => ({ ...(p || {}), avatar: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // If profile not loaded yet, show placeholders (but keep styling)
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

  return (
    <div className="space-y-6 container px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-slate-400">Manage your account and personal details</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-950/50 border border-slate-800 p-1 rounded-lg">
          <TabsTrigger
            value="profile"
            className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 hover:text-slate-200 transition-all"
          >
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-slate-400">Update your personal information and profile details.</CardDescription>
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

                {/* PERSON ICON added (keeps styling) */}
                <div className="flex items-center gap-2">
                  <User className="h-6 w-6 text-slate-500" />
                </div>

                <div className="space-y-2">
                  <label>
                    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-200 h-10 px-4 py-2 gap-2 cursor-pointer shadow-sm">
                      <Camera className="h-4 w-4 text-blue-400" />
                      Change Avatar
                    </div>
                    <input type="file" accept="image/jpeg,image/gif,image/png" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                  <p className="text-sm text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                  <Input
                    id="name"
                    value={displayProfile.name}
                    onChange={(e) => setProfile((p: any) => ({ ...(p || displayProfile), name: e.target.value }))}
                    className="bg-slate-950/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">Job Title</Label>
                  <Input
                    id="title"
                    value={displayProfile.title}
                    onChange={(e) => setProfile((p: any) => ({ ...(p || displayProfile), title: e.target.value }))}
                    className="bg-slate-950/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
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
                      onChange={(e) => setProfile((p: any) => ({ ...(p || displayProfile), email: e.target.value }))}
                      className="pl-10 bg-slate-950/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
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
                      onChange={(e) => setProfile((p: any) => ({ ...(p || displayProfile), phone: e.target.value }))}
                      className="pl-10 bg-slate-950/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
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
                      onChange={(e) => setProfile((p: any) => ({ ...(p || displayProfile), department: e.target.value }))}
                      className="pl-10 bg-slate-950/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={displayProfile.bio} onChange={(e) => setProfile((p:any) => ({ ...(p || displayProfile), bio: e.target.value }))} placeholder="Tell us about yourself..." className="min-h-[100px]" />
              </div> */}

              {saveError && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-900/50 p-3 rounded-md">{saveError}</div>
              )}
              {saveSuccess && (
                <div className="text-emerald-400 text-sm bg-emerald-900/20 border border-emerald-900/50 p-3 rounded-md">Profile updated successfully!</div>
              )}
              {/* <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSaving || isLoading}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}