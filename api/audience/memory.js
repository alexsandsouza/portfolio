import { applyVisit, emptyState, summarize } from './logic.js';

let state = emptyState();

export function resetAudienceMemory() {
    state = emptyState();
}

export function readMemory(now = Date.now(), currentId) {
    return summarize(state, now, currentId);
}

export function visitMemory({ id, path, now = Date.now() }) {
    const result = applyVisit(state, { id, path, now });
    if (result.error) {
        const error = new Error('Identificador inválido.');
        error.status = 400;
        throw error;
    }
    state = result.state;
    return summarize(state, now, id);
}
