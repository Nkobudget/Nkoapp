import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { mkdir, readFile } from 'node:fs/promises'
import { createServer as createHTTPServer } from 'node:http'
import path from 'node:path'
import { chromium } from 'playwright'
import { build, createServer } from 'vite'

// All service calls are intercepted. This suite never accesses real accounts,
// production rows, paid AI services, or email delivery.
process.env.VITE_SUPABASE_URL = 'https://nko-test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-public-key'
const user = { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', role: 'authenticated', email: 'producer@example.test', app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' }
function session(expired = false, identity = user) {
  const expires = Math.floor(Date.now() / 1000) + (expired ? -120 : 3600)
  const jwt = [ { alg: 'HS256', typ: 'JWT' }, { sub: identity.id, aud: 'authenticated', role: 'authenticated', exp: expires } ].map(value => Buffer.from(JSON.stringify(value)).toString('base64url')).join('.') + '.test-signature'
  return { access_token: jwt, refresh_token: 'mock-refresh-token', expires_in: 3600, expires_at: expires, token_type: 'bearer', user: identity }
}
const project = { id: '22222222-2222-4222-8222-222222222222', user_id: user.id, name: 'Recovery test production', type: 'Feature Film', base_currency: 'NGN', created_at: '2026-01-01T00:00:00Z' }
let vite, baseURL
const browsers = new Set()

before(async () => {
  if (process.env.NKO_TEST_PRODUCTION) {
    await build({ build: { outDir: 'dist-test' }, logLevel: 'error' })
    const config = JSON.parse(await readFile('vercel.json', 'utf8'))
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' }
    const server = createHTTPServer(async (request, response) => {
      const pathname = new URL(request.url, 'http://localhost').pathname
      const rewrite = config.rewrites.find(rule => rule.source === pathname || (rule.source === '/app/(.*)' && pathname.startsWith('/app/')))
      const destination = rewrite?.destination || (pathname === '/' ? '/index.html' : pathname)
      const filename = path.resolve('dist-test', `.${destination}`)
      if (!filename.startsWith(path.resolve('dist-test') + path.sep)) return response.writeHead(400).end()
      try { response.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream'); response.end(await readFile(filename)) }
      catch { response.writeHead(404).end() }
    })
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
    vite = { close: () => new Promise(resolve => server.close(resolve)) }
    baseURL = `http://127.0.0.1:${server.address().port}/`
    return
  }
  vite = await createServer({ server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' })
  await vite.listen()
  baseURL = vite.resolvedUrls.local[0]
})
after(async () => { for (const browser of browsers) await browser.close(); await vite?.close() })

async function setup(options = {}) {
  if (process.env.NKO_SCREENSHOTS) await mkdir(process.env.NKO_SCREENSHOTS, { recursive: true })
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.NKO_BROWSER_EXECUTABLE || undefined,
    args: process.env.NKO_BROWSER_ARGS ? JSON.parse(process.env.NKO_BROWSER_ARGS) : [],
  })
  browsers.add(browser)
  const context = await browser.newContext({ viewport: options.mobile ? { width: 375, height: 812 } : { width: 1440, height: 1000 }, hasTouch: !!options.mobile, reducedMotion: 'reduce' })
  const state = { user, completed: true, signupCalls: 0, resetCalls: 0, updateCalls: 0, confirmation: false, passwordMode: 'valid', identityMode: 'valid', refreshMode: 'valid', tableError: '', seeded: false, tokenCalls: 0, refreshCalls: 0, identityCalls: 0, tableCalls: 0, ...options }
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url())
    if (url.hostname === '127.0.0.1') {
      if (url.pathname.startsWith('/api/')) throw new Error('Unexpected real API call in test')
      return route.continue()
    }
    if (url.hostname !== 'nko-test.supabase.co') return route.abort()
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'x-supabase-api-version': '2024-01-01' }, body: JSON.stringify(body) })
    if (url.pathname === '/auth/v1/token') {
      if (url.searchParams.get('grant_type') === 'refresh_token') {
        state.refreshCalls++
        return state.refreshMode === 'invalid' ? json({ code: 'refresh_token_not_found', msg: 'Invalid Refresh Token' }, 400) : json(session(false, state.user))
      }
      state.tokenCalls++
      if (state.passwordMode === 'invalid') return json({ code: 'invalid_credentials', msg: 'Invalid login credentials' }, 400)
      if (state.passwordMode === 'network') return route.abort('internetdisconnected')
      if (state.passwordMode === 'rate-limit') return json({ code: 'over_request_rate_limit', msg: 'Too many attempts' }, 429)
      if (state.passwordMode === 'slow') await new Promise(resolve => setTimeout(resolve, 350))
      const body = request.postDataJSON()
      assert.equal(body.email, state.user.email)
      assert.equal(body.password, 'test-password')
      return json(session(false, state.user))
    }
    if (url.pathname === '/auth/v1/signup') {
      state.signupCalls++
      if (state.signupError) return json({ code: 'weak_password', msg: 'Password too weak' }, 422)
      return state.confirmation ? json({ user: state.user }) : json(session(false, state.user))
    }
    if (url.pathname === '/auth/v1/recover') {
      state.resetCalls++
      assert.equal(url.searchParams.get('redirect_to'), `${baseURL}app`)
      return json({})
    }
    if (url.pathname === '/auth/v1/user' && request.method() === 'PUT') {
      state.updateCalls++
      if (state.updateError) return json({ code: 'same_password', msg: 'Same password' }, 422)
      return json({ user: state.user })
    }
    if (url.pathname === '/auth/v1/user') {
      state.identityCalls++
      if (state.identityDelay) await new Promise(resolve => setTimeout(resolve, state.identityDelay))
      if (state.identityMode === 'invalid') return json({ code: 'bad_jwt', msg: 'Invalid JWT' }, 401)
      if (state.identityMode === 'network') return route.abort('internetdisconnected')
      return json(state.user)
    }
    if (url.pathname === '/auth/v1/logout') {
      state.logoutCalls = (state.logoutCalls || 0) + 1
      return state.logoutError ? json({ msg: 'Temporary logout failure' }, 500) : route.fulfill({ status: 204 })
    }
    if (url.pathname.startsWith('/rest/v1/')) {
      state.tableCalls++
      assert.match(request.headers().authorization, /^Bearer /)
      assert.equal(request.method(), 'GET', 'Only read-only dashboard checks are expected')
      const table = url.pathname.split('/').at(-1)
      if (table === state.tableError) return json({ code: '42501', message: 'Permission denied' }, 403)
      if (table === 'projects') return json(state.seeded ? [project] : [])
      return json([])
    }
    throw new Error(`Unexpected service request: ${url.pathname}`)
  })
  await context.addInitScript(({ storedSession, completed, record, identity, blockStorage }) => {
    if (!sessionStorage.getItem('seeded')) {
      if (storedSession) localStorage.setItem('sb-nko-test-auth-token', JSON.stringify(storedSession))
      if (completed) localStorage.setItem(`nko_onboarding_${identity.id}`, JSON.stringify(record ?? { role: 'producer', market: 'NGN', completedAt: 1700000000000 }))
      sessionStorage.setItem('seeded', 'true')
    }
    if (blockStorage) {
      window.__blockOnboardingStorage = true
      const setItem = Storage.prototype.setItem
      Storage.prototype.setItem = function(key, value) {
        if (key.startsWith('nko_onboarding_') && window.__blockOnboardingStorage) throw new DOMException('Blocked', 'SecurityError')
        return setItem.call(this, key, value)
      }
    }
  }, { storedSession: options.storedSession, completed: state.completed, record: options.record, identity: state.user, blockStorage: options.blockStorage })
  return { context, page, state, errors, close: async () => { assert.deepEqual(errors, []); await browser.close(); browsers.delete(browser) } }
}

