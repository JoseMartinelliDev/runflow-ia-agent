# Runflow AI Agent

Este projeto demonstra a implementação de um *agentic loop* utilizando o Vercel AI SDK e o modelo Llama 3.3, conectando um agente de IA a um backend mockado através de chamadas de ferramentas (*tool calling*).

Decidi utilizar o ecossistema do Vercel AI SDK por ser um dos frameworks mais adotados pelo mercado atualmente para orquestração de LLMs. Para a API, optei pelo Express.js pela familiaridade e controle na estruturação das rotas. O modelo escolhido para inferência foi o Llama 3.3 (via Groq), visando alta velocidade e precisão no uso de ferramentas.

## Funcionalidades

- **Chatbot Contextual:** Mantém o histórico da sessão em memória, compreendendo o contexto ao longo da conversa.
- **Roteamento Inteligente de Ferramentas:** O agente decide autonomamente qual rota da API chamar com base na intenção do usuário.
- **Catálogo de Produtos:** Consulta de lista resumida e detalhes específicos de produtos (preço, estoque, descrição).
- **Checkout Conversacional:** Criação de pedidos com validação de estoque e exigência de quantidade antes da finalização.
- **Consulta de Status:** Rastreamento de pedidos gerados pelo ID.
- **Recuperação de Erros:** Gera mensagens descritivas e transparentes. Se o usuário inserir algo fora de contexto, o agente detecta e o redireciona ao assunto principal.

## Tecnologias e Arquitetura

- **Linguagem:** TypeScript / Node.js
- **AI Framework:** [Vercel AI SDK v6](https://sdk.vercel.ai/docs)
- **LLM:** Groq llama-3.3-70b-versatile (via `@ai-sdk/groq`)
- **Validação e Contratos:** Zod (Tipagem estrita para parâmetros de ferramentas)
- **Backend Mock:** Express.js (Gerenciamento de rotas e estado em memória)

## Estrutura do Projeto

\`\`\`text
src/
├── agent/
│   ├── prompts.ts      # System Prompt contendo regras de negócio e limites
│   └── tools.ts        # Definição dos Schemas (Zod) e chamadas fetch para a API
├── api/
│   ├── server.ts       # Servidor Express com rotas HTTP simulando o backend
└── index.ts            # Ponto de entrada, loop conversacional e injeção de contexto
\`\`\`

## Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- Uma chave de API gratuita do [Groq Console](https://console.groq.com/keys)

### Instalação

1. Clone o repositório:
   \`\`\`bash
   git clone https://github.com/JoseMartinelliDev/runflow-ai-agent.git
   cd runflow-ai-agent
   \`\`\`

2. Instale as dependências:
   \`\`\`bash
   npm init -y
   npm install express dotenv zod ai @ai-sdk/groq
   npm install -D typescript @types/node @types/express tsx
   npx tsc --init
   \`\`\`

3. Configure as variáveis de ambiente:
   - Copie o arquivo de exemplo: \`cp .env.example .env\` (se aplicável)
   - Abra o arquivo \`.env\` e insira sua API Key do Groq:
   \`\`\`env
   GROQ_API_KEY=sua_chave_api_aqui
   PORT=3000
   \`\`\`

4. Inicie o agente:
   \`\`\`bash
   npx tsx src/index.ts
   \`\`\`

## Exemplos de Interação

O agente é treinado para seguir um fluxo rigoroso de negócios, evitando alucinações.

> **Usuário:** Quais produtos vocês têm?
> **Agente:** *(Chama `list_products`)* Temos Notebooks, Mouses e Monitores.
> **Usuário:** Quero comprar o Mouse.
> **Agente:** *(Percebe a ausência do parâmetro de quantidade)* Excelente! Quantas unidades do Mouse Sem Fio você deseja?
> **Usuário:** Apenas uma.
> **Agente:** *(Chama `create_order`)* Pedido criado com sucesso! Seu ID é 1002.

## Desafios e Aprendizados

Por ser meu primeiro contato aprofundado com a construção de um AI Agent, enfrentei desafios interessantes de arquitetura:
- **Engenharia de Prompt nas Ferramentas:** Descobri na prática que as descrições das ferramentas (o `description` do Zod) precisam ser extremamente claras. Sem instruções objetivas, o modelo gera ambiguidades nos parâmetros, quebrando a comunicação com o backend.
- **Atualizações de Framework:** Lidei com *breaking changes* recentes do Vercel AI SDK v6. Tive que refatorar implementações antigas de `CoreMessage` e `maxSteps` para os padrões atuais de `ModelMessage` e controle de loop com `stepCountIs()`, garantindo que a aplicação rodasse de forma fluida e atualizada.

## Próximos Passos
No futuro, pretendo evoluir este projeto substituindo o mock em memória por um banco de dados SQL relacional e integrando modelos de linguagem mais robustos para expandir as capacidades conversacionais do agente.

## Licença
Este projeto foi criado para fins de estudo e portfólio. Sinta-se livre para utilizar e modificar.