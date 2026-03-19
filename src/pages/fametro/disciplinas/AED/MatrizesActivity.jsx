import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── BANCO DE QUESTÕES ESTILO ENADE — 15 QUESTÕES (Matrizes AED) ─────────────
const QUESTIONS = [
  {
    id: 1, stage: "Básico — Inicialização", type: "ENADE / C-Concept",
    context: "Um desenvolvedor está iniciando um projeto de controle de estoque para um armazém representado por uma grade de 5 corredores e 10 prateleiras por corredor. No início do turno, todos os registros devem estar zerados para evitar que 'lixos de memória' (valores residuais) causem erros no balanço.",
    q: "Qual declaração em Linguagem C inicializa corretamente a matriz de estoque com zeros sem utilizar diretivas de pré-processamento (#define) ou constantes?",
    opts: [
      "int estoque[5][10]; // Declaração sem atribuição",
      "int estoque[5][10] = {0}; // Inicialização para zerar todos os elementos",
      "int estoque[5][10] = {1}; // Inicialização com 1",
      "estoque int[10][5] = 0; // Atribuição direta de zero para a matriz",
      "int estoque[5][10] = {0,0,0,0,0}; // Inicializa apenas a primeira linha"
    ],
    ans: 1,
    feedback: "✅ Correto! Em C, ao inicializar um array com {0}, o compilador garante que todos os elementos da estrutura sejam preenchidos com zero, o que é uma prática de segurança vital em AED.",
    xp: 100
  },
  {
    id: 2, stage: "Básico — Coordenadas", type: "ENADE / Logic",
    context: "Em um software de edição de fotos profissionais, os pixels são manipulados via matrizes de cores. Um algoritmo precisa alterar o brilho de um pixel específico localizado na 4ª linha e na 8ª coluna da imagem (em contagem humana, começando de 1).",
    q: "Considerando que a imagem foi declarada como 'int imagem[1024][1024]', qual comando o desenvolvedor deve usar para acessar esse pixel corretamente em C?",
    opts: [
      "imagem[4][8] = novo_brilho;",
      "imagem[3][7] = novo_brilho;",
      "imagem[5][9] = novo_brilho;",
      "imagem(4, 8) = novo_brilho;",
      "imagem.pixel[4, 8] = novo_brilho;"
    ],
    ans: 1,
    feedback: "✅ Exato! Como o C utiliza indexação baseada em zero (0-based), a 4ª linha corresponde ao índice 3 e a 8ª coluna corresponde ao índice 7.",
    xp: 110
  },
  {
    id: 3, stage: "Intermediário — Estrutura de Memória", type: "ENADE / Hardware",
    context: "Um engenheiro de performance está otimizando um simulador de satélite. Ele sabe que a eficiência do processador depende da 'localidade espacial' de acesso à memória RAM. Em Linguagem C, as matrizes são armazenadas no padrão 'Row-Major Order' (linha por linha contígua).",
    q: "Para uma matriz 'int m[100][200]', qual estratégia de navegação o engenheiro deve escolher para reduzir 'cache misses' e acelerar a simulação?",
    opts: [
      "Percorrer as colunas no laço externo e as linhas no laço interno.",
      "Acessar os elementos de forma aleatória usando uma função rand().",
      "Percorrer as linhas no laço externo e as colunas no laço interno.",
      "Acessar apenas os elementos ímpares para economizar energia da CPU.",
      "O padrão de acesso não afeta o desempenho em processadores modernos."
    ],
    ans: 2,
    feedback: "✅ Perfeito! Percorrer linha por linha (i depois j) aproveita que os elementos vizinhos já foram carregados no cache da CPU pela localidade espacial, evitando idas demoradas à RAM principal.",
    xp: 130
  },
  {
    id: 4, stage: "Intermediário — Álgebra Linear", type: "ENADE / Algoritmo",
    context: "Uma biblioteca matemática em C precisa implementar o cálculo do 'Traço' de uma matriz quadrada. O traço é definido como a soma de todos os elementos que compõem a diagonal principal.",
    q: "Dado uma matriz 'float matriz[5][5]', qual trecho de código realiza esse cálculo de forma mais eficiente (com menor complexidade de tempo)?",
    opts: [
      "for(int i=0; i<5; i++) for(int j=0; j<5; j++) soma += matriz[i][j];",
      "for(int i=0; i<5; i++) soma += matriz[i][5-i];",
      "for(int i=0; i<5; i++) soma += matriz[i][i];",
      "for(int i=0; i<5; i++) soma += matriz[i][0];",
      "for(int j=0; j<5; j++) soma += matriz[0][j];"
    ],
    ans: 2,
    feedback: "✅ Correto! Para somar a diagonal principal, basta um único laço onde o índice da linha é igual ao da coluna (i == j). Percorrer toda a matriz com dois laços seria desnecessário e lento.",
    xp: 140
  },
  {
    id: 5, stage: "Avançado — Operações", type: "ENADE / Análise",
    context: "Um sistema de monitoramento de tráfego aéreo recebe duas matrizes de radares: 'radarA[20][50]' e 'radarB[20][50]'. O objetivo é unir os dados em uma terceira matriz 'radarFinal' somando os sinais ponto a ponto.",
    q: "Qual o procedimento técnico correto para realizar essa soma de matrizes em Linguagem C?",
    opts: [
      "radarFinal = radarA + radarB; // Soma direta das estruturas",
      "radarFinal[20][50] = radarA[20][50] + radarB[20][50]; // Soma dos ponteiros",
      "Utilizar dois laços 'for' aninhados: radarFinal[i][j] = radarA[i][j] + radarB[i][j];",
      "Somar apenas as diagonais principais de radarA e radarB.",
      "Utilizar um laço 'while' que compare se as matrizes têm o mesmo tamanho antes de somar."
    ],
    ans: 2,
    feedback: "✅ Excelente! Operações elemento a elemento em matrizes não podem ser feitas com operadores diretos no C (+). É necessário iterar por cada linha e cada coluna individualmente.",
    xp: 150
  },
  {
    id: 6, stage: "Intermediário — Simetria", type: "ENADE / Validação",
    context: "Em um banco de dados geográfico, uma matriz armazena distâncias entre cidades. Para garantir a integridade dos dados, o sistema deve verificar se a matriz é SIMÉTRICA (a distância de A até B deve ser igual à de B até A).",
    q: "Qual condição lógica (flag) deve ser testada dentro dos laços para invalidar a simetria da matriz?",
    opts: [
      "se matriz[i][j] é maior que zero",
      "se matriz[i][j] é diferente de matriz[j][i]",
      "se matriz[i][i] é igual a zero",
      "se a soma das linhas é diferente da soma das colunas",
      "se a matriz possui colunas a mais que linhas"
    ],
    ans: 1,
    feedback: "✅ Corretíssimo! Uma matriz quadrada é simétrica se e somente se para todo i e j, M[i][j] == M[j][i]. Encontrar um único par diferente quebra a simetria.",
    xp: 150
  },
  {
    id: 7, stage: "Técnico — Passagem de Parâmetros", type: "ENADE / Software Design",
    context: "Você está criando uma função reutilizável para imprimir qualquer relatório em formato de tabela. A assinatura da função foi definida como: 'void mostrarRelatorio(float dados[][12], int totalLinhas)'.",
    q: "Por que, na Linguagem C, é necessário informar explicitamente o valor '12' (colunas) na assinatura, mas não o número de linhas?",
    opts: [
      "Para que o compilador saiba o limite máximo de memória RAM a ser alocado.",
      "Porque o C não permite funções com nomes que contenham letras maiúsculas.",
      "Para que o compilador consiga calcular o deslocamento (offset) correto de memória ao trocar de linha.",
      "Para garantir que a matriz seja tratada como um vetor unidimensional infinito.",
      "Trata-se apenas de uma convenção estética, o valor das colunas é ignorado pelo compilador."
    ],
    ans: 2,
    feedback: "✅ Decisão de Arquiteto! Ao acessar dados[i][j], o compilador faz a conta: base + (i * 12 + j). Sem o '12', ele não sabe quantos elementos 'pular' para chegar na próxima linha na memória física.",
    xp: 160
  },
  {
    id: 8, stage: "Avançado — Transposição", type: "ENADE / Transformação",
    context: "Um algoritmo de reconhecimento facial precisa rotacionar uma foto capturada. O primeiro passo é o cálculo da transposta da matriz original capturada pela câmera.",
    q: "Se a foto original é uma matriz 'M' de 480 linhas por 640 colunas, qual será a configuração da matriz 'T' (sua transposta)?",
    opts: [
      "T terá 480 linhas e 640 colunas",
      "T terá 480 linhas e 480 colunas",
      "T terá 640 linhas e 480 colunas",
      "T será uma matriz quadrada de 640x640",
      "T terá apenas uma coluna com todos os 307.200 elementos"
    ],
    ans: 2,
    feedback: "✅ Muito bem! Na transposição, as linhas da matriz original tornam-se as colunas da matriz resultante (e vice-versa), invertendo as dimensões M x N para N x M.",
    xp: 160
  },
  {
    id: 9, stage: "Avançado — Multiplicação (Regra)", type: "ENADE / Processamento",
    context: "Um cientista de dados precisa multiplicar a Matriz A (vendas por região) pela Matriz B (preços por categoria). A Matriz A possui dimensões 10x4 e a Matriz B possui dimensões 4x2.",
    q: "Qual será a dimensão da matriz RESULTANTE deste produto matricial e qual a regra fundamental que permite essa operação?",
    opts: [
      "Dimensão 10x2; O número de colunas de A deve ser igual ao número de linhas de B.",
      "Dimensão 4x4; Ambas as matrizes devem ser quadradas.",
      "Dimensão 10x4; O número de linhas de A deve ser igual ao número de colunas de B.",
      "Dimensão 2x10; As matrizes devem ser transpostas antes da multiplicação.",
      "A operação é impossível, pois as dimensões são diferentes."
    ],
    ans: 0,
    feedback: "✅ Regra de Ouro! Para multiplicar A(m,n) por B(n,p), os 'números internos' (n) devem ser iguais. O resultado terá as dimensões externas: m x p (10x2 no caso).",
    xp: 170
  },
  {
    id: 10, stage: "Básico — Inicialização Parcial", type: "ENADE / Syntax",
    context: "Durante a prova de Algoritmos, um aluno escreve: 'float notas[5][5] = {{10.0, 9.5}, {8.0}};'.",
    q: "Qual será o valor armazenado na posição 'notas[0][2]' e 'notas[1][1]' após essa declaração?",
    opts: [
      "10.0 e 8.0, respectivamente.",
      "Lixo de memória em ambos, pois a inicialização está incompleta.",
      "0.0 em ambos, pois o C preenche o restante da matriz incompleta com zeros.",
      "9.5 e 0.0, respectivamente.",
      "O programa apresentará erro de compilação por chaves aninhadas sem sentido."
    ],
    ans: 2,
    feedback: "✅ Ótima observação! Ao inicializar parcialmente uma matriz em C, todos os elementos não especificados explicitamente são preenchidos com 0.0 (para float) ou 0 (para int) automaticamente.",
    xp: 140
  },
  {
    id: 11, stage: "Intermediário — Limites de Memória", type: "ENADE / Segurança",
    context: "Um programador júnior escreve o seguinte código: 'int mat[2][2]; mat[0][0]=1; mat[0][1]=2; mat[1][0]=3; mat[1][1]=4; printf(\"%d\", mat[2][0]);'.",
    q: "O que o comando 'printf' exibirá ao ser executado em um ambiente de desenvolvimento padrão?",
    opts: [
      "Exibirá o valor 0.",
      "Exibirá um erro de 'Array Index Out of Bounds' e interromperá a execução.",
      "Exibirá um valor imprevisível (lixo de memória) ou causará um erro de proteção (crash).",
      "Exibirá o valor 1, pois o C rotaciona a matriz automaticamente.",
      "O compilador não permitirá a geração do executável (erro de build)."
    ],
    ans: 2,
    feedback: "✅ Alerta de Perigo! O C NÃO verifica limites de array em tempo de execução. Acessar mat[2] em uma matriz de 2 linhas (índices 0 e 1) é um acesso ilegal à memória, gerando comportamento indefinido.",
    xp: 160
  },
  {
    id: 14, stage: "Técnico — Linearização", type: "ENADE / Memory",
    context: "Um desenvolvedor sênior decide otimizar a busca de um valor em uma matriz 100x100 tratando-a como um único vetor linear de 10.000 elementos usando ponteiros: 'int *ptr = &mat[0][0];'.",
    q: "Por que essa técnica é possível e segura na Linguagem C para matrizes estáticas?",
    opts: [
      "Porque o C criptografa os dados em matrizes e os descriptografa como vetores.",
      "Porque as matrizes são salvas como blocos contíguos e sequenciais na memória RAM.",
      "Porque ponteiros em C podem acessar qualquer parte do hardware sem restrições.",
      "Porque a memória RAM moderna não diferencia mais linhas de colunas.",
      "Essa técnica não é segura e causará corrupção de dados em todos os casos."
    ],
    ans: 1,
    feedback: "✅ Visão de Engenheiro! Como mat[0][0] é seguido imediatamente por mat[0][1] e assim por diante até a última linha, a matriz é fisicamente um 'vetorão' mapeado em duas dimensões apenas para o programador.",
    xp: 180
  },
  {
    id: 12, stage: "Avançado — Rotação 90°", type: "ENADE / Desafio",
    context: "Um robô de segurança captura uma imagem (matriz quadrada) e precisa rotacioná-la 90 graus no sentido anti-horário para processar uma placa de veículo inclinada.",
    q: "Qual a fórmula correta de mapeamento para rotacionar um elemento [i][j] de uma matriz quadrada N x N para sua nova posição [novo_i][novo_j] em 90°?",
    opts: [
      "novo_i = j; novo_j = i;",
      "novo_i = N - 1 - j; novo_j = i;",
      "novo_i = i; novo_j = N - 1 - j;",
      "novo_i = N - 1 - i; novo_j = N - 1 - j;",
      "novo_i = j; novo_j = N - 1 - i;"
    ],
    ans: 1,
    feedback: "✅ Lógica Pura! Na rotação 90° anti-horária, a coluna original (j) torna-se a nova linha invertida (N-1-j), e a linha original (i) torna-se a nova coluna diretamente. Matemática aplicada!",
    xp: 190
  },
  {
    id: 13, stage: "Operação — Multiplicação Paso a Passo", type: "ENADE / Procedural",
    context: "Para multiplicar Matriz A (2x3) por B (3x2), o programa executa três laços aninhados (i, j, k). No momento em que i=0, j=0, o programa deve calcular o primeiro elemento da matriz C.",
    q: "Qual a sequência matemática correta que o processador realiza para obter C[0][0]?",
    opts: [
      "A[0][0]*B[0][0] + A[1][1]*B[1][1]",
      "A[0][0]*B[0][0] + A[0][1]*B[1][0] + A[0][2]*B[2][0]",
      "A[0][0]*B[0][0] * A[0][1]*B[1][0]",
      "A[0][0]*B[0][0] + A[1][0]*B[0][1] + A[2][0]*B[0][2]",
      "A[0][0] + B[0][0] + A[0][1] + B[1][0]"
    ],
    ans: 1,
    feedback: "✅ Passo a Passo concluído! Multiplicamos cada elemento da LINHA 0 de A pelo respectivo elemento da COLUNA 0 de B e somamos os produtos. É o chamado Produto Escalar.",
    xp: 170
  },
  {
    id: 15, stage: "⚔️ BOSS FINAL — Matrizes AED", type: "Desafio Integrador ENADE",
    context: "🚀 CENÁRIO FINAL: Você é o Arquiteto Chefe de uma Missão Mars Rover. O Rover capturou uma matriz de temperatura ambiente (360x360). Requisitos: (1) O sistema deve calcular a média da diagonal principal para calibrar o sensor; (2) Deve rotacionar a matriz 90° para alinhar com o horizonte; (3) O código deve rodar em um chip antigo de 8 bits consumindo o mínimo de memória e CPU; (4) Não é permitido o uso de variáveis globais ou #define para evitar erros de escopo.",
    q: "Qual conjunto de decisões técnicas você ordena para sua equipe de desenvolvedores para garantir o sucesso da missão?",
    opts: [
      "Usar 3 laços para tudo, ignorar o cache da CPU e usar memória primária via ponteiros globais.",
      "Percorrer a matriz em Row-Major para eficiência de Cache; Usar matrizes locais passadas por referência com colunas específicas via ponteiros; Implementar a rotação in-place se possível para economizar RAM.",
      "Alocar dinamicamente novas matrizes para cada operação e usar recursividade profunda no cálculo da média.",
      "Converter todos os dados para strings enviando-os diretamente para a base na Terra via satélite.",
      "Utilizar diretivas #define exaustivamente para mapear cada índice da matriz individualmente."
    ],
    ans: 1,
    feedback: "🏆 ARQUITETO SUPREMO AED! Você aplicou: Localidade de Cache (Row-Major), Passagem de Matrizes por Referência (Eficiência), Economia de RAM (In-Place) e Boas Práticas (Sem Globais). Você está pronto para o ENADE e para Marte!",
    xp: 500
  }
];

