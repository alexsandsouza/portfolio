// ─── QUESTIONS DATA - MODELO A ───────────────────────────────────────────────
export const QUESTIONS_A = [
  {
    id: 1,
    theme: "Swing & Concorrência",
    text: "**Contexto Profissional:** Uma empresa de logística desenvolveu um módulo de monitoramento de frota usando Java Swing. O botão 'Atualizar Telemetria' dispara uma consulta pesada em uma API externa, retornando dados de milhares de veículos para exibição no mapa.\n\n**O Problema:** Durante a homologação, observou-se que a tela do sistema fica travada e sem responder a cliques, redimensionamento ou minimização até que o processo de rede termine, pois a chamada foi programada diretamente na Thread de Despacho de Eventos (EDT).\n\n**Questão:** Qual abordagem técnica é recomendada para gerenciar a execução da tarefa de rede sem congelar a interface gráfica?",
    options: [
      "A) Encapsular a lógica de rede em um objeto SwingWorker, que separa o processamento pesado do método de atualização de interface, integrando o resultado de forma segura à EDT.",
      "B) Iniciar uma nova instância de Thread dentro do método de clique e invocar o método sleep() para aguardar a resposta antes de atualizar os componentes visuais diretamente na thread principal.",
      "C) Adicionar uma nova camada de interface gráfica que sobrescreva o comportamento de eventos, permitindo que a EDT continue capturando cliques enquanto a rede processa os dados em paralelo.",
      "D) Utilizar um temporizador javax.swing.Timer com intervalo fixo para realizar a requisição de rede, garantindo que a interface verifique a cada segundo se os dados já foram recebidos pelo sistema.",
      "E) Substituir a estrutura de eventos por um MouseListener que execute a consulta de rede em um processo separado, sem necessidade de sincronização de estados entre a thread de rede e a interface."
    ],
    answer: "A",
    feedback: "O SwingWorker é a classe nativa do Java Swing para realizar tarefas em background. Ela divide a execução pesada (no método doInBackground) de atualizações visuais na Thread de Despacho de Eventos (EDT) através do método done()."
  },
  {
    id: 2,
    theme: "Design Patterns (Observer)",
    text: "**Contexto Profissional:** Em um sistema de prontuários médicos em Java, o painel de 'Dados do Paciente' deve notificar o painel de 'Histórico de Exames' sempre que um novo paciente for selecionado na lista.\n\n**O Problema:** Atualmente, a classe responsável pela lista possui referências diretas a todos os outros painéis. Esse acoplamento excessivo torna a manutenção rígida, fazendo com que a adição de novos painéis exija alterações na lista.\n\n**Questão:** Qual padrão de projeto deve ser adotado para permitir que múltiplos componentes sejam notificados automaticamente sobre alterações na seleção, reduzindo o acoplamento?",
    options: [
      "A) Utilizar herança múltipla entre os painéis de visualização e a classe da lista, facilitando o acesso aos dados e aos métodos de atualização de forma nativa pela hierarquia.",
      "B) Criar uma classe controladora central que possua métodos para todos os painéis, delegando a responsabilidade de atualização para uma instância global de gerenciamento de UI.",
      "C) Implementar o padrão Observer, permitindo que os painéis interessados se registrem na lista de pacientes e recebam notificações de mudança quando o estado for alterado.",
      "D) Configurar os painéis de visualização como classes internas da lista de pacientes, permitindo que o acesso a campos privados e métodos de estado seja realizado sem barreiras.",
      "E) Definir métodos estáticos em uma interface de utilitários que gerencie a referência de todos os painéis ativos no sistema, disparando atualizações conforme a necessidade."
    ],
    answer: "C",
    feedback: "O padrão Observer define uma dependência um-para-muitos entre objetos. Quando o estado da lista muda, todos os painéis registrados como ouvintes são notificados e atualizados automaticamente."
  },
  {
    id: 3,
    theme: "Eventos no Swing & JTextField",
    text: "**Contexto Profissional:** No PDV de um supermercado, utiliza-se um JTextField para entrada do código de barras dos produtos. Quando o usuário digita e pressiona Enter, o sistema busca e insere o item no carrinho.\n\n**O Problema:** O uso do KeyListener gerou comportamento inconsistente com variações de foco e leitores de código de barras rápidos (que simulam digitação), gerando conflitos.\n\n**Questão:** Qual mecanismo é o mais adequado na API Java Swing para capturar com precisão e estabilidade a submissão de dados de um campo de texto?",
    options: [
      "A) Capturar o evento de perda de foco do componente via FocusListener, disparando a validação toda vez que o cursor sair do campo de entrada de texto.",
      "B) Associar um ActionListener ao JTextField, pois este evento dispara quando o usuário pressiona a tecla de confirmação (Enter), abstraindo a complexidade do foco e do teclado.",
      "C) Monitorar as mudanças no documento do campo usando um DocumentListener, validando a cada caractere inserido no campo para garantir que o código esteja correto.",
      "D) Criar uma thread de monitoramento que verifica o conteúdo do campo a intervalos regulares para detectar alterações e processar a busca do produto automaticamente.",
      "E) Utilizar um InputVerifier que bloqueie a saída do campo enquanto os dados digitados não coincidirem com um formato de código de barras válido no banco de dados."
    ],
    answer: "B",
    feedback: "Associar um ActionListener ao JTextField intercepta o envio do campo de texto disparado pela tecla Enter (ou o caractere de terminação enviado por leitores de código de barras), o que garante estabilidade de captura."
  },
  {
    id: 4,
    theme: "Swing Custom Painting & paintComponent",
    text: "**Contexto Profissional:** Uma aplicação de desenho vetorial utiliza um JPanel customizado onde o usuário clica com o mouse para adicionar formas geométricas.\n\n**O Problema:** O desenvolvedor programou os desenhos diretamente no Graphics retornado na escuta do clique do mouse. Ao maximizar, minimizar ou mover outra janela por cima do aplicativo, os elementos desenhados desaparecem da tela.\n\n**Questão:** Qual procedimento técnico é correto para assegurar a persistência dos elementos gráficos em um JPanel customizado?",
    options: [
      "A) Invocar o método repaint() dentro do método mouseClicked, desenhando a forma diretamente no objeto Graphics passado pelo evento de mouse para garantir a permanência na tela.",
      "B) Armazenar as coordenadas e propriedades das formas em uma estrutura de dados e iterar sobre essa coleção dentro do método paintComponent para redesenhar o estado a cada chamada.",
      "C) Desenhar as formas em um buffer estático fora do componente, exibindo esse buffer no paintComponent sem depender de coleções de dados internos do painel.",
      "D) Criar componentes visuais individuais para cada forma geométrica e adicioná-los como filhos do JPanel utilizando um gerenciador de layout para organizar os objetos automaticamente.",
      "E) Utilizar uma biblioteca externa que capture a imagem do componente a cada clique e a aplique como plano de fundo, evitando a necessidade de redesenhar os objetos individuais."
    ],
    answer: "B",
    feedback: "A pintura no Swing é reativa e pode ser redesenhada pelo sistema a qualquer momento. Para persistir as formas, deve-se salvá-las em um modelo de dados (como uma lista) e redesenhá-las iterativamente dentro de paintComponent(Graphics g)."
  },
  {
    id: 5,
    theme: "SOLID (Single Responsibility Principle)",
    text: "**Contexto Profissional:** Em um sistema bancário, a classe ProcessadorTransacao gerencia cálculos de câmbio, formatação de PDF de comprovantes, validação de saldos em conta e envio de e-mails para os clientes.\n\n**O Problema:** Com milhares de linhas, a classe tornou-se difícil de manter. Alterar o design do PDF de comprovantes gera riscos de regressão no cálculo tributário de câmbio, violando a coesão.\n\n**Questão:** Qual mudança arquitetural atende de forma fidedigna ao princípio SOLID da Responsabilidade Única (SRP)?",
    options: [
      "A) Dividir a classe ProcessadorTransacao em classes menores, como CalculadorTaxa, GeradorComprovante, ValidadorSaldo e ServicoNotificacao, garantindo que cada uma tenha um motivo específico para mudança.",
      "B) Refatorar a classe para utilizar herança múltipla, criando subclasses especializadas que herdam a lógica central e sobrescrevem apenas os métodos de formatação e envio de mensagens.",
      "C) Agrupar todos os métodos da classe em uma interface única que defina os contratos de negócio, forçando todas as subclasses a implementarem as funcionalidades de forma customizada.",
      "D) Converter todos os métodos da classe em estáticos dentro de uma classe de utilitários, permitindo que o sistema acesse as funcionalidades sem precisar instanciar o objeto de transação.",
      "E) Manter a estrutura atual, porém encapsulando a lógica de negócio em métodos privados, para que o código de formatação não acesse diretamente os dados financeiros da classe."
    ],
    answer: "A",
    feedback: "O SRP prega que uma classe deve ter apenas um motivo para mudar. Dividir o processador em classes coesas separa as diferentes razões de mudança (regras fiscais, formato do PDF, banco de dados, e-mails)."
  },
  {
    id: 6,
    theme: "Design Patterns (Strategy)",
    text: "**Contexto Profissional:** Um e-commerce possui uma classe para gerenciar a recomendação de produtos com base no histórico de compras, popularidade e tendências sazonais.\n\n**O Problema:** A escolha da estratégia é executada por um bloco extenso de condicionais if-else. A inclusão de novas técnicas de recomendação exige modificar a classe central e expõe o código a falhas de regressão.\n\n**Questão:** Qual padrão de projeto GoF é indicado para encapsular e alternar algoritmos em tempo de execução?",
    options: [
      "A) Strategy, permitindo que cada algoritmo de recomendação seja encapsulado em uma classe dedicada, sendo intercambiável pela classe que consome o serviço.",
      "B) Singleton, assegurando que apenas uma instância de cada algoritmo de recomendação exista na memória, otimizando o consumo de recursos durante a execução.",
      "C) Factory Method, centralizando a criação de instâncias de algoritmos em um método estático que retorna o objeto adequado conforme o tipo de usuário.",
      "D) Adapter, transformando a interface dos algoritmos legados em uma interface compatível com o novo motor de recomendação, facilitando a integração de sistemas externos.",
      "E) Observer, permitindo que os algoritmos sejam notificados sempre que o perfil do usuário mudar, disparando a atualização do gráfico de recomendações automaticamente."
    ],
    answer: "A",
    feedback: "O padrão Strategy encapsula algoritmos intercambiáveis sob uma interface comum. Isso permite alterar ou estender os algoritmos de recomendação dinamicamente sem modificar a classe consumidora."
  },
  {
    id: 7,
    theme: "Java Collections & Estruturas de Dados",
    text: "**Contexto Profissional:** Um analisador de tráfego de rede armazena logs de pacotes e precisa remover o log mais antigo (posição 0) à medida que novas mensagens chegam e o buffer lota.\n\n**O Problema:** A equipe usou ArrayList para o buffer, mas a remoção constante do índice zero causou lentidão severa. O ArrayList precisa realizar o deslocamento (shift) em memória de todos os elementos restantes.\n\n**Questão:** Qual estrutura de dados de coleção otimiza a exclusão frequente no início sem perder a ordem sequencial?",
    options: [
      "A) LinkedList, pois sua estrutura de nós encadeados permite a remoção em tempo constante no início da lista, eliminando a necessidade de deslocamento de elementos.",
      "B) HashSet, pois a estrutura garante acesso imediato aos elementos e otimiza a remoção de dados sem a necessidade de manter a ordem sequencial dos logs de rede.",
      "C) Vector, pois a sincronização interna dos métodos garante que a remoção de elementos ocorra de forma segura entre múltiplas threads, mantendo o desempenho.",
      "D) TreeSet, pois a manutenção automática da ordem dos elementos facilita a busca pelos logs mais antigos, acelerando a operação de exclusão por comparação de tempo.",
      "E) PriorityQueue, pois a estrutura organiza os elementos por prioridade de tempo de chegada, permitindo a remoção rápida del elemento com menor valor de timestamp."
    ],
    answer: "A",
    feedback: "A LinkedList organiza os itens em nós encadeados. Excluir o primeiro elemento da lista é uma operação de complexidade O(1) que apenas ajusta o ponteiro inicial, diferentemente do custo O(N) da ArrayList."
  },
  {
    id: 8,
    theme: "SOLID (Dependency Inversion Principle)",
    text: "**Contexto Profissional:** Em um sistema de informações geográficas, a camada de regras de negócio instancia e chama diretamente classes concretas de uma biblioteca de persistência Oracle.\n\n**O Problema:** A empresa precisa migrar a base de dados para PostgreSQL, mas o acoplamento rígido com as classes concretas do fornecedor exige uma refatoração em larga escala em todo o código.\n\n**Questão:** Qual princípio SOLID orienta a desacoplar a lógica de negócio dos detalhes da biblioteca de infraestrutura?",
    options: [
      "A) Encapsulamento de Dados, protegendo os métodos de acesso aos dados dentro de pacotes privados, acessíveis apenas através de métodos getters e setters na camada de negócio.",
      "B) Princípio de Substituição de Liskov, garantindo que qualquer implementação de banco de dados possa substituir a implementação anterior sem quebrar o comportamento do sistema.",
      "C) Princípio de Segregação de Interface, dividindo as interfaces de persistência em métodos menores para que as classes de negócio não dependam de métodos que não utilizam.",
      "D) Princípio Aberto/Fechado, permitindo que a classe de persistência seja estendida por novas subclasses que implementem o suporte a diferentes bancos de dados.",
      "E) Inversão de Dependência (DIP), fazendo com que as classes de negócio dependam de interfaces de abstração de persistência, e não de classes concretas de conexão."
    ],
    answer: "E",
    feedback: "A Inversão de Dependência (DIP) dita que módulos de alto nível não devem depender de módulos de baixo nível (infraestrutura), mas sim de abstrações (interfaces), facilitando a troca do banco de dados."
  }
];

