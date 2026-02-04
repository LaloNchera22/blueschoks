import { createClient, createAdminClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { sanitizeDesign, DEFAULT_DESIGN } from "@/utils/design-sanitizer";
import { getProfile } from "@/utils/user-data";
import DesignClientPage from "./design-client-page";

export const dynamic = 'force-dynamic';

export default async function DesignPage() {
  const profile = await getProfile();

  if (!profile) {
    return redirect("/login");
  }

  const supabase = await createClient();
  const userId = profile.id;

  // 1. Fetch Products only (Store is obsolete for design)
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Use Admin Client to fetch potentially hidden config columns (RLS)
  const adminSupabase = await createAdminClient();
  const { data: adminProfile } = await adminSupabase
    .from('profiles')
    .select('theme_config, design_config')
    .eq('id', userId)
    .single();

  // 2. SANITIZE
  // Use 'theme_config' from profiles table.
  // Prioritize Admin fetched data as User fetch might miss hidden columns
  // @ts-ignore: profile type might not be fully updated in generated types
  const rawConfig = adminProfile?.design_config || adminProfile?.theme_config || profile.design_config || profile.theme_config;

  // We pass 'profile' as the fallback object.
  const cleanConfig = sanitizeDesign(rawConfig, profile);

  // Guarantee valid slug
  // @ts-ignore: profile type might not be fully updated
  const validSlug = profile.username || userId;

  return (
    <DesignClientPage
      initialConfig={cleanConfig}
      initialProducts={products || []}
      userId={userId}
      slug={validSlug}
      initialProfile={profile}
    />
  );
}
