/*
  NKO — Budgets tailored just for you | Supabase Edition
  Single-file React + Vite + Supabase
*/
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

/* ── Supabase ── */
const SUPABASE_URL      = 'https://pvyrfjgrfmuvivdflcgg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KoI_EHwLNl8IlbB60Zgmng_TsuvaZUv';
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── Theme ── */
const T = {
  ink:'#0F0120', panel:'#1A0835', hi:'#23104A', line:'#3A1F6A',
  gold:'#FEED61', goldDim:'#8C852E', goldGlow:'rgba(254,237,97,0.12)',
  cream:'#F0E8D0', dim:'#9A9080', faint:'#5A4E6A',
  coral:'#E06B52', sage:'#52B07A', sapphire:'#4A90D9',
};

/* ── Constants ── */
const CURRENCIES=[
  {code:'NGN',symbol:'₦'},{code:'GHS',symbol:'₵'},{code:'KES',symbol:'KSh'},
  {code:'ZAR',symbol:'R'},{code:'UGX',symbol:'USh'},{code:'TZS',symbol:'TSh'},
  {code:'XOF',symbol:'Fr'},{code:'ETB',symbol:'Br'},{code:'USD',symbol:'$'},{code:'GBP',symbol:'£'},
];
const DEPTS=['Cast & Talent','Crew','Costume & Wardrobe','Hair & Make-up','Feeding & Welfare','Locations & Transport','Equipment','Post-Production','Marketing','Contingency'];
const UNITS=['day','week','flat','person','item'];
const PROJ_TYPES=['Feature Film','Vertical Series / Microdrama','Short Film','Music Video','Documentary','Branded Content','Animation / Cartoon','Other'];
const PAY_METHODS=['Cash','Bank Transfer','OPay / PalmPay','M-Pesa','MTN Mobile Money','Airtel Money','Cheque','Other'];
const EXPENSE_CATS=['Feeding','Transport','Fuel','Location fee','Props & materials','Equipment hire','Accommodation','Communication','Labour','Miscellaneous'];
const ACCENT_COLORS=['#FEED61','#E06B52','#52B07A','#4A90D9','#9B7FD4','#F5A623','#2ABFBF','#E8527A'];

/* ── Templates ── */
const TEMPLATES=[
  {id:'feature',label:'Feature Film (12-day)',type:'Feature Film',items:[
    {dept:'Cast & Talent',description:'Lead actor',qty:1,unit:'flat',rate:400000},
    {dept:'Cast & Talent',description:'Supporting cast (3)',qty:3,unit:'person',rate:80000},
    {dept:'Crew',description:'Director',qty:1,unit:'flat',rate:500000},
    {dept:'Crew',description:'Director of Photography',qty:1,unit:'flat',rate:300000},
    {dept:'Crew',description:'1st AC / Focus puller',qty:1,unit:'flat',rate:80000},
    {dept:'Crew',description:'Sound recordist',qty:1,unit:'flat',rate:100000},
    {dept:'Crew',description:'Boom operator',qty:1,unit:'flat',rate:60000},
    {dept:'Crew',description:'Gaffer',qty:1,unit:'flat',rate:80000},
    {dept:'Crew',description:'Art director',qty:1,unit:'flat',rate:100000},
    {dept:'Costume & Wardrobe',description:'Wardrobe / costume',qty:1,unit:'flat',rate:60000},
    {dept:'Hair & Make-up',description:'Hair & make-up artist',qty:1,unit:'flat',rate:60000},
    {dept:'Crew',description:'Production assistant (2)',qty:2,unit:'person',rate:30000},
    {dept:'Locations & Transport',description:'Location fees',qty:6,unit:'day',rate:50000},
    {dept:'Locations & Transport',description:'Cast transport',qty:12,unit:'day',rate:20000},
    {dept:'Feeding & Welfare',description:'Feeding (30 crew)',qty:12,unit:'day',rate:180000},
    {dept:'Feeding & Welfare',description:'Crew accommodation',qty:12,unit:'day',rate:60000},
    {dept:'Feeding & Welfare',description:'Unit supplies — water, first aid, consumables',qty:12,unit:'day',rate:10000},
    {dept:'Costume & Wardrobe',description:'Costume purchases & rentals',qty:1,unit:'flat',rate:80000},
    {dept:'Equipment',description:'Camera package',qty:12,unit:'day',rate:40000},
    {dept:'Equipment',description:'Lighting package',qty:12,unit:'day',rate:25000},
    {dept:'Equipment',description:'Generator hire',qty:12,unit:'day',rate:15000},
    {dept:'Post-Production',description:'Edit & colour grade',qty:1,unit:'flat',rate:300000},
    {dept:'Post-Production',description:'Sound design & mix',qty:1,unit:'flat',rate:120000},
    {dept:'Marketing',description:'Poster & key art',qty:1,unit:'flat',rate:80000},
    {dept:'Contingency',description:'Contingency (10%)',qty:1,unit:'flat',rate:250000},
  ]},
  {id:'vertical',label:'Vertical Series (7-day)',type:'Vertical Series / Microdrama',items:[
    {dept:'Cast & Talent',description:'Lead actor',qty:1,unit:'flat',rate:120000},
    {dept:'Cast & Talent',description:'Supporting cast (2)',qty:2,unit:'person',rate:40000},
    {dept:'Crew',description:'Director / DOP combo',qty:1,unit:'flat',rate:180000},
    {dept:'Crew',description:'Camera operator',qty:1,unit:'flat',rate:60000},
    {dept:'Crew',description:'Sound (boom & lav)',qty:1,unit:'flat',rate:50000},
    {dept:'Crew',description:'Script supervisor / continuity',qty:1,unit:'flat',rate:30000},
    {dept:'Hair & Make-up',description:'Hair & make-up artist',qty:1,unit:'flat',rate:40000},
    {dept:'Locations & Transport',description:'Location fees',qty:4,unit:'day',rate:20000},
    {dept:'Feeding & Welfare',description:'Feeding (15 crew)',qty:7,unit:'day',rate:60000},
    {dept:'Costume & Wardrobe',description:'Costume & wardrobe items',qty:1,unit:'flat',rate:40000},
    {dept:'Feeding & Welfare',description:'Unit supplies — water, consumables',qty:7,unit:'day',rate:5000},
    {dept:'Locations & Transport',description:'Cast & crew transport',qty:7,unit:'day',rate:15000},
    {dept:'Equipment',description:'Camera + gimbal package',qty:7,unit:'day',rate:20000},
    {dept:'Equipment',description:'Lighting (LED panels)',qty:7,unit:'day',rate:10000},
    {dept:'Post-Production',description:'Edit (all episodes)',qty:1,unit:'flat',rate:100000},
    {dept:'Post-Production',description:'Subtitles & captions',qty:1,unit:'flat',rate:20000},
    {dept:'Contingency',description:'Contingency (10%)',qty:1,unit:'flat',rate:70000},
  ]},
  {id:'shortfilm',label:'Short Film (2-day)',type:'Short Film',items:[
    {dept:'Cast & Talent',description:'Lead cast (2)',qty:2,unit:'person',rate:50000},
    {dept:'Crew',description:'Director',qty:1,unit:'flat',rate:80000},
    {dept:'Crew',description:'DOP',qty:1,unit:'flat',rate:60000},
    {dept:'Crew',description:'Sound recordist',qty:1,unit:'flat',rate:30000},
    {dept:'Crew',description:'Gaffer / lighting',qty:1,unit:'flat',rate:25000},
    {dept:'Hair & Make-up',description:'Hair & make-up artist',qty:1,unit:'flat',rate:20000},
    {dept:'Costume & Wardrobe',description:'Costume & wardrobe',qty:1,unit:'flat',rate:15000},
    {dept:'Feeding & Welfare',description:'Unit supplies — water, consumables',qty:2,unit:'day',rate:5000},
    {dept:'Locations & Transport',description:'Location fee',qty:1,unit:'flat',rate:30000},
    {dept:'Feeding & Welfare',description:'Feeding (10 crew)',qty:2,unit:'day',rate:30000},
    {dept:'Equipment',description:'Camera package',qty:2,unit:'day',rate:25000},
    {dept:'Equipment',description:'Lighting',qty:2,unit:'day',rate:15000},
    {dept:'Post-Production',description:'Edit & grade',qty:1,unit:'flat',rate:60000},
    {dept:'Contingency',description:'Contingency (10%)',qty:1,unit:'flat',rate:40000},
  ]},
  {id:'musicvideo',label:'Music Video (1-day)',type:'Music Video',items:[
    {dept:'Cast & Talent',description:'Artist fee',qty:1,unit:'flat',rate:200000},
    {dept:'Cast & Talent',description:'Dancers / background (6)',qty:6,unit:'person',rate:20000},
    {dept:'Crew',description:'Director',qty:1,unit:'flat',rate:300000},
    {dept:'Crew',description:'DOP',qty:1,unit:'flat',rate:150000},
    {dept:'Hair & Make-up',description:'Hair & make-up artist',qty:1,unit:'flat',rate:60000},
    {dept:'Costume & Wardrobe',description:'Wardrobe stylist',qty:1,unit:'flat',rate:50000},
    {dept:'Locations & Transport',description:'Location fee',qty:1,unit:'flat',rate:50000},
    {dept:'Feeding & Welfare',description:'Feeding',qty:1,unit:'day',rate:80000},
    {dept:'Costume & Wardrobe',description:'Costume purchases',qty:1,unit:'flat',rate:60000},
    {dept:'Feeding & Welfare',description:'Unit supplies — water, consumables',qty:1,unit:'day',rate:10000},
    {dept:'Equipment',description:'Camera + crane / drone',qty:1,unit:'day',rate:80000},
    {dept:'Equipment',description:'Lighting package',qty:1,unit:'day',rate:40000},
    {dept:'Post-Production',description:'Edit & grade',qty:1,unit:'flat',rate:150000},
    {dept:'Marketing',description:'Thumbnail & promo',qty:1,unit:'flat',rate:30000},
    {dept:'Contingency',description:'Contingency (10%)',qty:1,unit:'flat',rate:120000},
  ]},
  {id:'documentary',label:'Documentary (5-day)',type:'Documentary',items:[
    {dept:'Cast & Talent',description:'Principal subjects (2)',qty:2,unit:'flat',rate:0},
    {dept:'Crew',description:'Director',qty:1,unit:'flat',rate:200000},
    {dept:'Crew',description:'DOP / camera',qty:1,unit:'flat',rate:150000},
    {dept:'Crew',description:'Sound recordist',qty:1,unit:'flat',rate:80000},
    {dept:'Crew',description:'Researcher / producer',qty:1,unit:'flat',rate:100000},
    {dept:'Locations & Transport',description:'Location permits',qty:3,unit:'item',rate:20000},
    {dept:'Locations & Transport',description:'Field transport',qty:5,unit:'day',rate:25000},
    {dept:'Feeding & Welfare',description:'Feeding (6 crew)',qty:5,unit:'day',rate:36000},
    {dept:'Feeding & Welfare',description:'Field accommodation',qty:4,unit:'day',rate:40000},
    {dept:'Hair & Make-up',description:'Hair & make-up (interview days)',qty:2,unit:'day',rate:10000},
    {dept:'Feeding & Welfare',description:'Unit supplies — water, consumables',qty:5,unit:'day',rate:5000},
    {dept:'Equipment',description:'Camera (run-and-gun)',qty:5,unit:'day',rate:30000},
    {dept:'Equipment',description:'Lapel & boom mics',qty:5,unit:'day',rate:10000},
    {dept:'Post-Production',description:'Edit & grade',qty:1,unit:'flat',rate:200000},
    {dept:'Post-Production',description:'Music licence / score',qty:1,unit:'flat',rate:60000},
    {dept:'Contingency',description:'Contingency (10%)',qty:1,unit:'flat',rate:90000},
  ]},
  {id:'branded',label:'Branded Content (1-day)',type:'Branded Content',items:[
    {dept:'Cast & Talent',description:'Host / presenter',qty:1,unit:'flat',rate:150000},
    {dept:'Crew',description:'Director',qty:1,unit:'flat',rate:200000},
    {dept:'Crew',description:'DOP',qty:1,unit:'flat',rate:120000},
    {dept:'Crew',description:'Sound recordist',qty:1,unit:'flat',rate:50000},
    {dept:'Hair & Make-up',description:'Hair & make-up artist',qty:1,unit:'flat',rate:40000},
    {dept:'Locations & Transport',description:'Studio / location',qty:1,unit:'flat',rate:100000},
    {dept:'Feeding & Welfare',description:'Feeding',qty:1,unit:'day',rate:50000},
    {dept:'Costume & Wardrobe',description:'Costume & styling',qty:1,unit:'flat',rate:30000},
    {dept:'Equipment',description:'Camera + lights',qty:1,unit:'day',rate:60000},
    {dept:'Feeding & Welfare',description:'Unit supplies — water, consumables',qty:1,unit:'day',rate:8000},
    {dept:'Post-Production',description:'Edit & graphics / lower thirds',qty:1,unit:'flat',rate:100000},
    {dept:'Marketing',description:'Social cutdowns (3)',qty:3,unit:'item',rate:20000},
    {dept:'Contingency',description:'Contingency (10%)',qty:1,unit:'flat',rate:90000},
  ]},
  {id:'animation',label:'Animation / Cartoon',type:'Animation / Cartoon',items:[
    {dept:'Cast & Talent',description:'Lead voice actor',qty:1,unit:'flat',rate:150000},
    {dept:'Cast & Talent',description:'Supporting voice cast (3)',qty:3,unit:'person',rate:50000},
    {dept:'Crew',description:'Animation director',qty:1,unit:'flat',rate:300000},
    {dept:'Crew',description:'Lead character animator',qty:1,unit:'flat',rate:200000},
    {dept:'Crew',description:'Background / environment artist',qty:1,unit:'flat',rate:100000},
    {dept:'Crew',description:'Storyboard artist',qty:1,unit:'flat',rate:80000},
    {dept:'Crew',description:'Colourist / compositor',qty:1,unit:'flat',rate:120000},
    {dept:'Crew',description:'Sound designer & composer',qty:1,unit:'flat',rate:100000},
    {dept:'Equipment',description:'Animation workstations (2)',qty:2,unit:'item',rate:50000},
    {dept:'Equipment',description:'Software licences',qty:1,unit:'flat',rate:80000},
    {dept:'Equipment',description:'Drawing tablets',qty:2,unit:'item',rate:30000},
    {dept:'Equipment',description:'Recording studio (voice)',qty:1,unit:'day',rate:60000},
    {dept:'Feeding & Welfare',description:'Feeding — studio and voice days',qty:5,unit:'day',rate:15000},
    {dept:'Post-Production',description:'Episode render & assembly',qty:1,unit:'flat',rate:80000},
    {dept:'Post-Production',description:'Sound mix & subtitles',qty:1,unit:'flat',rate:40000},
    {dept:'Marketing',description:'Promo art & trailer',qty:1,unit:'flat',rate:50000},
    {dept:'Contingency',description:'Contingency (10%)',qty:1,unit:'flat',rate:130000},
  ]},
];

