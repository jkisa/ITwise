import { useSection } from '../context/SectionContext'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Team', id: 'team' },
  { label: 'Contact', id: 'contact' },
] as const

export default function Navigation() {
  const { active } = useSection()
  const [open, setOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '1.1rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(255,255,255,0.8)',
      boxShadow: '0 2px 24px rgba(30,80,200,0.07)',
    }}>
      <a href="#" style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem',
        color: 'var(--blue)', letterSpacing: '-0.5px', textDecoration: 'none'
      }}>
        IT<span style={{ color: 'var(--accent)' }}>Wise</span>
      </a>

      <ul style={{
        display: 'flex', gap: '2.2rem', listStyle: 'none',
        '@media (max-width: 900px)': { display: 'none' }
      } as any} className="nav-desktop">
        {links.map((l) => (
          <li key={l.id}>
            <button
              onClick={() => scrollTo(l.id)}
              style={{
                fontSize: '0.92rem', fontWeight: 500,
                color: active === l.id ? 'var(--blue)' : 'var(--muted)',
                background: 'none', border: 'none', cursor: 'none',
                transition: 'color 0.2s', fontFamily: 'Outfit, sans-serif'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--blue)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = active === l.id ? 'var(--blue)' : 'var(--muted)')}
            >
              {l.label}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => scrollTo('contact')}
            className="nav-cta"
            style={{
              background: 'var(--blue)', color: '#fff', padding: '0.55rem 1.4rem',
              borderRadius: '100px', border: 'none', cursor: 'none',
              fontWeight: 600, fontSize: '0.92rem', fontFamily: 'Outfit, sans-serif',
              transition: 'transform 0.15s, background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--blue-mid)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--blue)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            Start a Project
          </button>
        </li>
      </ul>

      <button
        className="nav-mobile"
        onClick={() => setOpen(!open)}
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'none', color: 'var(--blue)' }}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
          padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                fontSize: '1.1rem', color: 'var(--text)', background: 'none',
                border: 'none', cursor: 'none', textAlign: 'left', fontFamily: 'Outfit, sans-serif'
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:900px){
          .nav-desktop{display:none!important;}
          .nav-mobile{display:block!important;}
        }
      `}</style>
    </nav>
  )
}