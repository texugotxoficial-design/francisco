import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllStatus() {
  const { data, error } = await supabase.from('products').select('id, name, is_available, featured');
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    const available = data.filter(p => p.is_available);
    const featured = data.filter(p => p.featured);
    console.log(`Total products: ${data.length}`);
    console.log(`Available products: ${available.length}`);
    console.log(`Featured products: ${featured.length}`);
    console.log('\nSample of available products:');
    console.log(JSON.stringify(available.slice(0, 5), null, 2));
  }
}

checkAllStatus();
