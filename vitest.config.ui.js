import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom', // or 'jsdom', 'node'
    //exclude: [...configDefaults.exclude, fileURLToPath(new URL('./src/server/*', import.meta.url))],
    browser: {
      enabled: true,
      headless: true,
      provider: 'webdriverio',
      logHeapUsage: true,
    },
  },
})