# CENTRO UNIVERSITÁRIO CEUNI - FAMETRO
**Disciplina:** Engenharia de Software
**Professor:** Alexsander F. de Souza
**Curso:** Ciência da Computação (5º Período)
**Avaliação Institucional N2 (MODELO A)**

---

## 🧠 PARTE 1 - QUESTÕES OBJETIVAS (Valor total: 6,0 pontos | 0,75 cada)

**QUESTÃO 1 (Dificuldade: Difícil)**

**Contexto:**
Uma corporação global de logística marítima e terrestre, operando a partir do Porto de Manaus para o mundo, está enfrentando uma grave crise na sua plataforma central de roteamento de cargas (SeaRoute). O módulo responsável pelo cálculo de rotas e modais de transporte (fluvial, rodoviário e aéreo) foi desenvolvido inicialmente com uma estrutura rígida, repleta de condicionais aninhadas (if/else) baseadas no tipo de modalidade. Recentemente, a empresa decidiu integrar novas modalidades de transporte sustentável e rotas com veículos autônomos. Toda vez que uma nova regra tarifária ou modalidade de roteamento precisa ser adicionada, os desenvolvedores são forçados a alterar a classe principal do motor de cálculo, gerando alto risco de quebra de funcionalidades já validadas e violando diretamente o princípio de Aberto-Fechado (Open/Closed Principle) do SOLID. O Arquiteto de Software determinou a refatoração imediata deste motor, de forma que os algoritmos de cálculo de rota possam ser encapsulados em classes independentes, permitindo que a plataforma central alterne dinamicamente entre as modalidades de transporte em tempo de execução sem conhecer os detalhes da implementação de cada algoritmo.

**Questão:**
Considerando a exigência de encapsular os algoritmos de cálculo de frete e roteamento para que possam ser substituídos ou adicionados de forma transparente, eliminando as estruturas condicionais complexas no motor principal, qual padrão de projeto comportamental deve ser aplicado pela equipe de arquitetura da SeaRoute para sanar este gargalo tecnológico?

A) Adotar o padrão Singleton, instanciando cada algoritmo de frete uma única vez na inicialização do sistema, evitando que diferentes rotas entrem em conflito de memória e garantindo o desempenho.
B) Implementar o padrão Observer, permitindo que o motor de cálculo seja notificado passivamente sempre que um navio ou caminhão alterar sua rota, sem necessidade de calcular o frete ativamente.
C) Utilizar o padrão Strategy, definindo uma interface comum para todas as estratégias de cálculo de rota e encapsulando cada modalidade em uma classe concreta, permitindo a injeção e alternância em tempo de execução.
D) Empregar o padrão Facade, criando uma interface simplificada que esconda a lógica dos "ifs/elses" dentro de um módulo externo, mantendo o acoplamento original, mas melhorando a legibilidade do código.
E) Aplicar o padrão Factory Method, focando estritamente na criação dos objetos de rotas marítimas para que o sistema delegue as decisões de navegação para as subclasses de transporte fluvial.

**Unidade Didática:** 05

**Gabarito:** C

**Justificativa:**
A alternativa correta é a C, pois o padrão Strategy (Estratégia) é um padrão comportamental que permite definir uma família de algoritmos, encapsular cada um deles e torná-los intercambiáveis. O Strategy permite que o algoritmo varie independentemente dos clientes que o utilizam, resolvendo perfeitamente o problema das condicionais rígidas (violação do Open/Closed Principle) ao permitir a alternância de modais de transporte em tempo de execução. As demais alternativas estão incorretas: A) Singleton foca em instância única, não em alternância de algoritmos; B) Observer é para notificações de estado (publish/subscribe); D) Facade apenas simplifica uma interface complexa, mas não resolve o acoplamento e a extensão dinâmica dos algoritmos; E) Factory Method é um padrão criacional focado em como os objetos são instanciados, e não no encapsulamento e alternância de comportamentos/algoritmos de roteamento em tempo de execução.

---

**QUESTÃO 2 (Dificuldade: Difícil)**

