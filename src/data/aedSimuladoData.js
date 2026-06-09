// ─── QUESTIONS DATA - MODELO A (SIMULADO INÉDITO) ───────────────────────────────────────────────
export const QUESTIONS_A = [
  {
    id: 1,
    theme: "Passagem de Parâmetros e Ponteiros",
    text: "**Contexto Profissional:** Em um projeto de desenvolvimento de firmware para dispositivos de IoT voltados a smart cities, uma equipe de engenharia é responsável por criar o módulo de monitoramento ambiental de bueiros inteligentes. O firmware deve atualizar variáveis de sensores de nível de água e concentração de gases nocivos a cada segundo.\n\n**O Problema:** Durante a codificação da função de calibração, o desenvolvedor percebeu que precisava modificar os valores de variáveis originais declaradas na função principal `main()`. Ao passar essas variáveis como argumentos tradicionais (por valor), notou que as alterações de calibração ocorriam apenas dentro da função e desapareciam ao retornar ao escopo principal. O arquiteto sênior apontou que o projeto exige alteração direta dos valores originais para economizar ciclos de memória sem usar variáveis globais, o que comprometeria a segurança.\n\n**Questão:** Considerando os conceitos de manipulação de memória em C, qual técnica de passagem de parâmetros deve ser empregada para que a função modifique diretamente os estados dos sensores no escopo da função chamadora?",
    options: [
      "A) Utilizar a passagem de parâmetros por valor, retornando uma estrutura de dados aninhada que contenha todas as atualizações encapsuladas.",
      "B) Declarar as variáveis de estado do veículo com o modificador estático dentro da função de atualização para manter seus valores entre as chamadas.",
      "C) Implementar a passagem de parâmetros por referência através de ponteiros, enviando os endereços de memória das variáveis originais para a função.",
      "D) Criar um vetor dinâmico local na função de atualização e transferir os dados byte a byte para as variáveis principais utilizando funções de cópia.",
      "E) Reestruturar o código para que a coleta de dados seja executada exclusivamente dentro do escopo principal, eliminando a modularização do sistema."
    ],
    answer: "C",
    feedback: "A passagem por referência em C é implementada passando-se ponteiros para as variáveis. A função receptora recebe o endereço de memória e, por meio da desreferenciação (operador *), consegue alterar diretamente o conteúdo da variável no escopo chamador."
  },
  {
    id: 2,
    theme: "Aritmética de Ponteiros",
    text: "**Contexto Profissional:** Uma startup de monitoramento florestal por satélite desenvolveu um sistema embarcado em C para detecção de focos de calor na floresta amazônica. As coordenadas capturadas por sensores termais são organizadas na memória principal do microcontrolador como um grande vetor unidimensional contínuo de leituras numéricas.\n\n**O Problema:** Durante os testes de performance, percebeu-se que o acesso aos elementos por índices tradicionais (`vetor[i]`) consumia muitos ciclos de processamento do chip embarcado. Isso ocorria porque o compilador calculava repetidamente o endereço físico através da fórmula de deslocamento (`base + i * tamanho`) a cada iteração do laço de varredura. A equipe precisa otimizar a varredura para aumentar a autonomia das baterias solares dos sensores portáteis.\n\n**Questão:** Diante das restrições de processamento descritas, qual estratégia em C economiza ciclos de máquina na navegação pelos elementos contíguos do vetor de calor?",
    options: [
      "A) Substituir a estrutura do vetor contíguo por uma lista duplamente encadeada, facilitando a navegação bidirecional pelos pixels da imagem capturada.",
      "B) Utilizar aritmética de ponteiros, incrementando o endereço de memória diretamente para acessar os elementos contíguos sem o cálculo de indexação.",
      "C) Alocar cada pixel em blocos de memória independentes e utilizar um vetor de ponteiros para referenciar as posições de forma descentralizada.",
      "D) Implementar chamadas recursivas para percorrer o vetor, reduzindo a complexidade de tempo de execução do laço de repetição principal.",
      "E) Converter os dados da imagem em variáveis de ponto flutuante, permitindo que a unidade lógica aritmética processe blocos maiores de memória."
    ],
    answer: "B",
    feedback: "A aritmética de ponteiros permite que a CPU acesse posições adjacentes da memória incrementando diretamente o registrador de endereço (por exemplo, `ptr++`), evitando que o compilador realize a multiplicação e soma de deslocamento do índice a cada ciclo de iteração."
  },
  {
    id: 3,
    theme: "Alocação Dinâmica de Memória",
    text: "**Contexto Profissional:** Um centro de sismologia está desenvolvendo um software de monitoramento de abalos de terra para a costa brasileira usando a linguagem C. A quantidade de registros de microtremores varia bruscamente a cada dia, a depender da atividade das placas tectônicas.\n\n**O Problema:** Inicialmente, a equipe declarava vetores globais estáticos gigantescos (ex. tamanho de 10 milhões de elementos) para comportar os picos de abalos sísmicos. Entretanto, nos dias de calmaria, a aplicação mantinha essa imensa área de RAM travada, privando outros softwares do servidor de recursos. O arquiteto de dados recomendou refatorar a infraestrutura para alocar memória sob demanda, adaptando-se precisamente ao volume de registros lidos da central física de sismógrafos.\n\n**Questão:** Para resolver a ineficiência de desperdício de memória e garantir flexibilidade, qual recurso nativo da linguagem C deve ser implementado no controle das amostras diárias?",
    options: [
      "A) Declarar vetores multidimensionais locais dentro da função principal, pois a memória estática local é redimensionada automaticamente durante a execução.",
      "B) Criar rotinas de interrupção de software que forcem o sistema operacional a liberar espaços não utilizados nos vetores de tamanho estático pré-definido.",
      "C) Utilizar funções da biblioteca padrão, como malloc ou calloc, para requisitar memória em tempo de execução com base no tamanho exato da amostra lida.",
      "D) Substituir a linguagem de programação por outra que possua coletor de lixo, uma vez que a linguagem C não permite manipulação direta de áreas de memória.",
      "E) Mapear arquivos diretamente no disco rígido para armazenar os caracteres do DNA em variáveis temporárias do tipo caractere com tipagem forte."
    ],
    answer: "C",
    feedback: "As funções `malloc()` e `calloc()` da biblioteca padrão `<stdlib.h>` servem para solicitar blocos de memória dinamicamente da memória Heap durante a execução do programa, permitindo dimensionar o vetor de forma dinâmica com o tamanho exato da entrada de dados."
  },
  {
    id: 4,
    theme: "Alocação Estática vs. Dinâmica",
    text: "**Contexto Profissional:** Uma empresa desenvolveu um analisador de tráfego de rede interna escrito em C para detectar ataques cibernéticos. O sistema retém em memória RAM informações de sessões IP.\n\n**O Problema:** A versão estática do analisador suportava até 10.000 IPs. Contudo, em cenários de tráfego anormal de intrusão, as sessões excediam o limite, resultando em perda de logs. Em contrapartida, nos finais de semana, quando o tráfego caía para menos de 100 sessões, a memória estática continuava alocada e indisponível para os módulos de decodificação criptográfica do núcleo. A equipe de engenharia decidiu trocar a modelagem estática por uma alocação baseada em dinâmica.\n\n**Questão:** Ao comparar os paradigmas de reserva de memória na arquitetura de computadores, qual justificativa conceitual valida a escolha da alocação dinâmica como solução para a instabilidade do analisador?",
    options: [
      "A) Porque a alocação estática trava o espaço no momento da compilação, enquanto a dinâmica permite requisitar e liberar porções de memória sob demanda durante o ciclo de execução.",
      "B) Porque a alocação dinâmica dispensa o uso de ponteiros, reduzindo a complexidade ciclomática do algoritmo e evitando erros de segmentação no sistema operacional do roteador.",
      "C) Porque a alocação estática é processada na memória Heap, que possui tamanho muito reduzido, enquanto a dinâmica ocorre na memória Stack, oferecendo capacidade ilimitada de conexões.",
      "D) Porque a alocação dinâmica converte automaticamente variáveis do tipo caractere para tipos numéricos complexos, otimizando o processamento dos endereços IP das conexões ativas.",
      "E) Porque a alocação dinâmica garante um tempo de acesso aos dados consideravelmente menor devido ao posicionamento sequencial forçado de todos os nós de conexão em memória."
    ],
    answer: "A",
    feedback: "A alocação estática (no segmento de dados ou Stack) é definida e dimensionada em tempo de compilação, não mudando de tamanho. A alocação dinâmica reside na memória Heap e permite requisitar blocos com `malloc()` e devolvê-los ao SO com `free()` dinamicamente, adaptando-se à carga operacional."
  },
  {
    id: 5,
    theme: "Structs e Integração de Dados",
    text: "**Contexto Profissional:** Em um software ERP de controle logístico escrito em C, o estoque de mercadorias é gerenciado por uma estrutura agrupada `struct Produto` contendo código, descrição, quantidade e custo de aquisição.\n\n**O Problema:** Como a aplicação é modular, existem rotinas separadas para atualizar o estoque de itens após vendas. Ao transferir os registros de estoques por valor na chamada da função de atualização, o sistema copiava os dados inteiros na pilha de chamadas (Stack), consumindo muita memória. O líder técnico exigiu que a passagem fosse otimizada passando-se apenas um ponteiro para a estrutura, permitindo que a função altere o estoque na struct original sem realizar cópias.\n\n**Questão:** Diante das normas de sintaxe e manipulação de estruturas agrupadas por referência em C, qual comando e operador devem ser utilizados pela função para editar diretamente um campo numérico da struct?",
    options: [
      "A) Passar a struct por valor na chamada da função e utilizar o operador ponto (.) para modificar o nível de urgência localmente, retornando a struct completa.",
      "B) Passar a variável global da struct diretamente e utilizar laços de repetição internos para atualizar os valores de todos os pacientes do registro simultaneamente.",
      "C) Enviar o endereço de memória da struct para a função através de um ponteiro e utilizar o operador seta (->) para acessar e alterar diretamente os campos desejados.",
      "D) Criar uma união (union) temporária dentro da função, mapear os atributos da estrutura original e utilizar o operador lógico bitwise para alterar a flag de urgência.",
      "E) Transferir a struct para um arquivo binário temporário, realizar a leitura na função de avaliação, alterar a variável no disco e fechar o arquivo imediatamente."
    ],
    answer: "C",
    feedback: "Quando passamos uma struct por meio de ponteiro em C, o acesso aos seus membros deve ser feito pelo operador seta (`->`) (ex. `ponteiro->quantidade = valor`), que é um atalho sintático equivalente a desreferenciar o ponteiro e acessar o membro via ponto: `(*ponteiro).quantidade`."
  },
  {
    id: 6,
    theme: "Manipulação de Arquivos e Persistência",
    text: "**Contexto Profissional:** Uma aplicação de automação bancária desenvolvida em C registra o log diário de saques eletrônicos em um arquivo de texto para fins de auditoria interna.\n\n**O Problema:** A função `GravarLogs` precisa anexar as transações ao fim de um arquivo chamado `auditoria.txt`. O líder do projeto determinou que a rotina deve ser blindada contra falhas lógicas comuns: o programa deve certificar que o arquivo foi realmente aberto pelo sistema operacional antes de tentar escrever dados, evitando falhas catastróficas de ponteiro nulo (Null Pointer Dereference) caso o disco esteja protegido ou sem espaço.\n\n**Questão:** Para assegurar que o salvamento de dados em arquivo ocorra de maneira correta e livre de exceções de hardware em C, qual a ordem e checagem de fluxo de comandos recomendada?",
    options: [
      "A) Abrir o arquivo no modo \"r\" (leitura), iterar sobre as estruturas apontadas, gravar os dados usando fprintf, fechar o arquivo usando fclose e liberar a memória utilizando a função free.",
      "B) Abrir o arquivo no modo \"w\" ou \"a\", verificar imediatamente se o ponteiro de arquivo retornado é nulo (NULL), iterar sobre os dados utilizando o ponteiro da estrutura gravando com fprintf e, por fim, executar o fclose.",
      "C) Utilizar a função malloc para alocar espaço em disco, formatar os dados com a função sprintf, realizar a cópia usando aritmética de ponteiros básicos e finalizar a execução fechando o processo principal.",
      "D) Declarar o arquivo como uma estrutura estática global, realizar o loop principal copiando o bloco de memória completo usando fwrite sem checagem de erros, garantindo maior fluidez no fechamento do expediente.",
      "E) Ler todos os dados do disco rígido primeiro usando fscanf, comparar com os ponteiros armazenados na memória RAM, atualizar os bytes modificados diretamente com funções de I/O de baixo nível e invocar fclose."
    ],
    answer: "B",
    feedback: "O fluxo seguro exige: 1) Abrir o arquivo com `fopen` no modo de escrita/anexação ('w' ou 'a'); 2) Verificar se o retorno é `NULL`; 3) Gravar dados apenas se o ponteiro for válido com `fprintf` ou `fputs`; 4) Fechar o descritor de arquivo com `fclose` para garantir a gravação dos buffers físicos."
  },
  {
    id: 7,
    theme: "Manipulação de Listas Encadeadas",
    text: "**Contexto Profissional:** No sistema de gerenciamento de tarefas de uma linha de produção de automóveis, a sequência de processos de montagem é mantida por uma lista encadeada simples alocada dinamicamente na memória RAM.\n\n**O Problema:** Em caso de defeito em um maquinário, a central precisa remover o nó do processo correspondente do meio da lista dinâmica de execução de forma instantânea. No entanto, é fundamental restabelecer o encadeamento das tarefas: o processo anterior ao defeituoso deve passar a apontar para o processo posterior ao defeituoso, permitindo que a lista continue unida e contínua sem que se perca a referência do restante da linha.\n\n**Questão:** Diante das regras lógicas de ponteiros para a exclusão física de um nó intermediário em uma Lista Encadeada Simples, qual é o algoritmo correto de alteração de apontadores?",
    options: [
      "A) Percorrer a lista até o nó desejado, aplicar a função free diretamente nele e atualizar o ponteiro NULL para indicar o novo fim da via de sincronização.",
      "B) Criar uma segunda lista encadeada alocando memória nova, copiar todos os nós exceto o do cruzamento acidentado e excluir toda a estrutura da lista primária anterior.",
      "C) Identificar o nó alvo, isolar suas variáveis usando máscaras de bits e inverter a direção do ponteiro de todos os nós anteriores para formar um fluxo alternativo isolado.",
      "D) Percorrer a lista com dois ponteiros auxiliares (atual e anterior), localizar o nó alvo, ajustar o ponteiro do nó 'anterior' para apontar para o nó sucessor do alvo e, em seguida, liberar a memória do nó alvo.",
      "E) Substituir os valores de tempo do nó alvo por zero absoluto, mantendo a estrutura original intacta na memória para que o compilador otimize e ignore automaticamente essa posição durante as futuras execuções."
    ],
    answer: "D",
    feedback: "Para excluir um nó intermediário (atual) de uma lista encadeada sem quebrar a cadeia, deve-se ajustar o ponteiro do nó anterior para apontar para o sucessor do atual (`anterior->proximo = atual->proximo`). Só então a memória ocupada pelo atual pode ser liberada com `free(atual)`."
  },
  {
    id: 8,
    theme: "Vazamento de Memória e Ponteiros Pendentes",
    text: "**Contexto Profissional:** Um engenheiro de software foi encarregado de revisar o código-fonte de um middleware de alto desempenho desenvolvido em C. A ferramenta apresenta falhas de travamento após longas horas de execução contínua.\n\n**O Problema:** O relatório do analisador estático indicou a concorrência de duas falhas críticas na gestão de ponteiros: 1) Presença de vazamentos de memória (Memory Leaks), que saturam o consumo de RAM até travar o servidor; 2) Riscos de ponteiros pendentes (Dangling Pointers) que geram corrupção silenciosa de dados e exceções de falha de segmentação ao tentar acessar variáveis desalocadas.\n\n**Questão:** No escopo do desenvolvimento seguro e correto em linguagem C, qual definição descreve as origens técnicas dessas duas falhas?",
    options: [
      "A) O vazamento de memória ocorre porque a equipe perde as referências aos blocos alocados sem invocar a função free, e os ponteiros pendentes surgem quando áreas são liberadas, mas os ponteiros que apontavam para elas continuam sendo usados pelos módulos.",
      "B) O vazamento de memória resulta do uso excessivo de vetores estáticos em módulos recursivos, enquanto os ponteiros pendentes são causados pela não inicialização de variáveis primitivas numéricas no começo dos blocos de iteração.",
      "C) O vazamento de memória manifesta-se quando ponteiros recebem múltiplos endereços sucessivamente através da função calloc, enquanto os ponteiros pendentes acontecem sempre que arquivos binários são abertos em modo restrito de leitura.",
      "D) O vazamento de memória é gerado pela conversão forçada de tipos de variáveis (casting) entre os módulos do sistema, e os ponteiros pendentes ocorrem devido ao compartilhamento de variáveis globais declaradas nos cabeçalhos (.h).",
      "E) O vazamento de memória acontece exclusivamente quando o processador excede sua capacidade de desreferenciar estruturas de dados complexas, e os ponteiros pendentes surgem pela falta de compilação com as bandeiras de otimização de segurança ativadas."
    ],
    answer: "A",
    feedback: "Vazamento de memória ocorre quando blocos de memória dinâmica alocados com `malloc`/`calloc` perdem todos os seus ponteiros de referência sem terem sido liberados com `free()`, retendo o espaço inutilmente. Ponteiros pendentes ocorrem quando a memória de um ponteiro é liberada com `free()`, mas o ponteiro continua guardando aquele endereço e sendo desreferenciado no código."
  }
];

