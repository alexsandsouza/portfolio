import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  BookOpen, Trophy, Clock, CheckCircle, XCircle, Send, 
  FileText, ChevronLeft, ChevronRight, GraduationCap, 
  ArrowLeft, Copy, Check, Printer, AlertTriangle 
} from "lucide-react";

// ─── QUESTIONS DATA ───────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    theme: "Swing & Concorrência",
    text: "Um painel de monitoramento de usinas solares desenvolvido em Java Swing possui um botão 'Gerar Relatório de Carga' que, ao ser acionado, realiza uma consulta assíncrona pesada a um banco de dados remoto de telemetria histórica. O desenvolvedor implementou essa chamada de rede diretamente dentro do método actionPerformed do ActionListener associado ao botão. Durante a fase de testes, observou-se que a interface gráfica congela por vários segundos até que a consulta seja concluída, impedindo que o operador cancele a ação, redimensione a janela ou clique em outros painéis. Considerando a arquitetura de thread única (single-thread rule) do Swing e o papel da Event Dispatch Thread (EDT), qual é a abordagem técnica recomendada para solucionar esse problema sem comprometer a responsividade da interface gráfica?",
    options: [
      "A) Implementar a operação de carga de dados em um SwingWorker, executando o processo demorado no método doInBackground e atualizando os componentes de interface no método done de forma segura na Thread de Despacho de Eventos (EDT).",
      "B) Invocar uma nova instância da classe Thread clássica para realizar a chamada e, ao finalizar, atualizar diretamente o rótulo de progresso no painel de controle utilizando a referência direta de memória aos elementos gráficos do contêiner.",
      "C) Configurar o método do ActionListener com o modificador synchronized, garantindo que a máquina virtual Java serialize as chamadas e evite conflitos de leitura simultânea nos componentes gráficos ativos.",
      "D) Utilizar o método estático Thread.sleep logo após o início do processamento para forçar a interface a atualizar sua renderização interna antes que a chamada de banco de dados se inicie na Event Dispatch Thread (EDT).",
      "E) Substituir a lógica de processamento por um temporizador javax.swing.Timer configurado com intervalos infinitesimais para verificar se o banco de dados concluiu a busca síncrona dos dados de telemetria."
    ],
    answer: "A",
    feedback: "O SwingWorker é o mecanismo nativo do Java Swing projetado para executar tarefas de longa duração em uma thread de segundo plano (via doInBackground) e, ao terminar, realizar atualizações na interface de forma segura na EDT (via done), preservando a responsividade."
  },
  {
    id: 2,
    theme: "Design Patterns (Observer)",
    text: "Em um painel de controle de automação industrial desenvolvido em Java Swing, o componente responsável pelo monitoramento dos sensores de vazão de fluidos precisa notificar dinamicamente o painel de 'Estatísticas de Consumo', o painel de 'Histórico de Logs' e o painel de 'Alarmes Críticos' sempre que uma nova leitura for registrada. Atualmente, a classe controladora dos sensores possui instâncias concretas e acopladas de todos esses painéis, invocando métodos de atualização individuais a cada milissegundo. Esse design gerou alta rigidez no código, tornando complexa a inserção de novos componentes visuais de monitoramento sem modificar a lógica central do sensor. Para solucionar esse problema, a equipe de engenharia de software deve aplicar uma estratégia de desacoplamento baseada em eventos.",
    options: [
      "A) Aplicar o padrão Singleton para criar uma classe de controle global que gerencia os dados de temperatura através de métodos estáticos acessíveis por todos os painéis.",
      "B) Implementar o padrão Decorator nos painéis de visualização para estender suas capacidades dinâmicas de atualização sem a necessidade de instanciar novas classes.",
      "C) Utilizar o padrão Observer, registrando os painéis de visualização como ouvintes do painel de sensores de temperatura para reagir de forma desacoplada sempre que houver mudanças de leituras.",
      "D) Utilizar o padrão Adapter para converter a assinatura dos métodos de leitura de temperatura em formatos compatíveis com os painéis gráficos, isolando as assinaturas de dados.",
      "E) Configurar herança direta entre o painel de sensores e os painéis de visualização, fazendo com que as subclasses herdem as propriedades de estado do sensor de temperatura de forma transparente."
    ],
    answer: "C",
    feedback: "O padrão Observer permite definir um mecanismo de dependência um-para-muitos entre objetos, de modo que quando um objeto (o Sensor) muda de estado, todos os seus dependentes (os painéis) são notificados e atualizados de forma automática e desacoplada."
  },
  {
    id: 3,
    theme: "Eventos no Swing & JTextField",
    text: "Durante o desenvolvimento do terminal de autoatendimento de um supermercado, o programador utilizou um componente JTextField para receber a leitura do código de barras inserido por um leitor óptico (que envia a sequência de caracteres seguida do caractere 'Enter' ao final). O sistema deve realizar a busca no banco de dados e inserir o item correspondente na lista do caixa assim que a digitação for finalizada. O desenvolvedor implementou um KeyListener para interceptar a tecla Enter, mas percebeu um comportamento errático de digitação duplicada e inconsistência de eventos conforme o foco do cursor transitava na tela de pagamento. Para garantir a confiabilidade da submissão dos dados do código de barras, a equipe técnica busca a melhor prática de captura de eventos do Swing.",
    options: [
      "A) Monitorar a entrada via FocusListener, disparando a inserção do produto apenas quando o componente JTextField perder o foco para outro elemento visual do formulário.",
      "B) Associar um ActionListener ao JTextField, que reage nativamente ao acionamento da tecla Enter, abstraindo a mecânica do teclado físico e garantindo estabilidade no leitor.",
      "C) Sobrescrever o método paintComponent do JTextField para verificar se o caractere de quebra de linha está contido no buffer do Graphics antes do componente ser desenhado na tela.",
      "D) Instanciar uma Thread secundária com execução periódica para verificar o tamanho da string no campo de texto e processar a busca do produto quando atingir um tamanho fixo.",
      "E) Implementar um DocumentListener para interceptar cada caractere inserido e forçar a validação síncrona no banco de dados imediatamente a cada tecla digitada."
    ],
    answer: "B",
    feedback: "No Java Swing, o JTextField dispara um ActionEvent para todos os ActionListeners registrados quando o usuário pressiona 'Enter'. Essa é a forma recomendada e mais estável de capturar a finalização da entrada em campos de texto, sem a sensibilidade a nível de tecla de um KeyListener."
  },
  {
    id: 4,
    theme: "Swing Custom Painting & paintComponent",
    text: "Um editor de diagramas UML customizado em Java Swing estende o JPanel para permitir que o usuário desenhe retângulos (representando classes) através de cliques com o mouse. O programador implementou a lógica obtendo o objeto Graphics do JPanel diretamente dentro do listener de eventos de clique do mouse (mouseClicked) e invocando o método g.drawRect(). Nos testes de uso, constatou-se que sempre que a janela da aplicação é minimizada, arrastada para fora da tela ou redimensionada, todos os retângulos desenhados anteriormente desaparecem da tela. Qual é o procedimento arquitetural correto para garantir a persistência e consistência visual dos elementos gráficos desenhados de forma customizada?",
    options: [
      "A) Forçar o redesenho do painel chamando o método revalidate dentro do loop principal do sistema para atualizar o Graphics do JPanel continuamente de forma síncrona.",
      "B) Salvar a imagem do painel como uma imagem rasterizada em disco a cada clique do mouse e carregá-la como imagem de fundo do painel toda vez que o sistema disparar eventos de foco.",
      "C) Definir as cores e espessuras dos desenhos na thread de execução do mouse, delegando a responsabilidade de exibição para um gerenciador de layout que reposicione os componentes filhos.",
      "D) Armazenar os dados de cada nó da rede em uma coleção de objetos de domínio e iterar sobre essa lista dentro do método paintComponent do JPanel para desenhar todos os nós.",
      "E) Sobrescrever o método updateUI do painel de desenho para travar o Graphics atual, impedindo que o sistema operacional envie novos sinais de repintura após eventos de redimensionamento."
    ],
    answer: "D",
    feedback: "A pintura em Swing é reativa e dirigida pelo sistema operacional (via repaint). Nenhuma pintura direta com o Graphics retido de eventos é permanente. A abordagem correta é manter os objetos gráficos em uma estrutura de dados de modelo e renderizá-los a cada ciclo dentro do método paintComponent(Graphics g)."
  },
  {
    id: 5,
    theme: "SOLID (Single Responsibility Principle)",
    text: "Em um sistema de comércio eletrônico, a classe FaturamentoService é responsável por executar o fechamento fiscal de pedidos de vendas. O código realiza as seguintes tarefas: validação cadastral do cliente no banco de dados, cálculo de impostos interestaduais, formatação da nota fiscal em layout XML, transmissão do payload à API da Receita Federal, geração de um arquivo PDF para impressão local e disparo de e-mails com o status da transação. Consequentemente, a classe ultrapassou duas mil linhas de código e qualquer modificação tributária gera bugs colaterais na formatação do PDF. Para alinhar o design de software aos princípios SOLID, qual modificação estrutural deve ser realizada?",
    options: [
      "A) Decompor a classe FaturamentoService em serviços menores e coesos, como CalculadorImpostos, GeradorArquivoFiscal, RepositorioFaturamento e ServicoNotificacao, isolando os motivos de mudança.",
      "B) Criar interfaces específicas para cada método da classe FaturamentoService e fazer com que uma única subclasse implemente todas essas interfaces por meio de herança múltipla simulada.",
      "C) Centralizar todas as rotinas em métodos estáticos dentro de uma classe de utilidade geral, eliminando as variáveis de instância e permitindo que outras classes do ERP acessem as funções de forma global.",
      "D) Reorganizar o fluxo interno usando métodos protegidos na própria classe e configurar classes filhas que sobrescrevem apenas a lógica de geração de PDF e envio de e-mails corporativos.",
      "E) Implementar classes internas privadas na classe FaturamentoService para encapsular os dados de cálculo fiscal, mantendo os métodos de notificação e gravação expostos externamente."
    ],
    answer: "A",
    feedback: "O Princípio da Responsabilidade Única (SRP) prega que uma classe deve ter um, e apenas um, motivo para mudar. Ao separar o cálculo de impostos, a geração do XML, o acesso ao banco e o envio de e-mail em classes específicas, reduz-se o acoplamento e os impactos indesejados de mudanças."
  },
  {
    id: 6,
    theme: "Design Patterns (Strategy)",
    text: "Uma plataforma de Streaming de Vídeo calcula o valor mensal da assinatura dos usuários utilizando diferentes regras de fidelidade e cupons sazonais (ex: Assinatura Estudantil, Cupom Black Friday, Assinatura Corporativa e Parcerias Telefônicas). Atualmente, o cálculo do valor final é realizado por uma estrutura encadeada de if-else na classe FaturamentoMensal. À medida que novos tipos de descontos e promoções comerciais são adicionados, o arquivo FaturamentoMensal é aberto e modificado repetidamente, gerando riscos e aumentando o esforço de teste. A equipe técnica necessita aplicar um padrão de projeto GoF que permita flexibilizar a adição de novas regras de descontos de forma dinâmica.",
    options: [
      "A) Aplicar o padrão Facade para fornecer uma interface simplificada que agrupe todos os métodos de pagamento dentro de uma única biblioteca de processamento estático.",
      "B) Utilizar o padrão Factory Method para encapsular a criação de instâncias de pagamento, eliminando a necessidade de interfaces comuns para os métodos de cálculo da taxa.",
      "C) Adotar o padrão Command para enfileirar as transações de pagamento em uma lista de execução assíncrona, tratando as chamadas por ordem de chegada no sistema.",
      "D) Empregar o padrão Template Method para forçar que todas as transações sigam rigorosamente a mesma sequência de etapas em subclasses concretas, sem alterar o algoritmo base.",
      "E) Implementar o padrão Strategy, definindo uma interface comum de pagamento e encapsulando cada meio de processamento em sua própria classe concreta intercambiável por composição."
    ],
    answer: "E",
    feedback: "O padrão Strategy define uma família de algoritmos, encapsula cada um deles e os torna intercambiáveis em tempo de execução. Isso permite que a estratégia de cálculo de desconto mude dinamicamente sem alterar o contexto (FaturamentoMensal), respeitando o Open/Closed Principle (OCP)."
  },
  {
    id: 7,
    theme: "Java Collections & Estruturas de Dados",
    text: "Um software que processa logs de servidores web precisa de um buffer de armazenamento temporário em memória. Os registros de log chegam em alta frequência e o buffer deve funcionar como uma fila: quando a estrutura atinge o limite máximo de capacidade, o sistema remove automaticamente o registro de log mais antigo (localizado no primeiro índice) para que a mensagem mais nova seja inserida no final da fila. A equipe de desenvolvimento utilizou inicialmente uma estrutura ArrayList para o buffer, mas observou picos de lentidão extrema no processamento. Qual estrutura de dados da Java Collections Framework otimiza o desempenho desse buffer, reduzindo a complexidade computacional da remoção?",
    options: [
      "A) Substituir a lista por um HashSet, pois a estrutura de espalhamento (hashing) garante inserção e remoção em tempo constante O(1), além de assegurar que as mensagens sejam mantidas na sequência exata de chegada.",
      "B) Migrar para a estrutura Vector, pois a sincronização interna dos métodos garante que as operações de remoção no início do vetor sejam executadas de forma paralela por múltiplas threads.",
      "C) Adotar a estrutura LinkedList, pois ela organiza os dados como uma cadeia de nós onde a remoção na primeira posição ajusta apenas os ponteiros do nó inicial, operando em tempo constante O(1).",
      "D) Configurar uma estrutura de TreeSet para manter as mensagens ordenadas pelo carimbo de data/hora (timestamp), reduzindo a complexidade de remoção para O(log n) devido ao balanceamento interno da árvore rubro-negra.",
      "E) Implementar a coleção HashMap mapeando o timestamp de cada mensagem como chave, o que zera a necessidade de deslocamento de elementos internos e garante a ordenação cronológica automática dos dados."
    ],
    answer: "C",
    feedback: "Enquanto o ArrayList exige o deslocamento (shift) de todos os elementos subsequentes ao remover do índice 0 (operação O(N)), o LinkedList simplesmente ajusta a referência do ponteiro 'head' para apontar ao próximo nó (operação O(1)), tornando-se altamente eficiente para remoções no início."
  },
  {
    id: 8,
    theme: "SOLID (Dependency Inversion Principle)",
    text: "Um software de folha de pagamento corporativo possui a classe ProcessadorHolerite, que instancia diretamente o objeto SmsEnvioLocaweb para disparar notificações automáticas de pagamento via SMS aos colaboradores. Quando a empresa decidiu alterar o fornecedor de serviços de mensageria para a Amazon SNS, a equipe percebeu que a lógica do processador de holerites continha dezenas de referências diretas à API concreta da Locaweb, exigindo uma refatoração em larga escala do código de negócio. Para evitar esse tipo de acoplamento em migrações tecnológicas futuras, qual princípio SOLID de orientação a objetos deve guiar a reestruturação desse módulo?",
    options: [
      "A) Aplicar o princípio do Encapsulamento, tornando todos os métodos da classe concreta de envio de SMS públicos e criando variáveis privadas para guardar a chave da API.",
      "B) Utilizar o Princípio Aberto/Fechado (OCP), criando uma subclasse de SmsEnvioLocaweb que estenda a lógica original para suportar o novo protocolo de rede do provedor concorrente.",
      "C) Empregar o Princípio de Segregação de Interfaces (ISP), dividindo os métodos de envio de mensagens em várias assinaturas para que a classe de negócio utilize apenas as funções básicas.",
      "D) Aplicar a Coesão Funcional de Classes, agrupando os dados de conexão de rede do servidor Locaweb e do provedor Amazon SNS no mesmo arquivo de configuração XML do sistema.",
      "E) Implementar a Inversão de Dependência (DIP), definindo uma interface genérica de notificação de SMS que a classe de negócio consome e que os provedores de infraestrutura implementam."
    ],
    answer: "E",
    feedback: "O Princípio de Inversão de Dependência (DIP) estabelece que módulos de alto nível não devem depender de módulos de baixo nível; ambos devem depender de abstrações. Ao depender de uma interface genérica (ex: SmsSender), o processador de holerites isola-se das implementações concretas dos fornecedores."
  },
  {
    id: 9,
    theme: "SOLID (Liskov Substitution Principle)",
    text: "Durante a construção de um framework de acesso a dados em Java, o desenvolvedor criou a superclasse abstrata RepositorioBase que declara os métodos comuns obterPorId(int id), inserir(T entidade) e excluir(int id). Mais tarde, para implementar um recurso de histórico imutável (logs que só podem ser inseridos e consultados, jamais excluídos ou modificados), o programador declarou a subclasse RepositorioConsultaLog estendendo RepositorioBase, porém sobrescreveu o método excluir(int id) para disparar uma UnsupportedOperationException. Esse comportamento causou falhas nos loops de sincronização automatizados do framework. A violação relatada refere-se diretamente a qual dos seguintes princípios de design de software?",
    options: [
      "A) Princípio da Responsabilidade Única (SRP), pois a classe filha passou a gerenciar tanto logs de leitura quanto logs de escrita na mesma estrutura de repositórios.",
      "B) Princípio de Inversão de Dependência (DIP), visto que a classe RepositorioConsultaLog depende de exceções de tempo de execução ao invés de depender de uma abstração estável.",
      "C) Princípio de Segregação de Interfaces (ISP), já que a classe de repositório de logs deveria declarar métodos adicionais para a formatação de relatórios fiscais do sistema.",
      "D) Princípio de Substituição de Liskov (LSP), pois a subclasse altera o comportamento esperado da superclasse ao lançar exceções inesperadas em operações válidas na classe base.",
      "E) Princípio Aberto/Fechado (OCP), pois a superclasse RepositorioBase deveria ser fechada para extensões que modifiquem a lógica interna dos métodos de exclusão lógica."
    ],
    answer: "D",
    feedback: "O Princípio de Substituição de Liskov (LSP) dita que os objetos de uma superclasse devem ser substituíveis por objetos de suas subclasses sem que isso afete a correção do programa. Ao alterar o comportamento de excluir() lançando uma exceção de operação não suportada, a subclasse quebra a expectativa e o contrato da classe base."
  },
  {
    id: 10,
    theme: "Threads e Coleções Concorrentes",
    text: "Um microsserviço de carteira digital processa transações simultâneas de milhares de usuários. Para controlar as operações ativas em tempo real, múltiplas threads de processamento de solicitações de transações lêem e escrevem chaves no mesmo mapa compartilhado. O desenvolvedor utilizou um objeto java.util.HashMap convencional. Em ambiente de produção sob alta carga concorrente, o sistema apresentou corrupção ocasional de dados e travamento severo da CPU por looping infinito. Sabendo que o HashMap não possui mecanismos internos de sincronização, qual é a solução recomendada para permitir alta concorrência de leitura e escrita com segurança de threads sem introduzir gargalos severos de desempenho global?",
    options: [
      "A) Encapsular a HashMap em um bloco synchronized no método de gravação de eventos, garantindo que apenas uma thread possa ler ou gravar na coleção por vez.",
      "B) Substituir a coleção por um ConcurrentHashMap, que realiza bloqueios parciais em segmentos da tabela (bucket-level locking), permitindo leituras simultâneas sem travamento global.",
      "C) Migrar a estrutura para uma ArrayList sincronizada via Collections.synchronizedList(), garantindo que as iterações de consulta de transações ocorram sem a necessidade de sincronizar a thread principal.",
      "D) Definir a HashMap com o modificador volatile na classe do processador, forçando a máquina virtual Java a gravar as atualizações diretamente na memória cache principal dos processadores físicos.",
      "E) Substituir a coleção por um TreeMap estruturado com ordenação por prioridade, pois a organização interna de busca binária evita conflitos de concorrência e reduz a colisão de hashes."
    ],
    answer: "B",
    feedback: "O ConcurrentHashMap fornece segurança de thread sem a penalidade de sincronização global (como no HashTable ou Collections.synchronizedMap). Ele usa bloqueio a nível de buckets (ou tabelas de locks segmentadas), permitindo que threads leiam e gravem em partes diferentes da tabela de dispersão simultaneamente."
  }
];

