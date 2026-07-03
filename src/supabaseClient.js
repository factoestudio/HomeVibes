import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhnnvkekuszxigtoxafb.supabase.co';
const supabaseAnonKey = 'sb_publishable_HaADf1EZDcirYyOHjMrgbQ_HXXvNDwq';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
