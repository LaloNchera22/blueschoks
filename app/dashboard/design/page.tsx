import { createClient } from "@/utils/supabase/server";
import { getSafeProfile, DEFAULT_THEME } from "@/utils/get-safe-theme";
import DesignClient from "@/components/dashboard/design/design-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

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
  let safeProfile = null;
  let safeConfig = DEFAULT_THEME;
  let products: any[] = [];
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
    // Asumimos que la columna es is_pro, si no existe será undefined -> false
    if (safeProfile && 'is_pro' in safeProfile) {
        isPro = Boolean(safeProfile.is_pro);
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
