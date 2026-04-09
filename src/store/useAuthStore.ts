import { create } from "zustand"
import { supabase } from "@/lib/supabase"
import type { AdminUser } from "@/types/auth"

interface AuthStore {
  user: AdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
  checkSession: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        set({
          user: { id: session.user.id, email: session.user.email! },
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data.user) {
      set({
        user: { id: data.user.id, email: data.user.email! },
        isAuthenticated: true,
      })
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    set({ user: null, isAuthenticated: false })
  },
}))