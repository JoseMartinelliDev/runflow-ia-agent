import { z } from 'zod';

const PORT = process.env.PORT || 3000;
const API_BASE = `http://127.0.0.1:${PORT}`;

export const tools: any = {
  list_products: {
    description: 'Lista todos os produtos disponíveis na loja de forma resumida.',
    parameters: z.object({}),
    execute: async () => {
      const res = await fetch(`${API_BASE}/products`);
      return res.json();
    },
  },

  get_product: {
    description: 'Consulta os detalhes completos de um produto. Use sempre que o usuário quiser saber mais sobre um item.',
    parameters: z.object({
      id: z.string().describe('O ID numérico do produto (ex: "1", "2").'),
    }),
    execute: async ({ id }: { id: string }) => {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) return { success: false, error: 'Produto não encontrado' };
      return res.json();
    },
  },

  get_order_status: {
    description: 'Consulta o status de um pedido existente.',
    parameters: z.object({
      orderId: z.string().describe('O ID do pedido.'),
    }),
    execute: async ({ orderId }: { orderId: string }) => {
      const res = await fetch(`${API_BASE}/orders/${orderId}`);
      if (!res.ok) return { success: false, error: 'Pedido não encontrado' };
      return res.json();
    },
  },

  create_order: {
    description: 'Cria um novo pedido de compra. Chame quando o usuário confirmar a quantidade e o produto.',
    parameters: z.object({
      product_id: z.string().describe('O ID do produto (ex: "1", "2").'),
      quantity: z.number().min(1).describe('A quantidade desejada.'),
    }),
    execute: async ({ product_id, quantity }: { product_id: string; quantity: number }) => {
      // Mapeia o formato plano do agente para o formato de array 'items' do seu servidor
      const payload = {
        items: [{ productId: product_id, quantity }]
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
  },
};