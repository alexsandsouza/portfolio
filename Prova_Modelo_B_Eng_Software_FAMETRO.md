# CENTRO UNIVERSITÁRIO CEUNI - FAMETRO
**Disciplina:** Engenharia de Software
**Professor:** Alexsander F. de Souza
**Curso:** Ciência da Computação (5º Período)
**Avaliação Institucional N2 (MODELO B)**

---

## 🧠 PARTE 1 - QUESTÕES OBJETIVAS (Valor total: 6,0 pontos | 0,75 cada)

**QUESTÃO 1 (Dificuldade: Difícil)**

**Contexto:**
A "GovTech Brasil", uma startup de grande porte, foi contratada para desenvolver o portal nacional de serviços ao cidadão, que deve rodar simultaneamente em web, terminais de autoatendimento e aplicativos móveis. O contrato estipula uma regra rigorosa de acessibilidade governamental: dependendo do perfil de visão do usuário registrado no banco de dados (Visão Normal, Visão Subnormal ou Daltonismo Severo), todo o portal deve instanciar dinamicamente e instantaneamente uma "família" completa de componentes de interface gráfica correspondentes (botões de alto contraste, menus com texturas específicas, painéis de leitura expandida). A equipe inicial cometeu o erro de encher o código com centenas de instruções "if/else" para verificar o perfil de cada usuário toda vez que um botão ou barra de rolagem era instanciado na tela. A arquitetura colapsou por extrema complexidade visual e acoplamento. O líder técnico exigiu que o código fosse reconstruído para que o sistema pudesse solicitar uma "fábrica" de componentes baseada no perfil do usuário, e que essa fábrica fosse responsável por garantir que todos os componentes da interface instanciados pertencessem à mesma família visual compatível, sem misturar componentes de alto contraste com componentes normais acidentalmente.

**Questão:**
Diante da necessidade imperativa de criar famílias inteiras de componentes gráficos compatíveis entre si, isolando a lógica de criação e evitando misturar estilos diferentes em tempo de execução, qual padrão de projeto criacional deve ser adotado pela arquitetura do portal gov.br?

A) Padrão Decorator, adicionando comportamentos dinâmicos de contraste visual a cada botão isolado sem precisar alterar a estrutura interna de todas as classes da família de componentes.
B) Padrão Abstract Factory, fornecendo uma interface central para criar famílias de objetos gráficos (botões, painéis, menus) relacionados ou dependentes entre si, sem especificar rigidamente suas classes concretas no código principal.
C) Padrão Command, encapsulando as requisições de criação de tela como objetos de comando para permitir que o usuário faça reversões (undo/redo) em suas escolhas visuais de daltonismo.
D) Padrão Builder, focando passo a passo na construção complexa de um único e gigante componente de leitura, independentemente das famílias visuais e ignorando os componentes de botões.
E) Padrão Iterator, percorrendo exaustivamente todas as matrizes de cor em coleções complexas para selecionar o pixel exato de contraste necessário antes de montar a interface gráfica do cidadão.

**Unidade Didática:** 05

**Gabarito:** B

**Justificativa:**
A alternativa correta é a B. O padrão Abstract Factory é especificamente projetado para resolver problemas onde é necessário criar "famílias de objetos dependentes ou relacionados sem especificar suas classes concretas". Ao usar o Abstract Factory, o sistema cria uma fábrica específica (ex: FabricaAltaAcessibilidade) que garantirá que todos os botões, menus e painéis criados combinem entre si, eliminando o acoplamento e os "ifs/elses" espalhados pelo código. A) Decorator adiciona responsabilidades a objetos individuais, não cria famílias; C) Command é para ações/logs, não criação de componentes visuais familiares; D) Builder foca na construção de um único objeto complexo passo a passo (ex: gerar um documento inteiro), não em garantir consistência de uma família de múltiplos objetos intercambiáveis; E) Iterator é para percorrer coleções (listas, pilhas), não para criação gráfica.

---

**QUESTÃO 2 (Dificuldade: Difícil)**