/* ── Creators ── */
const CREATORS=[
  {id:'c1',name:'Zestyn Media',role:'Production Company',loc:'Lagos',verified:true,downloads:196},
  {id:'c2',name:'Lagos Digital Lab',role:'Digital Studio',loc:'Lagos',verified:true,downloads:98},
  {id:'c3',name:'Rhythm House',role:'Music Video Director',loc:'Abuja',verified:true,downloads:87},
  {id:'c4',name:'Pan-African Docs',role:'Documentary Studio',loc:'Accra',verified:false,downloads:63},
  {id:'c5',name:'Toon Studios NG',role:'Animation Studio',loc:'Lagos',verified:true,downloads:35},
  {id:'c6',name:'Indie Africa',role:'Independent Filmmaker',loc:'Nairobi',verified:false,downloads:41},
];

/* ── Community templates with bundled breakdown scenes ── */
const mkScene=(num,heading,ie,dn,cast,props,notes)=>({
  sceneNumber:num,heading,intExt:ie,dayNight:dn,
  cast:cast||[],extras:'',location:heading.split(' - ')[0].replace(/INT\.|EXT\./,'').trim(),
  props:props||[],vehicles:[],wardrobe:[],hairMakeup:'Per character brief',
  specialEquip:[],vfxSfx:'None',sound:'Location sound',notes:notes||''
});

const COMMUNITY_TEMPLATES=[
  {id:'ct1',label:'Nollywood TV Drama',author:'Zestyn Media',type:'Feature Film',
   sub:'13-episode primetime drama',downloads:142,
   items:TEMPLATES.find(t=>t.id==='feature').items,
   scenes:[
     mkScene('1','INT. HOUSE - DAY','INT','DAY',['Lead','Mother'],'Phone, documents','Establish character world before conflict'),
     mkScene('2','EXT. STREET - DAY','EXT','DAY',['Lead','Antagonist'],'Car, bag','Traffic control permit required'),
     mkScene('3','INT. OFFICE - DAY','INT','DAY',['Lead','Boss','Secretary'],'Files, laptop','Lock location night before'),
     mkScene('4','EXT. COMPOUND - NIGHT','EXT','NIGHT',['Lead','Antagonist'],'Torch','Night shoot — budget extra feeding and transport'),
   ]},
  {id:'ct2',label:'Vertical Thriller Series',author:'Lagos Digital Lab',type:'Vertical Series / Microdrama',
   sub:'Social media vertical, 60-90 sec episodes',downloads:98,
   items:TEMPLATES.find(t=>t.id==='vertical').items,
   scenes:[
     mkScene('Ep 1','INT. SITTING ROOM - DAY','INT','DAY',['Lead','Mother-in-law'],'Phone, food items','Shoot multiple scenes per location per day'),
     mkScene('Ep 2','EXT. COMPOUND - DAY','EXT','DAY',['Lead','Neighbour'],'Luggage, broom','Compound scenes — drone for establishing shot'),
     mkScene('Ep 3-5','INT / EXT. VARIOUS - DAY','INT','DAY',['All main cast'],'Per scene','Block shoot by location to save time and budget'),
   ]},
  {id:'ct3',label:'Afrobeats Music Video',author:'Rhythm House',type:'Music Video',
   sub:'Performance and narrative hybrid, 2-day shoot',downloads:87,
   items:TEMPLATES.find(t=>t.id==='musicvideo').items,
   scenes:[
     mkScene('Perf','EXT. HERO LOCATION - DAY','EXT','DAY',['Artist','Dancers x6'],'Mic prop, branded items','Shoot performance first while energy is high'),
     mkScene('Narr','INT. STORY LOCATION - DAY','INT','DAY',['Artist','Co-star'],'Story props','Keep narrative and performance on separate halves of the day'),
   ]},
  {id:'ct4',label:'Documentary Dispatch',author:'Pan-African Docs',type:'Documentary',
   sub:'Field journalism, East African rates',downloads:63,
   items:TEMPLATES.find(t=>t.id==='documentary').items,
   scenes:[
     mkScene('OTV','EXT. ESTABLISHING - DAY','EXT','DAY',[],'None','Record 5 min of wild track on arrival'),
     mkScene('INT','INT. INTERVIEW SETUP - DAY','INT','DAY',['Subject'],'Background items','Turn off AC before rolling'),
     mkScene('OBS','EXT. OBSERVATIONAL - DAY','EXT','DAY',['Subject'],'Whatever is naturally there','Disappear — do not direct the subject'),
   ]},
  {id:'ct5',label:'Brand Content Series',author:'Zestyn Media',type:'Branded Content',
   sub:'Branded episodic, corporate client',downloads:54,
   items:TEMPLATES.find(t=>t.id==='branded').items,
   scenes:[
     mkScene('Hero','INT. STUDIO - DAY','INT','DAY',['Host'],'Product prominently placed','Send shot list to client before shoot day'),
     mkScene('Test','INT. CLEAN INTERIOR - DAY','INT','DAY',['Customer / talent'],'Product natural in frame','Get 5 takes minimum — clients always want variations'),
   ]},
  {id:'ct6',label:'Festival Short Film',author:'Indie Africa',type:'Short Film',
   sub:'15-minute short, festival circuit',downloads:41,
   items:TEMPLATES.find(t=>t.id==='shortfilm').items,
   scenes:[
     mkScene('1','INT. ROOM - DAY','INT','DAY',['Lead'],'Letter, phone','This scene sets the entire film — spend time on it'),
     mkScene('2','EXT. STREET - DAY','EXT','DAY',['Lead','Stranger'],'The letter from scene 1','Guerrilla shoot if possible'),
     mkScene('3','INT. LOCATION - DUSK','INT','DUSK',['Lead'],'Minimal','End on an image not a speech'),
   ]},
  {id:'ct7',label:'African Cartoon Episode',author:'Toon Studios NG',type:'Animation / Cartoon',
   sub:'2D animated episode, African studio pipeline',downloads:35,
   items:TEMPLATES.find(t=>t.id==='animation').items,
   scenes:[
     mkScene('Rec','INT. RECORDING STUDIO - DAY','INT','DAY',['Lead VA','Supporting VAs'],'Scripts, water, snacks','Record characters separately where possible'),
     mkScene('Board','INT. ANIMATION STUDIO - DAY','INT','DAY',['Director','Lead Animator'],'Storyboards, monitor','Do not animate until animatic is approved'),
     mkScene('Anim','INT. STUDIO - MULTI-DAY','INT','DAY',[],'Workstations, tablets','Block by character across all scenes — faster than scene-by-scene'),
   ]},
];
const MKTCAT=['All','Feature Film','Vertical Series / Microdrama','Music Video','Documentary','Short Film','Branded Content','Animation / Cartoon'];

/* ── AI Prompts ── */
const CHAT_SYS=`You are a production finance co-pilot for African film and TV productions. You know Lagos, Accra, Nairobi and Johannesburg market rates. Give practical, specific advice in Naira, Cedis, Shillings or Rand as appropriate. Keep responses concise and actionable. IMPORTANT: Do not use any Markdown formatting. No asterisks for bold, no # for headers, no | for tables, no bullet points with *. Write in plain conversational text only. Use line breaks to separate points.`;
const SCRIPT_SYS=`You are a script budget AI for African film productions. Return ONLY valid JSON. No markdown. No code fences. Use departments: Cast & Talent, Crew, Locations & Transport, Equipment, Post-Production, Marketing, Contingency. Units: day, week, flat, person, item. No apostrophes in strings.`;
const SCRIPT_PROMPT=(cur)=>`Analyze this script and return a production budget as JSON: {"title":"string","budget":[{"dept":"string","description":"string","qty":number,"unit":"string","rate":number,"currency":"${cur}"}],"summary":"string"}`;
const BREAKDOWN_SYS=`You are a script breakdown AI for African film productions. Return ONLY valid JSON array. No markdown. No apostrophes. Keep values short and clean.`;
const BREAKDOWN_PROMPT=(ep,max)=>`${ep?`Multi-episode script: ONE entry per episode, max ${max} episodes.`:`Extract scenes, max ${max} scenes.`} Return ONLY: [{"sceneNumber":"1","heading":"INT. LOCATION - DAY","intExt":"INT","dayNight":"DAY","synopsis":"Brief description","pageCount":1,"cast":["Name"],"extras":"","location":"Place","props":["Prop"],"vehicles":[],"wardrobe":[],"hairMakeup":"","specialEquip":[],"vfxSfx":"None","sound":"","notes":""}]`;
const QUICK=['Day rate for DOP in Lagos?','Estimate 1-day music video in Naira','Structure cash advances for crew','Contingency % for Nollywood?','Post costs for 5-episode vertical?','Mobile money payments in Kenya?'];

/* ── Helpers ── */
const today=()=>new Date().toISOString().slice(0,10);
const fmt=n=>Number(n||0).toLocaleString('en',{maximumFractionDigits:0});
const sym=code=>(CURRENCIES.find(c=>c.code===code)||CURRENCIES[0]).symbol;
const lTot=i=>(Number(i.qty)||0)*(Number(i.rate)||0);
const readB64=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(',')[1]);r.onerror=rej;r.readAsDataURL(f);});
const readTxt=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsText(f);});
const readImg=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f);});
const callClaude=async(msgs,sys)=>{
  const r=await fetch('/api/claude',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system:sys,messages:msgs,max_tokens:8000})});
  if(!r.ok)throw new Error(`API ${r.status}`);
  const d=await r.json();
  return d.content?.map(c=>c.text||'').join('')||'';
};
const recoverScenes=raw=>{
  let s=raw.replace(/```json/gi,'').replace(/```/g,'').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,'').trim();
  const a=s.indexOf('[');if(a===-1)return[];s=s.slice(a);
  try{const r=JSON.parse(s);if(Array.isArray(r))return r;}catch{}
  const scenes=[];let depth=0,start=-1;
  for(let i=0;i<s.length;i++){const c=s[i];if(c==='{'){if(!depth)start=i;depth++;}else if(c==='}'){depth--;if(!depth&&start!==-1){try{const o=JSON.parse(s.slice(start,i+1));if(o.sceneNumber||o.heading)scenes.push(o);}catch{}start=-1;}}}
  return scenes;
};
const useIsMobile=(bp=640)=>{const[m,setM]=useState(()=>window.innerWidth<bp);useEffect(()=>{const h=()=>setM(window.innerWidth<bp);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h);},[bp]);return m;};

/* ── Atoms ── */
const NAV=[{id:'dashboard',e:'🎬',l:'Dashboard'},{id:'budgets',e:'📊',l:'Budgets'},{id:'breakdown',e:'📋',l:'Breakdown'},{id:'recon',e:'🧾',l:'Recon'},{id:'payments',e:'💳',l:'Payments'},{id:'market',e:'🏪',l:'Marketplace'},{id:'ai',e:'✦',l:'AI Builder'}];
const s=(x)=>({style:x});
const Inp=({style,...p})=><input {...p} style={{width:'100%',background:T.hi,border:`1px solid ${T.line}`,borderRadius:6,padding:'8px 10px',color:T.cream,fontSize:13,fontFamily:'Manrope,sans-serif',outline:'none',boxSizing:'border-box',...style}}/>;
const Sel=({style,...p})=><select {...p} style={{background:T.hi,border:`1px solid ${T.line}`,borderRadius:6,padding:'7px 10px',color:T.cream,fontSize:12,fontFamily:'Manrope,sans-serif',outline:'none',...style}}/>;
const Btn=({variant='primary',size='md',style:sx,...p})=>{
  const bg=variant==='primary'?T.gold:variant==='sage'?T.sage:variant==='danger'?T.coral:'transparent';
  const co=variant==='ghost'||variant==='outline'?T.gold:T.ink;
  const br=variant==='outline'?`1px solid ${T.gold}`:variant==='ghost'?`1px solid ${T.line}`:'none';
  return<button {...p} style={{background:bg,color:co,border:br,borderRadius:8,padding:size==='sm'?'5px 12px':'8px 18px',fontSize:size==='sm'?11:13,fontWeight:700,cursor:'pointer',fontFamily:'Manrope,sans-serif',...sx}}/>;
};
const Pill=({children,color})=><span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:color?`${color}22`:T.hi,color:color||T.goldDim,border:`1px solid ${color||T.line}`,fontFamily:'Manrope,sans-serif',fontWeight:700}}>{children}</span>;
const StatCard=({label,value,sub,accent})=><div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:16}}><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>{label}</div><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:26,color:accent||T.gold,fontWeight:500}}>{value}</div><div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif',marginTop:2}}>{sub}</div></div>;
const FS=()=><div style={{height:8,background:`repeating-linear-gradient(90deg,${T.gold} 0 12px,transparent 12px 20px)`,opacity:.4,borderRadius:1}}/>;

