import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';
const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  // SALGADOS (R$ 8,50)
  { id: 'salgado-coxinha-requeijao', name: 'Coxinha com Requeijão', category: 'salgados', price: 8.50, description: 'Salgado frito recheado com frango e requeijão' },
  { id: 'salgado-enroladinho-salsicha', name: 'Enroladinho de Salsicha', category: 'salgados', price: 8.50, description: 'Salgado frito com salsicha' },
  { id: 'salgado-bolinho-calabresa-requeijao', name: 'Bolinho de Calabresa com Requeijão', category: 'salgados', price: 8.50, description: 'Salgado frito recheado com calabresa e requeijão' },
  
  // Others (R$ 10,00)
  { id: 'salgado-bolinho-calabresa-cheddar', name: 'Bolinho de Calabresa com Cheddar', category: 'salgados', price: 10.00, description: 'Salgado frito recheado com calabresa e cheddar' },
  { id: 'salgado-bolinho-queijo', name: 'Bolinho de Queijo', category: 'salgados', price: 10.00, description: 'Salgado frito recheado com queijo' },
  { id: 'salgado-rissole', name: 'Rissole', category: 'salgados', price: 10.00, description: 'Salgado frito de diversos sabores' },
  
  // TORTA SALGADA (R$ 20,00)
  { id: 'torta-frango-requeijao', name: 'Torta de Frango com Requeijão', category: 'tortas-salgadas', price: 20.00, description: 'Pedaço de torta salgada artesanal' },
  { id: 'torta-calabresa-requeijao', name: 'Torta de Calabresa com Requeijão', category: 'tortas-salgadas', price: 20.00, description: 'Pedaço de torta salgada artesanal' },
  { id: 'torta-calabresa-cheddar', name: 'Torta de Calabresa com Cheddar', category: 'tortas-salgadas', price: 20.00, description: 'Pedaço de torta salgada artesanal' },
  
  // BATATAS
  { id: 'batata-completa', name: 'Batata Completa', category: 'batatas', price: 18.00, description: 'Batata frita com ketchup, maionese, cheddar e calabresa' },
  { id: 'batata-simples', name: 'Batata Simples', category: 'batatas', price: 10.00, description: 'Batata frita com ketchup e maionese' },
  
  // BEBIDAS (R$ 2,50)
  { id: 'bebida-agua', name: 'Água 510ml', category: 'bebidas', price: 2.50, description: 'Água mineral natural' },
  { id: 'bebida-coca', name: 'Coca-cola 200ml', category: 'bebidas', price: 2.50, description: 'Refrigerante gelado' },
  { id: 'bebida-pespi', name: 'Pespi 200ml', category: 'bebidas', price: 2.50, description: 'Refrigerante gelado' },
  { id: 'bebida-guarana', name: 'Guaraná 200ml', category: 'bebidas', price: 2.50, description: 'Refrigerante gelado' },
  { id: 'bebida-fanta', name: 'Fanta Laranja 200ml', category: 'bebidas', price: 2.50, description: 'Refrigerante gelado' },
  { id: 'bebida-sprite', name: 'Sprite 200ml', category: 'bebidas', price: 2.50, description: 'Refrigerante gelado' },

  // BOLO NO POTE (R$ 12,00)
  { id: 'pote-ninho-nutella', name: 'Bolo no Pote Ninho com Nutella', category: 'bolo-no-pote', price: 12.00, description: 'Bolo artesanal no pote' },
  { id: 'pote-ovomaltine', name: 'Bolo no Pote Ovomaltine', category: 'bolo-no-pote', price: 12.00, description: 'Bolo artesanal no pote' },
  { id: 'pote-prestigio', name: 'Bolo no Pote Prestígio', category: 'bolo-no-pote', price: 12.00, description: 'Bolo artesanal no pote' },
  { id: 'pote-maracuja', name: 'Bolo no Pote Mousse de Maracujá', category: 'bolo-no-pote', price: 12.00, description: 'Bolo artesanal no pote' },
  { id: 'pote-coco', name: 'Bolo no Pote Coco Cremoso', category: 'bolo-no-pote', price: 12.00, description: 'Bolo artesanal no pote' },
  { id: 'pote-doce-de-leite', name: 'Bolo no Pote Doce de Leite', category: 'bolo-no-pote', price: 12.00, description: 'Bolo artesanal no pote' },
  { id: 'pote-avela', name: 'Bolo no Pote Mousse de Avelã', category: 'bolo-no-pote', price: 12.00, description: 'Bolo artesanal no pote' },

  // BROWNIE (R$ 20,00)
  { id: 'brownie-ninho-nutella', name: 'Brownie Ninho com Nutella', category: 'brownie', price: 20.00, description: 'Brownie artesanal recheado' },
  { id: 'brownie-ninho-avela', name: 'Brownie Ninho com Creme de Avelã', category: 'brownie', price: 20.00, description: 'Brownie artesanal recheado' },
  { id: 'brownie-doce-leite-ninho', name: 'Brownie Doce de Leite com Ninho', category: 'brownie', price: 20.00, description: 'Brownie artesanal recheado' },

  // PÃO DE MEL (R$ 12,00)
  { id: 'pao-mel-doce-leite', name: 'Pão de Mel Doce de Leite', category: 'pao-de-mel', price: 12.00, description: 'Pão de mel artesanal recheado' },
  { id: 'pao-mel-ninho-nutella', name: 'Pão de Mel Ninho com Nutella', category: 'pao-de-mel', price: 12.00, description: 'Pão de mel artesanal recheado' },
  { id: 'pao-mel-avela', name: 'Pão de Mel Mousse de Avelã', category: 'pao-de-mel', price: 12.00, description: 'Pão de mel artesanal recheado' },
  { id: 'pao-mel-brigadeiro', name: 'Pão de Mel Brigadeiro', category: 'pao-de-mel', price: 12.00, description: 'Pão de mel artesanal recheado' },

  // COPO DA FELICIDADE (R$ 25,00)
  { id: 'copo-ninho-nutella', name: 'Copo Felicidade Ninho com Nutella', category: 'copo-da-felicidade', price: 25.00, description: 'Copo da felicidade recheado' },
  { id: 'copo-maracuja', name: 'Copo Felicidade Mousse de Maracujá', category: 'copo-da-felicidade', price: 25.00, description: 'Copo da felicidade recheado' },
  { id: 'copo-chocolatudo', name: 'Copo Felicidade Chocolatudo', category: 'copo-da-felicidade', price: 25.00, description: 'Copo da felicidade recheado' },
  { id: 'copo-oreo', name: 'Copo Felicidade Oreo', category: 'copo-da-felicidade', price: 25.00, description: 'Copo da felicidade recheado' },

  // CONE TRUFADO (R$ 11,00)
  { id: 'cone-ninho-nutella', name: 'Cone Trufado Ninho com Nutella', category: 'cone-trufado', price: 11.00, description: 'Cone trufado artesanal recheado' },
  { id: 'cone-maracuja-nutella', name: 'Cone Trufado Mousse de Maracujá com Nutella', category: 'cone-trufado', price: 11.00, description: 'Cone trufado artesanal recheado' },
  { id: 'cone-avela', name: 'Cone Trufado Mousse de Avelã', category: 'cone-trufado', price: 11.00, description: 'Cone trufado artesanal recheado' },
  { id: 'cone-prestigio', name: 'Cone Trufado Prestígio', category: 'cone-trufado', price: 11.00, description: 'Cone trufado artesanal recheado' },
  { id: 'cone-oreo', name: 'Cone Trufado Oreo', category: 'cone-trufado', price: 11.00, description: 'Cone trufado artesanal recheado' },
  { id: 'cone-brigadeiro', name: 'Cone Trufado Brigadeiro', category: 'cone-trufado', price: 11.00, description: 'Cone trufado artesanal recheado' },

  // TORTA COOKIES (R$ 20,00)
  { id: 'cookie-brigadeiro', name: 'Torta Cookie Brigadeiro', category: 'torta-cookies', price: 20.00, description: 'Torta de cookie artesanal' },
  { id: 'cookie-nutella', name: 'Torta Cookie Nutella', category: 'torta-cookies', price: 20.00, description: 'Torta de cookie artesanal' },
  { id: 'cookie-doce-de-leite', name: 'Torta Cookie Doce de Leite', category: 'torta-cookies', price: 20.00, description: 'Torta de cookie artesanal' },

  // BOLOS CASEIROS (R$ 30,00)
  { id: 'caseiro-avela', name: 'Bolo Caseiro Mousse de Avelã', category: 'bolos-caseiros', price: 30.00, description: 'Bolo caseiro artesanal' },
  { id: 'caseiro-ninho', name: 'Bolo Caseiro Mousse de Ninho', category: 'bolos-caseiros', price: 30.00, description: 'Bolo caseiro artesanal' },
  { id: 'caseiro-limao', name: 'Bolo Caseiro de Limão', category: 'bolos-caseiros', price: 30.00, description: 'Bolo caseiro artesanal' },
  { id: 'caseiro-coco', name: 'Bolo Caseiro Coco Cremoso', category: 'bolos-caseiros', price: 30.00, description: 'Bolo caseiro artesanal' },
  { id: 'caseiro-milho', name: 'Bolo Caseiro de Milho', category: 'bolos-caseiros', price: 30.00, description: 'Bolo caseiro artesanal' },
  { id: 'caseiro-cenoura', name: 'Bolo Caseiro Cenoura com Chocolate', category: 'bolos-caseiros', price: 30.00, description: 'Bolo caseiro artesanal' },
  { id: 'caseiro-aipim', name: 'Bolo Caseiro de Aipim', category: 'bolos-caseiros', price: 30.00, description: 'Bolo caseiro artesanal' },
];

async function insertProducts() {
  console.log('Inserting products...');
  const { data, error } = await supabase.from('products').upsert(products);
  if (error) {
    console.error('Error inserting products:', error);
  } else {
    console.log('All products inserted successfully!');
  }
}

insertProducts();
