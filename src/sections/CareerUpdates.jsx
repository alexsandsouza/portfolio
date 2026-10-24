import React from 'react';
import { Link } from 'react-router-dom';
import { portfolioContent } from '../data/content';
import { Reveal } from '../components/Reveal';

const CareerUpdates = () => {
    const { blog } = portfolioContent;
    const latest = [...(blog?.posts ?? [])].sort((a, b) => b.dateTime.localeCompare(a.dateTime))[0];

    if (!blog || !latest) return null;

    const cover = latest.images?.[0];

    return (
        <section id="acontecendo" className="section">
            <div className="container">
                <Reveal>
                    <div className="section-header">
                        <span className="section-subtitle">Acontecendo</span>
                        <h2>Na carreira</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                            Palestras, eventos e a newsletter semanal. O arquivo completo está no blog.
                        </p>
                    </div>
                </Reveal>

                <Reveal>
                    <article className="career-teaser card-glass">
                        {cover && (
                            <Link to={`/blog/${latest.slug}`} className="career-teaser-cover" aria-label={cover.alt}>
                                <img src={cover.src} alt={cover.alt} />
                            </Link>
                        )}
                        <div>
                            <div className="career-teaser-meta">
                                <time dateTime={latest.dateTime}>{latest.date}</time>
                                <span>{latest.kind}</span>
                            </div>
                            <h3>
                                <Link to={`/blog/${latest.slug}`}>{latest.title}</Link>
                            </h3>
                            {latest.place && <p className="career-teaser-place">{latest.place}</p>}
                            <p>{latest.paragraphs[0]}</p>
                            <div className="career-teaser-actions">
                                <Link to={`/blog/${latest.slug}`}>Ler no blog</Link>
                                <a href={blog.newsletterUrl}>Newsletter semanal</a>
                            </div>
                        </div>
                    </article>
                </Reveal>
            </div>
            <style>{`
                .career-teaser {
                    max-width: 920px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 1.5rem;
                    padding: 1.25rem;
                    border-radius: 24px;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    box-shadow: var(--card-shadow);
                }
                .career-teaser-cover {
                    display: block;
                    border-radius: 16px;
                    overflow: hidden;
                    min-height: 210px;
                }
                .career-teaser-cover img {
                    width: 100%;
                    height: 100%;
                    min-height: 210px;
                    object-fit: cover;
                    display: block;
                }
                .career-teaser-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    align-items: center;
                    margin-bottom: 0.6rem;
                }
                .career-teaser-meta time { color: var(--text-secondary); font-size: 0.92rem; }
                .career-teaser-meta span {
                    padding: 0.25rem 0.7rem;
                    border-radius: 999px;
                    background: rgba(59, 130, 246, 0.15);
                    color: var(--primary-color);
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }
                .career-teaser h3 { margin: 0 0 0.4rem; font-size: 1.5rem; }
                .career-teaser h3 a { color: inherit; text-decoration: none; }
                .career-teaser h3 a:hover { color: var(--primary-color); }
                .career-teaser-place { color: var(--text-secondary); }
                .career-teaser-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-top: 0.5rem;
                }
                .career-teaser-actions a {
                    color: var(--primary-color);
                    font-weight: 700;
                    text-decoration: none;
                }
                .career-teaser-actions a:hover { text-decoration: underline; }
                .career-teaser a:focus-visible {
                    outline: 2px solid var(--primary-color);
                    outline-offset: 3px;
                }
                @media (max-width: 800px) {
                    .career-teaser { grid-template-columns: 1fr; }
                    .career-teaser-cover, .career-teaser-cover img {
                        min-height: 200px;
                        max-height: 240px;
                    }
                }
            `}</style>
        </section>
    );
};

export default CareerUpdates;