// ─── QUESTIONS DATA - MODELO B (SIMULADO INÉDITO VARIANTE) ───────────────────────────────────────────────
export const QUESTIONS_B = [
  {
    id: 1,
    theme: "Passagem de Parâmetros e Ponteiros",
    text: "**Contexto Profissional:** Uma equipe de engenharia está implementando o software de um desfibrilador automático externo (DEA) em linguagem C. O equipamento necessita calibrar o nível de carga elétrica de disparo com base na impedância do tórax do paciente medida por eletrodos.\n\n**O Problema:** A função de calibração precisa alterar os valores de variáveis originais contendo a tensão do capacitor declaradas no escopo do invocador. A passagem padrão de valores por cópia falhava, pois a tensão calibrada não era mantida após a saída do bloco da função. A equipe exige a aplicação de uma metodologia eficiente de compartilhamento de memória direta sem o uso de variáveis globais estáticas para evitar o risco de alteração por concorrência.\n\n**Questão:** Qual o procedimento técnico e sintático para garantir que a função modifique diretamente a variável de tensão do escopo principal?",
    options: [
      "A) Utilizar a passagem de parâmetros por valor, retornando uma estrutura de dados aninhada que contenha todas as atualizações encapsuladas.",
      "B) Declarar as variáveis de estado do veículo com o modificador estático dentro da função de atualização para manter seus valores entre as chamadas.",
      "C) Implementar a passagem de parâmetros por referência através de ponteiros, enviando os endereços de memória das variáveis originais para a função.",
      "D) Criar um vetor dinâmico local na função de atualização e transferir os dados byte a byte para as variáveis principais utilizando funções de cópia.",
      "E) Reestruturar o código para que a coleta de dados seja executada exclusivamente dentro do escopo principal, eliminando a modularização do sistema."
    ],
    answer: "C",
    feedback: "A passagem por referência em C é implementada simuladamente enviando-se os endereços de variáveis físicas (via operador `&`) para variáveis do tipo ponteiro na assinatura da função. Desreferenciar o ponteiro na função altera o valor no endereço original."
  },
  {
    id: 2,
    theme: "Aritmética de Ponteiros",
    text: "**Contexto Profissional:** Um engenheiro está desenvolvendo o sistema embarcado de um drone de monitoramento térmico florestal. O microcontrolador processa a matriz de calor de sensores infravermelhos na forma de um grande vetor contíguo de floats.\n\n**O Problema:** Durante a execução de filtros matemáticos em loop, o processador de baixo consumo apresentava lentidão de clock. A análise revelou que o uso de índices em colchetes (`vetor[i]`) fazia com que o compilador gerasse multiplicações redundantes no barramento de dados a cada pixel lido. O engenheiro precisa reestruturar o loop de varredura para ler os elementos subsequentes de forma mais eficiente na CPU.\n\n**Questão:** A partir dos recursos de manipulação de memória em linguagem C, qual estratégia deve ser usada no laço para otimizar os ciclos aritméticos de busca do vetor?",
    options: [
      "A) Substituir a estrutura do vetor contíguo por uma lista duplamente encadeada, facilitando a navegação bidirecional pelos pixels da imagem capturada.",
      "B) Utilizar aritmética de ponteiros, incrementando o endereço de memória diretamente para acessar os elementos contíguos sem o cálculo de indexação.",
      "C) Alocar cada pixel em blocos de memória independentes e utilizar um vetor de ponteiros para referenciar as posições de forma descentralizada.",
      "D) Implementar chamadas recursivas para percorrer o vetor, reduzindo a complexidade de tempo de execução do laço de repetição principal.",
      "E) Converter os dados da imagem em variáveis de ponto flutuante, permitindo que a unidade lógica aritmética processe blocos maiores de memória."
    ],
    answer: "B",
    feedback: "Utilizar aritmética de ponteiros (por exemplo, referenciando `*(ptr++)`) otimiza a iteração em C. Em vez de realizar contas de endereçamento (`base + i * sizeof(float)`) a cada loop, o endereço na CPU é apenas incrementado linearmente, economizando ciclos de máquina."
  },
  {
    id: 3,
    theme: "Alocação Dinâmica de Memória",
    text: "**Contexto Profissional:** Em um sistema embarcado de roteamento de pacotes de dados industriais em C, o tamanho das mensagens de rede trafegadas oscila entre alguns bytes a megabytes a depender do dispositivo industrial de envio.\n\n**O Problema:** O firmware legado pré-alocava estaticamente buffers de tamanho fixo gigantescos para comportar as maiores mensagens possíveis. No entanto, o microcontrolador sofria travamentos por falta de RAM devido a esse espaço subutilizado retido permanentemente pelas filas vazias. O líder do projeto determinou que a reserva de espaço na RAM para cada pacote de dados recebido deve ser solicitada de forma flexível e precisa, dimensionada sob demanda de acordo com os bytes lidos do cabeçalho físico da transmissão.\n\n**Questão:** Qual recurso da linguagem C atende à demanda de controle adaptativo e redimensionamento da memória para os buffers de recepção?",
    options: [
      "A) Declarar vetores multidimensionais locais dentro da função principal, pois a memória estática local é redimensionada automaticamente durante a execução.",
      "B) Criar rotinas de interrupção de software que forcem o sistema operacional a liberar espaços não utilizados nos vetores de tamanho estático pré-definido.",
      "C) Utilizar funções da biblioteca padrão, como malloc ou calloc, para requisitar memória em tempo de execução com base no tamanho exato da amostra lida.",
      "D) Substituir a linguagem de programação por outra que possua coletor de lixo, uma vez que a linguagem C não permite manipulação direta de áreas de memória.",
      "E) Mapear arquivos diretamente no disco rígido para armazenar os caracteres do DNA em variáveis temporárias do tipo caractere com tipagem forte."
    ],
    answer: "C",
    feedback: "O uso de alocação dinâmica com `malloc()` ou `calloc()` permite ao firmware do roteador requisitar do Heap apenas o espaço exato exigido por cada mensagem de rede em tempo de execução, retornando esse espaço para o sistema via `free()` após o processamento."
  },
  {
    id: 4,
    theme: "Alocação Estática vs. Dinâmica",
    text: "**Contexto Profissional:** Uma equipe está desenvolvendo uma central de telemetria inteligente de veículos elétricos que registra eventos e erros críticos de bateria.\n\n**O Problema:** A versão antiga usava alocação estática reservando espaço contíguo para 5.000 logs. Contudo, em situações de aquecimento extremo, a taxa de logs de erro aumentava rapidamente, ultrapassando a marca limite e travando o registro da telemetria por falta de espaço. Em compensação, em uso padrão na estrada, o sistema gerava menos de 10 logs, mas os recursos de RAM continuavam bloqueados e inoperantes para outras tarefas. O analista propôs a migração dos vetores estáticos para alocação dinâmica.\n\n**Questão:** Qual vantagem técnico-operacional explica o sucesso da alocação dinâmica na resolução dos limites físicos do hardware da central?",
    options: [
      "A) Porque a alocação estática trava o espaço no momento da compilação, enquanto a dinâmica permite requisitar e liberar porções de memória sob demanda durante o ciclo de execução.",
      "B) Because a alocação dinâmica dispensa o uso de ponteiros, reduzindo a complexidade ciclomática do algoritmo e evitando erros de segmentação no sistema operacional do roteador.",
      "C) Porque a alocação estática é processada na memória Heap, que possui tamanho muito reduzido, enquanto a dinâmica ocorre na memória Stack, oferecendo capacidade ilimitada de conexões.",
      "D) Porque a alocação dinâmica converte automaticamente variáveis do tipo caractere para tipos numéricos complexos, otimizando o processamento dos endereços IP das conexões ativas.",
      "E) Porque a alocação dinâmica garante um tempo de acesso aos dados consideravelmente menor devido ao posicionamento sequencial forçado de todos os nós de conexão em memória."
    ],
    answer: "A",
    feedback: "A alocação estática é dimensionada rigidamente em tempo de compilação, sem flexibilidade. A alocação dinâmica no Heap cresce e reduz conforme as necessidades lógicas do software em execução, evitando tanto o estouro de limite quanto o desperdício de RAM."
  },
  {
    id: 5,
    theme: "Structs e Integração de Dados",
    text: "**Contexto Profissional:** Em um sistema médico corporativo desenvolvido em C, os prontuários dos pacientes são representados pela estrutura lógica `struct Paciente` (contendo dados como código, idade, gravidade e parâmetros vitais).\n\n**O Problema:** O sistema possui diversas rotinas de manipulação em módulos separados. Ao passar a struct inteira por cópia na chamada de uma função de reavaliação de gravidade, ocorria alto consumo de memória na pilha (Stack), gerando riscos de estouro de pilha. O líder exigiu que a integração de dados entre módulos passe a ser feita por meio de ponteiros, permitindo alterar os campos na struct original de forma direta.\n\n**Questão:** Qual sintaxe deve ser declarada dentro da função de calibração de gravidade para alterar os membros da struct apontada?",
    options: [
      "A) Passar a struct por valor na chamada da função e utilizar o operador ponto (.) para modificar o nível de urgência localmente, retornando a struct completa.",
      "B) Passar a variável global da struct diretamente e utilizar laços de repetição internos para atualizar os valores de todos os pacientes do registro simultaneamente.",
      "C) Enviar o endereço de memória da struct para a função através de um ponteiro e utilizar o operador seta (->) para acessar e alterar diretamente os campos desejados.",
      "D) Criar uma união (union) temporária dentro da função, mapear os atributos da estrutura original e utilizar o operador lógico bitwise para alterar a flag de urgência.",
      "E) Transferir a struct para um arquivo binário temporário, realizar a leitura na função de avaliação, alterar a variável no disco e fechar o arquivo imediatamente."
    ],
    answer: "C",
    feedback: "Para manipular os membros de uma struct por referência na linguagem C (recebendo um ponteiro para a struct), utiliza-se o operador seta `->` (ex. `ponteiro->gravidade = novoValor`), o qual realiza a desreferenciação automática da struct."
  },
  {
    id: 6,
    theme: "Manipulação de Arquivos e Persistência",
    text: "**Contexto Profissional:** Um sistema embarcado em um coletor de tráfego de dados de pedágios gerencia as passagens de veículos e salva esses registros em um arquivo de texto para envio posterior ao servidor fiscal central.\n\n**O Problema:** A função `GravarTransacao` precisa salvar os dados formatados em formato texto. Para garantir a confiabilidade do sistema contra erros catastróficos de gravação física (como falta de permissão ou partição de disco cheia), o arquiteto exige que o programa cheque a validade da abertura do arquivo antes de realizar qualquer gravação ou laço lógico de escrita, minimizando riscos de falhas de proteção de memória.\n\n**Questão:** Qual sequência metodológica em C implementa a gravação segura de dados em disco?",
    options: [
      "A) Abrir o arquivo no modo \"r\" (leitura), iterar sobre as estruturas apontadas, gravar os dados usando fprintf, fechar o arquivo usando fclose e liberar a memória utilizando a função free.",
      "B) Abrir o arquivo no modo \"w\" ou \"a\", verificar imediatamente se o ponteiro de arquivo retornado é nulo (NULL), iterar sobre os dados utilizando o ponteiro da estrutura gravando com fprintf e, por fim, executar o fclose.",
      "C) Utilizar a função malloc para alocar espaço em disco, formatar os dados com a função sprintf, realizar a cópia usando aritmética de ponteiros básicos e finalizar a execução fechando o processo principal.",
      "D) Declarar o arquivo como uma estrutura estática global, realizar o loop principal copiando o bloco de memória completo usando fwrite sem checagem de erros, garantindo maior fluidez no fechamento do expediente.",
      "E) Ler todos os dados do disco rígido primeiro usando fscanf, comparar com os ponteiros armazenados na memória RAM, atualizar os bytes modificados diretamente com funções de I/O de baixo nível e invocar fclose."
    ],
    answer: "B",
    feedback: "O fluxo de escrita seguro exige: 1) Abrir o arquivo no modo correto ('w' ou 'a'); 2) Validar se o ponteiro de arquivo retornado é diferente de `NULL`; 3) Escrever os dados via `fprintf`; 4) Fechar o descritor utilizando `fclose()` para descarregar o buffer de gravação do disco."
  },
  {
    id: 7,
    theme: "Manipulação de Listas Encadeadas",
    text: "**Contexto Profissional:** Em um simulador de tráfego aéreo programado em C, a fila de aeronaves aguardando pouso em um aeroporto é modelada por uma Lista Encadeada Simples alocada dinamicamente na memória Heap.\n\n**O Problema:** Caso uma aeronave seja desviada para outro aeroporto de emergência, o sistema precisa retirar seu nó representativo do meio da lista dinâmica. Para não interromper o controle de voo dos demais aviões, os ponteiros devem ser reorganizados: o nó anterior à aeronave removida deve apontar para o nó posterior a ela, religando as pontas lógicas do encadeamento antes de liberar fisicamente a memória.\n\n**Questão:** A partir dos preceitos de manipulação de estruturas dinâmicas unidirecionais, qual o algoritmo para remover e desalocar o nó intermediário do avião de forma segura?",
    options: [
      "A) Percorrer a lista até o nó desejado, aplicar a função free diretamente nele e atualizar o ponteiro NULL para indicar o novo fim da via de sincronização.",
      "B) Criar uma segunda lista encadeada alocando memória nova, copiar todos os nós exceto o do cruzamento acidentado e excluir toda a estrutura da lista primária anterior.",
      "C) Identificar o nó alvo, isolar suas variáveis usando máscaras de bits e inverter a direção do ponteiro de todos os nós anteriores para formar um fluxo alternativo isolado.",
      "D) Percorrer a lista com dois ponteiros auxiliares (atual e anterior), localizar o nó alvo, ajustar o ponteiro do nó 'anterior' para apontar para o nó sucessor do alvo e, em seguida, liberar a memória do nó alvo.",
      "E) Substituir os valores de tempo do nó alvo por zero absoluto, mantendo a estrutura original intacta na memória para que o compilador otimize e ignore automaticamente essa posição durante as futuras execuções."
    ],
    answer: "D",
    feedback: "A exclusão de um nó intermediário exige que o elemento anterior pule o elemento que será removido, apontando para o seu sucessor (`anterior->proximo = atual->proximo`). Com a cadeia restabelecida, a memória do nó isolado (atual) é liberada com `free(atual)`."
  },
  {
    id: 8,
    theme: "Vazamento de Memória e Ponteiros Pendentes",
    text: "**Contexto Profissional:** Uma equipe de desenvolvedores está depurando um banco de dados relacional embarcado escrito na linguagem C. Após rodar em produção por 48 horas, a aplicação sofre colapso por esgotamento de RAM.\n\n**O Problema:** A equipe diagnosticou a ocorrência de dois comportamentos inadequados: 1) Vazamento de memória (Memory Leak), que impede a liberação de blocos inativos; 2) Risco de ponteiros pendentes (Dangling Pointers) que geram corrupção silenciosa nos blocos ativos de memória. A equipe precisa corrigir as funções de fechamento de sessão.\n\n**Questão:** Qual par de definições descreve tecnicamente o vazamento de memória e os ponteiros pendentes no ecossistema C?",
    options: [
      "A) O vazamento de memória ocorre porque a equipe perde as referências aos blocos alocados sem invocar a função free, e os ponteiros pendentes surgem quando áreas são liberadas, mas os ponteiros que apontavam para elas continuam sendo usados pelos módulos.",
      "B) O vazamento de memória resulta do uso excessivo de vetores estáticos em módulos recursivos, enquanto os ponteiros pendentes são causados pela não inicialização de variáveis primitivas numéricas no começo dos blocos de iteração.",
      "C) O vazamento de memória manifesta-se quando ponteiros recebem múltiplos endereços sucessivamente através da função calloc, enquanto os ponteiros pendentes acontecem sempre que arquivos binários são abertos em modo restrito de leitura.",
      "D) O vazamento de memória é gerado pela conversão forçada de tipos de variáveis (casting) entre os módulos do sistema, e os ponteiros pendentes ocorrem devido ao compartilhamento de variáveis globais declaradas nos cabeçalhos (.h).",
      "E) O vazamento de memória acontece exclusivamente quando o processador excede sua capacidade de desreferenciar estruturas de dados complexas, e os ponteiros pendentes surgem pela falta de compilação com as bandeiras de otimização de segurança ativadas."
    ],
    answer: "A",
    feedback: "Memory Leak é a perda de referências a blocos dinâmicos do Heap sem a chamada de `free()`, retendo memória inutilizável. Dangling Pointer ocorre quando a memória apontada é liberada com `free()`, mas a variável ponteiro ainda guarda aquele endereço inválido e tenta lê-lo ou escrevê-lo posteriormente."
  }
];

