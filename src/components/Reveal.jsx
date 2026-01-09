import React, { useEffect, useRef, useState } from 'react';

export const Reveal = ({ children, delay = 0, style = {}, className = '' }) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`${isVisible ? 'reveal-visible' : 'reveal-hidden'} ${className}`}
            style={{ ...style, transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};
