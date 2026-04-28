import 'dotenv/config';
import * as readline from 'node:readline/promises';
import { generateText, CoreMessage } from 'ai';
import { google } from '@ai-sdk/google';

// Importando os módulos refatorados
import { app } from './api/server';
import { systemPrompt } from './agent/prompts';
import { tools } from './agent/tools';

const PORT = process.env.PORT || 3000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const server = app.listen(PORT, () => {
    console.log(`\n📦 [Runflow API] Rodando na porta ${PORT}`);
    console.log(`🤖 [Agente AI] Inicializado. Comece a conversar!\n`);
    console.log(`(Digite 'sair' para encerrar)\n`);
    console.log(`---------------------------------------------------`);
  });

  const messages: CoreMessage[] = [];

  while (true) {
    const userInput = await rl.question('👤 Você: ');

    if (userInput.toLowerCase() === 'sair') {
      console.log('🤖 Agente: Até logo!');
      server.close();
      rl.close();
      break;
    }

    messages.push({ role: 'user', content: userInput });

    try {
      const result = await generateText({
        model: google('gemini-2.5-flash'),
        system: systemPrompt,
        messages,
        tools,
        maxSteps: 5, 
      });

      console.log(`\n🤖 Agente: ${result.text}\n`);
      messages.push(...result.response.messages);

    } catch (error) {
      console.error('\nErro ao comunicar com o LLM:', error);
    }
  }
}

main();