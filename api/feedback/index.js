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
    return handleError(res, error, 'Falha ao processar requisição de feedback.');
  }
}

/**
 * Retorna os depoimentos que foram aprovados pelo professor.
 */
async function handleGet(req, res) {
  const snapshot = await db.collection('feedbacks').orderBy('createdAt', 'desc').get();
  const results = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: formatFirestoreTimestamp(data.createdAt)
    };
  });

  const approvedResults = results.filter(feedback => feedback.approved === true);
  return res.status(200).json(approvedResults);
}

/**
 * Submete um novo depoimento (auto-aprovado por padrão para demonstração).
 */
async function handlePost(req, res) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  if (!body || !body.name || !body.message) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: name, message' });
  }

  const docData = {
    name: body.name,
    role: body.role || 'Visitante',
    message: body.message,
    permission: body.permission === true,
    approved: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  const docRef = await db.collection('feedbacks').add(docData);
  return res.status(201).json({ id: docRef.id, message: 'Depoimento enviado com sucesso!' });
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