**Contexto:**
Uma companhia de tecnologia de precisão agrícola no Centro-Oeste lançou uma linha de tratores pulverizadores totalmente autônomos. A equipe de engenharia de software elaborou extensos manuais técnicos definindo que a latência de comunicação com o satélite não deveria exceder 50 milissegundos, que os motores de direção respondessem em 200 milissegundos e que a leitura do trajeto por GPS usasse algoritmos Dijkstra com 100% de precisão. O time de Qualidade (QA) aplicou simulações virtuais intensas, atestando que todas as métricas técnicas da especificação foram integralmente atendidas. Contudo, ao ser colocado nas fazendas reais de soja, os tratores demonstraram um comportamento desastroso: eles seguiam as rotas GPS com precisão milimétrica, mas não possuíam capacidade de reconhecer que o solo estava excessivamente encharcado após chuvas fortes. O sistema, apesar de tecnicamente irretocável segundo a especificação, afundava os tratores na lama e destruía a plantação, causando milhões em prejuízo aos agricultores, revelando um distanciamento grave das realidades da agricultura prática.

**Questão:**
À luz da literatura de Engenharia de Software focada em Qualidade, a falha do trator ao destruir a plantação (mesmo atendendo todas as rígidas especificações do satélite e GPS) reflete diretamente um fracasso em qual atividade fundamental e por qual motivo conceitual?

A) Fracasso na Verificação, pois a latência do satélite estava sendo superestimada, resultando em respostas inadequadas do hardware durante tempestades magnéticas.
B) Fracasso simultâneo em Verificação e Manutenção Preventiva, demonstrando que os testes unitários da equipe não incluíram bibliotecas de reconhecimento climático global.
C) Fracasso na Validação, uma vez que a equipe construiu o "software de forma correta" (aderente ao manual GPS), mas falhou em construir o "software correto" (que atendesse à real e complexa necessidade de campo do agricultor no uso cotidiano).
D) Fracasso na Engenharia de Domínio, pois o sistema utilizou erroneamente o algoritmo de Dijkstra, que é matematicamente comprovado como ineficiente para fazendas do Centro-Oeste.
E) Fracasso na Certificação CMMI Nível 5, obrigando a empresa de tratores a retornar à codificação puramente mecânica sem a intervenção de sensores autônomos falhos.

**Unidade Didática:** 05

**Gabarito:** C

**Justificativa:**
A alternativa correta é a C. O caso é um exemplo clássico da diferença entre Verificação (fazer o produto certo segundo a especificação técnica) e Validação (fazer o produto correto que resolve o problema no mundo real). A Verificação foi um sucesso (software rodou rápido, GPS preciso, cumpriu manuais). A Validação foi um fracasso monumental, porque o software não resolveu o problema do usuário (agricultor) no seu contexto de uso (trator afundou na lama, cenário não previsto na especificação técnica). A) Errada pois o texto diz que atendeu às especificações (Verificação OK); B) Confunde manutenção com atividades de validação e insere tecnologias não pertinentes; D) Problema de negócio e validação com o cliente final, não uma falha matemática do algoritmo Dijkstra em si; E) Certificação CMMI não garante automaticamente validação empírica de uso e voltar ao passado não resolve o conceito testado.

---

**QUESTÃO 3 (Dificuldade: Difícil)**

**Contexto:**
O principal banco cooperativo do país decidiu lançar o "BankApp 3.0", um aplicativo móvel voltado para concessão instantânea de crédito rural. Durante o ciclo de desenvolvimento, a equipe técnica realizou exaustivos testes de unidade para os cálculos de juros. Em seguida, acoplaram os bancos de dados locais aos serviços de mensageria e executaram testes de integração, comprovando que as conexões não deixavam transações financeiras perdidas na rede. Com 100% dos relatórios de engenharia positivos, a diretoria liberou o aplicativo para um comitê fechado de gerentes das agências rurais antes do lançamento para o público. Após três dias de uso, o comitê reprovou completamente a entrega. Eles relataram que, apesar de não existirem bugs matemáticos, a interface era tão confusa, a jornada de clique era tão exaustiva e os jargões financeiros eram tão rebuscados, que os produtores rurais jamais conseguiriam aprovar um empréstimo sozinhos. A liberação teve que ser abortada.

**Questão:**
O relato do colapso no lançamento do BankApp 3.0 para as agências rurais evidencia a ausência ou má condução de um nível específico de teste, que deveria ter garantido o alinhamento com a expectativa de quem vai consumir o produto. Qual foi esse nível de teste faltante?

