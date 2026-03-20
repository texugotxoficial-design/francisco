import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductStatus() {
  console.log('Checking status for "Bolo Caseiro de Limão"...');
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', '%limão%'); // Search for "limão"
    
  if (error) {
    console.error('Error fetching product:', error.message);
  } else {
    console.log('Product details:', JSON.stringify(data, null, 2));
  }
}

checkProductStatus();
