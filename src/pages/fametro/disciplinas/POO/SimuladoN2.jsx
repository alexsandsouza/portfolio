import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  BookOpen, Trophy, Clock, CheckCircle, XCircle, Send, 
  FileText, ChevronLeft, ChevronRight, GraduationCap, 
  ArrowLeft, Copy, Check, Printer, AlertTriangle 
} from "lucide-react";

// ─── QUESTIONS DATA - MODELO A ───────────────────────────────────────────────

const QUESTIONS_A = [
  {
    id: 1,
    theme: "Swing & Concorrência",
    text: "Uma empresa de logística de grande porte desenvolveu um módulo de monitoramento de frota utilizando a biblioteca Java Swing. A interface gráfica possui um botão de 'Atualizar Telemetria' que dispara uma consulta pesada em uma API externa, retornando dados de milhares de veículos para exibição em um mapa interativo. Durante a fase de homologação, os analistas de QA observaram que, ao acionar o botão, a interface do sistema fica temporariamente sem resposta, impossibilitando qualquer interação do usuário, como redimensionar a janela ou minimizar a aplicação até que o processo de rede finalize completamente. O desenvolvedor implementou a chamada de rede diretamente dentro do método que trata o evento de clique, sobrecarregando a execução principal da interface. A equipe de arquitetura precisa de uma solução que permita a atualização dos dados sem comprometer a fluidez da experiência do usuário, mantendo a consistência dos componentes visuais durante o carregamento. Considerando a arquitetura de thread única do Swing e a necessidade de manter a responsividade da aplicação, qual abordagem técnica é recomendada para gerenciar a execução da tarefa de rede sem bloquear a interface do usuário?",
    options: [
      "A) Encapsular a lógica de rede em um objeto SwingWorker, que separa o processamento pesado do método de atualização de interface, integrando o resultado de forma segura à EDT.",
      "B) Iniciar uma nova instância de Thread dentro do método de clique e invocar o método sleep() para aguardar a resposta antes de atualizar os componentes visuais diretamente na thread principal.",
      "C) Adicionar uma nova camada de interface gráfica que sobrescreva o comportamento de eventos, permitindo que a EDT continue capturando cliques enquanto a rede processa os dados em paralelo.",
      "D) Utilizar um temporizador javax.swing.Timer com intervalo fixo para realizar a requisição de rede, garantindo que a interface verifique a cada segundo se os dados já foram recebidos pelo sistema.",
      "E) Substituir a estrutura de eventos por um MouseListener que execute a consulta de rede em um processo separado, sem necessidade de sincronização de estados entre a thread de rede e a interface."
    ],
    answer: "A",
    feedback: "O SwingWorker é a classe nativa do Java Swing para realizar tarefas em background. Ela divide a execução pesada (no método doInBackground) de atualizações visuais na Thread de Despacho de Eventos (EDT) através dos métodos process/done."
  },
  {
    id: 2,
    theme: "Design Patterns (Observer)",
    text: "Em um sistema de gestão de prontuários médicos desenvolvido em Java, o painel de 'Dados do Paciente' deve notificar o painel de 'Histórico de Exames' sempre que um novo paciente for selecionado na lista principal. Atualmente, a classe responsável pela lista de pacientes possui referências diretas a todos os demais componentes gráficos do sistema para disparar atualizações manuais. Esse acoplamento excessivo tornou o sistema extremamente rígido, dificultando a inclusão de novos painéis ou a modificação de componentes existentes sem quebrar outras funcionalidades. A equipe de desenvolvimento foi instruída a desacoplar esses módulos, garantindo que a adição de um novo painel de visualização não exija modificações na lógica de seleção da lista de pacientes. É necessário implementar uma estratégia de comunicação que permita que os componentes reajam a mudanças de estado sem conhecer a implementação interna uns dos outros. Qual padrão de projeto deve ser adotado para permitir que múltiplos componentes gráficos sejam notificados automaticamente sobre alterações na seleção do paciente, reduzindo o acoplamento entre a lista e os painéis de exibição?",
    options: [
      "A) Utilizar herança múltipla entre os painéis de visualização e a classe da lista, facilitando o acesso aos dados e aos métodos de atualização de forma nativa pela hierarquia.",
      "B) Criar uma classe controladora central que possua métodos para todos os painéis, delegando a responsabilidade de atualização para uma instância global de gerenciamento de UI.",
      "C) Implementar o padrão Observer, permitindo que os painéis interessados se registrem na lista de pacientes e recebam notificações de mudança quando o estado for alterado.",
      "D) Configurar os painéis de visualização como classes internas da lista de pacientes, permitindo que o acesso a campos privados e métodos de estado seja realizado sem barreiras.",
      "E) Definir métodos estáticos em uma interface de utilitários que gerencie a referência de todos os painéis ativos no sistema, disparando atualizações conforme a necessidade."
    ],
    answer: "C",
    feedback: "O padrão Observer é ideal para desacoplar remetentes de notificações de seus destinatários. Ao se registrar na lista, cada painel passa a ouvir alterações de seleção sem que a lista precise conhecê-los de forma concreta."
  },
  {
    id: 3,
    theme: "Eventos no Swing & JTextField",
    text: "Durante o desenvolvimento de um terminal de vendas (PDV), o programador optou por utilizar JTextField para a entrada do código de barras dos produtos. O requisito exige que, assim que o usuário finaliza a digitação e pressiona 'Enter', o sistema valide o código, consulte o preço e exiba o resultado no rótulo da tela. O desenvolvedor percebeu que, ao utilizar o KeyListener, a captura do evento era inconsistente devido a variações de foco entre os componentes da interface. Além disso, o comportamento de entrada via leitor óptico (que simula teclas) gerava conflitos com o foco do campo. A equipe precisa de uma solução técnica que capture o momento exato em que a entrada de dados é confirmada pelo usuário, independentemente se o evento foi disparado pelo teclado físico, leitor óptico ou uma ação de confirmação via mouse, garantindo a integridade da operação de venda. Dentre as opções abaixo, qual representa o mecanismo mais adequado na API Java Swing para capturar a submissão de dados de um campo de texto, minimizando os conflitos gerados pelo gerenciamento de foco?",
    options: [
      "A) Capturar o evento de perda de foco do componente via FocusListener, disparando a validação toda vez que o cursor sair do campo de entrada de texto.",
      "B) Associar um ActionListener ao JTextField, pois este evento dispara quando o usuário pressiona a tecla de confirmação (Enter), abstraindo a complexidade do foco e do teclado.",
      "C) Monitorar as mudanças no documento do campo usando um DocumentListener, validando a cada caractere inserido no campo para garantir que o código esteja correto.",
      "D) Criar uma thread de monitoramento que verifica o conteúdo do campo a intervalos regulares para detectar alterações e processar a busca do produto automaticamente.",
      "E) Utilizar um InputVerifier que bloqueie a saída do campo enquanto os dados digitados não coincidirem com um formato de código de barras válido no banco de dados."
    ],
    answer: "B",
    feedback: "Associar um ActionListener ao JTextField permite capturar a submissão do texto por enter de maneira simplificada, abstraindo as variações causadas por leitores de código de barras e focos na janela."
  },
  {
    id: 4,
    theme: "Swing Custom Painting & paintComponent",
    text: "Uma aplicação de desenho vetorial, desenvolvida em Java, utiliza um JPanel customizado onde o usuário adiciona formas geométricas com cliques do mouse. O desenvolvedor sobreescreveu o método paintComponent para renderizar as formas armazenadas em uma coleção. Após testes, constatou-se que ao maximizar ou redimensionar a janela, os elementos desenhados anteriormente desapareciam ou eram redesenhados de forma inconsistente. Analisando o ciclo de vida do componente, verificou-se que a lógica de desenho estava tentando persistir o estado gráfico diretamente no objeto Graphics de forma temporária, em vez de utilizar o modelo de dados do painel. A equipe de desenvolvimento precisa ajustar a estrutura da classe para que o componente seja capaz de redesenhar o estado atual de forma precisa em qualquer situação de redimensionamento da interface. Qual é o procedimento técnico correto para garantir que elementos gráficos permaneçam visíveis após eventos de redimensionamento ou minimização da janela em um JPanel customizado?",
    options: [
      "A) Invocar o método repaint() dentro do método mouseClicked, desenhando a forma diretamente no objeto Graphics passado pelo evento de mouse para garantir a permanência na tela.",
      "B) Armazenar as coordenadas e propriedades das formas em uma estrutura de dados e iterar sobre essa coleção dentro do método paintComponent para redesenhar o estado a cada chamada.",
      "C) Desenhar as formas em um buffer estático fora do componente, exibindo esse buffer no paintComponent sem depender de coleções de dados internos do painel.",
      "D) Criar componentes visuais individuais para cada forma geométrica e adicioná-los como filhos do JPanel utilizando um gerenciador de layout para organizar os objetos automaticamente.",
      "E) Utilizar uma biblioteca externa que capture a imagem do componente a cada clique e a aplique como plano de fundo, evitando a necessidade de redesenhar os objetos individuais."
    ],
    answer: "B",
    feedback: "A pintura em Swing é reativa e sob demanda do sistema operacional. Para persistir os desenhos, as formas devem estar estruturadas em memória e serem ativamente repintadas dentro do ciclo do paintComponent."
  },
  {
    id: 5,
    theme: "SOLID (Single Responsibility Principle)",
    text: "Em um sistema bancário, a classe ProcessadorTransacao tornou-se o ponto central da lógica de negócio. Ela é responsável por calcular taxas de câmbio, formatar comprovantes em formato PDF, validar saldo em diferentes tipos de contas e enviar notificações por e-mail aos clientes. Com o tempo, a classe atingiu milhares de linhas de código, tornando a manutenção extremamente custosa. Qualquer alteração na regra de formatação de um comprovante exige a modificação da mesma classe que lida com a lógica complexa de transações financeiras, gerando riscos de introdução de novos erros (bugs) em áreas sensíveis do sistema. A equipe de arquitetura deseja refatorar este componente para que cada responsabilidade seja isolada, aumentando a coesão e facilitando a evolução do software sem impactar outras partes do sistema. Considerando os princípios de design de software orientados a objetos, qual mudança arquitetural deve ser aplicada para atender ao Princípio da Responsabilidade Única (SRP)?",
    options: [
      "A) Dividir a classe ProcessadorTransacao em classes menores, como CalculadorTaxa, GeradorComprovante, ValidadorSaldo e ServicoNotificacao, garantindo que cada uma tenha um motivo específico para mudança.",
      "B) Refatorar a classe para utilizar herança múltipla, criando subclasses especializadas que herdam a lógica central e sobrescrevem apenas os métodos de formatação e envio de mensagens.",
      "C) Agrupar todos os métodos da classe em uma interface única que defina os contratos de negócio, forçando todas as subclasses a implementarem as funcionalidades de forma customizada.",
      "D) Converter todos os métodos da classe em estáticos dentro de uma classe de utilitários, permitindo que o sistema acesse as funcionalidades sem precisar instanciar o objeto de transação.",
      "E) Manter a estrutura atual, porém encapsulando a lógica de negócio em métodos privados, para que o código de formatação não acesse diretamente os dados financeiros da classe."
    ],
    answer: "A",
    feedback: "O princípio SRP diz que uma classe deve ter um único motivo para mudar. Dividir o processador em classes coesas (taxa, comprovante, saldo, e-mail) isola o impacto de alterações regulatórias ou de infraestrutura."
  },
  {
    id: 6,
    theme: "Design Patterns (Strategy)",
    text: "Uma empresa de e-commerce utiliza um motor de recomendação de produtos que aplica diferentes algoritmos baseados no perfil do usuário (ex: baseados em histórico de compras, baseados em popularidade, baseados em tendências sazonais). Atualmente, a classe que gerencia as recomendações possui uma sequência extensa de condicionais (if-else) que verifica o perfil do usuário para escolher o método de cálculo. Conforme a empresa planeja introduzir novos algoritmos de recomendação, o código da classe central fica cada vez mais complexo e difícil de testar, exigindo alterações frequentes no código-fonte já existente a cada nova estratégia comercial criada. A equipe técnica necessita de um padrão de design que possibilite a extensão do sistema com novos algoritmos sem alterar a lógica de consumo das recomendações. Qual padrão de projeto é mais adequado para encapsular algoritmos de recomendação distintos e permitir que sejam trocados em tempo de execução?",
    options: [
      "A) Strategy, permitindo que cada algoritmo de recomendação seja encapsulado em uma classe dedicada, sendo intercambiável pela classe que consome o serviço.",
      "B) Singleton, assegurando que apenas uma instância de cada algoritmo de recomendação exista na memória, otimizando o consumo de recursos durante a execução.",
      "C) Factory Method, centralizando a criação de instâncias de algoritmos em um método estático que retorna o objeto adequado conforme o tipo de usuário.",
      "D) Adapter, transformando a interface dos algoritmos legados em uma interface compatível com o novo motor de recomendação, facilitando a integração de sistemas externos.",
      "E) Observer, permitindo que os algoritmos sejam notificados sempre que o perfil do usuário mudar, disparando a atualização do gráfico de recomendações automaticamente."
    ],
    answer: "A",
    feedback: "O padrão Strategy é perfeito para encapsular comportamentos/algoritmos distintos sob uma mesma interface comum de execução, reduzindo o uso de desvios if-else complexos e facilitando a inclusão de novas regras."
  },
  {
    id: 7,
    theme: "Java Collections & Estruturas de Dados",
    text: "Um sistema de análise de tráfego de rede precisa armazenar logs de pacotes capturados para processamento posterior. Os logs chegam continuamente e, para manter a memória sob controle, o sistema deve remover os logs mais antigos assim que o buffer de armazenamento atinge um limite definido. O desenvolvedor utilizou inicialmente uma ArrayList para armazenar esses logs. No entanto, ele notou que a remoção de elementos no início da lista para liberar espaço é ineficiente, causando picos de lentidão na aplicação, pois a estrutura precisa deslocar todos os elementos subsequentes a cada remoção. É necessário trocar a estrutura de dados para uma que ofereça melhor desempenho para operações de remoção frequentes no início da coleção, sem perder a capacidade de armazenamento sequencial. Qual estrutura de dados da Java Collections Framework é a mais indicada para otimizar operações que exigem remoção frequente na primeira posição da coleção, visando maior eficiência?",
    options: [
      "A) LinkedList, pois sua estrutura de nós encadeados permite a remoção em tempo constante no início da lista, eliminando a necessidade de deslocamento de elementos.",
      "B) HashSet, pois a estrutura garante acesso imediato aos elementos e otimiza a remoção de dados sem a necessidade de manter a ordem sequencial dos logs de rede.",
      "C) Vector, pois a sincronização interna dos métodos garante que a remoção de elementos ocorra de forma segura entre múltiplas threads, mantendo o desempenho.",
      "D) TreeSet, pois a manutenção automática da ordem dos elementos facilita a busca pelos logs mais antigos, acelerando a operação de exclusão por comparação de tempo.",
      "E) PriorityQueue, pois a estrutura organiza os elementos por prioridade de tempo de chegada, permitindo a remoção rápida do elemento com menor valor de timestamp."
    ],
    answer: "A",
    feedback: "A LinkedList remove elementos das extremidades (como a primeira posição) em tempo constante O(1), enquanto a ArrayList exige tempo O(N) para mover o array restante de itens."
  },
  {
    id: 8,
    theme: "SOLID (Dependency Inversion Principle)",
    text: "Em um projeto de sistemas de informações geográficas (SIG), o módulo de acesso a dados depende fortemente de uma biblioteca específica de persistência de um fornecedor de banco de dados comercial. Essa dependência direta tornou o sistema difícil de migrar para soluções de código aberto, pois toda a lógica de negócio foi escrita utilizando as classes concretas da biblioteca do fornecedor. A equipe deseja realizar uma refatoração arquitetural que desvincule a lógica de negócio da tecnologia de persistência, permitindo a substituição futura do motor de banco de dados sem que o código dos módulos de alto nível seja alterado. É imperativo seguir o princípio de que módulos de negócio não devem conhecer detalhes de implementação de módulos de infraestrutura. Qual princípio de design orientado a objetos deve ser aplicado para realizar essa dissociação e garantir a manutenibilidade do sistema a longo prazo?",
    options: [
      "A) Encapsulamento de Dados, protegendo os métodos de acesso aos dados dentro de pacotes privados, acessíveis apenas através de métodos getters e setters na camada de negócio.",
      "B) Princípio de Substituição de Liskov, garantindo que qualquer implementação de banco de dados possa substituir a implementação anterior sem quebrar o comportamento do sistema.",
      "C) Princípio de Segregação de Interface, dividindo as interfaces de persistência em métodos menores para que as classes de negócio não dependam de métodos que não utilizam.",
      "D) Princípio Aberto/Fechado, permitindo que a classe de persistência seja estendida por novas subclasses que implementem o suporte a diferentes bancos de dados.",
      "E) Inversão de Dependência (DIP), fazendo com que as classes de negócio dependam de interfaces de abstração de persistência, e não de classes concretas de conexão."
    ],
    answer: "E",
    feedback: "O Princípio de Inversão de Dependência (DIP) dita que módulos de alto nível (regras de negócio) não devem depender de módulos de baixo nível (infraestrutura, banco de dados). Ambos devem depender de abstrações (interfaces)."
  }
];

