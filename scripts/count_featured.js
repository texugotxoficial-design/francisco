import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function countFeatured() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name')
    .eq('featured', true);
    
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log(`Found ${data.length} featured products:`);
    console.log(JSON.stringify(data, null, 2));
  }
}

countFeatured();
