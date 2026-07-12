/**
 * @file content.test.js
 * @description Testes unitários para a camada de dados (content.js)
 * 
 * Abordagem TDD: Estes testes validam a integridade estrutural dos dados
 * que alimentam todo o portfolio. Qualquer alteração nos dados que quebre
 * a estrutura esperada será detectada automaticamente.
 * 
 * Requisitos Funcionais cobertos:
 * - RF-001: Exibição de informações pessoais e profissionais
 * - RF-002: Listagem de projetos com links válidos
 * - RF-003: Exibição de experiência profissional
 * - RF-004: Exibição de formação acadêmica
 * - RF-005: Dados de contato acessíveis
 * - RF-010: Dados de SEO presentes
 */
import { describe, it, expect } from 'vitest';
import { portfolioContent } from '../src/data/content';

describe('Camada de Dados — content.js', () => {

  // ============================================================
  // RF-001: Informações do Hero
  // ============================================================
  describe('RF-001: Seção Hero', () => {
    it('deve conter nome, título e posicionamento', () => {
      expect(portfolioContent.hero).toBeDefined();
      expect(portfolioContent.hero.name).toBeTruthy();
      expect(portfolioContent.hero.title).toBeTruthy();
      expect(portfolioContent.hero.positioning).toBeTruthy();
    });

    it('deve conter CTAs primário e secundário', () => {
      expect(portfolioContent.hero.ctaPrimary).toBeTruthy();
      expect(portfolioContent.hero.ctaSecondary).toBeTruthy();
    });
  });

  // ============================================================
  // RF-001: Sobre Mim
  // ============================================================
  describe('RF-001: Seção About', () => {
    it('deve conter descrição com mínimo de 100 caracteres', () => {
      expect(portfolioContent.about.description.length).toBeGreaterThan(100);
    });

    it('deve conter ao menos 3 estatísticas', () => {
      expect(portfolioContent.about.stats).toHaveLength(3);
    });

    it('cada estatística deve ter label e valor', () => {
      portfolioContent.about.stats.forEach(stat => {
        expect(stat.label).toBeTruthy();
        expect(stat.value).toBeTruthy();
      });
    });
  });

  // ============================================================
  // RF-002: Projetos
  // ============================================================
  describe('RF-002: Projetos', () => {
    it('deve conter ao menos 3 projetos', () => {
      expect(portfolioContent.projects.length).toBeGreaterThanOrEqual(3);
    });

    it('cada projeto deve ter título, contexto, role e descrição', () => {
      portfolioContent.projects.forEach(project => {
        expect(project.title).toBeTruthy();
        expect(project.context).toBeTruthy();
        expect(project.role).toBeTruthy();
        expect(project.description).toBeTruthy();
      });
    });

    it('projetos com link devem ter URLs válidas (https://)', () => {
      const projectsWithLinks = portfolioContent.projects.filter(p => p.link);
      projectsWithLinks.forEach(project => {
        expect(project.link).toMatch(/^https:\/\//);
      });
    });

    it('não deve conter referências ao domínio ad-academy-one', () => {
      const allLinks = portfolioContent.projects
        .filter(p => p.link)
        .map(p => p.link);
      allLinks.forEach(link => {
        expect(link).not.toContain('ad-academy-one');
      });
    });
  });

  // ============================================================
  // RF-003: Experiência Profissional
  // ============================================================
  describe('RF-003: Experiência Profissional', () => {
    it('deve conter ao menos 3 experiências', () => {
      expect(portfolioContent.professionalExperience.length).toBeGreaterThanOrEqual(3);
    });

    it('cada experiência deve ter instituição, cargo, período e descrição', () => {
      portfolioContent.professionalExperience.forEach(exp => {
        expect(exp.institution).toBeTruthy();
        expect(exp.role).toBeTruthy();
        expect(exp.period).toBeTruthy();
        expect(exp.description).toBeTruthy();
      });
    });
  });

  // ============================================================
  // RF-004: Formação Acadêmica
  // ============================================================
  describe('RF-004: Formação Acadêmica', () => {
    it('deve conter ao menos 3 formações', () => {
      expect(portfolioContent.education.length).toBeGreaterThanOrEqual(3);
    });

    it('cada formação deve ter instituição, curso, nível e período', () => {
      portfolioContent.education.forEach(edu => {
        expect(edu.institution).toBeTruthy();
        expect(edu.course).toBeTruthy();
        expect(edu.level).toBeTruthy();
        expect(edu.period).toBeTruthy();
      });
    });
  });

  // ============================================================
  // RF-005: Skills
  // ============================================================
  describe('RF-005: Skills', () => {
    it('deve conter hard skills com categorias tech, infra e base', () => {
      expect(portfolioContent.skills.hard.tech).toBeDefined();
      expect(portfolioContent.skills.hard.infra).toBeDefined();
      expect(portfolioContent.skills.hard.base).toBeDefined();
    });

    it('deve conter PHP nas skills técnicas', () => {
      expect(portfolioContent.skills.hard.tech).toContain('PHP');
    });

    it('deve conter soft skills', () => {
      expect(portfolioContent.skills.soft.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // RF-010: SEO
  // ============================================================
  describe('RF-010: Dados de SEO', () => {
    it('deve conter título, descrição e keywords para SEO', () => {
      expect(portfolioContent.seo.title).toBeTruthy();
      expect(portfolioContent.seo.description).toBeTruthy();
      expect(portfolioContent.seo.keywords).toBeTruthy();
    });

    it('a descrição de SEO deve ter entre 50 e 200 caracteres', () => {
      const len = portfolioContent.seo.description.length;
      expect(len).toBeGreaterThanOrEqual(50);
      expect(len).toBeLessThanOrEqual(200);
    });
  });

  // ============================================================
  // RF-006: Contato
  // ============================================================
  describe('RF-006: Contato', () => {
    it('deve conter título e texto de contato', () => {
      expect(portfolioContent.contact.title).toBeTruthy();
      expect(portfolioContent.contact.text).toBeTruthy();
    });
  });

  // ============================================================
  // RF-007: Depoimentos
  // ============================================================
  describe('RF-007: Depoimentos', () => {
    it('deve conter ao menos 1 depoimento', () => {
      expect(portfolioContent.testimonials.list.length).toBeGreaterThanOrEqual(1);
    });

    it('cada depoimento deve ter quote, author e role', () => {
      portfolioContent.testimonials.list.forEach(t => {
        expect(t.quote).toBeTruthy();
        expect(t.author).toBeTruthy();
        expect(t.role).toBeTruthy();
      });
    });
  });

  // ============================================================
  // RF-008: Jornada Interativa (Quiz)
  // ============================================================
  describe('RF-008: Jornada e Quiz', () => {
    it('deve conter ao menos 3 passos na jornada', () => {
      expect(portfolioContent.journey.steps.length).toBeGreaterThanOrEqual(3);
    });

    it('cada passo deve ter id e label', () => {
      portfolioContent.journey.steps.forEach(step => {
        expect(step.id).toBeDefined();
        expect(step.label).toBeTruthy();
      });
    });

    it('o quiz deve conter ao menos 3 perguntas', () => {
      expect(portfolioContent.quiz.questions.length).toBeGreaterThanOrEqual(3);
    });

    it('cada pergunta do quiz deve ter 4 opções e resposta válida', () => {
      portfolioContent.quiz.questions.forEach(q => {
        expect(q.options).toHaveLength(4);
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer).toBeLessThan(4);
      });
    });
  });

  // ============================================================
  // RN-001: Integridade de Dados
  // ============================================================
  describe('RN-001: Integridade Estrutural', () => {
    it('não deve conter campos undefined em nenhum projeto', () => {
      portfolioContent.projects.forEach(p => {
        expect(p.title).not.toBeUndefined();
        expect(p.description).not.toBeUndefined();
      });
    });

    it('a estrutura geral do content deve ter todas as seções obrigatórias', () => {
      const requiredSections = [
        'seo', 'hero', 'about', 'backendExpertise', 'areas',
        'projects', 'professionalExperience', 'education',
        'highlights', 'services', 'skills', 'contact',
        'testimonials', 'journey', 'quiz'
      ];
      requiredSections.forEach(section => {
        expect(portfolioContent[section]).toBeDefined();
      });
    });
  });
});
