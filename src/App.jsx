import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Areas from './sections/Areas';
import Experience from './sections/Trajectory';
import BackendExpertise from './sections/BackendExpertise';
import Education from './sections/Education';
import Projects from './sections/Projects';
import Testimonials from './sections/Testimonials';
import Journey from './sections/Journey';
import AcademyHub from './sections/AcademyHub';
import MentorshipShowcase from './sections/MentorshipShowcase';
import Services from './sections/Services';
import Skills from './sections/Skills';
import Highlights from './sections/Highlights';
import Contact from './sections/Contact';
import ThemeToggle from './components/ThemeToggle';
import MouseSpotlight from './components/MouseSpotlight';
import ScrollProgress from './components/ScrollProgress';

import { Routes, Route } from 'react-router-dom';
import Feedback from './pages/Feedback';
import MentorshipPage from './pages/MentorshipPage';
import MentorshipRegistration from './pages/MentorshipRegistration';
import MentorshipContract from './pages/MentorshipContract';
import MentorshipSuccess from './pages/MentorshipSuccess';

import { useKonamiCode } from './hooks/useKonamiCode';
import MatrixEffect from './components/MatrixEffect';

import { usePageTitle } from './hooks/usePageTitle';
import { useSecurity } from './hooks/useSecurity'; // Import Security
import WhatsAppButton from './components/WhatsAppButton'; // Chat
import { ScrollToTop } from './components/ScrollToTop';
import TopBanner from './components/TopBanner';

const Home = () => {
  usePageTitle();
  useSecurity(); // Activate Shield
  const konamiTriggered = useKonamiCode();
  const [showMatrix, setShowMatrix] = useState(false);

  useEffect(() => {
    if (konamiTriggered) setShowMatrix(true);

    const handleManualTrigger = () => setShowMatrix(true);
    window.addEventListener('trigger-matrix', handleManualTrigger);
    return () => window.removeEventListener('trigger-matrix', handleManualTrigger);
  }, [konamiTriggered]);

  return (
    <>
      <TopBanner />
      {showMatrix && <MatrixEffect onClose={() => setShowMatrix(false)} />}
      <MouseSpotlight />
      <ScrollProgress />
      <ThemeToggle /> {/* Added Toggle */}
      <Navbar triggerMatrix={() => setShowMatrix(true)} />
      <Hero />
      <About />
      <Areas />
      <BackendExpertise />
      <Experience />
      <Projects />
      <Testimonials />
      <MentorshipShowcase />
      <AcademyHub />
      <Journey />
      <Services />
      <Skills />
      <Education />
      <Highlights />
      <Contact />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/mentoria" element={<MentorshipPage />} />
        <Route path="/mentoria/matricula" element={<MentorshipRegistration />} />
        <Route path="/mentoria/contrato" element={<MentorshipContract />} />
        <Route path="/mentoria/sucesso" element={<MentorshipSuccess />} />
      </Routes>
    </div>
  );
}

export default App;
