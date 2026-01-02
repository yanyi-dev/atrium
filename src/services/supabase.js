import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://dhdwkpjnkhsugchotwny.supabase.co";
// const supabaseKey = process.env.SUPABASE_KEY;
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZHdrcGpua2hzdWdjaG90d255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjEzODgsImV4cCI6MjA4MTUzNzM4OH0.yD1sMzs8te7Y13RuEFsLTJ6OyEbl1X1ivqxfwaHTOLI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
