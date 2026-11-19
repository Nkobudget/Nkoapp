import test from 'node:test'
import assert from 'node:assert/strict'
import { toNumber, BUDGET_ALLOCATIONS, saveOnboardingProduction } from '../src/onboarding/saveOnboardingProduction.js'

test('toNumber cleanly parses string, formatted currency, and shorthand notation', () => {
  assert.equal(toNumber('30,000,000'), 30000000)
  assert.equal(toNumber('30000000'), 30000000)
  assert.equal(toNumber(30000000), 30000000)
  assert.equal(toNumber('NGN 30,000,000'), 30000000)
  assert.equal(toNumber('30M'), 30000000)
  assert.equal(toNumber('500k'), 500000)
  assert.equal(toNumber(''), null)
  assert.equal(toNumber(null), null)
  assert.equal(toNumber(undefined), null)
  assert.equal(toNumber(0), null)
})

test('BUDGET_ALLOCATIONS percentages sum to exactly 100%', () => {
  const sum = BUDGET_ALLOCATIONS.reduce((acc, a) => acc + a.pct, 0)
  assert.equal(Math.round(sum * 100), 100)
  assert.equal(BUDGET_ALLOCATIONS.length, 12)
})

test('saveOnboardingProduction inserts project, budget items, schedule days, scenes and user metadata', async () => {
  const inserted = {
    projects: [],
    budget_items: [],
    schedule_days: [],
    scenes: [],
  }

  let updatedUserMeta = null

  const mockSupabase = {
    from(table) {
      return {
        insert(payload) {
          inserted[table] = payload
          return {
            select() {
              return {
                single() {
                  return {
                    data: Array.isArray(payload) ? payload[0] : { id: 'mock-proj-123', ...payload },
                    error: null,
                  }
                },
                data: Array.isArray(payload) ? payload : [{ id: 'mock-proj-123', ...payload }],
                error: null,
              }
            },
            data: Array.isArray(payload) ? payload : [{ id: 'mock-proj-123', ...payload }],
            error: null,
          }
        }
      }
    },
    auth: {
      async updateUser({ data }) {
        updatedUserMeta = data
        return { data: { user: { id: 'user-123', user_metadata: data } }, error: null }
      }
    }
  }

  const mockUser = { id: 'user-123', email: 'producer@test.com' }

  const profile = {
    productionName: 'Last Laugh',
    productionType: 'Feature Film',
    productionStatus: 'Post production',
    shootingLocation: 'Abuja, Nigeria',
    shootingDays: 10,
    crewSize: 19,
    locations: 3,
    budgetAmount: '30,000,000',
    currency: 'NGN',
    roleId: 'executive_producer',
    roleLabel: 'Executive Producer',
    roleCode: 'EP',
    country: 'Nigeria',
    stateRegion: 'Abuja (FCT)',
  }

  // Setup localStorage mock in Node environment if missing
  if (typeof globalThis.localStorage === 'undefined') {
    const store = {}
    globalThis.localStorage = {
      getItem(k) { return store[k] ?? null },
      setItem(k, v) { store[k] = String(v) },
      removeItem(k) { delete store[k] },
      clear() { Object.keys(store).forEach(k => delete store[k]) }
    }
  }

  const result = await saveOnboardingProduction(mockSupabase, mockUser, profile)
  assert.ok(result)
  assert.equal(result.name, 'Last Laugh')
  assert.equal(result.type, 'Feature Film')
  assert.equal(result.target_budget, 30000000)
  assert.equal(result.base_currency, 'NGN')

  // Verify 12 budget items covering the departments
  assert.equal(inserted.budget_items.length, 12)
  const totalBudgetFromItems = inserted.budget_items.reduce((s, i) => s + i.rate, 0)
  assert.equal(totalBudgetFromItems, 30000000)

  // Verify schedule days
  assert.equal(inserted.schedule_days.length, 10)
  assert.equal(inserted.schedule_days[0].position, 0)
  assert.equal(inserted.schedule_days[9].position, 9)

  // Verify starter scenes
  assert.equal(inserted.scenes.length, 3)

  // Verify user metadata updated
  assert.ok(updatedUserMeta)
  assert.equal(updatedUserMeta.role, 'Executive Producer')
  assert.equal(updatedUserMeta.role_code, 'EP')
  assert.equal(updatedUserMeta.country, 'Nigeria')
  assert.equal(updatedUserMeta.onboarding_completed, true)
})
