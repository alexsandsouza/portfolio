// src/data/formacaoDocenteData.js
// Dados e questões da Oficina de Formação Docente 2026.2 - CEUNI-FAMETRO
// Tema: Engenharia de Prompts com IA Generativa para Criação de Questões no Padrão ENADE
// Conteúdo totalmente baseado na apresentação oficial de slides: Slides_ENADE_Engenharia_Prompts_2026_ATUAL.pptx
// Instrutor: Prof. Alexsander Farias

export const WORKSHOP_INFO = {
  title: "Engenharia de Prompts com Inteligência Artificial",
  subtitle: "Criação de Questões no Padrão ENADE",
  edition: "Formação Docente 2026.2",
  institution: "Centro Universitário FAMETRO",
  instructor: "Prof. Alexsander Farias",
  department: "Setor de Qualidade de Ensino • Avalia 2.0 • Cursos de Computação",
  location: "Manaus - AM",
  date: "22/07/2026",
  tools: ["ChatGPT", "Google Gemini", "Claude.ai"]
};

export const QUESTIONS_FORMACAO_DOCENTE = [
  {
    id: 1,
    category: "ENGENHARIA DE PROMPTS - OS 4 PILARES",
    slideRef: "Slide 10: Os 4 Pilares do Prompt Profissional",
    context: "Durante a oficina de Formação Docente do CEUNI-FAMETRO, ressaltou-se que prompts genéricos (como 'crie uma questão ENADE sobre o tema X') geram resultados superficiais, sem contextualização profissional ou rigor pedagógico. O Slide 10 da apresentação estabelece a estrutura de um Prompt Profissional fundamentada em quatro pilares indispensáveis para garantir a qualidade das avaliações acadêmicas.",
    text: "Considerando a estrutura técnica dos 4 Pilares do Prompt Profissional apresentada no treinamento (Persona, Contexto, Instrução e Formato), qual afirmativa associa corretamente cada um desses pilares à sua respectiva função na esteira de elaboração?",
    answers: [
      "A Persona especifica o modelo matemático da IA; o Contexto define a linguagem de programação; a Instrução solicita a correção do código; e o Formato impõe o limite de caracteres por linha.",
      "A Persona estabelece o papel pedagógico do modelo; o Contexto delimita o cenário e fontes; a Instrução detalha a tarefa esperada; e o Formato determina os critérios e padrão do item.",
      "A Persona indica o nome do docente requisitante; o Contexto lista a bibliografia do curso; a Instrução exige a exportação em arquivo PDF; e o Formato define a cor do tema da prova impressa.",
      "A Persona restringe o acesso aos dados da web; o Contexto formata as tabelas de resposta; a Instrução automatiza o envio de e-mails; e o Formato calcula a nota final dos estudantes inscritos.",
      "A Persona gera a chave de acesso da API; o Contexto traduz o enunciado para outro idioma; a Instrução sorteia os distratores; e o Formato cria o banco de dados das avaliações do setor."
    ],
    correct: 1,
    feedback: "Alternativa B. Segundo o Slide 10, a fórmula do Prompt Profissional é: PERSONA (Quem a IA deve ser - Ex: docente elaborador ENADE) + CONTEXTO (Cenário, tema e fontes) + INSTRUÇÃO (O que deve ser feito) + FORMATO (Critérios, tom e nível cognitivo).",
    points: 12.5,
    bloomLevel: "Análise / Aplicação"
  },
  {
    id: 2,
    category: "TRÍADE DE FERRAMENTAS DE IA",
    slideRef: "Slide 9: ChatGPT, Gemini ou Claude: Qual Usar?",
    context: "O Slide 9 da formação apresenta uma estratégia articulada para o uso combinado dos três principais modelos de linguagem do mercado (ChatGPT, Google Gemini e Claude.ai). Em vez de depender de uma única ferramenta, o docente deve organizar uma esteira de produção onde cada assistente de IA contribui com sua especialidade na criação de itens pedagógicos.",
    text: "Diante da estratégia recomendada no treinamento para o uso combinado dos LLMs na construção de avaliações acadêmicas, qual sequência descreve a função ideal de cada assistente de IA no fluxo de produção pedagógica?",
    answers: [
      "O ChatGPT pesquisa fontes em tempo real; o Gemini realiza a auditoria gramatical avançada; e o Claude gera os rascunhos iniciais de questões de múltipla escolha sem necessidade de revisão.",
      "O ChatGPT é utilizado para ideação e rascunhos; o Gemini para ampliação de cenário com dados; e o Claude para revisão crítica, clareza e busca por ambiguidades no enunciado.",
      "O ChatGPT corrige provas discursivas em lote; o Gemini formata a estrutura gráfica das imagens; e o Claude exporta os arquivos diretamente para o sistema de notas institucional.",
      "O ChatGPT calcula as estatísticas de desempenho; o Gemini cria os templates de apresentação; e o Claude substitui a validação humana na aprovação dos itens para homologação.",
      "O ChatGPT traduz termos técnicos do enunciado; o Gemini bloqueia acessos indevidos da internet; e o Claude gera automaticamente as respostas discursivas da folha de frequência."
    ],
    correct: 1,
    feedback: "Alternativa B. Conforme o Slide 9, o fluxo ideal é: 1. ChatGPT para ideação e rascunho inicial; 2. Google Gemini para pesquisa, dados e contextualização; 3. Claude.ai para revisão crítica, refinamento e eliminação de ambiguidades.",
    points: 12.5,
    bloomLevel: "Análise Comparativa"
  },
  {
    id: 3,
    category: "AVALIAÇÃO POR COMPETÊNCIAS (CHA)",
    slideRef: "Slides 5 e 6: O que é Competência? Aprendizagem Ativa",
    context: "Nos Slides 5 e 6 da formação, aborda-se a transição da tradicional transmissão passiva de conteúdos para a avaliação por competências. Define-se competência como a mobilização articulada de Conhecimentos, Habilidades e Atitudes (CHA) para desempenhar funções típicas segundo padrões de qualidade e produtividade em cenários reais.",
    text: "Com base nos pilares da avaliação por competências apresentados na oficina, qual afirmativa expressa a mudança fundamental exigida na postura do professor e no desenho das questões de avaliação institucional?",
    answers: [
      "A avaliação deve priorizar a reprodução exata de definições conceituais expostas em sala, garantindo que o docente meça a capacidade de retenção de memória dos estudantes da disciplina.",
      "A avaliação exige propor tarefas baseadas em problemas e evidências reais, onde o estudante atua como protagonista mobilizando o que sabe para tomar decisões e solucionar cenários.",
      "A avaliação por competências elimina a necessidade de objetivos de aprendizagem prévios, concentrando todo o processo na aplicação de testes de múltipla escolha com perguntas diretas.",
      "A avaliação substitui a análise de problemas práticos pela contagem de presença e participação em aula, delegando o julgamento de desempenho às respostas de questionários genéricos.",
      "A avaliação deve focar no conteúdo isolado de cada capítulo do livro-texto, desconsiderando a conexão com as demandas do mercado para manter o rigor estritamente teórico da disciplina."
    ],
    correct: 1,
    feedback: "Alternativa B. Segundo os Slides 5 e 6, 'não basta saber: é preciso mobilizar o que se sabe diante de uma situação'. A avaliação por competências contrapõe-se à simples transmissão e exige protagonismo, evidências e conexão com cenários profissionais.",
    points: 12.5,
    bloomLevel: "Avaliação / Conceitual"
  },
  {
    id: 4,
    category: "ANATOMIA DA QUESTÃO ENADE",
    slideRef: "Slide 11: Anatomia da Questão ENADE",
    context: "O Slide 11 da apresentação detalha os quatro componentes essenciais na estrutura anatômica de uma questão no Padrão ENADE: (1) Texto-base (caso, gráfico ou notícia real), (2) Enunciado/Comando objetivo com verbo de ação, (3) Alternativas (uma correta e quatro distratores) e (4) Gabarito comentado.",
    text: "Levando em consideração as diretrizes de elaboração do INEP e o conteúdo ministrado na oficina, como deve ser estruturado o conjunto de alternativas de uma questão objetiva padrão ENADE?",
    answers: [
      "O conjunto deve apresentar quatro opções nitidamente absurdas e um gabarito extenso, permitindo que o candidato identifique a resposta correta por simples comparação de tamanho.",
      "O conjunto deve conter uma alternativa correta e quatro distratores plausíveis fundamentados em equívocos conceituais reais, acompanhados de justificativa detalhada do gabarito.",
      "O conjunto precisa utilizar pegadinhas gramaticais e termos como 'nunca' ou 'sempre', forçando o estudante a errar o item por falta de atenção na leitura de enunciados longos.",
      "O conjunto deve variar o tamanho das alternativas de forma acentuada, destacando a opção verdadeira com termos técnicos complexos e palavras em idiomas estrangeiros sem tradução.",
      "O conjunto pode omitir o gabarito comentado no banco de dados, desde que as alternativas incorretas sejam formuladas com erros ortográficos evidentes para facilitar a correção."
    ],
    correct: 1,
    feedback: "Alternativa B. De acordo com o Slide 11, o item ENADE exige 5 alternativas (A-E), contendo exatamente uma opção correta e quatro distratores plausíveis (baseados em erros ou raciocínios parciais comuns), além de gabarito comentado.",
    points: 12.5,
    bloomLevel: "Aplicação"
  },
  {
    id: 5,
    category: "TAXONOMIA DE BLOOM NO ENADE",
    slideRef: "Slide 12: Taxonomia de Bloom no ENADE",
    context: "O Slide 12 apresenta a Taxonomia de Bloom no contexto das avaliações do INEP, dividida em seis níveis hierárquicos: Lembrar, Compreender, Aplicar, Analisar, Avaliar e Criar. O treinamento destaca de forma expressiva quais desses níveis são efetivamente priorizados na construção das provas do ENADE.",
    text: "De acordo com a orientação pedagógica da oficina para o alinhamento de itens ao padrão do INEP, quais são os níveis da Taxonomia de Bloom priorizados nas provas do ENADE e como eles se refletem nas questões?",
    answers: [
      "Prioriza Lembrar e Compreender; refletindo-se em questões que solicitam a identificação direta de nomes de autores, listagem de fórmulas e simples repetição de conceitos de aula.",
      "Prioriza Analisar, Avaliar e Criar; refletindo-se em questões que exigem comparar cenários, diagnosticar causas, julgar asserções complexas e propor soluções profissionais fundamentadas.",
      "Prioriza Aplicar e Lembrar; refletindo-se em questões com cálculos matemáticos diretos sem contextualização, focadas na memorização de procedimentos operacionais padronizados.",
      "Prioriza Compreender e Criar; refletindo-se em redações livres de opinião pessoal sem necessidade de fundamentação em dados, notícias, gráficos ou casos práticos da área do saber.",
      "Prioriza apenas o nível Lembrar; refletindo-se em testes de preenchimento de lacunas e associação de colunas sem qualquer relação com a resolução de problemas do mundo real."
    ],
    correct: 1,
    feedback: "Alternativa B. O Slide 12 enfatiza explicitamente em caixa alta: 'ENADE PRIORIZA: ANALISAR, AVALIAR e CRIAR'. As questões exigem exames comparativos, julgamento crítico e elaboração autoral de propostas de solução.",
    points: 12.5,
    bloomLevel: "Análise / Avaliação"
  },
  {
    id: 6,
    category: "ALINHAMENTO CONSTRUTIVO E AVALIAÇÃO JUSTA",
    slideRef: "Slides 4 e 7: Avaliação Justa Exige Alinhamento",
    context: "Os Slides 4 e 7 tratam da importância do Alinhamento Construtivo para assegurar uma avaliação justa. A coerência pedagógica exige um fluxo contínuo entre quatro passos essenciais: 1. Objetivos -> 2. Experiências/Estratégias -> 3. Evidências de aprendizagem -> 4. Competências verificadas.",
    text: "Ao utilizar a Engenharia de Prompts para gerar uma avaliação institucional coerente, de que forma o docente garante o cumprimento do princípio de alinhamento construtivo?",
    answers: [
      "Elaborando questões com nível de exigência desconectado das aulas para surpreender a turma, medindo a capacidade dos estudantes de resolver problemas sem instrução prévia.",
      "Garantindo que os objetivos da disciplina orientem as atividades propostas e que a questão de prova exija evidências de desempenho compatíveis com as competências desenvolvidas.",
      "Alterando os critérios de correção após a aplicação da prova, adaptando o peso das questões de acordo com a quantidade de acertos obtidos pela maioria dos alunos avaliados.",
      "Seleção de prompts aleatórios da internet sem relação com o plano de ensino, focando a avaliação na diversidade de temas não abordados durante o período acadêmico.",
      "Delegando a definição dos objetivos da disciplina ao modelo de IA Generativa, aceitando qualquer enunciado gerado como evidência suficiente de aprendizagem profissional."
    ],
    correct: 1,
    feedback: "Alternativa B. Segundo os Slides 4 e 7, a avaliação justa nasce do alinhamento entre o que foi planejado (Objetivos), o que foi vivenciado em aula (Experiências) e as tarefas propostas para demonstrar o aprendizado (Evidências).",
    points: 12.5,
    bloomLevel: "Avaliação"
  },
  {
    id: 7,
    category: "PROMPT FRACO × PROMPT PROFISSIONAL",
    slideRef: "Slide 13: Prompt Fraco × Prompt Profissional",
    context: "No Slide 13 da apresentação, realiza-se um confronto prático entre um 'Prompt Fraco' (ex: 'Crie uma questão ENADE sobre sustentabilidade') e um 'Prompt Profissional'. O prompt fraco resulta em um item genérico, de baixo nível cognitivo e distratores óbvios.",
    text: "Diante da análise comparativa exposta no treinamento, qual característica diferencia fundamentalmente a construção de um Prompt Profissional na esteira de produção docente?",
    answers: [
      "A brevidade da instrução, visto que prompts de uma única linha economizam o tempo de processamento dos servidores da IA e evitam ambiguidades na resposta do modelo de linguagem.",
      "A explicitação rigorosa da persona, contexto com fontes verificáveis, tarefa estruturada, nivelamento cognitivo desejado e padrão de entrega do item no formato oficial do INEP.",
      "A ausência de restrições de formato, permitindo que a IA escolha livremente o tom da linguagem, o número de alternativas e o nível de dificuldade do enunciado a ser gerado.",
      "O uso exclusivo de comandos em línguas estrangeiras, forçando o assistente a consultar dicionários acadêmicos antes de estruturar os distratores da questão de múltipla escolha.",
      "A solicitação de que a IA crie a questão sem fornecer o texto-base, confiando na capacidade do modelo de inventar cenários fictícios sem fundamentação em dados da realidade."
    ],
    correct: 1,
    feedback: "Alternativa B. O Slide 13 demonstra que o Prompt Profissional explicita papel (Persona), cenário com fontes (Contexto), produto esperado (Tarefa), nível da Taxonomia de Bloom e formato de entrega técnico e objetivo.",
    points: 12.5,
    bloomLevel: "Análise / Sintetização"
  },
  {
    id: 8,
    category: "IMPORTÂNCIA E LIMITES DA IA",
    slideRef: "Slides 8 e 15: Importância do Prompt & Síntese da Formação",
    context: "Nos Slides 8 e 15, o Prof. Alexsander Farias sintetiza a visão institucional sobre o uso da IA Generativa na docência: 'A IA é uma ferramenta poderosa, não um oráculo. A IA não substitui experiência, sensibilidade e propósito. Ela amplia o tempo dedicado a ensinar, inspirar e transformar vidas.'",
    text: "Considerando os limites éticos e técnicos das ferramentas de IA na produção acadêmica, qual é o papel insubstituível do professor no ciclo de elaboração de avaliações no ecossistema FAMETRO?",
    answers: [
      "Atuar como mero operador de digitação de prompts, transferindo a responsabilidade da aprovação do conteúdo pedagógico integralmente para os algoritmos dos modelos de linguagem.",
      "Exercer a validação humana crítica, revisando o alinhamento ao PPC, a clareza conceitual, a ausência de viés e a precisão do item antes da aplicação final na avaliação dos alunos.",
      "Restringir o uso de IA apenas para a correção automatizada da folha de respostas, proibindo a utilização de assistentes inteligentes em qualquer etapa do planejamento didático.",
      "Utilizar o resultado bruto gerado pelo assistente de IA sem qualquer alteração, para demonstrar a total confiança da instituição nas tecnologias de inteligência artificial.",
      "Substituir o plano de ensino da disciplina por conversas informais com o ChatGPT, permitindo que o modelo defina sozinho a nota de aprovação de todos os estudantes matriculados."
    ],
    correct: 1,
    feedback: "Alternativa B. Conforme destacado nos Slides 8 e 15, a IA economiza tempo e padroniza a estrutura, mas o professor é o validador humano insubstituível que assegura a sensibilidade, o rigor técnico e o propósito pedagógico.",
    points: 12.5,
    bloomLevel: "Avaliação / Ética Docente"
  }
];
