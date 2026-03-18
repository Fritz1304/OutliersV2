import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig({
  base:"/OutliersV2/",
  plugins: [
    react(),
    tailwindcss(),
    glsl(),
  ],
})
