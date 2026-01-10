# 🚀 Novas Funcionalidades do Portfólio

Este documento resume as funcionalidades interativas e gamificadas implementadas no projeto.

## 1. Jornada Interativa (Gamificação)
Uma seção onde o visitante completa passos (checklist) para liberar recompensas.
- **Progresso**: Salvo automaticamente no `localStorage` do navegador.
- **Visual**: Barra de progresso dinâmica e animação de confetes ao atingir 100%.
- **Recompensa**: Libera o acesso ao "Desafio Final".

## 2. Desafio Final: Escape da Forca (Quiz)
Um jogo educativo para validar conhecimento antes de entregar o material rico (Ebook).
- **Mecânica**: 5 perguntas de múltipla escolha.
- **Regra**: Máximo de 6 erros (desenho da forca).
- **Cronômetro**: Conta o tempo de resolução em segundos.
- **Vitória**: Libera o download do Ebook e o registro no Ranking.

## 3. Hall da Fama (Ranking)
Sistema de leaderboard global conectado ao Firebase.
- **Exibição**: Top 10 usuários mais rápidos.
- **Atualização**: Tempo real (`onSnapshot` do Firestore).
- **Destaque**: Ícones de troféu e medalhas para o Top 3.

## 4. Sistema de Feedback Real
Mural de depoimentos que permite aos visitantes deixarem mensagens.
- **Envio**: Formulário direto no site.
- **Exibição**: Carrossel misturando depoimentos estáticos (fixos) e dinâmicos (do banco de dados).

---

## 🛠️ Tecnologias & Estrutura de Dados (Firebase)

### Coleção: `feedbacks`
Armazena os depoimentos dos usuários.
- `name` (string): Nome do usuário.
- `role` (string): Cargo/Profissão.
- `quote` (string): A mensagem.
- `rating` (number): Nota (1-5).
- `approved` (boolean): Se `true`, aparece no site. (Padrão: true).
- `createdAt`: Timestamp.

### Coleção: `quiz_results`
Armazena os recordes do jogo da forca.
- `name` (string): Nome do jogador.
- `timeSeconds` (number): Tempo total de resolução.
- `createdAt`: Timestamp.

---
*Documentação gerada automaticamente pela Antigravity.*
