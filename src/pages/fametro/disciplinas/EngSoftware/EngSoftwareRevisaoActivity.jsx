import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, ChevronLeft } from 'lucide-react';

export default function EngSoftwareRevisaoActivity() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070B14',
      color: '#cbd5e1',
      padding: '8rem 1.5rem 6rem',
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <Link to="/fametro" style={{ color: '#14B8A6', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '2rem', fontWeight: '600' }}>
          <ChevronLeft size={20} /> Voltar ao Hub
        </Link>
        
        <FileText size={64} color="#14B8A6" style={{ marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', color: '#fff', marginBottom: '1rem', lineHeight: '1.1' }}>
          Avaliação Institucional N2
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: '#14B8A6', marginBottom: '2rem', fontWeight: '500' }}>
          Engenharia de Software
        </h2>
        
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.7', marginBottom: '3rem' }}>
          Professor, os Modelos A e B da avaliação de Engenharia de Software foram gerados em formato Markdown.
          Você pode copiar os arquivos diretamente do seu repositório para aplicar a prova.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="https://github.com/alexsandsouza/portfolio/blob/main/Prova_Modelo_A_Eng_Software_FAMETRO.md" 
            target="_blank" rel="noreferrer"
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#14B8A6',
              color: '#000',
              fontWeight: '700',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Download size={20} /> Acessar Modelo A
          </a>
          
          <a 
            href="https://github.com/alexsandsouza/portfolio/blob/main/Prova_Modelo_B_Eng_Software_FAMETRO.md" 
            target="_blank" rel="noreferrer"
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              color: '#14B8A6',
              fontWeight: '700',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Download size={20} /> Acessar Modelo B
          </a>
        </div>
      </div>
    </div>
  );
}
