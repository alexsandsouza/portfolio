import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { applyFlags, applyVisit, audiencePhrase, emptyState, isCountedPath, summarize } from '../api/audience/logic.js';
import AudiencePlateia from '../src/components/AudiencePlateia.jsx';

const id = '11111111-1111-4111-8111-111111111111';
const sameDay = Date.parse('2026-10-25T03:30:00.000Z');
const nextDay = Date.parse('2026-10-25T04:30:00.000Z');

describe('contador de visitantes', () => {
    it('conta a primeira visita no total, em hoje e em agora', () => {
        const result = applyVisit(emptyState(), { id, path: '/', now: sameDay });
        const view = summarize(result.state, sameDay, id);
        expect(view).toMatchObject({ total: 1, today: 1, online: 1 });
    });

    it('não aumenta o total quando a mesma pessoa atualiza a página', () => {
        const first = applyVisit(emptyState(), { id, path: '/', now: sameDay }).state;
        const second = applyVisit(first, { id, path: '/', now: sameDay + 1000 }).state;
        const view = summarize(second, sameDay + 1000, id);
        expect(view).toMatchObject({ total: 1, today: 1, online: 1 });
    });

    it('mantém o total e soma o dia seguinte no fuso de Manaus', () => {
        const first = applyVisit(emptyState(), { id, path: '/blog', now: sameDay }).state;
        const second = applyVisit(first, { id, path: '/cv', now: nextDay }).state;
        expect(summarize(second, nextDay, id)).toMatchObject({ total: 1, today: 1, online: 1 });
    });

    it('não conta uma rota de aula', () => {
        const result = applyVisit(emptyState(), { id, path: '/fametro/so', now: sameDay });
        expect(result.state.total).toBe(0);
        expect(isCountedPath('/hackersdobem')).toBe(false);
        expect(isCountedPath('/blog/imersao')).toBe(true);
    });

    it('recusa um identificador inválido sem gravar', () => {
        const result = applyVisit(emptyState(), { id: 'pedro', path: '/', now: sameDay });
        expect(result.error).toBe('invalid');
        expect(result.state.total).toBe(0);
    });

    it('esconde a plateia quando a contagem não chega', () => {
        const { container } = render(createElement(AudiencePlateia, { snapshot: null }));
        expect(container).toBeEmptyDOMElement();
    });

    it('soma o total e o dia só quando a visita é nova', () => {
        const first = applyFlags(emptyState(), { incrementTotal: true, incrementToday: true, now: sameDay });
        const second = applyFlags(first.state, { incrementTotal: false, incrementToday: false, now: sameDay + 1000 });
        expect(second.view).toEqual({ total: 1, today: 1 });
        expect(audiencePhrase(second.view)).toBe('1 pessoa já passou por aqui - 1 hoje');
    });

    it('mostra total, hoje e agora com hífen', () => {
        render(createElement(AudiencePlateia, { snapshot: { total: 12, today: 4, online: 3, sparks: [20, 0] } }));
        const phrase = '12 pessoas já passaram por aqui - 4 hoje - 3 agora';
        expect(audiencePhrase({ total: 12, today: 4, online: 3 })).toBe(phrase);
        expect(screen.getByText(phrase)).toBeInTheDocument();
        expect(screen.getByText(phrase).textContent.includes('\u2014')).toBe(false);
    });
});
