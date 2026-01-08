import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Trajectory from './sections/Trajectory';
import Projects from './sections/Projects';
import Services from './sections/Services';
import Skills from './sections/Skills';
import Contact from './sections/Contact';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Trajectory />
      <Services />
      <Projects />
      <Skills />
      <Contact />

      <footer style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-color)', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        © {new Date().getFullYear()} Alexsander Farias. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default App;
