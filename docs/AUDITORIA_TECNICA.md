# Auditoria Técnica Completa — Portfólio Profissional Prof. Alexsander Farias

## Resumo Executivo
Esta auditoria avaliou a base de código do portfólio profissional do Prof. Alexsander Farias, com foco em arquitetura, qualidade de código, performance, acessibilidade, segurança e SEO. O projeto é um ecossistema React estruturado com Vite, possuindo integrações complexas de simulação acadêmica e testes comportamentais que atendem centenas de alunos das disciplinas ministradas pelo professor e participantes de programas como o Hackers do Bem. A auditoria identificou vulnerabilidades de segurança, problemas de layout shift, corte de texto no Hero, falta de conformidade de acessibilidade WCAG e organização de arquivos que serão corrigidos neste ciclo de refatoração.

---

## Stack Identificada
- **Core**: React 19.2.0, React DOM 19.2.0, React Router DOM 7.12.0
- **Build System**: Vite 7.2.4, Vitest 4.1.5 (JSDOM environment)
- **Banco de Dados & Integrações**: Firebase 12.7.0 (Firestore & Analytics)
- **Bibliotecas Visuais / Efeitos**: Lucide React 0.562.0, Canvas Confetti 1.9.4, React Confetti 6.4.0
- **Styling**: Vanilla CSS (`src/index.css`, `src/App.css`, component-level inline styles)

---

## Estrutura Atual do Projeto
A estrutura de arquivos do projeto se encontra em estado misto, com arquivos de infraestrutura e utilitários na raiz, além de testes unitários localizados dentro da pasta `src/`:
- **Scripts na raiz**: `extract_all.js`, `extract_pdf.js`, `read-pdfs.cjs`, `read-pdfs.js`, `update_css.cjs`.
- **Arquivos de log/temporários na raiz**: `vercel_ls.txt`, `vercel_projects.txt`.
- **Arquivos de teste**: Localizados sob `src/test/`, misturados aos fontes da aplicação.
- **Dados e Simulações**: Misturados com ativos estáticos na raiz e dentro de `public/`.

---

## Diagnóstico Geral de Problemas por Prioridade

### P0 — Crítico (Segurança e Integridade do Sistema)
1. **Regras Incompletas do Firestore**:
   - **Impacto**: Alta vulnerabilidade de segurança. A coleção `feedbacks` usada no site (em `Feedback.jsx` e `Testimonials.jsx`) não possui nenhuma regra cadastrada no `firestore.rules`.
   - **Risco**: Escritas e leituras de feedback podem falhar em produção ou estar vulneráveis, e a coleção `perfil_comportamental` permite gravação irrestrita (`allow read, create: if true`) sem checagem de tipos ou sanitização.
   - **Arquivos envolvidos**: [firestore.rules](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/firestore.rules)
   - **Solução recomendada**: Configurar regras específicas com validação de esquema de dados para `feedbacks` e `perfil_comportamental` no `firestore.rules`.
2. **Exposição de Credenciais Firebase em Arquivos Estáticos**:
   - **Impacto**: Chaves e IDs do projeto Firebase estão declarados diretamente no código-fonte das páginas estáticas do diretório `public/`. Embora sejam chaves públicas de cliente, sua exposição facilita o spam no banco de dados.
   - **Arquivos envolvidos**: [perfil-comportamental.html](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/public/fametro/perfil-comportamental.html), [perfil-dashboard.html](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/public/fametro/perfil-dashboard.html)
   - **Solução recomendada**: Enrijecer as regras do Firestore para aceitar apenas documentos estruturados corretamente, minimizando o risco de gravação de lixo eletrônico.

### P1 — Alta Prioridade (UX/UI, Responsividade e Performance)
1. **Efeito Typewriter Incompleto (Corte de Texto e Layout Shift)**:
   - **Impacto**: O cargo do professor no Hero aparece cortado como "Professor Univ". A animação recalcula dinamicamente a largura do contêiner a cada caractere digitado, provocando oscilações visuais constantes na largura da página (layout shift).
   - **Risco**: Má experiência de usabilidade visual e impacto negativo na pontuação do CLS (Cumulative Layout Shift).
   - **Arquivos envolvidos**: [Hero.jsx](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/src/sections/Hero.jsx)
   - **Solução recomendada**: Aumentar a largura reservada ao texto animado no CSS, definindo um espaço fixo correspondente ao maior termo ("Avaliador de TCC e Projetos"). Integrar suporte à acessibilidade auditiva e desativar animações sob `@media (prefers-reduced-motion: reduce)`.
