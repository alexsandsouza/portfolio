import React from 'react';

const WhatsAppButton = ({ message }) => {
    const defaultMessage = "Olá, vi seu portfólio e gostaria de conversar!";
    const finalMessage = message ? message : defaultMessage;
    const encodedMessage = encodeURIComponent(finalMessage);

    const [showNotification, setShowNotification] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        // Show notification after 4 seconds
        const timer = setTimeout(() => {
            setShowNotification(true);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ position: 'fixed', bottom: '100px', right: '2rem', zIndex: 10002 }}>
            {/* Notification Bubble */}
            <div className={`wa-notification ${showNotification ? 'show' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>👋 Vamos conversar sobre seu projeto?</span>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowNotification(false); }}
                        style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }}
                    >
                        ×
                    </button>
                </div>
                <div className="wa-notification-arrow"></div>
            </div>

            <a
                href={`https://wa.me/5592981425690?text=${encodedMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float"
                aria-label="Conversar no WhatsApp"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
            </a>

            <style>{`
                .whatsapp-float {
                    width: 50px;
                    height: 50px;
                    background-color: #25d366;
                    color: #FFF;
                    border-radius: 50%;
                    text-align: center;
                    font-size: 24px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    animation: pulseBtn 3s infinite;
                    text-decoration: none;
                }
                .whatsapp-float:hover {
                    transform: scale(1.1);
                    background-color: #128C7E;
                    box-shadow: 0 6px 14px rgba(0,0,0,0.4);
                }
                
                .wa-notification {
                    position: absolute;
                    bottom: 70px; /* Above button */
                    right: 0;
                    background: white;
                    color: #333;
                    padding: 8px 12px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    font-size: 0.85rem;
                    font-weight: 500;
                    white-space: nowrap;
                    opacity: 0;
                    transform: translateY(10px) scale(0.9);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    pointer-events: none;
                    width: max-content;
                }

                .wa-notification.show {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: all;
                }

                .wa-notification-arrow {
                    position: absolute;
                    bottom: -6px;
                    right: 18px;
                    width: 12px;
                    height: 12px;
                    background: white;
                    transform: rotate(45deg);
                }

                @keyframes pulseBtn {
                    0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); } 
                    100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
                }

                @media (max-width: 768px) {
                    .whatsapp-float {
                        width: 45px;
                        height: 45px;
                    }
                    /* Adjust wrapper positioning logic manually if needed */
                }
            `}</style>
        </div>
    );
};

export default WhatsAppButton;
