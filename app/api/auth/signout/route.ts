import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 1. Creamos el cliente (con await para evitar el error rojo)
  const supabase = await createClient();
  
  // 2. Cerramos la sesión
  await supabase.auth.signOut();

  // 3. Redirigimos a la página principal ("/") en lugar de "/login"
  return NextResponse.redirect(new URL("/", req.url));
}