// ─── QUESTIONS DATA - MODELO B ───────────────────────────────────────────────

const QUESTIONS_B = [
  {
    id: 1,
    theme: "Swing & Concorrência",
    text: "Um sistema de monitoramento meteorológico baseado em Java Swing possui um botão 'Importar Histórico Climático' que, ao ser clicado, realiza a importação de volumosos arquivos CSV armazenados localmente e atualiza a barra de progresso do painel principal. Durante a execução, o desenvolvedor percebeu que toda a tela congela e para de atualizar sua interface gráfica até que a leitura de todo o arquivo termine, impedindo o clique no botão 'Cancelar' ou a rolagem do relatório em exibição. O erro ocorreu porque a leitura dos arquivos foi codificada na thread principal do Swing. Qual é a técnica recomendada para assegurar que a barra de progresso seja atualizada em tempo real sem causar o congelamento visual da interface do Swing?",
    options: [
      "A) Implementar a lógica de leitura no doInBackground de um SwingWorker, atualizando a barra de progresso via publish() e publicando o resultado final seguro na EDT.",
      "B) Utilizar herança direta para criar um botão personalizado que estenda a classe Thread e execute a leitura de arquivos dentro de blocos de processamento síncronos.",
      "C) Substituir a barra de progresso por um elemento gráfico de desenho 2D que atualize seu visual por meio de um loop executado via ActionListener de alta prioridade.",
      "D) Sobrescrever os métodos de escuta do botão de importação para realizar o processamento por meio de loops intermitentes com chamadas estáticas do sistema.",
      "E) Configurar um manipulador de eventos do tipo MouseMotionListener que force a repintura da interface a cada pixel que o cursor se deslocar na tela da aplicação."
    ],
    answer: "A",
    feedback: "Assim como no modelo A, o SwingWorker é projetado especificamente para rodar operações de E/S ou rede fora da Thread de Despacho de Eventos (EDT) e comunicar atualizações de progresso visuais com segurança através do método process."
  },
  {
    id: 2,
    theme: "Design Patterns (Observer)",
    text: "Um dashboard de controle de telemetria automotiva necessita atualizar dinamicamente três painéis visuais: o Velocímetro Digital, o Painel de Consumo de Bateria e o Registrador de Logs de Percurso, sempre que a velocidade do veículo mudar no sensor central. O programador acoplou a classe do Sensor diretamente às classes concretas desses três painéis, disparando atualizações internas manualmente a cada alteração. Isso gerou rigidez no design de software e impediu a inclusão fácil de novos visualizadores no painel automotivo. A fim de resolver a fragilidade da arquitetura, o time de engenharia optou por estabelecer um fluxo de comunicação dinâmico e desacoplado. Qual padrão deve ser utilizado para notificar os painéis de velocidade sem mantê-los rigidamente acoplados à lógica do sensor?",
    options: [
      "A) Definir todos os métodos de atualização como interfaces de execução síncrona dentro de classes internas protegidas pertencentes ao Velocímetro Digital.",
      "B) Adotar uma arquitetura de herança em cadeia onde o sensor herde de cada painel para acessar de maneira nativa as propriedades de formatação do painel.",
      "C) Utilizar o padrão Observer, de modo que os painéis registrem-se como ouvintes no sensor de telemetria e sejam notificados quando o estado do sensor mudar.",
      "D) Empregar uma classe de persistência central que salve o histórico do sensor e force os painéis a realizarem buscas contínuas no banco a cada segundo.",
      "E) Criar adaptadores de classe para converter a leitura de velocidade em formatos que os painéis interpretem por meio de utilitários estáticos no sistema."
    ],
    answer: "C",
    feedback: "O Observer resolve o acoplamento um-para-muitos definindo a interface Subject (ou Observable) no sensor, permitindo que novos painéis simplesmente se cadastrem para receber novidades de alteração de dados de forma autônoma."
  },
  {
    id: 3,
    theme: "Eventos no Swing & JTextField",
    text: "Em um terminal de consulta de livros em uma biblioteca, o usuário digita o ISBN da obra em um JTextField e pressiona 'Enter' para submeter a pesquisa. O programador havia colocado um FocusListener para validar os dados do ISBN na perda do foco da caixa de texto, mas notou falhas contínuas de validação quando os leitores ópticos de código de barras faziam leituras velozes. Para resolver o comportamento e capturar a digitação e a submissão com o máximo de integridade nos terminais, qual abordagem da API Java Swing deve ser escolhida?",
    options: [
      "A) Implementar um KeyListener para capturar eventos de liberação de tecla (keyReleased), iniciando a pesquisa a cada caractere inserido pelo usuário.",
      "B) Associar um ActionListener ao JTextField, que intercepta o envio do campo de texto disparado nativamente pelo botão de confirmação ou tecla Enter.",
      "C) Utilizar um InputVerifier configurado para travar o cursor dentro do JTextField enquanto a string digitada for menor do que o padrão ISBN válido.",
      "D) Monitorar as alterações gráficas criando uma thread secundária que verifique a cor do texto digitado no campo gráfico em períodos fixos.",
      "E) Substituir o componente por um JTextArea e registrar listeners para capturar as coordenadas de mouse dentro da janela gráfica do formulário."
    ],
    answer: "B",
    feedback: "O JTextField do Swing notifica os ouvintes registrados em seu ActionListener quando a tecla Enter (ou a quebra de linha simulada por leitores de código) é pressionada, tornando-se a abordagem ideal para submissões robustas."
  },
  {
    id: 4,
    theme: "Swing Custom Painting & paintComponent",
    text: "Um programador desenvolveu um painel para exibição de fluxogramas elétricos estendendo o JPanel. A rotina de renderização das conexões elétricas foi inserida no mouseDragged utilizando g.drawLine() sobre o Graphics obtido de getGraphics(). Os testes demonstraram que, sempre que o usuário minimiza a janela e a restaura na tela, os diagramas elétricos desaparecem, forçando o redesenho manual de tudo. Qual é o procedimento técnico apropriado para garantir que a renderização permaneça e seja consistente a cada redesenho automático da tela da aplicação?",
    options: [
      "A) Configurar o repaint() para disparar loops curtos no sistema de modo a invalidar o layout e repintar a janela de forma forçada a cada clique.",
      "B) Exportar o layout do JPanel como imagem PNG em tempo real a cada atualização, aplicando a imagem como plano de fundo de forma síncrona.",
      "C) Utilizar herança nos componentes filhos para fazer com que cada fluxograma gerencie de forma independente a chamada do método updateUI.",
      "D) Armazenar os nós e conexões em listas e iterar sobre esses objetos de domínio no método paintComponent para renderizar o diagrama no redesenho.",
      "E) Forçar a retenção do buffer na thread de despacho do sistema operacional para desabilitar o recebimento dos sinais automáticos de repintura."
    ],
    answer: "D",
    feedback: "No ciclo de renderização do Swing, as telas são atualizadas constantemente. Pintar usando getGraphics() é temporário. O modo correto é guardar as coordenadas dos elementos em coleções e desenhá-los dentro de paintComponent."
  },
  {
    id: 5,
    theme: "SOLID (Single Responsibility Principle)",
    text: "A classe AdministradorNotas de um sistema universitário é encarregada de computar a média final dos estudantes, formatar boletins acadêmicos em arquivos XML, persistir os boletins no banco de dados e realizar o envio de notificações sobre a média via SMS para os responsáveis. A manutenção da classe é complexa devido à falta de coesão, fazendo com que qualquer alteração de regras do banco de dados exija mexer nas rotinas que formatam o XML do boletim. Com base nos conceitos SOLID, qual alteração arquitetural atende de forma fidedigna ao Princípio da Responsabilidade Única (SRP)?",
    options: [
      "A) Dividir a classe em classes independentes menores, como CalculadorMedias, GeradorBoletimXml, RepositorioBoletim e ServicoMensageriaSms.",
      "B) Sobrescrever os métodos com herança múltipla baseada em interfaces de negócio para cada tipo de cálculo de média das disciplinas.",
      "C) Unificar as operações em um padrão Singleton estático que centralize todos os acessos do portal acadêmico e evite o acoplamento.",
      "D) Ocultar a rotina de envio de SMS usando escopos protegidos na mesma classe, permitindo o acesso apenas a partir de métodos internos.",
      "E) Encapsular os parâmetros em estruturas internas privadas para isolar as chamadas do banco de dados das demais rotinas visuais."
    ],
    answer: "A",
    feedback: "Ao quebrar a classe inflada em quatro classes menores dedicadas (calculador, gerador, repositório, mensageria), cada uma passa a ter um único papel lógico no ecossistema de software, garantindo maior coesão e isolamento de bugs."
  },
  {
    id: 6,
    theme: "Design Patterns (Strategy)",
    text: "Um software de cálculo fiscal empresarial precisa aplicar diferentes regras tributárias para o faturamento de produtos com base no estado do país (ex: regras específicas de ICMS de São Paulo, regras do Rio de Janeiro, impostos do Amazonas, etc.). A classe central CalculadoraImpostos possui um switch-case extenso que verifica a sigla do estado e implementa cada lógica de cálculo correspondente. Conforme novos estados e regras tributárias entram em vigor, a classe precisa ser aberta e modificada constantemente, violando a extensibilidade do sistema. Qual padrão de projeto GoF deve ser utilizado para encapsular esses impostos distintos e permitir que sejam modificados ou estendidos sem alterar o código-fonte da calculadora?",
    options: [
      "A) Facade, para criar um subsistema robusto de cálculo e ocultar as chamadas complexas sob uma classe de persistência centralizada.",
      "B) Factory Method, para instanciar a calculadora de impostos por meio de parâmetros estáticos que representem o local tributário do cálculo.",
      "C) Command, para enfileirar as solicitações tributárias e executá-las por prioridade de faturamento em segundo plano na aplicação.",
      "D) Template Method, para estruturar o algoritmo fiscal em passos definidos na superclasse, sobrescrevendo os métodos nas subclasses concretas.",
      "E) Strategy, para definir uma interface comum de imposto e criar classes concretas para cada estado, alternando-as via composição na calculadora."
    ],
    answer: "E",
    feedback: "O padrão Strategy desacopla o cálculo específico (algoritmo) do contexto. Ao criar estratégias concretas de impostos (ex: ImpostoAM, ImpostoSP), a calculadora simplesmente chama o método calcular() polimorficamente por composição."
  },
  {
    id: 7,
    theme: "Java Collections & Estruturas de Dados",
    text: "Um editor de texto profissional implementa uma funcionalidade de buffer de desfazer (Undo History) com capacidade máxima para 500 operações de edição. Sempre que o buffer atinge seu tamanho limite, o sistema remove a operação mais antiga de edição (que está no primeiro índice, posição 0) para abrir espaço para o registro da nova ação de edição no final do histórico de comandos. O programador notou lentidão no software ao utilizar ArrayList para implementar o buffer. Qual estrutura de dados da API Java Collections resolveria o gargalo de performance no início da coleção sem comprometer o armazenamento sequencial das ações de desfazer?",
    options: [
      "A) LinkedList, já que remove nós na primeira posição em tempo constante O(1) apenas redirecionando os apontadores de referência do nó inicial.",
      "B) HashSet, já que acelera a busca e remoção e mantém as ações de desfazer perfeitamente organizadas por ordem cronológica.",
      "C) Vector, que sincroniza as remoções das edições no início do vetor, assegurando a melhor performance entre múltiplas threads.",
      "D) TreeSet, que organiza as edições por ordem alfabética para acelerar a busca e remoção do índice zero na estrutura interna do sistema.",
      "E) HashMap, mapeando o número do comando com a chave da coleção para eliminar o deslocamento físico de elementos internos."
    ],
    answer: "A",
    feedback: "LinkedList é estruturada com nós duplamente encadeados. Remover o cabeçalho (posição 0) requer apenas alterar um ponteiro (tempo O(1)), sem o custo O(N) do ArrayList que precisa deslocar todos os outros 499 elementos."
  },
  {
    id: 8,
    theme: "SOLID (Dependency Inversion Principle)",
    text: "Durante a construção de um gerador de relatórios corporativo, a classe RelatorioMensalService instancia diretamente o objeto OracleDBConnection para buscar dados de faturamento. A empresa iniciou um plano de substituição do banco de dados Oracle por uma solução aberta baseada em PostgreSQL. Durante a migração, a equipe observou alto acoplamento: todas as regras de faturamento e compilação do relatório dependiam de classes e assinaturas concretas do driver JDBC Oracle, exigindo refatoração em larga escala do negócio. Para evitar esse tipo de acoplamento rígido, qual princípio SOLID de desenvolvimento de software deve orientar a reestruturação desse relacionamento de classes?",
    options: [
      "A) Encapsulamento de dados, mantendo as credenciais de banco privadas na classe RelatorioMensalService com acesso via métodos getters.",
      "B) Substituição de Liskov (LSP), para permitir que novas subclasses concretas de OracleDBConnection acessem o PostgreSQL sem lançar exceções.",
      "C) Segregação de Interfaces (ISP), que divide os métodos de busca de banco em assinaturas menores para que os relatórios usem apenas dados parciais.",
      "D) Princípio Aberto/Fechado (OCP), estendendo as classes concretas do banco Oracle por herança para suportar a nova conexão do PostgreSQL.",
      "E) Inversão de Dependência (DIP), fazendo com que RelatorioMensalService dependa de uma interface de conexão genérica implementada por cada driver."
    ],
    answer: "E",
    feedback: "A Inversão de Dependência (DIP) dita que o código de negócio (Alto Nível) não deve conhecer os detalhes concretos da infraestrutura de banco (Baixo Nível). Ao criar uma interface (ex: DBConnection), isolamos as implementações dos bancos de dados."
  }
];

