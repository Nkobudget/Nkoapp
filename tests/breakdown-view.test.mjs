import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('script breakdown view layout and Lagos After Dark parity', async () => {
  const fileContent = fs.readFileSync(path.resolve('src/legacy/LegacyApp.jsx'), 'utf8');

  // Verify tabs exist with required identifiers
  assert.match(fileContent, /id:\s*'scenes',\s*label:\s*'Scenes'/);
  assert.match(fileContent, /id:\s*'cast',\s*label:\s*'Cast'/);
  assert.match(fileContent, /id:\s*'locations',\s*label:\s*'Locations'/);
  assert.match(fileContent, /id:\s*'elements',\s*label:\s*'Production Elements'/);
  assert.match(fileContent, /id:\s*'vehicles',\s*label:\s*'Picture Vehicles'/);

  // Verify 4 stat cards exist
  assert.match(fileContent, /label="Total Scenes"/);
  assert.match(fileContent, /label="Total Characters"/);
  assert.match(fileContent, /label="Script Pages"/);
  assert.match(fileContent, />Ready to schedule</);

  // Verify source document indicator
  assert.match(fileContent, /From <span/);

  // Verify table columns include Set and Status
  assert.match(fileContent, />Set<\/th>/);
  assert.match(fileContent, />Status<\/th>/);
  assert.match(fileContent, />Actions<\/th>/);

  // Verify Ready and Incomplete statuses
  assert.match(fileContent, />\s*Ready\s*<\/span>/);
  assert.match(fileContent, />\s*Incomplete ·/);

  // Verify Lagos After Dark 18 default scenes array
  assert.match(fileContent, /const LAGOS_AFTER_DARK_SCENES\s*=/);
  assert.match(fileContent, /EXT\. THIRD MAINLAND BRIDGE - NIGHT/);
  assert.match(fileContent, /EXT\. MAKOKO WATERFRONT - DAWN/);
  assert.match(fileContent, /INT\. FEMI'S PENTHOUSE - NIGHT/);
});
