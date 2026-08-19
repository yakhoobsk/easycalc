# EasyCalc — Project-to-Delivery Estimator

A professional Vite + React application for integration project estimation. Converts a raw integration count into a fully-costed, sprint-planned, resource-allocated project plan — including a downloadable Word BRD.

## Tech stack

- **Vite 5** — ultra-fast dev server and build tool
- **React 18** — component-based UI
- **Recharts** — dashboard charts (donut, bar, horizontal bar)
- **docx** — client-side Word document generation
- **file-saver** — browser download trigger
- **lucide-react** — icon set
- **Inter + DM Serif Display** — typography (Google Fonts)

## Corporate colour palette

| Token | Hex | Usage |
|-------|-----|-------|
| Navy 800 | `#0C2340` | Sidebar, headings, topbar |
| Blue 700 | `#185FA5` | Primary actions, links, charts |
| Blue Mid | `#2E75B6` | Secondary blue, headers |
| Teal 600 | `#0F6E56` | Success states, KPI deltas |
| Amber 600 | `#854F0B` | Warnings, QA badges |
| Purple 600 | `#3C3489` | Integration dept badges |
| Gray 100 | `#F1EFE8` | Page background |

## Quick start

```bash
# 1. Unzip the project
unzip EasyCalc_Vite.zip
cd easycalc-app

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build
```

## Application screens

| Screen | Route | Description |
|--------|-------|-------------|
| Settings | `/settings` | Configure complexity tiers (%, effort pts) and role master (dept → role → FTEs) |
| Project input | `/input` | Enter integrations, dates, sprints, team composition |
| Resources | `/resources` | Auto-generated resource allocation table + complexity breakdown |
| Sprint plan | `/sprints` | Per-sprint integration distribution with dates, FTEs, effort hours |
| Dashboard | `/dashboard` | Live charts: donut, sprint effort bar, role hours, dept breakdown |
| Gantt chart | `/gantt` | Phase swimlane Gantt with sprint-level timeline |
| Export | `/export` | Download full BRD as Word .docx (Excel & PPT coming soon) |

## How the calculation works

```
1. Complexity split:   N integrations × tier % = integrations per tier
2. Effort hours:       Integrations per tier × effort pts × 8 hrs
3. Role hours:         FTEs × active sprints × sprint weeks × 40 hrs/week
4. % of effort:        Role hours ÷ total project hours × 100
5. Sprint distribution: Integrations ÷ development sprints (even split)
```

## Word document export

Click **Export → Download .docx** on the Export page. The document includes:

- Cover page with live project metadata
- Executive summary, problem statement, objectives
- FR-01 to FR-06 functional requirements
- Computed resource allocation table (from current inputs)
- Computed complexity breakdown table
- User stories, NFRs, assumptions, glossary
- Document control table

The BRD reflects whatever values are currently entered — change the inputs and re-export for an updated document.

## Folder structure

```
src/
├── App.jsx              # Root shell — state + routing
├── main.jsx             # React DOM entry point
├── index.css            # CSS variables + global reset
├── constants.js         # Default complexity tiers, roles, Gantt phases
├── useCalc.js           # Core calculation hook
├── generateBRD.js       # Word document generator (docx library)
├── components/
│   ├── Topbar.jsx       # Top navigation bar
│   ├── Sidebar.jsx      # Left nav with active states
│   └── UI.jsx           # Shared components: Card, Badge, Table, Alert, etc.
└── pages/
    ├── SettingsPage.jsx # Complexity + role master configuration
    ├── InputPage.jsx    # Project input form with stepper
    ├── ResourcesPage.jsx# Resource allocation + complexity tables
    ├── SprintsPage.jsx  # Sprint schedule table
    ├── DashboardPage.jsx# Recharts dashboard
    ├── GanttPage.jsx    # Gantt swimlane chart
    └── ExportPage.jsx   # Download controls
```

## Extending the app

- **Add more departments**: Edit `DEFAULT_ROLES` in `constants.js`
- **Change default complexity**: Edit `DEFAULT_COMPLEXITY` in `constants.js`
- **Add Excel export**: Install `xlsx` and wire up in `ExportPage.jsx`
- **Add PPT export**: Install `pptxgenjs` and wire up in `ExportPage.jsx`
- **Persist settings**: Wrap state updates with `localStorage.setItem`

---

Built by Integration Practice · April 2026
