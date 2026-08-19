import { Card, CardTitle, PageHeader, Metric, Badge, TableWrap, Th, Td, Alert } from '../components/UI.jsx'
import { fmtDate } from '../useCalc.js'

const phaseBadge = p =>
  p === 'Kick-off' ? 'purple' : p === 'UAT / Deploy' ? 'red' : 'blue'

const phaseStyle = p => ({
  'Kick-off': { bg: '#EEEDFE', tc: '#3C3489' },
  'Development': { bg: '#E6F1FB', tc: '#0C447C' },
  'UAT / Deploy': { bg: '#FCEBEB', tc: '#791F1F' },
}[p] || { bg: '#F1EFE8', tc: '#444441' })

export default function SprintsPage({ numIntgs, numSprints, sprintWeeks, sprints }) {
  const devSprints = numSprints - 2
  const avgIntgs = devSprints > 0 ? Math.round(numIntgs / devSprints) : 0

  return (
    <div>
      <PageHeader
        breadcrumb={['Project', 'Sprint plan']}
        title="Sprint plan"
        subtitle={`${numSprints} sprints  ·  ${numIntgs} total integrations  ·  ${sprintWeeks}-week sprint cycle`}
      />

      <Alert variant="success">
        Plan generated. {numIntgs} integrations distributed across {devSprints} development sprints.
        Sprint-1 is kick-off and Sprint-{numSprints} is UAT / Deployment.
      </Alert>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
        <Metric value={1} label="Kick-off sprint" accent="#534AB7" />
        <Metric value={devSprints} label="Development sprints" accent="#185FA5" />
        <Metric value={1} label="UAT/Deploy sprint" accent="#A32D2D" />
        <Metric value={avgIntgs} label="Avg integrations / sprint" accent="#0F6E56" />
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>Sprint schedule</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            {['Kick-off', 'Development', 'UAT / Deploy'].map(p => {
              const s = phaseStyle(p)
              return (
                <span key={p} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.tc }}>
                  {p}
                </span>
              )
            })}
          </div>
        </div>
        <TableWrap style={{ border: 'none', borderRadius: 0 }}>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Phase</Th>
              <Th>Weeks</Th>
              <Th>Date range</Th>
              <Th center>FTEs</Th>
              <Th center>Very Complex</Th>
              <Th center>Complex</Th>
              <Th center>Medium</Th>
              <Th center>Simple</Th>
              <Th center>Very Simple</Th>
              <Th center>Total</Th>
              <Th center>Effort Hours</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {sprints.map((s, i) => {
              const ps = phaseStyle(s.phase)
              return (
                <tr key={s.num} style={{ background: i % 2 === 0 ? '#fff' : 'var(--gray-50)' }}>
                  <Td>
                    <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--navy-800)' }}>S{s.num}</span>
                  </Td>
                  <Td>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 12, background: ps.bg, color: ps.tc, whiteSpace: 'nowrap' }}>
                      {s.phase}
                    </span>
                  </Td>
                  <Td style={{ fontSize: 11 }}>W{s.wFrom}–W{s.wTo}</Td>
                  <Td style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                    {fmtDate(s.sd)} – {fmtDate(s.ed)}
                  </Td>
                  <Td center bold>{s.activeFte}</Td>
                  <Td center style={{ color: s.intgVC > 0 ? 'var(--navy-800)' : 'var(--gray-300)' }}>{s.intgVC}</Td>
                  <Td center style={{ color: s.intgC > 0 ? 'var(--navy-800)' : 'var(--gray-300)' }}>{s.intgC}</Td>
                  <Td center style={{ color: s.intgM > 0 ? 'var(--navy-800)' : 'var(--gray-300)' }}>{s.intgM}</Td>
                  <Td center style={{ color: s.intgS > 0 ? 'var(--navy-800)' : 'var(--gray-300)' }}>{s.intgS}</Td>
                  <Td center style={{ color: s.intgVS > 0 ? 'var(--navy-800)' : 'var(--gray-300)' }}>{s.intgVS}</Td>
                  <Td center bold>{s.totalIntg}</Td>
                  <Td center>{s.effortHrs > 0 ? s.effortHrs.toLocaleString() : '—'}</Td>
                  <Td>
                    <Badge variant={s.totalIntg > 0 ? 'green' : s.phase !== 'Development' ? 'purple' : 'gray'}>
                      {s.phase === 'Kick-off' ? 'Kick-off' : s.phase === 'UAT / Deploy' ? 'Deploy' : s.totalIntg > 0 ? 'Active' : '—'}
                    </Badge>
                  </Td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--navy-800)' }}>
              <td colSpan={10} style={{ padding: '9px 12px', color: '#fff', fontWeight: 700, fontSize: 12 }}>Total integrations</td>
              <td style={{ padding: '9px 12px', textAlign: 'center', color: '#5DCAA5', fontWeight: 700, fontSize: 13 }}>{numIntgs}</td>
              <td colSpan={2} style={{ padding: '9px 12px', color: '#7FB3D3', fontSize: 12 }}>across {devSprints} dev sprints</td>
            </tr>
          </tfoot>
        </TableWrap>
      </Card>
    </div>
  )
}