async function openEmail(page, identity = user) {
  await page.goto(`${baseURL}sign-in`)
  await page.getByRole('button', { name: 'Continue with Email', exact: true }).click()
  await page.getByLabel('Email', { exact: true }).fill(identity.email)
  await page.getByLabel('Password', { exact: true }).fill('test-password')
  if (process.env.NKO_SCREENSHOTS && page.viewportSize().width > 600) await page.screenshot({ path: `${process.env.NKO_SCREENSHOTS}/auth-desktop.png`, fullPage: true })
}
async function dashboard(page) {
  await page.waitForURL('**/app')
  await page.getByLabel('Select production', { exact: true }).waitFor()
}

test('public navigation, browser history, direct routes, and anonymous dashboard guard', async () => {
  const t = await setup()
  await t.page.goto(baseURL)
  await t.page.locator('header').first().getByRole('link', { name: 'Get Started', exact: true }).click()
  await t.page.waitForURL('**/onboarding')
  await t.page.getByRole('button', { name: 'Set Up My Production', exact: true }).click()
  await t.page.waitForURL('**/sign-in')
  await t.page.goBack(); await t.page.waitForURL('**/onboarding')
  await t.page.goForward(); await t.page.waitForURL('**/sign-in')
  await t.page.reload()
  assert.equal(await t.page.getByRole('button', { name: 'Continue with Google', exact: true }).isDisabled(), true)
  await t.page.goto(`${baseURL}dashboard`)
  await t.page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  assert.equal(t.state.tableCalls, 0, 'Anonymous users must not fetch dashboard rows')
  for (const route of ['sign-in', 'onboarding']) {
    await t.page.goto(`${baseURL}${route}`); await t.page.reload()
    await t.page.locator('h1').waitFor()
  }
  await t.close()
})

