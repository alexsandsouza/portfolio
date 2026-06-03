import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── DATA MODELO A ────────────────────────────────────────────────────────────
const QUESTIONS_A = [
  {
    category: "DOCUMENTAÇÃO",
    context: "O Ministério da Saúde está liderando um consórcio internacional para o desenvolvimento de um sistema global de monitoramento e predição de pandemias (GlobalPan), envolvendo centros de pesquisa de vinte países, laboratórios privados e agências reguladoras. Durante o primeiro ano do projeto, a documentação de requisitos foi estruturada de maneira altamente descentralizada, com cada consórcio regional utilizando seus próprios templates, linguagens e padrões de granularidade. A equipe de arquitetura central na Suíça identificou que essa heterogeneidade está gerando inconsistências críticas nas interfaces de integração de dados genômicos. Os pesquisadores defendem a adoção de uma Especificação de Requisitos de Software (SRS) única e rigorosa, padronizada pela norma IEEE. Por outro lado, as startups de biotecnologia envolvidas argumentam que um modelo tradicional de SRS inviabilizará os testes rápidos e as adaptações iterativas necessárias para calibrar os modelos de machine learning preditivos. O comitê gestor precisa intervir e definir um padrão documental estrutural.",
    text: "Considerando o cenário de alta heterogeneidade, a exigência de integração técnica precisa de dados genômicos e a necessidade simultânea de evolução iterativa de modelos de IA, qual abordagem documental a arquitetura central do GlobalPan deve adotar para resolver o impasse sem comprometer o rigor regulatório nem a flexibilidade iterativa?",
    answers: [
      "Substituir completamente a SRS por quadros Kanban e histórias de usuário épicas, garantindo agilidade e deixando a integração de interfaces a cargo da comunicação verbal das equipes.",
      "Adotar exclusivamente especificações matemáticas e notações formais (como Z ou B) para toda a extensão do projeto, assegurando a interoperabilidade total de dados e forçando as startups a adaptarem seus ciclos de IA.",
      "Estabelecer uma documentação híbrida, onde o núcleo de integração e as interfaces genômicas sejam detalhados in uma SRS formal, enquanto os módulos preditivos de IA sejam documentados via histórias de usuário com critérios de aceitação acoplados a protótipos iterativos.",
      "Descentralizar definitivamente a documentação, permitindo que cada núcleo regional padronize seus requisitos na linguagem local, e delegar a harmonização de interfaces para scripts conversores pós-desenvolvimento.",
      "Congelar os requisitos preditivos das startups no primeiro mês do projeto em um documento monolítico inflexível, garantindo que as interfaces de dados não sofram mutações durante a implementação."
    ],
    correct: 2,
    feedback: "Alternativa C. A abordagem híbrida concilia o rigor exigido pela integração genômica (documentado formalmente via SRS) com a flexibilidade demandada pelas equipes de inteligência artificial (tratadas com técnicas ágeis/iterativas). As alternativas A e B adotam extremismos (tudo ágil ou tudo formal), a alternativa D promove o caos arquitetural ao descentralizar a documentação, e a alternativa E engessa indevidamente o projeto ao impedir adaptações em modelos de aprendizado de máquina.",
    points: 12.5
  },
  {
    category: "VERIFICAÇÃO",
    context: "Uma montadora de veículos elétricos de alto luxo está na fase de engenharia do software de controle autônomo de nível 4, no qual a intervenção humana não é necessária na maioria das situações de direção. O documento de requisitos do módulo de frenagem de emergência apresenta cerca de 300 afirmações técnicas. No entanto, uma análise inicial indicou que vários requisitos contêm termos como \"frenagem suave\", \"resposta ultrarrápida\" e \"distância segura\", que não possuem quantificação exata. Além disso, identificou-se preliminarmente que o comportamento do sistema sob condições de falha múltipla e concorrente (ex: perda simultânea de sinal de radar dianteiro e câmera lateral) não está devidamente descrito no artefato. O diretor de engenharia determinou que a equipe de garantia da qualidade deve atuar imediatamente sobre este artefato para eliminar qualquer risco antes do início da modelagem da arquitetura.",
    text: "Tendo em vista a criticidade do controle autônomo de nível 4 e a presença de requisitos subjetivos e omissos na especificação do módulo de frenagem, qual técnica de verificação deve ser sistematicamente conduzida pela equipe de garantia de qualidade para identificar falhas no documento sem a necessidade de execução de código?",
    answers: [
      "Modelagem e execução de protótipos em simuladores virtuais de trânsito, avaliando o tempo de reação dos veículos para atestar indiretamente a completude dos requisitos.",
      "Inspeção formal de requisitos guiada por checklists de qualidade ortogonal, visando detectar ambiguidades lexicais, quantificar métricas subjetivas e mapear sistematicamente a matriz de exceções de falhas múltiplas.",
      "Realização de testes de aceitação do usuário (UAT) com motoristas profissionais em pistas de testes controladas, garantindo que a frenagem atenda à expectativa de suavidade exigida pela montadora.",
      "Aplicação da técnica de Análise de Pontos de Função (APF) para medir o tamanho funcional do módulo de frenagem e, assim, derivar matematicamente as condições de exceção ausentes.",
      "Terceirização da revisão documental para um comitê de ética independente, focando a verificação na avaliação do impacto social da tecnologia autônoma em caso de colisões severas."
    ],
    correct: 1,
    feedback: "Alternativa B. A inspeção formal por checklists é a principal técnica de verificação estática, capaz de detectar subjetividades lexicais (como 'suave') sem a necessidade de simular ou executar código. A alternativa A foca em testes de execução (validação simulada); a C foca na percepção do cliente final (validação UAT); a D refere-se a estimativas de esforço de software, não verificação de qualidade; e a E terceiriza a responsabilidade técnica de forma indevida.",
    points: 12.5
  },
  {
    category: "VALIDAÇÃO",
    context: "O Tribunal Superior Eleitoral (TSE) está conduzindo um projeto para modernizar a interface do eleitor nas urnas eletrônicas visando as próximas eleições. O escopo abrange a inclusão de funcionalidades avançadas de acessibilidade para eleitores com deficiências cognitivas e motoras severas. A equipe de engenharia de requisitos documentou rigorosamente as especificações de contraste de cores, tempo de resposta tátil em milissegundos e ângulos de visão da tela, garantindo total conformidade com as normas internacionais de acessibilidade W3C e ISO. Contudo, o presidente da comissão de inclusão teme que o alto nível de conformidade técnica teórica não se traduza no entendimento intuitivo e na real facilidade de uso pela população-alvo, especialmente no contexto de estresse característico de uma cabine de votação rápida. Ele insiste que é imperativo demonstrar o alinhamento da especificação com a capacidade prática de operação antes da publicação da licitação milionária do novo hardware.",
    text: "Considerando a preocupação legítima de que o estrito cumprimento de normas técnicas de acessibilidade (verificação) não garante o sucesso operacional do eleitor com deficiências severas durante a votação (validação), qual técnica de engenharia de requisitos deve ser aplicada prioritariamente para garantir que o sistema especificado satisfará as reais necessidades do eleitor em seu contexto de uso?",
    answers: [
      "Condução de revisões por pares entre os engenheiros de software seniores, focando na reavaliação da sintaxe e da rastreabilidade cruzada entre as diretrizes W3C e os requisitos funcionais.",
      "Implementação de testes de regressão automatizados sobre o código legado das urnas antigas, projetando extrapolações estatísticas do comportamento do usuário no novo hardware.",
      "Prototipação de alta fidelidade das novas interfaces, acompanhada de sessões observacionais de validação empírica envolvendo grupos focais representativos de eleitores com deficiências cognitivas e motoras.",
      "Criação de fluxogramas analíticos complexos documentando todas as permutações teóricas de cliques na urna, apresentando-os em formato impresso para a aprovação do presidente da comissão de inclusão.",
      "Solicitação de auditoria formal das especificações pelo Tribunal de Contas da União, objetivando validar as métricas de tempo de resposta antes da autorização financeira do projeto."
    ],
    correct: 2,
    feedback: "Alternativa C. Validação é garantir que o sistema constrói o produto certo para as necessidades reais do usuário. Sessões observacionais com protótipos aplicados aos usuários-alvo superam a simples conformidade técnica. A alternativa A descreve verificação interna; a B é focada no sistema legado; a D apenas exibe fluxogramas teóricos sem testar o uso; e a E é uma auditoria de requisitos normativos.",
    points: 12.5
  },
  {
    category: "MODELAGEM",
    context: "Uma grande seguradora multinacional está fundindo três de suas subsidiárias regionais e precisa unificar as plataformas de sinistros de automóveis em um único portal corporativo global. A documentação original dos três sistemas legados baseava-se em diagramas de casos de uso acompanhados de fluxos de eventos narrativos. A equipe atual de análise de negócios, adepta incondicional de metodologias ágeis em escala, decidiu reescrever toda a base legada utilizando exclusivamente Histórias de Usuário (User Stories) independentes e focadas na agregação de valor para o cliente final. O Arquiteto-Chefe de Segurança da Informação, contudo, emitiu um parecer de bloqueio ao projeto. Ele alertou que as histórias de usuário, devido à sua natureza independente e focada em valor negocial direto, frequentemente omitem e fragmentam as complexas restrições de segurança sistêmica, os fluxos de exceção de auditoria paralela e as dependências intrincadas de compliance exigidas por órgãos reguladores como a SUSEP.",
    text: "Frente ao embate entre a abordagem puramente ágil focada em Histórias de Usuário e a necessidade estrita de mapear fluxos sistêmicos interconectados de segurança e compliance, qual estruturação documental harmoniza de forma técnica e viável as duas exigências diametralmente opostas no portal corporativo de sinistros?",
    answers: [
      "Manter estritamente o modelo de Casos de Uso narrativos extensos da década anterior, descartando as práticas ágeis por serem estruturalmente incompatíveis com o rigor das normas de seguros da SUSEP.",
      "Empregar Histórias de Usuário restritas exclusivamente às interfaces gráficas, transferindo toda a responsabilidade das lógicas de segurança para comentários integrados diretamente no código-fonte dos desenvolvedores backend.",
      "Eliminar a documentação textual e adotar modelos puramente matemáticos de transição de estados de segurança, obrigando a equipe de negócios a realizar treinamentos exaustivos em lógicas formais de predicados.",
      "Associar as Histórias de Usuário a Critérios de Aceitação baseados em Behavior-Driven Development (BDD), complementados por Modelos de Casos de Uso robustos que representem os fluxos de auditoria, exceções de segurança e restrições não-funcionais globais.",
      "Substituir qualquer documentação de requisitos por reuniões diárias (Daily Scrum) prolongadas, confiando na memória coletiva e na comunicação verbal entre analistas de negócios e arquitetos de segurança para sustentar a unificação da plataforma."
    ],
    correct: 3,
    feedback: "Alternativa D. Associar histórias de usuário focadas em negócio (BDD) com modelos de Casos de Uso estruturais que cobrem auditoria e fluxos alternativos resolve o conflito entre o ágil e a necessidade estrita da SUSEP. As alternativas A e E descartam uma das metodologias inteiramente. A alternativa B esconde requisitos em comentários de código, e a C cria barreiras de comunicação com lógicas de predicados.",
    points: 12.5
  },
  {
    category: "RASTRABILIDADE",
    context: "A PetroCorp, gigante do setor de exploração de petróleo em águas profundas, está gerenciando o desenvolvimento de um novo sistema de automação crítica para estabilização de plataformas offshore. O projeto possui altíssima complexidade e está sujeito a frequentes mudanças normativas da Agência Nacional do Petróleo, bem como a constantes alterações nas especificações dos sensores oceânicos de hardware. Atualmente, sempre que ocorre uma alteração em um requisito normativo (como o limite máximo de pressão das válvulas), a equipe leva semanas para mapear o impacto. Os analistas precisam investigar manualmente quais componentes da arquitetura de software, quais pacotes de código e quais cenários de teste automatizados dependem direta ou indiretamente dessa regra normativa. Essa falha de controle já resultou em incidentes perigosos de implantação, onde o código foi alterado, mas os scripts de teste associados não refletiam a nova regra de negócio, validando erroneamente o comportamento da válvula.",
    text: "Para mitigar os gravíssimos riscos de descompasso e acelerar de forma segura a análise de impacto frente às alterações normativas contínuas no sistema de estabilização da PetroCorp, qual mecanismo de gerência de requisitos deve ser implementado na arquitetura do processo de engenharia?",
    answers: [
      "Congelar permanentemente todos os requisitos normativos no momento da assinatura do contrato inicial, rejeitando formalmente qualquer atualização enviada pela Agência Nacional do Petróleo ao longo dos ciclos de desenvolvimento.",
      "Estabelecer uma matriz de rastreabilidade bidirecional robusta, implementada por meio de ferramentas automatizadas, que conecte explicitamente as fontes normativas aos requisitos de software, artefatos de design, blocos de código e respectivos casos de teste.",
      "Concentrar a gestão de impactos na figura exclusiva do Product Owner, delegando a ele a responsabilidade de revisar visualmente todas as 500 mil linhas de código-fonte a cada nova alteração da legislação petroleira vigente.",
      "Adotar relatórios quinzenais de status textual, nos quais os líderes técnicos descrevem subjetivamente os possíveis riscos arquiteturais, extinguindo a necessidade de ligações formais entre os artefatos de desenvolvimento.",
      "Instituir um sistema de rastreabilidade unidirecional restrito (forward traceability) que mapeia os requisitos exclusivamente até a fase de modelagem de dados, desconsiderando a vinculação obrigatória com a fase de testes e homologação final."
    ],
    correct: 1,
    feedback: "Alternativa B. A implantação de uma matriz de rastreabilidade bidirecional é a prática fundamental de Gerência de Requisitos para vincular exigências normativas a artefatos de testes e código, agilizando a análise de impacto. Congelar os requisitos (A) ignora a realidade legal; confiar tudo à memória do P.O. (C) é impossível; relatórios textuais (D) não funcionam; e a rastreabilidade unidirecional (E) perde a ligação com o QA.",
    points: 12.5
  },
  {
    category: "GERÊNCIA DE MUDANÇAS",
    context: "Um consórcio de bancos europeus contratou uma consultoria global para desenvolver uma plataforma inovadora de compensação de pagamentos transfronteiriços. Devido à volatilidade geopolítica, o comitê diretor do consórcio aprova e injeta novos pacotes de requisitos e alterações legislativas arquiteturais a cada duas semanas. O time de desenvolvimento, que adota práticas iterativas, está constantemente refatorando o motor de transações. Consequentemente, a área de testes de integração e a equipe de segurança perderam totalmente o controle e a sincronia metodológica. Eles já não sabem afirmar qual conjunto de requisitos normativos corresponde à versão exata do software que está implantada no ambiente de homologação. Frequentemente, os testadores reportam severas anomalias que, após horas de investigação, revelam-se comportamentos sistêmicos perfeitamente corretos segundo um pacote de requisitos recém-aprovado que simplesmente não havia sido referenciado no ciclo atual de QA.",
    text: "Considerando a contínua injeção de mudanças externas e o colapso da sincronia entre as equipes de desenvolvimento e de qualidade no projeto do consórcio bancário, qual prática estruturante de gerência de requisitos é mandatório aplicar para estabilizar os ciclos de homologação e evitar os alarmes falsos gerados por dessincronização de versões?",
    answers: [
      "Implementar o gerenciamento formal de Linhas de Base (Baselines) de Requisitos, criando pacotes de requisitos versionados e bloqueados que servem como referência inalterável e oficial para testes e implantação dentro de uma release específica.",
      "Eliminar a área de testes de integração independente, transferindo toda a responsabilidade de validação dos pagamentos transfronteiriços diretamente aos desenvolvedores backend, contornando a burocracia do sincronismo de artefatos.",
      "Exigir que as alterações legislativas e geopolíticas sejam acumuladas e processadas somente a cada dois anos, ignorando as demandas imediatas do comitê diretor para garantir o conforto e a estabilidade da área de homologação técnica.",
      "Substituir as ferramentas de gestão de ciclos de vida de aplicações (ALM) por planilhas estáticas de controle individual, exigindo que cada testador pergunte diariamente ao desenvolvedor qual é a versão da regra que está ativa no código-fonte.",
      "Reestruturar o projeto utilizando o ciclo de vida em Cascata puro, garantindo que toda a engenharia de software ocorra após a etapa final e absoluta de especificação, impedindo qualquer mutação regulatória durante os próximos 24 meses de projeto."
    ],
    correct: 0,
    feedback: "Alternativa A. A criação de Baselines (Linhas de Base) resolve a falta de sincronia, estipulando um marco formal congelado no tempo para que QA e Desenvolvimento tenham a mesma referência na release de homologação. Exigir acumulação de 2 anos (C) ou voltar ao Cascata (E) fere a agilidade transfronteiriça.",
    points: 12.5
  },
  {
    category: "REUTILIZAÇÃO",
    context: "A corporação nacional EduTech Brasil atua no fornecimento de sistemas massivos de gestão escolar para três domínios educacionais distintos: educação infantil (creches), ensino médio tradicional e centros de educação de jovens e adultos (EJA). Historicamente, a empresa alocou três direções de produto isoladas, que desenvolvem e mantêm especificações e códigos-fonte de maneira hermética. Uma auditoria financeira técnica recente revelou que o custo operacional de engenharia tornou-se insustentável: módulos vitais como \"controle de fluxo de inadimplência\", \"emissão de relatórios federais\" e \"autenticação de usuários\" possuíam incríveis 85% de sobreposição funcional entre os três sistemas isolados. Para salvar as margens de lucro, a nova Diretoria de Tecnologia (CTO) estabeleceu a meta inegociável de reduzir o tempo de especificação de novas funcionalidades institucionais em 40%, sem descaracterizar as flexibilidades pedagógicas intrínsecas a cada um dos três nichos educacionais atendidos pela empresa.",
    text: "Para atender à exigência executiva de drástica redução de redundâncias na especificação sem suprimir as especificidades pedagógicas de cada nicho (creches, ensino médio e EJA), qual estratégia de reutilização sistemática de requisitos a EduTech Brasil deve arquitetar institucionalmente?",
    answers: [
      "Adotar o reaproveitamento ad hoc oportunista, encorajando os engenheiros de requisitos a copiar e colar parágrafos de especificações de projetos finalizados sempre que julgarem pertinente na elaboração dos novos artefatos.",
      "Unificar os três sistemas herméticos em um software monolítico rígido, suprimindo as variações do domínio de educação infantil e EJA em favor da base central do ensino médio, impondo uma padronização extrema para todos os clientes.",
      "Terceirizar completamente a engenharia de requisitos das três plataformas educacionais para fornecedores diferentes, eliminando os custos fixos operacionais da empresa e anulando a preocupação interna com sobreposição de funcionalidades.",
      "Estabelecer uma Linha de Produto de Software (Software Product Line) pautada na engenharia de domínio, construindo bibliotecas de requisitos nucleares reutilizáveis e parametrizáveis, acompanhadas de variações sistêmicas explicitamente mapeadas para as regras pedagógicas locais.",
      "Reutilizar apenas requisitos não-funcionais estruturais (como tempo máximo de resposta em banco de dados), ignorando propositalmente o reaproveitamento de requisitos funcionais e regras de negócio para não comprometer a customização visual das interfaces gráficas."
    ],
    correct: 3,
    feedback: "Alternativa D. A implantação de uma Linha de Produto de Software (Product Line Engineering) cria núcleos genéricos parametrizáveis (core assets), separando de maneira inteligente as similaridades da base educacional das variações pedagógicas específicas. Copiar e colar (A) não é rastreável e gera débito técnico massivo; e unificar em monolito (B) remove flexibilidade.",
    points: 12.5
  },
  {
    category: "REUTILIZAÇÃO LEGD.",
    context: "O Governo Estadual está conduzindo uma reforma digital visando unificar todos os portais assistenciais (Bolsa Moradia, Renda Mínima Estadual e Auxílio Gás) sob um moderno super-aplicativo em arquitetura de microsserviços batizado de \"Cidadão Digital\". A coordenação estratégica da governança de TI ordenou que as equipes de requisitos aproveitassem integralmente a inteligência validada dos sistemas legados, desenvolvidos há quinze anos, para garantir a correta manutenção dos cálculos de concessão. Ao tentar realizar o reaproveitamento metodológico, os analistas constataram que os documentos originais apresentavam forte acoplamento tecnológico: as regras de cálculo e cruzamento financeiro de benefícios estavam descritas através de interações diretas com tabelas específicas de banco de dados legado (Oracle 8i) e processamentos noturnos em lote (batch em mainframes). A simples replicação desses textos inviabilizaria arquiteturalmente o uso das novas tecnologias em nuvem e APIs de tempo real desenhadas para o super-aplicativo.",
    text: "Frente ao complexo acoplamento tecnológico encontrado nos artefatos da década anterior, como os analistas de requisitos devem conduzir o processo de adaptação para garantir a efetiva reutilização das regras vitais de negócio no super-aplicativo moderno sem contaminá-lo com restrições de arquiteturas obsoletas?",
    answers: [
      "Realizar uma técnica de abstração e purificação de requisitos (engenharia reversa semântica), extraindo a essência lógica e jurídica das regras de concessão de benefícios, desvinculando-as de suas antigas premissas físicas e operacionais de infraestrutura legada.",
      "Desistir integralmente do reuso de especificações governamentais antigas, iniciando um ciclo completo e prolongado de elicitação do zero junto aos secretários de estado, mesmo que isso acarrete um aumento dramático no tempo e no custo do projeto \"Cidadão Digital\".",
      "Manter as descrições literais de interações com mainframes e bases relacionais na especificação contemporânea, delegando obrigatoriamente à equipe de programação em nuvem a tarefa empírica de \"traduzir e adaptar\" essas regras de negócio na hora da codificação da API.",
      "Aplicar a técnica de reutilização por espelhamento (clonagem estática), forçando a nova arquitetura de microsserviços em nuvem do \"Cidadão Digital\" a simular artificialmente processamentos em lote noturnos para não corromper a fidelidade aos requisitos originais legados.",
      "Ignorar as regras de negócio governamentais complexas focadas nos cálculos financeiros de benefícios, priorizando exclusivamente a reutilização das interfaces de usuário e layouts visuais dos anos 2000 no desenvolvimento frontal do novo super-aplicativo móvel."
    ],
    correct: 0,
    feedback: "Alternativa A. A engenharia reversa semântica purifica os requisitos legados, preservando as valiosas regras de negócio abstratas, e permitindo que sejam reutilizadas sem estarem ancoradas nas antigas premissas físicas e operacionais de infraestrutura legada.",
    points: 12.5
  }
];

