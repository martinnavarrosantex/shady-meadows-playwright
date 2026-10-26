import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Shady Meadows es un demo público compartido: un reintento en CI absorbe cortes momentáneos del sitio.
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',
  use: {
    baseURL: 'https://automationintesting.online',
    // El formulario de contacto usa data-testid (el atributo por defecto de Playwright).
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
