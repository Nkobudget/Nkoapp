import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
/*
 ═══════════════════════════════════════════════════════════════
   NKO — Budgets tailored just for you  |  Supabase Edition
 ═══════════════════════════════════════════════════════════════

 SETUP (5 steps):
 1. Go to supabase.com → create a free project
 2. Settings → API → copy Project URL + anon public key
 3. Paste them below where it says YOUR_SUPABASE_URL etc.
 4. Go to SQL Editor in Supabase → paste and run setup.sql
 5. In StackBlitz terminal: npm install @supabase/supabase-js

 ═══════════════════════════════════════════════════════════════
*/

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

/* ── YOUR SUPABASE CREDENTIALS (replace these) ─────────── */
const SUPABASE_URL = 'https://pvyrfjgrfmuvivdflcgg.supabase.co'; const SUPABASE_ANON_KEY = 'sb_publishable_KoI_EHwLNl8IlbB60Zgmng_TsuvaZUv';
/* ─────────────────────────────────────────────────────────── */

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ═══════════════════════════════════════════════════════
   TOKENS
═══════════════════════════════════════════════════════ */
const T = {
  ink:"#0F0120", panel:"#1A0835", hi:"#241050",
  gold:"#FEED61", goldMid:"#D0C548", goldDim:"#8C852E",
  goldGlow:"rgba(254,237,97,0.09)",
  cream:"#F5EDD6", dim:"#9A9080", faint:"#4A4438",
  line:"rgba(254,237,97,0.13)",
  coral:"#E06B52", sage:"#52B07A", sapphire:"#4A90D9",
};

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const CURRENCIES = [
  {code:"NGN",symbol:"₦",name:"Nigerian Naira"},
  {code:"GHS",symbol:"₵",name:"Ghanaian Cedi"},
  {code:"KES",symbol:"KSh",name:"Kenyan Shilling"},
  {code:"ZAR",symbol:"R",name:"South African Rand"},
  {code:"TZS",symbol:"TSh",name:"Tanzanian Shilling"},
  {code:"UGX",symbol:"USh",name:"Ugandan Shilling"},
  {code:"XOF",symbol:"CFA",name:"West African CFA"},
  {code:"XAF",symbol:"FCFA",name:"Central African CFA"},
  {code:"EGP",symbol:"E£",name:"Egyptian Pound"},
  {code:"MAD",symbol:"DH",name:"Moroccan Dirham"},
  {code:"ETB",symbol:"Br",name:"Ethiopian Birr"},
  {code:"RWF",symbol:"FRw",name:"Rwandan Franc"},
  {code:"USD",symbol:"$",name:"US Dollar"},
  {code:"GBP",symbol:"£",name:"British Pound"},
  {code:"EUR",symbol:"€",name:"Euro"},
];
const DEPTS = ["Cast & Talent","Crew","Locations & Transport","Equipment","Post-Production","Marketing","Contingency"];
const UNITS = ["day","week","flat","person","item"];
const PROJ_TYPES = ["Feature Film","Vertical Series / Microdrama","Short Film","Music Video","Documentary","Branded Content","Animation / Cartoon","Other"];
const PAY_METHODS = ["Cash","Bank Transfer","OPay / PalmPay","M-Pesa","MTN Mobile Money","Airtel Money","Cheque","Other"];

