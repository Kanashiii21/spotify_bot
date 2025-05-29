import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Configure Electron-specific settings
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // Prevent dev server from opening browser automatically
  server: {
    open: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    exclude: ['electron'],
  },
});