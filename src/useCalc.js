import { useMemo } from 'react'

export function nextMonday(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay()
  if (day !== 1) { const diff = (8 - day) % 7 || 7; d.setDate(d.getDate() + diff) }
  return d
}

export function addDays(d, n) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}

// export function fmtDate(d) {
//   return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
// }

export function fmtDate(d) {
  if (!d) return '';

  const date = new Date(d);

  if (isNaN(date)) return '';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  });
}

export function useCalc({ numIntgs, numSprints, sprintWeeks, startDate, roles, complexity }) {
  return useMemo(() => {
    const ns = numSprints
    const sw = sprintWeeks
    const start = nextMonday(startDate)

    // Sprint dates
    const sprints = Array.from({ length: ns }, (_, i) => {
      const sd = addDays(start, i * sw * 7)
      const ed = addDays(sd, sw * 7 - 3)
      const phase = i === 0 ? 'Kick-off' : i === ns - 1 ? 'UAT / Deploy' : 'Development'
      const activeFte = roles
        .filter(r => r.sFrom <= i + 1 && r.sTo >= i + 1)
        .reduce((a, r) => a + r.fte, 0)

      const devSprints = ns - 2
      let intgC = 0, intgM = 0, intgS = 0, intgVC = 0, intgVS = 0
      if (phase === 'Development' && devSprints > 0) {
        intgVC = Math.round(numIntgs * (complexity.find(c => c.id === 'vc')?.pct || 10) / 100 / devSprints)
        intgC = Math.round(numIntgs * (complexity.find(c => c.id === 'c')?.pct || 25) / 100 / devSprints)
        intgM = Math.round(numIntgs * (complexity.find(c => c.id === 'm')?.pct || 35) / 100 / devSprints)
        intgS = Math.round(numIntgs * (complexity.find(c => c.id === 's')?.pct || 20) / 100 / devSprints)
        intgVS = Math.round(numIntgs * (complexity.find(c => c.id === 'vs')?.pct || 10) / 100 / devSprints)
      }

      const totalIntg = intgVC + intgC + intgM + intgS + intgVS
      const effortHrs = complexity.reduce((sum, c) => {
        const count = c.id === 'vc' ? intgVC : c.id === 'c' ? intgC : c.id === 'm' ? intgM : c.id === 's' ? intgS : intgVS
        return sum + count * c.pts * 8
      }, 0)

      return {
        num: i + 1, phase, sd, ed,
        wFrom: i * sw + 1, wTo: (i + 1) * sw,
        activeFte: Math.round(activeFte * 10) / 10,
        intgVC, intgC, intgM, intgS, intgVS, totalIntg, effortHrs,
      }
    })

    // Resource table data
    const totalProjectHrs = roles.reduce((sum, r) => {
      const active = r.sTo - r.sFrom + 1
      return sum + r.fte * active * sw * 40
    }, 0)

    const resourceRows = roles.map(r => {
      const active = r.sTo - r.sFrom + 1
      const hrs = r.fte * active * sw * 40
      return { ...r, active, hrsPerWeek: r.fte * 40, totalHrs: hrs, pct: totalProjectHrs > 0 ? (hrs / totalProjectHrs * 100) : 0 }
    })

    // Complexity breakdown
    const complexityRows = complexity.map(c => {
      const count = Math.round(numIntgs * c.pct / 100)
      const hrs = count * c.pts * 8
      return { ...c, count, hrs }
    })

    const totalFte = roles.reduce((a, r) => a + r.fte, 0)
    const weeks = ns * sw

    return { sprints, resourceRows, complexityRows, totalProjectHrs, totalFte, weeks }
  }, [numIntgs, numSprints, sprintWeeks, startDate, roles, complexity])
}
