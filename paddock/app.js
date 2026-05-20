
// ── CONFIG ────────────────────────────────────
const CONFIG = {
  ANTHROPIC_API_KEY: '',   
  MODEL: 'claude-sonnet-4-20250514',
  WEATHER_LAT: -34.9011,
  WEATHER_LNG: -56.1645,
  OLLAMA_MODEL: 'llama3.2:3b',  
  OPENROUTER_MODEL: 'google/gemma-3-27b-it:free',
  OPENROUTER_KEY: 'sk-or-v1-0000000000000000000000000000000000000000000000000000000000000000',
};

// ── STORAGE KEYS ──────────────────────────────
const DB_KEY    = 'pad_v4_clothes';
const FR_KEY    = 'pad_v4_frags';
const WW_KEY    = 'pad_v4_weights';
const OB_KEY    = 'pad_v4_onboarded';

// ── COLOR PALETTE ─────────────────────────────
const COLOR_MAP = {
  Black:'#1a1a1a', White:'#e8e8e8', Navy:'#1a2a4a', Blue:'#2a72c8',
  Grey:'#888', Gray:'#888', Red:'#c8392b', Teal:'#1d9e75',
  Brown:'#7a4a28', Beige:'#d4c4a0', Olive:'#6b7c3e', Silver:'#b0b8c8',
  Cream:'#f5f0e0', Cocoa:'#6b4226', Orange:'#e07820', Yellow:'#d4b800',
  Pink:'#e060a0', Purple:'#7060d0', Green:'#3a8c3a', Rust:'#b05030',
  Burgundy:'#8b2060',
};
const gc = (n) => COLOR_MAP[n] || '#aaa';

// ── STYLE RULES ───────────────────────────────
const VETOS = {
  'Shorts':          ['Boots','Loafers','Blazer'],
  'Jersey':          ['Blazer','Boots','Chinos'],
  'Running shoes':   ['Blazer','Chinos'],
  'Tank top':        ['Blazer'],
};
const OCC_REQUIRED_TAGS = {
  gym:    { 'inner top': ['sporty','gym'],        bottom: ['sporty','gym'],        shoes: ['sporty','gym'],       'outer top': null, hardware: null },
  street: { 'inner top': null,                    bottom: null,                    shoes: null,                   'outer top': null, hardware: null },
  casual: { 'inner top': null,                    bottom: null,                    shoes: null,                   'outer top': null, hardware: null },
  work:   { 'inner top': ['smart casual','formal','work'], bottom: ['smart casual','formal','work','versatile'], shoes: ['smart casual','formal'], 'outer top': null, hardware: null },
  formal: { 'inner top': ['formal','work'],        bottom: ['formal','work'],        shoes: ['formal'],            'outer top': null, hardware: null },
  date:   { 'inner top': null,                    bottom: null,                    shoes: null,                   'outer top': null, hardware: null },
};
const OCC_BANNED_TAGS = {
  gym:    { 'inner top': ['formal','work','smart casual'], bottom: ['formal','work','smart casual'], shoes: ['formal'], 'outer top': ['formal'], hardware: null },
  street: { 'inner top': ['formal','work'],                bottom: ['formal','work'],                shoes: ['formal'], 'outer top': ['formal'], hardware: null },
  casual: { 'inner top': ['formal','work'],                bottom: ['formal','work'],                shoes: ['formal'], 'outer top': ['formal'], hardware: null },
  work:   { 'inner top': ['sporty','gym'],                 bottom: ['sporty','gym'],                 shoes: ['gym'],    'outer top': null,        hardware: null },
  formal: { 'inner top': ['sporty','gym','casual'],        bottom: ['sporty','gym','casual'],         shoes: ['gym','sporty'], 'outer top': null,  hardware: null },
  date:   { 'inner top': ['gym'],                          bottom: ['gym'],                           shoes: ['gym'],    'outer top': null,        hardware: null },
};

const COMPS = {
  Navy:   ['Brown','Beige','White','Grey'],
  Black:  ['Grey','Teal','White','Red','Silver'],
  Olive:  ['Black','White','Cocoa','Beige'],
  Brown:  ['Navy','Olive','Cream','Beige'],
  White:  ['Black','Navy','Olive','Grey'],
  Grey:   ['Black','Navy','Burgundy'],
  Red:    ['Black','White','Grey'],
  Teal:   ['Black','White','Navy'],
};

