// ─── QUESTIONS DATA - MODELO A (ORIGINAL) ───────────────────────────────────────────────
export const QUESTIONS_A = [
  {
    id: 1,
    theme: "Processo de Engenharia de Requisitos",
    text: "**Contexto Profissional:** Uma empresa de desenvolvimento de software está enfrentando uma alta taxa de rotatividade em sua equipe técnica, resultando em severa perda de conhecimento tácito. Atualmente, a empresa está construindo um sistema crítico para a gestão de prontuários médicos de uma rede de hospitais.\n\n**O Problema:** Durante as últimas entregas, observou-se que os desenvolvedores estão implementando funcionalidades de forma bem diferente daquilo que os médicos e administradores (stakeholders) haviam solicitado inicialmente. Investigando o problema, constatou-se que a equipe se baseia quase que exclusivamente em comunicações verbais informais, mensagens rápidas em aplicativos corporativos e anotações dispersas em cadernos individuais. Um novo analista de sistemas foi contratado com a missão urgente de resolver essas falhas de comunicação, alinhar o entendimento entre a área de saúde e a equipe de tecnologia, e assegurar a qualidade do produto. Ele precisa instituir uma prática que atue como a espinha dorsal do ciclo de vida deste projeto.\n\n**Questão:** Considerando os objetivos fundamentais da documentação de requisitos em engenharia de software e a criticidade do cenário hospitalar apresentado, qual deve ser a principal diretriz de ação adotada pelo novo analista de sistemas?",
    options: [
      "A) Estabelecer uma especificação formal como referência central do projeto, visando alinhar a comunicação, embasar o desenvolvimento e gerir mudanças de forma sistemática.",
      "B) Implementar scripts de testes automatizados de forma imediata, garantindo que os acordos verbais entre médicos e programadores funcionem adequadamente no ambiente clínico.",
      "C) Promover reuniões diárias de alinhamento com os stakeholders para substituir artefatos escritos, priorizando a agilidade nas entregas e a rápida implantação do sistema.",
      "D) Criar um backlog genérico e desprovido de detalhes técnicos, proporcionando aos desenvolvedores maior liberdade para interpretar autonomamente as necessidades hospitalares.",
      "E) Paralisar todas as atividades de codificação até que o cliente assine um termo estático, impedindo a inclusão de novos requisitos ou alterações no escopo do projeto."
    ],
    answer: "A",
    feedback: "A especificação formal serve como referência única do projeto, alinhando a comunicação entre stakeholders e equipe de tecnologia, além de embasar os testes e a gerência de mudanças."
  },
  {
    id: 2,
    theme: "Verificação vs Validação",
    text: "**Contexto Profissional:** Uma startup do setor financeiro (fintech) está prestes a lançar uma nova funcionalidade de recomendação de portfólios de investimentos. O documento de requisitos foi elaborado e revisado detalhadamente pela equipe de engenharia.\n\n**O Problema:** Durante a fase de qualidade, a equipe de testes executou os roteiros e confirmou que o sistema faz exatamente o que o documento descreve, incluindo os cálculos de juros compostos conforme as fórmulas matemáticas especificadas. No entanto, durante o lançamento da versão beta para um grupo seleto de usuários, houve uma rejeição em massa. Os investidores relataram que a ferramenta é ineficaz, pois não considera o desconto do imposto de renda sobre os lucros, uma necessidade regulatória e prática indispensável para a tomada de decisão financeira real. O gerente do projeto convocou uma reunião para entender a falha.\n\n**Questão:** Analisando a falha no processo de engenharia de requisitos descrita no caso da startup financeira, como se distinguem os conceitos e os resultados das etapas de verificação e validação neste cenário?",
    options: [
      "A) A falha ocorreu fundamentalmente no processo de verificação, uma vez que o documento possuía termos ambíguos e inconsistentes sobre as regras de tributação fiscal vigentes.",
      "B) Os processos de verificação e validação falharam simultaneamente, pois o software não seguiu a especificação técnica e também não atendeu à viabilidade operacional.",
      "C) A verificação foi bem-sucedida ao atestar que o software cumpriu a especificação escrita, enquanto a validação falhou por não garantir o atendimento às necessidades reais dos usuários.",
      "D) A validação foi executada de maneira adequada durante a fase de qualidade, mas a verificação falhou devido à ausência de envolvimento dos stakeholders no teste beta.",
      "E) O erro se concentra exclusivamente nas atividades de programação do algoritmo, visto que a engenharia de requisitos não possui instrumentos para lidar com exigências regulatórias."
    ],
    answer: "C",
    feedback: "A verificação analisa se o produto foi construído de acordo com a especificação (o software faz o que diz o documento). A validação analisa se construímos o produto certo para as necessidades reais do usuário (a ferramenta não atendeu ao uso real dos investidores)."
  },
  {
    id: 3,
    theme: "Abordagens Documentais",
    text: "**Contexto Profissional:** Uma grande plataforma de comércio eletrônico está reestruturando sua arquitetura tecnológica. A equipe de desenvolvimento do produto é multidisciplinar: engloba analistas de negócios que precisam compreender a jornada do cliente, desenvolvedores de back-end que necessitam de regras de negócio altamente precisas e designers de interface focados na interação.\n\n**O Problema:** Atualmente, a empresa adota um único documento denso e altamente técnico de Especificação de Requisitos de Software (ERS). Como resultado, a equipe de negócios relata extrema dificuldade em compreender o fluxo do usuário, gerando expectativas desalinhadas e frustrações em cada entrega. O arquiteto de software sugere uma modernização nas práticas de engenharia, adotando abordagens documentais adequadas para os diferentes públicos consumidores da informação.\n\n**Questão:** Levando em consideração as características dos diferentes tipos de documentação de requisitos, qual estratégia arquitetural resolve o problema de comunicação transversal apresentado na plataforma de e-commerce?",
    options: [
      "A) Padronizar todo o ciclo de vida adotando unicamente Histórias de Usuário, forçando desenvolvedores e analistas de negócio a unificarem seu vocabulário técnico.",
      "B) Eliminar a Especificação de Requisitos de Software e substituí-la por Casos de Uso, formato que atende espontaneamente às demandas técnicas profundas de infraestrutura.",
      "C) Manter a documentação técnica atual para os stakeholders de negócios e repassar resumos informais em forma de Histórias de Usuário para a equipe de programação.",
      "D) Converter todas as regras textuais existentes em fluxogramas genéricos, descartando os artefatos textuais tradicionais para evitar ambiguidades linguísticas no projeto.",
      "E) Empregar Histórias de Usuário para a visão de negócios, Casos de Uso para mapear interações e manter a Especificação para detalhar restrições técnicas e regras complexas."
    ],
    answer: "E",
    feedback: "Empregar múltiplos níveis de especificação (Histórias de Usuário, Casos de Uso e ERS) garante que cada stakeholder acesse a informação no nível de detalhe e abstração adequado para suas atividades."
  },
  {
    id: 4,
    theme: "Qualidade de Requisitos",
    text: "**Contexto Profissional:** Uma equipe ágil está projetando o software de controle para um novo modelo de drone autônomo destinado a entregas em áreas urbanas.\n\n**O Problema:** Durante o refinamento do backlog, o analista de requisitos apresenta o seguinte critério registrado: 'O sistema de navegação do drone deve permitir que ele voe rápido o suficiente para garantir a entrega expressa, mas devagar o suficiente para conseguir desviar de pássaros e fios elétricos'. Imediatamente, os desenvolvedores de sistemas embarcados apontam que é impossível programar ou criar cenários de teste para um requisito escrito dessa maneira. Antes que a sprint de desenvolvimento seja iniciada, o analista precisa aplicar técnicas de qualidade sobre a documentação para tornar o requisito viável.\n\n**Questão:** Qual atributo fundamental da verificação de requisitos está sendo diretamente violado na redação atual do cenário do drone, e qual ação corretiva deve ser aplicada pelo analista?",
    options: [
      "A) Rastreabilidade; o analista precisa vincular o requisito aos objetivos de negócio da empresa que justificam o investimento financeiro nos sensores de desvio.",
      "B) Ausência de ambiguidade; o analista necessita definir parâmetros mensuráveis, como a velocidade em km/h e o tempo de resposta em milissegundos para o desvio.",
      "C) Consistência; o analista deve garantir que o texto não entre em contradição com o manual do usuário que será publicado pelas equipes de marketing do produto.",
      "D) Completude; o analista precisa adicionar uma quantidade maior de adjetivos qualitativos para descrever as diversas condições meteorológicas que o drone enfrentará.",
      "E) Validação; o analista deve agendar entrevistas qualitativas com os consumidores finais para compreender subjetivamente o que eles consideram uma entrega rápida."
    ],
    answer: "B",
    feedback: "Termos vagos como 'rápido o suficiente' e 'devagar o suficiente' geram ambiguidade e impedem a testabilidade. O requisito deve ser traduzido em métricas exatas (ex: km/h e milissegundos)."
  },
  {
    id: 5,
    theme: "Gerência de Requisitos",
    text: "**Contexto Profissional:** Um consórcio de tecnologia assumiu um contrato governamental de dois anos para desenvolver o novo portal unificado de arrecadação tributária.\n\n**O Problema:** No sexto mês de execução, mudanças na legislação nacional alteraram as fórmulas de cálculo de vários impostos. Paralelamente, diferentes ministérios começaram a enviar solicitações de novas funcionalidades que conflitam entre si. A equipe de projeto está perdendo o controle: desenvolvedores estão construindo módulos baseados em regras antigas, enquanto a equipe de qualidade testa com base em e-mails recentes enviados pelos fiscais. Atualmente, os requisitos do projeto são mantidos em planilhas soltas e documentos de texto não versionados. O risco de retrabalho e de o sistema ser entregue em desconformidade legal é altíssimo.\n\n**Questão:** Diante da complexidade do projeto governamental e dos riscos iminentes de falha, qual prática de engenharia deve ser imediatamente implementada pela liderança do projeto?",
    options: [
      "A) Congelar a base de requisitos aprovada inicialmente, recusando qualquer alteração derivada da legislação até que a primeira versão do sistema seja concluída em dois anos.",
      "B) Transferir a responsabilidade de análise de negócio para os programadores, permitindo que ajustem o código dinamicamente com base nas interações diretas com os fiscais.",
      "C) Substituir a documentação existente por cerimônias diárias de repasse verbal, visando manter a equipe de engenharia ciente das modificações legislativas mais recentes.",
      "D) Adotar um processo formalizado de gerência de requisitos para identificar, rastrear e controlar as versões das necessidades, promovendo a comunicação estruturada na equipe.",
      "E) Reduzir o escopo do projeto, implementando apenas as funcionalidades periféricas que não sofrem impacto direto das mudanças de regras solicitadas pelos ministérios."
    ],
    answer: "D",
    feedback: "A gerência de requisitos formaliza o fluxo de captação de mudanças, versionamento e comunicação, garantindo que o time trabalhe de forma síncrona sobre a última linha de base aprovada."
  },
  {
    id: 6,
    theme: "Reutilização de Requisitos",
    text: "**Contexto Profissional:** Uma fábrica de software é especializada em desenvolver sistemas de Gestão de Recursos Humanos (HRMS) customizados para empresas do setor varejista.\n\n**O Problema:** Apesar de cada rede varejista possuir sua própria identidade visual e regras de comissionamento exclusivas, módulos inteiros como o cadastro nacional de funcionários, gestão de férias e autenticação de usuários operam de forma praticamente idêntica em todos os contratos. Atualmente, a equipe de engenharia de requisitos inicia o levantamento e a documentação desses módulos do zero a cada novo cliente, gerando um longo tempo de especificação e inflando significativamente o orçamento e o prazo inicial dos projetos. A diretoria exige uma otimização no processo de especificação.\n\n**Questão:** Considerando as estratégias aplicáveis à engenharia de requisitos, qual abordagem deve ser implementada para resolver a ineficiência no processo de especificação da fábrica de software?",
    options: [
      "A) Estruturar uma biblioteca de requisitos reutilizáveis e parametrizáveis para os módulos em comum, instanciando-os e adaptando-os para acelerar os novos projetos de varejo.",
      "B) Realizar a cópia integral do documento de especificação do último cliente atendido, desconsiderando as particularidades de regras de comissionamento dos novos contratos.",
      "C) Construir um produto de software monolítico inflexível, exigindo que as futuras empresas varejistas adaptem integralmente seus processos internos às funções do sistema.",
      "D) Terceirizar a fase de levantamento de requisitos para consultorias externas, aumentando o prazo de entrega mas reduzindo a carga de trabalho interna.",
      "E) Suprimir a documentação formal dos módulos de cadastro e férias, concentrando o esforço de elicitação e modelagem exclusivamente nas funcionalidades de comissionamento."
    ],
    answer: "A",
    feedback: "Estruturar uma biblioteca ou catálogo de requisitos comuns reutilizáveis permite instanciar e customizar as regras comuns, acelerando a fase de elicitação e reduzindo custos."
  },
  {
    id: 7,
    theme: "Reutilização de Requisitos",
    text: "**Contexto Profissional:** Uma multinacional de tecnologia automotiva desenvolve o software embarcado para os painéis de instrumentos dos veículos de uma montadora. Eles estão iniciando o projeto de um novo carro 100% elétrico (EV).\n\n**O Problema:** O gerente de portfólio instrui a equipe a não começar os requisitos do zero, mas a realizar a reutilização de artefatos de requisitos pertencentes aos projetos anteriores de carros a combustão, focando em funcionalidades como o funcionamento do velocímetro, odômetro, conectividade bluetooth e usabilidade da interface multimídia. Parte dos engenheiros demonstra resistência, argumentando que um carro elétrico possui uma engenharia de propulsão completamente distinta e que a reutilização pode engessar o processo criativo.\n\n**Questão:** Como o gerente deve fundamentar tecnicamente sua decisão de aplicar a reutilização de requisitos, demonstrando os benefícios dessa prática para a equipe técnica?",
    options: [
      "A) Argumentando que a reutilização de especificações antigas erradicará a necessidade de qualquer etapa futura de testes de software no painel do veículo elétrico.",
      "B) Explicando que o reuso de requisitos garante a transcrição automática para código-fonte, liberando os desenvolvedores para atuarem no marketing do veículo.",
      "C) Comprovando que reaproveitar requisitos já consolidados confere agilidade e confiabilidade aos módulos comuns, poupando esforço para focar na inovação da propulsão elétrica.",
      "D) Evidenciando que a principal vantagem técnica da abordagem é a possibilidade de reduzir drasticamente o tamanho da equipe de análise no departamento automotivo.",
      "E) Afirmando que o objetivo da reutilização é forçar o painel do veículo elétrico a operar com a mesma lógica mecânica de um veículo movido a combustíveis fósseis."
    ],
    answer: "C",
    feedback: "A reutilização de requisitos consolidados reduz esforço nos componentes padrão do sistema, permitindo que a equipe dedique foco intelectual à inovação das novas particularidades do projeto (como motor elétrico)."
  },
  {
    id: 8,
    theme: "Rastreabilidade de Requisitos",
    text: "**Contexto Profissional:** Uma empresa de logística internacional está aprimorando seu sistema global de rastreamento de cargas. O ecossistema do software possui múltiplos stakeholders: autoridades portuárias alfandegárias, caminhoneiros autônomos e gestores corporativos.\n\n**O Problema:** Na metade do ciclo de desenvolvimento, uma nova lei de privacidade de dados europeia obriga a alteração imediata de um requisito referente à visibilidade dos dados do condutor. A equipe altera o requisito e o implementa rapidamente. Contudo, ao disponibilizar a versão em produção, descobre-se que a mudança desativou acidentalmente a funcionalidade de pareamento GPS utilizada pelos caminhoneiros na América do Sul, interrompendo as operações locais. A investigação revelou que a equipe não possuía visibilidade estruturada de como uma funcionalidade se conectava a outra.\n\n**Questão:** Com base nos conceitos e atividades inerentes à gerência de requisitos, qual deficiência no processo de engenharia ocasionou a falha sistêmica descrita na plataforma de logística?",
    options: [
      "A) A incapacidade da equipe de realizar refatorações contínuas de código-fonte para adaptar infraestruturas legadas a leis de privacidade estrangeiras.",
      "B) A inexistência de um mecanismo de rastreabilidade de requisitos para analisar as dependências cruzadas e avaliar o impacto das mudanças antes de sua execução.",
      "C) A ausência de esteiras automatizadas de integração contínua, que seriam capazes de corrigir magicamente regras de negócio conflitantes no momento do deploy.",
      "D) A dependência de técnicas presenciais de elicitação, que deveriam ser substituídas por questionários fechados para evitar o conflito entre stakeholders regionais.",
      "E) A falta de aplicação de multas contratuais rigorosas contra a autoridade portuária que exigiu a alteração regulatória após a aprovação do escopo inicial."
    ],
    answer: "B",
    feedback: "A falta de rastreabilidade impede a análise de impacto (impact analysis). Sem saber como as regras de dados do condutor e o pareamento GPS se correlacionavam funcionalmente, a equipe inseriu um erro em cascata."
  }
];

