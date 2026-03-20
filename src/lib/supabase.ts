import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gkanxpfmukzsflueqpts.supabase.co';
const supabaseAnonKey = 'sb_publishable_MLt53jhnEpmSc0GZv4chxA_EFnP_Ajw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