// ─── DISCURSIVE DATA ─────────────────────────────────────────────────────────

const STUDY_CASE_A = {
  title: "Modernização da Startup DataCore Solutions",
  context: "A DataCore Solutions, uma startup voltada para a análise de tráfego de dados em redes de fibra óptica, enfrenta um desafio crítico em seu software principal. O sistema, desenvolvido em Java, coleta milhões de pacotes por segundo. A classe central, ProcessadorDeDados, é responsável por realizar a filtragem, a análise estatística e o armazenamento desses pacotes. Atualmente, o código está estruturado com uma sequência imensa de condicionais (if-else e switch-case) que verificam o tipo de pacote e, dependendo do tipo, executam uma lógica de processamento específica. Além disso, os dados são armazenados em uma ArrayList genérica. Com a expansão do negócio, a equipe precisa adicionar constantemente novos algoritmos de filtragem e novas estruturas de processamento. Toda vez que um novo requisito surge, a classe ProcessadorDeDados precisa ser aberta, modificada e testada novamente, o que tem gerado gargalos de performance e um alto índice de bugs em produção. O CTO da empresa busca um profissional que possa reestruturar o código utilizando Padrões de Projeto e escolhas adequadas de Estruturas de Dados, visando um sistema inovador, escalável e de fácil manutenção, sem que a alteração de um algoritmo de filtragem comprometa o funcionamento da estrutura de armazenamento dos dados.",
  statement: "Considerando o cenário apresentado e os princípios da Programação Orientada a Objetos, redija um texto dissertativo-argumentativo (mínimo de 30 linhas) que aborde os seguintes pontos:\n\nA) Diagnostique, à luz dos princípios SOLID e da arquitetura de software, qual o problema de design presente na classe ProcessadorDeDados e quais os riscos técnicos de manter o sistema como está.\nB) Proponha a implementação de um padrão de projeto (Design Pattern) específico para solucionar a complexidade das condicionais (if-else) e explique como esse padrão promove a flexibilidade do código.\nC) Analise a relação entre a escolha da estrutura de dados (atualmente uma ArrayList) e a performance do sistema em cenários de alta concorrência e processamento de dados em tempo real, sugerindo uma alternativa mais adequada, se necessário, e justificando tecnicamente.\nD) Discuta como a aplicação desses conceitos técnicos reflete a competência de um profissional da área de TI que possui visão estratégica e voltada para a inovação, indo além da simples codificação.",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Princípios SOLID violados:\n• Princípio da Responsabilidade Única (SRP): a classe ProcessadorDeDados filtra, analisa e armazena pacotes.\n• Princípio do Aberto/Fechado (OCP): a classe precisa ser constantemente aberta e modificada para novos algoritmos.\nRiscos: rigidez do código, fragilidade na manutenção, aumento de bugs de regressão e quebra de funcionalidades estáveis.\n\nB) Solução com Design Pattern:\n• Padrão Strategy: cria uma interface comum (ex: AlgoritmoProcessamento) e encapsula cada comportamento em classes dedicadas (ex: FiltroAltaSeguranca, FiltroEstatistico).\n• O processador passa a usar composição polimórfica, permitindo adicionar algoritmos sem alterar a classe core (OCP).\n\nC) Coleções e Concorrência:\n• ArrayList não é thread-safe. Ações concorrentes de adição/remoção por threads de rede causam corrupção de memória ou ConcurrentModificationException.\n• Além disso, inserções e remoções no início/meio causam cópia e deslocamento de elementos O(N).\n• Alternativa: ConcurrentLinkedQueue (não-bloqueante via CAS) ou ArrayBlockingQueue (caso haja limite físico de buffer), que suportam alta taxa de vazão (throughput) sob concorrência de múltiplas threads de rede.\n\nD) Visão Estratégica:\n• Evitar o desenvolvimento focado apenas em 'codar' e adotar decisões de arquitetura voltadas para modularização e extensibilidade.\n• Adoção de padrões reduz custos de manutenção de software, diminui a dívida técnica (technical debt) e habilita a agilidade de negócio da startup."
};