test('invalid credentials, network errors, and rate limits remain on sign-in', async () => {
  const t = await setup({ passwordMode: 'invalid' })
  await openEmail(t.page)
  await t.page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await t.page.getByRole('alert').filter({ hasText: 'email or password is incorrect' }).waitFor()
  for (const [mode, text] of [['network', 'Check your connection'], ['rate-limit', 'Too many attempts']]) {
    t.state.passwordMode = mode
    await t.page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await t.page.getByRole('alert').filter({ hasText: text }).waitFor()
  }
  assert.equal(t.state.tableCalls, 0)
  assert.equal(new URL(t.page.url()).pathname, '/app')
  await t.close()
})

test('successful login, loading state, refresh, restored dashboard sections, and sign-out', async () => {
  const t = await setup({ passwordMode: 'slow', seeded: true })
  await openEmail(t.page)
  await t.page.getByRole('button', { name: 'Sign in', exact: true }).click()
  assert.equal(await t.page.getByRole('button', { name: 'Please wait…', exact: true }).isDisabled(), true)
  await dashboard(t.page)
  assert.equal(t.state.tokenCalls, 1)
  assert.ok(t.state.identityCalls > 0)
  await t.page.reload(); await dashboard(t.page)
  assert.equal(t.state.tokenCalls, 1, 'Refresh must restore the persisted session without another password login')
  await t.page.getByLabel('Select production', { exact: true }).selectOption(project.id)
  for (const label of ['Budgets', 'Revenue', 'Breakdown', 'Schedule', 'Recon', 'Payments', 'Purchase Orders', 'Marketplace', 'AI Builder', 'Dashboard']) {
    await t.page.locator('nav').getByRole('button', { name: new RegExp(label) }).click()
    await t.page.locator('.nko-dashboard').waitFor()
    assert.equal(await t.page.getByText('The workspace could not load.').count(), 0)
  }
  const images = await t.page.locator('img[src="/assets/logo.png"]').evaluateAll(nodes => nodes.map(img => ({ loaded: img.complete && img.naturalWidth > 0, ratio: img.width / img.height, naturalRatio: img.naturalWidth / img.naturalHeight })))
  assert.ok(images.length > 0)
  assert.ok(images.every(img => img.loaded && Math.abs(img.ratio - img.naturalRatio) < 0.05))
  await t.page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await t.page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  await t.page.goto(`${baseURL}dashboard`); await t.page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  assert.equal(await t.page.evaluate(() => localStorage.getItem('sb-nko-test-auth-token')), null)
  await t.close()
})

test('expired sessions refresh; revoked or forged sessions cannot access data', async () => {
  for (const options of [
    { storedSession: session(true) },
    { storedSession: session(true), refreshMode: 'invalid', rejected: true },
    { storedSession: session(), identityMode: 'invalid', rejected: true },
  ]) {
    const t = await setup(options)
    await t.page.goto(`${baseURL}dashboard`)
    if (options.rejected) {
      await t.page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
      assert.equal(t.state.tableCalls, 0)
    } else {
      await dashboard(t.page)
      assert.ok(t.state.refreshCalls >= 1)
    }
    await t.close()
  }
})

test('session verification outages fail closed and can be retried', async () => {
  const t = await setup({ storedSession: session(), identityMode: 'network' })
  await t.page.goto(`${baseURL}dashboard`)
  await t.page.getByRole('alert').filter({ hasText: 'Check your connection' }).waitFor()
  assert.equal(t.state.tableCalls, 0)
  t.state.identityMode = 'valid'
  await t.page.getByRole('button', { name: 'Try again', exact: true }).click()
  await dashboard(t.page)
  await t.close()
})

