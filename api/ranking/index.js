import { db, admin } from '../firebaseAdmin.js';
import { setCorsHeaders, handleError } from '../apiUtils.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Método ${req.method} não permitido` });
    }
  } catch (error) {
    return handleError(res, error, 'Falha ao processar requisição de ranking.');
  }
}

/**
 * Retorna as listagens de ranking escolares com filtros em memória para evitar quebras por índices.
 */
async function handleGet(req, res) {
  const { category, module: moduleQuery } = req.query;

  const snapshot = await db.collection('fametro_ranking').get();
  let loaded = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: formatFirestoreTimestamp(data.timestamp)
    };
  });

  // Aplica filtros se fornecidos
  if (category) {
    loaded = loaded.filter(item => item.category === category);
  }

  if (moduleQuery) {
    loaded = loaded.filter(item => item.module === moduleQuery);
  }

  // Ordenação prioritária em memória: pontuação (desc), duração (asc), tempo antigo (asc)
  loaded.sort((a, b) => {
    const scoreDiff = (b.score || 0) - (a.score || 0);
    if (scoreDiff !== 0) return scoreDiff;

    if (a.duration !== undefined && b.duration !== undefined) {
      return a.duration - b.duration;
    }

    const timeA = a.timestamp && a.timestamp.seconds ? a.timestamp.seconds : 0;
    const timeB = b.timestamp && b.timestamp.seconds ? b.timestamp.seconds : 0;
    return timeA - timeB;
  });

  return res.status(200).json(loaded);
}

/**
 * Cria uma nova pontuação no ranking.
 */
async function handlePost(req, res) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  if (!body || !body.name || body.score === undefined) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: name, score' });
  }

  const docData = {
    name: body.name,
    score: Number(body.score),
    category: body.category || '',
    materia: body.materia || '',
    unidade: body.unidade || '',
    module: body.module || '',
    duration: body.duration !== undefined ? Number(body.duration) : null,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  };

  const docRef = await db.collection('fametro_ranking').add(docData);
  return res.status(201).json({ id: docRef.id, message: 'Score registrado com sucesso.' });
}

function formatFirestoreTimestamp(timestamp) {
  if (!timestamp) return null;
  try {
    return {
      seconds: timestamp.seconds,
      nanoseconds: timestamp.nanoseconds,
      toDate: () => timestamp.toDate()
    };
  } catch (e) {
    return timestamp;
  }
}
