import {createClient} from '@supabase/supabase-js';
const supabaseUrl='https://cthiiedfagzrarishirw.supabase.co';
const supabaseKey='sb_publishable_iilxdQlPeOAZNpnxZ9z44Q_VNYjwdjN';
export  const supabase=createClient(supabaseUrl,supabaseKey);