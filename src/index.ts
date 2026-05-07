import 'dotenv/config';
import * as readline from 'node:readline/promises';
import { generateText, type ModelMessage, stepCountIs } from 'ai'; 
import { groq } from '@ai-sdk/groq'; 
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
    console.log(`🤖 [Agente AI] Inicializado. (Digite 'sair' para encerrar)\n`);
  });

  const messages: ModelMessage[] = [];

  while (true) {
    const userInput = await rl.question('👤 Você: ');

    if (userInput.toLowerCase() === 'sair') {
      server.close();
      rl.close();
      break;
    }
    
    messages.push({ role: 'user', content: userInput });

    try {
      const result = await generateText({
        model: groq('llama-3.3-70b-versatile'), 
        system: systemPrompt,
        messages: messages,
        tools: tools,
        stopWhen: stepCountIs(5), 
      });

      console.log(`\n🤖 Agente: ${result.text}\n`);
      if (result.response?.messages) {
        messages.push(...result.response.messages);
      }

    } catch (error: any) {
      console.error('\n❌ Erro no processamento:', error.message);
      messages.length = 0; 
    }
  }
}

main();