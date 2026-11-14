import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Change `base` if the app is deployed under a sub-path (e.g. '/starman/').
  base: '/',
});
