import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    port: 3000,
  },
  plugins: [react()],
});
