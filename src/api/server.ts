import express from 'express';

export const app = express();
app.use(express.json());

const products = [
  { 
    id: '1', 
    name: 'Notebook Pro 15"', 
    price: 4500, 
    stock: 5, 
    description: 'Processador de última geração, 16GB de RAM e SSD NVMe de 1TB. Desempenho extremo, ideal para desenvolvedores de software e edição de vídeo.' 
  },
  { 
    id: '2', 
    name: 'Mouse Sem Fio Ergonômico', 
    price: 150, 
    stock: 20, 
    description: 'Design vertical que previne dores no pulso, conexão Bluetooth 5.0 ultrarrápida e bateria recarregável com duração de até 60 dias.' 
  },
  { 
    id: '3', 
    name: 'Teclado Mecânico RGB', 
    price: 350, 
    stock: 0, 
    description: 'Switches táteis de alta precisão, chassi em alumínio escovado e retroiluminação RGB customizável tecla a tecla.' 
  },
  { 
    id: '4', 
    name: 'Monitor Ultrawide 29"', 
    price: 1200, 
    stock: 8, 
    description: 'Tela IPS com proporção 21:9, taxa de atualização de 75Hz e cores sRGB 99%. Expanda sua área de trabalho e aumente sua produtividade.' 
  },
  { 
    id: '5', 
    name: 'Cadeira Ergonômica Mesh', 
    price: 900, 
    stock: 3, 
    description: 'Encosto totalmente em tela respirável para dias quentes, suporte lombar com ajuste de tensão e braços 3D reguláveis.' 
  },
  { 
    id: '6', 
    name: 'Headset Pro com Cancelamento de Ruído', 
    price: 280, 
    stock: 12, 
    description: 'Áudio imersivo 7.1 surround, microfone boom com filtro de ruído externo e almofadas em memory foam para horas de uso confortável.' 
  },
  { 
    id: '7', 
    name: 'Webcam Full HD 1080p', 
    price: 199, 
    stock: 15, 
    description: 'Lente de vidro com foco automático, microfone estéreo embutido e anel de luz (Ring Light) integrado. Perfeita para reuniões e streaming.' 
  },
  { 
    id: '8', 
    name: 'Dock Station USB-C 8 em 1', 
    price: 250, 
    stock: 6, 
    description: 'Hub de expansão em alumínio com portas HDMI 4K, USB 3.0, leitor de cartões SD e porta Power Delivery de 100W para carregar seu notebook.' 
  }
];

const orders: Record<string, any> ={
    '1001': {
      status: 'Enviado', 
      items: [{productId: '2', quantity: '1'}],
      total: '150'},
    };

    let nextOrderId = 1002;

    app.get('/products', (req, res)=>{
        const summary = products.map(p => ({ 
          id: p.id,
          name: p.name, 
          price: p.price, 
          hasStock: p.stock > 0 
        }));
  res.json(summary);
    });

    app.get('/products/:id', (req, res)=> {
        const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
    });

    app.get('/orders/:id', (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
  res.json(order);
});

    app.post('/orders', (req, res) => {
  const items: { productId: string; quantity: number }[] = req.body.items;
  
  if (!items || items.length === 0) return res.status(400).json({ error: 'O pedido deve conter itens' });
  
  let total = 0;
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) return res.status(404).json({ error: `Produto ${item.productId} não existe` });
    if (product.stock < item.quantity) return res.status(400).json({ error: `Estoque insuficiente. Disponível: ${product.stock}` });
    total += product.price * item.quantity;
  }

  for(const item of items){
    const product = products.find(p => p.id === item.productId)!;
    product.stock -= item.quantity;
  }

  const orderId = String(nextOrderId++);
  const newOrder = { status: 'Processando', items, total };
  orders[orderId] = newOrder;

  res.status(201).json({ orderId, ...newOrder });
});