import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { sanitizeDesign, DEFAULT_DESIGN } from "@/utils/design-sanitizer";
import DesignEditor from "@/components/dashboard/design/design-editor";

export const dynamic = 'force-dynamic';

export default async function DesignPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // 1. Fetch RAW data (Profile & Products)
  // We use Promise.all to fetch in parallel
  const [profileResponse, productsResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('products').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  ]);

  const profile = profileResponse.data;
  const products = productsResponse.data || [];

  if (profileResponse.error || !profile) {
    console.error("DesignPage: Error fetching profile", profileResponse.error);
    // Even if DB fails, return a working UI with defaults
    return (
      <DesignEditor
        initialConfig={DEFAULT_DESIGN}
        initialProducts={[]}
        userId={user.id}
        slug={user.id} // Fallback slug
      />
    );
  }

  // 2. SANITIZE
  // We prioritize 'design_config' if intended, but current app uses 'theme_config'.
  // We will check 'theme_config' first as it likely contains the user's data.
  // The sanitizer will perform a HARD RESET if the structure doesn't match the new DesignConfig.

  // Note: We pass the profile to help populate default fields like shopName/avatar if config is missing.
  // FIX: Prioritize design_config (new) over theme_config (legacy) to ensure persistence.
  const rawConfig = profile.design_config || profile.theme_config;
  const cleanConfig = sanitizeDesign(rawConfig, profile);

  // Guarantee valid slug
  const validSlug = profile.slug || profile.username || user.id;

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-gray-50 overflow-hidden">
      <DesignEditor
        initialConfig={cleanConfig}
        initialProducts={products}
        userId={user.id}
        slug={validSlug}
      />
    </div>
  );
}
