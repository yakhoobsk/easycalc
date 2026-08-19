import { useEffect, useMemo, useState } from 'react'
import { Card, CardTitle, PageHeader, Alert, Badge } from '../components/UI.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { dashboardDetails } from '../redux/services/dashboardService.js'
import {
  exportBRDToDocx,
  exportBRDToPdf,
  exportBRDToPptx,
  exportBRDToXlsx,
  exportBRDToCsv,
  exportBRDToPng,
  exportBRDToTxt,
} from '../utils/exportHelpers.js'

export default function ExportPage({ brdState, projectId }) {
  const [loadingType, setLoadingType] = useState(null)
  const [done, setDone] = useState('')
  const [error, setError] = useState(null)

  const dispatch = useDispatch()
  const dashboardData = useSelector((state) => state.dashboard?.dashboardData || {})
  const summaryCards = dashboardData?.summary_cards || {}
  const resourceAllocationTable = dashboardData?.resource_allocation_table || []
  const sprintPlanTable = dashboardData?.sprint_plan_table || []
  const complexityDistribution =
    dashboardData?.complexity_distribution?.data || []

  useEffect(() => {
    if (projectId) {
      dispatch(dashboardDetails(projectId))
    }
  }, [dispatch, projectId])

  const exportData = useMemo(() => {
    return {
      project: {
        projectId: summaryCards?.project_id || projectId || '',
        projectName: summaryCards?.project_name || brdState?.projectName || 'Project',
        clientName: summaryCards?.client_name || brdState?.client || '',
        totalIntegrations: summaryCards?.total_integrations || brdState?.numIntgs || 0,
        totalSprints: summaryCards?.total_sprints || brdState?.numSprints || 0,
        totalWeeks: summaryCards?.total_weeks || 0,
        totalHours: summaryCards?.total_project_hours || 0,
        totalFtes: summaryCards?.total_ftes || 0,
      },
      resourceAllocationTable,
      sprintPlanTable,
      complexityDistribution,
      raw: {
        brdState,
        dashboardData,
      },
    }
  }, [summaryCards, projectId, brdState, resourceAllocationTable, sprintPlanTable, complexityDistribution, dashboardData])

  const hasProjectData = Boolean(
    exportData.project.projectName &&
    (
      exportData.project.totalIntegrations ||
      resourceAllocationTable.length ||
      sprintPlanTable.length ||
      complexityDistribution.length
    )
  )

  const handleExport = async (type) => {
    setLoadingType(type)
    setDone('')
    setError(null)

    try {
      if (type === 'docx') {
        await exportBRDToDocx(exportData)
        setDone('Word document downloaded successfully.')
      } else if (type === 'pdf') {
        await exportBRDToPdf(exportData)
        setDone('PDF downloaded successfully.')
      } else if (type === 'pptx') {
        await exportBRDToPptx(exportData)
        setDone('PowerPoint downloaded successfully.')
      } else if (type === 'xlsx') {
        await exportBRDToXlsx(exportData)
        setDone('Excel file downloaded successfully.')
      } else if (type === 'csv') {
        await exportBRDToCsv(exportData)
        setDone('CSV file downloaded successfully.')
      } else if (type === 'png') {
        await exportBRDToPng(exportData)
        setDone('PNG chart downloaded successfully.')
      }
    } catch (e) {
      console.error(e)
      setError(e?.message || 'Export failed')
    } finally {
      setLoadingType(null)
    }
  }

  const formats = [
    {
      icon: '📗',
      label: 'Excel spreadsheet (.xlsx)',
      ext: '.xlsx',
      badge: 'green',
      desc: 'Detailed spreadsheet with project metrics, sprint plans, resources, and complexity data.',
      action: () => handleExport('xlsx'),
      key: 'xlsx',
    },
    {
      icon: '📑',
      label: 'CSV file (.csv)',
      ext: '.csv',
      badge: 'orange',
      desc: 'Comma-separated project data for Excel, reporting, and analytics tools.',
      action: () => handleExport('csv'),
      key: 'csv',
    },
    {
      icon: '🖼️',
      label: 'PNG chart (.png)',
      ext: '.png',
      badge: 'gray',
      desc: 'Download complexity distribution bar chart as PNG image for presentations and reports.',
      action: () => handleExport('png'),
      key: 'png',
    },
    {
      icon: '📄',
      label: 'Word document (.docx)',
      ext: '.docx',
      badge: 'blue',
      desc: 'Full BRD with project summary, complexity distribution, resource allocation, and sprint plan.',
      action: () => handleExport('docx'),
      key: 'docx',
    },
    {
      icon: '📕',
      label: 'PDF document (.pdf)',
      ext: '.pdf',
      badge: 'green',
      desc: 'Printable PDF summary with current project metrics and allocation details.',
      action: () => handleExport('pdf'),
      key: 'pdf',
    },
    {
      icon: '📊',
      label: 'PowerPoint deck (.pptx)',
      ext: '.pptx',
      badge: 'purple',
      desc: 'Presentation deck with project snapshot, complexity, resources, and sprint summary.',
      action: () => handleExport('pptx'),
      key: 'pptx',
    },

  ]

  const snapshotCards = [
    ['Integrations', exportData.project.totalIntegrations],
    ['Sprints', exportData.project.totalSprints],
    ['Total hours', Math.round(exportData.project.totalHours || 0).toLocaleString()],
    ['Total FTEs', exportData.project.totalFtes],
  ]

  return (
    <div>
      <PageHeader
        breadcrumb={['Outputs', 'Export']}
        title="Export plan"
        subtitle="Download your project outputs as Word, PDF, or PowerPoint."
      />

      {done && <Alert variant="success">{done}</Alert>}
      {error && <Alert variant="danger">Export failed: {error}</Alert>}
      {!hasProjectData && (
        <Alert variant="warning">
          Project data is not fully loaded yet. Please calculate the plan first.
        </Alert>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {formats.map((f, i) => (
          <Card
            key={i}
            style={{
              textAlign: 'center',
              padding: '28px 22px',
              border: '1px solid var(--border)',
              position: 'relative',
              marginBottom: 0,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 8 }}>
              {f.label}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>
              {f.desc}
            </div>

            <button
              onClick={f.action}
              disabled={!hasProjectData || loadingType !== null}
              style={{
                width: '100%',
                height: 38,
                background: !hasProjectData || loadingType !== null ? 'var(--gray-300)' : 'var(--navy-800)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: !hasProjectData || loadingType !== null ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loadingType === f.key ? 'Generating…' : `Download ${f.ext} ↓`}
            </button>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle>Current project snapshot</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {snapshotCards.map(([label, value]) => (
            <div
              key={label}
              style={{
                background: 'var(--gray-50)',
                borderRadius: 8,
                padding: '12px 14px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy-800)' }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Export contents</CardTitle>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          <div>
            <Badge variant="blue">DOCX</Badge>
            <div style={{ fontSize: 12, marginTop: 8, color: 'var(--text-secondary)' }}>
              Executive summary, complexity table, resource allocation, sprint plan
            </div>
          </div>

          <div>
            <Badge variant="green">PDF</Badge>
            <div style={{ fontSize: 12, marginTop: 8, color: 'var(--text-secondary)' }}>
              Printable summary, project metrics, complexity and resource details
            </div>
          </div>

          <div>
            <Badge variant="purple">PPTX</Badge>
            <div style={{ fontSize: 12, marginTop: 8, color: 'var(--text-secondary)' }}>
              Snapshot slides, resource summary, sprint overview
            </div>
          </div>

          <div>
            <Badge variant="green">XLSX</Badge>
            <div style={{ fontSize: 12, marginTop: 8, color: 'var(--text-secondary)' }}>
              Spreadsheet export with complete project tables and calculations
            </div>
          </div>

          <div>
            <Badge variant="orange">CSV</Badge>
            <div style={{ fontSize: 12, marginTop: 8, color: 'var(--text-secondary)' }}>
              Flat tabular export for analytics, Excel, and reporting tools
            </div>
          </div>

          <div>
            <Badge variant="gray">PNG</Badge>
            <div style={{ fontSize: 12, marginTop: 8, color: 'var(--text-secondary)' }}>
              Download analytics bar chart as PNG image for presentations and reports
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}