import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

import createWebViteConfig from '../../vite.config'

export default defineConfig(
  createWebViteConfig('render-vue', __dirname, [vue() as Plugin]),
)
