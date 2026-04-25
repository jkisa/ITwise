import { motion } from 'framer-motion'
import SectionObserver from '../components/SectionObserver'
import { Globe } from 'lucide-react'

export default function CSRSection() {
  return (
    <SectionObserver id="csr" section="csr" style={{ padding: '3rem 5%' }}>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass csr-card"
        style={{
          maxWidth: 900, margin: '0 auto', padding: '3rem 3.5rem',
          borderRadius: 24, display: 'flex', gap: '3rem', alignItems: 'center'
        }}
      >
        <div style={{ fontSize: '4rem', minWidth: 80, textAlign: 'center', opacity: 0.85, color: 'var(--accent)' }}>
          <Globe size={64} />
        </div>
        <div>
          <div className="section-label">Corporate Social Responsibility</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text)', marginBottom: '0.8rem' }}>
            Giving Back to Our Communities
          </div>
          <div style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.72 }}>
            We delight in giving back by conducting ICT Literacy programs on the use and accessibility of ICT services. Our main focus is to ensure that ICT services are extended to the last mile, bridging the digital divide across Uganda.
          </div>
        </div>
      </motion.div>
    </SectionObserver>
  )
}