// ─── DISCURSIVE DATA ─────────────────────────────────────────────────────────
export const STUDY_CASE_A = {
  title: "Arquitetura e Refatoração Dinâmica da Central Nexus EcoTech",
  context: "A equipe de engenharia de computação da \"Nexus EcoTech\" está desenvolvendo o sistema de controle e recebimento de pacotes de dados de telemetria enviados por drones autônomos aplicados à agricultura de precisão. O protótipo inicial foi implementado por um estagiário utilizando vetores estáticos de tamanho fixo na linguagem C. Durante as simulações práticas de campo, o sistema sofreu falhas catastróficas: 1) Em momentos de alta densidade de transmissão, o volume de pacotes de telemetria excedeu o limite máximo do vetor estático de dados, provocando um estouro de buffer (Buffer Overflow) e o travamento do receptor. 2) Diante de alertas de anomalias nos motores, os engenheiros precisavam depurar os logs em ordem cronológica reversa (do erro mais recente para o mais antigo), porém a estrutura linear estática dificultava a recuperação eficiente dos dados de trás para frente. 3) À medida que os drones em manutenção eram consertados e precisavam ser removidos do controle, a exclusão de seus registros no meio do vetor gerava alta degradação de processamento, pois exigia a realocação manual de todos os elementos subsequentes na memória RAM.",
  statement: "Posicionando-se como Engenheiro de Computação responsável por redefinir a arquitetura lógica do sistema, redija um parecer técnico dissertativo-argumentativo (extensão mínima de 30 linhas) propondo a substituição dos vetores estáticos por estruturas dinâmicas de dados na linguagem C. Seu texto deve obrigatoriamente contemplar os seguintes eixos:\n\nA) Crítica aos Vetores Estáticos e Processamento FIFO: Critique o uso de alocação estática no cenário de recepção contínua de pacotes de telemetria de drones. Proponha e fundamente a estrutura de dados dinâmica linear ideal para processar esses pacotes na ordem exata de chegada (do primeiro que chega ao primeiro que é processado).\nB) Análise de Logs na Ordem LIFO: Para resolver a extração de logs de erro em ordem cronológica reversa (do mais recente para o mais antigo), indique e justifique a estrutura de dados dinâmica clássica apropriada, explicando conceitualmente seu princípio de funcionamento e as operações de manipulação associadas.\nC) Gerenciamento de Manutenção com Remoção Aleatória: Indique qual estrutura de dados dinâmica permite listar os drones em manutenção e remover qualquer um deles do sistema de forma imediata e eficiente à medida que são reparados (sem realocação mecânica de blocos adjacentes na RAM). Justifique sua resposta detalhando a mecânica de alteração de ponteiros.\nD) Análise Comparativa e Resiliência de Software: Discorra criticamente sobre como o uso integrado dessas três estruturas dinâmicas (Heap) torna o software do painel de monitoramento da Nexus EcoTech mais seguro, resiliente e otimizado em relação a perdas de dados por Buffer Overflow quando comparado ao modelo original estático (Stack/Segmento de Dados).",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Vetores Estáticos e Processamento FIFO:\n• Criticar os vetores estáticos devido ao tamanho fixo imutável em tempo de compilação, o que causa desperdício de RAM ou estouro de buffer (Buffer Overflow) sob tráfego excessivo.\n• Propor a estrutura de Fila (Queue), que opera sob o princípio FIFO (First-In, First-Out), ideal para enfileirar e processar os pacotes de telemetria na ordem de chegada, implementada dinamicamente via ponteiros.\n\nB) Logs na Ordem LIFO:\n• Propor a estrutura de Pilha (Stack), que opera sob o princípio LIFO (Last-In, First-Out), ideal para recuperar logs em ordem cronológica reversa (o último erro inserido é o primeiro a ser desempilhado e analisado).\n• Explicar as operações de manipulação básicas: Push (empilhar novo nó de log no topo da pilha) e Pop (remover e recuperar o elemento do topo da pilha), alterando os ponteiros dinâmicos do topo.\n\nC) Gerenciamento com Remoção Aleatória:\n• Propor a Lista Encadeada (Simples ou Duplamente Encadeada).\n• Justificar que, diferentemente dos vetores em que a exclusão exige mover fisicamente todos os elementos seguintes na memória (complexidade O(N)), a lista encadeada permite remoções em tempo constante O(1) após localização, alterando apenas os apontadores (ex. `anterior->proximo = atual->proximo`) e liberando a memória do nó com `free(atual)`.\n\nD) Resiliência e Comparação:\n• Argumentar que a integração de Filas, Pilhas e Listas Encadeadas baseadas em alocação dinâmica utiliza a memória Heap de forma otimizada e flexível, crescendo conforme a demanda e evitando perdas catastróficas por Buffer Overflow.\n• Salientar que a modularização por ponteiros e o correto uso de desalocações (`free()`) garantem maior robustez de segurança contra travamentos."
};

