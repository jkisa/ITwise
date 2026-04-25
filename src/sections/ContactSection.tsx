import { motion } from 'framer-motion'
import SectionObserver from '../components/SectionObserver'
import { Mail, MapPin, Zap, ArrowRight } from 'lucide-react'

export default function ContactSection() {
  return (
    <SectionObserver id="contact" section="contact" style={{ padding: '6rem 5%' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center'
      }} className="contact-wrapper">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ padding: '1rem' }}
        >
          <div className="section-label">Get In Touch</div>
          <div className="divider" />
          <h2 className="section-title">Let's Start a New Project Together</h2>
          <p className="section-sub">
            We bring our expertise to ensure that what we deliver is comprehensive, the design is robust, the implementation is successful, and the ongoing support delivers the benefit.
          </p>

          <div className="glass" style={{ padding: '3rem', borderRadius: 28 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
              Contact Information
            </h3>
            {[
              { icon: Mail, label: 'Email Us', value: 'info@itwise.com', href: 'mailto:info@itwise.com' },
              { icon: MapPin, label: 'Location', value: 'Uganda' },
              { icon: Zap, label: 'Response Time', value: 'Prompt & Reliable' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.4rem' }}>
                <div style={{
                  width: 42, height: 42, minWidth: 42, borderRadius: 12,
                  background: 'rgba(26,92,255,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--blue)'
                }}>
                  <item.icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500, marginBottom: '0.15rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>
                    {item.href ? <a href={item.href} style={{ color: 'var(--blue)', textDecoration: 'none' }}>{item.value}</a> : item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--blue) 0%, var(--accent) 100%)',
            padding: '2.4rem 2.8rem', borderRadius: 24, textAlign: 'center'
          }}>
            <h4 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem',
              color: '#fff', marginBottom: '0.7rem', letterSpacing: '-0.3px'
            }}>
              Ready to Transform Your IT?
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', marginBottom: '1.6rem' }}>
              Send us an email and let's engage. We're ready to listen to your challenges and deliver way beyond the promise.
            </p>
            <a
              href="mailto:info@itwise.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: '#fff', color: 'var(--blue)', padding: '0.85rem 2rem',
                borderRadius: 100, fontWeight: 700, fontSize: '0.95rem',
                textDecoration: 'none', transition: 'transform 0.18s', fontFamily: 'Outfit, sans-serif'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              Send Us an Email <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </div>
      <style>{`
        @media(max-width:900px){
          .contact-wrapper{grid-template-columns:1fr!important;}
        }
      `}</style>
    </SectionObserver>
  )
}