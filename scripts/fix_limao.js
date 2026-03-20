import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLimao() {
  console.log('Fixing status for "Bolo Caseiro de Limão"...');
  
  const { data, error } = await supabase
    .from('products')
    .update({ featured: true, is_available: true })
    .eq('id', 'caseiro-limao');
    
  if (error) {
    console.error('Error updating product:', error.message);
  } else {
    console.log('Product "Bolo Caseiro de Limão" is now FEATURED and AVAILABLE!');
  }
}

fixLimao();
