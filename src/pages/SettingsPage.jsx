import { Card, CardTitle, PageHeader, Alert, Btn, Sep, TableWrap, Th, Td, SectionLabel, SavedTick, InfoNote, DeptBadge } from '../components/UI.jsx'
import { useState, useEffect, useMemo } from 'react'
import { PieChart, Clock3, Users2, MousePointerClick } from 'lucide-react'
import {
  updatecomplexityTiers,
  complexityDetails,
  deptRolesDetails,
  updateRoleMaster,
  createRoleMaster,
  deleteRoleMaster,
  tierPhaseEffortDetails,
  upsertTierPhaseEffort,
} from '../redux/services/settingsService.js'
import { useDispatch, useSelector } from 'react-redux'
import { showSnackbar } from '../utils/snackbar'

const PHASE_COLUMNS = [
  { key: 'requirements_gathering', label: 'Req. gathering' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'analysis_design', label: 'Analysis & Design' },
  { key: 'dev_ut', label: 'Dev & UT' },
  { key: 'sit', label: 'SIT' },
  { key: 'uat', label: 'UAT' },
  { key: 'cutover_golive', label: 'Cutover & Go-live' },
]

export default function SettingsPage({ complexity, setComplexity, pctTotal }) {
  const dispatch = useDispatch()
  const deptRolesData = useSelector((state) => state.complexity?.deptRolesData || [])
  const tierPhaseEffortData = useSelector((state) => state.complexity?.tierPhaseEffortData || [])
  const loading = useSelector((state) => state.complexity?.loading)
  const [newDeptId, setNewDeptId] = useState('')
  const [newRole, setNewRole] = useState('')
  const [savingRoleId, setSavingRoleId] = useState('')
  const [deletingRoleId, setDeletingRoleId] = useState('')
  const [roleEdits, setRoleEdits] = useState({});
  const [savingComplexityId, setSavingComplexityId] = useState('')
  const [phaseEdits, setPhaseEdits] = useState({})
  const [savingPhaseCell, setSavingPhaseCell] = useState('')
  const [savedFlash, setSavedFlash] = useState({})

  const flashSaved = (key) => {
    setSavedFlash((prev) => ({ ...prev, [key]: true }))
    setTimeout(() => {
      setSavedFlash((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }, 1400)
  }


  useEffect(() => {
    dispatch(deptRolesDetails())
    dispatch(tierPhaseEffortDetails())
  }, [dispatch])

  const phaseHoursByTier = useMemo(() => {
    const map = {}
    for (const row of tierPhaseEffortData) {
      if (!map[row.tier_id]) map[row.tier_id] = {}
      map[row.tier_id][row.phase_name] = row.hours
    }
    return map
  }, [tierPhaseEffortData])

  const handlePhaseCellChange = (tierId, phase, value) => {
    setPhaseEdits((prev) => ({
      ...prev,
      [tierId]: { ...prev[tierId], [phase]: value },
    }))
  }

  const handlePhaseCellSave = async (tierId, phase) => {
    const edited = phaseEdits[tierId]?.[phase]
    if (edited === undefined) return

    const cellKey = `${tierId}_${phase}`

    if (edited === '') {
      // Left blank on purpose or by accident — revert to the last saved value
      // instead of silently leaving the box empty. Type 0 to actually set zero.
      setPhaseEdits((prev) => {
        const next = { ...prev, [tierId]: { ...prev[tierId] } }
        delete next[tierId][phase]
        return next
      })
      showSnackbar('info', 'Left blank — kept the previous value. Type 0 if you want to set it to zero.')
      return
    }

    try {
      setSavingPhaseCell(cellKey)
      await dispatch(
        upsertTierPhaseEffort({
          tierId,
          payload: {
            phase_hours: { [phase]: Number(edited) },
            updated_by: 'praveen.bhima@easystepin.com',
          },
        })
      ).unwrap()
      flashSaved(cellKey)
    } catch (err) {
      console.error('Failed to update tier phase effort', err)
    } finally {
      setSavingPhaseCell('')
    }
  }

  const allRoles = useMemo(() => {
    return (deptRolesData || []).flatMap((dept) =>
      (dept.roles || []).map((role) => ({
        ...role,
        department_name: dept.department_name,
        department_id: dept.department_id,
      }))
    )
  }, [deptRolesData])

  const departmentOptions = useMemo(() => {
    return (deptRolesData || []).map((dept) => ({
      label: dept.department_name,
      value: dept.department_id,
    }))
  }, [deptRolesData])

  useEffect(() => {
    if (!newDeptId && departmentOptions.length > 0) {
      setNewDeptId(departmentOptions[0].value)
    }
  }, [departmentOptions, newDeptId])


  const pctOk = pctTotal === 100

  const updatePct = (id, val) =>
    setComplexity((prev) =>
      prev.map((c) =>
        c.complexity_tier_id === id
          ? { ...c, percentage: val === '' ? '' : Math.max(0, Math.min(100, Number(val))) }
          : c
      )
    )

  const updatePts = (id, val) =>
    setComplexity((prev) =>
      prev.map((c) =>
        c.complexity_tier_id === id
          ? { ...c, effort_points: val === '' ? '' : Math.max(1, Number(val)) }
          : c
      )
    )

  const handleComplexitySave = async (tier, field) => {
    if (tier[field] === '') {
      // Left blank — revert to the last saved value instead of saving 0 by accident.
      await dispatch(complexityDetails()).unwrap().catch(() => {})
      showSnackbar('info', 'Left blank — kept the previous value. Type 0 if you want to set it to zero.')
      return
    }

    const payload = {
      tier_name: tier.tier_name,
      percentage: Number(tier.percentage),
      effort_points: Number(tier.effort_points),
      updated_by: 'praveen.bhima@easystepin.com',
    }

    try {
      setSavingComplexityId(tier.complexity_tier_id)
      await dispatch(
        updatecomplexityTiers({
          complexityTierId: tier.complexity_tier_id,
          payload,
        })
      ).unwrap()

      await dispatch(complexityDetails()).unwrap()
      flashSaved(`${tier.complexity_tier_id}_${field}`)
    } catch (err) {
      console.error('Failed to update complexity tier', err)
    } finally {
      setSavingComplexityId('')
    }

    if (pctTotal > 100) {
      showSnackbar('error', `Complexity total is ${pctTotal}% — ${pctTotal - 100}% over 100%. Please adjust the tiers.`)
    } else if (pctTotal < 100) {
      showSnackbar('error', `Complexity total is ${pctTotal}% — ${100 - pctTotal}% short of 100%. Please adjust the tiers.`)
    }
  }

  const handleLocalRoleChange = (roleId, field, value) => {
    setRoleEdits((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [field]: value,
      },
    }));
  };

  const handleRoleFieldSave = async (role, field) => {
    const edited = roleEdits[role.role_id] || {};

    if (edited[field] === '') {
      // Left blank — revert to the last saved value instead of an invalid save.
      setRoleEdits((prev) => {
        const next = { ...prev, [role.role_id]: { ...prev[role.role_id] } }
        delete next[role.role_id][field]
        return next
      })
      showSnackbar('info', 'Left blank — kept the previous value.')
      return
    }

    const payload = {
      department_id: role.department_id,
      role_name: role.role_name,
      default_fte:
        edited.default_fte !== undefined
          ? Number(edited.default_fte)
          : Number(role.default_fte),
      sprint_from:
        edited.sprint_from !== undefined
          ? Number(edited.sprint_from)
          : Number(role.sprint_from),
      sprint_to:
        edited.sprint_to !== undefined
          ? Number(edited.sprint_to)
          : Number(role.sprint_to),
      created_by: role.created_by,
      updated_by: "praveen.bhima@easystepin.com",
      is_active: role.is_active ?? true,
    };

    if (!payload.sprint_from || !payload.sprint_to) {
      showSnackbar('warning', 'Sprint From and Sprint To must both be at least 1.')
      return;
    }
    if (payload.sprint_from > payload.sprint_to) {
      showSnackbar('warning', 'Sprint From can\'t be later than Sprint To.')
      return;
    }

    try {
      setSavingRoleId(role.role_id);
      await dispatch(
        updateRoleMaster({ roleId: role.role_id, payload })
      ).unwrap();
      await dispatch(deptRolesDetails()).unwrap();
      flashSaved(`${role.role_id}_${field}`)
    } catch (err) {
      console.error("Failed to update role", err);
    } finally {
      setSavingRoleId("");
    }
  };

  const handleRoleFieldChange = async (role, field, rawValue) => {
    const value =
      rawValue === ""
        ? ""
        : field === "default_fte"
          ? Number(rawValue)
          : parseInt(rawValue, 10);

    const payload = {
      department_id: role.department_id,
      role_name: role.role_name,
      default_fte: field === 'default_fte' ? value : Number(role.default_fte),
      sprint_from: field === 'sprint_from' ? value : Number(role.sprint_from),
      sprint_to: field === 'sprint_to' ? value : Number(role.sprint_to),
      created_by: role.created_by,
      updated_by: 'praveen.bhima@easystepin.com',
      is_active: role.is_active ?? true,
    }
    if (payload.sprint_from > payload.sprint_to) {
      return
    }

    try {
      setSavingRoleId(role.role_id)
      await dispatch(updateRoleMaster({ roleId: role.role_id, payload })).unwrap()
      dispatch(deptRolesDetails())
    } catch (err) {
      console.error('Failed to update role', err)
    } finally {
      setSavingRoleId('')
    }
  }

  const handleDeleteRole = async (roleId) => {
    try {
      setDeletingRoleId(roleId)
      await dispatch(deleteRoleMaster(roleId)).unwrap()
      dispatch(deptRolesDetails())
    } catch (err) {
      console.error('Failed to delete role', err)
    } finally {
      setDeletingRoleId('')
    }
  }

  const handleAddRole = async () => {
    if (!newDeptId || !newRole.trim()) return

    const selectedDept = departmentOptions.find((d) => d.value === newDeptId)

    const payload = {
      department_id: newDeptId,
      role_name: newRole.trim(),
      default_fte: 1,
      sprint_from: 1,
      sprint_to: 17,
      created_by: 'praveen.bhima@easystepin.com',
      updated_by: null,
      is_active: true,
    }

    try {
      await dispatch(createRoleMaster(payload)).unwrap()
      setNewRole('')
      dispatch(deptRolesDetails())
      if (selectedDept) setNewDeptId(selectedDept.value)
    } catch (err) {
      console.error('Failed to create role', err)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb={['Configuration', 'Settings']}
        title="Settings"
        subtitle="Shared configuration used by every project. Nothing here belongs to one project — it's what the calculation engine reads from whenever any project is recalculated."
      />

      {!pctOk && (
        <Alert variant="warning">
          Complexity percentages currently total {pctTotal}%. They must equal exactly 100% before calculations will run.
        </Alert>
      )}
      {pctOk && <Alert variant="success">All settings valid. Complexity totals 100%.</Alert>}

      <SectionLabel
        step={1}
        totalSteps={2}
        title="Complexity tiers — how integrations are split"
        description="Every project's total integration count is divided across these 5 tiers by percentage. All five percentages must add up to 100%."
      />

      <Card>
        <CardTitle
          action={
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: 20,
                background: pctOk ? 'var(--green-100)' : 'var(--red-100)',
                color: pctOk ? 'var(--green-700)' : 'var(--red-700)',
              }}
            >
              Total: {pctTotal}%
            </span>
          }
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <PieChart size={16} color="var(--blue-600)" />
            Complexity tiers
          </span>
        </CardTitle>

        <InfoNote icon={<MousePointerClick size={13} />}>
          Click a number to edit it, then click elsewhere to save. Leaving a box blank keeps its
          previous value — it won't be set to 0 by accident.
        </InfoNote>

        <TableWrap style={{ marginBottom: 0, }}>
          <thead>
            <tr>
              <Th>Tier</Th>
              <Th>Distribution</Th>
              <Th center>Effort Points</Th>
              <Th center>Percentage</Th>
            </tr>
          </thead>
          <tbody>
            {complexity.map((c) => (
              <tr key={c.id} className="ec-row-hover">
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, color: 'var(--navy-800)' }}>{c.tier_name}</span>
                  </div>
                </Td>

                <Td style={{ minWidth: 110 }}>
                  <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 999, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: 6,
                        width: `${c.percentage}%`,
                        background: c.color,
                        borderRadius: 999,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </Td>

                <Td center>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <input
                      className="ec-input"
                      type="number"
                      value={c.effort_points ?? ''}
                      min="1"
                      max="20"
                      style={{
                        width: 56,
                        height: 32,
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '0 6px',
                        fontSize: 13,
                        fontWeight: 700,
                        textAlign: 'center',
                        fontFamily: 'inherit',
                        color: 'var(--navy-800)',
                        background: '#fff',
                      }}
                      onChange={(e) =>
                        updatePts(c.complexity_tier_id, e.target.value)
                      }
                      onBlur={() => handleComplexitySave(c, 'effort_points')}
                      disabled={savingComplexityId === c.complexity_tier_id}
                    />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>pts</span>
                    {savedFlash[`${c.complexity_tier_id}_effort_points`] && <SavedTick />}
                  </div>
                </Td>

                <Td center>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <input
                      className="ec-input"
                      type="number"
                      value={c.percentage ?? ''}
                      min="0"
                      max="100"
                      style={{
                        width: 56,
                        height: 32,
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '0 6px',
                        fontSize: 13,
                        fontWeight: 700,
                        textAlign: 'center',
                        fontFamily: 'inherit',
                        color: 'var(--navy-800)',
                        background: '#fff',
                      }}
                      onChange={(e) =>
                        updatePct(c.complexity_tier_id, e.target.value)
                      }
                      onBlur={() => handleComplexitySave(c, 'percentage')}
                      disabled={savingComplexityId === c.complexity_tier_id}
                    />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>%</span>
                    {savedFlash[`${c.complexity_tier_id}_percentage`] && <SavedTick />}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>

        <Sep />

        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 0 }}>
          <b>Effort Points</b> is kept for reference only — it no longer drives the hour totals.
          <b> Percentage</b> is what actually decides how many integrations fall into this tier.
        </p>
      </Card>

      <SectionLabel
        step={2}
        totalSteps={2}
        connectPrev
        title="Effort hours by phase — how many hours each tier costs"
        description="For every tier, how many hours one integration takes in each of the 7 project phases. This is what the calculation engine actually adds up — not the Effort Points column above."
      />

      <Card>
        <CardTitle>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Clock3 size={16} color="var(--blue-600)" />
            Effort hours by phase
          </span>
        </CardTitle>

        <InfoNote icon={<MousePointerClick size={13} />}>
          Click a cell to edit its hours, then click elsewhere to save. Leaving a box blank keeps
          its previous value — type <code style={{ background: 'var(--blue-100)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>0</code> if you actually want zero hours for that phase.
        </InfoNote>

        <div className="ec-scroll" style={{ overflowX: 'auto' }}>
          <TableWrap style={{ marginBottom: 0, minWidth: 760 }}>
            <thead>
              <tr>
                <Th>Tier</Th>
                {PHASE_COLUMNS.map((p) => (
                  <Th key={p.key} center>{p.label}</Th>
                ))}
                <Th center>Total</Th>
              </tr>
            </thead>
            <tbody>
              {complexity.map((c) => {
                const tierId = c.complexity_tier_id
                const rowHours = phaseHoursByTier[tierId] || {}
                const total = PHASE_COLUMNS.reduce(
                  (sum, p) => sum + Number(rowHours[p.key] ?? 0),
                  0
                )

                return (
                  <tr key={tierId} className="ec-row-hover" style={{ background: `${c.color}0d` }}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 700, color: 'var(--navy-800)' }}>{c.tier_name}</span>
                      </div>
                    </Td>

                    {PHASE_COLUMNS.map((p) => {
                      const cellKey = `${tierId}_${p.key}`
                      const value = phaseEdits[tierId]?.[p.key] ?? rowHours[p.key] ?? ''

                      return (
                        <Td key={p.key} center>
                          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <input
                              className="ec-input"
                              type="number"
                              value={value}
                              min="0"
                              style={{
                                width: 56,
                                height: 30,
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                padding: '0 4px',
                                fontSize: 12,
                                fontWeight: 600,
                                textAlign: 'center',
                                fontFamily: 'inherit',
                                color: 'var(--navy-800)',
                                background: '#fff',
                              }}
                              disabled={savingPhaseCell === cellKey}
                              onChange={(e) => handlePhaseCellChange(tierId, p.key, e.target.value)}
                              onBlur={() => handlePhaseCellSave(tierId, p.key)}
                            />
                            {savedFlash[cellKey] && <SavedTick />}
                          </div>
                        </Td>
                      )
                    })}

                    <Td center>
                      <span style={{ fontWeight: 700, color: 'var(--teal-600)' }}>{total}</span>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </TableWrap>
        </div>

        <Sep />

        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 0 }}>
          Effort hours per tier = sum of its 7 phase hours × integration count. A fixed 80hr HyperCare
          line is added on top for every project automatically, and Dev &amp; UT hours drop 30% for
          any project with the Boomi AI option turned on.
        </p>
      </Card>

      <SectionLabel
        title="Staffing catalog"
        description="Independent of the two steps above — this is the list of roles a project can staff, and their default FTE / sprint range. Add roles to a specific project on the Project Input page."
      />

      <Card
        style={{
          width: "100%",
          height: 480,

          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardTitle>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Users2 size={16} color="var(--blue-600)" />
            Role master
          </span>
        </CardTitle>

        <InfoNote icon={<MousePointerClick size={13} />}>
          Click a number to edit it, then click elsewhere to save. Leaving a box blank keeps its
          previous value.
        </InfoNote>

        <div
            className="ec-scroll"
            style={{
              border: "1px solid var(--border)",
              borderRadius: 10,
              marginBottom: 14,

              flex: 1,
              minHeight: 0,
              overflowX: "hidden",
              overflowY: "auto",

              background: "#fff",
            }}
          >
            <div
              style={{
                minWidth:
                  window.innerWidth < 600
                    ? 580
                    : "100%",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "2fr 1fr 70px 88px 88px 40px",

                  background: "linear-gradient(180deg, #F8FAFC, #F0F4F8)",

                  padding: "11px 10px",

                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",

                  color: "var(--gray-600)",

                  borderBottom:
                    "2px solid var(--border)",

                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <div>Role</div>
                <div>Department</div>
                <div>FTEs</div>
                <div>Sprint From</div>
                <div>Sprint To</div>
                <div />
              </div>

              {/* Rows */}
              {allRoles.map((r, i) => {
                const disabled =
                  savingRoleId === r.role_id ||
                  deletingRoleId === r.role_id;

                return (
                  <div
                    key={r.role_id}
                    className="ec-row-hover"
                    style={{
                      display: "grid",

                      gridTemplateColumns:
                        "2fr 1fr 70px 88px 88px 40px",

                      padding: "10px 12px",

                      borderTop:
                        "1px solid var(--gray-200)",

                      alignItems: "center",

                      background:
                        i % 2 === 0
                          ? "#fff"
                          : "#FAFAFA",
                    }}
                  >
                    {/* Role */}
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",

                        paddingRight: 8,
                      }}
                    >
                      {r.role_name}
                    </div>

                    {/* Dept */}
                    <div>
                      <DeptBadge dept={r.department_name} />
                    </div>

                    {/* FTE */}
                    <input
                      className="ec-input"
                      type="number"
                      value={
                        roleEdits[r.role_id]
                          ?.default_fte ??
                        r.default_fte
                      }
                      min={0.25}
                      step={0.25}
                      style={{
                        width: 54,
                        height: 32,

                        border:
                          "1px solid var(--border)",

                        borderRadius: 8,

                        padding: "0 6px",

                        fontSize: 12,
                        fontWeight: 600,

                        textAlign: "center",

                        fontFamily: "inherit",

                        color: "var(--navy-800)",

                        background: "#fff",
                      }}
                      disabled={disabled}
                      onChange={(e) =>
                        handleLocalRoleChange(
                          r.role_id,
                          "default_fte",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleRoleFieldSave(
                          r,
                          "default_fte"
                        )
                      }
                    />

                    {/* Sprint From */}
                    <input
                      className="ec-input"
                      type="number"
                      value={
                        roleEdits[r.role_id]
                          ?.sprint_from ??
                        r.sprint_from
                      }
                      min={1}
                      step={1}
                      style={{
                        width: 54,
                        height: 32,

                        border:
                          "1px solid var(--border)",

                        borderRadius: 8,

                        padding: "0 6px",

                        fontSize: 12,
                        fontWeight: 600,

                        textAlign: "center",

                        fontFamily: "inherit",

                        color: "var(--navy-800)",

                        background: "#fff",
                      }}
                      disabled={disabled}
                      onChange={(e) =>
                        handleLocalRoleChange(
                          r.role_id,
                          "sprint_from",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleRoleFieldSave(
                          r,
                          "sprint_from"
                        )
                      }
                    />

                    {/* Sprint To */}
                    <input
                      className="ec-input"
                      type="number"
                      value={
                        roleEdits[r.role_id]
                          ?.sprint_to ??
                        r.sprint_to
                      }
                      min={1}
                      step={1}
                      style={{
                        width: 54,
                        height: 32,

                        border:
                          "1px solid var(--border)",

                        borderRadius: 8,

                        padding: "0 6px",

                        fontSize: 12,
                        fontWeight: 600,

                        textAlign: "center",

                        fontFamily: "inherit",

                        color: "var(--navy-800)",

                        background: "#fff",
                      }}
                      disabled={disabled}
                      onChange={(e) =>
                        handleLocalRoleChange(
                          r.role_id,
                          "sprint_to",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleRoleFieldSave(
                          r,
                          "sprint_to"
                        )
                      }
                    />

                    {/* Delete */}
                    <button
                      className="ec-btn"
                      onClick={() =>
                        handleDeleteRole(r.role_id)
                      }
                      disabled={disabled}
                      style={{
                        width: 30,
                        height: 30,

                        background:
                          "var(--red-100)",

                        color:
                          "var(--red-600)",

                        border:
                          "1px solid #F7C1C1",

                        borderRadius: 8,

                        cursor: "pointer",

                        fontSize: 14,
                        fontWeight: 700,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        opacity: disabled
                          ? 0.6
                          : 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Role */}
          <div
            style={{
              display: "flex",
              gap: 10,

              alignItems: "center",

              paddingTop: 12,

              borderTop:
                "1px solid var(--gray-200)",
            }}
          >
            <select
              className="ec-input"
              value={newDeptId}
              onChange={(e) =>
                setNewDeptId(e.target.value)
              }
              style={{
                height: 38,

                border:
                  "1px solid var(--border)",

                borderRadius: 8,

                padding: "0 10px",

                fontSize: 12,

                background:
                  "var(--bg-surface)",

                color:
                  "var(--text-primary)",
              }}
            >
              {departmentOptions.map((d) => (
                <option
                  key={d.value}
                  value={d.value}
                >
                  {d.label}
                </option>
              ))}
            </select>

            <input
              className="ec-input"
              value={newRole}
              onChange={(e) =>
                setNewRole(e.target.value)
              }
              placeholder="Role name"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleAddRole()
              }
              style={{
                flex: 1,

                height: 38,

                border:
                  "1px solid var(--border)",

                borderRadius: 8,

                padding: "0 12px",

                fontSize: 12,

                background:
                  "var(--bg-surface)",

                color:
                  "var(--text-primary)",
              }}
            />

            <Btn
              onClick={handleAddRole}
              variant="primary"
              style={{
                height: 38,
                minWidth: 84,
              }}
            >
              + Add
            </Btn>
          </div>
      </Card>
    </div>
  )
}