const TEMPLATES = [
  {id:"feature",label:"Feature Film",type:"Feature Film",sub:"12-day Nollywood indie · full crew",items:[
    // Cast & Talent
    {dept:"Cast & Talent",description:"Lead actor — negotiated flat",qty:1,unit:"flat",rate:800000},
    {dept:"Cast & Talent",description:"Supporting cast",qty:4,unit:"person",rate:150000},
    {dept:"Cast & Talent",description:"Day players / minor roles",qty:6,unit:"person",rate:30000},
    {dept:"Cast & Talent",description:"Extras / background artists",qty:1,unit:"flat",rate:100000},
    // Crew
    {dept:"Crew",description:"Director",qty:1,unit:"flat",rate:400000},
    {dept:"Crew",description:"Director of Photography",qty:1,unit:"flat",rate:300000},
    {dept:"Crew",description:"Camera operator (2nd)",qty:12,unit:"day",rate:20000},
    {dept:"Crew",description:"Sound recordist",qty:12,unit:"day",rate:18000},
    {dept:"Crew",description:"Boom operator",qty:12,unit:"day",rate:12000},
    {dept:"Crew",description:"Gaffer / chief lighting",qty:12,unit:"day",rate:15000},
    {dept:"Crew",description:"Art director / production designer",qty:1,unit:"flat",rate:120000},
    {dept:"Crew",description:"Wardrobe / stylist",qty:12,unit:"day",rate:12000},
    {dept:"Crew",description:"Hair & make-up artist",qty:12,unit:"day",rate:12000},
    {dept:"Crew",description:"Unit manager",qty:1,unit:"flat",rate:80000},
    {dept:"Crew",description:"Production assistant x3",qty:3,unit:"person",rate:50000},
    {dept:"Crew",description:"Script supervisor / continuity",qty:12,unit:"day",rate:10000},
    // Locations & Transport
    {dept:"Locations & Transport",description:"Location fees / permits",qty:12,unit:"day",rate:25000},
    {dept:"Locations & Transport",description:"Transport — cast & crew buses",qty:12,unit:"day",rate:40000},
    {dept:"Locations & Transport",description:"Generator fuel & logistics",qty:12,unit:"day",rate:20000},
    {dept:"Locations & Transport",description:"Feeding on set (breakfast & lunch)",qty:12,unit:"day",rate:35000},
    {dept:"Locations & Transport",description:"Accommodation (if away from base)",qty:1,unit:"flat",rate:150000},
    // Equipment
    {dept:"Equipment",description:"Camera package (body + lenses)",qty:12,unit:"day",rate:35000},
    {dept:"Equipment",description:"Lighting package",qty:12,unit:"day",rate:25000},
    {dept:"Equipment",description:"Sound kit (mixer, mics, booms)",qty:12,unit:"day",rate:10000},
    {dept:"Equipment",description:"Generator hire",qty:12,unit:"day",rate:15000},
    {dept:"Equipment",description:"Grip / dolly / stabiliser rental",qty:1,unit:"flat",rate:80000},
    {dept:"Equipment",description:"Props purchase & rentals",qty:1,unit:"flat",rate:80000},
    {dept:"Equipment",description:"Wardrobe & costumes",qty:1,unit:"flat",rate:60000},
    {dept:"Equipment",description:"Set dressing & art materials",qty:1,unit:"flat",rate:50000},
    // Post
    {dept:"Post-Production",description:"Offline edit",qty:1,unit:"flat",rate:200000},
    {dept:"Post-Production",description:"Colour grade",qty:1,unit:"flat",rate:100000},
    {dept:"Post-Production",description:"Sound mix & design",qty:1,unit:"flat",rate:80000},
    {dept:"Post-Production",description:"Original score / music licensing",qty:1,unit:"flat",rate:80000},
    {dept:"Post-Production",description:"VFX / titles / graphics",qty:1,unit:"flat",rate:50000},
    // Marketing
    {dept:"Marketing",description:"Poster design & print",qty:1,unit:"flat",rate:50000},
    {dept:"Marketing",description:"Trailer / teaser cut",qty:1,unit:"flat",rate:60000},
    {dept:"Marketing",description:"BTS photography & video",qty:1,unit:"flat",rate:30000},
    // Contingency
    {dept:"Contingency",description:"Contingency reserve (10%)",qty:1,unit:"flat",rate:300000},
  ]},

  {id:"vertical",label:"Vertical Series",type:"Vertical Series / Microdrama",sub:"7-day block shoot · 5–10 episodes · full crew",items:[
    // Cast & Talent
    {dept:"Cast & Talent",description:"Lead actors",qty:3,unit:"person",rate:100000},
    {dept:"Cast & Talent",description:"Supporting cast",qty:5,unit:"person",rate:40000},
    {dept:"Cast & Talent",description:"Day players",qty:4,unit:"person",rate:15000},
    {dept:"Cast & Talent",description:"Extras",qty:1,unit:"flat",rate:30000},
    // Crew
    {dept:"Crew",description:"Director",qty:1,unit:"flat",rate:150000},
    {dept:"Crew",description:"Director of Photography / Camera operator",qty:1,unit:"flat",rate:120000},
    {dept:"Crew",description:"2nd camera operator",qty:7,unit:"day",rate:15000},
    {dept:"Crew",description:"Sound recordist",qty:7,unit:"day",rate:15000},
    {dept:"Crew",description:"Boom operator",qty:7,unit:"day",rate:10000},
    {dept:"Crew",description:"Gaffer / lighting technician",qty:7,unit:"day",rate:12000},
    {dept:"Crew",description:"Hair & make-up artist",qty:7,unit:"day",rate:10000},
    {dept:"Crew",description:"Wardrobe / costume assistant",qty:7,unit:"day",rate:8000},
    {dept:"Crew",description:"Art director / set decorator",qty:1,unit:"flat",rate:60000},
    {dept:"Crew",description:"Unit manager",qty:1,unit:"flat",rate:50000},
    {dept:"Crew",description:"Production assistants",qty:2,unit:"person",rate:30000},
    {dept:"Crew",description:"Script supervisor",qty:7,unit:"day",rate:8000},
    // Locations & Transport
    {dept:"Locations & Transport",description:"Location fees / permits",qty:7,unit:"day",rate:15000},
    {dept:"Locations & Transport",description:"Transport — cast & crew",qty:7,unit:"day",rate:25000},
    {dept:"Locations & Transport",description:"Feeding on set (x2 meals per day)",qty:7,unit:"day",rate:20000},
    {dept:"Locations & Transport",description:"Generator fuel & logistics",qty:7,unit:"day",rate:12000},
    // Equipment
    {dept:"Equipment",description:"Camera & gimbal package",qty:7,unit:"day",rate:25000},
    {dept:"Equipment",description:"Lighting kit",qty:7,unit:"day",rate:15000},
    {dept:"Equipment",description:"Sound kit",qty:7,unit:"day",rate:8000},
    {dept:"Equipment",description:"Generator hire",qty:7,unit:"day",rate:10000},
    {dept:"Equipment",description:"Props purchase & rentals",qty:1,unit:"flat",rate:40000},
    {dept:"Equipment",description:"Wardrobe & costumes",qty:1,unit:"flat",rate:35000},
    {dept:"Equipment",description:"Set dressing & art materials",qty:1,unit:"flat",rate:25000},
    // Post
    {dept:"Post-Production",description:"Episode edits",qty:8,unit:"item",rate:15000},
    {dept:"Post-Production",description:"Colour grade (all episodes)",qty:1,unit:"flat",rate:50000},
    {dept:"Post-Production",description:"Sound design & mix",qty:1,unit:"flat",rate:30000},
    {dept:"Post-Production",description:"Subtitles / captions",qty:8,unit:"item",rate:3000},
    {dept:"Post-Production",description:"Music licensing / score",qty:1,unit:"flat",rate:30000},
    // Marketing
    {dept:"Marketing",description:"Thumbnails & key art",qty:1,unit:"flat",rate:20000},
    {dept:"Marketing",description:"Teaser / trailer cut",qty:1,unit:"flat",rate:20000},
    {dept:"Marketing",description:"Social media cutdowns",qty:5,unit:"item",rate:5000},
    // Contingency
    {dept:"Contingency",description:"Contingency reserve (10%)",qty:1,unit:"flat",rate:100000},
  ]},

  {id:"shortfilm",label:"Short Film",type:"Short Film",sub:"2-day lean shoot · festival or student entry",items:[
    // Cast & Talent
    {dept:"Cast & Talent",description:"Lead actor",qty:1,unit:"flat",rate:80000},
    {dept:"Cast & Talent",description:"Supporting cast",qty:2,unit:"person",rate:30000},
    {dept:"Cast & Talent",description:"Extras",qty:1,unit:"flat",rate:15000},
    // Crew
    {dept:"Crew",description:"Director",qty:1,unit:"flat",rate:80000},
    {dept:"Crew",description:"DOP / camera operator",qty:1,unit:"flat",rate:60000},
    {dept:"Crew",description:"Sound recordist",qty:2,unit:"day",rate:12000},
    {dept:"Crew",description:"Boom operator",qty:2,unit:"day",rate:8000},
    {dept:"Crew",description:"Gaffer / lighting",qty:2,unit:"day",rate:10000},
    {dept:"Crew",description:"Hair & make-up",qty:2,unit:"day",rate:8000},
    {dept:"Crew",description:"Wardrobe",qty:2,unit:"day",rate:6000},
    {dept:"Crew",description:"Art director",qty:1,unit:"flat",rate:30000},
    {dept:"Crew",description:"Production assistant",qty:2,unit:"person",rate:15000},
    // Locations & Transport
    {dept:"Locations & Transport",description:"Location fees / permits",qty:2,unit:"day",rate:10000},
    {dept:"Locations & Transport",description:"Transport — cast & crew",qty:2,unit:"day",rate:15000},
    {dept:"Locations & Transport",description:"Feeding on set",qty:2,unit:"day",rate:12000},
    {dept:"Locations & Transport",description:"Generator fuel & logistics",qty:2,unit:"day",rate:8000},
    // Equipment
    {dept:"Equipment",description:"Camera package",qty:2,unit:"day",rate:20000},
    {dept:"Equipment",description:"Lighting kit",qty:2,unit:"day",rate:12000},
    {dept:"Equipment",description:"Sound kit",qty:2,unit:"day",rate:6000},
    {dept:"Equipment",description:"Generator hire",qty:2,unit:"day",rate:8000},
    {dept:"Equipment",description:"Props & set dressing",qty:1,unit:"flat",rate:20000},
    {dept:"Equipment",description:"Wardrobe & costumes",qty:1,unit:"flat",rate:15000},
    // Post
    {dept:"Post-Production",description:"Offline edit",qty:1,unit:"flat",rate:60000},
    {dept:"Post-Production",description:"Colour grade",qty:1,unit:"flat",rate:30000},
    {dept:"Post-Production",description:"Sound mix",qty:1,unit:"flat",rate:20000},
    {dept:"Post-Production",description:"Music / score",qty:1,unit:"flat",rate:15000},
    // Marketing
    {dept:"Marketing",description:"Poster & stills",qty:1,unit:"flat",rate:15000},
    {dept:"Marketing",description:"Festival submission fees",qty:3,unit:"item",rate:10000},
    // Contingency
    {dept:"Contingency",description:"Contingency reserve (10%)",qty:1,unit:"flat",rate:50000},
  ]},

  {id:"musicvideo",label:"Music Video",type:"Music Video",sub:"1-day shoot · artist, director & full crew",items:[
    // Cast & Talent
    {dept:"Cast & Talent",description:"Artist / main performer",qty:1,unit:"flat",rate:200000},
    {dept:"Cast & Talent",description:"Background talent / dancers",qty:6,unit:"person",rate:15000},
    {dept:"Cast & Talent",description:"Featured artists / cameos",qty:1,unit:"flat",rate:50000},
    // Crew
    {dept:"Crew",description:"Director",qty:1,unit:"flat",rate:150000},
    {dept:"Crew",description:"Director of Photography",qty:1,unit:"flat",rate:100000},
    {dept:"Crew",description:"Camera operator (2nd)",qty:1,unit:"day",rate:35000},
    {dept:"Crew",description:"Gaffer / chief lighting",qty:1,unit:"day",rate:25000},
    {dept:"Crew",description:"Sound recordist (playback)",qty:1,unit:"day",rate:20000},
    {dept:"Crew",description:"Stylist / wardrobe",qty:1,unit:"day",rate:35000},
    {dept:"Crew",description:"Hair & make-up artist",qty:1,unit:"day",rate:30000},
    {dept:"Crew",description:"Art director",qty:1,unit:"flat",rate:60000},
    {dept:"Crew",description:"Production assistant",qty:2,unit:"person",rate:15000},
    // Locations & Transport
    {dept:"Locations & Transport",description:"Location / studio hire",qty:1,unit:"flat",rate:80000},
    {dept:"Locations & Transport",description:"Transport — artist, crew & equipment",qty:1,unit:"flat",rate:50000},
    {dept:"Locations & Transport",description:"Feeding & catering",qty:1,unit:"flat",rate:30000},
    {dept:"Locations & Transport",description:"Generator fuel & logistics",qty:1,unit:"day",rate:15000},
    // Equipment
    {dept:"Equipment",description:"Camera package + lenses",qty:1,unit:"day",rate:60000},
    {dept:"Equipment",description:"Gimbal / stabiliser rental",qty:1,unit:"day",rate:20000},
    {dept:"Equipment",description:"Lighting & grip package",qty:1,unit:"day",rate:40000},
    {dept:"Equipment",description:"Generator hire",qty:1,unit:"day",rate:15000},
    {dept:"Equipment",description:"Props & set dressing rentals",qty:1,unit:"flat",rate:40000},
    {dept:"Equipment",description:"Wardrobe & costumes",qty:1,unit:"flat",rate:30000},
    // Post
    {dept:"Post-Production",description:"Edit & colour grade",qty:1,unit:"flat",rate:120000},
    {dept:"Post-Production",description:"VFX / motion graphics",qty:1,unit:"flat",rate:50000},
    {dept:"Post-Production",description:"Audio mix / mastering",qty:1,unit:"flat",rate:30000},
    // Marketing
    {dept:"Marketing",description:"BTS content cut",qty:1,unit:"flat",rate:20000},
    {dept:"Marketing",description:"Social media stills",qty:1,unit:"flat",rate:10000},
    // Contingency
    {dept:"Contingency",description:"Contingency reserve (10%)",qty:1,unit:"flat",rate:100000},
  ]},

  {id:"documentary",label:"Documentary",type:"Documentary",sub:"5-day field shoot · interview & observational",items:[
    // Cast & Talent
    {dept:"Cast & Talent",description:"Subject / participant honoraria",qty:3,unit:"person",rate:20000},
    {dept:"Cast & Talent",description:"Presenter / narrator fee",qty:1,unit:"flat",rate:80000},
    // Crew
    {dept:"Crew",description:"Director / producer",qty:1,unit:"flat",rate:200000},
    {dept:"Crew",description:"Camera operator",qty:1,unit:"flat",rate:120000},
    {dept:"Crew",description:"2nd camera (B-roll)",qty:3,unit:"day",rate:20000},
    {dept:"Crew",description:"Sound recordist",qty:5,unit:"day",rate:15000},
    {dept:"Crew",description:"Boom operator",qty:5,unit:"day",rate:10000},
    {dept:"Crew",description:"Fixer / researcher / translator",qty:5,unit:"day",rate:15000},
    {dept:"Crew",description:"Production assistant",qty:1,unit:"person",rate:30000},
    // Locations & Transport
    {dept:"Locations & Transport",description:"Travel & accommodation",qty:1,unit:"flat",rate:200000},
    {dept:"Locations & Transport",description:"Local transport & fuel",qty:5,unit:"day",rate:20000},
    {dept:"Locations & Transport",description:"Feeding — crew & subjects",qty:5,unit:"day",rate:15000},
    {dept:"Locations & Transport",description:"Location fees / access permits",qty:1,unit:"flat",rate:50000},
    // Equipment
    {dept:"Equipment",description:"Camera & audio kit",qty:5,unit:"day",rate:30000},
    {dept:"Equipment",description:"Drone hire (with pilot)",qty:2,unit:"day",rate:50000},
    {dept:"Equipment",description:"Lighting kit (interview setup)",qty:5,unit:"day",rate:15000},
    {dept:"Equipment",description:"Generator hire",qty:5,unit:"day",rate:10000},
    // Post
    {dept:"Post-Production",description:"Assembly & offline edit",qty:1,unit:"flat",rate:200000},
    {dept:"Post-Production",description:"Colour grade",qty:1,unit:"flat",rate:60000},
    {dept:"Post-Production",description:"Sound mix & design",qty:1,unit:"flat",rate:50000},
    {dept:"Post-Production",description:"Archival / stock footage licensing",qty:1,unit:"flat",rate:50000},
    {dept:"Post-Production",description:"Motion graphics & titles",qty:1,unit:"flat",rate:40000},
    {dept:"Post-Production",description:"Music licensing / score",qty:1,unit:"flat",rate:40000},
    // Marketing
    {dept:"Marketing",description:"Festival submission fees",qty:5,unit:"item",rate:15000},
    {dept:"Marketing",description:"Trailer / teaser cut",qty:1,unit:"flat",rate:30000},
    // Contingency
    {dept:"Contingency",description:"Contingency reserve (10%)",qty:1,unit:"flat",rate:120000},
  ]},

  {id:"branded",label:"Branded / Podcast",type:"Branded Content",sub:"Sponsored episode or branded content shoot",items:[
    // Cast & Talent
    {dept:"Cast & Talent",description:"Host / presenter",qty:1,unit:"flat",rate:100000},
    {dept:"Cast & Talent",description:"Guest honorarium",qty:2,unit:"person",rate:30000},
    {dept:"Cast & Talent",description:"Voiceover artist",qty:1,unit:"flat",rate:20000},
    // Crew
    {dept:"Crew",description:"Director / producer",qty:1,unit:"flat",rate:100000},
    {dept:"Crew",description:"Camera operator",qty:2,unit:"day",rate:35000},
    {dept:"Crew",description:"Sound recordist",qty:2,unit:"day",rate:20000},
    {dept:"Crew",description:"Boom operator",qty:2,unit:"day",rate:12000},
    {dept:"Crew",description:"Gaffer / lighting",qty:2,unit:"day",rate:15000},
    {dept:"Crew",description:"Hair & make-up",qty:2,unit:"day",rate:12000},
    {dept:"Crew",description:"Production assistant",qty:1,unit:"person",rate:20000},
    // Locations & Transport
    {dept:"Locations & Transport",description:"Location / studio hire",qty:2,unit:"day",rate:40000},
    {dept:"Locations & Transport",description:"Transport — crew & equipment",qty:2,unit:"day",rate:20000},
    {dept:"Locations & Transport",description:"Feeding & catering",qty:2,unit:"day",rate:15000},
    {dept:"Locations & Transport",description:"Generator fuel & logistics",qty:2,unit:"day",rate:10000},
    // Equipment
    {dept:"Equipment",description:"Camera & lens package",qty:2,unit:"day",rate:30000},
    {dept:"Equipment",description:"Lighting kit",qty:2,unit:"day",rate:15000},
    {dept:"Equipment",description:"Audio / podcast kit",qty:2,unit:"day",rate:12000},
    {dept:"Equipment",description:"Teleprompter rental",qty:2,unit:"day",rate:8000},
    // Post
    {dept:"Post-Production",description:"Edit & colour",qty:1,unit:"flat",rate:80000},
    {dept:"Post-Production",description:"Sound mix",qty:1,unit:"flat",rate:25000},
    {dept:"Post-Production",description:"Captions & subtitles",qty:1,unit:"flat",rate:15000},
    {dept:"Post-Production",description:"Graphics / lower thirds",qty:1,unit:"flat",rate:20000},
    // Marketing
    {dept:"Marketing",description:"Social media cutdowns",qty:3,unit:"item",rate:10000},
    {dept:"Marketing",description:"Thumbnail design",qty:1,unit:"flat",rate:10000},
    // Contingency
    {dept:"Contingency",description:"Contingency reserve (10%)",qty:1,unit:"flat",rate:60000},
  ]},
  {id:"animation",label:"Animation / Cartoon",type:"Animation / Cartoon",sub:"2D/3D animated episode · African studio pipeline",items:[
    {dept:"Cast & Talent",description:"Lead voice actor",qty:1,unit:"flat",rate:150000},
    {dept:"Cast & Talent",description:"Supporting voice cast",qty:4,unit:"person",rate:50000},
    {dept:"Cast & Talent",description:"Narrator / announcer",qty:1,unit:"flat",rate:40000},
    {dept:"Crew",description:"Animation director",qty:1,unit:"flat",rate:300000},
    {dept:"Crew",description:"Lead character animator",qty:1,unit:"flat",rate:200000},
    {dept:"Crew",description:"Background / environment artist",qty:2,unit:"person",rate:100000},
    {dept:"Crew",description:"Storyboard artist",qty:1,unit:"flat",rate:80000},
    {dept:"Crew",description:"Colourist / compositor",qty:1,unit:"flat",rate:120000},
    {dept:"Crew",description:"Rigger — character setup",qty:1,unit:"flat",rate:80000},
    {dept:"Crew",description:"Sound designer & music composer",qty:1,unit:"flat",rate:100000},
    {dept:"Crew",description:"Script / dialogue writer",qty:1,unit:"flat",rate:60000},
    {dept:"Equipment",description:"Animation workstation rentals",qty:2,unit:"item",rate:50000},
    {dept:"Equipment",description:"Software licenses — Adobe / Toon Boom / Blender",qty:1,unit:"flat",rate:80000},
    {dept:"Equipment",description:"Drawing tablets — Wacom",qty:2,unit:"item",rate:30000},
    {dept:"Equipment",description:"Recording studio — voice sessions",qty:1,unit:"day",rate:60000},
    {dept:"Post-Production",description:"Episode assembly & final render",qty:1,unit:"flat",rate:80000},
    {dept:"Post-Production",description:"Sound effects & audio mix",qty:1,unit:"flat",rate:40000},
    {dept:"Post-Production",description:"Subtitle / caption track",qty:1,unit:"flat",rate:15000},
    {dept:"Post-Production",description:"Quality review & revisions",qty:1,unit:"flat",rate:30000},
    {dept:"Marketing",description:"Character style sheets & promo art",qty:1,unit:"flat",rate:50000},
    {dept:"Marketing",description:"Trailer & teaser cut",qty:1,unit:"flat",rate:25000},
    {dept:"Marketing",description:"Social media stills & clips",qty:3,unit:"item",rate:8000},
    {dept:"Contingency",description:"Contingency reserve — 10%",qty:1,unit:"flat",rate:140000},
  ]},
];

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
const today  = () => new Date().toISOString().slice(0,10);
const fmt    = (n) => Number(n||0).toLocaleString("en",{maximumFractionDigits:0});
const sym    = (code) => (CURRENCIES.find(c=>c.code===code)||CURRENCIES[0]).symbol;
const lTot   = (i) => (Number(i.qty)||0)*(Number(i.rate)||0);