**Contexto:**
Uma HealthTech com sede em São Paulo está prestes a lançar no mercado um dispositivo embarcado inovador, voltado para UTIs pediátricas, que analisa continuamente sinais vitais e prevê crises respiratórias utilizando modelos de IA. A equipe de engenharia seguiu rigorosamente os manuais técnicos, garantindo que o software do dispositivo executasse sem falhas de memória, que a comunicação com os biossensores ocorresse em milissegundos e que todo o código fonte estivesse em total conformidade com a especificação original. Durante os ensaios clínicos em um hospital parceiro, no entanto, médicos neonatologistas rejeitaram o uso do equipamento. O motivo apontado não foi travamento do software, mas sim o fato de que a interface de alerta disparava alarmes sonoros com base em métricas fisiológicas padrão de adultos, ignorando as particularidades da fisiologia neonatal, o que gerava um número inaceitável de falsos positivos na UTI, estressando a equipe médica e os pacientes. O CTO da empresa convocou uma reunião de crise para avaliar os processos de qualidade aplicados.

**Questão:**
Considerando a distinção fundamental entre as práticas de Verificação e Validação (V&V) na Engenharia de Software, qual afirmativa diagnostica com precisão a falha de processo ocorrida no desenvolvimento do dispositivo médico embarcado para a UTI neonatal?

A) A equipe obteve sucesso absoluto na validação, pois os modelos de IA e biossensores funcionavam conforme a especificação técnica, mas falhou na verificação ao negligenciar testes de intrusão e segurança cibernética.
B) O processo de validação foi ignorado ou mal executado, uma vez que, apesar do software ter sido construído corretamente segundo os requisitos técnicos (verificação bem-sucedida), ele não atendeu às reais necessidades operacionais do usuário final em seu ambiente de uso (os médicos neonatologistas).
C) Houve uma falha exclusiva na fase de verificação, dado que os desenvolvedores deveriam ter alterado a arquitetura de banco de dados para suportar os sinais vitais infantis antes mesmo de consultar a equipe médica.
D) As atividades de verificação e validação falharam simultaneamente, visto que a ocorrência de falsos positivos indica que o código-fonte foi corrompido durante a implantação física no hospital.
E) A validação foi realizada corretamente pela equipe de engenharia antes dos ensaios clínicos, mas a falha se deu porque a técnica de testes unitários automatizados não era robusta o suficiente para abranger o padrão de adultos.

**Unidade Didática:** 05

**Gabarito:** B

**Justificativa:**
A alternativa correta é a B. A Verificação responde à pergunta "Estamos construindo o produto corretamente?" (aderência às especificações e ausência de bugs no código), o que a equipe fez bem. Já a Validação responde a "Estamos construindo o produto correto?" (atendimento das necessidades reais do usuário e adequação ao contexto de uso). A equipe falhou na validação, pois o sistema construído não servia ao propósito clínico neonatal. As demais são incorretas: A) inverte os conceitos e introduz segurança sem contexto; C) aponta falha de verificação quando o erro foi de requisito de negócio/validação; D) afirma que ambas falharam e atribui a falha de negócio a um código corrompido; E) confunde validação de negócio com a execução de testes unitários técnicos (que compõem a verificação).

---

**QUESTÃO 3 (Dificuldade: Difícil)**

**Contexto:**
Um consórcio aeroespacial está desenvolvendo o software de controle de voo para uma nova geração de drones autônomos de entrega em áreas remotas. A arquitetura do sistema foi projetada em múltiplos submódulos desenvolvidos por equipes distintas: a equipe A construiu o "Módulo de Navegação GPS", a equipe B desenvolveu o "Módulo de Evitação de Colisões (Radar)" e a equipe C programou o "Atuador de Motores". A equipe de Qualidade (QA) garantiu que 100% das funções individuais desses submódulos passassem sem erros por exaustivos testes unitários isolados, utilizando técnicas de caixas-branca (mocks e stubs). No entanto, durante o primeiro voo simulado em ambiente controlado, o drone perdeu a estabilidade e caiu. A análise da caixa preta virtual revelou que os dados formatados em ponto flutuante de 32 bits, emitidos perfeitamente pelo Módulo de Radar, estavam sendo interpretados como inteiros de 16 bits pelo Atuador de Motores, gerando comandos de aceleração caóticos e incompatíveis. O erro só se manifestou quando as peças foram acopladas no ambiente de testes conjuntos.

