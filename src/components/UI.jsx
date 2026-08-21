import { Search } from 'lucide-react'

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

// ── Search input ──────────────────────────────────────────────────────────────
// Meant to sit above a scrollable TableWrap, outside its scroll container, so it
// stays put ("static") while the rows underneath scroll.
export function SearchInput({ value, onChange, placeholder = 'Search...', style = {} }) {
  return (
    <div style={{ position: 'relative', marginBottom: 12, ...style }}>
      <Search size={14} color="var(--gray-500)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input
        className="ec-input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', height: 36, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
          padding: '0 12px 0 34px', fontSize: 13, color: 'var(--text-primary)', background: 'var(--bg-surface)',
          fontFamily: 'inherit',
        }}
      />
    </div>
  )
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

// ── Section label ─────────────────────────────────────────────────────────────
// Groups one or more Cards under a heading. Pass `step`/`totalSteps` only when
// the sections that follow genuinely happen in that order — otherwise omit them.
// Consecutive numbered steps grow a connecting line between them automatically.
export function SectionLabel({ step, totalSteps, title, description, connectPrev = false }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 12, margin: step === 1 || !step ? '30px 0 14px' : '14px 0 14px' }}>
      {connectPrev && (
        <span style={{
          position: 'absolute', left: 13, top: -22, width: 2, height: 22,
          background: 'repeating-linear-gradient(to bottom, var(--blue-300) 0 4px, transparent 4px 8px)',
        }} />
      )}
      {step && (
        <span style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(135deg, #185FA5, #0F52BA)',
          color: '#fff', boxShadow: '0 2px 8px rgba(15,82,186,.28)',
          fontSize: 12.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {step}
        </span>
      )}
      <div style={{ paddingTop: step ? 1 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--navy-800)', letterSpacing: '-0.1px' }}>
            {title}
          </span>
          {step && totalSteps && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: 'var(--blue-700)', letterSpacing: '.05em',
              background: 'var(--blue-100)', padding: '2px 8px', borderRadius: 20,
            }}>
              STEP {step} OF {totalSteps}
            </span>
          )}
        </div>
        {description && (
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 3, maxWidth: 680, lineHeight: 1.5 }}>{description}</div>
        )}
      </div>
    </div>
  )
}

// ── Inline info note ──────────────────────────────────────────────────────────
// A compact, always-visible instructional line for "here's how this control
// works" — quieter than Alert, meant to sit inside a Card above a table/form.
export function InfoNote({ children, icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      background: 'var(--blue-50)', border: '1px solid var(--blue-100)',
      borderRadius: 'var(--radius-md)', padding: '9px 12px', marginBottom: 14,
      fontSize: 12, color: 'var(--gray-700)', lineHeight: 1.5,
    }}>
      <span style={{ flexShrink: 0, marginTop: 1, color: 'var(--blue-500)' }}>{icon}</span>
      <span>{children}</span>
    </div>
  )
}

// ── Saved indicator ───────────────────────────────────────────────────────────
// Small inline confirmation for an inline-edit-then-save field. Render it next
// to the input; it's just a label, mount/unmount it to control visibility.
export function SavedTick({ label = 'Saved', icon }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 10.5, fontWeight: 700, color: 'var(--teal-600)',
      animation: 'ec-fade-in .15s ease',
    }}>
      {icon || '✓'} {label}
    </span>
  )
}

// ── Switch ────────────────────────────────────────────────────────────────────
export function Switch({ checked, onChange, label, hint, disabled = false }) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 10, position: 'relative',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1,
    }}>
      <input
        type="checkbox"
        checked={!!checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      />
      <span className="ec-switch-track" style={{
        width: 40, height: 22, borderRadius: 999, flexShrink: 0, position: 'relative',
        background: checked ? 'linear-gradient(135deg, #1D9E75, #0F6E56)' : 'var(--gray-300)',
        boxShadow: checked ? '0 2px 8px rgba(15,110,86,.3)' : 'none',
      }}>
        <span className="ec-switch-thumb" style={{
          position: 'absolute', top: 2, left: checked ? 20 : 2, width: 18, height: 18,
          borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)',
        }} />
      </span>
      {(label || hint) && (
        <span>
          {label && <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--navy-800)' }}>{label}</span>}
          {hint && <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)' }}>{hint}</span>}
        </span>
      )}
    </label>
  )
}

// ── Icon button ───────────────────────────────────────────────────────────────
export function IconBtn({ children, onClick, title, variant = 'default', disabled = false, style = {} }) {
  return (
    <button
      type="button"
      className={`ec-icon-btn ${variant === 'danger' ? 'danger' : ''}`.trim()}
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      style={{
        width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)',
        background: '#fff', color: 'var(--gray-600)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, flexShrink: 0, ...style,
      }}
    >
      {children}
    </button>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer, width = 480 }) {
  return (
    <div
      className="ec-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,25,41,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
    >
      <div
        className="ec-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, width, maxWidth: '100%', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(5,20,50,.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <span style={{ width: 4, height: 16, borderRadius: 4, background: 'linear-gradient(180deg, #2F80ED, #0F52BA)', flexShrink: 0 }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-800)', flex: 1 }}>{title}</div>
          <button
            type="button"
            className="ec-modal-close"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)',
              background: '#fff', color: 'var(--gray-500)', fontSize: 15, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div className="ec-scroll" style={{ padding: 20, overflowY: 'auto' }}>
          {children}
        </div>

        {footer && (
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 20px',
            borderTop: '1px solid var(--border)', background: 'var(--gray-50)', flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px' }}>
      {icon && (
        <div style={{
          width: 52, height: 52, borderRadius: '50%', background: 'var(--blue-50)',
          color: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px',
        }}>
          {icon}
        </div>
      )}
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)', marginBottom: description ? 5 : 0 }}>{title}</div>
      {description && (
        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', maxWidth: 380, margin: '0 auto', lineHeight: 1.6 }}>
          {description}
        </div>
      )}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  )
}

// ── Table shell ───────────────────────────────────────────────────────────────
// Pass `maxHeight` to cap the table's height so it scrolls internally instead of
// growing the page — the header row stays put (sticky) and the scrollbar is
// visible (styled via `ec-table-scroll`), so it's obvious there's more to scroll.
export function TableWrap({ children, style = {}, maxHeight }) {
  return (
    <div
      className={maxHeight ? 'ec-table-scroll' : undefined}
      style={{
        overflowX: 'auto',
        overflowY: maxHeight ? 'auto' : undefined,
        maxHeight,
        border: '1px solid var(--border)',
        borderRadius: 12,
        ...style,
      }}
    >
      <table className="ec-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>{children}</table>
    </div>
  )
}

export const Th = ({ children, center }) => (
  <th style={{
    background: 'linear-gradient(180deg, #F8FAFC, #F0F4F8)', fontSize: 10.5, fontWeight: 700, color: 'var(--gray-600)',
    letterSpacing: '.06em', textTransform: 'uppercase', padding: '11px 14px',
    textAlign: center ? 'center' : 'left', borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap',
    position: 'sticky', top: 0, zIndex: 2,
  }}>
    {children}
  </th>
)

export const Td = ({ children, center, bold, style = {} }) => (
  <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--gray-200)', color: 'var(--text-primary)', verticalAlign: 'middle', textAlign: center ? 'center' : 'left', fontWeight: bold ? 700 : 400, fontSize: 12.5, ...style }}>
    {children}
  </td>
)
