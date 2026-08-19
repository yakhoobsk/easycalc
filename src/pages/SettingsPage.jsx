import { Card, CardTitle, PageHeader, Alert, Btn, Sep, TableWrap, Th, Td } from '../components/UI.jsx'
import { DEPT_COLORS } from '../constants.js'
import { useState, useEffect, useMemo } from 'react'
import {
  updatecomplexityTiers,
  complexityDetails,
  deptRolesDetails,
  updateRoleMaster,
  createRoleMaster,
  deleteRoleMaster,
} from '../redux/services/settingsService.js'
import { useDispatch, useSelector } from 'react-redux'
import { showSnackbar } from '../utils/snackbar'

export default function SettingsPage({ complexity, setComplexity, pctTotal }) {
  const dispatch = useDispatch()
  const deptRolesData = useSelector((state) => state.complexity?.deptRolesData || [])
  const loading = useSelector((state) => state.complexity?.loading)
  const [newDeptId, setNewDeptId] = useState('')
  const [newRole, setNewRole] = useState('')
  const [savingRoleId, setSavingRoleId] = useState('')
  const [deletingRoleId, setDeletingRoleId] = useState('')
  const [roleEdits, setRoleEdits] = useState({});
  const [savingComplexityId, setSavingComplexityId] = useState('')


  useEffect(() => {
    dispatch(deptRolesDetails())
  }, [dispatch])

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

  const handleComplexitySave = async (tier) => {
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

    if (!payload.sprint_from || !payload.sprint_to) return;
    if (payload.sprint_from > payload.sprint_to) return;

    try {
      setSavingRoleId(role.role_id);
      await dispatch(
        updateRoleMaster({ roleId: role.role_id, payload })
      ).unwrap();
      await dispatch(deptRolesDetails()).unwrap();
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
        subtitle="Configure complexity tiers and the role master. These values apply to all projects."
      />

      {!pctOk && (
        <Alert variant="warning">
          Complexity percentages currently total {pctTotal}%. They must equal exactly 100% before calculations will run.
        </Alert>
      )}
      {pctOk && <Alert variant="success">All settings valid. Complexity totals 100%.</Alert>}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            window.innerWidth < 600
              ? "1fr"
              : "1fr 1fr",

          gap: 16,

          alignItems: "stretch",
        }}
      >
        <Card style={{
          width: '100%',
          maxWidth: window.innerWidth < 600 ? '100%' : '100%',
          margin: window.innerWidth < 600 ? '0 auto' : undefined,
          height: 480,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <CardTitle>
            Complexity tiers

            <span
              style={{
                marginLeft: 'auto',
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
          </CardTitle>

          <div className="ec-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginBottom: 14 }}>
          <TableWrap style={{ marginBottom: 0 }}>
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
                        onBlur={() => handleComplexitySave(c)}
                        disabled={savingComplexityId === c.complexity_tier_id}
                      />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>pts</span>
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
                        onBlur={() => handleComplexitySave(c)}
                        disabled={savingComplexityId === c.complexity_tier_id}
                      />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>%</span>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          </div>

          <Sep />

          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 0 }}>
            Effort hours = Integrations × % × Effort pts × 8 hrs
          </p>
        </Card>

        <Card
          style={{
            width: "100%",
            height: 480,

            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardTitle>Role master</CardTitle>

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
                const dc =
                  DEPT_COLORS[r.department_name] ||
                  DEPT_COLORS.PM;

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
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,

                          padding: "3px 8px",

                          borderRadius: 999,

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
    </div>
  )
}