import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── QUESTIONS BANK — 15 situação-problema questions SO Unidade 1 ─────────────
const QUESTIONS = [
  {
    id: 1, stage: "3.4.1 — Nível 1", type: "Conceito Fundamental",
    context: "Você está no trabalho usando o computador: o Spotify toca música, o Word está aberto com seu relatório, o antivírus roda em segundo plano, e você ainda navega na internet. Nada disso interfere entre si.",
    q: "O que é um Sistema Operacional e qual sua principal função nesse cenário do dia a dia?",
    opts: [
      "Um aplicativo especial que organiza os arquivos em pastas e facilita o acesso às músicas e documentos do usuário",
      "Software que gerencia o hardware e age como interface entre os aplicativos (Spotify, Word, antivírus) e o hardware do computador, alocando CPU, memória e E/S para cada processo sem conflito",
      "O conjunto de todos os programas instalados no computador, incluindo jogos, editores de texto e navegadores web",
      "O firmware gravado na placa-mãe que inicializa o computador antes do sistema operacional ser carregado"
    ],
    ans: 1,
    feedback: "✅ Correto! O SO é o gerente de recursos do computador — aloca CPU entre processos, controla o acesso à memória, gerencia dispositivos de E/S e fornece uma camada de abstração para que os aplicativos não precisem saber como o hardware funciona diretamente.",
    xp: 100
  },
  {
    id: 2, stage: "3.4.1 — Nível 2", type: "História dos SOs",
    context: "Em uma palestra sobre evolução tecnológica, o professor mostra que nos anos 1950 os programadores precisavam reservar todo o laboratório do mainframe para executar uma tarefa. Em 1969, o Unix surgiu permitindo que vários usuários trabalhassem simultaneamente no mesmo computador.",
    q: "Qual foi a grande inovação técnica da 3ª geração de SOs (1965-1980) que tornou isso possível?",
    opts: [
      "A invenção do mouse e da interface gráfica (GUI), que eliminou a necessidade de cartões perfurados para cada operação",
      "A criação do sistema em lote (batch), onde operadores empilhavam jobs em sequência e o mainframe os executava automaticamente sem intervenção humana",
      "A multiprogramação e o time-sharing: múltiplos programas ficavam na memória, e a CPU era dividida em fatias de tempo entre usuários/processos simultâneos",
      "O surgimento dos PCs pessoais como MS-DOS e Windows, que democratizaram o acesso ao computador para usuários domésticos"
    ],
    ans: 2,
    feedback: "✅ Exato! A 3ª geração trouxe multiprogramação e time-sharing. Com time-sharing, a CPU divide seu tempo em fatias (time slices) entre os usuários. Cada usuário tem a ilusão de ter o computador só para si — base do Unix (1969) e de praticamente todos os SOs modernos como Linux, macOS e Windows.",
    xp: 110
  },
  {
    id: 3, stage: "3.4.1 — Nível 3", type: "Funções e Modos de Acesso",
    context: "Um desenvolvedor web está criando um sistema bancário. Quando um cliente acessa seu saldo, o aplicativo precisa ler dados do banco de dados no disco. O gerente de TI questiona: como garantir que esse aplicativo não consiga acessar os dados dos outros clientes na memória?",
    q: "Qual mecanismo fundamental dos SOs modernos garante esse isolamento e proteção entre processos?",
    opts: [
      "A criptografia automática de todos os dados na memória RAM, que impede leitura não autorizada por outros processos",
      "A separação entre Modo Usuário e Modo Núcleo (Kernel): apps rodam em modo restrito e só acessam hardware via system calls controladas pelo kernel, que valida permissões",
      "O sistema de senhas do sistema operacional, que exige autenticação toda vez que um processo tenta ler um arquivo",
      "O servidor de banco de dados que gerencia sozinho todas as permissões de acesso, sem precisar do SO"
    ],
    ans: 1,
    feedback: "✅ Perfeito! A separação Modo Usuário × Modo Núcleo é implementada em hardware (anéis de proteção da CPU). Aplicativos rodam em modo restrito e não podem acessar diretamente memória de outros processos ou hardware. Toda operação privilegiada exige uma system call — o kernel valida, executa e retorna o resultado.",
    xp: 120
  },
  {
    id: 4, stage: "3.4.2 — Nível 4", type: "SOs Monoprogramáveis",
    context: "Um técnico precisa usar um software antigo de gestão de estoques que só roda em MS-DOS. Ele percebe que enquanto o sistema processa um relatório demorado, o computador fica completamente inutilizado — impossível fazer qualquer outra coisa durante esse tempo.",
    q: "Por que o MS-DOS (sistema monoprogramável) desperdiça recursos de maneira tão significativa?",
    opts: [
      "Porque o MS-DOS não tinha memória RAM suficiente para executar dois programas ao mesmo tempo na época",
      "Porque o sistema monoprogramável executa apenas um processo por vez — enquanto esse processo aguarda E/S (acesso ao disco), a CPU fica completamente ociosa sem nenhum outro processo para usar esse tempo",
      "Porque a CPU dos anos 1980 era muito lenta e não conseguia processar mais de um programa ao mesmo tempo fisicamente",
      "Porque o MS-DOS não tinha sistema de arquivos eficiente, tornando as operações de leitura extremamente lentas"
    ],
    ans: 1,
    feedback: "✅ Correto! O grande problema dos SOs monoprogramáveis é a ociosidade da CPU. Operações de disco são 1.000× mais lentas que a CPU. Em um monoprogramável, enquanto o programa aguarda o disco, a CPU fica parada — 100% de desperdício. A multiprogramação resolve isso colocando outro processo para usar a CPU durante a espera.",
    xp: 120
  },
  {
    id: 5, stage: "3.4.2 — Nível 5", type: "SOs Multiprogramáveis",
    context: "Um banco usa Linux para processar pagamentos PIX. Às 3h da manhã, roda um processo batch que processa lotes de transações do dia. Às 9h, centenas de funcionários usam o sistema simultâneamente. Em uma emergência, um processo de alta prioridade processa alertas de fraude em milissegundos.",
    q: "Quais são os TRÊS tipos de SOs multiprogramáveis representados respectivamente nesse cenário bancário?",
    opts: [
      "Real-time, Time-sharing e Batch — nessa ordem para o banco noturno, funcionários e alertas",
      "Batch (processamento noturno em lote), Time-sharing (múltiplos funcionários com fatias de CPU) e Tempo Real (alertas de fraude com resposta determinística garantida)",
      "Monoprogramável, Multiprogramável e Multiprocessado — evolução cronológica dos sistemas",
      "Servidor, Desktop e Embarcado — classificação por tipo de hardware onde cada SO é instalado"
    ],
    ans: 1,
    feedback: "✅ Exato! Batch: processa jobs em lote sem interação (processamento noturno). Time-sharing: divide CPU em time slices para múltiplos usuários simultâneos (funcionários). Tempo Real: garante resposta em tempo determinístico — crítico para alertas de fraude onde atraso pode significar prejuízo financeiro.",
    xp: 130
  },
  {
    id: 6, stage: "3.4.2 — Nível 6", type: "Múltiplos Processadores",
    context: "Um engenheiro analisa um chip Snapdragon 8 Gen 3 de smartphone moderno: 4 núcleos grandes (3.3 GHz para apps pesados) e 4 núcleos pequenos (2.3 GHz para tarefas leves). O SO decide automaticamente qual núcleo executa cada tarefa.",
    q: "Esse design representa qual arquitetura de sistemas com múltiplos processadores, e qual é seu desafio principal para o SO?",
    opts: [
      "Cluster (máquinas separadas trabalhando juntas em rede) — o desafio é a latência entre os nós do cluster",
      "NUMA (Non-Uniform Memory Access) — o desafio é garantir que cada núcleo acesse a memória mais próxima fisicamente",
      "Multicore (vários núcleos no mesmo chip) com big.LITTLE — o SO deve escalonar inteligentemente para balancear performance × consumo de energia, evitando condições de corrida entre núcleos",
      "SMP (Symmetric Multiprocessing) — todos os núcleos são iguais e o desafio é apenas dividir os processos igualmente"
    ],
    ans: 2,
    feedback: "✅ Correto! É uma arquitetura Multicore com big.LITTLE (performance cores + efficiency cores). O SO precisa: (1) escalonar tarefas pesadas nos P-cores e leves nos E-cores para economizar bateria, (2) evitar condições de corrida quando dois núcleos tentam modificar a mesma variável, (3) manter sincronização com mecanismos como mutexes e semáforos.",
    xp: 140
  },
  {
    id: 7, stage: "3.4.3 — Nível 7", type: "Hierarquia de Memória",
    context: "Uma engenheira de performance analisa por que um algoritmo de ordenação sobre arrays é 10× mais rápido do que um sobre listas encadeadas (linked lists), mesmo ambos fazendo a mesma quantidade de operações matemáticas.",
    q: "Qual conceito de hierarquia de memória explica essa diferença drástica de performance?",
    opts: [
      "Arrays usam memória RAM de categoria superior, enquanto listas encadeadas usam a memória virtual no disco, o que as torna muito mais lentas",
      "Localidade Espacial: arrays armazenam elementos contíguos na memória — o cache pré-carrega blocos adjacentes (cache hit). Listas encadeadas espalhadas na memória causam cache miss a cada acesso, forçando idas à RAM (200× mais lenta que o cache L1)",
      "O compilador otimiza automaticamente arrays para usar registradores da CPU, enquanto listas encadeadas são sempre processadas na RAM principal",
      "Arrays são estruturas de dados mais simples, por isso o SO aloca mais memória cache para eles automaticamente"
    ],
    ans: 1,
    feedback: "✅ Brilhante! Localidade Espacial: quando você acessa array[i], o cache carrega array[i+1], array[i+2]... automaticamente. Na próxima iteração: cache hit! Listas encadeadas têm nós espalhados aleatoriamente na memória — cada next->node é um cache miss, forçando acesso à RAM. Cache miss pode fazer a CPU esperar 200× mais ciclos.",
    xp: 150
  },
  {
    id: 8, stage: "3.4.3 — Nível 8", type: "Cache e Memória",
    context: "Um programador está otimizando um sistema de processamento de imagens que percorre uma matriz 4K (3840×2160 pixels) aplicando filtros. Ele tem duas versões: Versão A percorre linha por linha (row-major). Versão B percorre coluna por coluna (column-major).",
    q: "Por que a Versão A é sistematicamente mais rápida, considerando como a hierarquia de memória funciona?",
    opts: [
      "A Versão A usa menos memória RAM no total porque percorre a matriz de forma mais eficiente matematicamente",
      "A Versão B usa mais núcleos da CPU automaticamente, criando conflitos de acesso e tornando-a mais lenta",
      "Matrizes em C são armazenadas em row-major order — linha por linha contígua na memória. A Versão A gera cache hits consecutivos. A Versão B acessa posições de memória distantes a cada elemento (pula linhas inteiras): cache misses constantes",
      "A Versão A é compilada com otimizações automáticas do compilador que a Versão B não recebe"
    ],
    ans: 2,
    feedback: "✅ Perfeito! Em row-major (C/C++/Java arrays): matrix[0][0], [0][1], [0][2]... são contíguos na memória. Percorrer linha por linha = cache hits. Percorrer coluna por coluna = matrix[0][0], [1][0], [2][0]... = pulos de 3840 elementos entre acessos = cache misses constantes. Para uma imagem 4K, isso multiplica o tempo de processamento por 5-10×.",
    xp: 160
  },
  {
    id: 9, stage: "3.4.4 — Nível 9", type: "Dispositivos de E/S e Drivers",
    context: "Uma empresa compra uma impressora industrial nova de uma marca nunca utilizada antes. Ao conectar no Windows, o sistema mostra 'driver não encontrado'. Após instalar o driver fornecido pelo fabricante, a impressora funciona perfeitamente.",
    q: "O que é um driver e por que sem ele o SO não consegue se comunicar com o novo hardware?",
    opts: [
      "Driver é um software de segurança que verifica se o hardware conectado não contém vírus antes de permitir seu uso pelo sistema operacional",
      "Driver é o tradutor entre o SO e o hardware específico — o SO envia comandos genéricos (imprimir página), o driver traduz para os comandos específicos que a impressora industrial entende (protocolos, registradores, sequências de controle)",
      "Driver é apenas um arquivo de configuração que registra o nome do dispositivo no sistema — sem ele, o hardware funciona mas não aparece no Gerenciador de Dispositivos",
      "Driver é um firmware que fica gravado na própria impressora e é carregado automaticamente quando conectada ao computador"
    ],
    ans: 1,
    feedback: "✅ Exato! O driver é a camada de software que conhece os detalhes específicos do hardware. O SO envia comandos abstratos ('imprimir com resolução 300dpi'), o driver traduz para os registradores e protocolos específicos da impressora (ex: PCL6, PostScript). Sin o driver, o SO simplesmente não sabe como 'falar' com esse hardware específico.",
    xp: 150
  },
  {
    id: 10, stage: "3.4.4 — Nível 10", type: "DMA e Barramento",
    context: "Um analista compara dois sistemas: Sistema A faz streaming de vídeo 4K usando DMA para transferir dados do disco NVMe para a memória. Sistema B usa um sistema mais antigo onde a CPU transfere manualmente cada bloco de dados do disco para a RAM enquanto decodifica o vídeo.",
    q: "Por que o Sistema A consegue rodar o vídeo 4K com CPU idle de 90%, enquanto o Sistema B luta com CPU a 100% e ainda engasga?",
    opts: [
      "O disco NVMe do Sistema A é simplesmente 10× mais rápido, por isso a CPU tem tempo livre enquanto espera o dado chegar",
      "O DMA (Direct Memory Access) do Sistema A transfere dados do disco diretamente para a RAM sem envolver a CPU em cada byte — a CPU só é interrompida UMA VEZ ao final. No Sistema B, a CPU gerencia cada transferência manualmente, ficando sem tempo para decodificar o vídeo",
      "O Sistema A usa mais núcleos de CPU dedicados especificamente à transferência de dados de disco, liberando outros núcleos para o vídeo",
      "O Sistema A usa compressão automática durante a transferência, reduzindo a quantidade de dados que precisam ser movidos para a RAM"
    ],
    ans: 1,
    feedback: "✅ Excelente! DMA é fundamental para performance em multimídia. O controlador DMA recebe da CPU: endereço de origem (disco), destino (RAM) e tamanho. A CPU fica completamente livre. Ao terminar, o DMA gera UMA interrupção — a CPU pode usar 100% do seu tempo decodificando vídeo enquanto o DMA cuida das transferências em paralelo.",
    xp: 160
  },
  {
    id: 11, stage: "3.4.4 — Nível 11", type: "Barramento e Pipelining",
    context: "Um servidor de banco de dados precisa aumentar a vazão de dados entre a GPU (para IA) e a memória RAM. O CTO compara: Barramento antigo PCIe x4 ou upgrade para PCIe x16. Com barramento de 64 bits.",
    q: "O que determina a capacidade de transferência de um barramento e por que o PCIe x16 é superior para esse cenário?",
    opts: [
      "A frequência do processador é que determina a velocidade do barramento — um CPU mais rápido automaticamente faz o barramento transferir dados mais rapidamente",
      "O número de pistas (lanes) do PCIe multiplica a largura banda: 4 pistas ×16 = 4× mais dados por ciclo. Barramento mais largo = mais dados transferidos por ciclo de clock, reduzindo o gargalo entre GPU e RAM para processamento de IA",
      "O barramento PCIe x16 tem clock mais alto que o x4, por isso transfere dados mais rapidamente em cada ciclo de clock",
      "O PCIe x16 usa criptografia mais eficiente que reduz o tamanho dos pacotes de dados, permitindo mais dados por segundo"
    ],
    ans: 1,
    feedback: "✅ Correto! O barramento tem 3 componentes: dados (largura), endereços e controle. A largura do barramento de dados determina quantos bits são transferidos por ciclo. PCIe x16 tem 16 lanes paralelas vs 4 no x4 — literalmente 4× mais largura de banda por ciclo. Para IA processando matrizes gigantes, esse gargalo entre GPU e RAM é crítico.",
    xp: 160
  },
  {
    id: 12, stage: "3.4.4 — Nível 12", type: "Pipelining da CPU",
    context: "Um microarquiteto explica para sua equipe por que um processador moderno consegue iniciar uma nova instrução em cada ciclo de clock, mesmo que cada instrução individualmente leve 5 ciclos para completar.",
    q: "Qual técnica permite essa sobreposição de instruções e quais são seus 5 estágios clássicos?",
    opts: [
      "Superescalar: a CPU duplica todos os componentes internos para executar 2 instruções completamente ao mesmo tempo em paralelo",
      "Cache prefetching: a CPU carrega as próximas instruções antecipadamente para a cache L1 para que estejam prontas antes de serem necessárias",
      "Pipelining: divide a execução em estágios (Busca → Decodifica → Executa → Acessa Memória → Escreve Resultado). Enquanto instrução 1 está no estágio Executa, instrução 2 já está no Decodifica e instrução 3 no Busca — overlap total",
      "Branch Prediction: a CPU prevê qual instrução virá depois de um desvio condicional e a pré-executa, aproveitando ciclos ociosos"
    ],
    ans: 2,
    feedback: "✅ Perfeito! Pipeline é como uma linha de montagem de carros: enquanto carro 3 é pintado, carro 4 recebe motor, carro 5 recebe chassi — tudo simultâneo. Os 5 estágios clássicos: (1) Fetch: busca instrução, (2) Decode: interpreta, (3) Execute: calcula, (4) Memory: acessa RAM se necessário, (5) Write-back: salva resultado no registrador. Hazards (data/control) são o principal desafio.",
    xp: 170
  },
  {
    id: 13, stage: "3.4.5 — Nível 13", type: "Compilador vs Interpretador",
    context: "Duas equipes desenvolvem o mesmo sistema de análise financeira: Equipe A usa C++ (compilado), Equipe B usa Python (interpretado). Em produção, o sistema da Equipe A processa 1 milhão de registros em 2 segundos; o da Equipe B leva 45 segundos.",
    q: "Por que essa diferença existe e quando Python seria a escolha mais adequada apesar da lentidão?",
    opts: [
      "C++ usa mais memória RAM que Python, o que permite processar mais dados ao mesmo tempo e por isso é mais rápido",
      "C++ compilado traduz TODO o código para linguagem de máquina uma única vez — executa diretamente na CPU. Python interpreta linha por linha em runtime — traduz+executa cada linha toda vez. Python compensa com produtividade, prototipagem rápida, bibliotecas de IA/ML (NumPy/TensorFlow com C por baixo)",
      "Python é sempre mais lento porque é uma linguagem de script, não uma linguagem de programação real como C++",
      "C++ é mais rápido porque compila para um arquivo .exe menor que cabe melhor na cache da CPU"
    ],
    ans: 1,
    feedback: "✅ Exato! Compilado (C++): o compilador analisa TODO o código, otimiza, e gera código de máquina nativo — roda diretamente na CPU. Interpretado (Python): para cada linha em runtime: analisa → traduz → executa. Overhead enorme. MAS Python é ideal para: prototipagem rápida, scripting, IA/ML (NumPy usa C internamente), quando performance não é crítica.",
    xp: 170
  },
  {
    id: 14, stage: "3.4.5 — Nível 14", type: "Linker e Loader",
    context: "Um estudante compila seu projeto Java: javac Main.java gera Main.class. Depois roda java Main e o programa executa. Um colega pergunta o que acontece entre o arquivo .class e o programa rodando na memória.",
    q: "Quais são as funções do Linker e do Loader nesse processo, e como o Java difere do processo tradicional C/C++?",
    opts: [
      "O Linker verifica se o código tem erros de sintaxe e o Loader converte o Java em C++ que a CPU consegue executar",
      "Linker: une Main.class com bibliotecas Java (rt.jar) resolvendo referências entre módulos. Loader: carrega o bytecode para a RAM e ajusta endereços. A JVM então compila JIT partes críticas para código nativo — híbrido compilado+interpretado, diferente do C que gera código nativo diretamente",
      "Em Java, o Linker e o Loader não existem — a JVM faz tudo automaticamente sem precisar desses componentes separados",
      "Linker e Loader são exclusivos de C/C++ — Java usa um processo completamente diferente chamado de bytecode linking que ocorre automaticamente"
    ],
    ans: 1,
    feedback: "✅ Excelente! Processo C: código-fonte → compilador → .o (objeto) → Linker (+bibliotecas) → executável → Loader (RAM) → execução. Java: .java → javac → .class (bytecode) → Loader carrega para JVM → JIT compila partes críticas para código nativo. JIT = Just-In-Time: métodos chamados frequentemente são compilados para código de máquina em runtime — Java moderno é surpreendentemente rápido!",
    xp: 180
  },
  {
    id: 15, stage: "⚔️ BOSS FINAL — Unidade I", type: "Desafio Integrador",
    context: "🚀 DESAFIO ÉPICO! Uma startup de fintech contratou você como arquiteto de sistemas para projetar o SO embarcado de um terminal de pagamento POS (Point of Sale). Requisitos: (1) processar transações em menos de 300ms (tempo real), (2) múltiplos terminais compartilhando a rede simultaneamente, (3) drivers para leitor de cartão, impressora térmica e display touch, (4) código source compilado em C para máxima performance, (5) cache otimizado para os dados de transações recentes. Como você justifica cada escolha técnica?",
    q: "Qual arquitetura de SO e conjunto de decisões técnicas atendem TODOS os requisitos acrimonicamente?",
    opts: [
      "SO monoprogramável + MS-DOS + interpretador Python para scripts de pagamento + sem cache (dados sempre frescos) + drivers genéricos do fabricante",
      "SO Tempo Real (RTOS) + kernel modo núcleo / apps modo usuário + drivers específicos compilados em C + cache com localidade temporal para transações frequentes + pipelining da CPU para processar as operações financeiras rapidamente",
      "SO Windows 11 com Time-sharing para múltiplos usuários simultâneos + Java interpretado para compatibilidade + HDD para armazenamento de transações + barramento USB para todos os periféricos",
      "SO Batch para processar todas as transações em lote à noite, eliminando a necessidade de processamento em tempo real, reduzindo custos de hardware"
    ],
    ans: 1,
    feedback: "🏆 ARQUITETO MESTRE! Análise técnica: (1) RTOS garante resposta determinística <300ms — Time-sharing não atende; (2) Modo núcleo/usuário protege o kernel de bugs nos apps de pagamento; (3) Drivers em C compilado para latência mínima na comunicação com leitor de cartão e impressora; (4) Cache com localidade temporal: transações do mesmo cliente tendem a re-ocorrer — cache hits aumentam performance; (5) Pipeline da CPU maximiza throughput das operações criptográficas de cada transação. Você dominou a Unidade I!",
    xp: 500
  }
];