A) O Teste de Desempenho (Carga), que deve ser o último nível aplicado para garantir que cem mil produtores rurais consigam acessar o aplicativo nos mesmos milissegundos sem congelar os servidores do banco.
B) O Teste de Regressão, cuja execução é obrigatória para assegurar que as versões 1.0 e 2.0 do BankApp não sejam acidentalmente desinstaladas dos dispositivos móveis dos clientes.
C) O Teste de Aceitação (User Acceptance Testing - UAT), que é focado na perspectiva do usuário de negócio e verifica se o sistema atende aos critérios subjetivos e reais de uso, satisfação e usabilidade no cenário operacional final.
D) O Teste de Caixa-Branca (Estrutural), necessário para expor as vulnerabilidades nas rotinas internas de criptografia que foram ocultadas durante os testes dos gerentes.
E) O Teste de Integração Contínua, responsável por unificar o cálculo dos juros às tabelas de crédito rural diretamente nos data centers das fazendas inteligentes.

**Unidade Didática:** 05

**Gabarito:** C

**Justificativa:**
A alternativa correta é a C. Os Testes de Aceitação são os testes de validação final (geralmente executados pelo cliente, usuário final ou especialistas do domínio). O objetivo não é mais achar falhas no código (bugs, matemática, integrações — que já passaram), mas verificar se o sistema está pronto e utilizável para o fim a que se destina no mundo real, resolvendo o problema do cliente e possuindo usabilidade adequada. A reprovação pelos gerentes ocorreu justamente pela inusabilidade, falha típica de Aceitação. A) Errada porque o foco da reprovação não foi queda por excesso de usuários (carga); B) Regressão não lida com usabilidade inicial, mas sim em não quebrar o que já funcionava em código; D) Caixa-branca olha para o código, e o código estava matematicamente certo; E) Integração Contínua é prática de desenvolvimento/DevOps, não o tipo de teste final focado no usuário.

---

**QUESTÃO 4 (Dificuldade: Difícil)**

**Contexto:**
A gerência de um consórcio aeroespacial europeu analisou o histórico de falhas críticas de seus softwares satelitais da década passada. Os relatórios indicaram que a esmagadora maioria dos defeitos inseridos nos algoritmos orbitais eram decorrentes da prática dos programadores de escrever rotinas densas de código e delegar, apenas ao final do trimestre, a confecção dos scripts de verificação para uma equipe terceirizada. Os códigos eram monolíticos e praticamente impossíveis de serem testados isoladamente (não-testáveis). Para a nova geração de satélites, a direção exigiu a adoção estrita do Desenvolvimento Orientado a Testes (TDD). Essa exigência determinou que os engenheiros mudassem sua cultura de trabalho diária, implementando um ciclo onde a automação falha deve obrigatoriamente preceder a codificação lógica, mudando substancialmente a arquitetura estrutural do sistema em direção a microsserviços altamente isolados.

**Questão:**
Diante do imperativo da mudança de cultura do consórcio aeroespacial para a técnica TDD (Test-Driven Development), qual afirmação reflete de forma fidedigna a principal vantagem de engenharia estrutural proporcionada por essa inversão da ordem de codificação?

A) A eliminação de analistas de negócios, pois os testes se tornam os únicos responsáveis por ditar as estratégias espaciais comerciais em detrimento dos requisitos orbitais estáticos.
B) O redirecionamento exclusivo dos esforços técnicos para a documentação textual, já que os códigos que passam no TDD não necessitam ser lidos ou refatorados posteriormente por seres humanos.
C) A indução obrigatória à criação de códigos altamente modulares, desacoplados e desenhados especificamente para serem testáveis, garantindo que o comportamento esperado atue como a fundação arquitetural da programação.
D) O bloqueio metodológico da refatoração de código legado, impedindo que a equipe europeia utilize componentes pré-testados nas missões satelitais da década anterior por não estarem em formato ágil.
E) A extinção das atividades de Integração Contínua, uma vez que a técnica TDD garante que nenhum servidor jamais falhará, anulando a precisão das tubulações de build e deploys orbitais.

**Unidade Didática:** 05

**Gabarito:** C

