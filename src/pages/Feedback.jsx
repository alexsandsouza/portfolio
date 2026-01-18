import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Feedback = () => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        message: '',
        permission: false
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "feedbacks"), {
                ...formData,
                createdAt: serverTimestamp(),
                approved: true // Auto-approved for demo purposes
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Erro ao enviar feedback:", error);
            alert("Erro ao conectar com o servidor. Verifique se o projeto foi configurado corretamente.");
        }
        setIsSubmitting(false);
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <div className="container">
                <Reveal>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            ← Voltar para Home
                        </Link>
                        <h1>Deixe seu Feedback</h1>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            Sua opinião é fundamental para evoluirmos! Conte como foi sua experiência com meus conteúdos ou projetos.
                        </p>
                    </div>
                </Reveal>

                {submitted ? (
                    <Reveal>
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            background: 'rgba(30, 41, 59, 0.5)',
                            borderRadius: '16px',
                            border: '1px solid rgba(74, 222, 128, 0.3)',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                            <h3 style={{ color: '#fff' }}>Obrigado pelo seu feedback!</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Sua mensagem foi recebida com sucesso e aparecerá no site em breve.
                            </p>
                            <Link to="/" className="btn btn-primary">
                                Voltar ao Site
                            </Link>
                        </div>
                    </Reveal>
                ) : (
                    <Reveal delay={200}>
                        <form onSubmit={handleSubmit} style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                            background: 'var(--card-bg)',
                            padding: '2rem',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Seu Nome</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    placeholder="Ex: João Silva"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Sua Ocupação / Papel</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    placeholder="Ex: Aluno de Tecnologia ou Participante do Evento"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Seu Depoimento</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="form-input"
                                    placeholder="O que você achou da experiência? (Seja honesto!)"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '2rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <input
                                    type="checkbox"
                                    id="permission"
                                    checked={formData.permission}
                                    onChange={(e) => setFormData({ ...formData, permission: e.target.checked })}
                                    style={{ marginTop: '4px' }}
                                />
                                <label htmlFor="permission" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Autorizo o uso deste depoimento no site do Prof. Alexsander Farias.
                                </label>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1 }}>
                                {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                            </button>
                        </form>
                    </Reveal>
                )}
            </div>

            <style>{`
                .form-input:focus {
                    outline: none;
                    border-color: var(--primary-color) !important;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                }
            `}</style>
        </div>
    );
};

export default Feedback;