// ─── DATA MODELO B ────────────────────────────────────────────────────────────
const QUESTIONS_B = [
  {
    category: "MODELAGEM",
    context: "O Departamento de Defesa está financiando o desenvolvimento de um exoesqueleto robótico para operações de resgate em áreas de escombros de alto risco. A equipe de hardware e a equipe de software possuem formações metodológicas radicalmente diferentes. Os engenheiros mecatrônicos preferem diagramas de estado precisos e especificações matemáticas robustas para garantir estabilidade, enquanto os engenheiros de software adotaram de forma rígida a técnica de Behavior-Driven Development (BDD) baseada em Gherkin (Dado-Quando-Então), focando no comportamento externo. Durante a fase de integração mecânico-lógica, descobriu-se fatalmente que os cenários simplificados descritos em linguagem natural (BDD) não capturavam a altíssima complexidade do controle vetorial dos motores em situações de desmoronamento instável do terreno. Isso resultou em falhas de sustentação e quedas iminentes do exoesqueleto nos testes de simulação física. A gerência do projeto precisa intervir imediatamente para estabelecer um padrão metodológico e de documentação que compatibilize as demandas de ambas as disciplinas, garantindo extrema precisão técnica.",
    text: "Diante do sério descompasso de linguagens de especificação que comprometeu as fases de simulação física e lógica do exoesqueleto, qual abordagem de engenharia de requisitos o gestor do projeto deve impor para unificar o rigor matemático exigido pela mecatrônica com a tratabilidade sistêmica exigida pela engenharia de software?",
    answers: [
      "Manter o Behavior-Driven Development (BDD) como a única fonte de verdade imutável do projeto e exigir que os engenheiros mecatrônicos ignorem os diagramas de estado cinemático em favor de conversas informais e histórias de usuário.",
      "Consolidar a documentação através de uma Especificação de Engenharia de Sistemas Baseada em Modelos (MBSE / UML rigorosa), integrando formalmente os diagramas de estado mecânicos com as restrições comportamentais de software verificáveis.",
      "Eliminar completamente a necessidade de documentação formal de requisitos prévia, focando exclusivamente no desenvolvimento de protótipos físicos semanais baseados em tentativa e erro no campo de provas de escombros.",
      "Padronizar o uso exclusivo da linguagem natural puramente desestruturada, evitando o jargão técnico excessivo de ambas as equipes, de modo que cada disciplina possa interpretar livremente os desafios cinemáticos da missão.",
      "Restringir metodologicamente o escopo documental apenas à equipe de hardware, terceirizando o desenvolvimento de todo o complexo software de controle vetorial para institutos acadêmicos de computação básica sem documentação compartilhada."
    ],
    correct: 1,
    feedback: "Alternativa B. MBSE (Model-Based Systems Engineering) consolida formalmente as exigências rígidas de estado mecatrônico com especificações de software. BDD puro (A) já provou ser muito simplista para controle vetorial; e a alternativa C (protótipos sem documentação) é fatal em sistemas cibernéticos críticos.",
    points: 12.5
  },
  {
    category: "VERIFICAÇÃO",
    context: "Uma proeminente startup fintech especializada em transações de criptomoedas de altíssima frequência está prestes a iniciar a programação de seu novo \"Motor de Correspondência de Ordens\" (Matching Engine). O analista sênior produziu um documento isolado de 80 páginas descrevendo intrincados requisitos de latência na casa dos microssegundos, alta tolerância a falhas de comunicação de rede e complexos algoritmos de priorização atuarial. Como as perdas financeiras resultantes de qualquer erro de modelagem lógica chegariam à casa dos milhões de dólares por minuto no lançamento, a diretoria executiva de compliance emitiu uma ordem restritiva: nenhum desenvolvimento de código deve ser iniciado até que a documentação apresentada seja exaustivamente provada como metodologicamente livre de defeitos de especificação. A equipe de garantia de qualidade (QA), no entanto, não dispõe de tempo hábil para codificar protótipos avançados ou executar pesadas simulações computacionais. Eles necessitam aplicar rigorosamente uma técnica estática, de caráter sistemático e intensivo.",
    text: "Considerando a proibição expressa de codificação prévia, os limitados recursos de tempo e o risco bilionário embutido na falha do Motor de Ordens, qual técnica de verificação metodológica a equipe de qualidade deve aplicar ao extenso documento para identificar imperfeições de forma estruturada e precoce?",
    answers: [
      "Execução cíclica de Casos de Teste de Desenvolvimento Orientado a Testes (TDD) atuando de forma agressiva diretamente no código-fonte legado da versão anterior do matching engine.",
      "Realização de Validação Empírica massiva dentro do ambiente financeiro de produção real, operando transações limitadas com um volume restrito de moedas fiduciárias para minimizar os impactos visíveis dos erros.",
      "Condução de uma Inspeção Formal Guiada (Inspeção Fagan), utilizando processos extremamente estruturados de leitura cruzada com listas de verificação (checklists), papéis definidos (moderador, revisor, autor) focados em anomalias lógicas puras.",
      "Aplicação imediata e exclusiva de Avaliações de Retorno Sobre Investimento (Análise de ROI) para garantir teoricamente à diretoria executiva que o motor especificado aumentará geometricamente a rentabilidade do fundo de investimentos a curto prazo.",
      "Substituição do esforço exaustivo de verificação interna técnica pela realização de pesquisas quantitativas de satisfação com os clientes finais, visando assegurar que eles se sintam confortáveis com a latência proposta nas 80 páginas de papel."
    ],
    correct: 2,
    feedback: "Alternativa C. Inspeções Formais (Fagan) aplicam verificação estática robusta, que encontra falhas sem rodar uma linha de código, poupando tempo e mitigando riscos gigantescos antes da programação.",
    points: 12.5
  },
  {
    category: "VALIDAÇÃO",
    context: "O badalado Hospital Metropolitano de Tecnologia Médica encomendou o desenvolvimento de um sistema arrojado de triagem preditiva alimentado por Inteligência Artificial (IA) direcionado à sua caótica sala de emergência geral. O algoritmo do sistema tem o propósito de prever estatisticamente o risco iminente de parada cardíaca do paciente nos próximos 30 minutos, tomando como base os dados inseridos na triagem inicial obrigatória. Os requisitos técnicos de precisão algorítmica foram rigorosamente especificados e atestados matematicamente in vitro (verificados estaticamente) pelos competentes cientistas de dados, atingindo surpreendentes 98% de acurácia em bases históricas. O pragmático Diretor Clínico de Operações, entretanto, argumenta convictamente que um algoritmo teórico perfeito perde todo e qualquer valor se as restrições ergonômicas da interface e a complexidade de entrada de dados exigir mais que os curtíssimos dois minutos disponibilizados para o enfermeiro triador efetuar seu delicado trabalho tático e vital sob alto estresse.",
    text: "Ciente de que o algoritmo comprovou sua incrível precisão técnica matemática isolada, que atividade metodológica de engenharia de requisitos deve ser primordialmente conduzida para atestar que as especificações do fluxo interativo satisfarão plenamente as necessidades do enfermeiro triador sob a caótica pressão do ambiente de emergência real?",
    answers: [
      "Contratar renomados especialistas atuariais estrangeiros para reverificar rigorosamente a base técnica do algoritmo matemático e elevar teoricamente a sua marca isolada de acurácia de 98% para 99,99%.",
      "Realizar imersivas sessões de observação ambiental controlada (shadowing) atreladas à avaliação de protótipos de interface, demonstrando e monitorando o uso do sistema em um fluxo simulado fidedigno ao da emergência hospitalar verdadeira.",
      "Encerrar permanentemente a inovação preditiva de Inteligência Artificial e determinar a adoção perpétua de formulários impressos simplificados com caneta e papel, extinguindo assim a inegável pressão interativa imposta aos profissionais do hospital.",
      "Iniciar de imediato intensas auditorias criptográficas de conformidade LGPD sobre o banco centralizado de dados históricos para assegurar irrevogavelmente o completo sigilo da identidade dos antigos pacientes anônimos do complexo hospitalar.",
      "Instituir um severo programa de capacitação mandatória estipulando que os enfermeiros operacionais absorvam formalmente os complexos conceitos estáticos de programação em Python visando que apreciem o genial trabalho arquitetural concebido pelos projetistas de IA."
    ],
    correct: 1,
    feedback: "Alternativa B. Validação fidedigna de um produto ocorre quando atestamos que ele soluciona o problema no ambiente real dos stakeholders. Sessões observacionais com protótipos de interface focam no fluxo e resolvem as restrições ergonômicas sob estresse.",
    points: 12.5
  },
  {
    category: "MODELAGEM",
    context: "Uma emergente startup latino-americana focada em mobilidade urbana (ridesharing) inaugurou o mercado atendendo precipuamente a oferta de viagens com motoristas de aplicativo. Confiante, a diretoria almeja expandir seu alcance sistêmico para integrar aluguéis de patinetes elétricos, bicicletas de rua compartilhadas e conexões contínuas com as linhas metropolitanas de transporte coletivo multimodal. Na sua origem incipiente, o documento de requisitos do software foi redigido de forma monolítica e pesadamente baseada em mockups visuais, com narrativas amarradas intimamente às telas, detalhando pormenores de botões exclusivos da interface de aluguel de carros. Durante as tentativas iniciais de embutir as lógicas de cobrança dos patinetes e de reserva de modais, o corpo técnico percebeu que as vitais especificações financeiras dinâmicas e de controle vetorial de rotas encontravam-se confusamente submersas sob as restrições estéticas antigas de tela, inviabilizando qualquer clareza ou expansão. O CTO deseja estruturar um artefato que abstraia essas especificidades estéticas e concentre-se essencialmente nas lógicas transacionais essenciais.",
    text: "Para resolver a barreira documental de crescimento e remover a poluição introduzida pela especificidade exaustiva da Interface Visual de Usuário, qual mecanismo ou formato de modelagem de requisitos deve ser metodologicamente estabelecido pela coordenação do CTO?",
    answers: [
      "Expandir agressivamente os wireframes primitivos incluindo exóticos mapas interativos de cor e ferramentas de testes empíricos A/B em massa, fazendo com que o comportamento passivo da interface dite integralmente as vitais lógicas sistêmicas subjacentes de tarifação veicular.",
      "Adotar formalmente modelagens puras de engenharia com Casos de Uso Focados na Essência (Casos de Uso Essenciais) e interações lógicas sistêmicas independentes de arquitetura, priorizando os relacionamentos comportamentais e transacionais dos múltiplos atores sem fazer apelo ou vínculo com tecnologias provisórias de tela.",
      "Transferir o registro íntegro de requisitos das lógicas transacionais para robôs de automação conversacional (chatbots do Discord corporativo), rechaçando peremptoriamente qualquer formato de modelagem controlada em favor de gravações caóticas de conversações de áudio desestruturadas no decorrer das semanas.",
      "Consolidar a totalidade das especificações empregando estritamente linguagens rascunhadas em pseudocódigo baseados nos frameworks visuais (ex: componentes do React), forçando a equipe analítica a escrever extensas premissas de tarifação operando os estados de visibilidade das camadas lógicas do layout.",
      "Decidir fragmentar dolorosamente a estrutura societária da empresa constituindo três startups funcionalmente autônomas na área legal, evadindo-se completamente do imenso desafio técnico de suportar e rastrear múltiplos modais operacionais em um artefato único de especificação consolidada."
    ],
    correct: 1,
    feedback: "Alternativa B. O uso de Casos de Uso focados na lógica do sistema (Casos de Uso Essenciais) abstrai as limitações e poluições visuais da Interface do Usuário (UI), focando perfeitamente nas interações de negócios essenciais e resolvendo a barreira documental de crescimento.",
    points: 12.5
  },
  {
    category: "RASTRABILIDADE",
    context: "A Agência Governamental de Aviação e Clima está gerenciando criticamente a construção e o amadurecimento do arrojado software de telemetria voltado para a novíssima geração de satélites geoclimáticos de alta altitude. Lamentavelmente, já durante o perigoso transcorrer da fase executiva de construção da estrutura de hardware, um dramático corte contingencial do Ministério da Economia exigiu compulsoriamente o imediato expurgo físico de quatro poderosos equipamentos infravermelhos da fuselagem oficial. O angustiado gerente de projeto determinou rapidamente ao braço de engenharia de software que identificassem e removessem qualquer lógica, biblioteca e exigência operacional conectadas ao processamento ocioso destes extintos sensores a fim de não sobrecarregar e exaurir o computador principal de bordo durante o escasso trânsito em órbita baixa. Surpreendentemente, os engenheiros responderam ser quase que humanamente impossível definir rigorosamente com acurácia quais pedaços soltos de código fonte, quais exigências temporais de memória ou até mesmos quais demorados testes operacionais possuíam dependência atrelada exclusivamente aos ausentes instrumentos de telemetria infravermelha, aumentando o perigoso risco de colapsarem erroneamente áreas interdependentes cruciais ao se arrancar \"às cegas\" os insumos lógicos vitais.",
    text: "Para sanear esta perigosa miopia arquitetônica identificada e possibilitar uma Análise de Impacto cirúrgica segura sobre a mudança drástica na base do satélite, qual estruturação formal a gerência do projeto aeroespacial cometeu a negligência primordial de não ter estabelecido desde a concepção do ciclo?",
    answers: [
      "Prática ativa e formal de ocultamento prosital e invisível da complexidade infravermelha nas profundezas irrecuperáveis do código principal da telemetria, visando camuflar o trabalho exigido sob o orçamento global.",
      "Implementação constante de detalhadíssimos memorandos textuais descritivos isentando criminalmente os construtores programadores, assegurando imunidade caso o computador espacial central reinicie fatalmente durante a exclusão das lógicas acessórias e dependentes.",
      "Organização da Matriz Analítica e Bidirecional de Rastreabilidade dos Requisitos Críticos, desenhando, provando e preservando as fundamentais amarrações teias desde as imposições e definições de engenharia primárias do sensor até os pontuais diagramas de fluxo codificados e respectivos testes operacionais afetados organicamente.",
      "Admissão generalizada e corriqueira de consultorias estrangeiras militares que detivessem habilidades empíricas ocultas para descobrir intuitivamente interdependências sensíveis na fiação eletrônica através da dispensa completa do incômodo rastro documental de base estrutural.",
      "Exclusiva estruturação do ritmo contínuo baseada na filosofia extrema de trabalho conjunto de duplas contínuas e codificação acelerada contornando o formalismo impeditivo, garantindo aos governantes a segurança por meio de incertos e demorados testes experimentais investigativos."
    ],
    correct: 2,
    feedback: "Alternativa C. A ausência imperdoável apontada é de Rastreabilidade Bidirecional. Sua construção é o único método seguro de conectar as dependências entre hardware espacial, software e testes afetados, permitindo Análise de Impacto estruturada.",
    points: 12.5
  },
  {
    category: "GERÊNCIA DE MUDANÇAS",
    context: "O badalado consórcio interuniversitário público de pesquisa avançada em banco de dados fomenta a expansão coletiva contínua de um sistema massivo e inovador para o controle governamental acadêmico livre, recebendo e mesclando atualizações enviadas por mais de quatrocentos engenheiros abertos geograficamente espalhados pelo vastíssimo território continental e operando em múltiplas vertentes. Como há fortíssimo espírito libertário na governança do sistema, com inúmeros conselhos de ensino propondo exóticas integrações curriculares inovadoras diariamente por fóruns remotos acessíveis, o documento colaborativo matriz que alinha o esperado das integrações de software é ininterruptamente mexido. Na última entrega semestral de atualização fundamental, um trágico colapso total evidenciou-se. O imenso módulo de matriz curricular validado na Universidade Sulina havia consumido um pacote estável das especificações fixadas rigorosamente no fechamento do mês de Abril, enquanto o complexo módulo ministerial processado isoladamente na Universidade Nordestina havia ancorado seu desenvolvimento focado num esqueleto radicalmente atualizado em meados do final de Junho daquele documento de edição ininterrupta por massa, originando um curto circuito em cadeia que interrompeu catastróficamente toda a implantação sistêmica da fase um do gigantesco ambiente interligado, evidenciando uma monumental pane referencial entre esferas que trabalhavam achando estarem perfeitamente guiadas pelo \"último arquivo central único e correto\".",
    text: "Considerando as pesadas avarias sistêmicas provocadas na base distribuída pelas assimetrias intercorrentes derivadas da permanente maleabilidade e descontrole referencial do artefato originador de engenharia, a coordenação executiva mestre é metodologicamente obrigada a injetar urgentemente qual mecanismo rígido de ordenamento para estancar estas discrepâncias catastróficas em lançamentos cooperados?",
    answers: [
      "Banir ditatorialmente as estruturas distributivas do ecossistema educacional libertário enclausurando e isolando todo o expressivo contingente humano restrito aos escritórios federais localizados sob uma mesma metrópole administrativa em um centro estático formal de comunicação pessoal intensa diária obrigatória.",
      "Abolir e pulverizar globalmente o banco governamental nacional central unificador repassando inteira e isoladamente o controle primário acadêmico para rudimentares planilhas locais dispersas isolando permanentemente os polos, superando em definitivo os gigantescos desafios operacionais de compatibilização nacional referencial.",
      "Sistematizar formalmente e impor o fechamento temporal fixo e irrenunciável de Linhas de Base Técnicas (Baselines Oficiais de Requisitos) gerando um marco congelado ineditável de requisitos previamente estipulado onde todas as longínquas unidades isoladas são forçadamente obrigadas a espelharem rigorosa sincronia para o atual grande esforço contínuo do marco pontual de entrega e implantação coletiva.",
      "Exaltar orgulhosamente e permitir vigorosamente as oscilações sistêmicas criativas promovendo intencionalmente constantes alterações instáveis simultâneas e imprevistas para enriquecer academicamente no longo prazo, relegando a resolução empírica conflituosa exaustiva e complexamente tardia apenas para os capacitados e heroicos líderes experientes.",
      "Proibir metodologicamente a aceitação de portarias e pedidos governamentais do complexo ministério até o alinhamento exclusivo em fóruns presenciais ocorridos impreterivelmente de década em década impedindo atuações imediatas operativas."
    ],
    correct: 2,
    feedback: "Alternativa C. As Baselines criam fronteiras seguras, controlando alterações caóticas simultâneas em fóruns abertos, sincronizando temporalmente as dependências e impedindo panes referencias em lançamentos distribuídos.",
    points: 12.5
  },
  {
    category: "REUTILIZAÇÃO",
    context: "A próspera corporação continental especializada FastLogistics fomenta e fornece intrincados Sistemas Avançados de Gestão Operacional Customizada para robustos complexos de Armazéns de Transferência Logística Atacadista espalhados pelo denso Cone Sul da região continental internacional densamente disputada financeiramente e tempo. O experiente Arquiteto de Operações revelou que 75% da estrutura intelectual de fluxos normativos atrelados às regras de recebimento automatizado e algoritmos de expedição repetem-se identicamente por centenas de clientes. Ironicamente, a diretriz organizacional vigente aloca enormes esquadrões de analistas para recomeçar do zero a documentação de cada novo cliente contratado, modificando apenas minúcias gramaticais exclusivas ou nomenclaturas cosméticas locais, o que causa um atraso operacional crítico.",
    text: "Consternado pelas pressões avassaladoras contínuas mortais externas competitivas do relógio, que formidável e abrangente arquitetura metodológica de Engenharia Reutilizável Contemporânea Inteligente o experiente Arquiteto deve forçar a diretoria a abraçar globalmente erradicando o arcaico trabalho artesanal hercúleo redundante focado esmagador financeiro isolado?",
    answers: [
      "Investir inesgotáveis fundos no aumento contínuo de pelotões manuais braçais para redigir do zero as especificações de cada cliente, visando acelerar o levantamento físico na base da força bruta.",
      "Ignorar as similaridades operacionais nos armazéns e focar os esforços corporativos em robôs físicos e máquinas autônomas de estocagem, deixando o desperdício documental de software em segundo plano.",
      "Estabelecer institucionalmente o domínio rigoroso da Engenharia de Linha de Produtos Sistêmicos baseada em componentes vitais, abstraindo parametricamente as essências comuns sólidas e blindadas reutilizáveis modulares (core assets), e concentrando a elicitação apenas nas adaptações periféricas flutuantes e específicas regionais de cada novo cliente.",
      "Propagar a prática informal e oculta de copiar blocos de texto de antigos PDFs em editores rudimentares, delegando às pressas a responsabilidade das adaptações lexicais diretamente para a equipe terceirizada de programadores durante a codificação noturna.",
      "Retirar o sistema do portfólio de vendas até convencer amigavelmente os grandes concorrentes internacionais a reduzirem seus ritmos de entrega para igualar as ineficiências históricas do ecossistema local."
    ],
    correct: 2,
    feedback: "Alternativa C. Reuso através de Engenharia de Linha de Produtos de Software maximiza a produtividade separando o grande core paramétrico comum (70-75%) das customizações e variações marginais da implantação local (30%).",
    points: 12.5
  },
  {
    category: "REUTILIZAÇÃO LEGD.",
    context: "O Superior Tribunal Maior está na turbulenta e delicadíssima iminência de migrar sua principal espinha dorsal jurisdicional (antigo Processo Velho) baseada em monolitos defasados para uma moderníssima teia ágil distribuída de Microsserviços na Nuvem. Nesse marco, há a necessidade absoluta de resgatar integralmente o complexo e dogmático algoritmo atuarial da lei da Prescrição Penal, que se encontra rigidamente acoplado em lógicas procedimentais de tabelas de bancos de dados relacionais descontinuados Oracle 8.9. A simples cópia literal inviabilizaria o uso das novas APIs escaláveis de microsserviços.",
    text: "Frente ao complexo paradoxo técnico do acoplamento estrutural legado, que procedimento a equipe de requisitos deve adotar para transladar a precisão das regras de cálculo da Prescrição Penal sem poluir a nova arquitetura leve na nuvem com restrições e tecnologias defuntas?",
    answers: [
      "Rejeitar o código de cálculo maduro devido ao acoplamento e refazer do zero toda a especificação atuarial jurídica, gerando custos de milhões de dólares e anos adicionais de projeto.",
      "Processar uma sistemática e rigorosa técnica de abstração (Engenharia Reversa Semântica), garimpando e modelando a pura essência lógica e jurídica da regra de cálculo prescricional penal de forma independente de banco de dados, expurgando todas as amarras físicas procedimentais do Oracle legacy.",
      "Carregar o passivo mantendo as descrições literais de tabelas e procedures e delegar à equipe de desenvolvimento a tarefa informal e empírica de \"adivinhar e traduzir\" as regras no calor da programação ágil backend.",
      "Alocar permanentemente centenas de estagiários de direito para executar manualmente os cálculos da prescrição em planilhas eletrônicas de desktops locais, contornando de forma improvisada a necessidade de automatizar a integração sistêmica.",
      "Reusar apenas superficialmente as telas e interfaces visuais do sistema antigo, ignorando completamente o algoritmo complexo de prescrição penal e forçando a equipe jurídica a validar cada processo no braço."
    ],
    correct: 1,
    feedback: "Alternativa B. A engenharia reversa semântica extrai as regras de negócio abstratas, purificando-as para novas arquiteturas leves sem herdar o débito técnico físico das tabelas e procedures legadas.",
    points: 12.5
  }
];