// ── ITEM INFERENCE RULES ──────────────────────
const INFER_RULES = [
  { kw:['jersey','nba','nfl','bulls','lakers','heat','celtics','knicks','warriors','nets','spurs','miami','chicago'], tags:['sporty','casual','streetwear','merchandise'], form:1, warm:1, cat:'inner top', sub:'Jersey' },
  { kw:['hoodie','hoody'],          tags:['casual','streetwear','layering'], form:2, warm:4, cat:'outer top', sub:'Hoodie' },
  { kw:['sweatshirt','crewneck'],   tags:['casual','streetwear'],            form:2, warm:3, cat:'outer top', sub:'Sweatshirt' },
  { kw:['tanktop','tank top','tank','sleeveless','muscle'], tags:['sporty','casual','summer'], form:1, warm:1, cat:'inner top', sub:'Tank top' },
  { kw:['tshirt','t-shirt','tee'],  tags:['casual','basic','versatile'],     form:2, warm:1, cat:'inner top', sub:'T-shirt' },
  { kw:['polo'],                    tags:['smart casual','preppy'],          form:3, warm:1, cat:'inner top', sub:'Polo' },
  { kw:['shirt','button','oxford','flannel','chambray'], tags:['smart casual','versatile'], form:3, warm:2, cat:'inner top', sub:'Shirt' },
  { kw:['dress shirt','formal shirt','poplin'], tags:['formal','work'],      form:5, warm:2, cat:'inner top', sub:'Dress shirt' },
  { kw:['jeans','denim'],           tags:['casual','versatile','streetwear'],form:2, warm:3, cat:'bottom',    sub:'Jeans' },
  { kw:['chinos','chino','khaki'],  tags:['smart casual','work'],            form:3, warm:2, cat:'bottom',    sub:'Chinos' },
  { kw:['shorts'],                  tags:['casual','summer','sporty'],       form:1, warm:1, cat:'bottom',    sub:'Shorts' },
  { kw:['sweatpants','joggers','track pants','trackpants'], tags:['sporty','casual','lounge'], form:1, warm:3, cat:'bottom', sub:'Joggers' },
  { kw:['trousers','slacks','dress pants'], tags:['formal','work'],          form:4, warm:2, cat:'bottom',    sub:'Trousers' },
  { kw:['cargo'],                   tags:['casual','utility','streetwear'],  form:2, warm:2, cat:'bottom',    sub:'Cargo pants' },
  { kw:['jacket','windbreaker','shell'], tags:['casual','streetwear','layering'], form:2, warm:2, cat:'outer top', sub:'Jacket' },
  { kw:['blazer','sport coat'],     tags:['smart casual','work','formal'],   form:4, warm:2, cat:'outer top', sub:'Blazer' },
  { kw:['coat','overcoat','trench'],tags:['formal','winter'],                form:4, warm:5, cat:'outer top', sub:'Coat' },
  { kw:['puffer','down jacket','parka'], tags:['casual','winter'],           form:2, warm:5, cat:'outer top', sub:'Puffer' },
  { kw:['bomber'],                  tags:['casual','streetwear'],            form:2, warm:3, cat:'outer top', sub:'Bomber' },
  { kw:['zip up','zip-up','quarter zip'], tags:['sporty','casual'],          form:2, warm:3, cat:'outer top', sub:'Zip-up' },
  { kw:['sneakers','sneaker','trainers'], tags:['casual','sporty','streetwear'], form:2, warm:1, cat:'shoes',  sub:'Sneakers' },
  { kw:['running shoes','running'], tags:['sporty','gym'],                   form:1, warm:1, cat:'shoes',     sub:'Running shoes' },
  { kw:['basketball shoes','basketball'], tags:['sporty','streetwear'],      form:1, warm:1, cat:'shoes',     sub:'Basketball shoes' },
  { kw:['tennis shoes','tennis'],   tags:['sporty','smart casual'],          form:2, warm:1, cat:'shoes',     sub:'Tennis shoes' },
  { kw:['boots','boot','chelsea','combat','desert'], tags:['casual','streetwear','smart casual'], form:3, warm:4, cat:'shoes', sub:'Boots' },
  { kw:['loafers','loafer','moccasin'], tags:['smart casual','formal'],      form:4, warm:1, cat:'shoes',     sub:'Loafers' },
  { kw:['oxfords','oxford','derby','dress shoes','formal shoes'], tags:['formal','work'], form:5, warm:1, cat:'shoes', sub:'Oxford shoes' },
  { kw:['sandals','sandal','slides','slide'], tags:['casual','summer'],      form:1, warm:1, cat:'shoes',     sub:'Sandals' },
  { kw:['cap','hat','baseball cap','snapback','f1','formula 1','formula one','mclaren','ferrari','mercedes','redbull','red bull','alpine','williams'], tags:['casual','sporty','streetwear','merchandise'], form:1, warm:1, cat:'hardware', sub:'Cap' },
  { kw:['beanie','knit hat'],       tags:['casual','winter','streetwear'],   form:1, warm:5, cat:'hardware',  sub:'Beanie' },
  { kw:['chain','necklace'],        tags:['accessory','streetwear'],         form:3, warm:1, cat:'hardware',  sub:'Chain' },
  { kw:['bracelet','wristband'],    tags:['accessory','casual'],             form:2, warm:1, cat:'hardware',  sub:'Bracelet' },
  { kw:['watch','timepiece'],       tags:['accessory','smart casual'],       form:4, warm:1, cat:'hardware',  sub:'Watch' },
  { kw:['sunglasses','shades'],     tags:['accessory','casual','summer'],    form:2, warm:1, cat:'hardware',  sub:'Sunglasses' },
  { kw:['belt'],                    tags:['accessory','formal','smart casual'], form:3, warm:1, cat:'hardware', sub:'Belt' },
  { kw:['bag','backpack','tote'],   tags:['accessory','casual'],             form:2, warm:1, cat:'hardware',  sub:'Bag' },
];

function inferFromName(name) {
  const lower = name.toLowerCase();
  let tags = [], form = null, warm = null, cat = null, sub = null;
  for (const rule of INFER_RULES) {
    if (rule.kw.some(k => lower.includes(k))) {
      rule.tags.forEach(t => { if (!tags.includes(t)) tags.push(t); });
      if (rule.form && !form) form = rule.form;
      if (rule.warm && !warm) warm = rule.warm;
      if (rule.cat  && !cat)  cat  = rule.cat;
      if (rule.sub  && !sub)  sub  = rule.sub;
    }
  }
  return tags.length ? { tags, form: form||2, warm: warm||2, cat, sub } : null;
}

