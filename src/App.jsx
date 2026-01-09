import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Areas from './sections/Areas';
import Experience from './sections/Trajectory';
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
      <Experience />
      <Projects />
      <Services />
      <Skills />
      <Education />
      <Highlights />
      <Contact />

      <footer style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-color)', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        © {new Date().getFullYear()} Alexsander Farias. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default App;
