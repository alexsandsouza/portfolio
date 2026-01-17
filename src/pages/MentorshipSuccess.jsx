import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { CheckCircle, Mail, ArrowRight, Download, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const MentorshipSuccess = () => {
    const [email, setEmail] = useState('seu e-mail');
    const checkoutLink = "https://checkout.nubank.com.br/838c10MWr63yhajw";

    useEffect(() => {
        // Trigger confetti on load
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

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

        // Get user email
        const data = localStorage.getItem('mentorship_registration');
        if (data) {
            const parsed = JSON.parse(data);
            setEmail(parsed.email);
        }
    }, []);

    return (
        <div className="success-page" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '50px', textAlign: 'center' }}>
            <Navbar />

            <div className="container" style={{ maxWidth: '700px' }}>
                <div className="card-glass" style={{ borderTop: '4px solid #22c55e', padding: '3rem 2rem' }}>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{
                            width: '80px', height: '80px', background: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem auto', boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
                        }}>
                            <CheckCircle size={40} />
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Parabéns pela decisão!</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Sua pré-matrícula foi realizada com sucesso.</p>
                    </div>

                    <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail size={20} color="var(--primary-color)" /> Próximos Passos:
                        </h3>
                        <p style={{ marginBottom: '0.8rem', lineHeight: '1.6' }}>
                            1. Finalize o pagamento através do <strong>Checkout Seguro Nubank</strong> abaixo.
                        </p>
                        <p style={{ marginBottom: '0.8rem', lineHeight: '1.6' }}>
                            2. Assim que confirmado, você receberá no e-mail <strong>{email}</strong>:
                        </p>
                        <ul style={{ marginLeft: '1.5rem', color: 'var(--text-secondary)', listStyle: 'circle' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Link de acesso aos encontros ao vivo;</li>
                            <li style={{ marginBottom: '0.5rem' }}>Acesso ao Grupo de Networking;</li>
                            <li style={{ marginBottom: '0.5rem' }}>Todos os bônus (Ebook, Audiobook, Templates).</li>
                        </ul>
                    </div>

                    <a
                        href={checkoutLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                            width: '100%', padding: '1.2rem', fontSize: '1.2rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            background: '#22c55e', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
                        }}
                    >
                        PAGAR AGORA (NUBANK) <ArrowRight size={24} />
                    </a>

                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Ambiente 100% Seguro.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default MentorshipSuccess;
