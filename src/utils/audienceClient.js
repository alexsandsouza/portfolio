import { isCountedPath, isUuid } from '../../api/audience/logic.js';

const STORAGE_KEY = 'portfolio-audience-id';
const listeners = new Set();
let snapshot = null;

export function getOrCreateAudienceId() {
    try {
        const current = localStorage.getItem(STORAGE_KEY);
        if (isUuid(current)) return current;
        const id = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, id);
        return id;
    } catch {
        return null;
    }
}

export function subscribeAudience(listener) {
    listener(snapshot);
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function publish(next) {
    snapshot = next;
    listeners.forEach((listener) => listener(snapshot));
}

export async function recordVisit(pathname) {
    if (!isCountedPath(pathname)) return;
    const id = getOrCreateAudienceId();
    if (!id) return;

    try {
        const endpoint = window.location.hostname.endsWith('github.io')
            ? 'https://alexsanderfarias.vercel.app/api/audience'
            : '/api/audience';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ id, path: pathname })
        });
        if (!response.ok) return;
        const data = await response.json();
        if (typeof data.total !== 'number') return;
        publish(data);
    } catch {
        // A página segue sem número inventado.
    }
}
