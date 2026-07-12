# Infraestrutura e Deploy — Portfólio Profissional

Esta documentação descreve o fluxo de deploy contínuo, a configuração do servidor da Vercel e o gerenciamento de variáveis de ambiente.

---

## 1. Fluxo de Deploy Contínuo (CI/CD)

O deploy de produção é hospedado na **Vercel** com integração direta ao repositório GitHub do projeto.
- **Branch de Produção**: `main` — Qualquer alteração integrada à branch `main` dispara o build automático e a publicação global na Vercel CDN.
- **Branch de Refatoração**: `refactor/portfolio-profissional` — Usada para homologar melhorias e testes de segurança em ambientes de Preview antes do merge final.

---

## 2. Configurações do `vercel.json`

O arquivo `vercel.json` na raiz gerencia as rotas client-side do React Router e injeta cabeçalhos HTTP de segurança obrigatórios para estar em conformidade com o Lighthouse e com boas práticas de segurança corporativa:

### Roteamento
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
Este bloco garante que qualquer acesso direto a URLs como `/feedback`, `/mentoria` ou `/hackersdobem` seja capturado pelo roteador do React, em vez de retornar erro 404 de página inexistente no servidor.

### Cabeçalhos de Segurança
Os seguintes cabeçalhos HTTP são injetados em todas as requisições:
- **`Strict-Transport-Security`**: Força conexões HTTPS para o domínio e subdomínios por 2 anos (`max-age=63072000`).
- **`X-Frame-Options`**: Definido como `DENY` para mitigar ataques de Clickjacking em iframes de outros sites.
- **`X-Content-Type-Options`**: Definido como `nosniff` para desabilitar a farejagem de conteúdo e evitar execução imprópria de arquivos de mídia.
- **`Referrer-Policy`**: Restringe o envio de informações de navegação a sites externos.
- **`Permissions-Policy`**: Bloqueia acessos desnecessários do navegador à câmera, microfone e geolocalização.

---

## 3. Configuração de Variáveis de Ambiente

Para o projeto conectar com o banco de dados Firebase em desenvolvimento e produção, é essencial configurar as seguintes chaves.

### Chaves do Firebase (`.env`)
No console administrativo da Vercel, as seguintes chaves devem ser registradas sob o escopo de variáveis de ambiente:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

> [!WARNING]
> Nunca versione arquivos `.env`, `.env.local` ou chaves privadas no seu repositório Git. Utilize sempre o arquivo `.env.example` como gabarito.
