export default function Footer() {
  return (
    <footer style={{
      padding: '2.5rem 5%', textAlign: 'center', fontSize: '0.85rem',
      color: 'var(--muted)', background: 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.7)'
    }}>
      <strong style={{ fontFamily: 'Syne, sans-serif', color: '#1a5cff' }}>ITWise Consults</strong> — Ask IT. Have IT. &nbsp;|&nbsp; &copy; {new Date().getFullYear()} ITWise. All rights reserved.
    </footer>
  )
}