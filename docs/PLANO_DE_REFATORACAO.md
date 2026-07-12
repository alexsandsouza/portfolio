# Plano de Refatoração — Portfólio Profissional Prof. Alexsander Farias

Este plano detalha as etapas de implementação para resolver todos os problemas levantados na Auditoria Técnica e os respectivos critérios de validação para garantir a integridade do portfólio profissional em produção.

---

## Etapas de Implementação

### Etapa 1: Reorganização da Arquitetura e Estrutura de Diretórios
1. **Mapeamento de Scripts**: Mover todos os arquivos `.js` e `.cjs` soltos na raiz para uma nova pasta `scripts/` na raiz do projeto (como `extract_all.js`, `extract_pdf.js`, `read-pdfs.cjs`, `read-pdfs.js` e `update_css.cjs`).
2. **Separação de Testes**: Mover o diretório `src/test/` para `tests/` na raiz do projeto.
3. **Mover dados de teste**: Mover a pasta `test/data` para `tests/fixtures/`.
4. **Configuração do Vitest**: Atualizar as referências de arquivos em `vite.config.js` para apontarem para `./tests/setup.js` e incluir/excluir caminhos adequados para os testes.

*Critérios de Validação:*
- Rodar `npm run test` e verificar se a suíte de testes (Vitest) é localizada e passa completamente (todas as 75 asserções).

---

### Etapa 2: Correção de Segurança e Banco de Dados (Firestore e Vercel)
1. **Criação de Regras para `feedbacks`**: Adicionar a validação da coleção `feedbacks` ao arquivo `firestore.rules` com verificação de campos obrigatórios (`name`, `role`, `message`, `permission`, `approved`) e comprimentos máximos.
2. **Refatoração das Regras de `perfil_comportamental`**: Substituir o acesso livre `allow read, create: if true` por validação estrita baseada no esquema dos campos e restrição de atualizações/remoções.
3. **Cabeçalhos de Segurança em `vercel.json`**: Ajustar a diretiva CSP (`Content-Security-Policy`) e outros cabeçalhos de segurança no arquivo `vercel.json` para permitir apenas conexões de origens válidas.

*Critérios de Validação:*
- Rodar o teste de segurança (`npm run test`) e validar se a estrutura do arquivo `firestore.rules` está correta.
- Tentar realizar escritas fraudulentas diretamente no Firestore e verificar a rejeição pelos mecanismos do Firebase.

---

### Etapa 3: Correções Visuais (Hero, Typewriter, Navbar e DNA)
1. **Efeito Typewriter**:
   - Ajustar o componente `Typewriter` em `Hero.jsx` para evitar layout shifts reservando espaço de largura mínimo estável (`min-height` e `width` estáticos nos estilos CSS das tags).
   - Impedir que a animação altere continuamente a largura da página.
   - Adicionar suporte a `prefers-reduced-motion` no CSS e JS para manter o texto estático caso o usuário prefira.
   - Utilizar tags semânticas e ocultar a animação de leitores de tela usando `aria-hidden="true"`, fornecendo um texto estático alternativo acessível (`sr-only`).
2. **Navegação (DNA -> Diferenciais)**:
   - Alterar o texto visível de navegação no cabeçalho e menu de "DNA" para "Diferenciais", mantendo a âncora vinculada à seção de Perfil Comportamental.
3. **Imagem LCP do Hero**:
   - Adicionar o atributo `fetchpriority="high"` na tag `<img>` do perfil no Hero para carregar prioritariamente.

*Critérios de Validação:*
- Verificar visualmente nas ferramentas de desenvolvedor do navegador que não há oscilações no CLS ao recarregar a Hero Section.
- Validar em modo mobile (de 320px a 430px) que o cabeçalho não quebra e que o menu abre e fecha suavemente.

---

### Etapa 4: Acessibilidade (WCAG 2.2 AA) e SEO
1. **Skip Link**: Implementar um link invisível "Pular para o conteúdo principal" no topo da página.
2. **Teclado e Focabilidade**: Assegurar que os botões flutuantes (WhatsApp e Tema) e links de navegação possuam outlines claros (`:focus-visible`) e sejam tabuláveis via teclado.
3. **Gerenciamento de Estados ARIA**: Adicionar `aria-expanded` e `aria-controls` ao botão do menu mobile na Navbar.
4. **JSON-LD**: Revisar o script de dados estruturados em `index.html` para Person e Website e verificar a ausência de informações redundantes ou duplicadas.

*Critérios de Validação:*
- Rodar navegação exclusivamente usando a tecla `Tab` e `Enter` e verificar se é possível navegar em todo o site.
- Inspecionar a página com o leitor de telas.

---

### Etapa 5: Validação Final e Build de Produção
1. **Instalação Limpa**: Rodar `npm ci` para testar integridade das dependências.
2. **Linting**: Rodar `npm run lint` para garantir compatibilidade sintática sem erros.
3. **Build**: Executar `npm run build` e certificar-se de que o bundler Vite compila sem avisos críticos.
4. **Execução Local**: Validar as rotas executando `npm run preview`.
