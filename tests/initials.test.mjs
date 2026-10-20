import assert from 'node:assert/strict'
import { test } from 'node:test'
import { displayName, userInitials } from '../src/lib/initials.js'

test('account initials use the first two name parts, including whitespace and Unicode names', () => {
  for (const [name, expected] of [
    ['Okafor Ozioma Solomon', 'OO'],
    ['  Ada   Lovelace Byron  ', 'AL'],
    ['Chimobi', 'C'],
    ['Élodie 李', 'É李'],
  ]) assert.equal(userInitials({ user_metadata: { full_name: name } }), expected)
})

test('account initials handle supported metadata and missing names without exposing email as a name', () => {
  const user = { user_metadata: { given_name: 'Ada', family_name: 'Okafor' } }
  assert.equal(displayName(user), 'Ada Okafor')
  assert.equal(userInitials(user), 'AO')
  assert.equal(userInitials({ user_metadata: { name: 'Ozioma Solomon' } }), 'OS')
  assert.equal(userInitials({ user_metadata: { full_name: '  ' }, email: 'producer@example.test' }), 'P')
  assert.equal(displayName({ email: 'producer@example.test' }), '')
  assert.equal(userInitials({}), '')
  assert.equal(userInitials(null), '')
})