**Questão:**
Frente ao colapso do drone simulado provocado por interpretações divergentes de dados entre submódulos que individualmente funcionavam perfeitamente, qual nível de teste foi negligenciado ou mal executado pela equipe de garantia de qualidade, e qual seria sua principal finalidade neste contexto?

A) O Teste de Sistema, cuja finalidade era validar exclusivamente a interface do usuário do controle remoto do drone, ignorando a comunicação entre os componentes internos.
B) O Teste de Unidade, que deveria ter garantido que o método de conversão de ponto flutuante dentro do Módulo de Radar nunca retornasse um valor incompatível.
C) O Teste de Aceitação, cuja responsabilidade técnica é verificar a estrutura de dados interna dos motores sem qualquer envolvimento dos clientes ou usuários finais.
D) O Teste de Regressão, essencial para garantir que a inserção de novos componentes físicos não diminuísse o tempo de duração da bateria do drone.
E) O Teste de Integração, que possui como objetivo primordial avaliar o comportamento, as interfaces e a comunicação entre os módulos ou componentes que, mesmo isoladamente corretos, são combinados para funcionar em conjunto.

**Unidade Didática:** 05

**Gabarito:** E

**Justificativa:**
A alternativa correta é a E. Os testes de integração são executados exatamente após os testes unitários e têm como objetivo descobrir defeitos nas interfaces e nas interações entre componentes ou sistemas integrados. O problema ocorrido (um módulo envia dados em um formato e o outro interpreta de forma errada) é o erro clássico de integração que não é pego em testes de unidade isolados. A) O Teste de Sistema avalia o sistema como um todo, mas a descrição foca em interface do controle remoto; B) O Teste de Unidade já foi feito e, isoladamente, a função estava certa; C) Teste de Aceitação foca na validação pelo usuário final/cliente, não em detalhes técnicos de integração de dados; D) Teste de regressão serve para garantir que mudanças recentes não quebraram o que funcionava, o que não é a raiz do problema de interface apresentado.

---

**QUESTÃO 4 (Dificuldade: Difícil)**

**Contexto:**
Uma Fintech consolidada no mercado financeiro decidiu reformular seu principal motor de processamento de pagamentos via PIX. Anteriormente, os desenvolvedores adotavam uma postura tradicional: programavam longas rotinas de cálculos de taxas de transferência, subiam o código para o servidor, e somente semanas depois a equipe de QA tentava escrever scripts de automação para testar os cenários. Isso gerava imensos atrasos, reescrita profunda de código quando bugs arquiteturais eram descobertos tardiamente, e uma cobertura de testes insatisfatória que causava fraudes. Visando inverter essa lógica, a diretoria de engenharia obrigou toda a equipe a transicionar para o Desenvolvimento Orientado a Testes (TDD). Agora, os engenheiros devem iniciar suas tarefas traduzindo o critério de aceitação negocial em um teste automatizado que falha intencionalmente. Somente após essa falha, eles devem escrever a quantidade mínima de código de produção necessária para que o teste passe, finalizando o ciclo com a refatoração do código aprovado. Apesar de gerar resistência inicial, a prática prometia alinhar melhor a arquitetura ao comportamento esperado.

**Questão:**
Levando em consideração o ciclo de vida rigoroso estabelecido pelo Test-Driven Development (TDD) e seu impacto direto na arquitetura de sistemas financeiros, qual afirmativa sintetiza tecnicamente o principal benefício metodológico alcançado pela Fintech ao adotar essa prática?

A) O TDD garante que os testes sejam criados apenas pela equipe de negócios e usuários finais, assegurando que o código de produção dos desenvolvedores foque exclusivamente em performance em banco de dados.
B) O TDD promove o design de software guiado pelo comportamento desejado, forçando o desenvolvimento de códigos mais modulares, testáveis e com alta cobertura desde a sua concepção técnica inicial.
C) O TDD substitui a necessidade de arquitetos de software e a documentação funcional, pois a escrita de testes caóticos antes do código resolve magicamente todas as ambiguidades do projeto PIX.
D) A técnica TDD estipula que a refatoração do código deve ocorrer antes da criação de qualquer teste, priorizando a estética da linguagem de programação acima da lógica do negócio.
E) A principal vantagem do TDD é eliminar definitivamente a fase de Testes de Integração e Testes de Aceitação, concentrando todo o controle de qualidade nos testes manuais pós-implantação.

