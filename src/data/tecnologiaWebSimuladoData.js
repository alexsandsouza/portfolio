// ─── QUESTIONS DATA - MODELO A (ORIGINAL) ───────────────────────────────────────────────
export const QUESTIONS_A = [
  {
    id: 1,
    theme: "Spring Data JPA & ORM",
    text: "**Contexto Profissional:** Uma empresa de desenvolvimento de software contratou um analista recém-formado para trabalhar em um projeto de gestão de clientes. O coordenador técnico explicou que a equipe utiliza o Spring Data JPA para persistência de dados e que o mapeamento entre as classes Java e as tabelas do banco de dados é feito automaticamente pelo framework.\n\n**O Problema:** O analista ficou responsável por criar a classe que representará a entidade 'Cliente' no sistema, garantindo que ela seja corretamente reconhecida pelo mecanismo de ORM (Object-Relational Mapping) do Spring.\n\n**Questão:** Considerando que o Spring Data JPA utiliza o padrão ORM para abstrair a camada de persistência, qual conjunto de anotações deve ser utilizado na classe Cliente para que o framework reconheça corretamente a entidade, defina sua tabela correspondente no banco de dados, identifique a chave primária e configure a geração automática de valores para essa chave?",
    options: [
      "A) @RestController, @RequestMapping, @GetMapping e @PostMapping",
      "B) @Entity, @Table(name = \"clientes\"), @Id e @GeneratedValue(strategy = GenerationType.IDENTITY)",
      "C) @Component, @Service, @Autowired e @Transactional",
      "D) @Repository, @Query, @Modifying e @Param",
      "E) @Configuration, @Bean, @Value e @PropertySource"
    ],
    answer: "B",
    feedback: "No ecossistema JPA/Hibernate, a anotação @Entity define a classe como uma entidade persistente, @Table especifica o nome da tabela física no banco, @Id indica o atributo chave primária, e @GeneratedValue configura o autoincremento (IDENTITY) no banco de dados."
  },
  {
    id: 2,
    theme: "Arquitetura em Camadas (MVC)",
    text: "**Contexto Profissional:** Um desenvolvedor júnior foi designado para implementar a funcionalidade de cadastro de produtos em um sistema de e-commerce construído com Spring Boot. O arquiteto do projeto orientou que, seguindo as boas práticas de arquitetura em camadas, a lógica de criação de novos registros deve ser separada da camada de apresentação.\n\n**O Problema:** O desenvolvedor precisa criar uma classe que receba as requisições HTTP, delegue a lógica de negócio para a camada de serviço e, por fim, persista os dados utilizando o Spring Data JPA.\n\n**Questão:** Diante dessa arquitetura em camadas, qual é a sequência correta de componentes e suas responsabilidades no fluxo de criação de um novo produto, desde a recepção da requisição até a persistência no banco de dados?",
    options: [
      "A) Repository recebe a requisição, Service valida os dados e Controller persiste no banco",
      "B) Service recebe a requisição, Repository processa a lógica e Controller persiste no banco",
      "C) Controller valida os dados, Repository processa a lógica de negócio e Service persiste no banco",
      "D) Controller recebe a requisição, Service processa a lógica de negócio e Repository persiste os dados",
      "E) Service recebe a requisição, Controller processa a lógica e Repository valida os dados"
    ],
    answer: "D",
    feedback: "O fluxo de controle correto no padrão MVC adotado no Spring Boot é: a requisição HTTP é capturada pelo Controller (camada de apresentação), que delega a lógica de negócio para a Service (camada de serviço), que por sua vez utiliza o Repository (camada de persistência) para salvar os dados no banco relacional."
  },
  {
    id: 3,
    theme: "Endpoints RESTful",
    text: "**Contexto Profissional:** Uma equipe de desenvolvimento está construindo uma API REST para gerenciamento de pedidos em um sistema de vendas. Após implementar as operações de criação e listagem, os desenvolvedores precisam agora disponibilizar endpoints para buscar um pedido específico pelo seu identificador e para atualizar as informações de um pedido existente.\n\n**O Problema:** O tech lead orientou que essas operações devem seguir os padrões RESTful e utilizar corretamente os verbos HTTP e as anotações de mapeamento do Spring.\n\n**Questão:** Considerando os padrões RESTful e as anotações do Spring Boot para mapeamento de requisições, qual combinação de verbo HTTP e anotação correspondente deve ser utilizada para implementar, respectivamente, a busca de um pedido por ID e a atualização completa dos dados de um pedido existente?",
    options: [
      "A) POST com @PostMapping para busca e PUT com @PutMapping para atualização",
      "B) PUT com @PutMapping para busca e POST com @PostMapping para atualização",
      "C) GET com @GetMapping(\"/{id}\") para busca e PUT com @PutMapping(\"/{id}\") para atualização",
      "D) GET com @GetMapping para busca e PATCH com @PatchMapping para atualização",
      "E) DELETE com @DeleteMapping para busca e POST com @PostMapping para atualização"
    ],
    answer: "C",
    feedback: "Segundo o padrão REST, operações de consulta segura de recursos pelo ID devem usar o método HTTP GET mapeado por @GetMapping(\"/{id}\"), enquanto atualizações totais de recursos devem usar o método PUT mapeado por @PutMapping(\"/{id}\")."
  },
  {
    id: 4,
    theme: "Tratamento de Exceções & Integridade",
    text: "**Contexto Profissional:** Um sistema de gestão acadêmica desenvolvido em Spring Boot apresentou falhas durante a exclusão de registros de disciplinas. Os usuários relataram que, ao tentarem remover uma disciplina que possuía turmas vinculadas, o sistema retornava um erro genérico de servidor (HTTP 500) sem informar a causa real do problema.\n\n**O Problema:** O gestor de TI solicitou ao time de desenvolvimento que implementasse um tratamento adequado de exceções, garantindo que o sistema retornasse mensagens claras ao usuário e mantivesse a integridade dos dados.\n\n**Questão:** Considerando as boas práticas de tratamento de exceções em aplicações Spring Boot e a necessidade de manter a integridade referencial dos dados, qual abordagem representa a solução mais adequada para tratar o cenário de exclusão de uma disciplina com dependências vinculadas?",
    options: [
      "A) Utilizar @SuppressWarnings para ignorar a exceção e permitir a exclusão forçada no banco de dados",
      "B) Deixar a exceção propagar sem tratamento, pois o erro HTTP 500 já é suficiente para o usuário final",
      "C) Utilizar System.out.println() no console do servidor para registrar o erro e retornar HTTP 200 com corpo vazio",
      "D) Excluir primeiro todas as turmas vinculadas automaticamente, sem consultar o usuário, e depois excluir a disciplina",
      "E) Capturar a exceção com @ExceptionHandler ou ControllerAdvice, retornar uma resposta HTTP 409 (Conflict) com mensagem explicativa e impedir a exclusão que violaria integridade referencial"
    ],
    answer: "E",
    feedback: "Erros de integridade no banco (DataIntegrityViolationException) não devem vazar como HTTP 500. A melhor prática é capturá-los com uma classe de aconselhamento global (@ControllerAdvice) e responder com HTTP 409 (Conflict), instruindo o usuário a desvincular as turmas antes da exclusão."
  },
  {
    id: 5,
    theme: "Thymeleaf Template Engine",
    text: "**Contexto Profissional:** Uma startup de tecnologia decidiu evoluir sua API REST pura para uma aplicação web completa com interface visual. O arquiteto de software sugeriu a adoção do Thymeleaf como template engine, argumentando que essa tecnologia se integra nativamente ao ecossistema Spring e permite a criação de páginas HTML dinâmicas sem a necessidade de frameworks JavaScript complexos no front-end.\n\n**O Problema:** A equipe precisou estudar os fundamentos dessa tecnologia para implementar as primeiras views do projeto.\n\n**Questão:** Considerando as características do Thymeleaf como template engine para aplicações Spring Boot, qual afirmação descreve corretamente seu funcionamento e principal vantagem no contexto de uma aplicação full stack com arquitetura server-side rendering?",
    options: [
      "A) Thymeleaf processa templates no servidor antes de enviar HTML puro ao cliente, permitindo que desenvolvedores utilizem atributos especiais em HTML para iterar dados e criar páginas dinâmicas sem JavaScript no front-end",
      "B) Thymeleaf é um framework JavaScript que executa no navegador e substitui completamente o uso de HTML estático",
      "C) Thymeleaf é uma biblioteca de estilos CSS que aplica temas visuais automaticamente às páginas HTML do Spring Boot",
      "D) Thymeleaf funciona exclusivamente como motor de envio de e-mails e não pode renderizar páginas web completas",
      "E) Thymeleaf requer a instalação de um servidor Node.js separado para compilar os templates antes do deployment"
    ],
    answer: "A",
    feedback: "Thymeleaf é um motor de template Java para processamento do lado do servidor (Server-Side Rendering). Ele interpreta o código HTML estendido com atributos especiais (ex: th:text, th:each) gerando um arquivo HTML5 limpo que pode ser aberto diretamente pelo navegador sem servidores front-end adicionais."
  },
  {
    id: 6,
    theme: "Integração MVC & Thymeleaf",
    text: "**Contexto Profissional:** Um desenvolvedor está implementando a primeira funcionalidade de integração full stack em um projeto Spring Boot com Thymeleaf. A tarefa consiste em exibir uma lista de fornecedores cadastrados no banco de dados em uma página HTML. O desenvolvedor já criou a entidade, o repositório e o controller que recupera os dados.\n\n**O Problema:** Agora, ele precisa configurar corretamente o controller para enviar a lista de fornecedores à view e utilizar a sintaxe Thymeleaf para renderizar esses dados na página.\n\n**Questão:** Considerando o padrão MVC e a integração entre Spring Boot e Thymeleaf, qual é a forma correta de adicionar a lista de fornecedores ao modelo da view no controller e, consequentemente, iterar sobre essa lista no template Thymeleaf para exibição em uma tabela HTML?",
    options: [
      "A) No controller, retornar apenas o nome da view como String sem parâmetros; no template, usar JavaScript puro para fazer requisição AJAX ao endpoint da API",
      "B) No controller, utilizar model.addAttribute(\"fornecedores\", lista) e retornar o nome da view; no template, usar th:each=\"fornecedor : ${fornecedores}\" para iterar e th:text=\"${fornecedor.nome}\" para exibir os dados",
      "C) No controller, utilizar @ResponseBody para retornar JSON; no template, usar th:object para converter JSON em HTML automaticamente",
      "D) No controller, salvar a lista diretamente no application.properties; no template, usar th:property para ler do arquivo de configuração",
      "E) No controller, utilizar System.out.println() para imprimir a lista; no template, usar th:print para capturar a saída do console"
    ],
    answer: "B",
    feedback: "A integração se dá injetando a interface Model no parâmetro do método do Controller, inserindo a lista através de addAttribute, e recuperando-a no Thymeleaf via expressão de variável ${fornecedores} associada ao iterador th:each."
  },
  {
    id: 7,
    theme: "Padrões de Projeto & Desacoplamento",
    text: "**Contexto Profissional:** Uma empresa de consultoria em software foi contratada para revisar a arquitetura de um sistema legado que apresentava alto acoplamento entre a camada de apresentação e a camada de acesso a dados.\n\n**O Problema:** Os consultores identificaram que as classes de controller acessavam diretamente as queries SQL, dificultando a manutenção, os testes unitários e a substituição do banco de dados. A proposta de modernização envolveu a adoção de padrões de projeto e arquitetura que promovessem a separação de responsabilidades e a testabilidade do código.\n\n**Questão:** Considerando os padrões de projeto e arquitetura apresentados no contexto de aplicações Spring Boot, qual conjunto de camadas e padrões representa a solução adequada para desacoplar a apresentação da persistência, promovendo testabilidade e manutenibilidade?",
    options: [
      "A) Utilizar apenas o padrão MVC, concentrando toda a lógica no Controller e acessando o banco via JDBC diretamente",
      "B) Criar uma única classe Facade que contenha todas as operações do sistema, eliminando a necessidade de separação",
      "C) Implementar o padrão Singleton em todas as classes e utilizar herança múltipla para compartilhar métodos de acesso a dados",
      "D) Adotar a arquitetura em camadas com Controller (MVC), Service (regras de negócio), Repository (padrão Repository com Spring Data JPA) e injeção de dependências entre as camadas",
      "E) Utilizar o padrão SOA criando um serviço web separado para cada tabela do banco de dados, comunicando-se via SOAP"
    ],
    answer: "D",
    feedback: "Adotar camadas bem definidas acopladas levemente por injeção de dependências (DI) é a melhor prática em Spring Boot. O Controller lida com a requisição, o Service encapsula as regras de negócio, e o Repository lida exclusivamente com o acesso aos dados."
  },
  {
    id: 8,
    theme: "Metodologia de Desenvolvimento CRUD",
    text: "**Contexto Profissional:** Um projeto acadêmico de conclusão de curso em Sistemas de Informação envolve a construção de um sistema completo de gerenciamento de biblioteca. Os alunos precisam entregar uma aplicação full stack que permita o cadastro, consulta, atualização e exclusão de livros, autores e empréstimos.\n\n**O Problema:** O orientador exigiu que o projeto utilizasse Spring Boot no back-end, Thymeleaf no front-end, seguisse o padrão arquitetural MVC e implementasse todas as operações CRUD com tratamento adequado de erros.\n\n**Questão:** Considerando os requisitos do projeto final e a necessidade de integração completa entre todas as camadas da aplicação, qual sequência de implementação representa a abordagem metodologicamente correta para finalizar o projeto CRUD full stack, garantindo que cada camada seja construída sobre bases sólidas e testáveis?",
    options: [
      "A) Iniciar pela criação das páginas HTML estáticas, depois adicionar CSS e, por último, tentar conectar ao banco de dados via scripts JavaScript no navegador",
      "B) Criar diretamente os controllers REST com @RestController, retornando JSON para todas as requisições, e utilizar um framework front-end separado como React, ignorando o Thymeleaf",
      "C) Modelar as entidades de domínio, criar os repositórios Spring Data JPA, implementar os services com regras de negócio, construir os controllers com endpoints CRUD, desenvolver as views Thymeleaf e, por fim, adicionar tratamento global de exceções",
      "D) Implementar primeiro o banco de dados via SQL puro, depois criar procedures armazenadas para todas as operações e, por fim, chamar essas procedures diretamente dos templates Thymeleaf",
      "E) Desenvolver o sistema completo em uma única classe Java com método main, contendo toda a lógica de apresentação, negócio e persistência em sequência procedural"
    ],
    answer: "C",
    feedback: "A metodologia clássica e segura consiste em modelar de dentro para fora: Banco/Entidades de Domínio -> Camada de Persistência (Repository) -> Camada de Negócio (Service) -> Camada de Controle (Controller) -> Telas (Thymeleaf/CSS/HTML) -> Ajustes de qualidade como tratamento de erros global."
  }
];

