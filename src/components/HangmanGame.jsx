import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioContent } from '../data/content';

const HangmanGame = ({ onClose }) => {
    const { quiz } = portfolioContent;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [gameState, setGameState] = useState('intro'); // intro, playing, won, lost

    const maxMistakes = 6;
    const questions = quiz.questions;

    const handleAnswer = (optionIndex) => {
        if (gameState !== 'playing') return;

        const isCorrect = optionIndex === questions[currentQuestion].correctAnswer;

        if (isCorrect) {
            if (currentQuestion + 1 < questions.length) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                setGameState('won');
                confetti({
                    particleCount: 300,
                    spread: 150,
                    origin: { y: 0.6 }
                });
            }
        } else {
            const newMistakes = mistakes + 1;
            setMistakes(newMistakes);
            // Brief visual shake or error feedback could go here
            if (newMistakes >= maxMistakes) {
                setGameState('lost');
            }
        }
    };

    const restartGame = () => {
        setMistakes(0);
        setCurrentQuestion(0);
        setGameState('playing');
    };

    // Draw Hangman Parts
    const renderHangman = () => {
        const parts = [
            <circle cx="100" cy="50" r="20" stroke="white" strokeWidth="4" fill="transparent" />, // Head
            <line x1="100" y1="70" x2="100" y2="150" stroke="white" strokeWidth="4" />, // Body
            <line x1="100" y1="90" x2="60" y2="120" stroke="white" strokeWidth="4" />, // L Arm
            <line x1="100" y1="90" x2="140" y2="120" stroke="white" strokeWidth="4" />, // R Arm
            <line x1="100" y1="150" x2="60" y2="190" stroke="white" strokeWidth="4" />, // L Leg
            <line x1="100" y1="150" x2="140" y2="190" stroke="white" strokeWidth="4" /> // R Leg
        ];

        return (
            <svg width="200" height="220" viewBox="0 0 200 220" style={{ overflow: 'visible' }}>
                {/* Gallows */}
                <line x1="10" y1="210" x2="150" y2="210" stroke="#6366f1" strokeWidth="4" />
                <line x1="40" y1="210" x2="40" y2="10" stroke="#6366f1" strokeWidth="4" />
                <line x1="40" y1="10" x2="100" y2="10" stroke="#6366f1" strokeWidth="4" />
                <line x1="100" y1="10" x2="100" y2="30" stroke="#6366f1" strokeWidth="4" />

                {/* Render parts based on mistakes */}
                {parts.slice(0, mistakes).map((part, i) => React.cloneElement(part, { key: i, className: 'hangman-part' }))}

                <style>{`
                    .hangman-part { animation: draw 0.5s ease forwards; }
                    @keyframes draw { from { stroke-dasharray: 100; stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
                `}</style>
            </svg>
        );
    };

    return (
        <div className="game-overlay">
            <div className="game-modal">
                <button onClick={onClose} className="close-btn"><X size={24} /></button>

                {gameState === 'intro' && (
                    <div className="game-content intro">
                        <h2>🚧 {quiz.title}</h2>
                        <p>{quiz.instructions}</p>
                        <a href={quiz.externalLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            Acessar Material de Estudo <ExternalLink size={16} />
                        </a>
                        <button onClick={() => setGameState('playing')} className="btn btn-primary glow">
                            Começar Desafio
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="game-content playing">
                        <div className="game-header">
                            {renderHangman()}
                            <div className="stats">
                                <span className="mistakes-count" style={{ color: mistakes > 3 ? '#ef4444' : '#fff' }}>
                                    Erros: {mistakes} / {maxMistakes}
                                </span>
                                <span className="question-count">Questão {currentQuestion + 1} de {questions.length}</span>
                            </div>
                        </div>

                        <div className="question-area">
                            <h3>{questions[currentQuestion].question}</h3>
                            <div className="options-grid">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(index)}
                                        className="option-btn"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'won' && (
                    <div className="game-content won">
                        <div style={{ fontSize: '4rem' }}>🏆</div>
                        <h2>{quiz.success.title}</h2>
                        <p>{quiz.success.subtitle}</p>
                        <a href={quiz.success.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                            {quiz.success.downloadMatch}
                        </a>
                    </div>
                )}

                {gameState === 'lost' && (
                    <div className="game-content lost">
                        <div style={{ fontSize: '4rem' }}>☠️</div>
                        <h2>{quiz.failure.title}</h2>
                        <p>{quiz.failure.subtitle}</p>
                        {renderHangman()}
                        <button onClick={restartGame} className="btn btn-outline" style={{ marginTop: '2rem' }}>
                            {quiz.failure.retry}
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .game-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(10px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .game-modal {
                    background: var(--bg-color);
                    border: 2px solid var(--primary-color);
                    border-radius: 20px;
                    padding: 2rem;
                    max-width: 600px;
                    width: 100%;
                    position: relative;
                    box-shadow: 0 0 50px rgba(99, 102, 241, 0.3);
                    animation: zoomIn 0.3s ease;
                }
                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: rgba(255,255,255,0.5);
                    cursor: pointer;
                }
                .close-btn:hover { color: #fff; }
                .game-content { text-align: center; }
                .game-header { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    margin-bottom: 2rem; 
                    background: rgba(255,255,255,0.05);
                    padding: 1rem;
                    border-radius: 12px;
                }
                .stats {
                    display: flex;
                    gap: 2rem;
                    margin-top: 1rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.8);
                }
                .question-area h3 {
                    margin-bottom: 1.5rem;
                    color: #fff;
                    font-size: 1.2rem;
                }
                .options-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .option-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 1rem;
                    color: #fff;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }
                .option-btn:hover {
                    background: var(--primary-color);
                    border-color: var(--primary-color);
                    transform: translateY(-2px);
                }
                @media (max-width: 500px) {
                    .options-grid { grid-template-columns: 1fr; }
                }
                @keyframes zoomIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .glow {
                    animation: pulse 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default HangmanGame;
