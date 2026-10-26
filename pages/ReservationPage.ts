import { type Page, type Locator } from '@playwright/test';

/** Página de una habitación (/reservation/:id): calendario, formulario del huésped y confirmación. */
export class ReservationPage {
  readonly abrirFormulario: Locator;
  readonly formulario: {
    nombre: Locator;
    apellido: Locator;
    email: Locator;
    telefono: Locator;
  };
  readonly reservar: Locator;
  readonly errores: Locator;
  readonly confirmacion: Locator;

  constructor(private readonly page: Page) {
    // Antes de abrir el formulario hay un único "Reserve Now" (con id); después aparece otro con el mismo texto
    // que es el que confirma. Por eso el primero se ubica por id y el segundo por rol dentro del formulario.
    this.abrirFormulario = page.locator('#doReservation');
    this.formulario = {
      nombre: page.getByPlaceholder('Firstname'),
      apellido: page.getByPlaceholder('Lastname'),
      email: page.getByPlaceholder('Email'),
      telefono: page.getByPlaceholder('Phone'),
    };
    this.reservar = page.locator('form').getByRole('button', { name: 'Reserve Now' });
    this.errores = page.getByRole('alert');
    this.confirmacion = page.getByRole('heading', { name: 'Booking Confirmed' });
  }

  async completar(datos: { nombre: string; apellido: string; email: string; telefono: string }) {
    await this.formulario.nombre.fill(datos.nombre);
    await this.formulario.apellido.fill(datos.apellido);
    await this.formulario.email.fill(datos.email);
    await this.formulario.telefono.fill(datos.telefono);
  }

  /** Confirma la reserva y devuelve la respuesta del POST /api/booking, para validar también la API. */
  async confirmar() {
    const respuesta = this.page.waitForResponse(
      (r) => r.url().endsWith('/api/booking') && r.request().method() === 'POST',
    );
    await this.reservar.click();
    return respuesta;
  }
}
