# 📋 Documento de Requisitos do Sistema

## Portfolio Profissional — Prof. Alexsander Farias
**Versão:** 2.0  
**Data:** Maio/2026  
**Autor:** Alexsander Farias  
**URL Produção:** [alexsanderfarias.vercel.app](https://alexsanderfarias.vercel.app)

---

## 1. Visão Geral do Projeto

### 1.1 Objetivo
Plataforma digital profissional (portfolio) que centraliza a presença online do Prof. Alexsander Farias, integrando portfólio de projetos, experiência acadêmica, serviços profissionais, hub educacional e ecossistema de plataformas da AD Academy.

### 1.2 Público-alvo
| Persona | Necessidade |
|---------|-------------|
| Recrutadores e RHs | Avaliar competências técnicas e acadêmicas |
| Alunos e Mentorandos | Acessar atividades, rankings e conteúdos educacionais |
| Instituições de Ensino | Consultar experiência docente e serviços de consultoria |
| Parceiros e Clientes | Conhecer projetos e solicitar orçamentos |

### 1.3 Stack Tecnológica
| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19, Vite 7, React Router DOM 7 |
| Estilização | CSS nativo com Design Tokens (variáveis CSS) |
| Backend (BaaS) | Firebase Firestore (rankings e atividades) |
| Formulário | FormSubmit.co (processamento externo, LGPD-friendly) |
| Deploy | Vercel (CI/CD via GitHub) |
| Testes | Vitest, Testing Library, jest-dom |

---

## 2. Requisitos Funcionais (RF)

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF-001 | Exibir informações pessoais e profissionais (Hero, About, Stats) | Alta | ✅ Implementado |
| RF-002 | Listar projetos com título, descrição, role e link externo | Alta | ✅ Implementado |
| RF-003 | Exibir trajetória profissional com instituições e períodos | Alta | ✅ Implementado |
| RF-004 | Exibir formação acadêmica completa | Alta | ✅ Implementado |
| RF-005 | Exibir hard skills (tech, infra, base) e soft skills | Alta | ✅ Implementado |
| RF-006 | Formulário de contato funcional com validação em tempo real | Alta | ✅ Implementado |
| RF-007 | Exibir depoimentos e feedbacks de alunos/parceiros | Média | ✅ Implementado |
| RF-008 | Jornada interativa com gamificação (checklist + quiz) | Média | ✅ Implementado |
| RF-009 | Navegação por rotas SPA com lazy loading | Alta | ✅ Implementado |
| RF-010 | SEO otimizado com meta tags, Open Graph e Schema.org | Alta | ✅ Implementado |
| RF-011 | Página 404 personalizada para rotas inexistentes | Média | ✅ Implementado |
| RF-012 | Hub educacional Hackers do Bem (atividades + rankings por módulo) | Alta | ✅ Implementado |
| RF-013 | Hub educacional Fametro (POO, SO, Requisitos, AED, TecWeb) | Alta | ✅ Implementado |
| RF-014 | Alternância de tema claro/escuro | Média | ✅ Implementado |
| RF-015 | Download de CV em PDF | Média | ✅ Implementado |
| RF-016 | Integração com ecossistema AD Academy (Navbar + Footer) | Alta | ✅ Implementado |
| RF-017 | Página de links (bio) para redes sociais | Média | ✅ Implementado |
| RF-018 | Programa de mentoria com matrícula e contrato | Média | ✅ Implementado |

### 2.1 Detalhamento de Requisitos Críticos

#### RF-006: Formulário de Contato
- **Campos:** Nome, Email, Mensagem
- **Validação:** Em tempo real com indicadores visuais (borda verde/vermelha)
- **Processamento:** Via FormSubmit.co (sem armazenamento local de dados pessoais)
- **Feedback:** Estados de loading, sucesso e erro ao usuário
- **LGPD:** Dados enviados diretamente ao email, sem persistência em banco

#### RF-012: Hub Hackers do Bem
- **Módulos:** M01 a M12 com atividades individuais por módulo
- **Rankings:** Componente genérico `RankingModulo.jsx` com rota dinâmica
- **Dados:** Rankings armazenados em Firebase Firestore (coleção `fametro_ranking`)

---

## 3. Requisitos Não-Funcionais (RNF)

| ID | Requisito | Categoria | Métrica | Status |
|----|-----------|-----------|---------|--------|
| RNF-001 | Tempo de carregamento < 3s (LCP) | Performance | < 3000ms | ✅ |
| RNF-002 | Aplicação deve funcionar em Chrome, Firefox, Safari e Edge | Compatibilidade | 4 browsers | ✅ |
| RNF-003 | SEO Score Lighthouse > 90 | SEO | Score 90+ | ✅ |
| RNF-004 | Acessibilidade: suporte a focus-visible e prefers-reduced-motion | Acessibilidade | WCAG 2.1 AA | ✅ |
| RNF-005 | Deploy com HTTPS obrigatório (Vercel) | Segurança | TLS 1.3 | ✅ |
| RNF-006 | Proteção contra XSS em dados estáticos | Segurança | 0 vulnerabilidades | ✅ |
| RNF-007 | Conformidade LGPD (sem coleta indevida de dados pessoais) | Compliance | Auditado | ✅ |
| RNF-008 | Links externos com rel="noopener noreferrer" | Segurança | 100% cobertura | ✅ |
| RNF-009 | Variáveis sensíveis em .env (não hardcoded) | Segurança | 0 exposições | ✅ |
| RNF-010 | Responsividade: mobile-first (320px a 2560px) | UX | Breakpoints | ✅ |
| RNF-011 | Bundle otimizado com code splitting (lazy loading de rotas) | Performance | < 400KB initial | ⚠️ Parcial |
| RNF-012 | Cobertura de testes > 70% dos módulos críticos | Qualidade | 74 testes | ✅ |

---

## 4. Regras de Negócio (RN)

| ID | Regra | Descrição |
|----|-------|-----------|
| RN-001 | **Integridade de Dados** | Todos os projetos devem ter título, contexto, role e descrição. Links, quando presentes, devem ser HTTPS válidos. |
| RN-002 | **Ecossistema AD Academy** | O portfolio deve referenciar apenas plataformas ativas do ecossistema: AD Academy Net (`adacademynet.vercel.app`), Treinamentos e Hackers do Bem. O domínio `ad-academy-one.vercel.app` foi descontinuado e não deve ser referenciado. |
| RN-003 | **Dados de Contato** | Apenas dados profissionais (email, LinkedIn, GitHub) devem ser exibidos publicamente. CPF, RG, endereço e telefone pessoal não devem constar no código-fonte. |
| RN-004 | **Rankings Acadêmicos** | Rankings de atividades devem usar o componente genérico `RankingModulo.jsx` com rotas parametrizadas. Novos rankings não devem gerar novos arquivos de componente. |
| RN-005 | **Formulário de Contato** | Mensagens devem ser encaminhadas via serviço externo (FormSubmit.co). Dados não devem ser persistidos em Firebase ou localStorage. |
| RN-006 | **Tema Visual** | O sistema deve suportar dark mode (padrão) e light mode. Cores não devem ser hardcoded em componentes; devem usar variáveis CSS. |
| RN-007 | **Quiz Gamificado** | O quiz de jornada deve ter no mínimo 5 perguntas com 4 alternativas cada. A resposta correta deve estar entre os índices 0-3. |

---

## 5. Segurança da Informação

### 5.1 Medidas Implementadas

| Categoria | Implementação | Ferramenta |
|-----------|---------------|-----------|
| **HTTPS** | Forçado via Vercel (TLS 1.3) | Vercel |
| **XSS Prevention** | React escapa HTML por padrão; dados estáticos auditados | Vitest (security.test.js) |
| **CSRF** | FormSubmit.co gerencia tokens automaticamente | FormSubmit.co |
| **Secrets Management** | Firebase keys em `.env.local`, gitignored | .gitignore |
| **Dependency Audit** | `npm audit` integrado ao CI | npm |
| **Link Safety** | `rel="noopener noreferrer"` em todos os `target="_blank"` | Código-fonte |
| **Content Security** | Dados de content.js auditados contra padrões maliciosos | Vitest (security.test.js) |

### 5.2 Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /fametro_ranking/{doc} {
      allow read, write: if true;  // Rankings são públicos
    }
    match /perfil_comportamental/{doc} {
      allow read, write: if true;  // Perfis de alunos
    }
  }
}
```

> ⚠️ **Recomendação:** As regras atuais permitem escrita pública. Para produção, recomenda-se implementar validação de campos e rate limiting no nível do Firestore ou usar Cloud Functions como proxy.

### 5.3 Classificação de Dados

| Dado | Classificação | Exposição | Justificativa |
|------|--------------|-----------|---------------|
| Nome completo | Público | Frontend | Informação profissional do titular |
| Email profissional | Público | Frontend | Canal de contato profissional |
| LinkedIn/GitHub | Público | Frontend | Perfis profissionais públicos |
| Firebase API Key | Restrito | .env.local | Necessário para acesso ao Firestore |
| Ranking de alunos | Público | Firestore | Dados acadêmicos sem PII |
| Mensagens de contato | Confidencial | Email (via FormSubmit) | Dados de terceiros, não persistidos |

---

## 6. Conformidade LGPD (Lei 13.709/2018)

### 6.1 Análise de Conformidade

| Artigo LGPD | Requisito | Status | Implementação |
|-------------|-----------|--------|---------------|
| Art. 6º, I | **Finalidade** — Dados coletados para finalidade específica | ✅ | Formulário coleta apenas nome, email e mensagem para contato profissional |
| Art. 6º, II | **Adequação** — Compatível com a finalidade informada | ✅ | Campos do formulário são adequados ao propósito de contato |
| Art. 6º, III | **Necessidade** — Coleta mínima necessária | ✅ | Apenas 3 campos: nome, email, mensagem. Sem coleta de CPF, RG ou dados sensíveis |
| Art. 6º, VII | **Segurança** — Medidas técnicas de proteção | ✅ | HTTPS, XSS prevention, FormSubmit.co com encriptação |
| Art. 7º, I | **Consentimento** — Base legal para tratamento | ⚠️ | Recomendação: adicionar checkbox de consentimento no formulário |
| Art. 11 | **Dados Sensíveis** — Não coletar sem necessidade | ✅ | Nenhum dado sensível é coletado (religião, biometria, etc.) |
| Art. 18 | **Direitos do Titular** — Acesso, correção, exclusão | ℹ️ | Dados de contato não são persistidos; titular pode solicitar via email |
| Art. 46 | **Medidas de Segurança** — Proteção contra acesso não autorizado | ✅ | Firebase rules, HTTPS, variáveis de ambiente |

### 6.2 Dados Coletados

| Origem | Dados | Finalidade | Retenção | Base Legal |
|--------|-------|-----------|----------|------------|
| Formulário de Contato | Nome, Email, Mensagem | Responder solicitações profissionais | Sem retenção (envio direto por email) | Legítimo Interesse (Art. 7º, IX) |
| Firebase (Rankings) | Nome do aluno, Nota | Exibir classificação em atividades acadêmicas | Enquanto ativo no Firestore | Execução de Contrato (relação professor-aluno) |
| Firebase (Perfil) | Dados de perfil comportamental | Análise acadêmica | Enquanto ativo | Execução de Contrato |

### 6.3 Recomendações de Melhoria LGPD

1. **Adicionar checkbox de consentimento** no formulário de contato
2. **Criar página de Política de Privacidade** (`/privacidade`)
3. **Criar página de Termos de Uso** (`/termos`)
4. **Implementar banner de cookies** (caso utilize analytics futuramente)
5. **Documentar canal de contato para exercício de direitos** do titular (Art. 18)

---

## 7. Estratégia de Testes (TDD)

### 7.1 Estrutura de Testes

```
src/test/
├── setup.js              # Configuração global (mocks, matchers)
├── content.test.js       # Testes da camada de dados (27 testes)
├── security.test.js      # Testes de segurança e LGPD (11 testes)
├── seo.test.js           # Testes de SEO e acessibilidade (24 testes)
└── routing.test.js       # Testes de roteamento (12 testes)
```

### 7.2 Cobertura por Categoria

| Suíte de Testes | Testes | Categoria | RFs/RNFs Cobertos |
|----------------|--------|-----------|-------------------|
| `content.test.js` | 27 | Dados & Integridade | RF-001 a RF-008, RN-001 |
| `security.test.js` | 11 | Segurança & LGPD | RNF-005 a RNF-009 |
| `seo.test.js` | 24 | SEO & Acessibilidade | RNF-003, RNF-004 |
| `routing.test.js` | 12 | Navegação & Performance | RF-009, RF-011, RNF-001, RNF-002 |
| **Total** | **74** | | |

### 7.3 Comandos

```bash
npm test               # Executar todos os testes
npm run test:watch     # Modo watch (desenvolvimento)
npm run test:coverage  # Gerar relatório de cobertura
```

---

## 8. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────┐
│                    VERCEL (CDN)                      │
│              HTTPS + Edge Network                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │   React SPA  │  │  Static      │  │  API       │  │
│  │   (Vite)     │  │  Assets      │  │  Routes    │  │
│  │              │  │  (images,    │  │  (vercel   │  │
│  │  App.jsx     │  │   fonts)     │  │   .json)   │  │
│  └──────┬───────┘  └──────────────┘  └───────────┘  │
│         │                                            │
│  ┌──────┴───────────────────────────────────────┐    │
│  │              React Router DOM                 │    │
│  │  Home (/) │ Links │ CV │ HDB Hub │ Fametro   │    │
│  └──────────────────────┬────────────────────────┘   │
│                         │                             │
├─────────────────────────┼────────────────────────────┤
│         SERVIÇOS EXTERNOS                            │
│  ┌──────────────┐  ┌────┴────────┐  ┌────────────┐  │
│  │ FormSubmit.co│  │  Firebase   │  │  WhatsApp  │  │
│  │ (Contato)   │  │  Firestore  │  │  API       │  │
│  │             │  │  (Rankings) │  │            │  │
│  └──────────────┘  └─────────────┘  └────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## 9. Glossário

| Termo | Definição |
|-------|-----------|
| **SPA** | Single Page Application — aplicação de página única |
| **Code Splitting** | Divisão do bundle em chunks carregados sob demanda |
| **LGPD** | Lei Geral de Proteção de Dados (Lei 13.709/2018) |
| **PII** | Personally Identifiable Information (Dados Pessoais Identificáveis) |
| **LCP** | Largest Contentful Paint — métrica de performance web |
| **XSS** | Cross-Site Scripting — tipo de vulnerabilidade de injeção |
| **BaaS** | Backend as a Service — backend gerenciado (Firebase) |
| **TDD** | Test-Driven Development — desenvolvimento orientado a testes |

---

## 10. Histórico de Versões

| Versão | Data | Alterações |
|--------|------|-----------|
| 1.0 | Abr/2026 | Versão inicial do portfolio |
| 2.0 | Mai/2026 | Remoção AD Academy One, integração AD Academy Net, refatoração de rankings, testes unitários, documentação de requisitos, conformidade LGPD |

---

> **Documento gerado e mantido como parte da documentação técnica do projeto.**  
> **Próxima revisão:** Julho/2026
