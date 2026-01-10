import React, { useEffect, useState } from 'react';

const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setProgress(Number(scroll));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            zIndex: 10002, // Above Navbar (Navbar is 9999)
            background: 'transparent'
        }}>
            <div style={{
                width: `${progress * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--accent-color))',
                backgroundSize: '200% 100%',
                animation: 'gradientMove 2s linear infinite',
                boxShadow: '0 0 10px var(--primary-color)'
            }} />
            <style>{`
                @keyframes gradientMove { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
            `}</style>
        </div>
    );
};

export default ScrollProgress;
