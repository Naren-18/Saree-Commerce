import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bmtcbgmewumkqixxmxgp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdGNiZ21ld3Vta3FpeHhteGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMDA0NjUsImV4cCI6MjA2MTg3NjQ2NX0.dYspfxapsVFoJoKyiQbo1DEd-dBcvo3oz9YV-QcyeLA"
);