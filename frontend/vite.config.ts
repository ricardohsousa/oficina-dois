import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/health': 'http://localhost:3000',
      '/voluntarios': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass(req) {
          // Deixa o Vite lidar com navegação do browser (HTML); só proxia fetch/XHR (JSON)
          const accept = req.headers['accept'] ?? '';
          if (accept.includes('text/html')) {
            return req.url ?? '/';
          }
        }
      }
    }
  }
});
