import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/** Service-role client — RLS'yi bypass eder. Sadece server tarafında kullanılmalı. */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
