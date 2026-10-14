import test from 'node:test'
import assert from 'node:assert/strict'
import { isCompleteOnboarding, onboardingKey, readOnboarding, saveOnboarding } from '../src/onboarding/storage.js'

const valid = { role: 'line_producer', market: 'NGN', completedAt: 1700000000000 }
test('historical completion requires a known role, known market, and completion timestamp', () => {
  assert.equal(isCompleteOnboarding(valid), true)
  for (const record of [null, true, [], {}, { role: 'producer', market: 'NGN' }, { ...valid, role: 'unknown' }, { ...valid, market: 'USD' }, { ...valid, completedAt: '1700000000000' }, { ...valid, completedAt: 0 }, { ...valid, completedAt: Infinity }]) assert.equal(isCompleteOnboarding(record), false)
})
test('storage reads only the current user key and safely rejects malformed JSON', () => {
  const reads = []
  assert.equal(readOnboarding('current', { getItem(key) { reads.push(key); return '{broken' } }), null)
  assert.deepEqual(reads, [onboardingKey('current')])
  assert.deepEqual(readOnboarding('current', { getItem: () => JSON.stringify(valid) }), valid)
  assert.equal(readOnboarding('current', { getItem() { throw new Error('Blocked') } }), null)
})
test('completion writes historical shape to only the current user, and storage failures propagate', () => {
  const writes = []
  const saved = saveOnboarding('current', valid, { setItem: (...args) => writes.push(args) })
  assert.equal(writes.length, 1)
  assert.equal(writes[0][0], onboardingKey('current'))
  assert.deepEqual(Object.keys(saved).sort(), ['completedAt', 'market', 'role'])
  assert.ok(saved.completedAt > 0)
  assert.throws(() => saveOnboarding('current', valid, { setItem() { throw new Error('Quota exceeded') } }), /Quota/)
})
