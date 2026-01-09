# Fluxo de Trabalho e Segurança do Projeto

Este documento define os padrões para manter a qualidade, segurança e histórico do projeto do portfólio.

## 1. Controle de Versão (Git Strategy)

Adotaremos um fluxo simplificado baseado em *Feature Branch Workflow*:

*   **`main`**: Esta branch contém APENAS código estável e testado. É o código que vai para produção (Vercel).
    *   *Regra*: Nunca trabalhar diretamente na `main` para novas features complexas.
*   **Branches de Funcionalidade (`feat/nome-da-feature`)**: Para criar novas funcionalidades.
    *   Exemplo: `feat/galeria-fotos`, `feat/modo-escuro`.
*   **Branches de Correção (`fix/descrição-erro`)**: Para corrigir bugs.
    *   Exemplo: `fix/ajuste-mobile-navbar`.
*   **Branches de Tarefas (`chore/nome-tarefa`)**: Para tarefas de manutenção que não alteram o código de produção visível.
    *   Exemplo: `chore/atualizar-dependencias`.

## 2. Versionamento Semântico (Tags)

Usaremos **Tags** do Git para marcar pontos estáveis da história do projeto. Isso funciona como nossos "Pontos de Restauração".

Formato: `vX.Y.Z`
*   **X (Major)**: Mudanças grandes, incompatíveis ou reescritas completas (ex: v1.0.0 -> v2.0.0).
*   **Y (Minor)**: Novas funcionalidades que não quebram o que já existe (ex: v1.0.0 -> v1.1.0).
*   **Z (Patch)**: Correções de bugs pequenos (ex: v1.0.0 -> v1.0.1).

**Backup/Rollback**:
Se uma atualização quebrar o site, podemos rodar:
`git checkout v1.0.0` (para ver como estava)
ou reverter a `main` para este ponto.

## 3. Workflow Diário

1.  **Iniciar trabalho**:
    *   `git checkout main`
    *   `git pull origin main` (garantir que está atualizado)
    *   `git checkout -b feat/nova-ideia` (criar ambiente seguro para testar)
2.  **Desenvolver e Testar Localmente**:
    *   Usar `npm run dev` e testar no navegador.
3.  **Salvar (Commit)**:
    *   `git add .`
    *   `git commit -m "feat: implementa nova ideia"`
4.  **Finalizar**:
    *   Ir para a main: `git checkout main`
    *   Mesclar: `git merge feat/nova-ideia`
    *   Subir: `git push origin main`
    *   (Opcional) Criar Tag: `git tag v1.1.0` -> `git push origin v1.1.0`

## 4. Segurança

*   O código está salvo localmente na sua máquina.
*   O código está salvo remotamente no GitHub (backup em nuvem).
*   As Tags servem como snapshots imutáveis de versões que funcionaram.
