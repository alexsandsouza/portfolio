// ─── QUESTIONS DATA - MODELO A (SIMULADO INÉDITO) ───────────────────────────────────────────────
export const QUESTIONS_A = [
  {
    id: 1,
    theme: "Spring Data JPA & ORM",
    text: "**Contexto Profissional:** Uma software house está integrando um novo desenvolvedor em sua equipe técnica para atuar no projeto de um sistema de prontuários médicos. O coordenador do time detalhou que a persistência de dados utiliza o ecossistema Spring Data JPA, de forma que o mapeamento entre classes Java e tabelas do banco de dados relacional PostgreSQL é gerenciado de forma transparente pelo ORM.\n\n**O Problema:** O desenvolvedor ficou responsável por criar a classe de modelo correspondente à entidade 'Medico' no sistema, mapeando-a para a tabela física chamada 'medicos', configurando seu identificador único como chave primária autoincrementada pelo banco de dados PostgreSQL.\n\n**Questão:** Para que o mecanismo de mapeamento objeto-relacional (ORM) do JPA reconheça a entidade e configure adequadamente sua tabela, chave primária e autoincremento, qual combinação de anotações deve ser declarada na classe Medico?",
    options: [
      "A) @RestController, @RequestMapping, @GetMapping e @PostMapping",
      "B) @Entity, @Table(name = \"medicos\"), @Id e @GeneratedValue(strategy = GenerationType.IDENTITY)",
      "C) @Component, @Service, @Autowired e @Transactional",
      "D) @Repository, @Query, @Modifying e @Param",
      "E) @Configuration, @Bean, @Value e @PropertySource"
    ],
    answer: "B",
    feedback: "A anotação @Entity define a classe como uma entidade persistente do JPA. @Table define o nome físico da tabela no banco ('medicos'). @Id marca a propriedade como chave primária e @GeneratedValue(strategy = GenerationType.IDENTITY) delega o autoincremento ao banco PostgreSQL."
  },
  {
    id: 2,
    theme: "Arquitetura em Camadas (MVC)",
    text: "**Contexto Profissional:** Um programador iniciante foi designado para desenvolver a funcionalidade de matrícula de estudantes em um sistema de controle acadêmico em Spring Boot. A gerência de engenharia orientou que, atendendo a boas práticas de design de software e arquitetura em camadas, a lógica de validação acadêmica do aluno não deve residir na classe que gerencia os endpoints da interface web.\n\n**O Problema:** O programador precisa estruturar um fluxo no qual o sistema capte as chamadas HTTP de cadastro, repasse a validação de regras de matrícula para a camada de serviços e execute a persistência das informações no PostgreSQL através do Spring Data JPA.\n\n**Questão:** Considerando a separação de conceitos na arquitetura em camadas do Spring Boot, qual a sequência correta de chamada e responsabilidade de cada componente no fluxo de matrícula do estudante?",
    options: [
      "A) Repository lida com a requisição, Service executa as validações de matrícula e Controller gerencia a gravação.",
      "B) Service lida com a requisição, Repository executa as validações de matrícula e Controller gerencia a gravação.",
      "C) Controller intercepta a requisição, Repository executa as validações de matrícula e Service gerencia a gravação.",
      "D) Controller recebe os dados de matrícula, Service processa as regras de negócio de validação e Repository persiste o registro.",
      "E) Service recebe os dados de matrícula, Controller processa as regras de negócio de validação e Repository persiste o registro."
    ],
    answer: "D",
    feedback: "No fluxo de uma aplicação em camadas do Spring Boot, o Controller (Apresentação) intercepta as requisições e faz a validação de entrada, o Service (Negócio) executa as regras lógicas e validações acadêmicas, e o Repository (Persistência) lida com a gravação física no banco."
  },
  {
    id: 3,
    theme: "Endpoints RESTful",
    text: "**Contexto Profissional:** Uma equipe técnica está desenvolvendo a API REST de controle de frotas corporativas. O time precisa implementar endpoints para buscar as informações detalhadas de um `Veiculo` específico por seu identificador único no sistema e para substituir por completo todos os dados de cadastro de um veículo já existente no banco.\n\n**O Problema:** O líder do projeto exigiu a observância de contratos de comunicação padronizados que respeitem a semântica dos verbos HTTP e as respectivas diretivas de mapeamento do Spring Boot.\n\n**Questão:** Para implementar a busca e a substituição completa dos dados do veículo conforme as diretrizes RESTful, quais verbos HTTP e anotações do Spring devem ser declarados no Controller?",
    options: [
      "A) POST com @PostMapping para localização e PUT com @PutMapping para substituição",
      "B) PUT com @PutMapping para localização e POST com @PostMapping para substituição",
      "C) GET com @GetMapping(\"/{id}\") para localização e PUT com @PutMapping(\"/{id}\") para substituição completa",
      "D) GET com @GetMapping para localização e PATCH com @PatchMapping para substituição completa",
      "E) DELETE com @DeleteMapping para localização e POST com @PostMapping para substituição completa"
    ],
    answer: "C",
    feedback: "A busca por identificador utiliza o método HTTP GET, mapeado por @GetMapping(\"/{id}\"). A atualização integral do recurso utiliza o método HTTP PUT, mapeado por @PutMapping(\"/{id}\"), especificando o identificador do recurso na URL."
  },
  {
    id: 4,
    theme: "Tratamento de Exceções & Integridade",
    text: "**Contexto Profissional:** Em um ERP de vendas de varejo estruturado em Spring Boot, usuários reportaram falhas de execução ao deletar uma Categoria de produtos. Sempre que tentavam remover uma categoria que ainda possuía produtos ativos associados, o sistema exibia na tela um erro 500 de servidor.\n\n**O Problema:** O programador foi instruído a tratar essa falha de violação de chave estrangeira, impedindo que a transação inválida quebre a integridade das informações e retornando uma notificação útil para o usuário na interface.\n\n**Questão:** Diante das diretrizes de desenvolvimento do Spring Boot para tratamento de exceções de persistência e integridade referencial, qual a melhor estratégia para sanar esse problema?",
    options: [
      "A) Utilizar @SuppressWarnings para omitir o erro e permitir que a exclusão continue mesmo com órfãos.",
      "B) Propagar a exceção original de banco diretamente para o cliente, pois o erro HTTP 500 já é autoexplicativo.",
      "C) Inserir um console logger na aplicação, ocultando a falha do usuário e retornando HTTP 200 com corpo vazio.",
      "D) Forçar a exclusão silenciosa em lote de todos os produtos ativos do banco sem consulta prévia ao administrador.",
      "E) Tratar a exceção de violação de dados com @ExceptionHandler ou @ControllerAdvice, gerando um status HTTP 409 (Conflict) com uma resposta estruturada de bloqueio."
    ],
    answer: "E",
    feedback: "A melhor abordagem é interceptar globalmente a exceção de banco de dados (como DataIntegrityViolationException) por um handler gerenciado por @ControllerAdvice e retornar o status HTTP 409 (Conflict) informando ao usuário que a remoção não é possível enquanto houver dependências ativas."
  },
  {
    id: 5,
    theme: "Thymeleaf Template Engine",
    text: "**Contexto Profissional:** Uma empresa de monitoramento energético substituiu seu front-end estático por páginas HTML processadas e geradas dinamicamente no servidor com o motor Thymeleaf integrado ao ecossistema do Spring Boot.\n\n**O Problema:** A equipe de desenvolvedores precisa documentar os fundamentos e explicar os benefícios de Server-Side Rendering (SSR) e a vantagem técnica em utilizar o Thymeleaf em detrimento de abordagens SPA complexas no cliente.\n\n**Questão:** Qual afirmativa define corretamente o mecanismo de renderização do Thymeleaf e seu principal benefício técnico?",
    options: [
      "A) O Thymeleaf processa as diretivas e insere os dados no servidor para gerar o HTML puro enviado ao cliente, permitindo criar telas dinâmicas através de atributos sem depender de frameworks JS complexos.",
      "B) O Thymeleaf funciona como um framework de scripts cliente, sendo processado e interpretado diretamente no navegador do usuário.",
      "C) O Thymeleaf atua como uma folha de estilo CSS pré-processada que estiliza os componentes do Spring Boot.",
      "D) O Thymeleaf é restrito à criação de relatórios em formato PDF e planilhas e não é adequado para compilar views web.",
      "E) O Thymeleaf depende de um servidor executável Node.js para interpretar os arquivos HTML dinâmicos da aplicação."
    ],
    answer: "A",
    feedback: "Thymeleaf realiza a renderização no servidor (SSR). O servidor lê as expressões contidas no template, processa os dados da lógica de negócio e gera HTML5 nativo e limpo para que os navegadores apenas o renderizem, reduzindo processamento no cliente."
  },
  {
    id: 6,
    theme: "Integração MVC & Thymeleaf",
    text: "**Contexto Profissional:** Um engenheiro de software precisa exibir uma lista de Funcionários vinculados a um departamento em uma tabela HTML dinâmica da aplicação.\n\n**O Problema:** O engenheiro precisa injetar a coleção de registros obtidos do banco no escopo da view no Controller e depois utilizar as diretivas de iteração e exibição textual nativas do Thymeleaf no template HTML para desenhar a listagem.\n\n**Questão:** Qual a sintaxe e métodos corretos no Controller e no HTML para efetuar essa integração?",
    options: [
      "A) O controller deve retornar a view sem propriedades e a página HTML deve rodar requisições AJAX assíncronas em JavaScript para obter a lista.",
      "B) O controller deve invocar model.addAttribute(\"funcionarios\", lista) e retornar a view; a tela deve iterar por th:each=\"f : ${funcionarios}\" e ler dados por th:text=\"${f.nome}\".",
      "C) O controller deve usar @ResponseBody e o Thymeleaf traduzirá o JSON resultante de forma automática por meio do atributo th:object.",
      "D) O controller deve persistir a coleção de dados diretamente nas configurações do arquivo application.properties e ler no HTML por th:property.",
      "E) O controller deve direcionar a lista para a saída do console e o Thymeleaf interceptará a string de log através da tag th:print."
    ],
    answer: "B",
    feedback: "O Controller preenche a chave da variável no Model utilizando `model.addAttribute(\"chave\", coleção)`. O Thymeleaf itera sobre a chave no HTML por `th:each=\"ponteiro : ${chave}\"` e exibe os atributos com `th:text=\"${ponteiro.atributo}\"`."
  },
  {
    id: 7,
    theme: "Padrões de Projeto & Desacoplamento",
    text: "**Contexto Profissional:** Em uma auditoria técnica de um sistema contábil legado, identificou-se que as classes controladoras faziam chamadas JDBC diretas de banco de dados e continham trechos de consultas SQL embutidos em seus métodos.\n\n**O Problema:** Esse acoplamento severo impedia a criação de testes de unidade eficientes e dificultava a alteração do fornecedor do banco de dados relacional. A equipe propôs modernizar a estrutura técnica da aplicação.\n\n**Questão:** No ecossistema do Spring Boot, qual padrão de projeto e arquitetura de software é adequado para desacoplar as telas de apresentação da persistência, garantindo testabilidade?",
    options: [
      "A) Concentrar as chamadas de banco no método do Controller, usando conexões JDBC diretas para acelerar a execução.",
      "B) Unificar todas as rotinas lógicas em um único controlador global que elimine a necessidade de criar classes e subcamadas no projeto.",
      "C) Criar heranças complexas entre as classes de dados e de apresentação, compartilhando dados diretamente pela árvore de herança.",
      "D) Adotar a estruturação em camadas com Controller (camada Web), Service (regras de negócio), Repository (abstração de acesso via Spring Data JPA) e injeção de dependências.",
      "E) Criar web services independentes baseados no protocolo SOAP para cada tabela física do banco de dados relacional."
    ],
    answer: "D",
    feedback: "A divisão clássica em camadas do Spring MVC separa as preocupações de forma clara: Controller trata as rotas e requisições HTTP, Service gerencia regras de negócio e validações lógicas, e o Repository lida com operações físicas de banco via JPA."
  },
  {
    id: 8,
    theme: "Metodologia de Desenvolvimento CRUD",
    text: "**Contexto Profissional:** Uma equipe de desenvolvedores recebeu a incumbência de criar um CRUD completo de reservas de veículos para uma locadora de automóveis.\n\n**O Problema:** O líder do projeto determinou que o desenvolvimento deve seguir uma ordem de passos que garanta que a modelagem lógica e o acesso aos dados sejam implementados e validados antes de integrar a visualização das telas com o usuário final.\n\n**Questão:** Qual a sequência metodológica lógica correta para finalizar o projeto CRUD full stack no Spring Boot e Thymeleaf?",
    options: [
      "A) Escrever primeiro as páginas HTML estáticas, aplicar estilos CSS e, em seguida, codificar rotinas JavaScript no cliente para gravar os dados.",
      "B) Programar a API REST com @RestController retornando JSON e criar um front-end apartado em React, dispensando o suporte do Thymeleaf.",
      "C) Desenhar o modelo de entidades de domínio, construir as interfaces Repository (JPA), implementar a lógica de negócio (Services), estruturar os Controllers (MVC), elaborar as views Thymeleaf e configurar o tratamento global de exceções.",
      "D) Codificar stored procedures no banco de dados e acioná-las diretamente de blocos de script embutidos nos arquivos HTML do Thymeleaf.",
      "E) Codificar a lógica inteira de interface, persistência e negócio em um único arquivo de classe contendo o método de execução procedural main."
    ],
    answer: "C",
    feedback: "Desenvolver de dentro para fora (Entidades -> Repositories -> Services -> Controllers -> Views -> Exception Handlers) assegura que a infraestrutura e lógica estejam estáveis e testadas antes de acoplar a visualização."
  }
];

