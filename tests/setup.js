/**
 * @file setup.js
 * @description Configuração global do ambiente de testes (Vitest + Testing Library)
 * 
 * Este arquivo é executado antes de cada suite de testes.
 * Configura os matchers do jest-dom e mocks globais necessários.
 */
import '@testing-library/jest-dom';

// Mock do IntersectionObserver (usado pelo componente Reveal)
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

global.IntersectionObserver = IntersectionObserverMock;

// Mock do matchMedia (usado para temas e media queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock do clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Mock do scrollTo
window.scrollTo = vi.fn();
