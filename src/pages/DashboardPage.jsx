import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend,
} from 'recharts'
import { Card, CardTitle, PageHeader, Metric, Badge, ProgBar } from '../components/UI.jsx'
import { dashboardDetails } from '../redux/services/dashboardService.js'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const DEPT_COLORS_MAP = {
  Integration: '#185FA5',
  QA: '#EF9F27',
  PM: '#0F6E56',
  Cloud: '#7F77DD',
  Analytics: '#D85A30',
}

const PHASE_LABELS = {
  requirements_gathering: 'Req. gathering',
  documentation: 'Documentation',
  analysis_design: 'Analysis & Design',
  dev_ut: 'Dev & UT',
  sit: 'SIT',
  uat: 'UAT',
  cutover_golive: 'Cutover & Go-live',
  hypercare: 'HyperCare',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  const data = payload[0]?.payload

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '10px 12px',
        fontSize: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,.08)',
        minWidth: 160,
      }}
    >
      {/* Sprint Name */}
      <div
        style={{
          fontWeight: 700,
          color: 'var(--navy-800)',
          marginBottom: 8,
          fontSize: 13,
        }}
      >
        {label}
      </div>

      {/* Phase */}
      <div
        style={{
          marginBottom: 8,
          color: 'var(--text-secondary)',
          fontSize: 12,
        }}
      >
        Phase:{' '}
        <span
          style={{
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          {data?.phase}
        </span>
      </div>

      {/* Values */}
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: p.fill || p.color,
            }}
          />

          <span style={{ color: 'var(--text-secondary)' }}>
            {p.name}:
          </span>

          <span
            style={{
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {typeof p.value === 'number'
              ? p.value.toLocaleString()
              : p.value}
          </span>
        </div>
      ))}

      {/* Integrations */}
      <div
        style={{
          marginTop: 6,
          color: 'var(--text-secondary)',
          fontSize: 12,
        }}
      >
        Integrations:{' '}
        <span
          style={{
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          {data?.intgs}
        </span>
      </div>
    </div>
  )
}
export default function DashboardPage({ numIntgs, numSprints, sprints, totalProjectHrs, totalFte, resourceRows, complexityRows, projectId, projectName, weeks }) {

  const dispatch = useDispatch()
  const dashboardData = useSelector((state) => state.dashboard?.dashboardData || {})
  const complexitydistdata = dashboardData?.complexity_distribution?.data || [];
  const departmenthours = dashboardData?.department_hours || [];
  const efforthourspersprint = dashboardData?.effort_hours_per_sprint || [];
  const summarycards = dashboardData?.summary_cards || [];
  const complexitycards = dashboardData?.complexity_cards || [];
  const rolehoursbreakdown = dashboardData?.role_hours_breakdown || [];
  const sprintChartData = dashboardData?.effort_hours_per_sprint || [];
  const phaseEffortBreakdown = dashboardData?.phase_effort_breakdown || [];
  const phaseEffortChartData = phaseEffortBreakdown.map((p) => ({
    name: PHASE_LABELS[p.phase_name] || p.phase_name,
    total_hours: Math.round(Number(p.total_hours || 0)),
    boomi_ai_hours: Math.round(Number(p.boomi_ai_hours || 0)),
  }))
  const pieData = complexitydistdata.map(c => ({ name: c.tier, value: c.count, color: c.color, percentage: c.percentage }))
  const roleChartData = [...rolehoursbreakdown]
    .sort((a, b) => b.hours - a.hours)
    .map(r => ({ name: r.role.length > 18 ? r.role.slice(0, 17) + '…' : r.role, hrs: Math.round(r.hours) }))

  const sprintBarColor = s =>
    s.phase === 'Kick-off' ? '#AFA9EC' : s.phase === 'UAT / Deploy' ? '#F09595' : '#185FA5'

  useEffect(() => {
    if (projectId) {
      dispatch(dashboardDetails(projectId))
    }
  }, [dispatch, projectId])

  return (
    <div>
      <PageHeader
        breadcrumb={['Outputs', 'Dashboard']}
        title="Project dashboard"
        subtitle={`${projectName}  ·  Live metrics — updates instantly with any input change`}
      />

      {/* KPI row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
        marginBottom: 20
      }}>
        <Metric value={numIntgs.toLocaleString()} label="Total integrations" accent="#185FA5" />
        <Metric value={Math.round(summarycards?.total_project_hours || 0).toLocaleString()} label="Total project hours" accent="#0F6E56" delta={`Over ${weeks} weeks`} />
        <Metric value={numSprints} label="Total sprints" accent="#534AB7" />
        <Metric value={summarycards?.peak_ftes} label="Peak FTEs" accent="#854F0B" />
      </div>

      {/* Row 1: Donut + Dept bars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        marginBottom: 16
      }}>

        <Card>
          <CardTitle>Complexity distribution</CardTitle>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 20
          }}>
            <div style={{ flexShrink: 0 }}>
              <PieChart width={140} height={140}>
                <Pie data={pieData}
                  cx={65}
                  cy={65}
                  innerRadius={38}
                  outerRadius={62}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={1}
                >
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                </Pie>
                <text x={70} y={61} textAnchor="middle" style={{ fontSize: 15, fontWeight: 700, fill: 'var(--navy-800)' }}>{numIntgs}</text>
                <text x={70} y={76} textAnchor="middle" style={{ fontSize: 9, fill: 'var(--gray-500)' }}>integrations</text>
              </PieChart>
            </div>
            <div style={{
              flex: 1,
              minWidth: 160,

              maxHeight: window.innerWidth < 600 ? '160px' : 'none',
              overflowY: window.innerWidth < 600 ? 'auto' : 'visible',

              paddingRight: window.innerWidth < 600 ? 6 : 0
            }}>
              {pieData.map(c => (
                <div key={c.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  marginBottom: 8
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy-800)' }}>{c.value}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>({c.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Hours by department</CardTitle>
          <div style={{ marginTop: 8 }}>
            {departmenthours.map(d => {
              // const pct = totalProjectHrs > 0 ? d.hrs / totalProjectHrs * 100 : 0
              return (
                <div key={d.department} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{d.department}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontWeight: 700, color: 'var(--navy-800)' }}>{d.hours?.toLocaleString()} hrs</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{d.percentage}%</span>
                    </div>
                  </div>
                  <ProgBar pct={d.percentage} color={DEPT_COLORS_MAP[d.department] || '#888'} height={7} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Sprint effort bar chart */}
      <Card>
        <CardTitle>Effort hours per sprint</CardTitle>
        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          {[
            ['#A78BFA', 'Kick-off'],
            ['#2563EB', 'Development'],
            ['#F87171', 'UAT + Deploy'],
          ].map(([c, l]) => (<span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
          </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sprintChartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#ECEAE4" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888780' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#888780' }} axisLine={false} tickLine={false} width={44} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hrs" name="Effort hours"
              barSize={26}
            >
              {sprintChartData.map((s, i) => (
                <Cell key={i} fill={sprintBarColor(s)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Phase effort breakdown */}
      {phaseEffortChartData.length > 0 && (
        <Card>
          <CardTitle>Effort hours by phase</CardTitle>
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            {[
              ['#185FA5', 'Total hours'],
              ['#2FBFA0', 'With Boomi AI'],
            ].map(([c, l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={phaseEffortChartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }} barCategoryGap="24%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECEAE4" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888780' }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10, fill: '#888780' }} axisLine={false} tickLine={false} width={44} />
              <Tooltip />
              <Bar dataKey="total_hours" name="Total hours" fill="#185FA5" radius={[3, 3, 0, 0]} />
              <Bar dataKey="boomi_ai_hours" name="With Boomi AI" fill="#2FBFA0" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Role hours horizontal bar */}
      <Card>
        <CardTitle>Role hours breakdown</CardTitle>

        <div
          style={{
            width: '100%',
            overflowX: window.innerWidth < 600 ? 'auto' : 'visible'
          }}
        >
          <div
            style={{
              minWidth: window.innerWidth < 600 ? 650 : '100%'
            }}
          >
            <ResponsiveContainer width="100%" height={Math.max(200, roleChartData.length * 32)}>
              <BarChart data={roleChartData} layout="vertical"
                barCategoryGap="30%"
                margin={{
                  left:
                    window.innerWidth < 600
                      ? 40
                      : window.innerWidth < 1024
                        ? 80
                        : 140,
                  right: 20
                }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEAE4" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#888780' }} axisLine={false} tickLine={false}

                />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#5F5E5A' }} axisLine={false} tickLine={false} width={
                  window.innerWidth < 600
                    ? 120
                    : window.innerWidth < 1024
                      ? 100
                      : 140
                } />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hrs" name="Total hours" fill="#2E75B6" radius={[0, 3, 3, 0]}
                  label={{ position: 'right', fontSize: 10, fill: '#888780', formatter: v => v.toLocaleString() }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Complexity effort stacked info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 10
      }}>
        {complexitycards.map(c => (
          <Card key={c.id} style={{ textAlign: 'center', padding: '14px 12px', borderTop: `3px solid ${c.color}`, marginBottom: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy-800)' }}>{c.count}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: c.color, margin: '2px 0' }}>{c.tier}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{Math.round(c.hours).toLocaleString()} hrs</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.points} pts each</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
