import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En GitHub Pages la web se sirve en /halo/; en local, en la raíz.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/halo/' : '/',
}));
