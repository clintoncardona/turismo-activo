import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Exportamos el cliente instanciado para importarlo en nuestros componentes
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
