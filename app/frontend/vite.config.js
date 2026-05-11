import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    server: {
      proxy: {
        '/api': {
          target:
            env.VITE_ENV === 'prod'
              ? env.VITE_BACKEND_LINK
              : 'http://localhost:4000',

          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})