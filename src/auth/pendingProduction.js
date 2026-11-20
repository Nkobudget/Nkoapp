// The onboarding draft is parked here while the user signs in or creates an account.
// Stored in both sessionStorage and localStorage so it survives tab reloads and OAuth redirects.
export const PENDING_KEY = 'nko_pending_production';

export function readPending() {
  try {
    const raw = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(PENDING_KEY) : null)
      || (typeof localStorage !== 'undefined' ? localStorage.getItem(PENDING_KEY) : null);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writePending(data) {
  if (!data) return;
  try {
    const raw = JSON.stringify(data);
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(PENDING_KEY, raw);
    if (typeof localStorage !== 'undefined') localStorage.setItem(PENDING_KEY, raw);
  } catch {}
}

export function clearPending() {
  try { if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(PENDING_KEY); } catch {}
  try { if (typeof localStorage !== 'undefined') localStorage.removeItem(PENDING_KEY); } catch {}
}