const readFileAsBase64 = (f) => new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});
const readFileAsText   = (f) => new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsText(f);});

/* read image file as base64 data URL for logo preview */
const readImageAsDataURL = (f) => new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f);});

/* generate and open a printable PDF budget — includes brand panel + recon section */
const downloadBudgetPDF = (project,items,advances=[],reconEntries=[],brand={}) => {
  const totals={};items.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
  const rows=DEPTS.map(dept=>{
    const di=items.filter(i=>i.dept===dept);if(!di.length)return'';
    const dTot=di.reduce((s,i)=>s+lTot(i),0);
    return`<tr style="background:#1A0835"><td colspan="4" style="padding:8px 14px;font-weight:700;color:#FEED61;font-size:13px">${dept}</td><td style="padding:8px 14px;text-align:right;font-family:monospace;color:#FEED61">${sym(di[0].currency)}${fmt(dTot)}</td></tr>${di.map(item=>`<tr style="border-bottom:1px solid #eee"><td style="padding:6px 14px 6px 28px;font-size:13px">${item.description||''}</td><td style="padding:6px 14px;text-align:center;font-size:13px">${item.qty}</td><td style="padding:6px 14px;text-align:center;font-size:13px">${item.unit}</td><td style="padding:6px 14px;text-align:right;font-family:monospace;font-size:13px">${sym(item.currency)}${fmt(item.rate)}</td><td style="padding:6px 14px;text-align:right;font-family:monospace;font-size:13px;font-weight:600">${sym(item.currency)}${fmt(lTot(item))}</td></tr>`).join('')}`;
  }).join('');
  const totalStr=Object.entries(totals).map(([c,a])=>`${sym(c)}${fmt(a)} ${c}`).join('&nbsp;&nbsp;|&nbsp;&nbsp;');
  const logoSrc=brand.logo||project.logo_url;
  const logoHtml=logoSrc?`<img src="${logoSrc}" style="height:52px;margin-bottom:12px;display:block;object-fit:contain"/>`:'';
  const companyName=brand.companyName||'';
  const prodTitle=brand.productionTitle||project.name;
  const reconRows=advances.map(adv=>{
    const es=reconEntries.filter(e=>e.advance_id===adv.id);
    const spent=es.reduce((s,e)=>s+e.amount,0);
    const bal=adv.amount-spent;
    const sc=adv.status==='reconciled'?'#52B07A':bal<0?'#E06B52':'#D0A830';
    const sl=adv.status==='reconciled'?'Reconciled':bal<0?'Overspent':bal===0?'Balanced':'Open';
    return`<tr style="border-bottom:1px solid #eee"><td style="padding:8px 14px;font-size:13px">${adv.recipient}</td><td style="padding:8px 14px;font-size:13px">${adv.dept||'—'}</td><td style="padding:8px 14px;font-family:monospace;font-size:13px;text-align:right">${sym(adv.currency)}${fmt(adv.amount)}</td><td style="padding:8px 14px;font-family:monospace;font-size:13px;text-align:right">${sym(adv.currency)}${fmt(spent)}</td><td style="padding:8px 14px;font-family:monospace;font-size:13px;text-align:right;color:${bal<0?'#E06B52':'inherit'}">${sym(adv.currency)}${fmt(bal)}</td><td style="padding:8px 14px;font-size:12px;font-weight:700;color:${sc}">${sl}</td></tr>`;
  }).join('');
  const reconSection=advances.length===0?'':`<div style="padding:0 40px 20px"><h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#555;margin:24px 0 10px;padding-bottom:6px;border-bottom:2px solid #FEED61">Cash Advance Reconciliation</h3><table><thead><tr><th>Recipient</th><th>Dept</th><th style="text-align:right">Issued</th><th style="text-align:right">Spent</th><th style="text-align:right">Balance</th><th>Status</th></tr></thead><tbody>${reconRows}</tbody></table></div>`;
  const html=`<!DOCTYPE html><html><head><title>NKO Budget — ${prodTitle}</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;padding:0;color:#222}.hdr{background:#0F0120;padding:30px 40px}.hdr h1{color:#FEED61;font-size:30px;margin:0;letter-spacing:0.06em}.hdr .co{color:#8C852E;font-size:13px;margin:4px 0 0;font-weight:700;text-transform:uppercase;letter-spacing:0.08em}.hdr p{color:#9A9080;margin:4px 0 0;font-size:14px}.meta{padding:14px 40px;background:#f5f5f5;border-bottom:2px solid #FEED61;font-size:13px;color:#555}table{width:100%;border-collapse:collapse}th{background:#0F0120;color:#FEED61;padding:10px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em}.tot{padding:20px 40px;background:#0F0120}.tot p{color:#8C852E;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px}.tot h2{color:#FEED61;font-size:26px;margin:0;font-family:monospace}.ftr{padding:14px 40px;font-size:11px;color:#999;text-align:center;border-top:1px solid #eee}@media print{.no-print{display:none}}</style></head><body><div class="hdr">${logoHtml}${companyName?`<div class="co">${companyName}</div>`:''}<h1>NKO</h1><p>Production Budget — ${prodTitle}</p></div><div class="meta"><strong>Production:</strong> ${prodTitle}&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Type:</strong> ${project.type}&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Currency:</strong> ${project.base_currency}&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Date:</strong> ${new Date().toLocaleDateString()}</div><div style="padding:0 40px"><table><thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th style="text-align:right">Rate</th><th style="text-align:right">Total</th></tr></thead><tbody>${rows}</tbody></table></div>${reconSection}<div class="tot"><p>Total Budget</p><h2>${totalStr}</h2></div><div class="ftr">Generated by NKO — Budgets tailored just for you | nko-nko.vercel.app</div><div class="no-print" style="text-align:center;padding:20px"><button onclick="window.print()" style="background:#FEED61;border:none;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;border-radius:6px">Print / Save as PDF</button></div></body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};


/* generate and open a printable PDF receipt in a new tab */
const downloadReceiptPDF = (payment,payee,project) => {
  const allPaid=(payee.payments||[]).reduce((s,p)=>s+p.amount,0);
  const bal=payee.agreed_fee-allPaid;
  const logoHtml=project.logo_url?`<img src="${project.logo_url}" style="height:48px;margin-bottom:12px;display:block;object-fit:contain"/>`:'' ;
  const html=`<!DOCTYPE html><html><head><title>NKO Receipt — ${payee.name}</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;padding:0;color:#222}.hdr{background:#0F0120;padding:30px 40px}.hdr h1{color:#FEED61;font-size:30px;margin:0;letter-spacing:0.06em}.hdr p{color:#9A9080;margin:6px 0 0;font-size:14px}.body{padding:30px 40px}.row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #eee;font-size:14px}.label{color:#666;font-weight:600}.value{font-family:monospace;font-weight:700}.total{background:#0F0120;padding:20px 40px;margin-top:20px}.total p{color:#8C852E;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px}.total h2{color:#FEED61;font-size:26px;margin:0;font-family:monospace}.ftr{padding:14px 40px;font-size:11px;color:#999;text-align:center;border-top:1px solid #eee}@media print{.no-print{display:none}}</style></head><body><div class="hdr">${logoHtml}<h1>NKO</h1><p>Payment Receipt — ${project.name}</p></div><div class="body"><div class="row"><span class="label">Production</span><span class="value">${project.name}</span></div><div class="row"><span class="label">Date</span><span class="value">${payment.date}</span></div><div class="row"><span class="label">Payee</span><span class="value">${payee.name}</span></div><div class="row"><span class="label">Role</span><span class="value">${payee.role}</span></div><div class="row"><span class="label">Agreed Fee</span><span class="value">${sym(payee.currency)}${fmt(payee.agreed_fee)}</span></div><div class="row"><span class="label">Amount Paid</span><span class="value">${sym(payee.currency)}${fmt(payment.amount)}</span></div><div class="row"><span class="label">Payment Method</span><span class="value">${payment.method}</span></div><div class="row"><span class="label">Balance Outstanding</span><span class="value" style="color:${bal>0?'#E06B52':'#52B07A'}">${sym(payee.currency)}${fmt(bal)}</span></div></div><div class="total"><p>Amount Paid This Transaction</p><h2>${sym(payee.currency)}${fmt(payment.amount)}</h2></div><div class="ftr">Issued via NKO — Budgets tailored just for you | nko-nko.vercel.app</div><div class="no-print" style="text-align:center;padding:20px"><button onclick="window.print()" style="background:#FEED61;border:none;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;border-radius:6px">Print / Save as PDF</button></div></body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};

const whatsappReceipt = (payment,payee,project) => [
  `*NKO PAYMENT RECEIPT*`,`━━━━━━━━━━━━━━━━━━━━`,
  `*Production:* ${project.name}`,`*Date:* ${payment.date}`,
  `━━━━━━━━━━━━━━━━━━━━`,
  `*Payee:* ${payee.name}`,`*Role:* ${payee.role}`,
  `*Agreed Fee:* ${sym(payee.currency)}${fmt(payee.agreed_fee)}`,
  `*Amount Paid:* ${sym(payee.currency)}${fmt(payment.amount)}`,
  `*Payment Method:* ${payment.method}`,
  `━━━━━━━━━━━━━━━━━━━━`,`_Issued via NKO — nko.film_`,
].join("\n");

/* ═══════════════════════════════════════════════════════
   CLAUDE API
═══════════════════════════════════════════════════════ */
async function callClaude(messages, system) {
  const res = await fetch("/api/claude",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:8000,system,messages}),
  });
  const data = await res.json();
  return data.content?.find(b=>b.type==="text")?.text||"";
}
const CHAT_SYS = `You are a production finance co-pilot for African film and TV — Nollywood, Ghallywood, Kenyan, South African and pan-African productions.

RATE BENCHMARKS (Nigerian Naira — current market 2025/2026):

CREW DAY RATES (Lagos market):
- Director (short/vertical): ₦80k–₦200k flat
- Director (feature): ₦300k–₦600k flat
- DOP/Cinematographer: ₦50k–₦150k flat or ₦15k–₦40k/day
- Camera operator: ₦10k–₦25k/day
- Sound recordist: ₦10k–₦20k/day
- Boom operator: ₦8k–₦15k/day
- Gaffer/lighting: ₦8k–₦18k/day
- Hair & make-up: ₦8k–₦15k/day
- Wardrobe/stylist: ₦8k–₦15k/day
- Art director: ₦40k–₦100k flat
- Production assistant: ₦20k–₦50k flat per project
- Unit manager: ₦40k–₦80k flat
- Script supervisor: ₦8k–₦12k/day

CAST RATES:
- A-list Nollywood actor: ₦500k–₦2M+ flat
- Mid-tier actor: ₦100k–₦400k flat
- Supporting cast: ₦30k–₦80k flat
- Day players: ₦10k–₦25k/day
- Extras: ₦5k–₦10k/day

EQUIPMENT RENTALS (Lagos, per day):
- Camera package (mirrorless/cinema): ₦20k–₦60k/day
- Lighting package: ₦15k–₦35k/day
- Sound kit: ₦8k–₦15k/day
- Generator hire: ₦8k–₦20k/day
- Gimbal/stabiliser: ₦10k–₦20k/day
- Drone with pilot: ₦50k–₦100k/day

LOCATIONS & LOGISTICS:
- Location fee (residential): ₦15k–₦40k/day
- Location fee (commercial/studio): ₦30k–₦100k/day
- Set feeding (per person per day): ₦3k–₦8k
- Transport (minibus hire): ₦20k–₦40k/day
- Generator fuel: ₦5k–₦15k/day

POST-PRODUCTION:
- Edit (short/vertical ep): ₦15k–₦30k per episode
- Edit (feature): ₦150k–₦300k flat
- Colour grade: ₦30k–₦100k depending on length
- Sound mix: ₦20k–₦80k
- VFX/motion graphics: ₦30k–₦200k

PRODUCTION SCALE TIERS:
- Micro (vertical/social): ₦500k–₦2M total
- Low (short film/branded): ₦2M–₦8M total
- Mid (indie feature/docu-series): ₦8M–₦30M total
- High (mainstream Nollywood feature): ₦30M+ total

OTHER AFRICAN MARKETS:
- Ghana: multiply NGN rates by ~0.3 for GHS equivalents
- Kenya: KSh rates roughly 2–3x the NGN figure
- South Africa: ZAR rates are significantly higher due to formal labour agreements

CONTINGENCY: 10% is standard for experienced producers; 15–20% for first-time producers or complex shoots.

IMPORTANT CONTEXT:
- No union fringe rates apply — all fees are negotiated directly
- Cash advances (imprest) are the standard payment method for crew departments
- Mobile money (OPay, PalmPay, MTN MoMo) is widely used for crew payments
- Receipts should always be issued for payments above ₦10,000

Give practical, grounded advice. When asked for rate estimates always give a range and specify the tier it applies to.`;

