import { tool } from 'ai';
import { z } from 'zod';

const PORT = process.env.PORT || 3000;
const API_BASE = `http://127.0.0.1:${PORT}`;

export const tools = {
  list_products: tool({
    description: 'Lista todos os produtos disponíveis na loja de forma resumida, (apenas com Id, nome, e preço). Não contém descrição dos produtos.',
    parameters: z.object({}),
    execute: async () => {
      const res = await fetch(`${API_BASE}/products`);
      return res.json();
    },
  }),
  get_product: tool({
    description: 'Consulta os detalhes completos de um produto específico. USE ESTA FERRAMENTA se o cliente pedir DETALHES ou a DECRIÇÃO sobre um produto.',
    parameters: z.object({
      id: z.string().describe('O ID exato do produto. Não invente IDs.'),
    }),
    execute: async ({ id }) => {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) return { success: false, error: (await res.json()).error };
      return res.json();
    },
  }),
  get_order_status: tool({
    description: 'Consulta as informações e o status de um pedido existente pelo ID.',
    parameters: z.object({
      orderId: z.string().describe('O ID do pedido'),
    }),
    execute: async ({ orderId }) => {
      const res = await fetch(`${API_BASE}/orders/${orderId}`);
      if (!res.ok) return { success: false, error: (await res.json()).error };
      return res.json();
    },
  }),
  create_order: tool({
    description: 'Aciona o sistema de checkout para criar um novo pedido. SÓ USE QUANDO TIVER A CONFIRMAÇÃO DA QUANTIDADE QUE O CLIENTE DESEJA.',
    parameters: z.object({
      items: z.array(
        z.object({
          productId: z.string().describe('O ID numérico do produto (ex: "1"). NUNCA use o nome do produto aqui.'),
          quantity: z.number().int().positive().describe('A quantidade em unidades que o cliente deseja comprar.'),
        })
      ).describe('A lista de produtos que formarão o carrinho.'),
    }),
    execute: async ({ items }) => {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, reason: data.error };
      return { success: true, orderId: data.orderId, total: data.total };
    },
  }),
};