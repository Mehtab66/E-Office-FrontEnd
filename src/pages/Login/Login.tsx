// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
// import { useAuthLogin } from "../../hooks/useAuth";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const { mutate: login, isPending } = useAuthLogin();
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     login(
//       { email, password },
//       {
//         onSuccess: (data) => {
//           console.log("Login successful - Full response:", data);
//           console.log("User role:", data.user.role);
//           console.log("Role lowercase:", data.user.role.toLowerCase());

//           switch (data.user.role.toLowerCase()) {
//             case "admin":
//               console.log("Navigating to admin dashboard");
//               navigate("/admin");
//               break;
//             case "manager":
//               console.log("Navigating to manager dashboard");
//               navigate("/manager");
//               break;
//             case "employee":
//               console.log("Navigating to employee dashboard");
//               navigate("/employee");
//               break;
//             default:
//               console.log("Navigating to employee dashboard");
//               navigate("/login");
//           }
//         },
//       }
//     );
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
//       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

//       <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
//         <CardHeader className="space-y-4 text-center pb-8">
//           <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
//             <Lock className="w-8 h-8 text-primary" />
//           </div>
//           <CardTitle className="text-3xl font-bold text-balance">
//             Welcome Back
//           </CardTitle>
//           <CardDescription className="text-base text-muted-foreground">
//             Sign in to your account to continue
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <form onSubmit={handleLogin} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium">
//                 Email Address
//               </Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-10 h-12 bg-input border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-sm font-medium">
//                 Password
//               </Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="pl-10 pr-10 h-12 bg-input border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-4 h-4" />
//                   ) : (
//                     <Eye className="w-4 h-4" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base transition-all duration-200 group"
//               disabled={isPending}
//             >
//               {isPending ? (
//                 <div className="flex items-center space-x-2">
//                   <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
//                   <span>Signing in...</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-2">
//                   <span>Sign In</span>
//                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </div>
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthLogin } from "../../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useAuthLogin();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: (data) => {
          console.log("Login successful - Full response:", data);
          console.log("User role:", data.user.role);
          console.log("Role lowercase:", data.user.role.toLowerCase());

          switch (data.user.role.toLowerCase()) {
            case "admin":
              console.log("Navigating to admin dashboard");
              navigate("/admin");
              break;
            case "manager":
              console.log("Navigating to manager dashboard");
              navigate("/manager");
              break;
            case "employee":
              console.log("Navigating to employee dashboard");
              navigate("/employee");
              break;
            default:
              console.log("Navigating to employee dashboard");
              navigate("/login");
          }
        },
      }
    );
  };

  return (
    // BACKGROUND UPDATE: "Digital Horizon" 3D Professional Theme
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">

      {/* 1. Deep Space Base */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* 2. The Horizon Glow (Center light source) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-900/20 rounded-[100%] blur-[100px] pointer-events-none" />

      {/* 3. 3D Perspective Grid (The Floor) */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:linear-gradient(to_bottom,transparent_40%,#000_100%)] pointer-events-none opacity-40"
        style={{ transform: "perspective(1000px) rotateX(20deg) scale(1.2)" }}
      />

      {/* 4. Abstract Geometric Shapes (Subtle structure) */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* =====================================================================================
          THE CARD (UNCHANGED from Professional Version)
         ===================================================================================== */}
      <Card className="w-full max-w-md relative z-10 border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-2xl shadow-black/50">
        <CardHeader className="space-y-4 text-center pb-8 border-b border-slate-800/50">
          {/* Icon Container - Clean Blue */}
          <div className="mx-auto w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-2 border border-blue-900/50">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight text-white">
              E-Office Portal
            </CardTitle>
            <CardDescription className="text-slate-400">
              Secure access for employees and management
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-8">
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                Work Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-slate-950 border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 rounded-md"
                  placeholder="employee@organization.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-slate-950 border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 rounded-md"
                  placeholder="Enter your secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Standard Primary Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 rounded-md shadow-lg shadow-blue-900/20"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer / Legal Text */}
      <div className="absolute bottom-6 text-center text-xs text-slate-600">
        <p>&copy; 2025 E-Office Management System. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Login;