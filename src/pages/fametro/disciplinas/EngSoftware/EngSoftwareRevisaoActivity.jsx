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
      "Adotar o padrão Singleton, instanciando cada algoritmo de frete uma única vez na inicialização do sistema, evitando que diferentes rotas entrem em conflito de memória e garantindo o desempenho.",
      "Implementar o padrão Observer, permitindo que o motor de cálculo seja notificado passivamente sempre que um navio ou caminhão alterar sua rota, sem necessidade de calcular o frete ativamente.",
      "Utilizar o padrão Strategy, definindo uma interface comum para todas as estratégias de cálculo de rota e encapsulando cada modalidade em uma classe concreta, permitindo a injeção e alternância em tempo de execução.",
      "Empregar o padrão Facade, criando uma interface simplificada que esconda a lógica dos \"ifs/elses\" dentro de um módulo externo, mantendo o acoplamento original, mas melhorando a legibilidade do código.",
      "Aplicar o padrão Factory Method, focando estritamente na criação dos objetos de rotas marítimas para que o sistema delegue as decisões de navegação para as subclasses de transporte fluvial."
    ],
    "correct": 2,
    "feedback": "Alternativa C. A alternativa correta é a C, pois o padrão Strategy (Estratégia) é um padrão comportamental que permite definir uma família de algoritmos, encapsular cada um deles e torná-los intercambiáveis. O Strategy permite que o algoritmo varie independentemente dos clientes que o utilizam, resolvendo perfeitamente o problema das condicionais rígidas (violação do Open/Closed Principle) ao permitir a alternância de modais de transporte em tempo de execução. As demais alternativas estão incorretas: A) Singleton foca em instância única, não em alternância de algoritmos; B) Observer é para notificações de estado (publish/subscribe); D) Facade apenas simplifica uma interface complexa, mas não resolve o acoplamento e a extensão dinâmica dos algoritmos; E) Factory Method é um padrão criacional focado em como os objetos são instanciados, e não no encapsulamento e alternância de comportamentos/algoritmos de roteamento em tempo de execução.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Uma HealthTech com sede em São Paulo está prestes a lançar no mercado um dispositivo embarcado inovador, voltado para UTIs pediátricas, que analisa continuamente sinais vitais e prevê crises respiratórias utilizando modelos de IA. A equipe de engenharia seguiu rigorosamente os manuais técnicos, garantindo que o software do dispositivo executasse sem falhas de memória, que a comunicação com os biossensores ocorresse em milissegundos e que todo o código fonte estivesse em total conformidade com a especificação original. Durante os ensaios clínicos em um hospital parceiro, no entanto, médicos neonatologistas rejeitaram o uso do equipamento. O motivo apontado não foi travamento do software, mas sim o fato de que a interface de alerta disparava alarmes sonoros com base em métricas fisiológicas padrão de adultos, ignorando as particularidades da fisiologia neonatal, o que gerava um número inaceitável de falsos positivos na UTI, estressando a equipe médica e os pacientes. O CTO da empresa convocou uma reunião de crise para avaliar os processos de qualidade aplicados.",
    "text": "Considerando a distinção fundamental entre as práticas de Verificação e Validação (V&V) na Engenharia de Software, qual afirmativa diagnostica com precisão a falha de processo ocorrida no desenvolvimento do dispositivo médico embarcado para a UTI neonatal?",
    "answers": [
      "A equipe obteve sucesso absoluto na validação, pois os modelos de IA e biossensores funcionavam conforme a especificação técnica, mas falhou na verificação ao negligenciar testes de intrusão e segurança cibernética.",
      "O processo de validação foi ignorado ou mal executado, uma vez que, apesar do software ter sido construído corretamente segundo os requisitos técnicos (verificação bem-sucedida), ele não atendeu às reais necessidades operacionais do usuário final em seu ambiente de uso (os médicos neonatologistas).",
      "Houve uma falha exclusiva na fase de verificação, dado que os desenvolvedores deveriam ter alterado a arquitetura de banco de dados para suportar os sinais vitais infantis antes mesmo de consultar a equipe médica.",
      "As atividades de verificação e validação falharam simultaneamente, visto que a ocorrência de falsos positivos indica que o código-fonte foi corrompido durante a implantação física no hospital.",
      "A validação foi realizada corretamente pela equipe de engenharia antes dos ensaios clínicos, mas a falha se deu porque a técnica de testes unitários automatizados não era robusta o suficiente para abranger o padrão de adultos."
    ],
    "correct": 1,
    "feedback": "Alternativa B. A alternativa correta é a B. A Verificação responde à pergunta \"Estamos construindo o produto corretamente?\" (aderência às especificações e ausência de bugs no código), o que a equipe fez bem. Já a Validação responde a \"Estamos construindo o produto correto?\" (atendimento das necessidades reais do usuário e adequação ao contexto de uso). A equipe falhou na validação, pois o sistema construído não servia ao propósito clínico neonatal. As demais são incorretas: A) inverte os conceitos e introduz segurança sem contexto; C) aponta falha de verificação quando o erro foi de requisito de negócio/validação; D) afirma que ambas falharam e atribui a falha de negócio a um código corrompido; E) confunde validação de negócio com a execução de testes unitários técnicos (que compõem a verificação).",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Um consórcio aeroespacial está desenvolvendo o software de controle de voo para uma nova geração de drones autônomos de entrega em áreas remotas. A arquitetura do sistema foi projetada em múltiplos submódulos desenvolvidos por equipes distintas: a equipe A construiu o \"Módulo de Navegação GPS\", a equipe B desenvolveu o \"Módulo de Evitação de Colisões (Radar)\" e a equipe C programou o \"Atuador de Motores\". A equipe de Qualidade (QA) garantiu que 100% das funções individuais desses submódulos passassem sem erros por exaustivos testes unitários isolados, utilizando técnicas de caixas-branca (mocks e stubs). No entanto, durante o primeiro voo simulado em ambiente controlado, o drone perdeu a estabilidade e caiu. A análise da caixa preta virtual revelou que os dados formatados em ponto flutuante de 32 bits, emitidos perfeitamente pelo Módulo de Radar, estavam sendo interpretados como inteiros de 16 bits pelo Atuador de Motores, gerando comandos de aceleração caóticos e incompatíveis. O erro só se manifestou quando as peças foram acopladas no ambiente de testes conjuntos.",
    "text": "Frente ao colapso do drone simulado provocado por interpretações divergentes de dados entre submódulos que individualmente funcionavam perfeitamente, qual nível de teste foi negligenciado ou mal executado pela equipe de garantia de qualidade, e qual seria sua principal finalidade neste contexto?",
    "answers": [
      "O Teste de Sistema, cuja finalidade era validar exclusivamente a interface do usuário do controle remoto do drone, ignorando a comunicação entre os componentes internos.",
      "O Teste de Unidade, que deveria ter garantido que o método de conversão de ponto flutuante dentro do Módulo de Radar nunca retornasse um valor incompatível.",
      "O Teste de Aceitação, cuja responsabilidade técnica é verificar a estrutura de dados interna dos motores sem qualquer envolvimento dos clientes ou usuários finais.",
      "O Teste de Regressão, essencial para garantir que a inserção de novos componentes físicos não diminuísse o tempo de duração da bateria do drone.",
      "O Teste de Integração, que possui como objetivo primordial avaliar o comportamento, as interfaces e a comunicação entre os módulos ou componentes que, mesmo isoladamente corretos, são combinados para funcionar em conjunto."
    ],
    "correct": 4,
    "feedback": "Alternativa E. A alternativa correta é a E. Os testes de integração são executados exatamente após os testes unitários e têm como objetivo descobrir defeitos nas interfaces e nas interações entre componentes ou sistemas integrados. O problema ocorrido (um módulo envia dados em um formato e o outro interpreta de forma errada) é o erro clássico de integração que não é pego em testes de unidade isolados. A) O Teste de Sistema avalia o sistema como um todo, mas a descrição foca em interface do controle remoto; B) O Teste de Unidade já foi feito e, isoladamente, a função estava certa; C) Teste de Aceitação foca na validação pelo usuário final/cliente, não em detalhes técnicos de integração de dados; D) Teste de regressão serve para garantir que mudanças recentes não quebraram o que funcionava, o que não é a raiz do problema de interface apresentado.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Uma Fintech consolidada no mercado financeiro decidiu reformular seu principal motor de processamento de pagamentos via PIX. Anteriormente, os desenvolvedores adotavam uma postura tradicional: programavam longas rotinas de cálculos de taxas de transferência, subiam o código para o servidor, e somente semanas depois a equipe de QA tentava escrever scripts de automação para testar os cenários. Isso gerava imensos atrasos, reescrita profunda de código quando bugs arquiteturais eram descobertos tardiamente, e uma cobertura de testes insatisfatória que causava fraudes. Visando inverter essa lógica, a diretoria de engenharia obrigou toda a equipe a transicionar para o Desenvolvimento Orientado a Testes (TDD). Agora, os engenheiros devem iniciar suas tarefas traduzindo o critério de aceitação negocial em um teste automatizado que falha intencionalmente. Somente após essa falha, eles devem escrever a quantidade mínima de código de produção necessária para que o teste passe, finalizando o ciclo com a refatoração do código aprovado. Apesar de gerar resistência inicial, a prática prometia alinhar melhor a arquitetura ao comportamento esperado.",
    "text": "Levando em consideração o ciclo de vida rigoroso estabelecido pelo Test-Driven Development (TD",
    "answers": [
      "e seu impacto direto na arquitetura de sistemas financeiros, qual afirmativa sintetiza tecnicamente o principal benefício metodológico alcançado pela Fintech ao adotar essa prática?",
      "O TDD garante que os testes sejam criados apenas pela equipe de negócios e usuários finais, assegurando que o código de produção dos desenvolvedores foque exclusivamente em performance em banco de dados.",
      "O TDD promove o design de software guiado pelo comportamento desejado, forçando o desenvolvimento de códigos mais modulares, testáveis e com alta cobertura desde a sua concepção técnica inicial.",
      "O TDD substitui a necessidade de arquitetos de software e a documentação funcional, pois a escrita de testes caóticos antes do código resolve magicamente todas as ambiguidades do projeto PIX.",
      "A técnica TDD estipula que a refatoração do código deve ocorrer antes da criação de qualquer teste, priorizando a estética da linguagem de programação acima da lógica do negócio.",
      "A principal vantagem do TDD é eliminar definitivamente a fase de Testes de Integração e Testes de Aceitação, concentrando todo o controle de qualidade nos testes manuais pós-implantação."
    ],
    "correct": 1,
    "feedback": "Alternativa B. A alternativa correta é a B. O TDD (Test-Driven Development) baseia-se no ciclo \"Red-Green-Refactor\" (Escrever teste que falha, escrever código para passar, refatorar). Essa abordagem força o desenvolvedor a pensar no design, interface e requisitos de uma função antes de implementá-la, resultando em um código naturalmente modular, testável (pois foi concebido para passar em um teste) e com excelente cobertura de testes automatizados unitários. A) Errada porque no TDD quem escreve o teste é o desenvolvedor, não o usuário final; C) Errada, TDD não substitui arquitetura e não é \"caótico\"; D) Errada, a refatoração é a última etapa do ciclo (Red -> Green -> Refactor); E) Errada, TDD é focado primordialmente (embora não exclusivamente) em testes de unidade e não elimina os testes de integração ou de aceitação.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "O Sistema Integrado de Compras do Governo (SICG) foi desenvolvido há 18 anos como uma arquitetura monolítica fortemente acoplada. Durante quase duas décadas, o SICG tem sido o motor de processamento de bilhões de reais em licitações públicas. Para acompanhar sucessivas mudanças na legislação de licitações, emendas constitucionais e o advento do pregão eletrônico moderno, milhares de correções pontuais, remendos (patches) emergenciais e integrações não planejadas com novas APIs foram injetados diretamente no código-fonte por dezenas de equipes terceirizadas diferentes. Atualmente, o sistema encontra-se em um estado em que a adição de um simples campo de validação de CNPJ em uma tela de cadastro resulta em falhas críticas e corrupção de dados no módulo financeiro de empenho, que é aparentemente não relacionado. Os diretores de TI constataram que o custo e o tempo para realizar alterações triviais tornaram-se astronômicos, e o sistema parece ter vida própria, deteriorando-se estruturalmente a cada nova release exigida pelos auditores governamentais.",
    "text": "À luz da teoria da evolução e manutenção de software formulada nas clássicas Leis de Lehman, quais duas leis descrevem de maneira inquestionável o fenômeno de degradação estrutural e a necessidade ininterrupta de adaptação enfrentados atualmente pelo Sistema Integrado de Compras do Governo (SICG)?",
    "answers": [
      "A Lei do Crescimento Contínuo e a Lei da Conservação da Familiaridade, que afirmam que todo sistema deve crescer exponencialmente enquanto a equipe mantém as tecnologias inalteradas.",
      "A Lei da Complexidade Crescente (se um programa evolui, sua complexidade estrutural aumenta a menos que se invista em mantê-la) e a Lei da Mudança Contínua (um sistema do mundo real deve ser adaptado ou perderá progressivamente sua utilidade).",
      "A Lei da Qualidade Invariável e a Lei da Redução do Esforço, postulando que os sistemas legados governamentais estabilizam a qualidade após 15 anos e não exigem mais custos de manutenção.",
      "A Lei da Autogestão de Código e a Lei da Mudança Estática, determinando que sistemas antigos desenvolvem resistência artificial à injeção de novas regras de negócio para se autopreservarem.",
      "A Lei do Declínio de Uso e a Lei da Conservação Organizacional, que obrigam o governo a descontinuar o SICG imediatamente e demitir as equipes de desenvolvimento terceirizadas para conter custos."
    ],
    "correct": 1,
    "feedback": "Alternativa B. A alternativa correta é a B. As Leis de Lehman que explicam perfeitamente o cenário são a 1ª Lei (Mudança Contínua), que diz que um sistema E-type (mundo real) precisa mudar continuamente para continuar útil ao seu ambiente (no caso, novas legislações e pregões), e a 2ª Lei (Complexidade Crescente), que afirma que à medida que o sistema evolui, a sua complexidade estrutural cresce e sua estrutura se deteriora, a menos que seja feito um esforço pró-ativo para refatorá-lo (o que não foi feito, gerando os remendos acoplados). As outras opções (A, C, D e E) apresentam combinações inventadas ou distorções dos nomes e definições das Leis de Lehman.",
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
      "1 - Manutenção Preventiva; 2 - Manutenção Corretiva; 3 - Manutenção Perfectiva."
    ],
    "correct": 0,
    "feedback": "Alternativa A. A alternativa correta é a A. \n1) O ajuste nos algoritmos para tornar o banco de dados mais rápido sem alterar a funcionalidade final para o usuário é uma melhoria de estrutura/desempenho: Manutenção Perfectiva.\n2) Modificar o sistema para operar em um novo ambiente operacional (5G, Linux) em resposta a mudanças externas da Anatel, sem necessariamente corrigir defeitos: Manutenção Adaptativa.\n3) Corrigir um erro lógico que estava gerando cálculos financeiros incorretos (falha real em produção): Manutenção Corretiva.\nAs demais alternativas invertem essas definições consagradas da engenharia de software.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Uma mega-plataforma de streaming de vídeos sul-americana tem o desafio de disponibilizar atualizações de interface e novos algoritmos de recomendação para seus 50 milhões de usuários diariamente. Há dois anos, a empresa possuía um processo doloroso onde os desenvolvedores mesclavam seus códigos manualmente a cada fim de mês e repassavam um pacote monolítico gigantesco para a equipe de Infraestrutura de TI (Operações) realizar a implantação de madrugada. Isso resultava em \"inferno de integração\", dezenas de horas de indisponibilidade do serviço e conflitos de código irresolvíveis. Como solução estratégica, a corporação adotou ferramentas avançadas (como Jenkins, GitLab CI e Kubernetes) para implementar o conceito de Integração Contínua (CI) e Entrega Contínua (CD). Agora, dezenas de vezes por dia, o código que um desenvolvedor produz é automaticamente mesclado na branch principal, compilações são disparadas, milhares de testes de regressão automatizados executam em minutos e o pacote é deixado pronto para implantação na nuvem mediante a aprovação do gerente de release.",
    "text": "Considerando os princípios e os objetivos das práticas de CI/CD (Continuous Integration / Continuous Delivery) no fluxo moderno da Engenharia de Software, qual alternativa define corretamente o impacto fundamental que essas práticas trouxeram para o desenvolvimento e a estabilidade da plataforma de streaming?",
    "answers": [
      "Substituíram integralmente os engenheiros de testes (QAs) por inteligência artificial, garantindo que o código seja implantado sem nenhuma validação de segurança, acelerando a chegada do software no mercado.",
      "Reduziram brutalmente o risco de falhas de integração tardias através da mescla frequente de pequenos incrementos de código e automação de testes, estabelecendo um processo repetível e confiável de geração de entregáveis.",
      "Tornaram o código-fonte imune a falhas arquiteturais, uma vez que a Entrega Contínua (CD) refatora automaticamente o banco de dados e corrige as violações das leis de Lehman sem interferência humana.",
      "Impuseram o isolamento das equipes de desenvolvimento por meses, garantindo que as ramificações de código (branches) permaneçam separadas até o lançamento final anual para evitar conflitos noturnos.",
      "Restringiram o uso de metodologias ágeis, exigindo o retorno ao modelo em Cascata tradicional para que as ferramentas do Jenkins possam gerar documentação burocrática antes de cada compilação de código."
    ],
    "correct": 1,
    "feedback": "Alternativa B. A alternativa correta é a B. A Integração Contínua (CI) obriga desenvolvedores a integrar código com alta frequência (várias vezes ao dia), mitigando o \"inferno de integração\" e detectando conflitos cedo por meio de builds e testes automatizados. A Entrega Contínua (CD) estende esse conceito garantindo que o software esteja sempre em um estado \"implantável\" em produção de forma repetível. A) Errada pois CI/CD não substitui QA por IA e foca muito na validação automatizada; C) CI/CD automatiza fluxo, não resolve magicamente dívida técnica de arquitetura; D) Totalmente oposto da ideia de CI, que prega integração frequente e não isolamento por meses; E) CI/CD é a base técnica do DevOps e do Ágil, e não um retorno ao modelo Cascata.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "A Secretaria da Fazenda de um importante estado brasileiro possui um Sistema de Arrecadação de Impostos (SAI) operando continuamente há três décadas. O núcleo do sistema é executado em um hardware mainframe obsoleto, programado quase inteiramente em COBOL. Toda a economia estadual, pagamento de servidores e repasses de ICMS para prefeituras dependem diretamente da precisão inabalável desse sistema, que possui regras de cálculo tributário extremamente complexas, pouco documentadas e que os poucos programadores originais vivos guardam apenas na memória. O Secretário da Fazenda alertou que os custos de licenciamento do hardware subiram 300% e o risco operacional é extremo. Contudo, devido à criticidade do sistema (o estado quebraria em dois dias se o sistema ficasse fora do ar) e ao valor de negócio altíssimo que as regras fiscais possuem, substituir o sistema de uma vez através de um modelo \"Big Bang\" (desliga o velho, liga o novo num fim de semana) foi descartado pelos consultores internacionais como uma atitude irresponsável e de altíssimo risco.",
    "text": "Diante do cenário complexo do sistema de arrecadação legado (alto valor para o negócio, tecnologia obsoleta e alto risco de substituição abrupta), qual estratégia de modernização da engenharia de software é recomendada para mitigar o impacto de migração e proteger a estabilidade financeira do estado?",
    "answers": [
      "Desativar o sistema COBOL imediatamente sem aviso prévio, forçando a equipe de TI a desenvolver em poucos dias uma plataforma moderna usando microsserviços em nuvem sob a pressão extrema da falência estatal.",
      "Ignorar os custos de licenciamento e manter a infraestrutura de mainframe congelada para sempre, abdicando de qualquer inovação e impedindo novas auditorias fiscais tecnológicas no futuro.",
      "Realizar a reengenharia e migração gradual da arquitetura, possivelmente adotando técnicas de encapsulamento (wrapping) do núcleo em COBOL via APIs modernas, substituindo os módulos de forma iterativa sem desligar a espinha dorsal.",
      "Transferir as regras de negócio complexas de arrecadação de impostos para a responsabilidade dos contribuintes comuns através de planilhas de Excel compartilhadas na internet, eliminando a dependência do mainframe.",
      "Priorizar exclusivamente a manutenção perfectiva na interface de linha de comando do mainframe, alterando as cores da tela verde e garantindo que os usuários tenham uma melhor experiência estética, sem tocar nos custos ou infraestrutura."
    ],
    "correct": 2,
    "feedback": "Alternativa C. A alternativa correta é a C. A abordagem recomendada para sistemas legados de missão crítica e altíssimo risco é a modernização iterativa e gradual. Uma técnica largamente utilizada é o \"Wrapping\" (encapsulamento), onde o sistema legado de COBOL é envolvido por uma camada de API moderna, permitindo que novos sistemas conversem com ele. Ao mesmo tempo, pode-se utilizar a Reengenharia para extrair as regras e migrar os módulos passo a passo, sem realizar um perigoso \"Big Bang\". A) Desativar e quebrar o estado é irresponsável; B) Ignorar o problema resultará em colapso devido à falta de profissionais e custos insustentáveis (Lehman); D) Absurdo jogar responsabilidade governamental para planilhas abertas; E) Trocar a cor da tela (manutenção superficial) não resolve a tecnologia obsoleta, o risco extremo e o custo do licenciamento do hardware.",
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
      "Padrão Decorator, adicionando comportamentos dinâmicos de contraste visual a cada botão isolado sem precisar alterar a estrutura interna de todas as classes da família de componentes.",
      "Padrão Abstract Factory, fornecendo uma interface central para criar famílias de objetos gráficos (botões, painéis, menus) relacionados ou dependentes entre si, sem especificar rigidamente suas classes concretas no código principal.",
      "Padrão Command, encapsulando as requisições de criação de tela como objetos de comando para permitir que o usuário faça reversões (undo/redo) em suas escolhas visuais de daltonismo.",
      "Padrão Builder, focando passo a passo na construção complexa de um único e gigante componente de leitura, independentemente das famílias visuais e ignorando os componentes de botões.",
      "Padrão Iterator, percorrendo exaustivamente todas as matrizes de cor em coleções complexas para selecionar o pixel exato de contraste necessário antes de montar a interface gráfica do cidadão."
    ],
    "correct": 1,
    "feedback": "Alternativa B. A alternativa correta é a B. O padrão Abstract Factory é especificamente projetado para resolver problemas onde é necessário criar \"famílias de objetos dependentes ou relacionados sem especificar suas classes concretas\". Ao usar o Abstract Factory, o sistema cria uma fábrica específica (ex: FabricaAltaAcessibilidade) que garantirá que todos os botões, menus e painéis criados combinem entre si, eliminando o acoplamento e os \"ifs/elses\" espalhados pelo código. A) Decorator adiciona responsabilidades a objetos individuais, não cria famílias; C) Command é para ações/logs, não criação de componentes visuais familiares; D) Builder foca na construção de um único objeto complexo passo a passo (ex: gerar um documento inteiro), não em garantir consistência de uma família de múltiplos objetos intercambiáveis; E) Iterator é para percorrer coleções (listas, pilhas), não para criação gráfica.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Uma companhia de tecnologia de precisão agrícola no Centro-Oeste lançou uma linha de tratores pulverizadores totalmente autônomos. A equipe de engenharia de software elaborou extensos manuais técnicos definindo que a latência de comunicação com o satélite não deveria exceder 50 milissegundos, que os motores de direção respondessem em 200 milissegundos e que a leitura do trajeto por GPS usasse algoritmos Dijkstra com 100% de precisão. O time de Qualidade (QA) aplicou simulações virtuais intensas, atestando que todas as métricas técnicas da especificação foram integralmente atendidas. Contudo, ao ser colocado nas fazendas reais de soja, os tratores demonstraram um comportamento desastroso: eles seguiam as rotas GPS com precisão milimétrica, mas não possuíam capacidade de reconhecer que o solo estava excessivamente encharcado após chuvas fortes. O sistema, apesar de tecnicamente irretocável segundo a especificação, afundava os tratores na lama e destruía a plantação, causando milhões em prejuízo aos agricultores, revelando um distanciamento grave das realidades da agricultura prática.",
    "text": "À luz da literatura de Engenharia de Software focada em Qualidade, a falha do trator ao destruir a plantação (mesmo atendendo todas as rígidas especificações do satélite e GPS) reflete diretamente um fracasso em qual atividade fundamental e por qual motivo conceitual?",
    "answers": [
      "Fracasso na Verificação, pois a latência do satélite estava sendo superestimada, resultando em respostas inadequadas do hardware durante tempestades magnéticas.",
      "Fracasso simultâneo em Verificação e Manutenção Preventiva, demonstrando que os testes unitários da equipe não incluíram bibliotecas de reconhecimento climático global.",
      "Fracasso na Validação, uma vez que a equipe construiu o \"software de forma correta\" (aderente ao manual GPS), mas falhou em construir o \"software correto\" (que atendesse à real e complexa necessidade de campo do agricultor no uso cotidiano).",
      "Fracasso na Engenharia de Domínio, pois o sistema utilizou erroneamente o algoritmo de Dijkstra, que é matematicamente comprovado como ineficiente para fazendas do Centro-Oeste.",
      "Fracasso na Certificação CMMI Nível 5, obrigando a empresa de tratores a retornar à codificação puramente mecânica sem a intervenção de sensores autônomos falhos."
    ],
    "correct": 2,
    "feedback": "Alternativa C. A alternativa correta é a C. O caso é um exemplo clássico da diferença entre Verificação (fazer o produto certo segundo a especificação técnica) e Validação (fazer o produto correto que resolve o problema no mundo real). A Verificação foi um sucesso (software rodou rápido, GPS preciso, cumpriu manuais). A Validação foi um fracasso monumental, porque o software não resolveu o problema do usuário (agricultor) no seu contexto de uso (trator afundou na lama, cenário não previsto na especificação técnica). A) Errada pois o texto diz que atendeu às especificações (Verificação OK); B) Confunde manutenção com atividades de validação e insere tecnologias não pertinentes; D) Problema de negócio e validação com o cliente final, não uma falha matemática do algoritmo Dijkstra em si; E) Certificação CMMI não garante automaticamente validação empírica de uso e voltar ao passado não resolve o conceito testado.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "O principal banco cooperativo do país decidiu lançar o \"BankApp 3.0\", um aplicativo móvel voltado para concessão instantânea de crédito rural. Durante o ciclo de desenvolvimento, a equipe técnica realizou exaustivos testes de unidade para os cálculos de juros. Em seguida, acoplaram os bancos de dados locais aos serviços de mensageria e executaram testes de integração, comprovando que as conexões não deixavam transações financeiras perdidas na rede. Com 100% dos relatórios de engenharia positivos, a diretoria liberou o aplicativo para um comitê fechado de gerentes das agências rurais antes do lançamento para o público. Após três dias de uso, o comitê reprovou completamente a entrega. Eles relataram que, apesar de não existirem bugs matemáticos, a interface era tão confusa, a jornada de clique era tão exaustiva e os jargões financeiros eram tão rebuscados, que os produtores rurais jamais conseguiriam aprovar um empréstimo sozinhos. A liberação teve que ser abortada.",
    "text": "O relato do colapso no lançamento do BankApp 3.0 para as agências rurais evidencia a ausência ou má condução de um nível específico de teste, que deveria ter garantido o alinhamento com a expectativa de quem vai consumir o produto. Qual foi esse nível de teste faltante?",
    "answers": [
      "O Teste de Desempenho (Carga), que deve ser o último nível aplicado para garantir que cem mil produtores rurais consigam acessar o aplicativo nos mesmos milissegundos sem congelar os servidores do banco.",
      "O Teste de Regressão, cuja execução é obrigatória para assegurar que as versões 1.0 e 2.0 do BankApp não sejam acidentalmente desinstaladas dos dispositivos móveis dos clientes.",
      "O Teste de Aceitação (User Acceptance Testing - UAT), que é focado na perspectiva do usuário de negócio e verifica se o sistema atende aos critérios subjetivos e reais de uso, satisfação e usabilidade no cenário operacional final.",
      "O Teste de Caixa-Branca (Estrutural), necessário para expor as vulnerabilidades nas rotinas internas de criptografia que foram ocultadas durante os testes dos gerentes.",
      "O Teste de Integração Contínua, responsável por unificar o cálculo dos juros às tabelas de crédito rural diretamente nos data centers das fazendas inteligentes."
    ],
    "correct": 2,
    "feedback": "Alternativa C. A alternativa correta é a C. Os Testes de Aceitação são os testes de validação final (geralmente executados pelo cliente, usuário final ou especialistas do domínio). O objetivo não é mais achar falhas no código (bugs, matemática, integrações — que já passaram), mas verificar se o sistema está pronto e utilizável para o fim a que se destina no mundo real, resolvendo o problema do cliente e possuindo usabilidade adequada. A reprovação pelos gerentes ocorreu justamente pela inusabilidade, falha típica de Aceitação. A) Errada porque o foco da reprovação não foi queda por excesso de usuários (carga); B) Regressão não lida com usabilidade inicial, mas sim em não quebrar o que já funcionava em código; D) Caixa-branca olha para o código, e o código estava matematicamente certo; E) Integração Contínua é prática de desenvolvimento/DevOps, não o tipo de teste final focado no usuário.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "A gerência de um consórcio aeroespacial europeu analisou o histórico de falhas críticas de seus softwares satelitais da década passada. Os relatórios indicaram que a esmagadora maioria dos defeitos inseridos nos algoritmos orbitais eram decorrentes da prática dos programadores de escrever rotinas densas de código e delegar, apenas ao final do trimestre, a confecção dos scripts de verificação para uma equipe terceirizada. Os códigos eram monolíticos e praticamente impossíveis de serem testados isoladamente (não-testáveis). Para a nova geração de satélites, a direção exigiu a adoção estrita do Desenvolvimento Orientado a Testes (TDD). Essa exigência determinou que os engenheiros mudassem sua cultura de trabalho diária, implementando um ciclo onde a automação falha deve obrigatoriamente preceder a codificação lógica, mudando substancialmente a arquitetura estrutural do sistema em direção a microsserviços altamente isolados.",
    "text": "Diante do imperativo da mudança de cultura do consórcio aeroespacial para a técnica TDD (Test-Driven Development), qual afirmação reflete de forma fidedigna a principal vantagem de engenharia estrutural proporcionada por essa inversão da ordem de codificação?",
    "answers": [
      "A eliminação de analistas de negócios, pois os testes se tornam os únicos responsáveis por ditar as estratégias espaciais comerciais em detrimento dos requisitos orbitais estáticos.",
      "O redirecionamento exclusivo dos esforços técnicos para a documentação textual, já que os códigos que passam no TDD não necessitam ser lidos ou refatorados posteriormente por seres humanos.",
      "A indução obrigatória à criação de códigos altamente modulares, desacoplados e desenhados especificamente para serem testáveis, garantindo que o comportamento esperado atue como a fundação arquitetural da programação.",
      "O bloqueio metodológico da refatoração de código legado, impedindo que a equipe europeia utilize componentes pré-testados nas missões satelitais da década anterior por não estarem em formato ágil.",
      "A extinção das atividades de Integração Contínua, uma vez que a técnica TDD garante que nenhum servidor jamais falhará, anulando a precisão das tubulações de build e deploys orbitais."
    ],
    "correct": 2,
    "feedback": "Alternativa C. A alternativa correta é a C. A principal vantagem na engenharia proporcionada pelo TDD é que, ao escrever o teste primeiro, o desenvolvedor é forçado a projetar (fazer o design) da classe ou função pensando em como ela será chamada e testada. Isso induz naturalmente a um código muito mais coeso, desacoplado (para permitir simulações e injeções de dependência) e modular. O design orientado ao teste resolve o problema histórico dos códigos \"in-testáveis\". As demais opções são refutações absurdas da prática: TDD não elimina analistas (A), não anula refatoração ou ignora legibilidade humana (B e D) e atua perfeitamente em conjunto e de forma integrada com as esteiras de Integração Contínua (CI/CD) em DevOps, não as extinguindo (E).",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "O \"SigaEDU\", um sistema governamental de gestão de universidades estaduais, foi desenvolvido em 2010 utilizando arquiteturas centralizadas de cliente-servidor para cadastrar diplomas impressos e históricos escolares de papel. Há mais de sete anos, o departamento estadual de TI proíbe a implementação de novas ferramentas no sistema, congelando seu escopo e apenas corrigindo bugs eventuais. Contudo, as novas diretrizes do Ministério da Educação (MEC) exigem que todas as universidades suportem ensino a distância, emissão de diplomas digitais em blockchain e inteligência artificial para detecção de evasão estudantil. Devido à paralisação do desenvolvimento e congelamento das tecnologias antigas do \"SigaEDU\", diversas pró-reitorias passaram a adquirir softwares paralelos não integrados e planilhas eletrônicas na nuvem para suprir suas necessidades emergenciais, tornando o sistema antigo ignorado e obsoleto perante os reitores.",
    "text": "Com base nas clássicas Leis de Lehman referentes à Evolução e Dinâmica de Sistemas de Software, qual lei fundamental descreve e explica o fenômeno de obsolescência tecnológica e o distanciamento das demandas sofridos de maneira sistêmica pelo \"SigaEDU\"?",
    "answers": [
      "A Lei do Crescimento Contínuo, que afirma que os sistemas universitários tendem a expandir sua infraestrutura de hardware até entrarem em colapso energético, abandonando o software de 2010.",
      "A Lei da Complexidade Decrescente, ditando que à medida que os anos passam, a exclusão de novas funcionalidades reduz milagrosamente os erros do software e diminui o valor de negócio do mesmo.",
      "A Lei da Qualidade em Declínio (ou Declínio da Familiaridade), que prova que o congelamento das inovações gera instabilidade matemática e destrói o banco de dados das universidades em sete anos.",
      "A Lei da Mudança Contínua (Lei 1), que postula que um programa de software de uso no mundo real deve necessariamente sofrer adaptações evolutivas ou perderá progressivamente sua utilidade e satisfação em seu ambiente operacional dinâmico.",
      "A Lei do Esforço Constante, que determina que as equipes de TI devem ser trocadas a cada sete anos, ou as regulamentações do MEC serão sumariamente rejeitadas por incapacidade técnica gerencial."
    ],
    "correct": 3,
    "feedback": "Alternativa D. A alternativa correta é a D. A Primeira Lei de Lehman (Lei da Mudança Contínua) declara que \"um sistema tipo-E (do mundo real) deve sofrer mudanças contínuas ou tornar-se progressivamente menos útil e menos satisfatório nesse ambiente\". Como o SigaEDU teve seu desenvolvimento congelado e o ambiente real sofreu fortes mutações (MEC exigindo blockchain, Ensino a Distância, evasão escolar), o sistema perdeu sua utilidade prática no ambiente acadêmico, sendo abandonado por softwares paralelos. As demais alternativas (A, B, C e E) são distorções nominais, inversões e invenções conceituais baseadas equivocadamente em interpretações físicas ou não relacionadas às métricas evolutivas da engenharia de software de Lehman.",
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
    "feedback": "Alternativa D. A alternativa correta é a D. \n1) Inclusão de protocolo para suportar um novo hardware (ambiente externo operando o software): Manutenção Adaptativa (mudar para o software se adaptar a um novo ambiente ou sistema operacional ou hardware).\n2) Otimização estrutural para melhorar o desempenho e resposta do sistema, sem alterar as funcionalidades básicas para os pacientes e sem consertar quebras sistêmicas: Manutenção Perfectiva (melhorar a estrutura ou arquitetura interna de eficiência e sustentabilidade).\n3) Correção emergencial de um erro aritmético e lógico real que gerava falha de operação financeira nos faturamentos de UTI: Manutenção Corretiva (consertar um bug ou defeito encontrado pelos usuários ou suporte técnico).",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "Uma inovadora desenvolvedora de jogos eletrônicos para dispositivos móveis estava perdendo milhões de dólares. A cada lançamento de temporada mensal, o processo de empacotamento, compilação de código de centenas de engenheiros, testes visuais manuais demorados e a submissão aos servidores mundiais de nuvem demorava quase seis dias. O fluxo \"feito à mão\" era caótico: arquivos importantes eram esquecidos fora dos pacotes, introduzindo telas pretas massivas, e as lojas de aplicativos bloqueavam o jogo. Em resposta à crise, o CTO introduziu as práticas arquitetônicas e culturais de Integração Contínua (CI) e Entrega Contínua (CD). A equipe agora submete código dezenas de vezes por dia em um repositório central; scripts automáticos compila o código na nuvem, rodam milhares de testes de colisão e rede, empacotam o artefato final e o posicionam, infalivelmente, pronto para implantação (release) com apenas um clique autorizado. O resultado foi a queda drástica de defeitos na versão do usuário e entregas sem estresse técnico noturno para a engenharia.",
    "text": "Ao adotar efetivamente o ciclo de CI/CD (Continuous Integration / Continuous Delivery), qual consequência prática primária transformou a capacidade executiva da desenvolvedora de jogos eletrônicos?",
    "answers": [
      "O isolamento radical das equipes artísticas, que passaram a integrar seus blocos de cenários gráficos apenas uma vez por ano para evitar qualquer conflito nas branches dos desenvolvedores lógicos.",
      "A dispensa massiva de qualquer infraestrutura em nuvem, dado que o processo contínuo compila inteiramente o ecossistema do jogo de forma descentralizada nos smartphones dos jogadores finais.",
      "A automação repetível do ciclo de vida das compilações e das validações por testes de software, permitindo mesclagem muito frequente, redução de riscos operacionais e disponibilização segura do artefato para implantação contínua.",
      "A extinção incondicional da figura do Diretor Técnico, uma vez que o mecanismo de Entrega Contínua (CD) escreve por si próprio as linhas de programação das mecânicas de jogos 3D complexos, substituindo o papel da engenharia humana.",
      "A obrigatoriedade absoluta do retorno ao desenvolvimento unificado em metodologias ágeis de extrema lentidão, atrasando as entregas para garantir o faturamento manual exaustivo nas lojas de aplicativo."
    ],
    "correct": 2,
    "feedback": "Alternativa C. A alternativa correta é a C. A premissa central de CI/CD é remover a complexidade falha de integração manual que se faz ao final do ciclo. Com Integração Contínua (CI), o código é mesclado inúmeras vezes por dia, testado imediatamente por esteiras automatizadas (pipelines). Com Entrega Contínua (CD), o código validado é sempre colocado em um estado impecável e repetível que pode ser implantado de forma segura em produção a qualquer instante autorizado, anulando dias estressantes e reduzindo riscos de implantação. A) Vai de encontro à \"Integração\" ágil e diária; B) Errado, o processo se utiliza intensamente das máquinas em nuvem (servidores de CI, GitLab, Jenkins) para compilar; D) Ferramentas de CI/CD não programam lógicas sozinhas nem suprimem diretores; E) CI/CD acelera a entrega e apoia o método ágil, não a lentidão extrema ou burocracia manual.",
    "points": 12.5
  },
  {
    "category": "ENGENHARIA DE SOFTWARE",
    "context": "A Secretaria de Segurança Pública de uma metrópole depende diretamente de um Sistema de Registro Policial Legado (SRPL). O software, desenvolvido nos anos 90 utilizando linguagem estruturada procedural, rodando em terminais de tela verde, é insubstituível. Ele contém mais de cinquenta milhões de ocorrências integradas fisicamente a processos do poder judiciário. O sistema apresenta altíssima fragilidade perante manutenções, impossibilidade de criar comunicação via APIs e não dispõe de interface acessível a smartphones modernos usados nas viaturas da polícia investigativa. O alto comando ordenou a modernização imediata, mas decretou uma proibição absoluta do encerramento forçado abrupto (modelo substituição de \"Big Bang\") por motivos de risco sistêmico incalculável ao Estado. Diversas estratégias para Sistemas Legados foram levantadas pelos consultores.",
    "text": "Diante do contexto e do alto risco envolvido, e levando em consideração a determinação irrevogável do estado de não utilizar o modelo de \"Big Bang\", qual é a estratégia mais recomendada da Engenharia de Software para evoluir estruturalmente esse massivo e valioso sistema penal de modo seguro e responsivo para novas tecnologias policiais?",
    "answers": [
      "Aplicar a estratégia de descarte instantâneo por decurso de prazo, ignorando a proibição estadual, formatando todos os discos do sistema legado e construindo uma nova arquitetura nativa em nuvem sob caos programado para incentivar a inovação ágil.",
      "Recusar categoricamente o desenvolvimento de interfaces móveis e focar na expansão dos terminais em tela verde para todas as viaturas com acesso por cabo, estabilizando e preservando inalterada a obsolescência tecnológica.",
      "Adotar a estratégia de Reengenharia Evolutiva e Wrappers (Encapsulamento), mantendo temporariamente as lógicas do núcleo do legado mas desenvolvendo invólucros em APIs modernas de serviço que conectem gradativamente as funções antigas com os novos aplicativos móveis das polícias, mitigando severos riscos paralelos.",
      "Transferir de forma compulsória as informações críticas do estado por meio de pen-drives entre viaturas como método assíncrono temporário de modernização, até que os recursos legados percam espontaneamente validade operacional no judiciário.",
      "Realizar unicamente a modernização da engenharia social, através da reestruturação hierárquica das delegacias com cursos preparatórios para que as novas gerações de policiais consigam dominar a programação procedural dos anos 90 e criar suas próprias manutenções nativas."
    ],
    "correct": 2,
    "feedback": "Alternativa C. A alternativa correta é a C. Lidar com Sistemas Legados altamente críticos de alto valor de negócio (polícia/estado) e obsoleto sem a perigosa quebra de \"Big Bang\" exige a Modernização/Reengenharia Evolutiva. A técnica de \"Wrapping\" (encapsular o legado provendo uma camada de API ao redor) permite que o software antigo seja requisitado por tecnologias muito modernas (como os apps mobile nas viaturas), evoluindo componentes do sistema passo a passo sem desligar e quebrar a base de dados principal, controlando os riscos do projeto. As demais afirmativas descrevem abordagens suicidas (A e D), engessamentos obsoletos (B) ou práticas improdutivas inaceitáveis na engenharia de software para evoluir a arquitetura do produto de forma real (E).",
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
