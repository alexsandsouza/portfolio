import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import { portfolioContent } from '../data/content';

const FILTERS = [
    { id: 'todos', label: 'Tudo' },
    { id: 'evento', label: 'Eventos' },
    { id: 'newsletter', label: 'Newsletter' }
];

const categoryLabel = {
    evento: 'Evento',
    newsletter: 'Newsletter'
};

const Blog = () => {
    const { blog } = portfolioContent;
    const [params, setParams] = useSearchParams();
    const selected = FILTERS.some((item) => item.id === params.get('categoria'))
        ? params.get('categoria')
        : 'todos';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (selected === 'newsletter' && blog.newsletterUrl) {
            window.location.assign(blog.newsletterUrl);
        }
    }, [selected, blog.newsletterUrl]);

    const posts = [...(blog?.posts ?? [])].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
    const visible = selected === 'todos' ? posts : posts.filter((post) => post.category === selected);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <SEO
                title="Blog | Eventos e newsletter | Prof. Alexsander Farias"
                description="Arquivo das palestras, eventos e da newsletter semanal de Alexsander Farias."
            />
            <Navbar />
            <main id="main-content" className="section" style={{ paddingTop: '8rem' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">{blog.subtitle}</span>
                        <h1 style={{ fontSize: '2.75rem', textAlign: 'center', marginBottom: '0.75rem' }}>{blog.title}</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>{blog.description}</p>
                    </div>

                    <div className="blog-filters" role="tablist" aria-label="Filtrar publicações">
                        {FILTERS.map((filter) => (
                            filter.id === 'newsletter' ? (
                                <a
                                    key={filter.id}
                                    href={blog.newsletterUrl}
                                    className="blog-filter"
                                    role="tab"
                                    aria-selected={false}
                                >
                                    {filter.label}
                                </a>
                            ) : (
                                <button
                                    key={filter.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected === filter.id}
                                    className={`blog-filter ${selected === filter.id ? 'is-active' : ''}`}
                                    onClick={() => setParams(filter.id === 'todos' ? {} : { categoria: filter.id })}
                                >
                                    {filter.label}
                                </button>
                            )
                        ))}
                    </div>

                    {visible.length === 0 ? (
                        <div className="blog-empty card-glass">
                            <h2>{selected === 'newsletter' ? 'Newsletter semanal' : 'Nenhuma publicação ainda'}</h2>
                            <p>
                                {selected === 'newsletter'
                                    ? 'A newsletter que publico toda semana no LinkedIn passa a ter arquivo aqui. A primeira edição entra assim que o texto da semana for publicado nesta página.'
                                    : 'Os próximos eventos e edições da newsletter aparecem nesta lista.'}
                            </p>
                        </div>
                    ) : (
                        <div className="blog-list">
                            {visible.map((post) => {
                                const cover = post.images?.[0];
                                const excerpt = post.paragraphs.slice(0, 2).join(' ');
                                return (
                                    <article key={post.slug} className="blog-card card-glass">
                                        {cover && (
                                            <Link to={`/blog/${post.slug}`} className="blog-card-cover" aria-label={cover.alt}>
                                                <img src={cover.src} alt={cover.alt} />
                                            </Link>
                                        )}
                                        <div className="blog-card-body">
                                            <div className="blog-meta">
                                                <time dateTime={post.dateTime}>{post.date}</time>
                                                <span className="blog-kind">{post.kind || categoryLabel[post.category]}</span>
                                            </div>
                                            <h2>
                                                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                            </h2>
                                            {post.place && <p className="blog-place">{post.place}</p>}
                                            <p className="blog-excerpt">{excerpt}</p>
                                            <Link to={`/blog/${post.slug}`} className="blog-read">Ler publicação</Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                .blog-filters {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    margin: 0 auto 2.5rem;
                }
                .blog-filter {
                    border: 1px solid var(--card-border);
                    background: var(--card-bg);
                    color: var(--text-primary);
                    border-radius: 999px;
                    padding: 0.55rem 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                }
                .blog-filter.is-active {
                    background: var(--primary-color);
                    color: #fff;
                    border-color: transparent;
                }
                .blog-filter:focus-visible,
                .blog-read:focus-visible,
                .blog-card a:focus-visible {
                    outline: 2px solid var(--primary-color);
                    outline-offset: 3px;
                }
                .blog-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    max-width: 920px;
                    margin: 0 auto;
                }
                .blog-card {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 1.5rem;
                    padding: 1.25rem;
                    border-radius: 24px;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    box-shadow: var(--card-shadow);
                    overflow: hidden;
                }
                .blog-card-cover {
                    display: block;
                    border-radius: 16px;
                    overflow: hidden;
                    min-height: 210px;
                }
                .blog-card-cover img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    min-height: 210px;
                }
                .blog-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    align-items: center;
                    margin-bottom: 0.6rem;
                }
                .blog-meta time { color: var(--text-secondary); font-size: 0.92rem; }
                .blog-kind {
                    display: inline-flex;
                    padding: 0.25rem 0.7rem;
                    border-radius: 999px;
                    background: rgba(59, 130, 246, 0.15);
                    color: var(--primary-color);
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }
                .blog-card h2 {
                    text-align: left;
                    font-size: 1.55rem;
                    margin: 0 0 0.4rem;
                }
                .blog-card h2 a {
                    color: inherit;
                    text-decoration: none;
                }
                .blog-card h2 a:hover { color: var(--primary-color); }
                .blog-place, .blog-excerpt { color: var(--text-secondary); }
                .blog-read {
                    color: var(--primary-color);
                    font-weight: 700;
                    text-decoration: none;
                }
                .blog-read:hover { text-decoration: underline; }
                .blog-empty {
                    max-width: 720px;
                    margin: 0 auto;
                    padding: 2rem;
                    border-radius: 24px;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    text-align: center;
                }
                .blog-empty h2 { font-size: 1.6rem; }
                .blog-empty p { color: var(--text-secondary); }
                @media (max-width: 800px) {
                    .blog-card { grid-template-columns: 1fr; }
                    .blog-card-cover, .blog-card-cover img { min-height: 200px; max-height: 240px; }
                }
            `}</style>
        </div>
    );
};

export default Blog;
