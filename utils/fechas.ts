/**
 * Fechas para una estadía de 2 noches en el futuro, distintas en cada corrida.
 *
 * Por qué: la app rechaza una reserva si la habitación ya está ocupada esas noches (HTTP 409),
 * y el sitio es compartido por todos los que lo usan. Con fechas fijas, la segunda corrida
 * fallaría por la reserva de la primera; con fechas al azar cada test es independiente.
 */
export function estadiaLibre() {
  const checkin = new Date();
  // Entre 1 y 2 años hacia adelante, para no chocar con reservas de prueba de otras personas.
  checkin.setDate(checkin.getDate() + 365 + Math.floor(Math.random() * 365));
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + 2);
  return { checkin, checkout, noches: 2 };
}

/** Formato del selector de fechas de la home: la app lo fija en inglés británico (en-GB), DD/MM/YYYY. */
export function formatoSelector(fecha: Date) {
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${dd}/${mm}/${fecha.getFullYear()}`;
}

/** Formato que usa la app en la URL y en la confirmación de la reserva: YYYY-MM-DD. */
export function formatoISO(fecha: Date) {
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mm}-${dd}`;
}
