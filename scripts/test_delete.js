import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testDelete() {
  const { error } = await supabase.from('products').delete().eq('id', 'coca-cola');
  if (error) {
    console.error('Error deleting product:', error);
  } else {
    console.log('Product deleted successfully (from script)!');
  }
}

testDelete();