// ─── QUESTIONS DATA - MODELO B (SIMULADO NOVO) ───────────────────────────────────────────────
export const QUESTIONS_B = [
  {
    id: 1,
    theme: "Processo de Engenharia de Requisitos",
    text: "**Contexto Profissional:** Uma empresa desenvolvedora de software governamental ('GovTech') lida com frequente rotatividade técnica de seu pessoal e consequente perda de conhecimento sobre o histórico de seus sistemas. Atualmente, constrói um portal de transparência para uma associação de municípios.\n\n**O Problema:** Durante homologações de entrega, os recursos de consulta ao orçamento público demonstraram-se severamente incompatíveis com o que os tribunais de contas haviam solicitado originalmente. A investigação apontou que a equipe se guiava por anotações pessoais dispersas, comunicações verbais informais em reuniões e instruções de chats internos. O analista de sistemas recém-contratado precisa instituir uma prática documental que sirva de guia oficial para unificar o entendimento entre analistas, programadores e auditores externos.\n\n**Questão:** Qual diretriz de ação inicial o analista de sistemas deve adotar para mitigar a perda de conhecimento e unificar o entendimento de escopo?",
    options: [
      "A) Instituir um documento de especificação formalizado como referência única do projeto, servindo de base de conhecimento compartilhada para orientar o desenvolvimento e o controle de alterações.",
      "B) Adotar ferramentas de desenvolvimento guiado por testes de aceitação automatizados, reduzindo a necessidade de documentação escrita de especificações técnicas do sistema.",
      "C) Reduzir o envolvimento dos stakeholders governamentais no processo técnico, conferindo total autonomia aos analistas de negócios para definirem as regras de transparência.",
      "D) Realizar reuniões diárias e informais de alinhamento com a equipe técnica, visando eliminar a burocracia de registros escritos e otimizar o tempo de codificação.",
      "E) Suspender o desenvolvimento até que os órgãos reguladores assinem um termo de congelamento de escopo que impeça quaisquer modificações nas exigências legais."
    ],
    answer: "A",
    feedback: "Uma documentação centralizada e estruturada (como o Documento de Especificação) é a forma correta de reter o conhecimento, unificar a comunicação das equipes e servir de base estável para auditorias."
  },
  {
    id: 2,
    theme: "Verificação vs Validação",
    text: "**Contexto Profissional:** Uma empresa de software para bem-estar e qualidade de vida desenvolveu um aplicativo móvel voltado para nutrição personalizada. A especificação continha o escopo de cálculo exato de calorias diárias e ingestão de água.\n\n**O Problema:** A engenharia de testes executou todos os cenários, atestando 100% de conformidade com os cálculos e regras do documento. No entanto, ao distribuir o piloto em clínicas médicas e com usuários reais, o aplicativo foi rejeitado. Pacientes e nutricionistas apontaram que a solução é ineficaz para o uso clínico prático pois não se conecta de forma ativa com relógios inteligentes e sensores de pulso do mercado (uma premissa elementar não explicitada na especificação do projeto, mas esperada pelo público).\n\n**Questão:** Analisando o caso sob a perspectiva da engenharia de requisitos, como se diferenciam os resultados de verificação e validação nesse projeto?",
    options: [
      "A) A atividade de validação atestou que a codificação do cálculo de calorias atendeu às fórmulas de engenharia, ao passo que a verificação evidenciou a inconsistência na integração dos dispositivos inteligentes.",
      "B) Os processos de verificação e validação falharam simultaneamente pelo fato de o algoritmo de monitoramento de macros não corresponder aos padrões previstos na especificação inicial do sistema.",
      "C) A verificação comprovou a conformidade do software com o documento de requisitos estabelecido, enquanto a validação revelou que o produto final deixou de atender às necessidades reais dos usuários.",
      "D) A validação alcançou o objetivo de alinhar o software às expectativas de usabilidade dos médicos, mas a verificação falhou em virtude de falhas lógicas no cálculo de calorias diárias.",
      "E) A falha concentrou-se exclusivamente no processo de testes de regressão do código, visto que as etapas de engenharia de requisitos não abrangem a integração de periféricos externos."
    ],
    answer: "C",
    feedback: "Verificação avaliou se o software foi desenvolvido em conformidade com o documento escrito (o que foi feito). Validação determinou se o software atendeu ao uso e às necessidades reais das clínicas no dia a dia (o que falhou)."
  },
  {
    id: 3,
    theme: "Abordagens Documentais",
    text: "**Contexto Profissional:** Uma empresa internacional de transportes está reestruturando as regras de negócio de seu sistema de cálculo aduaneiro. A equipe multidisciplinar precisa de comunicação clara: os contadores auditam fórmulas rígidas de tributação, designers planejam telas dinâmicas e programadores criam rotinas em segundo plano.\n\n**O Problema:** A adoção exclusiva de Histórias de Usuário informais gerou imprecisão nas fórmulas e regras fiscais internacionais complexas, provocando erros de cálculo. Por outro lado, um documento de ERS denso impedia os designers de entender a jornada. O arquiteto propõe adotar uma estrutura documental diversificada.\n\n**Questão:** Diante do desafio de comunicação técnica e de negócios para públicos distintos, qual abordagem de documentação de requisitos é mais adequada?",
    options: [
      "A) Padronizar a comunicação do projeto por meio de Casos de Uso detalhados, eliminando as Histórias de Usuário e os diagramas para forçar o alinhamento de negócios às questões tributárias.",
      "B) Substituir todos os documentos e especificações escritos por reuniões de pareamento entre desenvolvedores e contadores, visando eliminar o overhead documental do ciclo de desenvolvimento.",
      "C) Adotar Histórias de Usuário para alinhar o valor com stakeholders de negócios, Casos de Uso para ilustrar os fluxos de interação e especificações técnicas adicionais para as regras de cálculo aduaneiro.",
      "D) Converter as regras de cálculo tributário em modelos conceituais abstratos de classes, descartando a escrita de textos descritivos para evitar múltiplas interpretações pelas equipes.",
      "E) Direcionar os documentos técnicos complexos de regras de tributação aos stakeholders de negócios e repassar histórias curtas informais para nortear a equipe de backend nas transações."
    ],
    answer: "C",
    feedback: "Modelos híbridos que combinam Histórias de Usuário (visão geral/negócio), Casos de Uso (interações do sistema) e tabelas de decisão/regras de negócio adicionais (técnico/fórmulas) fornecem a comunicação correta a cada papel."
  },
  {
    id: 4,
    theme: "Qualidade de Requisitos",
    text: "**Contexto Profissional:** Uma empresa médica está programando o software embarcado de um novo modelo de marcapasso cardíaco controlado por software.\n\n**O Problema:** O analista escreveu no backlog: 'O marcapasso deve monitorar os batimentos de maneira muito rápida e aplicar um choque elétrico de forma confortável para que o paciente não tome um susto, porém forte o suficiente para normalizar o ritmo do coração'. A equipe de firmware diz que é impossível codificar e criar casos de teste precisos com essa redação.\n\n**Questão:** Qual critério de qualidade de especificação de requisitos foi violado e qual ação deve ser tomada pelo analista de sistemas para corrigir o problema?",
    options: [
      "A) Rastreabilidade vertical; o analista de sistemas deve associar o requisito de detecção aos objetivos financeiros da empresa fabricante para viabilizar a compra dos sensores.",
      "B) Ausência de ambiguidade; o analista precisa definir parâmetros quantitativos e mensuráveis, como o tempo máximo de resposta em milissegundos e a intensidade da corrente elétrica em miliamperes.",
      "C) Completude do escopo; o analista deve inserir descrições adicionais sobre os hábitos de exercícios físicos dos pacientes para complementar as faixas de batimentos cardíacos.",
      "D) Consistência interna; o analista precisa harmonizar o texto do requisito com os materiais de publicidade corporativa e manuais de primeiros socorros distribuídos em hospitais.",
      "E) Validação regulatória; o analista deve providenciar enquetes com médicos de diversas especialidades para avaliar a percepção subjetiva de um estímulo elétrico considerado confortável."
    ],
    answer: "B",
    feedback: "Termos subjetivos como 'muito rápida', 'confortável' e 'forte o suficiente' são ambíguos. O requisito deve conter parâmetros quantitativos precisos para permitir codificação e testes de aceitação."
  },
  {
    id: 5,
    theme: "Gerência de Requisitos",
    text: "**Contexto Profissional:** Uma empresa desenvolve um grande sistema de ERP de gestão escolar integrada.\n\n**O Problema:** Durante a execução do projeto, o Ministério da Educação (MEC) publicou uma portaria que altera as regras de registro do censo escolar nacional. Paralelamente, diretores de escolas enviam solicitações com requisitos conflitantes. Sem governança, o time de desenvolvimento programa usando regras antigas do contrato inicial, enquanto o time de QA testa com base em e-mails e mensagens de WhatsApp enviadas pelo gerente. O resultado é retrabalho e instabilidade.\n\n**Questão:** Diante do cenário apresentado, qual prática de engenharia de requisitos deve ser implementada de forma imediata para lidar com as mudanças legislativas e conflitos de interesse?",
    options: [
      "A) Estabelecer um processo estruturado de controle de mudanças integrado a uma linha de base (baseline) de requisitos, organizando o ciclo de modificações na documentação.",
      "B) Suspender os testes de software e repassar a responsabilidade de interpretar as alterações legais do MEC diretamente aos desenvolvedores durante a codificação.",
      "C) Reduzir a abrangência do sistema, removendo as funcionalidades de censo escolar e emissão de diplomas para focar apenas nas telas de cadastro de alunos.",
      "D) Congelar as regras de negócio iniciais de forma inflexível, recusando qualquer alteração oriunda da legislação de ensino até o encerramento do contrato de suporte técnico.",
      "E) Adotar discussões verbais diárias entre os gerentes e os desenvolvedores como o único canal oficial de atualização técnica, dispensando revisões na documentação escrita."
    ],
    answer: "A",
    feedback: "Controlar mudanças em uma linha de base (baseline) garante rastreabilidade do impacto das novas regras do MEC e unifica o entendimento técnico dos desenvolvedores e QAs."
  },
  {
    id: 6,
    theme: "Reutilização de Requisitos",
    text: "**Contexto Profissional:** Uma fábrica de software desenvolve um sistema modular de Gestão para Clínicas Médicas (EHR).\n\n**O Problema:** Embora o faturamento e as regras comerciais com convênios variem, os módulos centrais (cadastro básico, histórico médico, marcação de consultas e login) são idênticos em todas as clínicas. Atualmente, os analistas realizam a elicitação de todos os requisitos do zero para cada novo contrato assinado, encarecendo os projetos e atrasando o início do desenvolvimento. O diretor de tecnologia exige melhoria de processos.\n\n**Questão:** Qual estratégia de engenharia de requisitos resolve essa ineficiência operacional de forma sustentável?",
    options: [
      "A) Copiar a totalidade do documento de requisitos do último projeto de clínica executado, ignorando as particularidades de faturamento e regras de convênios dos novos clientes.",
      "B) Estabelecer um catálogo de requisitos comuns reutilizáveis e parametrizáveis, adaptando apenas os dados variáveis de regras de convênio de acordo com o contexto de cada clínica.",
      "C) Limitar a especificação formal às telas de convênios especiais, omitindo o detalhamento das funcionalidades centrais de cadastro e agenda no ciclo de desenvolvimento.",
      "D) Submeter as clínicas parceiras a um modelo padrão inflexível de processo de agendamento, inviabilizando qualquer customização ou adaptação operacional do sistema.",
      "E) Delegar a fase de levantamento de dados a profissionais de atendimento ao cliente externos, de modo a diminuir a carga de trabalho de especificação das equipes de TI."
    ],
    answer: "B",
    feedback: "Adotar requisitos estruturados reutilizáveis parametrizáveis permite que o time configure campos dinâmicos sem reescrever o escopo central das funcionalidades comuns."
  },
  {
    id: 7,
    theme: "Reutilização de Requisitos",
    text: "**Contexto Profissional:** Uma startup de veículos guiados industriais autônomos (AGVs) desenvolve soluções de armazéns inteligentes. Eles iniciam um projeto de empilhadeira autônoma para trabalhar especificamente dentro de câmaras frias.\n\n**O Problema:** O CTO indica reaproveitar os requisitos de desvio de obstáculos (Lidar), comunicação corporativa e envio de pacotes ao sistema de controle (WMS). Parte dos desenvolvedores resiste, afirmando que o ambiente congelante exige uma especificação totalmente nova desde o início, e que o reuso engessará a criatividade técnica.\n\n**Questão:** Como o gerente de engenharia de software deve fundamentar tecnicamente a recomendação de reaproveitamento de requisitos perante a equipe?",
    options: [
      "A) Demonstrando que a cópia de requisitos de projetos anteriores elimina a necessidade de projetar planos de testes de software para o novo ambiente operacional da câmara fria.",
      "B) Argumentando que o reuso de especificações gera códigos de programação de forma automática, permitindo que a equipe de engenharia atue em funções financeiras do negócio.",
      "C) Evidenciando que reutilizar requisitos maduros economiza esforço em módulos comuns de navegação e conectividade, permitindo concentrar a capacidade técnica nas especificações térmicas e energéticas.",
      "D) Explicando que a principal finalidade da reutilização é reduzir o quadro de analistas de sistemas, otimizando os custos operacionais com pessoal de TI na startup.",
      "E) Assegurando que a reutilização de requisitos fará com que o veículo da câmara fria opere com as mesmas limitações de temperatura e bateria das empilhadeiras padrão."
    ],
    answer: "C",
    feedback: "A reutilização de requisitos estáveis evita retrabalho técnico em rotinas maduras (como detecção Lidar e conectividade) e permite que a equipe invista sua energia em resolver os problemas de bateria e temperatura extrema do hardware."
  },
  {
    id: 8,
    theme: "Rastreabilidade de Requisitos",
    text: "**Contexto Profissional:** Uma fintech financeira gerencia uma carteira digital corporativa de cartões corporativos. O sistema possui regras rígidas de segurança.\n\n**O Problema:** Para cumprir a regulação da LGPD, o time de segurança alterou um requisito de mascaramento de dados de cartão de crédito. A mudança foi implementada rapidamente no banco de dados e implantada. Em produção, a mudança causou a quebra e parada imediata do fluxo de conciliação bancária noturna usado por grandes empresas clientes. A investigação apontou que a equipe não tinha visão de que a mudança de formato dos dados afetaria as rotinas de importação de arquivos bancários.\n\n**Questão:** Qual deficiência no processo de engenharia e gerência de requisitos provocou essa falha de impacto sistêmico?",
    options: [
      "A) A insuficiência das ferramentas de build automatizado do código de produção para resolver dinamicamente falhas de lógica de criptografia em lote.",
      "B) A ausência de uma matriz de rastreabilidade de requisitos que associasse os elementos de criptografia às dependências funcionais de relatórios e conciliação.",
      "C) A dependência de técnicas assíncronas de elicitação que causaram a discordância entre os desenvolvedores de segurança e os analistas de negócios.",
      "D) A falta de sanções administrativas severas no contrato com o órgão regulador do setor financeiro que exigiu a adequação de segurança fora do prazo.",
      "E) A incapacidade da equipe de testes em refatorar o código-fonte legado a fim de suportar novas diretivas de conformidade regulatória sem intervenção externa."
    ],
    answer: "B",
    feedback: "Uma matriz de rastreabilidade bidirecional conectando os requisitos de segurança aos relatórios e módulos de integração teria evidenciado de imediato a dependência funcional, prevenindo o erro."
  }
];

