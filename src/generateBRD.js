import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, HeadingLevel, AlignmentType, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
} from 'docx'
import { saveAs } from 'file-saver'

// ── Color tokens ──────────────────────────────────────────────────────────────
const NAVY    = '0C2340'
const BLUE    = '185FA5'
const BLUE_M  = '2E75B6'
const BLUE_L  = 'D6E4F0'
const BLUE_P  = 'EEF7FD'
const TEAL    = '0F6E56'
const TEAL_L  = 'E1F5EE'
const AMBER   = '854F0B'
const AMBER_L = 'FAEEDA'
const RED     = 'A32D2D'
const RED_L   = 'FCEBEB'
const GREEN   = '3B6D11'
const GREEN_L = 'EAF3DE'
const PURPLE  = '3C3489'
const PURPLE_L= 'EEEDFE'
const GRAY    = '444441'
const GRAY_L  = 'F1EFE8'
const GRAY_M  = '888780'
const WHITE   = 'FFFFFF'

const W = 9360 // content width DXA (US Letter 1" margins)

const border  = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
const borders = { top: border, bottom: border, left: border, right: border }
const nob     = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const nobs    = { top: nob, bottom: nob, left: nob, right: nob }
const cm      = v => Math.round(v * 567)
const cm2dxa  = v => Math.round(v * 567)

const m = (t, o = {}) => new Paragraph({
  spacing: { before: o.before || 0, after: o.after ?? 100 },
  alignment: o.align || AlignmentType.LEFT,
  children: [new TextRun({ text: t, font: 'Arial', size: o.size || 22, bold: o.bold || false, italics: o.italics || false, color: o.color || GRAY })]
})

const sp = (n = 80) => new Paragraph({ spacing: { before: n, after: 0 }, children: [new TextRun('')] })
const pb = () => new Paragraph({ children: [new PageBreak()] })

const h1 = t => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 300, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE_M, space: 4 } },
  children: [new TextRun({ text: t, font: 'Arial', size: 34, bold: true, color: NAVY })]
})
const h2 = t => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 220, after: 100 },
  children: [new TextRun({ text: t, font: 'Arial', size: 26, bold: true, color: BLUE_M })]
})
const h3 = (t, col = TEAL) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 160, after: 80 },
  children: [new TextRun({ text: t, font: 'Arial', size: 22, bold: true, color: col })]
})

const cell = (text, w, opts = {}) => new TableCell({
  borders: opts.noBorder ? nobs : borders,
  shading: { fill: opts.fill || WHITE, type: ShadingType.CLEAR },
  margins: { top: 90, bottom: 90, left: 130, right: 130 },
  width: { size: w, type: WidthType.DXA },
  verticalAlign: VerticalAlign.CENTER,
  children: [new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [new TextRun({ text: String(text), font: 'Arial', size: opts.size || 20, bold: opts.bold || false, color: opts.color || GRAY })]
  })]
})

const hdr = (cols, widths) => new TableRow({
  tableHeader: true,
  children: cols.map((t, i) => new TableCell({
    borders,
    shading: { fill: NAVY, type: ShadingType.CLEAR },
    margins: { top: 90, bottom: 90, left: 130, right: 130 },
    width: { size: widths[i], type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, font: 'Arial', size: 19, bold: true, color: WHITE })] })]
  }))
})

const drow = (vals, widths, idx = 0) => new TableRow({
  children: vals.map((t, i) => new TableCell({
    borders,
    shading: { fill: idx % 2 === 0 ? WHITE : GRAY_L, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 130, right: 130 },
    width: { size: widths[i], type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text: String(t), font: 'Arial', size: 19, color: GRAY })] })]
  }))
})

const infoBox = (rows, fill = BLUE_L) => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [W],
  rows: [new TableRow({ children: [new TableCell({
    borders: nobs, shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 130, bottom: 130, left: 180, right: 180 },
    width: { size: W, type: WidthType.DXA },
    children: rows
  })] })]
})

const bul = t => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  spacing: { before: 40, after: 60 },
  children: [new TextRun({ text: t, font: 'Arial', size: 21, color: GRAY })]
})

const num = t => new Paragraph({
  numbering: { reference: 'numbers', level: 0 },
  spacing: { before: 40, after: 60 },
  children: [new TextRun({ text: t, font: 'Arial', size: 21, color: GRAY })]
})

