import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabaseTypes";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 防御性编程：运行时检查
// 防止环境变量缺失或为 undefined 的问题
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is missing in environment variables.");
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
