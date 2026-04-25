import { motion } from 'framer-motion'
import SectionObserver from '../components/SectionObserver'
import { Target, Rocket } from 'lucide-react'

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } }

export default function AboutSection() {
  return (
    <SectionObserver id="about" section="about" style={{ padding: '6rem 5%' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
        alignItems: 'start', maxWidth: 1200, margin: '0 auto'
      }} className="about-grid">
        <motion.div {...fadeUp} className="glass" style={{ padding: '2.8rem 3rem' }}>
          <div className="section-label">Who We Are</div>
          <div className="divider" />
          <h2 className="section-title">Built on Expertise.<br />Driven by Results.</h2>
          <p className="section-sub">
            ITWise provides expert consultancy services in Uganda, focusing on delivering innovative solutions with tangible, measurable benefits — building long-term client relationships through quality and responsiveness.
          </p>
          <div style={{ marginTop: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass" style={{ padding: '1.4rem 1.6rem', borderRadius: 16, display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 42, height: 42, minWidth: 42, borderRadius: 12,
                background: 'linear-gradient(135deg, var(--blue) 0%, var(--accent) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                <Target size={20} />
              </div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>Our Mission</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                  To be the partner of choice for leading service providers, delivering the best technology solutions that create long-term commercial benefits.
                </div>
              </div>
            </div>
            <div className="glass" style={{ padding: '1.4rem 1.6rem', borderRadius: 16, display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 42, height: 42, minWidth: 42, borderRadius: 12,
                background: 'linear-gradient(135deg, var(--blue) 0%, var(--accent) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                <Rocket size={20} />
              </div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>Our Vision</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                  Leading IT solutions provider — exceeding our customers' expectations, every single time.
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="glass" style={{ padding: '1.8rem 1.6rem', textAlign: 'center', borderRadius: 18 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.4rem', fontWeight: 800, color: 'var(--blue)', lineHeight: 1, marginBottom: '0.4rem' }}>7+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>Service Disciplines</div>
          </div>
          <div className="glass" style={{ padding: '1.8rem 1.6rem', textAlign: 'center', borderRadius: 18 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.4rem', fontWeight: 800, color: 'var(--blue)', lineHeight: 1, marginBottom: '0.4rem' }}>100%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>Client Commitment</div>
          </div>
          <div className="glass" style={{ gridColumn: 'span 2', padding: '1.8rem', textAlign: 'center', borderRadius: 18 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: 'var(--blue)' }}>"Ask IT. Have IT."</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500, marginTop: '0.4rem' }}>Our Promise to You</div>
          </div>
          <div className="glass" style={{ gridColumn: 'span 2', padding: '1.8rem 2rem', borderRadius: 18 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Enterprise-Grade Approach</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              We cover enterprise architecture, business analysis, systems engineering, content and service management — all under one roof.
            </div>
          </div>
        </motion.div>
      </div>
    </SectionObserver>
  )
}