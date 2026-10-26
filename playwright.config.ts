import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Shady Meadows es un demo público compartido: un reintento en CI absorbe cortes momentáneos del sitio.
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',
  use: {
    baseURL: 'https://automationintesting.online',
    // El formulario de contacto usa data-testid (el atributo por defecto de Playwright).
    // El selector de fechas toma el formato del idioma del navegador: lo fijamos para que sea MM/DD/YYYY en cualquier máquina.
    locale: 'en-US',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
