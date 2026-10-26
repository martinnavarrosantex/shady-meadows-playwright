import { test, expect } from './fixtures';
import datos from '../fixtures/datos.json';
import { estadiaLibre, formatoISO } from '../utils/fechas';

test.describe('Reserva de habitación', () => {
  let checkin: string;
  let checkout: string;

  // Cada test busca sus propias fechas y entra a la habitación desde la home, así no depende de otro test.
  test.beforeEach(async ({ home, page }) => {
    const estadia = estadiaLibre();
    checkin = formatoISO(estadia.checkin);
    checkout = formatoISO(estadia.checkout);

    await home.abrir();
    // 3.1 paso 1: la home muestra habitaciones disponibles.
    await expect(home.habitaciones.first()).toBeVisible();
    await home.buscarDisponibilidad(estadia.checkin, estadia.checkout);
    await home.reservarPrimeraHabitacion();
    // El link de la tarjeta tiene que llevar las fechas buscadas; si no, la reserva saldría con otras.
    await expect(page).toHaveURL(new RegExp(`/reservation/\\d+\\?checkin=${checkin}&checkout=${checkout}`));
  });

  test('3.1 reserva exitosa como usuario invitado', async ({ reserva, page }) => {
    await reserva.abrirFormulario.click();
    await reserva.completar(datos.huesped);
    const respuesta = await reserva.confirmar();

    // La API tiene que crear la reserva (201) y la pantalla mostrar la confirmación con las mismas fechas.
    expect(respuesta.status()).toBe(201);
    await expect(reserva.confirmacion).toBeVisible();
    await expect(page.getByText(`${checkin} - ${checkout}`)).toBeVisible();
  });

  test('3.2 el formulario vacío muestra errores y no reserva', async ({ reserva }) => {
    await reserva.abrirFormulario.click();
    const respuesta = await reserva.confirmar();

    // Sin datos, la API rechaza la reserva con 400...
    expect(respuesta.status()).toBe(400);
    // ...la pantalla lista los errores de los campos obligatorios...
    for (const error of datos.erroresReservaVacia) {
      await expect(reserva.errores).toContainText(error);
    }
    // ...y no aparece la confirmación: el huésped sigue en el formulario.
    await expect(reserva.confirmacion).toHaveCount(0);
    await expect(reserva.formulario.nombre).toBeVisible();
  });
});

test.describe('Contacto', () => {
  test('3.3 enviar un mensaje con datos válidos muestra la confirmación', async ({ home }) => {
    await home.abrir();
    await home.enviarContacto(datos.contacto);

    // La confirmación saluda por nombre y repite el asunto del mensaje.
    await expect(home.confirmacionContacto).toHaveText(`Thanks for getting in touch ${datos.contacto.nombre}!`);
    await expect(home.confirmacionContacto.locator('..')).toContainText(datos.contacto.asunto);
  });
});