// ─── QUESTIONS DATA - MODELO B ───────────────────────────────────────────────
export const QUESTIONS_B = [
  {
    id: 1,
    theme: "Swing & Concorrência",
    text: "**Contexto Profissional:** Um sistema meteorológico desenvolvido em Java Swing possui o botão 'Importar Histórico Climático' que realiza a leitura de volumosos arquivos CSV.\n\n**O Problema:** O desenvolvedor implementou a rotina de leitura de arquivo diretamente na thread principal (EDT). Com isso, a interface congela e impede a atualização de uma barra de progresso ou o clique no botão 'Cancelar'.\n\n**Questão:** Qual é a técnica adequada para processar a leitura de arquivos mantendo a responsividade do Swing em tempo real?",
    options: [
      "A) Implementar a lógica de leitura no doInBackground de um SwingWorker, atualizando a barra de progresso via publish() e publicando o resultado final seguro na EDT.",
      "B) Utilizar herança direta para criar um botão personalizado que estenda a classe Thread e execute a leitura de arquivos dentro de blocos de processamento síncronos.",
      "C) Substituir a barra de progresso por um elemento gráfico de desenho 2D que atualize seu visual por meio de um loop executado via ActionListener de alta prioridade.",
      "D) Sobrescrever os métodos de escuta do botão de importação para realizar o processamento por meio de loops intermitentes com chamadas estáticas do sistema.",
      "E) Configurar um manipulador de eventos do tipo MouseMotionListener que force a repintura da interface a cada pixel que o cursor se deslocar na tela da aplicação."
    ],
    answer: "A",
    feedback: "O SwingWorker executa a leitura longa em background (doInBackground) e fornece o método publish/process para atualizar de forma segura e responsiva a barra de progresso na EDT."
  },
  {
    id: 2,
    theme: "Design Patterns (Observer)",
    text: "**Contexto Profissional:** No painel de telemetria de um veículo autônomo, a velocidade do carro precisa ser enviada instantaneamente para o Velocímetro, Consumo de Bateria e Histórico de Logs.\n\n**O Problema:** A classe do Sensor está diretamente acoplada às classes concretas das telas, chamando métodos individuais manualmente. Isso impede a adição de novos painéis sem alterar a classe do sensor.\n\n**Questão:** Qual padrão de projeto GoF deve ser utilizado para estabelecer uma comunicação indireta e flexível?",
    options: [
      "A) Definir todos os métodos de atualização como interfaces de execução síncrona dentro de classes internas protegidas pertencentes ao Velocímetro Digital.",
      "B) Adotar uma arquitetura de herança em cadeia onde o sensor herde de cada painel para acessar de maneira nativa as propriedades de formatação do painel.",
      "C) Utilizar o padrão Observer, de modo que os painéis registrem-se como ouvintes no sensor de telemetria e sejam notificados quando o estado do sensor mudar.",
      "D) Empregar uma classe de persistência central que salve o histórico do sensor e force os painéis a realizarem buscas contínuas no banco a cada segundo.",
      "E) Criar adaptadores de classe para converter a leitura de velocidade em formatos que os painéis interpretem por meio de utilitários estáticos no sistema."
    ],
    answer: "C",
    feedback: "O Observer permite que múltiplos painéis ouçam atualizações do sensor de velocidade sem criar conexões rígidas na estrutura de classes, estendendo o sistema facilmente."
  },
  {
    id: 3,
    theme: "Eventos no Swing & JTextField",
    text: "**Contexto Profissional:** Em um terminal de consulta de livros em uma biblioteca, o usuário digita o ISBN no JTextField e confirma a busca teclando Enter.\n\n**O Problema:** O FocusListener apresentou falhas de captura com leitores ópticos manuais, e o uso de KeyListener gerou eventos duplicados e problemas no foco das caixas de diálogo.\n\n**Questão:** Qual a melhor forma de escutar a submissão de dados desse JTextField de forma uniforme?",
    options: [
      "A) Implementar um KeyListener para capturar eventos de liberação de tecla (keyReleased), iniciando a pesquisa a cada caractere inserido pelo usuário.",
      "B) Associar um ActionListener ao JTextField, que intercepta o envio do campo de texto disparado nativamente pelo botão de confirmação ou tecla Enter.",
      "C) Utilizar um InputVerifier configurado para travar o cursor dentro do JTextField enquanto a string digitada for menor do que o padrão ISBN válido.",
      "D) Monitorar as alterações gráficas criando uma thread secundária que verifique a cor do texto digitado no campo gráfico em períodos fixos.",
      "E) Substituir o componente por um JTextArea e registrar listeners para capturar as coordenadas de mouse dentro da janela gráfica do formulário."
    ],
    answer: "B",
    feedback: "O ActionListener no JTextField capta o ato do Enter de forma robusta e abstrata, sendo a abordagem recomendada pela API Swing para submissão de texto."
  },
  {
    id: 4,
    theme: "Swing Custom Painting & paintComponent",
    text: "**Contexto Profissional:** Um painel de exibição de circuitos elétricos estende o JPanel e desenha as conexões dinâmicas utilizando g.drawLine() no método mouseDragged.\n\n**O Problema:** Ao minimizar e abrir novamente a janela, as conexões desenhadas desaparecem completamente da tela do sistema, indicando problemas no ciclo de vida de renderização.\n\n**Questão:** De que forma deve ser reestruturada a pintura para evitar a perda das conexões gráficas?",
    options: [
      "A) Configurar o repaint() para disparar loops curtos no sistema de modo a invalidar o layout e repintar a janela de forma forçada a cada clique.",
      "B) Exportar o layout do JPanel como imagem PNG em tempo real a cada atualização, aplicando a imagem como plano de fundo de forma síncrona.",
      "C) Utilizar herança nos componentes filhos para fazer com que cada fluxograma gerencie de forma independente a chamada do método updateUI.",
      "D) Armazenar os nós e conexões em listas e iterar sobre esses objetos de domínio no método paintComponent para renderizar o diagrama no redesenho.",
      "E) Forçar a retenção do buffer na thread de despacho do sistema operacional para desabilitar o recebimento dos sinais automáticos de repintura."
    ],
    answer: "D",
    feedback: "O objeto Graphics é volatil. Para reter o desenho, as entidades de circuito devem ser mantidas em uma lista de modelo de dados e desenhadas pelo ciclo do paintComponent."
  },
  {
    id: 5,
    theme: "SOLID (Single Responsibility Principle)",
    text: "**Contexto Profissional:** A classe AdministradorNotas processa médias de alunos, exporta boletins em XML, grava registros na base de dados SQL e envia avisos por SMS.\n\n**O Problema:** A falta de coesão exige modificar a classe e testar novamente todas as regras financeiras e acadêmicas mesmo quando apenas o layout do XML ou o fornecedor do SMS muda.\n\n**Questão:** Qual refatoração atende ao princípio SOLID da Responsabilidade Única (SRP)?",
    options: [
      "A) Dividir a classe em classes independentes menores, como CalculadorMedias, GeradorBoletimXml, RepositorioBoletim e ServicoMensageriaSms.",
      "B) Sobrescrever os métodos com herança múltipla baseada em interfaces de negócio para cada tipo de cálculo de média das disciplinas.",
      "C) Unificar as operações em um padrão Singleton estático que centralize todos os acessos do portal acadêmico e evite o acoplamento.",
      "D) Ocultar a rotina de envio de SMS usando escopos protegidos na mesma classe, permitindo o acesso apenas a partir de métodos internos.",
      "E) Encapsular os parâmetros em estruturas internas privadas para isolar as chamadas do banco de dados das demais rotinas visuais."
    ],
    answer: "A",
    feedback: "A divisão em quatro classes independentes e coesas (calculador, gerador, repositório, mensageria) reduz o acoplamento e restringe os motivos de alteração para cada módulo."
  },
  {
    id: 6,
    theme: "Design Patterns (Strategy)",
    text: "**Contexto Profissional:** Um motor de cálculo de impostos de faturamento precisa adotar lógicas fiscais complexas de acordo com a sigla do estado selecionado (ICMS, ISS, etc.).\n\n**O Problema:** A classe central possui um bloco switch-case robusto. A expansão para novos estados exige modificações diretas nesse fluxo condicional central, dificultando testes isolados.\n\n**Questão:** Qual padrão de projeto GoF deve ser utilizado para encapsular estes algoritmos dinâmicos?",
    options: [
      "A) Facade, para criar um subsistema robusto de cálculo e ocultar as chamadas complexas sob uma classe de persistência centralizada.",
      "B) Factory Method, para instanciar a calculadora de impostos por meio de parâmetros estáticos que representem o local tributário do cálculo.",
      "C) Command, para enfileirar as solicitações tributárias e executá-las por prioridade de faturamento em segundo plano na aplicação.",
      "D) Template Method, para estruturar o algoritmo fiscal em passos definidos na superclasse, sobrescrevendo os métodos nas subclasses concretas.",
      "E) Strategy, para definir uma interface comum de imposto e criar classes concretas para cada estado, alternando-as via composição na calculadora."
    ],
    answer: "E",
    feedback: "O padrão Strategy permite extrair as lógicas de impostos para classes separadas com uma interface comum, bastando injetá-las por composição na calculadora central."
  },
  {
    id: 7,
    theme: "Java Collections & Estruturas de Dados",
    text: "**Contexto Profissional:** Em um editor de texto, o buffer do histórico de desfazer (Undo) armazena até 500 comandos. Ao lotar, o comando mais antigo no índice 0 é eliminado.\n\n**O Problema:** A utilização de ArrayList provocou gargalos de desempenho ao remover do início, pois a JVM precisa arrastar todos os demais elementos subsequentes em memória.\n\n**Questão:** Qual coleção da Java Collections Framework resolve a ineficiência de remoção do índice zero?",
    options: [
      "A) LinkedList, já que remove nós na primeira posição em tempo constante O(1) apenas redirecionando os apontadores de referência do nó inicial.",
      "B) HashSet, já que acelera a busca e remoção e mantém as ações de desfazer perfeitamente organizadas por ordem cronológica.",
      "C) Vector, que sincroniza as remoções das edições no início do vetor, assegurando a melhor performance entre múltiplas threads.",
      "D) TreeSet, que organiza as edições por ordem alfabética para acelerar a busca e remoção do índice zero na estrutura interna do sistema.",
      "E) HashMap, mapeando o número do comando com a chave da coleção para eliminar o deslocamento físico de elementos internos."
    ],
    answer: "A",
    feedback: "A LinkedList possui nós duplamente encadeados. A exclusão de um elemento na extremidade (índice 0) altera apenas o ponteiro do nó inicial (O(1)), sem necessitar de deslocamento físico."
  },
  {
    id: 8,
    theme: "SOLID (Dependency Inversion Principle)",
    text: "**Contexto Profissional:** Uma classe de negócio de relatórios de faturamento instancia diretamente a conexão JDBC do Oracle para buscar dados.\n\n**O Problema:** A necessidade de migrar para o banco de dados PostgreSQL revelou que a classe de negócio está intimamente ligada a rotinas concretas da API do Oracle, gerando alto acoplamento.\n\n**Questão:** Qual princípio SOLID soluciona essa dependência de infraestrutura na engenharia de software?",
    options: [
      "A) Encapsulamento de dados, mantendo as credenciais de banco privadas na classe RelatorioMensalService com acesso via métodos getters.",
      "B) Substituição de Liskov (LSP), para permitir que novas subclasses concretas de OracleDBConnection acessem o PostgreSQL sem lançar exceções.",
      "C) Segregação de Interfaces (ISP), que divide os métodos de busca de banco em assinaturas menores para que os relatórios usem apenas dados parciais.",
      "D) Princípio Aberto/Fechado (OCP), estendendo as classes concretas do banco Oracle por herança para suportar a nova conexão do PostgreSQL.",
      "E) Inversão de Dependência (DIP), fazendo com que RelatorioMensalService dependa de uma interface de conexão genérica implementada por cada driver."
    ],
    answer: "E",
    feedback: "O DIP (Dependency Inversion Principle) estipula que classes de alto nível não devem depender de implementações de baixo nível. Criando uma abstração (interface), isolamos o sistema de detalhes do banco de dados."
  }
];

