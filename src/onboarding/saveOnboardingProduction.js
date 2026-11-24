import { saveOnboarding } from './storage.js';

// "30,000,000" or "30M" -> 30000000. Returns null when there is no usable number.
export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? Math.round(value) : null;
  const str = String(value ?? '').trim();
  if (!str) return null;
  if (/m$/i.test(str)) {
    const raw = Number(str.replace(/[^0-9.]/g, ''));
    return Number.isFinite(raw) && raw > 0 ? Math.round(raw * 1000000) : null;
  }
  if (/k$/i.test(str)) {
    const raw = Number(str.replace(/[^0-9.]/g, ''));
    return Number.isFinite(raw) && raw > 0 ? Math.round(raw * 1000) : null;
  }
  const n = Number(str.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

export const BUDGET_ALLOCATIONS = [
  { name: "Above the line", dept: "E - Creative Team", description: "Above the line", pct: 0.12, share: 12 },
  { name: "Production crew", dept: "D - Production Team", description: "Production crew", pct: 0.20, share: 20 },
  { name: "Talent & cast", dept: "F - Talents", description: "Talent & cast", pct: 0.08, share: 8 },
  { name: "Camera", dept: "G - Camera & Grip Team", description: "Camera", pct: 0.09, share: 9 },
  { name: "Lighting & grip", dept: "I - Light & Power Team", description: "Lighting & grip", pct: 0.07, share: 7 },
  { name: "Art department", dept: "M - Art Team", description: "Art department", pct: 0.06, share: 6 },
  { name: "Wardrobe & makeup", dept: "P - Wardrobe", description: "Wardrobe & makeup", pct: 0.04, share: 4 },
  { name: "Locations & permits", dept: "O - Location", description: "Locations & permits", pct: 0.08, share: 8 },
  { name: "Transport & logistics", dept: "S - Production Logistics", description: "Transport & logistics", pct: 0.05, share: 5 },
  { name: "Catering", dept: "T - Hospitality & Welfare", description: "Catering", pct: 0.04, share: 4 },
  { name: "Post-production", dept: "W - Post-Production Team", description: "Post-production", pct: 0.12, share: 12 },
  { name: "Contingency", dept: "V - Production Support", description: "Contingency", pct: 0.05, share: 5 },
];

/**
 * Persists the entire onboarding configuration into Supabase:
 * 1. Creates production row in `projects` with target_budget
 * 2. Structures and inserts 12 departmental budget lines in `budget_items`
 * 3. Creates schedule framework days in `schedule_days`
 * 4. Creates starter production breakdown scenes in `scenes`
 * 5. Updates user auth metadata & local onboarding completion
 * 6. Sets active project in localStorage so workspace opens directly to it
 */
export async function saveOnboardingProduction(supabase, user, profile) {
  if (!supabase || !user || !profile) return null;

  const baseCurrency = profile.currency || 'NGN';
  const prodName = (profile.productionName || profile.projectName || profile.title || profile.name || 'Untitled production').trim();
  const prodType = profile.productionType || profile.type || 'Feature Film';
  const shootingDaysCount = Math.max(1, Math.min(365, Number(profile.shootingDays) || 10));
  const locationsCount = Math.max(1, Math.min(50, Number(profile.locations) || 3));
  const crewSizeCount = Math.max(1, Number(profile.crewSize) || 19);

  // Parse or estimate budget amount
  let budgetNumber = toNumber(profile.budgetAmount);
  if (!budgetNumber) {
    budgetNumber = baseCurrency === 'NGN' ? 25000000 : (baseCurrency === 'USD' ? 25000 : 25000000);
  }

  // 1. Insert into projects
  const generatedId = (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID)
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

  let savedProject = null;
  const projectPayload = {
    id: generatedId,
    user_id: user.id,
    name: prodName,
    type: prodType,
    base_currency: baseCurrency,
    target_budget: budgetNumber,
  };

  const { data: pData, error: pErr } = await supabase.from('projects').insert(projectPayload).select().single();
  let finalErr = null;
  if (pErr) {
    console.warn('Project insert with explicit ID failed, retrying without ID:', pErr.message);
    const { data: retryData, error: retryErr } = await supabase.from('projects').insert({
      user_id: user.id,
      name: prodName,
      type: prodType,
      base_currency: baseCurrency,
      target_budget: budgetNumber,
    }).select().single();

    finalErr = retryErr;
    if (retryErr) {
      console.error('Could not save onboarding project:', retryErr.message);
      console.log("Project insert result:", { data: null, error: retryErr });
      return null;
    }
    savedProject = retryData;
  } else {
    savedProject = pData;
  }

  console.log("Project insert result:", { data: savedProject, error: finalErr || pErr });
  if (!savedProject || !savedProject.id) {
    return null;
  }

  const finalProjectId = savedProject.id;

  // 2. Generate and insert 12 structured departmental budget lines
  let runningTotal = 0;
  const budgetRows = BUDGET_ALLOCATIONS.map((alloc, idx) => {
    const isLast = idx === BUDGET_ALLOCATIONS.length - 1;
    const rate = isLast ? Math.max(0, budgetNumber - runningTotal) : Math.round(budgetNumber * alloc.pct);
    runningTotal += rate;
    return {
      id: Math.random().toString(36).slice(2, 10),
      project_id: finalProjectId,
      user_id: user.id,
      dept: alloc.dept,
      description: alloc.description,
      qty: 1,
      unit: 'flat',
      rate: Math.max(0, rate),
      currency: baseCurrency,
    };
  });

  const { error: bErr } = await supabase.from('budget_items').insert(budgetRows);
  if (bErr) {
    console.warn('Budget items insert with IDs failed, retrying without explicit IDs:', bErr.message);
    const noIds = budgetRows.map(({ id, ...rest }) => rest);
    await supabase.from('budget_items').insert(noIds);
  }

  // 3. Generate and insert schedule framework days
  const scheduleRows = Array.from({ length: shootingDaysCount }, (_, i) => ({
    id: Math.random().toString(36).slice(2, 10),
    project_id: finalProjectId,
    user_id: user.id,
    position: i,
    kind: 'shoot',
    scene_ids: [],
    cast_calls: {},
  }));
  const { error: sErr } = await supabase.from('schedule_days').insert(scheduleRows);
  if (sErr) {
    const noIds = scheduleRows.map(({ id, ...rest }) => rest);
    await supabase.from('schedule_days').insert(noIds);
  }

  // 4. Generate and insert starter breakdown scenes
  const sceneRows = Array.from({ length: locationsCount }, (_, i) => ({
    id: Math.random().toString(36).slice(2, 10),
    project_id: finalProjectId,
    user_id: user.id,
    data: {
      sceneNumber: String(i + 1),
      heading: i === 0 ? 'INT. PRIMARY LOCATION - DAY' : i === 1 ? 'EXT. CITY STREETS - DAY' : 'INT. STUDIO - NIGHT',
      location: profile.shootingLocation ? `${profile.shootingLocation} - Site ${i + 1}` : `Location ${i + 1}`,
      timeOfDay: i === 2 ? 'NIGHT' : 'DAY',
      intExt: i === 1 ? 'EXT' : 'INT',
      pages: '2 4/8',
      description: `Preliminary setup scene for ${prodName} (Location ${i + 1})`,
      characters: ['LEAD CAST', 'SUPPORTING'],
      crewNotes: `${crewSizeCount} crew members assigned`,
    }
  }));
  const { error: scErr } = await supabase.from('scenes').insert(sceneRows);
  if (scErr) {
    const noIds = sceneRows.map(({ id, ...rest }) => rest);
    await supabase.from('scenes').insert(noIds);
  }

  // 5. Update user metadata and local onboarding completion record
  const validRole = profile.roleId === 'producer' || profile.roleId === 'line_producer' || profile.roleId === 'production_manager' || profile.roleId === 'production_accountant'
    ? profile.roleId
    : 'producer';
  const validMarket = ['NGN', 'GHS', 'KES', 'ZAR', 'UGX', 'TZS'].includes(baseCurrency)
    ? baseCurrency
    : 'NGN';

  const onboardingRecord = {
    role: validRole,
    market: validMarket,
    roleLabel: profile.roleLabel || 'Executive Producer',
    roleCode: profile.roleCode || 'EP',
    country: profile.country || 'Nigeria',
    stateRegion: profile.stateRegion || '',
    completedAt: Date.now(),
  };

  try {
    saveOnboarding(user.id, onboardingRecord);
  } catch (err) {
    console.warn('Could not save local onboarding storage:', err);
  }

  try {
    await supabase.auth.updateUser({
      data: {
        role: profile.roleLabel || 'Executive Producer',
        role_code: profile.roleCode || 'EP',
        country: profile.country || 'Nigeria',
        state_region: profile.stateRegion || '',
        location: profile.locationLabel || profile.shootingLocation || '',
        currency: baseCurrency,
        onboarding: onboardingRecord,
        onboarding_completed: true,
      }
    });
  } catch (uErr) {
    console.warn('Could not update user metadata:', uErr);
  }

  // 6. Set active project in localStorage and clear stale cached workspace
  try {
    localStorage.setItem('nko_current_project_id', finalProjectId);
    localStorage.setItem(`nko_active_proj_${user.id}`, finalProjectId);
    const cacheKey = `nko_cache_ws_${user.id}`;
    localStorage.removeItem(cacheKey);
  } catch {}

  return savedProject;
}
