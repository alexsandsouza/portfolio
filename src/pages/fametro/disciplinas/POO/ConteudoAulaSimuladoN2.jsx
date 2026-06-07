import { useState } from "react";
import { 
  X, BookOpen, Cpu, Code, Lightbulb, 
  CheckCircle2, XCircle, AlertCircle, HelpCircle, ArrowRight 
} from "lucide-react";

// Estilo de cores locais (idêntico ao simulado para harmonia visual)
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
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [tabIdx]: 'A' | 'B' | ... }
  const [showFeedback, setShowFeedback] = useState({}); // { [tabIdx]: true | false }

  if (!isOpen) return null;

  const trilhas = [
    {
      title: "1. Concorrência no Swing (Threads e EDT)",
      icon: <Cpu size={18} />,
      themeColor: theme.accent,
      context: "Você desenvolveu uma interface gráfica (Java Swing) para um sistema de telemetria de frotas de caminhões. Ao clicar no botão 'Atualizar Painel', o sistema faz uma requisição para um serviço Web e busca dados de 5.000 veículos. Durante os 8 segundos de carregamento dos dados pela rede, o usuário não consegue redimensionar a tela, arrastar a janela ou clicar em qualquer outro botão do sistema.",
      antiPattern: `// ANTIPADRÃO: Trava a Thread de Despacho de Eventos (EDT)
btnAtualizar.addActionListener(e -> {
    // Chamada síncrona e demorada na rede direta no listener
    List<Frota> dados = apiLogistica.buscarFrotaCompleta(); 
    
    // Atualiza a tabela na tela
    tabelaFrota.atualizar(dados); 
});`,
      goodPractice: `// BOA PRÁTICA: SwingWorker executa a rede em background
btnAtualizar.addActionListener(e -> {
    new SwingWorker<List<Frota>, Void>() {
        @Override
        protected List<Frota> doInBackground() throws Exception {
            // Executado em uma Thread de Background (fora da EDT)
            return apiLogistica.buscarFrotaCompleta(); 
        }

        @Override
        protected void done() {
            try {
                // Executado na EDT com total segurança para a interface
                List<Frota> dados = get(); 
                tabelaFrota.atualizar(dados);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }.execute(); // Dispara o processador assíncrono
});`,
      conceptExplanations: [
        { title: "EDT (Event Dispatch Thread)", text: "É a única thread responsável por desenhar a tela e gerenciar os eventos (cliques, teclado, foco). Se você colocar um processamento demorado (como rede, arquivo ou banco de dados) nela, a tela congela e para de responder a interações do sistema operacional." },
        { title: "SwingWorker", text: "Classe utilitária nativa do Swing projetada para gerenciar threads. O método 'doInBackground()' faz o trabalho pesado de background e o método 'done()' recupera o resultado e atualiza a UI com total segurança." }
      ],
      quiz: {
        question: "Por que não podemos atualizar componentes visuais (como JTextField e JButton) diretamente de dentro do método doInBackground() de um SwingWorker?",
        options: [
          { char: "A", text: "Porque os componentes do Swing não são thread-safe e a API exige que qualquer modificação neles seja efetuada exclusivamente na EDT (Event Dispatch Thread).", correct: true },
          { char: "B", text: "Porque o método doInBackground() roda de forma síncrona na thread principal, o que gera travamento imediato na renderização do sistema operacional.", correct: false },
          { char: "C", text: "Porque a linguagem Java impede a manipulação de objetos gráficos por meio de interfaces criadas a partir do método construtor de threads do SO.", correct: false }
        ],
        explanation: "Correto! Os componentes da API Swing não possuem travas de concorrência interna (não são thread-safe). Para evitar inconsistências visuais e erros de runtime, toda alteração gráfica deve ser despachada para a EDT, o que é feito naturalmente no método 'done()' do SwingWorker ou usando 'SwingUtilities.invokeLater()'."
      }
    },
    {
      title: "2. Princípios SOLID (SRP & DIP)",
      icon: <LayersIcon size={18} />,
      themeColor: "#8B5CF6",
      context: "Um sistema de faturamento corporativo possui a classe 'ProcessadorVendas'. Esta única classe é responsável por ler os dados de vendas de um banco de dados, calcular os impostos fiscais federais, salvar os dados e disparar um e-mail com o PDF de cupom fiscal para o cliente. Quando a regra do imposto federal muda, o desenvolvedor precisa abrir e alterar a mesma classe, gerando bugs inesperados na rotina de envio de e-mails.",
      antiPattern: `// ANTIPADRÃO: Classe com múltiplas responsabilidades e alto acoplamento
public class ProcessadorVendas {
    public void processar(Venda venda) {
        // 1. Calcula impostos diretamente
        double imposto = venda.getValor() * 0.15;
        
        // 2. Conexão direta com banco concreto Oracle
        OracleConnection db = new OracleConnection();
        db.salvarVenda(venda, imposto);
        
        // 3. Formatação do e-mail e envio usando API de rede
        EnviadorEmail email = new EnviadorEmail();
        email.enviarComprovante(venda.getClienteEmail(), "Nota Fiscal");
    }
}`,
      goodPractice: `// BOA PRÁTICA: SRP (Responsabilidade Única) e DIP (Inversão de Dependência)
public class ProcessadorVendas {
    private final CalculadorImposto calculador;
    private final RepositorioVenda repositorio; // Depende de interfaces, não de classes concretas
    private final ServicoNotificacao notificacao;

    public ProcessadorVendas(CalculadorImposto cal, RepositorioVenda repo, ServicoNotificacao notif) {
        this.calculador = cal;
        this.repositorio = repo;
        this.notificacao = notif;
    }

    public void processar(Venda venda) {
        double imposto = calculador.calcular(venda);
        repositorio.salvar(venda, imposto);
        notificacao.notificarCliente(venda);
    }
}`,
      conceptExplanations: [
        { title: "SRP (Princípio da Responsabilidade Única)", text: "Uma classe deve ter apenas um motivo para mudar. No exemplo, ao separar o cálculo do imposto, a gravação em banco e o disparo de e-mails em classes distintas, alterações no e-mail não quebram as regras financeiras." },
        { title: "DIP (Princípio da Inversão de Dependência)", text: "Módulos de alto nível não devem depender de implementações de baixo nível (infraestrutura), mas sim de abstrações (interfaces). O processador de vendas agora depende de 'RepositorioVenda' (uma interface), permitindo migrar do Oracle para o PostgreSQL sem mexer nas regras de negócio." }
      ],
      quiz: {
        question: "Qual das seguintes alternativas descreve uma violação direta ao DIP (Dependency Inversion Principle)?",
        options: [
          { char: "A", text: "Depender de uma interface genérica de persistência como 'DaoInterface' para efetuar operações de inserção no banco de dados da aplicação.", correct: false },
          { char: "B", text: "Instanciar uma classe concreta de conexão como 'PostgresSqlConnection conn = new PostgresSqlConnection()' diretamente dentro da classe de regras de negócio.", correct: true },
          { char: "C", text: "Injetar a dependência de serviços externos usando o construtor da classe principal com o auxílio de anotações ou frameworks de injeção.", correct: false }
        ],
        explanation: "Correto! Quando uma classe de regras de negócio instancia diretamente uma classe concreta de infraestrutura (como a classe de conexão com o PostgreSQL), ela está acoplada a um fornecedor específico. Qualquer alteração de tecnologia exige refatorar a regra de negócio. Para seguir o DIP, o serviço de negócio deve depender de uma interface neutra, e o banco PostgreSQL deve implementar essa interface."
      }
    },
    {
      title: "3. Design Patterns (Strategy & Observer)",
      icon: <Lightbulb size={18} />,
      themeColor: theme.warning,
      context: "Um e-commerce precisa calcular frete com base em diferentes transportadoras (Correios, DHL, FedEx). No início, o desenvolvedor criou um método com condicionais aninhadas. Toda vez que uma transportadora lança uma nova promoção de frete ou uma nova empresa de frete é integrada ao site, o desenvolvedor precisa adicionar novos blocos 'if-else' e retestar toda a calculadora financeira de fretes do carrinho de compras.",
      antiPattern: `// ANTIPADRÃO: Acúmulo de condicionais que dificulta a manutenção
public class CalculadoraFrete {
    public double calcular(String transportadora, double peso) {
        if (transportadora.equalsIgnoreCase("CORREIOS")) {
            return peso * 1.5 + 10;
        } else if (transportadora.equalsIgnoreCase("DHL")) {
            return peso * 2.8 + 25;
        } else if (transportadora.equalsIgnoreCase("FEDEX")) {
            return peso * 3.5 + 40;
        } else {
            throw new IllegalArgumentException("Transportadora desconhecida");
        }
    }
}`,
      goodPractice: `// BOA PRÁTICA: Padrão Strategy encapsula as regras de cálculo
public interface EstrategiaFrete {
    double calcular(double peso);
}

// Cada transportadora implementa seu próprio cálculo isolado
public class FreteDHL implements EstrategiaFrete {
    public double calcular(double peso) { return peso * 2.8 + 25; }
}

public class CalculadoraFrete {
    public double calcular(EstrategiaFrete estrategia, double peso) {
        // Acoplamento zero: o cálculo é delegado polimorficamente
        return estrategia.calcular(peso); 
    }
}`,
      conceptExplanations: [
        { title: "Padrão Strategy (Gof - Comportamental)", text: "Define uma família de algoritmos, encapsula cada um deles e os torna intercambiáveis. Permite que o algoritmo varie independentemente dos clientes que o utilizam, eliminando switch-cases rígidos de validação." },
        { title: "Padrão Observer (GoF - Comportamental)", text: "Estabelece uma relação um-para-muitos entre objetos, de forma que quando um objeto (Subject) muda de estado, todos os seus dependentes (Observers) são notificados e atualizados automaticamente. Muito usado em interfaces gráficas de eventos e notificações." }
      ],
      quiz: {
        question: "Como o padrão de projeto Strategy auxilia na aplicação do princípio Open-Closed (OCP) do SOLID?",
        options: [
          { char: "A", text: "Ao permitir que novos algoritmos sejam adicionados criando-se novas classes que implementam uma interface comum, sem necessidade de modificar o código da classe cliente.", correct: true },
          { char: "B", text: "Ao ocultar métodos privados usando escopos protegidos de herança em uma classe controladora centralizada.", correct: false },
          { char: "C", text: "Ao garantir que apenas uma única instância da classe de cálculo exista na memória durante o ciclo de execução do servidor.", correct: false }
        ],
        explanation: "Correto! O princípio Aberto/Fechado (OCP) diz que entidades de software devem estar abertas para extensão, mas fechadas para modificação. Com o Strategy, para adicionar uma nova modalidade de frete, você cria uma nova classe (extensão) e não precisa tocar no código existente da CalculadoraFrete (fechada para modificação)."
      }
    },
    {
      title: "4. Java Collections & Concorrência",
      icon: <Code size={18} />,
      themeColor: "#10B981",
      context: "Uma aplicação financeira processa transações de cartões em tempo real. Várias threads adicionam logs de auditoria e limpam o log inicial da fila à medida que novos itens chegam. O desenvolvedor usou um 'ArrayList' estático. Em horários de pico, o servidor começou a lançar a exceção 'ConcurrentModificationException' e a CPU travou em 100% devido às operações concorrentes nas threads de rede tentando reorganizar os arrays.",
      antiPattern: `// ANTIPADRÃO: ArrayList não é seguro para threads concorrentes
public class GerenciadorTransacoes {
    // ArrayList não é thread-safe e remoções do início causam shift O(N) em memória
    private static List<Transacao> logs = new ArrayList<>();

    public static void processar(Transacao t) {
        logs.add(t); 
        if (logs.size() > 500) {
            logs.remove(0); // Custo alto de deslocamento de memória na CPU!
        }
    }
}`,
      goodPractice: `// BOA PRÁTICA: ConcurrentLinkedQueue é thread-safe e não-bloqueante
public class GerenciadorTransacoes {
    // Fila concorrente eficiente baseada em nós encadeados e algoritmos CAS
    private static Queue<Transacao> logs = new ConcurrentLinkedQueue<>();

    public static void processar(Transacao t) {
        logs.offer(t); // Adição segura e ultra rápida no final
        while (logs.size() > 500) {
            logs.poll(); // Remoção O(1) do início (FIFO) sem arrastar elementos em memória
        }
    }
}`,
      conceptExplanations: [
        { title: "ArrayList vs LinkedList", text: "ArrayList armazena em array contíguo em memória. Remover a posição zero exige deslocar todos os outros N elementos (complexidade O(N)). A LinkedList usa nós encadeados; remover do início apenas muda os ponteiros do primeiro nó (complexidade O(1)), sendo infinitamente mais veloz." },
        { title: "Coleções Thread-Safe", text: "Coleções normais (ArrayList, HashMap) não são protegidas contra concorrência de threads. Se duas threads tentarem modificar o mesmo local simultaneamente, ocorre corrupção e falha. Coleções como 'ConcurrentLinkedQueue' utilizam operações baseadas em hardware (CAS - Compare And Swap) para garantir concorrência segura sem o peso de bloqueios rígidos (locks)." }
      ],
      quiz: {
        question: "Por que uma ConcurrentLinkedQueue é preferível a um Vector ou Collections.synchronizedList(new ArrayList<>()) em cenários de altíssima taxa de vazão (throughput) com múltiplas threads?",
        options: [
          { char: "A", text: "Porque ela bloqueia todo o acesso à lista enquanto uma thread faz leitura, impedindo inconsistências de dados.", correct: false },
          { char: "B", text: "Porque ela utiliza algoritmos não-bloqueantes (Non-blocking algorithms) com instruções atômicas como CAS (Compare-And-Swap), evitando que threads fiquem esperando em filas de exclusão mútua.", correct: true },
          { char: "C", text: "Porque ela converte automaticamente a lista em objetos estáticos alocados diretamente no cache da CPU.", correct: false }
        ],
        explanation: "Correto! As coleções sincronizadas legadas (Vector, SynchronizedList) utilizam bloqueio total (exclusão mútua). Enquanto uma thread adiciona ou lê, todas as outras threads ficam paradas esperando o lock ser liberado. Já a 'ConcurrentLinkedQueue' usa algoritmos não-bloqueantes baseados em CAS do hardware, permitindo alta concorrência de leitura e escrita simultânea sem gargalos de threads suspensas!"
      }
    }
  ];

  const currentTrilha = trilhas[activeTab];
  const answered = selectedAnswers[activeTab];
  const feedbackActive = showFeedback[activeTab];

  const handleSelectQuiz = (char) => {
    setSelectedAnswers(prev => ({ ...prev, [activeTab]: char }));
    setShowFeedback(prev => ({ ...prev, [activeTab]: true }));
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
        maxWidth: "920px",
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        overflow: "hidden",
        position: "relative"
      }}>
        
        {/* Header */}
        <div style={{
          padding: "1.5rem 1.5rem 1rem",
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
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: theme.white, margin: 0 }}>
                Aula Preparatória Interativa · POO
              </h2>
              <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>
                Metodologia Ativa: Aprenda analisando o código, resolvendo bugs e se testando
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
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 700 : 500,
                  transition: "all 0.2s",
                  borderBottom: isActive ? `2px solid ${trilha.themeColor}` : "2px solid transparent"
                }}
              >
                {trilha.icon}
                {trilha.title.split(". ")[1]}
              </button>
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
          gap: "1.5rem",
          textAlign: "left"
        }}>
          
          {/* 1. Contexto Real */}
          <div style={{
            borderLeft: `4px solid ${currentTrilha.themeColor}`,
            paddingLeft: "1rem",
            backgroundColor: "rgba(255,255,255,0.01)",
            padding: "1rem 1rem 1rem 1.25rem",
            borderRadius: "0 12px 12px 0",
            border: `1px solid ${theme.border}`,
            borderLeftWidth: "4px",
            borderLeftColor: currentTrilha.themeColor
          }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 900, color: currentTrilha.themeColor, letterSpacing: "1.5px", marginBottom: "0.5rem" }}>
              CENÁRIO DO MUNDO REAL
            </div>
            <p style={{ fontSize: "0.95rem", color: theme.text, lineHeight: 1.6, margin: 0 }}>
              {currentTrilha.context}
            </p>
          </div>

          {/* 2. Comparativo de Código: Anti-Padrão vs Boa Prática */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "1.25rem"
          }}>
            {/* Código Problemático */}
            <div style={{
              backgroundColor: "rgba(0,0,0,0.15)",
              border: `1px solid ${theme.danger}40`,
              borderRadius: "16px",
              overflow: "hidden"
            }}>
              <div style={{
                backgroundColor: `${theme.danger}12`,
                padding: "8px 14px",
                borderBottom: `1px solid ${theme.danger}25`,
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <XCircle size={14} color={theme.danger} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: theme.danger, letterSpacing: "1px" }}>
                  O CÓDIGO COM BUG (ANTI-PADRÃO)
                </span>
              </div>
              <pre style={{
                margin: 0,
                padding: "1rem",
                overflowX: "auto",
                fontSize: "0.8rem",
                lineHeight: 1.5,
                color: "#FDA4AF",
                fontFamily: "monospace"
              }}>
                {currentTrilha.antiPattern}
              </pre>
            </div>

            {/* Código Corrigido */}
            <div style={{
              backgroundColor: "rgba(0,0,0,0.15)",
              border: `1px solid ${theme.success}40`,
              borderRadius: "16px",
              overflow: "hidden"
            }}>
              <div style={{
                backgroundColor: `${theme.success}12`,
                padding: "8px 14px",
                borderBottom: `1px solid ${theme.success}25`,
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <CheckCircle2 size={14} color={theme.success} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: theme.success, letterSpacing: "1px" }}>
                  A SOLUÇÃO RECOMENDADA
                </span>
              </div>
              <pre style={{
                margin: 0,
                padding: "1rem",
                overflowX: "auto",
                fontSize: "0.8rem",
                lineHeight: 1.5,
                color: "#A7F3D0",
                fontFamily: "monospace"
              }}>
                {currentTrilha.goodPractice}
              </pre>
            </div>
          </div>

          {/* 3. Explicações Conceituais */}
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: theme.white, margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={16} color={theme.accent} /> Conceitos Fundamentais Desvendados
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {currentTrilha.conceptExplanations.map((concept, cIdx) => (
                <div key={cIdx} style={{
                  background: "rgba(255,255,255,0.01)",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: `1px solid ${theme.border}`
                }}>
                  <div style={{ fontSize: "0.85rem", color: theme.white, fontWeight: 700, marginBottom: "4px" }}>
                    🔹 {concept.title}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: theme.textMuted, lineHeight: 1.5 }}>
                    {concept.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Desafio Ativo (Quiz Interativo) */}
          <div style={{
            background: theme.surfaceLight,
            border: `1.5px solid ${theme.borderActive}30`,
            borderRadius: "18px",
            padding: "1.25rem",
            marginTop: "0.5rem"
          }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: theme.white, margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <HelpCircle size={18} color={theme.warning} /> Desafio Rápido de Fixação (Aprendizado Ativo)
            </h3>
            
            <p style={{ fontSize: "0.95rem", color: theme.text, lineHeight: 1.5, margin: "0 0 1.25rem", fontWeight: 600 }}>
              {currentTrilha.quiz.question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentTrilha.quiz.options.map(opt => {
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
                      borderRadius: "10px",
                      backgroundColor: btnBg,
                      border: btnBorder,
                      color: btnColor,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                      transition: "all 0.2s",
                      fontWeight: isSelected ? 600 : 400
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
                      fontWeight: 800,
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
                marginTop: "1.25rem",
                padding: "1rem",
                borderRadius: "10px",
                animation: "fadeIn 0.2s ease-out",
                backgroundColor: currentTrilha.quiz.options.find(o => o.char === answered)?.correct ? theme.successBg : theme.dangerBg,
                border: `1px solid ${currentTrilha.quiz.options.find(o => o.char === answered)?.correct ? theme.success : theme.danger}`
              }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  {currentTrilha.quiz.options.find(o => o.char === answered)?.correct ? (
                    <CheckCircle2 size={18} color={theme.success} style={{ flexShrink: 0, marginTop: "2px" }} />
                  ) : (
                    <XCircle size={18} color={theme.danger} style={{ flexShrink: 0, marginTop: "2px" }} />
                  )}
                  <div>
                    <strong style={{ 
                      color: currentTrilha.quiz.options.find(o => o.char === answered)?.correct ? theme.success : theme.danger,
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      marginBottom: "4px"
                    }}>
                      {currentTrilha.quiz.options.find(o => o.char === answered)?.correct ? "✓ EXCELENTE! VOCÊ ACERTOU!" : "✗ RESPOSTA INCORRETA. LEIA O FEEDBACK ABAIXO:"}
                    </strong>
                    <p style={{ fontSize: "0.85rem", color: theme.white, lineHeight: 1.5, margin: 0 }}>
                      {currentTrilha.quiz.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

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
          <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>
            Trilha {activeTab + 1} de {trilhas.length} · Clique nas abas para navegar
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {activeTab < trilhas.length - 1 ? (
              <button
                onClick={() => {
                  setActiveTab(idx => idx + 1);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: theme.accent,
                  color: theme.white,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Próxima Trilha <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: `1.5px solid ${theme.success}`,
                  backgroundColor: theme.successBg,
                  color: theme.white,
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                ✓ Pronto para Iniciar!
              </button>
            )}
          </div>
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