// ─── QUESTIONS DATA - MODELO B (SIMULADO INÉDITO VARIANTE) ───────────────────────────────────────────────
export const QUESTIONS_B = [
  {
    id: 1,
    theme: "Spring Data JPA & ORM",
    text: "**Contexto Profissional:** Em um portal de e-commerce em desenvolvimento com o Spring Data JPA, é necessário mapear a classe Java 'Produto' para persistência no banco relacional PostgreSQL.\n\n**O Problema:** O líder técnico solicitou a estruturação da entidade Produto com chave primária do tipo autoincremento no banco e o mapeamento direcionado para a tabela física chamada 'tb_produtos' em letras minúsculas.\n\n**Questão:** Qual conjunto de anotações deve ser utilizado na classe Produto para satisfazer a essa configuração física e de mapeamento ORM?",
    options: [
      "A) @RestController, @RequestMapping(\"/produtos\"), @Id e @GeneratedValue(strategy = GenerationType.AUTO)",
      "B) @Entity, @Table(name = \"tb_produtos\"), @Id e @GeneratedValue(strategy = GenerationType.IDENTITY)",
      "C) @Component, @Service, @Autowired e @Column(name = \"tb_produtos\")",
      "D) @Repository, @Query, @Modifying e @Table(name = \"tb_produtos\")",
      "E) @Configuration, @Bean, @Value e @Table(name = \"tb_produtos\")"
    ],
    answer: "B",
    feedback: "A anotação @Entity torna a classe persistente. @Table(name = \"tb_produtos\") vincula o nome da tabela física. @Id marca o campo de chave primária e @GeneratedValue(strategy = GenerationType.IDENTITY) configura o autoincremento para o PostgreSQL."
  },
  {
    id: 2,
    theme: "Arquitetura em Camadas (MVC)",
    text: "**Contexto Profissional:** Uma equipe de desenvolvedores está projetando o módulo de cobrança financeira de uma aplicação SaaS corporativa. O líder técnico enfatizou o uso do desacoplamento rígido de responsabilidades.\n\n**O Problema:** Um novo desenvolvedor precisa implementar o fluxo em que uma requisição HTTP contendo o payload de uma fatura seja capturada, tenha suas regras de negócio aplicadas (cálculos de juros e multas) e, por fim, seja persistida no PostgreSQL.\n\n**Questão:** Qual a sequência e atribuição corretas dos componentes do ecossistema do Spring Boot para esse fluxo de gravação?",
    options: [
      "A) Repository lida com a requisição, Service executa os cálculos e Controller grava os registros físicos.",
      "B) Service lida com a requisição, Repository processa a lógica de negócio e Controller persiste no banco de dados.",
      "C) Controller valida os dados recebidos, Repository executa os cálculos e Service gerencia a persistência física.",
      "D) Controller recebe a requisição HTTP, Service processa as regras de negócio de cálculo e Repository persiste a entidade.",
      "E) Service recebe a requisição HTTP, Controller valida as regras de negócio e Repository gerencia a transação física."
    ],
    answer: "D",
    feedback: "O fluxo de processamento passa pela apresentação (Controller recebe requisição) -> negócio (Service faz cálculos de juros/multas) -> persistência (Repository aciona o JPA para salvar no banco)."
  },
  {
    id: 3,
    theme: "Endpoints RESTful",
    text: "**Contexto Profissional:** Uma plataforma de streaming musical está projetando os contratos de sua API pública para gerenciamento de playlists dos usuários.\n\n**O Problema:** Os endpoints devem obedecer estritamente às boas práticas RESTful. É necessário projetar a operação de exclusão física de uma playlist através de seu ID e a atualização parcial das informações de cabeçalho da playlist (como alterar apenas o nome ou descrição).\n\n**Questão:** Qual combinação de métodos HTTP e suas respectivas anotações Spring Boot atende perfeitamente a esse requisito RESTful?",
    options: [
      "A) POST com @PostMapping para exclusão e PUT com @PutMapping para atualização parcial",
      "B) DELETE com @DeleteMapping(\"/{id}\") para exclusão e PATCH com @PatchMapping(\"/{id}\") para atualização parcial",
      "C) GET com @GetMapping(\"/{id}\") para exclusão e PUT com @PutMapping(\"/{id}\") para atualização parcial",
      "D) DELETE com @DeleteMapping para exclusão e POST com @PostMapping para atualização parcial",
      "E) POST com @PostMapping(\"/{id}\") para exclusão e PUT com @PutMapping(\"/{id}\") para atualização parcial"
    ],
    answer: "B",
    feedback: "No padrão REST, a remoção de recursos utiliza o método HTTP DELETE mapeado por @DeleteMapping(\"/{id}\"). Atualizações parciais de campos específicos de um recurso utilizam o método HTTP PATCH mapeado por @PatchMapping(\"/{id}\")."
  },
  {
    id: 4,
    theme: "Tratamento de Exceções & Integridade",
    text: "**Contexto Profissional:** No módulo de vendas de um ERP em Spring Boot, ao excluir um cliente que possui notas fiscais ativas registradas em seu nome, o sistema falha por restrição de chave estrangeira no banco.\n\n**O Problema:** Sem um interceptador adequado, a aplicação exibe uma tela branca de erro padrão Whitelabel do Spring com HTTP 500. A gerência do produto exige que a resposta seja amigável para o cliente final e que a transação inválida seja bloqueada de forma limpa.\n\n**Questão:** Qual o mecanismo correto para capturar essa violação de banco de dados e retornar a resposta adequada no protocolo HTTP?",
    options: [
      "A) Utilizar anotações de compilação como @SuppressWarnings nos controllers para suprimir as exceções de banco de dados.",
      "B) Deixar que o servidor de aplicação propague o erro 500 para evidenciar ao cliente a falha na infraestrutura do banco.",
      "C) Interceptar com try-catch no Controller e exibir a stack trace com System.out.println() retornando HTTP 200 com corpo vazio.",
      "D) Excluir em cascata e silenciosamente todas as notas fiscais vinculadas ao cliente para desimpedir a deleção física.",
      "E) Implementar um interceptador global com @ControllerAdvice e tratar o erro de integridade com @ExceptionHandler, devolvendo HTTP 409 (Conflict)."
    ],
    answer: "E",
    feedback: "A criação de um interceptador global via @ControllerAdvice com tratamento direcionado a DataIntegrityViolationException por @ExceptionHandler permite responder com o status de conflito HTTP 409 (Conflict) e detalhar a causa de maneira legível."
  },
  {
    id: 5,
    theme: "Thymeleaf Template Engine",
    text: "**Contexto Profissional:** Um arquiteto está conduzindo a migração de um portal corporativo de Java Server Pages (JSP) para Thymeleaf no Spring Boot.\n\n**O Problema:** A equipe de desenvolvimento questiona como a renderização dinâmica acontece e por que o Thymeleaf é considerado um template engine natural ('Natural Template').\n\n**Questão:** Qual afirmação descreve de forma fiel o comportamento da renderização do Thymeleaf e seu caráter de 'template natural'?",
    options: [
      "A) O Thymeleaf processa as tags e atributos customizados no servidor, mantendo o HTML perfeitamente válido de forma que os templates podem ser abertos estaticamente no navegador.",
      "B) O Thymeleaf funciona exclusivamente injetando códigos JavaScript dinâmicos para compilação em tempo de execução no cliente.",
      "C) O Thymeleaf compila as estruturas em arquivos de estilo CSS que formatam de maneira nativa as fontes e cores das views.",
      "D) O Thymeleaf atua apenas interceptando e formatando logs do console do servidor e não interage com a visualização do usuário.",
      "E) O Thymeleaf exige a instalação obrigatória do compilador Node.js para converter os templates em estruturas Java binárias."
    ],
    answer: "A",
    feedback: "Thymeleaf é um template engine natural porque seus templates utilizam atributos HTML válidos (como th:text). Isso significa que as páginas podem ser abertas e visualizadas em um navegador como protótipos estáticos normais, ao mesmo tempo em que funcionam como templates dinâmicos no servidor."
  },
  {
    id: 6,
    theme: "Integração MVC & Thymeleaf",
    text: "**Contexto Profissional:** Um engenheiro de software precisa exibir em uma tela de Dashboard a lista de tarefas pendentes gravadas no banco de dados.\n\n**O Problema:** Ele deve injetar a coleção de tarefas no modelo do Spring MVC e estruturar a iteração do HTML para desenhar uma tabela exibindo a descrição e o prazo das tarefas.\n\n**Questão:** Qual a correta configuração no método do Controller e a sintaxe equivalente do Thymeleaf no HTML para cumprir essa tarefa?",
    options: [
      "A) Chamar o template passando dados por cookies do HTTP; no HTML, utilizar seletores JQuery AJAX dinâmicos do Thymeleaf.",
      "B) No controller, adicionar a lista via model.addAttribute(\"tarefas\", lista); no HTML, iterar com th:each=\"t : ${tarefas}\" e ler propriedades com th:text=\"${t.descricao}\".",
      "C) Aplicar a anotação @ResponseBody na classe Controller e resgatar o JSON no HTML pelo atributo th:object no cabeçalho.",
      "D) Registrar a lista no arquivo central application.properties e fazer o Thymeleaf renderizar usando a tag th:property.",
      "E) Imprimir a lista no console usando System.out.print; no HTML, invocar o comando de console th:print para capturar o buffer."
    ],
    answer: "B",
    feedback: "No controller injeta-se o Model para fazer `model.addAttribute(\"tarefas\", lista)`. No template, a iteração de coleções é feita pelo atributo `th:each=\"t : ${tarefas}\"` e a impressão textual pelo `th:text=\"${t.descricao}\"`."
  },
  {
    id: 7,
    theme: "Padrões de Projeto & Desacoplamento",
    text: "**Contexto Profissional:** Um sistema de agendamento de consultas médicas apresentava sérios gargalos de manutenção porque os controladores continham regras complexas de negócios e chamadas JDBC diretas.\n\n**O Problema:** Para solucionar o acoplamento, a equipe de engenharia decidiu reestruturar a aplicação utilizando injeção de dependências e isolamento em camadas.\n\n**Questão:** Sob as diretrizes do ecossistema Spring Boot, qual padrão arquitetural resolve adequadamente esse acoplamento excessivo?",
    options: [
      "A) Concentrar as chamadas de banco no arquivo index.html e acionar consultas SQL diretamente por JavaScript no front-end.",
      "B) Agrupar toda a lógica de negócio e queries de banco de dados em uma única classe utilitária do tipo Helper com métodos estáticos.",
      "C) Adotar herança múltipla de interfaces de referência e expor o banco diretamente para a camada de visualização.",
      "D) Adotar uma arquitetura estruturada com Controller (camada web), Service (lógica de negócios), Repository (acesso aos dados) e injeção de dependências.",
      "E) Criar microserviços isolados para cada método de tabela de banco de dados, estabelecendo comunicação restrita via XML e SOAP."
    ],
    answer: "D",
    feedback: "A divisão clássica em camadas do Spring MVC acopla as responsabilidades de forma fraca por injeção de dependência (DI). A injeção de repositórios nos services e de services nos controllers separa as responsabilidades de forma limpa."
  },
  {
    id: 8,
    theme: "Metodologia de Desenvolvimento CRUD",
    text: "**Contexto Profissional:** Uma equipe está desenvolvendo uma plataforma de gerenciamento de frotas de veículos. Eles precisam implementar o CRUD de motoristas e carros.\n\n**O Problema:** A equipe quer adotar uma metodologia estruturada que permita testar os acessos ao banco PostgreSQL antes de codificar a camada web e os templates visuais.\n\n**Questão:** Qual a sequência lógica de implementação recomendada para garantir a construção incremental e robusta dessa aplicação web?",
    options: [
      "A) Iniciar desenhando os protótipos de páginas HTML, adicionar as rotinas JS e depois escrever as consultas JDBC no navegador.",
      "B) Configurar os métodos do @RestController expondo JSON e, em seguida, programar o front-end em React, desconsiderando o Thymeleaf.",
      "C) Modelar as Entidades JPA, criar as interfaces dos Repositories, implementar as lógicas de negócio nos Services, configurar os Controllers MVC e codificar os templates Thymeleaf.",
      "D) Escrever scripts de persistência no PostgreSQL, compilar stored procedures e chamá-las diretamente nos templates do Thymeleaf.",
      "E) Escrever toda a lógica de persistência e interface em uma classe única com método main, compilando tudo como script procedural."
    ],
    answer: "C",
    feedback: "A construção de dentro para fora (Entidades -> Repositories -> Services -> Controllers -> Views) permite testar e assegurar a integridade da persistência e da lógica de negócios antes de integrá-las na visualização."
  }
];