// ─── DISCURSIVE DATA ─────────────────────────────────────────────────────────
export const STUDY_CASE_A = {
  title: "Modernização da Engenharia de Software da EcoCity",
  context: "A empresa de tecnologia 'EcoCity', especializada no desenvolvimento de sistemas de monitoramento ambiental e gestão de recursos hídricos para órgãos públicos, encontra-se em uma grave crise operacional. Com a rápida expansão de sua carteira de clientes, o setor de desenvolvimento não conseguiu escalar seus processos. Atualmente, para cada novo município contratante, a equipe de engenharia de requisitos inicia o levantamento, a especificação e a modelagem estritamente do zero. Embora as regras de cobrança de taxas e a identidade visual variem, os módulos centrais das prefeituras - como a integração com sensores IoT para detecção de vazamentos, os algoritmos do painel de alerta de qualidade da água e os níveis de controle de acesso - possuem regras de negócio fundamentais idênticas. Devido à ausência de uma base de conhecimento reaproveitável, a equipe técnica está sobrecarregada, os orçamentos dos projetos estouraram e os prazos de entrega estão atrasados. Para agravar o cenário, uma nova e urgente diretriz do Ministério do Meio Ambiente exigiu que todos os sistemas municipais em operação alterassem as regras lógicas de emissão dos laudos de conformidade. Como os requisitos foram documentados em arquivos de texto soltos e não versionados no passado, os analistas não possuem mecanismos para identificar rapidamente quais componentes, bancos de dados ou interfaces de cada cidade serão afetados pela mudança legal. O resultado tem sido um ciclo de atualizações caóticas, retrabalho massivo nas equipes de teste e risco de multas contratuais.",
  statement: "Considerando as competências de um profissional de Análise e Desenvolvimento de Sistemas - que deve atuar de forma inovadora, flexível e com visão sistêmica -, redija um texto dissertativo-argumentativo (mínimo de 30 linhas) apresentando um plano de reestruturação para a engenharia de software da empresa. Seu texto deve, obrigatoriamente, contemplar de forma coesa e interligada os seguintes aspectos:\n\nA) Diagnóstico de Gerência: Uma análise crítica das falhas no processo de Gerência de Requisitos que culminaram no caos durante a atualização exigida pela diretriz federal, explicando os riscos do retrabalho no ciclo de vida do software.\nB) Estratégia de Reutilização: A proposição e argumentação técnica de como a empresa deve aplicar a Reutilização de Requisitos (citando abordagens como Bibliotecas, Requisitos Parametrizáveis ou Famílias de Produtos) para resolver o problema de esgotamento da equipe e alto custo na entrada de novos municípios.\nC) Controle e Rastreabilidade: A definição de uma solução baseada em rastreabilidade de requisitos para garantir que futuras mudanças legislativas sejam avaliadas e integradas de forma controlada, minimizando falhas no sistema final.\nD) Visão Sistêmica e Inovação: Uma justificativa de como a transição de um modelo de especificação manual (do zero) para um modelo gerido e reutilizável prepara a infraestrutura da empresa para absorver inovações tecnológicas de forma ágil e resiliente.",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Falhas de Gerência identificadas:\n• Ausência de uma linha de base (baseline) e versionamento de requisitos: documentação mantida em arquivos dispersos dificulta saber a versão em execução em cada município.\n• Falta de controle formal de mudanças: atualizações realizadas de forma ad-hoc acarretam retrabalho nos testes, prazos estourados e multas.\n\nB) Reutilização de Requisitos:\n• Estruturação de uma Biblioteca/Catálogo de Requisitos comuns (sensores IoT, qualidade da água, controle de acesso).\n• Utilização de Requisitos Parametrizáveis para regras que mudam ligeiramente (como taxas de cobrança municipais).\n• Adoção da Engenharia de Linha de Produto de Software (LPS) para gerir núcleo comum (core assets) e as particularidades de cada cidade.\n\nC) Controle e Rastreabilidade:\n• Implantação de Matriz de Rastreabilidade Bidirecional (vertical e horizontal).\n• Mapeamento de rastros desde a necessidade de negócio, especificação, código-fonte, banco de dados até os scripts de testes.\n• Análise de impacto sistemática para verificar onde cada alteração da ANS/Ministério atinge as bases instaladas.\n\nD) Visão Sistêmica e Inovação:\n• Adoção de arquiteturas modulares orientadas a serviços (SOA/Microservices) baseadas nos requisitos modulares.\n• Facilidade de incorporar novas tecnologias (ex: análise de dados por IA ou modelos IoT preditivos) sem reescrever o sistema core.\n• Criação de infraestrutura resiliente com custos de manutenção decrescentes (Technical Debt reduzido)."
};

