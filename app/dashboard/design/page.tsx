import { createClient } from "@/utils/supabase/server";
import { getSafeProfile, DEFAULT_THEME } from "@/utils/get-safe-theme";
import DesignClient from "@/components/dashboard/design/design-client";
import { redirect } from "next/navigation";
import { Database } from "@/utils/supabase/types";

export const dynamic = 'force-dynamic';

type Product = Database['public']['Tables']['products']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default async function DesignPage() {
  const supabase = await createClient();

  // 1. Verificación de Auth básica
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // 2. Fetching Paralelo y Robusto (Promise.all + Try/Catch Masivo)
  let safeProfile: Profile | null = null;
  let safeConfig = DEFAULT_THEME;
  let products: Product[] = [];
  let isPro = false;

  try {
    const [profileResult, productsResult] = await Promise.all([
      getSafeProfile(user.id),
      supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ]);

    // Procesar resultado de perfil
    if (profileResult.error) {
      console.error("DesignPage: Error loading profile", profileResult.error);
    }
    safeProfile = profileResult.profile;
    safeConfig = profileResult.config;

    // Determinar estado PRO de forma segura
    if (safeProfile && safeProfile.is_pro) {
        isPro = true;
    }

    // Procesar resultado de productos
    if (productsResult.error) {
      console.error("DesignPage: Error loading products", productsResult.error);
    } else {
      products = productsResult.data || [];
    }

  } catch (criticalError) {
    console.error("CRITICAL CRASH PREVENTED in DesignPage:", criticalError);
    // En caso de desastre total, usamos defaults y array vacío
    safeConfig = DEFAULT_THEME;
    products = [];
    isPro = false;
  }

  // 3. Renderizado Seguro
  // Mapeamos las props correctamente para el componente cliente DesignClient
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
