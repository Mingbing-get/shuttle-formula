import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import createWebViteConfig from '../../vite.config'

export default defineConfig(
  createWebViteConfig('render-react', __dirname, [react()]),
)
