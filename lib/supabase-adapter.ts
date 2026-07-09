import { createClient } from "@supabase/supabase-js"
import type { Adapter } from "next-auth/adapters"

export function isDate(value: any): value is Date {
  return value instanceof Date
}

export function format<T>(obj: Record<string, any>): T {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      delete obj[key]
    }
    if (isDate(value)) {
      obj[key] = new Date(value)
    }
  }
  return obj as T
}

export function SupabaseAdapter(options: { url: string; secret: string }): Adapter {
  const { url, secret } = options
  const supabase = createClient(url, secret, {
    // We intentionally do not pass `db: { schema: "next_auth" }` 
    // so it uses the default `public` schema as defined in your schema.sql
    global: { headers: { "X-Client-Info": "@auth/supabase-adapter" } },
    auth: { persistSession: false },
  })

  return {
    async createUser(user) {
      const { id, image, ...userData } = user as any
      const { data, error } = await supabase
        .from("users")
        .insert({
          ...userData,
          emailVerified: userData.emailVerified?.toISOString(),
        })
        .select()
        .single()
      if (error) throw error
      return format(data)
    },
    async getUser(id) {
      const { data, error } = await supabase.from("users").select().eq("id", id).maybeSingle()
      if (error) throw error
      if (!data) return null
      return format(data)
    },
    async getUserByEmail(email) {
      const { data, error } = await supabase.from("users").select().eq("email", email).maybeSingle()
      if (error) throw error
      if (!data) return null
      return format(data)
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const { data, error } = await supabase
        .from("accounts")
        .select("users (*)")
        .match({ provider, providerAccountId })
        .maybeSingle()
      if (error) throw error
      if (!data || !data.users) return null
      return format(data.users)
    },
    async updateUser(user) {
      const { id, image, ...userData } = user as any
      const { data, error } = await supabase
        .from("users")
        .update({
          ...userData,
          emailVerified: userData.emailVerified?.toISOString(),
        })
        .eq("id", user.id!)
        .select()
        .single()
      if (error) throw error
      return format(data)
    },
    async deleteUser(userId) {
      const { error } = await supabase.from("users").delete().eq("id", userId)
      if (error) throw error
    },
    async linkAccount(account) {
      const { error } = await supabase.from("accounts").insert(account)
      if (error) throw error
      return account as any
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const { error } = await supabase.from("accounts").delete().match({ provider, providerAccountId })
      if (error) throw error
    },
    async createSession({ sessionToken, userId, expires }) {
      const { data, error } = await supabase
        .from("sessions")
        .insert({ sessionToken, userId, expires: expires.toISOString() })
        .select()
        .single()
      if (error) throw error
      return format(data)
    },
    async getSessionAndUser(sessionToken) {
      const { data, error } = await supabase
        .from("sessions")
        .select("*, users(*)")
        .eq("sessionToken", sessionToken)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      const { users: user, ...session } = data
      return {
        user: format(user),
        session: format(session),
      }
    },
    async updateSession(session) {
      const { data, error } = await supabase
        .from("sessions")
        .update({
          ...session,
          expires: session.expires?.toISOString(),
        })
        .eq("sessionToken", session.sessionToken)
        .select()
        .single()
      if (error) throw error
      return format(data)
    },
    async deleteSession(sessionToken) {
      const { error } = await supabase.from("sessions").delete().eq("sessionToken", sessionToken)
      if (error) throw error
    },
    async createVerificationToken(token) {
      const { data, error } = await supabase
        .from("verification_token")
        .insert({
          ...token,
          expires: token.expires.toISOString(),
        })
        .select()
        .single()
      if (error) throw error
      const { id, ...verificationToken } = data as any
      return format(verificationToken)
    },
    async useVerificationToken({ identifier, token }) {
      const { data, error } = await supabase
        .from("verification_token")
        .delete()
        .match({ identifier, token })
        .select()
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      const { id, ...verificationToken } = data as any
      return format(verificationToken)
    },
  }
}
