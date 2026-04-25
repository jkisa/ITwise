import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) {
      setHidden(true)
      return
    }

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    const onDown = () => {
      if (ring.current) ring.current.style.transform = `translate(-50%, -50%) scale(0.8)`
    }
    const onUp = () => {
      if (ring.current) ring.current.style.transform = `translate(-50%, -50%) scale(1)`
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    let raf: number
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15
      pos.current.y += (target.current.y - pos.current.y) * 0.15
      if (dot.current) {
        dot.current.style.left = `${target.current.x}px`
        dot.current.style.top = `${target.current.y}px`
      }
      if (ring.current) {
        ring.current.style.left = `${pos.current.x}px`
        ring.current.style.top = `${pos.current.y}px`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (hidden) return null

  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  )
}