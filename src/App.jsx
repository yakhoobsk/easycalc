import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'

import SettingsPage from './pages/SettingsPage.jsx'
import InputPage from './pages/InputPage.jsx'
import ResourcesPage from './pages/ResourcesPage.jsx'
import SprintsPage from './pages/SprintsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import GanttPage from './pages/GanttPage.jsx'
import ExportPage from './pages/ExportPage.jsx'
import LoginPage from './pages/index.jsx'
import WelcomeScreen from './components/WelcomeScreen.jsx'
import BrandedLoader from './components/BrandedLoader.jsx'

import { projectDetails, projectsDetails } from './redux/services/inputService.js'
import { complexityDetails } from './redux/services/settingsService.js'
import { useCalc } from './useCalc.js'
import ProfilePage from './pages/profile.jsx'
import UsersPage from './pages/Users.jsx'

export default function App() {
  const dispatch = useDispatch()

  const auth = useSelector((state) => state.auth?.auth)
  const loading = useSelector((state) => state.auth?.loading)

  const [page, setPage] = useState('settings')

  const [showWelcome, setShowWelcome] = useState(false)
  const wasAuthedRef = useRef(false)

  const projectData = useSelector((state) => state.input?.inputData || {})
  const projectsData = useSelector((state) =>
    state.input?.projectsData?.length > 0 ? state.input?.projectsData[0] : {}
  )

  const projectRoles = projectData?.project_roles || []
  const complexityData = useSelector((state) => state.complexity?.complexityData || [])

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [complexity, setComplexity] = useState(complexityData.length > 0 ? complexityData : [])
  const [roles, setRoles] = useState(projectRoles.length > 0 ? projectRoles : [])

  const projectId = projectsData?.project_id || ''
  const [projectName, setProjectName] = useState(projectsData?.project_name || '')
  const [numIntgs, setNumIntgs] = useState(projectData?.total_integrations || 0)
  const [numSprints, setNumSprints] = useState(projectData?.sprint_count || 0)
  const [sprintWeeks, setSprintWeeks] = useState(projectData?.sprint_duration_weeks ?? 2)
  const [startDate, setStartDate] = useState(projectData?.start_date || '')
  const [client, setClient] = useState(projectData?.client_name || '')
  const totalProtHrs = projectsData?.total_project_hours || 0

  // Detect a fresh login (auth going from absent to present within this session)
  // rather than an already-authenticated page load, so the welcome screen only
  // shows right after signing in, not on every refresh.
  useEffect(() => {
    const isAuthed = !!auth

    if (!wasAuthedRef.current && isAuthed && sessionStorage.getItem('justLoggedIn') === '1') {
      sessionStorage.removeItem('justLoggedIn')
      setShowWelcome(true)
      wasAuthedRef.current = isAuthed
      const timer = setTimeout(() => setShowWelcome(false), 1800)
      return () => clearTimeout(timer)
    }

    wasAuthedRef.current = isAuthed
  }, [auth])

  useEffect(() => {
    if (!auth) return
    dispatch(projectsDetails())
    dispatch(complexityDetails())
  }, [dispatch, auth])

  useEffect(() => {
    if (!auth || !projectId) return
    dispatch(projectDetails(projectId))
  }, [auth, projectId])

  useEffect(() => {
    if (complexityData.length > 0) {
      setComplexity(complexityData)
    }
  }, [complexityData])

  useEffect(() => {
    if (projectRoles.length > 0) {
      setRoles(projectRoles)
    }
  }, [projectRoles])

  useEffect(() => {
    if (Object.keys(projectData).length > 0) {
      setNumIntgs(projectData?.total_integrations || 0)
      setNumSprints(projectData?.sprint_count || 0)
      setSprintWeeks(projectData?.sprint_duration_weeks || 2)
      setStartDate(projectData?.start_date || '')
      setProjectName(projectsData?.project_name || '')
      setClient(projectData?.client_name || '')
    }
  }, [projectData, projectsData])

  const calc = useCalc({
    numIntgs,
    numSprints,
    sprintWeeks,
    startDate,
    roles,
    complexity
  })

  if (!auth && !loading) {
    return <LoginPage />
  }

  if (loading) {
    return <BrandedLoader />
  }

  if (showWelcome) {
    return <WelcomeScreen />
  }

  const pctTotal = complexity.reduce(
    (a, c) => a + (Number(c.percentage ?? c.pct) || 0),
    0
  )

  const shared = {
    complexity, setComplexity,
    roles, setRoles,
    numIntgs, setNumIntgs,
    numSprints, setNumSprints,
    sprintWeeks, setSprintWeeks,
    startDate, setStartDate,
    projectName, setProjectName,
    projectId,
    client, setClient,
    pctTotal,
    setPage,
    ...calc,
    brdState: {
      numIntgs,
      numSprints,
      totalProtHrs,
      sprintWeeks,
      startDate,
      roles,
      complexity,
      ...calc
    },
  }

  const pages = {
    settings: <SettingsPage {...shared} />,
    input: <InputPage {...shared} />,
    resources: <ResourcesPage {...shared} />,
    sprints: <SprintsPage {...shared} />,
    dashboard: <DashboardPage {...shared} />,
    gantt: <GanttPage {...shared} />,
    export: <ExportPage {...shared} />,
    profile: <ProfilePage {...shared} />,
    users: <UsersPage />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Topbar
        projectName={projectName}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setPage={setPage}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          active={page}
          setPage={setPage}
          numSprints={numSprints}
          pctOk={pctTotal === 100}
          sidebarOpen={sidebarOpen}
        />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            background: 'var(--white)',
            padding: '28px 32px'
          }}
        >
          {pages[page] ? pages[page] : <div>Loading page...</div>}
        </main>
      </div>
    </div>
  )
}
