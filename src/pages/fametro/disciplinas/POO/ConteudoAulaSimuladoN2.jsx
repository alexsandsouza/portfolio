import { useState } from "react";
import { 
  X, BookOpen, Cpu, Code, Lightbulb, 
  CheckCircle2, XCircle, AlertCircle, HelpCircle, 
  ChevronLeft, ChevronRight, Play, BookOpenCheck 
} from "lucide-react";

const theme = {
  bg: "#070B14",
  surface: "#0F172A",
  surfaceLight: "rgba(30, 41, 59, 0.5)",
  border: "rgba(255, 255, 255, 0.08)",
  borderActive: "#3B82F6",
  accent: "#3B82F6",
  accentGlow: "rgba(59, 130, 246, 0.15)",
  text: "#CBD5E1",
  textMuted: "#94A3B8",
  white: "#FFFFFF",
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.15)",
  danger: "#EF4444",
  dangerBg: "rgba(239, 68, 68, 0.15)",
  warning: "#FBBF24",
  warningBg: "rgba(251, 191, 36, 0.15)"
};

export default function ConteudoAulaSimuladoN2({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0); // 0: Analogia, 1: Problema, 2: Código, 3: Quiz
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [tabIdx]: 'A' | 'B' | ... }
  const [showFeedback, setShowFeedback] = useState({}); // { [tabIdx]: true | false }

  if (!isOpen) return null;

  const trilhas = [
    {
      title: "1. Concorrência e Interfaces Gráficas (Java Swing)",
      icon: <Cpu size={18} />,
      themeColor: theme.accent,
      slides: [
        {
          type: "concept",
          title: "🌟 O Conceito: A Lanchonete de 1 Funcionário",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", margin: 0 }}>
                Imagine uma lanchonete muito simples onde há **apenas um único funcionário** no balcão que faz tudo: anota o pedido, cobra o cliente, limpa as mesas e entrega o troco. Esse funcionário é a **EDT (Event Dispatch Thread)** no Java, a thread encarregada exclusiva de desenhar a interface e capturar seus cliques.
              </p>
              <div style={{
                background: "rgba(59, 130, 246, 0.05)",
                border: `1px solid ${theme.borderActive}30`,
                borderRadius: "12px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                <strong style={{ color: theme.accent, fontSize: "0.9rem" }}>O que acontece se ele deixar o balcão?</strong>
                <p style={{ fontSize: "0.9rem", color: theme.text, margin: 0, lineHeight: "1.5" }}>
                  Se um cliente pede um hambúrguer que demora 8 minutos para fritar (como buscar 5.000 veículos na internet), e o caixa resolve ir pessoalmente para a cozinha fritar o hambúrguer, o balcão fica abandonado! A fila acumula, os clientes gritam e ninguém consegue mexer na lanchonete.
                </p>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                <strong>A Solução na vida real:</strong> O caixa deve continuar atendendo no balcão e simplesmente gritar o pedido para um **ajudante de cozinha (Thread de Background)** na chapa. Quando o hambúrguer estiver pronto, o ajudante avisa o caixa, que entrega o prato de forma segura ao cliente.
              </p>
            </div>
          )
        },
        {
          type: "problem",
          title: "⚠️ O Problema: O Congelamento da Tela",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", margin: 0 }}>
                No Java Swing, toda vez que você clica em um botão, o código dentro daquele clique roda na **thread principal da interface (EDT)**. Se você colocar ali dentro uma tarefa lenta (como buscar dados na internet ou ler um arquivo pesado), você está mandando o caixa ir para a cozinha.
              </p>
              <div style={{
                background: "rgba(239, 68, 68, 0.05)",
                border: `1px solid ${theme.danger}30`,
                borderRadius: "12px",
                padding: "1rem"
              }}>
                <strong style={{ color: theme.danger, fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>Resultado no Computador:</strong>
                <p style={{ fontSize: "0.9rem", color: theme.text, margin: 0, lineHeight: "1.5" }}>
                  O aplicativo congela inteiramente. O usuário tenta maximizar, redimensionar ou mover a janela e ela simplesmente não responde a nada, exibindo aquela barra de carregamento infinita ou a mensagem "Não Respondendo" do sistema operacional.
                </p>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                <strong>Por que ocorre?</strong> Porque a EDT está ocupada processando os bytes da internet e não tem tempo de desenhar os cliques ou os movimentos da tela do usuário.
              </p>
            </div>
          )
        },
        {
          type: "code",
          title: "🚀 A Solução: SwingWorker (Contratando o Ajudante)",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "0.9rem", color: theme.textMuted, margin: 0 }}>
                Veja a diferença entre o código problemático e a solução correta usando a classe <code>SwingWorker</code>:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${theme.danger}30`, borderRadius: "8px", padding: "10px" }}>
                  <div style={{ fontSize: "0.75rem", color: theme.danger, fontWeight: 700, marginBottom: "4px" }}>❌ CÓDIGO INCORRETO (Trava a Tela):</div>
                  <pre style={{ margin: 0, fontSize: "0.75rem", fontFamily: "monospace", color: "#FDA4AF" }}>
{`btn.addActionListener(e -> {
    // ESTADO DE PERIGO: Executa a busca demorada diretamente no balcão da interface.
    List<Dados> dados = api.buscarNaWeb(); // Demora 8 segundos
    tabela.atualizar(dados); // A tela fica travada durante esse tempo!
});`}
                  </pre>
                </div>

                <div style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${theme.success}30`, borderRadius: "8px", padding: "10px" }}>
                  <div style={{ fontSize: "0.75rem", color: theme.success, fontWeight: 700, marginBottom: "4px" }}>✅ CÓDIGO CORRETO (Interface Livre):</div>
                  <pre style={{ margin: 0, fontSize: "0.75rem", fontFamily: "monospace", color: "#A7F3D0" }}>
{`btn.addActionListener(e -> {
    // Criamos um SwingWorker (Nosso ajudante de cozinha)
    new SwingWorker<List<Dados>, Void>() {
        @Override
        protected List<Dados> doInBackground() {
            // RODA EM SEGUNDO PLANO: O ajudante cozinha (busca na web) sem travar a interface!
            return api.buscarNaWeb(); 
        }

        @Override
        protected void done() {
            try {
                // RODA NA EDT (Caixa recebe o prato pronto e entrega de forma segura ao cliente)
                List<Dados> dados = get(); // Pega o resultado da busca
                tabela.atualizar(dados); // Desenha na tela com segurança
            } catch (Exception ex) { ex.printStackTrace(); }
        }
    }.execute(); // Inicia o trabalho do ajudante!
});`}
                  </pre>
                </div>
              </div>
            </div>
          )
        },
        {
          type: "quiz",
          title: "🎯 Desafio Rápido de Fixação",
          quiz: {
            question: "Para que serve o método doInBackground() do SwingWorker?",
            options: [
              { char: "A", text: "Para desenhar e renderizar novos botões na interface gráfica com segurança.", correct: false },
              { char: "B", text: "Para executar tarefas demoradas (como rede ou banco de dados) em segundo plano, sem ocupar a thread principal da tela (EDT).", correct: true },
              { char: "C", text: "Para apagar a memória RAM do computador caso a interface gráfica trave.", correct: false }
            ],
            explanation: "Exatamente! O doInBackground() é o método onde colocamos o processamento pesado de background. Ele é executado por uma thread auxiliar (fora da EDT), o que mantém o aplicativo totalmente responsivo a cliques e movimentos enquanto carrega."
          }
        }
      ]
    },
    {
      title: "2. Princípios SOLID (SRP & DIP)",
      icon: <LayersIcon size={18} />,
      themeColor: "#8B5CF6",
      slides: [
        {
          type: "concept",
          title: "🌟 O Conceito: O Funcionário Severino 'Faz-Tudo'",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", margin: 0 }}>
                Imagine que você gerencia uma lanchonete e contrata um único funcionário, o Severino. Ele limpa o banheiro, cozinha o hambúrguer, faz a contabilidade da empresa e conserta a rede elétrica. Isso parece econômico, mas é um grande risco!
              </p>
              <div style={{
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                borderRadius: "12px",
                padding: "1rem"
              }}>
                <strong style={{ color: "#A78BFA", fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>Qual o risco de concentrar tudo nele?</strong>
                <ul style={{ fontSize: "0.85rem", color: theme.text, margin: 0, paddingLeft: "1.2rem", lineHeight: "1.5" }}>
                  <li>Se o Severino faltar por estar doente, o restaurante inteiro fecha as portas.</li>
                  <li>Se você pedir para ele mudar o software de contabilidade, ele pode se confundir no balanço e queimar a comida.</li>
                </ul>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                <strong>SRP (Responsabilidade Única):</strong> Uma classe deve ter apenas um motivo para ser alterada. Em vez de uma classe 'Severino' que faz tudo, devemos criar classes focadas (um cozinheiro coesa, um contador coesa e um faxineiro coeso). Se mudarmos a regra contábil, o cozinheiro nem sabe disso!
              </p>
            </div>
          )
        },
        {
          type: "problem",
          title: "⚠️ O Problema: Depender de Coisas Concretas (DIP)",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", margin: 0 }}>
                Imagine agora que seu cozinheiro só sabe trabalhar com um modelo específico de fogão a gás da marca X. Se a empresa decidir migrar para um fogão elétrico moderno por indução, você terá que demitir o cozinheiro ou pagar um curso inteiro para ele aprender tudo do zero.
              </p>
              <div style={{
                background: "rgba(239, 68, 68, 0.05)",
                border: `1px solid ${theme.danger}30`,
                borderRadius: "12px",
                padding: "1rem"
              }}>
                <strong style={{ color: theme.danger, fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>DIP (Inversão de Dependência):</strong>
                <p style={{ fontSize: "0.9rem", color: theme.text, margin: 0, lineHeight: "1.5" }}>
                  Módulos inteligentes não devem depender de ferramentas concretas de infraestrutura (como conexões diretas com o banco Oracle). Eles devem depender de contratos genéricos (**Interfaces**). O cozinheiro deve saber usar qualquer fogão que siga as normas da cozinha (a Interface Fogão).
                </p>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                Se o sistema depende de uma interface, podemos trocar o banco Oracle pelo PostgreSQL mudando apenas uma linha, sem quebrar nenhuma regra financeira!
              </p>
            </div>
          )
        },
        {
          type: "code",
          title: "🚀 A Solução: Desacoplando com Interfaces",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "0.9rem", color: theme.textMuted, margin: 0 }}>
                Veja como o código acoplado (Severino) é dividido em partes fáceis de manter:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${theme.danger}30`, borderRadius: "8px", padding: "8px" }}>
                  <div style={{ fontSize: "0.75rem", color: theme.danger, fontWeight: 700, marginBottom: "2px" }}>❌ CÓDIGO RUIM (Mistura Tudo):</div>
                  <pre style={{ margin: 0, fontSize: "0.7rem", fontFamily: "monospace", color: "#FDA4AF" }}>
{`public class ProcessadorTransacao {
    public void processar(Venda venda) {
        double taxa = venda.getValor() * 0.15; // Regra tributária
        OracleConnection db = new OracleConnection(); // Conexão direta com banco Oracle!
        db.salvar(venda, taxa);
        EnviadorSms sms = new EnviadorSms(); // Criação direta de envio de SMS!
        sms.enviar("Vendido!");
    }
}`}
                  </pre>
                </div>

                <div style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${theme.success}30`, borderRadius: "8px", padding: "8px" }}>
                  <div style={{ fontSize: "0.75rem", color: theme.success, fontWeight: 700, marginBottom: "2px" }}>✅ CÓDIGO LIMPO (Classes Focadas e Interfaces):</div>
                  <pre style={{ margin: 0, fontSize: "0.7rem", fontFamily: "monospace", color: "#A7F3D0" }}>
{`// 1. Criamos um contrato genérico para salvar (Inversão de Dependência)
public interface RepositorioVenda { void salvar(Venda v, double taxa); }

// 2. A classe de negócio depende apenas do contrato genérico!
public class ProcessadorTransacao {
    private final RepositorioVenda repo; // Depende da Interface (abstração)

    public ProcessadorTransacao(RepositorioVenda repo) { 
        this.repo = repo; // Recebe quem sabe salvar por injeção
    }

    public void processar(Venda v, CalculadorTaxa cal) {
        double taxa = cal.calcular(v); // Delegado para a classe de taxa
        repo.salvar(v, taxa); // O processador não sabe nem se salva em arquivo ou banco Oracle!
    }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )
        },
        {
          type: "quiz",
          title: "🎯 Desafio Rápido de Fixação",
          quiz: {
            question: "O que o Princípio da Responsabilidade Única (SRP) sugere para as nossas classes de código?",
            options: [
              { char: "A", text: "Que cada classe deve possuir no máximo 500 linhas de código escrito em Java.", correct: false },
              { char: "B", text: "Que uma classe deve ter apenas uma única responsabilidade coesa e ter apenas uma única razão clara para ser modificada.", correct: true },
              { char: "C", text: "Que todas as funções do sistema devem ser armazenadas dentro de uma classe estática única para facilitar o acesso.", correct: false }
            ],
            explanation: "Perfeito! O SRP ensina que uma classe deve fazer apenas uma coisa e fazê-la bem. Se a classe manipula o banco de dados, ela não deve calcular impostos nem enviar e-mails, reduzindo a chance de um bug colateral em um setor afetar os outros."
          }
        }
      ]
    },
    {
      title: "3. Design Patterns (Strategy & Observer)",
      icon: <Lightbulb size={18} />,
      themeColor: theme.warning,
      slides: [
        {
          type: "concept",
          title: "🌟 O Conceito: Plugues de Viagem e Alertas",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", margin: 0 }}>
                Aqui aprenderemos dois padrões de projeto que parecem complexos, mas são extremamente comuns na vida real:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{
                  background: "rgba(251, 191, 36, 0.05)",
                  border: "1px solid rgba(251, 191, 36, 0.2)",
                  borderRadius: "10px",
                  padding: "10px"
                }}>
                  <strong style={{ color: "#FBBF24", fontSize: "0.85rem" }}>🔌 Strategy (Estratégia):</strong>
                  <span style={{ fontSize: "0.85rem", color: theme.text, display: "block", marginTop: "2px", lineHeight: "1.4" }}>
                    Pense em um carregador de notebook com plugues de tomada removíveis. Em vez de soldar um pino rígido, você encaixa a 'estratégia de plugue' adequada ao país. O carregador funciona igual. Na programação, trocamos o algoritmo de cálculo (como impostos fiscais ou frete) apenas trocando o objeto de estratégia.
                  </span>
                </div>
                <div style={{
                  background: "rgba(251, 191, 36, 0.05)",
                  border: "1px solid rgba(251, 191, 36, 0.2)",
                  borderRadius: "10px",
                  padding: "10px"
                }}>
                  <strong style={{ color: "#FBBF24", fontSize: "0.85rem" }}>🔔 Observer (Observador):</strong>
                  <span style={{ fontSize: "0.85rem", color: theme.text, display: "block", marginTop: "2px", lineHeight: "1.4" }}>
                    Pense em canais do YouTube. Em vez de você ficar entrando de hora em hora no canal para ver se há vídeo novo, você clica no sininho (se inscreve). Quando o canal posta um vídeo, ele dispara um alerta automático para todos os inscritos.
                  </span>
                </div>
              </div>
            </div>
          )
        },
        {
          type: "problem",
          title: "⚠️ O Problema: Acúmulo de 'If-Else' e Acoplamento",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", margin: 0 }}>
                Imagine que você tem um sensor de velocidade em um carro elétrico. Toda vez que a velocidade muda, o sensor precisa avisar o painel digital, o medidor de bateria e o gravador de logs do veículo.
              </p>
              <div style={{
                background: "rgba(239, 68, 68, 0.05)",
                border: `1px solid ${theme.danger}30`,
                borderRadius: "12px",
                padding: "1rem"
              }}>
                <strong style={{ color: theme.danger, fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>O erro do acoplamento:</strong>
                <p style={{ fontSize: "0.9rem", color: theme.text, margin: 0, lineHeight: "1.5" }}>
                  Se você programar o sensor contendo referências diretas de cada componente de tela, o sensor fica 'amarrado' a eles. Toda vez que a equipe inventar de adicionar uma tela nova no painel do carro, teremos que modificar a classe do sensor!
                </p>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                Com o padrão **Observer**, o sensor apenas mantém uma lista de assinantes interessados e dispara uma notificação geral.
              </p>
            </div>
          )
        },
        {
          type: "code",
          title: "🚀 A Solução: Encaixando Estratégias",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "0.9rem", color: theme.textMuted, margin: 0 }}>
                Veja a calculadora de fretes refatorada para aceitar novas transportadoras sem condicionais:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${theme.danger}30`, borderRadius: "8px", padding: "8px" }}>
                  <div style={{ fontSize: "0.75rem", color: theme.danger, fontWeight: 700, marginBottom: "2px" }}>❌ CÓDIGO CONGESTIONADO (ifs gigantes):</div>
                  <pre style={{ margin: 0, fontSize: "0.75rem", fontFamily: "monospace", color: "#FDA4AF" }}>
{`public double calcularFrete(String tipo, double peso) {
    if (tipo.equals("DHL")) { return peso * 2.5 + 10; }
    else if (tipo.equals("Fedex")) { return peso * 3.0 + 15; }
    else if (tipo.equals("Correios")) { return peso * 1.2; }
    // A cada nova transportadora, você altera esse código crítico!
    return 0;
}`}
                  </pre>
                </div>

                <div style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${theme.success}30`, borderRadius: "8px", padding: "8px" }}>
                  <div style={{ fontSize: "0.75rem", color: theme.success, fontWeight: 700, marginBottom: "2px" }}>✅ CÓDIGO FLEXÍVEL (Estratégia polimórfica):</div>
                  <pre style={{ margin: 0, fontSize: "0.75rem", fontFamily: "monospace", color: "#A7F3D0" }}>
{`// 1. Criamos a interface comum de estratégia
public interface Transportadora { double calcular(double peso); }

