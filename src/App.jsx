
/*
 ═══════════════════════════════════════════════════════════════
   NKO — The African Production Ledger  |  Supabase Edition
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

const SUPABASE_URL      = 'https://pvyrfjgrfmuvivdflcgg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KoI_EHwLNl8IlbB60Zgmng_TsuvaZUv';

─────────────────────────────────────────────────────────── */

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
const PROJ_TYPES = ["Feature Film","Vertical Series / Microdrama","Short Film","Music Video","Documentary","Branded Content","Other"];
const PAY_METHODS = ["Cash","Bank Transfer","OPay / PalmPay","M-Pesa","MTN Mobile Money","Airtel Money","Cheque","Other"];

const TEMPLATES = [
  {id:"feature",label:"Feature Film",type:"Feature Film",sub:"12-day indie shoot · negotiated rates",items:[
    {dept:"Cast & Talent",description:"Lead actor",qty:1,unit:"flat",rate:800000},
    {dept:"Cast & Talent",description:"Supporting cast",qty:4,unit:"person",rate:150000},
    {dept:"Cast & Talent",description:"Extras pool",qty:1,unit:"flat",rate:100000},
    {dept:"Crew",description:"Director",qty:1,unit:"flat",rate:400000},
    {dept:"Crew",description:"Director of Photography",qty:1,unit:"flat",rate:300000},
    {dept:"Crew",description:"Sound recordist",qty:12,unit:"day",rate:15000},
    {dept:"Crew",description:"Production assistants",qty:3,unit:"person",rate:50000},
    {dept:"Locations & Transport",description:"Location fees",qty:12,unit:"day",rate:20000},
    {dept:"Locations & Transport",description:"Transport & logistics",qty:1,unit:"flat",rate:150000},
    {dept:"Locations & Transport",description:"Feeding on set",qty:12,unit:"day",rate:25000},
    {dept:"Equipment",description:"Camera & lighting package",qty:12,unit:"day",rate:40000},
    {dept:"Equipment",description:"Props, wardrobe & art dept",qty:1,unit:"flat",rate:100000},
    {dept:"Post-Production",description:"Editing",qty:1,unit:"flat",rate:250000},
    {dept:"Post-Production",description:"Colour grade & sound mix",qty:1,unit:"flat",rate:150000},
    {dept:"Post-Production",description:"Music / score",qty:1,unit:"flat",rate:80000},
    {dept:"Marketing",description:"Poster & trailer cut",qty:1,unit:"flat",rate:100000},
    {dept:"Contingency",description:"Contingency reserve",qty:1,unit:"flat",rate:200000},
  ]},
  {id:"vertical",label:"Vertical Series",type:"Vertical Series / Microdrama",sub:"7-day microdrama block · episodic post",items:[
    {dept:"Cast & Talent",description:"Lead actors",qty:3,unit:"person",rate:100000},
    {dept:"Cast & Talent",description:"Supporting cast",qty:5,unit:"person",rate:40000},
    {dept:"Crew",description:"Director",qty:1,unit:"flat",rate:150000},
    {dept:"Crew",description:"Camera operator",qty:1,unit:"flat",rate:120000},
    {dept:"Crew",description:"Sound & lighting assist",qty:7,unit:"day",rate:20000},
    {dept:"Crew",description:"Production assistants",qty:2,unit:"person",rate:30000},
    {dept:"Locations & Transport",description:"Location fees",qty:7,unit:"day",rate:15000},
    {dept:"Locations & Transport",description:"Transport",qty:1,unit:"flat",rate:60000},
    {dept:"Locations & Transport",description:"Set feeding",qty:7,unit:"day",rate:15000},
    {dept:"Equipment",description:"Camera, gimbal & lighting kit",qty:7,unit:"day",rate:25000},
    {dept:"Equipment",description:"Wardrobe & props",qty:1,unit:"flat",rate:40000},
    {dept:"Post-Production",description:"Episode edits",qty:5,unit:"item",rate:15000},
    {dept:"Post-Production",description:"Sound design pass",qty:1,unit:"flat",rate:30000},
    {dept:"Marketing",description:"Thumbnail & teaser assets",qty:1,unit:"flat",rate:25000},
    {dept:"Contingency",description:"Contingency reserve",qty:1,unit:"flat",rate:50000},
  ]},
  {id:"shortfilm",label:"Short Film",type:"Short Film",sub:"2-day shoot · lean indie",items:[
    {dept:"Cast & Talent",description:"Lead actor",qty:1,unit:"flat",rate:80000},
    {dept:"Cast & Talent",description:"Supporting cast",qty:2,unit:"person",rate:30000},
    {dept:"Crew",description:"Director",qty:1,unit:"flat",rate:80000},
    {dept:"Crew",description:"Camera / DOP",qty:1,unit:"flat",rate:60000},
    {dept:"Crew",description:"Sound recordist",qty:2,unit:"day",rate:12000},
    {dept:"Locations & Transport",description:"Location fees",qty:2,unit:"day",rate:10000},
    {dept:"Locations & Transport",description:"Transport",qty:1,unit:"flat",rate:25000},
    {dept:"Equipment",description:"Camera & lighting kit",qty:2,unit:"day",rate:20000},
    {dept:"Post-Production",description:"Edit & grade",qty:1,unit:"flat",rate:60000},
    {dept:"Contingency",description:"Contingency reserve",qty:1,unit:"flat",rate:20000},
  ]},
  {id:"musicvideo",label:"Music Video",type:"Music Video",sub:"1-day shoot · artist & small crew",items:[
    {dept:"Cast & Talent",description:"Artist / main performer",qty:1,unit:"flat",rate:200000},
    {dept:"Cast & Talent",description:"Background talent / dancers",qty:6,unit:"person",rate:15000},
    {dept:"Crew",description:"Director",qty:1,unit:"flat",rate:150000},
    {dept:"Crew",description:"Director of Photography",qty:1,unit:"flat",rate:100000},
    {dept:"Crew",description:"Stylist / wardrobe",qty:1,unit:"day",rate:35000},
    {dept:"Crew",description:"Make-up artist",qty:1,unit:"day",rate:25000},
    {dept:"Locations & Transport",description:"Location / studio hire",qty:1,unit:"flat",rate:80000},
    {dept:"Equipment",description:"Camera package (incl. gimbal)",qty:1,unit:"day",rate:60000},
    {dept:"Equipment",description:"Lighting & grip package",qty:1,unit:"day",rate:40000},
    {dept:"Post-Production",description:"Edit & colour grade",qty:1,unit:"flat",rate:120000},
    {dept:"Marketing",description:"BTS content cut",qty:1,unit:"flat",rate:20000},
    {dept:"Contingency",description:"Contingency reserve",qty:1,unit:"flat",rate:60000},
  ]},
  {id:"documentary",label:"Documentary",type:"Documentary",sub:"5-day field shoot",items:[
    {dept:"Crew",description:"Director / producer",qty:1,unit:"flat",rate:200000},
    {dept:"Crew",description:"Camera operator",qty:1,unit:"flat",rate:120000},
    {dept:"Crew",description:"Sound recordist",qty:5,unit:"day",rate:15000},
    {dept:"Crew",description:"Fixer / researcher",qty:5,unit:"day",rate:15000},
    {dept:"Locations & Transport",description:"Travel & accommodation",qty:1,unit:"flat",rate:200000},
    {dept:"Equipment",description:"Camera & audio kit",qty:5,unit:"day",rate:30000},
    {dept:"Equipment",description:"Drone hire (with pilot)",qty:2,unit:"day",rate:50000},
    {dept:"Post-Production",description:"Full edit & grade",qty:1,unit:"flat",rate:300000},
    {dept:"Contingency",description:"Contingency reserve",qty:1,unit:"flat",rate:100000},
  ]},
  {id:"branded",label:"Branded / Podcast",type:"Branded Content",sub:"Sponsored episode or podcast shoot",items:[
    {dept:"Cast & Talent",description:"Host / presenter",qty:1,unit:"flat",rate:100000},
    {dept:"Cast & Talent",description:"Guest honorarium",qty:1,unit:"flat",rate:30000},
    {dept:"Crew",description:"Director / producer",qty:1,unit:"flat",rate:100000},
    {dept:"Crew",description:"Camera operators",qty:2,unit:"day",rate:40000},
    {dept:"Equipment",description:"Camera & audio kit",qty:2,unit:"day",rate:30000},
    {dept:"Post-Production",description:"Edit & colour",qty:1,unit:"flat",rate:80000},
    {dept:"Marketing",description:"Social cutdowns",qty:3,unit:"item",rate:10000},
    {dept:"Contingency",description:"Contingency reserve",qty:1,unit:"flat",rate:30000},
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
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,system,messages}),
  });
  const data = await res.json();
  return data.content?.find(b=>b.type==="text")?.text||"";
}
const CHAT_SYS = `You are a production finance co-pilot for African film and TV — Nollywood, Ghallywood, Kenyan, South African productions. You understand cash-based crew payments, imprest/advance reconciliation, negotiated day rates (no union scale), all major African currencies. Give practical advice grounded in African production realities.`;
const SCRIPT_SYS = `You are a script breakdown and budget AI for African film productions. Return ONLY valid JSON — no markdown, no explanation. Use departments: "Cast & Talent","Crew","Locations & Transport","Equipment","Post-Production","Marketing","Contingency". Units: "day","week","flat","person","item".`;
const SCRIPT_PROMPT = (cur) => `Analyze this script and return ONLY this JSON:
{"analysis":{"title":"","genre":"","totalScenes":0,"estimatedShootDays":0,"uniqueLocations":0,"locationList":[],"totalSpeakingRoles":0,"extras":0,"hasNightShoots":false,"hasActionSequences":false,"hasVFX":false,"productionScale":"micro|low|mid|high","notes":""},"budget":[{"dept":"","description":"","qty":1,"unit":"flat","rate":0}]}
Base currency: ${cur}. Scale rates to match the production complexity inferred from the script. Be thorough.`;

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
function FS(){return <div style={{height:8,background:`repeating-linear-gradient(90deg,${T.gold} 0 12px,transparent 12px 20px)`,opacity:.5,borderRadius:1}}/>;}
function Pill({children,color=T.gold}){return <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",padding:"2px 8px",borderRadius:20,border:`1px solid ${color}`,color,fontFamily:"Manrope,sans-serif"}}>{children}</span>;}
function StatCard({label,value,sub,accent}){
  return <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:16}}>
    <div style={{fontSize:10,color:T.dim,letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:700,marginBottom:8,fontFamily:"Manrope,sans-serif"}}>{label}</div>
    <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:22,color:accent||T.gold,fontWeight:500}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:T.dim,marginTop:4,fontFamily:"Manrope,sans-serif"}}>{sub}</div>}
  </div>;
}
function Inp({style,onFocus,onBlur,...rest}){
  const [f,setF]=useState(false);
  return <input {...rest} style={{width:"100%",background:T.ink,border:`1px solid ${f?T.gold:T.line}`,color:T.cream,borderRadius:6,padding:"8px 10px",fontSize:13,fontFamily:"Manrope,sans-serif",...style}}
    onFocus={e=>{setF(true);onFocus&&onFocus(e);}} onBlur={e=>{setF(false);onBlur&&onBlur(e);}}/>;
}
function Sel({children,style,...rest}){return <select {...rest} style={{background:T.ink,border:`1px solid ${T.line}`,color:T.cream,borderRadius:6,padding:"8px 10px",fontSize:13,fontFamily:"Manrope,sans-serif",cursor:"pointer",...style}}>{children}</select>;}
function Btn({children,variant="primary",size="md",style,...rest}){
  const sz={sm:{padding:"5px 12px",fontSize:12},md:{padding:"8px 16px",fontSize:13}};
  const va={primary:{background:T.gold,color:T.ink,border:"none"},ghost:{background:"transparent",color:T.dim,border:`1px solid ${T.faint}`},outline:{background:"transparent",color:T.gold,border:`1px solid ${T.goldDim}`},sage:{background:T.sage,color:T.ink,border:"none"},wa:{background:"#25D366",color:"#fff",border:"none"},script:{background:T.sapphire,color:"#fff",border:"none"},danger:{background:"transparent",color:T.coral,border:`1px solid ${T.coral}`}};
  return <button {...rest} style={{borderRadius:6,fontWeight:700,fontFamily:"Manrope,sans-serif",cursor:"pointer",...sz[size],...va[variant],...style}}>{children}</button>;
}
function Spinner(){return <div style={{display:"flex",justifyContent:"center",padding:40}}><div style={{width:28,height:28,border:`3px solid ${T.line}`,borderTopColor:T.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
</div>;}

/* ═══════════════════════════════════════════════════════
   AUTH SCREENS
═══════════════════════════════════════════════════════ */
function AuthScreen(){
  const {signIn,signUp}=useAuth();
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState(""); const [pw,setPw]=useState(""); const [pw2,setPw2]=useState("");
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false); const [done,setDone]=useState(false);
  const submit=async()=>{
    setErr("");if(!email||!pw){setErr("Email and password required.");return;}
    if(mode==="signup"&&pw!==pw2){setErr("Passwords don't match.");return;}
    setLoading(true);
    const error=mode==="login"?await signIn(email,pw):await signUp(email,pw);
    setLoading(false);
    if(error){setErr(error.message);}
    else if(mode==="signup"){setDone(true);}
  };
  return(
    <div style={{minHeight:"100vh",background:T.ink,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{GCS}</style>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"Fraunces,serif",fontSize:36,color:T.gold,letterSpacing:"0.04em",marginBottom:4}}>NKO</div>
          <div style={{fontSize:12,color:T.dim,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"Manrope,sans-serif"}}>The African Production Ledger</div>
        </div>
        <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:12,padding:28}}>
          {done?(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12}}>📬</div>
              <div style={{fontFamily:"Fraunces,serif",fontSize:18,color:T.cream,marginBottom:8}}>Check your email</div>
              <div style={{fontSize:13,color:T.dim,fontFamily:"Manrope,sans-serif",lineHeight:1.6}}>We sent a confirmation link to <strong style={{color:T.cream}}>{email}</strong>. Click it to activate your account.</div>
              <button onClick={()=>{setMode("login");setDone(false);}} style={{marginTop:16,color:T.gold,fontSize:13,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif",fontWeight:700}}>Back to login</button>
            </div>
          ):(
            <>
              <div style={{fontFamily:"Fraunces,serif",fontSize:20,color:T.cream,marginBottom:20}}>{mode==="login"?"Sign in":"Create account"}</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Inp type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)}/>
                <Inp type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
                {mode==="signup"&&<Inp type="password" placeholder="Confirm password" value={pw2} onChange={e=>setPw2(e.target.value)}/>}
                {err&&<div style={{fontSize:12,color:T.coral,fontFamily:"Manrope,sans-serif",padding:"6px 10px",background:"rgba(224,107,82,0.1)",borderRadius:6,border:`1px solid ${T.coral}`}}>{err}</div>}
                <Btn onClick={submit} style={{marginTop:4,opacity:loading?.6:1}}>{loading?"...":(mode==="login"?"Sign in":"Create account")}</Btn>
              </div>
              <div style={{marginTop:16,textAlign:"center",fontSize:12,color:T.dim,fontFamily:"Manrope,sans-serif"}}>
                {mode==="login"?"Don't have an account? ":"Already have an account? "}
                <button onClick={()=>{setMode(mode==="login"?"signup":"login");setErr("");}} style={{color:T.gold,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif",fontWeight:700,fontSize:12}}>
                  {mode==="login"?"Sign up":"Sign in"}
                </button>
              </div>
            </>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:T.faint,fontFamily:"Manrope,sans-serif"}}>
          Your data is private and encrypted. Each producer only sees their own productions.
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════ */
const NAV=[{id:"dashboard",e:"🎬",l:"Dashboard"},{id:"budgets",e:"📊",l:"Budgets"},{id:"recon",e:"🧾",l:"Recon"},{id:"payments",e:"💳",l:"Payments"},{id:"market",e:"🏪",l:"Marketplace"},{id:"ai",e:"✦",l:"AI Builder"}];
function Sidebar({view,setView,onSignOut,userEmail}){
  return(
    <div style={{width:210,minHeight:"100vh",background:T.panel,flexShrink:0,borderRight:`1px solid ${T.line}`,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"22px 18px 14px"}}>
        <div style={{fontFamily:"Fraunces,serif",fontSize:26,fontWeight:700,color:T.gold,letterSpacing:"0.04em"}}>NKO</div>
        <div style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:T.goldDim,fontFamily:"Manrope,sans-serif",fontWeight:700,marginTop:2}}>The African production ledger</div>
      </div>
      <FS/>
      <nav style={{flex:1,padding:"14px 10px"}}>
        {NAV.map(n=>{const on=view===n.id;return <button key={n.id} onClick={()=>setView(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",background:on?T.goldGlow:"transparent",color:on?T.gold:T.dim,fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:600,textAlign:"left",marginBottom:2,borderLeft:`2px solid ${on?T.gold:"transparent"}`}}><span style={{fontSize:15}}>{n.e}</span>{n.l}</button>;})}
      </nav>
      <div style={{padding:"12px 16px",borderTop:`1px solid ${T.line}`}}>
        <div style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif",marginBottom:8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userEmail}</div>
        <Btn variant="ghost" size="sm" onClick={onSignOut} style={{width:"100%"}}>Sign out</Btn>
      </div>
    </div>
  );
}
function TopBar({projects,currentId,onSelect,onNew,onSignOut}){
  return(
    <div style={{background:T.panel,borderBottom:`1px solid ${T.line}`,padding:"10px 20px",display:"flex",alignItems:"center",gap:10}}>
      <Sel value={currentId||""} onChange={e=>onSelect(e.target.value||null)} style={{flex:1,maxWidth:280}}>
        <option value="">Select a production…</option>
        {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </Sel>
      <Btn onClick={onNew}>+ New</Btn>
      <Btn variant="ghost" size="sm" onClick={onSignOut}>Out</Btn>
    </div>
  );
}
function MobileNav({view,setView}){
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,background:T.panel,borderTop:`1px solid ${T.line}`,display:"flex",overflowX:"auto"}}>
      {NAV.map(n=>{const on=view===n.id;return <button key={n.id} onClick={()=>setView(n.id)} style={{flex:"0 0 auto",padding:"8px 12px 6px",border:"none",background:"transparent",color:on?T.gold:T.dim,display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontSize:9,fontFamily:"Manrope,sans-serif",fontWeight:700,textTransform:"uppercase",cursor:"pointer"}}><span style={{fontSize:18}}>{n.e}</span>{n.l.split(" ")[0]}</button>;})}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════ */
function NewProjectModal({onClose,onCreate}){
  const [name,setName]=useState(""); const [type,setType]=useState(PROJ_TYPES[0]); const [cur,setCur]=useState("NGN"); const [loading,setLoading]=useState(false);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,1,32,.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:100}}>
      <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:12,padding:26,width:"100%",maxWidth:400}}>
        <div style={{fontFamily:"Fraunces,serif",fontSize:20,color:T.cream,marginBottom:18}}>New production</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Inp placeholder="Production name" value={name} onChange={e=>setName(e.target.value)}/>
          <Sel value={type} onChange={e=>setType(e.target.value)} style={{width:"100%"}}>{PROJ_TYPES.map(t=><option key={t}>{t}</option>)}</Sel>
          <Sel value={cur} onChange={e=>setCur(e.target.value)} style={{width:"100%"}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}</Sel>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <Btn onClick={async()=>{if(!name.trim())return;setLoading(true);await onCreate({name:name.trim(),type,base_currency:cur});setLoading(false);}} style={{opacity:loading?.6:1}}>{loading?"Creating…":"Create"}</Btn>
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
function DashboardView({projects,budgetItems,advances,payees,currentId,onSelect,onCreate}){
  const [modal,setModal]=useState(false);
  const openAdv=advances.filter(a=>a.status!=="reconciled").length;
  const unpaid=payees.filter(p=>{const paid=(p.payments||[]).reduce((s,x)=>s+x.amount,0);return paid<p.agreed_fee;}).length;
  return(
    <div>
      <div style={{marginBottom:22}}>
        <div style={{fontFamily:"Fraunces,serif",fontSize:32,color:T.gold,letterSpacing:"0.04em"}}>NKO</div>
        <div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:"Manrope,sans-serif"}}>Budget, recon, payments & AI script breakdown — for every African currency.</div>
        <div style={{marginTop:16}}><FS/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:28}}>
        <StatCard label="Productions" value={projects.length} sub="active"/>
        <StatCard label="Budget lines" value={budgetItems.length} sub="all projects"/>
        <StatCard label="Open advances" value={openAdv} sub="pending" accent={openAdv>0?T.coral:T.sage}/>
        <StatCard label="Unpaid" value={unpaid} sub="cast & crew" accent={unpaid>0?T.coral:T.sage}/>
      </div>
      {projects.length===0?(
        <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:12,padding:44,textAlign:"center"}}>
          <div style={{fontSize:42,marginBottom:12}}>🎬</div>
          <div style={{fontFamily:"Fraunces,serif",fontSize:22,color:T.cream,marginBottom:8}}>No productions yet</div>
          <div style={{color:T.dim,fontSize:14,marginBottom:22,maxWidth:360,margin:"0 auto 22px",fontFamily:"Manrope,sans-serif",lineHeight:1.6}}>Create a production, upload your script, and let NKO auto-generate your budget.</div>
          <Btn onClick={()=>setModal(true)}>Create your first production</Btn>
        </div>
      ):(
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"Fraunces,serif",fontSize:19,color:T.cream}}>Productions</div>
            <Btn onClick={()=>setModal(true)}>+ New</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
            {projects.map(p=>{
              const pi=budgetItems.filter(i=>i.project_id===p.id);
              const totals={};pi.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
              const open=advances.filter(a=>a.project_id===p.id&&a.status!=="reconciled").length;
              const active=p.id===currentId;
              return <button key={p.id} onClick={()=>onSelect(p.id)} style={{background:active?T.hi:T.panel,border:`1px solid ${active?T.gold:T.line}`,borderRadius:10,padding:18,textAlign:"left",cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div><div style={{fontFamily:"Fraunces,serif",fontSize:15,color:T.cream}}>{p.name}</div><div style={{fontSize:10,color:T.goldDim,fontFamily:"Manrope,sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:2}}>{p.type}</div></div>
                  <Pill>{p.base_currency}</Pill>
                </div>
                <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:13,color:T.cream,marginBottom:8}}>{Object.entries(totals).length===0?<span style={{color:T.faint}}>No budget yet</span>:Object.entries(totals).map(([c,a])=><div key={c}>{sym(c)}{fmt(a)}</div>)}</div>
                <div style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif"}}>{pi.length} lines · {open} open advances</div>
              </button>;
            })}
          </div>
        </>
      )}
      {modal&&<NewProjectModal onClose={()=>setModal(false)} onCreate={async(d)=>{await onCreate(d);setModal(false);}}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCRIPT ANALYSIS
═══════════════════════════════════════════════════════ */
function ScriptResultModal({result,currency,onApply,onClose}){
  const {analysis,budget}=result;
  const total=budget.reduce((s,i)=>s+lTot(i),0);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,1,32,.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:200,overflowY:"auto"}}>
      <div style={{background:T.panel,border:`1px solid ${T.sapphire}`,borderRadius:12,padding:24,width:"100%",maxWidth:600,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div><div style={{fontFamily:"Fraunces,serif",fontSize:20,color:T.cream}}>{analysis.title||"Script Analysis"}</div><div style={{fontSize:12,color:T.dim,fontFamily:"Manrope,sans-serif",marginTop:2}}>{analysis.genre}</div></div>
          <Pill color={T.sapphire}>AI Breakdown</Pill>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8,marginBottom:14}}>
          {[{l:"Scenes",v:analysis.totalScenes},{l:"Shoot Days",v:analysis.estimatedShootDays},{l:"Locations",v:analysis.uniqueLocations},{l:"Roles",v:analysis.totalSpeakingRoles},{l:"Extras",v:analysis.extras},{l:"Scale",v:analysis.productionScale}].map(s=>(
            <div key={s.l} style={{background:T.hi,borderRadius:8,padding:"10px 12px",border:`1px solid ${T.line}`}}>
              <div style={{fontSize:10,color:T.dim,fontFamily:"Manrope,sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{s.l}</div>
              <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:16,color:T.gold}}>{s.v||"—"}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {analysis.hasNightShoots&&<Pill color={T.coral}>Night Shoots</Pill>}
          {analysis.hasActionSequences&&<Pill color={T.coral}>Action Sequences</Pill>}
          {analysis.hasVFX&&<Pill color={T.coral}>VFX Required</Pill>}
        </div>
        {analysis.notes&&<div style={{background:T.hi,border:`1px solid ${T.line}`,borderRadius:8,padding:12,marginBottom:14,fontSize:12,color:T.dim,fontFamily:"Manrope,sans-serif",lineHeight:1.6}}><span style={{color:T.gold,fontWeight:700}}>Notes: </span>{analysis.notes}</div>}
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:10,color:T.dim,fontFamily:"Manrope,sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Generated — {budget.length} line items</div>
            <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:15,color:T.gold}}>{sym(currency)}{fmt(total)}</div>
          </div>
          <div style={{background:T.ink,borderRadius:8,border:`1px solid ${T.line}`,overflow:"hidden",maxHeight:200,overflowY:"auto"}}>
            {DEPTS.map(dept=>{
              const items=budget.filter(i=>i.dept===dept);if(!items.length)return null;
              const dTotal=items.reduce((s,i)=>s+lTot(i),0);
              return <div key={dept} style={{borderBottom:`1px solid ${T.line}`}}>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:T.hi}}><span style={{fontSize:11,fontFamily:"Manrope,sans-serif",color:T.cream,fontWeight:600}}>{dept}</span><span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:11,color:T.gold}}>{sym(currency)}{fmt(dTotal)}</span></div>
                {items.map((item,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 12px 4px 20px",borderTop:`1px solid ${T.line}`}}><span style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif"}}>{item.description} · {item.qty} {item.unit}</span><span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:11,color:T.cream}}>{sym(currency)}{fmt(lTot(item))}</span></div>)}
              </div>;
            })}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}><Btn variant="script" onClick={onApply}>Apply to budget</Btn><Btn variant="ghost" onClick={onClose}>Discard</Btn></div>
      </div>
    </div>
  );
}
function ScriptUploader({project,onApplyBudget}){
  const [state,setState]=useState("idle"); const [err,setErr]=useState(""); const [result,setResult]=useState(null); const [dragOver,setDragOver]=useState(false);
  const fileRef=useRef();
  const processFile=async(file)=>{
    const isPDF=file.type==="application/pdf";
    const isTxt=file.type==="text/plain"||file.name.endsWith(".txt")||file.name.endsWith(".fdx");
    if(!isPDF&&!isTxt){setErr("Upload a PDF, TXT or FDX script file.");setState("error");return;}
    setState("reading");setErr("");
    try{
      let userContent;
      if(isPDF){const b64=await readFileAsBase64(file);userContent=[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:SCRIPT_PROMPT(project.base_currency)}];}
      else{const txt=await readFileAsText(file);userContent=[{type:"text",text:`Script:\n\n${txt}\n\n${SCRIPT_PROMPT(project.base_currency)}`}];}
      setState("analyzing");
      const raw=await callClaude([{role:"user",content:userContent}],SCRIPT_SYS);
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setResult(parsed);setState("done");
    }catch(e){setErr(`Analysis failed: ${e.message}`);setState("error");}
  };
  const onDrop=useCallback(e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)processFile(f);},[project]);
  const onPick=e=>{const f=e.target.files[0];if(f)processFile(f);};
  return(
    <>
      <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={onDrop} onClick={()=>(state==="idle"||state==="error")&&fileRef.current.click()} style={{border:`2px dashed ${dragOver?T.sapphire:state==="analyzing"?T.goldMid:T.line}`,borderRadius:10,padding:"24px 20px",textAlign:"center",background:dragOver?`rgba(74,144,217,0.06)`:T.hi,cursor:(state==="idle"||state==="error")?"pointer":"default",marginBottom:18}}>
        <input ref={fileRef} type="file" accept=".pdf,.txt,.fdx" style={{display:"none"}} onChange={onPick}/>
        {state==="idle"&&<><div style={{fontSize:28,marginBottom:8}}>📄</div><div style={{fontFamily:"Fraunces,serif",fontSize:16,color:T.cream,marginBottom:4}}>Upload your script</div><div style={{fontSize:12,color:T.dim,fontFamily:"Manrope,sans-serif",marginBottom:12}}>Drop a PDF, TXT or FDX — NKO reads it and auto-builds your budget</div><Btn variant="script" size="sm">Choose script file</Btn></>}
        {state==="reading"&&<><div style={{fontSize:28,marginBottom:8}}>📖</div><div style={{fontFamily:"Manrope,sans-serif",fontSize:14,color:T.cream}}>Reading script…</div></>}
        {state==="analyzing"&&<><div style={{fontSize:28,marginBottom:8}}>🤖</div><div style={{fontFamily:"Fraunces,serif",fontSize:16,color:T.cream,marginBottom:4}}>Analyzing…</div><div style={{fontSize:12,color:T.dim,fontFamily:"Manrope,sans-serif"}}>Breaking down scenes, cast, locations and generating budget lines</div></>}
        {state==="done"&&<><div style={{fontSize:28,marginBottom:8}}>✅</div><div style={{fontFamily:"Fraunces,serif",fontSize:16,color:T.sage,marginBottom:4}}>Script analyzed</div><button onClick={e=>{e.stopPropagation();setState("idle");setResult(null);}} style={{color:T.gold,fontSize:12,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif",fontWeight:700}}>Analyze another →</button></>}
        {state==="error"&&<><div style={{fontSize:28,marginBottom:8}}>⚠️</div><div style={{fontSize:13,color:T.coral,fontFamily:"Manrope,sans-serif",marginBottom:10}}>{err}</div><Btn variant="ghost" size="sm" onClick={e=>{e.stopPropagation();setState("idle");setErr("");}}>Try again</Btn></>}
      </div>
      {result&&state==="done"&&<ScriptResultModal result={result} currency={project.base_currency} onApply={()=>{onApplyBudget(result.budget);setResult(null);setState("idle");}} onClose={()=>{setResult(null);setState("idle");}}/>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   BUDGETS
═══════════════════════════════════════════════════════ */
function DeptSection({dept,items,baseCurrency,onAdd,onUpdate,onRemove}){
  const [open,setOpen]=useState(items.length>0||dept===DEPTS[0]);
  const totals={};items.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
  const ts=Object.entries(totals).map(([c,a])=>`${sym(c)}${fmt(a)}`).join(" · ")||"—";
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,overflow:"hidden",marginBottom:8}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,color:T.goldDim}}>{open?"▼":"▶"}</span><span style={{fontFamily:"Fraunces,serif",fontSize:15,color:T.cream}}>{dept}</span><span style={{fontSize:11,color:T.faint,fontFamily:"Manrope,sans-serif"}}>({items.length})</span></div>
        <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:13,color:T.gold}}>{ts}</span>
      </button>
      {open&&(
        <div style={{borderTop:`1px solid ${T.line}`,padding:"4px 16px 14px"}}>
          {items.length>0&&<div style={{display:"grid",gridTemplateColumns:"2fr 52px 76px 100px 56px 88px 20px",gap:6,padding:"8px 0 4px",fontSize:10,color:T.faint,fontFamily:"Manrope,sans-serif",fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase"}}><span>Description</span><span>Qty</span><span>Unit</span><span>Rate</span><span>Cur</span><span style={{textAlign:"right"}}>Total</span><span/></div>}
          {items.map(item=>(
            <div key={item.id} style={{display:"grid",gridTemplateColumns:"2fr 52px 76px 100px 56px 88px 20px",gap:6,alignItems:"center",padding:"4px 0",borderTop:`1px solid ${T.line}`}}>
              <Inp value={item.description||""} placeholder="Description" onChange={e=>onUpdate(item.id,{description:e.target.value})}/>
              <Inp type="number" min="0" value={item.qty} onChange={e=>onUpdate(item.id,{qty:e.target.value})}/>
              <Sel value={item.unit} onChange={e=>onUpdate(item.id,{unit:e.target.value})} style={{width:"100%",fontSize:12}}>{UNITS.map(u=><option key={u}>{u}</option>)}</Sel>
              <Inp type="number" min="0" value={item.rate} onChange={e=>onUpdate(item.id,{rate:e.target.value})} style={{fontFamily:"IBM Plex Mono,monospace",fontSize:12}}/>
              <Sel value={item.currency} onChange={e=>onUpdate(item.id,{currency:e.target.value})} style={{width:"100%",fontSize:11}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</Sel>
              <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:12,color:T.cream,textAlign:"right"}}>{sym(item.currency)}{fmt(lTot(item))}</div>
              <button onClick={()=>onRemove(item.id)} style={{color:T.faint,fontSize:18,cursor:"pointer",background:"none",border:"none",lineHeight:1}}>×</button>
            </div>
          ))}
          <button onClick={()=>onAdd(dept)} style={{marginTop:10,color:T.gold,fontSize:12,fontWeight:700,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif"}}>+ Add line</button>
        </div>
      )}
    </div>
  );
}
function BudgetsView({project,items,onAdd,onUpdate,onRemove,onApplyTemplate,onApplyScript}){
  const [showPicker,setShowPicker]=useState(false);
  if(!project)return <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:"center"}}><div style={{color:T.dim,fontFamily:"Manrope,sans-serif"}}>Select a production first.</div></div>;
  const totals={};items.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:"Fraunces,serif",fontSize:26,color:T.cream}}>{project.name}</div><div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}><Pill>{project.type}</Pill><Pill color={T.goldDim}>{project.base_currency}</Pill></div><div style={{marginTop:14}}><FS/></div></div>
      <ScriptUploader project={project} onApplyBudget={onApplyScript}/>
      <button onClick={()=>setShowPicker(!showPicker)} style={{color:T.goldDim,fontSize:12,fontWeight:700,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif",marginBottom:12}}>{showPicker?"▼ Hide templates":"▶ Browse manual templates"}</button>
      {showPicker&&(
        <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:20,marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontFamily:"Fraunces,serif",fontSize:17,color:T.cream}}>Templates</div><button onClick={()=>setShowPicker(false)} style={{fontSize:12,color:T.dim,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif"}}>Close ×</button></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10}}>
            {TEMPLATES.map(tpl=><button key={tpl.id} onClick={()=>{onApplyTemplate(tpl);setShowPicker(false);}} style={{background:T.hi,border:`1px solid ${T.line}`,borderRadius:8,padding:14,textAlign:"left",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=T.line}><div style={{fontFamily:"Fraunces,serif",fontSize:14,color:T.gold,marginBottom:3}}>{tpl.label}</div><div style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif"}}>{tpl.sub}</div></button>)}
          </div>
        </div>
      )}
      {DEPTS.map(d=><DeptSection key={d} dept={d} items={items.filter(i=>i.dept===d)} baseCurrency={project.base_currency} onAdd={onAdd} onUpdate={onUpdate} onRemove={onRemove}/>)}
      {Object.keys(totals).length>0&&(
        <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:20,marginTop:16}}>
          <div style={{fontSize:10,color:T.goldDim,letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:700,marginBottom:12,fontFamily:"Manrope,sans-serif"}}>Total budget</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:24}}>{Object.entries(totals).map(([c,a])=><div key={c}><div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:28,color:T.cream,fontWeight:500}}>{sym(c)}{fmt(a)}</div><div style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif"}}>{c}</div></div>)}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RECON
═══════════════════════════════════════════════════════ */
function ReconView({project,advances,reconEntries,onAddAdvance,onUpdateAdvance,onAddEntry,onRemoveEntry}){
  const [showForm,setShowForm]=useState(false);
  const [f,setF]=useState({recipient:"",dept:"",amount:"",currency:"NGN",purpose:"",date_issued:today()});
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));
  if(!project)return <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:"center"}}><div style={{color:T.dim,fontFamily:"Manrope,sans-serif"}}>Select a production first.</div></div>;
  useEffect(()=>{setF(p=>({...p,currency:project.base_currency}));},[project]);
  const open=advances.filter(a=>a.status!=="reconciled");
  const done=advances.filter(a=>a.status==="reconciled");
  const issued=advances.reduce((s,a)=>s+a.amount,0);
  const spent=advances.reduce((s,a)=>{const es=reconEntries.filter(e=>e.advance_id===a.id);return s+es.reduce((ss,e)=>ss+e.amount,0);},0);
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:"Fraunces,serif",fontSize:26,color:T.cream}}>Recon — {project.name}</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:"Manrope,sans-serif"}}>Track cash advances and reconcile against actual spend.</div><div style={{marginTop:14}}><FS/></div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:24}}>
        <StatCard label="Issued" value={`${sym(project.base_currency)}${fmt(issued)}`} sub={`${advances.length} advances`}/>
        <StatCard label="Spent" value={`${sym(project.base_currency)}${fmt(spent)}`} sub="logged"/>
        <StatCard label="Open" value={open.length} sub="pending" accent={open.length>0?T.coral:T.sage}/>
        <StatCard label="Reconciled" value={done.length} sub="closed" accent={T.sage}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontFamily:"Fraunces,serif",fontSize:19,color:T.cream}}>Cash advances</div><Btn onClick={()=>setShowForm(!showForm)}>+ New advance</Btn></div>
      {showForm&&(
        <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:20,marginBottom:16}}>
          <div style={{fontFamily:"Fraunces,serif",fontSize:16,color:T.cream,marginBottom:14}}>New cash advance</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp placeholder="Recipient name" value={f.recipient} onChange={e=>sf("recipient",e.target.value)}/>
            <Inp placeholder="Department" value={f.dept} onChange={e=>sf("dept",e.target.value)}/>
            <Inp type="number" placeholder="Amount" value={f.amount} onChange={e=>sf("amount",e.target.value)}/>
            <Sel value={f.currency} onChange={e=>sf("currency",e.target.value)} style={{width:"100%"}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}</Sel>
            <Inp type="date" value={f.date_issued} onChange={e=>sf("date_issued",e.target.value)}/>
            <Inp placeholder="Purpose / notes" value={f.purpose} onChange={e=>sf("purpose",e.target.value)}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:12}}><Btn onClick={()=>{if(f.recipient&&f.amount){onAddAdvance({...f,amount:Number(f.amount),project_id:project.id});setShowForm(false);setF({recipient:"",dept:"",amount:"",currency:project.base_currency,purpose:"",date_issued:today()});}}}>Save</Btn><Btn variant="ghost" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
        </div>
      )}
      {advances.length===0?<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:32,textAlign:"center"}}><div style={{color:T.dim,fontSize:14,fontFamily:"Manrope,sans-serif"}}>No advances yet.</div></div>:(
        <>{open.length>0&&<AdvanceGroup label="Open" advances={open} reconEntries={reconEntries} onUpdateAdvance={onUpdateAdvance} onAddEntry={onAddEntry} onRemoveEntry={onRemoveEntry}/>}
        {done.length>0&&<AdvanceGroup label="Reconciled" advances={done} reconEntries={reconEntries} onUpdateAdvance={onUpdateAdvance} onAddEntry={onAddEntry} onRemoveEntry={onRemoveEntry}/>}</>
      )}
    </div>
  );
}
function AdvanceGroup({label,advances,reconEntries,onUpdateAdvance,onAddEntry,onRemoveEntry}){
  return <div style={{marginBottom:16}}><div style={{fontSize:10,color:T.dim,letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:700,marginBottom:10,fontFamily:"Manrope,sans-serif"}}>{label}</div>{advances.map(adv=><AdvanceCard key={adv.id} advance={adv} entries={reconEntries.filter(e=>e.advance_id===adv.id)} onUpdate={onUpdateAdvance} onAddEntry={onAddEntry} onRemoveEntry={onRemoveEntry}/>)}</div>;
}
function AdvanceCard({advance,entries,onUpdate,onAddEntry,onRemoveEntry}){
  const [showEntry,setShowEntry]=useState(false);
  const [eDesc,setEDesc]=useState(""); const [eAmt,setEAmt]=useState(""); const [eDate,setEDate]=useState(today());
  const spent=entries.reduce((s,e)=>s+(Number(e.amount)||0),0);
  const balance=advance.amount-spent;
  const pct=advance.amount>0?Math.min(100,(spent/advance.amount)*100):0;
  const sc=advance.status==="reconciled"?T.sage:balance<0?T.coral:balance===0?T.sage:T.gold;
  const sl=advance.status==="reconciled"?"Reconciled":balance<0?"Overspent":balance===0?"Balanced":"Open";
  const saveEntry=()=>{if(eDesc&&eAmt){onAddEntry({advance_id:advance.id,description:eDesc,amount:Number(eAmt),date:eDate});setEDesc("");setEAmt("");}setShowEntry(false);};
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,overflow:"hidden",marginBottom:12}}>
      <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><div style={{fontFamily:"Fraunces,serif",fontSize:15,color:T.cream}}>{advance.recipient}{advance.dept&&<span style={{color:T.dim,fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:400}}> · {advance.dept}</span>}</div><div style={{fontSize:11,color:T.dim,marginTop:2,fontFamily:"Manrope,sans-serif"}}>{advance.purpose||"No purpose"} · {advance.date_issued}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:18,color:T.cream}}>{sym(advance.currency)}{fmt(advance.amount)}</div><Pill color={sc}>{sl}</Pill></div>
      </div>
      <div style={{padding:"0 16px 8px"}}><div style={{height:4,borderRadius:2,background:T.ink,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:balance<0?T.coral:T.goldMid}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.dim,marginTop:4,fontFamily:"Manrope,sans-serif"}}><span>Spent {sym(advance.currency)}{fmt(spent)}</span><span>{balance<0?`Over by ${sym(advance.currency)}${fmt(Math.abs(balance))}`:`Balance ${sym(advance.currency)}${fmt(balance)}`}</span></div></div>
      {entries.length>0&&<div style={{borderTop:`1px solid ${T.line}`,padding:"6px 16px"}}>{entries.map(en=><div key={en.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.line}`,fontSize:13}}><div><span style={{color:T.cream,fontFamily:"Manrope,sans-serif"}}>{en.description}</span>{en.date&&<span style={{color:T.dim,fontSize:11,marginLeft:8}}>{en.date}</span>}</div><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontFamily:"IBM Plex Mono,monospace",color:T.cream,fontSize:13}}>{sym(advance.currency)}{fmt(en.amount)}</span><button onClick={()=>onRemoveEntry(en.id)} style={{color:T.faint,fontSize:18,cursor:"pointer",background:"none",border:"none"}}>×</button></div></div>)}</div>}
      {showEntry&&<div style={{padding:"10px 16px",borderTop:`1px solid ${T.line}`,display:"flex",gap:6,flexWrap:"wrap"}}><Inp placeholder="What was spent on?" value={eDesc} onChange={e=>setEDesc(e.target.value)} style={{flex:"1 1 160px"}}/><Inp type="number" placeholder="Amount" value={eAmt} onChange={e=>setEAmt(e.target.value)} style={{flex:"1 1 90px"}}/><Inp type="date" value={eDate} onChange={e=>setEDate(e.target.value)} style={{flex:"1 1 130px"}}/><Btn size="sm" onClick={saveEntry}>Add</Btn><Btn size="sm" variant="ghost" onClick={()=>setShowEntry(false)}>Cancel</Btn></div>}
      {advance.status!=="reconciled"&&<div style={{padding:"8px 16px 12px",display:"flex",gap:14}}><button onClick={()=>setShowEntry(true)} style={{color:T.gold,fontSize:12,fontWeight:700,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif"}}>+ Log expense</button>{balance>=0&&<button onClick={()=>onUpdate(advance.id,{status:"reconciled"})} style={{color:T.sage,fontSize:12,fontWeight:700,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif"}}>✓ Mark reconciled</button>}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAYMENTS
═══════════════════════════════════════════════════════ */
function ReceiptModal({payee,payment,project,onClose}){
  const text=whatsappReceipt(payment,payee,project);
  return <div style={{position:"fixed",inset:0,background:"rgba(15,1,32,.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:100}}>
    <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:12,padding:24,width:"100%",maxWidth:400}}>
      <div style={{fontFamily:"Fraunces,serif",fontSize:18,color:T.cream,marginBottom:16}}>Payment Receipt</div>
      <pre style={{background:T.ink,border:`1px solid ${T.line}`,borderRadius:8,padding:16,fontSize:12,color:T.cream,fontFamily:"IBM Plex Mono,monospace",whiteSpace:"pre-wrap",marginBottom:16,lineHeight:1.7}}>{text}</pre>
      <div style={{display:"flex",gap:8}}><Btn variant="wa" onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank")}>📱 Send via WhatsApp</Btn><Btn variant="ghost" onClick={onClose}>Close</Btn></div>
    </div>
  </div>;
}
function PaymentsView({project,payees,onAddPayee,onAddPayment,onRemovePayment}){
  const [showForm,setShowForm]=useState(false);
  const [f,setF]=useState({name:"",role:"",agreed_fee:"",currency:"NGN"});
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));
  if(!project)return <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:"center"}}><div style={{color:T.dim,fontFamily:"Manrope,sans-serif"}}>Select a production first.</div></div>;
  useEffect(()=>setF(p=>({...p,currency:project.base_currency})),[project]);
  const pPayees=payees.filter(p=>p.project_id===project.id);
  const totalAgreed=pPayees.reduce((s,p)=>s+p.agreed_fee,0);
  const totalPaid=pPayees.reduce((s,p)=>s+(p.payments||[]).reduce((ss,x)=>ss+x.amount,0),0);
  const unpaid=pPayees.filter(p=>{const paid=(p.payments||[]).reduce((s,x)=>s+x.amount,0);return paid<p.agreed_fee;});
  const fullPaid=pPayees.filter(p=>{const paid=(p.payments||[]).reduce((s,x)=>s+x.amount,0);return paid>=p.agreed_fee;});
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:"Fraunces,serif",fontSize:26,color:T.cream}}>Payments — {project.name}</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:"Manrope,sans-serif"}}>Track fees, log payments and generate WhatsApp receipts instantly.</div><div style={{marginTop:14}}><FS/></div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:24}}>
        <StatCard label="Total agreed" value={`${sym(project.base_currency)}${fmt(totalAgreed)}`} sub={`${pPayees.length} people`}/>
        <StatCard label="Total paid" value={`${sym(project.base_currency)}${fmt(totalPaid)}`} sub="disbursed"/>
        <StatCard label="Outstanding" value={`${sym(project.base_currency)}${fmt(totalAgreed-totalPaid)}`} sub="remaining" accent={totalAgreed-totalPaid>0?T.coral:T.sage}/>
        <StatCard label="Unpaid" value={unpaid.length} sub="not fully paid" accent={unpaid.length>0?T.coral:T.sage}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontFamily:"Fraunces,serif",fontSize:19,color:T.cream}}>Cast & Crew</div><Btn onClick={()=>setShowForm(!showForm)}>+ Add member</Btn></div>
      {showForm&&<div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:20,marginBottom:16}}>
        <div style={{fontFamily:"Fraunces,serif",fontSize:16,color:T.cream,marginBottom:14}}>Add cast / crew member</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp placeholder="Full name" value={f.name} onChange={e=>sf("name",e.target.value)}/>
          <Inp placeholder="Role / position" value={f.role} onChange={e=>sf("role",e.target.value)}/>
          <Inp type="number" placeholder="Agreed fee" value={f.agreed_fee} onChange={e=>sf("agreed_fee",e.target.value)}/>
          <Sel value={f.currency} onChange={e=>sf("currency",e.target.value)} style={{width:"100%"}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}</Sel>
        </div>
        <div style={{display:"flex",gap:8,marginTop:12}}><Btn onClick={()=>{if(f.name&&f.role&&f.agreed_fee){onAddPayee({...f,agreed_fee:Number(f.agreed_fee),project_id:project.id});setShowForm(false);setF({name:"",role:"",agreed_fee:"",currency:project.base_currency});}}}>Add</Btn><Btn variant="ghost" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
      </div>}
      {pPayees.length===0?<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:32,textAlign:"center"}}><div style={{color:T.dim,fontSize:14,fontFamily:"Manrope,sans-serif"}}>No cast or crew added yet.</div></div>:(
        <>{unpaid.length>0&&<><div style={{fontSize:10,color:T.dim,letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:700,marginBottom:10,fontFamily:"Manrope,sans-serif"}}>Unpaid / Partial</div>{unpaid.map(p=><PayeeCard key={p.id} payee={p} project={project} onAddPayment={onAddPayment} onRemovePayment={onRemovePayment}/>)}</>}
        {fullPaid.length>0&&<><div style={{fontSize:10,color:T.dim,letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:700,marginBottom:10,marginTop:16,fontFamily:"Manrope,sans-serif"}}>Fully Paid</div>{fullPaid.map(p=><PayeeCard key={p.id} payee={p} project={project} onAddPayment={onAddPayment} onRemovePayment={onRemovePayment}/>)}</>}</>
      )}
    </div>
  );
}
function PayeeCard({payee,project,onAddPayment,onRemovePayment}){
  const [showForm,setShowForm]=useState(false);
  const [amt,setAmt]=useState(""); const [method,setMethod]=useState(PAY_METHODS[0]); const [date,setDate]=useState(today());
  const [receipt,setReceipt]=useState(null);
  const payments=payee.payments||[];
  const totalPaid=payments.reduce((s,p)=>s+p.amount,0);
  const balance=payee.agreed_fee-totalPaid;
  const pct=payee.agreed_fee>0?Math.min(100,(totalPaid/payee.agreed_fee)*100):0;
  const sc=balance<=0?T.sage:totalPaid>0?T.gold:T.coral;
  const save=()=>{if(!amt)return;const p={amount:Number(amt),method,date};onAddPayment(payee.id,p,(_p)=>setReceipt(_p));setAmt("");setShowForm(false);};
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,overflow:"hidden",marginBottom:12}}>
      <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><div style={{fontFamily:"Fraunces,serif",fontSize:15,color:T.cream}}>{payee.name}</div><div style={{fontSize:12,color:T.dim,marginTop:2,fontFamily:"Manrope,sans-serif"}}>{payee.role}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:17,color:T.cream}}>{sym(payee.currency)}{fmt(payee.agreed_fee)}</div><Pill color={sc}>{balance<=0?"Paid":totalPaid>0?"Partial":"Unpaid"}</Pill></div>
      </div>
      <div style={{padding:"0 16px 8px"}}><div style={{height:4,borderRadius:2,background:T.ink,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:balance<=0?T.sage:T.goldMid}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.dim,marginTop:4,fontFamily:"Manrope,sans-serif"}}><span>Paid {sym(payee.currency)}{fmt(totalPaid)}</span><span>{balance>0?`Owes ${sym(payee.currency)}${fmt(balance)}`:"Fully paid"}</span></div></div>
      {payments.length>0&&<div style={{borderTop:`1px solid ${T.line}`,padding:"6px 16px"}}>{payments.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${T.line}`,fontSize:12}}><div style={{fontFamily:"Manrope,sans-serif",color:T.cream}}>{p.method} <span style={{color:T.dim,fontSize:11}}>· {p.date}</span></div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontFamily:"IBM Plex Mono,monospace",color:T.cream}}>{sym(payee.currency)}{fmt(p.amount)}</span><button onClick={()=>setReceipt(p)} style={{fontSize:11,color:T.gold,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif",fontWeight:700}}>receipt</button><button onClick={()=>onRemovePayment(payee.id,p.id)} style={{color:T.faint,fontSize:16,cursor:"pointer",background:"none",border:"none"}}>×</button></div></div>)}</div>}
      {showForm&&<div style={{padding:"10px 16px",borderTop:`1px solid ${T.line}`,display:"flex",gap:6,flexWrap:"wrap"}}><Inp type="number" placeholder="Amount paid" value={amt} onChange={e=>setAmt(e.target.value)} style={{flex:"1 1 100px"}}/><Sel value={method} onChange={e=>setMethod(e.target.value)} style={{flex:"1 1 150px"}}>{PAY_METHODS.map(m=><option key={m}>{m}</option>)}</Sel><Inp type="date" value={date} onChange={e=>setDate(e.target.value)} style={{flex:"1 1 130px"}}/><Btn size="sm" onClick={save}>Log & Receipt</Btn><Btn size="sm" variant="ghost" onClick={()=>setShowForm(false)}>Cancel</Btn></div>}
      {balance>0&&!showForm&&<div style={{padding:"8px 16px 12px"}}><button onClick={()=>setShowForm(true)} style={{color:T.gold,fontSize:12,fontWeight:700,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif"}}>+ Log payment</button></div>}
      {receipt&&<ReceiptModal payee={payee} payment={receipt} project={project} onClose={()=>setReceipt(null)}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AI BUILDER
═══════════════════════════════════════════════════════ */
const QUICK=["What's a fair day rate for a DoP in Lagos?","Help me estimate a 1-day music video budget in Naira","How should I structure cash advances for crew?","What contingency % is realistic for Nollywood?","Typical post costs for a 5-episode vertical?","How do I handle mobile money payments in Kenya?"];
function AIView({project,budgetItems,advances}){
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  const ctx=project?`Project: "${project.name}" (${project.type}, ${project.base_currency}). Budget lines: ${budgetItems.length}. Total: ${fmt(budgetItems.reduce((s,i)=>s+lTot(i),0))} ${project.base_currency}.`:"No project.";
  const send=async(text)=>{
    const msg=(text||input).trim();if(!msg||loading)return;
    setInput("");setMessages(prev=>[...prev,{role:"user",content:msg}]);setLoading(true);
    try{const history=messages.map(m=>({role:m.role,content:m.content}));const reply=await callClaude([...history,{role:"user",content:`[${ctx}]\n\n${msg}`}],CHAT_SYS);setMessages(prev=>[...prev,{role:"assistant",content:reply}]);}
    catch{setMessages(prev=>[...prev,{role:"assistant",content:"Connection error — try again."}]);}
    setLoading(false);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
      <div style={{marginBottom:18}}><div style={{fontFamily:"Fraunces,serif",fontSize:26,color:T.cream}}>AI Builder</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:"Manrope,sans-serif"}}>Your production finance co-pilot — calibrated for African context.</div><div style={{marginTop:14}}><FS/></div></div>
      <div style={{flex:1,overflowY:"auto",marginBottom:12}}>
        {messages.length===0&&<div style={{marginBottom:22}}><div style={{fontSize:10,color:T.dim,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12,fontFamily:"Manrope,sans-serif"}}>Quick prompts</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{QUICK.map(q=><button key={q} onClick={()=>send(q)} style={{background:T.hi,border:`1px solid ${T.line}`,borderRadius:20,padding:"6px 14px",fontSize:12,color:T.cream,cursor:"pointer",fontFamily:"Manrope,sans-serif"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=T.line}>{q}</button>)}</div></div>}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {messages.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"82%",padding:"10px 14px",borderRadius:10,fontSize:14,lineHeight:1.65,background:m.role==="user"?T.goldGlow:T.panel,border:`1px solid ${m.role==="user"?T.goldDim:T.line}`,color:T.cream,fontFamily:"Manrope,sans-serif",whiteSpace:"pre-wrap"}}>{m.content}</div></div>)}
          {loading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:"10px 16px",color:T.dim,fontSize:14,fontFamily:"Manrope,sans-serif"}}>Thinking…</div></div>}
        </div>
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:8}}><Inp placeholder="Ask about rates, budgets, recon, payments…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} style={{flex:1}}/><Btn onClick={()=>send()} style={{flexShrink:0,opacity:loading?.5:1}}>Send</Btn></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN APP (authenticated)
═══════════════════════════════════════════════════════ */
function MainApp(){
  const {user,signOut}=useAuth();
  const [view,setView]=useState("dashboard");
  const [projects,setProjects]=useState([]);
  const [currentId,setCurrentId]=useState(null);
  const [budgetItems,setBudgetItems]=useState([]);
  const [advances,setAdvances]=useState([]);
  const [reconEntries,setReconEntries]=useState([]);
  const [payees,setPayees]=useState([]);
  const [loadingData,setLoadingData]=useState(true);
  const [mobile,setMobile]=useState(window.innerWidth<700);
  useEffect(()=>{const h=()=>setMobile(window.innerWidth<700);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);

  /* ── Load all data on mount ── */
  useEffect(()=>{if(user)loadAll();},[user]);
  const loadAll=async()=>{
    setLoadingData(true);
    const [p,b,a,r,py,pm]=await Promise.all([
      supabase.from("projects").select("*").order("created_at",{ascending:false}),
      supabase.from("budget_items").select("*"),
      supabase.from("advances").select("*").order("created_at",{ascending:false}),
      supabase.from("recon_entries").select("*"),
      supabase.from("payees").select("*"),
      supabase.from("payments").select("*"),
    ]);
    setProjects(p.data||[]);
    setBudgetItems(b.data||[]);
    setAdvances(a.data||[]);
    setReconEntries(r.data||[]);
    // Attach payments to payees
    const pyData=py.data||[];
    const pmData=pm.data||[];
    setPayees(pyData.map(p=>({...p,payments:pmData.filter(x=>x.payee_id===p.id)})));
    setLoadingData(false);
  };

  const project=projects.find(p=>p.id===currentId)||null;
  const pBudget=budgetItems.filter(i=>i.project_id===currentId);
  const pAdvances=advances.filter(a=>a.project_id===currentId);

  /* ── Projects ── */
  const createProject=async(data)=>{
    const {data:d,error}=await supabase.from("projects").insert({...data,user_id:user.id}).select().single();
    if(!error){setProjects(prev=>[d,...prev]);setCurrentId(d.id);setView("budgets");}
  };

  /* ── Budget items ── */
  const addBudgetItem=async(dept)=>{
    const {data:d,error}=await supabase.from("budget_items").insert({project_id:currentId,user_id:user.id,dept,description:"",qty:1,unit:"flat",rate:0,currency:project.base_currency}).select().single();
    if(!error)setBudgetItems(prev=>[...prev,d]);
  };
  const updateBudgetItem=async(id,patch)=>{
    setBudgetItems(prev=>prev.map(i=>i.id===id?{...i,...patch}:i));
    await supabase.from("budget_items").update(patch).eq("id",id);
  };
  const removeBudgetItem=async(id)=>{
    setBudgetItems(prev=>prev.filter(i=>i.id!==id));
    await supabase.from("budget_items").delete().eq("id",id);
  };
  const applyTemplate=async(tpl)=>{
    const rows=tpl.items.map(t=>({...t,project_id:currentId,user_id:user.id,currency:project.base_currency}));
    const {data:d}=await supabase.from("budget_items").insert(rows).select();
    if(d)setBudgetItems(prev=>[...prev,...d]);
  };
  const applyScriptBudget=async(lines)=>{
    const rows=lines.map(l=>({...l,project_id:currentId,user_id:user.id,currency:project.base_currency}));
    const {data:d}=await supabase.from("budget_items").insert(rows).select();
    if(d)setBudgetItems(prev=>[...prev,...d]);
  };

  /* ── Advances ── */
  const addAdvance=async(data)=>{
    const {data:d,error}=await supabase.from("advances").insert({...data,user_id:user.id,status:"open"}).select().single();
    if(!error)setAdvances(prev=>[d,...prev]);
  };
  const updateAdvance=async(id,patch)=>{
    setAdvances(prev=>prev.map(a=>a.id===id?{...a,...patch}:a));
    await supabase.from("advances").update(patch).eq("id",id);
  };

  /* ── Recon entries ── */
  const addReconEntry=async(data)=>{
    const {data:d,error}=await supabase.from("recon_entries").insert({...data,user_id:user.id}).select().single();
    if(!error)setReconEntries(prev=>[...prev,d]);
  };
  const removeReconEntry=async(id)=>{
    setReconEntries(prev=>prev.filter(e=>e.id!==id));
    await supabase.from("recon_entries").delete().eq("id",id);
  };

  /* ── Payees ── */
  const addPayee=async(data)=>{
    const {data:d,error}=await supabase.from("payees").insert({...data,user_id:user.id}).select().single();
    if(!error)setPayees(prev=>[...prev,{...d,payments:[]}]);
  };
  const addPayment=async(payeeId,paymentData,onDone)=>{
    const {data:d,error}=await supabase.from("payments").insert({...paymentData,payee_id:payeeId,user_id:user.id}).select().single();
    if(!error){setPayees(prev=>prev.map(p=>p.id===payeeId?{...p,payments:[...(p.payments||[]),d]}:p));onDone&&onDone(d);}
  };
  const removePayment=async(payeeId,pmId)=>{
    setPayees(prev=>prev.map(p=>p.id===payeeId?{...p,payments:(p.payments||[]).filter(x=>x.id!==pmId)}:p));
    await supabase.from("payments").delete().eq("id",pmId);
  };

  if(loadingData)return <div style={{minHeight:"100vh",background:T.ink,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{GCS}</style><Spinner/></div>;

  return(
    <div style={{fontFamily:"Manrope,sans-serif",background:T.ink,minHeight:"100vh",color:T.cream,display:"flex"}}>
      <style>{GCS}</style>
      {!mobile&&<Sidebar view={view} setView={setView} onSignOut={signOut} userEmail={user?.email}/>}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden"}}>
        <TopBar projects={projects} currentId={currentId} onSelect={id=>setCurrentId(id||null)} onNew={()=>setView("dashboard")} onSignOut={signOut}/>
        <main style={{flex:1,overflowY:"auto",padding:"24px 20px 100px"}}>
          {view==="dashboard"&&<DashboardView projects={projects} budgetItems={budgetItems} advances={advances} payees={payees} currentId={currentId} onSelect={id=>{setCurrentId(id);setView("budgets");}} onCreate={createProject}/>}
          {view==="budgets"&&<BudgetsView project={project} items={pBudget} onAdd={addBudgetItem} onUpdate={updateBudgetItem} onRemove={removeBudgetItem} onApplyTemplate={applyTemplate} onApplyScript={applyScriptBudget}/>}
          {view==="recon"&&<ReconView project={project} advances={pAdvances} reconEntries={reconEntries.filter(e=>pAdvances.some(a=>a.id===e.advance_id))} onAddAdvance={addAdvance} onUpdateAdvance={updateAdvance} onAddEntry={addReconEntry} onRemoveEntry={removeReconEntry}/>}
          {view==="payments"&&<PaymentsView project={project} payees={payees} onAddPayee={addPayee} onAddPayment={addPayment} onRemovePayment={removePayment}/>}
          {view==="ai"&&<AIView project={project} budgetItems={pBudget} advances={pAdvances}/>}
        </main>
      </div>
      {mobile&&<MobileNav view={view} setView={setView}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
function AuthGate(){
  const {user,loading}=useAuth();
  if(loading)return <div style={{minHeight:"100vh",background:T.ink,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{GCS}</style><Spinner/></div>;
  return user?<MainApp/>:<AuthScreen/>;
}

export default function App(){
  return <AuthProvider><AuthGate/></AuthProvider>;
}
