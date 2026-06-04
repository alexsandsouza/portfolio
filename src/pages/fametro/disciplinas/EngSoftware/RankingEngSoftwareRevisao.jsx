import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronLeft } from 'lucide-react';

export default function RankingEngSoftwareRevisao() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#070B14', color: '#cbd5e1',
      padding: '8rem 1.5rem 6rem', fontFamily: '"Inter", sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
    }}>
      <Link to="/fametro" style={{ color: '#14B8A6', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '2rem', fontWeight: '600' }}>
        <ChevronLeft size={20} /> Voltar ao Hub
      </Link>
      <Trophy size={64} color="#14B8A6" style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', fontWeight: '900', marginBottom: '1rem', lineHeight: '1.1' }}>
        Ranking da N2
      </h1>
      <h2 style={{ fontSize: '1.5rem', color: '#14B8A6', marginBottom: '2rem', fontWeight: '500' }}>
        Engenharia de Software
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>
        A Avaliação Institucional N2 é realizada offline através dos Modelos A e B impressos.
        O Placar Geral da turma será publicado aqui pelo professor após a correção oficial.
      </p>
    </div>
  );
}
