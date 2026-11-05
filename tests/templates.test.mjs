import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

test('television budget template exists and covers all key television departments', () => {
  const filePath = path.resolve('src/legacy/LegacyApp.jsx');
  const code = fs.readFileSync(filePath, 'utf8');

  // Verify PROJ_TYPES includes 'Television Series / TV Show'
  assert.ok(code.includes("'Television Series / TV Show'"), "PROJ_TYPES should include 'Television Series / TV Show'");

  // Verify television template definition
  assert.ok(code.includes("id:'television'"), "TEMPLATES should have an entry with id: 'television'");
  assert.ok(code.includes("label:'Television Series / TV Drama'"), "TEMPLATES should have label 'Television Series / TV Drama'");

  // Verify key television departments are in the template
  assert.ok(code.includes("Series Bible & Concept Development"), "Television template should include Series Bible");
  assert.ok(code.includes("Writers Room — Story Outline & Beat Sheets"), "Television template should include Writers Room");
  assert.ok(code.includes("Showrunner / Executive Producer"), "Television template should include Showrunner");
  assert.ok(code.includes("Series Regular Leads (Tier 1)"), "Television template should include Series Regular Leads");
  assert.ok(code.includes("Primary Multi-Camera Package"), "Television template should include Multi-Camera Package");
  assert.ok(code.includes("Broadcast / Streamer Delivery Master Packages"), "Television template should include Broadcast deliverables");

  // Verify Nollywood TV Drama in COMMUNITY_TEMPLATES points to television template
  assert.ok(code.includes("id:'ct1',label:'Nollywood TV Drama',author:'Zestyn Media',type:'Television Series / TV Show'"), "Nollywood TV Drama should be of type 'Television Series / TV Show'");
  assert.ok(code.includes("items:TEMPLATES.find(t=>t.id==='television').items"), "Nollywood TV Drama should use television template items");
});

test('real-time presence and producer working indicator are configured', () => {
  const filePath = path.resolve('src/legacy/LegacyApp.jsx');
  const code = fs.readFileSync(filePath, 'utf8');

  // Verify real-time presence tracking and broadcast activity
  assert.ok(code.includes("nko_prod_${currentId}"), "Should establish realtime channel per production");
  assert.ok(code.includes("Producer is currently working on this project"), "Should have producer working on project indicator");
  assert.ok(code.includes("Producer working on project"), "Should have producer working pill in TopBar");
  assert.ok(code.includes("TemplatePickerModal"), "Should have dedicated mobile-friendly TemplatePickerModal");
});

test('iris-gold-128 loading glow up is configured across auth status, screen, and workspace', () => {
  const irisLoaderPath = path.resolve('src/components/IrisLoader.jsx');
  const irisLoaderCode = fs.readFileSync(irisLoaderPath, 'utf8');
  assert.ok(irisLoaderCode.includes('iris-gold-128.png'), 'IrisLoader must use iris-gold-128.png');
  assert.ok(irisLoaderCode.includes('nko-iris-glowing-logo'), 'IrisLoader must have glowing logo animation class');
  assert.ok(irisLoaderCode.includes('nko-iris-aura'), 'IrisLoader must have aura glow animation');
  assert.ok(irisLoaderCode.includes('Loading your workspace'), 'IrisLoader must include Loading your workspace text');

  assert.ok(irisLoaderCode.includes('sr-only'), 'Visual text area must be removed from screen using sr-only');

  const authStatusPath = path.resolve('src/auth/AuthStatus.jsx');
  const authStatusCode = fs.readFileSync(authStatusPath, 'utf8');
  assert.ok(authStatusCode.includes('IrisLoader'), 'AuthStatus must render IrisLoader');

  const authScreenPath = path.resolve('src/auth/AuthScreen.jsx');
  const authScreenCode = fs.readFileSync(authScreenPath, 'utf8');
  assert.ok(authScreenCode.includes('redirecting'), 'AuthScreen must handle post-login/register redirect state');
  assert.ok(authScreenCode.includes('AuthStatus'), 'AuthScreen must render AuthStatus when redirecting');

  const legacyAppPath = path.resolve('src/legacy/LegacyApp.jsx');
  const legacyAppCode = fs.readFileSync(legacyAppPath, 'utf8');
  assert.ok(legacyAppCode.includes('IrisLoader'), 'LegacyApp must render IrisLoader during workspace loadState');

  const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
  assert.ok(indexCss.includes('iris-glow-pulse'), 'src/index.css must define iris-glow-pulse keyframes');
  assert.ok(indexCss.includes('iris-aura-pulse'), 'src/index.css must define iris-aura-pulse keyframes');
});

test('total spend calculation and display are properly configured', () => {
  const legacyAppPath = path.resolve('src/legacy/LegacyApp.jsx');
  const code = fs.readFileSync(legacyAppPath, 'utf8');

  // Verify computeTotalSpend helper exists
  assert.ok(code.includes('const computeTotalSpend ='), 'LegacyApp must define computeTotalSpend helper');
  assert.ok(code.includes("po.status === 'Paid'"), 'computeTotalSpend must account for paid purchase orders');
  assert.ok(code.includes("p.payments"), 'computeTotalSpend must account for payee payments');
  assert.ok(code.includes("[CASH-IN]"), 'computeTotalSpend must account for non-top-up advance expenses');

  // Verify ProductionDashboardView includes total spend
  assert.ok(code.includes("StatCard label={t('statTotalSpend')}"), 'ProductionDashboardView must include Total Spend StatCard');
  assert.ok(code.includes("Overall Production Spend Pace"), 'ProductionDashboardView must show Spend Pace progress bar');

  // Verify ProductionSpendBreakdownPanel exists and is used in BreakdownView
  assert.ok(code.includes('function ProductionSpendBreakdownPanel'), 'Must define ProductionSpendBreakdownPanel');
  assert.ok(code.includes('<ProductionSpendBreakdownPanel'), 'BreakdownView must render ProductionSpendBreakdownPanel');

  // Verify matchesProject helper exists and handles project attribution
  assert.ok(code.includes('const matchesProject ='), 'Must define matchesProject helper');

  // Verify app-switching background recovery in Workspace and ScriptUploader
  assert.ok(code.includes("handleResume"), 'Workspace must listen for app switching resume');
  assert.ok(code.includes("nko_cache_ws_"), 'Workspace must cache state to localStorage for seamless app switching');

  // Verify Workspace passes reconEntries, purchaseOrders, and onOpenRecon to ProductionDashboardView
  assert.ok(code.includes("reconEntries={pReconEntries}"), 'Workspace must pass reconEntries to ProductionDashboardView');
  assert.ok(code.includes("onOpenRecon={()"), 'Workspace must pass onOpenRecon to ProductionDashboardView');
});



