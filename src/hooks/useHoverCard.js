import { useRef, useState, useEffect } from 'react';

/**
 * Hook to apply a 3D tilt effect to a card on hover.
 * Returns reference to bind to element and transform style.
 */
export const useHoverCard = ({
    perspective = 1000,
    scale = 1.05,
    maxRotation = 5,
    glowOpacity = 0.2
} = {}) => {
    const ref = useRef(null);
    const [styles, setStyles] = useState({ transform: 'none', transition: 'transform 0.1s ease', glow: 'none' });

    useEffect(() => {
        const card = ref.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -maxRotation;
            const rotateY = ((x - centerX) / centerX) * maxRotation;

            /* Calculate glow position */
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;

            setStyles({
                transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                transition: 'transform 0.05s ease',
                glow: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,${glowOpacity}), transparent 60%)`
            });
        };

        const handleMouseLeave = () => {
            setStyles({
                transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
                transition: 'transform 0.5s ease',
                glow: 'none'
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [perspective, scale, maxRotation, glowOpacity]);

    return { ref, style: styles };
};
