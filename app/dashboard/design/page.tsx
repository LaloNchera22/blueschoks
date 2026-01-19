import { createClient } from "@/utils/supabase/server";
import { getSafeProfile, DEFAULT_THEME, DUMMY_PROFILE } from "@/utils/get-safe-theme";
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
  // Inicializamos con valores seguros por defecto
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = [];
  let safeConfig: ThemeConfig = DEFAULT_THEME;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let safeProfile: any = DUMMY_PROFILE;
  let isPro = false;

  try {
    // FETCHING PARALELO
    // Usamos Promise.allSettled para que si falla productos, no falle el perfil (o viceversa)
    const [profileResult, productsResult] = await Promise.all([
      getSafeProfile(user.id),
      supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ]);

    // 1. Procesar Perfil y Configuración
    // getSafeProfile está garantizado para devolver un perfil (real o dummy) y una config válida
    safeConfig = profileResult.config;
    safeProfile = profileResult.profile;

    if (profileResult.error) {
        console.warn("DesignPage: Profile fetch warning (using fallback):", profileResult.error);
    }

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
    // CATCH-ALL PARA EVITAR PÁGINA BLANCA (ERROR 500)
    console.error("DesignPage: CRITICAL UNHANDLED ERROR", criticalError);
    // En el peor caso absoluto, la UI cargará con defaults y Dummy Profile
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
