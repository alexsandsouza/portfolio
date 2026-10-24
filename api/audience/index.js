import { setCorsHeaders, handleError } from '../apiUtils.js';
import { isCountedPath, manausDay } from './logic.js';

const NAMESPACE = 'alexsanderfarias';

async function readCount(key, increment) {
    const action = increment ? 'hit' : 'get';
    const response = await fetch(`https://abacus.jasoncameron.dev/${action}/${NAMESPACE}/${encodeURIComponent(key)}`, {
        redirect: 'manual'
    });
    if (response.status === 308 || response.status === 404) return 0;
    if (!response.ok) throw new Error('Contador indisponível.');
    const data = await response.json();
    if (typeof data.value !== 'number') throw new Error('Contador indisponível.');
    return data.value;
}

export default async function handler(req, res) {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method !== 'POST' && req.method !== 'GET') {
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).json({ error: 'Método não permitido' });
        }

        const body = req.method === 'POST'
            ? (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {}))
            : {};
        const path = typeof body.path === 'string' ? body.path : '/';
        const counted = isCountedPath(path);
        const day = manausDay(Date.now());
        const total = await readCount('visitas', counted && body.incrementTotal === true);
        const today = await readCount(`dia-${day}`, counted && body.incrementToday === true);
        return res.status(200).json({ total, today });
    } catch (error) {
        return handleError(res, error, 'Falha ao registrar a visita.');
    }
}
