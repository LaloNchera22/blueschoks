import { createClient } from "@/utils/supabase/server";
import { getSafeProfile, DEFAULT_THEME, DUMMY_PROFILE } from "@/utils/get-safe-theme";
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

  // ROBUST VARIABLES (Explicit Typing)
  // Initialize with safe default values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = [];
  let safeConfig = DEFAULT_THEME;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let safeProfile: any = DUMMY_PROFILE;
  let isPro = false;

  try {
    // PARALLEL FETCHING
    // Use Promise.all to load profile and products simultaneously
    const [profileResult, productsResult] = await Promise.all([
      getSafeProfile(user.id),
      supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ]);

    // 1. Process Profile and Configuration
    // getSafeProfile is guaranteed to return a profile (real or dummy) and valid config
    safeConfig = profileResult.config;
    safeProfile = profileResult.profile;

    // Check PRO status safely
    if (safeProfile && safeProfile.is_pro) {
        isPro = true;
    }

    // 2. Process Products
    if (productsResult.error) {
        console.error("DesignPage: Products fetch error:", productsResult.error);
        // Products remains as []
    } else {
        products = productsResult.data || [];
    }

  } catch (criticalError) {
    // CATCH-ALL TO PREVENT WHITE PAGE (500 ERROR)
    console.error("DesignPage: CRITICAL UNHANDLED ERROR", criticalError);
    // In the absolute worst case, UI loads with defaults and Dummy Profile
    safeConfig = DEFAULT_THEME;
    safeProfile = DUMMY_PROFILE;
    products = [];
    isPro = false;
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-gray-50">
      <DesignClient
        initialShopData={safeProfile}
        initialProducts={products}
        initialThemeConfig={safeConfig}
        isPro={isPro}
      />
    </div>
  );
}
