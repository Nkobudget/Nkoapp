/* ── Script Breakdown Parser for NKÒ ──
   Extracts scenes, characters, locations, production elements, and picture vehicles
   from Final Draft XML (.fdx), Fountain (.fountain), plain text (.txt), and PDF text.
*/

const HEADING_REGEX = /^\s*(?:\.?\s*)?(?:(?:SCENE\s+)?(\d+[A-Z]?)\s*[.\-:\/]?\s*)?((?:INT\.?\s*[\/&]\s*EXT\.?|EXT\.?\s*[\/&]\s*INT\.?|I\s*\/\s*E|INT\.?|EXT\.?)\b\s*.+)$/i;
const SECONDARY_HEADING_REGEX = /^\s*(?:SCENE\s+(\d+[A-Z]?)|(\d+)[.\-]\s+([A-Z0-9\s'–-]+(?:\s*[-–—]\s*(?:NIGHT|DAY|DAWN|DUSK|MORNING|EVENING|CONTINUOUS|LATER))?))/i;

const TOD_TERMS = ['NIGHT', 'DAY', 'DAWN', 'DUSK', 'MORNING', 'EVENING', 'AFTERNOON', 'SUNSET', 'SUNRISE', 'CONTINUOUS', 'LATER', 'SAME'];

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
  return s || 'UNTITLED';
}

const COMMON_PROPS = [
  { term: /badge|id card/i, category: 'Props & Wardrobe', name: 'Police Badges & Official Credentials', detail: 'Ready' },
  { term: /gun|pistol|revolver|rifle|weapon|holster/i, category: 'Props & Armory', name: 'Firearm & Tactical Holster', detail: 'Armory licensed' },
  { term: /phone|mobile|cellphone|smartphone/i, category: 'Props', name: 'Mobile Phone / Smartphone', detail: 'Hero prop' },
  { term: /briefcase|dossier|file folder|documents|ledger|manifest/i, category: 'Props', name: 'Confidential Dossier & Case Files', detail: 'Hero paperwork' },
  { term: /money|cash|naira|dollars|banknotes/i, category: 'Props', name: 'Currency Cash Bundles', detail: 'Prop currency' },
  { term: /stretcher|gurney|wheelchair|iv stand|drip/i, category: 'Props & Medical', name: 'Medical Stretcher & Clinical Vitals', detail: 'Hospital setup' },
  { term: /bottle|champagne|whiskey|drink|wine|glass/i, category: 'Props & Set Dec', name: 'Bar Service Bottles & Glassware', detail: 'Ready' },
  { term: /jacket|driver jacket|leather jacket/i, category: 'Wardrobe and Costume', name: "Driver's Jacket", detail: '× 3 · Ready' },
  { term: /uniform|police uniform|guard uniform/i, category: 'Wardrobe and Costume', name: 'Official Department Uniform', detail: 'Sized & prepped' },
  { term: /suit|designer suit|tuxedo/i, category: 'Wardrobe and Costume', name: 'Bespoke Executive Suit', detail: 'Fitted' },
  { term: /crash|skid|pursuit|stunt|collision/i, category: 'SFX & Stunts', name: 'Precision Stunt Driving Rig', detail: 'Safety coordinator briefed' },
  { term: /explosion|fire|blast|smoke/i, category: 'SFX & Pyro', name: 'Atmospheric Smoke & Flare SFX', detail: 'Pyro safety tech' },
];

const COMMON_VEHICLES = [
  { term: /taxi|cab|peugeot/i, name: "Adaobi's Taxi", type: 'Lead Character Vehicle', spec: '1984 Peugeot 504 · Classic Yellow & Black Lagos Taxi', detail: 'Static & moving' },
  { term: /police cruiser|patrol car|hilux|police van/i, name: 'Police Cruiser', type: 'Action Vehicle', spec: 'Toyota Hilux 4x4 · Red/Blue Beacon Bar', detail: 'Static & pursuit' },
  { term: /motorcycle|bike|okada/i, name: 'Motorcycle Courier', type: 'Secondary Vehicle', spec: 'Bajaj Boxer 100cc Dispatch Bike', detail: 'Running' },
  { term: /ambulance/i, name: 'Emergency Ambulance', type: 'Specialty Vehicle', spec: 'Toyota HiAce Emergency Medical Unit', detail: 'Permit ready' },
  { term: /boat|canoe|ferry/i, name: 'Lagoon Wooden Boat', type: 'Watercraft', spec: 'Outboard Motor Wooden Canoe', detail: 'Water safety crew' },
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
        vehicles.push({ name: item.name, detail: item.detail, spec: item.spec, type: item.type });
      }
    }
  });

  return { elements, vehicles };
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
        const extracted = extractSceneElements(actionLines.join(' '), cur.heading);
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
      lineCount = 2;
    } else if (cur) {
      lineCount += Math.max(1, Math.ceil(text.length / 55));
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
    const extracted = extractSceneElements(actionLines.join(' '), cur.heading);
    cur.productionElements = extracted.elements;
    cur.pictureVehicles = extracted.vehicles;
    cur.pages8 = Math.max(1, Math.min(64, Math.round(lineCount / 7)));
    const isReady = cur.cast.length > 0 && cur.location && cur.dayNight && cur.pages8 > 0;
    cur.status = isReady ? 'ready' : 'incomplete';
    cur.ready = isReady;
    outScenes.push(cur);
  }

  // Fallback pass if no scenes were identified using standard INT/EXT sluglines
  if (!outScenes.length) {
    cur = null;
    actionLines = [];
    lineCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
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
    }
    if (cur) {
      cur.synopsis = actionLines.slice(0, 3).join(' ') || cur.synopsis;
      const extracted = extractSceneElements(actionLines.join(' '), cur.heading);
      cur.productionElements = extracted.elements;
      cur.pictureVehicles = extracted.vehicles;
      cur.pages8 = Math.max(1, Math.min(64, Math.round(lineCount / 7)));
      outScenes.push(cur);
    }
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
  let lineCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const m = line.match(HEADING_REGEX);
    if (m) {
      if (cur) {
        cur.synopsis = actionLines.slice(0, 3).join(' ') || cur.synopsis;
        const extracted = extractSceneElements(actionLines.join(' '), cur.heading);
        cur.productionElements = extracted.elements;
        cur.pictureVehicles = extracted.vehicles;
        cur.pages8 = Math.max(1, Math.min(64, Math.round(lineCount / 7)));
        const isReady = cur.cast.length > 0 && cur.location && cur.dayNight && cur.pages8 > 0;
        cur.status = isReady ? 'ready' : 'incomplete';
        cur.ready = isReady;
        outScenes.push(cur);
      }

      const rawHeading = m[2].trim().toUpperCase();
      const upper = rawHeading.startsWith('INT') || rawHeading.startsWith('EXT') || rawHeading.startsWith('I/E')
        ? rawHeading
        : `${parseIntExt(rawHeading)}. ${rawHeading}`;

      const ie = parseIntExt(upper);
      const dayNight = parseDayNight(upper);
      const loc = parseSetName(upper);
      const sceneNum = m[1] || String(outScenes.length + 1);

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
      lineCount = 2;
    } else if (cur) {
      lineCount += 1;
      const cleanCue = line.replace(/\(.*?\)/g, '').trim();
      const isCue = /^[A-Z][A-Z0-9\s.'\-]{1,28}$/.test(cleanCue)
        && !/^(?:CUT TO|FADE IN|FADE OUT|DISSOLVE TO|SMASH CUT|THE END|CONTINUED|TITLE CARD|MONTAGE|SERIES OF SHOTS)$/.test(cleanCue)
        && !cleanCue.endsWith('.') && !cleanCue.endsWith('!') && !cleanCue.endsWith('?');

      // Next line is dialogue or parenthetical
      const nextLine = (lines[i + 1] || '').trim();
      const followedByDialogue = nextLine && !HEADING_REGEX.test(nextLine) && nextLine.length > 0;

      if (isCue && followedByDialogue) {
        if (!cur.cast.includes(cleanCue)) {
          cur.cast.push(cleanCue);
          charCounts[cleanCue] = (charCounts[cleanCue] || 0) + 1;
        }
      } else {
        if (actionLines.length < 5 && !line.startsWith('(') && line.length > 10) {
          actionLines.push(line);
        }
      }
    }
  }

  if (cur) {
    cur.synopsis = actionLines.slice(0, 3).join(' ') || cur.synopsis;
    const extracted = extractSceneElements(actionLines.join(' '), cur.heading);
    cur.productionElements = extracted.elements;
    cur.pictureVehicles = extracted.vehicles;
    cur.pages8 = Math.max(1, Math.min(64, Math.round(lineCount / 7)));
    const isReady = cur.cast.length > 0 && cur.location && cur.dayNight && cur.pages8 > 0;
    cur.status = isReady ? 'ready' : 'incomplete';
    cur.ready = isReady;
    outScenes.push(cur);
  }

  // Fallback pass if no scenes were identified using standard INT/EXT sluglines
  if (!outScenes.length) {
    cur = null;
    actionLines = [];
    lineCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
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
    }
    if (cur) {
      cur.synopsis = actionLines.slice(0, 3).join(' ') || cur.synopsis;
      const extracted = extractSceneElements(actionLines.join(' '), cur.heading);
      cur.productionElements = extracted.elements;
      cur.pictureVehicles = extracted.vehicles;
      cur.pages8 = Math.max(1, Math.min(64, Math.round(lineCount / 7)));
      outScenes.push(cur);
    }
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

export function parseScriptFile(rawText, fileName = '') {
  const isFdx = fileName.toLowerCase().endsWith('.fdx') || rawText.includes('<FinalDraft');
  if (isFdx) {
    const fdxResult = parseFinalDraftXml(rawText);
    if (fdxResult.scenes.length > 0) return fdxResult;
  }
  return parseScriptText(rawText);
}
