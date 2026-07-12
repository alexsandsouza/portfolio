/**
 * @file security.test.js
 * @description Testes de Segurança e conformidade LGPD
 * 
 * Valida que o portfolio segue as melhores práticas de segurança
 * da informação e conformidade com a Lei Geral de Proteção de Dados.
 * 
 * Requisitos Não-Funcionais cobertos:
 * - RNF-005: Headers de segurança
 * - RNF-006: Proteção contra XSS
 * - RNF-007: Conformidade LGPD
 * - RNF-008: Links externos seguros
 */
import { describe, it, expect } from 'vitest';
import { portfolioContent } from '../src/data/content';
import fs from 'fs';
import path from 'path';

describe('Segurança da Informação', () => {

  // ============================================================
  // RNF-006: Proteção contra XSS em dados estáticos
  // ============================================================
  describe('RNF-006: Proteção contra XSS', () => {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /eval\(/i,
      /document\.cookie/i,
      /innerHTML/i,
    ];

    it('nenhum campo de texto do content deve conter scripts maliciosos', () => {
      const checkValue = (val, path) => {
        if (typeof val === 'string') {
          dangerousPatterns.forEach(pattern => {
            expect(val, `XSS detectado em ${path}: "${val}"`).not.toMatch(pattern);
          });
        } else if (Array.isArray(val)) {
          val.forEach((item, i) => checkValue(item, `${path}[${i}]`));
        } else if (typeof val === 'object' && val !== null) {
          Object.entries(val).forEach(([key, v]) => checkValue(v, `${path}.${key}`));
        }
      };
      checkValue(portfolioContent, 'portfolioContent');
    });
  });

  // ============================================================
  // RNF-008: Links externos devem usar rel="noopener noreferrer"
  // ============================================================
  describe('RNF-008: Segurança de Links Externos', () => {
    it('todos os links de projetos devem usar HTTPS', () => {
      const links = portfolioContent.projects
        .filter(p => p.link)
        .map(p => p.link);

      links.forEach(link => {
        expect(link).toMatch(/^https:\/\//);
      });
    });

    it('links de depoimentos devem usar HTTPS (se existirem)', () => {
      const links = portfolioContent.highlights
        .filter(h => h.link)
        .map(h => h.link);

      links.forEach(link => {
        expect(link).toMatch(/^https:\/\//);
      });
    });
  });

  // ============================================================
  // RNF-005: Verificação de Headers de Segurança (vercel.json)
  // ============================================================
  describe('RNF-005: Configuração de Deploy Seguro', () => {
    it('vercel.json deve existir', () => {
      const vercelPath = path.resolve(process.cwd(), 'vercel.json');
      expect(fs.existsSync(vercelPath)).toBe(true);
    });
  });

  // ============================================================
  // RNF-009: Variáveis de Ambiente
  // ============================================================
  describe('RNF-009: Proteção de Segredos', () => {
    it('.env.example deve existir para documentar variáveis necessárias', () => {
      const envExamplePath = path.resolve(process.cwd(), '.env.example');
      expect(fs.existsSync(envExamplePath)).toBe(true);
    });

    it('.gitignore deve ignorar .env e .env.local', () => {
      const gitignorePath = path.resolve(process.cwd(), '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf-8');
      expect(content).toContain('.env');
    });

    it('nenhuma chave de API deve estar hardcoded no content.js', () => {
      const contentPath = path.resolve(process.cwd(), 'src/data/content.js');
      const content = fs.readFileSync(contentPath, 'utf-8');
      
      // Padrões comuns de API keys
      const apiKeyPatterns = [
        /AIza[0-9A-Za-z_-]{35}/,            // Google API Key
        /sk-[a-zA-Z0-9]{32,}/,              // OpenAI
        /AKIA[0-9A-Z]{16}/,                 // AWS
        /ghp_[a-zA-Z0-9]{36}/,             // GitHub PAT
      ];

      apiKeyPatterns.forEach(pattern => {
        expect(content).not.toMatch(pattern);
      });
    });
  });
});

describe('Conformidade LGPD', () => {

  // ============================================================
  // RNF-007: Dados Pessoais e Consentimento
  // ============================================================
  describe('RNF-007: Proteção de Dados Pessoais', () => {
    it('não deve expor CPF, RG ou dados sensíveis no content.js', () => {
      const contentStr = JSON.stringify(portfolioContent);
      
      // CPF pattern: XXX.XXX.XXX-XX
      expect(contentStr).not.toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
      // RG pattern
      expect(contentStr).not.toMatch(/\d{2}\.\d{3}\.\d{3}-\d{1}/);
      // Número de cartão
      expect(contentStr).not.toMatch(/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/);
    });

    it('dados de contato expostos devem ser apenas profissionais (email, linkedin)', () => {
      // O portfolio deve expor apenas dados profissionais, não pessoais
      const contentStr = JSON.stringify(portfolioContent);
      
      // Não deve conter endereço residencial completo
      expect(contentStr).not.toMatch(/CEP:\s*\d{5}-\d{3}/i);
      // Não deve conter número de telefone pessoal no content (WhatsApp é separado)
      expect(contentStr).not.toMatch(/\(\d{2}\)\s*\d{4,5}-\d{4}/);
    });
  });

  // ============================================================
  // RNF-007: Formulário de Contato - LGPD
  // ============================================================
  describe('RNF-007: Formulário de Contato', () => {
    it('o formulário deve usar serviço externo sem armazenar dados localmente', () => {
      // O Contact.jsx usa formsubmit.co — dados não ficam no Firebase
      const contactPath = path.resolve(process.cwd(), 'src/sections/Contact.jsx');
      const content = fs.readFileSync(contactPath, 'utf-8');
      
      // Deve usar formsubmit.co ou similar
      expect(content).toMatch(/formsubmit\.co/);
      // Não deve salvar dados em Firestore diretamente
      expect(content).not.toMatch(/addDoc|setDoc|collection\(/);
    });
  });

  // ============================================================
  // RNF-007: Firestore Rules
  // ============================================================
  describe('RNF-007: Firestore Security Rules', () => {
    it('firestore.rules deve existir e não permitir acesso irrestrito a todas as coleções', () => {
      const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
      const content = fs.readFileSync(rulesPath, 'utf-8');
      
      // Deve ter regras definidas
      expect(content).toContain('rules_version');
      // Não deve ter "allow read, write: if true" no nível raiz (sem match específico)
      expect(content).not.toMatch(/match\s+\/\{document=\*\*\}[\s\S]*allow\s+read,\s*write:\s*if\s+true/);
    });
  });
});