const STUDY_CASE_B = {
  title: "Arquitetura PixFlow para Processamento de Eventos",
  context: "A PixFlow, uma plataforma financeira que lida com o processamento de pagamentos digitais instantâneos, enfrenta um sério problema de instabilidade em seu barramento de dados. O sistema Java processa milhões de pagamentos Pix simultaneamente. A classe ProcessadorPix possui um loop central com condicionais switch-case de acordo com o canal emissor (Pix CPF, Pix CNPJ, Pix Chave Aleatória, Pix Copia e Cola) e executa validações fiscais e anti-fraude diretamente no loop, além de salvar os resultados em um ArrayList estático de controle. Sob carga extrema nas janelas de maior tráfego, as threads de processamento disparadas pelos servidores Web começam a lançar ConcurrentModificationException e a CPU do servidor trava em 100% devido ao overhead de redimensionamento e deslocamento do ArrayList na memória. O conselho executivo exige uma reestruturação para mitigar falhas em produção.",
  statement: "Considerando as regras de engenharia de software e orientação a objetos, elabore uma dissertação-argumentativa fundamentada tecnicamente (mínimo de 30 linhas) respondendo aos seguintes tópicos:\n\nA) Diagnostique os problemas estruturais de design e SOLID presentes na classe ProcessadorPix, bem como os riscos corporativos e técnicos de manter o sistema inalterado.\nB) Proponha o uso combinado de um padrão de projeto comportamental (para isolar os algoritmos de validação por tipo de Pix) e um padrão criacional (para fabricar esses validadores), detalhando como esses padrões reduzem o acoplamento do sistema.\nC) Justifique a fragilidade de utilizar ArrayList em ambientes multi-thread concorrentes de tempo real e recomende uma estrutura concorrente da API java.util.concurrent que estabilize o sistema, justificando com base no funcionamento interno de locks ou locks não-bloqueantes.\nD) Destaque como a habilidade de projetar soluções escaláveis alinha-se ao papel de um engenheiro de software que ajuda a reduzir o custo operacional e garante alta disponibilidade da plataforma.",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Diagnóstico de Arquitetura e SOLID:\n• SRP (Single Responsibility): ProcessadorPix valida regras, analisa fraudes e gerencia o armazenamento de Pix.\n• OCP (Open-Closed): O loop do switch-case precisa ser modificado diretamente a cada novo modelo de transação Pix.\nRiscos: downtime financeiro, perda de transações, ConcurrentModificationException e custos elevados de homologação de novas releases.\n\nB) Design Patterns Recomendados:\n• Comportamental: Strategy ou State, para encapsular a lógica de validação de cada tipo de Pix em classes separadas.\n• Criacional: Factory (ou Simple Factory), para encapsular as regras de instanciação das estratégias correspondentes com base no payload recebido.\n• Redução do acoplamento: o coordenador não conhece a lógica interna das estratégias, apenas o contrato de sua interface.\n\nC) Concorrência e Estruturas de Dados:\n• ArrayList não é thread-safe. A inserção e redimensionamento simultâneos em memória por múltiplas threads geram corrupção nos arrays internos e falhas críticas.\n• Alternativa: ConcurrentLinkedQueue (fila FIFO eficiente baseada em algoritmos não-bloqueantes CAS - Compare-And-Swap) ou CopyOnWriteArrayList (caso haja raras escritas e muitas leituras, embora ineficiente para fluxos de escrita constante).\n• Para um pipeline Pix de processamento contínuo, a ConcurrentLinkedQueue ou LinkedBlockingQueue estabiliza o sistema e eleva o throughput.\n\nD) Visão Estratégica:\n• O engenheiro atua como um facilitador de negócios ao desenhar sistemas tolerantes a falhas que protegem a receita da fintech.\n• Arquiteturas resilientes minimizam custos de infraestrutura e viabilizam a evolução contínua da fintech em conformidade com as regras do Banco Central."
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    h > 0 ? String(h).padStart(2, "0") : null,
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0")
  ].filter(Boolean).join(":");
};

