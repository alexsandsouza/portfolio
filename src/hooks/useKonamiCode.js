import { useEffect, useState } from 'react';

const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

export const useKonamiCode = () => {
    const [triggered, setTriggered] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === KONAMI_CODE[index]) {
                const nextIndex = index + 1;
                if (nextIndex === KONAMI_CODE.length) {
                    setTriggered(true);
                    setIndex(0);
                } else {
                    setIndex(nextIndex);
                }
            } else {
                setIndex(0);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [index]);

    return triggered;
};
