import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

const MentorshipRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        cpf: '',
        goal: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save to localStorage to persist data
        localStorage.setItem('mentorship_registration', JSON.stringify(formData));
        navigate('/mentoria/contrato');
    };

    return (
        <div className="registration-page" style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '50px' }}>
            <Navbar />

            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="card-glass" style={{ padding: '2.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'
                        }}>
                            <User size={30} />
                        </div>
                        <h2>Ficha de Matrícula</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Preencha seus dados para iniciar sua jornada.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div className="input-group">
                            <label>Nome Completo</label>
                            <div className="input-wrapper">
                                <User size={18} />
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    placeholder="Seu nome completo"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>E-mail Principal</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid-2-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label>WhatsApp</label>
                                <div className="input-wrapper">
                                    <Phone size={18} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>CPF (Apenas números)</label>
                                <div className="input-wrapper">
                                    <FileText size={18} />
                                    <input
                                        type="text"
                                        name="cpf"
                                        required
                                        placeholder="000.000.000-00"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Qual seu maior objetivo na TI hoje?</label>
                            <div className="input-wrapper">
                                <ShieldCheck size={18} />
                                <select name="goal" value={formData.goal} onChange={handleChange} required style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none' }}>
                                    <option value="" disabled>Selecione uma opção...</option>
                                    <option value="iniciante">Começar do Zero</option>
                                    <option value="transicao">Transição de Carreira</option>
                                    <option value="especializacao">Especialização/Avançado</option>
                                    <option value="primeiro_emprego">Conquistar Primeiro Emprego</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                            Avançar para Contrato <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                        </button>

                    </form>
                </div>
            </div>

            <style>{`
                .input-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                }
                .input-wrapper {
                    display: flex;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 0.8rem 1rem;
                    transition: border-color 0.3s ease;
                    gap: 10px;
                }
                .input-wrapper:focus-within {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                }
                .input-wrapper svg {
                    color: var(--text-secondary);
                }
                .input-wrapper input {
                    background: transparent;
                    border: none;
                    color: var(--text-heading);
                    width: 100%;
                    font-size: 1rem;
                    outline: none;
                }
                [data-theme="light"] .input-wrapper {
                    background: #fff;
                }
                @media (max-width: 600px) {
                    .grid-2-mobile { grid-template-columns: 1fr !important; }
                }
                
                /* Config for text visibility in Select */
                select {
                    appearance: none; /* Remove default arrow */
                    -webkit-appearance: none;
                    -moz-appearance: none;
                }
                select option {
                    background-color: var(--surface-color); /* Dark background for options */
                    color: var(--text-primary) !important; /* Visible text color */
                    padding: 10px;
                }
                /* Specific fix for light theme if needed, though variables handle it */
                [data-theme="light"] select option {
                    background-color: #ffffff;
                    color: #333333 !important;
                }
            `}</style>
        </div>
    );
};

export default MentorshipRegistration;
