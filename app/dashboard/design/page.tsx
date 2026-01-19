import { createClient } from "@/utils/supabase/server";
import { normalizeProfile, normalizeTheme } from "@/utils/theme-adapter";
import { DEFAULT_THEME_CONFIG } from "@/lib/types/theme-config";
import DesignClient from "@/components/dashboard/design/design-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DesignPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // 1. RAW DATA FETCHING
  // We fetch exactly what is in the DB, no hidden transformations yet.
  // Using Promise.all for performance.
  const [profileResult, productsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
  ]);

  // 2. NORMALIZATION LAYER (THE ADAPTER PATTERN)
  // We act as if the DB data is "dirty" and scrub it before it touches the UI.

  // A. Profile Scrubbing
  // normalizeProfile handles missing slugs, null shop names, and deep theme_config merging.
  // It guarantees a return object matching the Profile interface.
  const safeProfile = normalizeProfile(profileResult.data || { id: user.id, email: user.email });

  // B. Theme Scrubbing
  // We extract the theme from the normalized profile to ensure consistency.
  // normalizeProfile already runs normalizeTheme internally on the profile.theme_config,
  // but we can extract it cleanly here for clarity in props.
  const safeConfig = safeProfile.theme_config || normalizeTheme(null);

  // C. Product Scrubbing
  // Ensure we have an array, even if the query errored.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: any[] = productsResult.data || [];

  if (productsResult.error) {
    console.error("DesignPage: Error fetching products", productsResult.error);
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-gray-50">
      <DesignClient
        initialShopData={safeProfile}
        initialProducts={products}
        initialThemeConfig={safeConfig}
        isPro={safeProfile.is_pro || false}
      />
    </div>
  );
}
