import React from 'react';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';
import { useHoverCard } from '../hooks/useHoverCard';

const TimelineCard = ({ job, index }) => {
    const { ref, style } = useHoverCard({ maxRotation: 5, scale: 1.02 });
    const isEven = index % 2 === 0;

    return (
        <div className={`timeline-item ${isEven ? 'even' : 'odd'}`}>
            {/* Center Node */}
            <div className="timeline-node">
                <div className="timeline-node-inner"></div>
            </div>

            {/* Date Bubble */}
            <div className="timeline-date">
                {job.period}
            </div>

            <div ref={ref} className="card-glass timeline-content" style={{
                ...style.transform ? { transform: style.transform, transition: style.transition } : {},
            }}>
                {/* Decorative Top Line */}
                <div className="card-deco-line"></div>

                {/* Content Wrapper */}
                <div className="text-content-wrapper">
                    <h3 className="timeline-role-title role-title">{job.role}</h3>

                    <h4 className="institution-subtitle">
                        @{job.institution} <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>• {job.type}</span>
                    </h4>

                    <p className="timeline-desc job-desc">{job.description}</p>

                    {job.results && (
                        <div className="results-box">
                            <p className="results-text">
                                <span className="trophy-icon">🏆</span>
                                {job.results}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Connector Line */}
            <div className="timeline-connector"></div>
        </div>
    );
};

const Experience = () => {
    const { professionalExperience } = portfolioContent;

    if (!professionalExperience) return null;

    return (
        <section id="experience" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">Minha Jornada Profissional</span>
                        <h2>Experiência Profissional</h2>
                    </div>
                </Reveal>

                <div className="timeline-wrapper">
                    {/* Central Laser Line */}
                    <div className="timeline-center-line">
                        <div className="timeline-laser"></div>
                    </div>

                    {professionalExperience.map((job, index) => (
                        <Reveal key={index} delay={index * 150} width="100%">
                            <TimelineCard job={job} index={index} />
                        </Reveal>
                    ))}
                </div>
            </div>

            <style>{`
                .timeline-wrapper {
                    max-width: 1000px;
                    margin: 4rem auto 0;
                    position: relative;
                }
                
                .timeline-center-line {
                    position: absolute; left: 50%; top: 0; bottom: 0;
                    width: 2px; background: rgba(99, 102, 241, 0.3);
                    transform: translateX(-50%); z-index: 0;
                }
                
                .timeline-laser {
                    position: absolute; top: 0; left: 0; width: 100%; height: 50vh;
                    background: linear-gradient(to bottom, transparent, var(--primary-color), transparent);
                    animation: laserFlow 3s linear infinite;
                }
                @keyframes laserFlow { 0% { top: -50vh; } 100% { top: 100%; } }

                /* Item Structure */
                .timeline-item {
                    display: flex;
                    position: relative;
                    margin-bottom: 4rem;
                    width: 100%;
                }
                
                .timeline-item.even { justify-content: flex-end; }
                .timeline-item.odd { justify-content: flex-start; }

                /* Content Card */
                .timeline-content {
                    width: 45%;
                    padding: 2rem;
                    position: relative;
                    border: 1px solid var(--card-border);
                    background: var(--card-bg);
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    text-align: left;
                    z-index: 1;
                }
                .timeline-item.even .timeline-content { margin-left: 0; margin-right: 50px; }
                .timeline-item.odd .timeline-content { margin-right: 0; margin-left: 50px; }
                
                .card-deco-line {
                    position: absolute; top: 0; left: 0; width: 100%; height: 2px;
                    background: linear-gradient(90deg, transparent, var(--secondary-color), transparent);
                }

                /* Node (Circle) */
                .timeline-node {
                    position: absolute; left: 50%; top: 0; transform: translateX(-50%);
                    width: 20px; height: 20px;
                    background: var(--bg-color);
                    border: 3px solid var(--primary-color);
                    borderRadius: 50%;
                    zIndex: 10;
                    box-shadow: 0 0 15px var(--primary-color);
                }
                .timeline-node-inner {
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 6px; height: 6px; background: #fff; borderRadius: 50%;
                }

                /* Date Bubble */
                .timeline-date {
                    position: absolute; top: 0;
                    padding: 3px 10px;
                    background: var(--bg-color);
                    border: 1px solid var(--primary-color);
                    border-radius: 12px;
                    font-weight: 700; font-size: 0.85rem; color: var(--text-heading);
                    z-index: 20;
                    white-space: nowrap;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .timeline-item.even .timeline-date { left: 50%; margin-left: 35px; }
                .timeline-item.odd .timeline-date { right: 50%; margin-right: 35px; }

                /* Connector */
                .timeline-connector {
                    position: absolute; top: 10px; left: 50%;
                    width: 50px; height: 2px;
                    background: linear-gradient(90deg, var(--primary-color), transparent);
                    z-index: 0;
                }
                .timeline-item.even .timeline-connector { transform: translateX(-50px); }
                .timeline-item.odd .timeline-connector { transform: translateX(0); }

                /* Styles for elements */
                .role-title {
                    color: var(--text-heading);
                    margin: 0 0 0.5rem 0;
                    font-size: 1.4rem;
                    font-weight: bold;
                }
                .institution-subtitle {
                    font-size: 1rem;
                    margin-bottom: 1.2rem;
                    color: var(--primary-color);
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .job-desc {
                    margin-bottom: 1.2rem;
                    color: var(--text-secondary);
                    line-height: 1.7;
                }
                
                .results-box {
                    margin-top: 1rem;
                    padding: 0.8rem 1rem;
                    background: rgba(16, 185, 129, 0.05);
                    border-left: 3px solid #10b981;
                    border-radius: 0 8px 8px 0;
                }
                
                .results-text {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    font-style: italic;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }
                .trophy-icon {
                    font-size: 1.2rem;
                }

                /* --- MOBILE ORIENTED FIX --- */
                @media (max-width: 900px) {
                    /* Reset structure for mobile stack */
                    .timeline-item { 
                        flex-direction: column !important; 
                        padding-left: 50px; 
                        margin-bottom: 3rem; 
                    }
                    .timeline-connector { display: none; }
                    .timeline-node { left: 11px; top: 0; transform: none; }
                    .timeline-date {
                        position: relative; top: auto; right: auto; left: auto;
                        margin: 0 auto 1rem auto !important;
                        display: inline-block; 
                        align-self: center !important;
                    }
                    .timeline-center-line { left: 20px; transform: none; }

                    /* Card Container overrides */
                    #experience .timeline-content {
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 2rem !important;
                        text-align: center !important;
                    }

                    /* 
                       CRITICAL CENTERING RULES 
                       Using Flexbox Column traversal for guaranteed centering
                    */
                    #experience .text-content-wrapper {
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                        text-align: center !important;
                        width: 100% !important;
                    }

                    /* Text Children Resets */
                    #experience .role-title, 
                    #experience .institution-subtitle, 
                    #experience .job-desc {
                        text-align: center !important;
                        width: 100% !important;
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                    }
                    
                    /* Subtitle inline helpers */
                    #experience .institution-subtitle span {
                        display: inline !important;
                    }

                    /* Results Box - Mobile style */
                    #experience .results-box {
                        border-left: none !important;
                        border-bottom: 3px solid #10b981 !important;
                        border-radius: 8px !important;
                        width: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        padding: 1rem !important;
                    }
                    
                    /* Results Text - allow wrapping */
                    #experience .results-text {
                        justify-content: center !important;
                        flex-wrap: wrap !important;
                        text-align: center !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default Experience;