const LEVELS = [
  { min: 0,    icon: '🌱', name: 'Recruta AED',       desc: 'Descobrindo o mundo das matrizes' },
  { min: 300,  icon: '⚡', name: 'C-Coder em Matrizes', desc: 'Já lida com declarações e memória' },
  { min: 700,  icon: '🔧', name: 'Algoritmo Master',   desc: 'Domina transversais e diagonais' },
  { min: 1100, icon: '💻', name: 'Analista de Dados',   desc: 'Otimizando cache e performance' },
  { min: 1600, icon: '🛡️', name: 'Arquiteto de AED',   desc: 'Mestre em estruturas complexas' },
  { min: 2200, icon: '🏆', name: 'Soberano de Matrizes', desc: 'Pronto para qualquer desafio de AED!' },
];

const BADGES = [
  { score: 0,    icon: '🎓', name: 'Estudante',        color: '#64748B', stars: 1 },
  { score: 400,  icon: '⚡', name: 'Matriz Ativa',     color: '#0EA5E9', stars: 2 },
  { score: 900,  icon: '🔧', name: 'Lestre de Loops',  color: '#10B981', stars: 3 },
  { score: 1400, icon: '💻', name: 'Dev Otimizado',    color: '#F59E0B', stars: 4 },
  { score: 2000, icon: '🏆', name: 'Matrix Solver',   color: '#ffd600', stars: 5 },
];

