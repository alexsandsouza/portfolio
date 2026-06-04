import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── DATA MODELO A ────────────────────────────────────────────────────────────
const QUESTIONS_A = [
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Uma corporação global de logística marítima e terrestre, operando a partir do Porto de Manaus para o mundo, está enfrentando uma grave crise na sua plataforma central de roteamento de cargas (SeaRoute). O módulo responsável pelo cálculo de rotas e modais de transporte (fluvial, rodoviário e aéreo) foi desenvolvido inicialmente com uma estrutura rígida, repleta de condicionais aninhadas (if/else) baseadas no tipo de modalidade. Recentemente, a empresa decidiu integrar novas modalidades de transporte sustentável e rotas com veículos autônomos. Toda vez que uma nova regra tarifária ou modalidade de roteamento precisa ser adicionada, os desenvolvedores são forçados a alterar a classe principal do motor de cálculo, gerando alto risco de quebra de funcionalidades já validadas e violando diretamente o princípio de Aberto-Fechado (Open/Closed Principle) do SOLID. O Arquiteto de Software determinou a refatoração imediata deste motor, de forma que os algoritmos de cálculo de rota possam ser encapsulados em classes independentes, permitindo que a plataforma central alterne dinamicamente entre as modalidades de transporte em tempo de execução sem conhecer os detalhes da implementação de cada algoritmo.",
    "text": "Considerando a exigência de encapsular os algoritmos de cálculo de frete e roteamento para que possam ser substituídos ou adicionados de forma transparente, eliminando as estruturas condicionais complexas no motor principal, qual padrão de projeto comportamental deve ser aplicado pela equipe de arquitetura da SeaRoute para sanar este gargalo tecnológico?",
    "answers": [
      "Adotar o padrão Singleton, instanciando o algoritmo de frete na inicialização do sistema para evitar que diferentes rotas entrem em conflito de memória e otimizar o desempenho.",
      "Implementar o padrão Observer, permitindo que o motor de cálculo seja notificado quando um modal de transporte alterar sua rota, reduzindo a necessidade de recálculos sequenciais.",
      "Utilizar o padrão Strategy, definindo uma interface comum para as estratégias de cálculo de rota e encapsulando cada modalidade, permitindo a alternância em tempo de execução.",
      "Empregar o padrão Facade, criando uma interface simplificada que centraliza a lógica condicional em um módulo externo, mantendo o acoplamento estrutural em níveis aceitáveis.",
      "Aplicar o padrão Factory Method, delegando a criação dos objetos de rotas marítimas para que o sistema transfira as decisões de roteamento para as subclasses de transporte."
    ],
    "correct": 2,
    "feedback": "Alternativa C. O padrão Strategy é um padrão comportamental que permite definir uma família de algoritmos, encapsular cada um deles e torná-los intercambiáveis, resolvendo o problema das condicionais rígidas (violação do Open/Closed Principle).",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Uma HealthTech com sede em São Paulo está prestes a lançar no mercado um dispositivo embarcado inovador, voltado para UTIs pediátricas, que analisa continuamente sinais vitais e prevê crises respiratórias utilizando modelos de IA. A equipe de engenharia seguiu rigorosamente os manuais técnicos, garantindo que o software do dispositivo executasse sem falhas de memória, que a comunicação com os biossensores ocorresse em milissegundos e que todo o código fonte estivesse em total conformidade com a especificação original. Durante os ensaios clínicos em um hospital parceiro, no entanto, médicos neonatologistas rejeitaram o uso do equipamento. O motivo apontado não foi travamento do software, mas sim o fato de que a interface de alerta disparava alarmes sonoros com base em métricas fisiológicas padrão de adultos, ignorando as particularidades da fisiologia neonatal, o que gerava um número inaceitável de falsos positivos na UTI, estressando a equipe médica e os pacientes. O CTO da empresa convocou uma reunião de crise para avaliar os processos de qualidade aplicados.",
    "text": "Considerando a distinção fundamental entre as práticas de Verificação e Validação (V&V) na Engenharia de Software, qual afirmativa diagnostica com precisão a falha de processo ocorrida no desenvolvimento do dispositivo médico embarcado para a UTI neonatal?",
    "answers": [
      "A validação foi conduzida adequadamente, visto que os modelos de inteligência artificial operavam de acordo com as métricas técnicas estabelecidas durante a fase de verificação.",
      "O processo de validação apresentou falhas, pois embora o software tenha sido construído de acordo com os requisitos técnicos, ele não atendeu às necessidades do contexto operacional.",
      "A fase de verificação apresentou inconsistências, dado que a arquitetura de banco de dados deveria ter sido adaptada para suportar métricas infantis antes do desenvolvimento.",
      "As etapas de validação e verificação apresentaram divergências técnicas, indicando que a implantação física do software corrompeu a leitura dos biossensores no ambiente hospitalar.",
      "A equipe priorizou a execução dos testes unitários em detrimento das avaliações clínicas, resultando em uma verificação estrutural insuficiente para lidar com pacientes adultos."
    ],
    "correct": 1,
    "feedback": "Alternativa B. A Verificação assegura que o produto está sendo construído corretamente segundo a especificação. A Validação assegura que o produto correto está sendo construído para o usuário final. A equipe falhou na validação, pois o sistema não servia ao propósito clínico neonatal.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Um consórcio aeroespacial está desenvolvendo o software de controle de voo para uma nova geração de drones autônomos de entrega em áreas remotas. A arquitetura do sistema foi projetada em múltiplos submódulos desenvolvidos por equipes distintas: a equipe A construiu o \"Módulo de Navegação GPS\", a equipe B desenvolveu o \"Módulo de Evitação de Colisões (Radar)\" e a equipe C programou o \"Atuador de Motores\". A equipe de Qualidade (QA) garantiu que 100% das funções individuais desses submódulos passassem sem erros por exaustivos testes unitários isolados, utilizando técnicas de caixas-branca (mocks e stubs). No entanto, durante o primeiro voo simulado em ambiente controlado, o drone perdeu a estabilidade e caiu. A análise da caixa preta virtual revelou que os dados formatados em ponto flutuante de 32 bits, emitidos perfeitamente pelo Módulo de Radar, estavam sendo interpretados como inteiros de 16 bits pelo Atuador de Motores, gerando comandos de aceleração caóticos e incompatíveis. O erro só se manifestou quando as peças foram acopladas no ambiente de testes conjuntos.",
    "text": "Frente ao colapso do drone simulado provocado por interpretações divergentes de dados entre submódulos que individualmente funcionavam perfeitamente, qual nível de teste foi negligenciado ou mal executado pela equipe de garantia de qualidade, e qual seria sua principal finalidade neste contexto?",
    "answers": [
      "O Teste de Sistema, cuja finalidade consiste em validar a interface gráfica do controle remoto do drone em relação aos parâmetros de usabilidade definidos no projeto.",
      "O Teste de Unidade, que possui a responsabilidade de garantir que o método de conversão de ponto flutuante retorne valores compatíveis com o módulo de processamento.",
      "O Teste de Aceitação, estruturado para verificar os dados operacionais internos dos motores de acordo com as especificações exigidas pelos analistas de infraestrutura.",
      "O Teste de Regressão, utilizado para garantir que a inserção de novos módulos físicos preserve a integridade energética e a autonomia da bateria durante o voo contínuo.",
      "O Teste de Integração, que tem como objetivo avaliar as interfaces e a comunicação entre módulos individuais que são combinados para funcionar de forma conjunta."
    ],
    "correct": 4,
    "feedback": "Alternativa E. Os testes de integração são focados em descobrir defeitos nas interfaces e nas interações entre componentes integrados. Erros de formatação e passagem de dados entre módulos que funcionam isoladamente são descobertos nesta fase.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Uma Fintech consolidada no mercado financeiro decidiu reformular seu principal motor de processamento de pagamentos via PIX. Anteriormente, os desenvolvedores adotavam uma postura tradicional: programavam longas rotinas de cálculos de taxas de transferência, subiam o código para o servidor, e somente semanas depois a equipe de QA tentava escrever scripts de automação para testar os cenários. Isso gerava imensos atrasos, reescrita profunda de código quando bugs arquiteturais eram descobertos tardiamente, e uma cobertura de testes insatisfatória que causava fraudes. Visando inverter essa lógica, a diretoria de engenharia obrigou toda a equipe a transicionar para o Desenvolvimento Orientado a Testes (TDD). Agora, os engenheiros devem iniciar suas tarefas traduzindo o critério de aceitação negocial em um teste automatizado que falha intencionalmente. Somente após essa falha, eles devem escrever a quantidade mínima de código de produção necessária para que o teste passe, finalizando o ciclo com a refatoração do código aprovado. Apesar de gerar resistência inicial, a prática prometia alinhar melhor a arquitetura ao comportamento esperado.",
    "text": "Levando em consideração o ciclo de vida rigoroso estabelecido pelo Test-Driven Development (TDD) e seu impacto direto na arquitetura de sistemas financeiros, qual afirmativa sintetiza tecnicamente o principal benefício metodológico alcançado pela Fintech ao adotar essa prática?",
    "answers": [
      "O método garante que a construção dos testes seja conduzida por analistas de requisitos, direcionando o código dos desenvolvedores para o desempenho computacional.",
      "A prática promove o design de software guiado pelo comportamento desejado, impulsionando a criação de códigos modulares, testáveis e com alta cobertura desde a concepção.",
      "A técnica substitui a documentação funcional extensa, visto que a escrita de testes prévios resolve as ambiguidades arquiteturais e otimiza a entrega do projeto.",
      "O modelo determina que a refatoração do código deve preceder a implementação dos testes, priorizando a organização da linguagem de programação sobre as regras de negócio.",
      "A principal vantagem consiste na redução das fases de integração contínua, concentrando os esforços de qualidade na etapa de homologação manual após a implantação."
    ],
    "correct": 1,
    "feedback": "Alternativa B. O TDD força o desenvolvedor a pensar no design, interface e requisitos de uma função antes de implementá-la, resultando em um código naturalmente modular, testável e com excelente cobertura de testes automatizados.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "O Sistema Integrado de Compras do Governo (SICG) foi desenvolvido há 18 anos como uma arquitetura monolítica fortemente acoplada. Durante quase duas décadas, o SICG tem sido o motor de processamento de bilhões de reais em licitações públicas. Para acompanhar sucessivas mudanças na legislação de licitações, emendas constitucionais e o advento do pregão eletrônico moderno, milhares de correções pontuais, remendos (patches) emergenciais e integrações não planejadas com novas APIs foram injetados diretamente no código-fonte por dezenas de equipes terceirizadas diferentes. Atualmente, o sistema encontra-se em um estado em que a adição de um simples campo de validação de CNPJ em uma tela de cadastro resulta em falhas críticas e corrupção de dados no módulo financeiro de empenho, que é aparentemente não relacionado. Os diretores de TI constataram que o custo e o tempo para realizar alterações triviais tornaram-se astronômicos, e o sistema parece ter vida própria, deteriorando-se estruturalmente a cada nova release exigida pelos auditores governamentais.",
    "text": "À luz da teoria da evolução e manutenção de software formulada nas clássicas Leis de Lehman, quais duas leis descrevem de maneira inquestionável o fenômeno de degradação estrutural e a necessidade ininterrupta de adaptação enfrentados atualmente pelo Sistema Integrado de Compras do Governo (SICG)?",
    "answers": [
      "A Lei do Crescimento Contínuo e a Lei da Conservação da Familiaridade, que indicam a expansão estrutural do sistema enquanto a equipe preserva as tecnologias originais de base.",
      "A Lei da Complexidade Crescente e a Lei da Mudança Contínua, que apontam a necessidade de adaptação de um sistema do mundo real e a deterioração de sua estrutura caso não haja manutenção.",
      "A Lei da Qualidade Invariável e a Lei da Redução do Esforço, que sugerem a estabilização da arquitetura de sistemas legados após longos períodos de operação no ambiente governamental.",
      "A Lei da Autogestão de Código e a Lei da Mudança Estática, que demonstram a resistência natural de sistemas antigos à inserção de novas regras de negócio para preservar a estabilidade.",
      "A Lei do Declínio de Uso e a Lei da Conservação Organizacional, que evidenciam a necessidade de descontinuação de plataformas obsoletas para viabilizar novas licitações públicas."
    ],
    "correct": 1,
    "feedback": "Alternativa B. A 1ª Lei (Mudança Contínua) afirma que um sistema do mundo real precisa mudar continuamente para continuar útil. A 2ª Lei (Complexidade Crescente) afirma que, à medida que o sistema evolui, sua complexidade estrutural cresce e sua estrutura se deteriora, a menos que haja esforço proativo de refatoração.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "A divisão de engenharia de software de uma grande operadora de telecomunicações latino-americana reportou ao comitê executivo as atividades executadas na principal plataforma de tarifação de celulares (Billing) durante o segundo trimestre do ano. Foram realizados três grandes pacotes de trabalho: \n1) Modificação de bibliotecas internas de criptografia e ajustes profundos nos algoritmos de banco de dados para melhorar a performance das consultas noturnas de auditoria, tornando a emissão de faturas 40% mais rápida. \n2) Modificação de 20 mil linhas de código para que o sistema de faturamento funcionasse nativamente nas novas especificações das antenas 5G Standalone recentemente leiloadas pela Anatel, migrando o ambiente do sistema operacional legado para contêineres Linux. \n3) Correção emergencial no módulo de roaming internacional que, devido a um erro lógico de ponteiros em C++, estava calculando incorretamente os valores de dados móveis em viagens para a Europa.",
    "text": "Considerando a teoria clássica de Engenharia de Software sobre manutenção de sistemas, como os três pacotes de trabalho realizados na plataforma de tarifação de celulares devem ser tecnicamente classificados e categorizados, respectivamente (1, 2 e 3)?",
    "answers": [
      "1 - Manutenção Perfectiva; 2 - Manutenção Adaptativa; 3 - Manutenção Corretiva.",
      "1 - Manutenção Adaptativa; 2 - Manutenção Perfectiva; 3 - Manutenção Preventiva.",
      "1 - Manutenção Corretiva; 2 - Manutenção Preventiva; 3 - Manutenção Adaptativa.",
      "1 - Manutenção Perfectiva; 2 - Manutenção Corretiva; 3 - Manutenção Adaptativa.",
      "1 - Manutenção Preventiva; 2 - Manutenção Adaptativa; 3 - Manutenção Perfectiva."
    ],
    "correct": 0,
    "feedback": "Alternativa A. 1) Otimização estrutural sem mudança de funcionalidade aparente é Perfectiva. 2) Alteração para suportar novo ambiente (5G/Linux) é Adaptativa. 3) Correção de erro lógico (cálculo de roaming) é Corretiva.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Uma mega-plataforma de streaming de vídeos sul-americana tem o desafio de disponibilizar atualizações de interface e novos algoritmos de recomendação para seus 50 milhões de usuários diariamente. Há dois anos, a empresa possuía um processo doloroso onde os desenvolvedores mesclavam seus códigos manualmente a cada fim de mês e repassavam um pacote monolítico gigantesco para a equipe de Infraestrutura de TI (Operações) realizar a implantação de madrugada. Isso resultava em \"inferno de integração\", dezenas de horas de indisponibilidade do serviço e conflitos de código irresolvíveis. Como solução estratégica, a corporação adotou ferramentas avançadas (como Jenkins, GitLab CI e Kubernetes) para implementar o conceito de Integração Contínua (CI) e Entrega Contínua (CD). Agora, dezenas de vezes por dia, o código que um desenvolvedor produz é automaticamente mesclado na branch principal, compilações são disparadas, milhares de testes de regressão automatizados executam em minutos e o pacote é deixado pronto para implantação na nuvem mediante a aprovação do gerente de release.",
    "text": "Considerando os princípios e os objetivos das práticas de CI/CD (Continuous Integration / Continuous Delivery) no fluxo moderno da Engenharia de Software, qual alternativa define corretamente o impacto fundamental que essas práticas trouxeram para o desenvolvimento e a estabilidade da plataforma de streaming?",
    "answers": [
      "Substituíram a necessidade de validação manual contínua, permitindo que a integração de código seja implantada de forma direta para acelerar a chegada do software no mercado.",
      "Reduziram o risco de falhas tardias através da mescla frequente de pequenos incrementos e automação de testes, estabelecendo um processo confiável de geração de entregáveis.",
      "Tornaram a base de código resistente a falhas arquiteturais, visto que a entrega contínua ajusta automaticamente os scripts de banco de dados durante as implantações noturnas.",
      "Promoveram o desenvolvimento em ramificações isoladas por longos períodos, preservando as funcionalidades até o lançamento final unificado para evitar conflitos de versão.",
      "Estruturaram o fluxo de desenvolvimento em fases sequenciais bem definidas, possibilitando que as ferramentas gerem documentação técnica prévia antes de cada compilação."
    ],
    "correct": 1,
    "feedback": "Alternativa B. CI/CD baseia-se na integração e entrega frequentes, minimizando problemas de união de códigos extensos e assegurando que o sistema esteja constantemente em um estado testado e pronto para implantação.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "A Secretaria da Fazenda de um importante estado brasileiro possui um Sistema de Arrecadação de Impostos (SAI) operando continuamente há três décadas. O núcleo do sistema é executado em um hardware mainframe obsoleto, programado quase inteiramente em COBOL. Toda a economia estadual, pagamento de servidores e repasses de ICMS para prefeituras dependem diretamente da precisão inabalável desse sistema, que possui regras de cálculo tributário extremamente complexas, pouco documentadas e que os poucos programadores originais vivos guardam apenas na memória. O Secretário da Fazenda alertou que os custos de licenciamento do hardware subiram 300% e o risco operacional é extremo. Contudo, devido à criticidade do sistema (o estado quebraria em dois dias se o sistema ficasse fora do ar) e ao valor de negócio altíssimo que as regras fiscais possuem, substituir o sistema de uma vez através de um modelo \"Big Bang\" (desliga o velho, liga o novo num fim de semana) foi descartado pelos consultores internacionais como uma atitude irresponsável e de altíssimo risco.",
    "text": "Diante do cenário complexo do sistema de arrecadação legado (alto valor para o negócio, tecnologia obsoleta e alto risco de substituição abrupta), qual estratégia de modernização da engenharia de software é recomendada para mitigar o impacto de migração e proteger a estabilidade financeira do estado?",
    "answers": [
      "Desativar a infraestrutura em COBOL em curto prazo, direcionando a equipe de desenvolvimento para a construção de uma plataforma em microsserviços sob nova arquitetura de nuvem.",
      "Congelar a versão atual do sistema no mainframe e absorver os custos de licenciamento, abdicando de inovações tecnológicas para evitar interrupções nos processos de arrecadação.",
      "Executar a modernização gradual da arquitetura por meio de encapsulamento do núcleo legado com APIs modernas, substituindo os módulos iterativamente sem desativar a operação.",
      "Migrar a responsabilidade de processamento tributário para sistemas distribuídos de menor complexidade operados pelos usuários finais, diminuindo a dependência central do mainframe.",
      "Direcionar os investimentos para a manutenção perfectiva na interface de operação do mainframe, promovendo uma melhor experiência visual sem modificar a estrutura lógica subjacente."
    ],
    "correct": 2,
    "feedback": "Alternativa C. A abordagem recomendada para sistemas legados críticos de alto risco é a modernização iterativa, utilizando técnicas como o Encapsulamento (Wrapping) para substituir funcionalidades passo a passo de forma segura.",
    "points": 12.5
  }
];

