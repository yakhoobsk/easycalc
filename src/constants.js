export const DEFAULT_COMPLEXITY = [
  { id: 'vs', name: 'Very Simple', pct: 10, pts: 1, color: '#85B7EB' },
  { id: 's', name: 'Simple', pct: 20, pts: 2, color: '#378ADD' },
  { id: 'm', name: 'Medium', pct: 35, pts: 3, color: '#185FA5' },
  { id: 'c', name: 'Complex', pct: 25, pts: 5, color: '#0C447C' },
  { id: 'vc', name: 'Very Complex', pct: 10, pts: 8, color: '#042C53' },
]

export const DEFAULT_ROLES = [
  { role_id: 1, department_name: 'PM', role_name: 'Project Manager', ftes: 1, active_from_sprint: 1, active_to_sprint: 17 },
  { role_id: 2, department_name: 'Integration', role_name: 'Enterprise Architect', ftes: 1, active_from_sprint: 1, active_to_sprint: 17 },
  { role_id: 3, department_name: 'Integration', role_name: 'Sr Developer', ftes: 3, active_from_sprint: 3, active_to_sprint: 17 },
  { role_id: 4, department_name: 'Integration', role_name: 'Developer', ftes: 3, active_from_sprint: 3, active_to_sprint: 17 },
  { role_id: 5, department_name: 'Integration', role_name: 'Associate Developer', ftes: 1, active_from_sprint: 3, active_to_sprint: 17 },
  { role_id: 6, department_name: 'Cloud', role_name: 'DevOps Architect', ftes: 1, active_from_sprint: 1, active_to_sprint: 2 },
  { role_id: 7, department_name: 'Cloud', role_name: 'DevOps Engineer', ftes: 1, active_from_sprint: 15, active_to_sprint: 17 },
  { role_id: 8, department_name: 'QA', role_name: 'QA Lead', ftes: 1, active_from_sprint: 9, active_to_sprint: 17 },
  { role_id: 9, department_name: 'QA', role_name: 'QA Analyst', ftes: 2, active_from_sprint: 9, active_to_sprint: 17 },
]

export const DEPT_COLORS = {
  PM: { bg: '#E6F1FB', text: '#0C447C', border: '#B5D4F4' },
  Integration: { bg: '#EEEDFE', text: '#3C3489', border: '#AFA9EC' },
  Cloud: { bg: '#E1F5EE', text: '#085041', border: '#9FE1CB' },
  QA: { bg: '#FAEEDA', text: '#633806', border: '#FAC775' },
  Analytics: { bg: '#FCEBEB', text: '#791F1F', border: '#F7C1C1' },
}

export const PHASE_COLORS = {
  'Kick-off': '#534AB7',
  'Development': '#185FA5',
  'UAT / Deploy': '#A32D2D',
}

export const GANTT_PHASES = [
  { name: 'Req. gathering & platform setup', sFrom: 1, sTo: 2 },
  { name: 'Analysis & design', sFrom: 1, sTo: 8 },
  { name: 'Development & unit testing', sFrom: 3, sTo: 17 },
  { name: 'SIT execution', sFrom: 5, sTo: 17 },
  { name: 'UAT support', sFrom: 5, sTo: 17 },
  { name: 'Production deployment', sFrom: 7, sTo: 17 },
  { name: 'Training', sFrom: 15, sTo: 17 },
  { name: 'Post-implementation review', sFrom: 11, sTo: 17 },
  { name: 'Hypercare', sFrom: 17, sTo: 17 },
]

export const GANTT_COLORS = [
  '#185FA5', '#2E75B6', '#3B6D11', '#854F0B',
  '#BA7517', '#534AB7', '#0F6E56', '#888780', '#444441',
]
