import React, { useState, useEffect, lazy, Suspense } from 'react';
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
import PageLoader from './components/PageLoader';

import { Routes, Route } from 'react-router-dom';
import { useKonamiCode } from './hooks/useKonamiCode';
import MatrixEffect from './components/MatrixEffect';
import { usePageTitle } from './hooks/usePageTitle';
import { useSecurity } from './hooks/useSecurity';
import WhatsAppButton from './components/WhatsAppButton';
import { ScrollToTop } from './components/ScrollToTop';
import TopBanner from './components/TopBanner';
import Terminal from './components/Terminal';
import SecretChallenge from './components/SecretChallenge';

// Lazy-load all page routes (não carregados na entrada)
const Feedback = lazy(() => import('./pages/Feedback'));
const MentorshipPage = lazy(() => import('./pages/MentorshipPage'));
const MentorshipRegistration = lazy(() => import('./pages/MentorshipRegistration'));
const MentorshipContract = lazy(() => import('./pages/MentorshipContract'));
const MentorshipSuccess = lazy(() => import('./pages/MentorshipSuccess'));
const Links = lazy(() => import('./pages/Links'));
const Resume = lazy(() => import('./pages/Resume'));
const HackersDoBemHub = lazy(() => import('./pages/hackersdobem/HackersDoBemHub'));
const AtividadeHackersDoBem = lazy(() => import('./pages/hackersdobem/atividade_hackers_do_bem'));
const RankingHackersDoBem = lazy(() => import('./pages/hackersdobem/ranking_hackers_do_bem'));
const AtividadeHackersDoBemM4A03 = lazy(() => import('./pages/hackersdobem/atividade_m4a03'));
const RankingHackersDoBemM4A03 = lazy(() => import('./pages/hackersdobem/ranking_m4a03'));
const AtividadeHackersDoBemM4A04 = lazy(() => import('./pages/hackersdobem/atividade_m4a04'));
const RankingHackersDoBemM4A04 = lazy(() => import('./pages/hackersdobem/ranking_m4a04'));
const AtividadeExtraM05 = lazy(() => import('./pages/hackersdobem/atividade_extra_m05'));
const RankingExtraM05 = lazy(() => import('./pages/hackersdobem/ranking_extra_m05'));
const FametroHub = lazy(() => import('./pages/fametro/FametroHub'));
const POOActivity = lazy(() => import('./pages/fametro/disciplinas/POO/POOActivity'));
const POOJavaActivity = lazy(() => import('./pages/fametro/disciplinas/POO/POOJavaActivity'));
const RankingPOO = lazy(() => import('./pages/fametro/disciplinas/POO/RankingPOO'));
const RequisitosActivity = lazy(() => import('./pages/fametro/disciplinas/Requisitos/RequisitosActivity'));
const RankingRequisitos = lazy(() => import('./pages/fametro/disciplinas/Requisitos/RankingRequisitos'));
const SOActivity = lazy(() => import('./pages/fametro/disciplinas/SO/SOActivity'));
const SORanking = lazy(() => import('./pages/fametro/disciplinas/SO/SORanking'));
const Inovatech2026 = lazy(() => import('./pages/Inovatech2026'));

const Home = () => {
  usePageTitle();
  useSecurity();
  const konamiTriggered = useKonamiCode();
  const [showMatrix, setShowMatrix] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);

  useEffect(() => {
    if (konamiTriggered) setShowMatrix(true);

    const handleManualTrigger = () => setShowMatrix(true);
    const handleTerminalTrigger = () => setShowTerminal(true);
    const handleChallengeTrigger = () => setShowChallenge(true);

    window.addEventListener('trigger-matrix', handleManualTrigger);
    window.addEventListener('open-terminal', handleTerminalTrigger);
    window.addEventListener('trigger-challenge', handleChallengeTrigger);

    return () => {
      window.removeEventListener('trigger-matrix', handleManualTrigger);
      window.removeEventListener('open-terminal', handleTerminalTrigger);
      window.removeEventListener('trigger-challenge', handleChallengeTrigger);
    };
  }, [konamiTriggered]);

  return (
    <>
      <TopBanner />
      {showMatrix && <MatrixEffect onClose={() => setShowMatrix(false)} />}
      {showChallenge && <SecretChallenge onClose={() => setShowChallenge(false)} />}
      <Terminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} triggerMatrix={() => setShowMatrix(true)} />

      <MouseSpotlight />
      <ScrollProgress />
      <ThemeToggle />
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/mentoria" element={<MentorshipPage />} />
          <Route path="/mentoria/matricula" element={<MentorshipRegistration />} />
          <Route path="/mentoria/contrato" element={<MentorshipContract />} />
          <Route path="/mentoria/sucesso" element={<MentorshipSuccess />} />
          <Route path="/links" element={<Links />} />
          <Route path="/cv" element={<Resume />} />
          <Route path="/hackersdobem" element={<HackersDoBemHub />} />
          <Route path="/hackersdobem/atividade" element={<AtividadeHackersDoBem />} />
          <Route path="/hackersdobem/ranking" element={<RankingHackersDoBem />} />
          <Route path="/hackersdobem/atividade-m4a03" element={<AtividadeHackersDoBemM4A03 />} />
          <Route path="/hackersdobem/ranking-m4a03" element={<RankingHackersDoBemM4A03 />} />
          <Route path="/hackersdobem/atividade-m4a04" element={<AtividadeHackersDoBemM4A04 />} />
          <Route path="/hackersdobem/ranking-m4a04" element={<RankingHackersDoBemM4A04 />} />
          <Route path="/hackersdobem/atividade-extra" element={<AtividadeExtraM05 />} />
          <Route path="/hackersdobem/ranking-extra-m05" element={<RankingExtraM05 />} />
          <Route path="/fametro" element={<FametroHub />} />
          <Route path="/fametro/poo/atividade" element={<POOActivity />} />
          <Route path="/fametro/poo/java-atividade" element={<POOJavaActivity />} />
          <Route path="/fametro/poo/ranking" element={<RankingPOO />} />
          <Route path="/fametro/requisitos" element={<RequisitosActivity />} />
          <Route path="/fametro/requisitos/ranking" element={<RankingRequisitos />} />
          <Route path="/fametro/so" element={<SOActivity />} />
          <Route path="/fametro/so/ranking" element={<SORanking />} />
          <Route path="/inovatech2026" element={<Inovatech2026 />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
