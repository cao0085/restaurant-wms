import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/restaurant-wms/',
  server: {
    host: '0.0.0.0',  // 設置主機為 '0.0.0.0' 以便在局域網中可訪問
    port: 5000,       // 更改端口為 3000
  },
});