**Justificativa:**
A alternativa correta é a C. A principal vantagem na engenharia proporcionada pelo TDD é que, ao escrever o teste primeiro, o desenvolvedor é forçado a projetar (fazer o design) da classe ou função pensando em como ela será chamada e testada. Isso induz naturalmente a um código muito mais coeso, desacoplado (para permitir simulações e injeções de dependência) e modular. O design orientado ao teste resolve o problema histórico dos códigos "in-testáveis". As demais opções são refutações absurdas da prática: TDD não elimina analistas (A), não anula refatoração ou ignora legibilidade humana (B e D) e atua perfeitamente em conjunto e de forma integrada com as esteiras de Integração Contínua (CI/CD) em DevOps, não as extinguindo (E).

---

**QUESTÃO 5 (Dificuldade: Difícil)**

**Contexto:**
O "SigaEDU", um sistema governamental de gestão de universidades estaduais, foi desenvolvido em 2010 utilizando arquiteturas centralizadas de cliente-servidor para cadastrar diplomas impressos e históricos escolares de papel. Há mais de sete anos, o departamento estadual de TI proíbe a implementação de novas ferramentas no sistema, congelando seu escopo e apenas corrigindo bugs eventuais. Contudo, as novas diretrizes do Ministério da Educação (MEC) exigem que todas as universidades suportem ensino a distância, emissão de diplomas digitais em blockchain e inteligência artificial para detecção de evasão estudantil. Devido à paralisação do desenvolvimento e congelamento das tecnologias antigas do "SigaEDU", diversas pró-reitorias passaram a adquirir softwares paralelos não integrados e planilhas eletrônicas na nuvem para suprir suas necessidades emergenciais, tornando o sistema antigo ignorado e obsoleto perante os reitores. 

**Questão:**
Com base nas clássicas Leis de Lehman referentes à Evolução e Dinâmica de Sistemas de Software, qual lei fundamental descreve e explica o fenômeno de obsolescência tecnológica e o distanciamento das demandas sofridos de maneira sistêmica pelo "SigaEDU"?

A) A Lei do Crescimento Contínuo, que afirma que os sistemas universitários tendem a expandir sua infraestrutura de hardware até entrarem em colapso energético, abandonando o software de 2010.
B) A Lei da Complexidade Decrescente, ditando que à medida que os anos passam, a exclusão de novas funcionalidades reduz milagrosamente os erros do software e diminui o valor de negócio do mesmo.
C) A Lei da Qualidade em Declínio (ou Declínio da Familiaridade), que prova que o congelamento das inovações gera instabilidade matemática e destrói o banco de dados das universidades em sete anos.
D) A Lei da Mudança Contínua (Lei 1), que postula que um programa de software de uso no mundo real deve necessariamente sofrer adaptações evolutivas ou perderá progressivamente sua utilidade e satisfação em seu ambiente operacional dinâmico.
E) A Lei do Esforço Constante, que determina que as equipes de TI devem ser trocadas a cada sete anos, ou as regulamentações do MEC serão sumariamente rejeitadas por incapacidade técnica gerencial.

**Unidade Didática:** 06

**Gabarito:** D

**Justificativa:**
A alternativa correta é a D. A Primeira Lei de Lehman (Lei da Mudança Contínua) declara que "um sistema tipo-E (do mundo real) deve sofrer mudanças contínuas ou tornar-se progressivamente menos útil e menos satisfatório nesse ambiente". Como o SigaEDU teve seu desenvolvimento congelado e o ambiente real sofreu fortes mutações (MEC exigindo blockchain, Ensino a Distância, evasão escolar), o sistema perdeu sua utilidade prática no ambiente acadêmico, sendo abandonado por softwares paralelos. As demais alternativas (A, B, C e E) são distorções nominais, inversões e invenções conceituais baseadas equivocadamente em interpretações físicas ou não relacionadas às métricas evolutivas da engenharia de software de Lehman.

---

**QUESTÃO 6 (Dificuldade: Difícil)**

