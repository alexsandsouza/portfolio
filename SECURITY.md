# 🛡️ Política de Segurança

## Versões Suportadas

| Versão | Suportada |
|--------|-----------|
| main (produção) | ✅ |
| branches de feature | ❌ |

## Reportando Vulnerabilidades

Se você encontrou uma vulnerabilidade de segurança neste projeto, **NÃO** abra uma issue pública.

Em vez disso, envie um relatório privado para:

- 📧 **Email:** [entre em contato via LinkedIn](https://www.linkedin.com/in/alexsander-souza-farias/)
- 🔒 **GitHub Security Advisories:** Use a aba "Security" deste repositório

### O que incluir no relatório:

1. Descrição detalhada da vulnerabilidade
2. Passos para reproduzir
3. Impacto potencial
4. Sugestão de correção (se possível)

## Práticas de Segurança Adotadas

### ✅ Variáveis de Ambiente
- Todas as credenciais sensíveis (Firebase, APIs) são armazenadas em variáveis de ambiente (`.env`)
- Arquivos `.env` estão listados no `.gitignore` e **nunca** são commitados

### ✅ Dependências
- Dependências são auditadas periodicamente com `npm audit`
- Atualizações de segurança são aplicadas regularmente

### ✅ Firebase Security Rules
- Regras de segurança do Firestore restringem acesso conforme necessidade
- Operações de escrita são validadas no servidor

### ✅ Deploy Seguro
- Deploy automatizado via Vercel com variáveis de ambiente configuradas no painel
- HTTPS forçado em produção
- Headers de segurança configurados

## Boas Práticas para Contribuidores

1. **Nunca** commite credenciais, tokens ou chaves de API no código
2. Use **variáveis de ambiente** para toda configuração sensível
3. Mantenha dependências atualizadas
4. Revise o código antes de fazer merge em `main`