// ── I18N ──────────────────────────────────────
const T = {
  en: {
    generate:'GENERATE LOADOUT', generating:'CALCULATING...',
    emptyMsg:"Press Generate to build today's outfit",
    occasion:'OCCASION', wardrobe:'WARDROBE',
    tabGenerate:'GENERATE', tabWardrobe:'WARDROBE', tabAdd:'ADD',
    tabFragrances:'FRAGRANCES', tabProfile:'PROFILE',
    occ:{ gym:'GYM', street:'STREET', casual:'CASUAL', work:'WORK', date:'DATE', formal:'FORMAL' },
    addTitle:'ADD NEW ITEM', addSubmit:'ADD TO GARAGE',
    lName:'Item name', lCat:'Category', lSub:'Type (auto-filled)',
    lCol:'Color', lBrand:'Brand', lWarm:'Warmth', lWarmL:'Summer', lWarmR:'Winter',
    lForm:'Style level', lFormL:'Relaxed', lFormR:'Elegant',
    inferTitle:'Auto-detected attributes',
    fragSectionTitle:'YOUR BOTTLES',
    fragSectionSub:"Just type the name — we'll figure out the rest.",
    fragAddBtn:'ADD',
    fragInferLabel:'Detecting fragrance...',
    fragInferLoadingTxt:'Identifying fragrance profile',
    confirmYes:'Looks right — add it', confirmNo:'Cancel',
    fragEmpty:'No fragrances yet. Add your first bottle above.',
    chipLabels:{ summer:'Summer', winter:'Winter', 'all-year':'All year', morning:'Morning', afternoon:'Afternoon', night:'Night' },
    profileTitle:'STYLE PROFILE',
    profileEmpty:'Generate outfits and rate them to build your profile.',
    wardrobeEmpty:'Your wardrobe is empty',
    clean:'All clean', dirty:'All dirty', trends:'Sync trends',
    worn:'Worn', liked:'Liked', skipped:'Skipped',
    cleanPip:'Clean', dirtyPip:'Dirty',
    aiHeader:'Style tip', stratHeader:'STRATEGIC LOADOUT',
    inner:'Inner', outer:'Outer', bottom:'Bottom', shoes:'Shoes', hardware:'Hardware',
    feels:'Feels', humidity:'Humidity',
    noFrag:'No fragrance — add bottles in Fragrances tab',
    obSub:"Let's build your garage.",
    obStep1Title:'WHAT DO YOU WEAR?', obStep1Hint:"Select the pieces you own. Don't worry about details yet.",
    obStep2Title:'WHAT COLORS?',      obStep2Hint:'Pick the colors that dominate your wardrobe.',
    obStep3Title:'YOUR VIBE?',        obStep3Hint:'Where do you mostly wear your clothes?',
    obFinish:'FINISH', obNext:'NEXT', obSkip:'SKIP', obBack:'BACK',
    obEmptyTitle:'YOUR GARAGE IS EMPTY',
    obEmptyHint:'Start adding clothes to get outfit recommendations.',
    obEmptyCTA:'ADD FIRST ITEM',
  },
  es: {
    generate:'GENERAR OUTFIT', generating:'CALCULANDO...',
    emptyMsg:'Presioná Generar para armar el outfit del día',
    occasion:'OCASIÓN', wardrobe:'ARMARIO',
    tabGenerate:'GENERAR', tabWardrobe:'ARMARIO', tabAdd:'AÑADIR',
    tabFragrances:'FRAGANCIAS', tabProfile:'PERFIL',
    occ:{ gym:'GYM', street:'CALLE', casual:'CASUAL', work:'TRABAJO', date:'CITA', formal:'FORMAL' },
    addTitle:'NUEVO ITEM', addSubmit:'AÑADIR AL GARAGE',
    lName:'Nombre del item', lCat:'Categoría', lSub:'Tipo (auto)',
    lCol:'Color', lBrand:'Marca', lWarm:'Calidez', lWarmL:'Verano', lWarmR:'Invierno',
    lForm:'Nivel de estilo', lFormL:'Relajado', lFormR:'Elegante',
    inferTitle:'Atributos detectados',
    fragSectionTitle:'TUS BOTELLAS',
    fragSectionSub:'Solo escribí el nombre — nosotros hacemos el resto.',
    fragAddBtn:'AÑADIR',
    fragInferLabel:'Detectando fragancia...',
    fragInferLoadingTxt:'Identificando perfil olfativo',
    confirmYes:'Se ve bien — añadir', confirmNo:'Cancelar',
    fragEmpty:'Sin fragancias aún. Añadí tu primera botella arriba.',
    chipLabels:{ summer:'Verano', winter:'Invierno', 'all-year':'Todo el año', morning:'Mañana', afternoon:'Tarde', night:'Noche' },
    profileTitle:'PERFIL DE ESTILO',
    profileEmpty:'Generá outfits y valorálos para construir tu perfil.',
    wardrobeEmpty:'El armario está vacío',
    clean:'Todo limpio', dirty:'Todo sucio', trends:'Tendencias',
    worn:'Usado', liked:'Me gustó', skipped:'Ignorado',
    cleanPip:'Limpio', dirtyPip:'Sucio',
    aiHeader:'Consejo de estilo', stratHeader:'OUTFIT ESTRATÉGICO',
    inner:'Interior', outer:'Exterior', bottom:'Pantalón', shoes:'Calzado', hardware:'Accesorio',
    feels:'Sensación', humidity:'Humedad',
    noFrag:'Sin fragancia — añadí en Fragancias',
    obSub:'Armemos tu garage.',
    obStep1Title:'¿QUÉ TENÉS?',  obStep1Hint:'Seleccioná las prendas que tenés. Los detalles vienen después.',
    obStep2Title:'¿QUÉ COLORES?',obStep2Hint:'Elegí los colores que más predominan en tu armario.',
    obStep3Title:'¿CUÁL ES TU VIBE?', obStep3Hint:'¿Dónde usás tu ropa principalmente?',
    obFinish:'FINALIZAR', obNext:'SIGUIENTE', obSkip:'SALTAR', obBack:'ATRÁS',
    obEmptyTitle:'TU GARAGE ESTÁ VACÍO',
    obEmptyHint:'Empezá añadiendo ropa para recibir recomendaciones.',
    obEmptyCTA:'AÑADIR PRIMER ITEM',
  },
};
let lang = 'en';
const t  = (k) => T[lang][k] || k;

function toggleLang() {
  lang = lang === 'en' ? 'es' : 'en';
  document.getElementById('langLabel').textContent = lang.toUpperCase();
  applyLang();
  renderSidebar();
  renderAll();
}

function applyLang() {
  const L = T[lang];
  const ids = {
    genBtnTxt: L.generate, emptyMsg: L.emptyMsg,
    'sb-occ-label': L.occasion, 'sb-wardrobe-label': L.wardrobe,
    'tab-generate': L.tabGenerate, 'tab-wardrobe': L.tabWardrobe,
    'tab-add': L.tabAdd, 'tab-fragrances': L.tabFragrances, 'tab-profile': L.tabProfile,
    addTitle: L.addTitle, addSubmit: L.addSubmit,
    lName: L.lName, lCat: L.lCat, lSub: L.lSub, lCol: L.lCol, lBrand: L.lBrand,
    lWarm: L.lWarm, lWarmL: L.lWarmL, lWarmR: L.lWarmR,
    lForm: L.lForm, lFormL: L.lFormL, lFormR: L.lFormR,
    inferTitle: L.inferTitle,
    fragTitle: L.fragSectionTitle, fragSub: L.fragSectionSub,
    fragAddTxt: L.fragAddBtn,
    fragInferLabel: L.fragInferLabel, fragInferLoadingTxt: L.fragInferLoadingTxt,
    confirmYesTxt: L.confirmYes, confirmNoTxt: L.confirmNo,
    profileTitle: L.profileTitle,
  };
  Object.entries(ids).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
  renderOccGrid();
}

// ── STATE ─────────────────────────────────────
let wardrobe   = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
let fragrances = JSON.parse(localStorage.getItem(FR_KEY) || '[]');
let weights    = JSON.parse(localStorage.getItem(WW_KEY) || '{}');
let weather    = { temp: 20, humidity: 65 };
let occasion   = 'casual';
let lastOutfit = null;
let nextId     = wardrobe.length   ? Math.max(...wardrobe.map(g => g.id))   + 1 : 1;
let fragNextId = fragrances.length ? Math.max(...fragrances.map(f => f.id)) + 1 : 1;
let currentTab = 'generate';

// Item inference state
let inferDebounce  = null;
let currentInfer   = null;

// Fragrance inference state
let fragDebounce   = null;
let pendingFrag    = null;
let fragInferBusy  = false;

function saveDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(wardrobe));
  localStorage.setItem(FR_KEY, JSON.stringify(fragrances));
  localStorage.setItem(WW_KEY, JSON.stringify(weights));
}

