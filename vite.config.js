import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  server: { proxy: { '/socket.io': { target: 'ws://localhost:3001', ws: true } } },
  optimizeDeps: {
    include: ['@yjs/dom'],
  },
  test: {
    environment: 'happy-dom', // or 'jsdom', 'node'
    exclude: [...configDefaults.exclude, 'src/server/*'],
    browser: {
      enabled: true,
      headless: true,
      provider: 'webdriverio',
      logHeapUsage: true,
    },
  },
})