/* ── Auth ── */
const AuthCtx=createContext(null);
const useAuth=()=>useContext(AuthCtx);
function AuthProvider({children}){
  const[user,setUser]=useState(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{sb.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);setLoading(false);});const{data:{subscription}}=sb.auth.onAuthStateChange((_,s)=>setUser(s?.user??null));return()=>subscription.unsubscribe();},[]);
  const signOut=()=>sb.auth.signOut();
  if(loading)return<div style={{minHeight:'100vh',background:T.ink,display:'flex',alignItems:'center',justifyContent:'center',color:T.gold,fontFamily:'Fraunces,serif',fontSize:22}}>Loading…</div>;
  return<AuthCtx.Provider value={{user,signOut}}>{children}</AuthCtx.Provider>;
}
function AuthScreen(){
  const[mode,setMode]=useState('login');const[email,setEmail]=useState('');const[pass,setPass]=useState('');const[err,setErr]=useState('');const[ok,setOk]=useState('');
  const submit=async()=>{setErr('');setOk('');
    const fn=mode==='login'?sb.auth.signInWithPassword:sb.auth.signUp;
    const{error}=await fn.call(sb.auth,{email,password:pass});
    if(error)setErr(error.message);else if(mode==='signup')setOk('Check your email to confirm your account.');
  };
  return(
    <div style={{minHeight:'100vh',background:T.ink,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:'100%',maxWidth:380,background:T.panel,border:`1px solid ${T.line}`,borderRadius:14,padding:32}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:30,color:T.gold,textAlign:'center',marginBottom:4}}>NKO</div>
        <div style={{fontSize:11,color:T.goldDim,textAlign:'center',fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.14em',marginBottom:28}}>Budgets tailored just for you</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <Inp type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
          <Inp type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}/>
          {err&&<div style={{fontSize:12,color:T.coral,fontFamily:'Manrope,sans-serif'}}>{err}</div>}
          {ok&&<div style={{fontSize:12,color:T.sage,fontFamily:'Manrope,sans-serif'}}>{ok}</div>}
          <Btn onClick={submit}>{mode==='login'?'Sign in':'Create account'}</Btn>
          <button onClick={()=>setMode(m=>m==='login'?'signup':'login')} style={{background:'none',border:'none',color:T.goldDim,fontSize:12,cursor:'pointer',fontFamily:'Manrope,sans-serif'}}>{mode==='login'?'No account? Sign up':'Have an account? Sign in'}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Navigation ── */
function Sidebar({view,setView,onSignOut,userEmail}){
  return(
    <div style={{width:210,minHeight:'100vh',background:T.panel,borderRight:`1px solid ${T.line}`,display:'flex',flexDirection:'column',flexShrink:0}}>
      <div style={{padding:'22px 18px 14px'}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.gold,fontWeight:700}}>NKO</div>
        <div style={{fontSize:9,color:T.goldDim,fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',marginTop:2}}>Budgets tailored just for you</div>
      </div>
      <FS/>
      <nav style={{flex:1,padding:'14px 10px'}}>
        {NAV.map(n=>{const on=view===n.id;return<button key={n.id} onClick={()=>setView(n.id)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',cursor:'pointer',background:on?T.goldGlow:'transparent',color:on?T.gold:T.dim,fontFamily:'Manrope,sans-serif',fontSize:13,fontWeight:600,textAlign:'left',marginBottom:2,borderLeft:`2px solid ${on?T.gold:'transparent'}`}}><span style={{fontSize:15}}>{n.e}</span>{n.l}</button>;})}
      </nav>
      <div style={{padding:'14px 16px',borderTop:`1px solid ${T.line}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:T.hi,border:`1px solid ${T.goldDim}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:T.gold,fontWeight:700,fontFamily:'Manrope,sans-serif',flexShrink:0}}>{userEmail?.charAt(0).toUpperCase()||'?'}</div>
          <div style={{overflow:'hidden'}}><div style={{fontSize:11,color:T.cream,fontFamily:'Manrope,sans-serif',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Studio</div><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userEmail}</div></div>
        </div>
        <Btn variant="ghost" size="sm" onClick={onSignOut} style={{width:'100%'}}>Sign out</Btn>
      </div>
    </div>
  );
}
function TopBar({view,setView,projects,currentId,onSelect,onCreate}){
  return(
    <div style={{background:T.panel,borderBottom:`1px solid ${T.line}`,padding:'10px 20px',display:'flex',alignItems:'center',gap:10}}>
      {view!=='dashboard'&&<Btn variant="ghost" size="sm" onClick={()=>setView('dashboard')}>← Back</Btn>}
      <Sel value={currentId||''} onChange={e=>onSelect(e.target.value||null)} style={{flex:1,maxWidth:280}}>
        <option value="">Select production…</option>
        {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </Sel>
      <Btn onClick={onCreate} size="sm">+ New</Btn>
    </div>
  );
}
function MobileNav({view,setView}){
  return(
    <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:50,background:T.panel,borderTop:`1px solid ${T.line}`,display:'flex',overflowX:'auto'}}>
      {NAV.map(n=>{const on=view===n.id;return<button key={n.id} onClick={()=>setView(n.id)} style={{flex:'0 0 auto',padding:'8px 12px 6px',border:'none',background:on?T.goldGlow:'transparent',color:on?T.gold:T.dim,display:'flex',flexDirection:'column',alignItems:'center',gap:2,fontSize:9,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',cursor:'pointer'}}><span style={{fontSize:18}}>{n.e}</span>{n.l.split(' ')[0]}</button>;})}
    </div>
  );
}

/* ── New Project Modal ── */
function NewProjectModal({onClose,onCreate}){
  const[name,setName]=useState('');const[type,setType]=useState(PROJ_TYPES[0]);const[cur,setCur]=useState('NGN');
  const create=async()=>{if(name)await onCreate({name,type,base_currency:cur});};
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(15,1,32,.88)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:100}}>
      <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:12,padding:26,width:'100%',maxWidth:380}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:20,color:T.cream,marginBottom:18}}>New production</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <Inp placeholder="Production name" value={name} onChange={e=>setName(e.target.value)}/>
          <Sel value={type} onChange={e=>setType(e.target.value)} style={{width:'100%'}}>{PROJ_TYPES.map(t=><option key={t}>{t}</option>)}</Sel>
          <Sel value={cur} onChange={e=>setCur(e.target.value)} style={{width:'100%'}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.symbol}</option>)}</Sel>
          <div style={{display:'flex',gap:8,marginTop:4}}><Btn onClick={create}>Create</Btn><Btn variant="ghost" onClick={onClose}>Cancel</Btn></div>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard ── */
function DashboardView({projects,budgetItems,advances,payees,currentId,onSelect,onCreate,onDelete,showModal,setShowModal}){
  const[confirmDel,setConfirmDel]=useState(null);const[selected,setSelected]=useState(new Set());const[confirmMulti,setConfirmMulti]=useState(false);
  const toggle=id=>{const n=new Set(selected);n.has(id)?n.delete(id):n.add(id);setSelected(n);};
  const openAdv=advances.filter(a=>a.status!=='reconciled').length;
  const unpaid=payees.filter(p=>{const paid=(p.payments||[]).reduce((s,x)=>s+x.amount,0);return paid<p.agreed_fee;}).length;
  return(
    <div>
      <div style={{marginBottom:22}}><div style={{fontFamily:'Fraunces,serif',fontSize:32,color:T.gold}}>NKO</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Budgets tailored just for you.</div><div style={{marginTop:16}}><FS/></div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:24}}>
        <StatCard label="Productions" value={projects.length} sub="active"/>
        <StatCard label="Budget lines" value={budgetItems.length} sub="all projects"/>
        <StatCard label="Open advances" value={openAdv} sub="pending" accent={openAdv>0?T.coral:T.sage}/>
        <StatCard label="Unpaid" value={unpaid} sub="cast & crew" accent={unpaid>0?T.coral:T.sage}/>
      </div>
      {confirmDel&&<div style={{position:'fixed',inset:0,background:'rgba(15,1,32,.9)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:100}}><div style={{background:T.panel,border:`1px solid ${T.coral}`,borderRadius:12,padding:26,maxWidth:360,textAlign:'center'}}><div style={{fontFamily:'Fraunces,serif',fontSize:17,color:T.cream,marginBottom:8}}>Delete "{confirmDel.name}"?</div><div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:16}}>All budget lines, advances and payments will be deleted.</div><div style={{display:'flex',gap:8,justifyContent:'center'}}><Btn variant="danger" onClick={async()=>{await onDelete([confirmDel.id]);setConfirmDel(null);}}>Delete</Btn><Btn variant="ghost" onClick={()=>setConfirmDel(null)}>Cancel</Btn></div></div></div>}
      {confirmMulti&&<div style={{position:'fixed',inset:0,background:'rgba(15,1,32,.9)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:100}}><div style={{background:T.panel,border:`1px solid ${T.coral}`,borderRadius:12,padding:26,maxWidth:360,textAlign:'center'}}><div style={{fontFamily:'Fraunces,serif',fontSize:17,color:T.cream,marginBottom:8}}>Delete {selected.size} productions?</div><div style={{display:'flex',gap:8,justifyContent:'center',marginTop:12}}><Btn variant="danger" onClick={async()=>{await onDelete([...selected]);setSelected(new Set());setConfirmMulti(false);}}>Delete all</Btn><Btn variant="ghost" onClick={()=>setConfirmMulti(false)}>Cancel</Btn></div></div></div>}
      {projects.length===0?<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:12,padding:44,textAlign:'center'}}><div style={{fontSize:36,marginBottom:12}}>🎬</div><div style={{fontFamily:'Fraunces,serif',fontSize:20,color:T.cream,marginBottom:8}}>No productions yet</div><div style={{color:T.dim,fontSize:13,marginBottom:20,fontFamily:'Manrope,sans-serif'}}>Create a production and start building your budget.</div><Btn onClick={()=>setShowModal(true)}>Create your first production</Btn></div>:(
      <>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14,flexWrap:'wrap',gap:8}}>
          <div style={{fontFamily:'Fraunces,serif',fontSize:18,color:T.cream}}>Productions</div>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            {selected.size>0&&<><span style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{selected.size} selected</span><Btn size="sm" variant="ghost" onClick={()=>setSelected(new Set())}>Clear</Btn><Btn size="sm" variant="danger" onClick={()=>setConfirmMulti(true)}>🗑️ Delete</Btn></>}
            {selected.size===0&&projects.length>1&&<Btn size="sm" variant="ghost" onClick={()=>setSelected(new Set(projects.map(p=>p.id)))}>Select all</Btn>}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
          {projects.map(p=>{const pi=budgetItems.filter(i=>i.project_id===p.id);const totals={};pi.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});const open=advances.filter(a=>a.project_id===p.id&&a.status!=='reconciled').length;const isSel=selected.has(p.id);
          return<div key={p.id} style={{background:isSel?'rgba(224,107,82,.08)':p.id===currentId?T.hi:T.panel,border:`1px solid ${isSel?T.coral:p.id===currentId?T.gold:T.line}`,borderRadius:10,padding:18,position:'relative'}}>
            <button onClick={e=>{e.stopPropagation();toggle(p.id);}} style={{position:'absolute',top:12,right:12,width:18,height:18,borderRadius:4,border:`2px solid ${isSel?T.coral:T.faint}`,background:isSel?T.coral:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>{isSel&&<span style={{color:T.ink,fontSize:11,fontWeight:700}}>✓</span>}</button>
            <button onClick={()=>onSelect(p.id)} style={{background:'none',border:'none',cursor:'pointer',textAlign:'left',width:'100%',paddingRight:28}}>
              <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>{p.name}</div>
              <div style={{fontSize:10,color:T.goldDim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginTop:2,marginBottom:8}}>{p.type}</div>
              <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:13,color:T.cream,marginBottom:6}}>{Object.entries(totals).length===0?<span style={{color:T.faint}}>No budget yet</span>:Object.entries(totals).map(([c,a])=><div key={c}>{sym(c)}{fmt(a)}</div>)}</div>
              <div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{pi.length} lines · {open} open advances</div>
            </button>
            <button onClick={e=>{e.stopPropagation();setConfirmDel(p);}} style={{position:'absolute',bottom:12,right:12,background:'none',border:'none',cursor:'pointer',color:T.faint,fontSize:14}}>🗑️</button>
          </div>;})}
        </div>
      </>
      )}
      {showModal&&<NewProjectModal onClose={()=>setShowModal(false)} onCreate={async(d)=>{await onCreate(d);setShowModal(false);}}/>}
    </div>
  );
}

/* ── Budgets ── */
function DeptSection({dept,items,onAdd,onUpdate,onRemove}){
  const[open,setOpen]=useState(true);const mob=useIsMobile();
  const totals={};items.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
  const ts=Object.entries(totals).map(([c,a])=>`${sym(c)}${fmt(a)}`).join(' · ')||'—';
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,overflow:'hidden',marginBottom:8}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span><span style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>{dept}</span><span style={{fontSize:11,color:T.faint,fontFamily:'Manrope,sans-serif'}}>({items.length})</span></div>
        <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:13,color:T.gold}}>{ts}</span>
      </button>
      {open&&<div style={{borderTop:`1px solid ${T.line}`,padding:'4px 12px 14px'}}>
        {items.map(item=><div key={item.id} style={{padding:'8px 0',borderBottom:`1px solid ${T.line}`}}>
          <Inp value={item.description||''} placeholder="Description" onChange={e=>onUpdate(item.id,{description:e.target.value})} style={{marginBottom:6}}/>
          <div style={{display:'grid',gridTemplateColumns:mob?'52px 1fr 90px 52px 20px':'2fr 52px 80px 100px 56px 20px',gap:4,alignItems:'center'}}>
            {!mob&&<span/>}
            <Inp type="number" min="0" value={item.qty} onChange={e=>onUpdate(item.id,{qty:e.target.value})} style={{fontSize:12}}/>
            <Sel value={item.unit} onChange={e=>onUpdate(item.id,{unit:e.target.value})} style={{width:'100%',fontSize:11}}>{UNITS.map(u=><option key={u}>{u}</option>)}</Sel>
            <Inp type="number" min="0" value={item.rate} onChange={e=>onUpdate(item.id,{rate:e.target.value})} style={{fontFamily:'IBM Plex Mono,monospace',fontSize:12}}/>
            <Sel value={item.currency} onChange={e=>onUpdate(item.id,{currency:e.target.value})} style={{width:'100%',fontSize:10}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</Sel>
            <button onClick={()=>onRemove(item.id)} style={{color:T.faint,fontSize:18,cursor:'pointer',background:'none',border:'none'}}>×</button>
          </div>
          {mob&&<div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:12,color:T.gold,textAlign:'right',marginTop:4}}>{sym(item.currency)}{fmt(lTot(item))}</div>}
        </div>)}
        <button onClick={()=>onAdd(dept)} style={{marginTop:10,color:T.gold,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>+ Add line</button>
      </div>}
    </div>
  );
}
function BrandPanel({project}){
  const[open,setOpen]=useState(false);const[cname,setCname]=useState('');const[ptitle,setPtitle]=useState('');const[logo,setLogo]=useState(null);const[accent,setAccent]=useState('#FEED61');const[saved,setSaved]=useState(false);const lr=useRef();
  useEffect(()=>{if(!project)return;try{const s=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');setCname(s.companyName||'');setPtitle(s.productionTitle||project.name||'');setLogo(s.logo||null);setAccent(s.accentColor||'#FEED61');setSaved(!!(s.companyName||s.logo));}catch{}},[project?.id]);
  const save=()=>{localStorage.setItem(`nko_brand_${project.id}`,JSON.stringify({companyName:cname,productionTitle:ptitle,logo,accentColor:accent}));setSaved(true);setOpen(false);};
  return(
    <div style={{background:T.panel,border:`1px solid ${saved?accent:T.line}`,borderRadius:10,marginBottom:18,overflow:'hidden'}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>{logo&&<img src={logo} style={{height:28,objectFit:'contain'}}/>}<div style={{width:10,height:10,borderRadius:'50%',background:accent}}/><span style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>Brand Panel</span></div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>{saved&&<span style={{fontSize:11,color:T.sage,fontFamily:'Manrope,sans-serif',fontWeight:700}}>Set ✓</span>}<span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span></div>
      </button>
      {open&&<div style={{borderTop:`1px solid ${T.line}`,padding:16,display:'flex',flexDirection:'column',gap:10}}>
        <div style={{border:`1px dashed ${T.line}`,borderRadius:8,padding:12,textAlign:'center',cursor:'pointer',background:T.hi}} onClick={()=>lr.current.click()}><input ref={lr} type="file" accept="image/*" style={{display:'none'}} onChange={async e=>{const f=e.target.files[0];if(f)setLogo(await readImg(f));}}/>{logo?<img src={logo} style={{height:44,objectFit:'contain',display:'block',margin:'0 auto'}}/>:<div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>📷 Upload logo</div>}</div>
        <Inp placeholder="Company name" value={cname} onChange={e=>setCname(e.target.value)}/>
        <Inp placeholder="Production title" value={ptitle} onChange={e=>setPtitle(e.target.value)}/>
        <div><div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:8,fontWeight:700}}>Accent colour</div><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{ACCENT_COLORS.map(c=><button key={c} onClick={()=>setAccent(c)} style={{width:28,height:28,borderRadius:'50%',background:c,border:`3px solid ${accent===c?T.cream:'transparent'}`,cursor:'pointer'}}/>)}</div></div>
        <div style={{display:'flex',gap:8}}><Btn onClick={save} variant="sage">Save brand</Btn><Btn variant="ghost" onClick={()=>setOpen(false)}>Cancel</Btn></div>
      </div>}
    </div>
  );
}
function ScriptResultModal({result,currency,onApply,onClose}){
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(15,1,32,.92)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:100}}>
      <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:12,padding:24,width:'100%',maxWidth:480,maxHeight:'80vh',overflow:'auto'}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:18,color:T.cream,marginBottom:4}}>{result.title||'Script budget'}</div>
        {result.summary&&<div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:16}}>{result.summary}</div>}
        <div style={{marginBottom:16}}>{(result.budget||[]).slice(0,12).map((item,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:`1px solid ${T.line}`,fontSize:12,fontFamily:'Manrope,sans-serif'}}><span style={{color:T.cream}}>{item.description}</span><span style={{color:T.gold,fontFamily:'IBM Plex Mono,monospace'}}>{sym(currency)}{fmt(item.rate*item.qty)}</span></div>)}</div>
        <div style={{display:'flex',gap:8}}><Btn onClick={onApply}>Apply to budget</Btn><Btn variant="ghost" onClick={onClose}>Discard</Btn></div>
      </div>
    </div>
  );
}
function ScriptUploader({project,onApplyBudget}){
  const[state,setState]=useState('idle');const[err,setErr]=useState('');const[result,setResult]=useState(null);const fr=useRef();
  const process=async f=>{
    const isPDF=f.type==='application/pdf',isTxt=f.type==='text/plain'||f.name.endsWith('.txt')||f.name.endsWith('.fdx');
    if(!isPDF&&!isTxt){setErr('Upload a PDF, TXT or FDX file.');setState('error');return;}
    setState('reading');setErr('');
    try{
      let uc;if(isPDF){const b=await readB64(f);uc=[{type:'document',source:{type:'base64',media_type:'application/pdf',data:b}},{type:'text',text:SCRIPT_PROMPT(project.base_currency)}];}
      else{const t=await readTxt(f);uc=[{type:'text',text:`Script:\n\n${t}\n\n${SCRIPT_PROMPT(project.base_currency)}`}];}
      setState('analyzing');
      const raw=await callClaude([{role:'user',content:uc}],SCRIPT_SYS);
      let c=raw.replace(/```json/gi,'').replace(/```/g,'').trim();
      const s=c.indexOf('{'),e=c.lastIndexOf('}');if(s===-1||e===-1)throw new Error('No JSON in response');
      setResult(JSON.parse(c.slice(s,e+1)));setState('done');
    }catch(e){setErr(`Failed: ${e.message}`);setState('error');}
  };
  return(
    <>
      <div onClick={()=>(state==='idle'||state==='error')&&fr.current.click()} style={{border:`2px dashed ${state==='analyzing'?T.gold:T.line}`,borderRadius:10,padding:24,textAlign:'center',background:T.hi,cursor:(state==='idle'||state==='error')?'pointer':'default',marginBottom:18}}>
        <input ref={fr} type="file" accept=".pdf,.txt,.fdx" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f)process(f);}}/>
        {state==='idle'&&<><div style={{fontSize:24,marginBottom:8}}>📄</div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:4}}>Upload your script</div><div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:10}}>PDF, TXT or FDX — NKO reads it and builds your budget</div><Btn variant="ghost" size="sm">Choose file</Btn></>}
        {state==='reading'&&<><div style={{fontSize:24,marginBottom:8}}>📖</div><div style={{color:T.cream,fontFamily:'Manrope,sans-serif'}}>Reading script…</div></>}
        {state==='analyzing'&&<><div style={{fontSize:24,marginBottom:8}}>🤖</div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:4}}>Analyzing…</div><div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif'}}>Keep screen on during analysis</div></>}
        {state==='done'&&<><div style={{fontSize:24,marginBottom:8}}>✅</div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.sage}}>Analysis complete</div></>}
        {state==='error'&&<><div style={{fontSize:24,marginBottom:8}}>⚠️</div><div style={{fontSize:12,color:T.coral,fontFamily:'Manrope,sans-serif',marginBottom:8}}>{err}</div><Btn variant="ghost" size="sm" onClick={e=>{e.stopPropagation();setState('idle');setErr('');}}>Try again</Btn></>}
      </div>
      {result&&state==='done'&&<ScriptResultModal result={result} currency={project.base_currency} onApply={()=>{onApplyBudget(result.budget);setResult(null);setState('idle');}} onClose={()=>{setResult(null);setState('idle');}}/>}
    </>
  );
}
/* ── Budget PDF — full branded budget export ── */
const budgetPDF=(items,project,advances,reconEntries)=>{
  const brand=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');
  const logoHtml=brand.logo?`<img src="${brand.logo}" style="height:40px;object-fit:contain"/>`:'';
  const grand={};items.forEach(i=>{grand[i.currency]=(grand[i.currency]||0)+lTot(i);});
  const deptBlocks=DEPTS.map(d=>{
    const di=items.filter(i=>i.dept===d);if(!di.length)return'';
    const sub={};di.forEach(i=>{sub[i.currency]=(sub[i.currency]||0)+lTot(i);});
    const rows=di.map(i=>`<tr><td style="padding:5px 10px;font-size:11px;border-bottom:1px solid #f0f0f0">${i.description||'—'}</td><td style="padding:5px 10px;font-size:11px;text-align:center;border-bottom:1px solid #f0f0f0">${i.qty}</td><td style="padding:5px 10px;font-size:11px;text-align:center;border-bottom:1px solid #f0f0f0">${i.unit}</td><td style="padding:5px 10px;font-size:11px;text-align:right;font-family:monospace;border-bottom:1px solid #f0f0f0">${sym(i.currency)}${fmt(i.rate)}</td><td style="padding:5px 10px;font-size:11px;text-align:right;font-family:monospace;font-weight:600;border-bottom:1px solid #f0f0f0">${sym(i.currency)}${fmt(lTot(i))}</td></tr>`).join('');
    const subLine=Object.entries(sub).map(([cc,a])=>`${sym(cc)}${fmt(a)}`).join(' · ');
    return`<div style="margin-bottom:16px"><div style="background:#1A0835;color:#FEED61;padding:7px 12px;font-size:12px;font-weight:700;border-radius:6px 6px 0 0;display:flex;justify-content:space-between"><span>${d}</span><span style="font-family:monospace">${subLine}</span></div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e5e5;border-top:none"><tr style="background:#fafafa">${['Description','Qty','Unit','Rate','Total'].map((h,i)=>`<th style="padding:5px 10px;font-size:9px;color:#999;text-transform:uppercase;text-align:${i>2?'right':i>0?'center':'left'}">${h}</th>`).join('')}</tr>${rows}</table></div>`;
  }).join('');
  const grandLine=Object.entries(grand).map(([cc,a])=>`${sym(cc)}${fmt(a)}`).join(' · ');
  const html=`<!DOCTYPE html><html><head><title>Budget — ${project.name}</title><style>@media print{.np{display:none}}body{margin:0;font-family:Arial}</style></head><body>
    <div class="np" style="background:#0F0120;padding:12px;text-align:center"><button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 24px;font-weight:700;cursor:pointer;border-radius:6px">Save as PDF</button><div style="color:#9A9080;font-size:11px;margin-top:6px">Save the PDF, then share via WhatsApp or email</div></div>
    <div style="max-width:700px;margin:0 auto;padding:26px">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #FEED61;padding-bottom:14px;margin-bottom:8px">
        <div><div style="font-size:22px;font-weight:700;font-family:Georgia;color:#0F0120">${brand.companyName||'NKO'}</div>
        <div style="font-size:11px;color:#8C852E;text-transform:uppercase;letter-spacing:1.5px">Production Budget — ${brand.productionTitle||project.name}</div>
        <div style="font-size:10px;color:#999;margin-top:3px">${project.type} · Generated ${today()}</div></div>${logoHtml}
      </div>
      <div style="background:#faf8f0;border:1px solid #eee;border-radius:8px;padding:14px;text-align:center;margin-bottom:20px">
        <div style="font-size:9px;color:#999;text-transform:uppercase;letter-spacing:1.5px">Grand Total</div>
        <div style="font-size:26px;font-weight:700;font-family:monospace;color:#0F0120;margin-top:3px">${grandLine||'—'}</div>
      </div>
      ${deptBlocks}
      <div style="text-align:center;font-size:10px;color:#bbb;margin-top:18px">Generated by NKO — Budgets tailored just for you · nko-nko.vercel.app</div>
    </div></body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};

function BudgetsView({project,items,advances,reconEntries,onAdd,onUpdate,onRemove,onApplyTemplate,onApplyScript}){
  const[showTpl,setShowTpl]=useState(false);const mob=useIsMobile();
  if(!project)return<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>Select a production first.</div></div>;
  const pItems=items.filter(i=>i.project_id===project.id);
  const totals={};pItems.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
  const pAdv=advances.filter(a=>a.project_id===project.id);
  const totalAdv=pAdv.reduce((s,a)=>s+a.amount,0);
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>Budget — {project.name}</div><div style={{marginTop:14}}><FS/></div></div>
      <BrandPanel project={project}/>
      {Object.keys(totals).length>0&&<div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:16,marginBottom:18}}>
        <div style={{fontSize:10,color:T.goldDim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>Total budget</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:20}}>{Object.entries(totals).map(([c,a])=><div key={c}><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:28,color:T.cream}}>{sym(c)}{fmt(a)}</div><div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{c}</div></div>)}</div>
        {totalAdv>0&&<div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif',marginTop:8}}>Advances issued: {sym(project.base_currency)}{fmt(totalAdv)}</div>}
      </div>}
      <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
        <Btn variant="outline" size="sm" onClick={()=>setShowTpl(!showTpl)}>📋 Templates</Btn>
        {pItems.length>0&&<Btn variant="outline" size="sm" onClick={()=>budgetPDF(pItems,project,advances,reconEntries)}>📄 Share Budget PDF</Btn>}
      </div>
      {showTpl&&<div style={{background:T.hi,border:`1px solid ${T.line}`,borderRadius:10,padding:16,marginBottom:18}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:12}}>Apply a template</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:8}}>
          {TEMPLATES.map(t=><button key={t.id} onClick={()=>{onApplyTemplate(t);setShowTpl(false);}} style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:8,padding:12,cursor:'pointer',textAlign:'left'}}><div style={{fontFamily:'Fraunces,serif',fontSize:13,color:T.cream}}>{t.label}</div><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',marginTop:3}}>{t.items.length} line items</div></button>)}
        </div>
      </div>}
      <ScriptUploader project={project} onApplyBudget={onApplyScript}/>
      {DEPTS.map(d=>{const di=pItems.filter(i=>i.dept===d);if(!di.length&&d!=='Cast & Talent')return null;return<DeptSection key={d} dept={d} items={di} onAdd={onAdd} onUpdate={onUpdate} onRemove={onRemove}/>;})}
      {DEPTS.map(d=>{const di=pItems.filter(i=>i.dept===d);if(di.length)return null;return<button key={d} onClick={()=>onAdd(d)} style={{display:'block',color:T.faint,fontSize:12,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif',marginBottom:4}}>+ {d}</button>;})}
    </div>
  );
}

/* ── Recon ── */
function AdvanceCard({advance,entries,onUpdate,onAddEntry,onRemoveEntry,onTopUp}){
  const[show,setShow]=useState(false);const[eDesc,setEDesc]=useState('');const[eAmt,setEAmt]=useState('');const[eDate,setEDate]=useState(today());const[eCat,setECat]=useState('Miscellaneous');const[eRef,setERef]=useState('');const mob=useIsMobile();
  const spent=entries.reduce((s,e)=>s+(Number(e.amount)||0),0);const bal=advance.amount-spent;const pct=advance.amount>0?Math.min(100,(spent/advance.amount)*100):0;
  const sc=advance.status==='reconciled'?T.sage:bal<0?T.coral:T.gold;
  const save=()=>{if(eDesc&&eAmt){onAddEntry({advance_id:advance.id,description:`[${eCat}] ${eDesc}${eRef?` · Ref: ${eRef}`:''}`,amount:Number(eAmt),date:eDate});setEDesc('');setEAmt('');setERef('');setECat('Miscellaneous');}setShow(false);};
  return(
    <div style={{background:T.panel,border:`1px solid ${bal<0?T.coral:T.line}`,borderRadius:10,overflow:'hidden',marginBottom:12}}>
      <div style={{padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:mob?'wrap':'nowrap',gap:8}}>
        <div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>{advance.recipient}{advance.dept&&<span style={{color:T.dim,fontFamily:'Manrope,sans-serif',fontSize:13,fontWeight:400}}> · {advance.dept}</span>}</div><div style={{fontSize:11,color:T.dim,marginTop:2,fontFamily:'Manrope,sans-serif'}}>{advance.purpose||'No purpose'} · {advance.date_issued}</div></div>
        <div style={{textAlign:'right'}}><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:18,color:T.cream}}>{sym(advance.currency)}{fmt(advance.amount)}</div><Pill color={sc}>{advance.status==='reconciled'?'Reconciled':bal<0?'Overspent':bal===0?'Balanced':'Open'}</Pill></div>
      </div>
      <div style={{padding:'0 16px 10px'}}><div style={{height:6,borderRadius:3,background:T.ink,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:bal<0?T.coral:T.gold}}/></div><div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}><span>Spent {sym(advance.currency)}{fmt(spent)} · {Math.round(pct)}%</span><span style={{color:bal<0?T.coral:T.dim}}>{bal<0?`Over by ${sym(advance.currency)}${fmt(Math.abs(bal))}`:`Balance ${sym(advance.currency)}${fmt(bal)}`}</span></div></div>
      {entries.length>0&&<div style={{borderTop:`1px solid ${T.line}`,padding:'6px 16px'}}><div style={{fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',padding:'4px 0'}}>Expense log</div>{entries.map(en=>{const cat=en.description?.match(/^\[([^\]]+)\]/)?.[1]||'';const desc=(en.description||'').replace(/^\[[^\]]+\]\s*/,'');return<div key={en.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${T.line}`,gap:8}}><div style={{flex:1}}>{cat&&<span style={{fontSize:9,background:T.hi,color:T.gold,borderRadius:4,padding:'1px 5px',marginRight:5,fontFamily:'Manrope,sans-serif',fontWeight:700}}>{cat}</span>}<span style={{color:T.cream,fontFamily:'Manrope,sans-serif',fontSize:12}}>{desc}</span>{en.date&&<div style={{color:T.dim,fontSize:10,marginTop:1}}>{en.date}</div>}</div><div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}><span style={{fontFamily:'IBM Plex Mono,monospace',color:T.cream,fontSize:12}}>{sym(advance.currency)}{fmt(en.amount)}</span><button onClick={()=>onRemoveEntry(en.id)} style={{color:T.faint,fontSize:16,cursor:'pointer',background:'none',border:'none'}}>×</button></div></div>;})}
        <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',fontSize:12,fontFamily:'Manrope,sans-serif'}}><span style={{color:T.dim}}>{entries.length} expense{entries.length!==1?'s':''}</span><span style={{fontFamily:'IBM Plex Mono,monospace',color:bal<0?T.coral:T.gold,fontWeight:700}}>{sym(advance.currency)}{fmt(spent)}</span></div>
      </div>}
      {show&&<div style={{padding:'10px 16px',borderTop:`1px solid ${T.line}`,background:T.hi,display:'flex',flexDirection:'column',gap:8}}>
        <Sel value={eCat} onChange={e=>setECat(e.target.value)} style={{width:'100%'}}>{EXPENSE_CATS.map(c=><option key={c}>{c}</option>)}</Sel>
        <Inp placeholder="What was spent on?" value={eDesc} onChange={e=>setEDesc(e.target.value)}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><Inp type="number" placeholder="Amount" value={eAmt} onChange={e=>setEAmt(e.target.value)}/><Inp type="date" value={eDate} onChange={e=>setEDate(e.target.value)}/></div>
        <Inp placeholder="Receipt / voucher ref (optional)" value={eRef} onChange={e=>setERef(e.target.value)}/>
        <div style={{display:'flex',gap:8}}><Btn size="sm" onClick={save}>Save</Btn><Btn size="sm" variant="ghost" onClick={()=>setShow(false)}>Cancel</Btn></div>
      </div>}
      {advance.status!=='reconciled'&&!show&&<div style={{padding:'8px 16px 12px',display:'flex',gap:14,flexWrap:'wrap'}}><button onClick={()=>setShow(true)} style={{color:T.gold,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>+ Log expense</button><button onClick={()=>{const extra=window.prompt(`Top up this advance — how much extra ${advance.currency} was given to ${advance.recipient}?`);if(extra&&Number(extra)>0)onTopUp(advance.id,Number(extra));}} style={{color:T.sapphire,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>💰 Top up</button>{bal>=0&&<button onClick={()=>onUpdate(advance.id,{status:'reconciled'})} style={{color:T.sage,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>✓ Reconcile</button>}</div>}
      {advance.status!=='reconciled'&&!show&&bal<0&&<div style={{padding:'0 16px 12px',fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>Overspent — top up with new cash received, or remove a logged expense with the × button above.</div>}
    </div>
  );
}
function ReconView({project,advances,reconEntries,onAddAdvance,onUpdateAdvance,onAddEntry,onRemoveEntry,onTopUp}){
  const[showForm,setShowForm]=useState(false);const[rec,setRec]=useState({recipient:'',dept:'',amount:'',currency:'NGN',purpose:'',date_issued:today()});
  if(!project)return<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>Select a production first.</div></div>;
  const pAdv=advances.filter(a=>a.project_id===project.id);
  const total=pAdv.reduce((s,a)=>s+a.amount,0);const spent=pAdv.map(a=>reconEntries.filter(e=>e.advance_id===a.id).reduce((s,e)=>s+Number(e.amount),0)).reduce((a,b)=>a+b,0);
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>Recon — {project.name}</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Track every cash advance. Log expenses against each. Reduce discrepancies.</div><div style={{marginTop:14}}><FS/></div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:20}}>
        <StatCard label="Advances" value={pAdv.length} sub="issued"/><StatCard label="Total issued" value={`${sym(project.base_currency)}${fmt(total)}`} sub={project.base_currency}/><StatCard label="Total spent" value={`${sym(project.base_currency)}${fmt(spent)}`} sub="logged"/><StatCard label="Reconciled" value={pAdv.filter(a=>a.status==='reconciled').length} sub="of total" accent={T.sage}/>
      </div>
      {showForm&&<div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:18,marginBottom:16}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:12}}>New advance</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
          <Inp placeholder="Recipient name" value={rec.recipient} onChange={e=>setRec(p=>({...p,recipient:e.target.value}))}/>
          <Inp placeholder="Department" value={rec.dept} onChange={e=>setRec(p=>({...p,dept:e.target.value}))}/>
          <Inp type="number" placeholder="Amount" value={rec.amount} onChange={e=>setRec(p=>({...p,amount:e.target.value}))}/>
          <Sel value={rec.currency} onChange={e=>setRec(p=>({...p,currency:e.target.value}))} style={{width:'100%'}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</Sel>
          <Inp placeholder="Purpose" value={rec.purpose} onChange={e=>setRec(p=>({...p,purpose:e.target.value}))} style={{gridColumn:'span 2'}}/>
          <Inp type="date" value={rec.date_issued} onChange={e=>setRec(p=>({...p,date_issued:e.target.value}))} style={{gridColumn:'span 2'}}/>
        </div>
        <div style={{display:'flex',gap:8}}><Btn size="sm" onClick={()=>{if(rec.recipient&&rec.amount){onAddAdvance({...rec,amount:Number(rec.amount),status:'open',project_id:project.id});setRec({recipient:'',dept:'',amount:'',currency:'NGN',purpose:'',date_issued:today()});setShowForm(false);}}}>Issue advance</Btn><Btn size="sm" variant="ghost" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
      </div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14,flexWrap:'wrap',gap:8}}><div style={{fontFamily:'Fraunces,serif',fontSize:16,color:T.cream}}>{pAdv.length} advance{pAdv.length!==1?'s':''}</div><div style={{display:'flex',gap:8}}>{pAdv.length>0&&<Btn size="sm" variant="outline" onClick={()=>reconReportPDF(pAdv,reconEntries,project)}>📄 Export Recon Report</Btn>}<Btn size="sm" onClick={()=>setShowForm(true)}>+ Issue advance</Btn></div></div>
      {pAdv.length===0?<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:32,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>No advances yet. Issue one to start tracking expenses.</div></div>:pAdv.map(a=><AdvanceCard key={a.id} advance={a} entries={reconEntries.filter(e=>e.advance_id===a.id)} onUpdate={onUpdateAdvance} onAddEntry={onAddEntry} onRemoveEntry={onRemoveEntry} onTopUp={onTopUp}/>)}
    </div>
  );
}