**Contexto:**
O "SysSaúde", um ecossistema de software operado por um conglomerado de hospitais da rede privada, passou por uma série de intensas intervenções técnicas executadas pela sua equipe de engenharia em resposta à transição da empresa. Nas documentações oficiais da área de gerência de TI, foram mapeados rigorosamente três pacotes de alterações durante o semestre:
1) Inclusão de um novo protocolo de comunicação HL7 v3 para permitir que o sistema continuasse funcionando nas novas versões de aparelhos de ressonância magnética adquiridos recentemente do exterior.
2) Alteração radical nos algoritmos de indexação do banco de dados relacional e compressão de logs para otimizar drasticamente a velocidade de busca pelo histórico de cirurgias.
3) Reparo emergencial no módulo de faturamento UTI, onde uma variável inteira estourou o limite e estava calculando o valor negativo para medicamentos de alto custo.

**Questão:**
Segundo os princípios fundamentais e a categorização internacional aceita para os Tipos de Manutenção de Software (Corretiva, Adaptativa e Perfectiva), como se classificam técnica e sucessivamente as intervenções 1, 2 e 3 realizadas pela equipe no "SysSaúde"?

A) 1 - Corretiva; 2 - Perfectiva; 3 - Adaptativa.
B) 1 - Adaptativa; 2 - Corretiva; 3 - Perfectiva.
C) 1 - Perfectiva; 2 - Adaptativa; 3 - Corretiva.
D) 1 - Adaptativa; 2 - Perfectiva; 3 - Corretiva.
E) 1 - Preventiva; 2 - Corretiva; 3 - Perfectiva.

**Unidade Didática:** 06

**Gabarito:** D

**Justificativa:**
A alternativa correta é a D. 
1) Inclusão de protocolo para suportar um novo hardware (ambiente externo operando o software): Manutenção Adaptativa (mudar para o software se adaptar a um novo ambiente ou sistema operacional ou hardware).
2) Otimização estrutural para melhorar o desempenho e resposta do sistema, sem alterar as funcionalidades básicas para os pacientes e sem consertar quebras sistêmicas: Manutenção Perfectiva (melhorar a estrutura ou arquitetura interna de eficiência e sustentabilidade).
3) Correção emergencial de um erro aritmético e lógico real que gerava falha de operação financeira nos faturamentos de UTI: Manutenção Corretiva (consertar um bug ou defeito encontrado pelos usuários ou suporte técnico).

---

**QUESTÃO 7 (Dificuldade: Difícil)**

**Contexto:**
Uma inovadora desenvolvedora de jogos eletrônicos para dispositivos móveis estava perdendo milhões de dólares. A cada lançamento de temporada mensal, o processo de empacotamento, compilação de código de centenas de engenheiros, testes visuais manuais demorados e a submissão aos servidores mundiais de nuvem demorava quase seis dias. O fluxo "feito à mão" era caótico: arquivos importantes eram esquecidos fora dos pacotes, introduzindo telas pretas massivas, e as lojas de aplicativos bloqueavam o jogo. Em resposta à crise, o CTO introduziu as práticas arquitetônicas e culturais de Integração Contínua (CI) e Entrega Contínua (CD). A equipe agora submete código dezenas de vezes por dia em um repositório central; scripts automáticos compila o código na nuvem, rodam milhares de testes de colisão e rede, empacotam o artefato final e o posicionam, infalivelmente, pronto para implantação (release) com apenas um clique autorizado. O resultado foi a queda drástica de defeitos na versão do usuário e entregas sem estresse técnico noturno para a engenharia.

**Questão:**
Ao adotar efetivamente o ciclo de CI/CD (Continuous Integration / Continuous Delivery), qual consequência prática primária transformou a capacidade executiva da desenvolvedora de jogos eletrônicos?

A) O isolamento radical das equipes artísticas, que passaram a integrar seus blocos de cenários gráficos apenas uma vez por ano para evitar qualquer conflito nas branches dos desenvolvedores lógicos.
B) A dispensa massiva de qualquer infraestrutura em nuvem, dado que o processo contínuo compila inteiramente o ecossistema do jogo de forma descentralizada nos smartphones dos jogadores finais.
C) A automação repetível do ciclo de vida das compilações e das validações por testes de software, permitindo mesclagem muito frequente, redução de riscos operacionais e disponibilização segura do artefato para implantação contínua.
D) A extinção incondicional da figura do Diretor Técnico, uma vez que o mecanismo de Entrega Contínua (CD) escreve por si próprio as linhas de programação das mecânicas de jogos 3D complexos, substituindo o papel da engenharia humana.
E) A obrigatoriedade absoluta do retorno ao desenvolvimento unificado em metodologias ágeis de extrema lentidão, atrasando as entregas para garantir o faturamento manual exaustivo nas lojas de aplicativo.

