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
Lista dos tempos do desafio da forca.
- **Exibição**: Top 10 mais rápidos.
- **Gravação**: O nome entra na hora neste navegador e também é enviado ao Firestore quando a coleção `quiz_results` aceita a inclusão.
- **Prêmio**: O ebook baixa em seguida, a partir do PDF publicado no site.

## 4. Blog e newsletter
- **Eventos**: Arquivo em `/blog`, com a primeira publicação da Imersão IA FAMETRO (2 de outubro de 2026).
- **Newsletter**: O filtro Newsletter abre a série [Além do Algoritmo](https://www.linkedin.com/newsletters/al%C3%A9m-do-algoritmo-7517955548621811712) no LinkedIn.

## 5. Contato
O formulário da home envia nome, e-mail e mensagem para `alexsandfarias@gmail.com` pelo FormSubmit. O aviso de sucesso só aparece quando o envio é aceito.

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
Site publicado: https://alexsanderfarias.vercel.app