/* ── Payments ── */
/* ── PDF Receipt — bank-receipt style for a single payment ── */
const receiptPDF=(payee,payment,project)=>{
  const brand=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');
  const logoHtml=brand.logo?`<img src="${brand.logo}" style="height:42px;object-fit:contain"/>`:'';
  const ref=`NKO-${project.id.slice(0,4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
  const html=`<!DOCTYPE html><html><head><title>Receipt — ${payee.name}</title><style>@media print{.np{display:none}}body{margin:0;font-family:Arial;background:#f4f4f4}</style></head><body>
    <div class="np" style="background:#0F0120;padding:12px;text-align:center">
      <button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 24px;font-weight:700;cursor:pointer;border-radius:6px">Save as PDF</button>
      <div style="color:#9A9080;font-size:11px;margin-top:6px">Save the PDF, then attach it in WhatsApp or email</div>
    </div>
    <div style="max-width:420px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.12)">
      <div style="background:#0F0120;padding:18px 22px;display:flex;justify-content:space-between;align-items:center">
        <div><div style="color:#FEED61;font-size:20px;font-weight:700;font-family:Georgia">${brand.companyName||'NKO'}</div>
        <div style="color:#8C852E;font-size:9px;text-transform:uppercase;letter-spacing:2px">Payment Receipt</div></div>
        ${logoHtml}
      </div>
      <div style="padding:22px;text-align:center;border-bottom:1px dashed #ddd">
        <div style="font-size:11px;color:#888;margin-bottom:4px">Amount Paid</div>
        <div style="font-size:34px;font-weight:700;color:#0F0120">${sym(payee.currency)}${fmt(payment.amount)}</div>
        <div style="display:inline-block;margin-top:8px;background:#e8f5ee;color:#2c7a4e;font-size:11px;font-weight:700;padding:4px 14px;border-radius:12px">✓ PAID</div>
      </div>
      <div style="padding:16px 22px">
        ${[['Paid to',payee.name],['Role',payee.role||'—'],['Production',project.name],['Payment method',payment.method],['Date',payment.date],['Reference',ref]].map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f0f0f0"><span style="font-size:12px;color:#888">${k}</span><span style="font-size:12px;color:#222;font-weight:600;text-align:right">${v}</span></div>`).join('')}
      </div>
      <div style="padding:12px 22px 20px;text-align:center">
        <div style="font-size:10px;color:#aaa">Generated by NKO — Budgets tailored just for you</div>
        <div style="font-size:10px;color:#ccc;margin-top:2px">nko-nko.vercel.app</div>
      </div>
    </div>
  </body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};

/* ── Recon Report PDF — full advances + expense log for a production ── */
const reconReportPDF=(advances,reconEntries,project)=>{
  const brand=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');
  const logoHtml=brand.logo?`<img src="${brand.logo}" style="height:40px;object-fit:contain"/>`:'';
  const totalIssued=advances.reduce((s,a)=>s+a.amount,0);
  let totalSpent=0;
  const blocks=advances.map(a=>{
    const entries=reconEntries.filter(e=>e.advance_id===a.id);
    const spent=entries.reduce((s,e)=>s+Number(e.amount),0);totalSpent+=spent;
    const bal=a.amount-spent;
    const rows=entries.map(en=>{
      const cat=en.description?.match(/^\[([^\]]+)\]/)?.[1]||'';
      const desc=(en.description||'').replace(/^\[[^\]]+\]\s*/,'');
      return`<tr><td style="padding:6px 10px;font-size:11px;color:#555;border-bottom:1px solid #f0f0f0">${en.date||''}</td><td style="padding:6px 10px;font-size:11px;border-bottom:1px solid #f0f0f0">${cat?`<span style="background:#f5f0dc;color:#8C852E;font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;margin-right:5px">${cat}</span>`:''}${desc}</td><td style="padding:6px 10px;font-size:11px;text-align:right;font-family:monospace;border-bottom:1px solid #f0f0f0">${sym(a.currency)}${fmt(en.amount)}</td></tr>`;
    }).join('');
    return`<div style="margin-bottom:22px;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden">
      <div style="background:#1A0835;padding:10px 14px;display:flex;justify-content:space-between">
        <div><span style="color:#F0E8D0;font-weight:700;font-size:13px">${a.recipient}</span>${a.dept?`<span style="color:#9A9080;font-size:11px"> · ${a.dept}</span>`:''}
        <div style="color:#8C852E;font-size:10px;margin-top:2px">${a.purpose||''} · Issued ${a.date_issued}</div></div>
        <div style="text-align:right"><div style="color:#FEED61;font-family:monospace;font-size:15px">${sym(a.currency)}${fmt(a.amount)}</div>
        <div style="font-size:10px;color:${bal<0?'#E06B52':bal===0?'#52B07A':'#9A9080'}">${a.status==='reconciled'?'✓ Reconciled':bal<0?`Over by ${sym(a.currency)}${fmt(Math.abs(bal))}`:`Balance ${sym(a.currency)}${fmt(bal)}`}</div></div>
      </div>
      ${entries.length?`<table style="width:100%;border-collapse:collapse"><tr style="background:#fafafa"><th style="padding:6px 10px;font-size:9px;color:#999;text-align:left;text-transform:uppercase">Date</th><th style="padding:6px 10px;font-size:9px;color:#999;text-align:left;text-transform:uppercase">Expense</th><th style="padding:6px 10px;font-size:9px;color:#999;text-align:right;text-transform:uppercase">Amount</th></tr>${rows}
      <tr><td colspan="2" style="padding:8px 10px;font-size:11px;font-weight:700;text-align:right">Total spent</td><td style="padding:8px 10px;font-size:12px;font-weight:700;text-align:right;font-family:monospace">${sym(a.currency)}${fmt(spent)}</td></tr></table>`:`<div style="padding:12px 14px;font-size:11px;color:#999">No expenses logged against this advance yet.</div>`}
    </div>`;
  }).join('');
  const html=`<!DOCTYPE html><html><head><title>Recon Report — ${project.name}</title><style>@media print{.np{display:none}}body{margin:0;font-family:Arial;background:#fff}</style></head><body>
    <div class="np" style="background:#0F0120;padding:12px;text-align:center">
      <button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 24px;font-weight:700;cursor:pointer;border-radius:6px">Save as PDF</button>
      <div style="color:#9A9080;font-size:11px;margin-top:6px">Save the PDF, then attach it in WhatsApp or email</div>
    </div>
    <div style="max-width:680px;margin:0 auto;padding:26px">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #FEED61;padding-bottom:14px;margin-bottom:18px">
        <div><div style="font-size:22px;font-weight:700;font-family:Georgia;color:#0F0120">${brand.companyName||'NKO'}</div>
        <div style="font-size:11px;color:#8C852E;text-transform:uppercase;letter-spacing:1.5px">Reconciliation Report — ${project.name}</div>
        <div style="font-size:10px;color:#999;margin-top:3px">Generated ${today()}</div></div>
        ${logoHtml}
      </div>
      <div style="display:flex;gap:12px;margin-bottom:22px">
        ${[['Advances issued',`${sym(project.base_currency)}${fmt(totalIssued)}`],['Total spent',`${sym(project.base_currency)}${fmt(totalSpent)}`],['Outstanding',`${sym(project.base_currency)}${fmt(totalIssued-totalSpent)}`]].map(([k,v])=>`<div style="flex:1;background:#faf8f0;border:1px solid #eee;border-radius:8px;padding:12px;text-align:center"><div style="font-size:9px;color:#999;text-transform:uppercase;letter-spacing:1px">${k}</div><div style="font-size:17px;font-weight:700;font-family:monospace;color:#0F0120;margin-top:3px">${v}</div></div>`).join('')}
      </div>
      ${blocks||'<div style="color:#999;font-size:12px">No advances issued yet.</div>'}
      <div style="text-align:center;font-size:10px;color:#bbb;margin-top:20px">Generated by NKO — Budgets tailored just for you · nko-nko.vercel.app</div>
    </div>
  </body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};

function PaymentsView({project,payees,onAddPayee,onAddPayment,onRemovePayment}){
  const[showForm,setShowForm]=useState(false);const[np,setNp]=useState({name:'',role:'',agreed_fee:'',currency:'NGN'});
  if(!project)return<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>Select a production first.</div></div>;
  const pPayees=payees.filter(p=>p.project_id===project.id);
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>Payments — {project.name}</div><div style={{marginTop:14}}><FS/></div></div>
      {showForm&&<div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:18,marginBottom:16}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
          <Inp placeholder="Name" value={np.name} onChange={e=>setNp(p=>({...p,name:e.target.value}))}/>
          <Inp placeholder="Role" value={np.role} onChange={e=>setNp(p=>({...p,role:e.target.value}))}/>
          <Inp type="number" placeholder="Agreed fee" value={np.agreed_fee} onChange={e=>setNp(p=>({...p,agreed_fee:e.target.value}))}/>
          <Sel value={np.currency} onChange={e=>setNp(p=>({...p,currency:e.target.value}))} style={{width:'100%'}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</Sel>
        </div>
        <div style={{display:'flex',gap:8}}><Btn size="sm" onClick={()=>{if(np.name){onAddPayee({...np,agreed_fee:Number(np.agreed_fee),project_id:project.id,payments:[]});setNp({name:'',role:'',agreed_fee:'',currency:'NGN'});setShowForm(false);}}}>Add</Btn><Btn size="sm" variant="ghost" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
      </div>}
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}><Btn size="sm" onClick={()=>setShowForm(true)}>+ Add payee</Btn></div>
      {pPayees.length===0?<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:32,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>No payees yet.</div></div>:pPayees.map(p=>{
        const paid=(p.payments||[]).reduce((s,x)=>s+x.amount,0);const bal=p.agreed_fee-paid;const pct=p.agreed_fee>0?Math.min(100,(paid/p.agreed_fee)*100):0;
        return<div key={p.id} style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:16,marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>{p.name}</div><div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{p.role}</div></div><div style={{textAlign:'right'}}><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:15,color:T.cream}}>{sym(p.currency)}{fmt(p.agreed_fee)}</div><Pill color={bal<=0?T.sage:T.gold}>{bal<=0?'Paid in full':`Owing ${sym(p.currency)}${fmt(bal)}`}</Pill></div></div>
          <div style={{height:4,borderRadius:2,background:T.ink,overflow:'hidden',marginBottom:6}}><div style={{height:'100%',width:`${pct}%`,background:pct>=100?T.sage:T.gold}}/></div>
          {(p.payments||[]).map((pay,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:12,padding:'4px 0',borderBottom:`1px solid ${T.line}`}}><span style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>{pay.date} · {pay.method}</span><div style={{display:'flex',gap:8,alignItems:'center'}}><span style={{fontFamily:'IBM Plex Mono,monospace',color:T.cream}}>{sym(p.currency)}{fmt(pay.amount)}</span><button onClick={()=>receiptPDF(p,pay,project)} title="Generate PDF receipt" style={{color:T.gold,fontSize:11,fontWeight:700,cursor:'pointer',background:'none',border:`1px solid ${T.goldDim}`,borderRadius:6,padding:'2px 8px',fontFamily:'Manrope,sans-serif'}}>🧾 Receipt</button><button onClick={()=>onRemovePayment(p.id,i)} style={{color:T.faint,fontSize:14,cursor:'pointer',background:'none',border:'none'}}>×</button></div></div>)}
          {bal>0&&<div style={{marginTop:8}}><Btn size="sm" variant="outline" onClick={()=>{const amt=window.prompt(`Amount to pay (${p.currency}):`);const method=window.prompt('Payment method:','Cash');if(amt&&method)onAddPayment(p.id,{amount:Number(amt),method,date:today()});}}>+ Log payment</Btn></div>}
        </div>;})}
    </div>
  );
}

/* ── AI Builder ── */
function AIView({project,budgetItems,advances}){
  const[msgs,setMsgs]=useState([]);const[input,setInput]=useState('');const[loading,setLoading]=useState(false);const[editIdx,setEditIdx]=useState(null);const[editText,setEditText]=useState('');const[imgPreview,setImgPreview]=useState(null);const[imgB64,setImgB64]=useState(null);
  const botRef=useRef();const imgRef=useRef();
  useEffect(()=>{botRef.current?.scrollIntoView({behavior:'smooth'});},[msgs]);
  const ctx=project?`Project: "${project.name}" (${project.type}, ${project.base_currency}). Budget: ${budgetItems.length} lines.`:'No project selected.';

  const pickImage=async e=>{const f=e.target.files[0];if(!f)return;const b64=await readB64(f);setImgB64(b64);setImgPreview(URL.createObjectURL(f));};
  const clearImage=()=>{setImgB64(null);setImgPreview(null);if(imgRef.current)imgRef.current.value='';};

  const buildContent=(text,b64)=>{if(b64)return[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:b64}},{type:'text',text:`[${ctx}]\n\n${text}`}];return`[${ctx}]\n\n${text}`;};

  const send=async txt=>{
    const msg=(txt||input).trim();if(!msg||loading)return;
    setInput('');const b64=imgB64;setImgB64(null);setImgPreview(null);if(imgRef.current)imgRef.current.value='';
    const userMsg={role:'user',content:msg,image:b64?imgPreview:null};
    setMsgs(p=>[...p,userMsg]);setLoading(true);
    try{
      const h=msgs.map(m=>({role:m.role,content:m.role==='user'?`[${ctx}]\n\n${m.content}`:m.content}));
      const r=await callClaude([...h,{role:'user',content:buildContent(msg,b64)}],CHAT_SYS);
      setMsgs(p=>[...p,{role:'assistant',content:r}]);
    }catch{setMsgs(p=>[...p,{role:'assistant',content:'Connection error. Try again.'}]);}
    setLoading(false);
  };

  const saveEdit=async()=>{
    if(editIdx===null)return;
    const newMsgs=msgs.slice(0,editIdx);
    setMsgs(newMsgs);setEditIdx(null);
    await send(editText);setEditText('');
  };

  return(
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 130px)'}}>
      <div style={{marginBottom:18}}><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>AI Builder</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Production finance co-pilot — calibrated for African markets.</div><div style={{marginTop:14}}><FS/></div></div>
      <div style={{flex:1,overflowY:'auto',marginBottom:12}}>
        {msgs.length===0&&<div style={{marginBottom:20}}><div style={{fontSize:10,color:T.dim,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:10,fontFamily:'Manrope,sans-serif'}}>Quick prompts</div><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{QUICK.map(q=><button key={q} onClick={()=>send(q)} style={{background:T.hi,border:`1px solid ${T.line}`,borderRadius:20,padding:'6px 14px',fontSize:12,color:T.cream,cursor:'pointer',fontFamily:'Manrope,sans-serif'}}>{q}</button>)}</div></div>}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
              <div style={{maxWidth:'82%',position:'relative'}}>
                {m.image&&<img src={m.image} style={{maxWidth:'100%',borderRadius:8,marginBottom:4,display:'block'}}/>}
                <div style={{padding:'10px 14px',borderRadius:10,fontSize:14,lineHeight:1.65,background:m.role==='user'?T.goldGlow:T.panel,border:`1px solid ${m.role==='user'?T.goldDim:T.line}`,color:T.cream,fontFamily:'Manrope,sans-serif',whiteSpace:'pre-wrap'}}>{m.content}</div>
                {m.role==='user'&&editIdx!==i&&<button onClick={()=>{setEditIdx(i);setEditText(m.content);}} style={{position:'absolute',top:-8,right:-8,background:T.hi,border:`1px solid ${T.line}`,borderRadius:20,padding:'2px 8px',fontSize:10,color:T.goldDim,cursor:'pointer',fontFamily:'Manrope,sans-serif'}}>edit</button>}
                {editIdx===i&&<div style={{marginTop:6,display:'flex',gap:6}}>
                  <Inp value={editText} onChange={e=>setEditText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&saveEdit()} style={{flex:1,fontSize:12}}/>
                  <Btn size="sm" onClick={saveEdit}>Send</Btn>
                  <Btn size="sm" variant="ghost" onClick={()=>{setEditIdx(null);setEditText('');}}>✕</Btn>
                </div>}
              </div>
            </div>
          ))}
          {loading&&<div style={{display:'flex',justifyContent:'flex-start'}}><div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:'10px 16px',color:T.dim,fontSize:14,fontFamily:'Manrope,sans-serif'}}>Thinking…</div></div>}
        </div>
        <div ref={botRef}/>
      </div>
      {/* Image preview */}
      {imgPreview&&<div style={{marginBottom:8,display:'flex',alignItems:'center',gap:8}}>
        <img src={imgPreview} style={{height:60,borderRadius:6,objectFit:'cover',border:`1px solid ${T.line}`}}/>
        <button onClick={clearImage} style={{color:T.coral,fontSize:11,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif',fontWeight:700}}>Remove</button>
      </div>}
      {/* Input row */}
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input ref={imgRef} type="file" accept="image/*" style={{display:'none'}} onChange={pickImage}/>
        <button onClick={()=>imgRef.current.click()} style={{background:T.hi,border:`1px solid ${T.line}`,borderRadius:8,padding:'8px 10px',cursor:'pointer',color:T.goldDim,fontSize:16,flexShrink:0}} title="Attach image">📎</button>
        <Inp placeholder="Ask about rates, budgets, recon… or attach an image" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} style={{flex:1}}/>
        <Btn onClick={()=>send()} style={{flexShrink:0,opacity:loading?.5:1}}>Send</Btn>
      </div>
    </div>
  );
}

/* ── Breakdown ── */
const BKCAT=[{key:'cast',label:'Cast',icon:'👤'},{key:'extras',label:'Extras',icon:'👥'},{key:'location',label:'Location',icon:'📍'},{key:'props',label:'Props',icon:'🎭'},{key:'vehicles',label:'Vehicles',icon:'🚗'},{key:'wardrobe',label:'Wardrobe',icon:'👗'},{key:'hairMakeup',label:'Hair & Make-up',icon:'💄'},{key:'specialEquip',label:'Special Equipment',icon:'🎥'},{key:'vfxSfx',label:'VFX / SFX',icon:'✨'},{key:'sound',label:'Sound',icon:'🎵'},{key:'notes',label:'Notes',icon:'📝'}];
function SceneCard({scene,onDelete,onUpdate,index}){
  const[open,setOpen]=useState(false);const[editing,setEditing]=useState(false);const[draft,setDraft]=useState(null);const mob=useIsMobile();
  const startEdit=()=>{setDraft({...scene,cast:(scene.cast||[]).join(', '),props:(scene.props||[]).join(', '),vehicles:(scene.vehicles||[]).join(', '),wardrobe:(scene.wardrobe||[]).join(', '),specialEquip:(scene.specialEquip||[]).join(', ')});setEditing(true);setOpen(true);};
  const saveEdit=()=>{
    const upd={...draft,
      cast:String(draft.cast||'').split(',').map(x=>x.trim()).filter(Boolean),
      props:String(draft.props||'').split(',').map(x=>x.trim()).filter(Boolean),
      vehicles:String(draft.vehicles||'').split(',').map(x=>x.trim()).filter(Boolean),
      wardrobe:String(draft.wardrobe||'').split(',').map(x=>x.trim()).filter(Boolean),
      specialEquip:String(draft.specialEquip||'').split(',').map(x=>x.trim()).filter(Boolean),
    };
    onUpdate(scene.id,upd);setEditing(false);setDraft(null);
  };
  const d=(k,v)=>setDraft(p=>({...p,[k]:v}));
  return(
    <div style={{background:T.panel,border:`1px solid ${editing?T.gold:T.line}`,borderRadius:10,overflow:'hidden',marginBottom:10}}>
      <button onClick={()=>!editing&&setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 14px',display:'flex',alignItems:'flex-start',gap:10,textAlign:'left'}}>
        <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:mob?14:18,color:T.gold,fontWeight:700,minWidth:36,flexShrink:0}}>{scene.sceneNumber||'?'}</div>
        <div style={{flex:1,minWidth:0}}><div style={{fontFamily:'Fraunces,serif',fontSize:mob?13:14,color:T.cream,wordBreak:'break-word'}}>{scene.heading||'No heading'}</div>{scene.synopsis&&<div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif',marginTop:2}}>{scene.synopsis.slice(0,70)}{scene.synopsis.length>70?'…':''}</div>}</div>
        <div style={{display:'flex',gap:4,flexShrink:0,flexWrap:'wrap',justifyContent:'flex-end'}}>
          <span style={{fontSize:9,fontWeight:700,padding:'2px 5px',borderRadius:4,background:scene.intExt==='INT'?T.sapphire:T.sage,color:T.ink}}>{scene.intExt||'INT'}</span>
          <span style={{fontSize:9,fontWeight:700,padding:'2px 5px',borderRadius:4,background:scene.dayNight==='DAY'?T.gold:'#7B68EE',color:T.ink}}>{scene.dayNight||'DAY'}</span>
          <span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span>
        </div>
      </button>
      {open&&!editing&&<div style={{borderTop:`1px solid ${T.line}`}}>
        {BKCAT.map(cat=>{const val=scene[cat.key];if(!val||(Array.isArray(val)&&!val.length))return null;return(
          <div key={cat.key} style={{display:'flex',borderBottom:`1px solid ${T.line}`,flexDirection:mob?'column':'row'}}>
            <div style={{width:mob?'100%':150,flexShrink:0,background:T.hi,padding:mob?'5px 14px 2px':'8px 14px',fontSize:10,color:T.goldDim,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',fontFamily:'Manrope,sans-serif',display:'flex',alignItems:'center',gap:5}}><span>{cat.icon}</span>{cat.label}</div>
            <div style={{flex:1,padding:'8px 14px',fontSize:mob?12:13,color:T.cream,fontFamily:'Manrope,sans-serif',display:'flex',alignItems:'center',flexWrap:'wrap'}}>{Array.isArray(val)?<div style={{display:'flex',flexWrap:'wrap',gap:4}}>{val.map((v,i)=><span key={i} style={{background:T.ink,border:`1px solid ${T.line}`,borderRadius:4,padding:'2px 7px',fontSize:11}}>{v}</span>)}</div>:val}</div>
          </div>);})}
        <div style={{padding:'8px 16px',display:'flex',gap:14}}>
          <button onClick={startEdit} style={{color:T.gold,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>✏️ Edit scene</button>
          <button onClick={()=>onDelete(scene.id)} style={{color:T.coral,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>Delete scene</button>
        </div>
      </div>}
      {open&&editing&&draft&&<div style={{borderTop:`1px solid ${T.line}`,padding:14,display:'flex',flexDirection:'column',gap:8,background:T.hi}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <Inp placeholder="Scene number" value={draft.sceneNumber||''} onChange={e=>d('sceneNumber',e.target.value)}/>
          <div style={{display:'flex',gap:6}}>
            <Sel value={draft.intExt||'INT'} onChange={e=>d('intExt',e.target.value)} style={{flex:1}}><option>INT</option><option>EXT</option><option>INT/EXT</option></Sel>
            <Sel value={draft.dayNight||'DAY'} onChange={e=>d('dayNight',e.target.value)} style={{flex:1}}><option>DAY</option><option>NIGHT</option><option>DUSK</option><option>DAWN</option></Sel>
          </div>
        </div>
        <Inp placeholder="Heading e.g. INT. MARKET - DAY" value={draft.heading||''} onChange={e=>d('heading',e.target.value)}/>
        <Inp placeholder="Synopsis" value={draft.synopsis||''} onChange={e=>d('synopsis',e.target.value)}/>
        <Inp placeholder="Location" value={draft.location||''} onChange={e=>d('location',e.target.value)}/>
        <Inp placeholder="Cast — comma separated" value={draft.cast||''} onChange={e=>d('cast',e.target.value)}/>
        <Inp placeholder="Extras" value={draft.extras||''} onChange={e=>d('extras',e.target.value)}/>
        <Inp placeholder="Props — comma separated" value={draft.props||''} onChange={e=>d('props',e.target.value)}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <Inp placeholder="Vehicles — comma separated" value={draft.vehicles||''} onChange={e=>d('vehicles',e.target.value)}/>
          <Inp placeholder="Wardrobe — comma separated" value={draft.wardrobe||''} onChange={e=>d('wardrobe',e.target.value)}/>
          <Inp placeholder="Hair & make-up" value={draft.hairMakeup||''} onChange={e=>d('hairMakeup',e.target.value)}/>
          <Inp placeholder="Special equipment" value={draft.specialEquip||''} onChange={e=>d('specialEquip',e.target.value)}/>
          <Inp placeholder="VFX / SFX" value={draft.vfxSfx||''} onChange={e=>d('vfxSfx',e.target.value)}/>
          <Inp placeholder="Sound" value={draft.sound||''} onChange={e=>d('sound',e.target.value)}/>
        </div>
        <Inp placeholder="Notes" value={draft.notes||''} onChange={e=>d('notes',e.target.value)}/>
        <div style={{display:'flex',gap:8}}>
          <Btn size="sm" variant="sage" onClick={saveEdit}>Save changes</Btn>
          <Btn size="sm" variant="ghost" onClick={()=>{setEditing(false);setDraft(null);}}>Cancel</Btn>
        </div>
      </div>}
    </div>
  );
}

/* Breakdown share / PDF export */
const shareBreakdown=(scenes,project)=>{
  const brand=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');
  const logoHtml=brand.logo?`<img src="${brand.logo}" style="height:38px;object-fit:contain;display:block;margin-bottom:6px"/>`:'';
  const sheets=scenes.map(sc=>{
    const rows=BKCAT.map(cat=>{
      const val=sc[cat.key];
      if(!val||(Array.isArray(val)&&!val.length))return'';
      const display=Array.isArray(val)?val.join(', '):val;
      return`<tr><td style="padding:7px 12px;background:#1A0835;color:#FEED61;font-size:10px;font-weight:700;text-transform:uppercase;width:150px;white-space:nowrap;font-family:Arial">${cat.icon} ${cat.label}</td><td style="padding:7px 12px;font-size:12px;color:#222;font-family:Arial">${display}</td></tr>`;
    }).join('');
    return`<div style="page-break-after:always;padding:18px 26px;font-family:Arial">
      <div style="background:#0F0120;color:#FEED61;padding:12px 18px;border-radius:6px 6px 0 0;display:flex;justify-content:space-between">
        <div><div style="font-size:10px;text-transform:uppercase;color:#8C852E;margin-bottom:2px">${brand.companyName||'NKO'} · ${project.name}</div>
        <div style="font-size:17px;font-weight:700">Scene ${sc.sceneNumber||'—'}</div>
        <div style="font-size:12px;color:#9A9080;margin-top:2px">${sc.heading||''}</div></div>
        <div style="text-align:right">${logoHtml}<div style="font-size:10px;color:#8C852E">${sc.intExt||''} · ${sc.dayNight||''}</div></div>
      </div>
      ${sc.synopsis?`<div style="background:#f7f7f7;border:1px solid #eee;border-top:none;padding:9px 18px;font-size:12px;color:#444;font-style:italic">${sc.synopsis}</div>`:''}
      <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;border-top:none">${rows}</table>
    </div>`;
  }).join('');
  const html=`<!DOCTYPE html><html><head><title>Breakdown — ${project.name}</title><style>@media print{.np{display:none}}body{margin:0}</style></head><body>
    <div class="np" style="background:#0F0120;padding:12px 18px;text-align:center;font-family:Arial">
      <button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 22px;font-size:13px;font-weight:700;cursor:pointer;border-radius:6px">Print / Save as PDF</button>
      <span style="color:#9A9080;font-size:11px;margin-left:10px">${scenes.length} scene${scenes.length!==1?'s':''} · ${project.name}</span>
    </div>${sheets}</body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};