2. **Arquivos de Teste Misturados na Origem (`src/`)**:
   - **Impacto**: Falta de separação de conceitos. Dificulta a manutenção e infla o escopo de análise de código da aplicação.
   - **Arquivos envolvidos**: Pasta [src/test](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/src/test)
   - **Solução recomendada**: Mover a pasta `src/test/` para a raiz como `tests/` e configurar o arquivo `vite.config.js` para referenciar o caminho de testes adequado.
3. **Falta de Acessibilidade WCAG 2.2 AA nos Menus e Navegação**:
   - **Impacto**: O menu de navegação mobile e os botões flutuantes carecem de suporte a leitores de tela e focabilidade correta para navegação por teclado.
   - **Risco**: Bloqueio de navegação para pessoas com deficiências motoras e visuais.
   - **Arquivos envolvidos**: [Navbar.jsx](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/src/components/Navbar.jsx), [WhatsAppButton.jsx](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/src/components/WhatsAppButton.jsx)
   - **Solução recomendada**: Injetar tags `aria-label`, `aria-expanded`, gerenciar os estados de foco e implementar skip links.
4. **Nomenclatura Ambígua de Menu ("DNA")**:
   - **Impacto**: O link "DNA" no cabeçalho não explicita claramente ao visitante o teor da seção ("DNA Comportamental / Soft Skills").
   - **Arquivos envolvidos**: [Navbar.jsx](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/src/components/Navbar.jsx)
   - **Solução recomendada**: Renomear a âncora para "Diferenciais" ou "Soft Skills", garantindo fácil assimilação e mantendo o contexto pedagógico.

### P2 — Média Prioridade (Arquitetura e Organização)
1. **Scripts Soltos na Raiz do Projeto**:
   - **Impacto**: Bagunça estrutural e potencial execução indevida por outros desenvolvedores.
   - **Arquivos envolvidos**: `extract_all.js`, `extract_pdf.js`, `read-pdfs.cjs`, `read-pdfs.js`, `update_css.cjs`
   - **Solução recomendada**: Mover esses utilitários para uma pasta `scripts/` dedicada e atualizar documentação de uso no README.
2. **Textos de Lançamento/Build Soltos (`vercel_ls.txt`, `vercel_projects.txt`)**:
   - **Impacto**: Poluição visual no diretório raiz do repositório Git.
   - **Solução recomendada**: Excluir ou incluir no `.gitignore`.
3. **Otimização de Imagens do Hero (LCP)**:
   - **Impacto**: A imagem principal do portfólio no Hero (`/Foto_Perfil_Round.png`) precisa de maior prioridade de renderização para melhorar a métrica de LCP (Largest Contentful Paint).
   - **Solução recomendada**: Definir explicitamente o atributo `fetchpriority="high"` e assegurar que as extensões de imagem corretas sejam usadas.

### P3 — Melhoria Futura
1. **Migração do Dashboard Acadêmico para Componente React**:
   - **Impacto**: Atualmente, `perfil-dashboard.html` e `perfil-comportamental.html` rodam como arquivos HTML puros copiados para a pasta `public/`. Consolidá-los como rotas dinâmicas no React Router simplificaria a arquitetura.
   - **Solução recomendada**: Planejar para o futuro a incorporação completa dessas páginas em componentes React sob `src/pages/fametro/`.

---

## Plano de Implementação e Esforço

| ID | Correção Proposta | Arquivos Afetados | Nível de Esforço | Ordem |
|----|-------------------|-------------------|------------------|-------|
| 1 | Organização de Diretórios (Mover Testes e Scripts) | `src/test/*`, `*.js` e `*.cjs` da raiz | Baixo (1h) | 1 |
| 2 | Refatoração de Regras do Firestore (`firestore.rules`) | `firestore.rules` | Baixo (1h) | 2 |
| 3 | Ajustes de Layout e Correção do Typewriter no Hero | `src/sections/Hero.jsx` | Médio (2h) | 3 |
| 4 | Otimização WCAG 2.2 AA (Navbar, Menu Mobile, Skip Links, Foco) | `src/components/Navbar.jsx`, `src/index.css` | Médio (2h) | 4 |
| 5 | Correção dos Botões Flutuantes e links de WhatsApp | `src/components/WhatsAppButton.jsx`, `src/components/ThemeToggle.jsx` | Baixo (1h) | 5 |
| 6 | Renomeação e Ajustes de Menu ("DNA" -> "Diferenciais") | `src/components/Navbar.jsx`, `src/sections/BehavioralDiscovery.jsx` | Baixo (0.5h) | 6 |
| 7 | Revisão de Cabeçalhos de Segurança (`vercel.json`) | `vercel.json` | Baixo (0.5h) | 7 |
| 8 | Validação de Build, Lint e Testes Locais | Todo o projeto | Médio (1.5h) | 8 |
