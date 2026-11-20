import test from 'node:test';
import assert from 'node:assert/strict';
import { parseScriptFile, parseDayNight, parseIntExt, parseSetName } from '../src/legacy/scriptBreakdownParser.js';

test('parseDayNight correctly extracts and standardizes time of day', () => {
  assert.equal(parseDayNight('EXT. THIRD MAINLAND BRIDGE - NIGHT'), 'NIGHT');
  assert.equal(parseDayNight('INT. ADAOBI\'S FLAT - DAY'), 'DAY');
  assert.equal(parseDayNight('EXT. MAKOKO WATERFRONT - DAWN'), 'DAWN');
  assert.equal(parseDayNight('INT. HOSPITAL CORRIDOR - DUSK'), 'DUSK');
  assert.equal(parseDayNight('INT. SADE\'S NEWSROOM - MORNING'), 'DAWN');
  assert.equal(parseDayNight('EXT. MARKET - EVENING'), 'DUSK');
});

test('parseIntExt identifies INT, EXT, and INT/EXT', () => {
  assert.equal(parseIntExt('EXT. THIRD MAINLAND BRIDGE - NIGHT'), 'EXT');
  assert.equal(parseIntExt('INT. ADAOBI\'S FLAT - DAY'), 'INT');
  assert.equal(parseIntExt('INT./EXT. ADAOBI\'S TAXI - NIGHT'), 'INT/EXT');
  assert.equal(parseIntExt('I/E ADAOBI\'S TAXI - NIGHT'), 'INT/EXT');
});

test('parseSetName cleans slugline to set name', () => {
  assert.equal(parseSetName('EXT. THIRD MAINLAND BRIDGE - NIGHT'), 'THIRD MAINLAND BRIDGE');
  assert.equal(parseSetName('INT. ADAOBI\'S FLAT - DAY'), 'ADAOBI\'S FLAT');
  assert.equal(parseSetName('12. EXT. MAKOKO WATERFRONT - DAWN'), 'MAKOKO WATERFRONT');
});

test('parseScriptFile extracts scenes, synopsis, characters, props and vehicles from script text', () => {
  const sampleScript = `
1. EXT. THIRD MAINLAND BRIDGE - NIGHT

Adaobi's taxi crawls through traffic on Third Mainland Bridge as a stranger flags her down.

ADAOBI
Where are you heading at this late hour?

STRANGER
Lekki Toll Gate. Step on it.

2. INT. ADAOBI'S TAXI - NIGHT

Yinka enters, clutching a brown leather briefcase with confidential documents. A police cruiser sirens in the distance.

YINKA
Don't stop for anyone.

ADAOBI
What did you get us into?
`;

  const { scenes, characters } = parseScriptFile(sampleScript, 'sample.txt');

  assert.equal(scenes.length, 2);

  // Scene 1 assertions
  assert.equal(scenes[0].sceneNumber, '1');
  assert.equal(scenes[0].heading, 'EXT. THIRD MAINLAND BRIDGE - NIGHT');
  assert.equal(scenes[0].intExt, 'EXT');
  assert.equal(scenes[0].location, 'THIRD MAINLAND BRIDGE');
  assert.equal(scenes[0].dayNight, 'NIGHT');
  assert.ok(scenes[0].synopsis.includes("Adaobi's taxi crawls through traffic"));
  assert.deepEqual(scenes[0].cast, ['ADAOBI', 'STRANGER']);
  assert.equal(scenes[0].status, 'ready');
  assert.equal(scenes[0].ready, true);
  assert.ok(scenes[0].pictureVehicles.some(v => v.name === "Adaobi's Taxi"));

  // Scene 2 assertions
  assert.equal(scenes[1].sceneNumber, '2');
  assert.equal(scenes[1].heading, "INT. ADAOBI'S TAXI - NIGHT");
  assert.equal(scenes[1].intExt, 'INT');
  assert.equal(scenes[1].location, "ADAOBI'S TAXI");
  assert.deepEqual(scenes[1].cast, ['YINKA', 'ADAOBI']);
  assert.ok(scenes[1].productionElements.some(e => e.name.includes('Dossier') || e.name.includes('Briefcase')));
  assert.ok(scenes[1].pictureVehicles.some(v => v.name === 'Police Cruiser' || v.name === "Adaobi's Taxi"));

  // Characters assertions
  assert.ok(characters.some(c => c.name === 'ADAOBI' && c.tier === 'lead' || c.tier === 'supporting'));
  assert.ok(characters.some(c => c.name === 'YINKA'));
});
