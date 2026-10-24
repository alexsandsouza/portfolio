import React from 'react';
import { audiencePhrase } from '../../api/audience/logic.js';

const AudiencePlateia = ({ snapshot }) => {
    const phrase = audiencePhrase(snapshot);
    if (!phrase) return null;

    const sparks = Array.isArray(snapshot.sparks) ? snapshot.sparks.slice(-12) : [];

    return (
        <div style={{ marginBottom: '1.25rem' }} aria-live="polite">
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', minHeight: '12px' }} aria-hidden="true">
                {sparks.map((age, index) => {
                    const current = index === sparks.length - 1;
                    return (
                        <span
                            key={`${age}-${index}`}
                            style={{
                                width: current ? '10px' : '8px',
                                height: current ? '10px' : '8px',
                                borderRadius: '50%',
                                background: current ? 'var(--primary-color)' : 'var(--text-secondary)',
                                opacity: Math.max(0.35, 1 - Number(age) / 180),
                                boxShadow: current ? '0 0 8px var(--primary-color)' : 'none'
                            }}
                        />
                    );
                })}
            </div>
            <p style={{ margin: '0.45rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{phrase}</p>
        </div>
    );
};

export default AudiencePlateia;
