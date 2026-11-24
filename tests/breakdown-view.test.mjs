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
  assert.match(fileContent, /Edit location/);
  assert.match(fileContent, /A physical place you'll shoot at\. Several script sets can belong to one location\./);
  assert.match(fileContent, /Location name/);
  assert.match(fileContent, /placeholder="e\.g\. Club Eclipse, Victoria Island"/);
  assert.match(fileContent, /placeholder="Street, area, city"/);
  assert.match(fileContent, /Sets shot here/);
  assert.match(fileContent, /Scenes are linked to this location through their set\./);
  assert.match(fileContent, /placeholder="Add a set not in the script"/);
  assert.match(fileContent, /On-site contact/);
  assert.match(fileContent, /Contact person/);
  assert.match(fileContent, /Contact number/);
  assert.match(fileContent, /Access, parking &amp; notes/);
  assert.match(fileContent, /Gates, permits, permitted hours\./);
  assert.match(fileContent, /Unit base at Tinubu Square\./);
  assert.match(fileContent, />\s*Safety\s*<\/span>/);
  assert.match(fileContent, /Nearest hospital/);
  assert.match(fileContent, /Name and travel time\./);
  assert.match(fileContent, /Emergency contact/);
  assert.match(fileContent, /Where supplied\./);
  assert.match(fileContent, />\s*Save changes\s*<\/motion\.button>/);
  assert.match(fileContent, /function DeleteLocationModal/);
  assert.match(fileContent, /Remove location\?/);
  assert.match(fileContent, /Its sets will become unmapped\./);
});

