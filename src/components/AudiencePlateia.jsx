import React, { useEffect, useState } from 'react';
import { audiencePhrase } from '../../api/audience/logic.js';
import { subscribeAudience } from '../utils/audienceClient';

function toDigits(value, minLength) {
    const safe = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    return String(safe).padStart(minLength, '0').split('').map((char) => Number(char));
}

function FlapDigit({ digit, delay }) {
    const [shown, setShown] = useState(0);

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced || digit === 0) {
            setShown(digit);
            return undefined;
        }

        let value = 0;
        let timer = 0;
        let cancelled = false;
        setShown(0);

        const step = () => {
            if (cancelled) return;
            value += 1;
            setShown(value);
            if (value < digit) timer = window.setTimeout(step, 110);
        };

        timer = window.setTimeout(step, delay);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [digit, delay]);

    return (
        <span className="flap-digit" aria-hidden="true">
            <span key={shown} className="flap-digit__num">{shown}</span>
        </span>
    );
}

function FlapRow({ label, value, minLength }) {
    const digits = toDigits(value, minLength);

    return (
        <div className="flap-row">
            <span className="flap-row__label">{label}</span>
            <span className="flap-digits">
                {digits.map((digit, index) => (
                    <FlapDigit
                        key={`${digits.length}-${index}`}
                        digit={digit}
                        delay={(digits.length - 1 - index) * 70}
                    />
                ))}
            </span>
        </div>
    );
}

const AudiencePlateia = ({ snapshot, compact = false }) => {
    const phrase = audiencePhrase(snapshot);
    if (!phrase) return null;

    return (
        <div className={compact ? 'flap-board flap-board--compact' : 'flap-board'} aria-live="polite">
            <p className="sr-only">{phrase}</p>
            <div className="flap-panel" aria-hidden="true">
                <span className="flap-panel__scan" />
                <FlapRow label="Total de visitantes" value={snapshot.total} minLength={4} />
                <FlapRow label="Hoje" value={snapshot.today} minLength={3} />
            </div>
        </div>
    );
};

export function AudienceLive({ compact = false }) {
    const [snapshot, setSnapshot] = useState(null);
    useEffect(() => subscribeAudience(setSnapshot), []);
    return <AudiencePlateia snapshot={snapshot} compact={compact} />;
}

export default AudiencePlateia;