**Unidade Didática:** 05

**Gabarito:** B

**Justificativa:**
A alternativa correta é a B. O TDD (Test-Driven Development) baseia-se no ciclo "Red-Green-Refactor" (Escrever teste que falha, escrever código para passar, refatorar). Essa abordagem força o desenvolvedor a pensar no design, interface e requisitos de uma função antes de implementá-la, resultando em um código naturalmente modular, testável (pois foi concebido para passar em um teste) e com excelente cobertura de testes automatizados unitários. A) Errada porque no TDD quem escreve o teste é o desenvolvedor, não o usuário final; C) Errada, TDD não substitui arquitetura e não é "caótico"; D) Errada, a refatoração é a última etapa do ciclo (Red -> Green -> Refactor); E) Errada, TDD é focado primordialmente (embora não exclusivamente) em testes de unidade e não elimina os testes de integração ou de aceitação.

---

**QUESTÃO 5 (Dificuldade: Difícil)**

**Contexto:**
O Sistema Integrado de Compras do Governo (SICG) foi desenvolvido há 18 anos como uma arquitetura monolítica fortemente acoplada. Durante quase duas décadas, o SICG tem sido o motor de processamento de bilhões de reais em licitações públicas. Para acompanhar sucessivas mudanças na legislação de licitações, emendas constitucionais e o advento do pregão eletrônico moderno, milhares de correções pontuais, remendos (patches) emergenciais e integrações não planejadas com novas APIs foram injetados diretamente no código-fonte por dezenas de equipes terceirizadas diferentes. Atualmente, o sistema encontra-se em um estado em que a adição de um simples campo de validação de CNPJ em uma tela de cadastro resulta em falhas críticas e corrupção de dados no módulo financeiro de empenho, que é aparentemente não relacionado. Os diretores de TI constataram que o custo e o tempo para realizar alterações triviais tornaram-se astronômicos, e o sistema parece ter vida própria, deteriorando-se estruturalmente a cada nova release exigida pelos auditores governamentais.

**Questão:**
À luz da teoria da evolução e manutenção de software formulada nas clássicas Leis de Lehman, quais duas leis descrevem de maneira inquestionável o fenômeno de degradação estrutural e a necessidade ininterrupta de adaptação enfrentados atualmente pelo Sistema Integrado de Compras do Governo (SICG)?

A) A Lei do Crescimento Contínuo e a Lei da Conservação da Familiaridade, que afirmam que todo sistema deve crescer exponencialmente enquanto a equipe mantém as tecnologias inalteradas.
B) A Lei da Complexidade Crescente (se um programa evolui, sua complexidade estrutural aumenta a menos que se invista em mantê-la) e a Lei da Mudança Contínua (um sistema do mundo real deve ser adaptado ou perderá progressivamente sua utilidade).
C) A Lei da Qualidade Invariável e a Lei da Redução do Esforço, postulando que os sistemas legados governamentais estabilizam a qualidade após 15 anos e não exigem mais custos de manutenção.
D) A Lei da Autogestão de Código e a Lei da Mudança Estática, determinando que sistemas antigos desenvolvem resistência artificial à injeção de novas regras de negócio para se autopreservarem.
E) A Lei do Declínio de Uso e a Lei da Conservação Organizacional, que obrigam o governo a descontinuar o SICG imediatamente e demitir as equipes de desenvolvimento terceirizadas para conter custos.

**Unidade Didática:** 06

**Gabarito:** B

**Justificativa:**
A alternativa correta é a B. As Leis de Lehman que explicam perfeitamente o cenário são a 1ª Lei (Mudança Contínua), que diz que um sistema E-type (mundo real) precisa mudar continuamente para continuar útil ao seu ambiente (no caso, novas legislações e pregões), e a 2ª Lei (Complexidade Crescente), que afirma que à medida que o sistema evolui, a sua complexidade estrutural cresce e sua estrutura se deteriora, a menos que seja feito um esforço pró-ativo para refatorá-lo (o que não foi feito, gerando os remendos acoplados). As outras opções (A, C, D e E) apresentam combinações inventadas ou distorções dos nomes e definições das Leis de Lehman.

