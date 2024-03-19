import { defineConfig } from 'vite'

const react = require('@vitejs/plugin-react')
const vue = require('@vitejs/plugin-vue')

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [react(), vue()],
    }
  }

  return {}
})
