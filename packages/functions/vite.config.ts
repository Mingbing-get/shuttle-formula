import { defineConfig } from 'vite'

import createWebViteConfig from '../../vite.config'

export default defineConfig(createWebViteConfig('functions', __dirname))
