import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import logo from "../assests/logocomany12.png";
import pkg from '../../package.json';
export default function Topbar({ projectName, sidebarOpen, setSidebarOpen, setPage, }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  const auth = useSelector((state) => state.auth?.auth || {});

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      style={{
        height: isMobile ? 'auto' : 'var(--header-h)',
        background: 'var(--navy-800)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        padding: isMobile ? '10px 16px' : '0 24px',
        gap: isMobile ? 10 : 16,
        flexShrink: 0,
        borderBottom: '1px solid var(--navy-700)',
      }}
    >


      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            {/* Logo */}
            <img
              src={logo}
              alt="logo"
              style={{
                width: isMobile ? 36 : 44,
                height: isMobile ? 36 : 44,
                objectFit: "contain"
              }}
            />

            {/* Text */}
            <div
              style={{
                display: 'flex',
                flexDirection: "column",
                justifyContent: 'center',
                lineHeight: 1.1
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: isMobile ? 18 : 22,
                  color: '#fff'
                }}
              >
                Easy<span style={{ color: '#90CAF9' }}>Calc</span>
              </span>

              {!isMobile && (
                <span
                  style={{
                    fontSize: 11,
                    color: '#D6E4FF',
                    marginTop: 2
                  }}
                >
                  Project-to-Delivery Estimator
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: 8,
              width: 34,
              height: 34,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: "10px",
              transition: 'background .15s ease, border-color .15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          >
            {sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
          </button>
        </div>
      </div>


      {isMobile && projectName && (
        <div
          style={{
            fontSize: 12,
            color: '#fff',
            marginTop: 4
          }}
        >
          {projectName}
        </div>
      )}


      {!isMobile && (
        <>
          {projectName && (
            <div
              style={{
                marginLeft: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#fff'
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 200
                }}
              >
                {projectName}
              </span>
            </div>
          )}

          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <span
              style={{
                color: '#fff',
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: 20,
                border: '1px solid rgba(144, 202, 249, 0.6)',
                background: 'rgba(255,255,255,0.05)'
              }}
            >
              v{pkg.version}
            </span>

          </div>
        </>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => {
        setPage('profile');
      }}>
        <div
          onClick={() => setPage('profile')}
          title="View profile"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #5FA3E8, #185FA5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
            cursor: 'pointer',
            border: '2px solid rgba(255,255,255,0.35)',
            boxShadow: '0 2px 6px rgba(0,0,0,.2)',
            transition: 'transform .15s ease, box-shadow .15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          {getInitials(auth?.name)}
        </div>
      </div>
    </header>
  )
}