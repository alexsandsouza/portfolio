import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Areas from './sections/Areas';
import Experience from './sections/Trajectory';
import BackendExpertise from './sections/BackendExpertise';
import Education from './sections/Education';
import Projects from './sections/Projects';
import Services from './sections/Services';
import Skills from './sections/Skills';
import Highlights from './sections/Highlights';
import Contact from './sections/Contact';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Areas />
      <BackendExpertise />
      <Experience />
      <Projects />
      <Services />
      <Skills />
      <Education />
      <Highlights />
      <Contact />
    </div>
  );
}

export default App;
