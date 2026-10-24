import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import PostGallery from '../components/PostGallery';
import { portfolioContent } from '../data/content';

const categoryLabel = {
    evento: 'Evento',
    newsletter: 'Newsletter'
};

const BlogPost = () => {
    const { slug } = useParams();
    const post = portfolioContent.blog.posts.find((item) => item.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
                <SEO title="Publicação não encontrada | Prof. Alexsander Farias" description="Essa publicação não está no blog." />
                <Navbar />
                <main className="section" style={{ paddingTop: '8rem' }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <h1>Publicação não encontrada</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Esse endereço não corresponde a um evento ou a uma edição da newsletter.</p>
                        <Link to="/blog">Voltar ao blog</Link>
                    </div>
                </main>
            </div>
        );
    }

    const label = post.kind || categoryLabel[post.category];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <SEO
                title={`${post.title} | Blog | Prof. Alexsander Farias`}
                description={post.paragraphs[0]}
                image={post.images?.[0]?.src}
            />
            <Navbar />
            <main id="main-content" className="section" style={{ paddingTop: '8rem' }}>
                <article className="container blog-article">
                    <Link to="/blog" className="blog-back">← Voltar ao blog</Link>
                    <div className="blog-meta">
                        <time dateTime={post.dateTime}>{post.date}</time>
                        <span className="blog-kind">{label}</span>
                    </div>
                    <h1>{post.title}</h1>
                    {post.place && <p className="blog-place">{post.place}</p>}
                    {post.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                    <PostGallery images={post.images} />
                </article>
            </main>
            <style>{`
                .blog-article {
                    max-width: 860px;
                }
                .blog-back {
                    display: inline-block;
                    margin-bottom: 1.5rem;
                    color: var(--primary-color);
                    font-weight: 700;
                    text-decoration: none;
                }
                .blog-back:hover { text-decoration: underline; }
                .blog-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    align-items: center;
                    margin-bottom: 0.8rem;
                }
                .blog-meta time { color: var(--text-secondary); }
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
                .blog-article h1 {
                    font-size: 2.4rem;
                    text-align: left;
                    margin-bottom: 0.6rem;
                }
                .blog-place { color: var(--text-secondary); }
                .blog-article p { line-height: 1.75; }
                .blog-back:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 3px; }
                @media (max-width: 800px) {
                    .blog-article h1 { font-size: 1.8rem; }
                }
            `}</style>
        </div>
    );
};

export default BlogPost;
