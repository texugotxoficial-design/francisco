import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProducts() {
  console.log('Fetching products...');
  const { data: products, error: fetchError } = await supabase.from('products').select('*');
  
  if (fetchError) {
    console.error('Error fetching products:', fetchError);
    return;
  }

  const updates = products.map(product => {
    let name = product.name;
    let description = product.description;

    // Remove gramagem and weight patterns
    // Matches: "200ml", "510ml", "250g", "Peso aprox. 250g", "Peso aprox 250g.", etc.
    const weightPatterns = [
      /\s*Peso\s*aprox\.?\s*\d+\s*[g-kg-ml]+\.?/gi,
      /\s*Peso\s*\d+\s*[g-kg-ml]+\.?/gi,
      /\(\s*\d+\s*[g-kg-ml]+\s*\)/gi,
      /\d+\s*ml/gi,
      /\d+\s*g/gi
    ];

    weightPatterns.forEach(pattern => {
      name = name.replace(pattern, '').trim();
      description = description.replace(pattern, '').trim();
    });

    // Clean up double spaces or trailing dots from removal
    name = name.replace(/\s\s+/g, ' ').trim();
    description = description.replace(/\s\s+/g, ' ').replace(/\.\./g, '.').trim();

    // Remove "manter refrigerado" or similar if we are replacing it with "Consumir Frio"
    description = description.replace(/Recomendamos manter refrigerado para melhor experiência/gi, '');
    description = description.replace(/Recomendamos manter refrigerado/gi, '');

    // Determine temperature recommendation
    const hotCategories = ['salgados', 'tortas-salgadas', 'batatas'];
    const coldCategories = ['bolo-no-pote', 'brownie', 'pao-de-mel', 'copo-da-felicidade', 'cone-trufado', 'torta-cookies', 'bolos-caseiros', 'bebidas'];

    let tempTip = '';
    if (hotCategories.includes(product.category)) {
      tempTip = 'Consumir Quente';
    } else if (coldCategories.includes(product.category)) {
      tempTip = 'Consumir Frio';
    }

    // Update description - ensure it ends with the tip nicely
    if (tempTip) {
      if (!description.includes(tempTip)) {
        description = `${description}. ${tempTip}.`.replace(/\.\s*\./g, '.').trim();
      }
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
    console.log('All products fixed and updated successfully!');
  }
}

fixProducts();
