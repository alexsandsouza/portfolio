import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
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
import Terminal from './components/Terminal';
import SecretChallenge from './components/SecretChallenge';
import CookieConsent from './components/CookieConsent';

// Lazy-load sections abaixo da dobra (code splitting)
const Areas = lazy(() => import('./sections/Areas'));
const BackendExpertise = lazy(() => import('./sections/BackendExpertise'));
const Experience = lazy(() => import('./sections/Trajectory'));
const Education = lazy(() => import('./sections/Education'));
const Projects = lazy(() => import('./sections/Projects'));
const Testimonials = lazy(() => import('./sections/Testimonials'));
const Journey = lazy(() => import('./sections/Journey'));
const AcademyHub = lazy(() => import('./sections/AcademyHub'));
const MentorshipShowcase = lazy(() => import('./sections/MentorshipShowcase'));
const Services = lazy(() => import('./sections/Services'));
const Skills = lazy(() => import('./sections/Skills'));
const Highlights = lazy(() => import('./sections/Highlights'));
const Contact = lazy(() => import('./sections/Contact'));
const BehavioralDiscovery = lazy(() => import('./sections/BehavioralDiscovery'));

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
const AtividadeHDBM02 = lazy(() => import('./pages/hackersdobem/atividade_m02'));
const AtividadeHDBM03 = lazy(() => import('./pages/hackersdobem/atividade_m03'));
const AtividadeHDBM04 = lazy(() => import('./pages/hackersdobem/atividade_m04'));
const AtividadeHDBM05 = lazy(() => import('./pages/hackersdobem/atividade_m05'));
const AtividadeHDBM06 = lazy(() => import('./pages/hackersdobem/atividade_m06'));
const AtividadeHDBM07 = lazy(() => import('./pages/hackersdobem/atividade_m07'));
const AtividadeHDBM08 = lazy(() => import('./pages/hackersdobem/atividade_m08'));
const AtividadeHDBM09 = lazy(() => import('./pages/hackersdobem/atividade_m09'));
const AtividadeHDBM10 = lazy(() => import('./pages/hackersdobem/atividade_m10'));
const AtividadeHDBM11 = lazy(() => import('./pages/hackersdobem/atividade_m11'));
const AtividadeHDBM12 = lazy(() => import('./pages/hackersdobem/atividade_m12'));
const RankingModulo = lazy(() => import('./pages/hackersdobem/RankingModulo'));
const FametroHub = lazy(() => import('./pages/fametro/FametroHub'));
const POOActivity = lazy(() => import('./pages/fametro/disciplinas/POO/POOActivity'));
const POOJavaActivity = lazy(() => import('./pages/fametro/disciplinas/POO/POOJavaActivity'));
const POOConstrutoresActivity = lazy(() => import('./pages/fametro/disciplinas/POO/POOConstrutoresActivity'));
const RankingPOO = lazy(() => import('./pages/fametro/disciplinas/POO/RankingPOO'));
const SimuladoN2 = lazy(() => import('./pages/fametro/disciplinas/POO/SimuladoN2'));
const RankingSimuladoN2 = lazy(() => import('./pages/fametro/disciplinas/POO/RankingSimuladoN2'));
const RequisitosActivity = lazy(() => import('./pages/fametro/disciplinas/Requisitos/RequisitosActivity'));
const RequisitosRevisaoActivity = lazy(() => import('./pages/fametro/disciplinas/Requisitos/RequisitosRevisaoActivity'));
const RankingRequisitos = lazy(() => import('./pages/fametro/disciplinas/Requisitos/RankingRequisitos'));
const RankingRequisitosRevisao = lazy(() => import('./pages/fametro/disciplinas/Requisitos/RankingRequisitosRevisao'));
const RequisitosSimuladoN2 = lazy(() => import('./pages/fametro/disciplinas/Requisitos/RequisitosSimuladoN2'));
const RankingRequisitosSimuladoN2 = lazy(() => import('./pages/fametro/disciplinas/Requisitos/RankingRequisitosSimuladoN2'));
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
const EngSoftwareRevisaoActivity = lazy(() => import('./pages/fametro/disciplinas/EngSoftware/EngSoftwareRevisaoActivity'));
const RankingEngSoftwareRevisao = lazy(() => import('./pages/fametro/disciplinas/EngSoftware/RankingEngSoftwareRevisao'));
const Inovatech2026 = lazy(() => import('./pages/Inovatech2026'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TechAffinityTest = lazy(() => import('./pages/TechAffinityTest'));
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
      {showMatrix && <MatrixEffect onClose={() => setShowMatrix(false)} />}
      {showChallenge && <SecretChallenge onClose={() => setShowChallenge(false)} />}
      <Terminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} triggerMatrix={() => setShowMatrix(true)} />

      <MouseSpotlight />
      <ScrollProgress />
      <ThemeToggle />
      <Navbar triggerMatrix={() => setShowMatrix(true)} />
      <Hero />
      <About />
      <Suspense fallback={null}>
        <Areas />
        <BackendExpertise />
        <Experience />
        <Projects />
        <Testimonials />
        <MentorshipShowcase />
        <AcademyHub />
        <BehavioralDiscovery />
        <Journey />
        <Services />
        <Skills />
        <Education />
        <Highlights />
        <Contact />
      </Suspense>
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
          <Route path="/teste-afinidade" element={<TechAffinityTest />} />
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
          <Route path="/hackersdobem/atividade-m02" element={<AtividadeHDBM02 />} />
          <Route path="/hackersdobem/atividade-m03" element={<AtividadeHDBM03 />} />
          <Route path="/hackersdobem/atividade-m04" element={<AtividadeHDBM04 />} />
          <Route path="/hackersdobem/atividade-m05" element={<AtividadeHDBM05 />} />
          <Route path="/hackersdobem/atividade-m06" element={<AtividadeHDBM06 />} />
          <Route path="/hackersdobem/atividade-m07" element={<AtividadeHDBM07 />} />
          <Route path="/hackersdobem/atividade-m08" element={<AtividadeHDBM08 />} />
          <Route path="/hackersdobem/atividade-m09" element={<AtividadeHDBM09 />} />
          <Route path="/hackersdobem/atividade-m10" element={<AtividadeHDBM10 />} />
          <Route path="/hackersdobem/atividade-m11" element={<AtividadeHDBM11 />} />
          <Route path="/hackersdobem/atividade-m12" element={<AtividadeHDBM12 />} />
          {/* Ranking genérico — substitui 12 arquivos individuais */}
          <Route path="/hackersdobem/ranking-:modulo" element={<RankingModulo />} />
          <Route path="/fametro" element={<FametroHub />} />
          <Route path="/fametro/poo/atividade" element={<POOActivity />} />
          <Route path="/fametro/poo/java-atividade" element={<POOJavaActivity />} />
          <Route path="/fametro/poo/construtores" element={<POOConstrutoresActivity />} />
          <Route path="/fametro/poo/ranking" element={<RankingPOO />} />
          <Route path="/fametro/poo/simulado-n2" element={<SimuladoN2 />} />
          <Route path="/fametro/poo/simulado-n2/ranking" element={<RankingSimuladoN2 />} />
          <Route path="/fametro/requisitos" element={<RequisitosActivity />} />
          <Route path="/fametro/requisitos/revisao" element={<RequisitosRevisaoActivity />} />
          <Route path="/fametro/requisitos/ranking" element={<RankingRequisitos />} />
          <Route path="/fametro/requisitos/revisao/ranking" element={<RankingRequisitosRevisao />} />
          <Route path="/fametro/requisitos/simulado-n2" element={<RequisitosSimuladoN2 />} />
          <Route path="/fametro/requisitos/simulado-n2/ranking" element={<RankingRequisitosSimuladoN2 />} />
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
          <Route path="/fametro/eng-software/revisao" element={<EngSoftwareRevisaoActivity />} />
          <Route path="/fametro/eng-software/revisao/ranking" element={<RankingEngSoftwareRevisao />} />
          <Route path="/inovatech2026" element={<Inovatech2026 />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <CookieConsent />
    </div>
  );
}

export default App;
