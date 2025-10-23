// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react";
// // import tailwindcss from "@tailwindcss/vite";

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react(), tailwindcss()],
// // });
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// // https://vite._dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
  
//   // ADD THIS 'server' SECTION
//   server: {
//     port: 5173, // Your frontend port
//     proxy: {
//       // Proxy all requests starting with /api
//       '/api': {
//         // Send them to your backend server at port 3000
//         target: 'http://localhost:3000', // <-- YOUR BACKEND PORT
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // This rule is for your main API
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // ADD THIS NEW RULE for auth
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});