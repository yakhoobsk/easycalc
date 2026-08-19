import { Card, CardTitle, PageHeader, Badge, Input } from '../components/UI.jsx'
import { GANTT_PHASES, GANTT_COLORS } from '../constants.js'
import { CreateGanttProject, granttGet, updateGanttProject } from '../redux/services/granttService.js'
import { fmtDate } from '../useCalc.js'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const PHASE_BG = {
  'Kick-off': { bg: '#EEEDFE', tc: '#3C3489' },
  'Development': { bg: '#E6F1FB', tc: '#0C447C' },
  'UAT / Deploy': { bg: '#FCEBEB', tc: '#791F1F' },
}

export default function GanttPage({ numSprintsl, sprints, projectId }) {

  const dispatch = useDispatch();
  const grantData = useSelector((state) => state.grantt?.granttData || {});
  const ganttphasesData = grantData?.gantt_phases || [];
  const sprintphaseoverviewData = grantData?.sprint_phase_overview || [];
  const numSprints = grantData?.project?.total_sprints || 0;
  const [selectedPhase, setSelectedPhase] = useState('')
  const [isPhaseActive, setIsPhaseActive] = useState(true)
  const [newPhase, setNewPhase] = useState('')
  const [phaseDropdownOpen, setPhaseDropdownOpen] = useState(false)
  const [phaseSearch, setPhaseSearch] = useState('')
  const [phaseStatus, setPhaseStatus] = useState({})
  const [sFrom, setSFrom] = useState('');
  const [sTo, setSTo] = useState('');
  const [editingPhase, setEditingPhase] = useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(granttGet(projectId))
    }
  }, [dispatch, projectId])

  useEffect(() => {
    if (ganttphasesData?.length) {
      const initialStatus = {}

      ganttphasesData.forEach((p) => {
        initialStatus[p.name] =
          p.active !== undefined ? p.active : true
      })

      setPhaseStatus(initialStatus)
    }
  }, [ganttphasesData])

  const handleAddPhase = async () => {
    if (
      !newPhase.trim() ||
      !sFrom ||
      !sTo
    )
      return;

    const payload = {
      phase_name: newPhase,
      sFrom: Number(sFrom),
      sTo: Number(sTo),
      color: "",

      created_by: "",

      is_active: true,
    };

    try {
      await dispatch(
        CreateGanttProject({
          grant_id: projectId,
          payload,
        })
      ).unwrap();

      dispatch(
        granttGet(projectId)
      );


      setPhaseDropdownOpen(false);
      setEditingPhase(null);
      setNewPhase('');
      setSFrom('');
      setSTo('');

    } catch (err) {
      console.log(err);
    }
  };
  const handleTogglePhase =
    async (phase) => {

      const payload = {

        phase_name: phase.name,
        sFrom: "",
        sTo: "",
        color: "",
        updated_by: "",
        is_active: !phase.is_active,
      };

      try {

        await dispatch(
          updateGanttProject({
            projectId: projectId,
            grant_id: phase.id,
            payload
          })
        ).unwrap();
        dispatch(
          granttGet(
            projectId
          )
        );
      } catch (err) {
        console.log(err);
      }

    };

  if (!sprintphaseoverviewData || sprintphaseoverviewData.length === 0) {
    return (
      <div>
        <PageHeader breadcrumb={['Outputs', 'Gantt chart']} title="Gantt chart" />
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          Configure project inputs to generate the Gantt chart.
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        breadcrumb={['Outputs', 'Gantt chart']}
        title="Gantt chart"
        subtitle={`Project phase timeline  ·  ${sprints.length} sprints  ·  ${fmtDate(sprints[0].sd)} – ${fmtDate(sprints[sprints.length - 1].ed)}`}
      />

      {/* Phase swimlanes */}
      <Card>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 16,
            flexWrap: 'wrap',
          }}
        >
          <CardTitle style={{ marginBottom: 0 }}>
            Phase swimlanes
          </CardTitle>

          {/* Right Controls */}
          <div style={{ position: "relative" }}>

            {/* Trigger */}
            <button
              onClick={() =>
                setPhaseDropdownOpen(
                  !phaseDropdownOpen
                )
              }
              style={{
                height: 40,
                padding: "0 16px",

                border:
                  "1px solid var(--border)",

                borderRadius: 10,

                background: "#fff",

                fontWeight: 600,

                cursor: "pointer",

                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              ⚙ Manage Phases
              {phaseDropdownOpen ? "▲" : "▼"}
            </button>

            {phaseDropdownOpen && (

              <div
                style={{
                  position: "absolute",
                  top: 48,
                  right: 0,

                  width: 360,

                  background: "#fff",

                  border:
                    "1px solid var(--border)",

                  borderRadius: 14,

                  boxShadow:
                    "0 15px 40px rgba(0,0,0,.12)",

                  padding: 16,

                  zIndex: 100,
                }}
              >

                {/* Search */}
                <Input
                  placeholder="Search phase..."
                  value={phaseSearch}
                  onChange={(e) =>
                    setPhaseSearch(
                      e.target.value
                    )
                  }
                  style={{
                    marginBottom: 14,
                    height: 38,
                  }}
                />

                {/* List */}
                <div
                  style={{
                    maxHeight: 220,
                    overflowY: "auto",

                    marginBottom: 16,
                  }}
                >

                  {ganttphasesData
                    .filter(p =>
                      p.name
                        ?.toLowerCase()
                        .includes(
                          phaseSearch
                            .toLowerCase()
                        )
                    )

                    .map((p) => (

                      <div
                        key={p.id}

                        style={{

                          padding: "10px 0",

                          borderBottom:
                            "1px solid #eee",

                          display: "flex",

                          justifyContent:
                            "space-between",

                          alignItems:
                            "center",
                        }}
                      >

                        <div>

                          <div
                            style={{
                              fontWeight: 600
                            }}
                          >
                            {p.name}
                          </div>

                          <div
                            style={{
                              fontSize: 11,
                              color: "#777"
                            }}
                          >
                            S{p.sFrom}
                            →
                            S{p.sTo}
                          </div>

                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 8
                          }}
                        >

                          {/* Edit */}
                          <button
                            onClick={() => {
                              setEditingPhase(p)

                              setNewPhase(
                                p.name
                              );

                              setSFrom(
                                p.sFrom
                              );

                              setSTo(
                                p.sTo
                              );
                            }}
                            style={{
                              border: "none",
                              background: "none",
                              cursor: "pointer"
                            }}
                          >
                            ✏️
                          </button>

                          {/* Toggle */}
                          <button
                            onClick={() =>
                              handleTogglePhase(p)
                            }

                            style={{
                              width: 42,
                              height: 22,

                              border: "none",

                              borderRadius:
                                20,

                              background:
                                p.is_active
                                  ? "#22C55E"
                                  : "#D1D5DB",

                              position:
                                "relative",
                            }}
                          >

                            <div
                              style={{
                                width: 18,
                                height: 18,

                                background: "#fff",

                                borderRadius: "50%",

                                position: "absolute",

                                top: 2,

                                left:
                                  p.is_active
                                    ? 22
                                    : 2
                              }}
                            />

                          </button>

                        </div>

                      </div>

                    ))}

                </div>


                {/* Form */}

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",

                    gap: 10,
                  }}
                >

                  <Input
                    placeholder=
                    "Phase name"

                    value={newPhase}

                    onChange={(e) =>
                      setNewPhase(
                        e.target.value
                      )
                    }
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: 10
                    }}
                  >

                    <Input
                      type="number"

                      placeholder=
                      "Sprint From"

                      value={sFrom}

                      onChange={(e) =>
                        setSFrom(
                          e.target.value
                        )
                      }
                    />

                    <Input
                      type="number"

                      placeholder=
                      "Sprint To"

                      value={sTo}

                      onChange={(e) =>
                        setSTo(
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <button
                    onClick={
                      handleSavePhase
                    }

                    style={{
                      height: 40,

                      border: "none",

                      borderRadius: 10,

                      background:
                        editingPhase
                          ? "#16A34A"
                          : "#0F52BA",

                      color: "#fff",

                      fontWeight: 600,

                      cursor: "pointer"
                    }}
                  >

                    {
                      editingPhase
                        ? "Update Phase"
                        : "+ Add Phase"
                    }

                  </button>

                </div>

              </div>

            )}

          </div>
        </div>
        {/* ✅ SCROLL WRAPPER */}
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 700 }}>

            {/* Timeline header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 196, flexShrink: 0 }} />
              <div style={{ flex: 1, position: 'relative', height: 18 }}>
                {sprintphaseoverviewData
                  .filter((_, i) => i % Math.max(1, Math.ceil(numSprints / 6)) === 0)
                  .map(s => {
                    const left = ((s.num - 1) / numSprints * 100).toFixed(1)
                    return (
                      <span key={s.num} style={{
                        position: 'absolute',
                        left: `${left}%`,
                        fontSize: 9,
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        transform: 'translateX(-50%)',
                      }}>
                        {fmtDate(s.sd)}
                      </span>
                    )
                  })}
              </div>
              <div style={{ width: 68, flexShrink: 0 }} />
            </div>

            {ganttphasesData.map((p, i) => {
              const sf = Math.min(p.sFrom, numSprints)
              const st = Math.min(p.sTo, numSprints)
              const left = ((sf - 1) / numSprints * 100).toFixed(1)
              const width = Math.max(2, ((st - sf + 1) / numSprints * 100)).toFixed(1)
              const sdSprint = sprints[sf - 1]
              const edSprint = sprints[st - 1]

              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 196,
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    textAlign: 'right',
                    flexShrink: 0,
                    paddingRight: 8,
                    lineHeight: 1.4
                  }}>
                    {p.name}
                  </div>

                  <div style={{ flex: 1, height: 22, background: 'var(--gray-100)', borderRadius: 5, position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: `${left}%`,
                        width: `${width}%`,
                        height: 22,
                        background: GANTT_COLORS[i],
                        borderRadius: 5,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 7,
                        minWidth: 22,
                        overflow: 'hidden',
                      }}
                      title={`${p.name}: ${sdSprint ? fmtDate(sdSprint.sd) : ''} – ${edSprint ? fmtDate(edSprint.ed) : ''}`}
                    >
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
                        {sdSprint ? fmtDate(sdSprint.sd) : ''}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    width: 68,
                    flexShrink: 0,
                    textAlign: 'right'
                  }}>
                    {edSprint ? fmtDate(edSprint.ed) : ''}
                  </div>
                </div>
              )
            })}

            {/* Sprint axis */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div style={{ width: 196, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex' }}>
                {sprintphaseoverviewData.map(s => (
                  <div key={s.num} style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 8,
                    color: 'var(--gray-400)',
                    borderTop: '1px solid var(--gray-200)',
                    paddingTop: 3
                  }}>
                    {s.num}
                  </div>
                ))}
              </div>
              <div style={{ width: 68, flexShrink: 0 }} />
            </div>

            <div style={{
              textAlign: 'center',
              fontSize: 10,
              color: 'var(--text-muted)',
              marginTop: 2,
              paddingLeft: 204
            }}>
              Sprint numbers
            </div>

          </div>
        </div>
      </Card>

      {/* Sprint pills */}
      <Card>
        <CardTitle>Sprint phase overview</CardTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {sprintphaseoverviewData.map(s => {
            const ps = PHASE_BG[s.phase] || PHASE_BG.Development
            const label =
              s.phase === 'Kick-off'
                ? `S${s.num} · Kick-off`
                : s.phase === 'UAT / Deploy'
                  ? `S${s.num} · UAT/Deploy`
                  : `S${s.num}`

            return (
              <div key={s.num}
                title={`${fmtDate(s.sd)} – ${fmtDate(s.ed)}\nFTEs: ${s.activeFte} · Integrations: ${s.totalIntg}`}
                style={{
                  padding: '5px 10px',
                  background: ps.bg,
                  color: ps.tc,
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Legend */}
      <Card>
        <CardTitle>Phase colour legend</CardTitle>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 600 ? '1fr' : 'repeat(3, 1fr)',
          gap: 10
        }}>
          {GANTT_PHASES.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: GANTT_COLORS[i] }} />
              <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
