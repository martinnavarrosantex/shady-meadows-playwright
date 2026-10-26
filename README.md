# Challenge final · Shady Meadows B&B con Playwright

Trabajo final del path QA (Cohorte I · 2026) sobre [Shady Meadows B&B](https://automationintesting.online/), el sistema de reservas de práctica de restful-booker-platform.

La consigna pide Cypress; el proyecto está hecho con **Playwright + TypeScript**, la herramienta que se usa en todo el path. Cada pedido de la consigna tiene su equivalente:

| Consigna (Cypress) | En este proyecto (Playwright) |
|---|---|
| `myTestRestfulBooker.cy.js` | [`tests/myTestRestfulBooker.spec.ts`](tests/myTestRestfulBooker.spec.ts) |
| `cypress/e2e/` | `tests/` |
| `cypress/fixtures/` | [`fixtures/datos.json`](fixtures/datos.json): datos del huésped, del contacto y errores esperados |
| Custom commands | [`tests/fixtures.ts`](tests/fixtures.ts) y [`pages/`](pages): cada test recibe las páginas listas y reutiliza sus pasos |

## Entregables

- **Casos de prueba:** [`docs/casos-de-prueba.xlsx`](docs/casos-de-prueba.xlsx): 19 casos positivos, negativos y de borde, ejecutados el 26/10/2026.
- **Tablero de bugs en Trello:** https://trello.com/b/hN3OMWGT: 9 bugs con pasos, resultado esperado y actual, severidad, prioridad y captura.
- **Automatización:** los 3 flujos del punto 3 de la consigna.

## Integrantes

- Martin Navarro · martin.navarro@santexgroup.com

## Flujos automatizados

| Test | Flujo | Qué valida |
|---|---|---|
| 3.1 | Reserva exitosa como invitado | La home muestra habitaciones, el link "Book now" lleva las fechas buscadas, la API responde 201 y aparece "Booking Confirmed" con esas fechas |
| 3.2 | Formulario de reserva vacío | La API responde 400, se listan los errores de los campos obligatorios y no aparece la confirmación |
| 3.3 | Formulario de contacto | Aparece "Thanks for getting in touch &lt;nombre&gt;!" con el asunto enviado |

Cada test es independiente: los de reserva buscan fechas al azar entre 1 y 2 años hacia adelante, porque el sitio es compartido y rechaza una habitación ya ocupada (409).

## Cómo correrlo

Requiere Node 18 o superior.

```bash
npm install
npx playwright install chromium
npx playwright test
npx playwright show-report
```

## Estado actual

Al 26/10/2026 la página de cada habitación (`/reservation/:id`) no carga: `GET /api/room/:id` responde 500 y la pantalla queda con un spinner (BUG-01 en Trello). Mientras siga así, los tests 3.1 y 3.2 fallan en el primer paso dentro de la habitación; el 3.3 pasa.
