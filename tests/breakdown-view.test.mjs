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

  // Verify ScenePreviewDrawer (right side popup) structure
  assert.match(fileContent, /function ScenePreviewDrawer/);
  assert.match(fileContent, /Ready to schedule<\/span>/);
  assert.match(fileContent, /Interior \/ exterior/);
  assert.match(fileContent, /Time of day/);
  assert.match(fileContent, /Script pages/);
  assert.match(fileContent, /Scene description/);
  assert.match(fileContent, /Cast\s+<span/);
  assert.match(fileContent, /Production elements\s+<span/);
  assert.match(fileContent, /Picture vehicles\s+<span/);
  assert.match(fileContent, /Manage\s*<\/button>/);
});

test('script breakdown cast tab layout and script characters parity', async () => {
  const fileContent = fs.readFileSync(path.resolve('src/legacy/LegacyApp.jsx'), 'utf8');

  // Verify Default Cast Members
  assert.match(fileContent, /const DEFAULT_CAST_MEMBERS\s*=/);
  assert.match(fileContent, /Kehinde Bankole/);
  assert.match(fileContent, /Timini Egbuson/);
  assert.match(fileContent, /Ireti Doyle/);
  assert.match(fileContent, /Femi Jacobs/);
  assert.match(fileContent, /Gabriel Afolayan/);
  assert.match(fileContent, /Bimbo Akintola/);
  assert.match(fileContent, /Ngozi Nwosu/);
  assert.match(fileContent, /Police officers/);
  assert.match(fileContent, /Club patrons/);
  assert.match(fileContent, /Market traders and shoppers/);

  // Verify Cast Categories
  assert.match(fileContent, /const CAST_CATEGORIES\s*=/);
  assert.match(fileContent, /Lead Actors/);
  assert.match(fileContent, /Sub-lead/);
  assert.match(fileContent, /Supporting Cast/);
  assert.match(fileContent, /Day Players/);
  assert.match(fileContent, /Extras/);
  assert.match(fileContent, /Background Extras/);
  assert.match(fileContent, /Crowd/);

  // Verify Cast Tab Header & Button
  assert.match(fileContent, /activeTab === 'cast'\s*\?\s*\(\s*<motion\.button[^>]*>[\s\S]*?Add Cast/);
  assert.match(fileContent, />\s*Leads through to crowd, linked to every scene they appear in\.\s*<\/div>/);

  // Verify Table Columns
  assert.match(fileContent, />Cast<\/th>/);
  assert.match(fileContent, />Scenes<\/th>/);
  assert.match(fileContent, />Availability<\/th>/);
  assert.match(fileContent, />Call \/ On set<\/th>/);
  assert.match(fileContent, />Contact<\/th>/);

  // Verify Script Characters Panel
  assert.match(fileContent, /Script characters/);
  assert.match(fileContent, /not cast yet/);
  assert.match(fileContent, /\+\s*Cast/);

  // Verify Modals
  assert.match(fileContent, /function CastMemberModal/);
  assert.match(fileContent, /Edit cast record/);
  assert.match(fileContent, /One record per character\. An actor can appear across any number of scenes\./);
  assert.match(fileContent, /As named in the script\./);
  assert.match(fileContent, /appears in the script are linked automatically\. Add any others\./);
  assert.match(fileContent, /Filter by number, set or character/);
  assert.match(fileContent, />\s*Select\s*<\/button>/);
  assert.match(fileContent, /Contact details &amp; notes/);
  assert.match(fileContent, /Contract terms, dietary needs, availability windows\./);
  assert.match(fileContent, /Save changes/);
  assert.match(fileContent, /function DeleteCastModal/);
});

test('script breakdown locations tab layout and unmapped sets parity', async () => {
  const fileContent = fs.readFileSync(path.resolve('src/legacy/LegacyApp.jsx'), 'utf8');

  // Verify Default Locations
  assert.match(fileContent, /const DEFAULT_LOCATIONS\s*=/);
  assert.match(fileContent, /Balogun Market/);
  assert.match(fileContent, /Third Mainland Bridge/);
  assert.match(fileContent, /Club Eclipse/);
  assert.match(fileContent, /Adaobi's Flat & Taxi Hub/);

  // Verify Top Action Button switches to Add Location on locations tab
  assert.match(fileContent, /activeTab === 'locations'\s*\?\s*\(\s*<motion\.button[^>]*>[\s\S]*?Add Location/);

  // Verify Locations Header & Subtitle
  assert.match(fileContent, /Physical places you'll shoot at, with the sets and scenes they cover\./);

  // Verify Filters
  assert.match(fileContent, /placeholder="Search location, address, set or contact"/);
  assert.match(fileContent, /aria-label="INT\/EXT filter"/);
  assert.match(fileContent, /aria-label="Day\/Night filter"/);

  // Verify Table Headers
  assert.match(fileContent, /Location ↑/);
  assert.match(fileContent, />\s*Sets\s*<\/th>/);
  assert.match(fileContent, />\s*Scenes\s*<\/th>/);
  assert.match(fileContent, />\s*INT\/EXT · Time\s*<\/th>/);
  assert.match(fileContent, />\s*Contact\s*<\/th>/);
  assert.match(fileContent, />\s*Actions\s*<\/th>/);

  // Verify Sets without a location side panel
  assert.match(fileContent, /Sets without a location/);
  assert.match(fileContent, /can't be scheduled until mapped\./);
  assert.match(fileContent, /\+\s*Location/);

  // Verify Modals
  assert.match(fileContent, /function LocationModal/);
  assert.match(fileContent, /function DeleteLocationModal/);
  assert.match(fileContent, /Remove location\?/);
  assert.match(fileContent, /Its sets will become unmapped\./);
});
