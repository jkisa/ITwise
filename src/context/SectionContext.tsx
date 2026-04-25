import { createContext, useContext, useState, ReactNode } from 'react'

export type SectionName = 'hero' | 'about' | 'services' | 'team' | 'csr' | 'contact'

interface SectionCtx {
  active: SectionName
  setActive: (s: SectionName) => void
  scrollProgress: number
  setScrollProgress: (n: number) => void
}

const SectionContext = createContext<SectionCtx>({
  active: 'hero',
  setActive: () => {},
  scrollProgress: 0,
  setScrollProgress: () => {},
})

export const SectionProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState<SectionName>('hero')
  const [scrollProgress, setScrollProgress] = useState(0)

  return (
    <SectionContext.Provider value={{ active, setActive, scrollProgress, setScrollProgress }}>
      {children}
    </SectionContext.Provider>
  )
}

export const useSection = () => useContext(SectionContext)