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
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: `Método ${req.method} não permitido` });
    }
  } catch (error) {
    return handleError(res, error, 'Falha ao processar requisição de perfil comportamental.');
  }
}

/**
 * Retorna todos os registros de perfis comportamentais cadastrados.
 */
async function handleGet(req, res) {
  const snapshot = await db.collection('perfil_comportamental').orderBy('timestamp', 'desc').get();
  const results = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: formatFirestoreTimestamp(data.timestamp)
    };
  });
  return res.status(200).json(results);
}

/**
 * Cadastra um novo perfil comportamental.
 */
async function handlePost(req, res) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  
  if (!body || !body.nome || !body.perfilKey) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: nome, perfilKey' });
  }

  const docData = {
    nome: body.nome,
    perfilDominante: body.perfilDominante || '',
    perfilKey: body.perfilKey,
    pctAguia: Number(body.pctAguia) || 0,
    pctGato: Number(body.pctGato) || 0,
    pctLobo: Number(body.pctLobo) || 0,
    pctTubarao: Number(body.pctTubarao) || 0,
    respostas: body.respostas || [],
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  };

  const docRef = await db.collection('perfil_comportamental').add(docData);
  return res.status(201).json({ id: docRef.id, message: 'Perfil salvo com sucesso.' });
}

/**
 * Remove um perfil comportamental pelo ID.
 */
async function handleDelete(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Parâmetro "id" é obrigatório.' });
  }

  await db.collection('perfil_comportamental').doc(id).delete();
  return res.status(200).json({ message: 'Perfil removido com sucesso.' });
}

/**
 * Formata os timestamps do Firestore de forma a serem compatíveis com serialização JSON.
 */
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