const BADGES = [
  { id: 'first_blood', emoji: '🎯', name: 'Primeiro Acerto', desc: 'Acertou a primeira questão do simulador', condition: (s) => s.firstCorrect },
  { id: 'consistency', emoji: '🔥', name: 'Em Chamas', desc: '3 acertos seguidos', condition: (s) => s.streak >= 3 },
  { id: 'half_way', emoji: '⚡', name: 'Metade Vencida', desc: 'Completou 4 questões', condition: (s) => s.answered >= 4 },
  { id: 'perfectionist', emoji: '💎', name: 'Gênio Analítico', desc: '100% de acertos até agora', condition: (s) => s.answered > 0 && s.correct === s.answered },
  { id: 'speed_demon', emoji: '🚀', name: 'Rápido e Preciso', desc: 'Respondeu em menos de 10s', condition: (s) => s.fastAnswer },
  { id: 'champion', emoji: '🏆', name: 'Revisor Mestre', desc: 'Completou o simulador e revisou a discursiva', condition: (s) => s.finished },
];

const CATEGORY_COLORS = {
  "DOCUMENTAÇÃO": "#EF4444",
  "VERIFICAÇÃO": "#3B82F6",
  "VALIDAÇÃO": "#10B981",
  "MODELAGEM": "#F59E0B",
  "RASTRABILIDADE": "#8B5CF6",
  "GERÊNCIA DE MUDANÇAS": "#EC4899",
  "REUTILIZAÇÃO": "#00D4FF",
  "REUTILIZAÇÃO LEGD.": "#F43F5E",
};

