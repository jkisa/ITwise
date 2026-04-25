import { motion } from 'framer-motion'
import SectionObserver from '../components/SectionObserver'

export default function TeamSection() {
  return (
    <SectionObserver id="team" section="team" style={{ padding: '6rem 5%' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">Our People</div>
          <div className="divider" style={{ margin: '0 auto 1.4rem' }} />
          <h2 className="section-title">Highly Qualified<br />Strategic Partners</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass"
          style={{ padding: '3.5rem 4rem', borderRadius: 28, marginTop: '2rem' }}
        >
          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.78, marginBottom: '1.4rem' }}>
            We have a team of highly qualified, knowledgeable consultants that can help you get more value from your IT — ranging from expert advice on a straightforward network upgrade, through to a new, more responsive and cost-effective infrastructure and systems.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.78 }}>
            We work in partnership alongside your in-house team. Our reputation is built on the high-level expertise and understanding needed to become a strategic partner — one on which our clients can depend to support them in making the right technology choices.
          </p>
        </motion.div>
      </div>
    </SectionObserver>
  )
}