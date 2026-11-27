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
  assert.ok(scenes[0].pictureVehicles.some(v => v.name === 'Taxi'));

  // Scene 2 assertions
  assert.equal(scenes[1].sceneNumber, '2');
  assert.equal(scenes[1].heading, "INT. ADAOBI'S TAXI - NIGHT");
  assert.equal(scenes[1].intExt, 'INT');
  assert.equal(scenes[1].location, "ADAOBI'S TAXI");
  assert.deepEqual(scenes[1].cast, ['YINKA', 'ADAOBI']);
  assert.ok(scenes[1].productionElements.some(e => e.name.includes('Dossier') || e.name.includes('Briefcase')));
  assert.ok(scenes[1].pictureVehicles.some(v => v.name === 'Police vehicle'));

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

/* Layout of a long, numbered feature script after PDF text extraction: scene numbers on both
   margins, sub-scenes without INT./EXT., headings that wrap onto a second line, dual cues,
   and vehicles/props mentioned deep inside a scene rather than in its first lines. */
test('parseScriptFile handles numbered PDF-style feature scripts', async () => {
  const { isSceneHeadingLine, matchSubSceneHeading } = await import('../src/legacy/scriptBreakdownParser.js');
  const filler = Array.from({ length: 8 }, (_, i) => `People move about the platform, line ${i + 1} of the opening.`).join('\n');
  const pdfText = `
1 EXT. RIVERTOWN TRAIN STATION – NIGHT 1
${filler}
KELECHI
Help me carry this box, it is heavy.
The train rolls in and scratches to a halt. Kelechi carries her box past the scar-faced porter.
2 AT THE TAXI PARK: 2
A cluster of old taxis. Drivers lean on their cars.
KELECHI/ OBINNA
Good evening!
3 EXT. RIVERTOWN MARKET - CONTINUOUS - BACK TO
PRESENT.
OBINNA
We should go.
4 I/E. MILITARY TRUCK/ DIRT ROAD - EVENING
An old truck bumps down the road. Soldiers grip their rifles. Gunshots ring out.
SERGEANT
Take cover!
5 EXT. FARM HOUSE (COMPOUND - BACKYARD) - DAY 5
Obinna advances carefully, then sits.
OBINNA
It is quiet.
`;
  const { scenes, characters } = parseScriptFile(pdfText, 'feature.pdf');

  assert.deepEqual(scenes.map(s => s.sceneNumber), ['1', '2', '3', '4', '5']);
  // Right-margin scene number is not part of the heading
  assert.equal(scenes[0].heading, 'EXT. RIVERTOWN TRAIN STATION – NIGHT');
  // Sub-scene inherits the parent's set and time of day
  assert.equal(scenes[1].location, 'RIVERTOWN TRAIN STATION');
  assert.equal(scenes[1].dayNight, 'NIGHT');
  assert.equal(scenes[1].intExt, 'EXT');
  // Wrapped heading is joined; "PRESENT." is not taken as a character
  assert.equal(scenes[2].heading, 'EXT. RIVERTOWN MARKET - CONTINUOUS - BACK TO PRESENT.');
  assert.ok(!characters.some(c => /PRESENT|CONTINUOUS/.test(c.name)));
  // Dual cue credits both characters
  assert.deepEqual(scenes[1].cast, ['KELECHI', 'OBINNA']);
  // Unbalanced bracket from the dash split is closed
  assert.equal(scenes[4].location, 'FARM HOUSE (COMPOUND)');

  const vehicleNames = s => s.pictureVehicles.map(v => v.name).sort();
  // The train is mentioned well past the first five action lines of scene 1
  assert.ok(vehicleNames(scenes[0]).includes('Train'));
  // "carry", "scar" and "advances" are not cars or vans
  assert.ok(!vehicleNames(scenes[0]).includes('Car'));
  assert.deepEqual(vehicleNames(scenes[4]), []);
  assert.deepEqual(vehicleNames(scenes[1]), ['Car', 'Taxi']);
  // A specific "military truck" is not also listed as a generic truck
  assert.deepEqual(vehicleNames(scenes[3]), ['Military truck']);
  assert.ok(scenes[3].productionElements.some(e => e.name === 'Firearms'));
  assert.ok(scenes[3].productionElements.some(e => e.name === 'Gunfire & bullet hits FX'));
  // No invented demo data
  const all = JSON.stringify(scenes);
  assert.ok(!/Adaobi|LSR 412|Toyota|Bridge exchange/.test(all));

  assert.equal(matchSubSceneHeading('38 INSIDE THE ROOM: 38').title, 'INSIDE THE ROOM');
  assert.equal(matchSubSceneHeading('38 INSIDE THE ROOM: 39'), null);
  assert.equal(matchSubSceneHeading('2.'), null);
  assert.ok(isSceneHeadingLine('12 AT THE DANCE FLOOR: 12'));
  assert.ok(isSceneHeadingLine('1 EXT. RIVERTOWN TRAIN STATION – NIGHT 1'));
  assert.ok(!isSceneHeadingLine('Kelechi nods.'));
});