// Estudo de Caso Discursiva
const STUDY_CASE_A = {
  title: "ESTUDO DE CASO: PLATAFORMA AQUAGEST-AM (MODELO A)",
  context: "A TechNova Soluções, empresa de médio porte do setor de tecnologia sediada em Manaus (AM), especializada em desenvolvimento de sistemas para o setor público e privado da região Norte, acaba de ser contratada para desenvolver uma plataforma integrada de gestão de recursos hídricos para o estado do Amazonas. O projeto, denominado AquaGest-AM, tem prazo de 18 meses e orçamento de R$ 4,2 milhões, financiado por um convênio federal.\n\nA empresa possui em seu portfólio três sistemas legados desenvolvidos nos últimos cinco anos: (1) HidroVigil — sistema de monitoramento de bacias hidrográficas para o Pará; (2) SaneaControl — módulo de controle de qualidade da água para concessionária de saneamento em São Paulo; e (3) ClimaAlert — plataforma de alertas climáticos e previsão de enchentes para a Defesa Civil do Amazonas.\n\nO gerente de projetos, Dr. Roberto Lima, identificou previamente que 40% dos requisitos funcionais do AquaGest-AM apresentam similaridade com funcionalidades já implementadas nos sistemas legados. No entanto, a equipe de desenvolvimento, composta majoritariamente por profissionais juniores contratados recentemente, manifestou resistência em reutilizar requisitos dos projetos anteriores, alegando que 'cada cliente é único' e que 'reaproveitar requisitos limita a inovação e o aprendizado arquitetural'. Além disso, o time de qualidade reportou internamente que a documentação formal dos sistemas legados encontra-se fragmentada, apresentando rastreabilidade parcial e total falta de padronização na modelagem estrutural.\n\nDo lado do negócio, as comunidades ribeirinhas exigem módulos com interface em línguas indígenas locais e acesso com sincronização offline eficiente; já os pesquisadores universitários demandam integração severa em tempo real com bases de dados científicas internacionais de climatologia; por sua vez, os órgãos fiscalizadores estatais priorizam trilhas de auditoria completa, imutabilidade de laudos e conformidade estrita com a Lei Geral de Proteção de Dados (LGPD).",
  statement: "Elabore uma resposta dissertativo-argumentativa, com no mínimo 30 linhas, abordando detalhadamente os seguintes itens:\nA) Como conduzir a identificação e documentação de requisitos para conciliar comunidades ribeirinhas offline vs. cientistas em tempo real vs. fiscais governamentais.\nB) Propor uma abordagem para estabelecer rastreabilidade bidirecional a partir de bases legadas fragmentadas.\nC) Avaliar a viabilidade de reutilização baseada no portfólio legado (HidroVigil, SaneaControl, ClimaAlert) e refutar tecnicamente a visão júnior de que 'reaproveitar limita a inovação'.\nD) Propor uma estratégia de Gerência de Mudanças e Configuração para lidar com novos modelos de IA para enchentes e oscilações da LGPD.",
  criteria: "Critérios de Correção da Discursiva (Modelo A):\n1. Reconciliação dos stakeholders: Mapear técnicas inclusivas para ribeirinhos (design participativo, oficinas locais) e conciliar com APIs REST em tempo real e hashing para auditoria governamental.\n2. Rastreabilidade: Sugerir engenharia reversa manual para criar elos (links) faltantes e consolidar uma Matriz de Rastreabilidade Bidirecional (Requisitos <-> Código <-> Testes).\n3. Reutilização de Requisitos: Fundamentar na Engenharia de Linha de Produto de Software (SPL) e isolamento de Core Assets. Reusar poupa esforço manual permitindo focar na inovação real (IA, sincronização offline de baixa latência).\n4. Gerência de Mudanças: Adotar o fluxo CCB (Comitê de Controle de Mudanças) com Baselines rígidas e ramificações versionadas de requisitos para proteger o escopo central das oscilações da LGPD."
};

