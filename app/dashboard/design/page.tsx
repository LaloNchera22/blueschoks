import { createClient } from "@/utils/supabase/server";
import { getSafeProfile, DEFAULT_THEME } from "@/utils/get-safe-theme";
import { ThemeConfig } from "@/lib/types/theme-config";
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

  // VARIABLES ROBUSTAS (Explicit Typing)
  // Usamos 'any' para productos como solicitado para evitar Type Hell temporalmente,
  // pero mantenemos la estructura sólida para la config.
  let products: any[] = [];
  let safeConfig: ThemeConfig = DEFAULT_THEME;
  let safeProfile: any = null;
  let isPro = false;

  try {
    // FETCHING PARALELO
    const [profileResult, productsResult] = await Promise.all([
      getSafeProfile(user.id),
      supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ]);

    // 1. Procesar Perfil y Configuración
    if (profileResult.error) {
        console.warn("DesignPage: Profile fetch warning:", profileResult.error);
    }
    // Siempre tendremos un config válido gracias al Firewall
    safeConfig = profileResult.config;
    safeProfile = profileResult.profile;

    if (safeProfile && safeProfile.is_pro) {
        isPro = true;
    }

    // 2. Procesar Productos
    if (productsResult.error) {
        console.error("DesignPage: Products fetch error:", productsResult.error);
        // Products se mantiene como []
    } else {
        products = productsResult.data || [];
    }

  } catch (criticalError) {
    // CATCH-ALL PARA EVITAR PÁGINA BLANCA
    console.error("DesignPage: CRITICAL UNHANDLED ERROR", criticalError);
    // En el peor caso, la UI cargará con defaults
    safeConfig = DEFAULT_THEME;
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