**Unidade Didática:** 06

**Gabarito:** C

**Justificativa:**
A alternativa correta é a C. A premissa central de CI/CD é remover a complexidade falha de integração manual que se faz ao final do ciclo. Com Integração Contínua (CI), o código é mesclado inúmeras vezes por dia, testado imediatamente por esteiras automatizadas (pipelines). Com Entrega Contínua (CD), o código validado é sempre colocado em um estado impecável e repetível que pode ser implantado de forma segura em produção a qualquer instante autorizado, anulando dias estressantes e reduzindo riscos de implantação. A) Vai de encontro à "Integração" ágil e diária; B) Errado, o processo se utiliza intensamente das máquinas em nuvem (servidores de CI, GitLab, Jenkins) para compilar; D) Ferramentas de CI/CD não programam lógicas sozinhas nem suprimem diretores; E) CI/CD acelera a entrega e apoia o método ágil, não a lentidão extrema ou burocracia manual.

---

**QUESTÃO 8 (Dificuldade: Difícil)**

**Contexto:**
A Secretaria de Segurança Pública de uma metrópole depende diretamente de um Sistema de Registro Policial Legado (SRPL). O software, desenvolvido nos anos 90 utilizando linguagem estruturada procedural, rodando em terminais de tela verde, é insubstituível. Ele contém mais de cinquenta milhões de ocorrências integradas fisicamente a processos do poder judiciário. O sistema apresenta altíssima fragilidade perante manutenções, impossibilidade de criar comunicação via APIs e não dispõe de interface acessível a smartphones modernos usados nas viaturas da polícia investigativa. O alto comando ordenou a modernização imediata, mas decretou uma proibição absoluta do encerramento forçado abrupto (modelo substituição de "Big Bang") por motivos de risco sistêmico incalculável ao Estado. Diversas estratégias para Sistemas Legados foram levantadas pelos consultores.

**Questão:**
Diante do contexto e do alto risco envolvido, e levando em consideração a determinação irrevogável do estado de não utilizar o modelo de "Big Bang", qual é a estratégia mais recomendada da Engenharia de Software para evoluir estruturalmente esse massivo e valioso sistema penal de modo seguro e responsivo para novas tecnologias policiais?

A) Aplicar a estratégia de descarte instantâneo por decurso de prazo, ignorando a proibição estadual, formatando todos os discos do sistema legado e construindo uma nova arquitetura nativa em nuvem sob caos programado para incentivar a inovação ágil.
B) Recusar categoricamente o desenvolvimento de interfaces móveis e focar na expansão dos terminais em tela verde para todas as viaturas com acesso por cabo, estabilizando e preservando inalterada a obsolescência tecnológica.
C) Adotar a estratégia de Reengenharia Evolutiva e Wrappers (Encapsulamento), mantendo temporariamente as lógicas do núcleo do legado mas desenvolvendo invólucros em APIs modernas de serviço que conectem gradativamente as funções antigas com os novos aplicativos móveis das polícias, mitigando severos riscos paralelos.
D) Transferir de forma compulsória as informações críticas do estado por meio de pen-drives entre viaturas como método assíncrono temporário de modernização, até que os recursos legados percam espontaneamente validade operacional no judiciário.
E) Realizar unicamente a modernização da engenharia social, através da reestruturação hierárquica das delegacias com cursos preparatórios para que as novas gerações de policiais consigam dominar a programação procedural dos anos 90 e criar suas próprias manutenções nativas.

**Unidade Didática:** 06

**Gabarito:** C

