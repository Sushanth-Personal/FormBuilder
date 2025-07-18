import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 4173, // Bind to the Render-provided port, fallback to 4173
    host: true, // Expose the app to external IPs
  },
  build: {
    outDir: 'dist', // Ensure that build output goes into the 'dist' folder
  },
});