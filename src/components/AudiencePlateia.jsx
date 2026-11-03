import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { audiencePhrase } from '../../api/audience/logic.js';
import { subscribeAudience } from '../utils/audienceClient';

const numberFormat = new Intl.NumberFormat('pt-BR');
function formatCount(value) {
    return numberFormat.format(Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0);
}

const AudiencePlateia = ({ snapshot, compact = false }) => {
    const phrase = audiencePhrase(snapshot);
    // Keep audience statistics in the footer, leaving the hero focused on the introduction.
    if (!compact || !phrase) return null;

    return (
        <div
            className="audience-summary"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.5rem 0.75rem',
                margin: '1.5rem 0 1rem',
                padding: '0.75rem 0',
                color: 'var(--text-secondary, #64748b)',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
            }}
        >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={16} aria-hidden="true" style={{ color: '#8b7cf8', flexShrink: 0 }} />
                <span>
                    <strong style={{ color: '#8b7cf8', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {formatCount(snapshot.total)}
                    </strong>
                    {' '}{snapshot.total === 1 ? 'visita ao portfólio' : 'visitas ao portfólio'}
                </span>
            </span>
            <span aria-hidden="true" style={{ opacity: 0.45 }}>·</span>
            <span>
                <strong style={{ color: 'var(--text-primary, inherit)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {formatCount(snapshot.today)}
                </strong>
                {' '}hoje
            </span>
        </div>
    );
};

export function AudienceLive({ compact = false }) {
    const [snapshot, setSnapshot] = useState(null);
    useEffect(() => {
        if (!compact) return undefined;
        return subscribeAudience(setSnapshot);
    }, [compact]);
    return <AudiencePlateia snapshot={snapshot} compact={compact} />;
}

export default AudiencePlateia;