// ─── DISCURSIVE DATA ─────────────────────────────────────────────────────────
export const STUDY_CASE_A = {
  title: "Modernização da Startup DataCore Solutions",
  context: "A DataCore Solutions, uma startup voltada para a análise de tráfego de dados em redes de fibra óptica, enfrenta um desafio crítico em seu software principal. O sistema, desenvolvido em Java, coleta milhões de pacotes por segundo. A classe central, ProcessadorDeDados, é responsável por realizar a filtragem, a análise estatística e o armazenamento desses pacotes. Atualmente, o código está estruturado com uma sequência imensa de condicionais (if-else e switch-case) que verificam o tipo de pacote e, dependendo do tipo, executam uma lógica de processamento específica. Além disso, os dados são armazenados em uma ArrayList genérica. Com a expansão do negócio, a equipe precisa adicionar constantemente novos algoritmos de filtragem e novas estruturas de processamento. Toda vez que um novo requisito surge, a classe ProcessadorDeDados precisa ser aberta, modificada e testada novamente, o que tem gerado gargalos de performance e um alto índice de bugs em produção. O CTO da empresa busca um profissional que possa reestruturar o código utilizando Padrões de Projeto e escolhas adequadas de Estruturas de Dados, visando um sistema inovador, escalável e de fácil manutenção, sem que a alteração de um algoritmo de filtragem comprometa o funcionamento da estrutura de armazenamento dos dados.",
  statement: "Considerando o cenário apresentado e os princípios da Programação Orientada a Objetos, redija um texto dissertativo-argumentativo (mínimo de 30 linhas) que aborde os seguintes pontos:\n\nA) Diagnostique, à luz dos princípios SOLID e da arquitetura de software, qual o problema de design presente na classe ProcessadorDeDados e quais os riscos técnicos de manter o sistema como está.\nB) Proponha a implementação de um padrão de projeto (Design Pattern) específico para solucionar a complexidade das condicionais (if-else) e explique como esse padrão promove a flexibilidade do código.\nC) Analise a relação entre a escolha da estrutura de dados (atualmente uma ArrayList) e a performance do sistema em cenários de alta concorrência e processamento de dados em tempo real, sugerindo uma alternativa mais adequada, se necessário, e justificando tecnicamente.\nD) Discuta como a aplicação desses conceitos técnicos reflete a competência de um profissional da área de TI que possui visão estratégica e voltada para a inovação, indo além da simples codificação.",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Princípios SOLID violados:\n• Princípio da Responsabilidade Única (SRP): a classe ProcessadorDeDados filtra, analisa e armazena pacotes.\n• Princípio do Aberto/Fechado (OCP): a classe precisa ser constantemente aberta e modificada para novos algoritmos.\nRiscos: rigidez do código, fragilidade na manutenção, aumento de bugs de regressão e quebra de funcionalidades estáveis.\n\nB) Solução com Design Pattern:\n• Padrão Strategy: cria uma interface comum (ex: AlgoritmoProcessamento) e encapsula cada comportamento em classes dedicadas (ex: FiltroAltaSeguranca, FiltroEstatistico).\n• O processador passa a usar composição polimórfica, permitindo adicionar algoritmos sem alterar a classe core (OCP).\n\nC) Coleções e Concorrência:\n• ArrayList não é thread-safe. Ações concorrentes de adição/remoção por threads de rede causam corrupção de memória ou ConcurrentModificationException.\n• Além disso, inserções e remoções no início/meio causam cópia e deslocamento de elementos O(N).\n• Alternativa: ConcurrentLinkedQueue (não-bloqueante via CAS) ou ArrayBlockingQueue (caso haja limite físico de buffer), que suportam alta taxa de vazão (throughput) sob concorrência de múltiplas threads de rede.\n\nD) Visão Estratégica:\n• Evitar o desenvolvimento focado apenas em 'codar' e adotar decisões de arquitetura voltadas para modularização e extensibilidade.\n• Adoção de padrões reduz custos de manutenção de software, diminui a dívida técnica (technical debt) e habilita a agilidade de negócio da startup."
};

