export function sitePath(path, base = import.meta.env.BASE_URL) {
    const root = String(base || '/').replace(/\/$/, '');
    if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return path;
    if (!root || path === root || path.startsWith(`${root}/`)) return path;
    return `${root}${path}`;
}