// ── API HELPER ────────────────────────────────
async function callLLM(prompt, maxTokens = 200) {
  if (CONFIG.ANTHROPIC_API_KEY) {
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CONFIG.ANTHROPIC_API_KEY,
        },
        body: JSON.stringify({
          model: CONFIG.MODEL,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await resp.json();
      return data.content?.[0]?.text || '';
    } catch (e) { }
  }

  try {
    const resp = await fetch('http://localhost:11434/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CONFIG.OLLAMA_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.8,
      }),
    });
    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || '';
    if (text) return text;
  } catch (e) { }

  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.OPENROUTER_KEY}`,
      },
      body: JSON.stringify({
        model: CONFIG.OPENROUTER_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.8,
      }),
    });
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (e) {
    console.warn('Todos los backends fallaron: Anthropic, Ollama, OpenRouter.');
  }

  return ''; 
}

// ── WEATHER ───────────────────────────────────
async function fetchWeather() {
  document.getElementById('weatherText').textContent = '...';
  try {
    const r = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${CONFIG.WEATHER_LAT}&longitude=${CONFIG.WEATHER_LNG}&current=temperature_2m,relative_humidity_2m&timezone=auto`
    );
    const d = await r.json();
    weather.temp     = Math.round(d.current.temperature_2m);
    weather.humidity = Math.round(d.current.relative_humidity_2m);
  } catch (_) {}
  const tmp = weather.temp;
  document.getElementById('weatherText').textContent = `${tmp}°C · ${weather.humidity}%`;
  document.getElementById('wIcon').className =
    tmp < 14 ? 'ti ti-snowflake' : tmp < 21 ? 'ti ti-cloud' : 'ti ti-sun';
}
function refreshWeather() { fetchWeather(); }

// ── SCORE / ENGINE ────────────────────────────
function getW(k)      { return weights[k] || 1.0; }
function setW(k, v)   { weights[k] = Math.max(0.2, Math.min(3.5, v)); saveDB(); }

function scoreItem(item, palette, pickedSubs, targetForm) {
  const sub = item.sub_category;
  for (const ps of pickedSubs) {
    if ((VETOS[ps] && VETOS[ps].includes(sub)) ||
        (VETOS[sub] && VETOS[sub].includes(ps))) return -999;
  }
  let s = item.rating || 5;
  if (palette.includes(item.color)) s += 15;
  s -= Math.abs(item.formality - targetForm) * 6;
  s *= (getW('color_' + item.color) + getW('sub_' + item.sub_category)) / 2;
  s += Math.max(0, 5 - item.times_worn * 0.5);
  const tags = item.tags || [];
  if (targetForm <= 1 && tags.some(t => ['sporty','gym'].includes(t)))              s += 8;
  if (targetForm >= 4 && tags.some(t => ['formal','work','smart casual'].includes(t))) s += 8;
  if (targetForm === 2 && tags.some(t => ['casual','streetwear'].includes(t)))      s += 5;
  if (targetForm === 3 && tags.some(t => ['smart casual','versatile'].includes(t))) s += 5;
  return s;
}

function pickItem(cat, palette = [], pickedSubs = [], targetForm = 2) {
  const cands = wardrobe.filter(g => g.is_clean && g.category.toLowerCase() === cat.toLowerCase());
  if (!cands.length) return null;
  const scored = cands
    .map(c => [scoreItem(c, palette, pickedSubs, targetForm), c])
    .sort((a, b) => b[0] - a[0]);
  return scored[0][0] > -500 ? scored[0][1] : null;
}

function pickFragrance() {
  if (!fragrances.length) return null;
  const hour   = new Date().getHours();
  const moment = hour < 12 ? 'morning' : hour < 19 ? 'afternoon' : 'night';
  const tmp    = weather.temp;
  const matches = fragrances.filter(f => {
    const tokOk  = tmp >= (f.tempMin || 0) && tmp <= (f.tempMax || 40);
    const momOk  = (f.moments || []).includes(moment);
    return tokOk && momOk;
  });
  const pick = matches[0] || fragrances.filter(f => tmp >= (f.tempMin||0) && tmp <= (f.tempMax||40))[0] || fragrances[0];
  const momentLabel = { morning: T[lang].chipLabels.morning, afternoon: T[lang].chipLabels.afternoon, night: T[lang].chipLabels.night }[moment] || moment;
  return { frag: pick, reason: `${tmp}°C · ${momentLabel}` };
}

function buildOutfit() {
  const logs = [];
  let adj = weather.temp;
  if (weather.humidity > 70) {
    if (weather.temp > 24)  { adj += 3; logs.push(lang === 'en' ? `Feels hotter (${weather.humidity}% humidity)` : `Sensación aumentada (${weather.humidity}% hum.)`); }
    else if (weather.temp < 15) { adj -= 2; logs.push(lang === 'en' ? 'Feels colder due to damp air' : 'Sensación reducida por frío húmedo'); }
  }
  const targetForm = { gym:1, street:2, casual:2, work:4, formal:5, date:3 }[occasion] || 2;
  const inner = pickItem('inner top', [], [], targetForm);
  const pickedSubs = inner ? [inner.sub_category] : [];
  const palette = COMPS[inner?.color] || ['Black','Grey','White','Navy'];
  const bottom = pickItem('bottom', palette, pickedSubs, targetForm);
  if (bottom) pickedSubs.push(bottom.sub_category);
  const shoes    = pickItem('shoes',     palette, pickedSubs, targetForm);
  const hardware = pickItem('hardware',  palette, pickedSubs, targetForm);
  const outer    = adj < 21 ? pickItem('outer top', palette, pickedSubs, targetForm) : null;
  const fragResult = pickFragrance();
  return { inner, outer, bottom, shoes, hardware, fragResult, weather: { temp: weather.temp, adj, humidity: weather.humidity }, occasion, logs };
}

function recordFeedback(outfit, action) {
  const mult = { worn: 1.15, liked: 1.30, skipped: 0.80 }[action];
  if (!mult) return;
  [outfit.inner, outfit.outer, outfit.bottom, outfit.shoes, outfit.hardware]
    .filter(Boolean)
    .forEach(g => {
      ['color_' + g.color, 'sub_' + g.sub_category].forEach(k => setW(k, getW(k) * mult));
      if (action !== 'skipped') {
        const i = wardrobe.findIndex(w => w.id === g.id);
        if (i >= 0) { wardrobe[i].is_clean = false; wardrobe[i].times_worn++; }
      }
    });
  saveDB();
  renderSidebar();
}

// ── GENERATE ──────────────────────────────────
async function generateOutfit() {
  if (!wardrobe.length) {
    document.getElementById('outfitArea').innerHTML = `
      <div class="empty">
        <i class="ti ti-hanger" aria-hidden="true"></i>
        <p>${t('obEmptyTitle')}</p>
        <p style="font-size:12px;margin-top:6px">${t('obEmptyHint')}</p>
        <button class="cta" onclick="switchTab('add',document.getElementById('tab-add'))">${t('obEmptyCTA')}</button>
      </div>`;
    return;
  }
  const btn  = document.getElementById('genBtn');
  const area = document.getElementById('outfitArea');
  btn.disabled = true;
  document.getElementById('genBtnTxt').textContent = t('generating');
  area.innerHTML = `<div class="loading"><div style="font-family:var(--fd);font-size:16px;letter-spacing:3px;color:var(--ink2)">${t('generating')}</div><div class="dots"><span></span><span></span><span></span></div></div>`;

  const outfit = buildOutfit();
  lastOutfit = outfit;
  const items = [outfit.inner, outfit.outer, outfit.bottom, outfit.shoes, outfit.hardware].filter(Boolean);

  const prompt = lang === 'en'
    ? `You are Paddock, a sharp motorsport-inspired fashion AI. Montevideo, ${weather.temp}°C, ${weather.humidity}% humidity. Occasion: ${occasion}. Outfit: ${items.map(g => `${g.color} ${g.sub_category}`).join(', ')}. One punchy 2-sentence style tip in English. No emoji. No markdown.`
    : `Sos Paddock, una IA de moda con estética motorsport. Montevideo, ${weather.temp}°C, ${weather.humidity}% humedad. Ocasión: ${occasion}. Outfit: ${items.map(g => `${g.color} ${g.sub_category}`).join(', ')}. Un consejo de estilo en 2 oraciones, en español. Sin emojis. Sin markdown.`;

  let aiText = '';
  try { aiText = await callLLM(prompt, 160); } catch (_) {}

  renderOutfit(outfit, aiText, area);
  btn.disabled = false;
  document.getElementById('genBtnTxt').textContent = t('generate');
}

