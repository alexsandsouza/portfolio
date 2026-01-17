import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                min: Math.floor((difference / 1000 / 60) % 60),
                seg: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = { dias: 0, horas: 0, min: 0, seg: 0 };
        }
        return timeLeft;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const timeBlockStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '10px',
        borderRadius: '8px',
        minWidth: '70px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    };

    const numberStyle = {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: 'var(--primary-color)',
        lineHeight: '1',
        marginBottom: '4px',
        fontFamily: "'JetBrains Mono', monospace"
    };

    const labelStyle = {
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--text-secondary)'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '2rem 0' }}>
            <div style={timeBlockStyle}>
                <span style={numberStyle}>{String(timeLeft.dias).padStart(2, '0')}</span>
                <span style={labelStyle}>Dias</span>
            </div>
            <div style={timeBlockStyle}>
                <span style={numberStyle}>{String(timeLeft.horas).padStart(2, '0')}</span>
                <span style={labelStyle}>Horas</span>
            </div>
            <div style={timeBlockStyle}>
                <span style={numberStyle}>{String(timeLeft.min).padStart(2, '0')}</span>
                <span style={labelStyle}>Min</span>
            </div>
            <div style={timeBlockStyle}>
                <span style={numberStyle}>{String(timeLeft.seg).padStart(2, '0')}</span>
                <span style={labelStyle}>Seg</span>
            </div>
        </div>
    );
};

export default Countdown;
