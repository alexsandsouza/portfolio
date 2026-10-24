const STORAGE_KEY = 'quiz_hall_of_fame';

export function readLocalScores() {
    try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (!Array.isArray(raw)) return [];
        return raw.filter((item) => item && typeof item.name === 'string' && Number.isFinite(item.timeSeconds));
    } catch {
        return [];
    }
}

export function saveLocalScore({ name, timeSeconds }) {
    const entry = {
        id: `local-${Date.now()}`,
        name,
        timeSeconds,
        createdAt: Date.now()
    };
    const next = [entry, ...readLocalScores()].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('quiz-scores-updated'));
    return entry;
}