const DISCURSIVE_QUESTION = {
  theme: "Arquitetura, SOLID, Design Patterns e Estruturas de Dados",
  scenario: "A SafePay Fintech, uma plataforma em rápida expansão voltada para o processamento de pagamentos digitais em tempo real, enfrenta um gargalo de desempenho crítico em seu barramento de integração financeira. O sistema, desenvolvido em Java, processa milhões de transações por segundo oriundas de diversos canais (Pix, Cartão de Crédito, Boleto Bancário e transferências instantâneas). A classe principal, ProcessadorDeTransacoes, atua como um coordenador centralizado de todas as operações: ela é responsável por receber o payload bruto do evento, validar os dados de segurança contra fraudes, calcular taxas específicas do intermediador, gerar o comprovante fiscal em formato XML e, por fim, armazenar o registro consolidado em uma coleção interna do tipo ArrayList. Atualmente, o código dessa classe está estruturado com desvios condicionais encadeados (if-else e switch-case) baseados no tipo de transação recebida. À medida que novos meios de pagamento são introduzidos, os desenvolvedores precisam abrir e modificar diretamente a classe. Sob alta concorrência de múltiplas threads de rede, o sistema começou a apresentar exceções do tipo ConcurrentModificationException e lentidão excessiva devido à concorrência na ArrayList.",
  instructions: [
    "A) Diagnóstico de Arquitetura e SOLID: Aponte quais princípios de design de software orientados a objetos (SOLID) são violados na classe ProcessadorDeTransacoes e analise os riscos e impactos técnicos dessa arquitetura no ciclo de vida do software.",
    "B) Solução com Padrões de Projeto: Proponha a aplicação de um padrão de projeto comportamental e de um padrão de projeto criacional para isolar a lógica de cálculo de cada meio de pagamento e a criação dinâmica desses objetos, explicando como essa combinação aumenta a extensibilidade e o desacoplamento do código.",
    "C) Análise de Estruturas de Dados e Concorrência: Explique a inadequação da ArrayList no cenário concorrente apresentado. Sugira uma alternativa apropriada da biblioteca de concorrência do Java (Java Concurrency Framework) que resolva o problema de ConcurrentModificationException e otimize a taxa de transferência (throughput) sob concorrência de threads, justificando sua resposta com base no comportamento físico das coleções na memória.",
    "D) Visão Estratégica e Inovação na Engenharia de Software: Discuta de que forma a aplicação consciente desses padrões arquiteturais e de concorrência se alinha ao papel de um engenheiro de software pleno/sênior que atua estrategicamente para mitigar custos de manutenção e habilitar a inovação tecnológica na empresa."
  ]
};

