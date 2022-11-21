import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({  
  
  base: process.env.NODE_ENV === 'production'
  ? './' // prod
  : '/', // dev
  plugins: [
    vue()
  ],
  resolve:{
    alias: {
      "@": path.resolve(__dirname, "src"),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/assets/styles/settings/_variables.scss";
          @import "./src/assets/styles/tools/_mixins.scss";          
        `
      }
    }
  },
  build:{
    target: "ES2020",
    outDir: 'dist', 
    assetsDir: 'assets',
  },
  optimizeDeps: {
    esbuildOptions: { target: "es2020", supported: { bigint: true } },
  },
})