const SCRIPT_SYS = `You are a script breakdown and budget AI for African film productions. You MUST return ONLY a valid JSON object. No markdown. No code fences. No explanation. No quotes inside string values — replace any apostrophes or quotes in text with spaces. Use only these departments: "Cast & Talent","Crew","Locations & Transport","Equipment","Post-Production","Marketing","Contingency". Units must be one of: "day","week","flat","person","item". Every string value must be simple with no special characters.`;
const SCRIPT_PROMPT = (cur) => `Read this script carefully. Count the scenes, locations, and characters. Then return ONLY this JSON structure with no other text, no markdown, no code fences:
{"analysis":{"title":"Script Title","genre":"Genre","totalScenes":0,"estimatedShootDays":0,"uniqueLocations":0,"locationList":["Location 1","Location 2"],"totalSpeakingRoles":0,"extras":0,"hasNightShoots":false,"hasActionSequences":false,"hasVFX":false,"productionScale":"low","notes":"Key notes here"},"budget":[{"dept":"Cast and Talent","description":"Lead actor","qty":1,"unit":"flat","rate":0},{"dept":"Crew","description":"Director","qty":1,"unit":"flat","rate":0}]}
Rules: All rates in ${cur}. Use realistic Nigerian Naira rates. Keep all string values short and simple. No apostrophes or special characters in any string. Return ONLY the JSON nothing else.`;

