import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { CURRENCIES,DEPTS,UNITS,PROJ_TYPES,PAY_METHODS,TEMPLATES,T,
  CHAT_SYS,SCRIPT_SYS,SCRIPT_PROMPT,BREAKDOWN_SYS,BREAKDOWN_PROMPT,
  CREATORS,TEMPLATE_SCENES,COMMUNITY_TEMPLATES,MKTCAT,QUICK,
  today,fmt,sym,lTot,readFileAsBase64,readFileAsText,readImageAsDataURL,callClaude,
  supabase } from './data.js';
function FS(){
  return(
    <div style={{position:'relative',height:8,overflow:'hidden',borderRadius:1}}>
      <div style={{height:'100%',background:`repeating-linear-gradient(90deg,${T.gold} 0 12px,transparent 12px 20px)`,opacity:.5}}/>
      <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.25) 50%,transparent 100%)',backgroundSize:'200% 100%',animation:'filmShimmer 2.5s ease-in-out infinite'}}/>
      <style>{'@keyframes filmShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}'}</style>
    </div>
  );
}
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
          <div style={{fontSize:12,color:T.dim,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"Manrope,sans-serif"}}>Budgets tailored just for you</div>
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
const NAV=[{id:"dashboard",e:"🎬",l:"Dashboard"},{id:"budgets",e:"📊",l:"Budgets"},{id:"breakdown",e:"📋",l:"Breakdown"},{id:"recon",e:"🧾",l:"Recon"},{id:"payments",e:"💳",l:"Payments"},{id:"market",e:"🏪",l:"Marketplace"},{id:"ai",e:"✦",l:"AI Builder"}];
function Sidebar({view,setView,onSignOut,userEmail}){
  return(
    <div style={{width:210,minHeight:"100vh",background:T.panel,flexShrink:0,borderRight:`1px solid ${T.line}`,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"22px 18px 14px"}}>
        <div style={{fontFamily:"Fraunces,serif",fontSize:26,fontWeight:700,color:T.gold,letterSpacing:"0.04em"}}>NKO</div>
        <div style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:T.goldDim,fontFamily:"Manrope,sans-serif",fontWeight:700,marginTop:2}}>Budgets tailored just for you</div>
      </div>
      <FS/>
      <nav style={{flex:1,padding:"14px 10px"}}>
        {NAV.map(n=>{const on=view===n.id;return <button key={n.id} onClick={()=>setView(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",background:on?T.goldGlow:"transparent",color:on?T.gold:T.dim,fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:600,textAlign:"left",marginBottom:2,borderLeft:`2px solid ${on?T.gold:"transparent"}`}}><span style={{fontSize:15}}>{n.e}</span>{n.l}</button>;})}
      </nav>
      {/* Studio profile at bottom of sidebar */}
      <div style={{padding:"14px 16px",borderTop:`1px solid ${T.line}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:T.hi,border:`1px solid ${T.goldDim}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:T.gold,fontWeight:700,fontFamily:"Manrope,sans-serif",flexShrink:0}}>
            {userEmail?.charAt(0).toUpperCase()||'?'}
          </div>
          <div style={{overflow:"hidden",flex:1}}>
            <div style={{fontSize:11,color:T.cream,fontFamily:"Manrope,sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:600}}>Studio</div>
            <div style={{fontSize:10,color:T.dim,fontFamily:"Manrope,sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userEmail}</div>
          </div>
        </div>
        <Btn variant="ghost" size="sm" onClick={onSignOut} style={{width:"100%"}}>Sign out</Btn>
      </div>
    </div>
  );
}

function TopBar({view,setView,projects,currentId,onSelect,onCreate}){
  const onDashboard=view==="dashboard";
  return(
    <div style={{background:T.panel,borderBottom:`1px solid ${T.line}`,padding:"10px 20px",display:"flex",alignItems:"center",gap:10}}>
      {!onDashboard&&(
        <Btn variant="ghost" size="sm" onClick={()=>setView("dashboard")} style={{flexShrink:0}}>← Back</Btn>
      )}
      <Sel value={currentId||""} onChange={e=>onSelect(e.target.value||null)} style={{flex:1,maxWidth:280}}>
        <option value="">Select a production…</option>
        {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </Sel>
      {onDashboard&&<Btn onClick={onCreate} style={{flexShrink:0}}>+ New</Btn>}
    </div>
  );
}

function MobileNav({view,setView}){
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,background:T.panel,borderTop:`1px solid ${T.line}`,display:"flex",overflowX:"auto"}}>
      {NAV.map(n=>{const on=view===n.id;return <button key={n.id} onClick={()=>setView(n.id)} style={{flex:"0 0 auto",padding:"8px 12px 6px",border:"none",background:on?T.goldGlow:"transparent",color:on?T.gold:T.dim,display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontSize:9,fontFamily:"Manrope,sans-serif",fontWeight:700,textTransform:"uppercase",cursor:"pointer"}}><span style={{fontSize:18}}>{n.e}</span>{n.l.split(" ")[0]}</button>;})}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MARKETPLACE
═══════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════
   MARKETPLACE — Notion-style with creator profiles
═══════════════════════════════════════════════════════ */
const CREATORS=[
  {id:'c1',name:'Zestyn Media',role:'Production Company',location:'Lagos, NG',verified:true,templates:3,downloads:253,bio:'Nigerian production house — drama, branded content and verticals'},
  {id:'c2',name:'Lagos Digital Lab',role:'Digital Studio',location:'Lagos, NG',verified:true,templates:1,downloads:98,bio:'Vertical content specialists for TikTok, YouTube Shorts and Instagram Reels'},
  {id:'c3',name:'Rhythm House',role:'Music Video Director',location:'Abuja, NG',verified:true,templates:1,downloads:87,bio:'Award-winning music video director for Afrobeats and Afropop artists'},
  {id:'c4',name:'Pan-African Docs',role:'Documentary Studio',location:'Accra, GH',verified:false,templates:1,downloads:63,bio:'Field documentary makers across West and East Africa'},
  {id:'c5',name:'Toon Studios NG',role:'Animation Studio',location:'Lagos, NG',verified:true,templates:1,downloads:35,bio:'2D animation studio producing original African cartoon content'},
  {id:'c6',name:'Indie Africa',role:'Independent Filmmaker',location:'Nairobi, KE',verified:false,templates:1,downloads:41,bio:'Festival circuit short films from East Africa'},
];

/* Archetypal scenes bundled with each template */
const TEMPLATE_SCENES={
  feature:[
    {sceneNumber:'1',heading:'INT. HOUSE - DAY',intExt:'INT',dayNight:'DAY',synopsis:'Opening — establish lead character in their world before the inciting incident',pageCount:2,cast:['Lead Actor','Supporting Cast'],extras:'None',location:'Main house location',props:['Phone','Documents','Family photo'],vehicles:[],wardrobe:['Casual home wear'],hairMakeup:'Natural look — establish baseline',specialEquip:['Steadicam for walk-and-talk'],vfxSfx:'None',sound:'Ambient house sounds — radio in background',notes:'Set the tone — do not rush this scene'},
    {sceneNumber:'2',heading:'EXT. STREET - DAY',intExt:'EXT',dayNight:'DAY',synopsis:'Inciting incident — protagonist encounters conflict outside',pageCount:1.5,cast:['Lead Actor','Antagonist'],extras:'10 pedestrians',location:'Busy street location',props:['Car','Bag','Keys'],vehicles:['Character vehicle — Camry or Hilux'],wardrobe:['Smart casual'],hairMakeup:'Continuity from Scene 1',specialEquip:['Camera crane for reveal shot'],vfxSfx:'None',sound:'Street ambience — traffic, market sounds',notes:'Traffic control permit required — book early'},
    {sceneNumber:'3',heading:'INT. OFFICE - DAY',intExt:'INT',dayNight:'DAY',synopsis:'Confrontation scene — stakes raised',pageCount:3,cast:['Lead Actor','Antagonist','Secretary'],extras:'5 office workers',location:'Office or bank location',props:['Files','Laptop','Phone','Water bottle'],vehicles:[],wardrobe:['Formal wear'],hairMakeup:'Power look — deliberate styling',specialEquip:['Two-camera setup for intercutting'],vfxSfx:'None',sound:'Office ambience — AC hum, keyboard sounds',notes:'Lock the location the day before — do not shoot here on a tight schedule'},
    {sceneNumber:'4',heading:'EXT. LOCATION - NIGHT',intExt:'EXT',dayNight:'NIGHT',synopsis:'Night climax — confrontation reaches peak',pageCount:2.5,cast:['Lead Actor','Antagonist'],extras:'None',location:'Quiet outdoor location',props:['Torch','Phone'],vehicles:['Both character vehicles'],wardrobe:['Dark colours for night visibility'],hairMakeup:'Distressed look — this is the breaking point',specialEquip:['Generator for lighting rig','Practicals'],vfxSfx:'Practical fire or explosion if needed',sound:'Night ambience — crickets, distant traffic',notes:'Night shoots require extra catering and transport — budget accordingly'},
  ],
  vertical:[
    {sceneNumber:'Ep 1',heading:'INT. SITTING ROOM - DAY',intExt:'INT',dayNight:'DAY',synopsis:'Episode 1 — introduce the household and establish the central conflict',pageCount:8,cast:['Lead 1','Lead 2','Mother-in-law'],extras:'None',location:'Main house — sitting room and kitchen',props:['Phone','Cooking pot','Remote control','Food items'],vehicles:[],wardrobe:['Casual home wear — Ankara and western mix'],hairMakeup:'Natural — relatable everyday look',specialEquip:['Gimbal for fluid movement in tight spaces'],vfxSfx:'None',sound:'House sounds — Nollywood melodrama score',notes:'Keep scenes tight — vertical format means max 90 seconds per cut. Shoot multiple scenes in one location per day'},
    {sceneNumber:'Ep 2',heading:'EXT. COMPOUND - DAY',intExt:'EXT',dayNight:'DAY',synopsis:'Episode 2 — conflict spills outside. Neighbours witness the drama',pageCount:7,cast:['Lead 1','Lead 2','Antagonist','Neighbour'],extras:'5 compound residents',location:'Compound and gate area',props:['Luggage','Phone','Broom','Gate keys'],vehicles:['One character car'],wardrobe:['Mix — some characters just woke up'],hairMakeup:'Continuity important — same day as Ep 1 in story',specialEquip:['Drone for establishing compound shot'],vfxSfx:'None',sound:'Compound ambience — birds, generators, distant traffic',notes:'Drone permit may be needed depending on location'},
    {sceneNumber:'Ep 3-5',heading:'INT / EXT. VARIOUS - DAY/NIGHT',intExt:'INT',dayNight:'DAY',synopsis:'Episodes 3-5 — escalation arc. Introduce secondary characters and twists',pageCount:22,cast:['All main cast','Guest character'],extras:'Variable per scene',location:'Multiple — hospital, office, house',props:['Per scene — hospital equipment, office files, domestic items'],vehicles:['Lead character vehicle'],wardrobe:['Character evolution — slight changes each episode'],hairMakeup:'Track continuity across episodes carefully',specialEquip:['B-camera for efficient coverage'],vfxSfx:'None',sound:'Varied per location — use consistent score',notes:'Block shoot by location — all hospital scenes one day, all office scenes next day. Saves time and budget significantly'},
  ],
  shortfilm:[
    {sceneNumber:'1',heading:'INT. ROOM - DAY',intExt:'INT',dayNight:'DAY',synopsis:'Open on a character in crisis — no dialogue. Visual storytelling only',pageCount:1.5,cast:['Lead'],extras:'None',location:'Small interior — bedroom or bathroom',props:['Letter','Phone','Keys'],vehicles:[],wardrobe:['Dishevelled — character is not well'],hairMakeup:'Minimal — intentionally undone',specialEquip:['50mm prime lens for intimacy'],vfxSfx:'None',sound:'Silence broken by ambient sound — the contrast matters',notes:'This scene sets the entire film. Spend time on it'},
    {sceneNumber:'2',heading:'EXT. STREET - DAY',intExt:'EXT',dayNight:'DAY',synopsis:'Character moves through the world — internal journey becomes external',pageCount:2,cast:['Lead','Stranger'],extras:'General public',location:'Real street or market',props:['The letter from Scene 1'],vehicles:[],wardrobe:['Same as Scene 1 — continuity'],hairMakeup:'Continuity',specialEquip:['Handheld camera — restless energy'],vfxSfx:'None',sound:'Location sound — keep it real and messy',notes:'Guerrilla shoot if possible — energy of real life cannot be replicated on a closed set'},
    {sceneNumber:'3',heading:'INT. LOCATION - DUSK',intExt:'INT',dayNight:'DUSK',synopsis:'Resolution — or anti-resolution. End on an image not a speech',pageCount:1,cast:['Lead'],extras:'None',location:'Return to opening location or a new intimate space',props:['Minimal — what matters is the character'],vehicles:[],wardrobe:['Slight change — something has shifted'],hairMakeup:'Subtle difference from Scene 1',specialEquip:['Natural light if possible — golden hour'],vfxSfx:'None',sound:'Score enters here for the first time',notes:'Do not over-explain the ending. Trust your audience'},
  ],
  musicvideo:[
    {sceneNumber:'Performance',heading:'EXT/INT. HERO LOCATION - DAY',intExt:'EXT',dayNight:'DAY',synopsis:'Main performance setup — artist lip sync and dance performance',pageCount:0,cast:['Artist','Dancers x6'],extras:'Crowd if needed',location:'Key visual location — studio, rooftop, or landmark',props:['Mic prop','Wardrobe hero piece','Brand items if sponsored'],vehicles:['Artist arrival vehicle for opening shot'],wardrobe:['Hero look — this is the primary costume. Styled to brief'],hairMakeup:'Full glam — this is the main reference look',specialEquip:['Gimbal','Drone','High frame rate for slow motion'],vfxSfx:'Practical elements — smoke machine, confetti, sparklers',sound:'Playback system on location — minimum 2 speakers',notes:'Shoot performance first while energy is high. Keep BTS rolling all day'},
    {sceneNumber:'Narrative',heading:'INT. STORY LOCATION - DAY',intExt:'INT',dayNight:'DAY',synopsis:'Story sequence — narrative thread that runs between performance cuts',pageCount:0,cast:['Artist','Co-star'],extras:'Background for atmosphere',location:'Secondary location — house, bar, car interior',props:['Story-specific props — flowers, phone, drink'],vehicles:['Character vehicles'],wardrobe:['Second look — different from performance'],hairMakeup:'Continuity within the narrative thread',specialEquip:['Anamorphic lens for cinematic feel'],vfxSfx:'Colour grade in post — save VFX for hero shots only',sound:'Natural ambience — contrast with performance energy',notes:'Keep narrative and performance on separate halves of the day to avoid continuity confusion'},
  ],
  documentary:[
    {sceneNumber:'OTV',heading:'EXT. ESTABLISHING LOCATION - DAY',intExt:'EXT',dayNight:'DAY',synopsis:'Opening — establish the world of the film. No people yet. Just the place',pageCount:0,cast:[],extras:'None',location:'Primary subject location — neighbourhood, landscape, institution',props:['None'],vehicles:['Production vehicle for equipment'],wardrobe:['N/A'],hairMakeup:'N/A',specialEquip:['Drone for aerial establish','Wide prime lens'],vfxSfx:'None',sound:'Wild track — record 5 minutes of pure location sound',notes:'Spend the first morning just observing. The best shots come from patience not planning'},
    {sceneNumber:'INT',heading:'INT. INTERVIEW SETUP - DAY',intExt:'INT',dayNight:'DAY',synopsis:'Sit-down interview — subject speaks directly to camera',pageCount:0,cast:['Primary Subject'],extras:'None',location:'Controlled interior — subject home or workspace',props:['Meaningful background items that tell the story'],vehicles:[],wardrobe:['Subject chooses — advise away from stripes and white'],hairMakeup:'Minimal touch — natural look builds trust',specialEquip:['Interview lighting kit — 3-point','Lapel mic plus boom backup'],vfxSfx:'None',sound:'Dead quiet — turn off AC before rolling',notes:'Let the subject speak for 10 minutes before asking anything. The pre-interview warm-up is often where the best material lives'},
    {sceneNumber:'OBS',heading:'EXT/INT. OBSERVATIONAL - VARIOUS',intExt:'EXT',dayNight:'DAY',synopsis:'Observational sequences — subject goes about their life. No direction',pageCount:0,cast:['Subject'],extras:'Natural',location:'Wherever the subject goes',props:['Whatever is naturally there'],vehicles:['Follow car if needed'],wardrobe:['Whatever subject wears'],hairMakeup:'None',specialEquip:['Run-and-gun setup — camera plus wireless lav'],vfxSfx:'None',sound:'Everything — observe, do not control',notes:'Your job is to disappear. The moment the subject performs for the camera the documentary is over'},
  ],
  branded:[
    {sceneNumber:'Hero',heading:'INT. STUDIO / BRANDED SPACE - DAY',intExt:'INT',dayNight:'DAY',synopsis:'Hero shot — product or brand featured prominently with talent',pageCount:0,cast:['Host/Presenter','Brand Representative if needed'],extras:'None',location:'Branded studio or client location',props:['Product prominently placed','Brand colours in set dressing'],vehicles:[],wardrobe:['Styled to brand guidelines — send reference board in advance'],hairMakeup:'Polished — this represents the brand',specialEquip:['Product shot insert rig','Two cameras for efficiency'],vfxSfx:'Lower thirds and brand graphics in post',sound:'Scripted — approve script with client before shoot day',notes:'Send a shot list to client before the shoot. No surprises on the day'},
    {sceneNumber:'Testimonial',heading:'INT. CLEAN INTERIOR - DAY',intExt:'INT',dayNight:'DAY',synopsis:'Testimonial or interview segment — authentic feel, not over-produced',pageCount:0,cast:['Real customer or talent'],extras:'None',location:'Clean neutral space or client location',props:['Product naturally in frame'],vehicles:[],wardrobe:['Smart casual — aspirational but relatable'],hairMakeup:'Natural — testimonials work when they feel real',specialEquip:['Single camera — handheld or sticks'],vfxSfx:'Minimal — keep it authentic',sound:'Lapel mic — clean audio is critical for testimonials',notes:'Get 5 takes minimum. Clients always ask for variations'},
  ],
  animation:[
    {sceneNumber:'Ep 1 — Voice Record',heading:'INT. RECORDING STUDIO - DAY',intExt:'INT',dayNight:'DAY',synopsis:'Voice recording session for Episode 1 — all dialogue captured in studio',pageCount:0,cast:['Lead Voice Actor','Supporting VAs x3'],extras:'None',location:'Recording studio — book full day',props:['Printed scripts','Water','Snacks for long session'],vehicles:[],wardrobe:['Comfortable — talent will be in booth all day'],hairMakeup:'None',specialEquip:['Condenser mic','Pop filter','Acoustic booth','DAW setup'],vfxSfx:'None',sound:'Zero background noise — studio must be fully treated',notes:'Record each character separately where possible. Overlapping in booth causes mixing problems. Also record 5 minutes of room tone'},
    {sceneNumber:'Ep 1 — Storyboard Review',heading:'INT. ANIMATION STUDIO - DAY',intExt:'INT',dayNight:'DAY',synopsis:'Team reviews storyboard against recorded dialogue. Lock the animatic',pageCount:0,cast:['Animation Director','Lead Animator','Director'],extras:'None',location:'Studio workspace',props:['Printed storyboards','Monitor for playback'],vehicles:[],wardrobe:['N/A'],hairMakeup:'N/A',specialEquip:['Editing workstation','Drawing tablets','Large monitor'],vfxSfx:'N/A at this stage',sound:'Rough audio edit for animatic review',notes:'Do not begin full animation until animatic is approved. Changes are cheap at storyboard stage. They are very expensive after'},
    {sceneNumber:'Ep 1 — Animation Pass',heading:'INT. ANIMATION STUDIO - MULTI-DAY',intExt:'INT',dayNight:'DAY',synopsis:'Full animation pass — character animation, background art, compositing',pageCount:0,cast:[],extras:'None',location:'Studio workstations',props:['Software licences active','Asset library organised'],vehicles:[],wardrobe:['N/A'],hairMakeup:'N/A',specialEquip:['Minimum 16GB RAM workstations','Wacom Cintiq or equivalent','Render farm if available'],vfxSfx:'All effects created in-house during this pass',sound:'Music and SFX added in final composite',notes:'Block animation time by character. Animating the same character across all scenes first then moving to the next is faster than scene-by-scene'},
  ],
};

const COMMUNITY_TEMPLATES=[
  {id:"ct1",label:"Nollywood TV Drama",author:"Zestyn Media",authorRole:"Production Company",authorLocation:"Lagos",verified:true,type:"Feature Film",sub:"13-episode primetime drama · broadcast standard",downloads:142,items:TEMPLATES.find(t=>t.id==="feature").items,scenes:TEMPLATE_SCENES.feature},
  {id:"ct2",label:"Vertical Thriller Series",author:"Lagos Digital Lab",authorRole:"Digital Studio",authorLocation:"Lagos",verified:true,type:"Vertical Series / Microdrama",sub:"Social media vertical · 60–90 sec episodes",downloads:98,items:TEMPLATES.find(t=>t.id==="vertical").items,scenes:TEMPLATE_SCENES.vertical},
  {id:"ct3",label:"Afrobeats Music Video",author:"Rhythm House",authorRole:"Music Video Director",authorLocation:"Abuja",verified:true,type:"Music Video",sub:"Performance + narrative hybrid · 2-day shoot",downloads:87,items:TEMPLATES.find(t=>t.id==="musicvideo").items,scenes:TEMPLATE_SCENES.musicvideo},
  {id:"ct4",label:"Documentary Dispatch",author:"Pan-African Docs",authorRole:"Documentary Studio",authorLocation:"Accra",verified:false,type:"Documentary",sub:"Field journalism · East African rates",downloads:63,items:TEMPLATES.find(t=>t.id==="documentary").items,scenes:TEMPLATE_SCENES.documentary},
  {id:"ct5",label:"Brand Content Series",author:"Zestyn Media",authorRole:"Production Company",authorLocation:"Lagos",verified:true,type:"Branded Content",sub:"Branded episodic · corporate client",downloads:54,items:TEMPLATES.find(t=>t.id==="branded").items,scenes:TEMPLATE_SCENES.branded},
  {id:"ct6",label:"Festival Short Film",author:"Indie Africa",authorRole:"Independent Filmmaker",authorLocation:"Nairobi",verified:false,type:"Short Film",sub:"15-minute short · festival circuit",downloads:41,items:TEMPLATES.find(t=>t.id==="shortfilm").items,scenes:TEMPLATE_SCENES.shortfilm},
  {id:"ct7",label:"African Cartoon Episode",author:"Toon Studios NG",authorRole:"Animation Studio",authorLocation:"Lagos",verified:true,type:"Animation / Cartoon",sub:"2D animated episode · African studio pipeline",downloads:35,items:TEMPLATES.find(t=>t.id==="animation").items,scenes:TEMPLATE_SCENES.animation},
];

const MKTCAT=["All","Feature Film","Vertical Series / Microdrama","Music Video","Documentary","Short Film","Branded Content","Animation / Cartoon"];

function CreatorCard({creator,isSelected,onClick}){
  const initials=creator.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return(
    <button onClick={onClick} style={{background:isSelected?T.hi:T.panel,border:`1px solid ${isSelected?T.gold:T.line}`,borderRadius:12,padding:'16px 14px',textAlign:'left',cursor:'pointer',flexShrink:0,width:160,transition:'all 0.15s'}}>
      <div style={{width:40,height:40,borderRadius:'50%',background:isSelected?T.gold:T.hi,border:`2px solid ${isSelected?T.gold:T.line}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:isSelected?T.ink:T.goldDim,fontFamily:'Manrope,sans-serif',marginBottom:10}}>
        {initials}
      </div>
      <div style={{fontFamily:'Fraunces,serif',fontSize:13,color:T.cream,marginBottom:2}}>{creator.name}</div>
      <div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:6}}>{creator.role}</div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif'}}>
        <span>{creator.templates} templates</span>
        <span>{creator.downloads} uses</span>
      </div>
      {creator.verified&&<div style={{fontSize:9,color:T.sage,fontFamily:'Manrope,sans-serif',fontWeight:700,marginTop:4}}>✓ NKO Verified</div>}
    </button>
  );
}

function MarketplaceView({onApplyTemplate}){
  const [cat,setCat]=useState("All");
  const [search,setSearch]=useState("");
  const [selectedCreator,setSelectedCreator]=useState(null);
  const [applied,setApplied]=useState(null);
  const isMobile=useIsMobile();

  const filtered=COMMUNITY_TEMPLATES.filter(t=>{
    const matchCat=cat==="All"||t.type===cat;
    const matchCreator=!selectedCreator||t.author===selectedCreator;
    const matchSearch=!search||t.label.toLowerCase().includes(search.toLowerCase())||t.author.toLowerCase().includes(search.toLowerCase());
    return matchCat&&matchCreator&&matchSearch;
  });

  const featuredCreator=CREATORS[0];

  return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>Marketplace</div>
        <div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Community budget + breakdown templates from African producers. Apply to your production in one tap.</div>
        <div style={{marginTop:14}}><FS/></div>
      </div>

      {/* Featured creator hero */}
      <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:12,padding:20,marginBottom:24,display:'flex',gap:16,alignItems:'center',flexWrap:isMobile?'wrap':'nowrap'}}>
        <div style={{width:52,height:52,borderRadius:'50%',background:T.gold,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,color:T.ink,fontFamily:'Manrope,sans-serif',flexShrink:0}}>
          {featuredCreator.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:T.goldDim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>Featured creator this week</div>
          <div style={{fontFamily:'Fraunces,serif',fontSize:17,color:T.cream}}>{featuredCreator.name}</div>
          <div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginTop:2}}>{featuredCreator.bio}</div>
        </div>
        <div style={{display:'flex',gap:16,flexShrink:0}}>
          <div style={{textAlign:'center'}}><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:20,color:T.gold}}>{featuredCreator.templates}</div><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif'}}>templates</div></div>
          <div style={{textAlign:'center'}}><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:20,color:T.gold}}>{featuredCreator.downloads}</div><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif'}}>uses</div></div>
        </div>
      </div>

      {/* Creator row */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:12}}>Browse by creator</div>
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
          <div style={{display:'flex',gap:10,paddingBottom:8,minWidth:'max-content'}}>
            <button onClick={()=>setSelectedCreator(null)} style={{background:!selectedCreator?T.hi:T.panel,border:`1px solid ${!selectedCreator?T.gold:T.line}`,borderRadius:12,padding:'10px 14px',cursor:'pointer',flexShrink:0,color:!selectedCreator?T.gold:T.dim,fontSize:12,fontFamily:'Manrope,sans-serif',fontWeight:700}}>All creators</button>
            {CREATORS.map(c=><CreatorCard key={c.id} creator={c} isSelected={selectedCreator===c.name} onClick={()=>setSelectedCreator(selectedCreator===c.name?null:c.name)}/>)}
          </div>
        </div>
      </div>

      {/* Search + category filter */}
      <Inp placeholder="Search templates…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:12}}/>
      <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch',marginBottom:20}}>
        <div style={{display:'flex',gap:6,paddingBottom:4,minWidth:'max-content'}}>
          {MKTCAT.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${cat===c?T.gold:T.line}`,background:cat===c?T.goldGlow:'transparent',color:cat===c?T.gold:T.dim,fontSize:12,fontFamily:'Manrope,sans-serif',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>{c}</button>)}
        </div>
      </div>

      {/* Template grid */}
      {filtered.length===0?(
        <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:32,textAlign:'center'}}>
          <div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>No templates match your search.</div>
        </div>
      ):(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
          {filtered.map(tpl=>{
            const total=tpl.items.reduce((s,i)=>s+lTot(i),0);
            const isApplied=applied===tpl.id;
            const creator=CREATORS.find(c=>c.name===tpl.author);
            const initials=tpl.author.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
            return(
              <div key={tpl.id} style={{background:T.panel,border:`1px solid ${isApplied?T.sage:T.line}`,borderRadius:12,padding:18,display:'flex',flexDirection:'column',gap:12,transition:'border-color 0.2s'}}>
                {/* Creator attribution */}
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:T.hi,border:`1px solid ${T.line}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:T.goldDim,fontFamily:'Manrope,sans-serif',flexShrink:0}}>{initials}</div>
                  <div>
                    <div style={{fontSize:11,color:T.cream,fontFamily:'Manrope,sans-serif',fontWeight:600}}>{tpl.author}</div>
                    {creator?.verified&&<div style={{fontSize:9,color:T.sage,fontFamily:'Manrope,sans-serif',fontWeight:700}}>✓ Verified</div>}
                  </div>
                  <div style={{marginLeft:'auto',fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif'}}>{tpl.authorLocation}</div>
                </div>
                {/* Template info */}
                <div>
                  <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:3}}>{tpl.label}</div>
                  <div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{tpl.sub}</div>
                </div>
                {/* What's included */}
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  <Pill>{tpl.type.split("/")[0].trim()}</Pill>
                  <span style={{fontSize:10,background:'rgba(82,176,122,0.15)',color:T.sage,padding:'2px 8px',borderRadius:10,fontFamily:'Manrope,sans-serif',fontWeight:700,border:`1px solid ${T.sage}`}}>📊 Budget</span>
                  {tpl.scenes&&tpl.scenes.length>0&&<span style={{fontSize:10,background:'rgba(74,144,217,0.15)',color:T.sapphire,padding:'2px 8px',borderRadius:10,fontFamily:'Manrope,sans-serif',fontWeight:700,border:`1px solid ${T.sapphire}`}}>📋 {tpl.scenes.length} scenes</span>}
                </div>
                {/* Stats + action */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:15,color:T.gold}}>₦{fmt(total)}</div>
                    <div style={{fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif'}}>{tpl.items.length} lines · {tpl.downloads} uses</div>
                  </div>
                  <Btn size="sm" variant={isApplied?"sage":"outline"} onClick={()=>{onApplyTemplate(tpl);setApplied(tpl.id);setTimeout(()=>setApplied(null),3000);}}>
                    {isApplied?"✓ Applied":"Use template"}
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit section */}
      <div style={{marginTop:28,padding:'20px 24px',background:T.panel,border:`1px solid ${T.line}`,borderRadius:12,textAlign:'center'}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:18,color:T.cream,marginBottom:6}}>Publish your template</div>
        <div style={{fontSize:13,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:14,maxWidth:420,margin:'0 auto 14px',lineHeight:1.6}}>Built a budget that works? Share it with the NKO community. Strong templates earn you an NKO Verified badge and exposure to studios and producers across Africa.</div>
        <Btn variant="outline" onClick={()=>window.open("mailto:hello@nko.film?subject=Template submission — NKO Marketplace","_blank")}>Submit a template →</Btn>
      </div>
    </div>
  );
}
  return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"Fraunces,serif",fontSize:26,color:T.cream}}>Marketplace</div>
        <div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:"Manrope,sans-serif"}}>Community budget templates from African producers. Apply to your production in one tap.</div>
        <div style={{marginTop:14}}><FS/></div>
      </div>
      {/* Search */}
      <Inp placeholder="Search templates…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:14}}/>
      {/* Category filter */}
      <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",marginBottom:20}}>
        <div style={{display:"flex",gap:6,paddingBottom:4,minWidth:"max-content"}}>
          {MKTCAT.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${cat===c?T.gold:T.line}`,background:cat===c?T.goldGlow:"transparent",color:cat===c?T.gold:T.dim,fontSize:12,fontFamily:"Manrope,sans-serif",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{c}</button>)}
        </div>
      </div>
      {/* Template grid */}
      {filtered.length===0?(
        <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:32,textAlign:"center"}}>
          <div style={{color:T.dim,fontFamily:"Manrope,sans-serif"}}>No templates match your search.</div>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
          {filtered.map(tpl=>{
            const total=tpl.items.reduce((s,i)=>s+lTot(i),0);
            const isApplied=applied===tpl.id;
            return(
              <div key={tpl.id} style={{background:T.panel,border:`1px solid ${isApplied?T.sage:T.line}`,borderRadius:10,padding:18,display:"flex",flexDirection:"column",gap:10}}>
                <div>
                  <div style={{fontFamily:"Fraunces,serif",fontSize:15,color:T.cream,marginBottom:3}}>{tpl.label}</div>
                  <div style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif"}}>{tpl.sub}</div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <Pill>{tpl.type.split("/")[0].trim()}</Pill>
                  <span style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif",display:"flex",alignItems:"center"}}>by {tpl.author}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:15,color:T.gold}}>₦{fmt(total)}</div>
                    <div style={{fontSize:10,color:T.faint,fontFamily:"Manrope,sans-serif"}}>{tpl.items.length} line items · {tpl.downloads} uses</div>
                  </div>
                  <Btn size="sm" variant={isApplied?"sage":"outline"} onClick={()=>{onApplyTemplate(tpl);setApplied(tpl.id);setTimeout(()=>setApplied(null),3000);}}>
                    {isApplied?"✓ Applied":"Use template"}
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{marginTop:24,padding:"16px 20px",background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,textAlign:"center"}}>
        <div style={{fontFamily:"Fraunces,serif",fontSize:16,color:T.cream,marginBottom:6}}>Share your template</div>
        <div style={{fontSize:12,color:T.dim,fontFamily:"Manrope,sans-serif",marginBottom:12}}>Built a budget that works? Submit it to the community marketplace.</div>
        <Btn variant="outline" size="sm" onClick={()=>window.open("mailto:hello@nko.film?subject=Template submission","_blank")}>Submit a template →</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════ */
function NewProjectModal({onClose,onCreate}){
  const [name,setName]=useState(""); const [type,setType]=useState(PROJ_TYPES[0]); const [cur,setCur]=useState("NGN"); const [loading,setLoading]=useState(false);
  const [logo,setLogo]=useState(null); const logoRef=useRef();
  const pickLogo=async(e)=>{const f=e.target.files[0];if(f){const url=await readImageAsDataURL(f);setLogo(url);}};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,1,32,.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:100}}>
      <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:12,padding:26,width:"100%",maxWidth:400}}>
        <div style={{fontFamily:"Fraunces,serif",fontSize:20,color:T.cream,marginBottom:18}}>New production</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Inp placeholder="Production name" value={name} onChange={e=>setName(e.target.value)}/>
          <Sel value={type} onChange={e=>setType(e.target.value)} style={{width:"100%"}}>{PROJ_TYPES.map(t=><option key={t}>{t}</option>)}</Sel>
          <Sel value={cur} onChange={e=>setCur(e.target.value)} style={{width:"100%"}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}</Sel>
          {/* Production logo upload */}
          <div style={{border:`1px dashed ${T.line}`,borderRadius:8,padding:14,textAlign:"center",cursor:"pointer",background:T.hi}} onClick={()=>logoRef.current.click()}>
            <input ref={logoRef} type="file" accept="image/*" style={{display:"none"}} onChange={pickLogo}/>
            {logo ? <img src={logo} style={{height:48,objectFit:"contain",display:"block",margin:"0 auto 6px"}}/> : <div style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif"}}>📷 Upload production logo (optional)</div>}
            {logo && <div style={{fontSize:10,color:T.goldDim,fontFamily:"Manrope,sans-serif"}}>Tap to change</div>}
          </div>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <Btn onClick={async()=>{if(!name.trim())return;setLoading(true);await onCreate({name:name.trim(),type,base_currency:cur,logo_url:logo||null});setLoading(false);}} style={{opacity:loading?.6:1}}>{loading?"Creating…":"Create"}</Btn>
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
function DashboardView({projects,budgetItems,advances,payees,currentId,onSelect,onCreate,onDelete}){
  const [modal,setModal]=useState(false);
  const [selected,setSelected]=useState(new Set());
  const [confirmDelete,setConfirmDelete]=useState(null); // single project to delete
  const [confirmMulti,setConfirmMulti]=useState(false); // multi-delete confirm
  const openAdv=advances.filter(a=>a.status!=="reconciled").length;
  const unpaid=payees.filter(p=>{const paid=(p.payments||[]).reduce((s,x)=>s+x.amount,0);return paid<p.agreed_fee;}).length;
  const toggleSelect=(id)=>{const n=new Set(selected);n.has(id)?n.delete(id):n.add(id);setSelected(n);};
  const selectAll=()=>setSelected(new Set(projects.map(p=>p.id)));
  const clearSel=()=>setSelected(new Set());
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

      {/* Confirm single delete */}
      {confirmDelete&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,1,32,.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:100}}>
          <div style={{background:T.panel,border:`1px solid ${T.coral}`,borderRadius:12,padding:26,width:"100%",maxWidth:380,textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:12}}>🗑️</div>
            <div style={{fontFamily:"Fraunces,serif",fontSize:18,color:T.cream,marginBottom:8}}>Delete production?</div>
            <div style={{fontSize:13,color:T.dim,fontFamily:"Manrope,sans-serif",marginBottom:20,lineHeight:1.6}}>
              <strong style={{color:T.cream}}>{confirmDelete.name}</strong> and all its budget lines, advances and payments will be permanently deleted.
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              <Btn variant="danger" onClick={async()=>{await onDelete([confirmDelete.id]);setConfirmDelete(null);}}>Yes, delete</Btn>
              <Btn variant="ghost" onClick={()=>setConfirmDelete(null)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Confirm multi delete */}
      {confirmMulti&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,1,32,.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:100}}>
          <div style={{background:T.panel,border:`1px solid ${T.coral}`,borderRadius:12,padding:26,width:"100%",maxWidth:380,textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:12}}>🗑️</div>
            <div style={{fontFamily:"Fraunces,serif",fontSize:18,color:T.cream,marginBottom:8}}>Delete {selected.size} productions?</div>
            <div style={{fontSize:13,color:T.dim,fontFamily:"Manrope,sans-serif",marginBottom:20,lineHeight:1.6}}>
              This will permanently delete all selected productions and their data.
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              <Btn variant="danger" onClick={async()=>{await onDelete([...selected]);setSelected(new Set());setConfirmMulti(false);}}>Yes, delete all</Btn>
              <Btn variant="ghost" onClick={()=>setConfirmMulti(false)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      {projects.length===0?(
        <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:12,padding:44,textAlign:"center"}}>
          <div style={{fontSize:42,marginBottom:12}}>🎬</div>
          <div style={{fontFamily:"Fraunces,serif",fontSize:22,color:T.cream,marginBottom:8}}>No productions yet</div>
          <div style={{color:T.dim,fontSize:14,marginBottom:22,maxWidth:360,margin:"0 auto 22px",fontFamily:"Manrope,sans-serif",lineHeight:1.6}}>Create a production, upload your script, and let NKO auto-generate your budget.</div>
          <Btn onClick={()=>setModal(true)}>Create your first production</Btn>
        </div>
      ):(
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <div style={{fontFamily:"Fraunces,serif",fontSize:19,color:T.cream}}>Productions</div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              {selected.size>0&&(
                <>
                  <span style={{fontSize:12,color:T.dim,fontFamily:"Manrope,sans-serif"}}>{selected.size} selected</span>
                  <Btn size="sm" variant="ghost" onClick={clearSel}>Clear</Btn>
                  <Btn size="sm" variant="danger" onClick={()=>setConfirmMulti(true)}>🗑️ Delete selected</Btn>
                </>
              )}
              {selected.size===0&&projects.length>1&&<Btn size="sm" variant="ghost" onClick={selectAll}>Select all</Btn>}
              <Btn onClick={()=>setModal(true)}>+ New</Btn>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
            {projects.map(p=>{
              const pi=budgetItems.filter(i=>i.project_id===p.id);
              const totals={};pi.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
              const open=advances.filter(a=>a.project_id===p.id&&a.status!=="reconciled").length;
              const active=p.id===currentId;
              const isSelected=selected.has(p.id);
              return(
                <div key={p.id} style={{background:isSelected?'rgba(224,107,82,0.08)':active?T.hi:T.panel,border:`1px solid ${isSelected?T.coral:active?T.gold:T.line}`,borderRadius:10,padding:18,position:"relative"}}>
                  {/* Checkbox */}
                  <button onClick={(e)=>{e.stopPropagation();toggleSelect(p.id);}} style={{position:"absolute",top:12,right:12,width:18,height:18,borderRadius:4,border:`2px solid ${isSelected?T.coral:T.faint}`,background:isSelected?T.coral:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {isSelected&&<span style={{color:T.ink,fontSize:11,fontWeight:700,lineHeight:1}}>✓</span>}
                  </button>
                  {/* Card content — click to select project */}
                  <button onClick={()=>onSelect(p.id)} style={{background:"none",border:"none",cursor:"pointer",textAlign:"left",width:"100%",paddingRight:28}}>
                    <div style={{marginBottom:10}}>
                      <div style={{fontFamily:"Fraunces,serif",fontSize:15,color:T.cream}}>{p.name}</div>
                      <div style={{fontSize:10,color:T.goldDim,fontFamily:"Manrope,sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:2}}>{p.type}</div>
                    </div>
                    <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:13,color:T.cream,marginBottom:8}}>{Object.entries(totals).length===0?<span style={{color:T.faint}}>No budget yet</span>:Object.entries(totals).map(([c,a])=><div key={c}>{sym(c)}{fmt(a)}</div>)}</div>
                    <div style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif"}}>{pi.length} lines · {open} open advances</div>
                  </button>
                  {/* Delete button */}
                  <button onClick={(e)=>{e.stopPropagation();setConfirmDelete(p);}} style={{position:"absolute",bottom:12,right:12,background:"none",border:"none",cursor:"pointer",color:T.faint,fontSize:14}} title="Delete production">🗑️</button>
                </div>
              );
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

export { FS,Pill,StatCard,Inp,Sel,Btn,useIsMobile,useCountUp,recoverScenes,
  AuthContext,AuthProvider,useAuth,AuthScreen,NAV,Sidebar,TopBar,MobileNav,
  ACCENT_COLORS,EXPENSE_CATS,CreatorCard,MarketplaceView,NewProjectModal,DashboardView };
