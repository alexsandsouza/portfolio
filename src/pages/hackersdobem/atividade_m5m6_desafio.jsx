import React, { useState, useEffect, useRef, memo } from 'react';
import { 
  Trophy, Target, Brain, ArrowRight, CheckCircle2, 
  Shield, Lock, Terminal, Star, Skull, Layout, Timer, 
  User, Send, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

// --- ESTILOS EXTERNOS PARA EVITAR RE-CRIACÃO ---
const STYLES = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#030712',
        color: '#fff',
        fontFamily: "'Space Mono', monospace",
        position: 'relative',
        overflowX: 'hidden'
    },
    glassCard: {
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(34, 211, 238, 0.2)',
        borderRadius: '32px',
        padding: '3rem',
        boxShadow: '0 0 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(34,211,238,0.05)',
        position: 'relative',
        zIndex: 10,
        width: '100%'
    },
    btn: {
        padding: '1rem 2rem',
        borderRadius: '12px',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    input: {
        width: '100%',
        padding: '1.25rem',
        background: 'rgba(30, 41, 59, 0.5)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        color: '#fff',
        fontSize: '1.2rem',
        marginBottom: '2rem',
        outline: 'none',
        transition: 'border-color 0.3s'
    }
};

// --- COMPONENTES FILHOS EXTRAÍDOS PARA EVITAR RE-MOUNT ---