const STUDY_CASE_B = {
  title: "ESTUDO DE CASO: PROJETO LEITOCONECTADO (MODELO B)",
  context: "A SaúdeTech-AM, consórcio tecnológico voltado para a modernização da infraestrutura hospitalar na região Norte do país, venceu uma gigantesca licitação governamental para implementar o ambicioso \"LeitoConectado\". Este projeto visa a construção e operação de um sistema unificado de regulação e controle de vagas e leitos de UTI para conectar em tempo real 18 grandes hospitais públicos na capital Manaus e mais 5 hospitais regionais situados no remoto interior do Amazonas. O projeto é impiedoso: duração de apenas 12 meses, verba auditada e desafios que incluem extrema instabilidade de telecomunicações no interior e hardware sucateado.\n\nA SaúdeTech já possui o \"RegulaMed\", um sistema operando com sucesso há cinco anos em clínicas e complexos particulares no Sul do país. Visando cumprir o inegociável prazo, a diretoria quer reaproveitar maciçamente a base documental do RegulaMed.\n\nNo entanto, a equipe sênior notou abismos de contexto: o SUS exige conformidade com a fila única federal, trilhas de auditoria imutáveis exigidas pelo Ministério Público Estadual, e IA preditiva para prever agravamento clínico em áreas remotas. Todos esses elementos são inexistentes na base privada do RegulaMed. E, para agravar, há alta rotatividade (turnover) de desenvolvedores causando perda diária de conhecimento histórico.",
  statement: "Elabore uma resposta dissertativo-argumentativa, com no mínimo 30 linhas, abordando detalhadamente os seguintes itens:\nA) Propor técnicas de elicitação e validação adequadas para o contexto hospitalar público do interior amazônico sob as exigências do SUS.\nB) Avaliar a reutilização dos requisitos do 'RegulaMed', indicando como blindar a parte genérica da específica e os riscos do 'copiar e colar' na saúde pública.\nC) Propor uma estratégia de Baselines e controle de versões para mitigar o impacto do turnover da equipe e integração concorrente de hospitais.\nD) Propor e justificar uma Matriz de Rastreabilidade Bidirecional (forward/backward) que atenda aos fiscais de auditoria do Ministério Público de forma irrefutável.",
  criteria: "Critérios de Correção da Discursiva (Modelo B):\n1. Elicitação/Validação: Usar observação direta no campo (shadowing), oficinas de design participativo com enfermeiros, e protótipos interativos offline. Conciliar as visões de saúde pública do SUS com a lógica puramente particular/privada anterior.\n2. Reutilização do RegulaMed: Modelar Linhas de Produto de Software (SPL) definindo componentes genéricos de cadastro de leitos (core assets) separados dos módulos específicos (fila do SUS, IA preditiva). Condenar o 'copiar e colar' pelo risco de herdar regras mercadológicas que violam a isonomia do SUS e geram falha médica.\n3. Baselines e Turnover: Estabelecer Baselines temporais rígidas (ex: congelamentos mensais) e versionamento de requisitos em ferramentas de ALM para garantir que novos desenvolvedores tenham a referência única da release, mitigando a perda de histórico.\n4. Rastreabilidade Bidirecional: Implementar Matriz que conecte as Portarias do SUS com os Requisitos Funcionais, Cenários de Testes de Homologação, Códigos de IA de Predição e Scripts de Teste. Permite auditorias rápidas e fáceis para os promotores públicos."
};