test('database errors are visible, retry works, and mobile dashboard allows logout', async () => {
  const t = await setup({ storedSession: session(), tableError: 'projects', mobile: true })
  await t.page.goto(`${baseURL}dashboard`)
  await t.page.getByRole('alert').filter({ hasText: 'Could not load projects' }).waitFor()
  t.state.tableError = ''
  await t.page.getByRole('button', { name: 'Retry loading', exact: true }).click()
  await dashboard(t.page)
  assert.ok(await t.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
  if (process.env.NKO_SCREENSHOTS) {
    await mkdir(process.env.NKO_SCREENSHOTS, { recursive: true })
    await t.page.screenshot({ path: `${process.env.NKO_SCREENSHOTS}/dashboard-mobile.png`, fullPage: true })
  }
  await t.page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await t.page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  await t.close()
})

test('Vercel has explicit SPA rewrites without swallowing existing API routes', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
  for (const route of ['/sign-in', '/onboarding', '/dashboard', '/app']) assert.ok(config.rewrites.some(rule => rule.source === route && rule.destination === '/index.html'))
  assert.ok(config.rewrites.every(rule => !rule.source.startsWith('/api') && rule.source !== '/(.*)'))
  assert.equal(config.functions['api/claude.js'].maxDuration, 300)
})

