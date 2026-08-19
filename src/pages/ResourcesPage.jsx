import { Card, CardTitle, PageHeader, Metric, Badge, DeptBadge, ProgBar, TableWrap, Th, Td } from '../components/UI.jsx'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { complexityDistributionDetails, resourceDetails } from '../redux/services/resourceService.js'

export default function ResourcesPage({ numIntgs, numSprints, sprintWeeks, resourceRows, complexityRows, totalProjectHrs, totalFte, weeks, projectName, projectId }) {
  const dispatch = useDispatch()
  const resourceData = useSelector((state) => state.resource?.resourceData?.data || {})
  const summaryData = useSelector((state) => state.resource?.resourceData?.summary || {})
  const complexityDist = useSelector((state) => state.resource?.complexityDistributionData || []);

  useEffect(() => {
    if (projectId) {
      dispatch(resourceDetails(projectId))
      dispatch(complexityDistributionDetails(projectId));
    }
  }, [dispatch, projectId])

  return (
    <div>
      <PageHeader
        breadcrumb={['Project', 'Resources']}
        title="Resource allocation"
        subtitle={`${summaryData?.project_name}  ·  ${summaryData?.total_integrations} integrations  ·  ${summaryData?.total_sprints} sprints`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
        <Metric value={Math.round(summaryData?.total_project_hours).toLocaleString()} label="Total hours" accent="#185FA5" delta={`Over ${summaryData?.total_weeks} weeks`} />
        <Metric value={summaryData?.total_ftes} label="Total FTEs" accent="#0F6E56" />
        <Metric value={summaryData?.total_integrations} label="Integrations" accent="#534AB7" />
        <Metric value={summaryData?.total_weeks} label="Duration (weeks)" accent="#854F0B" />
      </div>

      <Card>
        <CardTitle>Role allocation table</CardTitle>
        <TableWrap>
          <thead>
            <tr>
              <Th>Department</Th>
              <Th>Role</Th>
              <Th center>FTEs</Th>
              <Th center>Sprint from</Th>
              <Th center>Sprint to</Th>
              <Th center>Active sprints</Th>
              <Th center>Hrs / week</Th>
              <Th center>Total hours</Th>
              <Th>% effort</Th>
            </tr>
          </thead>
          <tbody>
            {resourceData && resourceData.length > 0 && resourceData?.map((r, i) => (
              <tr key={r.project_role_id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--gray-50)' }}>
                <Td><DeptBadge dept={r.department} /></Td>
                <Td bold>{r.role_name}</Td>
                <Td center>{r.ftes}</Td>
                <Td center>S{r.active_from_sprint}</Td>
                <Td center>S{r.active_to_sprint}</Td>
                <Td center>{r.active_sprints}</Td>
                <Td center>{Math.round(r.hours_per_week)}</Td>
                <Td center bold>{Math.round(r.total_hours).toLocaleString()}</Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ProgBar pct={r.percentage} height={5} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--navy-800)', minWidth: 38 }}>
                      {r.percentage?.toFixed(1)}%
                    </span>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--navy-800)' }}>
              <td colSpan={6} style={{ padding: '9px 12px', color: '#fff', fontWeight: 700, fontSize: 12 }}>Total</td>
              <td style={{ padding: '9px 12px', textAlign: 'center', color: '#5DCAA5', fontWeight: 700, fontSize: 12 }}>
                {Math.round(summaryData?.total_ftes * (summaryData?.total_weeks || 2) * 40)}
              </td>
              <td style={{ padding: '9px 12px', textAlign: 'center', color: '#5DCAA5', fontWeight: 700, fontSize: 12 }}>
                {Math.round(summaryData?.total_project_hours).toLocaleString()}
              </td>
              <td style={{ padding: '9px 12px', color: '#fff', fontWeight: 700, fontSize: 12 }}>100%</td>
            </tr>
          </tfoot>
        </TableWrap>
      </Card>

      <Card>
        <CardTitle>Complexity distribution</CardTitle>
        <TableWrap>
          <thead>
            <tr>
              <Th>Tier</Th>
              <Th center>% split</Th>
              <Th center>Integrations</Th>
              <Th center>Effort pts</Th>
              <Th center>Total effort hrs</Th>
              <Th>Seniority level</Th>
            </tr>
          </thead>
          <tbody>
            {complexityDist.map((c, i) => (
              <tr key={c.tier_id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--gray-50)' }}>
                <Td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, display: 'inline-block', flexShrink: 0 }} />
                    {c.tier}
                  </span>
                </Td>
                <Td center bold>{c.percentage?.toFixed(1)}%</Td>
                <Td center bold>{c.count}</Td>
                <Td center>{c.effort_points}</Td>
                <Td center bold>{Math.round(c.total_effort_hours).toLocaleString()}</Td>
                <Td>
                  <Badge variant={c.tier === 'Complex' || c.tier === 'Very Complex' ? 'purple' : c.tier === 'Medium' ? 'blue' : 'gray'}>
                    {c.tier === 'Complex' || c.tier === 'Very Complex' ? 'Sr developer' : c.tier === 'Medium' ? 'Sr + Developer' : 'Developer / Assoc.'}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--gray-100)' }}>
              <td style={{ padding: '8px 12px', fontWeight: 700, fontSize: 12, color: 'var(--navy-800)' }}>Total</td>
              <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, fontSize: 12, color: 'var(--navy-800)' }}>100%</td>
              <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, fontSize: 12, color: 'var(--navy-800)' }}>
                {complexityDist.reduce((a, c) => a + c.count, 0)}
              </td>
              <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: 'var(--gray-500)' }}>—</td>
              <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, fontSize: 12, color: 'var(--navy-800)' }}>
                {Math.round(complexityDist.reduce((a, c) => a + c.total_effort_hours, 0)).toLocaleString()}
              </td>
              <td />
            </tr>
          </tfoot>
        </TableWrap>
      </Card>
    </div>
  )
}
