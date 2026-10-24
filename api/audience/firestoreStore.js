import { db } from '../firebaseAdmin.js';
import { applyVisit, emptyState, isCountedPath, isUuid, summarize } from './logic.js';

const SUMMARY_PATH = 'audience/summary';
const VISITORS = 'audience_visitors';
const ONLINE_WINDOW_MS = 3 * 60 * 1000;

function summaryFromDoc(snap) {
    if (!snap.exists) return emptyState();
    const data = snap.data() || {};
    return {
        total: Number(data.total) || 0,
        days: data.days && typeof data.days === 'object' ? data.days : {},
        seen: {}
    };
}

export async function readFirestore(now = Date.now(), currentId) {
    const summarySnap = await db.doc(SUMMARY_PATH).get();
    const summary = summaryFromDoc(summarySnap);
    const cutoff = now - ONLINE_WINDOW_MS;
    const onlineSnap = await db.collection(VISITORS).where('seen', '>=', cutoff).get();
    const seen = {};
    onlineSnap.docs.forEach((doc) => {
        const data = doc.data() || {};
        seen[doc.id] = { day: data.lastDay, at: Number(data.seen) || 0 };
    });
    return summarize({ ...summary, seen }, now, currentId);
}

export async function visitFirestore({ id, path, now = Date.now() }) {
    if (!isUuid(id)) {
        const error = new Error('Identificador inválido.');
        error.status = 400;
        throw error;
    }
    if (!isCountedPath(path)) return readFirestore(now, id);

    const summaryRef = db.doc(SUMMARY_PATH);
    const visitorRef = db.collection(VISITORS).doc(id);

    await db.runTransaction(async (tx) => {
        const summarySnap = await tx.get(summaryRef);
        const visitorSnap = await tx.get(visitorRef);
        const summary = summaryFromDoc(summarySnap);
        if (visitorSnap.exists) {
            const data = visitorSnap.data() || {};
            summary.seen[id] = { day: data.lastDay, at: Number(data.seen) || 0 };
        }
        const result = applyVisit(summary, { id, path, now });
        const next = result.state;
        tx.set(summaryRef, { total: next.total, days: { [next.seen[id].day]: next.days[next.seen[id].day] || 0 } });
        tx.set(visitorRef, { lastDay: next.seen[id].day, seen: now });
    });

    return readFirestore(now, id);
}