// ─── DISCURSIVE DATA ─────────────────────────────────────────────────────────
export const STUDY_CASE_A = {
  title: "Modernização Tecnológica do Sistema Rápido Amazonas",
  context: "A startup NorteSistemas, sediada em Manaus, foi contratada pela Rápido Amazonas, uma tradicional empresa de transportes de cargas que atua no transporte fluvial e rodoviário de mercadorias no Amazonas, Roraima e Pará. O desafio consiste em reestruturar e modernizar o sistema de cadastro e rastreamento de portos, embarcações, fretes e motoristas, eliminando planilhas de controle local que geravam duplicidades e falhas graves de integridade. O arquiteto técnico da NorteSistemas propôs a adoção do Spring Boot com Spring Data JPA e banco de dados PostgreSQL. Dois desenvolvedores sêniores da equipe, habituados a sistemas legados, discordaram da decisão: um propôs manter queries SQL manuais nativas via JDBC sob o pretexto de otimizar a velocidade das consultas; outro sugeriu o padrão DAO sem uso de frameworks de mercado. A equipe de desenvolvimento do projeto é formada predominantemente por desenvolvedores júniores e estagiários com poucos meses de experiência prática em ORM (Object-Relational Mapping). O prazo limite de entrega é de 60 dias. O sistema precisará suportar operações completas de CRUD, consultas por múltiplos critérios dinâmicos e exclusão lógica de registros.",
  statement: "Considerando as diretrizes acadêmicas de Tecnologia Web e orientação arquitetural de software, redija um texto dissertativo-argumentativo (mínimo de 30 linhas) abordando, de forma integrada, os seguintes quesitos:\n\nA) Justifique a escolha do Spring Data JPA no projeto da Rápido Amazonas em detrimento do JDBC puro e do padrão DAO tradicional, sob a perspectiva de produtividade da equipe júnior, manutenibilidade do código e curva de aprendizado.\nB) Detalhe o mecanismo de ORM (Object-Relational Mapping), explicando como a especificação JPA resolve o abismo de impedância conceitual entre classes Java e tabelas relacionais do PostgreSQL, e descreva o papel das anotações básicas de mapeamento da entidade Embarcacao (@Entity, @Table, @Id, @GeneratedValue).\nC) Explique a importância e o uso das anotações @Column e @OneToMany no mapeamento das associações de dados entre Porto, Embarcacao e Frete, fornecendo um exemplo conceitual de código ou lógica de relacionamento entre essas classes Java.\nD) Faça uma análise crítica sobre os limites e riscos de performance inerentes ao uso de ORMs em larga escala (como o problema do N+1 e a sobrecarga de memória) e descreva estratégias práticas de otimização (como FetchType.LAZY e JOIN FETCH via JPQL) sem abrir mão do Spring Data JPA.",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Justificativa e Produtividade:\n• JPA fornece repositórios gerados automaticamente pelo Spring, reduzindo drasticamente o código repetitivo.\n• A injeção de dependências do Spring simplifica o trabalho da equipe júnior, acelerando as entregas dentro do prazo de 60 dias.\n• Manutibilidade de consultas básicas delegada ao framework, facilitando a portabilidade do banco de dados.\n\nB) Reconciliação ORM e Impedância:\n• O mapeamento converte a lógica orientada a objetos (associações, herança, tipos Java) em tabelas relacionais.\n• Anotações básicas: @Entity (declara a entidade persistente), @Table (nome no banco relacional), @Id (chave primária) e @GeneratedValue (estratégia de incremento).\n\nC) Associações e @OneToMany:\n• @Column: Regula restrições físicas das colunas no PostgreSQL (nullable, length, unique).\n• @OneToMany: Define associação de 1-para-N (um Porto possui várias Embarcações; uma Embarcação possui vários Fretes).\n• Exemplo que demonstre como as chaves estrangeiras são representadas em coleções na orientação a objetos.\n\nD) Limites e Otimização:\n• Risco de N+1 consultas adicionais no banco ao carregar coleções em loops.\n• Otimizações: Habilitar FetchType.LAZY nas anotações de relacionamento; usar 'JOIN FETCH' em métodos de consultas customizadas com @Query no Repository para agrupar as buscas de filhos; usar Projections (interfaces DTO) para evitar carregar colunas desnecessárias na memória do servidor."
};