---

**QUESTÃO 6 (Dificuldade: Difícil)**

**Contexto:**
A divisão de engenharia de software de uma grande operadora de telecomunicações latino-americana reportou ao comitê executivo as atividades executadas na principal plataforma de tarifação de celulares (Billing) durante o segundo trimestre do ano. Foram realizados três grandes pacotes de trabalho: 
1) Modificação de bibliotecas internas de criptografia e ajustes profundos nos algoritmos de banco de dados para melhorar a performance das consultas noturnas de auditoria, tornando a emissão de faturas 40% mais rápida. 
2) Modificação de 20 mil linhas de código para que o sistema de faturamento funcionasse nativamente nas novas especificações das antenas 5G Standalone recentemente leiloadas pela Anatel, migrando o ambiente do sistema operacional legado para contêineres Linux. 
3) Correção emergencial no módulo de roaming internacional que, devido a um erro lógico de ponteiros em C++, estava calculando incorretamente os valores de dados móveis em viagens para a Europa.

**Questão:**
Considerando a teoria clássica de Engenharia de Software sobre manutenção de sistemas, como os três pacotes de trabalho realizados na plataforma de tarifação de celulares devem ser tecnicamente classificados e categorizados, respectivamente (1, 2 e 3)?

A) 1 - Manutenção Perfectiva; 2 - Manutenção Adaptativa; 3 - Manutenção Corretiva.
B) 1 - Manutenção Adaptativa; 2 - Manutenção Perfectiva; 3 - Manutenção Preventiva.
C) 1 - Manutenção Corretiva; 2 - Manutenção Preventiva; 3 - Manutenção Adaptativa.
D) 1 - Manutenção Perfectiva; 2 - Manutenção Corretiva; 3 - Manutenção Adaptativa.
E) 1 - Manutenção Preventiva; 2 - Manutenção Corretiva; 3 - Manutenção Perfectiva.

**Unidade Didática:** 06

**Gabarito:** A

**Justificativa:**
A alternativa correta é a A. 
1) O ajuste nos algoritmos para tornar o banco de dados mais rápido sem alterar a funcionalidade final para o usuário é uma melhoria de estrutura/desempenho: Manutenção Perfectiva.
2) Modificar o sistema para operar em um novo ambiente operacional (5G, Linux) em resposta a mudanças externas da Anatel, sem necessariamente corrigir defeitos: Manutenção Adaptativa.
3) Corrigir um erro lógico que estava gerando cálculos financeiros incorretos (falha real em produção): Manutenção Corretiva.
As demais alternativas invertem essas definições consagradas da engenharia de software.

---

**QUESTÃO 7 (Dificuldade: Difícil)**

**Contexto:**
Uma mega-plataforma de streaming de vídeos sul-americana tem o desafio de disponibilizar atualizações de interface e novos algoritmos de recomendação para seus 50 milhões de usuários diariamente. Há dois anos, a empresa possuía um processo doloroso onde os desenvolvedores mesclavam seus códigos manualmente a cada fim de mês e repassavam um pacote monolítico gigantesco para a equipe de Infraestrutura de TI (Operações) realizar a implantação de madrugada. Isso resultava em "inferno de integração", dezenas de horas de indisponibilidade do serviço e conflitos de código irresolvíveis. Como solução estratégica, a corporação adotou ferramentas avançadas (como Jenkins, GitLab CI e Kubernetes) para implementar o conceito de Integração Contínua (CI) e Entrega Contínua (CD). Agora, dezenas de vezes por dia, o código que um desenvolvedor produz é automaticamente mesclado na branch principal, compilações são disparadas, milhares de testes de regressão automatizados executam em minutos e o pacote é deixado pronto para implantação na nuvem mediante a aprovação do gerente de release.

**Questão:**
Considerando os princípios e os objetivos das práticas de CI/CD (Continuous Integration / Continuous Delivery) no fluxo moderno da Engenharia de Software, qual alternativa define corretamente o impacto fundamental que essas práticas trouxeram para o desenvolvimento e a estabilidade da plataforma de streaming?