const COLORS = {
  navy: '#050a18', blue: '#1A56DB', sky: '#0EA5E9',
  white: '#FFFFFF', dark: '#1E293B', mid: '#64748B',
  accent: '#10B981', orange: '#F59E0B', red: '#EF4444',
  purple: '#6366f1',
};

export default function MatrizesActivity() {
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

  function buildRound() {
    const boss = QUESTIONS[QUESTIONS.length - 1];
    const pool = [...QUESTIONS.slice(0, QUESTIONS.length - 1)];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return [...pool.slice(0, 9), boss];
  }

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
        activityId: "aed_matrizes",
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

  return (
    <div style={{ backgroundColor: COLORS.navy, color: '#e2e8f0', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '80px 20px', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes combo-pop { 0%{opacity:1;transform:translate(-50%,-50%) scale(0.5);} 60%{opacity:1;transform:translate(-50%,-90%) scale(1.3);} 100%{opacity:0;transform:translate(-50%,-130%) scale(1);} }
        @keyframes pulseGlow { 0%,100%{box-shadow: 0 0 0 0 rgba(16,185,129,0.3);} 50%{box-shadow: 0 0 0 10px rgba(16,185,129,0);} }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        .shake-card { animation: shake 0.4s ease; }
        .btn-opt { transition: all 0.15s; }
        .btn-opt:hover:not(:disabled) { transform: translateX(4px); border-color: ${COLORS.sky} !important; }
      `}</style>

      <Link to="/fametro" style={{ position: 'fixed', top: 20, left: 20, zIndex: 100, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', fontSize: 14 }}>
        ← Voltar ao Hub
      </Link>

      <div style={{ maxWidth: 920, margin: '0 auto' }}>

        {screen === 'start' && (
          <div className="animate-in">
            <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
              <div style={{ fontSize: 12, letterSpacing: 5, color: COLORS.purple, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, fontFamily: 'JetBrains Mono' }}>
                AED · Estrutura de Dados · 2026.1
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, margin: '0 0 8px', background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.sky})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                🔳 Matrix Quest
              </h1>
              <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>Questões Teóricas Estilo ENADE sobre Matrizes em C</p>
              <p style={{ color: '#475569', fontSize: 13, marginTop: 6, fontFamily: 'JetBrains Mono' }}>Baseado no PDF: Aula06 - Matrizes em Linguagem C</p>
              
              <Link to="/fametro/aed/matrizes/lab" style={{ display: 'inline-block', marginTop: 16, color: COLORS.sky, textDecoration: 'none', fontSize: 13, fontWeight: 700, background: 'rgba(14, 165, 233, 0.05)', padding: '6px 16px', borderRadius: 20, border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                👉 Prefere Codar? Clique aqui para o Laboratório Prático
              </Link>
            </div>

            <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 24, padding: '36px 32px', marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
                {['Situações Reais', 'Padrão ENADE', 'Sem Globais / Defines', 'Operações Passo a Passo', 'Otimização de Hardware'].map(t => (
                  <span key={t} style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: COLORS.purple, fontFamily: 'JetBrains Mono' }}>{t}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                {[['10', 'Questões Reais'], ['3 min', 'Por Cenário'], ['5', 'Opções / Resposta'], ['AED', 'Foco ENADE']].map(([v, l]) => (
                  <div key={l} style={{ background: '#0a1025', border: '1px solid #1e2a4a', borderRadius: 16, padding: '16px 24px', minWidth: 110, textAlign: 'center' }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.purple, fontFamily: 'JetBrains Mono' }}>{v}</div>
                    <div style={{ fontSize: 10, color: COLORS.mid, letterSpacing: 1, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ maxWidth: 420, margin: '0 auto 24px' }}>
                <input
                  type="text"
                  placeholder="Nome do Aluno (ENADE 2026)..."
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && startGame()}
                  style={{ width: '100%', padding: '16px 20px', borderRadius: 14, border: '2px solid #1e2a4a', background: '#0a1025', color: '#fff', fontSize: 16, textAlign: 'center', outline: 'none', fontFamily: 'Inter' }}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={startGame}
                  disabled={playerName.length < 2}
                  style={{ background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.sky})`, color: '#fff', border: 'none', padding: '16px 52px', borderRadius: 16, fontSize: 18, fontWeight: 800, cursor: 'pointer', opacity: playerName.length < 2 ? 0.5 : 1, transition: 'all 0.2s', letterSpacing: 1 }}>
                  🚀 Iniciar Desafio de Matrizes
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'game' && currentQ && (
          <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.purple, letterSpacing: 3, fontFamily: 'JetBrains Mono' }}>AED · {playerName.toUpperCase()}</div>
                <h2 style={{ margin: 0, fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: '#fff' }}>{currentQ.stage}</h2>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {combo > 1 && (
                  <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', padding: '8px 16px', borderRadius: 10, textAlign: 'center', animation: 'pulseGlow 1.5s infinite' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.accent }}>×{combo}</div>
                    <div style={{ fontSize: 9, color: COLORS.mid }}>COMBO</div>
                  </div>
                )}
                <div style={{ background: '#0a1025', border: '1px solid #1e2a4a', padding: '8px 16px', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.purple, fontFamily: 'JetBrains Mono' }}>{score.toLocaleString('pt-BR')}</div>
                  <div style={{ fontSize: 9, color: COLORS.mid }}>XP</div>
                </div>
                <div style={{ background: timerVal < 30 ? 'rgba(239,68,68,0.15)' : '#0a1025', border: timerVal < 30 ? '1px solid #ef4444' : '1px solid #1e2a4a', padding: '8px 16px', borderRadius: 10, textAlign: 'center', transition: 'all 0.3s' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: timerVal < 30 ? '#EF4444' : '#fff', fontFamily: 'JetBrains Mono' }}>{formatTime(timerVal)}</div>
                  <div style={{ fontSize: 9, color: COLORS.mid }}>TEMPO</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#1e2a4a', height: 6, borderRadius: 10, marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ width: `${(step / roundQuestions.length) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.sky})`, transition: 'width 0.5s' }} />
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
              {roundQuestions.map((_, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: 50, border: '2px solid #1e2a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, backgroundColor: i === step ? COLORS.purple : answeredSteps.includes(i) ? COLORS.accent : 'transparent', borderColor: i === step ? COLORS.purple : answeredSteps.includes(i) ? COLORS.accent : '#1e2a4a', color: '#fff', transition: 'all 0.3s' }}>
                  {i === roundQuestions.length - 1 ? '⚔️' : i + 1}
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(10,16,37,0.8)', border: '1px solid #1e2a4a', borderRadius: 24, padding: '28px 28px', backdropFilter: 'blur(8px)' }} className={feedbackType === 'no' ? 'shake-card' : ''}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ background: COLORS.purple, padding: '3px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>AED-Q{step + 1}</span>
                <span style={{ fontSize: 10, color: COLORS.mid, letterSpacing: 2, textTransform: 'uppercase' }}>{currentQ.type}</span>
              </div>

              <div style={{ background: 'rgba(99,102,241,0.06)', borderLeft: `4px solid ${COLORS.orange}`, padding: '14px 18px', borderRadius: '0 12px 12px 0', marginBottom: 20, fontSize: 14, color: '#FEF3C7', lineHeight: 1.7 }}>
                <strong>Cenário:</strong> {currentQ.context}
              </div>

              <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', lineHeight: 1.5, marginBottom: 24, color: '#fff', fontWeight: 700 }}>
                {currentQ.q}
              </h3>

              <div style={{ display: 'grid', gap: 10 }}>
                {currentQ.opts.map((opt, i) => {
                  let border = '#1e2a4a', bg = '#0a1025', textColor = '#e2e8f0';
                  if (showFeedback) {
                    if (i === currentQ.ans) { border = COLORS.accent; bg = 'rgba(16,185,129,0.1)'; textColor = '#fff'; }
                    else if (i === selectedAnswer) { border = COLORS.red; bg = 'rgba(239,68,68,0.1)'; }
                  }
                  return (
                    <button key={i} className="btn-opt" onClick={() => selectAnswer(i)} disabled={showFeedback}
                      style={{ padding: '14px 18px', borderRadius: 12, border: `2px solid ${border}`, background: bg, color: textColor, textAlign: 'left', cursor: showFeedback ? 'default' : 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5, width: '100%' }}>
                      <span style={{ minWidth: 26, height: 26, background: border, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, flexShrink: 0, marginTop: 1 }}>
                        {['A', 'B', 'C', 'D', 'E'][i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div style={{ marginTop: 24, padding: '18px 20px', borderRadius: 16, background: feedbackType === 'ok' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${feedbackType === 'ok' ? COLORS.accent : COLORS.red}`, animation: 'fadeIn 0.3s ease' }}>
                  {feedbackType === 'timeout' && <p style={{ margin: '0 0 8px', color: COLORS.orange, fontWeight: 700 }}>⏱️ Tempo esgotado!</p>}
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#e2e8f0' }}>{currentQ.feedback}</p>
                  <div style={{ textAlign: 'right', marginTop: 16 }}>
                    <button onClick={nextStep} style={{ background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.sky})`, color: '#fff', border: 'none', padding: '10px 28px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                      {step === roundQuestions.length - 1 ? '🏁 Ver Final' : 'Próxima Matriz →'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {screen === 'end' && (
          <div className="animate-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: 8 }}>{getLevel(score).icon}</div>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', margin: '0 0 8px', color: '#fff', fontWeight: 900 }}>Simulado Concluído!</h1>
            <p style={{ color: COLORS.mid, marginBottom: 32 }}>{playerName} · Futuro Arquiteto de Software · CEUNI-FAMETRO</p>

            <div style={{ background: 'rgba(99,102,241,0.06)', border: `2px solid ${COLORS.purple}`, borderRadius: 28, padding: '40px 32px', marginBottom: 28 }}>
              <div style={{ fontSize: 14, letterSpacing: 3, color: COLORS.sky, fontFamily: 'JetBrains Mono', marginBottom: 8 }}>{getLevel(score).name.toUpperCase()}</div>
              <div style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 900, color: COLORS.purple, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>{score.toLocaleString('pt-BR')}</div>
              <div style={{ color: COLORS.mid, marginBottom: 28 }}>pontos XP em AED</div>

              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ background: '#0a1025', padding: '16px 24px', borderRadius: 16, border: '1px solid #1e2a4a', minWidth: 110 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.accent, fontFamily: 'JetBrains Mono' }}>{Math.round((correctCount / roundQuestions.length) * 100)}%</div>
                  <div style={{ fontSize: 10, color: COLORS.mid, marginTop: 4 }}>PRECISÃO</div>
                </div>
                <div style={{ background: '#0a1025', padding: '16px 24px', borderRadius: 16, border: '1px solid #1e2a4a', minWidth: 110 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.sky, fontFamily: 'JetBrains Mono' }}>{correctCount}/{roundQuestions.length}</div>
                  <div style={{ fontSize: 10, color: COLORS.mid, marginTop: 4 }}>QUESTÕES</div>
                </div>
                <div style={{ background: '#0a1025', padding: '16px 24px', borderRadius: 16, border: '1px solid #1e2a4a', minWidth: 110 }}>
                  <div style={{ fontSize: 24 }}>{getBadge(score).icon}</div>
                  <div style={{ fontSize: 10, color: COLORS.mid, marginTop: 4 }}>{getBadge(score).name.toUpperCase()}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={playNextRound} style={{ background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.sky})`, color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 14, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
                🔄 Iniciar Nova Rodada
              </button>
              <Link to="/fametro/aed/matrizes/ranking" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 32px', borderRadius: 14, textDecoration: 'none', fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center' }}>
                🏆 Ver Ranking Matrizes
              </Link>
              <Link to="/fametro" style={{ background: 'transparent', color: COLORS.mid, border: '1px solid #1e2a4a', padding: '14px 28px', borderRadius: 14, textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center' }}>
                ← Menu Fametro
              </Link>
            </div>
          </div>
        )}
      </div>

      {comboAnim && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 52, fontWeight: 900, color: COLORS.accent, zIndex: 1000, textShadow: '0 0 24px rgba(16,185,129,0.9)', animation: 'combo-pop 1s ease-out forwards', pointerEvents: 'none' }}>
          ⚡ COMBO ×{combo}
        </div>
      )}
    </div>
  );
}
