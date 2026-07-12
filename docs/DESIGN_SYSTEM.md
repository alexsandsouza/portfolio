# Design System — Portfólio Profissional

Esta documentação detalha a identidade visual, tipografia, escala de espaçamentos e as propriedades CSS personalizadas utilizadas na aplicação.

---

## 1. Identidade Visual e Paleta de Cores

O portfólio emprega um tema tecnológico escuro (default) de alta sofisticação com suporte nativo a um tema claro sutil baseado em contrastes suaves.

### Cores Base (CSS Custom Properties)

```css
:root {
  /* --- Cores Primárias --- */
  --primary-color: #7c6ffa;    /* Vivid Violet (Cor de destaque e botões primários) */
  --secondary-color: #f43f8e;  /* Neon Pink (Detalhes visuais secundários e gradientes) */
  --accent-color: #00d4ff;     /* Electric Cyan (Cores de links, foco e cursores) */

  /* --- Superfícies e Fundos (Modo Escuro) --- */
  --bg-color: #080c1a;         /* Fundo global escuro */
  --bg-secondary: #060910;     /* Fundo alternado de seções */
  --surface-color: #111827;    /* Superfícies de painéis e modais */
  --card-bg: rgba(255, 255, 255, 0.04);
  --card-border: rgba(124, 111, 250, 0.12);
  --border-color: rgba(255, 255, 255, 0.1);

  /* --- Tipografia --- */
  --text-primary: #f8fafc;     /* Cor de leitura principal */
  --text-secondary: #94a3b8;   /* Textos auxiliares e descrições */
  --text-heading: #ffffff;     /* Títulos e destaques */
}
```

### Sobrescrita de Tema Claro (`[data-theme="light"]`)

```css
[data-theme="light"] {
  --bg-color: #f8fafc;
  --bg-secondary: #f1f5f9;
  --surface-color: #e2e8f0;
  
  --card-bg: rgba(255, 255, 255, 0.85);
  --card-border: rgba(148, 163, 184, 0.25);
  --card-shadow: 0 4px 20px rgba(100, 116, 139, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  --border-color: rgba(148, 163, 184, 0.25);

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-heading: #1e293b;
}
```

---

## 2. Tipografia

A hierarquia tipográfica utiliza fontes do Google Fonts otimizadas com fallback para fontes do sistema:
- **Títulos e Cabeçalhos (`--font-heading`)**: `'Plus Jakarta Sans', sans-serif` — Geometria moderna e cantos amigáveis que conferem autoridade.
- **Corpo e Leitura (`--font-body`)**: `'Inter', sans-serif` — Leitura altamente legível em telas retroiluminadas de qualquer resolução.

---

## 3. Escala de Espaçamentos (Spacing Tokens)

Utilizados de forma estrita para evitar valores mágicos dispersos nas folhas de estilo:
- **`--space-xs` (0.5rem - 8px)**: Pequenas margens de rótulos e espaçamentos internos de badges.
- **`--space-sm` (1rem - 16px)**: Margens internas de inputs, espaçamento interno de cards pequenos.
- **`--space-md` (2rem - 32px)**: Grid gaps padrão e padding de cards grandes.
- **`--space-lg` (4rem - 64px)**: Gaps entre seções grandes na visualização desktop.
- **`--space-xl` (6rem - 96px)**: Margens inferiores de cabeçalhos de seções principais.

---

## 4. Elementos Visuais e Responsividade
- **Raios de Bordas (`border-radius`)**:
  - `8px` para tags e pequenos ícones.
  - `12px` para inputs e botões de formulários.
  - `20px` para cards de simulações e seções de projetos.
- **Transições (`transition`)**: Padrão de velocidade `all 0.3s ease` para transições de hover e carregamento de tema sutil.
- **Grids e Flexbox**: Responsividade adaptativa via layouts fluidos com `clamp()`, `minmax()`, `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` garantindo exibição ideal de 320px até 1920px de largura de tela.
