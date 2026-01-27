import { createClient } from "@/utils/supabase/server"
import { Database } from "@/utils/supabase/types"
import { cache } from "react"

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  subscription_end_date: string | null
}

export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return null
  }
  return user
})

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
})
