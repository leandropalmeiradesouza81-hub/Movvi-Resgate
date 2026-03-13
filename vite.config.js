import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        client: resolve(__dirname, 'client.html'),
        driver: resolve(__dirname, 'driver.html'),
        admin: resolve(__dirname, 'admin.html'),
        invite: resolve(__dirname, 'driver-invite.html'),
        convite: resolve(__dirname, 'convite/index.html'),
        negocios: resolve(__dirname, 'modelo-de-negocio.html'),
        parcerias: resolve(__dirname, 'parcerias.html'),
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://127.0.0.1:3001',
        ws: true
      }
    }
  }
});
