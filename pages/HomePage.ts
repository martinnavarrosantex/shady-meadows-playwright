import { type Page, type Locator } from '@playwright/test';
import { formatoSelector } from '../utils/fechas';

/** Página principal: buscador de disponibilidad, tarjetas de habitaciones y formulario de contacto. */
export class HomePage {
  readonly habitaciones: Locator;
  readonly checkin: Locator;
  readonly checkout: Locator;
  readonly contacto: {
    nombre: Locator;
    email: Locator;
    telefono: Locator;
    asunto: Locator;
    mensaje: Locator;
    enviar: Locator;
  };
  readonly confirmacionContacto: Locator;

  constructor(private readonly page: Page) {
    // Cada habitación es una tarjeta con su botón "Book now".
    this.habitaciones = page.locator('.room-card');
    // Los selectores de fecha no tienen label asociado: los ubicamos por el título que tienen arriba.
    this.checkin = page.locator('div:has(> label:text-is("Check In")) input');
    this.checkout = page.locator('div:has(> label:text-is("Check Out")) input');
    this.contacto = {
      nombre: page.getByTestId('ContactName'),
      email: page.getByTestId('ContactEmail'),
      telefono: page.getByTestId('ContactPhone'),
      asunto: page.getByTestId('ContactSubject'),
      mensaje: page.getByTestId('ContactDescription'),
      enviar: page.getByRole('button', { name: 'Submit' }),
    };
    this.confirmacionContacto = page.getByRole('heading', { name: /Thanks for getting in touch/ });
  }

  async abrir() {
    await this.page.goto('/');
  }

  /** Busca disponibilidad para las fechas dadas, como lo haría un huésped desde la home. */
  async buscarDisponibilidad(checkin: Date, checkout: Date) {
    await this.checkin.fill(formatoSelector(checkin));
    await this.checkin.press('Escape');
    await this.checkout.fill(formatoSelector(checkout));
    await this.checkout.press('Escape');
    await this.page.getByRole('button', { name: 'Check Availability' }).click();
  }

  /** Entra a reservar la primera habitación disponible; el link lleva las fechas buscadas. */
  async reservarPrimeraHabitacion() {
    await this.habitaciones.first().getByRole('link', { name: 'Book now' }).click();
  }

  async enviarContacto(datos: { nombre: string; email: string; telefono: string; asunto: string; mensaje: string }) {
    await this.contacto.nombre.fill(datos.nombre);
    await this.contacto.email.fill(datos.email);
    await this.contacto.telefono.fill(datos.telefono);
    await this.contacto.asunto.fill(datos.asunto);
    await this.contacto.mensaje.fill(datos.mensaje);
    await this.contacto.enviar.click();
  }
}
