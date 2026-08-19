// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div className="ec-card" style={{
      background: '#fff', border: '1px solid var(--border)',
      borderRadius: 16, padding: '20px 24px',
      marginBottom: 16, boxShadow: '0 1px 2px rgba(15,23,42,.04), 0 6px 18px rgba(15,23,42,.05)',
      ...style
    }}>
      {children}
    </div>
  )
}

// ── Card Title ────────────────────────────────────────────────────────────────
export function CardTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <span style={{ width: 4, height: 16, borderRadius: 4, background: 'linear-gradient(180deg, #2F80ED, #0F52BA)', flexShrink: 0 }} />
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)', letterSpacing: '-0.1px', flex: 1 }}>{children}</div>
      {action}
    </div>
  )
}

// ── Page Header ───────────────────────────────────────────────────────────────
export function PageHeader({ breadcrumb, title, subtitle }) {
  return (
    <div style={{ marginBottom: 22 }}>
      {breadcrumb && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          {breadcrumb.map((b, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ color: 'var(--gray-300)' }}>›</span>}
              {b}
            </span>
          ))}
        </div>
      )}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy-800)', letterSpacing: '-0.3px', lineHeight: 1.2 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{subtitle}</p>}
    </div>
  )
}

// ── Metric Card ───────────────────────────────────────────────────────────────
export function Metric({ value, label, delta, accent }) {
  return (
    <div className="ec-metric" style={{
      background: '#fff', border: '1px solid var(--border)',
      borderRadius: 14, padding: '16px 18px',
      borderTop: accent ? `3px solid ${accent}` : undefined,
      boxShadow: '0 1px 2px rgba(15,23,42,.04), 0 4px 14px rgba(15,23,42,.05)',
    }}>
      <div style={{ fontSize: 27, fontWeight: 800, color: 'var(--navy-800)', lineHeight: 1.1, letterSpacing: '-0.4px' }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>{label}</div>
      {delta && <div style={{ fontSize: 11, color: 'var(--teal-600)', marginTop: 6, fontWeight: 700 }}>{delta}</div>}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  blue: { bg: 'var(--blue-100)', text: 'var(--blue-700)' },
  teal: { bg: 'var(--teal-100)', text: 'var(--teal-700)' },
  amber: { bg: 'var(--amber-100)', text: 'var(--amber-700)' },
  red: { bg: 'var(--red-100)', text: 'var(--red-700)' },
  green: { bg: 'var(--green-100)', text: 'var(--green-700)' },
  purple: { bg: 'var(--purple-100)', text: 'var(--purple-700)' },
  gray: { bg: 'var(--gray-100)', text: 'var(--gray-600)' },
}

export function Badge({ children, variant = 'blue', style = {}, className = '' }) {
  const s = BADGE_STYLES[variant] || BADGE_STYLES.blue
  return (
    <span className={`ec-badge ${className}`.trim()} style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 10, fontWeight: 700, background: s.bg, color: s.text, ...style
    }}>
      {children}
    </span>
  )
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ children, variant = 'info' }) {
  const styles = {
    info: { bg: 'var(--blue-50)', color: 'var(--blue-700)', border: 'var(--blue-200)' },
    success: { bg: 'var(--green-100)', color: 'var(--green-700)', border: '#97C459' },
    warning: { bg: 'var(--amber-100)', color: 'var(--amber-700)', border: 'var(--amber-400)' },
    danger: { bg: 'var(--red-100)', color: 'var(--red-700)', border: 'var(--red-400)' },
  }
  const s = styles[variant]
  return (
    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 12, marginBottom: 14, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {children}
    </div>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', style = {}, disabled = false }) {
  const styles = {
    primary: { background: 'linear-gradient(135deg, #185FA5, #0F52BA)', color: '#fff', border: '1px solid #0F52BA', shadow: '0 2px 10px rgba(15,82,186,.28)' },
    secondary: { background: '#fff', color: 'var(--gray-700)', border: '1px solid var(--border)', shadow: '0 1px 2px rgba(15,23,42,.04)' },
    danger: { background: 'var(--red-100)', color: 'var(--red-700)', border: '1px solid #F7C1C1', shadow: 'none' },
    success: { background: 'linear-gradient(135deg, #1D9E75, #0F6E56)', color: '#fff', border: '1px solid #0F6E56', shadow: '0 2px 10px rgba(15,110,86,.28)' },
    navy: { background: 'linear-gradient(135deg, #123E82, #0A2C5C)', color: '#fff', border: '1px solid #0A2C5C', shadow: '0 2px 10px rgba(10,44,92,.28)' },
  }
  const s = styles[variant] || styles.primary
  return (
    <button className="ec-btn" onClick={onClick} disabled={disabled} style={{
      height: 38, padding: '0 20px', background: s.background, color: s.color,
      border: s.border, borderRadius: 10,
      fontSize: 13, fontWeight: 600, letterSpacing: '.1px', cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit', opacity: disabled ? 0.5 : 1,
      boxShadow: disabled ? 'none' : s.shadow, ...style
    }}>
      {children}
    </button>
  )
}

// ── FormGroup ─────────────────────────────────────────────────────────────────
export function FormGroup({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)', letterSpacing: '.02em' }}>{label}</label>
      {children}
      {hint && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  )
}

export function Input({ style = {}, ...props }) {
  return <input className="ec-input" style={{ height: 36, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0 12px', fontSize: 13, color: 'var(--text-primary)', background: 'var(--bg-surface)', fontFamily: 'inherit', ...style }} {...props} />
}

export function Select({ style = {}, children, ...props }) {
  return <select className="ec-input" style={{ height: 36, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0 10px', fontSize: 13, color: 'var(--text-primary)', background: 'var(--bg-surface)', fontFamily: 'inherit', cursor: 'pointer', ...style }} {...props}>{children}</select>
}

// ── Prog bar ──────────────────────────────────────────────────────────────────
export function ProgBar({ pct, color = 'var(--blue-600)', height = 5 }) {
  return (
    <div style={{ height, background: 'var(--gray-200)', borderRadius: height / 2, overflow: 'hidden', minWidth: 60 }}>
      <div style={{ height, width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: height / 2, transition: 'width 0.3s ease' }} />
    </div>
  )
}

// ── Dept Badge ────────────────────────────────────────────────────────────────
const DEPT_VARIANTS = { PM: 'blue', Integration: 'purple', Cloud: 'teal', QA: 'amber' }
export function DeptBadge({ dept }) {
  return <Badge variant={DEPT_VARIANTS[dept] || 'gray'}>{dept}</Badge>
}

// ── Section divider ───────────────────────────────────────────────────────────
export function Sep() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
}

// ── Table shell ───────────────────────────────────────────────────────────────
export function TableWrap({ children, style = {} }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 12, ...style }}>
      <table className="ec-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>{children}</table>
    </div>
  )
}

export const Th = ({ children, center }) => (
  <th style={{
    background: 'linear-gradient(180deg, #F8FAFC, #F0F4F8)', fontSize: 10.5, fontWeight: 700, color: 'var(--gray-600)',
    letterSpacing: '.06em', textTransform: 'uppercase', padding: '11px 14px',
    textAlign: center ? 'center' : 'left', borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap'
  }}>
    {children}
  </th>
)

export const Td = ({ children, center, bold, style = {} }) => (
  <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--gray-200)', color: 'var(--text-primary)', verticalAlign: 'middle', textAlign: center ? 'center' : 'left', fontWeight: bold ? 700 : 400, fontSize: 12.5, ...style }}>
    {children}
  </td>
)
