import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShieldCheck, Download, AlertCircle, ShoppingCart, CheckCircle, ExternalLink } from 'lucide-react';

const MentorshipContract = () => {
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);
    const [userData, setUserData] = useState(null);

    const contractLink = "https://docs.google.com/document/d/1XQDWA-TcDM8jSjaJuq5UVhwg9Rcp7zLTfcyG0Nit7Fg/edit?usp=sharing";
    const checkoutLink = "https://checkout.nubank.com.br/838c10MWr63yhajw";

    useEffect(() => {
        window.scrollTo(0, 0);
        const data = localStorage.getItem('mentorship_registration');
        if (!data) {
            navigate('/mentoria/matricula'); // Redirect if no data
        } else {
            setUserData(JSON.parse(data));
        }
    }, [navigate]);

    const handleCheckout = () => {
        if (!accepted) {
            alert("Por favor, aceite os termos do contrato para continuar.");
            return;
        }
        navigate('/mentoria/sucesso');
    };

    return (
        <div className="contract-page" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
            <Navbar />

            <div className="container">
                <div className="contract-grid">

                    {/* Left Column: Product Summary */}
                    <div className="product-summary">
                        <div className="card-glass" style={{ textAlign: 'center', borderColor: 'var(--primary-color)' }}>
                            <div className="product-badge">
                                <span>MENTORIA</span>
                            </div>
                            <img
                                src="https://github.com/alexsandsouza.png"
                                alt="Mentoria Carreira TI"
                                style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '1.5rem', border: '4px solid var(--bg-color)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}
                            />
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Carreira de TI do Zero</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>O caminho real para iniciantes</p>

                            <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0', opacity: 0.5 }} />

                            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                                <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Valor Original:</span>
                                    <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>R$ 1.194,00</span>
                                </p>
                                <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    <span>Oferta:</span>
                                    <span>R$ 597,00</span>
                                </p>
                                <p style={{ textAlign: 'right', fontSize: '0.9rem', opacity: 0.8, marginTop: '5px' }}>
                                    ou 12x de R$ 59,61
                                </p>
                            </div>

                            <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.8rem', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <CheckCircle size={16} /> Matrícula Verificada
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contract & Details */}
                    <div className="contract-details">
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                R$ 597,00
                            </h2>
                            <h3 style={{ fontSize: '1.3rem', marginTop: '0.5rem' }}>Matrícula na Mentoria Estratégica de Carreira.</h3>
                        </div>

                        <div className="info-block">
                            <p><strong>Atenção:</strong> Esta é a matrícula com o valor promocional da Mentoria.</p>
                            <p><strong>Aviso:</strong> Se optar pelo parcelamento via cartão, verifique o limite disponível.</p>

                            <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
                                A matrícula dará acesso a:
                                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <li>8 Encontros ao vivo (Sábados)</li>
                                    <li>Grupo de Networking</li>
                                    <li>Materiais e Bônus (Ebook, Audiobook, Templates)</li>
                                    <li>Certificado de Conclusão</li>
                                </ul>
                            </p>

                            {userData && (
                                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)', marginTop: '2rem' }}>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Email de Acesso:</strong></p>
                                    <p style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{userData.email}</p>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>Este email será usado para liberar seu acesso aos materiais.</p>
                                </div>
                            )}

                            <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--surface-color)' }}>
                                <AlertCircle size={24} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                                <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    Ao efetuar a matrícula, você concorda com o
                                    <a href={contractLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'underline', marginLeft: '5px' }}>
                                        CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS
                                        <ExternalLink size={14} style={{ display: 'inline', marginLeft: '3px' }} />
                                    </a>.
                                </p>

                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginTop: '1rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={accepted}
                                        onChange={(e) => setAccepted(e.target.checked)}
                                        style={{ width: '20px', height: '20px', marginTop: '3px', accentColor: 'var(--primary-color)' }}
                                    />
                                    <span style={{ fontSize: '0.95rem' }}>Li e concordo expressamente com os Termos de Contrato acima.</span>
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="btn btn-primary"
                            disabled={!accepted}
                            style={{
                                marginTop: '2rem',
                                width: '100%',
                                fontSize: '1.1rem',
                                padding: '1.2rem',
                                opacity: accepted ? 1 : 0.5,
                                cursor: accepted ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <ShoppingCart size={24} />
                            FINALIZAR MATRÍCULA
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .contract-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 4rem;
                    align-items: start;
                }
                .product-summary {
                    position: sticky;
                    top: 100px;
                }
                .product-badge {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--primary-color);
                    color: white;
                    padding: 5px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                }
                .info-block p {
                    margin-bottom: 1rem;
                }
                @media (max-width: 900px) {
                    .contract-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    .product-summary {
                        position: relative;
                        top: 0;
                        order: -1;
                    }
                }
            `}</style>
        </div>
    );
};

export default MentorshipContract;
