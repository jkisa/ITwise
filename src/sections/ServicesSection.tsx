import { motion, Variants } from 'framer-motion'
import SectionObserver from '../components/SectionObserver'
import { Shield, Link2, Code, Server, BarChart3, Users, Headphones } from 'lucide-react'

const services = [
  { icon: Shield, title: 'Security System Installation', text: 'From simple CCTV systems to comprehensive integrated surveillance.', color: 'rgba(26,92,255,0.12)' },
  { icon: Link2, title: 'Information System Integration', text: 'We provide system integration solutions and in-depth support.', color: 'rgba(0,194,168,0.12)' },
  { icon: Code, title: 'Software Development', text: 'We develop websites and bespoke applications tailored to you.', color: 'rgba(120,60,200,0.10)' },
  { icon: Server, title: 'IT Infrastructure Services', text: 'Hardware and software installation with seamless integration.', color: 'rgba(230,160,20,0.12)' },
  { icon: BarChart3, title: 'Analytics, BI & AI', text: 'BI and analytics solutions for informed decision-making.', color: 'rgba(26,92,255,0.12)' },
  { icon: Users, title: 'Analysis & Consultations', text: 'Business process reviews and stakeholder engagement.', color: 'rgba(0,194,168,0.12)' },
  { icon: Headphones, title: 'Efficient Online Support', text: 'Prompt, reliable support that exceeds expectations.', color: 'rgba(120,60,200,0.10)' },
]

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function ServicesSection() {
  return (
    <SectionObserver id="services" section="services" style={{ padding: '6rem 5%', background: 'rgba(255,255,255,0.3)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
          <div className="section-label">What We Do</div>
          <div className="divider" />
          <h2 className="section-title">Comprehensive IT Services</h2>
          <p className="section-sub">Our approach covers a wide range of disciplines. We work alongside your in-house team or manage your entire IT function.</p>
        </motion.div>

        <div className="services-grid">
          {services.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="glass service-card"
              whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(30,80,200,0.14)' }}
            >
              <div className="svc-icon" style={{ background: s.color }}>
                <s.icon size={24} />
              </div>
              <div className="svc-title">{s.title}</div>
              <div className="svc-text">{s.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionObserver>
  )
}