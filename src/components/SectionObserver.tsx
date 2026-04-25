import { useEffect, useRef, ReactNode } from 'react'
import { useSection } from '../context/SectionContext'
import { SectionName } from '../context/SectionContext'

export default function SectionObserver({
  id,
  section,
  children,
  className,
  style,
}: {
  id: string
  section: SectionName
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLElement>(null)
  const { setActive } = useSection()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(section)
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [section, setActive])

  return (
    <section ref={ref} id={id} className={className} style={style}>
      {children}
    </section>
  )
}