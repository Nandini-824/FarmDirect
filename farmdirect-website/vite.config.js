import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 Make sure this import is here

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 Make sure this is added to the plugins array
  ],
})