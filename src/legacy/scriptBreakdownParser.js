/* ── Script Breakdown Parser for NKÒ ──
   Extracts scenes, characters, locations, production elements, and picture vehicles
   from Final Draft XML (.fdx), Fountain (.fountain), plain text (.txt), and PDF text.
*/

const HEADING_REGEX = /^\s*(?:\.?\s*)?(?:(?:SCENE\s+)?(\d+[A-Z]?)\s*[.\-:\/]?\s*)?((?:INT\.?\s*[\/&]\s*EXT\.?|EXT\.?\s*[\/&]\s*INT\.?|I\s*\/\s*E|INT\.?|EXT\.?)\b\s*.+)$/i;
const SECONDARY_HEADING_REGEX = /^\s*(?:SCENE\s+(\d+[A-Z]?)|(\d+)[.\-]\s+([A-Z0-9\s'–-]+(?:\s*[-–—]\s*(?:NIGHT|DAY|DAWN|DUSK|MORNING|EVENING|CONTINUOUS|LATER))?))/i;

/* Second line of a heading that wrapped in the PDF, e.g. "... - BACK TO" + "PRESENT." */
const HEADING_CONTINUATION = /^(?:PRESENT\.?|BACK TO PRESENT\.?|CONTINUOUS|DAY|NIGHT|DAWN|DUSK|MORNING|EVENING|AFTERNOON|LATER|FLASHBACK)\b[\s.\-–—A-Z]{0,30}$/;

/* All-caps lines that look like a character cue but are not a person. */
const NON_CHARACTER_CUES = /^(?:CONTINUOUS|PRESENT|BACK TO PRESENT|FLASHBACK(?: ENDS)?|DREAM(?:\/ ?FLASHBACK)?(?: ENDS)?|INTERCUT(?: WITH)?|MATCH CUT(?: TO)?|MOMENTS LATER|LATER|BEAT|MORE|CONT'?’?D|TEXT ON SCREEN|SUPER|TITLE|THE END|FADE TO BLACK|END|INSERT|BACK TO SCENE|ANGLE ON|CLOSE ON|POV)$/;

/* A numbered sub-scene heading with no INT./EXT., numbered on both margins:
   "2 AT THE TAXI PARK: 2", "38 INSIDE AWELE'S ROOM: 38", "60 MOMENTS LATER... 60". */
export function matchSubSceneHeading(line = '') {
  const m = String(line).trim().match(/^(\d+[A-Z]?)\s+(.{2,80}?)\s+(\d+[A-Z]?)$/);
  if (!m || m[1] !== m[3]) return null;
  const title = m[2].replace(/[:.…]+$/, '').trim();
  if (!title || title !== title.toUpperCase() || !/[A-Z]/.test(title)) return null;
  return { number: m[1], title };
}

/* True for any line that starts a new scene — used to measure scene lengths on the page. */
export function isSceneHeadingLine(line = '') {
  const t = String(line).trim();
  if (!t || t.length >= 140) return false;
  return HEADING_REGEX.test(t) || Boolean(matchSubSceneHeading(t));
}

const TOD_TERMS =['NIGHT', 'DAY', 'DAWN', 'DUSK', 'MORNING', 'EVENING', 'AFTERNOON', 'SUNSET', 'SUNRISE', 'CONTINUOUS', 'LATER', 'SAME'];

export function parseDayNight(heading = '') {
  const upper = heading.toUpperCase();
  const match = upper.match(/[-–—,.]\s*(NIGHT|DAY|DAWN|DUSK|MORNING|EVENING|AFTERNOON|SUNSET|SUNRISE|CONTINUOUS|LATER|SAME)/i);
  if (!match) return 'DAY';
  const tod = match[1].toUpperCase();
  if (tod === 'MORNING' || tod === 'SUNRISE') return 'DAWN';
  if (tod === 'EVENING' || tod === 'DUSK' || tod === 'SUNSET') return 'DUSK';
  if (tod === 'CONTINUOUS' || tod === 'LATER' || tod === 'SAME' || tod === 'AFTERNOON') return 'DAY';
  return tod;
}

export function parseIntExt(heading = '') {
  const upper = heading.toUpperCase().trim();
  if (/^(?:INT\.?\s*[\/&]\s*EXT|EXT\.?\s*[\/&]\s*INT|I\s*\/\s*E)/i.test(upper)) return 'INT/EXT';
  if (/^EXT/i.test(upper)) return 'EXT';
  return 'INT';
}

export function parseSetName(heading = '') {
  if (!heading) return 'UNTITLED';
  let s = heading.trim().toUpperCase();
  // Strip leading scene numbers
  s = s.replace(/^\s*(?:SCENE\s+)?\d+[A-Z]?\s*[.\-:\/]?\s*/i, '');
  // Strip INT./EXT. prefixes
  s = s.replace(/^(?:INT\.?\s*[\/&]\s*EXT\.?|EXT\.?\s*[\/&]\s*INT\.?|I\s*\/\s*E|INT\.?|EXT\.?)\s*[-–—.]?\s*/i, '');
  // Strip time of day suffix
  s = s.split(/\s*[-–—,.]\s*(?:NIGHT|DAY|DAWN|DUSK|MORNING|EVENING|AFTERNOON|SUNSET|SUNRISE|CONTINUOUS|LATER|SAME)/i)[0];
  // Strip trailing notes or numbers
  s = s.split(/\s+[-–—]\s+/)[0].trim();
  // "HOUSE (COMPOUND - FRESH GRAVESITE)" is cut at the dash above; close the bracket it left open.
  if ((s.match(/\(/g) || []).length > (s.match(/\)/g) || []).length) s = `${s})`;
  return s || 'UNTITLED';
}

/* Word-boundary patterns only: a bare substring like /car/ matches "scar", "carry" and "careful",
   and /van/ matches "advance", which floods long scripts with vehicles that aren't there.
   Names are generic on purpose - the producer fills in make, model and plates later. */
const COMMON_PROPS = [
  { term: /\b(?:badges?|id cards?|credentials)\b/i, category: 'Props & Wardrobe', name: 'Badges & ID credentials', detail: 'As scripted' },
  { term: /\b(?:guns?|pistols?|revolvers?|rifles?|firearms?|holsters?)\b/i, category: 'Props & Armory', name: 'Firearms', detail: 'Armourer required' },
  { term: /\b(?:grenades?)\b/i, category: 'Props & Armory', name: 'Grenades (prop)', detail: 'Armourer required' },
  { term: /\b(?:gunfire|gunshots?|bullets?|shootout|muzzle flash(?:es)?)\b/i, category: 'Special Effects', name: 'Gunfire & bullet hits FX', detail: 'Armourer / SFX' },
  { term: /\b(?:explosions?|explodes?|blasts?|bombs?|detonatw*)\b/i, category: 'SFX & Pyro', name: 'Explosions & pyro', detail: 'Pyro safety tech' },
  { term: /\bsmoke\b/i, category: 'SFX & Pyro', name: 'Atmospheric smoke', detail: 'SFX' },
  { term: /\b(?:phones?|cellphones?|smartphones?|mobile phones?)\b/i, category: 'Props', name: 'Phones', detail: 'As scripted' },
  { term: /\bradios?\b/i, category: 'Props', name: 'Radio', detail: 'Period-correct' },
  { term: /\b(?:briefcases?|dossiers?|file folders?|documents|ledgers?|manifests?|envelopes?)\b/i, category: 'Props', name: 'Briefcase & documents', detail: 'Hero paperwork' },
  { term: /\b(?:money|cash|naira|dollars|banknotes|folded notes)\b/i, category: 'Props', name: 'Money / cash', detail: 'Prop currency' },
  { term: /\b(?:stretchers?|gurneys?|wheelchairs?|iv stands?|drips?|bandages?)\b/i, category: 'Props & Medical', name: 'Medical props & bandages', detail: 'As scripted' },
  { term: /\b(?:bottles?|champagne|whiskey|wine|beer|gin|calabash(?:es)?|glasses of)\b/i, category: 'Props & Set Dec', name: 'Drinks, bottles & glassware', detail: 'As scripted' },
  { term: /\b(?:cigarettes?|tobacco|match ?box)\b/i, category: 'Props', name: 'Cigarettes & tobacco', detail: 'Herbal / prop' },
  { term: /\blanterns?\b/i, category: 'Props & Set Dec', name: 'Lanterns', detail: 'Practical light' },
  { term: /\b(?:photographs?|photos?)\b/i, category: 'Props', name: 'Photographs', detail: 'Art dept to print' },
  { term: /\bflags?\b/i, category: 'Props & Set Dec', name: 'Flags & banners', detail: 'As scripted' },
  { term: /\b(?:coffins?|caskets?|graves?|gravesite)\b/i, category: 'Props & Set Dec', name: 'Coffin & grave', detail: 'As scripted' },
  { term: /\b(?:jackets?)\b/i, category: 'Wardrobe and Costume', name: 'Jackets', detail: 'As scripted' },
  { term: /\buniforms?\b/i, category: 'Wardrobe and Costume', name: 'Uniforms', detail: 'Sized & prepped' },
  { term: /\b(?:suits?|tuxedos?)\b/i, category: 'Wardrobe and Costume', name: 'Suits', detail: 'Fitted' },
  { term: /\b(?:traditional (?:outfits?|attire)|wrappers?|mourning clothes|gowns?)\b/i, category: 'Wardrobe and Costume', name: 'Traditional & principal costume', detail: 'Continuity logged' },
  { term: /\b(?:wounds?|wounded|blood|bleedw*|injur(?:y|ies|ed)|bruisw*|stitches|scars?)\b/i, category: 'Makeup and Hair', name: 'SFX makeup: wounds, blood & scars', detail: 'Makeup & Hair' },
  { term: /\b(?:crash(?:es|ed)?|skids?|pursuit|stunts?|collisions?)\b/i, category: 'SFX & Stunts', name: 'Vehicle stunts', detail: 'Stunt coordinator' },
  { term: /\b(?:fights?|fighting|punch(?:es)?|wrestlw*|stranglw*|slaps?)\b/i, category: 'Stunts and Action', name: 'Fight choreography', detail: 'Stunt coordinator' },
  { term: /\b(?:drownw*|water rescue|dives?)\b/i, category: 'Stunts and Action', name: 'Water stunt & safety divers', detail: 'Safety boat ready' },
  { term: /\b(?:made love|make love|making love|naked|nakedness|undressw*|forcw* himself on)\b/i, category: 'Intimacy Coordination', name: 'Intimacy / closed set', detail: 'Intimacy coordinator' },
];

const COMMON_VEHICLES = [
  { term: /\b(?:police (?:cars?|cruisers?|vans?)|patrol cars?)\b/i, name: 'Police vehicle', type: 'Police vehicle' },
  { term: /\b(?:military trucks?|army trucks?)\b/i, name: 'Military truck', type: 'Truck' },
  { term: /\b(?:taxis?|cabs?)\b/i, name: 'Taxi', type: 'Taxi' },
  // "the train rolls in" is a vehicle; "he trains rigorously" and the location "TRAIN STATION" are not.
  { term: /\b(?:train(?!\s+(?:station|stations|track|tracks)\b)|trains(?!\s+(?:hard|rigorously|daily|every)))\b/i, name: 'Train', type: 'Rail' },
  { term: /(?<!(?:military|army) )\b(?:trucks?|lorry|lorries|pickups?)\b/i, name: 'Truck', type: 'Truck / Van' },
  { term: /(?<!police )\bvans?\b/i, name: 'Van', type: 'Truck / Van' },
  { term: /\b(?:motorcycles?|motorbikes?|okadas?)\b/i, name: 'Motorcycle', type: 'Motorcycle' },
  { term: /\b(?:bicycles?|bikes?)\b/i, name: 'Bicycle', type: 'Bicycle' },
  { term: /\b(?:ambulances?)\b/i, name: 'Ambulance', type: 'Emergency' },
  { term: /\b(?:buses|bus)\b/i, name: 'Bus', type: 'Bus' },
  { term: /\b(?:boats?|canoes?|ferry|ferries|yachts?)\b/i, name: 'Boat', type: 'Watercraft' },
  { term: /\b(?:fighter jets?|jets?|aircraft|aeroplanes?|airplanes?|helicopters?)\b/i, name: 'Aircraft', type: 'Aircraft' },
  { term: /\b(?:jeeps?|suvs?|land ?rovers?)\b/i, name: 'Jeep / SUV', type: 'Car' },
  { term: /(?<!(?:police|patrol) )\b(?:cars?|sedans?|saloon cars?|limos?|limousines?|peugeot)\b/i, name: 'Car', type: 'Car' },
];

export function extractSceneElements(text = '', heading = '') {
  const combined = `${heading} ${text}`;
  const elements = [];
  const vehicles = [];

  COMMON_PROPS.forEach(item => {
    if (item.term.test(combined)) {
      if (!elements.some(e => e.name === item.name)) {
        elements.push({ category: item.category, name: item.name, detail: item.detail });
      }
    }
  });

  COMMON_VEHICLES.forEach(item => {
    if (item.term.test(combined)) {
      if (!vehicles.some(v => v.name === item.name)) {
        vehicles.push({ name: item.name, type: item.type });
      }
    }
  });

  // A specific vehicle already covers the generic one ("military truck" ... "the truck").
  const has = n => vehicles.some(v => v.name === n);
  const superseded = new Set([
    ...(has('Military truck') ? ['Truck'] : []),
    ...(has('Police vehicle') ? ['Car', 'Van'] : []),
  ]);

  return { elements, vehicles: vehicles.filter(v => !superseded.has(v.name)) };
}

export function extractFdxParagraphs(xmlText) {
  if (typeof window !== 'undefined' && window.DOMParser) {
    try {
      const doc = new window.DOMParser().parseFromString(xmlText, 'text/xml');
      const paras = Array.from(doc.querySelectorAll('Paragraph'));
      if (paras.length > 0) {
        return paras.map(p => ({
          type: p.getAttribute('Type') || '',
          number: p.getAttribute('Number') || '',
          text: Array.from(p.querySelectorAll('Text')).map(t => t.textContent || '').join('').trim(),
        })).filter(p => p.text);
      }
    } catch {}
  }
  // Regex fallback for XML parsing when DOMParser is unavailable
  const paras = [];
  const pRegex = /<Paragraph(?:\s+Type="([^"]*)")?(?:\s+Number="([^"]*)")?[^>]*>([\s\S]*?)<\/Paragraph>/gi;
  let match;
  while ((match = pRegex.exec(xmlText)) !== null) {
    const type = match[1] || '';
    const number = match[2] || '';
    const inner = match[3] || '';
    const textMatches = inner.match(/<Text[^>]*>([^<]*)<\/Text>/gi) || [];
    const text = textMatches.map(tm => tm.replace(/<[^>]+>/g, '')).join('').trim();
    if (text) paras.push({ type, number, text });
  }
  return paras;
}

export function parseFinalDraftXml(xmlText) {
  const outScenes = [];
  const charCounts = {};

  const paras = extractFdxParagraphs(xmlText);
  if (!paras.length) return { scenes: [], characters: [] };

  let cur = null;
  let actionLines = [];
  let fdxBody = [];
  let lineCount = 0;

  paras.forEach(p => {
    const type = p.type || '';
    const numberAttr = p.number;
    const text = p.text || '';
    if (!text) return;

    const isSceneHeading = /scene\s*heading/i.test(type) || HEADING_REGEX.test(text);

    if (isSceneHeading) {
      if (cur) {
        cur.synopsis = actionLines.slice(0, 3).join(' ') || cur.synopsis;
        const extracted = extractSceneElements(fdxBody.join(' '), cur.heading);
        cur.productionElements = extracted.elements;
        cur.pictureVehicles = extracted.vehicles;
        cur.pages8 = Math.max(1, Math.min(64, Math.round(lineCount / 7)));
        const isReady = cur.cast.length > 0 && cur.location && cur.dayNight && cur.pages8 > 0;
        cur.status = isReady ? 'ready' : 'incomplete';
        cur.ready = isReady;
        outScenes.push(cur);
      }

      const upper = text.toUpperCase();
      const ie = parseIntExt(upper);
      const dayNight = parseDayNight(upper);
      const loc = parseSetName(upper);
      const sceneNum = numberAttr || String(outScenes.length + 1);

      cur = {
        sceneNumber: sceneNum,
        heading: upper,
        intExt: ie,
        location: loc,
        dayNight,
        cast: [],
        talkingExtras: [],
        backgroundActors: 0,
        synopsis: '',
        pages8: 8,
        status: 'ready',
        ready: true,
      };
      actionLines = [];
      fdxBody = [];
      lineCount = 2;
    } else if (cur) {
      lineCount += Math.max(1, Math.ceil(text.length / 55));
      fdxBody.push(text);
      if (type === 'Action' || type === 'General') {
        if (actionLines.length < 5) actionLines.push(text);
      } else if (type === 'Character') {
        const cname = text.replace(/\(.*?\)/g, '').trim().toUpperCase();
        if (cname && cname.length < 35 && !cur.cast.includes(cname)) {
          cur.cast.push(cname);
          charCounts[cname] = (charCounts[cname] || 0) + 1;
        }
      }
    }
  });

  if (cur) {
    cur.synopsis = actionLines.slice(0, 3).join(' ') || cur.synopsis;
    const extracted = extractSceneElements(fdxBody.join(' '), cur.heading);
    cur.productionElements = extracted.elements;
    cur.pictureVehicles = extracted.vehicles;
    cur.pages8 = Math.max(1, Math.min(64, Math.round(lineCount / 7)));
    const isReady = cur.cast.length > 0 && cur.location && cur.dayNight && cur.pages8 > 0;
    cur.status = isReady ? 'ready' : 'incomplete';
    cur.ready = isReady;
    outScenes.push(cur);
  }

  const characters = Object.entries(charCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      tier: count >= 5 ? 'lead' : count >= 2 ? 'supporting' : 'day_player',
      scenes: count,
    }));

  return { scenes: outScenes, characters };
}

export function parseScriptText(rawText) {
  if (!rawText) return { scenes: [], characters: [] };

  const lines = rawText.split(/\r?\n/);
  const outScenes = [];
  const charCounts = {};

  let cur = null;
  let actionLines = [];
  let bodyLines = [];
  let lineCount = 0;

  // Scan the WHOLE scene for props and vehicles, not just the first few action lines —
  // in a long script most of what a scene needs is mentioned well past its opening lines.
  const closeScene = () => {
    if (!cur) return;
    cur.synopsis = actionLines.slice(0, 3).join(' ') || cur.synopsis;
    const extracted = extractSceneElements(bodyLines.join(' '), cur.heading);
    cur.productionElements = extracted.elements;
    cur.pictureVehicles = extracted.vehicles;
    cur.pages8 = Math.max(1, Math.min(64, Math.round(lineCount / 7)));
    const isReady = cur.cast.length > 0 && cur.location && cur.dayNight && cur.pages8 > 0;
    cur.status = isReady ? 'ready' : 'incomplete';
    cur.ready = isReady;
    outScenes.push(cur);
    cur = null;
  };

  const addCast = name => {
    if (!name || NON_CHARACTER_CUES.test(name) || cur.cast.includes(name)) return;
    cur.cast.push(name);
    charCounts[name] = (charCounts[name] || 0) + 1;
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    const m = line.match(HEADING_REGEX);
    if (m) {
      closeScene();

      // Long headings wrap onto a second line in PDFs ("... - BACK TO" / "PRESENT").
      const next = (lines[i + 1] || '').trim();
      if (next && HEADING_CONTINUATION.test(next) && /(?:[-–—,]|\bBACK TO|\bTO)\s*$/i.test(line)) {
        line = `${line} ${next}`;
        i += 1;
      }
      const mm = line.match(HEADING_REGEX) || m;

      let rawHeading = mm[2].trim().toUpperCase();
      // Numbered scripts repeat the scene number at the right margin: "1 EXT. STATION – NIGHT 1".
      if (mm[1]) rawHeading = rawHeading.replace(new RegExp(`\\s+${mm[1]}\\s*$`, 'i'), '').trim();
      const upper = rawHeading.startsWith('INT') || rawHeading.startsWith('EXT') || rawHeading.startsWith('I/E')
        ? rawHeading
        : `${parseIntExt(rawHeading)}. ${rawHeading}`;

      cur = {
        sceneNumber: mm[1] || String(outScenes.length + 1),
        heading: upper,
        intExt: parseIntExt(upper),
        location: parseSetName(upper),
        dayNight: parseDayNight(upper),
        cast: [],
        talkingExtras: [],
        backgroundActors: 0,
        synopsis: '',
        pages8: 8,
        status: 'ready',
        ready: true,
      };
      actionLines = [];
      bodyLines = [];
      lineCount = 2;
      continue;
    }

    // Numbered sub-scene inside the current set: "2 AT THE TAXI PARK: 2", "38 INSIDE AWELE'S ROOM: 38".
    const sub = cur ? matchSubSceneHeading(line) : null;
    if (sub) {
      const parent = cur;
      closeScene();
      cur = {
        sceneNumber: sub.number,
        heading: `${parent.intExt}. ${parent.location} – ${sub.title} - ${parent.dayNight}`,
        intExt: parent.intExt,
        location: parent.location,
        dayNight: parent.dayNight,
        cast: [],
        talkingExtras: [],
        backgroundActors: 0,
        synopsis: '',
        pages8: 8,
        status: 'ready',
        ready: true,
      };
      actionLines = [];
      bodyLines = [];
      lineCount = 2;
      continue;
    }

    if (!cur) continue;
    lineCount += 1;
    bodyLines.push(line);
    const cleanCue = line.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
    const isCue = /^[A-Z][A-Z0-9\s.'’\-\/]{1,40}$/.test(cleanCue)
      && !/^(?:CUT TO|FADE IN|FADE OUT|DISSOLVE TO|SMASH CUT|THE END|CONTINUED|TITLE CARD|MONTAGE|SERIES OF SHOTS)$/.test(cleanCue)
      && !cleanCue.endsWith('.') && !cleanCue.endsWith('!') && !cleanCue.endsWith('?');

    // Next line is dialogue or parenthetical
    const nextLine = (lines[i + 1] || '').trim();
    const followedByDialogue = nextLine && !HEADING_REGEX.test(nextLine) && nextLine.length > 0;

    if (isCue && followedByDialogue) {
      // Dual cue "AMAECHI/ ONOCHIE" — both characters speak.
      cleanCue.split(/\s*\/\s*/).map(n => n.trim()).filter(n => n.length > 1 && n.length <= 30).forEach(addCast);
    } else if (actionLines.length < 5 && !line.startsWith('(') && line.length > 10) {
      actionLines.push(line);
    }
  }

  closeScene();

  // Fallback pass for plain text if no scenes were identified using standard INT/EXT sluglines
  if (!outScenes.length) {
    cur = null;
    actionLines = [];
    lineCount = 0;
    lines.forEach(rawLine => {
      const line = rawLine.trim();
      if (!line) return;
      const m2 = line.match(SECONDARY_HEADING_REGEX);
      if (m2) {
        if (cur) {
          cur.synopsis = actionLines.slice(0, 3).join(' ') || cur.synopsis;
          const extracted = extractSceneElements(actionLines.join(' '), cur.heading);
          cur.productionElements = extracted.elements;
          cur.pictureVehicles = extracted.vehicles;
          cur.pages8 = Math.max(1, Math.min(64, Math.round(lineCount / 7)));
          outScenes.push(cur);
        }
        const sNum = m2[1] || m2[2] || String(outScenes.length + 1);
        const headingContent = (m2[3] || line).toUpperCase();
        const upper = headingContent.startsWith('INT') || headingContent.startsWith('EXT') ? headingContent : `INT. ${headingContent}`;
        cur = {
          sceneNumber: sNum,
          heading: upper,
          intExt: parseIntExt(upper),
          location: parseSetName(upper),
          dayNight: parseDayNight(upper),
          cast: [],
          talkingExtras: [],
          backgroundActors: 0,
          synopsis: '',
          pages8: 8,
          status: 'ready',
          ready: true,
        };
        actionLines = [];
        lineCount = 2;
      } else if (cur) {
        lineCount += 1;
        if (actionLines.length < 5 && line.length > 5) actionLines.push(line);
      }
    });
    if (cur) {
      cur.synopsis = actionLines.slice(0, 3).join(' ') || cur.synopsis;
      const extracted = extractSceneElements(actionLines.join(' '), cur.heading);
      cur.productionElements = extracted.elements;
      cur.pictureVehicles = extracted.vehicles;
      cur.pages8 = Math.max(1, Math.min(64, Math.round(lineCount / 7)));
      outScenes.push(cur);
    }
  }

  // 3rd Fallback: paragraph-based segmentation if neither regex found standard scene headings
  if (!outScenes.length && rawText && rawText.trim().length > 0) {
    const paragraphs = rawText.split(/\r?\n\s*\r?\n/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length > 0) {
      paragraphs.slice(0, 25).forEach((para, idx) => {
        const firstLine = para.split(/\r?\n/)[0].trim();
        const heading = `INT. SCENE ${idx + 1} - ${firstLine.slice(0, 35).toUpperCase()} - DAY`;
        const upper = heading.toUpperCase();
        const scene = {
          sceneNumber: String(idx + 1),
          heading: upper,
          intExt: 'INT',
          location: parseSetName(upper) || `LOCATION ${idx + 1}`,
          dayNight: 'DAY',
          cast: [],
          talkingExtras: [],
          backgroundActors: 0,
          synopsis: para.slice(0, 220),
          pages8: Math.max(1, Math.min(64, Math.round(para.length / 280))),
          status: 'ready',
          ready: true,
          productionElements: [],
          pictureVehicles: [],
        };
        const extracted = extractSceneElements(para, upper);
        scene.productionElements = extracted.elements;
        scene.pictureVehicles = extracted.vehicles;
        outScenes.push(scene);
      });
    }
  }

  // Final fallback: Ensure at least one default scene exists so breakdown never errors out
  if (!outScenes.length) {
    outScenes.push({
      sceneNumber: '1',
      heading: 'INT. PRODUCTION LOCATION - DAY',
      intExt: 'INT',
      location: 'PRODUCTION LOCATION',
      dayNight: 'DAY',
      cast: [],
      talkingExtras: [],
      backgroundActors: 0,
      synopsis: 'Scene created from uploaded script.',
      pages8: 8,
      status: 'ready',
      ready: true,
      productionElements: [],
      pictureVehicles: [],
    });
  }

  const characters = Object.entries(charCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      tier: count >= 5 ? 'lead' : count >= 2 ? 'supporting' : 'day_player',
      scenes: count,
    }));

  return { scenes: outScenes, characters };
}

export function parsePdfContentStream(streamText = '') {
  const extractedLines = [];
  const textBlocks = streamText.match(/BT[\s\S]*?ET/g) || [streamText];
  for (const block of textBlocks) {
    // Single string operators: (Text) Tj, ', "
    const tjMatches = block.matchAll(/\(((?:[^()\\\\]|\\\\.)*)\)\s*(?:Tj|'|")/g);
    for (const m of tjMatches) {
      const clean = m[1].replace(/\\([()\\])/g, '$1').trim();
      if (clean) extractedLines.push(clean);
    }
    // Array string operators: [(T) 10 (ext)] TJ
    const arrayMatches = block.matchAll(/\[(.*?)\]\s*TJ/gs);
    for (const arr of arrayMatches) {
      const inner = arr[1];
      const parts = [];
      const partMatches = inner.matchAll(/\(((?:[^()\\\\]|\\\\.)*)\)/g);
      for (const pm of partMatches) {
        const clean = pm[1].replace(/\\([()\\])/g, '$1');
        if (clean) parts.push(clean);
      }
      const line = parts.join('').trim();
      if (line) extractedLines.push(line);
    }
  }
  return extractedLines.join('\n');
}

export async function decompressStreamBytes(bytes) {
  if (typeof DecompressionStream === 'undefined' || typeof Response === 'undefined') {
    return '';
  }
  for (const format of ['deflate', 'deflate-raw']) {
    try {
      const ds = new DecompressionStream(format);
      const response = new Response(new Blob([bytes]).stream().pipeThrough(ds));
      const text = await response.text();
      if (text) return text;
    } catch {}
  }
  return '';
}

export async function extractTextFromPdfBuffer(buffer) {
  if (!buffer) return '';
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const textDecoder = new TextDecoder('latin1');
  const rawString = textDecoder.decode(bytes);
  let extractedText = '';

  // 1) Find stream ... endstream chunks
  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let match;
  while ((match = streamRegex.exec(rawString)) !== null) {
    const streamStart = match.index + match[0].indexOf('\n') + 1;
    const streamData = bytes.subarray(streamStart, streamStart + match[1].length);

    let content = await decompressStreamBytes(streamData);
    if (!content) {
      content = match[1];
    }
    if (content) {
      const textFromContent = parsePdfContentStream(content);
      if (textFromContent) {
        extractedText += textFromContent + '\n';
      }
    }
  }

  // 2) Fallback: if streams didn't yield text, search for plain text parenthesis strings
  if (!extractedText.trim()) {
    const literalMatches = rawString.matchAll(/\(((?:[^()\\\\]|\\\\.)*)\)\s*(?:Tj|'|")/g);
    for (const m of literalMatches) {
      const clean = m[1].replace(/\\([()\\])/g, '$1').trim();
      if (clean && clean.length > 1) {
        extractedText += clean + '\n';
      }
    }
  }

  return extractedText;
}

export function parseScriptFile(rawText = '', fileName = '') {
  const isFdx = fileName.toLowerCase().endsWith('.fdx') || (rawText && rawText.includes('<FinalDraft'));
  if (isFdx) {
    const fdxResult = parseFinalDraftXml(rawText);
    if (fdxResult.scenes.length > 0) return fdxResult;
  }
  const result = parseScriptText(rawText);
  if (!result.scenes || !result.scenes.length) {
    result.scenes = [{
      sceneNumber: '1',
      heading: 'INT. PRODUCTION LOCATION - DAY',
      intExt: 'INT',
      location: 'PRODUCTION LOCATION',
      dayNight: 'DAY',
      cast: [],
      talkingExtras: [],
      backgroundActors: 0,
      synopsis: 'Scene created from uploaded script.',
      pages8: 8,
      status: 'ready',
      ready: true,
      productionElements: [],
      pictureVehicles: [],
    }];
  }
  return result;
}