function BreakdownUploader({project,onApply}){
  const[state,setState]=useState('idle');const[err,setErr]=useState('');const[notif,setNotif]=useState(()=>typeof Notification!=='undefined'?Notification.permission:'unsupported');const fr=useRef();const resRef=useRef();
  const askNotif=async()=>{if(typeof Notification==='undefined'||Notification.permission!=='default')return;const p=await Notification.requestPermission();setNotif(p);};
  const sendNotif=n=>{if(typeof Notification==='undefined'||Notification.permission!=='granted')return;try{new Notification('NKO Breakdown Complete',{body:`${n} scenes extracted from ${project.name}`});}catch{}};
  useEffect(()=>{const h=()=>{if(document.visibilityState==='visible'&&resRef.current){onApply(resRef.current);resRef.current=null;setState('done');}};document.addEventListener('visibilitychange',h);return()=>document.removeEventListener('visibilitychange',h);},[]);
  const process=async f=>{
    const isPDF=f.type==='application/pdf',isTxt=f.type==='text/plain'||f.name.endsWith('.txt')||f.name.endsWith('.fdx');
    if(!isPDF&&!isTxt){setErr('Upload a PDF, TXT or FDX file.');setState('error');return;}
    await askNotif();setState('reading');setErr('');
    try{
      const kb=f.size/1024;const ep=isPDF?kb>200:kb>50;const max=ep?20:25;
      let uc;if(isPDF){const b=await readB64(f);uc=[{type:'document',source:{type:'base64',media_type:'application/pdf',data:b}},{type:'text',text:BREAKDOWN_PROMPT(ep,max)}];}
      else{const t=await readTxt(f);uc=[{type:'text',text:`Script:\n\n${t.slice(0,80000)}\n\n${BREAKDOWN_PROMPT(ep,max)}`}];}
      setState('analyzing');
      const raw=await callClaude([{role:'user',content:uc}],BREAKDOWN_SYS);
      const scenes=recoverScenes(raw);if(!scenes.length)throw new Error('No scenes found — try TXT format');
      sendNotif(scenes.length);
      try{localStorage.setItem(`nko_bk_${project?.id}`,JSON.stringify({scenes,ts:Date.now()}));}catch{}
      if(document.visibilityState==='hidden'){resRef.current=scenes;}else{onApply(scenes);setState('done');}
    }catch(e){setErr(e.message);setState('error');}
  };
  return(
    <div style={{marginBottom:18}}>
      {state==='analyzing'&&<div style={{background:notif==='granted'?'rgba(82,176,122,.1)':'rgba(254,237,97,.1)',border:`1px solid ${notif==='granted'?T.sage:T.goldDim}`,borderRadius:8,padding:'10px 14px',marginBottom:10}}><div style={{fontSize:12,color:notif==='granted'?T.sage:T.gold,fontFamily:'Manrope,sans-serif'}}>{notif==='granted'?'🔔 Notifications on — you can switch apps':'⚠️ Keep this screen open during analysis'}</div></div>}
      <div onClick={()=>(state==='idle'||state==='error')&&fr.current.click()} style={{background:T.hi,border:`2px dashed ${state==='analyzing'?T.gold:T.line}`,borderRadius:10,padding:20,textAlign:'center',cursor:(state==='idle'||state==='error')?'pointer':'default'}}>
        <input ref={fr} type="file" accept=".pdf,.txt,.fdx" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f)process(f);}}/>
        {state==='idle'&&<><div style={{fontSize:24,marginBottom:8}}>📋</div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:4}}>AI Script Breakdown</div><div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:10}}>Upload your script — cast, props, location, vehicles per scene</div>{notif==='granted'&&<div style={{fontSize:11,color:T.sage,fontFamily:'Manrope,sans-serif',marginBottom:8}}>🔔 Safe to switch apps during analysis</div>}{notif==='default'&&<div style={{fontSize:11,color:T.goldDim,fontFamily:'Manrope,sans-serif',marginBottom:8}}>💡 Allow notifications to switch apps freely</div>}<Btn variant="ghost" size="sm">Choose script</Btn></>}
        {state==='reading'&&<><div style={{fontSize:24,marginBottom:8}}>📖</div><div style={{color:T.cream,fontFamily:'Manrope,sans-serif'}}>Reading…</div></>}
        {state==='analyzing'&&<><div style={{fontSize:24,marginBottom:8}}>🤖</div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>Analyzing your script…</div></>}
        {state==='done'&&<><div style={{fontSize:24,marginBottom:8}}>✅</div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.sage,marginBottom:4}}>Breakdown complete</div><button onClick={e=>{e.stopPropagation();setState('idle');}} style={{color:T.gold,fontSize:12,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif',fontWeight:700}}>Analyze another →</button></>}
        {state==='error'&&<><div style={{fontSize:24,marginBottom:8}}>⚠️</div><div style={{fontSize:12,color:T.coral,fontFamily:'Manrope,sans-serif',marginBottom:8}}>{err}</div><Btn variant="ghost" size="sm" onClick={e=>{e.stopPropagation();setState('idle');setErr('');}}>Try again</Btn></>}
      </div>
    </div>
  );
}
function BreakdownView({project,scenes,onAddScene,onDeleteScene,onUpdateScene}){
  const[filter,setFilter]=useState('ALL');const[search,setSearch]=useState('');const mob=useIsMobile();
  if(!project)return<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>Select a production first.</div></div>;
  const ps=scenes.filter(s=>s.project_id===project.id);
  const filtered=ps.filter(s=>{const mf=filter==='ALL'||(filter==='INT'&&s.intExt==='INT')||(filter==='EXT'&&s.intExt==='EXT')||(filter==='DAY'&&s.dayNight==='DAY')||(filter==='NIGHT'&&s.dayNight==='NIGHT');const ms=!search||s.heading?.toLowerCase().includes(search.toLowerCase())||s.location?.toLowerCase().includes(search.toLowerCase());return mf&&ms;});
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:'Fraunces,serif',fontSize:mob?22:26,color:T.cream}}>Breakdown — {project.name}</div><div style={{fontSize:13,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Scene-by-scene: cast, props, location, vehicles, wardrobe and more.</div><div style={{marginTop:14}}><FS/></div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:20}}>
        <StatCard label="Scenes" value={ps.length} sub="in breakdown"/><StatCard label="INT" value={ps.filter(s=>s.intExt==='INT').length} sub="interior"/><StatCard label="EXT" value={ps.filter(s=>s.intExt==='EXT').length} sub="exterior"/><StatCard label="Night" value={ps.filter(s=>s.dayNight==='NIGHT').length} sub="shoots" accent={ps.filter(s=>s.dayNight==='NIGHT').length>0?T.coral:T.sage}/>
      </div>
      <BreakdownUploader project={project} onApply={ns=>ns.forEach(sc=>onAddScene({...sc,project_id:project.id,id:Math.random().toString(36).slice(2,10)}))}/>
      <div style={{overflowX:'auto',marginBottom:12}}><div style={{display:'flex',gap:6,minWidth:'max-content',paddingBottom:4}}>{['ALL','INT','EXT','DAY','NIGHT'].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${filter===f?T.gold:T.line}`,background:filter===f?T.goldGlow:'transparent',color:filter===f?T.gold:T.dim,fontSize:12,fontFamily:'Manrope,sans-serif',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>{f}</button>)}</div></div>
      <div style={{display:'flex',flexDirection:mob?'column':'row',gap:8,marginBottom:14}}>
        <Inp placeholder="Search scenes…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1}}/>
        {ps.length>0&&<Btn size="sm" variant="outline" onClick={()=>shareBreakdown(filtered,project)} style={{flexShrink:0}}>📄 Share / Export PDF</Btn>}
      </div>
      {filtered.length===0?<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:32,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>{ps.length===0?'No scenes yet. Upload your script or apply a Marketplace template.':'No scenes match your filter.'}</div></div>:filtered.map((sc,i)=><SceneCard key={sc.id||sc.sceneNumber} scene={sc} onDelete={onDeleteScene} onUpdate={onUpdateScene} index={i}/>)}
    </div>
  );
}

/* ── Marketplace (Notion-style) ── */
function CreatorCard({creator,selected,onClick}){
  const init=creator.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return(
    <button onClick={onClick} style={{background:selected?T.hi:T.panel,border:`1px solid ${selected?T.gold:T.line}`,borderRadius:12,padding:'16px 14px',textAlign:'left',cursor:'pointer',flexShrink:0,width:155}}>
      <div style={{width:40,height:40,borderRadius:'50%',background:selected?T.gold:T.hi,border:`2px solid ${selected?T.gold:T.line}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:selected?T.ink:T.goldDim,fontFamily:'Manrope,sans-serif',marginBottom:10}}>{init}</div>
      <div style={{fontFamily:'Fraunces,serif',fontSize:13,color:T.cream,marginBottom:2}}>{creator.name}</div>
      <div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:4}}>{creator.role}</div>
      <div style={{fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif'}}>{creator.loc} · {creator.downloads} uses</div>
      {creator.verified&&<div style={{fontSize:9,color:T.sage,fontFamily:'Manrope,sans-serif',fontWeight:700,marginTop:4}}>✓ NKO Verified</div>}
    </button>
  );
}
function MarketplaceView({onApplyTemplate}){
  const[cat,setCat]=useState('All');const[sel,setSel]=useState(null);const[search,setSearch]=useState('');const[applied,setApplied]=useState(null);const mob=useIsMobile();
  const filtered=COMMUNITY_TEMPLATES.filter(t=>(cat==='All'||t.type===cat)&&(!sel||t.author===sel)&&(!search||t.label.toLowerCase().includes(search.toLowerCase())||t.author.toLowerCase().includes(search.toLowerCase())));
  const featured=CREATORS[0];
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>Marketplace</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Community templates — budget + archetypal scenes bundled together.</div><div style={{marginTop:14}}><FS/></div></div>
      {/* Featured creator hero */}
      <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:12,padding:20,marginBottom:24,display:'flex',gap:16,alignItems:'center',flexWrap:mob?'wrap':'nowrap'}}>
        <div style={{width:52,height:52,borderRadius:'50%',background:T.gold,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,color:T.ink,fontFamily:'Manrope,sans-serif',flexShrink:0}}>{featured.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
        <div style={{flex:1}}><div style={{fontSize:10,color:T.goldDim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:3}}>Featured creator</div><div style={{fontFamily:'Fraunces,serif',fontSize:17,color:T.cream}}>{featured.name}</div><div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginTop:2}}>{featured.role} · {featured.loc}</div></div>
        <div style={{display:'flex',gap:16,flexShrink:0}}><div style={{textAlign:'center'}}><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:20,color:T.gold}}>2</div><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif'}}>templates</div></div><div style={{textAlign:'center'}}><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:20,color:T.gold}}>{featured.downloads}</div><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif'}}>uses</div></div></div>
      </div>
      {/* Creator row */}
      <div style={{marginBottom:20}}><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:12}}>Browse by creator</div>
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}><div style={{display:'flex',gap:10,paddingBottom:8,minWidth:'max-content'}}>
          <button onClick={()=>setSel(null)} style={{background:!sel?T.hi:T.panel,border:`1px solid ${!sel?T.gold:T.line}`,borderRadius:12,padding:'10px 14px',cursor:'pointer',color:!sel?T.gold:T.dim,fontSize:12,fontFamily:'Manrope,sans-serif',fontWeight:700,flexShrink:0}}>All creators</button>
          {CREATORS.map(c=><CreatorCard key={c.id} creator={c} selected={sel===c.name} onClick={()=>setSel(sel===c.name?null:c.name)}/>)}
        </div></div>
      </div>
      {/* Search + category */}
      <Inp placeholder="Search templates…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:12}}/>
      <div style={{overflowX:'auto',marginBottom:20}}><div style={{display:'flex',gap:6,minWidth:'max-content',paddingBottom:4}}>{MKTCAT.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${cat===c?T.gold:T.line}`,background:cat===c?T.goldGlow:'transparent',color:cat===c?T.gold:T.dim,fontSize:12,fontFamily:'Manrope,sans-serif',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>{c}</button>)}</div></div>
      {/* Template grid */}
      {filtered.length===0?<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:32,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>No templates match.</div></div>:
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:14}}>
        {filtered.map(tpl=>{const total=tpl.items.reduce((s,i)=>s+lTot(i),0);const isApp=applied===tpl.id;const c=CREATORS.find(c=>c.name===tpl.author);const init=tpl.author.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
        return<div key={tpl.id} style={{background:T.panel,border:`1px solid ${isApp?T.sage:T.line}`,borderRadius:12,padding:18,display:'flex',flexDirection:'column',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:T.hi,border:`1px solid ${T.line}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:T.goldDim,fontFamily:'Manrope,sans-serif',flexShrink:0}}>{init}</div>
            <div><div style={{fontSize:11,color:T.cream,fontFamily:'Manrope,sans-serif',fontWeight:600}}>{tpl.author}</div>{c?.verified&&<div style={{fontSize:9,color:T.sage,fontFamily:'Manrope,sans-serif',fontWeight:700}}>✓ Verified</div>}</div>
          </div>
          <div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:3}}>{tpl.label}</div><div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{tpl.sub}</div></div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <Pill>{tpl.type.split('/')[0].trim()}</Pill>
            <span style={{fontSize:10,background:'rgba(82,176,122,.15)',color:T.sage,padding:'2px 8px',borderRadius:10,fontFamily:'Manrope,sans-serif',fontWeight:700,border:`1px solid ${T.sage}`}}>📊 Budget</span>
            {tpl.scenes?.length>0&&<span style={{fontSize:10,background:'rgba(74,144,217,.15)',color:T.sapphire,padding:'2px 8px',borderRadius:10,fontFamily:'Manrope,sans-serif',fontWeight:700,border:`1px solid ${T.sapphire}`}}>📋 {tpl.scenes.length} scenes</span>}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:15,color:T.gold}}>₦{fmt(total)}</div><div style={{fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif'}}>{tpl.items.length} lines · {tpl.downloads} uses</div></div>
            <Btn size="sm" variant={isApp?'sage':'outline'} onClick={()=>{onApplyTemplate(tpl);setApplied(tpl.id);setTimeout(()=>setApplied(null),3000);}}>{isApp?'✓ Applied':'Use template'}</Btn>
          </div>
        </div>;})}
      </div>}
      <div style={{marginTop:28,padding:'20px 24px',background:T.panel,border:`1px solid ${T.line}`,borderRadius:12,textAlign:'center'}}><div style={{fontFamily:'Fraunces,serif',fontSize:17,color:T.cream,marginBottom:6}}>Publish your template</div><div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:14,lineHeight:1.6}}>Share a budget that works and earn an NKO Verified badge.</div><Btn variant="outline" onClick={()=>window.open('mailto:hello@nko.film?subject=Template submission','_blank')}>Submit a template →</Btn></div>
    </div>
  );
}