// ─── MINI COMPONENTS ────────────────────────────────────────────────────────
function QMap({ results, current, total }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => {
        let bg = 'rgba(255,255,255,0.03)';
        let border = 'rgba(255,255,255,0.08)';
        let color = 'rgba(255,255,255,0.2)';
        if (i === current) { border = '#EF4444'; color = '#EF4444'; bg = 'rgba(239,68,68,0.1)'; }
        else if (results[i] !== undefined) {
          if (results[i]) { bg = 'rgba(16,185,129,0.2)'; border = '#10B981'; color = '#10B981'; }
          else { bg = 'rgba(239,68,68,0.2)'; border = '#EF4444'; color = '#EF4444'; }
        }
        return (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: 6, border: `1px solid ${border}`,
            background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color, transition: 'all 0.2s'
          }}>{i + 1}</div>
        );
      })}
    </div>
  );
}

function BadgesGrid({ earned }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      {BADGES.map(b => (
        <div key={b.id} title={b.desc} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '10px 6px', background: 'rgba(255,255,255,0.02)', border: `1px solid`,
          borderColor: earned.includes(b.id) ? '#F5A623' : 'rgba(255,255,255,0.06)',
          borderRadius: 8, opacity: earned.includes(b.id) ? 1 : 0.3,
          filter: earned.includes(b.id) ? 'none' : 'grayscale(1)',
          transition: 'all 0.4s', boxShadow: earned.includes(b.id) ? '0 0 10px rgba(245,166,35,0.2)' : 'none',
        }}>
          <span style={{ fontSize: 20 }}>{b.emoji}</span>
          <span style={{ fontSize: 8, color: earned.includes(b.id) ? '#F5A623' : '#6B6B7F', textAlign: 'center', fontFamily: 'monospace' }}>{b.name}</span>
        </div>
      ))}
    </div>
  );
}

