import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProducts() {
  console.log('Fetching products...');
  const { data: products, error: fetchError } = await supabase.from('products').select('*');
  
  if (fetchError) {
    console.error('Error fetching products:', fetchError);
    return;
  }

  const updates = products.map(product => {
    let name = product.name;
    let description = product.description;

    // Remove gramagem (ml, g, etc)
    name = name.replace(/\d+\s*ml/gi, '').replace(/\d+\s*g/gi, '').trim();
    description = description.replace(/\d+\s*ml/gi, '').replace(/\d+\s*g/gi, '').trim();

    // Determine temperature recommendation
    const hotCategories = ['salgados', 'tortas-salgadas', 'batatas'];
    const coldCategories = ['bolo-no-pote', 'brownie', 'pao-de-mel', 'copo-da-felicidade', 'cone-trufado', 'torta-cookies', 'bolos-caseiros', 'bebidas'];

    let tempTip = '';
    if (hotCategories.includes(product.category)) {
      tempTip = '(Consumir Quente)';
    } else if (coldCategories.includes(product.category)) {
      tempTip = '(Consumir Frio)';
    }

    // Update description
    if (tempTip && !description.includes(tempTip)) {
      description = `${description} ${tempTip}`.trim();
    }

    return {
      ...product,
      name,
      description
    };
  });

  console.log('Updating products...');
  const { error: updateError } = await supabase.from('products').upsert(updates);

  if (updateError) {
    console.error('Error updating products:', updateError);
  } else {
    console.log('All products updated successfully!');
  }
}

updateProducts();