const LEVELS = [
  { min: 0,    icon: '🌱', name: 'Iniciante',         desc: 'Primeiros passos em Sistemas Operacionais' },
  { min: 300,  icon: '⚡', name: 'Aprendiz de SO',    desc: 'Compreende os conceitos básicos de SO' },
  { min: 700,  icon: '🔧', name: 'Técnico de SO',     desc: 'Aplica conceitos de memória e E/S' },
  { min: 1100, icon: '💻', name: 'Analista de SO',    desc: 'Domina hierarquia de memória e pipelining' },
  { min: 1600, icon: '🛡️', name: 'Engenheiro de SO', desc: 'Integra translators, loaders e modos de acesso' },
  { min: 2200, icon: '🏆', name: 'Arquiteto de SO',  desc: 'Mestre em Sistemas Operacionais — Unidade I!' },
];

const BADGES = [
  { score: 0,    icon: '🎓', name: 'Estudante',        color: '#64748B', stars: 1 },
  { score: 400,  icon: '⚡', name: 'Aprendiz Ativo',   color: '#0EA5E9', stars: 2 },
  { score: 900,  icon: '🔧', name: 'Técnico em SO',    color: '#10B981', stars: 3 },
  { score: 1400, icon: '💻', name: 'Analista SO',      color: '#F59E0B', stars: 4 },
  { score: 2000, icon: '🏆', name: 'Mestre em SO',     color: '#ffd600', stars: 5 },
];

