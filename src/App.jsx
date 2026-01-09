import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Areas from './sections/Areas';
import Experience from './sections/Trajectory';
import BackendExpertise from './sections/BackendExpertise';
import Education from './sections/Education';
import Projects from './sections/Projects';
import Testimonials from './sections/Testimonials';
import Services from './sections/Services';
import Skills from './sections/Skills';
import Highlights from './sections/Highlights';
import Contact from './sections/Contact';

import { Routes, Route } from 'react-router-dom';
import Feedback from './pages/Feedback';

const Home = () => (
  <>
    <Navbar />
    <Hero />
    <About />
    <Areas />
    <BackendExpertise />
    <Experience />
    <Projects />
    <Testimonials />
    <Services />
    <Skills />
    <Education />
    <Highlights />
    <Contact />
  </>
);

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </div>
  );
}

export default App;
