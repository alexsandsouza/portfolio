import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal as TerminalIcon } from 'lucide-react';

const Terminal = ({ isOpen, onClose, triggerMatrix }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'output', content: 'AlexsanderOS v1.0.0 [Secure Connection Established]' },
        { type: 'output', content: 'Type "help" to see available commands.' }
    ]);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd) => {
        const cleanCmd = cmd.trim().toLowerCase();
        let output = '';

        switch (cleanCmd) {
            case 'help':
                output = (
                    <div>
                        Available commands:<br />
                        <span style={{ color: '#fbbf24' }}>about</span> - Who is Alexsander?<br />
                        <span style={{ color: '#fbbf24' }}>skills</span> - Technical Stack<br />
                        <span style={{ color: '#fbbf24' }}>contact</span> - Get in touch<br />
                        <span style={{ color: '#fbbf24' }}>matrix</span> - Enter the Matrix<br />
                        <span style={{ color: '#fbbf24' }}>clear</span> - Clear terminal<br />
                        <span style={{ color: '#fbbf24' }}>exit</span> - Close terminal
                    </div>
                );
                break;
            case 'about':
                output = "Prof. Alexsander Farias | Full Stack Dev | Tech Educator. Passionate about transforming lives through code.";
                break;
            case 'skills':
                output = "JS, React, Node.js, Python, Java, SQL, Figma, Git, Teaching...";
                break;
            case 'contact':
                output = "Email: alexsandfarias@gmail.com | LinkedIn: /in/alexsandfarias";
                break;
            case 'matrix':
                output = "Wake up, Neo...";
                setTimeout(() => {
                    if (triggerMatrix) triggerMatrix();
                    onClose();
                }, 1000);
                break;
            case 'clear':
                setHistory([]);
                return; // Early return to not add 'clear' to history text
            case 'exit':
                onClose();
                return;
            case '':
                return;
            default:
                output = `Command not found: ${cleanCmd}. Type "help" for assistance.`;
        }

        setHistory(prev => [
            ...prev,
            { type: 'command', content: cmd },
            { type: 'output', content: output }
        ]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10005,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }} onClick={onClose}>
            <div style={{
                width: '100%',
                maxWidth: '600px',
                height: '400px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                fontFamily: "'JetBrains Mono', monospace"
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    background: '#1e293b',
                    padding: '0.5rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #334155'
                }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <TerminalIcon size={16} color="#4ade80" />
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>guest@alexsander-portfolio:~</span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div style={{
                    flex: 1,
                    padding: '1rem',
                    overflowY: 'auto',
                    color: '#e2e8f0',
                    fontSize: '0.95rem',
                    lineHeight: 1.6
                }}>
                    {history.map((item, i) => (
                        <div key={i} style={{ marginBottom: '0.5rem' }}>
                            {item.type === 'command' ? (
                                <div style={{ color: '#94a3b8' }}>
                                    <span style={{ color: '#4ade80', marginRight: '0.5rem' }}>➜</span>
                                    {item.content}
                                </div>
                            ) : (
                                <div style={{ color: '#cbd5e1', marginLeft: '1.2rem' }}>
                                    {item.content}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Input Line */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                        <span style={{ color: '#4ade80', marginRight: '0.5rem' }}>➜</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                flex: 1,
                                outline: 'none',
                                fontFamily: 'inherit',
                                fontSize: 'inherit'
                            }}
                            autoFocus
                        />
                    </div>
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
};

export default Terminal;
