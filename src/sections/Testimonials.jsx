import React, { useEffect, useState, useRef } from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const TestimonialCard = ({ item }) => {
    // 3D Tilt Hook
    const { ref, style } = useHoverCard({ maxRotation: 5, scale: 1.02 });

    // Spotlight State
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="testimonial-card-wrapper"
            style={{
                ...style.transform ? { transform: style.transform, transition: style.transition } : {},
                position: 'relative',
                borderRadius: '16px',
                height: '100%',
                // Magic Spotlight Border Effect
                background: isHovered
                    ? `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.5), transparent 40%)`
                    : 'rgba(255, 255, 255, 0.05)',
                padding: '1px', // Creates the border width
                transition: 'background 0.3s ease',
            }}
        >
            <div className="card-inner" style={{
                background: 'var(--card-bg)', // Adapts to theme
                border: '1px solid var(--card-border)',
                boxShadow: 'var(--card-shadow)',
                borderRadius: '15px',
                padding: '2rem',
                height: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
            }}>
                {/* Internal Spotlight Glow */}
                {isHovered && (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.08), transparent 40%)`,
                        pointerEvents: 'none',
                    }} />
                )}

                <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="quote-icon" style={{
                        fontSize: '4rem',
                        color: 'rgba(99, 102, 241, 0.2)',
                        position: 'absolute',
                        top: '-1rem',
                        right: '-0.5rem',
                        fontFamily: 'serif',
                        lineHeight: 1
                    }}>❞</div>

                    <p className="testimonial-text" style={{
                        fontSize: '1.05rem',
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                        marginBottom: '2rem',
                        fontStyle: 'italic',
                        position: 'relative'
                    }}>
                        "{item.quote}"
                    </p>

                    <div className="testimonial-author" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
                        <div className="author-avatar" style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#fff',
                            fontSize: '1.2rem',
                            textTransform: 'uppercase',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                            border: '2px solid rgba(255,255,255,0.1)'
                        }}>
                            {item.author[0]}
                        </div>
                        <div>
                            <h4 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1rem' }}>{item.author}</h4>
                            <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>{item.role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const { testimonials: staticData } = portfolioContent;
    const [dynamicFeedbacks, setDynamicFeedbacks] = useState([]);

    useEffect(() => {
        try {
            const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const feeds = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Show all feedbacks for now
                setDynamicFeedbacks(feeds);
            }, (error) => {
                console.log("Firestore sync disabled/error");
            });
            return () => unsubscribe();
        } catch (e) {
            console.log("Firebase not initialized");
        }
    }, []);

    const displayList = [
        ...staticData.list,
        ...dynamicFeedbacks.map(f => ({
            quote: f.message,
            author: f.name,
            role: f.role
        }))
    ];

    return (
        <section id="testimonials" className="section" style={{ background: 'linear-gradient(180deg, var(--bg-color) 0%, rgba(30, 41, 59, 0.3) 100%)' }}>
            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">{staticData.subtitle}</span>
                        <h2>{staticData.title}</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                            {staticData.description}
                        </p>
                    </div>
                </Reveal>

                <div className="testimonials-grid">
                    {displayList.map((item, index) => (
                        <Reveal key={index} delay={index * 150}>
                            <TestimonialCard item={item} />
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={300}>
                    <div className="feedback-cta" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                                {staticData.cta.text}
                            </p>
                            <Link to="/feedback" className="btn btn-primary glow-button">
                                {staticData.cta.buttonLabel}
                            </Link>
                        </div>

                        {/* Animated Mesh Gradient Background */}
                        <div className="mesh-bg" style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15), transparent 70%)',
                            zIndex: 0,
                            animation: 'pulse 4s ease-in-out infinite'
                        }} />
                    </div>
                </Reveal>
            </div>

            <style>{`
                .testimonials-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-bottom: 4rem;
                }
                .feedback-cta {
                    text-align: center;
                    background: var(--card-bg);
                    padding: 3rem;
                    borderRadius: 20px;
                    border: 1px solid var(--card-border);
                    box-shadow: var(--card-shadow);
                    backdrop-filter: blur(10px);
                }
                .glow-button {
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
                }
                .glow-button:hover {
                    box-shadow: 0 0 30px rgba(99, 102, 241, 0.6);
                }
                @keyframes pulse {
                    0% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 0.5; transform: scale(1); }
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
