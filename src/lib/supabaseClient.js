import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://pvyrfjgrfmuvivdflcgg.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_KoI_EHwLNl8IlbB60Zgmng_TsuvaZUv'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

// Capture callback intent before the SDK consumes the URL fragment.
const callbackHash = new URLSearchParams(window.location.hash.slice(1))
const callbackQuery = new URLSearchParams(window.location.search)
export const isRecoveryCallback = callbackHash.get('type') === 'recovery'
export const isSessionCallback = callbackHash.has('access_token') || callbackQuery.has('code')
export const authCallbackError = callbackHash.has('error') || callbackQuery.has('error')
  ? 'This sign-in or password-reset link is invalid or has expired. Please request a new link.' : ''

export const authConfigurationError = !supabaseUrl || !supabaseAnonKey
  || supabaseUrl.includes('your-project-ref') || supabaseAnonKey.includes('your-supabase')
  ? 'Sign-in is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then rebuild the app.'
  : ''

// One client owns persistence, token refresh, and auth events throughout the app.
// Missing deployment configuration must not take down the public landing pages.
export const supabase = authConfigurationError ? null : createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})
