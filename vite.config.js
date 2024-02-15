import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import http from "https";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 8080,
//     proxy: {
//       "/ecommerce": {
//         target: "https://devcombackend-33y7.onrender.com/api/v1",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/users": {
//         target: "https://devcombackend-33y7.onrender.com/api/v1",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });

// export default defineConfig(({ mode }) => {
//   return {
//     plugins: [react()],
//     server: {
//       server: {
//         port: 8080,
//         proxy: {
//           "/ecommerce": {
//             target: "https://devcombackend-33y7.onrender.com/api/v1",
//             changeOrigin: true,
//             secure: false,
//             agent: new http.Agent(),
//           },
//           "/users": {
//             target: "https://devcombackend-33y7.onrender.com/api/v1",
//             changeOrigin: true,
//             secure: false,
//             agent: new http.Agent(),
//           },
//         },
//       },
//     },
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "./src"),
//       },
//     },
//   };
// });
