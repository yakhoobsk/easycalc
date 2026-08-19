import { useDispatch, useSelector } from "react-redux"
import { LogoutUser } from "../redux/services/authService";
import { clearAuth } from "../redux/slices/authSlice";
import { showSnackbar } from "../utils/snackbar";
import {
  SettingOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  CalendarOutlined,
  DashboardOutlined,
  BarChartOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const navItems = [
  { section: 'Configuration' },
  { id: 'settings', label: 'Settings', icon: <SettingOutlined /> },
  { id: 'users', label: 'Users', icon: <UserOutlined /> },

  { section: 'Project' },
  { id: 'input', label: 'Project input', icon: <FileTextOutlined /> },
  { id: 'resources', label: 'Resources', icon: <TeamOutlined /> },
  { id: 'sprints', label: 'Sprint plan', icon: <CalendarOutlined />, badge: true },

  { section: 'Outputs' },
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { id: 'gantt', label: 'Gantt chart', icon: <BarChartOutlined /> },
  { id: 'export', label: 'Export', icon: <DownloadOutlined /> },
];

export default function Sidebar({ active, setPage, numSprints, pctOk, sidebarOpen }) {

  const auth = useSelector((state) => state.auth?.auth)
  console.log(auth)
  const dispatch = useDispatch();

  const handleLogout = () => {
    const payload = { email: auth?.email };

    dispatch(LogoutUser(payload))
      .unwrap()
      .then(() => {
        showSnackbar("success", "Logged out successfully");

        dispatch(clearAuth());

        localStorage.clear();
      })
      .catch((err) => {
        showSnackbar("error", typeof err === "string" ? err : err?.message || "Logout failed");
      });
  };

  return (
    <aside style={{
      width: sidebarOpen ? 220 : 0,
      background: '#0F52BA',
      display: 'flex', flexDirection: 'column', padding: '16px 0',
      flexShrink: 0, borderRight: '1px solid #0F2740', overflowY: 'auto', transition: 'width 0.25s ease'
    }}>

      {navItems.map((item, i) => {
        if (item.section) return (
          <div key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: '#fff', padding: '0 16px', marginTop: i === 0 ? 0 : 20, marginBottom: 6, textTransform: 'uppercase' }}>
            {item.section}
          </div>
        )
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            title={!sidebarOpen ? item.label : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: 10,
              padding: sidebarOpen ? '10px 16px' : '10px 0',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? '#0F52BA' : '#E3F2FD',
              background: isActive ? '#ffffff' : 'transparent',
              borderLeft: `4px solid ${isActive ? '#FFD700' : 'transparent'}`,
              border: 'none',
              width: '100%',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
              borderRadius: sidebarOpen ? '0 20px 20px 0' : 0,
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.background = '#0F52BA'
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.background = 'transparent'
            }}
          >
            <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>
              {item.icon}
            </span>

            {sidebarOpen && <span color="#ffff">{item.label}</span>}

            {item.badge && sidebarOpen && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: '#0F52BA',
                  color: '#B5D4F4',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 10,
                }}
              >
                {numSprints}
              </span>
            )}

            {item.id === 'settings' && !pctOk && sidebarOpen && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: '#A32D2D',
                  color: '#FCEBEB',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 10,
                }}
              >
                !
              </span>
            )}
          </button>
        )
      })}

      <div
        style={{
          marginTop: 'auto',
          padding: '10px 0',
          borderTop: '1px solid #0F2740'
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            color: '#E3F2FD',
            fontSize: 13,
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            borderLeft: '4px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1565C0';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderLeft = '4px solid #FF5252';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#E3F2FD';
            e.currentTarget.style.borderLeft = '4px solid transparent';
          }}
        >
          <span style={{ fontSize: 16 }}>⏻</span>
          <span style={{ fontWeight: 500 }}>Logout</span>
        </button>
      </div>
    </aside>
  )
}
