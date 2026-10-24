import React, { useEffect, useRef, useState } from 'react';

const PostGallery = ({ images = [] }) => {
    const [index, setIndex] = useState(null);
    const closeRef = useRef(null);
    const triggerRef = useRef(null);
    const indexRef = useRef(index);
    indexRef.current = index;
    const isOpen = index !== null;

    useEffect(() => {
        if (!isOpen) return undefined;

        const onKey = (event) => {
            const current = indexRef.current;
            if (current === null) return;
            if (event.key === 'Escape') {
                setIndex(null);
                return;
            }
            if (event.key === 'ArrowRight') {
                setIndex((current + 1) % images.length);
            }
            if (event.key === 'ArrowLeft') {
                setIndex((current - 1 + images.length) % images.length);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKey);
            triggerRef.current?.focus();
        };
    }, [isOpen, images.length]);

    if (images.length === 0) return null;

    const [cover, ...thumbs] = images;
    const active = isOpen ? images[index] : null;

    const open = (imageIndex, trigger) => {
        triggerRef.current = trigger;
        setIndex(imageIndex);
    };

    return (
        <>
            <div className="career-gallery">
                <button
                    type="button"
                    className="career-photo career-photo-cover"
                    aria-label={cover.alt}
                    onClick={(event) => open(0, event.currentTarget)}
                >
                    <img src={cover.src} alt={cover.alt} />
                </button>
                {thumbs.length > 0 && (
                    <div className="career-thumbs">
                        {thumbs.map((image, thumbIndex) => (
                            <button
                                key={image.src}
                                type="button"
                                className="career-photo"
                                aria-label={image.alt}
                                onClick={(event) => open(thumbIndex + 1, event.currentTarget)}
                            >
                                <img src={image.src} alt={image.alt} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {active && (
                <div className="career-lightbox" role="dialog" aria-modal="true" aria-label={active.alt}>
                    <button
                        ref={closeRef}
                        type="button"
                        className="career-lightbox-close"
                        onClick={() => setIndex(null)}
                    >
                        Fechar
                    </button>
                    {images.length > 1 && (
                        <button
                            type="button"
                            className="career-lightbox-nav is-prev"
                            aria-label="Foto anterior"
                            onClick={() => setIndex((index - 1 + images.length) % images.length)}
                        >
                            ‹
                        </button>
                    )}
                    <img src={active.src} alt={active.alt} />
                    {images.length > 1 && (
                        <button
                            type="button"
                            className="career-lightbox-nav is-next"
                            aria-label="Próxima foto"
                            onClick={() => setIndex((index + 1) % images.length)}
                        >
                            ›
                        </button>
                    )}
                    <p className="career-lightbox-caption">
                        {active.alt}
                        <span>{index + 1} / {images.length}</span>
                    </p>
                </div>
            )}

            <style>{`
                .career-gallery {
                    display: grid;
                    grid-template-columns: 1.35fr 1fr;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                }
                .career-thumbs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }
                .career-photo {
                    display: block;
                    width: 100%;
                    padding: 0;
                    border: 0;
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: zoom-in;
                    background: rgba(15, 23, 42, 0.35);
                }
                .career-photo img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .career-photo-cover,
                .career-photo-cover img {
                    min-height: 320px;
                }
                .career-photo-cover img { max-height: 460px; }
                .career-thumbs .career-photo { aspect-ratio: 1; }
                .career-photo:focus-visible,
                .career-lightbox-close:focus-visible,
                .career-lightbox-nav:focus-visible {
                    outline: 2px solid var(--primary-color);
                    outline-offset: 3px;
                }
                .career-lightbox {
                    position: fixed;
                    inset: 0;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4.5rem 4.5rem 5.5rem;
                    background: rgba(2, 6, 23, 0.94);
                }
                .career-lightbox img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 12px;
                }
                .career-lightbox-close,
                .career-lightbox-nav {
                    position: absolute;
                    border: 0;
                    color: #fff;
                    background: rgba(255, 255, 255, 0.12);
                    cursor: pointer;
                }
                .career-lightbox-close {
                    top: 1.25rem;
                    right: 1.25rem;
                    padding: 0.55rem 0.9rem;
                    border-radius: 999px;
                    font-weight: 700;
                }
                .career-lightbox-nav {
                    top: 50%;
                    transform: translateY(-50%);
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    font-size: 2rem;
                    line-height: 1;
                }
                .career-lightbox-nav.is-prev { left: 1rem; }
                .career-lightbox-nav.is-next { right: 1rem; }
                .career-lightbox-caption {
                    position: absolute;
                    left: 1.5rem;
                    right: 1.5rem;
                    bottom: 1rem;
                    margin: 0;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.88);
                    font-size: 0.92rem;
                }
                .career-lightbox-caption span {
                    display: block;
                    margin-top: 0.25rem;
                    color: rgba(255, 255, 255, 0.6);
                }
                @media (max-width: 800px) {
                    .career-gallery { grid-template-columns: 1fr; }
                    .career-photo-cover,
                    .career-photo-cover img {
                        min-height: 220px;
                        max-height: 280px;
                    }
                    .career-lightbox { padding: 4rem 1rem 6rem; }
                    .career-lightbox-nav.is-prev { left: 0.4rem; }
                    .career-lightbox-nav.is-next { right: 0.4rem; }
                }
            `}</style>
        </>
    );
};

export default PostGallery;
