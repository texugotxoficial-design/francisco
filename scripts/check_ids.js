import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error } = await supabase.from('products').select('id, name');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Products in DB:', data);
  }
}

checkProducts();