// 2. O calculador apenas executa quem for encaixado nele
public class CalculadoraFrete {
    public double calcular(Transportadora t, double peso) {
        return t.calcular(peso); // Delegado sem nenhuma condicional!
    }
}
// Para criar Correios, basta fazer a classe FreteCorreios implements Transportadora!`}
                  </pre>
                </div>
              </div>
            </div>
          )
        },
        {
          type: "quiz",
          title: "🎯 Desafio Rápido de Fixação",
          quiz: {
            question: "Como o padrão de projeto Observer ajuda no desenvolvimento de interfaces gráficas (telas)?",
            options: [
              { char: "A", text: "Ao obrigar a interface gráfica a conter todos os dados salvos em memória estática.", correct: false },
              { char: "B", text: "Ao permitir que telas sejam notificadas de mudanças de dados em tempo real, sem que as classes de negócio precisem conhecer quais telas estão abertas.", correct: true },
              { char: "C", text: "Ao acelerar a conexão direta das janelas com o banco de dados Oracle e Postgres.", correct: false }
            ],
            explanation: "Correto! O Observer cria um canal indireto. As telas assinam a fonte de dados. Quando os dados mudam, as telas se atualizam sozinhas. Isso desacopla a regra de negócio da representação visual."
          }
        }
      ]
    },
    {
      title: "4. Coleções em Java (ArrayList vs LinkedList)",
      icon: <Code size={18} />,
      themeColor: "#10B981",
      slides: [
        {
          type: "concept",
          title: "🌟 O Conceito: Cadeira Fixa vs Segurar as Mãos",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", margin: 0 }}>
                Na programação, precisamos organizar listas de coisas na memória. O Java nos dá duas formas famosas de organizar que funcionam de modos completamente opostos:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{
                  background: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "10px",
                  padding: "10px"
                }}>
                  <strong style={{ color: "#10B981", fontSize: "0.85rem" }}>🪑 ArrayList (Fila de Cadeiras Numeradas):</strong>
                  <span style={{ fontSize: "0.85rem", color: theme.text, display: "block", marginTop: "2px", lineHeight: "1.4" }}>
                    Imagine uma fila de banco organizada em poltronas numeradas consecutivas (de 0 a 500). Achar uma pessoa pela cadeira é imediato. Porém, se a pessoa na cadeira 0 for atendida e sair, **todas as outras 499 pessoas precisam levantar fisicamente e se deslocar uma cadeira para frente**. Isso é muito demorado!
                  </span>
                </div>
                <div style={{
                  background: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "10px",
                  padding: "10px"
                }}>
                  <strong style={{ color: "#10B981", fontSize: "0.85rem" }}>🤝 LinkedList (Pessoas de Mãos Dadas):</strong>
                  <span style={{ fontSize: "0.85rem", color: theme.text, display: "block", marginTop: "2px", lineHeight: "1.4" }}>
                    Imagine as pessoas em pé segurando a mão uma da outra. Se a primeira sai, ela apenas solta a mão da segunda. Ninguém na fila precisa dar um passo! A segunda vira a primeira da fila em tempo instantâneo.
                  </span>
                </div>
              </div>
            </div>
          )
        },
        {
          type: "problem",
          title: "⚠️ O Problema: Concorrência e Conflito de Linhas",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", margin: 0 }}>
                Outro problema é quando tentamos usar essas listas normais com **múltiplas Threads (trabalhadores do processador) ao mesmo tempo**.
              </p>
              <div style={{
                background: "rgba(239, 68, 68, 0.05)",
                border: `1px solid ${theme.danger}30`,
                borderRadius: "12px",
                padding: "1rem"
              }}>
                <strong style={{ color: theme.danger, fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>A Folha de Papel Rasgada:</strong>
                <p style={{ fontSize: "0.9rem", color: theme.text, margin: 0, lineHeight: "1.5" }}>
                  Imagine duas pessoas tentando escrever na mesma linha de uma folha de papel simultaneamente. Uma risca o texto da outra, a folha rasga e a informação é destruída. No Java, isso é a **ConcurrentModificationException**, que acontece quando threads tentam ler e alterar a mesma lista sem controle.
                </p>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                Para isso, usamos estruturas seguras para concorrência, como a fila `ConcurrentLinkedQueue`.
              </p>
            </div>
          )
        },
        {
          type: "code",
          title: "🚀 A Solução: LinkedList e Fila Concorrente",
          content: (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "0.9rem", color: theme.textMuted, margin: 0 }}>
                Veja a diferença de performance e segurança nos códigos Java:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${theme.danger}30`, borderRadius: "8px", padding: "8px" }}>
                  <div style={{ fontSize: "0.75rem", color: theme.danger, fontWeight: 700, marginBottom: "2px" }}>❌ ArrayList (Deslocamento pesado em remoção do início):</div>
                  <pre style={{ margin: 0, fontSize: "0.75rem", fontFamily: "monospace", color: "#FDA4AF" }}>
{`List<String> fila = new ArrayList<>();
fila.add("Cliente A");
fila.remove(0); // A JVM gasta processamento empurrando todos os elementos!`}
                  </pre>
                </div>

                <div style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${theme.success}30`, borderRadius: "8px", padding: "8px" }}>
                  <div style={{ fontSize: "0.75rem", color: theme.success, fontWeight: 700, marginBottom: "2px" }}>✅ LinkedList (Remoção instantânea em tempo constante O(1)):</div>
                  <pre style={{ margin: 0, fontSize: "0.75rem", fontFamily: "monospace", color: "#A7F3D0" }}>
{`Queue<String> fila = new LinkedList<>();
fila.offer("Cliente A"); // Adiciona no fim
fila.poll(); // Remove do início instantaneamente mudando apenas o ponteiro!`}
                  </pre>
                </div>
              </div>
            </div>
          )
        },
        {
          type: "quiz",
          title: "🎯 Desafio Rápido de Fixação",
          quiz: {
            question: "Qual estrutura de dados é recomendada para processar logs em tempo real por várias threads concorrentes sem travar a CPU por exclusão mútua rígida?",
            options: [
              { char: "A", text: "ArrayList estático, pois permite acesso imediato a posições consecutivas em memória.", correct: false },
              { char: "B", text: "ConcurrentLinkedQueue, pois é thread-safe e utiliza instruções atômicas de hardware para alta performance concorrente.", correct: true },
              { char: "C", text: "HashSet de ordenação sequencial sincronizada de elementos de texto.", correct: false }
            ],
            explanation: "Correto! A ConcurrentLinkedQueue foi projetada especialmente para alta concorrência. Ela não bloqueia as threads em filas de espera rígidas, permitindo que elas adicionem e retirem elementos simultaneamente em tempo recorde."
          }
        }
      ]
    }
  ];

  const currentTrilha = trilhas[activeTab];
  const slideContent = currentTrilha.slides[currentSlide];
  const answered = selectedAnswers[activeTab];
  const feedbackActive = showFeedback[activeTab];

  const handleSelectQuiz = (char) => {
    setSelectedAnswers(prev => ({ ...prev, [activeTab]: char }));
    setShowFeedback(prev => ({ ...prev, [activeTab]: true }));
  };

  const handleNextSlide = () => {
    if (currentSlide < 3) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // Avançar para próxima aba e resetar slide para 0
      if (activeTab < trilhas.length - 1) {
        setActiveTab(prev => prev + 1);
        setCurrentSlide(0);
      } else {
        onClose();
      }
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else {
      if (activeTab > 0) {
        setActiveTab(prev => prev - 1);
        setCurrentSlide(3); // Vai para o quiz da anterior
      }
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(3, 7, 18, 0.85)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "1rem",
      animation: "fadeIn 0.25s ease-out"
    }}>
      
      {/* Box do Modal */}
      <div style={{
        backgroundColor: theme.surface,
        border: `1.5px solid ${theme.borderActive}50`,
        borderRadius: "24px",
        width: "100%",
        maxWidth: "840px",
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        overflow: "hidden",
        position: "relative"
      }}>
        
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.5rem 1rem",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(15, 23, 42, 0.8)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${theme.borderActive}`
            }}>
              <BookOpen size={20} color={theme.accent} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 900, color: theme.white, margin: 0 }}>
                Aula Preparatória Interativa · POO
              </h2>
              <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>
                Aprenda a arquitetura de software de forma simples e do absoluto zero
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: theme.textMuted,
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.target.style.backgroundColor = "rgba(255,255,255,0.05)"; e.target.style.color = theme.white; }}
            onMouseLeave={e => { e.target.style.backgroundColor = "transparent"; e.target.style.color = theme.textMuted; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div style={{
          display: "flex",
          backgroundColor: "rgba(0,0,0,0.2)",
          padding: "6px",
          gap: "6px",
          borderBottom: `1px solid ${theme.border}`,
          overflowX: "auto",
          whiteSpace: "nowrap"
        }}>
          {trilhas.map((trilha, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab(idx);
                  setCurrentSlide(0); // Reseta para o primeiro slide do assunto
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: isActive ? theme.accentGlow : "transparent",
                  color: isActive ? theme.white : theme.textMuted,
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 800 : 500,
                  transition: "all 0.2s",
                  borderBottom: isActive ? `2.5px solid ${trilha.themeColor}` : "2.5px solid transparent"
                }}
              >
                {trilha.icon}
                {trilha.title.split(". ")[1]}
              </button>
            );
          })}
        </div>

        {/* Progress Dots / Steps */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          padding: "0.75rem 0",
          backgroundColor: "rgba(0,0,0,0.08)",
          borderBottom: `1px solid ${theme.border}`
        }}>
          {[
            { label: "1. O Conceito", val: 0 },
            { label: "2. O Problema", val: 1 },
            { label: "3. Código Prático", val: 2 },
            { label: "4. Quiz Ativo", val: 3 }
          ].map(dot => {
            const isDotActive = currentSlide === dot.val;
            return (
              <div 
                key={dot.val} 
                onClick={() => setCurrentSlide(dot.val)}
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: isDotActive ? currentTrilha.themeColor : theme.textMuted,
                  cursor: "pointer",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  background: isDotActive ? `${currentTrilha.themeColor}15` : "transparent",
                  border: `1px solid ${isDotActive ? currentTrilha.themeColor : "transparent"}`,
                  transition: "all 0.2s"
                }}
              >
                {dot.label}
              </div>
            );
          })}
        </div>

        {/* Content Body - Scrollable */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          textAlign: "left"
        }}>
          
          <h3 style={{ 
            fontSize: "1.1rem", 
            fontWeight: 900, 
            color: theme.white, 
            margin: "0 0 0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderBottom: `1px solid ${theme.border}`,
            paddingBottom: "8px"
          }}>
            {slideContent.title}
          </h3>

          {/* RENDER SLIDE CONTEXT */}
          {slideContent.type !== "quiz" ? (
            slideContent.content
          ) : (
            // RENDER QUIZ SLIDE
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "1rem", color: theme.white, lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
                {slideContent.quiz.question}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {slideContent.quiz.options.map(opt => {
                  const isSelected = answered === opt.char;
                  let btnBorder = `1.5px solid ${theme.border}`;
                  let btnBg = "rgba(0,0,0,0.15)";
                  let btnColor = theme.text;

                  if (isSelected) {
                    if (opt.correct) {
                      btnBg = theme.successBg;
                      btnBorder = `1.5px solid ${theme.success}`;
                      btnColor = theme.white;
                    } else {
                      btnBg = theme.dangerBg;
                      btnBorder = `1.5px solid ${theme.danger}`;
                      btnColor = theme.white;
                    }
                  }

                  return (
                    <button
                      key={opt.char}
                      onClick={() => handleSelectQuiz(opt.char)}
                      style={{
                        textAlign: "left",
                        padding: "0.9rem 1.1rem",
                        borderRadius: "12px",
                        backgroundColor: btnBg,
                        border: btnBorder,
                        color: btnColor,
                        cursor: "pointer",
                        fontSize: "0.88rem",
                        lineHeight: 1.4,
                        transition: "all 0.2s",
                        fontWeight: isSelected ? 700 : 400
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.target.style.borderColor = "rgba(255,255,255,0.15)";
                          e.target.style.backgroundColor = "rgba(255,255,255,0.01)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.target.style.borderColor = theme.border;
                          e.target.style.backgroundColor = "rgba(0,0,0,0.15)";
                        }
                      }}
                    >
                      <span style={{
                        fontWeight: 900,
                        color: isSelected ? theme.white : currentTrilha.themeColor,
                        marginRight: "6px"
                      }}>{opt.char})</span> {opt.text}
                    </button>
                  );
                })}
              </div>

              {/* Reactive Quiz Feedback */}
              {feedbackActive && (
                <div style={{
                  marginTop: "0.5rem",
                  padding: "1rem",
                  borderRadius: "12px",
                  animation: "fadeIn 0.2s ease-out",
                  backgroundColor: slideContent.quiz.options.find(o => o.char === answered)?.correct ? theme.successBg : theme.dangerBg,
                  border: `1px solid ${slideContent.quiz.options.find(o => o.char === answered)?.correct ? theme.success : theme.danger}`
                }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    {slideContent.quiz.options.find(o => o.char === answered)?.correct ? (
                      <CheckCircle2 size={18} color={theme.success} style={{ flexShrink: 0, marginTop: "2px" }} />
                    ) : (
                      <XCircle size={18} color={theme.danger} style={{ flexShrink: 0, marginTop: "2px" }} />
                    )}
                    <div>
                      <strong style={{ 
                        color: slideContent.quiz.options.find(o => o.char === answered)?.correct ? theme.success : theme.danger,
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 900,
                        marginBottom: "4px"
                      }}>
                        {slideContent.quiz.options.find(o => o.char === answered)?.correct ? "✓ EXCELENTE! EXPLICAÇÃO COMPLEMENTAR:" : "✗ RESPOSTA INCORRETA. VEJA A EXPLICAÇÃO:"}
                      </strong>
                      <p style={{ fontSize: "0.85rem", color: theme.white, lineHeight: 1.5, margin: 0 }}>
                        {slideContent.quiz.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{
          padding: "1rem 1.5rem",
          borderTop: `1px solid ${theme.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(15, 23, 42, 0.9)"
        }}>
          
          {/* Voltar Slide */}
          <button
            onClick={handlePrevSlide}
            disabled={activeTab === 0 && currentSlide === 0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: `1px solid ${theme.border}`,
              backgroundColor: "rgba(255,255,255,0.02)",
              color: (activeTab === 0 && currentSlide === 0) ? "rgba(255,255,255,0.15)" : theme.white,
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: (activeTab === 0 && currentSlide === 0) ? "not-allowed" : "pointer",
              transition: "all 0.2s"
            }}
          >
            <ChevronLeft size={16} /> Voltar
          </button>

          <div style={{ fontSize: "0.78rem", color: theme.textMuted, fontFamily: "monospace" }}>
            Módulo {activeTab + 1}/4 · Slide {currentSlide + 1}/4
          </div>

          {/* Avançar Slide */}
          <button
            onClick={handleNextSlide}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: (activeTab === trilhas.length - 1 && currentSlide === 3) ? theme.success : theme.accent,
              color: theme.white,
              fontWeight: 800,
              fontSize: "0.82rem",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: `0 4px 12px ${(activeTab === trilhas.length - 1 && currentSlide === 3) ? theme.success : theme.accent}30`
            }}
          >
            {currentSlide < 3 ? (
              <>Avançar <ChevronRight size={16} /></>
            ) : activeTab < trilhas.length - 1 ? (
              <>Próxima Trilha <Play size={14} /></>
            ) : (
              <>Concluir Aula <BookOpenCheck size={14} /></>
            )}
          </button>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Subcomponente auxiliar de ícone para contornar problemas de importação no lucide-react do usuário
function LayersIcon({ size, color }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color || "currentColor"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-10 5 10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  );
}
