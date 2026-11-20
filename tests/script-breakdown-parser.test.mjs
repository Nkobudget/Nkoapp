import test from 'node:test';
import assert from 'node:assert/strict';
import { parseScriptFile, parseDayNight, parseIntExt, parseSetName, parsePdfContentStream } from '../src/legacy/scriptBreakdownParser.js';

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

test('parseScriptFile handles Final Draft XML (.fdx) format cleanly', () => {
  const fdxXml = `<?xml version="1.0" encoding="UTF-8"?>
<FinalDraft DocumentType="Script" Template="No" Version="1">
  <Content>
    <Paragraph Type="Scene Heading" Number="1">
      <Text>INT. POLICE STATION - DAY</Text>
    </Paragraph>
    <Paragraph Type="Action">
      <Text>Inspector Okon sifts through case files on his cluttered desk.</Text>
    </Paragraph>
    <Paragraph Type="Character">
      <Text>INSPECTOR OKON</Text>
    </Paragraph>
    <Paragraph Type="Dialogue">
      <Text>We have twenty-four hours before the commissioner steps in.</Text>
    </Paragraph>
    <Paragraph Type="Scene Heading" Number="2">
      <Text>EXT. MAKOKO WATERFRONT - DAWN</Text>
    </Paragraph>
    <Paragraph Type="Action">
      <Text>A wooden boat drifts quietly across the lagoon waters.</Text>
    </Paragraph>
    <Paragraph Type="Character">
      <Text>TUNDE</Text>
    </Paragraph>
    <Paragraph Type="Dialogue">
      <Text>Keep the motor low.</Text>
    </Paragraph>
  </Content>
</FinalDraft>`;

  const { scenes, characters } = parseScriptFile(fdxXml, 'Lagos_Draft.fdx');
  assert.equal(scenes.length, 2);
  assert.equal(scenes[0].sceneNumber, '1');
  assert.equal(scenes[0].heading, 'INT. POLICE STATION - DAY');
  assert.equal(scenes[0].dayNight, 'DAY');
  assert.equal(scenes[0].location, 'POLICE STATION');
  assert.deepEqual(scenes[0].cast, ['INSPECTOR OKON']);

  assert.equal(scenes[1].sceneNumber, '2');
  assert.equal(scenes[1].heading, 'EXT. MAKOKO WATERFRONT - DAWN');
  assert.equal(scenes[1].dayNight, 'DAWN');
  assert.equal(scenes[1].location, 'MAKOKO WATERFRONT');
  assert.deepEqual(scenes[1].cast, ['TUNDE']);
  assert.ok(characters.some(c => c.name === 'INSPECTOR OKON'));
  assert.ok(characters.some(c => c.name === 'TUNDE'));
});

test('parsePdfContentStream extracts text correctly from Tj and TJ PDF stream operators', () => {
  const streamContent = `
    BT
    /F1 12 Tf
    72 712 Td
    (1 EXT. THIRD MAINLAND BRIDGE - NIGHT 1) Tj
    0 -14 Td
    [(Adaobi drives ) 10 (through ) -5 (thick traffic.)] TJ
    ET
  `;

  const extracted = parsePdfContentStream(streamContent);
  assert.ok(extracted.includes('1 EXT. THIRD MAINLAND BRIDGE - NIGHT 1'));
  assert.ok(extracted.includes('Adaobi drives through thick traffic.'));
});

test('parseScriptFile provides fallback scenes when script has non-standard headings or paragraphs', () => {
  const synopsisText = `
The story begins with an introduction to Adaobi, an ambitious driver navigating the bustling streets of Lagos.

Later at the market, she meets an old friend who delivers unexpected news regarding the ongoing investigation.
  `;

  const { scenes } = parseScriptFile(synopsisText, 'treatment.txt');
  assert.ok(scenes.length >= 1);
  assert.equal(scenes[0].status, 'ready');
  assert.equal(scenes[0].ready, true);
  assert.ok(scenes[0].heading.length > 0);
});

test('parseScriptFile never returns empty scenes even for empty input', () => {
  const { scenes } = parseScriptFile('', 'empty.txt');
  assert.ok(scenes.length >= 1);
  assert.equal(scenes[0].sceneNumber, '1');
  assert.equal(scenes[0].status, 'ready');
});
