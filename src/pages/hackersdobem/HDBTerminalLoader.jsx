import React, { useState, useEffect } from 'react';
import './HackersDoBem.css';

export default function HDBTerminalLoader({ onComplete, message = "INICIANDO PROTOCOLO DE DEFESA..." }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const LOG_MESSAGES = [
    "IDENTIFYING ENCRYPTION LAYER...",
    "BYPASSING SECURE ENCLAVE...",
    "INJECTING TEMPORARY PAYLOAD...",
    "ESTABLISHING VPN TUNNEL...",
    "ACCESS GRANTED. AGENT VERIFIED.",
    "SYNCING LOCAL REPOSITORY..."
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < LOG_MESSAGES.length) {
        setLogs(prev => [...prev.slice(-4), `> ${LOG_MESSAGES[currentLog]}`]);
        setProgress(p => Math.min(p + 15, 100));
        currentLog++;
      } else {
        clearInterval(interval);
        setProgress(100);
        setTimeout(onComplete, 800);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(5, 5, 10, 0.98)', zIndex: 20000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--hdb-terminal-font)', color: 'var(--hdb-neon-green)', padding: 20
    }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ fontSize: 13, marginBottom: 20, letterSpacing: 2, textAlign: 'center' }}>
          {message}
        </div>
        
        <div style={{ height: 100, background: 'rgba(0,0,0,0.5)', padding: 15, borderRadius: 8, border: '1px solid rgba(0,255,136,0.2)', marginBottom: 20, fontSize: 11 }}>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: 4, opacity: (i + 1) / logs.length }}>{log}</div>
          ))}
          <div className="hdb-typing" style={{ width: '100%' }}>_</div>
        </div>

        <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--hdb-neon-green)', transition: 'width 0.3s', boxShadow: '0 0 10px var(--hdb-neon-green)' }}></div>
        </div>
        
        <div style={{ textAlign: 'right', fontSize: 10, marginTop: 8, opacity: 0.5 }}>
          LOADING: {progress}%
        </div>
      </div>
    </div>
  );
}
