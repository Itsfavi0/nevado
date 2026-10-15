// Cálculo del cotizador. Funciones puras: fáciles de leer y de probar.

export const USD_RATE = 3.75 // tipo de cambio referencial

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export const SEASONS = {
  dry: { label: 'Temporada seca', adjustment: 0 },
  shoulder: { label: 'Transición', adjustment: -0.08 },
  rainy: { label: 'Lluvias', adjustment: -0.15 },
}

export const EXTRAS = {
  gear: {
    label: 'Alquiler de equipo',
    detail: 'Bolsa de dormir −10 °C, colchoneta y bastones',
    pricePerPersonDay: 35,
  },
  porter: {
    label: 'Porteador personal',
    detail: 'Lleva hasta 7 kg de tus cosas; solo rutas de varios días',
    pricePerPersonDay: 85,
    multiDayOnly: true,
  },
  acclimatization: {
    label: 'Día extra de aclimatación',
    detail: 'Noche de hotel y caminata guiada antes de salir',
    pricePerPerson: 260,
  },
}

/** month: 1–12 */
export function getSeason(month) {
  if (month >= 5 && month <= 9) return 'dry'
  if (month === 4 || month === 10 || month === 11) return 'shoulder'
  return 'rainy'
}

export function isMonthAvailable(route, month) {
  return route.rainySeason || getSeason(month) !== 'rainy'
}

// Grupos más grandes reparten el costo del guía y la logística.
export function getGroupAdjustment(people) {
  if (people === 1) return { label: 'Salida privada (1 persona)', value: 0.35 }
  if (people >= 6) return { label: 'Grupo de 6 a 8', value: -0.1 }
  if (people >= 4) return { label: 'Grupo de 4 a 5', value: -0.05 }
  return null
}

export function calculateQuote({ route, month, people, extras }) {
  const lines = []
  const base = route.pricePerPerson * people
  lines.push({
    label: route.name,
    detail: `S/ ${formatNumber(route.pricePerPerson)} × ${people} ${plural(people, 'persona', 'personas')}`,
    amount: base,
  })

  const season = getSeason(month)
  const seasonAdjustment = SEASONS[season].adjustment
  if (seasonAdjustment !== 0) {
    lines.push({
      label: SEASONS[season].label,
      detail: percent(seasonAdjustment),
      amount: Math.round(base * seasonAdjustment),
    })
  }

  const group = getGroupAdjustment(people)
  if (group) {
    lines.push({
      label: group.label,
      detail: percent(group.value),
      amount: Math.round(base * group.value),
    })
  }

  if (extras.gear) {
    lines.push({
      label: EXTRAS.gear.label,
      detail: `${route.days} ${plural(route.days, 'día', 'días')}`,
      amount: EXTRAS.gear.pricePerPersonDay * route.days * people,
    })
  }
  if (extras.porter && route.days > 1) {
    lines.push({
      label: EXTRAS.porter.label,
      detail: `${route.days} días`,
      amount: EXTRAS.porter.pricePerPersonDay * route.days * people,
    })
  }
  if (extras.acclimatization) {
    lines.push({
      label: EXTRAS.acclimatization.label,
      amount: EXTRAS.acclimatization.pricePerPerson * people,
    })
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0)
  return {
    lines,
    total,
    perPerson: Math.round(total / people),
    totalUsd: Math.round(total / USD_RATE),
    deposit: Math.round(total * 0.3),
  }
}

export function formatNumber(value) {
  return new Intl.NumberFormat('es-ES').format(value)
}

export function formatSoles(value) {
  const sign = value < 0 ? '−' : ''
  return `${sign}S/ ${formatNumber(Math.abs(value))}`
}

function percent(value) {
  const sign = value > 0 ? '+' : '−'
  return `${sign}${Math.round(Math.abs(value) * 100)} %`
}

/** [5, 6, 7, 8, 9] → "may–sep" */
export function formatMonthRange(months) {
  const short = (m) => MONTHS[m - 1].slice(0, 3).toLowerCase()
  return `${short(months[0])}–${short(months[months.length - 1])}`
}

export function plural(count, one, many) {
  return count === 1 ? one : many
}