export const STUDY_CASE_B = {
  title: "Arquitetura e Refatoração Dinâmica da Central AquaSafe",
  context: "A equipe de engenharia de computação da \"AquaSafe\" está desenvolvendo o sistema de controle e telemetria de boias autônomas de monitoramento de qualidade da água no leito do rio Amazonas. O protótipo inicial foi implementado por um estagiário utilizando vetores estáticos de tamanho fixo na linguagem C. Durante as simulações práticas de campo, o sistema sofreu falhas catastróficas: 1) Em momentos de alta densidade de transmissão, o volume de pacotes de telemetria excedeu o limite máximo do vetor estático de dados, provocando um estouro de buffer (Buffer Overflow) e o travamento do receptor. 2) Diante de alertas de anomalias nos sensores, os engenheiros precisavam depurar os logs em ordem cronológica reversa (do erro mais recente para o mais antigo), porém a estrutura linear estática dificultava a recuperação eficiente dos dados de trás para frente. 3) À medida que as boias em manutenção eram consertadas e precisavam ser removidas do controle, a exclusão de seus registros no meio do vetor gerava alta degradação de processamento, pois exigia a realocação manual de todos os elementos subsequentes na memória RAM.",
  statement: "Posicionando-se como Engenheiro de Computação responsável por redefinir a arquitetura lógica do sistema, redija um parecer técnico dissertativo-argumentativo (extensão mínima de 30 linhas) propondo a substituição dos vetores estáticos por estruturas dinâmicas de dados na linguagem C. Seu texto deve obrigatoriamente contemplar os seguintes eixos:\n\nA) Crítica aos Vetores Estáticos e Processamento FIFO: Critique o uso de alocação estática no cenário de recepção contínua de pacotes de telemetria de boias. Proponha e fundamente a estrutura de dados dinâmica linear ideal para processar esses pacotes na ordem exata de chegada (do primeiro que chega ao primeiro que é processado).\nB) Análise de Logs na Ordem LIFO: Para resolver a extração de logs de erro em ordem cronológica reversa (do mais recente para o mais antigo), indique e justifique a estrutura de dados dinâmica clássica apropriada, explicando conceitualmente seu princípio de funcionamento e as operações de manipulação associadas.\nC) Gerenciamento de Manutenção com Remoção Aleatória: Indique qual estrutura de dados dinâmica permite listar as boias em manutenção e remover qualquer uma delas do sistema de forma imediata e eficiente à medida que são reparadas (sem realocação mecânica de blocos adjacentes na RAM). Justifique sua resposta detalhando a mecânica de alteração de ponteiros.\nD) Análise Comparativa e Resiliência de Software: Discorra criticamente sobre como o uso integrado dessas três estruturas dinâmicas (Heap) torna o software do painel de monitoramento da AquaSafe mais seguro, resiliente e otimizado em relação a perdas de dados por Buffer Overflow quando comparado ao modelo original estático (Stack/Segmento de Dados).",
  criteria: "DIRETRIZES DE RESPOSTA ESPERADA:\n\nA) Vetores Estáticos e Processamento FIFO:\n• Criticar os vetores estáticos devido ao tamanho fixo imutável em tempo de compilação, o que causa desperdício de RAM ou estouro de buffer (Buffer Overflow) sob tráfego excessivo.\n• Propor a estrutura de Fila (Queue), que opera sob o princípio FIFO (First-In, First-Out), ideal para enfileirar e processar os pacotes de telemetria na ordem de chegada, implementada dinamicamente via ponteiros.\n\nB) Logs na Ordem LIFO:\n• Propor a estrutura de Pilha (Stack), que opera sob o princípio LIFO (Last-In, First-Out), ideal para recuperar logs em ordem cronológica reversa (o último erro inserido é o primeiro a ser desempilhado e analisado).\n• Explicar as operações de manipulação básicas: Push (empilhar novo nó de log no topo da pilha) e Pop (remover e recuperar o elemento do topo da pilha), alterando os ponteiros dinâmicos do topo.\n\nC) Gerenciamento com Remoção Aleatória:\n• Propor a Lista Encadeada (Simples ou Duplamente Encadeada).\n• Justificar que, diferentemente dos vetores em que a exclusão exige mover fisicamente todos os elementos seguintes na memória (complexidade O(N)), a lista encadeada permite remoções em tempo constante O(1) após localização, alterando apenas os apontadores (ex. `anterior->proximo = atual->proximo`) e liberando a memória do nó com `free(atual)`.\n\nD) Resiliência e Comparação:\n• Argumentar que a integração de Filas, Pilhas e Listas Encadeadas baseadas em alocação dinâmica utiliza a memória Heap de forma otimizada e flexível, crescendo conforme a demanda e evitando perdas catastróficas por Buffer Overflow.\n• Salientar que a modularização por ponteiros e o correto uso de desalocações (`free()`) garantem maior robustez de segurança contra travamentos."
};