A) Substituíram integralmente os engenheiros de testes (QAs) por inteligência artificial, garantindo que o código seja implantado sem nenhuma validação de segurança, acelerando a chegada do software no mercado.
B) Reduziram brutalmente o risco de falhas de integração tardias através da mescla frequente de pequenos incrementos de código e automação de testes, estabelecendo um processo repetível e confiável de geração de entregáveis.
C) Tornaram o código-fonte imune a falhas arquiteturais, uma vez que a Entrega Contínua (CD) refatora automaticamente o banco de dados e corrige as violações das leis de Lehman sem interferência humana.
D) Impuseram o isolamento das equipes de desenvolvimento por meses, garantindo que as ramificações de código (branches) permaneçam separadas até o lançamento final anual para evitar conflitos noturnos.
E) Restringiram o uso de metodologias ágeis, exigindo o retorno ao modelo em Cascata tradicional para que as ferramentas do Jenkins possam gerar documentação burocrática antes de cada compilação de código.

**Unidade Didática:** 06

**Gabarito:** B

**Justificativa:**
A alternativa correta é a B. A Integração Contínua (CI) obriga desenvolvedores a integrar código com alta frequência (várias vezes ao dia), mitigando o "inferno de integração" e detectando conflitos cedo por meio de builds e testes automatizados. A Entrega Contínua (CD) estende esse conceito garantindo que o software esteja sempre em um estado "implantável" em produção de forma repetível. A) Errada pois CI/CD não substitui QA por IA e foca muito na validação automatizada; C) CI/CD automatiza fluxo, não resolve magicamente dívida técnica de arquitetura; D) Totalmente oposto da ideia de CI, que prega integração frequente e não isolamento por meses; E) CI/CD é a base técnica do DevOps e do Ágil, e não um retorno ao modelo Cascata.

---

**QUESTÃO 8 (Dificuldade: Difícil)**

**Contexto:**
A Secretaria da Fazenda de um importante estado brasileiro possui um Sistema de Arrecadação de Impostos (SAI) operando continuamente há três décadas. O núcleo do sistema é executado em um hardware mainframe obsoleto, programado quase inteiramente em COBOL. Toda a economia estadual, pagamento de servidores e repasses de ICMS para prefeituras dependem diretamente da precisão inabalável desse sistema, que possui regras de cálculo tributário extremamente complexas, pouco documentadas e que os poucos programadores originais vivos guardam apenas na memória. O Secretário da Fazenda alertou que os custos de licenciamento do hardware subiram 300% e o risco operacional é extremo. Contudo, devido à criticidade do sistema (o estado quebraria em dois dias se o sistema ficasse fora do ar) e ao valor de negócio altíssimo que as regras fiscais possuem, substituir o sistema de uma vez através de um modelo "Big Bang" (desliga o velho, liga o novo num fim de semana) foi descartado pelos consultores internacionais como uma atitude irresponsável e de altíssimo risco.

**Questão:**
Diante do cenário complexo do sistema de arrecadação legado (alto valor para o negócio, tecnologia obsoleta e alto risco de substituição abrupta), qual estratégia de modernização da engenharia de software é recomendada para mitigar o impacto de migração e proteger a estabilidade financeira do estado?

A) Desativar o sistema COBOL imediatamente sem aviso prévio, forçando a equipe de TI a desenvolver em poucos dias uma plataforma moderna usando microsserviços em nuvem sob a pressão extrema da falência estatal.
B) Ignorar os custos de licenciamento e manter a infraestrutura de mainframe congelada para sempre, abdicando de qualquer inovação e impedindo novas auditorias fiscais tecnológicas no futuro.
C) Realizar a reengenharia e migração gradual da arquitetura, possivelmente adotando técnicas de encapsulamento (wrapping) do núcleo em COBOL via APIs modernas, substituindo os módulos de forma iterativa sem desligar a espinha dorsal.
D) Transferir as regras de negócio complexas de arrecadação de impostos para a responsabilidade dos contribuintes comuns através de planilhas de Excel compartilhadas na internet, eliminando a dependência do mainframe.
E) Priorizar exclusivamente a manutenção perfectiva na interface de linha de comando do mainframe, alterando as cores da tela verde e garantindo que os usuários tenham uma melhor experiência estética, sem tocar nos custos ou infraestrutura.

**Unidade Didática:** 06

**Gabarito:** C

