import React, { useEffect } from 'react';

const Inovatech2026 = () => {
  useEffect(() => {
    document.title = "Inov@tech 2026 - Amazon Tech";
    // Lock scroll on the body so the iframe fits perfectly
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#0f3d20' }}>
      {/* Botão de voltar ao portfólio flutuante */}
      <button 
        onClick={() => window.location.href = "/"}
        style={{
          position: 'fixed',
          top: '15px',
          right: '15px',
          zIndex: 9999,
          backgroundColor: '#1a7a4a',
          color: 'white',
          border: '1px solid #23a65e',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '12px',
          fontWeight: '500',
          cursor: 'pointer',
          fontFamily: "'Space Grotesk', sans-serif",
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#23a65e'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1a7a4a'}
      >
        ← Voltar ao Portfólio
      </button>

      <iframe 
        src="/Inovatech2026/inovtech_2026_amazon_tech.html" 
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="Inovatech 2026 Amazon Tech"
      />
    </div>
  );
};

export default Inovatech2026;
