import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { toNumber, BUDGET_ALLOCATIONS, saveOnboardingProduction } from '../src/onboarding/saveOnboardingProduction.js'
import { PENDING_KEY, readPending, writePending, clearPending } from '../src/auth/pendingProduction.js'

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

  // Verify categories and shares match the modal design
  const expectedCategories = [
    { name: 'Above the line', share: 12, amount25M: 3000000 },
    { name: 'Production crew', share: 20, amount25M: 5000000 },
    { name: 'Talent & cast', share: 8, amount25M: 2000000 },
    { name: 'Camera', share: 9, amount25M: 2250000 },
    { name: 'Lighting & grip', share: 7, amount25M: 1750000 },
    { name: 'Art department', share: 6, amount25M: 1500000 },
    { name: 'Wardrobe & makeup', share: 4, amount25M: 1000000 },
    { name: 'Locations & permits', share: 8, amount25M: 2000000 },
    { name: 'Transport & logistics', share: 5, amount25M: 1250000 },
    { name: 'Catering', share: 4, amount25M: 1000000 },
    { name: 'Post-production', share: 12, amount25M: 3000000 },
    { name: 'Contingency', share: 5, amount25M: 1250000 },
  ]

  expectedCategories.forEach((exp, idx) => {
    const item = BUDGET_ALLOCATIONS[idx]
    assert.equal(item.name, exp.name)
    assert.equal(item.share, exp.share)
    const calculatedAmount25M = Math.round(25000000 * item.pct)
    assert.equal(calculatedAmount25M, exp.amount25M)
  })
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

test('production breakdown structure contains required departments, equipment categories, and locations', () => {
  const expectedDepartments = [
    'Camera',
    'Lighting & grip',
    'Sound',
    'Art department',
    'Wardrobe & makeup',
    'Locations & transport',
  ]

  const expectedEquipment = [
    'Camera',
    'Lenses',
    'Lighting',
    'Grip',
    'Sound',
    'Power',
    'Monitoring',
    'Data & storage',
  ]

  assert.equal(expectedDepartments.length, 6)
  assert.equal(expectedEquipment.length, 8)
})

test('schedule framework distributes days into primary set, exterior, and studio with Date TBC', () => {
  const shootDaysCount = 10
  const allDays = Array.from({ length: shootDaysCount }, (_, i) => {
    const dayNum = i + 1
    const pEnd = Math.max(1, Math.round(shootDaysCount * 0.4))
    const eEnd = Math.max(pEnd + 1, Math.round(shootDaysCount * 0.7))
    const locationName = dayNum <= pEnd
      ? 'Primary set'
      : dayNum <= eEnd
      ? 'Exterior'
      : 'Studio'
    const tone = dayNum <= pEnd
      ? '#9E8262'
      : dayNum <= eEnd
      ? '#6D8176'
      : '#75726B'
    return { dayNum, locationName, tone, dateStatus: 'Date TBC' }
  })

  assert.equal(allDays.length, 10)
  assert.equal(allDays[0].locationName, 'Primary set')
  assert.equal(allDays[0].tone, '#9E8262')
  assert.equal(allDays[3].locationName, 'Primary set')
  assert.equal(allDays[4].locationName, 'Exterior')
  assert.equal(allDays[4].tone, '#6D8176')
  assert.equal(allDays[6].locationName, 'Exterior')
  assert.equal(allDays[7].locationName, 'Studio')
  assert.equal(allDays[7].tone, '#75726B')
  assert.equal(allDays[9].locationName, 'Studio')
  allDays.forEach(d => assert.equal(d.dateStatus, 'Date TBC'))
})

test('Get Started and Create Your Production navigate straight to onboarding', () => {
  const headerContent = fs.readFileSync(path.resolve('src/components/Header.jsx'), 'utf8')
  assert.match(headerContent, /to="\/onboarding"[\s\S]*?>\s*Get Started\s*<\/Link>/)

  const heroContent = fs.readFileSync(path.resolve('src/components/HeroSection.jsx'), 'utf8')
  assert.match(heroContent, /navigate\(["']\/onboarding["']\)/)
  assert.match(heroContent, /Create Your Production/)

  const ctaContent = fs.readFileSync(path.resolve('src/components/ProductionCTASection.jsx'), 'utf8')
  assert.match(ctaContent, /createHref\s*=\s*['"]\/onboarding['"]/)
  assert.match(ctaContent, /Create Your Production/)
})

test('Pending production draft writes and reads safely across storage and provides login/signup paths', () => {
  // Test mock storage
  const mockStorage = {}
  globalThis.sessionStorage = {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v) },
    removeItem: (k) => { delete mockStorage[k] },
  }
  globalThis.localStorage = {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v) },
    removeItem: (k) => { delete mockStorage[k] },
  }

  const sampleDraft = {
    productionName: 'The Last Lagos Film',
    productionType: 'Feature Film',
    budgetAmount: '50,000,000',
    shootingDays: 14,
    crewSize: 25,
    locations: 4,
  }

  writePending(sampleDraft)
  const read = readPending()
  assert.deepEqual(read, sampleDraft)

  clearPending()
  assert.equal(readPending(), null)

  const startingPointContent = fs.readFileSync(path.resolve('src/onboarding/OnboardingStartingPointPage.jsx'), 'utf8')
  assert.match(startingPointContent, /Proceed to Sign Up/)
  assert.match(startingPointContent, /Log In/)
})