export const STUDY_CASE_B = {
  title: "Arquarquitetura PixFlow para Processamento de Eventos",
  context: "A PixFlow, uma plataforma financeira que lida com o processamento de pagamentos digitais instantâneos, enfrenta um sério problema de instabilidade em seu barramento de dados. O sistema Java processa milhões de pagamentos Pix simultaneamente. A classe ProcessadorPix possui um loop central com condicionais switch-case de acordo com o canal emissor (Pix CPF, Pix CNPJ, Pix Chave Aleatória, Pix Copia e Cola) e executa validações fiscais e anti-fraude diretamente no loop, além de salvar os resultados em um ArrayList estático de controle. Sob carga extrema nas janelas de maior tráfego, as threads de processamento disparadas pelos servidores Web começam a lançar ConcurrentModificationException e a CPU do servidor trava em 100% devido ao overhead de redimensionamento e deslocamento do ArrayList na memória. O conselho executivo exige uma reestruturação para mitigar falhas em produção.",
  statement: "Considerando as regras de engenharia de software e orientação a objetos, elabore uma dissertação-argumentativa fundamentada tecnicamente (mínimo de 30 linhas) respondendo aos seguintes tópicos:\n\nA) Diagnostique os problemas estruturais de design e SOLID presentes na classe ProcessadorPix, bem como os riscos corporativos e técnicos de manter o sistema inalterado.\nB) Proponha o uso combinado de um padrão de projeto comportamental (para isolar os algoritmos de validação por tipo de Pix) e um padrão criacional (para fabricar esses validadores), detalhando como esses padrões reduzem o acoplamento do sistema.\nC) Justifique a fragilidade de utilizar ArrayList em ambientes multi-thread concorrentes de tempo real e recomende uma estrutura concorrente da API java.util.concurrent que estabilize o sistema, justificando com base no funcionamento interno de locks ou locks não-bloqueantes.\nD) Destaque como a habilidade de projetar soluções escaláveis alinha-se ao papel de um engenheiro de software que ajuda a reduzir o custo operacional e garante alta disponibilidade da plataforma.",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Diagnóstico de Arquitetura e SOLID:\n• SRP (Single Responsibility): ProcessadorPix valida regras, analisa fraudes e gerencia o armazenamento de Pix.\n• OCP (Open-Closed): O loop do switch-case precisa ser modificado diretamente a cada novo modelo de transação Pix.\nRiscos: downtime financeiro, perda de transações, ConcurrentModificationException e custos elevados de homologação de novas releases.\n\nB) Design Patterns Recomendados:\n• Comportamental: Strategy ou State, para encapsular a lógica de validação de cada tipo de Pix em classes separadas.\n• Criacional: Factory (ou Simple Factory), para encapsular as regras de instanciação das estratégias correspondentes com base no payload recebido.\n• Redução do acoplamento: o coordenador não conhece a lógica interna das estratégias, apenas o contrato de sua interface.\n\nC) Concorrência e Estruturas de Dados:\n• ArrayList não é thread-safe. A inserção e redimensionamento simultâneos em memória por múltiplas threads geram corrupção nos arrays internos e falhas críticas.\n• Alternativa: ConcurrentLinkedQueue (fila FIFO eficiente baseada em algoritmos não-bloqueantes CAS - Compare-And-Swap) ou LinkedBlockingQueue.\n• Para um pipeline Pix de processamento contínuo, a ConcurrentLinkedQueue ou LinkedBlockingQueue estabiliza o sistema e eleva o throughput.\n\nD) Visão Estratégica:\n• O engenheiro atua como um facilitador de negócios ao desenhar sistemas tolerantes a falhas que protegem a receita da fintech.\n• Arquiteturas resilientes minimizam custos de infraestrutura e viabilizam a evolução contínua da fintech em conformidade com as regras do Banco Central."
};
