import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateBeverages() {
  console.log('Fetching beverages...');
  const { data: beverages, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'bebidas');

  if (fetchError) {
    console.error('Error fetching beverages:', fetchError);
    return;
  }

  console.log(`Found ${beverages.length} beverages. Updating descriptions...`);

  for (const item of beverages) {
    const { error: updateError } = await supabase
      .from('products')
      .update({ description: 'garrafa pet de 200ml (Bem Gelada ❄️)' })
      .eq('id', item.id);

    if (updateError) {
      console.error(`Error updating item ${item.id}:`, updateError);
    } else {
      console.log(`Updated ${item.name}`);
    }
  }

  console.log('Done!');
}

updateBeverages();
