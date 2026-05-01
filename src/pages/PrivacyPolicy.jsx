import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * PrivacyPolicy — Página de Política de Privacidade
 * 
 * Conformidade com a LGPD (Lei 13.709/2018)
 * Artigos: 6º, 7º, 9º, 11, 18, 46
 */
const PrivacyPolicy = () => {
    usePageTitle('Política de Privacidade');

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-color)',
            color: 'var(--text-primary)',
            padding: '6rem 1.5rem 4rem',
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
            }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <a href="/" style={{
                        color: 'var(--primary-color)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '1.5rem',
                    }}>
                        ← Voltar ao Portfolio
                    </a>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        background: 'linear-gradient(135deg, #7c6ffa, #f43f8e)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.5rem',
                    }}>
                        Política de Privacidade
                    </h1>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                    }}>
                        Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div style={{
                    lineHeight: 1.8,
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                }}>
                    <Section title="1. Informações Gerais">
                        <p>
                            Esta Política de Privacidade descreve como o site <strong style={{ color: 'var(--text-primary)' }}>alexsanderfarias.vercel.app</strong> ("Portfolio"),
                            de titularidade de <strong style={{ color: 'var(--text-primary)' }}>Prof. Alexsander Farias</strong>, coleta, utiliza e protege
                            as informações pessoais dos visitantes, em conformidade com a <strong style={{ color: 'var(--text-primary)' }}>Lei Geral de Proteção de
                            Dados Pessoais (LGPD — Lei nº 13.709/2018)</strong>.
                        </p>
                    </Section>

                    <Section title="2. Dados Coletados">
                        <p>Coletamos apenas os dados estritamente necessários:</p>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Dado</th>
                                    <th style={thStyle}>Finalidade</th>
                                    <th style={thStyle}>Base Legal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={tdStyle}>Nome e Email (Formulário de Contato)</td>
                                    <td style={tdStyle}>Responder solicitações profissionais</td>
                                    <td style={tdStyle}>Legítimo Interesse (Art. 7º, IX)</td>
                                </tr>
                                <tr>
                                    <td style={tdStyle}>Nome e Nota (Rankings Acadêmicos)</td>
                                    <td style={tdStyle}>Exibir classificação em atividades educacionais</td>
                                    <td style={tdStyle}>Execução de Contrato (relação professor-aluno)</td>
                                </tr>
                                <tr>
                                    <td style={tdStyle}>Preferências de cookies</td>
                                    <td style={tdStyle}>Salvar escolha do banner de consentimento</td>
                                    <td style={tdStyle}>Consentimento (Art. 7º, I)</td>
                                </tr>
                            </tbody>
                        </table>
                    </Section>

                    <Section title="3. Cookies e Tecnologias">
                        <p>Este site utiliza:</p>
                        <ul style={ulStyle}>
                            <li><strong style={{ color: 'var(--text-primary)' }}>localStorage</strong> — Para armazenar preferência de tema (claro/escuro), consentimento de cookies e progresso em atividades educacionais. Nenhum dado é enviado a terceiros.</li>
                            <li><strong style={{ color: 'var(--text-primary)' }}>Firebase Firestore</strong> — Para rankings de atividades acadêmicas. Os dados são armazenados em servidores do Google Cloud com criptografia em trânsito e em repouso.</li>
                            <li><strong style={{ color: 'var(--text-primary)' }}>FormSubmit.co</strong> — Para processamento do formulário de contato. Os dados são encaminhados por email e não são persistidos em banco de dados.</li>
                        </ul>
                    </Section>

                    <Section title="4. Compartilhamento de Dados">
                        <p>
                            <strong style={{ color: 'var(--text-primary)' }}>Não vendemos, alugamos ou compartilhamos</strong> seus dados pessoais com terceiros para fins de marketing.
                            Os dados são compartilhados apenas com os serviços essenciais listados acima (Firebase, FormSubmit.co), nos limites das suas respectivas políticas de privacidade.
                        </p>
                    </Section>

                    <Section title="5. Segurança dos Dados">
                        <p>Adotamos as seguintes medidas de proteção (Art. 46, LGPD):</p>
                        <ul style={ulStyle}>
                            <li>Comunicação criptografada via HTTPS (TLS 1.3)</li>
                            <li>Proteção contra XSS e clickjacking via security headers</li>
                            <li>Variáveis de ambiente para credenciais (não hardcoded)</li>
                            <li>Firestore Security Rules para controle de acesso</li>
                            <li>Links externos com <code style={codeStyle}>rel="noopener noreferrer"</code></li>
                        </ul>
                    </Section>

                    <Section title="6. Direitos do Titular (Art. 18, LGPD)">
                        <p>Você tem direito a:</p>
                        <ul style={ulStyle}>
                            <li>✅ Confirmação da existência de tratamento</li>
                            <li>✅ Acesso aos seus dados pessoais</li>
                            <li>✅ Correção de dados incompletos ou desatualizados</li>
                            <li>✅ Eliminação de dados desnecessários</li>
                            <li>✅ Revogação do consentimento a qualquer momento</li>
                            <li>✅ Oposição ao tratamento</li>
                        </ul>
                    </Section>

                    <Section title="7. Como Exercer Seus Direitos">
                        <p>
                            Para exercer qualquer um dos direitos acima, entre em contato pelo email:{' '}
                            <a href="mailto:alexsandfarias@gmail.com" style={{ color: 'var(--primary-color)' }}>
                                alexsandfarias@gmail.com
                            </a>
                        </p>
                        <p>
                            Responderemos sua solicitação em até <strong style={{ color: 'var(--text-primary)' }}>15 dias úteis</strong>, conforme previsto na legislação.
                        </p>
                    </Section>

                    <Section title="8. Retenção de Dados">
                        <p>
                            Dados do formulário de contato não são armazenados — são enviados diretamente ao email do titular do site.
                            Dados de rankings acadêmicos são mantidos enquanto o semestre letivo estiver ativo.
                            A preferência de cookies é armazenada localmente no seu navegador e pode ser apagada a qualquer momento limpando os dados do site.
                        </p>
                    </Section>

                    <Section title="9. Alterações nesta Política">
                        <p>
                            Esta política pode ser atualizada periodicamente. Recomendamos revisá-la regularmente.
                            A data de última atualização consta no topo desta página.
                        </p>
                    </Section>
                </div>

                {/* Footer da página */}
                <div style={{
                    marginTop: '3rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                }}>
                    <p>© {new Date().getFullYear()} Prof. Alexsander Farias — Todos os direitos reservados.</p>
                    <a href="/" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.85rem' }}>
                        ← Voltar ao Portfolio
                    </a>
                </div>
            </div>
        </div>
    );
};

// Componente auxiliar para seções
const Section = ({ title, children }) => (
    <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: '0.75rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-color)',
        }}>
            {title}
        </h2>
        {children}
    </div>
);

// Estilos inline para tabela
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '0.75rem',
    fontSize: '0.85rem',
};
const thStyle = {
    textAlign: 'left',
    padding: '10px 12px',
    background: 'rgba(124, 111, 250, 0.1)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    borderBottom: '1px solid var(--border-color)',
};
const tdStyle = {
    padding: '10px 12px',
    borderBottom: '1px solid var(--border-color)',
    verticalAlign: 'top',
};
const ulStyle = {
    paddingLeft: '1.5rem',
    marginTop: '0.5rem',
};
const codeStyle = {
    background: 'rgba(124, 111, 250, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: 'monospace',
};

export default PrivacyPolicy;