// ─── QUESTIONS DATA - MODELO B (SIMULADO) ───────────────────────────────────────────────
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
    feedback: "No controller injeta-se o Model para fazer `model.addAttribute(\"chave\", valor)`. No template, a iteração de coleções é feita pelo atributo `th:each=\"variável : ${chave}\"` e a impressão textual pelo `th:text=\"${variável.atributo}\"`."
  },
  {
    id: 7,
    theme: "Padrões de Projeto & Desacoplamento",
    text: "**Contexto Profissional:** Um sistema de agendamento de consultas médicas apresentava sérios gargalos de manutenção porque os controladores continham regras complexas de negócios e chamadas JDBC diretas.\n\n**O Problema:** Para solucionar o acoplamento, a equipe de engenharia decidiu reestruturar a aplicação utilizando injeção de dependências e isolamento em camadas.\n\n**Questão:** Sob as diretrizes do ecossistema Spring Boot, qual padrão arquitetural resolve adequadamente esse acoplamento excessivo?",
    options: [
      "A) Concentrar as chamadas de banco no arquivo index.html e acionar consultas SQL diretamente por JavaScript no front-end.",
      "B) Agrupar toda a lógica de negócio e queries de banco de dados em uma única classe utilitária do tipo Helper com métodos estáticos.",
      "C) Adotar herança múltipla de interfaces de persistência e expor o banco diretamente para a camada de visualização.",
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
  title: "Modernização do Sistema Amazônia Logística",
  context: "A startup TechSolutions, sediada em Manaus, desenvolve sistemas de gestão para pequenas e médias empresas da região Norte. Recentemente, foi contratada pela Amazônia Logística, empresa de transporte de cargas que opera em quatro estados amazônicos. O desafio consiste em modernizar o sistema de cadastro de motoristas, veículos e rotas, que atualmente utiliza planilhas Excel e apresenta sérios problemas de integridade de dados, redundância e dificuldade de consulta. O arquiteto de software da TechSolutions propôs a adoção do ecossistema Spring Boot com Spring Data JPA para persistência, argumentando que o padrão ORM (Object-Relational Mapping) eliminaria a necessidade de escrever SQL manualmente, aumentaria a produtividade da equipe e padronizaria o acesso ao banco de dados relacional PostgreSQL. No entanto, dois desenvolvedores seniores discordaram: um defendeu o uso de JDBC puro para maior controle das queries; outro sugeriu o padrão DAO (Data Access Object) tradicional sem frameworks. A equipe de desenvolvimento, composta por estagiários e juniores, possui pouca experiência com JPA e conceitos de mapeamento objeto-relacional. O prazo de entrega é de 60 dias, e o sistema precisa suportar operações de cadastro, consulta por múltiplos critérios, atualização de status de veículos e exclusão lógica de motoristas inativos. A Amazônia Logística exige que o sistema seja documentado e que a transição dos dados das planilhas para o banco relacional ocorra sem perda de informação. Diante desse cenário, você foi designado como desenvolvedor responsável pela modelagem das entidades e pela configuração do mapeamento ORM.",
  statement: "Considerando as competências profissionais requeridas na Tecnologia da Informação — incluindo capacidade de tomada de decisão arquitetural, domínio conceitual e injeção de boas práticas de performance —, redija um texto dissertativo-argumentativo (com mínimo de 30 linhas) abordando os seguintes aspectos estruturantes:\n\nA) Justifique a escolha do Spring Data JPA em detrimento do JDBC puro e do padrão DAO tradicional para o projeto da Amazônia Logística, considerando produtividade, manutenibilidade e curva de aprendizado da equipe.\nB) Explique como o mecanismo de ORM (Object-Relational Mapping) do JPA resolve o problema de impedância entre o modelo orientado a objetos (classes Java) e o modelo relacional (tabelas do PostgreSQL), citando as principais anotações de persistência (@Entity, @Table, @Id, @GeneratedValue).\nC) Discuta a importância das anotações @Column e @OneToMany na modelagem das entidades Motorista, Veiculo e Rota, apresentando conceitualmente e por meio de exemplo prático as relações e mapeamento dessas classes.\nD) Avalie criticamente os limites e cuidados necessários ao utilizar ORM em projetos com grande volume de dados e consultas complexas, propondo estratégias (como lazy loading e consultas customizadas via JPQL com JOIN FETCH) para mitigar problemas de performance no Spring Data JPA.",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Justificativa Tecnológica:\n• Produtividade: O Spring Data JPA reduz linhas de código boilerplates criando CRUDs básicos de forma transparente.\n• Curva de aprendizado: A equipe júnior/estagiários ganha tempo ao focar nas regras de negócio em vez de gerenciar transações JDBC manuais.\n• Manutenibilidade: Padronização arquitetural nativa que substitui as classes DAO proprietárias complexas.\n\nB) Resolução do Problema de Impedância ORM:\n• O ORM conecta o modelo relacional baseado em chaves e tabelas ao modelo orientado a objetos baseado em classes e herança.\n• Explicação das anotações: @Entity (indica entidade JPA), @Table (vincula à tabela do PostgreSQL), @Id (chave primária) e @GeneratedValue (autoincremento).\n\nC) Mapeamentos e Relações:\n• @Column: Configura as restrições dos campos (nullability, length, unique).\n• @OneToMany: Mapeamento de relacionamentos 1-para-N (ex: uma Rota contém múltiplos Veículos vinculados).\n• Apresentação de um exemplo de mapeamento polimórfico ou estruturado das associações entre as entidades do domínio.\n\nD) Limites e Performance:\n• Problema do N+1: O carregamento inapropriado de coleções causa avalanche de consultas SQL ao banco.\n• Solução: Ajustar coleções para LAZY por padrão; implementar consultas otimizadas utilizando JPQL com 'JOIN FETCH' no Repository para carregar as relações em uma única query; utilizar DTOs projetados (Projections) para queries parciais."
};

