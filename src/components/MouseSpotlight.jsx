import React, { useEffect, useState } from 'react';

const MouseSpotlight = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setOpacity(1);
        };

        const handleMouseLeave = () => {
            setOpacity(0);
        };

        const handleMouseEnter = () => {
            setOpacity(1);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        // Check for touch device - disable
        if (window.matchMedia("(pointer: coarse)").matches) {
            setOpacity(0);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    return (
        <div
            style={{
                pointerEvents: 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999, // Below modal but above content usually - Wait, spotlight should be Background?
                // If it's a cursor follower (dot), Top Z.
                // If it's a Flashlight (glow), Background Z?
                // The user asked for "Following cursor". A glow is nicer.
                // Let's make it MIX_BLEND_MODE overlay or screen to blend nicely.
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--spotlight-color, rgba(99, 102, 241, 0.15)), transparent 40%)`,
                opacity: opacity,
                transition: 'opacity 0.3s ease',
                mixBlendMode: 'screen' // Or overlay?
            }}
        >
            <style>{`
                [data-theme="dark"] { --spotlight-color: rgba(99, 102, 241, 0.15); }
                [data-theme="light"] { --spotlight-color: rgba(236, 72, 153, 0.1); }
            `}</style>
        </div>
    );
};

export default MouseSpotlight;
