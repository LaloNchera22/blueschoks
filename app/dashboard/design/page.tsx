import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { sanitizeDesign, DEFAULT_DESIGN } from "@/utils/design-sanitizer";
import DesignEditor from "@/components/dashboard/design/design-editor";
import { getProfile } from "@/utils/user-data";
import UpgradeBanner from "@/components/dashboard/upgrade-banner";

export const dynamic = 'force-dynamic';

export default async function DesignPage() {
  const profile = await getProfile();

  if (!profile) {
    return redirect("/login");
  }

  const supabase = await createClient();
  const userId = profile.id;

  // 1. Fetch RAW data (Store & Products)
  // We use Promise.all to fetch in parallel
  const [storeResponse, productsResponse] = await Promise.all([
    supabase.from('stores').select('*').eq('owner_id', userId).single(),
    supabase.from('products').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  ]);

  const store = storeResponse.data;
  const products = productsResponse.data || [];

  if (storeResponse.error || !store) {
    console.error("DesignPage: Error fetching store", storeResponse.error);
    // Even if DB fails, return a working UI with defaults
    return (
      <DesignEditor
        initialConfig={DEFAULT_DESIGN}
        initialProducts={[]}
        userId={userId}
        slug={userId}
      />
    );
  }

  // 2. SANITIZE
  // Use 'config' from stores table.
  const rawConfig = store.config;

  // We pass 'store' as the fallback profile object.
  // sanitizeDesign expects { shop_name, avatar_url }. 'stores' has 'shop_name'.
  const cleanConfig = sanitizeDesign(rawConfig, store);

  // Guarantee valid slug
  const validSlug = store.slug || userId;

  if (!profile.is_pro) {
    return <UpgradeBanner />;
  }

  return (
    <div className="flex-1 w-full h-full bg-gray-50 overflow-hidden">
      <DesignEditor
        initialConfig={cleanConfig}
        initialProducts={products}
        userId={userId}
        slug={validSlug}
        isPro={true}
      />
    </div>
  );
}