async function chooseOnboarding(page, role = 'Producer', market = 'Ghana') {
  await page.getByRole('heading', { name: 'Welcome to NKO.', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Get started', exact: true }).click()
  if (process.env.NKO_SCREENSHOTS && page.viewportSize().width > 600) await page.screenshot({ path: `${process.env.NKO_SCREENSHOTS}/role-desktop.png`, fullPage: true })
  assert.equal(await page.getByRole('button', { name: 'Continue', exact: true }).isDisabled(), true)
  await page.getByRole('radio', { name: new RegExp(`^${role} `) }).focus()
  await page.keyboard.press('Space')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  assert.equal(await page.getByRole('button', { name: 'Finish', exact: true }).isDisabled(), true)
  await page.getByRole('radio', { name: new RegExp(`^${market} `) }).focus()
  await page.keyboard.press('Space')
}

test('signup requires Terms; auto-confirm and email-confirmation settings both work', async () => {
  for (const confirmation of [false, true]) {
    const t = await setup({ completed: false, confirmation })
    await openEmail(t.page)
    await t.page.getByRole('button', { name: 'No account? Sign up', exact: true }).click()
    await t.page.getByRole('button', { name: 'Create account', exact: true }).click()
    assert.equal(t.state.signupCalls, 0)
    await t.page.getByRole('button', { name: 'Terms & Conditions', exact: true }).click()
    await t.page.getByRole('dialog').waitFor()
    await t.page.keyboard.press('Escape')
    await t.page.getByRole('dialog').waitFor({ state: 'hidden' })
    await t.page.getByRole('checkbox').check()
    t.state.signupError = true
    await t.page.getByRole('button', { name: 'Create account', exact: true }).click()
    await t.page.getByRole('alert').filter({ hasText: 'stronger password' }).waitFor()
    t.state.signupError = false
    await t.page.getByRole('button', { name: 'Create account', exact: true }).click()
    if (confirmation) {
      await t.page.getByRole('status').filter({ hasText: 'Check your email' }).waitFor()
      assert.equal(await t.page.getByRole('heading', { name: 'Welcome to NKO.' }).count(), 0)
    } else {
      await t.page.getByRole('heading', { name: 'Welcome to NKO.' }).waitFor()
    }
    assert.equal(t.state.tableCalls, 0)
    await t.close()
  }
})

test('three steps, invalid records, storage failures, completion and returning-user refresh', async () => {
  const t = await setup({ storedSession: session(), record: {}, blockStorage: true })
  await t.page.goto(`${baseURL}app`)
  await chooseOnboarding(t.page)
  await t.page.getByRole('button', { name: 'Back', exact: true }).click()
  assert.equal(await t.page.getByRole('radio', { name: /^Producer / }).isChecked(), true)
  await t.page.getByRole('button', { name: 'Continue', exact: true }).click()
  assert.equal(await t.page.getByRole('radio', { name: /^Ghana / }).isChecked(), true)
  await t.page.getByRole('button', { name: 'Finish', exact: true }).click()
  await t.page.getByRole('alert').filter({ hasText: 'could not be saved' }).waitFor()
  assert.equal(t.state.tableCalls, 0)
  await t.page.evaluate(() => { window.__blockOnboardingStorage = false })
  await t.page.getByRole('button', { name: 'Finish', exact: true }).click()
  await dashboard(t.page)
  const record = await t.page.evaluate(id => JSON.parse(localStorage.getItem(`nko_onboarding_${id}`)), user.id)
  assert.deepEqual({ role: record.role, market: record.market }, { role: 'producer', market: 'GHS' })
  assert.ok(Number.isSafeInteger(record.completedAt))
  await t.page.reload(); await dashboard(t.page)
  await t.close()
})

test('switching accounts never inherits onboarding from the previous user', async () => {
  const t = await setup({ storedSession: session() })
  await t.page.goto(`${baseURL}app`); await dashboard(t.page)
  await t.page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await t.page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  t.state.user = { ...user, id: '33333333-3333-4333-8333-333333333333', email: 'another@example.test' }
  await t.page.getByLabel('Email', { exact: true }).fill(t.state.user.email)
  await t.page.getByLabel('Password', { exact: true }).fill('test-password')
  await t.page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await t.page.getByRole('heading', { name: 'Welcome to NKO.' }).waitFor()
  await t.page.reload()
  await chooseOnboarding(t.page, 'Production Manager', 'Kenya')
  await t.page.getByRole('button', { name: 'Finish', exact: true }).click(); await dashboard(t.page)
  const records = await t.page.evaluate(ids => ids.map(id => JSON.parse(localStorage.getItem(`nko_onboarding_${id}`))), [user.id, t.state.user.id])
  assert.equal(records[0].market, 'NGN')
  assert.equal(records[1].market, 'KES')
  await t.close()
})

test('password recovery precedes onboarding, survives refresh, validates passwords and handles failures', async () => {
  const t = await setup({ completed: false })
  await openEmail(t.page)
  await t.page.getByRole('button', { name: 'Forgot password?', exact: true }).click()
  await t.page.getByRole('status').filter({ hasText: 'password-reset link' }).waitFor()
  assert.equal(t.state.resetCalls, 1)
  const value = session()
  const hash = new URLSearchParams({ access_token: value.access_token, refresh_token: value.refresh_token, expires_in: '3600', token_type: 'bearer', type: 'recovery' })
  await t.page.goto(baseURL) // Model opening the emailed link from a different page.
  await t.page.goto(`${baseURL}app#${hash}`)
  await t.page.getByRole('heading', { name: 'Set a new password', exact: true }).waitFor()
  assert.equal(t.state.tableCalls, 0)
  await t.page.reload()
  await t.page.getByRole('heading', { name: 'Set a new password', exact: true }).waitFor()
  await t.page.getByLabel('New password', { exact: true }).fill('new-password')
  await t.page.getByLabel('Confirm new password', { exact: true }).fill('different-password')
  await t.page.getByRole('button', { name: 'Set new password', exact: true }).click()
  await t.page.getByRole('alert').filter({ hasText: 'do not match' }).waitFor()
  assert.equal(t.state.updateCalls, 0)
  await t.page.getByLabel('Confirm new password', { exact: true }).fill('new-password')
  t.state.updateError = true
  await t.page.getByRole('button', { name: 'Set new password', exact: true }).click()
  await t.page.getByRole('alert').filter({ hasText: 'different from your current password' }).waitFor()
  t.state.updateError = false
  await t.page.getByRole('button', { name: 'Set new password', exact: true }).click()
  await t.page.getByRole('heading', { name: 'Welcome to NKO.' }).waitFor()
  assert.equal(await t.page.evaluate(() => sessionStorage.getItem('nko_password_recovery')), null)
  await t.close()
})

test('expired recovery links show an explanation instead of a reset form', async () => {
  const t = await setup({ completed: false })
  await t.page.goto(`${baseURL}app#error=access_denied&error_code=otp_expired&error_description=Expired`)
  await t.page.getByRole('status').filter({ hasText: 'invalid or has expired' }).waitFor()
  await t.page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  assert.equal(t.state.tableCalls, 0)
  await t.close()
})

test('language persists across auth and onboarding; mobile role and currency screens fit', async () => {
  const t = await setup({ completed: false, mobile: true })
  await openEmail(t.page)
  await t.page.getByRole('button', { name: 'Français', exact: true }).click()
  await t.page.getByRole('heading', { name: 'Se connecter', exact: true }).waitFor()
  await t.page.reload()
  await t.page.getByRole('heading', { name: 'Se connecter', exact: true }).waitFor()
  await t.page.getByRole('button', { name: 'English', exact: true }).click()
  await t.page.getByLabel('Email', { exact: true }).fill(user.email)
  await t.page.getByLabel('Password', { exact: true }).fill('test-password')
  if (process.env.NKO_SCREENSHOTS) await t.page.screenshot({ path: `${process.env.NKO_SCREENSHOTS}/auth-mobile.png`, fullPage: true })
  await t.page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await chooseOnboarding(t.page)
  assert.ok(await t.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
  if (process.env.NKO_SCREENSHOTS) await t.page.screenshot({ path: `${process.env.NKO_SCREENSHOTS}/currency-mobile.png`, fullPage: true })
  await t.close()
})

test('initialization shows loading without a flash of login, onboarding, or private data', async () => {
  const t = await setup({ storedSession: session(), identityDelay: 600 })
  await t.page.goto(`${baseURL}app`)
  await t.page.getByRole('status').filter({ hasText: 'Loading your workspace' }).waitFor()
  assert.equal(await t.page.getByRole('heading', { name: 'Sign in', exact: true }).count(), 0)
  assert.equal(await t.page.getByRole('heading', { name: 'Welcome to NKO.' }).count(), 0)
  assert.equal(t.state.tableCalls, 0)
  await dashboard(t.page)
  await t.close()
})

test('historical root confirmation/recovery callbacks reach the correct gate branch', async () => {
  for (const type of ['signup', 'recovery']) {
    const t = await setup({ completed: type === 'recovery' })
    const value = session()
    const hash = new URLSearchParams({ access_token: value.access_token, refresh_token: value.refresh_token, expires_in: '3600', token_type: 'bearer', type })
    await t.page.goto(`${baseURL}#${hash}`)
    await t.page.waitForURL('**/app')
    if (type === 'signup') await t.page.getByRole('heading', { name: 'Welcome to NKO.' }).waitFor()
    else {
      await t.page.getByRole('heading', { name: 'Set a new password', exact: true }).waitFor()
      assert.equal(t.state.tableCalls, 0)
      await t.page.getByLabel('New password', { exact: true }).fill('new-password')
      await t.page.getByLabel('Confirm new password', { exact: true }).fill('new-password')
      await t.page.getByRole('button', { name: 'Set new password', exact: true }).click()
      await dashboard(t.page)
    }
    await t.close()
  }
})

test('landing Login goes directly to the guarded app, and Google keeps its existing behavior', async () => {
  const t = await setup()
  await t.page.goto(baseURL)
  const login = t.page.locator('header').first().getByRole('link', { name: 'Login', exact: true })
  await login.waitFor()
  assert.equal(await login.getAttribute('href'), '/app')
  await login.click()
  await t.page.waitForURL('**/app')
  await t.page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  assert.equal(t.state.tableCalls, 0)
  await t.page.getByRole('link', { name: 'NKO home', exact: true }).click()
  await t.page.waitForURL(baseURL)
  await t.page.goto(`${baseURL}sign-in`)
  const google = t.page.getByRole('button', { name: 'Continue with Google', exact: true })
  assert.equal(await google.isDisabled(), true)
  const icon = google.locator('svg')
  assert.equal(await icon.getAttribute('viewBox'), '0 0 48 48')
  assert.deepEqual(await icon.locator('path').evaluateAll(nodes => nodes.map(node => node.getAttribute('fill')).sort()), ['#34A853', '#4285F4', '#EA4335', '#FBBC05'])
  const bounds = await icon.boundingBox()
  assert.equal(bounds.width, bounds.height)
  assert.equal(t.state.tokenCalls, 0)
  await t.close()
})

test('account menu supports hover, click, keyboard, dashboard navigation, and session restoration', async () => {
  const namedUser = { ...user, user_metadata: { full_name: 'Okafor Ozioma Solomon' } }
  const t = await setup({ user: namedUser, storedSession: session(false, namedUser) })
  await t.page.goto(baseURL)
  const header = t.page.locator('header').first()
  const account = header.getByRole('button', { name: /^Account menu for/ })
  const menu = t.page.getByRole('menu', { name: 'Account', exact: true })
  await account.waitFor()
  assert.equal(await account.innerText(), 'OO')
  assert.equal(await header.getByRole('link', { name: 'Login', exact: true }).count(), 0)
  assert.equal(await header.getByRole('link', { name: 'Get Started', exact: true }).count(), 0)
  assert.equal(t.state.tableCalls, 0)
  await account.hover()
  await menu.waitFor()
  if (process.env.NKO_SCREENSHOTS) await t.page.screenshot({ path: `${process.env.NKO_SCREENSHOTS}/header-account-desktop.png` })
  await menu.getByRole('menuitem', { name: 'My dashboard' }).hover()
  assert.equal(await menu.isVisible(), true)
  await t.page.locator('h1').hover()
  await menu.waitFor({ state: 'hidden' })
  await account.click()
  await menu.waitFor()
  await account.click()
  await menu.waitFor({ state: 'hidden' })
  await account.press('ArrowDown')
  const first = menu.getByRole('menuitem', { name: 'My dashboard' })
  const last = menu.getByRole('menuitem', { name: 'Sign out', exact: true })
  await first.waitFor()
  await t.page.waitForFunction(() => document.activeElement?.textContent.includes('My dashboard'))
  await first.press('End')
  assert.equal(await last.evaluate(node => node === document.activeElement), true)
  await last.press('Home')
  assert.equal(await first.evaluate(node => node === document.activeElement), true)
  await first.press('ArrowUp')
  assert.equal(await last.evaluate(node => node === document.activeElement), true)
  await last.press('Escape')
  await menu.waitFor({ state: 'hidden' })
  assert.equal(await account.evaluate(node => node === document.activeElement), true)
  await account.press('Enter')
  await first.waitFor()
  await t.page.waitForFunction(() => document.activeElement?.textContent.includes('My dashboard'))
  await first.press('Tab')
  await menu.waitFor({ state: 'hidden' })
  assert.equal(await t.page.evaluate(() => document.activeElement === document.body), false)
  await account.press('Space')
  await menu.waitFor()
  await t.page.waitForFunction(() => document.activeElement?.textContent.includes('My dashboard'))
  await first.press('Enter')
  await dashboard(t.page)
  const logoLinks = t.page.getByRole('link', { name: 'NKO home', exact: true })
  assert.ok(await logoLinks.count() >= 2, 'Sidebar and dashboard brand marks should both link home')
  await logoLinks.first().click()
  await t.page.waitForURL(baseURL)
  await account.waitFor()
  await t.page.reload()
  await account.waitFor()
  assert.equal(await account.innerText(), 'OO')
  assert.equal(t.state.tokenCalls, 0)
  await t.close()
})

test('account logout follows SDK session clearing on remote errors; success restores focus and protects app', async () => {
  const t = await setup({ storedSession: session(), logoutError: true })
  await t.page.goto(baseURL)
  const header = t.page.locator('header').first()
  const account = header.getByRole('button', { name: /^Account menu for/ })
  await account.waitFor()
  assert.equal(await account.innerText(), 'P', 'An email initial is the fallback when no name exists')
  await account.click()
  await t.page.getByRole('menuitem', { name: 'Sign out', exact: true }).click()
  const login = header.getByRole('link', { name: 'Login', exact: true })
  // The installed Supabase SDK removes the local session even when its remote
  // revocation request returns 500. Keep following the real provider state.
  await login.waitFor()
  assert.equal(await account.count(), 0)
  assert.equal(await t.page.evaluate(() => localStorage.getItem('sb-nko-test-auth-token')), null)
  t.state.logoutError = false
  await login.click()
  await t.page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  await t.page.getByLabel('Email', { exact: true }).fill(user.email)
  await t.page.getByLabel('Password', { exact: true }).fill('test-password')
  await t.page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await dashboard(t.page)
  await t.page.getByRole('link', { name: 'NKO home', exact: true }).first().click()
  await t.page.waitForURL(baseURL)
  await account.click()
  await t.page.getByRole('menuitem', { name: 'Sign out', exact: true }).click()
  await login.waitFor()
  await t.page.waitForFunction(() => document.activeElement?.textContent === 'Login')
  assert.equal(await header.getByRole('link', { name: 'Get Started', exact: true }).isVisible(), true)
  assert.equal(await account.count(), 0)
  assert.equal(await t.page.evaluate(() => localStorage.getItem('sb-nko-test-auth-token')), null)
  await login.click()
  await t.page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  assert.equal(await t.page.locator('.nko-dashboard').count(), 0)
  assert.ok(t.state.logoutCalls >= 2)
  await t.close()
})

test('touch menu and logged-out header fit mobile and tablet viewports', async () => {
  const singleName = { ...user, user_metadata: { name: 'Chimobi' } }
  const t = await setup({ mobile: true, user: singleName, storedSession: session(false, singleName) })
  await t.page.setViewportSize({ width: 320, height: 812 })
  await t.page.goto(baseURL)
  const account = t.page.getByRole('button', { name: /^Account menu for/ })
  await account.waitFor()
  assert.equal(await account.innerText(), 'C')
  await account.tap()
  const menu = t.page.getByRole('menu', { name: 'Account', exact: true })
  await menu.waitFor()
  const bounds = await menu.boundingBox()
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 320)
  if (process.env.NKO_SCREENSHOTS) await t.page.screenshot({ path: `${process.env.NKO_SCREENSHOTS}/header-account-mobile.png` })
  await t.page.locator('h1').tap()
  await menu.waitFor({ state: 'hidden' })
  await account.tap()
  await menu.getByRole('menuitem', { name: 'Sign out', exact: true }).tap()
  const header = t.page.locator('header').first()
  await header.getByRole('link', { name: 'Login', exact: true }).waitFor()
  for (const width of [320, 375, 768, 1024]) {
    await t.page.setViewportSize({ width, height: 812 })
    const positions = await header.locator('a').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).map(node => ({ left: node.getBoundingClientRect().left, right: node.getBoundingClientRect().right })))
    assert.ok(positions.every(position => position.left >= 0 && position.right <= width), `Header links must fit ${width}px`)
    assert.equal(await t.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  }
  await t.close()
})

test('onboarding logos return home without completing or bypassing the current user onboarding', async () => {
  const t = await setup({ storedSession: session(), completed: false })
  await t.page.goto(`${baseURL}app`)
  await t.page.getByRole('heading', { name: 'Welcome to NKO.' }).waitFor()
  await t.page.getByRole('link', { name: 'NKO home', exact: true }).click()
  await t.page.waitForURL(baseURL)
  await t.page.getByRole('button', { name: /^Account menu for/ }).click()
  await t.page.getByRole('menuitem', { name: 'My dashboard' }).click()
  await t.page.getByRole('heading', { name: 'Welcome to NKO.' }).waitFor()
  await t.page.getByRole('button', { name: 'Get started', exact: true }).click()
  await t.page.getByRole('radio', { name: /^Producer / }).waitFor({ state: 'attached' })
  assert.equal(await t.page.getByRole('link', { name: 'NKO home', exact: true }).getAttribute('href'), '/')
  await t.page.getByRole('radio', { name: /^Producer / }).focus()
  await t.page.keyboard.press('Space')
  await t.page.getByRole('button', { name: 'Continue', exact: true }).click()
  await t.page.getByRole('radio', { name: /^Nigeria / }).waitFor({ state: 'attached' })
  await t.page.getByRole('link', { name: 'NKO home', exact: true }).click()
  await t.page.waitForURL(baseURL)
  assert.equal(await t.page.evaluate(id => localStorage.getItem(`nko_onboarding_${id}`), user.id), null)
  assert.equal(t.state.tableCalls, 0)
  await t.close()
})

test('favicon and sharing metadata are present in server HTML and reference real image assets', async () => {
  const t = await setup()
  const response = await t.page.goto(baseURL)
  const html = await response.text()
  assert.match(html, /<title>NKO \| AI-Powered Film Production Management<\/title>/)
  assert.match(html, /property="og:title"/)
  assert.match(html, /name="twitter:card" content="summary_large_image"/)
  assert.ok(!html.includes('%VITE_'), 'Crawler metadata must not contain unresolved build placeholders')
  assert.equal(await t.page.locator('link[rel="canonical"]').getAttribute('href'), 'https://nko-three.vercel.app/')
  assert.equal(await t.page.locator('meta[property="og:url"]').getAttribute('content'), 'https://nko-three.vercel.app/')
  const description = await t.page.locator('meta[name="description"]').getAttribute('content')
  assert.ok(description.length > 50 && description.length <= 160)
  const imageURL = await t.page.locator('meta[property="og:image"]').getAttribute('content')
  assert.equal(imageURL, 'https://nko-three.vercel.app/assets/Background.png')
  assert.equal(await t.page.locator('meta[name="twitter:image"]').getAttribute('content'), imageURL)
  for (const pathname of ['/favicon.svg', new URL(imageURL).pathname, '/assets/logo.png']) {
    const asset = await t.context.request.get(new URL(pathname, baseURL).href)
    assert.equal(asset.status(), 200)
  }
  const favicon = await (await t.context.request.get(`${baseURL}favicon.svg`)).text()
  const embedded = favicon.match(/base64,([^"\s]+)/)[1]
  assert.deepEqual(Buffer.from(embedded, 'base64'), await readFile('public/assets/logo.png'))
  const imageSizes = await t.page.evaluate(async () => {
    const load = src => new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve([img.naturalWidth, img.naturalHeight])
      img.onerror = () => reject(new Error(`Image failed to load: ${src}`))
      img.src = src
    })
    return Promise.all([load('/favicon.svg'), load('/assets/Background.png')])
  })
  assert.deepEqual(imageSizes, [[72, 72], [2512, 1498]])
  const brandImages = await t.page.locator('img[src="/assets/logo.png"]').evaluateAll(nodes => nodes.map(node => ({ href: node.closest('a')?.getAttribute('href'), ratio: node.width / node.height })))
  assert.ok(brandImages.every(item => item.href === '/' && Math.abs(item.ratio - 72 / 28) < 0.05))
  await t.close()
})

test('landing header waits for authentication initialization before displaying account controls', async () => {
  const t = await setup({ storedSession: session(), identityDelay: 700 })
  await t.page.goto(baseURL)
  const header = t.page.locator('header').first()
  assert.equal(await header.getByRole('link', { name: 'Login', exact: true }).count(), 0)
  assert.equal(await header.getByRole('button', { name: /^Account menu for/ }).count(), 0)
  await header.getByRole('button', { name: /^Account menu for/ }).waitFor()
  assert.equal(t.state.tableCalls, 0)
  await t.close()
})
