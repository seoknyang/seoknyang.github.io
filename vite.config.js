import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages는 /blog/글주소 같은 경로를 직접 열면 404.html을 준다.
// index.html을 404.html로도 복사해 두면 그 경로에서도 앱이 떠서 라우터가 화면을 그린다.
const spaFallback = {
  name: 'spa-fallback-404',
  apply: 'build',
  closeBundle() {
    const dist = resolve('dist')
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    spaFallback,
  ],
  base: '/',
})
