import { SectionProvider } from './context/SectionContext'
import ShaderCanvas from './shaders/Scene'
import Navigation from './components/Navigation'
import CustomCursor from './components/CustomCursor'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ServicesSection from './sections/ServicesSection'
import TeamSection from './sections/TeamSection'
import CSRSection from './sections/CSRSection'
import ContactSection from './sections/ContactSection'
import Footer from './sections/Footer'

export default function App() {
  return (
    <SectionProvider>
      <CustomCursor />
      <ShaderCanvas />
      <div className="page">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TeamSection />
        <CSRSection />
        <ContactSection />
        <Footer />
      </div>
    </SectionProvider>
  )
}