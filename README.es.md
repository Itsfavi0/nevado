# Nevado: expediciones de trekking en los Andes, con la precisión de una carta topográfica

[English](README.md) · **Español**

**Demo en vivo:** [nevado-nine.vercel.app](https://nevado-nine.vercel.app/)

![Captura de la página de Nevado](docs/screenshot.png)

**Nevado** es la página web de una operadora de trekking **ficticia** con base en Huaraz que también opera rutas en Cusco. El objetivo de la página es que el visitante explore las rutas, entienda su dificultad y **pida una cotización o reserve**.

> Proyecto de portafolio de Favio ([@Itsfavi0](https://github.com/Itsfavi0)). La empresa, los guías y los testimonios son inventados. Las rutas y los lugares son reales, pero las distancias, altitudes y precios son aproximados.

## Qué mirar primero

1. **El perfil de elevación**. Cada ruta tiene su perfil dibujado en SVG a partir de datos `[km, altitud]`. La línea se traza cuando entra en pantalla. En las tarjetas **todas comparten la misma escala vertical**, así se compara de un vistazo la altura de Laguna 69 con la de Ausangate.
2. **El explorador de rutas** (`#rutas`). Filtra por región, dificultad y duración. Si ninguna ruta coincide, sugiere qué filtro quitar y cuántas rutas aparecerían.
3. **El detalle de ruta**. Es un modal accesible con `<dialog>` nativo: muestra el itinerario día por día, los campamentos, la temporada mes a mes y qué incluye. Abre desde el botón pulsado, atrapa el foco, se cierra con Esc y devuelve el foco al botón.
4. **El cotizador** (`#cotizar`). Eliges ruta, mes (la temporada seca va destacada y los meses sin salidas aparecen bloqueados), personas y extras, y ves el precio en S/ y USD con su desglose. "Pedir esta cotización" rellena el formulario de contacto con un resumen.

## Secciones

| Sección | Qué hace |
|---|---|
| Hero | Titular, CTA y una foto con el perfil de Santa Cruz encima |
| Por qué Nevado | Cuatro compromisos concretos: grupos de 8, aclimatación, seguridad medible y turismo responsable |
| Explorador de rutas | 8 rutas con filtros, perfil, datos técnicos y precio |
| Cómo funciona | Línea de tiempo en cuatro etapas, de la reserva al día 1 |
| Cotizador | Precio estimado con desglose y paso directo al formulario |
| Guías | Equipo ficticio, sin fotos de personas reales |
| Testimonios | Un testimonio destacado y dos secundarios |
| Preparación y FAQ | Tabla de oxígeno disponible según la altitud, preguntas frecuentes (`<details>`) y lista de equipo |
| Contacto | Formulario con validación accesible y confirmación en la página |

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4** (tokens en `@theme`, dentro de `src/index.css`)
- **oxlint** con los plugins `react` y `jsx-a11y`
- Fuentes autoalojadas con Fontsource: **Archivo** (variable, con eje de anchura), **Public Sans** e **IBM Plex Mono**
- Sin librerías de animación ni de componentes

## Cómo ejecutarlo

Requiere Node 20.19 o superior (lo pide Vite 8).

```bash
npm install
npm run dev      # http://localhost:5175
npm run build    # genera dist/
npm run lint
npm run preview  # sirve dist/ en http://localhost:5175
```

## Estructura

```
nevado/
├─ public/
│  ├─ images/          fotos de Unsplash recomprimidas a WebP
│  ├─ topo.svg         curvas de nivel generadas (ver scripts/)
│  ├─ favicon.svg
│  └─ og-image.jpg
├─ scripts/
│  └─ make_topo.py     genera topo.svg (marching squares sobre un terreno sintético)
├─ src/
│  ├─ data/routes.js   las 8 rutas: perfil, itinerario, temporada y precio
│  ├─ lib/quote.js     lógica del cotizador (funciones puras)
│  ├─ hooks/           useInView, useElementWidth
│  ├─ components/
│  │  ├─ routes/       RouteExplorer, RouteCard, RouteDialog, RouteFacts
│  │  ├─ ElevationProfile.jsx
│  │  ├─ QuoteCalculator.jsx
│  │  └─ …             una sección por archivo
│  ├─ App.jsx          orden de secciones y estado compartido (ruta a cotizar, datos para el formulario)
│  └─ index.css        tokens de diseño y estilos base
└─ docs/screenshot.png
```

## Decisiones de diseño

- **Concepto: "carta topográfica luminosa".** Fondo blanco nieve, fotos grandes y datos técnicos con precisión de mapa. La parte más llamativa es el perfil de elevación, y el resto del diseño se mantiene sobrio para no competir con él.
- **Paleta de alta montaña**:

  | Token | Color | Uso |
  |---|---|---|
  | `snow` | `#F6F8F9` | fondo |
  | `granite` | `#1C2629` | texto y secciones oscuras |
  | `rock` | `#56656B` | texto secundario (5.7:1) |
  | `lagoon` | `#0A6E78` | enlaces, botones secundarios, perfiles (6:1 con blanco) |
  | `flare` | `#F07A2A` | CTA, con texto granito (5.5:1) |
  | `flare-deep` | `#B44A0C` | naranja como texto sobre claro (5:1) |

- **Tipografía.** Archivo con eje de anchura (`font-stretch` 64–80 %) para los titulares: es una grotesca condensada que recuerda a la señalética de montaña. Public Sans para leer e IBM Plex Mono solo para datos técnicos (km, m, S/).
- **Curvas de nivel reales.** `topo.svg` no es un dibujo a mano: es la salida de `scripts/make_topo.py`, que traza contornos sobre un terreno sintético y engrosa una de cada cinco curvas, como en una carta del IGN. Se aplica con `mask-image`, así que su color se controla desde CSS.
- **Sin fotos de personas para los guías.** Cada guía se presenta con sus iniciales sobre una textura topográfica, en vez de usar fotos de stock que pasarían por gente real.
- **Fotos con respaldo.** Si una foto no carga, `Photo.jsx` muestra el fondo topográfico del mismo tamaño. Choquequirao no tiene foto a propósito, para que el respaldo se vea funcionando.
- **Números en estilo RAE.** `4750 m` sin separador y `12.500` con punto (`Intl.NumberFormat('es-ES')`).

## Decisiones técnicas

- **`<dialog>` nativo para el modal.** `showModal()` vuelve inerte el resto de la página, atrapa el foco y cierra con Esc sin tener que escribir un focus-trap a mano. Intercepto el evento `cancel` para animar la salida, y el `transform-origin` se calcula desde el botón que lo abrió.
- **El perfil mide su ancho real** (`ResizeObserver`). Así el `viewBox` coincide con los píxeles, el trazo no se deforma y la animación de `stroke-dashoffset` funciona en cualquier tamaño. La curva es monótona (Fritsch–Carlson) para que no aparezcan "picos fantasma" por encima de la altitud real.
- **Sin Motion ni GSAP.** Todo el movimiento cabe en CSS (`transform` y `opacity`) más `IntersectionObserver`. Así se evitan decenas de KB de JavaScript.
- **Cotizador como funciones puras** (`lib/quote.js`): temporada, descuento por grupo, extras por día y conversión a USD. Así es fácil de leer y de probar.
- **Estilos base fuera de `@layer`**: el fondo, el color y la tipografía del `body` están fuera de las capas de Tailwind. Los estilos sin capa siempre le ganan a los que están en una, así que si quien aloja la página inyecta su propio `body { font: 14px … }` (pasa al incrustarla en visores o previsualizaciones), la página conserva su tipografía y su fondo.
- **Estado compartido mínimo en `App.jsx`**: qué ruta está en el cotizador y qué datos rellenan el formulario. El formulario se monta de nuevo con un `key` cuando llega una cotización nueva, en vez de sincronizar estados.

## Accesibilidad

- HTML semántico, un solo `h1`, encabezados en orden y enlace "Saltar al contenido".
- Contraste AA verificado en todos los pares de color (el más justo es 5:1).
- Foco visible en todo. Filtros con `aria-pressed` y contador de resultados con `aria-live`. Cuando un botón desaparece al pulsarlo, el foco pasa al contador.
- Modal con foco atrapado, cierre con Esc o con el botón, y devolución del foco.
- Formulario con `label` visibles, `aria-invalid` y errores junto a cada campo enlazados con `aria-describedby`. Al enviar, el foco va al primer campo con error, o al mensaje de confirmación si todo está bien.
- Los perfiles SVG tienen un resumen en texto para lectores de pantalla ("50 km, punto más alto 4750 m en Punta Unión").
- Objetivos táctiles de 44 px como mínimo y `prefers-reduced-motion` respetado (sin trazos animados ni revelaciones).

## Rendimiento

- Las 10 fotos pesan ≈ 620 KB en total (WebP), con `width`/`height`, `loading="lazy"` debajo del pliegue y la del hero con `preload` y `srcset`.
- Fuentes autoalojadas con `font-display: swap` y subconjuntos por `unicode-range`.
- JS de producción: ~92 KB gzip (casi todo React).

## Créditos de imágenes (Unsplash)

| Uso | Autor |
|---|---|
| Hero (caminantes en la Cordillera Blanca) | [danny uscamayta](https://unsplash.com/@danny86) |
| Laguna 69 | [Tamara Bravo](https://unsplash.com/@tamiwanders) |
| Santa Cruz | [Edward Blanco](https://unsplash.com/@leblanc_) |
| Circuito Huayhuash | [Wolfgang Lutz](https://unsplash.com/@wolfi) |
| Laguna Churup | [Aarom Ore](https://unsplash.com/@creatorsproduce) |
| Salkantay (laguna Humantay) | [Javier Nuñez](https://unsplash.com/@javierportales) |
| Ausangate | [Ausangate Peru](https://unsplash.com/@ausangateperu) |
| Quilcayhuanca – Cojup | [Jacob Vizek](https://unsplash.com/@jakevizek) |
| Contacto (atardecer en Santa Cruz) | [Marek Piwnicki](https://unsplash.com/@marekpiwnicki) |

Todas las fotos son de Perú y se usan bajo la [licencia de Unsplash](https://unsplash.com/license). En las rutas sirven para ilustrar: no siempre muestran exactamente el punto de la ruta.

## Ideas futuras

- Calendario de salidas con cupos reales y reserva con adelanto (pasarela en modo prueba).
- Mapa de cada ruta con el trazado GPX y los campamentos sincronizados con el perfil (al pasar el cursor por el perfil, se marca el punto en el mapa).
- Versión en inglés: buena parte de quienes hacen trekking en Huaraz son extranjeros.
- Pruebas unitarias de `lib/quote.js` con Vitest.
