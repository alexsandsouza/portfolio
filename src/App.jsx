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
const AtividadeHDBM01 = lazy(() => import('./pages/hackersdobem/atividade_m01'));
const RankingHDBM01 = lazy(() => import('./pages/hackersdobem/ranking_m01'));
const AtividadeHDBM02 = lazy(() => import('./pages/hackersdobem/atividade_m02'));
const RankingHDBM02 = lazy(() => import('./pages/hackersdobem/ranking_m02'));
const AtividadeHDBM03 = lazy(() => import('./pages/hackersdobem/atividade_m03'));
const RankingHDBM03 = lazy(() => import('./pages/hackersdobem/ranking_m03'));
const AtividadeHDBM04 = lazy(() => import('./pages/hackersdobem/atividade_m04'));
const RankingHDBM04 = lazy(() => import('./pages/hackersdobem/ranking_m04'));
const AtividadeHackersDoBemM4A03 = lazy(() => import('./pages/hackersdobem/atividade_m4a03'));
const RankingHackersDoBemM4A03 = lazy(() => import('./pages/hackersdobem/ranking_m4a03'));
const AtividadeHackersDoBemM4A04 = lazy(() => import('./pages/hackersdobem/atividade_m4a04'));
const RankingHackersDoBemM4A04 = lazy(() => import('./pages/hackersdobem/ranking_m4a04'));
const AtividadeExtraM05 = lazy(() => import('./pages/hackersdobem/atividade_extra_m05'));
const RankingExtraM05 = lazy(() => import('./pages/hackersdobem/ranking_extra_m05'));
const AtividadeM5A02 = lazy(() => import('./pages/hackersdobem/atividade_m5a02'));
const RankingM5A02 = lazy(() => import('./pages/hackersdobem/ranking_m5a02'));
const AtividadeM5A03 = lazy(() => import('./pages/hackersdobem/atividade_m5a03'));
const RankingM5A03 = lazy(() => import('./pages/hackersdobem/ranking_m5a03'));
const AtividadeM5M6Desafio = lazy(() => import('./pages/hackersdobem/atividade_m5m6_desafio'));
const RankingM5M6Desafio = lazy(() => import('./pages/hackersdobem/ranking_m5m6_desafio'));
const AtividadeHDBM6M7 = lazy(() => import('./pages/hackersdobem/atividade_m6_m7'));
const RankingHDBM6M7 = lazy(() => import('./pages/hackersdobem/ranking_m6_m7'));
const AtividadeHDBM06 = lazy(() => import('./pages/hackersdobem/atividade_m06'));
const RankingHDBM06 = lazy(() => import('./pages/hackersdobem/ranking_m06'));
const AtividadeHDBM07 = lazy(() => import('./pages/hackersdobem/atividade_m07'));
const RankingHDBM07 = lazy(() => import('./pages/hackersdobem/ranking_m07'));
const AtividadeHDBM08 = lazy(() => import('./pages/hackersdobem/atividade_m08'));
const RankingHDBM08 = lazy(() => import('./pages/hackersdobem/ranking_m08'));
const AtividadeHDBM09 = lazy(() => import('./pages/hackersdobem/atividade_m09'));
const RankingHDBM09 = lazy(() => import('./pages/hackersdobem/ranking_m09'));
const AtividadeHDBM10 = lazy(() => import('./pages/hackersdobem/atividade_m10'));
const RankingHDBM10 = lazy(() => import('./pages/hackersdobem/ranking_m10'));
const AtividadeHDBM11 = lazy(() => import('./pages/hackersdobem/atividade_m11'));
const RankingHDBM11 = lazy(() => import('./pages/hackersdobem/ranking_m11'));
const AtividadeHDBM12 = lazy(() => import('./pages/hackersdobem/atividade_m12'));
const RankingHDBM12 = lazy(() => import('./pages/hackersdobem/ranking_m12'));
const FametroHub = lazy(() => import('./pages/fametro/FametroHub'));
const POOActivity = lazy(() => import('./pages/fametro/disciplinas/POO/POOActivity'));
const POOJavaActivity = lazy(() => import('./pages/fametro/disciplinas/POO/POOJavaActivity'));
const POOConstrutoresActivity = lazy(() => import('./pages/fametro/disciplinas/POO/POOConstrutoresActivity'));
const RankingPOO = lazy(() => import('./pages/fametro/disciplinas/POO/RankingPOO'));
const RequisitosActivity = lazy(() => import('./pages/fametro/disciplinas/Requisitos/RequisitosActivity'));
const RankingRequisitos = lazy(() => import('./pages/fametro/disciplinas/Requisitos/RankingRequisitos'));
const SOActivity = lazy(() => import('./pages/fametro/disciplinas/SO/SOActivity'));
const SORanking = lazy(() => import('./pages/fametro/disciplinas/SO/SORanking'));
const SOUnidade1Activity = lazy(() => import('./pages/fametro/disciplinas/SO/SOUnidade1Activity'));
const SORankingU1 = lazy(() => import('./pages/fametro/disciplinas/SO/SORankingU1'));
const SOAula5Activity = lazy(() => import('./pages/fametro/disciplinas/SO/SOAula5Activity'));
const SORankingAula5 = lazy(() => import('./pages/fametro/disciplinas/SO/SORankingAula5'));
const MatrizesActivity = lazy(() => import('./pages/fametro/disciplinas/AED/MatrizesActivity'));
const MatrizesRanking = lazy(() => import('./pages/fametro/disciplinas/AED/MatrizesRanking'));
const MatrizesLab = lazy(() => import('./pages/fametro/disciplinas/AED/MatrizesLab'));
const TecnologiaWebActivity = lazy(() => import('./pages/fametro/disciplinas/TecnologiaWeb/HTMLSemanticActivity'));
const TecnologiaWebRanking = lazy(() => import('./pages/fametro/disciplinas/TecnologiaWeb/RankingHTMLSemantic'));
const Inovatech2026 = lazy(() => import('./pages/Inovatech2026'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
          <Route path="/hackersdobem/atividade-m01" element={<AtividadeHDBM01 />} />
          <Route path="/hackersdobem/ranking-m01" element={<RankingHDBM01 />} />
          <Route path="/hackersdobem/atividade-m02" element={<AtividadeHDBM02 />} />
          <Route path="/hackersdobem/ranking-m02" element={<RankingHDBM02 />} />
          <Route path="/hackersdobem/atividade-m03" element={<AtividadeHDBM03 />} />
          <Route path="/hackersdobem/ranking-m03" element={<RankingHDBM03 />} />
          <Route path="/hackersdobem/atividade-m04" element={<AtividadeHDBM04 />} />
          <Route path="/hackersdobem/ranking-m04" element={<RankingHDBM04 />} />
          <Route path="/hackersdobem/atividade-m4a03" element={<AtividadeHackersDoBemM4A03 />} />
          <Route path="/hackersdobem/ranking-m4a03" element={<RankingHackersDoBemM4A03 />} />
          <Route path="/hackersdobem/atividade-m4a04" element={<AtividadeHackersDoBemM4A04 />} />
          <Route path="/hackersdobem/ranking-m4a04" element={<RankingHackersDoBemM4A04 />} />
          <Route path="/hackersdobem/atividade-extra" element={<AtividadeExtraM05 />} />
          <Route path="/hackersdobem/ranking-extra-m05" element={<RankingExtraM05 />} />
          <Route path="/hackersdobem/atividade-m5a02" element={<AtividadeM5A02 />} />
          <Route path="/hackersdobem/ranking-m5a02" element={<RankingM5A02 />} />
          <Route path="/hackersdobem/atividade-m5a03" element={<AtividadeM5A03 />} />
          <Route path="/hackersdobem/ranking-m5a03" element={<RankingM5A03 />} />
          <Route path="/hackersdobem/desafio-m5-m6" element={<AtividadeM5M6Desafio />} />
          <Route path="/hackersdobem/ranking-m5m6" element={<RankingM5M6Desafio />} />
          <Route path="/hackersdobem/atividade-m6-m7" element={<AtividadeHDBM6M7 />} />
          <Route path="/hackersdobem/ranking-m6-m7" element={<RankingHDBM6M7 />} />
          <Route path="/hackersdobem/atividade-m06" element={<AtividadeHDBM06 />} />
          <Route path="/hackersdobem/ranking-m06" element={<RankingHDBM06 />} />
          <Route path="/hackersdobem/atividade-m07" element={<AtividadeHDBM07 />} />
          <Route path="/hackersdobem/ranking-m07" element={<RankingHDBM07 />} />
          <Route path="/hackersdobem/atividade-m08" element={<AtividadeHDBM08 />} />
          <Route path="/hackersdobem/ranking-m08" element={<RankingHDBM08 />} />
          <Route path="/hackersdobem/atividade-m09" element={<AtividadeHDBM09 />} />
          <Route path="/hackersdobem/ranking-m09" element={<RankingHDBM09 />} />
          <Route path="/hackersdobem/atividade-m10" element={<AtividadeHDBM10 />} />
          <Route path="/hackersdobem/ranking-m10" element={<RankingHDBM10 />} />
          <Route path="/hackersdobem/atividade-m11" element={<AtividadeHDBM11 />} />
          <Route path="/hackersdobem/ranking-m11" element={<RankingHDBM11 />} />
          <Route path="/hackersdobem/atividade-m12" element={<AtividadeHDBM12 />} />
          <Route path="/hackersdobem/ranking-m12" element={<RankingHDBM12 />} />
          <Route path="/fametro" element={<FametroHub />} />
          <Route path="/fametro/poo/atividade" element={<POOActivity />} />
          <Route path="/fametro/poo/java-atividade" element={<POOJavaActivity />} />
          <Route path="/fametro/poo/construtores" element={<POOConstrutoresActivity />} />
          <Route path="/fametro/poo/ranking" element={<RankingPOO />} />
          <Route path="/fametro/requisitos" element={<RequisitosActivity />} />
          <Route path="/fametro/requisitos/ranking" element={<RankingRequisitos />} />
          <Route path="/fametro/so" element={<SOActivity />} />
          <Route path="/fametro/so/ranking" element={<SORanking />} />
          <Route path="/fametro/so/unidade1" element={<SOUnidade1Activity />} />
          <Route path="/fametro/so/aula5" element={<SOAula5Activity />} />
          <Route path="/fametro/so/aula5/ranking" element={<SORankingAula5 />} />
          <Route path="/fametro/so-u1/ranking" element={<SORankingU1 />} />
          <Route path="/fametro/aed/matrizes" element={<MatrizesActivity />} />
          <Route path="/fametro/aed/matrizes/ranking" element={<MatrizesRanking />} />
          <Route path="/fametro/aed/matrizes/lab" element={<MatrizesLab />} />
          <Route path="/fametro/tecnologia-web/html-semantico" element={<TecnologiaWebActivity />} />
          <Route path="/fametro/tecnologia-web/html-semantico/ranking" element={<TecnologiaWebRanking />} />
          <Route path="/inovatech2026" element={<Inovatech2026 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