test('script breakdown production elements tab layout and modals parity', async () => {
  const fileContent = fs.readFileSync(path.resolve('src/legacy/LegacyApp.jsx'), 'utf8');

  // Verify Default Production Elements
  assert.match(fileContent, /const DEFAULT_PRODUCTION_ELEMENTS\s*=/);
  assert.match(fileContent, /Black holdall of cash/);
  assert.match(fileContent, /Taxi meter \(practical\)/);
  assert.match(fileContent, /Adaobi's driver jacket/);
  assert.match(fileContent, /Tunde's surgery wounds/);
  assert.match(fileContent, /Bridge exchange gunfire/);
  assert.match(fileContent, /Water rescue rig/);

  // Verify Top Action Button switches to Production Elements on elements tab
  assert.match(fileContent, /activeTab === 'elements'\s*\?\s*\(\s*<motion\.button[^>]*>[\s\S]*?Production Elements/);

  // Verify Production Elements Header & Subtitle
  assert.match(fileContent, /Everything each scene needs, by category and department\./);

  // Verify Filters
  assert.match(fileContent, /aria-label="Search production elements"/);
  assert.match(fileContent, /aria-label="Category filter"/);
  assert.match(fileContent, /aria-label="Status filter"/);

  // Verify Table Headers
  assert.match(fileContent, />\s*Element\s*<\/th>/);
  assert.match(fileContent, />\s*Category ↑\s*<\/th>/);
  assert.match(fileContent, />\s*Qty\s*<\/th>/);
  assert.match(fileContent, />\s*Department\s*<\/th>/);
  assert.match(fileContent, />\s*Status\s*<\/th>/);

  // Verify Modals
  assert.match(fileContent, /function ProductionElementModal/);
  assert.match(fileContent, /Edit element/);
  assert.match(fileContent, /Anything a scene needs on the day props, wardrobe, effects, animals, equipment\./);
  assert.match(fileContent, /Element name/);
  assert.match(fileContent, /Responsible department/);
  assert.match(fileContent, /Who sources and looks after it\./);
  assert.match(fileContent, /If applicable\./);
  assert.match(fileContent, /Every scene that needs this element\./);
  assert.match(fileContent, /Filter by number, set or character/);
  assert.match(fileContent, /Description &amp; special instructions/);
  assert.match(fileContent, /Doubles, safety, licences, handling\./);
  assert.match(fileContent, /Special instructions/);
  assert.match(fileContent, /Hero and stunt version\. Prop money must be marked ["&quot;\\]*FILM USE ONLY["&quot;\\]*\./);
  assert.match(fileContent, /function DeleteProductionElementModal/);
  assert.match(fileContent, /Remove production element\?/);
});

test('script breakdown picture vehicles tab layout and modals parity', async () => {
  const fileContent = fs.readFileSync(path.resolve('src/legacy/LegacyApp.jsx'), 'utf8');

  // Verify Default Picture Vehicles
  assert.match(fileContent, /const DEFAULT_PICTURE_VEHICLES\s*=/);
  assert.match(fileContent, /Adaobi's taxi/);
  assert.match(fileContent, /Taxi · Toyota Corolla 2008 · Yellow with black stripe/);
  assert.match(fileContent, /LSR 412 KJ/);
  assert.match(fileContent, /Okon's patrol car/);
  assert.match(fileContent, /Police vehicle · Toyota Hilux · Black and white livery/);
  assert.match(fileContent, /Prop plates/);
  assert.match(fileContent, /Lekki Picture Cars/);

  // Verify Top Action Button switches to Picture Vehicles on vehicles tab
  assert.match(fileContent, /activeTab === 'vehicles'\s*\?\s*\(\s*<motion\.button[^>]*>[\s\S]*?Picture Vehicles/);

  // Verify Picture Vehicles Header & Subtitle
  assert.match(fileContent, /Vehicles that appear on camera, and the scenes they['&apos;]+re in\./);

  // Verify Filters
  assert.match(fileContent, /aria-label="Search picture vehicles"/);
  assert.match(fileContent, /placeholder="Search name, model, colour, registration or supplier"/);
  assert.match(fileContent, /aria-label="Usage filter"/);
  assert.match(fileContent, /aria-label="Status filter"/);

  // Verify Table Headers
  assert.match(fileContent, />\s*Vehicle ↑\s*<\/th>/);
  assert.match(fileContent, />\s*Registration\s*<\/th>/);
  assert.match(fileContent, />\s*Scenes\s*<\/th>/);
  assert.match(fileContent, />\s*Usage\s*<\/th>/);
  assert.match(fileContent, />\s*Supplier\s*<\/th>/);
  assert.match(fileContent, />\s*Status\s*<\/th>/);
  assert.match(fileContent, />\s*Actions\s*<\/th>/);

  // Verify Modals
  assert.match(fileContent, /function PictureVehicleModal/);
  assert.match(fileContent, /Edit picture vehicle/);
  assert.match(fileContent, /Vehicles seen on camera – not unit transport\./);
  assert.match(fileContent, /Vehicle name/);
  assert.match(fileContent, /As it['&apos;]+s known in the story\./);
  assert.match(fileContent, /Make and model/);
  assert.match(fileContent, /Colour/);
  assert.match(fileContent, /Registration/);
  assert.match(fileContent, /On camera/);
  assert.match(fileContent, /Availability/);
  assert.match(fileContent, /Every scene the vehicle appears in\./);
  assert.match(fileContent, /Supplier &amp; special requirements/);
  assert.match(fileContent, /Owner or supplier/);
  assert.match(fileContent, /Rigging, doubles, livery, driver\./);
  assert.match(fileContent, /function DeletePictureVehicleModal/);
  assert.match(fileContent, /Remove picture vehicle\?/);
});

test('script upload reflects scenes, cast, locations, elements, and vehicles across breakdown and dashboard', async () => {
  const fileContent = fs.readFileSync(path.resolve('src/legacy/LegacyApp.jsx'), 'utf8');

  // Verify derivation functions exist
  assert.match(fileContent, /function deriveCastFromScenes/);
  assert.match(fileContent, /function deriveLocationsFromScenes/);
  assert.match(fileContent, /function deriveElementsFromScenes/);
  assert.match(fileContent, /function deriveVehiclesFromScenes/);

  // Verify cast derivation categorizes into Lead, Sub-lead, Supporting, Day Players
  assert.match(fileContent, /'Lead Actors'/);
  assert.match(fileContent, /'Sub-lead'/);
  assert.match(fileContent, /'Supporting Cast'/);
  assert.match(fileContent, /'Day Players'/);

  // Verify BreakdownView initialOpenUpload & state sync effect
  assert.match(fileContent, /initialOpenUpload/);
  assert.match(fileContent, /nko_cast_members_/);
  assert.match(fileContent, /nko_locations_/);
  assert.match(fileContent, /nko_elements_/);
  assert.match(fileContent, /nko_breakdown_vehicles_/);

  // Verify BreakdownUploader onApply updates scenes, cast, locations, elements, vehicles
  assert.match(fileContent, /saveCastMembersList\(newCast\)/);
  assert.match(fileContent, /saveLocationsList\(newLocs\)/);
  assert.match(fileContent, /saveElementsList\(newElems\)/);
  assert.match(fileContent, /saveVehiclesList\(newVehs\)/);

  // Verify ProductionDashboardView reflects script breakdown
  assert.match(fileContent, /REFLECTED ON DASHBOARD/);
  assert.match(fileContent, /Upload script/);
  assert.match(fileContent, /effectiveScenes\.length/);
  assert.match(fileContent, /uniqueCast\.length/);
  assert.match(fileContent, /uniqueLocs\.length/);

  // Verify BudgetsView contains Upload Script button with BreakdownUploader
  assert.match(fileContent, /function BudgetsView/);
  assert.match(fileContent, /<Upload size=\{14\}[\s\S]*?<span>Upload Script<\/span>/);
  assert.match(fileContent, /<BreakdownUploader[\s\S]*?open=\{showUpload\}[\s\S]*?project=\{project\}/);

  // Verify DashboardView accepts scenes and reflects script breakdown across slate dashboard
  assert.match(fileContent, /function DashboardView\(\{[\s\S]*?scenes=\[\]/);
  assert.match(fileContent, /function DashboardView\(\{[\s\S]*?onOpenUploadScript/);
  assert.match(fileContent, /scenes\.length > 0 \? `\$\{scenes\.length\} script scenes broken down`/);
  assert.match(fileContent, /<th style=\{\{padding:'13px 14px',fontWeight:500,whiteSpace:'nowrap'\}\}>Script Breakdown<\/th>/);
  assert.match(fileContent, /effectiveScenes\.length\} sc · \{pCast\.length\} cast · \{pLocs\.length\} loc/);
  assert.match(fileContent, /<DashboardView[\s\S]*?scenes=\{scenes\}[\s\S]*?onOpenUploadScript=/);

  // Verify multi-user collaborator / producer script breakdown broadcast & storage reflection
  assert.match(fileContent, /uploaded script breakdown: \$\{scriptName/);
  assert.match(fileContent, /payload\.text\.toLowerCase\(\)\.includes\('script'\)/);
  assert.match(fileContent, /data:\s*\{\.\.\.rest,\s*script_name:\s*scriptName/);
});

test('saveCharactersBatch collects all characters into single insert, verifies project existence, and shows toasts', async () => {
  const fileContent = fs.readFileSync(path.resolve('src/legacy/LegacyApp.jsx'), 'utf8');

  // Verify saveCharactersBatch function definition exists
  assert.match(fileContent, /const saveCharactersBatch\s*=\s*async/);

  // (1) Verify all characters are collected and inserted in a single batched insert
  assert.match(fileContent, /sb\.from\('characters'\)\.insert\(rowsToInsert\)/);
  assert.match(fileContent, /Batched characters to insert/);

  // (2) Verify project ID returned by project lookup/verification is used, not stale currentId
  assert.match(fileContent, /const verifiedProjectId = verifiedProject\.id/);
  assert.match(fileContent, /project_id:\s*verifiedProjectId/);

  // (3) Verify project exists in Supabase before inserting and aborts with toast if it does not
  assert.match(fileContent, /sb[\s\S]*?\.from\('projects'\)[\s\S]*?\.select\('id,\s*name'\)[\s\S]*?\.eq\('id',\s*candidateId\)/);
  assert.match(fileContent, /toast\.error\(\s*['"]Upload failed['"],\s*['"]Production was not found in the database/);

  // (4) Verify alert() is replaced with single toast for errors and green toast on success
  assert.match(fileContent, /toast\.success\(\s*['"]Successfully uploaded['"]/);
  assert.match(fileContent, /toast\.error\(\s*['"]Could not save characters['"]/);

  // Verify onSaveCharactersBatch is passed down to BreakdownView and BudgetsView
  assert.match(fileContent, /<BreakdownView[\s\S]*?onSaveCharactersBatch=\{saveCharactersBatch\}/);
  assert.match(fileContent, /<BudgetsView[\s\S]*?onSaveCharactersBatch=\{saveCharactersBatch\}/);
});

test('project creation logs insert result, Supabase host is logged at start, and budget checks project existence', async () => {
  const legacyContent = fs.readFileSync(path.resolve('src/legacy/LegacyApp.jsx'), 'utf8');
  const clientContent = fs.readFileSync(path.resolve('src/lib/supabaseClient.js'), 'utf8');

  // Supabase URL host log at app start
  assert.match(clientContent, /console\.log\(\s*['"]Supabase host:['"],\s*sbHost\)/);

  // Project insert result logged on creation
  assert.match(legacyContent, /console\.log\(\s*['"]Project insert result:['"],\s*\{\s*data/);

  // applyScriptBudget checks project exists before inserting and uses toast
  assert.match(legacyContent, /const applyScriptBudget\s*=\s*async/);
  assert.match(legacyContent, /sb\.from\('projects'\)\.select\('id,\s*name'\)\.eq\('id',\s*targetId\)/);
  assert.match(legacyContent, /toast\.error\(\s*['"]Could not apply budget['"]/);

  // Alert replaced in createProject
  assert.match(legacyContent, /const createProject\s*=\s*async[\s\S]*?toast\.error\(\s*['"]Could not create production['"]/);
});
