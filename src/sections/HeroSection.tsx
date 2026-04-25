import { motion } from 'framer-motion'
import SectionObserver from '../components/SectionObserver'

export default function HeroSection() {
  return (
    <SectionObserver id="hero" section="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7rem 5% 5rem', position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass"
        style={{ maxWidth: 780, padding: '3.5rem 4rem', textAlign: 'center' }}
      >
        <div style={{
          display: 'inline-block', background: 'rgba(26,92,255,0.10)', color: 'var(--blue)',
          fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '0.45rem 1.2rem', borderRadius: 100, marginBottom: '1.6rem',
          border: '1px solid rgba(26,92,255,0.2)'
        }}>
          IT Consultancy — Uganda
        </div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          fontWeight: 800, lineHeight: 1.06, letterSpacing: '-1.5px', marginBottom: '1.4rem'
        }}>
          Expert IT Solutions<br />
          for <span style={{
            background: 'linear-gradient(135deg, var(--blue) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>Modern Business</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '2.4rem' }}>
          ITWise provides expert consultancy covering the entire lifecycle of system design and implementation. We deliver innovative solutions with tangible, measurable benefits.
        </p>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700,
          color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2.2rem'
        }}>
          ✦ Ask IT. Have IT. ✦
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#services" className="btn-primary">Explore Services</a>
          <a href="#contact" className="btn-outline">Start a Project</a>
        </div>
      </motion.div>
    </SectionObserver>
  )
}