export const STUDY_CASE_B = {
  title: "Plano de Reengenharia de Requisitos da HealthSync",
  context: "A empresa de tecnologia HealthSync, especializada no desenvolvimento de sistemas de telemedicina, prontuário eletrônico de pacientes (PEP) e agendamento para clínicas populares e laboratórios médicos, passa por um período crítico em suas operações. Em virtude do acelerado crescimento de sua carteira de parceiros de negócios, a área de desenvolvimento e engenharia de requisitos enfrenta sérios problemas de escalabilidade de processos. Atualmente, para cada nova clínica ou laboratório médico contratante, a equipe técnica conduz os processos de elicitação, modelagem e especificação a partir do zero absoluto. Contudo, apesar de variações nas regras de tabelamento financeiro de convênios e identidade visual, os módulos funcionais principais (como agendamento digital, cadastro básico do paciente e emissão eletrônica de receitas e laudos) baseiam-se em regras fundamentais de negócios idênticas. Diante da ausência de uma base de conhecimento reaproveitável, a equipe está sobrecarregada, os orçamentos dos projetos sofrem desvios de custo elevados e os cronogramas de entrega encontram-se sistematicamente atrasados. Adicionalmente, uma nova determinação mandatória da Agência Nacional de Saúde Suplementar (ANS) e da LGPD impôs a alteração imediata nos fluxos de consentimento e visualização de dados médicos compartilhados entre laboratórios e clínicas de exames. Como as especificações funcionais e técnicas passadas de cada clínica contratante foram mantidas em arquivos individuais de processadores de texto, sem versionamento integrado ou controle centralizado, a equipe de analistas de sistemas não consegue determinar com agilidade quais clínicas, interfaces de comunicação, APIs externas ou componentes de banco de dados serão alterados pela regulação. A implantação desta mudança regulatória vem ocorrendo por meio de ajustes fragmentados e emergenciais no código-fonte, gerando elevado retrabalho nas equipes de garantia de qualidade (QA) e risco iminente de perda de credenciamento e multas contratuais.",
  statement: "Considerando as competências profissionais requeridas na Análise e Desenvolvimento de Sistemas — incluindo capacidade crítica, visão sistêmica, flexibilidade e habilidade em propor melhorias estruturadas —, redija um texto dissertativo-argumentativo (com mínimo de 30 linhas) apresentando um plano estruturado de reengenharia de requisitos para mitigar as falhas apontadas no caso da HealthSync. Seu texto deve contemplar de maneira integrada os seguintes aspectos norteadores:\n\nA) Diagnóstico de Gerência: Uma análise das falhas gerenciais no ciclo de vida dos requisitos (sobretudo em relação a baseline de requisitos e controle formal de mudanças), explicando como a falta dessas práticas contribui diretamente para os problemas de retrabalho técnico, inconsistências no ambiente de homologação e riscos regulatórios descritos.\nB) Estratégia de Reutilização: Propor e justificar tecnicamente o emprego da reutilização de requisitos no ecossistema da HealthSync (abordando estratégias como repositórios/bibliotecas de requisitos modulares, parametrização de requisitos de negócio ou Linhas de Produto de Software - LPS), detalhando como essa prática atenua a sobrecarga de trabalho do time de analistas e otimiza a entrada em operação de novas clínicas.\nC) Rastreabilidade e Controle de Mudança: Definir uma estratégia baseada em mecanismos de rastreabilidade (rastreabilidade vertical e horizontal, bidirecional) que conecte as especificações funcionais com componentes técnicos de software, bancos de dados e cenários de testes, visando garantir que futuras atualizações regulatórias ou do cliente sejam avaliadas sistematicamente via análise de impacto (impact analysis).\nD) Visão Sistêmica e Inovação: Argumentar como a transição estratégica de um processo ad-hoc e manual para um processo de engenharia de requisitos gerido, controlado e baseado em reuso prepara a infraestrutura organizacional da HealthSync para incorporar inovações do setor de saúde (tais como integração de inteligência artificial preditiva ou sensores médicos IoT) com maior agilidade e estabilidade tecnológica.",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Diagnóstico de Gerência:\n• Apontar que a falta de versionamento e repositório de requisitos inviabiliza o estabelecimento de uma Linha de Base (baseline) de requisitos aprovada.\n• A ausência de um processo formalizado de controle de mudanças faz com que e-mails e mensagens de WhatsApp guiem a codificação, elevando o retrabalho em QA e os custos operacionais.\n\nB) Reutilização de Requisitos:\n• Propôr a criação de uma Biblioteca de Requisitos de Negócio com as regras comuns de agendamento e cadastro.\n• Sugerir Requisitos Parametrizáveis para lidar com taxas e convênios variáveis de cada clínica.\n• Modelar o portfólio da HealthSync como uma Linha de Produto de Software (LPS), dividindo o desenvolvimento em engenharia de domínio (core assets) e engenharia de aplicação (customizações).\n\nC) Rastreabilidade e Controle:\n• Definir a Matriz de Rastreabilidade Bidirecional (vertical e horizontal).\n• Explicar como conectar Requisitos -> Classes de Código -> Tabelas de Banco de Dados -> Casos de Testes.\n• Mapear as dependências para que as portarias da ANS de consentimento tenham impacto rastreado automaticamente em todos os municípios em minutos.\n\nD) Visão Sistêmica e Inovação:\n• Demonstração de que organizar requisitos habilita a arquitetura de software a evoluir para microserviços reutilizáveis.\n• A HealthSync se torna resiliente e ágil, podendo plugar IA de diagnóstico ou sensores vestíveis (IoT) sobre as regras de prontuário consolidadas sem riscos de regressão técnica."
};