// ─── INTRO SCREEN ───────────────────────────────────────────────────────────
function Intro({ onStart }) {
  const [name, setName] = useState('');
  const [model, setModel] = useState('A'); // 'A' | 'B'

  return (
    <div style={{
      minHeight: '100vh', background: '#070B14', color: '#F0F0F5',
      fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center',
      backgroundImage: 'radial-gradient(ellipse at 10% 55%, rgba(239,68,68,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.05) 0%, transparent 50%)'
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />

      <Link to="/fametro" style={{
        position: 'fixed', top: 20, left: 20, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: "monospace", fontSize: 12, letterSpacing: 1,
        color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px',
        background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)',
        borderRadius: '6px', transition: 'all 0.2s'
      }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      >
        ← HUB FAMETRO
      </Link>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 650, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block', fontFamily: 'monospace', fontSize: 10, letterSpacing: 3,
          color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', padding: '6px 16px',
          borderRadius: 20, marginBottom: 24, background: 'rgba(239,68,68,0.05)',
          boxShadow: '0 0 15px rgba(239,68,68,0.15)'
        }}>
          ATIVIDADE DE REVISÃO DA AVALIAÇÃO INSTITUCIONAL
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 8vw, 64px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, marginBottom: 8, color: '#fff' }}>
          Requisitos e <span style={{ background: 'linear-gradient(135deg, #EF4444 0%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Projetos</span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '520px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          Simulado preparatório para a Avaliação Institucional do 5º Período (SI). Teste sua proficiência em Engenharia de Requisitos sob cenários avançados.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, width: '100%', marginBottom: 32 }}>
          {/* Nome Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: '#64748B', textTransform: 'uppercase' }}>Seu Nome / Matrícula</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Alexsander Farias"
              style={{
                background: '#0D1321', border: '1px solid rgba(255,255,255,0.08)',
                borderBottom: '2px solid #EF4444', color: '#fff', borderRadius: 8,
                fontSize: 16, padding: '14px 16px', outline: 'none', boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
            />
          </div>

          {/* Modelo Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: '#64748B', textTransform: 'uppercase' }}>Modelo de Simulado</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['A', 'B'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setModel(opt)}
                  style={{
                    flex: 1, padding: '14px', borderRadius: 8,
                    background: model === opt ? 'rgba(239,68,68,0.15)' : '#0D1321',
                    border: `1px solid ${model === opt ? '#EF4444' : 'rgba(255,255,255,0.08)'}`,
                    color: model === opt ? '#fff' : '#64748B', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  Modelo {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => name.trim() && onStart(name.trim(), model)}
          disabled={!name.trim()}
          style={{
            background: name.trim() ? 'linear-gradient(135deg, #EF4444, #C0392B)' : '#1E293B',
            color: name.trim() ? '#fff' : '#64748B', border: 'none',
            fontSize: 15, fontWeight: 800, letterSpacing: 2, borderRadius: 12,
            textTransform: 'uppercase', padding: '18px 48px', cursor: name.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s', boxShadow: name.trim() ? '0 4px 20px rgba(239,68,68,0.25)' : 'none'
          }}
        >
          Iniciar Simulado ({model})
        </button>

        <div style={{ marginTop: 24, fontSize: 12, color: '#475569' }}>
          Prof. Alexsander Farias · FAMETRO Manaus
        </div>
      </div>
    </div>
  );
}

// ─── QUIZ SCREEN (OBJETIVAS) ─────────────────────────────────────────────────
function Quiz({ playerName, model, onFinish }) {
  const questions = model === 'A' ? QUESTIONS_A : QUESTIONS_B;
  const studyCase = model === 'A' ? STUDY_CASE_A : STUDY_CASE_B;

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [firstCorrect, setFirstCorrect] = useState(false);
  const [fastAnswer, setFastAnswer] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [qResults, setQResults] = useState([]);
  const [qStartTime, setQStartTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [notification, setNotification] = useState(null);
  const [pointsFlash, setPointsFlash] = useState(null);

  // Modos de visualização
  const [step, setStep] = useState('quiz'); // 'quiz' | 'discursive'
  const [discursiveText, setDiscursiveText] = useState('');
  const [showDiscursiveFeedback, setShowDiscursiveFeedback] = useState(false);

  function selectAnswer(index) {
    if (showFeedback) return;
    const elapsed = (Date.now() - qStartTime) / 1000;
    const q = questions[currentQ];
    const isCorrect = index === q.correct;

    setSelectedAnswer(index);
    setShowFeedback(true);

    const newAnswered = answered + 1;
    const newCorrect = isCorrect ? correct + 1 : correct;
    const newStreak = isCorrect ? streak + 1 : 0;
    const newScore = isCorrect ? score + q.points : score;
    const newFast = elapsed < 10 ? true : fastAnswer;
    const newFirstCorrect = isCorrect ? true : firstCorrect;

    setAnswered(newAnswered);
    setCorrect(newCorrect);
    setStreak(newStreak);
    setScore(newScore);
    setFastAnswer(newFast);
    if (isCorrect) setFirstCorrect(true);

    setQResults(prev => [...prev, isCorrect]);

    if (isCorrect) setPointsFlash(`+${q.points}`);

    // Badges Check
    const state = {
      answered: newAnswered, correct: newCorrect, streak: newStreak,
      firstCorrect: newFirstCorrect, fastAnswer: newFast, finished: false
    };
    checkBadges(state, earnedBadges);
    setTimeout(() => setPointsFlash(null), 1200);
  }

  function checkBadges(state, current) {
    const newOnes = BADGES.filter(b => !current.includes(b.id) && b.id !== 'champion' && b.condition(state));
    if (newOnes.length > 0) {
      const updated = [...current, ...newOnes.map(b => b.id)];
      setEarnedBadges(updated);
      newOnes.forEach(b => {
        showNotif(`🏅 Conquista!`, `${b.emoji} ${b.name} — ${b.desc}`);
      });
    }
  }

  function showNotif(title, body) {
    setNotification({ title, body });
    setTimeout(() => setNotification(null), 3500);
  }

  function nextQuestion() {
    if (currentQ + 1 >= questions.length) {
      setStep('discursive');
    } else {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQStartTime(Date.now());
    }
  }

  function finishSimulator() {
    const finalBadges = [...earnedBadges, 'champion'];
    setEarnedBadges(finalBadges);
    onFinish({
      score,
      answered,
      correct,
      earnedBadges: finalBadges,
      discursiveResponse: discursiveText
    });
  }

  const q = questions[currentQ];
  const pct = Math.round((currentQ / questions.length) * 100);
  const catColor = CATEGORY_COLORS[q.category] || '#EF4444';
  const letters = ['A', 'B', 'C', 'D', 'E'];

  if (step === 'discursive') {
    return (
      <div style={{ minHeight: '100vh', background: '#070B14', color: '#F0F0F5', fontFamily: "'Inter', sans-serif", padding: '40px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: '#0D1321', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '32px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, color: '#EF4444', textTransform: 'uppercase' }}>Parte 2 - Questão Discursiva</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0' }}>{studyCase.title}</h2>
            </div>
            <div style={{ fontSize: 13, background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '6px 12px', borderRadius: 20, fontWeight: 700, fontFamily: 'monospace' }}>
              Acertos Objetivas: {correct} / {questions.length} ({score} pts)
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 20, borderRadius: 10, fontSize: 14, color: '#CBD5E1', lineHeight: 1.6, maxHeight: 240, overflowY: 'auto', marginBottom: 24 }}>
            <h4 style={{ color: '#fff', marginTop: 0, marginBottom: 8, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Contexto e Estudo de Caso</h4>
            {studyCase.context.split('\n\n').map((p, idx) => (
              <p key={idx} style={{ marginBottom: 12 }}>{p}</p>
            ))}
          </div>

          <div style={{ borderLeft: '3px solid #EF4444', background: 'rgba(239,68,68,0.03)', padding: '16px 20px', borderRadius: '0 8px 8px 0', marginBottom: 28 }}>
            <h4 style={{ color: '#EF4444', marginTop: 0, marginBottom: 8, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Enunciado</h4>
            <div style={{ fontSize: 14, color: '#fff', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{studyCase.statement}</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1, color: '#64748B', textTransform: 'uppercase', marginBottom: 8 }}>Seu Rascunho de Resposta (Mínimo recomendado: 30 linhas)</label>
            <textarea
              value={discursiveText}
              onChange={e => setDiscursiveText(e.target.value)}
              placeholder="Digite aqui sua análise dissertativa-argumentativa..."
              style={{
                width: '100%', minHeight: '240px', background: '#070B14', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', borderRadius: 8, padding: 16, fontSize: 14, lineHeight: 1.6, outline: 'none', boxSizing: 'border-box',
                fontFamily: 'monospace'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginTop: 6, fontFamily: 'monospace' }}>
              <span>Linhas estimadas: {discursiveText.split('\n').filter(Boolean).length}</span>
              <span>Caracteres: {discursiveText.length}</span>
            </div>
          </div>

          {showDiscursiveFeedback ? (
            <div style={{ marginTop: 24, animation: 'fadeIn 0.4s ease' }}>
              <div style={{ border: '1px solid #10B981', background: 'rgba(16,185,129,0.04)', padding: 24, borderRadius: 10, marginBottom: 28 }}>
                <h4 style={{ color: '#10B981', marginTop: 0, marginBottom: 12, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>🔓 GABARITO OFICIAL DO PROFESSOR (DIRETRIZES)</h4>
                <div style={{ fontSize: 14, color: '#D1D5DB', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{studyCase.criteria}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={finishSimulator}
                  style={{
                    background: '#10B981', color: '#fff', border: 'none', padding: '14px 36px',
                    borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  Concluir e Ver Resultados Final →
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center' }}>
                Nota das objetivas será salva ao liberar o gabarito.
              </span>
              <button
                onClick={() => setShowDiscursiveFeedback(true)}
                disabled={!discursiveText.trim()}
                style={{
                  background: discursiveText.trim() ? '#EF4444' : '#1E293B',
                  color: discursiveText.trim() ? '#fff' : '#64748B', border: 'none',
                  padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14,
                  cursor: discursiveText.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
                }}
              >
                Revelar Critérios e Gabarito
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#F0F0F5', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: '#0D1321', borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 20,
        flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: 16, fontWeight: 850, letterSpacing: -0.5 }}>
          REVISÃO <span style={{ color: '#EF4444' }}>REQUISITOS</span>
        </div>
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 10, color: '#64748B', marginBottom: 4 }}>
            <span>Questão {currentQ + 1} de {questions.length} (Modelo {model})</span>
            <span>{pct}% concluído</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#EF4444', transition: 'width 0.4s ease' }} />
          </div>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#F5A623', fontWeight: 700 }}>
          ⬡ {score} pts
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>{playerName}</div>
      </div>

      {/* Body Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Side: Question */}
        <div style={{ background: '#0D1321', border: '1px solid rgba(255,255,255,0.06)', padding: '32px', borderRadius: 16 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontFamily: 'monospace', color: catColor, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            <span style={{ width: 16, height: 2, background: catColor }} />
            {q.category}
          </div>

          <div style={{ fontSize: 44, fontWeight: 900, color: 'rgba(255,255,255,0.02)', fontFamily: 'monospace', lineHeight: 1, marginBottom: -15 }}>
            {String(currentQ + 1).padStart(2, '0')}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '20px', borderRadius: 8, color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24, fontStyle: 'italic' }}>
            {q.context}
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.4, marginBottom: 28 }}>
            {q.text}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {q.answers.map((ans, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectAnswer = i === q.correct;
              let border = 'rgba(255,255,255,0.07)';
              let bg = '#070B14';
              let textWeight = '400';

              if (showFeedback) {
                if (isCorrectAnswer) { border = '#10B981'; bg = 'rgba(16,185,129,0.1)'; textWeight = '600'; }
                else if (isSelected) { border = '#EF4444'; bg = 'rgba(239,68,68,0.1)'; }
              } else if (isSelected) {
                border = '#EF4444'; bg = 'rgba(239,68,68,0.05)';
              }

              return (
                <button
                  key={i}
                  disabled={showFeedback}
                  onClick={() => selectAnswer(i)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14, width: '100%',
                    padding: '18px 20px', borderRadius: 10, background: bg, border: `1px solid ${border}`,
                    color: '#CBD5E1', textAlign: 'left', fontSize: '0.95rem', lineHeight: 1.5,
                    cursor: showFeedback ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                    fontWeight: textWeight, opacity: showFeedback && !isCorrectAnswer && !isSelected ? 0.5 : 1
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: showFeedback && isCorrectAnswer ? '#10B981' : '#EF4444', minWidth: 20 }}>{letters[i]}</span>
                  <span>{ans}</span>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div style={{
              background: selectedAnswer === q.correct ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)',
              borderLeft: `4px solid ${selectedAnswer === q.correct ? '#10B981' : '#EF4444'}`,
              padding: '16px 20px', borderRadius: '0 8px 8px 0', color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6,
              marginBottom: 24, animation: 'fadeInUp 0.3s ease'
            }}>
              {q.feedback}
            </div>
          )}

          {showFeedback && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={nextQuestion}
                style={{
                  background: 'transparent', border: '1px solid #EF4444', color: '#EF4444',
                  padding: '12px 36px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: 1,
                  textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444'; }}
              >
                {currentQ + 1 >= questions.length ? 'Ir para Discursiva →' : 'Próxima Questão →'}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Progress minimap */}
          <div style={{ background: '#0D1321', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: 12 }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Minimapa</div>
            <QMap results={qResults} current={currentQ} total={questions.length} />
          </div>

          {/* Badges */}
          <div style={{ background: '#0D1321', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: 12 }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Conquistas</div>
            <BadgesGrid earned={earnedBadges} />
          </div>
        </div>

      </div>

      {/* Points overlay */}
      {pointsFlash && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontFamily: 'monospace', fontSize: 36, fontWeight: 800, color: '#F5A623',
          pointerEvents: 'none', zIndex: 999, animation: 'pointsUp 1s ease forwards'
        }}>{pointsFlash}</div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, background: '#0D1321', border: '1px solid #F5A623',
          borderLeft: '4px solid #F5A623', padding: '14px 20px', zIndex: 1000, maxWidth: 300,
          borderRadius: 4, animation: 'slideInRight 0.3s ease', boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{notification.title}</div>
          <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>{notification.body}</div>
        </div>
      )}
    </div>
  );
}

