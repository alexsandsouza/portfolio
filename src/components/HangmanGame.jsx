import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Timer, Save } from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioContent } from '../data/content';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const HangmanGame = ({ onClose }) => {
    const { quiz } = portfolioContent;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [gameState, setGameState] = useState('intro'); // intro, playing, won, saving, saved, lost

    // Timer State
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [playerName, setPlayerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveFailed, setSaveFailed] = useState(false);

    const maxMistakes = 6;
    const questions = quiz.questions;

    // Timer Logic
    useEffect(() => {
        let interval;
        if (gameState === 'playing') {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, startTime]);

    const handleStart = () => {
        setStartTime(Date.now());
        setGameState('playing');
        setElapsedTime(0);
    };

    const handleAnswer = (optionIndex) => {
        if (gameState !== 'playing') return;

        const isCorrect = optionIndex === questions[currentQuestion].correctAnswer;

        if (isCorrect) {
            if (currentQuestion + 1 < questions.length) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                // Game Won
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
            if (newMistakes >= maxMistakes) {
                setGameState('lost');
            }
        }
    };

    const handleSaveScore = async (e) => {
        e.preventDefault();
        if (!playerName.trim()) return;
        setIsSubmitting(true);

        try {
            // Aumentei o timeout para 15s para ser mais resiliente
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 15000)
            );

            await Promise.race([
                addDoc(collection(db, "quiz_results"), {
                    name: playerName,
                    timeSeconds: elapsedTime,
                    createdAt: serverTimestamp()
                }),
                timeout
            ]);

            setGameState('saved');
        } catch (error) {
            console.error("Erro ao salvar ranking:", error);
            setSaveFailed(true);
            setGameState('saved');
        } finally {
            setIsSubmitting(false);
        }
    };

    const restartGame = () => {
        setMistakes(0);
        setCurrentQuestion(0);
        setGameState('playing');
        setStartTime(Date.now());
        setElapsedTime(0);
    };

    const renderHangman = () => {
        // ... (Same drawing logic as before) ...
        const parts = [
            <circle cx="100" cy="50" r="20" stroke="var(--text-heading)" strokeWidth="4" fill="transparent" />,
            <line x1="100" y1="70" x2="100" y2="150" stroke="var(--text-heading)" strokeWidth="4" />,
            <line x1="100" y1="90" x2="60" y2="120" stroke="var(--text-heading)" strokeWidth="4" />,
            <line x1="100" y1="90" x2="140" y2="120" stroke="var(--text-heading)" strokeWidth="4" />,
            <line x1="100" y1="150" x2="60" y2="190" stroke="var(--text-heading)" strokeWidth="4" />,
            <line x1="100" y1="150" x2="140" y2="190" stroke="var(--text-heading)" strokeWidth="4" />
        ];

        return (
            <svg width="200" height="220" viewBox="0 0 200 220" style={{ overflow: 'visible' }}>
                <line x1="10" y1="210" x2="150" y2="210" stroke="#6366f1" strokeWidth="4" />
                <line x1="40" y1="210" x2="40" y2="10" stroke="#6366f1" strokeWidth="4" />
                <line x1="40" y1="10" x2="100" y2="10" stroke="#6366f1" strokeWidth="4" />
                <line x1="100" y1="10" x2="100" y2="30" stroke="#6366f1" strokeWidth="4" />
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
                        <button onClick={handleStart} className="btn btn-primary glow">
                            Começar Desafio
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="game-content playing">
                        <div className="game-header">
                            {renderHangman()}
                            <div className="stats">
                                <span className="mistakes-count" style={{ color: mistakes > 3 ? '#ef4444' : 'var(--text-heading)' }}>
                                    Erros: {mistakes} / {maxMistakes}
                                </span>
                                <span className="time-count" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Timer size={16} /> {elapsedTime}s
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

                {/* Won Screen with Leaderboard Input */}
                {gameState === 'won' && (
                    <div className="game-content won">
                        <div style={{ fontSize: '4rem' }}>🏆</div>
                        <h2>{quiz.success.title}</h2>
                        <p>{quiz.success.subtitle}</p>
                        <p className="final-time">Tempo Total: <strong>{elapsedTime} segundos</strong></p>

                        <form onSubmit={handleSaveScore} className="save-score-form">
                            <label>Digite seu nome para o Ranking:</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    placeholder="Seu Nome"
                                    required
                                />
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Salvando Conquista...' : <Save size={18} />}
                                </button>
                            </div>
                        </form>
                        <div style={{ marginTop: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
                            (Salve para liberar o download)
                        </div>
                    </div>
                )}

                {/* Final Success Screen (Post-Save) */}
                {gameState === 'saved' && (
                    <div className="game-content saved">
                        <div style={{ fontSize: '4rem' }}>{saveFailed ? '�' : '�🌟'}</div>
                        <h2>{saveFailed ? 'Parabéns!' : 'Ranking Atualizado!'}</h2>
                        <p>{saveFailed
                            ? 'Não conseguimos salvar no ranking agora, mas seu prêmio está garantido.'
                            : 'Seu nome está no Hall da Fama.'}
                        </p>
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
                /* Keep previous styles... */
                /* Updates for new elements */
                /* Theme Aware Updates */
                .stats {
                    display: flex;
                    gap: 1.5rem;
                    margin-top: 1rem;
                    font-weight: 500;
                    color: var(--text-secondary); /* Dynamic */
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .final-time {
                    font-size: 1.2rem;
                    color: #fbbf24;
                    margin: 1rem 0;
                }
                .save-score-form {
                    background: var(--card-bg); /* Dynamic */
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-top: 1.5rem;
                }
                .input-group {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }
                .input-group input {
                    flex: 1;
                    padding: 0.8rem;
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                }
                
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
                    max-height: 90vh;
                    overflow-y: auto;
                }
                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                }
                .close-btn:hover { color: var(--text-primary); }
                .game-content { text-align: center; }
                .game-header { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    margin-bottom: 2rem; 
                    background: var(--bg-secondary);
                    padding: 1rem;
                    border-radius: 12px;
                }
                .question-area h3 {
                    margin-bottom: 1.5rem;
                    color: var(--text-heading); /* Dynamic */
                    font-size: 1.2rem;
                }
                .options-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .option-btn {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    padding: 1rem;
                    color: var(--text-primary); /* Dynamic */
                    border-radius: 12px; /* Rounded as requested */
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }
                .option-btn:hover {
                    background: var(--primary-color);
                    border-color: var(--primary-color);
                    color: white; /* Always white on hover */
                    transform: translateY(-2px);
                }
                @media (max-width: 500px) {
                    .options-grid { grid-template-columns: 1fr; }
                    .stats { gap: 1rem; font-size: 0.9rem; }
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