// ─── STYLING OBJECTS ──────────────────────────────────────────────────────────

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
  successBg: "rgba(16, 185, 129, 0.1)",
  danger: "#EF4444",
  dangerBg: "rgba(239, 68, 68, 0.1)"
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    h > 0 ? String(h).padStart(2, "0") : null,
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0")
  ].filter(Boolean).join(":");
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function SimuladoN2() {
  const [step, setStep] = useState(0); // 0: Welcome, 1: Quiz, 2: Final Report
  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0); // 0-9: Objectives, 10: Discursive
  const [answers, setAnswers] = useState({}); // { [questionId]: "A" | "B" | ... }
  const [discursiveAnswer, setDiscursiveAnswer] = useState("");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "", "saving", "saved", "error"

  const timerRef = useRef(null);

  // Timer Control
  useEffect(() => {
    if (step === 1) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, activeQuestionIdx]);

  const handleStartExam = (e) => {
    e.preventDefault();
    if (name.trim() && registration.trim()) {
      setStep(1);
    }
  };

  const handleSelectOption = (qId, optionChar) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: optionChar
    }));
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(discursiveAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Grade Exam
  const totalQuestions = QUESTIONS.length;
  const correctCount = QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);
  const incorrectCount = totalQuestions - correctCount;
  const scorePercent = (correctCount / totalQuestions) * 100;
  const finalScore = (correctCount / totalQuestions) * 10.0;

  const handleFinishExam = async () => {
    // Basic validations
    const unansweredCount = QUESTIONS.filter(q => !answers[q.id]).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(`Você possui ${unansweredCount} questões objetivas sem resposta. Deseja finalizar assim mesmo?`);
      if (!confirmSubmit) return;
    } else if (!discursiveAnswer.trim()) {
      const confirmSubmit = window.confirm("Sua resposta discursiva está em branco. Deseja finalizar o simulado mesmo assim?");
      if (!confirmSubmit) return;
    } else {
      const confirmSubmit = window.confirm("Deseja realmente finalizar e entregar o simulado?");
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    setStep(2);
    setIsSubmitting(false);

    // Auto save to Firestore
    setSaveStatus("saving");
    try {
      await addDoc(collection(db, "fametro_simulado_n2"), {
        name: name.trim(),
        registration: registration.trim(),
        score: finalScore,
        correctCount,
        incorrectCount,
        performancePercentage: scorePercent,
        timeSpentSeconds: secondsElapsed,
        timeSpentFormatted: formatTime(secondsElapsed),
        answers,
        discursiveAnswer,
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp(),
        course: "Análise e Desenvolvimento de Sistemas",
        discipline: "Linguagem de Programação Orientada a Objetos",
        professor: "Alexsander Farias"
      });
      setSaveStatus("saved");
    } catch (err) {
      console.error("Erro ao salvar simulado no Firebase: ", err);
      setSaveStatus("error");
    }
  };

  // UI - Discursive line counter helper
  const calculateTextareaLines = () => {
    if (!discursiveAnswer) return 0;
    return discursiveAnswer.split("\n").length;
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: "'Inter', sans-serif",
      padding: "6rem 1.5rem 4rem",
      boxSizing: "border-box"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Nav Link back to Hub */}
        {step < 2 && (
          <Link to="/fametro" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: theme.textMuted,
            textDecoration: "none",
            fontSize: "0.9rem",
            marginBottom: "2rem",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.color = theme.white}
          onMouseLeave={(e) => e.target.style.color = theme.textMuted}
          >
            <ArrowLeft size={16} /> Voltar para o Hub
          </Link>
        )}

        {/* STEP 0: WELCOME SCREEN */}
        {step === 0 && (
          <div style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "24px",
            padding: "3rem 2rem",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              backgroundColor: theme.accentGlow,
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
              border: `1px solid ${theme.borderActive}`
            }}>
              <GraduationCap size={44} color={theme.accent} />
            </div>

            <div style={{ 
              fontSize: "0.8rem", 
              letterSpacing: "4px", 
              color: theme.accent, 
              fontWeight: 900, 
              marginBottom: "0.5rem" 
            }}>
              AVALIAÇÃO INSTITUCIONAL N2
            </div>

            <h1 style={{
              fontSize: "2.2rem",
              fontWeight: 900,
              color: theme.white,
              margin: "0 0 1.5rem",
              lineHeight: 1.2
            }}>
              Simulado Acadêmico · POO
            </h1>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
              fontSize: "0.95rem",
              color: theme.textMuted,
              lineHeight: 1.6
            }}>
              <div><strong>Curso:</strong> Análise e Desenvolvimento de Sistemas</div>
              <div><strong>Disciplina:</strong> Linguagem de Programação Orientada a Objetos</div>
              <div><strong>Professor:</strong> Alexsander Farias</div>
              <p style={{ marginTop: "1rem" }}>
                Este simulado avalia seus conhecimentos em conceitos avançados de POO, princípios SOLID, Padrões de Projeto (GoF), coleções eficientes em Java, multithreading, tratamento de eventos e arquitetura gráfica com Swing.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
              maxWidth: "600px",
              margin: "0 auto 3rem"
            }}>
              {[
                { label: "Questões Objetivas", val: "10 itens" },
                { label: "Questão Discursiva", val: "Estilo ENADE" },
                { label: "Nota Máxima", val: "10,0 pontos" },
                { label: "Controle de Tempo", val: "Cronômetro Ativo" }
              ].map(item => (
                <div key={item.label} style={{
                  background: theme.surfaceLight,
                  padding: "1rem",
                  borderRadius: "16px",
                  border: `1px solid ${theme.border}`
                }}>
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ fontSize: "1.05rem", color: theme.white, fontWeight: 700 }}>{item.val}</div>
                </div>
              ))}
            </div>

            {/* Login fields */}
            <form onSubmit={handleStartExam} style={{ maxWidth: "450px", margin: "0 auto", textAlign: "left" }}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: theme.white, fontWeight: 600, marginBottom: "6px" }}>
                  Nome Completo
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Digite seu nome..."
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: `1.5px solid ${theme.border}`,
                    background: "rgba(255,255,255,0.03)",
                    color: theme.white,
                    outline: "none",
                    boxSizing: "border-box",
                    fontSize: "0.95rem"
                  }}
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: theme.white, fontWeight: 600, marginBottom: "6px" }}>
                  Matrícula Acadêmica
                </label>
                <input 
                  type="text" 
                  required
                  value={registration}
                  onChange={e => setRegistration(e.target.value)}
                  placeholder="Número de matrícula..."
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: `1.5px solid ${theme.border}`,
                    background: "rgba(255,255,255,0.03)",
                    color: theme.white,
                    outline: "none",
                    boxSizing: "border-box",
                    fontSize: "0.95rem"
                  }}
                />
              </div>

              <button 
                type="submit" 
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "none",
                  background: theme.accent,
                  color: theme.white,
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: `0 8px 20px ${theme.accent}40`,
                  transition: "transform 0.2s, filter 0.2s"
                }}
                onMouseEnter={e => e.target.style.filter = "brightness(1.15)"}
                onMouseLeave={e => e.target.style.filter = "none"}
              >
                Iniciar Simulado N2 →
              </button>
            </form>
          </div>
        )}

        {/* STEP 1: EXAM IN PROGRESS */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "2rem", alignItems: "start" }}>
            
            {/* Left Side: Question content */}
            <div>
              {activeQuestionIdx < QUESTIONS.length ? (
                // Objective Question Card
                (() => {
                  const q = QUESTIONS[activeQuestionIdx];
                  const chosenOpt = answers[q.id];
                  return (
                    <div style={{
                      backgroundColor: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "20px",
                      padding: "2rem",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: theme.accent,
                          backgroundColor: theme.accentGlow,
                          padding: "4px 12px",
                          borderRadius: "20px",
                          border: `1px solid ${theme.borderActive}`
                        }}>
                          {q.theme}
                        </span>
                        <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>
                          Questão {activeQuestionIdx + 1} de {totalQuestions + 1}
                        </span>
                      </div>

                      <h2 style={{
                        fontSize: "1.15rem",
                        color: theme.white,
                        lineHeight: 1.6,
                        margin: "0 0 2rem",
                        fontWeight: 600
                      }}>
                        {q.text}
                      </h2>

                      {/* Options Grid */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {q.options.map(opt => {
                          const optionChar = opt.charAt(0); // A, B, C, D or E
                          const isSelected = chosenOpt === optionChar;

                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectOption(q.id, optionChar)}
                              style={{
                                textAlign: "left",
                                padding: "1.1rem 1.4rem",
                                borderRadius: "14px",
                                border: `1.5px solid ${isSelected ? theme.borderActive : theme.border}`,
                                backgroundColor: isSelected ? theme.accentGlow : "transparent",
                                color: isSelected ? theme.white : theme.text,
                                fontSize: "0.9rem",
                                lineHeight: 1.5,
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={e => {
                                if (!isSelected) {
                                  e.target.style.borderColor = "rgba(255,255,255,0.2)";
                                  e.target.style.backgroundColor = "rgba(255,255,255,0.01)";
                                }
                              }}
                              onMouseLeave={e => {
                                if (!isSelected) {
                                  e.target.style.borderColor = theme.border;
                                  e.target.style.backgroundColor = "transparent";
                                }
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              ) : (
                // Discursive Question Card
                <div style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "20px",
                  padding: "2rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#FBBF24",
                      backgroundColor: "rgba(251, 191, 36, 0.1)",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      border: "1px solid rgba(251, 191, 36, 0.2)"
                    }}>
                      Estilo ENADE · Discursiva
                    </span>
                    <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>
                      Questão {totalQuestions + 1} de {totalQuestions + 1}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: theme.white, margin: "0 0 1rem" }}>
                    Caso de Estudo: Plataforma SafePay Fintech
                  </h3>

                  <p style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: theme.textMuted,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    padding: "1.25rem",
                    borderRadius: "12px",
                    border: `1px solid ${theme.border}`,
                    fontStyle: "italic",
                    margin: "0 0 2rem"
                  }}>
                    "{DISCURSIVE_QUESTION.scenario}"
                  </p>

                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: theme.white, marginBottom: "1rem" }}>
                    TÓPICOS DE ARGUMENTAÇÃO OBRIGATÓRIOS:
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                    {DISCURSIVE_QUESTION.instructions.map(inst => (
                      <div key={inst.slice(0, 2)} style={{
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        color: theme.text,
                        paddingLeft: "12px",
                        borderLeft: `3px solid ${theme.accent}`
                      }}>
                        {inst}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "0.85rem", color: theme.white, fontWeight: 600 }}>
                        Texto de Resposta do Estudante (mínimo de 30 linhas recomendado)
                      </label>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        color: calculateTextareaLines() >= 30 ? theme.success : theme.textMuted,
                        fontWeight: 600
                      }}>
                        Linhas: {calculateTextareaLines()} | Palavras: {discursiveAnswer ? discursiveAnswer.trim().split(/\s+/).length : 0}
                      </span>
                    </div>

                    <textarea
                      value={discursiveAnswer}
                      onChange={e => setDiscursiveAnswer(e.target.value)}
                      placeholder="Escreva sua dissertação-argumentativa fundamentando tecnicamente as soluções com base nos princípios de POO, SOLID, Design Patterns e Estruturas de Dados Java..."
                      style={{
                        width: "100%",
                        height: "300px",
                        padding: "1.25rem",
                        borderRadius: "14px",
                        border: `1.5px solid ${calculateTextareaLines() >= 30 ? theme.success : theme.border}`,
                        background: "rgba(0, 0, 0, 0.2)",
                        color: theme.white,
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        outline: "none",
                        boxSizing: "border-box",
                        resize: "vertical",
                        fontFamily: "monospace"
                      }}
                    />
                  </div>

                  {calculateTextareaLines() < 30 && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#FBBF24",
                      fontSize: "0.8rem",
                      backgroundColor: "rgba(251, 191, 36, 0.05)",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(251, 191, 36, 0.1)"
                    }}>
                      <AlertTriangle size={14} /> Recomendamos desenvolver mais sua argumentação para atingir o mínimo de 30 linhas.
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Controls */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.5rem"
              }}>
                <button
                  disabled={activeQuestionIdx === 0}
                  onClick={() => setActiveQuestionIdx(idx => idx - 1)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${theme.border}`,
                    color: activeQuestionIdx === 0 ? "rgba(255,255,255,0.2)" : theme.white,
                    padding: "12px 24px",
                    borderRadius: "12px",
                    cursor: activeQuestionIdx === 0 ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => { if (activeQuestionIdx !== 0) e.target.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { if (activeQuestionIdx !== 0) e.target.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  <ChevronLeft size={18} /> Anterior
                </button>

                {activeQuestionIdx < QUESTIONS.length ? (
                  <button
                    onClick={() => setActiveQuestionIdx(idx => idx + 1)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: theme.accent,
                      border: "none",
                      color: theme.white,
                      padding: "12px 24px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      boxShadow: `0 4px 12px ${theme.accent}20`
                    }}
                  >
                    Próxima <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishExam}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: theme.success,
                      border: "none",
                      color: theme.white,
                      padding: "12px 28px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      boxShadow: `0 4px 15px ${theme.success}30`
                    }}
                  >
                    Entregar Simulado <Send size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Side: Quick Navigation Panel & Timer */}
            <div style={{
              position: "sticky",
              top: "7rem"
            }}>
              
              {/* Timer Widget */}
              <div style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "20px",
                padding: "1.25rem",
                textAlign: "center",
                marginBottom: "1.5rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  color: theme.textMuted,
                  marginBottom: "4px"
                }}>
                  <Clock size={14} /> TEMPO DECORRIDO
                </div>
                <div style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: theme.white,
                  fontFamily: "monospace"
                }}>
                  {formatTime(secondsElapsed)}
                </div>
              </div>

              {/* Navigation Grid */}
              <div style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}>
                <h3 style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: theme.white,
                  marginTop: 0,
                  marginBottom: "1rem",
                  borderBottom: `1px solid ${theme.border}`,
                  paddingBottom: "8px"
                }}>
                  Navegação do Exame
                </h3>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  marginBottom: "1.5rem"
                }}>
                  {QUESTIONS.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isActive = activeQuestionIdx === idx;
                    
                    let bg = "rgba(255,255,255,0.03)";
                    let color = theme.textMuted;
                    let border = `1px solid ${theme.border}`;

                    if (isAnswered) {
                      border = `1px solid ${theme.borderActive}`;
                      color = theme.accent;
                      bg = "rgba(59, 130, 246, 0.05)";
                    }
                    if (isActive) {
                      bg = theme.accent;
                      color = theme.white;
                      border = `1px solid ${theme.accent}`;
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIdx(idx)}
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: "10px",
                          border,
                          backgroundColor: bg,
                          color,
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          transition: "all 0.1s"
                        }}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>

                {/* Discursive Button Navigation */}
                <button
                  onClick={() => setActiveQuestionIdx(QUESTIONS.length)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: activeQuestionIdx === QUESTIONS.length 
                      ? "1px solid #FBBF24"
                      : discursiveAnswer.trim()
                        ? "1px solid rgba(251, 191, 36, 0.4)"
                        : `1px solid ${theme.border}`,
                    backgroundColor: activeQuestionIdx === QUESTIONS.length
                      ? "#FBBF24"
                      : discursiveAnswer.trim()
                        ? "rgba(251, 191, 36, 0.05)"
                        : "rgba(255,255,255,0.02)",
                    color: activeQuestionIdx === QUESTIONS.length
                      ? "#000000"
                      : discursiveAnswer.trim()
                        ? "#FBBF24"
                        : theme.text,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  Questão Discursiva
                </button>

                {/* Legend */}
                <div style={{
                  marginTop: "1.5rem",
                  fontSize: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  color: theme.textMuted
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.textMuted }} /> Não respondido
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.accent }} /> Respondido
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FBBF24" }} /> Discursiva
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* STEP 2: PERFORMANCE REPORT (FINAL RESULTS) */}
        {step === 2 && (
          <div style={{ animation: "fadeIn 0.6s ease-out" }}>
            
            {/* Header Dashboard Card */}
            <div style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "24px",
              padding: "2.5rem 2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              marginBottom: "2rem"
            }}>
              
              <div style={{ fontSize: "50px", marginBottom: "0.5rem" }}>🎓</div>
              
              <h2 style={{
                fontSize: "1.8rem",
                fontWeight: 900,
                color: theme.white,
                margin: "0 0 6px"
              }}>
                Simulado Concluído!
              </h2>
              
              <p style={{ color: theme.textMuted, fontSize: "0.95rem", margin: "0 0 2rem" }}>
                Parabéns, <strong>{name}</strong> (Matrícula: {registration}). Seu resultado foi consolidado com sucesso.
              </p>

              {/* Performance Indicator Ring/Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1.5rem",
                maxWidth: "800px",
                margin: "0 auto 2rem"
              }}>
                
                {[
                  { 
                    label: "Nota Objetiva Final", 
                    val: `${finalScore.toFixed(1)} / 10.0`, 
                    color: finalScore >= 7.0 ? theme.success : finalScore >= 4.0 ? "#FBBF24" : theme.danger 
                  },
                  { 
                    label: "Acertos", 
                    val: `${correctCount} / ${totalQuestions}`, 
                    color: theme.success 
                  },
                  { 
                    label: "Tempo Gasto", 
                    val: formatTime(secondsElapsed), 
                    color: theme.white 
                  },
                  { 
                    label: "Desempenho", 
                    val: `${scorePercent.toFixed(0)}%`, 
                    color: scorePercent >= 70 ? theme.success : scorePercent >= 40 ? "#FBBF24" : theme.danger 
                  }
                ].map(item => (
                  <div key={item.label} style={{
                    background: "rgba(0, 0, 0, 0.15)",
                    border: `1px solid ${theme.border}`,
                    padding: "1.25rem",
                    borderRadius: "16px"
                  }}>
                    <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "6px" }}>{item.label}</div>
                    <div style={{ fontSize: "1.4rem", color: item.color, fontWeight: 900 }}>{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Database status alert */}
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                {saveStatus === "saving" && (
                  <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>Salvando tentativa no banco de dados...</div>
                )}
                {saveStatus === "saved" && (
                  <div style={{ fontSize: "0.8rem", color: theme.success }}>✓ Nota registrada e integrada ao ranking da turma.</div>
                )}
                {saveStatus === "error" && (
                  <div style={{ fontSize: "0.8rem", color: theme.danger }}>⚠ Falha de conexão com o banco. Você ainda pode imprimir o relatório abaixo.</div>
                )}
              </div>

              {/* Print and Export Buttons */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "2rem"
              }}>
                <button
                  onClick={handlePrint}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: `1px solid ${theme.border}`,
                    color: theme.white,
                    padding: "10px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.target.style.backgroundColor = "rgba(255,255,255,0.05)"}
                >
                  <Printer size={16} /> Imprimir Comprovante
                </button>
              </div>

            </div>

            {/* Discursive Response Output Panel (for proof/copying) */}
            <div style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme.white, margin: 0 }}>
                  Comprovante de Resposta Discursiva
                </h3>
                <button
                  onClick={handleCopyText}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: copied ? theme.successBg : "rgba(255,255,255,0.05)",
                    border: `1px solid ${copied ? theme.success : theme.border}`,
                    color: copied ? theme.success : theme.white,
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: 600
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copiado!" : "Copiar Texto"}
                </button>
              </div>

              <div style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: "1.25rem",
                borderRadius: "12px",
                border: `1px solid ${theme.border}`,
                color: theme.text,
                fontSize: "0.9rem",
                lineHeight: 1.6,
                maxHeight: "250px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                textAlign: "left"
              }}>
                {discursiveAnswer || "(O estudante não inseriu resposta textual para a questão discursiva)."}
              </div>

              <div style={{
                marginTop: "1rem",
                fontSize: "0.75rem",
                color: theme.textMuted,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <FileText size={14} /> Envie o texto copiado acima ao Professor Alexsander Farias conforme instruído em sala de aula para a avaliação discursiva.
              </div>
            </div>

            {/* Live Feedback breakdown for Objective questions */}
            <div style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}>
              
              <h3 style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: theme.white,
                marginTop: 0,
                marginBottom: "2rem",
                borderBottom: `1px solid ${theme.border}`,
                paddingBottom: "10px",
                textAlign: "left"
              }}>
                Gabarito Comentado e Correção das Questões
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {QUESTIONS.map((q, idx) => {
                  const userAns = answers[q.id];
                  const isRight = userAns === q.answer;

                  return (
                    <div 
                      key={q.id} 
                      style={{
                        padding: "1.5rem",
                        borderRadius: "16px",
                        border: `1.5px solid ${isRight ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                        backgroundColor: isRight ? "rgba(16, 185, 129, 0.02)" : "rgba(239, 68, 68, 0.02)",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: theme.white }}>
                          Questão {idx + 1} · {q.theme}
                        </span>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {isRight ? (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: theme.success,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              backgroundColor: theme.successBg,
                              padding: "4px 8px",
                              borderRadius: "6px"
                            }}>
                              <CheckCircle size={12} /> Correta
                            </span>
                          ) : (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: theme.danger,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              backgroundColor: theme.dangerBg,
                              padding: "4px 8px",
                              borderRadius: "6px"
                            }}>
                              <XCircle size={12} /> Incorreta
                            </span>
                          )}
                        </div>
                      </div>

                      <p style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: theme.text,
                        margin: "0 0 1.5rem"
                      }}>
                        {q.text}
                      </p>

                      {/* Display of answers chosen vs correct */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        fontSize: "0.85rem",
                        marginBottom: "1.25rem",
                        color: theme.textMuted
                      }}>
                        <div>
                          <strong>Sua Resposta:</strong>{" "}
                          <span style={{ 
                            color: isRight ? theme.success : theme.danger, 
                            fontWeight: 700 
                          }}>
                            {userAns ? `${userAns})` : "Sem Resposta"}
                          </span>
                        </div>
                        {!isRight && (
                          <div>
                            <strong>Gabarito Oficial:</strong>{" "}
                            <span style={{ color: theme.success, fontWeight: 700 }}>
                              {q.answer})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Feedback Comment */}
                      <div style={{
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                        backgroundColor: "rgba(255,255,255,0.02)",
                        padding: "1rem",
                        borderRadius: "10px",
                        border: `1px solid ${theme.border}`,
                        color: theme.text
                      }}>
                        <strong style={{ color: theme.white, display: "block", marginBottom: "4px" }}>Justificativa Técnica:</strong>
                        {q.feedback}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Retry button link */}
              <div style={{ marginTop: "3rem", textAlign: "center" }}>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: theme.textMuted,
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Fazer o simulado novamente
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
      
      {/* Dynamic Keyframes injected locally */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          /* Hide non-printable elements */
          a, button, nav, .App-header, style {
            display: none !important;
          }
          div[style*="min-height"] {
            padding: 0 !important;
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          div[style*="max-width"] {
            max-width: 100% !important;
          }
          div[style*="background-color: rgb(15, 23, 42)"],
          div[style*="background-color: rgba(30, 41, 59"] {
            background: #ffffff !important;
            border: 1px solid #000000 !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

    </div>
  );
}