// ─── DATA MODELO B ────────────────────────────────────────────────────────────
const QUESTIONS_B = [
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "A \"GovTech Brasil\", uma startup de grande porte, foi contratada para desenvolver o portal nacional de serviços ao cidadão, que deve rodar simultaneamente em web, terminais de autoatendimento e aplicativos móveis. O contrato estipula uma regra rigorosa de acessibilidade governamental: dependendo do perfil de visão do usuário registrado no banco de dados (Visão Normal, Visão Subnormal ou Daltonismo Severo), todo o portal deve instanciar dinamicamente e instantaneamente uma \"família\" completa de componentes de interface gráfica correspondentes (botões de alto contraste, menus com texturas específicas, painéis de leitura expandida). A equipe inicial cometeu o erro de encher o código com centenas de instruções \"if/else\" para verificar o perfil de cada usuário toda vez que um botão ou barra de rolagem era instanciado na tela. A arquitetura colapsou por extrema complexidade visual e acoplamento. O líder técnico exigiu que o código fosse reconstruído para que o sistema pudesse solicitar uma \"fábrica\" de componentes baseada no perfil do usuário, e que essa fábrica fosse responsável por garantir que todos os componentes da interface instanciados pertencessem à mesma família visual compatível, sem misturar componentes de alto contraste com componentes normais acidentalmente.",
    "text": "Diante da necessidade imperativa de criar famílias inteiras de componentes gráficos compatíveis entre si, isolando a lógica de criação e evitando misturar estilos diferentes em tempo de execução, qual padrão de projeto criacional deve ser adotado pela arquitetura do portal gov.br?",
    "answers": [
      "Padrão Decorator, atribuindo comportamentos dinâmicos de contraste visual a instâncias isoladas sem modificar a estrutura interna da hierarquia das classes de componentes.",
      "Padrão Abstract Factory, oferecendo uma interface central para instanciar famílias de objetos gráficos inter-relacionados sem explicitar suas classes concretas no código cliente.",
      "Padrão Command, encapsulando as requisições de renderização de tela em objetos independentes para facilitar a execução de operações reversíveis nas opções de acessibilidade.",
      "Padrão Builder, centralizando a construção em etapas de um componente de interface complexo, independentemente das variações visuais exigidas pelos perfis de usuário cadastrados.",
      "Padrão Iterator, processando sequencialmente as matrizes de cor em coleções de componentes gráficos para definir o contraste adequado antes da montagem da interface do cidadão."
    ],
    "correct": 1,
    "feedback": "Alternativa B. O padrão Abstract Factory permite a criação de famílias de objetos inter-relacionados ou dependentes sem especificar suas classes concretas, ideal para gerar instâncias de componentes gráficos garantindo a consistência visual do conjunto.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Uma companhia de tecnologia de precisão agrícola no Centro-Oeste lançou uma linha de tratores pulverizadores totalmente autônomos. A equipe de engenharia de software elaborou extensos manuais técnicos definindo que a latência de comunicação com o satélite não deveria exceder 50 milissegundos, que os motores de direção respondessem em 200 milissegundos e que a leitura do trajeto por GPS usasse algoritmos Dijkstra com 100% de precisão. O time de Qualidade (QA) aplicou simulações virtuais intensas, atestando que todas as métricas técnicas da especificação foram integralmente atendidas. Contudo, ao ser colocado nas fazendas reais de soja, os tratores demonstraram um comportamento desastroso: eles seguiam as rotas GPS com precisão milimétrica, mas não possuíam capacidade de reconhecer que o solo estava excessivamente encharcado após chuvas fortes. O sistema, apesar de tecnicamente irretocável segundo a especificação, afundava os tratores na lama e destruía a plantação, causando milhões em prejuízo aos agricultores, revelando um distanciamento grave das realidades da agricultura prática.",
    "text": "À luz da literatura de Engenharia de Software focada em Qualidade, a falha do trator ao destruir a plantação (mesmo atendendo todas as rígidas especificações do satélite e GPS) reflete diretamente um fracasso em qual atividade fundamental e por qual motivo conceitual?",
    "answers": [
      "Falha na etapa de Verificação, indicando que a capacidade de processamento do hardware embarcado foi superestimada durante as simulações em ambiente de laboratório controlado.",
      "Falha na integração entre Verificação e Manutenção Preventiva, sugerindo que os cenários de teste não contemplaram bibliotecas de geolocalização e reconhecimento climático.",
      "Falha na fase de Validação, pois o software atendeu corretamente às especificações técnicas definidas, mas não solucionou a necessidade real de uso no ambiente de operação agrícola.",
      "Falha na Modelagem de Requisitos, demonstrando que o algoritmo matemático de roteamento escolhido pela engenharia é estruturalmente ineficiente para as dimensões das fazendas.",
      "Falha na certificação de maturidade do processo, forçando a companhia a revisar os manuais técnicos de hardware antes de prosseguir com a implementação dos sensores autônomos."
    ],
    "correct": 2,
    "feedback": "Alternativa C. A equipe obteve sucesso na Verificação (fazer o produto certo de acordo com as especificações matemáticas), mas fracassou na Validação (fazer o produto correto que resolve o problema no contexto de uso real das fazendas).",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "O principal banco cooperativo do país decidiu lançar o \"BankApp 3.0\", um aplicativo móvel voltado para concessão instantânea de crédito rural. Durante o ciclo de desenvolvimento, a equipe técnica realizou exaustivos testes de unidade para os cálculos de juros. Em seguida, acoplaram os bancos de dados locais aos serviços de mensageria e executaram testes de integração, comprovando que as conexões não deixavam transações financeiras perdidas na rede. Com 100% dos relatórios de engenharia positivos, a diretoria liberou o aplicativo para um comitê fechado de gerentes das agências rurais antes do lançamento para o público. Após três dias de uso, o comitê reprovou completamente a entrega. Eles relataram que, apesar de não existirem bugs matemáticos, a interface era tão confusa, a jornada de clique era tão exaustiva e os jargões financeiros eram tão rebuscados, que os produtores rurais jamais conseguiriam aprovar um empréstimo sozinhos. A liberação teve que ser abortada.",
    "text": "O relato do colapso no lançamento do BankApp 3.0 para as agências rurais evidencia a ausência ou má condução de um nível específico de teste, que deveria ter garantido o alinhamento com a expectativa de quem vai consumir o produto. Qual foi esse nível de teste faltante?",
    "answers": [
      "O Teste de Desempenho, cuja execução garante que múltiplos usuários consigam acessar o aplicativo simultaneamente sem comprometer a estabilidade dos servidores da instituição.",
      "O Teste de Regressão, elaborado para assegurar que a introdução de novos módulos financeiros não comprometa as funcionalidades consolidadas nas versões anteriores do aplicativo.",
      "O Teste de Aceitação, voltado para a perspectiva do usuário final e projetado para verificar a usabilidade e a satisfação no contexto operacional real de negócios da aplicação.",
      "O Teste Estrutural, focado em expor vulnerabilidades internas nas rotinas de cálculo financeiro que não foram devidamente avaliadas durante as fases iniciais de desenvolvimento.",
      "O Teste de Integração, encarregado de validar o fluxo de informações entre o módulo de crédito e as bases de dados corporativas antes da disponibilização final do sistema."
    ],
    "correct": 2,
    "feedback": "Alternativa C. Os Testes de Aceitação são validados pelo cliente ou especialistas de domínio, focando em usabilidade, jornada do usuário e adequação do sistema ao uso cotidiano, atributos que falharam nesta entrega.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "A gerência de um consórcio aeroespacial europeu analisou o histórico de falhas críticas de seus softwares satelitais da década passada. Os relatórios indicaram que a esmagadora maioria dos defeitos inseridos nos algoritmos orbitais eram decorrentes da prática dos programadores de escrever rotinas densas de código e delegar, apenas ao final do trimestre, a confecção dos scripts de verificação para uma equipe terceirizada. Os códigos eram monolíticos e praticamente impossíveis de serem testados isoladamente (não-testáveis). Para a nova geração de satélites, a direção exigiu a adoção estrita do Desenvolvimento Orientado a Testes (TDD). Essa exigência determinou que os engenheiros mudassem sua cultura de trabalho diária, implementando um ciclo onde a automação falha deve obrigatoriamente preceder a codificação lógica, mudando substancialmente a arquitetura estrutural do sistema em direção a microsserviços altamente isolados.",
    "text": "Diante do imperativo da mudança de cultura do consórcio aeroespacial para a técnica TDD (Test-Driven Development), qual afirmação reflete de forma fidedigna a principal vantagem de engenharia estrutural proporcionada por essa inversão da ordem de codificação?",
    "answers": [
      "A transferência da responsabilidade de testes para os analistas de negócios, garantindo que os requisitos operacionais determinem as regras de infraestrutura e a alocação de servidores.",
      "A centralização dos esforços técnicos na elaboração da documentação, visto que códigos validados por testes automatizados dispensam análises estruturais por parte da equipe.",
      "O estímulo à concepção de códigos modulares, desacoplados e estruturados para serem testáveis, estabelecendo o comportamento esperado como base do design da arquitetura.",
      "A restrição das práticas de refatoração em módulos legados, assegurando que componentes previamente homologados não sofram alterações estruturais durante novas iterações.",
      "A otimização das etapas de integração de código, assegurando a confiabilidade das entregas sem a necessidade de manter esteiras complexas de automação em ambientes de produção."
    ],
    "correct": 2,
    "feedback": "Alternativa C. O TDD (escrever testes antes do código) força a equipe a projetar e pensar na interface de comunicação e na testabilidade dos componentes desde o princípio, o que leva à adoção de arquiteturas altamente coesas e desacopladas.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "O \"SigaEDU\", um sistema governamental de gestão de universidades estaduais, foi desenvolvido em 2010 utilizando arquiteturas centralizadas de cliente-servidor para cadastrar diplomas impressos e históricos escolares de papel. Há mais de sete anos, o departamento estadual de TI proíbe a implementação de novas ferramentas no sistema, congelando seu escopo e apenas corrigindo bugs eventuais. Contudo, as novas diretrizes do Ministério da Educação (MEC) exigem que todas as universidades suportem ensino a distância, emissão de diplomas digitais em blockchain e inteligência artificial para detecção de evasão estudantil. Devido à paralisação do desenvolvimento e congelamento das tecnologias antigas do \"SigaEDU\", diversas pró-reitorias passaram a adquirir softwares paralelos não integrados e planilhas eletrônicas na nuvem para suprir suas necessidades emergenciais, tornando o sistema antigo ignorado e obsoleto perante os reitores.",
    "text": "Com base nas clássicas Leis de Lehman referentes à Evolução e Dinâmica de Sistemas de Software, qual lei fundamental descreve e explica o fenômeno de obsolescência tecnológica e o distanciamento das demandas sofridos de maneira sistêmica pelo \"SigaEDU\"?",
    "answers": [
      "A Lei do Crescimento Contínuo, que descreve a tendência das aplicações governamentais de expandir seu consumo de hardware até inviabilizar a manutenção da arquitetura original.",
      "A Lei da Complexidade Decrescente, que associa a paralisação de novos desenvolvimentos à estabilização do código fonte e à redução progressiva das falhas estruturais.",
      "A Lei da Qualidade em Declínio, que relaciona o congelamento das atualizações tecnológicas à instabilidade das rotinas internas de banco de dados após ciclos prolongados.",
      "A Lei da Mudança Contínua, que estabelece que um software em operação no mundo real precisa de adaptações constantes ou perderá a sua utilidade no ambiente em que está inserido.",
      "A Lei da Estabilidade Organizacional, que condiciona a durabilidade dos sistemas à rotatividade das equipes de suporte responsáveis pelas implementações de novas regulamentações."
    ],
    "correct": 3,
    "feedback": "Alternativa D. A Primeira Lei de Lehman (Lei da Mudança Contínua) declara que um sistema do mundo real deve sofrer mudanças contínuas ou se tornará progressivamente menos útil e menos satisfatório nesse ambiente. O congelamento do sistema SigaEDU gerou o seu abandono.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "O \"SysSaúde\", um ecossistema de software operado por um conglomerado de hospitais da rede privada, passou por uma série de intensas intervenções técnicas executadas pela sua equipe de engenharia em resposta à transição da empresa. Nas documentações oficiais da área de gerência de TI, foram mapeados rigorosamente três pacotes de alterações durante o semestre:\n1) Inclusão de um novo protocolo de comunicação HL7 v3 para permitir que o sistema continuasse funcionando nas novas versões de aparelhos de ressonância magnética adquiridos recentemente do exterior.\n2) Alteração radical nos algoritmos de indexação do banco de dados relacional e compressão de logs para otimizar drasticamente a velocidade de busca pelo histórico de cirurgias.\n3) Reparo emergencial no módulo de faturamento UTI, onde uma variável inteira estourou o limite e estava calculando o valor negativo para medicamentos de alto custo.",
    "text": "Segundo os princípios fundamentais e a categorização internacional aceita para os Tipos de Manutenção de Software (Corretiva, Adaptativa e Perfectiva), como se classificam técnica e sucessivamente as intervenções 1, 2 e 3 realizadas pela equipe no \"SysSaúde\"?",
    "answers": [
      "1 - Corretiva; 2 - Perfectiva; 3 - Adaptativa.",
      "1 - Adaptativa; 2 - Corretiva; 3 - Perfectiva.",
      "1 - Perfectiva; 2 - Adaptativa; 3 - Corretiva.",
      "1 - Adaptativa; 2 - Perfectiva; 3 - Corretiva.",
      "1 - Preventiva; 2 - Corretiva; 3 - Perfectiva."
    ],
    "correct": 3,
    "feedback": "Alternativa D. 1) O novo protocolo para adequação a um hardware externo caracteriza manutenção Adaptativa. 2) A otimização interna de velocidade sem alterar funcionalidades é manutenção Perfectiva. 3) O reparo de falhas em produção consiste em manutenção Corretiva.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "O \"Banco Digital NuMoney\" atingiu a marca de 20 milhões de clientes e lida com milhares de requisições de transferências a cada segundo. Nos primórdios da empresa, os lançamentos de novas versões do aplicativo ocorriam a cada dois meses, e os desenvolvedores passavam noites inteiras integrando ramos paralelos de código, o que frequentemente resultava em sistemas inoperantes na manhã seguinte e exigia \"rollbacks\" drásticos (voltar à versão anterior). Atualmente, a empresa adotou práticas rigorosas de Engenharia de Lançamento (Release Engineering) através de CI/CD (Integração e Entrega Contínuas). Dezenas de vezes ao dia, pequenos pacotes de código são integrados, passam por scripts de teste automatizados e são enfileirados em contêineres Docker prontos para implantação na nuvem sem impacto negativo para os usuários.",
    "text": "Considerando os princípios e os objetivos das práticas de CI/CD (Continuous Integration / Continuous Delivery) no fluxo moderno da Engenharia de Software, qual alternativa define corretamente o impacto fundamental que essas práticas trouxeram para o desenvolvimento e a estabilidade da plataforma financeira?",
    "answers": [
      "Substituíram a função dos testadores por validações sistêmicas, permitindo a implantação de módulos financeiros sem etapas de homologação para garantir a celeridade do banco.",
      "Mitigaram o risco de conflitos de código ao integrar pequenos pacotes de forma frequente com testes automatizados, consolidando um fluxo confiável de implantação em produção.",
      "Eliminaram a necessidade de refatoração arquitetural, uma vez que as plataformas automatizadas corrigem discrepâncias estruturais diretamente no repositório de versão principal.",
      "Incentivaram o isolamento das branches de desenvolvimento, protegendo as entregas críticas até o final do ciclo semestral para evitar instabilidades na plataforma de faturamento.",
      "Formalizaram o fluxo de trabalho das equipes ágeis, exigindo a elaboração de documentação sistêmica rigorosa antes da aprovação de qualquer versão candidata a lançamento."
    ],
    "correct": 1,
    "feedback": "Alternativa B. As práticas de CI/CD focam na integração contínua de pequenos incrementos de código validados por testes automáticos, reduzindo significativamente os \"infernos de integração\" e tornando os processos de release previsíveis e seguros.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "O sistema central de agendamento de uma grande rede pública de hospitais opera através de uma arquitetura legada desenvolvida em Delphi e conectada a um banco de dados antiquado, operando em servidores locais cuja manutenção se tornou insustentável. Essa aplicação gerencia o agendamento de mais de cem mil consultas mensais e o histórico médico vitalício dos pacientes. O governo aprovou o orçamento para atualizar todo o sistema para a nuvem usando uma arquitetura baseada em microsserviços. Especialistas apontaram que o risco de realizar um lançamento da nova plataforma de uma única vez (estratégia Big Bang) é inaceitável, pois qualquer falha técnica na sincronização de dados poderia paralisar as alas de emergência dezenas de hospitais simultaneamente.",
    "text": "Diante da criticidade da modernização do sistema de saúde legado, qual estratégia evolutiva de software é recomendada para atenuar o risco de falhas operacionais sistêmicas durante a fase de transição das arquiteturas?",
    "answers": [
      "Realizar o desligamento completo da plataforma COBOL em um único final de semana, transferindo a operação imediatamente para o novo ambiente em nuvem sob contingência.",
      "Suspender novos investimentos na infraestrutura de mainframe, direcionando os recursos exclusivamente para a capacitação dos auditores no uso das ferramentas tecnológicas atuais.",
      "Conduzir a modernização progressiva da arquitetura através do encapsulamento em APIs, substituindo os componentes legados de forma gradual sem paralisar a atividade governamental.",
      "Descentralizar as regras de negócio complexas para sistemas periféricos gerenciados pelos contribuintes, minimizando a carga de processamento na infraestrutura legada principal.",
      "Focar os esforços de engenharia na manutenção perfectiva da interface gráfica dos terminais, otimizando a usabilidade para os operadores sem alterar a arquitetura do mainframe."
    ],
    "correct": 2,
    "feedback": "Alternativa C. A abordagem mais sensata para sistemas críticos e legados de alta disponibilidade é a modernização iterativa e o encapsulamento (wrapping) do núcleo, realizando a migração e implantação gradual em substituição à arriscada estratégia Big Bang.",
    "points": 12.5
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
const STUDY_CASE_A = {};

const STUDY_CASE_B = {};

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
    <div className="req-intro-container" style={{
      minHeight: '100vh', background: '#070B14', color: '#F0F0F5',
      fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
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
          Eng. Software e <span style={{ background: 'linear-gradient(135deg, #EF4444 0%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Projetos</span>
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
            <div className="req-model-btns" style={{ display: 'flex', gap: 10 }}>
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
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0', color: '#fff' }}>{studyCase.title}</h2>
            </div>
            <div style={{ fontSize: 13, background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '6px 12px', borderRadius: 20, fontWeight: 700, fontFamily: 'monospace' }}>
              Acertos Objetivas: {correct} / {questions.length} ({score} pts)
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 20, borderRadius: 10, fontSize: 14, color: '#CBD5E1', lineHeight: 1.6, maxHeight: 240, overflowY: 'auto', marginBottom: 24 }}>
            <h4 style={{ color: '#fff', marginTop: 0, marginBottom: 8, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Contexto e Estudo de Caso</h4>
            {studyCase.context.split('\n\n').map((p, idx) => (
              <p key={idx} style={{ marginBottom: 12, color: '#CBD5E1' }}>{p}</p>
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
            <div className="req-feedback-box" style={{ marginTop: 24, animation: 'fadeIn 0.4s ease' }}>
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
          REVISÃO <span style={{ color: '#EF4444' }}>ENG. SOFTWARE</span>
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
      <div className="req-grid req-body-padding" style={{ maxWidth: 1200, margin: '0 auto' }}>
        
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
                  className="req-answer-btn"
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
        <div className="req-minimap-side" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

      <div className="req-result-grid" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
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
        
        <Link to="/fametro/eng-software/revisao/ranking" style={{
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
export default function EngSoftwareRevisaoActivity() {
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
        activityId: "engsoftware_revisao",
        model: `Modelo ${model}`,
        course: "Sistemas de Informação",
        professor: "Alexsander Farias",
        period: "2026.1"
      });
    } catch (e) {
      console.error("Erro ao salvar resultado da revisão:", e);
    }
  }

  return (
    <>
      <style>{`
        .req-grid { display: grid; grid-template-columns: 1fr 280px; gap: 32px; align-items: start; }
        .req-body-padding { padding: 32px 24px; }
        .req-intro-container { padding: 120px 20px; }
        @media (max-width: 900px) {
          .req-grid { grid-template-columns: 1fr; }
          .req-minimap-side { order: -1; margin-bottom: 8px; }
        }
        @media (max-width: 600px) {
          .req-intro-container { padding: 60px 20px; }
          .req-model-btns { flex-direction: column; }
          .req-result-grid { flex-direction: column; width: 100%; }
          .req-result-grid > div { width: 100%; }
          .req-body-padding { padding: 24px 16px; }
        }
        .req-answer-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(255,255,255,0.15) !important;
        }
      `}</style>
      {screen === 'intro' && <Intro onStart={handleStart} />}
      {screen === 'quiz' && <Quiz playerName={playerName} model={model} onFinish={handleFinish} />}
      {screen === 'result' && <Result playerName={playerName} model={model} data={resultData} />}
    </>
  );
}
