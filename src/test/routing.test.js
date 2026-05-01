/**
 * @file routing.test.js
 * @description Testes de Roteamento e Navegação
 * 
 * Valida que todas as rotas definidas no App.jsx são resolvidas
 * corretamente e que o sistema de lazy loading funciona.
 * 
 * Requisitos Funcionais cobertos:
 * - RF-009: Navegação entre páginas
 * - RF-011: Página 404 para rotas inexistentes
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Roteamento & Navegação', () => {
  const appPath = path.resolve(process.cwd(), 'src/App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  // ============================================================
  // RF-009: Rotas Obrigatórias
  // ============================================================
  describe('RF-009: Rotas Obrigatórias', () => {
    const requiredRoutes = [
      { path: '/', name: 'Home' },
      { path: '/feedback', name: 'Feedback' },
      { path: '/mentoria', name: 'Mentoria' },
      { path: '/links', name: 'Links' },
      { path: '/cv', name: 'Currículo' },
      { path: '/hackersdobem', name: 'Hackers do Bem Hub' },
      { path: '/fametro', name: 'Fametro Hub' },
    ];

    requiredRoutes.forEach(route => {
      it(`deve ter a rota "${route.path}" (${route.name})`, () => {
        expect(appContent).toContain(`path="${route.path}"`);
      });
    });
  });

  // ============================================================
  // RF-011: Página 404
  // ============================================================
  describe('RF-011: Página 404', () => {
    it('deve ter uma rota catch-all (*) para 404', () => {
      expect(appContent).toContain('path="*"');
    });

    it('deve importar o componente NotFound', () => {
      expect(appContent).toMatch(/NotFound/);
    });
  });

  // ============================================================
  // RNF-001: Lazy Loading de Rotas
  // ============================================================
  describe('RNF-001: Code Splitting', () => {
    it('deve usar React.lazy() para páginas secundárias', () => {
      const lazyImports = appContent.match(/lazy\(\(\) =>/g);
      expect(lazyImports).not.toBeNull();
      expect(lazyImports.length).toBeGreaterThan(5);
    });

    it('deve usar Suspense com fallback', () => {
      expect(appContent).toMatch(/Suspense/);
      expect(appContent).toMatch(/fallback/);
    });
  });

  // ============================================================
  // RNF-002: Rotas Parametrizadas
  // ============================================================
  describe('RNF-002: Rotas Dinâmicas', () => {
    it('deve ter rota parametrizada para rankings HDB (:modulo)', () => {
      expect(appContent).toContain('ranking-:modulo');
    });
  });
});