// ── Main generator ─────────────────────────────────────────────────────────────
export async function generateBRD(state) {
  const { numIntgs, numSprints, sprintWeeks, roles, complexity, resourceRows, complexityRows, totalProjectHrs, totalFte, weeks } = state

  const doc = new Document({
    numbering: {
      config: [
        { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] },
        { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] },
      ]
    },
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 34, bold: true, font: 'Arial', color: NAVY }, paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: 'Arial', color: BLUE_M }, paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 1 } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 22, bold: true, font: 'Arial', color: TEAL }, paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
      ]
    },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      headers: {
        default: new Header({ children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE_M, space: 4 } },
          spacing: { before: 0, after: 100 },
          children: [
            new TextRun({ text: 'EasyCalc ', font: 'Arial', size: 19, bold: true, color: BLUE_M }),
            new TextRun({ text: '| Business Requirements Document', font: 'Arial', size: 19, color: GRAY_M }),
            new TextRun({ text: '    Page ', font: 'Arial', size: 19, color: 'BBBBBB' }),
            new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 19, color: 'BBBBBB' }),
          ]
        })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE_L, space: 4 } },
          spacing: { before: 80, after: 0 },
          children: [new TextRun({ text: 'CONFIDENTIAL  |  Integration Practice  |  Version 1.0  |  April 2026', font: 'Arial', size: 17, color: 'BBBBBB' })]
        })] })
      },
      children: [

        // ── COVER ────────────────────────────────────────────────────────
        sp(320),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [new TextRun({ text: 'BUSINESS REQUIREMENTS DOCUMENT', font: 'Arial', size: 22, bold: true, color: GRAY_M })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 14, color: BLUE_M, space: 10 } }, children: [new TextRun({ text: 'EasyCalc', font: 'Arial', size: 64, bold: true, color: NAVY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 }, children: [new TextRun({ text: 'Project-to-Delivery Resource & Sprint Calculator', font: 'Arial', size: 30, color: BLUE_M })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: 'Integration Practice  |  v1.0  |  April 2026', font: 'Arial', size: 22, italics: true, color: GRAY_M })] }),
        sp(240),
        new Table({
          width: { size: cm(10), type: WidthType.DXA }, columnWidths: [cm(4), cm(6)],
          rows: [
            ['Version', '1.0'], ['Date', 'April 2026'], ['Prepared by', 'Integration Practice'],
            ['Integrations', String(numIntgs)], ['Sprints', String(numSprints)],
            ['Total hours', totalProjectHrs.toLocaleString()], ['Status', 'Draft – For Review'],
          ].map(([k, v], i) => new TableRow({ children: [
            new TableCell({ borders: nobs, shading: { fill: BLUE_L, type: ShadingType.CLEAR }, margins: { top: 90, bottom: 90, left: 140, right: 80 }, width: { size: cm(4), type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: k, font: 'Arial', size: 22, bold: true, color: NAVY })] })] }),
            new TableCell({ borders: nobs, shading: { fill: i % 2 === 0 ? 'FAFAFA' : WHITE, type: ShadingType.CLEAR }, margins: { top: 90, bottom: 90, left: 80, right: 140 }, width: { size: cm(6), type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: v, font: 'Arial', size: 22, color: GRAY })] })] }),
          ]}))
        }),
        pb(),

        // ── 1. EXECUTIVE SUMMARY ──────────────────────────────────────────
        h1('1.  Executive Summary'),
        m('EasyCalc is an intelligent project estimation and resource planning tool designed for integration delivery teams. It converts a raw count of integration deliverables into a fully costed, sprint-planned, resource-allocated project plan in minutes.'),
        sp(80),
        m('The tool eliminates manual spreadsheet effort, standardises complexity assumptions across teams, and produces a live dashboard with Gantt chart, capacity heatmap, and sprint-level integration distribution — all derived from a handful of configurable inputs.'),
        sp(160),

        // ── 2. PROBLEM STATEMENT ──────────────────────────────────────────
        h1('2.  Problem Statement'),
        infoBox([
          m('Key pain points today:', { bold: true, color: NAVY, after: 80 }),
          bul('Project managers spend 3–5 days per estimation cycle translating integration counts into resource plans and sprint schedules across multiple Excel tabs.'),
          bul('Complexity assumptions, seniority split, and hours-per-integration are inconsistent between estimators, causing scope creep and budget overruns.'),
          bul('No single tool combines complexity weighting, capacity-based sprint allocation, and real-time plan visualisation.'),
          bul('Any change to team size or sprint count requires rebuilding the entire spreadsheet from scratch.'),
        ], BLUE_L),
        sp(160),

        // ── 3. OBJECTIVES ─────────────────────────────────────────────────
        h1('3.  Objectives'),
        num('Reduce estimation time from 3–5 days to under 15 minutes per project.'),
        num('Enforce consistent complexity weighting across all delivery teams.'),
        num('Auto-distribute integrations across sprints based on team capacity and seniority.'),
        num('Produce a resource allocation table and hours breakdown automatically.'),
        num('Render an interactive Gantt chart and dashboard from a single set of inputs.'),
        num('Allow settings (complexity tiers, role master) to be configured once and reused.'),
        sp(160),

        // ── 4. SCOPE ──────────────────────────────────────────────────────
        h1('4.  Scope'),
        h2('4.1  In Scope'),
        bul('Complexity tier configuration with percentage splits and effort points.'),
        bul('Department and role master with seniority levels and sprint participation ranges.'),
        bul('Project input: number of integrations, start date, sprint count, sprint duration.'),
        bul('Resource allocation engine: FTE-to-hours mapping with complexity weighting.'),
        bul('Sprint plan generator: per-sprint integration distribution (Complex / Medium / Simple).'),
        bul('Dashboard: KPI cards, complexity donut, sprint effort bar, role hours chart, Gantt chart.'),
        sp(80),
        h2('4.2  Out of Scope (v1)'),
        bul('Leave and public holiday calendars.'),
        bul('Multi-currency pricing and rate cards.'),
        bul('Integration with Jira, Azure DevOps, or external project tools.'),
        bul('Risk register and issue tracking.'),
        bul('Vendor / client cost separation.'),
        bul('SLA tracking and reporting.'),
        sp(160),
        pb(),

        // ── 5. FUNCTIONAL REQUIREMENTS ────────────────────────────────────
        h1('5.  Functional Requirements'),

        h2('FR-01  Complexity Configuration (Settings)'),
        m('Administrators configure complexity tiers and percentage splits. The system validates that all percentages sum to 100% before any calculation is triggered. Each tier carries a configurable effort multiplier in story points.'),
        sp(80),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [2000, 1400, 1400, 4560],
          rows: [
            hdr(['Tier', 'Default %', 'Effort pts', 'Description'], [2000, 1400, 1400, 4560]),
            ...complexityRows.map((c, i) => drow([c.name, c.pct + '%', c.pts, c.id === 'vs' ? 'Minimal mapping, single endpoint, no transformation' : c.id === 's' ? 'Single source & target, basic error handling, no scripting' : c.id === 'm' ? 'Moderate mapping & lookups, controlled error handling, mix of APIs and batch' : c.id === 'c' ? 'Multiple endpoints, event-driven, real-time, sophisticated error handling' : 'Complex business logic, orchestration, custom scripting, high-volume'], [2000, 1400, 1400, 4560], i))
          ]
        }),
        sp(60),
        m('Effort hours per integration = Effort points × 8 hours.', { italics: true, color: GRAY_M }),
        sp(160),

        h2('FR-02  Role & Department Master (Settings)'),
        m('A department-role hierarchy is maintained in settings. Each role carries a sprint participation range (start sprint to end sprint) and a configurable FTE count.'),
        sp(80),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [1800, 3000, 2000, 2560],
          rows: [
            hdr(['Department', 'Role', 'Default FTEs', 'Sprint participation'], [1800, 3000, 2000, 2560]),
            ...roles.map((r, i) => drow([r.dept, r.role, r.fte, `Sprint ${r.sFrom} to Sprint ${r.sTo}`], [1800, 3000, 2000, 2560], i))
          ]
        }),
        sp(160),

        h2('FR-03  Project Input Parameters'),
        m('The user provides the following inputs to initialise a project plan. All outputs are derived automatically from these combined with the settings configuration.'),
        sp(80),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [3000, 2200, 4160],
          rows: [
            hdr(['Input field', 'Example value', 'Notes'], [3000, 2200, 4160]),
            drow(['Number of integrations', String(numIntgs), 'Total integration deliverables in scope'], [3000, 2200, 4160], 0),
            drow(['Project start date', 'User-selected', 'Auto-aligns to next Monday'], [3000, 2200, 4160], 1),
            drow(['Number of sprints', String(numSprints), 'Includes kick-off and UAT/deployment sprints'], [3000, 2200, 4160], 0),
            drow(['Sprint duration (weeks)', String(sprintWeeks), 'Default is 2-week sprints; 1 FTE = 40 hrs/week'], [3000, 2200, 4160], 1),
            drow(['Departments required', 'PM, Integration, Cloud, QA', 'Multi-select from role master'], [3000, 2200, 4160], 0),
            drow(['FTEs per role', 'e.g. 3 Sr Developers', 'Overrides default from role master'], [3000, 2200, 4160], 1),
            drow(['Sprint participation range', 'Sprint from / Sprint to', 'Per role – active sprint start and end'], [3000, 2200, 4160], 0),
          ]
        }),
        sp(160),
        pb(),

        h2('FR-04  Resource Allocation Engine'),
        m('The engine computes hours and capacity from inputs and settings. The calculation chain:'),
        sp(80),
        infoBox([
          m('Calculation chain:', { bold: true, color: NAVY, after: 60 }),
          m('1. Complexity split:  Integrations × complexity % = integrations per tier', { color: GRAY, size: 20, after: 50 }),
          m('2. Effort per tier:   Integrations in tier × effort pts × 8 hrs = tier effort hours', { color: GRAY, size: 20, after: 50 }),
          m('3. Role hours:        FTEs × active sprints × sprint weeks × 40 hrs = total role hours', { color: GRAY, size: 20, after: 50 }),
          m('4. % of effort:       Role hours / total project hours × 100', { color: GRAY, size: 20, after: 0 }),
        ], GRAY_L),
        sp(80),
        m('Seniority rule: Sr Developers handle Complex and Medium integrations. Developers and Associates handle Medium and Simple integrations.'),
        sp(160),

        h2('FR-05  Sprint Plan Generator'),
        m('The system distributes integrations across all development sprints. Sprint-1 (kick-off) and the final sprint (UAT + Deployment) contain no development integrations.'),
        sp(80),
        bul('Sprint number, phase label (Kick-off / Development / UAT + Deploy), and week range.'),
        bul('Start and end dates derived from project start date and sprint duration.'),
        bul('Active FTE count — sum of FTEs for all roles whose sprint range includes this sprint.'),
        bul('Integration count split by tier: Very Complex, Complex, Medium, Simple, Very Simple.'),
        bul('Total effort hours for the sprint.'),
        sp(160),

        h2('FR-06  Dashboard & Visualisation'),
        m('The dashboard presents a real-time overview. All charts update instantly when any input changes.'),
        sp(80),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [2800, 6560],
          rows: [
            hdr(['Component', 'Description'], [2800, 6560]),
            drow(['Summary KPI cards', 'Total integrations, total hours, number of sprints, total FTEs'], [2800, 6560], 0),
            drow(['Complexity donut chart', 'Visual split of integrations by tier'], [2800, 6560], 1),
            drow(['Sprint effort bar chart', 'Effort hours per sprint across the project timeline'], [2800, 6560], 0),
            drow(['Role hours bar chart', 'Total hours per role, horizontal bar chart'], [2800, 6560], 1),
            drow(['Gantt chart', 'All project phases plotted against sprint timeline'], [2800, 6560], 0),
            drow(['Resource allocation table', 'Per-role: FTEs, active sprints, hours/week, total hours, % effort'], [2800, 6560], 1),
          ]
        }),
        sp(160),
        pb(),

        // ── 6. RESOURCE ALLOCATION ────────────────────────────────────────
        h1('6.  Resource Allocation (Computed)'),
        m(`Based on ${numIntgs} integrations, ${numSprints} sprints of ${sprintWeeks} weeks. Total project hours: ${totalProjectHrs.toLocaleString()}.`),
        sp(80),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [1600, 2800, 800, 1000, 1000, 900, 1260],
          rows: [
            hdr(['Dept', 'Role', 'FTEs', 'Spr.from', 'Spr.to', 'Total hrs', '% effort'], [1600, 2800, 800, 1000, 1000, 900, 1260]),
            ...resourceRows.map((r, i) => drow([r.dept, r.role, r.fte, `S${r.sFrom}`, `S${r.sTo}`, Math.round(r.totalHrs).toLocaleString(), r.pct.toFixed(1) + '%'], [1600, 2800, 800, 1000, 1000, 900, 1260], i)),
            new TableRow({ children: [
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 1600, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: 'TOTAL', font: 'Arial', size: 20, bold: true, color: WHITE })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 2800, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: '', font: 'Arial', size: 20, color: WHITE })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 800, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: String(totalFte), font: 'Arial', size: 20, bold: true, color: 'A8DFCA' })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 1000, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: '', font: 'Arial', size: 20, color: WHITE })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 1000, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: '', font: 'Arial', size: 20, color: WHITE })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 900, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: totalProjectHrs.toLocaleString(), font: 'Arial', size: 20, bold: true, color: 'A8DFCA' })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 1260, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: '100%', font: 'Arial', size: 20, bold: true, color: 'A8DFCA' })] })] }),
            ]})
          ]
        }),
        sp(160),

        // ── 7. COMPLEXITY BREAKDOWN ────────────────────────────────────────
        h1('7.  Complexity Breakdown (Computed)'),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [2200, 1400, 1600, 1400, 2760],
          rows: [
            hdr(['Tier', '% split', 'Integrations', 'Effort pts', 'Total effort hrs'], [2200, 1400, 1600, 1400, 2760]),
            ...complexityRows.map((c, i) => drow([c.name, c.pct + '%', c.count, c.pts, Math.round(c.hrs).toLocaleString()], [2200, 1400, 1600, 1400, 2760], i)),
            new TableRow({ children: [
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 2200, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: 'TOTAL', font: 'Arial', size: 20, bold: true, color: WHITE })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 1400, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: '100%', font: 'Arial', size: 20, bold: true, color: 'A8DFCA' })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 1600, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: String(numIntgs), font: 'Arial', size: 20, bold: true, color: 'A8DFCA' })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 1400, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: '—', font: 'Arial', size: 20, color: WHITE })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 2760, type: WidthType.DXA }, margins: { top: 90, bottom: 90, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: complexityRows.reduce((a, c) => a + c.hrs, 0).toLocaleString(), font: 'Arial', size: 20, bold: true, color: 'A8DFCA' })] })] }),
            ]})
          ]
        }),
        sp(160),
        pb(),

        // ── 8. USER STORIES ───────────────────────────────────────────────
        h1('8.  User Stories'),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [1600, 7760],
          rows: [
            hdr(['Role', 'As a … I want to … so that …'], [1600, 7760]),
            drow(['Project Manager', 'As a Project Manager, I want to enter the total number of integrations and get a sprint-wise plan automatically, so that I can present estimates to the client within 15 minutes.'], [1600, 7760], 0),
            drow(['Solution Architect', 'As a Solution Architect, I want to configure complexity tiers and effort hours once in settings, so all project estimations use consistent standards.'], [1600, 7760], 1),
            drow(['Delivery Lead', 'As a Delivery Lead, I want a resource allocation table showing hours per role and percentage of effort, so I can raise a purchase order with accurate numbers.'], [1600, 7760], 0),
            drow(['PMO', 'As a PMO, I want a Gantt chart and dashboard summary, so I can include them directly in steering committee packs.'], [1600, 7760], 1),
            drow(['QA Lead', 'As a QA Lead, I want the tool to show which sprints QA is active in and how many hours are allocated, so I can plan test cycles accordingly.'], [1600, 7760], 0),
          ]
        }),
        sp(160),

        // ── 9. NON-FUNCTIONAL REQUIREMENTS ───────────────────────────────
        h1('9.  Non-Functional Requirements'),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [2200, 4560, 2600],
          rows: [
            hdr(['Category', 'Requirement', 'Acceptance criterion'], [2200, 4560, 2600]),
            drow(['Performance', 'All computations recalculate when any input changes.', 'Recalculation completes in under 1 second for up to 500 integrations.'], [2200, 4560, 2600], 0),
            drow(['Validation', 'Complexity % must sum to 100. FTEs must be > 0. Dates must be valid.', 'System highlights invalid fields and blocks calculation until corrected.'], [2200, 4560, 2600], 1),
            drow(['Data persistence', 'Settings (complexity tiers, role master) are retained between sessions.', 'Settings survive browser refresh without re-entry.'], [2200, 4560, 2600], 0),
            drow(['Usability', 'Non-technical users (PMs) can produce a plan without training.', 'Plan generated in under 15 minutes by a first-time user.'], [2200, 4560, 2600], 1),
            drow(['Exportability', 'Sprint plan and resource table must be printable / copy-pasteable.', 'Output renders correctly when pasted into Excel or Word.'], [2200, 4560, 2600], 0),
          ]
        }),
        sp(160),

        // ── 10. ASSUMPTIONS ───────────────────────────────────────────────
        h1('10.  Assumptions & Constraints'),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [600, 8760],
          rows: [
            hdr(['#', 'Assumption / Constraint'], [600, 8760]),
            drow(['A1', `Sprint duration is ${sprintWeeks} week(s). One FTE = 40 hours per week, giving ${sprintWeeks * 40} hours per FTE per sprint.`], [600, 8760], 0),
            drow(['A2', 'Public holidays, annual leave, and sick leave are not accounted for in v1.'], [600, 8760], 1),
            drow(['A3', 'The project start date is automatically adjusted to the next Monday.'], [600, 8760], 0),
            drow(['A4', 'Sr Developers handle Complex and Medium integrations. Developers/Associates handle Medium and Simple.'], [600, 8760], 1),
            drow(['A5', 'Kick-off sprint and final sprint contain no development integrations.'], [600, 8760], 0),
            drow(['A6', 'The complexity distribution percentage is assumed to be uniform across all sprints.'], [600, 8760], 1),
          ]
        }),
        sp(160),

        // ── 11. GLOSSARY ─────────────────────────────────────────────────
        h1('11.  Glossary'),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [2400, 6960],
          rows: [
            hdr(['Term', 'Definition'], [2400, 6960]),
            drow(['O2C', 'Order-to-Cash — the end-to-end business process from order placement to cash receipt.'], [2400, 6960], 0),
            drow(['FTE', 'Full-Time Equivalent — one person working 40 hours per week.'], [2400, 6960], 1),
            drow(['Sprint', 'A fixed-duration iteration (typically 2 weeks) in an agile delivery methodology.'], [2400, 6960], 0),
            drow(['Complexity tier', 'A classification of integration difficulty: Very Simple through Very Complex.'], [2400, 6960], 1),
            drow(['Effort points', 'Relative measure of integration build effort. 1 pt = 8 hours.'], [2400, 6960], 0),
            drow(['SIT', 'System Integration Testing — testing integrated systems to verify they work together.'], [2400, 6960], 1),
            drow(['UAT', 'User Acceptance Testing — end-user validation before go-live.'], [2400, 6960], 0),
            drow(['Hypercare', 'Post-go-live support period (typically 90 days) with elevated monitoring.'], [2400, 6960], 1),
          ]
        }),
        sp(160),

        // ── 12. DOCUMENT CONTROL ──────────────────────────────────────────
        h1('12.  Document Control'),
        new Table({
          width: { size: W, type: WidthType.DXA }, columnWidths: [1400, 2000, 2800, 3160],
          rows: [
            hdr(['Version', 'Date', 'Author', 'Change summary'], [1400, 2000, 2800, 3160]),
            drow(['1.0', 'Apr 2026', 'Integration Practice', 'Initial draft — full BRD for EasyCalc v1.'], [1400, 2000, 2800, 3160], 0),
          ]
        }),
        sp(200),
        new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 6, color: BLUE_M, space: 8 } }, spacing: { before: 80, after: 0 }, children: [new TextRun({ text: 'End of Document', font: 'Arial', size: 19, italics: true, color: GRAY_M })] }),
      ]
    }]
  })

  const buffer = await Packer.toBuffer(doc)
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  saveAs(blob, 'EasyCalc_BRD_v1.0.docx')
}
