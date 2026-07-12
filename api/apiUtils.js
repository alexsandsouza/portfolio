/**
 * Utilitários compartilhados para as funções Serverless do backend.
 * Segue os princípios de Clean Code: DRY (Don't Repeat Yourself) e Responsabilidade Única.
 */

/**
 * Define os cabeçalhos CORS padrão para permitir chamadas do frontend.
 * @param {object} res Objeto de resposta HTTP da Vercel
 */
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Envia uma resposta JSON de erro padronizada e registra a falha no console.
 * @param {object} res Objeto de resposta HTTP
 * @param {Error} error Objeto de erro capturado
 * @param {string} customMessage Mensagem customizada para o cliente
 * @param {number} statusCode Código de status HTTP (default: 500)
 */
export function handleError(res, error, customMessage = 'Erro interno no servidor.', statusCode = 500) {
  console.error(`[API ERROR] ${customMessage}:`, error);
  return res.status(statusCode).json({
    error: customMessage,
    details: error.message || String(error)
  });
}
