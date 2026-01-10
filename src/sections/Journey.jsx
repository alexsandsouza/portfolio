import React, { useState, useEffect } from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import confetti from 'canvas-confetti';
import { CheckCircle2, Circle, Trophy, Lock, Unlock, ArrowRight, Swords } from 'lucide-react';
import HangmanGame from '../components/HangmanGame';
import Ranking from '../components/Ranking';

const Journey = () => {
    const { journey } = portfolioContent;
    const [completedSteps, setCompletedSteps] = useState([]);
    const [rewardUnlocked, setRewardUnlocked] = useState(false);
    const [showGame, setShowGame] = useState(false);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('user_journey_progress');
        if (saved) {
            setCompletedSteps(JSON.parse(saved));
        }
    }, []);

    // Save & Check Completion
    useEffect(() => {
        localStorage.setItem('user_journey_progress', JSON.stringify(completedSteps));
        if (completedSteps.length === journey.steps.length) {
            setRewardUnlocked(true);
        } else {
            setRewardUnlocked(false);
        }
    }, [completedSteps, journey.steps.length]);

    const steps = journey.steps;
    const progress = Math.round((completedSteps.length / steps.length) * 100);

    const toggleStep = (id) => {
        const isAlreadyCompleted = completedSteps.includes(id);

        if (isAlreadyCompleted) {
            setCompletedSteps(prev => prev.filter(stepId => stepId !== id));
        } else {
            setCompletedSteps(prev => {
                const newSteps = [...prev, id];
                if (newSteps.length === steps.length) {
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 },
                        colors: ['#6366f1', '#fbbf24']
                    });
                }
                return newSteps;
            });
            if (navigator.vibrate) navigator.vibrate(15);
        }
    };

    return (
        <section id="journey" className="section" style={{
            background: 'var(--bg-secondary)', // Theme aware background
            borderTop: '1px solid var(--border-color)'
        }}>
            {showGame && <HangmanGame onClose={() => setShowGame(false)} />}

            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">{journey.subtitle}</span>
                        <h2>{journey.title}</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                            {journey.description}
                        </p>
                    </div>
                </Reveal>

                {/* Progress Bar */}
                <Reveal delay={100}>
                    <div style={{ maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem',
                            color: progress === 100 ? '#10b981' : 'var(--text-primary)', fontWeight: 'bold'
                        }}>
                            <span>Progresso</span>
                            <span>{progress}%</span>
                        </div>
                        <div style={{ width: '100%', height: '10px', background: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${progress}%`, height: '100%',
                                background: progress === 100 ? '#10b981' : 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
                                transition: 'width 0.5s ease, background 0.3s ease'
                            }} />
                        </div>
                    </div>
                </Reveal>

                <div className="journey-grid">
                    {/* Steps Column */}
                    <div className="steps-container">
                        {steps.map((step, index) => {
                            const isDone = completedSteps.includes(step.id);
                            return (
                                <Reveal key={step.id} delay={index * 100}>
                                    <div
                                        onClick={() => toggleStep(step.id)}
                                        className={`journey-step ${isDone ? 'completed' : ''}`}
                                    >
                                        <div className="checkbox-icon">
                                            {isDone ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                                        </div>
                                        <div className="step-text">
                                            {step.label}
                                        </div>
                                        {index !== steps.length - 1 && (
                                            <div className={`step-line ${isDone && completedSteps.includes(steps[index + 1]?.id) ? 'active' : ''}`} />
                                        )}
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>

                    {/* Reward Column (Gate to the Game) */}
                    <div className="reward-container">
                        <Reveal delay={400}>
                            <div className={`reward-card ${rewardUnlocked ? 'unlocked' : 'locked'}`}>
                                <div className="reward-icon-wrapper">
                                    {rewardUnlocked ? <Swords size={40} className="unlock-icon" /> : <Lock size={40} />}
                                </div>

                                {rewardUnlocked ? (
                                    <>
                                        <h3>Desafio Final Disponível!</h3>
                                        <p>{journey.reward.description}</p>
                                        <button onClick={() => setShowGame(true)} className="btn btn-primary reward-btn glow-pulse">
                                            {journey.reward.buttonLabel} <Swords size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3>Conteúdo Bloqueado</h3>
                                        <p>Complete todos os passos ao lado para habilitar o Desafio Final.</p>
                                        <div className="locked-Overlay" />
                                    </>
                                )}
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Ranking Section */}
                <Reveal delay={600}>
                    <div style={{ marginTop: '5rem' }}>
                        <Ranking />
                    </div>
                </Reveal>
            </div>

            <style>{`
                .journey-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    align-items: center;
                    max-width: 900px;
                    margin: 0 auto;
                }
                
                @media (max-width: 768px) {
                    .journey-grid {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    .journey-step {
                        flex-direction: column;
                        text-align: center;
                        justify-content: center;
                        padding: 2rem;
                    }
                    .step-text {
                        text-align: center;
                    }
                }

                .steps-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .journey-step {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .journey-step:hover {
                    background: rgba(255, 255, 255, 0.08);
                    transform: translateX(5px);
                }

                .journey-step.completed {
                    background: rgba(16, 185, 129, 0.1);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .checkbox-icon {
                    color: var(--text-secondary);
                    min-width: 30px;
                    transition: color 0.3s ease;
                }

                .completed .checkbox-icon {
                    color: #10b981;
                    animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .step-text {
                    font-size: 1.05rem;
                    color: var(--text-heading);
                    font-weight: 500;
                    opacity: 0.9;
                    transition: opacity 0.3s;
                }
                
                .completed .step-text {
                    opacity: 1;
                    text-decoration: line-through; 
                    color: var(--text-secondary);
                }

                .reward-card {
                    background: var(--card-bg);
                    border-radius: 20px;
                    padding: 3rem;
                    text-align: center;
                    border: 2px dashed var(--card-border);
                    box-shadow: var(--card-shadow);
                    transition: all 0.5s ease;
                    position: relative;
                    overflow: hidden;
                    min-height: 300px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .reward-card.unlocked {
                    border: 2px solid #10b981;
                    background: radial-gradient(circle at center, rgba(16, 185, 129, 0.1), rgba(15, 23, 42, 0.9));
                    box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
                    animation: unlockPulse 1s ease;
                }

                .reward-icon-wrapper {
                    margin-bottom: 1.5rem;
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-secondary);
                    transition: all 0.5s ease;
                }

                .unlocked .reward-icon-wrapper {
                    background: #6366f1;
                    color: #fff;
                }

                .reward-card h3 {
                    color: var(--text-heading);
                    margin-bottom: 1rem;
                }

                .reward-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 1.5rem;
                }

                .glow-pulse { animation: pulse 2s infinite; }

                @keyframes pop {
                    0% { transform: scale(0.5); }
                    50% { transform: scale(1.4); }
                    100% { transform: scale(1); }
                }

                @keyframes unlockPulse {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.02); opacity: 1; }
                    100% { transform: scale(1); }
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                }
            `}</style>
        </section>
    );
};

export default Journey;
