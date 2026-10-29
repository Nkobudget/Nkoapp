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
