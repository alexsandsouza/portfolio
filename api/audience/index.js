import { setCorsHeaders, handleError } from '../apiUtils.js';
import { isCountedPath, isUuid } from './logic.js';
import { readFirestore, visitFirestore } from './firestoreStore.js';

export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            return res.status(200).json(await readFirestore());
        }

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
            if (!isUuid(body.id)) {
                return res.status(400).json({ error: 'Identificador inválido.' });
            }
            const path = typeof body.path === 'string' ? body.path : '/';
            const view = isCountedPath(path)
                ? await visitFirestore({ id: body.id, path })
                : await readFirestore(Date.now(), body.id);
            return res.status(200).json(view);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: 'Método não permitido' });
    } catch (error) {
        if (error.status === 400) return res.status(400).json({ error: 'Identificador inválido.' });
        return handleError(res, error, 'Falha ao registrar a visita.');
    }
}
