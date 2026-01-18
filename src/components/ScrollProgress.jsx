import React, { useEffect, useState } from 'react';

const ScrollProgress = () => {
    const [scrollWidth, setScrollWidth] = useState(0);

    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const updateScroll = (scrollTop / windowHeight) * 100;

        setScrollWidth(updateScroll);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '4px',
            width: '100%',
            background: 'transparent',
            zIndex: 10000
        }}>
            <div style={{
                height: '100%',
                width: `${scrollWidth}%`,
                background: 'linear-gradient(90deg, #6366f1, #d946ef, #10b981)', // Indigo -> Pink -> Emerald
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
                transition: 'width 0.1s ease-out',
                borderRadius: '0 2px 2px 0'
            }} />
        </div>
    );
};

export default ScrollProgress;
