import React, { useState } from 'react';
import { X } from 'lucide-react';

const TopBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="top-banner" style={{
            background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
            color: 'white',
            textAlign: 'center',
            padding: '8px 1rem',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 10000,
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
            <span>
                🚀 <strong>Últimas Vagas:</strong> Mentoria Carreira TI do Zero. <a href="/mentoria" style={{ color: 'white', textDecoration: 'underline' }}>Garanta a sua aqui!</a>
            </span>
            <button
                onClick={() => setIsVisible(false)}
                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default TopBanner;