// ─── RESULT SCREEN ──────────────────────────────────────────────────────────
function getClassification(score) {
  if (score >= 90) return { emoji: '🏆', title: 'EXCELÊNCIA', role: 'Arquiteto de Requisitos', color: '#F5A623', desc: 'Domínio magistral da Engenharia de Requisitos! Você solucionou com excelência as questões situacionais da Avaliação.' };
  if (score >= 75) return { emoji: '⭐', title: 'DISTINÇÃO', role: 'Analista de Negócios Sr.', color: '#9B59B6', desc: 'Desempenho excelente! Seus conhecimentos estão consolidados no nível avançado da engenharia de software.' };
  if (score >= 60) return { emoji: '✅', title: 'APROVADO', role: 'Analista de Sistemas', color: '#2980B9', desc: 'Aprovado! Demonstra compreensão sólida dos tópicos de documentação e gerência.' };
  return { emoji: '🔄', title: 'PRECISA REVISAR', role: 'Estudante de Requisitos', color: '#EF4444', desc: 'Mantenha os estudos! Revise a teoria de rastreabilidade, baselines e reutilização.' };
}

function Result({ playerName, model, data }) {
  const { score, correct, answered, earnedBadges } = data;
  const cls = getClassification(score);
  const earnedList = BADGES.filter(b => earnedBadges.includes(b.id));

  return (
    <div style={{
      minHeight: '100vh', background: '#070B14', color: '#F0F0F5',
      fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '60px 20px', textAlign: 'center'
    }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>{cls.emoji}</div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, letterSpacing: -1.5, color: '#fff', lineHeight: 1 }}>
          {cls.title}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#EF4444', letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>
          SIMULADO CONCLUÍDO (MODELO {model})
        </div>
      </div>

      <div style={{ fontSize: 'clamp(64px, 12vw, 96px)', fontWeight: 900, color: '#EF4444', lineHeight: 1 }}>
        {score}
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B', letterSpacing: 2, marginTop: -10, marginBottom: 32 }}>
        PONTOS DE 100 (NOTA SIMULADO)
      </div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
        {[
          { val: correct, label: 'ACERTOS', col: '#10B981' },
          { val: answered - correct, label: 'ERROS', col: '#EF4444' },
          { val: `5º Período`, label: 'TURMA', col: '#3B82F6' },
          { val: `${((correct/8)*6).toFixed(2)}/6.0`, label: 'PROVA REAL', col: '#F5A623' },
        ].map(item => (
          <div key={item.label} style={{ background: '#0D1321', border: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', borderRadius: 12, minWidth: 110 }}>
            <span style={{ fontSize: 24, fontWeight: 900, display: 'block', color: item.col }}>{item.val}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#64748B', letterSpacing: 0.5 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ background: '#0D1321', border: '1px solid rgba(255,255,255,0.06)', borderTop: `3px solid ${cls.color}`, padding: '28px 36px', borderRadius: 12, maxWidth: 520, width: '100%', marginBottom: 40, textAlign: 'left' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#64748B', letterSpacing: 2, marginBottom: 8 }}>// PERFIL E CLASSIFICAÇÃO</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{cls.role}</div>
        <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>{cls.desc}</p>
      </div>

      {earnedList.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#64748B', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Conquistas Desbloqueadas</div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {earnedList.map(b => (
              <div key={b.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 32 }}>{b.emoji}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#F5A623', letterSpacing: 0.5 }}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => window.location.reload()} style={{
          background: 'linear-gradient(135deg, #EF4444, #C0392B)', color: '#fff', border: 'none',
          fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
          padding: '14px 36px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s'
        }}>↺ Jogar Novamente</button>
        
        <Link to="/fametro/requisitos/revisao/ranking" style={{
          background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
          fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
          padding: '14px 36px', borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          🏆 Ver Placar Geral
        </Link>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function RequisitosRevisaoActivity() {
  const [screen, setScreen] = useState('intro'); // 'intro' | 'quiz' | 'result'
  const [playerName, setPlayerName] = useState('');
  const [model, setModel] = useState('A');
  const [resultData, setResultData] = useState(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  function handleStart(name, selectedModel) {
    setPlayerName(name);
    setModel(selectedModel);
    startTimeRef.current = Date.now();
    setScreen('quiz');
  }

  async function handleFinish(data) {
    setResultData(data);
    setScreen('result');

    // Save to Firestore
    try {
      await addDoc(collection(db, "fametro_ranking"), {
        name: playerName,
        score: data.score,
        duration: Date.now() - startTimeRef.current,
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp(),
        activityId: "requisitos_revisao",
        model: `Modelo ${model}`,
        course: "Sistemas de Informação",
        professor: "Alexsander Farias",
        period: "2026.1"
      });
    } catch (e) {
      console.error("Erro ao salvar resultado da revisão:", e);
    }
  }

  if (screen === 'intro') return <Intro onStart={handleStart} />;
  if (screen === 'quiz') return <Quiz playerName={playerName} model={model} onFinish={handleFinish} />;
  if (screen === 'result') return <Result playerName={playerName} model={model} data={resultData} />;
}