function renderOutfit(o, aiText, container) {
  const L = T[lang];
  const slots = [
    { key:'inner',    label:L.inner,    icon:'ti-shirt' },
    { key:'outer',    label:L.outer,    icon:'ti-jacket' },
    { key:'bottom',   label:L.bottom,   icon:'ti-layout-board-split' },
    { key:'shoes',    label:L.shoes,    icon:'ti-shoe' },
    { key:'hardware', label:L.hardware, icon:'ti-watch' },
  ];
  const slotsHTML = slots.map(s => {
    const g = o[s.key];
    return `<div class="outfit-slot">
      <i class="ti ${s.icon} slot-icon" aria-hidden="true"></i>
      <div class="slot-info">
        <div class="slot-cat">${s.label}</div>
        ${g
          ? `<div class="slot-name"><span class="cpip" style="background:${gc(g.color)}"></span>${g.color} ${g.sub_category}</div>`
          : `<div class="slot-empty">—</div>`}
      </div>
    </div>`;
  }).join('');

  const adj  = o.weather.adj;
  const wic  = adj < 14 ? 'ti-snowflake' : adj < 20 ? 'ti-cloud' : adj < 27 ? 'ti-sun' : 'ti-flame';
  const fr   = o.fragResult;
  const fragHTML = fr
    ? `<div class="frag-slot">
        <i class="ti ti-droplet" aria-hidden="true"></i>
        <div>
          <div class="frag-slot-name">${fr.frag.name}</div>
          ${fr.frag.type ? `<div class="frag-slot-type">${fr.frag.type}</div>` : ''}
          <div class="frag-slot-why">${fr.reason}</div>
        </div>
      </div>`
    : `<div class="frag-slot">
        <i class="ti ti-droplet" aria-hidden="true"></i>
        <div><div class="frag-slot-why" style="color:var(--ink3)">${L.noFrag}</div></div>
      </div>`;

  container.innerHTML = `
    ${aiText ? `<div class="ai-box"><span style="font-family:var(--fd);font-size:11px;letter-spacing:2px;opacity:.6">${L.aiHeader} · </span>${aiText}</div>` : ''}
    <div class="outfit-card">
      <div class="outfit-header">
        <span class="outfit-title">${L.stratHeader}</span>
        <span class="occ-badge">${L.occ[o.occasion] || o.occasion}</span>
      </div>
      <div class="weather-row">
        <i class="ti ${wic}" aria-hidden="true" style="font-size:17px;color:#2a5fa5"></i>
        <div class="w-stat"><span class="w-val">${o.weather.temp}°C</span><span class="w-lbl">Real</span></div>
        ${o.weather.adj !== o.weather.temp
          ? `<div class="w-stat"><span class="w-val">${o.weather.adj}°C</span><span class="w-lbl">${L.feels}</span></div>` : ''}
        <div class="w-stat"><span class="w-val">${o.weather.humidity}%</span><span class="w-lbl">${L.humidity}</span></div>
      </div>
      <div class="outfit-grid">${slotsHTML}</div>
      ${fragHTML}
      ${o.logs.length ? `<div class="logs">${o.logs.map(l => `<div class="log-line">› ${l}</div>`).join('')}</div>` : ''}
      <div class="feedback-row">
        <button class="fb-btn worn"    onclick="giveFeedback('worn')">   <i class="ti ti-check"  aria-hidden="true"></i> ${L.worn}</button>
        <button class="fb-btn liked"   onclick="giveFeedback('liked')">  <i class="ti ti-heart"  aria-hidden="true"></i> ${L.liked}</button>
        <button class="fb-btn skipped" onclick="giveFeedback('skipped')"><i class="ti ti-x"      aria-hidden="true"></i> ${L.skipped}</button>
      </div>
    </div>`;
}

function giveFeedback(action) {
  if (!lastOutfit) return;
  recordFeedback(lastOutfit, action);
  document.querySelectorAll('.fb-btn').forEach(b => b.disabled = true);
  const target = document.querySelector('.fb-btn.' + action);
  if (target) target.style.fontWeight = '700';
}

// ── SIDEBAR ───────────────────────────────────
const CAT_LABELS_MAP = {
  en: { 'inner top':'Inner', 'outer top':'Outer', bottom:'Bottom', shoes:'Shoes', hardware:'Hardware' },
  es: { 'inner top':'Interior', 'outer top':'Exterior', bottom:'Pantalón', shoes:'Calzado', hardware:'Accesorio' },
};

function renderOccGrid() {
  document.getElementById('occGrid').innerHTML =
    ['gym','street','casual','work','date','formal'].map(o =>
      `<div class="occ-btn${occasion === o ? ' active' : ''}" onclick="setOcc('${o}',this)">${T[lang].occ[o]}</div>`
    ).join('');
}

