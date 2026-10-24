const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ONLINE_WINDOW_MS = 3 * 60 * 1000;
const COUNTED_PREFIXES = ['/blog', '/cv', '/links', '/mentoria', '/privacidade', '/feedback', '/teste-afinidade'];
const IGNORED_PREFIXES = ['/fametro', '/hackersdobem', '/formacao-docente', '/inovatech2026'];

export function emptyState() {
    return { total: 0, days: {}, seen: {} };
}

export function isUuid(value) {
    return typeof value === 'string' && UUID_PATTERN.test(value);
}

export function normalizePath(pathname) {
    const path = String(pathname || '/').split('?')[0].split('#')[0];
    if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
    return path || '/';
}

export function isCountedPath(pathname) {
    const path = normalizePath(pathname);
    if (IGNORED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return false;
    if (path === '/') return true;
    return COUNTED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function manausDay(now) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Manaus',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(now));
}

export function applyVisit(state, { id, path, now }) {
    if (!isUuid(id)) return { state, error: 'invalid' };
    if (!isCountedPath(path)) return { state };

    const day = manausDay(now);
    const prev = state.seen[id];
    const days = { ...state.days };
    let total = state.total;

    if (!prev) {
        total += 1;
        days[day] = (days[day] || 0) + 1;
    } else if (prev.day !== day) {
        days[day] = (days[day] || 0) + 1;
    }

    return {
        state: {
            total,
            days,
            seen: { ...state.seen, [id]: { day, at: now } }
        }
    };
}

export function summarize(state, now, currentId) {
    const day = manausDay(now);
    const recent = Object.entries(state.seen)
        .filter(([, visit]) => now - visit.at <= ONLINE_WINDOW_MS)
        .map(([id, visit]) => ({
            id,
            age: Math.max(0, Math.round((now - visit.at) / 1000))
        }))
        .sort((a, b) => b.age - a.age || (a.id === currentId ? 1 : b.id === currentId ? -1 : 0));

    return {
        total: state.total,
        today: state.days[day] || 0,
        online: recent.length,
        sparks: recent.slice(-12).map((visit) => visit.age)
    };
}

export function audiencePhrase(snapshot) {
    if (!snapshot || typeof snapshot.total !== 'number') return '';
    const people = snapshot.total === 1
        ? '1 pessoa já passou por aqui'
        : `${snapshot.total} pessoas já passaram por aqui`;
    const today = snapshot.today === 1 ? '1 hoje' : `${snapshot.today} hoje`;
    const online = snapshot.online === 1 ? '1 agora' : `${snapshot.online} agora`;
    return `${people} - ${today} - ${online}`;
}
