// src/data/formacaoDocenteData.js
// Dados e questões da Oficina de Formação Docente 2026.2 - CEUNI-FAMETRO
// Tema: Engenharia de Prompts com Inteligência Artificial para Criação de Questões no Padrão ENADE
// Ferramentas: ChatGPT | Google Gemini | Claude.ai
// Instrutor: Prof. Alexsander Farias

export const WORKSHOP_INFO = {
  title: "Engenharia de Prompts com Inteligência Artificial",
  subtitle: "Criação de Questões no Padrão ENADE",
  edition: "Formação Docente 2026.2",
  institution: "Centro Universitário FAMETRO",
  instructor: "Prof. Alexsander Farias",
  department: "Setor de Qualidade de Ensino • Avalia 2.0 • Cursos de Computação",
  location: "Manaus - AM",
  tools: ["ChatGPT", "Google Gemini", "Claude.ai"]
};

export const QUESTIONS_FORMACAO_DOCENTE = [
  {
    id: 1,
    category: "ENGENHARIA DE PROMPTS & PERSONA",
    context: "Durante a preparação do banco de questões institucionais do CEUNI-FAMETRO para o ENADE 2026, um docente tentou gerar uma questão solicitando à IA: 'Crie uma questão de prova sobre banco de dados'. O resultado gerado pelo modelo de linguagem foi uma pergunta direta e simplista de memorização ('O que é chave primária?'), sem texto-base, sem situação-problema e sem o alinhamento com a matriz de referência do INEP. Para corrigir o problema, o professor decidiu aplicar a técnica de Role Prompting (Atribuição de Persona), definindo a identidade e o comportamento esperado da Inteligência Artificial.",
    text: "Considerando a teoria de Engenharia de Prompts aplicada à avaliação educacional superior, qual estrutura de instrução exemplifica corretamente a atribuição de persona adequada para direcionar LLMs (ChatGPT, Gemini ou Claude) na elaboração de itens inéditos no Padrão ENADE?",
    answers: [
      "\"Atue como um gerador de testes de múltipla escolha e crie 5 perguntas rápidas com gabarito para verificar se os alunos leram a bibliografia básica da disciplina.\"",
      "\"Atue como um Especialista em Avaliação Educacional do INEP/ENADE e Docente Universitário. Elabore um item inédito composto por texto-base contextualizado, situação-problema e comando objetivo, avaliando competências de análise e aplicação.\"",
      "\"Aja como um revisor gramatical de provas acadêmicas e corrija os erros ortográficos e de pontuação de uma questão pré-existente sobre modelagem relacional de dados.\"",
      "\"Resuma o Guia de Elaboração de Itens do INEP em tópicos simples para que os alunos da graduação consigam entender como as notas do ENADE são calculadas.\"",
      "\"Comporte-se como um aluno respondendo a um simulado do ENADE e escolha a alternativa correta entre as opções fornecidas pela banca examinadora da instituição.\""
    ],
    correct: 1,
    feedback: "Alternativa B. A técnica de Role Prompting especifica a persona ('Especialista em Avaliação Educacional do INEP/ENADE'), o contexto de atuação e os componentes estruturais do item (texto-base, situação-problema, comando), elevando significativamente a qualidade pedagógica da resposta do LLM.",
    points: 12.5,
    bloomLevel: "Aplicação / Criação"
  },
  {
    id: 2,
    category: "ESTRUTURA DO ITEM ENADE",
    context: "O Guia de Elaboração de Itens do INEP estabelece que uma questão no Padrão ENADE não deve mensurar a simples retenção de informações conceituais isoladas, mas sim a capacidade do estudante de integrar conhecimentos e solucionar problemas reais do exercício profissional. A estrutura anatômica padrão de uma questão ENADE é dividida em três partes fundamentais: (1) Texto-base ou Suporte, (2) Situação-Problema ou Enunciado propriamente dito, e (3) Comando com as opções de resposta (Gabarito e Distratores).",
    text: "Ao utilizar ferramentas de IA Generativa para construir a estrutura de uma questão alinhada às diretrizes do INEP, qual requisito pedagógico deve ser exigido obrigatoriamente no prompt em relação aos distratores (alternativas incorretas)?",
    answers: [
      "Os distratores devem conter erros gramaticais intencionais e palavras absurdas para que o estudante identifique facilmente a resposta correta por eliminação rápida.",
      "Os distratores devem ser nitidamente falsos e incoerentes com a área do conhecimento, garantindo que 100% dos alunos acertem o item sem esforço reflexivo.",
      "Os distratores devem ser plausíveis e fundamentados em equívocos conceituais ou raciocínios parciais frequentes durante o processo de aprendizagem, sem pegadinhas triviais.",
      "Todas as alternativas incorretas devem ter comprimentos visivelmente menores que o gabarito oficial para facilitar a formatação da folha de resposta.",
      "Os distratores devem utilizar negações duplas e termos como 'nunca', 'jamais' e 'sempre' para confundir o candidato durante a leitura sob pressão de tempo."
    ],
    correct: 2,
    feedback: "Alternativa C. No Padrão ENADE, os distratores devem ser plausíveis (atraentes para quem não domina totalmente o conceito), representando hipóteses de raciocínio incompleto ou concepções alternativas comuns, evitando pegadinhas ou pegadas óbvias.",
    points: 12.5,
    bloomLevel: "Análise"
  },
  {
    id: 3,
    category: "FEW-SHOT PROMPTING & EXEMPLIFICAÇÃO",
    context: "Um professor do curso de Engenharia da FAMETRO notou que, ao solicitar questões de IA sem exemplos prévios (Zero-Shot Prompting), as alternativas vinham mal formatadas e os enunciados não seguiam o tom técnico e acadêmico característico das provas do INEP. Para resolver essa limitação, o professor decidiu empregar a técnica de Few-Shot Prompting na interação com a IA.",
    text: "Assinale a alternativa que descreve corretamente a aplicação técnica do Few-Shot Prompting no processo de geração de itens avaliativos via IA Generativa:",
    answers: [
      "Solicitar à IA que gere a resposta em poucos segundos (poucos shots) ativando o modo de resposta ultrarrápida do modelo de linguagem.",
      "Fornecer ao LLM um ou mais exemplos completos de questões padrão ENADE já validadas (com texto-base, comando e justificativa de gabarito) antes de pedir a criação do novo item.",
      "Limitar o prompt a poucas palavras (menos de 10 palavras por instrução) para evitar o consumo excessivo de tokens na API do ChatGPT ou Gemini.",
      "Dividir o prompt entre múltiplos professores para que cada um escreva uma frase isolada na caixa de diálogo do assistente de IA.",
      "Executar o mesmo prompt 5 vezes seguidas na mesma janela até que o modelo sorteie uma opção aceitável de questão."
    ],
    correct: 1,
    feedback: "Alternativa B. O Few-Shot Prompting consiste em fornecer exemplos estruturados de entrada/saída no próprio prompt, permitindo que a IA aprenda o padrão de formatação, tom de linguagem e rigor pedagógico desejados antes de gerar novos conteúdos.",
    points: 12.5,
    bloomLevel: "Aplicação"
  },
  {
    id: 4,
    category: "CADEIA DE PENSAMENTO (CHAIN-OF-THOUGHT)",
    context: "A técnica de Cadeia de Pensamento (Chain-of-Thought - CoT) força os modelos de IA Generativa a realizarem uma etapa intermediária de raciocínio explícito antes de apresentarem o resultado final. Na elaboração docente de questões complexas, essa técnica é usada para evitar alucinações de modelos e garantir que a lógica por trás da resolução da questão seja consistente.",
    text: "De que maneira o docente pode aplicar a Cadeia de Pensamento (CoT) em seu prompt para assegurar a consistência técnica e o rigor conceitual do gabarito de uma questão ENADE?",
    answers: [
      "Pedindo para a IA responder imediatamente a opção correta sem explicar o porquê, reduzindo o tempo de processamento do servidor.",
      "Instruindo o modelo: 'Antes de gerar a questão final, pense passo a passo: explique o problema real, justifique teoricamente a resposta correta e detalhe o erro conceitual presente em cada distrator'.",
      "Solicitando que o modelo de IA utilize apenas rimas e figuras de linguagem na escrita da explicação do gabarito.",
      "Forçando o assistente a traduzir o enunciado da questão para três idiomas diferentes antes de indicar a alternativa A ou B.",
      "Exigindo que a IA consulte o dicionário de sinônimos para substituir todas as palavras difíceis do texto por termos coloquiais."
    ],
    correct: 1,
    feedback: "Alternativa B. Ao exigir o raciocínio passo a passo ('chain-of-thought'), o modelo de IA refina a lógica interna, reduz alucinações conceituais e entrega um gabarito comentado detalhando por que cada alternativa está correta ou incorreta.",
    points: 12.5,
    bloomLevel: "Análise / Avaliação"
  },
  {
    id: 5,
    category: "TAXONOMIA DE BLOOM & NÍVEIS COGNITIVOS",
    context: "A Taxonomia de Bloom Revisitada classifica os objetivos educacionais em seis níveis cognitivos: Lembrar, Entender, Aplicar, Analisar, Avaliar e Criar. As avaliações do ENADE concentram seu foco nos níveis cognitivos superiores (Analisar, Avaliar e Criar), onde o estudante precisa julgar cenários, diagnosticar problemas e propor soluções fundamentadas.",
    text: "Ao redigir o comando de uma questão via Engenharia de Prompts para atingir o nível de 'Avaliação/Análise' da Taxonomia de Bloom no padrão ENADE, qual verbo/expressão de comando é o mais adequado?",
    answers: [
      "\"Cite o nome do autor da teoria e liste as três definições básicas presentes no primeiro capítulo do livro-texto.\"",
      "\"Assinale a alternativa que traz a tradução exata do termo técnico para a língua inglesa.\"",
      "\"Considerando os dados do estudo de caso fornecido, avalie as asserções I e II, diagnosticando a causa raiz da falha apresentada e a relação de causalidade entre elas.\"",
      "\"Reescreva a definição de software livre utilizando suas próprias palavras em apenas uma linha de texto.\"",
      "\"Memorize a fórmula matemática e marque a opção que repete exatamente os mesmos números apresentados na aula expositiva.\""
    ],
    correct: 2,
    feedback: "Alternativa C. Questões de Análise/Avaliação no padrão ENADE exigem o julgamento de asserções (Proposição I e II) com análise de causalidade, interpretação de dados de casos reais e tomada de decisão fundamentada.",
    points: 12.5,
    bloomLevel: "Avaliação"
  },
  {
    id: 6,
    category: "HUMAN-IN-THE-LOOP & AVALIA 2.0",
    context: "No Centro Universitário FAMETRO, a utilização de ferramentas de Inteligência Artificial Generativa no fluxo de trabalho docente é estimulada de forma ética, crítica e reflexiva. O conceito de 'Human-in-the-Loop' (Humano no Ciclo) preconiza que a IA atue como uma copiloto de produtividade pedagógica, cabendo ao docente a validação final da produção acadêmica.",
    text: "Qual das seguintes atitudes reflete as melhores práticas da docência no uso de IA para elaboração de avaliações institucionais no ecossistema Avalia 2.0?",
    answers: [
      "Copiar e colar diretamente o resultado bruto da IA na prova oficial sem leitura prévia, visto que os algoritmos de LLM nunca cometem equívocos técnicos.",
      "Utilizar a IA para gerar a primeira versão do item, realizando em seguida a revisão crítica do docente quanto ao alinhamento bibliográfico, precisão conceitual, viés e adequação ao perfil do estudante FAMETRO.",
      "Proibir 100% o uso de Inteligência Artificial pelos professores, exigindo que todas as questões sejam redigidas exclusivamente com papel e caneta.",
      "Delegar aos estudantes a tarefa de elaborar as questões de prova utilizando prompts livres sem supervisão do professor responsável.",
      "Substituir todo o corpo docente por agentes autônomos de IA para a aplicação e correção de avaliações em tempo real."
    ],
    correct: 1,
    feedback: "Alternativa B. O princípio Human-in-the-Loop assegura a autoridade pedagógica do docente. A IA acelera a ideação e a estruturação dos itens, enquanto o professor garante o rigor acadêmico, alinhamento ao PPC e precisão técnica.",
    points: 12.5,
    bloomLevel: "Avaliação / Ética Docente"
  },
  {
    id: 7,
    category: "LLMs COMPARATIVOS (CHATGPT, GEMINI & CLAUDE)",
    context: "Durante a oficina de Formação Docente 2026.2, o Prof. Alexsander Farias apresentou a aplicação prática dos três principais LLMs do mercado: ChatGPT (OpenAI), Google Gemini e Claude.ai (Anthropic). Cada ferramenta possui pontos fortes específicos na esteira de produção de conteúdo pedagógico e análise de dados acadêmicos.",
    text: "Sobre as particularidades e o uso combinado das ferramentas de IA Generativa na elaboração de itens e materiais de apoio, assinale a afirmativa correta:",
    answers: [
      "O Claude.ai destaca-se no processamento de textos longos e raciocínio nuances em redações pedagógicas, o Gemini integra-se ao ecossistema Google Workspace para busca em tempo real, e o ChatGPT oferece alta versatilidade com GPTs personalizados.",
      "O ChatGPT funciona apenas para cálculos matemáticos simples e não aceita comandos em português.",
      "O Google Gemini exige que todas as questões de prova sejam escritas obrigatoriamente em código Python.",
      "O Claude.ai é um modelo exclusivo para edição de imagens e não processa textos ou itens no padrão ENADE.",
      "As três ferramentas utilizam o mesmo modelo interno e produzem exatamente as mesmas palavras quando submetidas ao mesmo prompt."
    ],
    correct: 0,
    feedback: "Alternativa A. Cada LLM traz vantagens estratégicas ao ecossistema docente: o Claude se destaca na fluência de texto acadêmico e análise profunda; o Gemini na integração com a web e Google Docs; e o ChatGPT na versatilidade e criação de assistentes customizados.",
    points: 12.5,
    bloomLevel: "Análise Comparativa"
  },
  {
    id: 8,
    category: "RAG & CONTEXTUALIZAÇÃO COM MATRIZ DO INEP",
    context: "Para evitar que a IA gere conteúdos genéricos ou fora do programa de ensino, a Engenharia de Prompts avançada utiliza estratégias de ancoragem em documentos oficiais, injetando excertos de diretrizes curriculares, Planos de Ensino e Matrizes de Referência do ENADE no contexto da conversa (Retrieval-Augmented Generation / Injeção de Contexto).",
    text: "Qual a vantagem estratégica do docente ao fornecer a Matriz de Referência da disciplina e o Plano de Ensino dentro do prompt de criação da questão?",
    answers: [
      "Aumentar o tamanho do arquivo para que a impressora demore mais para imprimir as provas.",
      "Garantir que a IA gere itens perfeitamente aderentes aos objetos de conhecimento e às habilidades específicas cobradas pelo INEP e ministradas em sala de aula.",
      "Impedir que os alunos tenham acesso ao gabarito da avaliação por meio de bloqueio de senha no arquivo PDF.",
      "Fazer com que a IA recuse responder e peça ao professor para escolher outra disciplina.",
      "Substituir a necessidade de realização da prova presencial por uma conversa informal no WhatsApp."
    ],
    correct: 1,
    feedback: "Alternativa B. Injetar a Matriz de Referência e os objetivos do Plano de Ensino no prompt funciona como uma ancoragem contextual (RAG), fazendo com que o item gerado pela IA cubra exatamente os tópicos de aprendizagem pretendidos pela instituição.",
    points: 12.5,
    bloomLevel: "Criação / Estratégia"
  }
];
