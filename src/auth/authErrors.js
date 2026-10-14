export function authErrorMessage(error) {
  if (error?.code === 'weak_password') return 'Please choose a stronger password that meets the account requirements.'
  if (error?.code === 'same_password') return 'Choose a password different from your current password.'
  if (error?.code === 'user_already_exists') return 'An account already exists for this email. Please sign in or reset your password.'
  if (error?.code === 'email_address_invalid') return 'Please enter a valid email address.'
  if (error?.code === 'signup_disabled') return 'New accounts are not available right now. Please try again later.'
  if (error?.code === 'invalid_credentials' || error?.message === 'Invalid login credentials') return 'The email or password is incorrect. Please try again.'
  if (error?.code === 'email_not_confirmed') return 'Please confirm your email before signing in.'
  if (error?.status === 429) return 'Too many attempts. Please wait a moment before trying again.'
  if (error?.status >= 500 || error?.name === 'AuthRetryableFetchError' || error instanceof TypeError) {
    return 'We could not reach the sign-in service. Check your connection and try again.'
  }
  if (error?.code === 'provider_disabled') return 'Google sign-in is not enabled yet. Please continue with email.'
  return 'We could not complete this request. Please try again.'
}

export function isInvalidSession(error) {
  return [400, 401, 403].includes(error?.status)
    || ['AuthSessionMissingError', 'AuthInvalidTokenResponseError'].includes(error?.name)
}