**Justificativa:**
A alternativa correta é a C. A abordagem recomendada para sistemas legados de missão crítica e altíssimo risco é a modernização iterativa e gradual. Uma técnica largamente utilizada é o "Wrapping" (encapsulamento), onde o sistema legado de COBOL é envolvido por uma camada de API moderna, permitindo que novos sistemas conversem com ele. Ao mesmo tempo, pode-se utilizar a Reengenharia para extrair as regras e migrar os módulos passo a passo, sem realizar um perigoso "Big Bang". A) Desativar e quebrar o estado é irresponsável; B) Ignorar o problema resultará em colapso devido à falta de profissionais e custos insustentáveis (Lehman); D) Absurdo jogar responsabilidade governamental para planilhas abertas; E) Trocar a cor da tela (manutenção superficial) não resolve a tecnologia obsoleta, o risco extremo e o custo do licenciamento do hardware.

---

## 📝 PARTE 2 - QUESTÃO DISCURSIVA (Valor: 4,0 pontos)

**Texto Base / Estudo de Caso**

O Grupo Empresarial "LogisNorte", sediado no polo industrial de Manaus, é uma potência na distribuição logística na bacia amazônica. Há mais de 20 anos, a empresa desenvolveu internamente o "SigaAmazon", um sistema monolítico (C++ e banco relacional legado) que faz a gestão de rotas fluviais, escalas de marinheiros e cálculo de capacidade de carga dos navios regionais. O sistema se tornou o coração financeiro da empresa, mantendo o abastecimento de dezenas de municípios ribeirinhos e grandes indústrias da Zona Franca. 

Entretanto, devido à ausência de planejamento de longo prazo, o sistema sofreu adições agressivas para atender novas regulamentações da Marinha, flutuações das secas históricas dos rios amazônicos e a implantação de notas fiscais eletrônicas. Essas intervenções desordenadas tornaram o SigaAmazon extremamente frágil. Hoje, uma pequena alteração no módulo de impostos afeta o algoritmo de calado dos navios, provocando riscos reais de encalhe de embarcações por cálculos de peso equivocados. A documentação original não existe mais e a equipe veterana está se aposentando. 

Visando expandir suas operações para integrações com drones aéreos e Inteligência Artificial de predição de secas, a diretoria compreendeu que o SigaAmazon legado é uma barreira mortífera para a inovação. Foi contratada uma consultoria sênior de Engenharia de Software para decidir o futuro da plataforma sob a ótica da evolução de sistemas e arquitetura moderna. A diretoria exige uma análise profunda que não interrompa o fornecimento de suprimentos da região e que justifique os altos investimentos perante o conselho financeiro da LogisNorte.

**Enunciado**

A partir do cenário crítico do sistema legado SigaAmazon do Grupo LogisNorte, posicione-se como o Arquiteto de Software Líder da consultoria e elabore um texto dissertativo-argumentativo (mínimo de 30 linhas), direcionado ao conselho financeiro, abordando de forma técnica, estratégica e sistêmica os seguintes itens:

A) Interprete o colapso estrutural do SigaAmazon à luz das Leis de Lehman sobre Evolução de Software. Detalhe como a "Lei da Mudança Contínua" e a "Lei da Complexidade Crescente" se manifestam concretamente na situação descrita da empresa na Amazônia.
B) Discuta os riscos letais que a continuidade da "Manutenção Corretiva" improvisada (sem refatoração ou engenharia reversa) traz para a qualidade e a sustentabilidade das operações logísticas e financeiras da empresa. 
C) Embase tecnicamente as diferenças práticas entre realizar uma Manutenção Adaptativa (focada em novas tecnologias, como a predição por IA) em oposição à Manutenção Perfectiva, relacionando como o monolito prejudica ambas as categorias na situação atual.
D) Proponha uma estratégia executiva e metodológica para a Evolução do Sistema e Gestão do Legado. Justifique a recusa do modelo "Big Bang" e defenda práticas modernas inovadoras, como Reengenharia Gradual, Encapsulamento (Wrapping via APIs) ou Estrangulamento (Strangler Fig Pattern), provando que é possível modernizar para arquiteturas em nuvem (previsão de secas e drones) sem comprometer as rotas vitais de abastecimento atuais.

***
*Fim do Modelo A - Boa Prova!*
