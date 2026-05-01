/**
 * @file seo.test.js
 * @description Testes de SEO e Acessibilidade
 * 
 * Valida a presença e integridade de meta tags, Schema Markup,
 * Open Graph e elementos essenciais de SEO.
 * 
 * Requisitos Não-Funcionais cobertos:
 * - RNF-001: Performance (meta tags otimizadas)
 * - RNF-003: SEO técnico
 * - RNF-004: Acessibilidade (lang, semântica)
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('SEO & Acessibilidade', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // ============================================================
  // RNF-003: Meta Tags Essenciais
  // ============================================================
  describe('RNF-003: Meta Tags', () => {
    it('deve ter a tag <title> definida', () => {
      expect(html).toMatch(/<title>.+<\/title>/);
    });

    it('deve ter meta description', () => {
      expect(html).toMatch(/name="description"/);
    });

    it('deve ter meta keywords', () => {
      expect(html).toMatch(/name="keywords"/);
    });

    it('deve ter meta author', () => {
      expect(html).toMatch(/name="author"/);
    });

    it('deve ter meta viewport', () => {
      expect(html).toMatch(/name="viewport"/);
    });

    it('deve ter charset UTF-8', () => {
      expect(html).toMatch(/charset="UTF-8"/i);
    });

    it('deve ter canonical link', () => {
      expect(html).toMatch(/rel="canonical"/);
    });

    it('deve ter theme-color', () => {
      expect(html).toMatch(/name="theme-color"/);
    });
  });

  // ============================================================
  // RNF-003: Open Graph
  // ============================================================
  describe('RNF-003: Open Graph', () => {
    it('deve ter og:title', () => {
      expect(html).toMatch(/property="og:title"/);
    });

    it('deve ter og:description', () => {
      expect(html).toMatch(/property="og:description"/);
    });

    it('deve ter og:image', () => {
      expect(html).toMatch(/property="og:image"/);
    });

    it('deve ter og:url', () => {
      expect(html).toMatch(/property="og:url"/);
    });

    it('deve ter og:type', () => {
      expect(html).toMatch(/property="og:type"/);
    });
  });

  // ============================================================
  // RNF-003: Twitter Cards
  // ============================================================
  describe('RNF-003: Twitter Cards', () => {
    it('deve ter twitter:card', () => {
      expect(html).toMatch(/twitter:card/);
    });

    it('deve ter twitter:image', () => {
      expect(html).toMatch(/twitter:image/);
    });
  });

  // ============================================================
  // RNF-003: Schema Markup (Dados Estruturados)
  // ============================================================
  describe('RNF-003: Schema Markup', () => {
    it('deve conter Schema.org JSON-LD', () => {
      expect(html).toMatch(/application\/ld\+json/);
    });

    it('deve ter tipo Person no Schema', () => {
      expect(html).toMatch(/"@type":\s*"Person"/);
    });

    it('Schema deve conter sameAs com links de redes sociais', () => {
      expect(html).toMatch(/"sameAs"/);
    });
  });

  // ============================================================
  // RNF-004: Acessibilidade
  // ============================================================
  describe('RNF-004: Acessibilidade Básica', () => {
    it('deve ter lang="pt-BR" no <html>', () => {
      expect(html).toMatch(/lang="pt-BR"/);
    });

    it('deve ter o elemento raiz #root', () => {
      expect(html).toMatch(/id="root"/);
    });
  });

  // ============================================================
  // RNF-003: Arquivos de Crawling
  // ============================================================
  describe('RNF-003: robots.txt e sitemap.xml', () => {
    it('robots.txt deve existir', () => {
      const robotsPath = path.resolve(process.cwd(), 'public/robots.txt');
      expect(fs.existsSync(robotsPath)).toBe(true);
    });

    it('robots.txt deve referenciar o sitemap', () => {
      const robotsPath = path.resolve(process.cwd(), 'public/robots.txt');
      const content = fs.readFileSync(robotsPath, 'utf-8');
      expect(content.toLowerCase()).toContain('sitemap');
    });

    it('sitemap.xml deve existir', () => {
      const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
      expect(fs.existsSync(sitemapPath)).toBe(true);
    });

    it('sitemap.xml deve conter URLs válidas', () => {
      const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      expect(content).toMatch(/<loc>https:\/\//);
    });
  });
});
