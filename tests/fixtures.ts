import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ReservationPage } from '../pages/ReservationPage';

/**
 * Fixtures propios: cada test recibe las páginas ya creadas, sin repetir el "new HomePage(page)".
 * Cumplen el rol de los custom commands de Cypress: encapsulan los pasos que se repiten.
 */
export const test = base.extend<{ home: HomePage; reserva: ReservationPage }>({
  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  reserva: async ({ page }, use) => {
    await use(new ReservationPage(page));
  },
});

export { expect } from '@playwright/test';
