import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './',
  build:{
    outDir: 'oog126_ad',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 👈 关键
    }
  },
  server: {
    host: true,      // ✅ 关键：true 表示监听所有网络接口，包括局域网IP
  }
})