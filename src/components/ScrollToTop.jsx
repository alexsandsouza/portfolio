import React, { useState, useEffect } from 'react';

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled upto given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <>
            {isVisible && (
                <div
                    onClick={scrollToTop}
                    title="Voltar ao topo"
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        left: '30px', // Left side to avoid conflict with WhatsApp button on right
                        zIndex: 99,
                        cursor: 'pointer',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'rgba(99, 102, 241, 0.2)', // Primary transparent
                        backdropFilter: 'blur(5px)',
                        border: '1px solid var(--primary-color)',
                        color: 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
                        animation: 'fadeIn 0.5s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.background = 'var(--primary-color)';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                        e.currentTarget.style.color = 'var(--primary-color)';
                    }}
                >
                    ↑
                </div>
            )}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
};
