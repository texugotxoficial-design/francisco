import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTestProducts() {
  const products = [
    {
      id: 'coca-cola',
      name: 'Coca-Cola',
      price: 6.00,
      category: 'bebidas',
      description: 'Refrescante gelada'
    },
    {
      id: 'brigadeiro-tradicional',
      name: 'Brigadeiro',
      price: 4.00,
      category: 'doces',
      description: 'Artesanal com chocolate belga'
    }
  ];

  const { error } = await supabase.from('products').upsert(products);
  if (error) {
    console.error('Error inserting products:', error);
  } else {
    console.log('Test products inserted successfully!');
  }
}

insertTestProducts();