/* ═══════════════════════════════════════════════════════
   AUTH CONTEXT
═══════════════════════════════════════════════════════ */
const AuthCtx = createContext(null);
function AuthProvider({children}){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user||null);setLoading(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>setUser(session?.user||null));
    return ()=>subscription.unsubscribe();
  },[]);
  const signUp = async(email,password)=>{const {error}=await supabase.auth.signUp({email,password});return error;};
  const signIn = async(email,password)=>{const {error}=await supabase.auth.signInWithPassword({email,password});return error;};
  const signOut= async()=>supabase.auth.signOut();
  return <AuthCtx.Provider value={{user,loading,signUp,signIn,signOut}}>{children}</AuthCtx.Provider>;
}
const useAuth = ()=>useContext(AuthCtx);

/* ═══════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════ */
const GCS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0F0120;font-family:Manrope,sans-serif;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-thumb{background:#8C852E;border-radius:3px;}
`;

/* ═══════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════ */

export { CURRENCIES,DEPTS,UNITS,PROJ_TYPES,PAY_METHODS,TEMPLATES,T,
  CHAT_SYS,SCRIPT_SYS,SCRIPT_PROMPT,BREAKDOWN_SYS,BREAKDOWN_PROMPT,
  CREATORS,TEMPLATE_SCENES,COMMUNITY_TEMPLATES,MKTCAT,QUICK,
  today,fmt,sym,lTot,readFileAsBase64,readFileAsText,readImageAsDataURL,callClaude,
  supabase };