export const STUDY_CASE_B = {
  title: "Plano de Modernização Arquitetural da ManausFood",
  context: "A startup ManausFood, especializada no delivery de produtos alimentícios da Amazônia, está expandindo suas operações de entrega. Ela contratou a equipe de engenharia para reestruturar seu sistema de controle de pedidos, restaurantes parceiros e entregadores. Atualmente, o sistema usa consultas SQL nativas rígidas inseridas diretamente nas classes de visualização no front-end, resultando em recorrentes travamentos no banco PostgreSQL. O CTO propôs adotar o ecossistema Spring Boot com Spring Data JPA para substituir o legado. Parte dos engenheiros, porém, demonstra preocupação com a perda de controle sobre as queries e os potenciais gargalos de desempenho em horários de pico. O prazo para migração é apertado e a equipe de desenvolvimento é formada majoritariamente por desenvolvedores juniores que necessitam de padrões arquiteturais simplificados e seguros. Como analista líder, cabe a você arquitetar essa nova camada de persistência e propor o plano de contingência e escalabilidade.",
  statement: "Considerando os conhecimentos sobre arquitetura MVC, mapeamento objeto-relacional e injeção de dependências, elabore um texto dissertativo-argumentativo (mínimo de 30 linhas) detalhando seu plano de reestruturação técnica. Seu texto deve obrigatoriamente abranger os seguintes tópicos:\n\nA) Apresente o diagnóstico das falhas arquiteturais do sistema legado da ManausFood, justificando como a injeção de dependências e a separação em camadas (Controller, Service, Repository) eliminam o acoplamento do código.\nB) Detalhe o funcionamento do mapeamento objeto-relacional (ORM), explicando como o JPA reconcilia o abismo conceitual entre objetos e tabelas SQL e o papel das anotações básicas de mapeamento da entidade Pedido.\nC) Explique as anotações de associação de tabelas (@ManyToOne e @OneToMany), ilustrando através de um exemplo conceitual de relacionamento entre as classes Cliente, Pedido e Restaurante.\nD) Analise os riscos de degradação de performance do ORM sob carga de tráfego extrema (como o problema das consultas N+1) e aponte as técnicas de otimização (como projeções de dados DTO e carregamento Lazy) no Spring Data JPA.",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Diagnóstico e Desacoplamento:\n• SQL diretamente na camada visual causa acoplamento severo e inviabiliza testes.\n• Divisão em camadas isola responsabilidades: Controller (web/HTTP), Service (regras de negócio) e Repository (acesso ao banco).\n• Injeção de Dependência remove instanciação manual, gerando código flexível.\n\nB) Reconciliação ORM:\n• O JPA abstrai os comandos SQL, mapeando atributos Java a colunas de tabelas relacionais.\n• Anotações: @Entity (identifica entidade JPA), @Table (nome no PostgreSQL), @Id (chave primária) e @GeneratedValue (estratégia de autoincremento).\n\nC) Associações de Tabelas:\n• @ManyToOne: Vários pedidos pertencem a um Cliente.\n• @OneToMany: Um Restaurante possui vários Pedidos.\n• Exemplo conceitual mapeando as chaves estrangeiras de forma que a integridade física seja assegurada.\n\nD) Riscos e Otimização de Performance:\n• Problema do N+1: O Spring JPA executa uma consulta para a entidade pai e N consultas adicionais para cada filho associado.\n• Otimizações: Mudar associações para carregamento preguiçoso (FetchType.LAZY); utilizar queries customizadas com 'JOIN FETCH' no Spring Repository; e criar Projections DTO para retornar apenas colunas necessárias, evitando carregar objetos pesados na memória."
};
