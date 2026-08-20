import { Card, CardTitle, PageHeader, Alert, Btn, FormGroup, Input, Select, Badge, TableWrap, Th, Td } from '../components/UI.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import {
  getComplexityFactors,
  listIntegrationAssessments,
  createIntegrationAssessment,
  updateIntegrationAssessment,
  deleteIntegrationAssessment,
} from '../redux/services/integrationService.js'

const TIER_BADGE_VARIANT = {
  'Very Simple': 'gray',
  'Simple': 'blue',
  'Medium': 'amber',
  'Complex': 'purple',
  'Very Complex': 'red',
}

export default function IntegrationsPage({ projectId, complexity }) {
  const dispatch = useDispatch()

  const factors = useSelector((state) => state.integration?.factors || [])
  const assessments = useSelector((state) => state.integration?.assessments || [])
  const loading = useSelector((state) => state.integration?.loading)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [integrationName, setIntegrationName] = useState('')
  const [selections, setSelections] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState('')

  useEffect(() => {
    dispatch(getComplexityFactors())
  }, [dispatch])

  useEffect(() => {
    if (projectId) {
      dispatch(listIntegrationAssessments(projectId))
    }
  }, [dispatch, projectId])

  const tierColor = (tierName) => {
    const tier = (complexity || []).find((c) => c.tier_name === tierName)
    return tier?.color || 'var(--gray-400)'
  }

  const resetForm = () => {
    setEditingId(null)
    setIntegrationName('')
    setSelections({})
    setShowForm(false)
  }

  const handleSelect = (factorId, optionId) => {
    setSelections((prev) => {
      if (!optionId) {
        const next = { ...prev }
        delete next[factorId]
        return next
      }
      return { ...prev, [factorId]: optionId }
    })
  }

  const handleEdit = (assessment) => {
    setEditingId(assessment.id)
    setIntegrationName(assessment.integration_name || '')
    const map = {}
    for (const sel of assessment.selections || []) {
      map[sel.factor_id] = sel.option_id
    }
    setSelections(map)
    setShowForm(true)
  }

  const handleDelete = async (assessmentId) => {
    if (!projectId) return
    try {
      setDeletingId(assessmentId)
      await dispatch(deleteIntegrationAssessment({ projectId, assessmentId })).unwrap()
    } catch (err) {
      console.error('Failed to delete assessment', err)
    } finally {
      setDeletingId('')
    }
  }

  const handleSubmit = async () => {
    if (!projectId || !integrationName.trim()) return

    const payload = {
      integration_name: integrationName.trim(),
      selections,
      created_by: 'praveen.bhima@easystepin.com',
      updated_by: 'praveen.bhima@easystepin.com',
    }

    try {
      setSubmitting(true)
      if (editingId) {
        await dispatch(
          updateIntegrationAssessment({ projectId, assessmentId: editingId, payload })
        ).unwrap()
      } else {
        await dispatch(createIntegrationAssessment({ projectId, payload })).unwrap()
      }
      resetForm()
    } catch (err) {
      console.error('Failed to save assessment', err)
    } finally {
      setSubmitting(false)
    }
  }

  const answeredCount = (assessment) => (assessment.selections || []).length

  if (!projectId) {
    return (
      <div>
        <PageHeader
          breadcrumb={['Project', 'Integration assessments']}
          title="Integration assessments"
        />
        <Alert variant="warning">
          Create a project on the Project input page first, then come back here to assess its
          integrations.
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        breadcrumb={['Project', 'Integration assessments']}
        title="Integration assessments"
        subtitle="Score each integration against the technical factors below to auto-classify its complexity."
      />

      <Alert variant="info">
        Once integrations are assessed here, they replace the percentage split on Settings for
        effort calculations — recalculate the project after adding or editing an assessment.
      </Alert>

      <Card>
        <CardTitle
          action={
            <Btn
              variant={showForm ? 'secondary' : 'primary'}
              onClick={() => (showForm ? resetForm() : setShowForm(true))}
            >
              {showForm ? 'Cancel' : '+ New assessment'}
            </Btn>
          }
        >
          {editingId ? 'Edit assessment' : 'New assessment'}
        </CardTitle>

        {showForm && (
          <div>
            <div style={{ maxWidth: 420, marginBottom: 16 }}>
              <FormGroup label="Integration name">
                <Input
                  type="text"
                  value={integrationName}
                  onChange={(e) => setIntegrationName(e.target.value)}
                  placeholder="e.g. SFDC → SAP Order Sync"
                />
              </FormGroup>
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
              Answer as many factors as apply — unanswered factors are simply left out of scoring.
            </p>

            <div
              className="ec-scroll"
              style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 900 ? '1fr' : window.innerWidth < 1300 ? '1fr 1fr' : '1fr 1fr 1fr',
                gap: 14,
                maxHeight: 460,
                overflowY: 'auto',
                paddingRight: 6,
                marginBottom: 16,
              }}
            >
              {factors.map((factor) => (
                <FormGroup key={factor.id} label={factor.name}>
                  <Select
                    value={selections[factor.id] || ''}
                    onChange={(e) => handleSelect(factor.id, e.target.value)}
                  >
                    <option value="">— not assessed —</option>
                    {(factor.options || []).map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.option_label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Btn variant="secondary" onClick={resetForm}>Cancel</Btn>
              <Btn
                variant="navy"
                onClick={handleSubmit}
                disabled={submitting || !integrationName.trim()}
              >
                {submitting ? 'Saving...' : editingId ? 'Update assessment' : 'Save assessment'}
              </Btn>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Assessed integrations</CardTitle>

        {assessments.length === 0 ? (
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            No integrations assessed yet — the project still uses the percentage split from Settings.
          </p>
        ) : (
          <TableWrap style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <Th>Integration</Th>
                <Th center>Final complexity</Th>
                <Th center>Factors answered</Th>
                <Th center>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id} className="ec-row-hover">
                  <Td>{a.integration_name}</Td>
                  <Td center>
                    {a.final_complexity ? (
                      <Badge
                        variant={TIER_BADGE_VARIANT[a.final_complexity] || 'gray'}
                        style={{ background: undefined }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: tierColor(a.final_complexity) }} />
                          {a.final_complexity}
                        </span>
                      </Badge>
                    ) : (
                      <Badge variant="gray">Unclassified</Badge>
                    )}
                  </Td>
                  <Td center>{answeredCount(a)} / {factors.length}</Td>
                  <Td center>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <Btn variant="secondary" style={{ height: 30, padding: '0 12px', fontSize: 11.5 }} onClick={() => handleEdit(a)}>
                        Edit
                      </Btn>
                      <Btn
                        variant="danger"
                        style={{ height: 30, padding: '0 12px', fontSize: 11.5 }}
                        disabled={deletingId === a.id}
                        onClick={() => handleDelete(a.id)}
                      >
                        {deletingId === a.id ? 'Deleting...' : 'Delete'}
                      </Btn>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>
    </div>
  )
}
