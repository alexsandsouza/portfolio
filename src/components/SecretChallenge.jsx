import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const SecretChallenge = ({ onClose }) => {
    const [input, setInput] = useState('');
    const [phase, setPhase] = useState('detecting'); // detecting, breach, challenge, success, failed
    const [message, setMessage] = useState('');
    const inputRef = useRef(null);

    // Glitch effect sound (optional, kept silent for web etiquette but visualized)

    useEffect(() => {
        // Simulation sequence
        const timer1 = setTimeout(() => setPhase('breach'), 500);
        const timer2 = setTimeout(() => setPhase('challenge'), 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    useEffect(() => {
        if (phase === 'challenge' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [phase]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const answer = input.toLowerCase().trim();

        // Puzzle: "O que é 1 + '1' em Javascript?" -> "11"
        // Puzzle: "console.log(typeof NaN)" -> "number"

        if (answer === '11') {
            setPhase('success');
            triggerSuccess();
        } else {
            setPhase('failed');
            setTimeout(() => {
                setPhase('challenge');
                setInput('');
            }, 2000);
        }
    };

    const triggerSuccess = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.95)',
            fontFamily: '"Fira Code", monospace',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            color: '#00ff00'
        }}>
            {/* Background Grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                pointerEvents: 'none'
            }}></div>

            {/* Content Container */}
            <div style={{
                maxWidth: '600px',
                width: '90%',
                padding: '2rem',
                border: '2px solid #00ff00',
                background: '#0a0a0a',
                boxShadow: '0 0 20px #00ff00',
                position: 'relative',
                animation: phase === 'breach' ? 'shake 0.5s infinite' : 'none'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '10px', right: '15px',
                        background: 'transparent', border: 'none', color: '#00ff00',
                        fontSize: '1.5rem', cursor: 'pointer'
                    }}>×</button>

                {phase === 'detecting' && (
                    <h2 className="glitch-text">⚠️ ANOMALY DETECTED...</h2>
                )}

                {phase === 'breach' && (
                    <div>
                        <h2 className="glitch-text" style={{ color: 'red' }}>🚨 SYSTEM COMPROMISED</h2>
                        <p>Tracing IP address...</p>
                        <p>Firewall: BREACHED</p>
                    </div>
                )}

                {phase === 'challenge' && (
                    <div>
                        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>🕵️ BUG HUNTER CHALLENGE</h3>
                            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Prove your developer knowledge to regain control.</p>
                        </div>

                        <div style={{ background: '#111', padding: '15px', borderRadius: '5px', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
                            <p style={{ color: '#aaa', margin: '0 0 10px 0' }}>// Question 01:</p>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <span style={{ color: '#cc77ff' }}>console</span>.<span style={{ color: '#61afef' }}>log</span>(
                                <span style={{ color: '#d19a66' }}>1</span> + <span style={{ color: '#98c379' }}>'1'</span>
                                );
                            </p>
                            <p style={{ color: '#555', marginTop: '10px' }}>// Output?</p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '1.5rem', marginTop: '5px' }}>&gt;</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type the output..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '2px solid #00ff00',
                                    color: '#00ff00',
                                    fontSize: '1.5rem',
                                    fontFamily: 'monospace',
                                    outline: 'none',
                                    padding: '5px'
                                }}
                            />
                        </form>
                        {input.length > 0 && <p style={{ fontSize: '0.8rem', marginTop: '10px', opacity: 0.7 }}>Press ENTER to submit</p>}
                    </div>
                )}

                {phase === 'failed' && (
                    <div style={{ textAlign: 'center', color: 'red' }}>
                        <h1>❌ ACCESS DENIED</h1>
                        <p>Incorrect syntax. Rebooting...</p>
                    </div>
                )}

                {phase === 'success' && (
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</h1>
                        <h2 className="rainbow-text">ACCESS GRANTED!</h2>
                        <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>You are a true JS Warrior.</p>
                        <div style={{
                            padding: '15px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px dashed #00ff00',
                            marginTop: '20px'
                        }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>SECRET CODE: "DEV-MASTER-2024"</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>(Take a screenshot!)</p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                marginTop: '30px',
                                padding: '10px 20px',
                                background: '#00ff00',
                                color: 'black',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}>
                            RETURN TO SYSTEM
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .glitch-text {
                    position: relative;
                }
                .glitch-text::before, .glitch-text::after {
                    content: attr(innerText);
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                }
                .glitch-text::before {
                    left: 2px;
                    text-shadow: -1px 0 red;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim 5s infinite linear alternate-reverse;
                }
                .glitch-text::after {
                    left: -2px;
                    text-shadow: -1px 0 blue;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim2 5s infinite linear alternate-reverse;
                }
                .rainbow-text {
                    background: linear-gradient(to right, #6666ff, #0099ff , #00ff00, #ff3399, #6666ff);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    animation: rainbow_animation 6s ease-in-out infinite;
                    background-size: 400% 100%;
                }
                @keyframes rainbow_animation {
                    0%,100% { background-position: 0 0; }
                    50% { background-position: 100% 0; }
                }
            `}</style>
        </div>
    );
};

export default SecretChallenge;