const COLORS = {
  navy: '#070d1f', blue: '#1A56DB', sky: '#0EA5E9',
  white: '#FFFFFF', dark: '#1E293B', mid: '#64748B',
  accent: '#F59E0B', green: '#10B981', red: '#EF4444',
  purple: '#8b5cf6',
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function SOUnidade1Activity() {
  const [screen, setScreen] = useState('start');
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0);
  const [combo, setCombo] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredSteps, setAnsweredSteps] = useState([]);
  const [timerVal, setTimerVal] = useState(180);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [comboAnim, setComboAnim] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [roundQuestions, setRoundQuestions] = useState([]);
  const [round, setRound] = useState(1);

  const timerRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  // Shuffle + select 10 questions for the round (keep boss at the end)
  function buildRound() {
    const boss = QUESTIONS[QUESTIONS.length - 1];
    const pool = [...QUESTIONS.slice(0, QUESTIONS.length - 1)];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return [...pool.slice(0, 9), boss];
  }

  // Timer
  useEffect(() => {
    if (screen === 'game' && !showFeedback) {
      timerRef.current = setInterval(() => {
        setTimerVal(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, step, showFeedback]);

  const handleTimeOut = () => {
    setFeedbackType('timeout');
    setShowFeedback(true);
    setCombo(1);
    setAnsweredSteps(prev => [...prev, step]);
  };

  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      if (type === 'correct') {
        o.frequency.setValueAtTime(880, ctx.currentTime);
        g.gain.setValueAtTime(0.12, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        o.start(); o.stop(ctx.currentTime + 0.3);
      } else {
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(200, ctx.currentTime);
        g.gain.setValueAtTime(0.08, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        o.start(); o.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {}
  };

  const startGame = () => {
    if (playerName.trim().length < 2) return;
    const rq = buildRound();
    setRoundQuestions(rq);
    setScreen('game');
    setStep(0);
    setScore(0);
    setCorrectCount(0);
    setAnsweredSteps([]);
    setTimerVal(180);
    setCombo(1);
    setRound(1);
    setGameStartTime(Date.now());
  };

  const playNextRound = () => {
    const rq = buildRound();
    setRoundQuestions(rq);
    setStep(0);
    setAnsweredSteps([]);
    setTimerVal(180);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCombo(1);
    setRound(r => r + 1);
    setScreen('game');
  };

  const selectAnswer = (idx) => {
    if (showFeedback) return;
    const q = roundQuestions[step];
    const isCorrect = idx === q.ans;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    setFeedbackType(isCorrect ? 'ok' : 'no');

    if (isCorrect) {
      playSound('correct');
      const timeBonus = Math.floor(timerVal / 180 * 100);
      const pts = Math.round(q.xp * (1 + timeBonus / 100) * combo);
      setScore(prev => prev + pts);
      setCorrectCount(prev => prev + 1);
      const newCombo = Math.min(combo + 1, 5);
      setCombo(newCombo);
      if (newCombo > 1) {
        setComboAnim(true);
        setTimeout(() => setComboAnim(false), 1000);
      }
    } else {
      playSound('wrong');
      setCombo(1);
    }
    setAnsweredSteps(prev => [...prev, step]);
  };

  const nextStep = () => {
    if (step < roundQuestions.length - 1) {
      setStep(prev => prev + 1);
      setTimerVal(180);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    setScreen('end');
    try {
      const accuracy = Math.round((correctCount / roundQuestions.length) * 100);
      await addDoc(collection(db, "fametro_ranking"), {
        name: playerName,
        score: accuracy,
        points: score,
        duration: Date.now() - gameStartTime,
        timestamp: Date.now(),
        createdAt: serverTimestamp(),
        activityId: "so_unidade1",
        lvl: getLevel(score).name,
        badge: getBadge(score).name
      });
    } catch (e) { console.error("Error saving score:", e); }
  };

  const getLevel = (s) => {
    let lv = LEVELS[0];
    LEVELS.forEach(l => { if (s >= l.min) lv = l; });
    return lv;
  };
  const getBadge = (s) => {
    let b = BADGES[0];
    BADGES.forEach(bg => { if (s >= bg.score) b = bg; });
    return b;
  };
  const formatTime = (t) => {
    const m = Math.floor(t / 60), s = t % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  const currentQ = roundQuestions[step];

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: COLORS.navy, color: '#e2e8f0', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, Arial, sans-serif", padding: '80px 20px', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes combo-pop { 0%{opacity:1;transform:translate(-50%,-50%) scale(0.5);} 60%{opacity:1;transform:translate(-50%,-90%) scale(1.3);} 100%{opacity:0;transform:translate(-50%,-130%) scale(1);} }
        @keyframes pulseGlow { 0%,100%{box-shadow: 0 0 0 0 rgba(14,165,233,0.5);} 50%{box-shadow: 0 0 0 10px rgba(14,165,233,0);} }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        .shake-card { animation: shake 0.4s ease; }
        .btn-opt { transition: all 0.15s; }
        .btn-opt:hover:not(:disabled) { transform: translateX(4px); border-color: #0EA5E9 !important; }
      `}</style>

      {/* Back button */}
      <Link to="/fametro" style={{ position: 'fixed', top: 20, left: 20, zIndex: 100, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', fontSize: 14 }}>
        ← Hub Fametro
      </Link>

      <div style={{ maxWidth: 920, margin: '0 auto' }}>

        {/* ── START SCREEN ── */}
        {screen === 'start' && (
          <div className="animate-in">
            <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
              <div style={{ fontSize: 12, letterSpacing: 5, color: COLORS.sky, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono' }}>
                CEUNI-FAMETRO · Sistemas Operacionais · 2026.1
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, margin: '0 0 8px', background: 'linear-gradient(135deg, #0EA5E9, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ⚙️ SO Quest
              </h1>
              <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>Unidade I — Introdução aos SOs e Conceitos de Hardware</p>
              <p style={{ color: '#475569', fontSize: 13, marginTop: 6, fontFamily: 'JetBrains Mono' }}>Baseado em: Tanenbaum, Sistemas Operacionais Modernos, 4ª ed.</p>
            </div>

            <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 24, padding: '36px 32px', marginBottom: 32 }}>
              {/* Section tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
                {['3.4.1 Conceitos & História', '3.4.2 Tipos de SO', '3.4.3 Hardware & Memória', '3.4.4 E/S & Barramento', '3.4.5 Tradutor & Loader'].map(t => (
                  <span key={t} style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: COLORS.sky, fontFamily: 'JetBrains Mono' }}>{t}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                {[['10', 'Questões / Rodada'], ['3 min', 'Por Questão'], ['XP', 'Combo Bônus'], ['∞', 'Rodadas']].map(([v, l]) => (
                  <div key={l} style={{ background: '#0A1540', border: '1px solid #1E3A6E', borderRadius: 16, padding: '16px 24px', minWidth: 110, textAlign: 'center' }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.sky, fontFamily: 'JetBrains Mono' }}>{v}</div>
                    <div style={{ fontSize: 10, color: COLORS.mid, letterSpacing: 1, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ maxWidth: 420, margin: '0 auto 24px' }}>
                <input
                  type="text"
                  placeholder="Seu nome completo..."
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && startGame()}
                  style={{ width: '100%', padding: '16px 20px', borderRadius: 14, border: '2px solid #1E3A6E', background: '#0A1540', color: '#fff', fontSize: 16, textAlign: 'center', outline: 'none', fontFamily: 'Inter' }}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={startGame}
                  disabled={playerName.length < 2}
                  style={{ background: `linear-gradient(135deg, ${COLORS.sky}, ${COLORS.purple})`, color: '#fff', border: 'none', padding: '16px 52px', borderRadius: 16, fontSize: 18, fontWeight: 800, cursor: 'pointer', opacity: playerName.length < 2 ? 0.5 : 1, transition: 'all 0.2s', letterSpacing: 1 }}>
                  🚀 Iniciar SO Quest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── GAME SCREEN ── */}
        {screen === 'game' && currentQ && (
          <div className="animate-in">
            {/* Top bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.sky, letterSpacing: 3, fontFamily: 'JetBrains Mono' }}>RODADA {round} · {playerName.toUpperCase()}</div>
                <h2 style={{ margin: 0, fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: '#fff' }}>{currentQ.stage}</h2>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {combo > 1 && (
                  <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', padding: '8px 16px', borderRadius: 10, textAlign: 'center', animation: 'pulseGlow 1.5s infinite' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.accent }}>×{combo}</div>
                    <div style={{ fontSize: 9, color: COLORS.mid }}>COMBO</div>
                  </div>
                )}
                <div style={{ background: '#0A1E5C', padding: '8px 16px', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.sky, fontFamily: 'JetBrains Mono' }}>{score.toLocaleString('pt-BR')}</div>
                  <div style={{ fontSize: 9, color: COLORS.mid }}>XP</div>
                </div>
                <div style={{ background: timerVal < 30 ? 'rgba(239,68,68,0.15)' : '#0A1E5C', border: timerVal < 30 ? '1px solid #ef4444' : '1px solid transparent', padding: '8px 16px', borderRadius: 10, textAlign: 'center', transition: 'all 0.3s' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: timerVal < 30 ? '#EF4444' : '#fff', fontFamily: 'JetBrains Mono' }}>{formatTime(timerVal)}</div>
                  <div style={{ fontSize: 9, color: COLORS.mid }}>TEMPO</div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: '#1E3A6E', height: 6, borderRadius: 10, marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ width: `${(step / roundQuestions.length) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.sky}, ${COLORS.purple})`, transition: 'width 0.5s' }} />
            </div>

            {/* Step dots */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
              {roundQuestions.map((_, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: 50, border: '2px solid #1E3A6E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, backgroundColor: i === step ? COLORS.sky : answeredSteps.includes(i) ? '#10B981' : 'transparent', borderColor: i === step ? COLORS.sky : answeredSteps.includes(i) ? '#10B981' : '#1E3A6E', color: '#fff', transition: 'all 0.3s' }}>
                  {i === roundQuestions.length - 1 ? '👑' : i + 1}
                </div>
              ))}
            </div>

            {/* Question card */}
            <div style={{ background: 'rgba(10,30,92,0.7)', border: '1px solid #1E3A6E', borderRadius: 24, padding: '28px 28px', backdropFilter: 'blur(8px)' }} className={feedbackType === 'no' ? 'shake-card' : ''}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ background: COLORS.sky, padding: '3px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>Q{step + 1}</span>
                <span style={{ fontSize: 10, color: COLORS.mid, letterSpacing: 2, textTransform: 'uppercase' }}>{currentQ.type}</span>
              </div>

              <div style={{ background: 'rgba(14,165,233,0.06)', borderLeft: `4px solid ${COLORS.accent}`, padding: '14px 18px', borderRadius: '0 12px 12px 0', marginBottom: 20, fontStyle: 'italic', fontSize: 14, color: '#FEF3C7', lineHeight: 1.7 }}>
                {currentQ.context}
              </div>

              <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', lineHeight: 1.5, marginBottom: 24, color: '#fff', fontWeight: 700 }}>
                {currentQ.q}
              </h3>

              <div style={{ display: 'grid', gap: 10 }}>
                {currentQ.opts.map((opt, i) => {
                  let border = '#1E3A6E', bg = '#0A1540', textColor = '#e2e8f0';
                  if (showFeedback) {
                    if (i === currentQ.ans) { border = '#10B981'; bg = 'rgba(16,185,129,0.1)'; textColor = '#fff'; }
                    else if (i === selectedAnswer) { border = '#EF4444'; bg = 'rgba(239,68,68,0.1)'; }
                  }
                  return (
                    <button key={i} className="btn-opt" onClick={() => selectAnswer(i)} disabled={showFeedback}
                      style={{ padding: '14px 18px', borderRadius: 12, border: `2px solid ${border}`, background: bg, color: textColor, textAlign: 'left', cursor: showFeedback ? 'default' : 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5, width: '100%' }}>
                      <span style={{ minWidth: 26, height: 26, background: border, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, flexShrink: 0, marginTop: 1 }}>
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div style={{ marginTop: 24, padding: '18px 20px', borderRadius: 16, background: feedbackType === 'ok' ? 'rgba(16,185,129,0.08)' : feedbackType === 'timeout' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${feedbackType === 'ok' ? '#10B981' : feedbackType === 'timeout' ? COLORS.accent : '#EF4444'}`, animation: 'fadeIn 0.3s ease' }}>
                  {feedbackType === 'timeout' && <p style={{ margin: '0 0 8px', color: COLORS.accent, fontWeight: 700 }}>⏱️ Tempo esgotado!</p>}
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#e2e8f0' }}>{currentQ.feedback}</p>
                  <div style={{ textAlign: 'right', marginTop: 16 }}>
                    <button onClick={nextStep} style={{ background: `linear-gradient(90deg, ${COLORS.sky}, ${COLORS.purple})`, color: '#fff', border: 'none', padding: '10px 28px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                      {step === roundQuestions.length - 1 ? '🏁 Ver Resultado' : 'Próxima →'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── END SCREEN ── */}
        {screen === 'end' && (
          <div className="animate-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: 8 }}>{getLevel(score).icon}</div>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', margin: '0 0 8px', color: '#fff', fontWeight: 900 }}>Rodada {round} Concluída!</h1>
            <p style={{ color: COLORS.mid, marginBottom: 32 }}>{playerName} · SO Quest — Unidade I · CEUNI-FAMETRO</p>

            <div style={{ background: 'rgba(245,158,11,0.06)', border: `2px solid ${COLORS.accent}`, borderRadius: 28, padding: '40px 32px', marginBottom: 28 }}>
              <div style={{ fontSize: 14, letterSpacing: 3, color: COLORS.sky, fontFamily: 'JetBrains Mono', marginBottom: 8 }}>{getLevel(score).name.toUpperCase()}</div>
              <div style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 900, color: COLORS.accent, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>{score.toLocaleString('pt-BR')}</div>
              <div style={{ color: COLORS.mid, marginBottom: 28 }}>pontos XP acumulados</div>

              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ background: '#0A1540', padding: '16px 24px', borderRadius: 16, border: '1px solid #1E3A6E', minWidth: 110 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#10B981', fontFamily: 'JetBrains Mono' }}>{Math.round((correctCount / roundQuestions.length) * 100)}%</div>
                  <div style={{ fontSize: 10, color: COLORS.mid, marginTop: 4 }}>ACURÁCIA</div>
                </div>
                <div style={{ background: '#0A1540', padding: '16px 24px', borderRadius: 16, border: '1px solid #1E3A6E', minWidth: 110 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.sky, fontFamily: 'JetBrains Mono' }}>{correctCount}/{roundQuestions.length}</div>
                  <div style={{ fontSize: 10, color: COLORS.mid, marginTop: 4 }}>ACERTOS</div>
                </div>
                <div style={{ background: '#0A1540', padding: '16px 24px', borderRadius: 16, border: '1px solid #1E3A6E', minWidth: 110 }}>
                  <div style={{ fontSize: 24 }}>{getBadge(score).icon}</div>
                  <div style={{ fontSize: 10, color: COLORS.mid, marginTop: 4 }}>{getBadge(score).name.toUpperCase()}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={playNextRound} style={{ background: `linear-gradient(135deg, ${COLORS.sky}, ${COLORS.purple})`, color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 14, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
                🔄 Nova Rodada (questões aleatórias)
              </button>
              <Link to="/fametro/so-u1/ranking" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 32px', borderRadius: 14, textDecoration: 'none', fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center' }}>
                🏆 Ver Ranking
              </Link>
              <Link to="/fametro" style={{ background: 'transparent', color: COLORS.mid, border: '1px solid #1E3A6E', padding: '14px 28px', borderRadius: 14, textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center' }}>
                ← Hub Fametro
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Combo pop */}
      {comboAnim && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 52, fontWeight: 900, color: COLORS.accent, zIndex: 1000, textShadow: '0 0 24px rgba(245,158,11,0.9)', animation: 'combo-pop 1s ease-out forwards', pointerEvents: 'none' }}>
          ⚡ COMBO ×{combo}
        </div>
      )}
    </div>
  );
}
