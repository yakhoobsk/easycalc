import { Card, CardTitle, PageHeader, Alert, Btn, FormGroup, Input, Select } from '../components/UI.jsx'
import { DEPT_COLORS } from '../constants.js'
import { projectCalc, updateProject, updateProjectRoles } from '../redux/services/inputService.js'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Stepper({ step }) {
  const steps = ['Settings', 'Parameters', 'Team', 'Review']

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 22 }}>
      {steps.map((s, i) => (
        <div
          key={s}
          style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                background:
                  i < step
                    ? 'var(--teal-600)'
                    : i === step
                      ? 'var(--blue-700)'
                      : 'var(--gray-200)',
                color: i <= step ? '#fff' : 'var(--gray-500)',
                border: 'none',
                flexShrink: 0,
              }}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color:
                  i === step
                    ? 'var(--navy-800)'
                    : i < step
                      ? 'var(--teal-600)'
                      : 'var(--text-muted)',
              }}
            >
              {s}
            </span>
          </div>

          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 1,
                background: i < step ? 'var(--teal-400)' : 'var(--border)',
                margin: '0 10px',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function InputPage({
  numIntgs,
  setNumIntgs,
  numSprints,
  setNumSprints,
  sprintWeeks,
  setSprintWeeks,
  startDate,
  setStartDate,
  projectName,
  setProjectName,
  projectId,
  client,
  setClient,
  roles,
  setRoles,
  setPage,
  pctTotal,
}) {
  const dispatch = useDispatch()

  const calcLoading = useSelector((state) => state.projectCalc?.loading);
  const [savingDraft, setSavingDraft] = useState(false)
  const [calculating, setCalculating] = useState(false)

  const pctOk = pctTotal === 100;

  const editableRoles = useMemo(() => {
    return roles?.length ? roles : {}
  }, [roles])

  const updateRole = (id, field, rawValue) => {
    setRoles((prev) =>
      (prev || []).map((r) =>
        r.role_id === id
          ? {
            ...r,
            [field]: rawValue,
          }
          : r
      )
    )
  }

  const normalizeRole = (role) => {
    const ftes = role.fte === '' ? '' : Math.max(0.25, Number(role.ftes || 0.25))
    let from = role.active_from_sprint === '' ? '' : Math.max(1, Number(role.active_from_sprint || 1))
    let to =
      role.active_to_sprint === ''
        ? ''
        : Math.max(1, Number(role.active_to_sprint || (from || 1)))

    if (from !== '' && to !== '' && from > to) {
      to = from
    }

    return {
      ...role,
      ftes,
      active_from_sprint: from,
      active_to_sprint: to,
    }
  }

  const handleRoleBlur = (roleId) => {
    setRoles((prev) =>
      (prev || []).map((item) =>
        item.role_id === roleId ? normalizeRole(item) : item
      )
    )
  }

  const teamRows = useMemo(() => {
    return (editableRoles || []).map((r) => {
      const ftes = Number(r.ftes ?? 0)
      const active_from_sprint = Number(r.active_from_sprint ?? 0)
      const active_to_sprint = Number(r.active_to_sprint ?? 0)
      const sprintDuration = Number(sprintWeeks ?? 2)
      const safeFtes = Number.isFinite(ftes) ? ftes : 0
      const safeFrom = Number.isFinite(active_from_sprint) ? active_from_sprint : 0
      const safeTo = Number.isFinite(active_to_sprint) ? active_to_sprint : 0
      const safeSprintDuration = Number.isFinite(sprintDuration) ? sprintDuration : 0
      const active = safeFrom > 0 && safeTo >= safeFrom
        ? (safeTo - safeFrom + 1)
        : 0

      const hrs = safeFtes * active * safeSprintDuration * 40

      return {
        ...r,
        active,
        hrs: Number.isFinite(hrs) ? hrs : 0,
      }
    })
  }, [editableRoles, sprintWeeks])

  const buildProjectPayload = () => ({
    project_name: projectName,
    client_name: client,
    total_integrations: Number(numIntgs),
    sprint_count: Number(numSprints),
    sprint_duration_weeks: Number(sprintWeeks),
    start_date: startDate,
    updated_by: "praveen.bhima@easystepin.com",
  })

  const buildProjectRolesPayload = () => ({
    project_roles: (roles || []).map((r) => ({
      role_id: r.role_id,
      ftes: Number(r.ftes),
      active_from_sprint: Number(r.active_from_sprint),
      active_to_sprint: Number(r.active_to_sprint),
    })),
    updated_by: "praveen.bhima@easystepin.com",
  })

  const handleCalculatePlan = async () => {
    try {
      let savedProjectId = projectId

      if (!savedProjectId) {
        const createPayload = {
          ...buildProjectPayload(),
          project_roles: (roles || []).map((r) => ({
            role_id: r.role_id,
            ftes: Number(r.ftes),
            active_from_sprint: Number(r.active_from_sprint),
            active_to_sprint: Number(r.active_to_sprint),
          })),
        }

        const created = await dispatch(createProject(createPayload)).unwrap()
        savedProjectId = created?.project_id || created?.id
      } else {
        await dispatch(
          updateProject({
            projectId: savedProjectId,
            payload: buildProjectPayload(),
          })
        ).unwrap()

        await dispatch(
          updateProjectRoles({
            projectId: savedProjectId,
            payload: buildProjectRolesPayload(),
          })
        ).unwrap()
      }

      if (!savedProjectId) {
        throw new Error("Project ID not found")
      }

      await dispatch(projectCalc(savedProjectId)).unwrap()
      setPage("resources")
    } catch (err) {
      console.error("Calculation failed", err)
    }
  }

  // const handleSaveDraft = async () => {
  //   try {
  //     const payload = {
  //       project_name: projectName,
  //       client_name: client,
  //       total_integrations: Number(numIntgs),
  //       sprint_count: Number(numSprints),
  //       sprint_duration_weeks: Number(sprintWeeks),
  //       start_date: startDate,
  //       status: "draft",
  //       project_roles: (roles || []).map((r) => ({
  //         role_id: r.role_id,
  //         ftes: Number(r.ftes),
  //         active_from_sprint: Number(r.active_from_sprint),
  //         active_to_sprint: Number(r.active_to_sprint),
  //       })),
  //     };

  //     if (projectId) {
  //       await dispatch(updateProject({ projectId, payload })).unwrap();
  //     } else {
  //       await dispatch(createProject(payload)).unwrap();
  //     }
  //   } catch (err) {
  //     console.error("Save draft failed", err);
  //   }
  // };
  return (
    <div>
      <PageHeader
        breadcrumb={['Project', 'Project input']}
        title="New project"
        subtitle="Enter project parameters to generate the resource plan and sprint schedule."
      />

      <div
        style={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            minWidth: 320,
          }}
        >
          <Stepper step={1} />
        </div>
      </div>

      {!pctOk && (
        <Alert variant="warning">
          Settings complexity total is {pctTotal}%. Go to Settings and correct before calculating.
        </Alert>
      )}

      <Card>
        <CardTitle>Core parameters</CardTitle>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
            gap: 14
          }}
        >
          <FormGroup label="Project name">
            <Input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Client / account">
            <Input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Number of integrations" hint="Total integration deliverables in scope">
            <Input
              type="number"
              value={numIntgs}
              min="1"
              onChange={(e) =>
                setNumIntgs(
                  e.target.value === '' ? '' : Math.max(1, Number(e.target.value))
                )
              }
            />
          </FormGroup>

          <FormGroup label="Project start date" hint="Auto-aligns to next Monday">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Number of sprints" hint="Including kick-off + UAT sprints">
            <Input
              type="number"
              value={numSprints}
              min="3"
              max="40"
              onChange={(e) =>
                setNumSprints(
                  e.target.value === '' ? '' : Math.max(3, Number(e.target.value))
                )
              }
            />
          </FormGroup>

          <FormGroup label="Sprint duration">
            <Select
              value={sprintWeeks ?? 2}
              onChange={(e) => setSprintWeeks(Number(e.target.value))}
            >
              <option value={1}>1 week</option>
              <option value={2}>2 weeks (default)</option>
              <option value={3}>3 weeks</option>
              <option value={4}>4 weeks</option>
            </Select>
          </FormGroup>
        </div>
      </Card>

      <Card>
        <CardTitle>Team composition</CardTitle>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          Set FTEs and sprint participation range per role.
        </p>

        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflowX: 'auto'
          }}
        >
          {/* ✅ FORCE MIN WIDTH SO IT DOESN'T SHRINK */}
          <div style={{ minWidth: 600 }}>

            {/* HEADER */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                background: 'linear-gradient(180deg, #F8FAFC, #F0F4F8)',
                padding: '11px 12px',
                fontSize: 10.5,
                fontWeight: 700,
                color: 'var(--gray-600)',
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                borderBottom: '2px solid var(--border)',
              }}
            >
              <div>Role</div>
              <div>Department</div>
              <div>FTEs</div>
              <div>Sprint From</div>
              <div>Sprint To</div>
              <div>Active Hours</div>
            </div>

            {/* ROWS */}
            {teamRows.map((r, i) => {
              const dc = DEPT_COLORS[r.department_name] || DEPT_COLORS.PM

              return (
                <div
                  key={r.role_id}
                  className="ec-row-hover"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    padding: '8px 12px',
                    borderTop: '1px solid var(--gray-200)',
                    alignItems: 'center',
                    background: i % 2 === 0 ? '#fff' : 'var(--gray-50)',
                  }}
                >
                  {/* Role */}
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {r.role_name}
                  </div>

                  {/* Department */}
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 12,
                        background: dc.bg,
                        color: dc.text,
                      }}
                    >
                      {r.department_name}
                    </span>
                  </div>

                  {/* FTE */}
                  <input
                    className="ec-input"
                    type="number"
                    value={r.ftes ?? ''}
                    min={0.25}
                    max={20}
                    step={0.25}
                    onChange={(e) => updateRole(r.role_id, 'ftes', e.target.value)}
                    onBlur={() => handleRoleBlur(r.role_id)}
                    style={{
                      width: 52,
                      height: 28,
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '0 6px',
                      fontSize: 12,
                      textAlign: 'center',
                      color: 'var(--navy-800)',
                    }}
                  />

                  {/* From */}
                  <input
                    className="ec-input"
                    type="number"
                    value={r.active_from_sprint ?? ''}
                    min={1}
                    max={numSprints || 40}
                    step={1}
                    onChange={(e) =>
                      updateRole(r.role_id, 'active_from_sprint', e.target.value)
                    }
                    onBlur={() => handleRoleBlur(r.role_id)}
                    style={{
                      width: 52,
                      height: 28,
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      textAlign: 'center',
                    }}
                  />

                  {/* To */}
                  <input
                    className="ec-input"
                    type="number"
                    value={r.active_to_sprint ?? ''}
                    min={1}
                    max={numSprints || 40}
                    step={1}
                    onChange={(e) =>
                      updateRole(r.role_id, 'active_to_sprint', e.target.value)
                    }
                    onBlur={() => handleRoleBlur(r.role_id)}
                    style={{
                      width: 52,
                      height: 28,
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      textAlign: 'center',
                    }}
                  />

                  {/* Hours */}
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--teal-600)' }}>
                    {Math.round(Number(r.hrs || 0)).toLocaleString()} hrs
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>

        {/* <Btn variant="secondary" onClick={handleSaveDraft} disabled={savingDraft}>
          {savingDraft ? 'Saving...' : 'Save draft'}
        </Btn> */}

        <Btn variant="navy" onClick={handleCalculatePlan} disabled={!pctOk || calcLoading}>
          {calcLoading ? "Calculating..." : "Calculate plan →"}
        </Btn>
      </div>
    </div>
  )
}