const Hangman = ({ idx, setIdx, guesses, setGuesses, fails, setFails, isMobile, onComplete }) => {
    const words = [
        { w: 'PHISHING', h: 'Ataque via mensagens falsas para roubar dados.' },
        { w: 'SHADOW IT', h: 'Uso de TI sem aprovação oficial da empresa.' },
        { w: 'CLICKJACKING', h: 'Técnica que engana o usuário para clicar em algo oculto.' },
        { w: 'MESA LIMPA', h: 'Política de não deixar dados expostos na estação de trabalho.' },
        { w: 'BYOD', h: 'Prática de trazer seu próprio dispositivo para o trabalho.' },
        { w: 'GAMIFICACAO', h: 'Uso de elementos de jogos para treinamento profissional.' },
        { w: 'PRIVILEGIO', h: 'Nível de autorização concedido a um usuário (Ex: Admin).' },
        { w: 'CONSCIENTIZACAO', h: 'Processo de educar usuários sobre riscos cibernéticos.' },
        { w: 'AUTOTERMINACAO', h: 'Cláusula de encerramento automático em contratos de TI.' },
        { w: 'ENGENHARIA', h: 'Técnica social de manipulação psicológica para obter dados.' }
    ];

    const currentWord = words[idx].w.toUpperCase();
    const display = currentWord.split('').map(l => (guesses.includes(l) || l === ' ' ? l : '_'));
    const win = !display.includes('_');

    const guess = (l) => {
        if (guesses.includes(l) || win) return;
        setGuesses(p => [...p, l]);
        if (!currentWord.includes(l)) setFails(p => p + 1);
    };

    useEffect(() => {
        if (win) {
            if (idx < words.length - 1) {
                const timer = setTimeout(() => { setIdx(i => i + 1); setGuesses([]); setFails(0); }, 1000);
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(onComplete, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [win]);

    return (
        <div style={{width: '100%'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center'}}>
                <h2 style={{color: '#22d3ee', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: isMobile ? '0.9rem' : '1.5rem'}}><Skull /> FORCA ({idx+1}/10)</h2>
                <div style={{color: '#f87171', fontWeight: 'bold'}}>ERRORS: {fails}/6</div>
            </div>
            <div style={{...STYLES.glassCard, padding: isMobile ? '1.5rem' : '3rem'}}>
                <p style={{color: '#94a3b8', fontStyle: 'italic', marginBottom: '2rem', textAlign: 'center'}}>"{words[idx].h}"</p>
                <div style={{fontSize: isMobile ? '1.5rem' : '3.5rem', letterSpacing: '0.3em', marginBottom: '3rem', fontWeight: 800, textAlign: 'center', wordBreak: 'break-all', color: '#fff'}}>
                    {display.join(' ')}
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center'}}>
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
                        <button key={l} onClick={() => guess(l)} disabled={guesses.includes(l)} style={{
                            width: isMobile ? '35px' : '48px', height: isMobile ? '35px' : '48px', borderRadius: '8px', 
                            border: '1px solid #334155', background: guesses.includes(l) ? (currentWord.includes(l) ? '#065f46' : '#991b1b') : '#1e293b', 
                            color: '#fff', cursor: 'pointer', fontSize: isMobile ? '0.8rem' : '1.1rem', fontWeight: 'bold'
                        }}>{l}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Matching = ({ matches, setMatches, sel, setSel, isMobile, onComplete, setScore }) => {
    const pairs = [
        { id: 1, l: 'RBAC', r: 'Acesso baseado na função do usuário.' },
        { id: 2, l: 'SSL STRIP', r: 'Downgrade de HTTPS para HTTP.' },
        { id: 3, l: 'AUP', r: 'Política de Uso Aceitável de recursos.' },
        { id: 4, l: 'REPLAY', r: 'Ataque de retransmissão de pacotes.' },
        { id: 5, l: 'CSRF', r: 'Forja requisições via navegador.' },
        { id: 6, l: 'SSRF', r: 'Requisição forjada no servidor.' },
        { id: 7, l: 'XSS', r: 'Execução de scripts no cliente.' },
        { id: 8, l: 'SHELL', r: 'Acesso direto ao terminal do sistema.' },
        { id: 9, l: 'TRAVERSAL', r: 'Navegação por diretórios restritos.' },
        { id: 10, l: 'SESSION', r: 'Sequestro de cookies de autenticação.' }
    ];
    
    // Shuffle only once
    const [layout, setLayout] = useState({ left: [], right: [] });
    useEffect(() => {
        setLayout({
            left: [...pairs].sort(() => Math.random() - 0.5),
            right: [...pairs].sort(() => Math.random() - 0.5)
        });
    }, []);

    const handle = (side, item) => {
        const next = {...sel, [side]: item};
        setSel(next);
        if (next.l && next.r) {
            if (next.l.id === next.r.id) {
                setMatches(p => [...p, next.l.id]);
                setScore(s => s + 50);
            }
            setTimeout(() => setSel({l:null, r:null}), 400);
        }
    };

    useEffect(() => {
        if (matches.length === pairs.length) setTimeout(onComplete, 1000);
    }, [matches]);

    return (
        <div style={{width: '100%', marginBottom: '4rem'}}>
            <h2 style={{color: '#a855f7', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Target /> RELACIONE ({matches.length}/10)</h2>
            <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', gap: '1.5rem'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                    {layout.left.map(i => (
                        <button key={i.id} onClick={() => !matches.includes(i.id) && handle('l', i)} style={{
                            padding: '1.25rem', borderRadius: '16px', border: '1px solid #334155',
                            background: matches.includes(i.id) ? '#065f4630' : (sel.l?.id === i.id ? '#a855f7' : '#1e293b'),
                            color: matches.includes(i.id) ? '#4ade80' : '#fff', cursor: 'pointer', fontWeight: 'bold'
                        }}>{i.l}</button>
                    ))}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                    {layout.right.map(i => (
                        <button key={i.id} onClick={() => !matches.includes(i.id) && handle('r', i)} style={{
                            padding: '1.25rem', borderRadius: '16px', border: '1px solid #334155',
                            background: matches.includes(i.id) ? '#065f4630' : (sel.r?.id === i.id ? '#a855f7' : '#1e293b'),
                            color: matches.includes(i.id) ? '#4ade80' : '#fff', cursor: 'pointer', fontSize: isMobile ? '0.8rem' : '0.95rem', textAlign: 'left'
                        }}>{i.r}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Crossword = ({ grid, setGrid, done, setDone, isMobile, onComplete, setScore }) => {
    const qs = [
        { id: '1', a: 'XSS', q: 'Injeção de scripts no navegador.' },
        { id: '2', a: 'SQLI', q: 'Injeção em banco de dados.' },
        { id: '3', a: 'API', q: 'Interface de comunicação entre apps.' },
        { id: '4', a: 'LDAP', q: 'Protocolo leve de acesso a diretórios.' },
        { id: '5', a: 'SSRF', q: 'Requisições forjadas no servidor.' },
        { id: '6', a: 'XML', q: 'Extensible Markup Language.' },
        { id: '7', a: 'DOS', q: 'Ataque de negação de serviço.' },
        { id: '8', a: 'IAM', q: 'Gerenciamento de identidades e acessos.' },
        { id: '9', a: 'WAF', q: 'Filtro de segurança para aplicações web.' },
        { id: '10', a: 'JWT', q: 'Padrão usado para representar claims (Tokens).' }
    ];

    const check = (q) => {
        const ans = q.a.toUpperCase();
        const input = ans.split('').map((_, i) => grid[`${q.id}-${i}`] || '').join('');
        if (input === ans) {
            setDone(p => [...p, q.id]);
            setScore(s => s + 100);
        }
    };

    useEffect(() => {
        if (done.length === qs.length) setTimeout(onComplete, 1000);
    }, [done]);

    return (
        <div style={{width: '100%', marginBottom: '4rem'}}>
            <h2 style={{color: '#eab308', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Brain /> CROSSWORD ({done.length}/10)</h2>
            <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem'}}>
                {qs.map(q => (
                    <div key={q.id} style={{padding: '1.25rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px', border: done.includes(q.id) ? '2px solid #059669' : '1px solid #1e293b'}}>
                       <p style={{marginBottom: '0.75rem', fontSize: '0.85rem', color: '#94a3b8', minHeight: '40px'}}>{q.q}</p>
                       <div style={{display: 'flex', gap: '0.4rem', alignItems: 'center'}}>
                           {q.a.split('').map((_, i) => (
                               <input key={i} maxLength={1} onChange={e => setGrid(p => ({...p, [`${q.id}-${i}`]: e.target.value.toUpperCase()}))} style={{
                                   width: '32px', height: '32px', textAlign: 'center', background: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontWeight: 'bold', outline: 'none'
                               }} />
                           ))}
                           {!done.includes(q.id) && <button onClick={() => check(q)} style={{marginLeft: 'auto', padding: '0.5rem', background: '#eab308', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer'}}><ChevronRight size={18} /></button>}
                           {done.includes(q.id) && <CheckCircle2 size={18} color="#059669" style={{marginLeft: 'auto'}} />}
                       </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

const AtividadeM5M6Desafio = () => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('welcome');
    const [score, setScore] = useState(0);
    const [userName, setUserName] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);
    const [timerActive, setTimerActive] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [startTime, setStartTime] = useState(0);

    // States for game components to persist during timer renders
    const [hangmanIdx, setHangmanIdx] = useState(0);
    const [hangmanGuesses, setHangmanGuesses] = useState([]);
    const [hangmanFails, setHangmanFails] = useState(0);

    const [matchingMatches, setMatchingMatches] = useState([]);
    const [matchingSel, setMatchingSel] = useState({ l: null, r: null });

    const [crosswordGrid, setCrosswordGrid] = useState({});
    const [crosswordDone, setCrosswordDone] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let interval = null;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && timerActive) {
            setGameState('summary');
            setTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const saveScore = async (finalScore) => {
        if (!userName) return;
        try {
            await addDoc(collection(db, "fametro_ranking"), {
                name: userName,
                score: finalScore,
                duration: (Date.now() - startTime),
                module: "M5M6_DESAFIO",
                timestamp: Date.now()
            });
        } catch (e) {
            console.error("Error saving score: ", e);
        }
    };

    return (
        <div style={STYLES.container}>
            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />}
            
            {/* Header / Stats - Somente quando em jogo */}
            {timerActive && (
                <div style={{position: 'fixed', top: '1.5rem', left: 0, width: '100%', zIndex: 100, padding: '0 1rem'}}>
                    <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.95)', padding: '1rem 2rem', borderRadius: '20px', border: '1px solid rgba(34,211,238,0.4)', backdropFilter: 'blur(15px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft < 30 ? '#ef4444' : '#22d3ee'}}>
                            <Timer size={20} /> <span style={{fontWeight: 900, fontSize: '1.2rem'}}>{formatTime(timeLeft)}</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24'}}>
                            <Trophy size={20} /> <span style={{fontWeight: 900, fontSize: '1.2rem'}}>{score} <span style={{fontSize: '0.7rem', color: '#94a3b8'}}>PTS</span></span>
                        </div>
                    </div>
                </div>
            )}

            <div style={{maxWidth: '1100px', margin: timerActive ? '9rem auto 4rem' : '0 auto', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'}}>
                
                {gameState === 'welcome' && (
                    <div className="animate-fade-in" style={{...STYLES.glassCard, textAlign: 'center', maxWidth: '700px', padding: isMobile ? '2rem' : '3rem'}}>
                        <Terminal size={100} color="#22d3ee" style={{margin: '0 auto 2rem'}} />
                        <h1 style={{fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: 900, marginBottom: '1.5rem', fontStyle: 'italic'}}>MARATONA <span style={{color: '#22d3ee'}}>SUPREMA</span></h1>
                        <p style={{fontSize: '1.2rem', color: '#94a3b8', marginBottom: '3rem'}}>30 questões em 5 minutos. Você é capaz?</p>
                        <button onClick={() => setGameState('register')} style={{...STYLES.btn, background: '#0891b2', margin: '0 auto', boxShadow: '0 0 30px rgba(8,145,178,0.4)'}}>
                            INICIAR <ArrowRight />
                        </button>
                    </div>
                )}

                {gameState === 'register' && (
                    <div className="animate-fade-in" style={{...STYLES.glassCard, maxWidth: '500px'}}>
                        <h2 style={{marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#22d3ee'}}><User size={32} /> ACESSO RESTRITO</h2>
                        <input 
                            placeholder="Seu Nome Completo" 
                            style={STYLES.input} 
                            value={userName} 
                            onChange={e => setUserName(e.target.value)} 
                        />
                        <button 
                            disabled={!userName}
                            onClick={() => { setGameState('hangman'); setTimerActive(true); setStartTime(Date.now()); }}
                            style={{...STYLES.btn, width: '100%', background: userName ? '#0891b2' : '#1e293b', opacity: userName ? 1 : 0.5}}
                        >
                            ENVIAR <Lock size={18} />
                        </button>
                    </div>
                )}

                {gameState === 'hangman' && (
                    <Hangman 
                        idx={hangmanIdx} setIdx={setHangmanIdx} 
                        guesses={hangmanGuesses} setGuesses={setHangmanGuesses}
                        fails={hangmanFails} setFails={setHangmanFails}
                        isMobile={isMobile}
                        onComplete={() => setGameState('matching')}
                    />
                )}

                {gameState === 'matching' && (
                    <Matching 
                        matches={matchingMatches} setMatches={setMatchingMatches}
                        sel={matchingSel} setSel={setMatchingSel}
                        isMobile={isMobile} setScore={setScore}
                        onComplete={() => setGameState('crossword')}
                    />
                )}

                {gameState === 'crossword' && (
                    <Crossword 
                        grid={crosswordGrid} setGrid={setCrosswordGrid}
                        done={crosswordDone} setDone={setCrosswordDone}
                        isMobile={isMobile} setScore={setScore}
                        onComplete={() => { setGameState('summary'); setShowConfetti(true); setTimerActive(false); }}
                    />
                )}

                {gameState === 'summary' && (
                    <div className="animate-fade-in" style={{...STYLES.glassCard, textAlign: 'center', maxWidth: '800px'}}>
                        <Star size={80} color="#fbbf24" fill="#fbbf24" style={{margin: '0 auto 2rem'}} />
                        <h1 style={{fontSize: '3rem', fontWeight: 900}}>MISSÃO CUMPRIDA!</h1>
                        <div style={{fontSize: '4rem', color: '#22d3ee', fontWeight: 900, marginBottom: '3rem'}}>{score} PTS</div>
                        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                            <button onClick={() => window.location.reload()} style={{...STYLES.btn, background: '#334155'}}> REPETIR </button>
                            <button onClick={async () => { await saveScore(score); navigate('/hackersdobem/ranking-m5m6'); }} style={{...STYLES.btn, background: '#0891b2'}}> VER RANKING </button>
                        </div>
                    </div>
                )}

            </div>

            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
                * { box-sizing: border-box; }
            `}</style>
        </div>
    );
};

export default AtividadeM5M6Desafio;