function setOcc(occ, el) {
  occasion = occ;
  document.querySelectorAll('.occ-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function renderSidebar() {
  renderOccGrid();
  const cats = ['inner top','outer top','bottom','shoes','hardware'];
  let html = '';
  cats.forEach(cat => {
    const items = wardrobe.filter(g => g.category === cat);
    if (!items.length) return;
    html += `<div class="cat-row">${CAT_LABELS_MAP[lang][cat] || cat}</div>`;
    items.forEach(g => {
      html += `<div class="g-item${g.is_clean ? '' : ' dirty'}">
        <span class="g-dot" style="background:${gc(g.color)}" aria-hidden="true"></span>
        <div style="flex:1;min-width:0">
          <div class="g-name">${g.color} ${g.sub_category}</div>
          <div class="g-sub-txt">${g.brand}</div>
        </div>
        <span style="font-size:10px;color:var(--ink3)">${g.is_clean ? '✓' : '○'}</span>
      </div>`;
    });
  });
  document.getElementById('sidebarList').innerHTML = html ||
    `<div style="font-size:12px;color:var(--ink3);padding:12px 0">${t('wardrobeEmpty')}</div>`;
}

// ── ADD ITEM ──────────────────────────────────
function onNameInput() {
  clearTimeout(inferDebounce);
  inferDebounce = setTimeout(() => {
    const name = document.getElementById('fName').value.trim();
    const box  = document.getElementById('inferBox');
    if (name.length < 3) { box.classList.remove('show'); currentInfer = null; return; }
    const result = inferFromName(name);
    if (!result) { box.classList.remove('show'); currentInfer = null; return; }
    currentInfer = result;
    if (result.cat) document.getElementById('fCat').value = result.cat;
    if (result.sub) document.getElementById('fSub').value  = result.sub;
    if (result.form) document.getElementById('fForm').value = result.form;
    if (result.warm) document.getElementById('fWarm').value = result.warm;
    const L = T[lang];
    document.getElementById('inferTags').innerHTML  = result.tags.map(t => `<span class="infer-tag">${t}</span>`).join('');
    document.getElementById('inferStats').innerHTML = `
      <div class="infer-stat">
        <span class="infer-stat-val">${['','Relaxed','Casual','Smart','Work','Formal'][result.form]}</span>
        <span class="infer-stat-lbl">${L.lFormL}/${L.lFormR}</span>
      </div>
      <div class="infer-stat">
        <span class="infer-stat-val">${['','Summer','Light','Mid','Warm','Winter'][result.warm]}</span>
        <span class="infer-stat-lbl">${L.lWarmL}/${L.lWarmR}</span>
      </div>`;
    box.classList.add('show');
  }, 300);
}

function addGarment() {
  const name = document.getElementById('fName').value.trim();
  const col  = document.getElementById('fCol').value.trim();
  const sub  = document.getElementById('fSub').value.trim() || name;
  if (!name || !col) {
    alert(lang === 'en' ? 'Fill in Name and Color' : 'Completá Nombre y Color');
    return;
  }
  wardrobe.push({
    id: nextId++,
    category:     document.getElementById('fCat').value,
    sub_category: sub,
    color:        col,
    brand:        document.getElementById('fBrand').value.trim() || '—',
    formality:    parseInt(document.getElementById('fForm').value) || 2,
    warmth:       parseInt(document.getElementById('fWarm').value) || 2,
    tags:         currentInfer?.tags || [],
    rating: 5, times_worn: 0, is_clean: true,
  });
  saveDB();
  renderSidebar();
  ['fName','fCol','fBrand','fSub'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('inferBox').classList.remove('show');
  currentInfer = null;
  switchTab('wardrobe', document.getElementById('tab-wardrobe'));
  renderWardrobeTab();
}

// ── WARDROBE TAB ──────────────────────────────
function renderWardrobeTab() {
  const L = T[lang];
  document.getElementById('wardrobeActions').innerHTML = `
    <button class="pill-btn" onclick="resetLaundry()">  <i class="ti ti-wash"         aria-hidden="true"></i> ${L.clean}</button>
    <button class="pill-btn" onclick="markAllDirty()">  <i class="ti ti-basket"       aria-hidden="true"></i> ${L.dirty}</button>
    <button class="pill-btn" onclick="syncTrends()">    <i class="ti ti-trending-up"  aria-hidden="true"></i> ${L.trends}</button>`;
  if (!wardrobe.length) {
    document.getElementById('fullWardrobeList').innerHTML =
      `<div class="empty"><i class="ti ti-hanger" aria-hidden="true"></i><p>${L.wardrobeEmpty}</p></div>`;
    return;
  }
  let html = '';
  ['inner top','outer top','bottom','shoes','hardware'].forEach(cat => {
    const items = wardrobe.filter(g => g.category === cat);
    if (!items.length) return;
    html += `<div class="full-cat-title">${(CAT_LABELS_MAP[lang][cat]||cat).toUpperCase()}</div>`;
    items.forEach(g => {
      const tags = g.tags || [];
      html += `<div class="full-g${g.is_clean ? '' : ' dirty'}">
        <span class="g-dot" style="width:10px;height:10px;background:${gc(g.color)};flex-shrink:0" aria-hidden="true"></span>
        <div class="full-g-info">
          <div class="full-g-name">${g.color} ${g.sub_category}</div>
          <div class="full-g-sub">${g.brand} · ×${g.times_worn} · ${g.is_clean ? L.cleanPip : L.dirtyPip}</div>
          ${tags.length ? `<div class="full-g-tags">${tags.map(t => `<span class="g-tag">${t}</span>`).join('')}</div>` : ''}
        </div>
        <div class="full-g-actions">
          <button class="icon-btn" onclick="toggleClean(${g.id})" title="${g.is_clean ? L.dirty : L.clean}">
            <i class="ti ${g.is_clean ? 'ti-basket' : 'ti-wash'}" aria-hidden="true"></i>
          </button>
          <button class="icon-btn del" onclick="deleteGarment(${g.id})">
            <i class="ti ti-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>`;
    });
  });
  document.getElementById('fullWardrobeList').innerHTML = html;
}

function toggleClean(id) {
  const i = wardrobe.findIndex(g => g.id === id);
  if (i >= 0) { wardrobe[i].is_clean = !wardrobe[i].is_clean; saveDB(); renderWardrobeTab(); renderSidebar(); }
}
function deleteGarment(id) { wardrobe = wardrobe.filter(g => g.id !== id); saveDB(); renderWardrobeTab(); renderSidebar(); }
function resetLaundry()    { wardrobe.forEach(g => g.is_clean = true);  saveDB(); renderWardrobeTab(); renderSidebar(); }
function markAllDirty()    { wardrobe.forEach(g => g.is_clean = false); saveDB(); renderWardrobeTab(); renderSidebar(); }
function syncTrends()      { wardrobe.forEach(g => g.rating = 5); ['Teal','Rust'].forEach(c => wardrobe.forEach(g => { if (g.color === c) g.rating = 8; })); saveDB(); }

// ── FRAGRANCES ────────────────────────────────
async function inferFragranceAI(name) {
  const prompt = lang === 'en'
    ? `You are a fragrance expert. The user has a bottle named: "${name}".
Identify this fragrance and return ONLY a JSON object:
- type: string — fragrance family (e.g. "Fresh Aquatic", "Woody Oriental", "Citrus", "Spicy Amber")
- desc: string — one short sentence on vibe and when to wear (max 15 words)
- seasons: array from ["summer","winter","all-year"]
- moments: array from ["morning","afternoon","night"]
- tempMin: integer — min comfortable temp in Celsius
- tempMax: integer — max comfortable temp in Celsius
Return ONLY valid JSON, no markdown.`
    : `Sos un experto en fragancias. Botella: "${name}".
Devolvé SOLO JSON:
- type: string — familia olfativa (ej: "Acuática Fresca", "Oriental Amaderada")
- desc: string — una oración corta, máx 15 palabras
- seasons: array de ["summer","winter","all-year"]
- moments: array de ["morning","afternoon","night"]
- tempMin: integer — temperatura mínima en Celsius
- tempMax: integer — temperatura máxima en Celsius
Solo JSON válido, sin markdown.`;
  const raw = await callLLM(prompt, 300);
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

function onFragInput() {
  const val = document.getElementById('fragInput').value.trim();
  clearTimeout(fragDebounce);
  if (val.length < 3) { document.getElementById('fragInferPreview').classList.remove('show'); pendingFrag = null; return; }
  fragDebounce = setTimeout(async () => {
    if (fragInferBusy) return;
    fragInferBusy = true;
    const preview = document.getElementById('fragInferPreview');
    preview.classList.add('show');
    document.getElementById('fragInferLoading').style.display = 'flex';
    document.getElementById('fragInferResult').classList.remove('show');
    document.getElementById('fragAddBtn').disabled = true;
    try {
      const result = await inferFragranceAI(val);
      pendingFrag = { name: val, ...result };
      renderFragInferResult(result);
    } catch (_) { preview.classList.remove('show'); }
    fragInferBusy = false;
    document.getElementById('fragAddBtn').disabled = false;
  }, 700);
}

function renderFragInferResult(r) {
  document.getElementById('fragInferLoading').style.display = 'none';
  document.getElementById('fragInferResult').classList.add('show');
  document.getElementById('fragInferType').textContent = r.type || '';
  document.getElementById('fragInferDesc').textContent = r.desc || '';
  const L = T[lang];
  document.getElementById('fragInferChips').innerHTML = [
    ...(r.seasons || []).map(s => `<span class="chip season">${L.chipLabels[s] || s}</span>`),
    ...(r.moments || []).map(m => `<span class="chip moment">${L.chipLabels[m] || m}</span>`),
    (r.tempMin != null && r.tempMax != null) ? `<span class="chip temp">${r.tempMin}°–${r.tempMax}°C</span>` : '',
  ].join('');
}

function confirmFrag() {
  if (!pendingFrag) return;
  fragrances.push({ id: fragNextId++, ...pendingFrag });
  saveDB();
  document.getElementById('fragInput').value = '';
  document.getElementById('fragInferPreview').classList.remove('show');
  pendingFrag = null;
  renderFragList();
}

function cancelFragInfer() {
  document.getElementById('fragInferPreview').classList.remove('show');
  pendingFrag = null;
}

function addFrag() {
  if (pendingFrag) { confirmFrag(); return; }
  const name = document.getElementById('fragInput').value.trim();
  if (!name) return;
  fragrances.push({ id: fragNextId++, name, type: '', desc: '', seasons: ['all-year'], moments: ['morning','afternoon','night'], tempMin: 0, tempMax: 40 });
  saveDB();
  document.getElementById('fragInput').value = '';
  renderFragList();
}

function renderFragList() {
  const L = T[lang];
  const el = document.getElementById('fragList');
  if (!fragrances.length) {
    el.innerHTML = `<div class="empty"><i class="ti ti-droplet" aria-hidden="true"></i><p>${L.fragEmpty}</p></div>`;
    return;
  }
  el.innerHTML = fragrances.map(f => {
    const chips = [
      ...(f.seasons || []).map(s  => `<span class="chip season">${L.chipLabels[s]  || s}</span>`),
      ...(f.moments || []).map(m  => `<span class="chip moment">${L.chipLabels[m]  || m}</span>`),
      (f.tempMin != null && f.tempMax != null) ? `<span class="chip temp">${f.tempMin}°–${f.tempMax}°C</span>` : '',
    ].join('');
    return `<div class="frag-item">
      <i class="ti ti-droplet frag-item-icon" aria-hidden="true"></i>
      <div class="frag-item-info">
        <div class="frag-item-name">${f.name}</div>
        ${f.type ? `<div class="frag-item-type">${f.type}</div>` : ''}
        ${f.desc ? `<div class="frag-item-desc">${f.desc}</div>` : ''}
        <div class="frag-item-chips">${chips}</div>
      </div>
      <button class="icon-btn del" onclick="deleteFrag(${f.id})"><i class="ti ti-trash" aria-hidden="true"></i></button>
    </div>`;
  }).join('');
}

function deleteFrag(id) { fragrances = fragrances.filter(f => f.id !== id); saveDB(); renderFragList(); }

// ── PROFILE ───────────────────────────────────
function renderProfile() {
  const L  = T[lang];
  const ws = Object.entries(weights).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const max = Math.max(...ws.map(w => w[1]), 1);
  document.getElementById('profileWeights').innerHTML = ws.length
    ? ws.map(([k, v]) => `
        <div class="wt-row">
          <span class="wt-key">${k}</span>
          <div class="wt-bar-wrap"><div class="wt-bar" style="width:${Math.round((v / max) * 100)}%"></div></div>
          <span class="wt-val">${v.toFixed(2)}x</span>
        </div>`).join('')
    : `<p style="color:var(--ink3);font-size:13px">${L.profileEmpty}</p>`;
}

// ── TABS ──────────────────────────────────────
function renderAll() {
  if (currentTab === 'wardrobe')    renderWardrobeTab();
  if (currentTab === 'fragrances')  renderFragList();
  if (currentTab === 'profile')     renderProfile();
}

function switchTab(name, el) {
  currentTab = name;
  ['generate','wardrobe','add','fragrances','profile'].forEach(t => {
    const p = document.getElementById('p' + t.charAt(0).toUpperCase() + t.slice(1));
    if (p) p.style.display = t === name ? 'block' : 'none';
  });
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  if (name === 'wardrobe')   renderWardrobeTab();
  if (name === 'fragrances') renderFragList();
  if (name === 'profile')    renderProfile();
}

// ── ONBOARDING ────────────────────────────────
const OB_ITEMS = [
  { name:'T-shirt / Tank top',  sub:'T-shirt',    icon:'ti-shirt',               cat:'inner top', form:1, warm:1, tags:['casual','basic'] },
  { name:'Shirt / Polo',        sub:'Shirt',       icon:'ti-shirt',               cat:'inner top', form:3, warm:2, tags:['smart casual'] },
  { name:'Hoodie / Sweatshirt', sub:'Hoodie',      icon:'ti-shirt',               cat:'outer top', form:2, warm:4, tags:['casual','streetwear'] },
  { name:'Jacket',              sub:'Jacket',      icon:'ti-jacket',              cat:'outer top', form:2, warm:3, tags:['casual','streetwear'] },
  { name:'Jeans',               sub:'Jeans',       icon:'ti-layout-board-split',  cat:'bottom',    form:2, warm:3, tags:['casual','versatile'] },
  { name:'Chinos / Trousers',   sub:'Chinos',      icon:'ti-layout-board-split',  cat:'bottom',    form:3, warm:2, tags:['smart casual'] },
  { name:'Shorts',              sub:'Shorts',      icon:'ti-layout-board-split',  cat:'bottom',    form:1, warm:1, tags:['casual','summer'] },
  { name:'Joggers',             sub:'Joggers',     icon:'ti-layout-board-split',  cat:'bottom',    form:1, warm:3, tags:['sporty','casual'] },
  { name:'Sneakers',            sub:'Sneakers',    icon:'ti-shoe',                cat:'shoes',     form:2, warm:1, tags:['casual','sporty'] },
  { name:'Boots',               sub:'Boots',       icon:'ti-shoe',                cat:'shoes',     form:3, warm:4, tags:['smart casual','winter'] },
  { name:'Dress shoes',         sub:'Dress shoes', icon:'ti-shoe',                cat:'shoes',     form:5, warm:1, tags:['formal'] },
  { name:'Cap / Hat',           sub:'Cap',         icon:'ti-baseball-cap',        cat:'hardware',  form:1, warm:1, tags:['casual','sporty'] },
  { name:'Chain / Watch',       sub:'Chain',       icon:'ti-watch',               cat:'hardware',  form:3, warm:1, tags:['accessory'] },
];
const OB_COLORS = ['Black','White','Navy','Grey','Brown','Olive','Red','Blue','Teal','Beige','Cream','Rust','Burgundy','Orange'];
const OB_VIBES  = [
  { id:'gym',    label:'GYM / SPORT',      icon:'ti-run' },
  { id:'street', label:'STREET / CASUAL',  icon:'ti-building-community' },
  { id:'work',   label:'WORK / OFFICE',    icon:'ti-briefcase' },
  { id:'date',   label:'DATE / NIGHT OUT', icon:'ti-moon' },
];

let obStep     = 0;
let obSelected = { items: [], colors: [], vibes: [] };

function startOnboarding() {
  obStep = 0; obSelected = { items: [], colors: [], vibes: [] };
  document.getElementById('obOverlay').style.display = 'flex';
  renderObStep();
}

function renderObProgress() {
  document.getElementById('obProgress').innerHTML =
    [0,1,2].map((_, i) => `<div class="ob-dot${i <= obStep ? ' done' : ''}"></div>`).join('');
}

function renderObStep() {
  renderObProgress();
  const L = T[lang];
  if (obStep === 0) {
    document.getElementById('obBody').innerHTML = `
      <div class="ob-step-label">${lang==='en'?'Step 1 of 3':'Paso 1 de 3'}</div>
      <div class="ob-step-title">${L.obStep1Title}</div>
      <div class="ob-step-hint">${L.obStep1Hint}</div>
      <div class="ob-items-grid">
        ${OB_ITEMS.map((it, i) => `
          <div class="ob-item${obSelected.items.includes(i) ? ' sel' : ''}" onclick="toggleObItem(${i})">
            <i class="ti ${it.icon} ob-item-icon" aria-hidden="true"></i>
            <div class="ob-item-name">${it.name}</div>
          </div>`).join('')}
      </div>`;
  } else if (obStep === 1) {
    document.getElementById('obBody').innerHTML = `
      <div class="ob-step-label">${lang==='en'?'Step 2 of 3':'Paso 2 de 3'}</div>
      <div class="ob-step-title">${L.obStep2Title}</div>
      <div class="ob-step-hint">${L.obStep2Hint}</div>
      <div class="ob-color-grid">
        ${OB_COLORS.map(c => `
          <div class="ob-color-wrap" onclick="toggleObColor('${c}')">
            <div class="ob-color${obSelected.colors.includes(c) ? ' sel' : ''}" style="background:${gc(c)};${c==='White'?'border:1px solid #ccc':''}"></div>
            <div class="ob-color-name">${c}</div>
          </div>`).join('')}
      </div>`;
  } else {
    document.getElementById('obBody').innerHTML = `
      <div class="ob-step-label">${lang==='en'?'Step 3 of 3':'Paso 3 de 3'}</div>
      <div class="ob-step-title">${L.obStep3Title}</div>
      <div class="ob-step-hint">${L.obStep3Hint}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px">
        ${OB_VIBES.map(v => `
          <div class="ob-item${obSelected.vibes.includes(v.id) ? ' sel' : ''}" onclick="toggleObVibe('${v.id}')">
            <i class="ti ${v.icon} ob-item-icon" aria-hidden="true"></i>
            <div class="ob-item-name" style="font-size:12px">${v.label}</div>
          </div>`).join('')}
      </div>`;
  }
  const isLast = obStep === 2;
  document.getElementById('obNav').innerHTML = `
    ${obStep > 0 ? `<button class="ob-btn secondary" onclick="obBack()">${L.obBack}</button>` : ''}
    <button class="ob-btn secondary" onclick="obSkip()">${L.obSkip}</button>
    <button class="ob-btn primary"   onclick="${isLast ? 'obFinish()' : 'obNext()'}">
      ${isLast ? L.obFinish : L.obNext}
    </button>`;
}

function toggleObItem(i)  { const idx = obSelected.items.indexOf(i);  idx>=0 ? obSelected.items.splice(idx,1)  : obSelected.items.push(i);  renderObStep(); }
function toggleObColor(c) { const idx = obSelected.colors.indexOf(c); idx>=0 ? obSelected.colors.splice(idx,1) : obSelected.colors.push(c); renderObStep(); }
function toggleObVibe(v)  { const idx = obSelected.vibes.indexOf(v);  idx>=0 ? obSelected.vibes.splice(idx,1)  : obSelected.vibes.push(v);  renderObStep(); }
function obNext()  { if (obStep < 2) { obStep++; renderObStep(); } }
function obBack()  { if (obStep > 0) { obStep--; renderObStep(); } }
function obSkip()  { obStep < 2 ? obNext() : obFinish(); }

function obFinish() {
  const colorPool = obSelected.colors.length ? obSelected.colors : ['Black','White','Navy','Grey'];
  obSelected.items.forEach(i => {
    const it = OB_ITEMS[i];
    colorPool.slice(0, 2).forEach(col => {
      wardrobe.push({ id: nextId++, category: it.cat, sub_category: it.sub, color: col, brand: '—', formality: it.form, warmth: it.warm, tags: it.tags, rating: 5, times_worn: 0, is_clean: true });
    });
  });
  if (obSelected.vibes.includes('gym'))    setW('vibe_sporty', 1.5);
  if (obSelected.vibes.includes('street')) setW('vibe_casual', 1.4);
  if (obSelected.vibes.includes('work'))   setW('vibe_formal', 1.4);
  if (obSelected.vibes.includes('date'))   setW('vibe_smart',  1.3);
  saveDB();
  localStorage.setItem(OB_KEY, '1');
  document.getElementById('obOverlay').style.display = 'none';
  renderSidebar();
}

// ── BOOT ──────────────────────────────────────
applyLang();
fetchWeather();
renderSidebar();
if (!localStorage.getItem(OB_KEY)) startOnboarding();