export const STUDY_CASE_B = {
  title: "Plano de Modernização Arquitetural da ManausFood",
  context: "A startup ManausFood, especializada no delivery de produtos alimentícios da Amazônia, está expandindo suas operações de entrega. Ela contratou a equipe de engenharia para reestruturar seu sistema de controle de pedidos, restaurantes parceiros e entregadores. Atualmente, o sistema usa consultas SQL nativas rígidas inseridas diretamente nas classes de visualização no front-end, resultando em recorrentes travamentos no banco PostgreSQL. O CTO propôs adotar o ecossistema Spring Boot com Spring Data JPA para substituir o legado. Parte dos engenheiros, porém, demonstra preocupação com a perda de controle sobre as queries e os potenciais gargalos de desempenho em horários de pico. O prazo para migração é apertado e a equipe de desenvolvimento é formada majoritariamente por desenvolvedores juniores que necessitam de padrões arquiteturais simplificados e seguros. Como analista líder, cabe a você arquitetar essa nova camada de persistência e propor o plano de contingência e escalabilidade.",
  statement: "Considerando os conhecimentos sobre arquitetura MVC, mapeamento objeto-relacional e injeção de dependências, elabore um texto dissertativo-argumentativo (mínimo de 30 linhas) detalhando seu plano de reestruturação técnica. Seu texto deve obrigatoriamente abranger os seguintes tópicos:\n\nA) Apresente o diagnóstico das falhas arquiteturais do sistema legado da ManausFood, justificando como a injeção de dependências e a separação em camadas (Controller, Service, Repository) eliminam o acoplamento do código.\nB) Detalhe o funcionamento do mapeamento objeto-relacional (ORM), explicando como o JPA reconcilia o abismo conceitual entre objetos e tabelas SQL e o papel das anotações básicas de mapeamento da entidade Pedido.\nC) Explique as anotações de associação de tabelas (@ManyToOne e @OneToMany), ilustrando através de um exemplo conceitual de relacionamento entre as classes Cliente, Pedido e Restaurante.\nD) Analise os riscos de degradação de performance do ORM sob carga de tráfego extrema (como o problema das consultas N+1) e aponte as técnicas de otimização (como projeções de dados DTO e carregamento Lazy) no Spring Data JPA.",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Diagnóstico e Desacoplamento:\n• SQL diretamente na camada visual causa acoplamento severo e inviabiliza testes.\n• Divisão em camadas isola responsabilidades: Controller (web/HTTP), Service (regras de negócio) e Repository (acesso ao banco).\n• Injeção de Dependência remove instanciação manual, gerando código flexível.\n\nB) Reconciliação ORM:\n• O JPA abstrai os comandos SQL, mapeando atributos Java a colunas de tabelas relacionais.\n• Anotações: @Entity (identifica entidade JPA), @Table (nome no PostgreSQL), @Id (chave primária) e @GeneratedValue (estratégia de autoincremento).\n\nC) Associações de Tabelas:\n• @ManyToOne: Vários pedidos pertencem a um Cliente.\n• @OneToMany: Um Restaurante possui vários Pedidos.\n• Exemplo conceitual mapeando as chaves estrangeiras de forma que a integridade física seja assegurada.\n\nD) Riscos e Otimização de Performance:\n• Problema do N+1: O Spring JPA executa uma consulta para a entidade pai e N consultas adicionais para cada filho associado.\n• Otimizações: Mudar associações para carregamento preguiçoso (FetchType.LAZY); utilizar queries customizadas com 'JOIN FETCH' no Spring Repository; e criar Projections DTO para retornar apenas colunas necessárias, evitando carregar objetos pesados na memória."
};