**Justificativa:**
A alternativa correta é a C. Lidar com Sistemas Legados altamente críticos de alto valor de negócio (polícia/estado) e obsoleto sem a perigosa quebra de "Big Bang" exige a Modernização/Reengenharia Evolutiva. A técnica de "Wrapping" (encapsular o legado provendo uma camada de API ao redor) permite que o software antigo seja requisitado por tecnologias muito modernas (como os apps mobile nas viaturas), evoluindo componentes do sistema passo a passo sem desligar e quebrar a base de dados principal, controlando os riscos do projeto. As demais afirmativas descrevem abordagens suicidas (A e D), engessamentos obsoletos (B) ou práticas improdutivas inaceitáveis na engenharia de software para evoluir a arquitetura do produto de forma real (E).

---

## 📝 PARTE 2 - QUESTÃO DISCURSIVA (Valor: 4,0 pontos)

**Texto Base / Estudo de Caso**

O Grupo "AgroFronteira", fundado há 25 anos, é um colosso do agronegócio nacional com fazendas gigantescas conectadas do Pantanal aos limites da bacia Amazônica. O coração das operações logísticas e previsões de safras do grupo é orquestrado pelo "SafraControl", um software monolítico complexo desenvolvido na década de 2000 em linguagem Delphi e bancos de dados SQLServer antiquados. Devido ao rápido crescimento de novas pragas, pressões ambientais e o surgimento de legislações estritas de exportação (sustentabilidade), o SafraControl recebeu, ao longo de quinze anos, dezenas de remendos arquiteturais emergenciais diretos em seu banco de dados e rotinas de código macarrônico feitas por diversas consultorias que já faliram. 

Atualmente, o SafraControl possui um índice altíssimo de falhas e paradas durante os picos cruciais da época de colheita. Os bugs financeiros do sistema e os atrasos nos relatórios agronômicos já causaram milhões em multas na exportação internacional. A nova diretoria de tecnologia global do Grupo AgroFronteira tem um projeto estratégico inegociável: integrar o sistema com milhares de sensores de Internet das Coisas (IoT) espalhados no solo e milhares de drones de monitoramento contínuo sobre as plantações para uso de Inteligência Artificial de precisão extrema.

Entretanto, o arquiteto chefe advertiu com severidade que a estrutura podre e inalterável do legado do SafraControl inviabiliza qualquer integração com nuvem ou IoT de alta frequência. Alguns engenheiros mais jovens insistem apaixonadamente que a solução ideal seria desligar os servidores do SafraControl num feriado nacional e subir um sistema de nuvem do zero ("Big Bang") durante uma semana, mas os gerentes operacionais de lavoura rejeitaram visceralmente essa tese, alegando que um dia sem controle total levará à perda de metade das safras armazenadas. 

**Enunciado**

Atuando como o Líder Arquiteto de Software contratado para resolver a encruzilhada sistêmica e evolutiva do Grupo AgroFronteira, redija um texto dissertativo-argumentativo estruturado (mínimo de 30 linhas), direcionado ao conselho administrativo global, analisando as complexidades e propondo diretrizes técnicas abordando os seguintes itens:

A) Utilize a perspectiva das Leis de Lehman (com ênfase na "Qualidade em Declínio" e na "Complexidade Crescente") para explicar aos diretores e executivos as razões lógicas da fragilidade, dos altos custos atuais e dos colapsos constantes do SafraControl após quinze anos de correções e "remendos" sucessivos sem refatoração.
B) Discorra criticamente sobre os riscos catastróficos, tanto de engenharia de software quanto financeiros operacionais da safra, presentes na estratégia da abordagem de substituição do sistema em modelo "Big Bang" sugerida pelos engenheiros mais jovens.
C) Defina categoricamente os conceitos das manutenções de software corretiva, adaptativa e perfectiva. Após as definições, demonstre como as urgências contínuas em atuar apenas no modo "Corretivo" na empresa asfixiaram o orçamento que impediu as essenciais manutenções "Adaptativas" (inclusão de tecnologias para IoT e Nuvem) no cenário da AgroFronteira ao longo dos anos.
D) Proponha e sustente uma estratégia arquitetônica definitiva de "Modernização Gradual do Sistema Legado". Descreva as práticas de encapsulamento seguro (Wrapping) e uso do padrão Estrangulador (Strangler Fig Pattern), evidenciando de forma decisiva como o grupo passará a adotar as integrações inovadoras com drones e satélites sem impactar ou imobilizar a colheita em tempo real nas fazendas e a exportação diária.

***
*Fim do Modelo B - Boa Prova!*
