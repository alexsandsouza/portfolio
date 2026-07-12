# Diretrizes de Segurança e LGPD — Portfólio Profissional

Esta documentação resume as auditorias de segurança aplicadas ao portfólio profissional e as regras de controle de privacidade LGPD adotadas.

---

## 1. Segurança do Banco de Dados (Firestore Security Rules)

O portfólio restringe as permissões de acesso às tabelas do Firebase aplicando a regra de **privilégio mínimo**:

- **Validação de Tipos e Limites**: Qualquer gravação enviada às coleções (`fametro_ranking`, `perfil_comportamental`, `feedbacks`) passa por uma verificação no nível do servidor (regras do Firestore) antes de ser aceita.
- **Campos Obrigatórios**: O banco de dados rejeita automaticamente documentos que não contenham todos os campos especificados.
- **Bloqueio de Modificações**: As operações de atualização (`update`) e exclusão (`delete`) são bloqueadas para clientes públicos, evitando adulterações fraudulentas de pontuações de alunos e exclusão de feedbacks.

Consulte o arquivo completo de regras em [firestore.rules](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/firestore.rules).

---

## 2. Conformidade com a LGPD (Lei Geral de Proteção de Dados)

Em atendimento às normas da LGPD brasileiras:
- **Ausência de Dados Pessoais Sensíveis**: O portfólio não armazena nem processa dados como CPF, RG, endereços residenciais ou dados de pagamento.
- **Dados Profissionais**: As informações mantidas no banco de dados para rankings e avaliações limitam-se ao nome fornecido voluntariamente pelo aluno para vinculação às pontuações escolares.
- **Formulário de Contato Acessível**: O formulário de contato do site (em [Contact.jsx](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/src/sections/Contact.jsx)) é integrado diretamente com um serviço de e-mail externo (FormSubmit), garantindo que as mensagens sejam entregues à caixa de entrada do profissional sem armazenamento permanente ou cache no banco de dados local da aplicação.
- **Políticas de Consentimento de Cookies**: O site exibe um modal de consentimento ([CookieConsent.jsx](file:///c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/src/components/CookieConsent.jsx)) informando claramente quais dados de navegação são processados e permitindo a aceitação explícita por parte do usuário.

---

## 3. Prevenção a Vulnerabilidades Web (OWASP Top 10)

- **Sanitização de XSS (Cross-Site Scripting)**: A aplicação React escapa nativamente todas as renderizações de variáveis estáticas e dinâmicas nas páginas. O uso de `dangerouslySetInnerHTML` é evitado, e os inputs de texto utilizam validação rigorosa de formulários.
- **Links Externos Seguros**: Todos os redirecionamentos para sites externos utilizam o atributo de segurança `rel="noopener noreferrer"`. Isso evita que páginas maliciosas de destino tomem controle ou acessem o objeto `window.opener` da nossa SPA.
- **Cabeçalhos de Segurança da Vercel**: A configuração de proteção de tráfego HTTPS forçado e bloqueio de clickjacking mitigam ataques man-in-the-middle e carregamento indevido em frames.