// ─── STYLING SYSTEM ──────────────────────────────────────────────────────────

const theme = {
  bg: "#070B14",
  surface: "#0F172A",
  surfaceLight: "rgba(30, 41, 59, 0.5)",
  border: "rgba(255, 255, 255, 0.08)",
  borderActive: "#3B82F6",
  accent: "#3B82F6",
  accentGlow: "rgba(59, 130, 246, 0.15)",
  text: "#CBD5E1",
  textMuted: "#94A3B8",
  white: "#FFFFFF",
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.1)",
  danger: "#EF4444",
  dangerBg: "rgba(239, 68, 68, 0.1)"
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function Welcome({ name, setName, model, setModel, onStart }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim(), model);
    }
  };

  return (
    <div style={{
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: "24px",
      padding: "3rem 2rem",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Grid Overlay background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.005) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.005) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          width: "80px",
          height: "80px",
          backgroundColor: theme.accentGlow,
          borderRadius: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
          border: `1px solid ${theme.borderActive}`
        }}>
          <GraduationCap size={44} color={theme.accent} />
        </div>

        <div style={{ 
          fontSize: "0.8rem", 
          letterSpacing: "4px", 
          color: theme.accent, 
          fontWeight: 900, 
          marginBottom: "0.5rem" 
        }}>
          AVALIAÇÃO INSTITUCIONAL N2
        </div>

        <h1 style={{
          fontSize: "2.2rem",
          fontWeight: 900,
          color: theme.white,
          margin: "0 0 1.5rem",
          lineHeight: 1.2
        }}>
          Simulado Acadêmico · POO
        </h1>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          maxWidth: "600px",
          margin: "0 auto 2.5rem",
          fontSize: "0.95rem",
          color: theme.textMuted,
          lineHeight: 1.6
        }}>
          <div><strong>Curso:</strong> Análise e Desenvolvimento de Sistemas</div>
          <div><strong>Disciplina:</strong> Linguagem de Programação Orientada a Objetos</div>
          <div><strong>Professor:</strong> Alexsander Farias</div>
          <p style={{ marginTop: "1rem" }}>
            Seja bem-vindo ao simulado N2. Teste seus conhecimentos em concorrência, Swing, SOLID e estruturas de dados sob a ótica de engenharia de software e padrões de projeto.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "1rem",
          maxWidth: "600px",
          margin: "0 auto 2.5rem"
        }}>
          {[
            { label: "Múltipla Escolha", val: "8 questões" },
            { label: "Discursiva", val: "Estilo ENADE" },
            { label: "Pontuação Total", val: "100 pontos" },
            { label: "Cronômetro", val: "Tempo Real" }
          ].map(item => (
            <div key={item.label} style={{
              background: theme.surfaceLight,
              padding: "1rem",
              borderRadius: "16px",
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "4px" }}>{item.label}</div>
              <div style={{ fontSize: "1rem", color: theme.white, fontWeight: 700 }}>{item.val}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: "480px", margin: "0 auto", textAlign: "left" }}>
          
          {/* Nome completo */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: theme.white, fontWeight: 600, marginBottom: "6px" }}>
              Nome Completo do Aluno
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Digite seu nome para o ranking..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: `1.5px solid ${theme.border}`,
                background: "rgba(255,255,255,0.03)",
                color: theme.white,
                outline: "none",
                boxSizing: "border-box",
                fontSize: "0.95rem"
              }}
            />
          </div>

          {/* Seletor do Modelo */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: theme.white, fontWeight: 600, marginBottom: "8px" }}>
              Selecione o Modelo de Prova
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              {["A", "B"].map(m => {
                const isSelected = model === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModel(m)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "10px",
                      border: `1.5px solid ${isSelected ? theme.borderActive : theme.border}`,
                      backgroundColor: isSelected ? theme.accentGlow : "transparent",
                      color: isSelected ? theme.white : theme.textMuted,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    Modelo {m}
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            type="submit" 
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              background: theme.accent,
              color: theme.white,
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: `0 8px 20px ${theme.accent}40`,
              transition: "transform 0.2s, filter 0.2s"
            }}
            onMouseEnter={e => e.target.style.filter = "brightness(1.15)"}
            onMouseLeave={e => e.target.style.filter = "none"}
          >
            Iniciar Simulado ({model}) →
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function SimuladoN2() {
  const [step, setStep] = useState(0); // 0: Welcome, 1: Exam, 2: Final Report
  const [name, setName] = useState("");
  const [model, setModel] = useState("A");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0); // 0-7: Objectives, 8: Discursive
  const [answers, setAnswers] = useState({}); // { [questionId]: "A" | "B" | ... }
  const [discursiveAnswer, setDiscursiveAnswer] = useState("");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showCriteria, setShowCriteria] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "", "saving", "saved", "error"
  const [copied, setCopied] = useState(false);

  const timerRef = useRef(null);

  const questions = model === "A" ? QUESTIONS_A : QUESTIONS_B;
  const studyCase = model === "A" ? STUDY_CASE_A : STUDY_CASE_B;
  const totalQuestions = questions.length; // 8

  // Timer Control
  useEffect(() => {
    if (step === 1) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, activeQuestionIdx]);

  const handleStartExam = (pName, selectedModel) => {
    setName(pName);
    setModel(selectedModel);
    setStep(1);
    setSecondsElapsed(0);
  };

  const handleSelectOption = (qId, optionChar) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: optionChar
    }));
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(discursiveAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTextareaLines = () => {
    if (!discursiveAnswer) return 0;
    return discursiveAnswer.split("\n").length;
  };

  // Grade
  const correctCount = questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);
  const incorrectCount = totalQuestions - correctCount;
  // Each objective is worth 12.5 points (8 * 12.5 = 100)
  const scoreTotal = correctCount * 12.5;

  const handleFinishExam = async () => {
    const unansweredCount = questions.filter(q => !answers[q.id]).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(`Você possui ${unansweredCount} questões objetivas sem resposta. Deseja finalizar assim mesmo?`);
      if (!confirmSubmit) return;
    } else if (!discursiveAnswer.trim()) {
      const confirmSubmit = window.confirm("Sua resposta discursiva está em branco. Deseja finalizar o simulado mesmo assim?");
      if (!confirmSubmit) return;
    } else {
      const confirmSubmit = window.confirm("Deseja realmente finalizar e entregar o simulado?");
      if (!confirmSubmit) return;
    }

    setStep(2);
    setSaveStatus("saving");

    try {
      await addDoc(collection(db, "fametro_ranking"), {
        name: name.trim(),
        score: scoreTotal,
        duration: secondsElapsed * 1000, // milliseconds
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp(),
        activityId: "poo_simulado",
        model: `Modelo ${model}`,
        module: "POO",
        course: "Análise e Desenvolvimento de Sistemas",
        professor: "Alexsander Farias",
        period: "2026.1"
      });
      setSaveStatus("saved");
    } catch (e) {
      console.error("Erro ao salvar simulado no Firebase: ", e);
      setSaveStatus("error");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: "'Inter', sans-serif",
      padding: "6rem 1.5rem 4rem",
      boxSizing: "border-box"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Hub Back Link */}
        {step < 2 && (
          <Link to="/fametro" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: theme.textMuted,
            textDecoration: "none",
            fontSize: "0.9rem",
            marginBottom: "2rem",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.color = theme.white}
          onMouseLeave={(e) => e.target.style.color = theme.textMuted}
          >
            <ArrowLeft size={16} /> Voltar para o Hub
          </Link>
        )}

        {/* STEP 0: WELCOME */}
        {step === 0 && (
          <Welcome 
            name={name} 
            setName={setName} 
            model={model} 
            setModel={setModel} 
            onStart={handleStartExam} 
          />
        )}

        {/* STEP 1: EXAM */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "2rem", alignItems: "start" }}>
            
            {/* Left Box: Active Question */}
            <div>
              {activeQuestionIdx < totalQuestions ? (
                // Objective Question
                (() => {
                  const q = questions[activeQuestionIdx];
                  const chosenOpt = answers[q.id];
                  return (
                    <div style={{
                      backgroundColor: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "20px",
                      padding: "2rem",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: theme.accent,
                          backgroundColor: theme.accentGlow,
                          padding: "4px 12px",
                          borderRadius: "20px",
                          border: `1px solid ${theme.borderActive}`
                        }}>
                          {q.theme}
                        </span>
                        <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>
                          Questão {activeQuestionIdx + 1} de {totalQuestions + 1}
                        </span>
                      </div>

                      <h2 style={{
                        fontSize: "1.15rem",
                        color: theme.white,
                        lineHeight: 1.6,
                        margin: "0 0 2rem",
                        fontWeight: 600
                      }}>
                        {q.text}
                      </h2>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {q.options.map(opt => {
                          const optionChar = opt.charAt(0);
                          const isSelected = chosenOpt === optionChar;

                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectOption(q.id, optionChar)}
                              style={{
                                textAlign: "left",
                                padding: "1.1rem 1.4rem",
                                borderRadius: "14px",
                                border: `1.5px solid ${isSelected ? theme.borderActive : theme.border}`,
                                backgroundColor: isSelected ? theme.accentGlow : "transparent",
                                color: isSelected ? theme.white : theme.text,
                                fontSize: "0.9rem",
                                lineHeight: 1.5,
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={e => {
                                if (!isSelected) {
                                  e.target.style.borderColor = "rgba(255,255,255,0.2)";
                                  e.target.style.backgroundColor = "rgba(255,255,255,0.01)";
                                }
                              }}
                              onMouseLeave={e => {
                                if (!isSelected) {
                                  e.target.style.borderColor = theme.border;
                                  e.target.style.backgroundColor = "transparent";
                                }
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              ) : (
                // Discursive Question
                <div style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "20px",
                  padding: "2rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#FBBF24",
                      backgroundColor: "rgba(251, 191, 36, 0.1)",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      border: "1px solid rgba(251, 191, 36, 0.2)"
                    }}>
                      Estilo ENADE · Discursiva
                    </span>
                    <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>
                      Questão {totalQuestions + 1} de {totalQuestions + 1}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: theme.white, margin: "0 0 1rem" }}>
                    {studyCase.title}
                  </h3>

                  <p style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: theme.textMuted,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    padding: "1.25rem",
                    borderRadius: "12px",
                    border: `1px solid ${theme.border}`,
                    fontStyle: "italic",
                    margin: "0 0 2rem"
                  }}>
                    "{studyCase.context}"
                  </p>

                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: theme.white, marginBottom: "1rem" }}>
                    ENUNCIADO DA ATIVIDADE E DIRETRIZES:
                  </h4>

                  <div style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    color: theme.text,
                    paddingLeft: "12px",
                    borderLeft: `3px solid ${theme.accent}`,
                    marginBottom: "2rem",
                    whiteSpace: "pre-line"
                  }}>
                    {studyCase.statement}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "0.85rem", color: theme.white, fontWeight: 600 }}>
                        Texto de Resposta do Estudante (mínimo de 30 linhas)
                      </label>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        color: calculateTextareaLines() >= 30 ? theme.success : theme.textMuted,
                        fontWeight: 600
                      }}>
                        Linhas: {calculateTextareaLines()} | Palavras: {discursiveAnswer ? discursiveAnswer.trim().split(/\s+/).length : 0}
                      </span>
                    </div>

                    <textarea
                      value={discursiveAnswer}
                      onChange={e => setDiscursiveAnswer(e.target.value)}
                      placeholder="Redija sua análise dissertativa-argumentativa fundamentando tecnicamente as soluções com base nos princípios de arquitetura de software, SOLID, Design Patterns e concorrência no Java..."
                      style={{
                        width: "100%",
                        height: "280px",
                        padding: "1.25rem",
                        borderRadius: "14px",
                        border: `1.5px solid ${calculateTextareaLines() >= 30 ? theme.success : theme.border}`,
                        background: "rgba(0, 0, 0, 0.2)",
                        color: theme.white,
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        outline: "none",
                        boxSizing: "border-box",
                        resize: "vertical",
                        fontFamily: "monospace"
                      }}
                    />
                  </div>

                  {calculateTextareaLines() < 30 && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#FBBF24",
                      fontSize: "0.8rem",
                      backgroundColor: "rgba(251, 191, 36, 0.05)",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(251, 191, 36, 0.1)"
                    }}>
                      <AlertTriangle size={14} /> Recomendamos que desenvolva melhor a sua argumentação técnica para atingir a meta pedagógica de 30 linhas.
                    </div>
                  )}

                  {/* Show Criteria Toggle Button */}
                  <div style={{ marginTop: "2rem", borderTop: `1px solid ${theme.border}`, paddingTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                    {!showCriteria ? (
                      <button
                        onClick={() => setShowCriteria(true)}
                        disabled={!discursiveAnswer.trim()}
                        style={{
                          background: discursiveAnswer.trim() ? "rgba(251, 191, 36, 0.15)" : "rgba(255,255,255,0.02)",
                          border: `1.5px solid ${discursiveAnswer.trim() ? "#FBBF24" : theme.border}`,
                          color: discursiveAnswer.trim() ? "#FBBF24" : theme.textMuted,
                          padding: "10px 20px",
                          borderRadius: "10px",
                          cursor: discursiveAnswer.trim() ? "pointer" : "not-allowed",
                          fontWeight: 700,
                          fontSize: "0.85rem"
                        }}
                      >
                        Revelar Critérios e Gabarito de Correção
                      </button>
                    ) : (
                      <div style={{
                        width: "100%",
                        background: "rgba(16, 185, 129, 0.03)",
                        border: `1.5px solid ${theme.success}`,
                        padding: "1.5rem",
                        borderRadius: "14px",
                        textAlign: "left",
                        animation: "fadeIn 0.3s ease"
                      }}>
                        <h4 style={{ color: theme.success, margin: "0 0 1rem", fontSize: "0.95rem", fontWeight: 800 }}>
                          ✓ DIRETRIZES E GABARITO OFICIAL DO PROFESSOR:
                        </h4>
                        <div style={{
                          fontSize: "0.9rem",
                          lineHeight: 1.6,
                          color: theme.text,
                          whiteSpace: "pre-wrap"
                        }}>
                          {studyCase.criteria}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Navigation Bar */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.5rem"
              }}>
                <button
                  disabled={activeQuestionIdx === 0}
                  onClick={() => setActiveQuestionIdx(idx => idx - 1)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${theme.border}`,
                    color: activeQuestionIdx === 0 ? "rgba(255,255,255,0.2)" : theme.white,
                    padding: "12px 24px",
                    borderRadius: "12px",
                    cursor: activeQuestionIdx === 0 ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => { if (activeQuestionIdx !== 0) e.target.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { if (activeQuestionIdx !== 0) e.target.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  <ChevronLeft size={18} /> Anterior
                </button>

                {activeQuestionIdx < totalQuestions ? (
                  <button
                    onClick={() => setActiveQuestionIdx(idx => idx + 1)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: theme.accent,
                      border: "none",
                      color: theme.white,
                      padding: "12px 24px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      boxShadow: `0 4px 12px ${theme.accent}20`
                    }}
                  >
                    Próxima <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishExam}
                    disabled={!showCriteria}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: showCriteria ? theme.success : "rgba(255,255,255,0.02)",
                      border: "none",
                      color: showCriteria ? theme.white : theme.textMuted,
                      padding: "12px 28px",
                      borderRadius: "12px",
                      cursor: showCriteria ? "pointer" : "not-allowed",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      boxShadow: showCriteria ? `0 4px 15px ${theme.success}30` : "none"
                    }}
                  >
                    Finalizar Simulado <Send size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Box: Navigator & Time */}
            <div style={{ position: "sticky", top: "7rem" }}>
              
              {/* Timer Widget */}
              <div style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "20px",
                padding: "1.25rem",
                textAlign: "center",
                marginBottom: "1.5rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  color: theme.textMuted,
                  marginBottom: "4px"
                }}>
                  <Clock size={14} /> TEMPO DECORRIDO
                </div>
                <div style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: theme.white,
                  fontFamily: "monospace"
                }}>
                  {formatTime(secondsElapsed)}
                </div>
              </div>

              {/* Navigator Panel */}
              <div style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
              }}>
                <h3 style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: theme.white,
                  marginTop: 0,
                  marginBottom: "1rem",
                  borderBottom: `1px solid ${theme.border}`,
                  paddingBottom: "8px"
                }}>
                  Navegação (Modelo {model})
                </h3>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  marginBottom: "1.25rem"
                }}>
                  {questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isActive = activeQuestionIdx === idx;
                    
                    let bg = "rgba(255,255,255,0.02)";
                    let color = theme.textMuted;
                    let border = `1px solid ${theme.border}`;

                    if (isAnswered) {
                      border = `1px solid ${theme.borderActive}`;
                      color = theme.accent;
                      bg = "rgba(59, 130, 246, 0.05)";
                    }
                    if (isActive) {
                      bg = theme.accent;
                      color = theme.white;
                      border = `1px solid ${theme.accent}`;
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIdx(idx)}
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: "10px",
                          border,
                          backgroundColor: bg,
                          color,
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          transition: "all 0.1s"
                        }}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveQuestionIdx(totalQuestions)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: activeQuestionIdx === totalQuestions 
                      ? "1px solid #FBBF24"
                      : discursiveAnswer.trim()
                        ? "1px solid rgba(251, 191, 36, 0.4)"
                        : `1px solid ${theme.border}`,
                    backgroundColor: activeQuestionIdx === totalQuestions
                      ? "#FBBF24"
                      : discursiveAnswer.trim()
                        ? "rgba(251, 191, 36, 0.05)"
                        : "rgba(255,255,255,0.02)",
                    color: activeQuestionIdx === totalQuestions
                      ? "#000000"
                      : discursiveAnswer.trim()
                        ? "#FBBF24"
                        : theme.text,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  Questão Discursiva
                </button>

                {/* Info List */}
                <div style={{
                  marginTop: "1.5rem",
                  fontSize: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  color: theme.textMuted
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.textMuted }} /> Não respondido
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.accent }} /> Respondido
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FBBF24" }} /> Discursiva
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* STEP 2: RESULTS REPORT */}
        {step === 2 && (
          <div style={{ animation: "fadeIn 0.6s ease-out" }}>
            
            <div style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "24px",
              padding: "2.5rem 2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              marginBottom: "2rem"
            }}>
              <div style={{ fontSize: "50px", marginBottom: "0.5rem" }}>🏆</div>
              
              <h2 style={{
                fontSize: "1.8rem",
                fontWeight: 900,
                color: theme.white,
                margin: "0 0 6px"
              }}>
                Simulado Entregue!
              </h2>
              
              <p style={{ color: theme.textMuted, fontSize: "0.95rem", margin: "0 0 2rem" }}>
                Parabéns, <strong>{name}</strong>. Sua nota foi processada e enviada para o ranking do <strong>Modelo {model}</strong>.
              </p>

              {/* Stats Box */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1.5rem",
                maxWidth: "800px",
                margin: "0 auto 2rem"
              }}>
                {[
                  { 
                    label: "Nota Objetiva Final", 
                    val: `${scoreTotal} / 100`, 
                    color: scoreTotal >= 70 ? theme.success : scoreTotal >= 40 ? "#FBBF24" : theme.danger 
                  },
                  { 
                    label: "Acertos", 
                    val: `${correctCount} / ${totalQuestions}`, 
                    color: theme.success 
                  },
                  { 
                    label: "Tempo Gasto", 
                    val: formatTime(secondsElapsed), 
                    color: theme.white 
                  },
                  { 
                    label: "Desempenho", 
                    val: `${((correctCount / totalQuestions) * 100).toFixed(0)}%`, 
                    color: correctCount >= 6 ? theme.success : correctCount >= 4 ? "#FBBF24" : theme.danger 
                  }
                ].map(item => (
                  <div key={item.label} style={{
                    background: "rgba(0, 0, 0, 0.15)",
                    border: `1px solid ${theme.border}`,
                    padding: "1.25rem",
                    borderRadius: "16px"
                  }}>
                    <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "6px" }}>{item.label}</div>
                    <div style={{ fontSize: "1.4rem", color: item.color, fontWeight: 900 }}>{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Registry feedback */}
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {saveStatus === "saving" && (
                  <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>Sincronizando resultado com o servidor...</div>
                )}
                {saveStatus === "saved" && (
                  <div style={{ fontSize: "0.8rem", color: theme.success }}>✓ Pontuação registrada e integrada ao ranking geral da disciplina.</div>
                )}
                {saveStatus === "error" && (
                  <div style={{ fontSize: "0.8rem", color: theme.danger }}>⚠ Falha de conexão ao enviar. Imprima seu comprovante para validação do professor.</div>
                )}
              </div>

              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px"
              }}>
                <button
                  onClick={handlePrint}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: `1px solid ${theme.border}`,
                    color: theme.white,
                    padding: "10px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.target.style.backgroundColor = "rgba(255,255,255,0.05)"}
                >
                  <Printer size={16} /> Imprimir Relatório
                </button>

                <Link
                  to="/fametro/poo/simulado-n2/ranking"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: theme.accent,
                    color: theme.white,
                    padding: "10px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: `0 4px 12px ${theme.accent}20`
                  }}
                >
                  <Trophy size={16} /> Ver Placar ao Vivo
                </Link>
              </div>
            </div>

            {/* Discursive card proof */}
            <div style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme.white, margin: 0 }}>
                  Resposta Discursiva Enviada (Modelo {model})
                </h3>
                <button
                  onClick={handleCopyText}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: copied ? theme.successBg : "rgba(255,255,255,0.05)",
                    border: `1px solid ${copied ? theme.success : theme.border}`,
                    color: copied ? theme.success : theme.white,
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: 600
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copiado!" : "Copiar Resposta"}
                </button>
              </div>

              <div style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: "1.25rem",
                borderRadius: "12px",
                border: `1px solid ${theme.border}`,
                color: theme.text,
                fontSize: "0.9rem",
                lineHeight: 1.6,
                maxHeight: "220px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                textAlign: "left"
              }}>
                {discursiveAnswer || "(Nenhum rascunho textual foi digitado para a discursiva)."}
              </div>
            </div>

            {/* comentated feedback */}
            <div style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}>
              <h3 style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: theme.white,
                marginTop: 0,
                marginBottom: "2rem",
                borderBottom: `1px solid ${theme.border}`,
                paddingBottom: "10px",
                textAlign: "left"
              }}>
                Correção Detalhada das Questões (Modelo {model})
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {questions.map((q, idx) => {
                  const userAns = answers[q.id];
                  const isRight = userAns === q.answer;

                  return (
                    <div 
                      key={q.id} 
                      style={{
                        padding: "1.5rem",
                        borderRadius: "16px",
                        border: `1.5px solid ${isRight ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                        backgroundColor: isRight ? "rgba(16, 185, 129, 0.01)" : "rgba(239, 68, 68, 0.01)",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: theme.white }}>
                          Questão {idx + 1} · {q.theme}
                        </span>
                        
                        <div>
                          {isRight ? (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: theme.success,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              backgroundColor: theme.successBg,
                              padding: "4px 8px",
                              borderRadius: "6px"
                            }}>
                              <CheckCircle size={12} /> Correta
                            </span>
                          ) : (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: theme.danger,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              backgroundColor: theme.dangerBg,
                              padding: "4px 8px",
                              borderRadius: "6px"
                            }}>
                              <XCircle size={12} /> Incorreta
                            </span>
                          )}
                        </div>
                      </div>

                      <p style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: theme.text,
                        margin: "0 0 1.5rem"
                      }}>
                        {q.text}
                      </p>

                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        fontSize: "0.85rem",
                        marginBottom: "1.25rem",
                        color: theme.textMuted
                      }}>
                        <div>
                          <strong>Sua Resposta:</strong>{" "}
                          <span style={{ color: isRight ? theme.success : theme.danger, fontWeight: 700 }}>
                            {userAns ? `${userAns})` : "Sem Resposta"}
                          </span>
                        </div>
                        {!isRight && (
                          <div>
                            <strong>Gabarito Oficial:</strong>{" "}
                            <span style={{ color: theme.success, fontWeight: 700 }}>
                              {q.answer})
                            </span>
                          </div>
                        )}
                      </div>

                      <div style={{
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                        backgroundColor: "rgba(255,255,255,0.01)",
                        padding: "1rem",
                        borderRadius: "10px",
                        border: `1px solid ${theme.border}`,
                        color: theme.text
                      }}>
                        <strong style={{ color: theme.white, display: "block", marginBottom: "4px" }}>Explicação Pedagógica:</strong>
                        {q.feedback}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Retry link */}
              <div style={{ marginTop: "3rem", textAlign: "center" }}>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: theme.textMuted,
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Realizar outro modelo de simulado
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
      
      {/* Styles injected locally */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          a, button, nav, .App-header, style {
            display: none !important;
          }
          div[style*="min-height"] {
            padding: 0 !important;
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          div[style*="max-width"] {
            max-width: 100% !important;
          }
          div[style*="background-color: rgb(15, 23, 42)"],
          div[style*="background-color: rgba(30, 41, 59"] {
            background: #ffffff !important;
            border: 1px solid #000000 !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

    </div>
  );
}
