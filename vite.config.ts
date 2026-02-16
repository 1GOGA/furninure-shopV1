import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Для GitHub Pages: репозиторий "furninure-shopV1"
  // сайт будет доступен по адресу /furninure-shopV1/.
  base: '/furninure-shopV1/',
})