/* ── MainApp ── */
function MainApp(){
  const{user,signOut}=useAuth();
  const[view,setView]=useState('dashboard');
  const[projects,setProjects]=useState([]);const[budgetItems,setBudgetItems]=useState([]);const[advances,setAdvances]=useState([]);const[reconEntries,setReconEntries]=useState([]);const[payees,setPayees]=useState([]);const[scenes,setScenes]=useState([]);
  const[currentId,setCurrentId]=useState(null);const[mobile,setMobile]=useState(window.innerWidth<700);const[showNewModal,setShowNewModal]=useState(false);
  useEffect(()=>{const h=()=>setMobile(window.innerWidth<700);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h);},[]);

  useEffect(()=>{if(!user)return;
    const loadAll=async()=>{
      const[pr,bi,ad,re,py]=await Promise.all([
        sb.from('projects').select('*').eq('user_id',user.id).order('created_at',{ascending:false}),
        sb.from('budget_items').select('*').eq('user_id',user.id),
        sb.from('advances').select('*').eq('user_id',user.id),
        sb.from('recon_entries').select('*').eq('user_id',user.id),
        sb.from('payees').select('*').eq('user_id',user.id),
      ]);
      if(pr.data)setProjects(pr.data);if(bi.data)setBudgetItems(bi.data);if(ad.data)setAdvances(ad.data);if(re.data)setReconEntries(re.data);if(py.data)setPayees(py.data);
    };loadAll();},[user]);

  const project=projects.find(p=>p.id===currentId)||null;
  const pBudget=budgetItems.filter(i=>i.project_id===currentId);
  const pAdvances=advances.filter(a=>a.project_id===currentId);

  const createProject=async d=>{const{data,error}=await sb.from('projects').insert({...d,user_id:user.id}).select().single();if(!error&&data){setProjects(p=>[data,...p]);setCurrentId(data.id);setView('budgets');}};
  const deleteProjects=async ids=>{for(const id of ids)await sb.from('projects').delete().eq('id',id);setProjects(p=>p.filter(x=>!ids.includes(x.id)));setBudgetItems(p=>p.filter(x=>!ids.includes(x.project_id)));setAdvances(p=>p.filter(x=>!ids.includes(x.project_id)));setPayees(p=>p.filter(x=>!ids.includes(x.project_id)));setScenes(p=>p.filter(x=>!ids.includes(x.project_id)));if(ids.includes(currentId)){setCurrentId(null);setView('dashboard');}};
  const addBudgetItem=async dept=>{const{data,error}=await sb.from('budget_items').insert({project_id:currentId,user_id:user.id,dept,description:'',qty:1,unit:'flat',rate:0,currency:project.base_currency}).select().single();if(!error&&data)setBudgetItems(p=>[...p,data]);};
  const updateBudgetItem=async(id,upd)=>{setBudgetItems(p=>p.map(i=>i.id===id?{...i,...upd}:i));await sb.from('budget_items').update(upd).eq('id',id);};
  const removeBudgetItem=async id=>{setBudgetItems(p=>p.filter(i=>i.id!==id));await sb.from('budget_items').delete().eq('id',id);};
  const applyTemplate=async tpl=>{
    const rows=tpl.items.map(t=>({
      project_id:currentId,
      user_id:user.id,
      dept:t.dept,
      description:t.description,
      qty:Number(t.qty)||1,
      unit:t.unit,
      rate:Number(t.rate)||0,
      currency:project.base_currency,
    }));
    const{data,error}=await sb.from('budget_items').insert(rows).select();
    if(error){alert(`Could not apply template: ${error.message}`);return;}
    if(data)setBudgetItems(p=>[...p,...data]);
    if(tpl.scenes?.length){const sc=tpl.scenes.map(s=>({...s,project_id:currentId,id:Math.random().toString(36).slice(2,10)}));setScenes(p=>[...p,...sc]);}
  };
  const applyScriptBudget=async lines=>{
    const rows=lines.map(l=>({
      project_id:currentId,
      user_id:user.id,
      dept:DEPTS.includes(l.dept)?l.dept:'Crew',
      description:String(l.description||'').slice(0,200),
      qty:Number(l.qty)||1,
      unit:UNITS.includes(l.unit)?l.unit:'flat',
      rate:Number(l.rate)||0,
      currency:project.base_currency,
    }));
    const{data,error}=await sb.from('budget_items').insert(rows).select();
    if(error){alert(`Could not apply budget: ${error.message}`);return;}
    if(data)setBudgetItems(p=>[...p,...data]);
  };
  const addAdvance=async a=>{const{data,error}=await sb.from('advances').insert({...a,user_id:user.id}).select().single();if(error){alert(`Could not save advance: ${error.message}`);return;}if(data)setAdvances(p=>[...p,data]);};
  const updateAdvance=async(id,upd)=>{setAdvances(p=>p.map(a=>a.id===id?{...a,...upd}:a));const{error}=await sb.from('advances').update(upd).eq('id',id);if(error)alert(`Could not update advance: ${error.message}`);};
  const addReconEntry=async e=>{const{data,error}=await sb.from('recon_entries').insert({...e,user_id:user.id}).select().single();if(error){alert(`Could not save expense: ${error.message}`);return;}if(data)setReconEntries(p=>[...p,data]);};
  /* Top-up an advance — increases the amount when more cash is received */
  const topUpAdvance=async(id,extra)=>{
    const adv=advances.find(a=>a.id===id);if(!adv)return;
    const newAmount=Number(adv.amount)+Number(extra);
    setAdvances(p=>p.map(a=>a.id===id?{...a,amount:newAmount,status:'open'}:a));
    const{error}=await sb.from('advances').update({amount:newAmount,status:'open'}).eq('id',id);
    if(error)alert(`Could not top up: ${error.message}`);
  };
  const removeReconEntry=async id=>{setReconEntries(p=>p.filter(e=>e.id!==id));await sb.from('recon_entries').delete().eq('id',id);};
  const addPayee=async p=>{
    const{data,error}=await sb.from('payees').insert({...p,user_id:user.id,payments:[]}).select().single();
    if(error){alert(`Could not save payee: ${error.message}`);return;}
    if(data)setPayees(prev=>[...prev,{...data,payments:data.payments||[]}]);
  };
  const addPayment=async(pid,pay)=>{
    const payee=payees.find(x=>x.id===pid);if(!payee)return;
    const newPayments=[...(payee.payments||[]),pay];
    setPayees(p=>p.map(x=>x.id===pid?{...x,payments:newPayments}:x));
    const{error}=await sb.from('payees').update({payments:newPayments}).eq('id',pid);
    if(error)alert(`Could not save payment: ${error.message}`);
  };
  const removePayment=async(pid,idx)=>{
    const payee=payees.find(x=>x.id===pid);if(!payee)return;
    const newPayments=(payee.payments||[]).filter((_,i)=>i!==idx);
    setPayees(p=>p.map(x=>x.id===pid?{...x,payments:newPayments}:x));
    const{error}=await sb.from('payees').update({payments:newPayments}).eq('id',pid);
    if(error)alert(`Could not remove payment: ${error.message}`);
  };

  const pReconEntries=reconEntries.filter(e=>pAdvances.some(a=>a.id===e.advance_id));

  return(
    <div style={{minHeight:'100vh',background:T.ink,display:'flex',color:T.cream}}>
      {!mobile&&<Sidebar view={view} setView={setView} onSignOut={signOut} userEmail={user?.email}/>}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        <TopBar view={view} setView={setView} projects={projects} currentId={currentId} onSelect={id=>{setCurrentId(id||null);}} onCreate={()=>{setView('dashboard');setShowNewModal(true);}}/>
        <div style={{flex:1,overflowY:'auto',padding:mobile?'16px 14px 90px':'24px 28px'}}>
          {view==='dashboard'&&<DashboardView projects={projects} budgetItems={budgetItems} advances={advances} payees={payees} currentId={currentId} onSelect={id=>{setCurrentId(id);setView('budgets');}} onCreate={createProject} onDelete={deleteProjects} showModal={showNewModal} setShowModal={setShowNewModal}/>}
          {view==='budgets'&&<BudgetsView project={project} items={pBudget} advances={pAdvances} reconEntries={pReconEntries} onAdd={addBudgetItem} onUpdate={updateBudgetItem} onRemove={removeBudgetItem} onApplyTemplate={applyTemplate} onApplyScript={applyScriptBudget}/>}
          {view==='breakdown'&&<BreakdownView project={project} scenes={scenes} onAddScene={sc=>setScenes(p=>[...p,sc])} onDeleteScene={id=>setScenes(p=>p.filter(s=>s.id!==id))} onUpdateScene={(id,upd)=>setScenes(p=>p.map(s=>s.id===id?{...s,...upd}:s))}/>}
          {view==='recon'&&<ReconView project={project} advances={pAdvances} reconEntries={pReconEntries} onAddAdvance={addAdvance} onUpdateAdvance={updateAdvance} onAddEntry={addReconEntry} onRemoveEntry={removeReconEntry} onTopUp={topUpAdvance}/>}
          {view==='payments'&&<PaymentsView project={project} payees={payees.filter(p=>p.project_id===currentId)} onAddPayee={addPayee} onAddPayment={addPayment} onRemovePayment={removePayment}/>}
          {view==='market'&&<MarketplaceView onApplyTemplate={async tpl=>{if(currentId)await applyTemplate(tpl);else{setView('dashboard');}}}/>}
          {view==='ai'&&<AIView project={project} budgetItems={pBudget} advances={pAdvances}/>}
        </div>
      </div>
      {mobile&&<MobileNav view={view} setView={setView}/>}
    </div>
  );
}

/* ── Root ── */
function AuthGate(){const{user}=useAuth();return user?<MainApp/>:<AuthScreen/>;}
export default function App(){
  useEffect(()=>{
    document.body.style.background='#0F0120';
    document.body.style.margin='0';
    document.body.style.padding='0';
  },[]);
  return<AuthProvider><AuthGate/></AuthProvider>;
}
