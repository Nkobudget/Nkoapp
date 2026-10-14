import { ROLES, MARKETS } from './options.js'

export const onboardingKey = userId => `nko_onboarding_${userId}`

export function isCompleteOnboarding(record) {
  return !!record && typeof record === 'object' && !Array.isArray(record)
    && ROLES.some(role => role.id === record.role)
    && MARKETS.some(market => market.code === record.market)
    && Number.isSafeInteger(record.completedAt) && record.completedAt > 0
}

export function readOnboarding(userId, storage) {
  if (!userId) return null
  try {
    const value = JSON.parse((storage ?? window.localStorage).getItem(onboardingKey(userId)) || 'null')
    return isCompleteOnboarding(value) ? value : null
  } catch { return null }
}

export function saveOnboarding(userId, choices, storage = window.localStorage) {
  const record = { role: choices.role, market: choices.market, completedAt: Date.now() }
  if (!userId || !isCompleteOnboarding(record)) throw new Error('Choose a valid role and currency before continuing.')
  storage.setItem(onboardingKey(userId), JSON.stringify(record))
  return record
}
