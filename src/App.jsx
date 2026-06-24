import { useState, useEffect, useRef, useCallback } from 'react';
import { TEMPLATES,T,BREAKDOWN_SYS,BREAKDOWN_PROMPT,
  today,fmt,sym,lTot,readFileAsBase64,readFileAsText,callClaude,
  supabase } from './data.js';
import { FS,Pill,Inp,Sel,Btn,useIsMobile,recoverScenes,
  AuthProvider,useAuth,AuthScreen,NAV,Sidebar,TopBar,MobileNav,
  MarketplaceView,NewProjectModal,DashboardView } from './views1.jsx';
import { ScriptUploader,BrandPanel,BudgetsView,ReconView,AdvanceCard,PaymentsView,AIView } from './views2.jsx';
function SceneCard({scene,onDelete,isMobile,index=0}){
  const [open,setOpen]=useState(false);
  const intColor=scene.intExt==='INT'?T.sapphire:T.sage;
  const dnColor=scene.dayNight==='DAY'?T.gold:scene.dayNight==='NIGHT'?'#7B68EE':T.goldDim;
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,overflow:'hidden',marginBottom:10,animation:'sceneFadeIn 0.35s ease forwards',animationDelay:`${Math.min(index*60,400)}ms`,opacity:0}}>
      <style>{'@keyframes sceneFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}'}</style>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 14px',display:'flex',alignItems:'flex-start',gap:10,textAlign:'left'}}>
        <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:isMobile?16:18,color:T.gold,fontWeight:700,minWidth:36,flexShrink:0,paddingTop:2}}>
          {scene.sceneNumber||'?'}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'Fraunces,serif',fontSize:isMobile?13:14,color:T.cream,wordBreak:'break-word'}}>{scene.heading||'No heading'}</div>
          {scene.synopsis&&<div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif',marginTop:2,lineHeight:1.4}}>{scene.synopsis.slice(0,isMobile?60:80)}{scene.synopsis.length>(isMobile?60:80)?'…':''}</div>}
        </div>
        <div style={{display:'flex',gap:4,alignItems:'center',flexShrink:0,flexWrap:'wrap',justifyContent:'flex-end',maxWidth:isMobile?90:120}}>
          <span style={{fontSize:9,fontWeight:700,padding:'2px 5px',borderRadius:4,background:intColor,color:T.ink}}>{scene.intExt||'INT'}</span>
          <span style={{fontSize:9,fontWeight:700,padding:'2px 5px',borderRadius:4,background:dnColor,color:T.ink}}>{scene.dayNight||'DAY'}</span>
          {!isMobile&&<span style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{scene.pageCount||0}p</span>}
          <span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span>
        </div>
      </button>
      {open&&(
        <div style={{borderTop:`1px solid ${T.line}`}}>
          {BREAKDOWN_CATS.map(cat=>{
            const val=scene[cat.key];
            if(!val||(Array.isArray(val)&&val.length===0)) return null;
            const display=Array.isArray(val)?val.join(' · '):val;
            return(
              <div key={cat.key} style={{display:'flex',borderBottom:`1px solid ${T.line}`,minHeight:36,flexDirection:isMobile?'column':'row'}}>
                <div style={{width:isMobile?'100%':160,flexShrink:0,background:T.hi,padding:isMobile?'6px 14px 2px':'8px 14px',fontSize:10,color:T.goldDim,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',fontFamily:'Manrope,sans-serif',display:'flex',alignItems:'center',gap:6}}>
                  <span>{cat.icon}</span>{cat.label}
                </div>
                <div style={{flex:1,padding:'8px 14px',fontSize:isMobile?12:13,color:T.cream,fontFamily:'Manrope,sans-serif',display:'flex',alignItems:'center',flexWrap:'wrap'}}>
                  {Array.isArray(val)?(
                    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                      {val.map((v,i)=><span key={i} style={{background:T.ink,border:`1px solid ${T.line}`,borderRadius:4,padding:'2px 8px',fontSize:11}}>{v}</span>)}
                    </div>
                  ):display}
                </div>
              </div>
            );
          })}
          <div style={{padding:'8px 16px',display:'flex',gap:10}}>
            <button onClick={()=>onDelete(scene.id)} style={{color:T.coral,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>Delete scene</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Add scene manually */
function AddSceneForm({onSave,onCancel}){
  const [f,setF]=useState({sceneNumber:'',heading:'',intExt:'INT',dayNight:'DAY',synopsis:'',pageCount:'1',cast:'',extras:'',location:'',props:'',vehicles:'',wardrobe:'',hairMakeup:'',specialEquip:'',vfxSfx:'',sound:'',notes:''});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const save=()=>{
    const scene={
      ...f,pageCount:Number(f.pageCount)||1,
      cast:f.cast.split(',').map(x=>x.trim()).filter(Boolean),
      props:f.props.split(',').map(x=>x.trim()).filter(Boolean),
      vehicles:f.vehicles.split(',').map(x=>x.trim()).filter(Boolean),
      wardrobe:f.wardrobe.split(',').map(x=>x.trim()).filter(Boolean),
      specialEquip:f.specialEquip.split(',').map(x=>x.trim()).filter(Boolean),
    };
    onSave(scene);
  };
  return(
    <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:20,marginBottom:16}}>
      <div style={{fontFamily:'Fraunces,serif',fontSize:16,color:T.cream,marginBottom:14}}>Add scene breakdown</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Inp placeholder="Scene number (e.g. 12)" value={f.sceneNumber} onChange={e=>s('sceneNumber',e.target.value)}/>
        <Inp placeholder="Page count (e.g. 1.5)" type="number" value={f.pageCount} onChange={e=>s('pageCount',e.target.value)}/>
        <Sel value={f.intExt} onChange={e=>s('intExt',e.target.value)} style={{width:'100%'}}>
          <option value="INT">INT</option><option value="EXT">EXT</option><option value="INT/EXT">INT/EXT</option>
        </Sel>
        <Sel value={f.dayNight} onChange={e=>s('dayNight',e.target.value)} style={{width:'100%'}}>
          <option value="DAY">DAY</option><option value="NIGHT">NIGHT</option><option value="DUSK">DUSK</option><option value="DAWN">DAWN</option>
        </Sel>
        <Inp placeholder="Scene heading (e.g. INT. MARKET - DAY)" value={f.heading} onChange={e=>s('heading',e.target.value)} style={{gridColumn:'span 2'}}/>
        <Inp placeholder="Synopsis — what happens in this scene" value={f.synopsis} onChange={e=>s('synopsis',e.target.value)} style={{gridColumn:'span 2'}}/>
        <Inp placeholder="Location (specific place)" value={f.location} onChange={e=>s('location',e.target.value)} style={{gridColumn:'span 2'}}/>
        <Inp placeholder="Cast (comma separated: Ada, Emeka, Vendor)" value={f.cast} onChange={e=>s('cast',e.target.value)} style={{gridColumn:'span 2'}}/>
        <Inp placeholder="Extras / background talent" value={f.extras} onChange={e=>s('extras',e.target.value)} style={{gridColumn:'span 2'}}/>
        <Inp placeholder="Props (comma separated: basket, phone, money)" value={f.props} onChange={e=>s('props',e.target.value)} style={{gridColumn:'span 2'}}/>
        <Inp placeholder="Vehicles (comma separated: okada, Hilux, bus)" value={f.vehicles} onChange={e=>s('vehicles',e.target.value)}/>
        <Inp placeholder="Wardrobe (comma separated)" value={f.wardrobe} onChange={e=>s('wardrobe',e.target.value)}/>
        <Inp placeholder="Hair & make-up notes" value={f.hairMakeup} onChange={e=>s('hairMakeup',e.target.value)}/>
        <Inp placeholder="Special equipment (comma separated)" value={f.specialEquip} onChange={e=>s('specialEquip',e.target.value)}/>
        <Inp placeholder="VFX / SFX requirements" value={f.vfxSfx} onChange={e=>s('vfxSfx',e.target.value)}/>
        <Inp placeholder="Sound / music cues" value={f.sound} onChange={e=>s('sound',e.target.value)}/>
        <Inp placeholder="Notes / special requirements" value={f.notes} onChange={e=>s('notes',e.target.value)} style={{gridColumn:'span 2'}}/>
      </div>
      <div style={{display:'flex',gap:8,marginTop:12}}>
        <Btn onClick={save}>Save scene</Btn>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  );
}

/* AI script breakdown uploader — with browser notifications */
function BreakdownUploader({project,onApply}){
  const [state,setState]=useState('idle');
  const [err,setErr]=useState('');
  const [progress,setProgress]=useState('');
  const [notifPerm,setNotifPerm]=useState(()=>typeof Notification!=='undefined'?Notification.permission:'unsupported');
  const resultRef=useRef(null);
  const fileRef=useRef();

  const askNotif=async()=>{
    if(typeof Notification==='undefined'||Notification.permission!=='default')return;
    const p=await Notification.requestPermission();
    setNotifPerm(p);
  };

  const sendNotif=(count)=>{
    if(typeof Notification==='undefined'||Notification.permission!=='granted')return;
    try{new Notification('NKO Breakdown Complete',{body:`${count} scenes extracted. Tap to view.`});}catch{}
  };

  useEffect(()=>{
    const h=()=>{
      if(document.visibilityState==='visible'&&resultRef.current){
        onApply(resultRef.current);resultRef.current=null;setState('done');
      }
    };
    document.addEventListener('visibilitychange',h);
    return()=>document.removeEventListener('visibilitychange',h);
  },[]);

  const process=async(file)=>{
    const isPDF=file.type==='application/pdf';
    const isTxt=file.type==='text/plain'||file.name.endsWith('.txt')||file.name.endsWith('.fdx');
    if(!isPDF&&!isTxt){setErr('Upload a PDF, TXT or FDX file.');setState('error');return;}
    await askNotif();
    setState('reading');setErr('');setProgress('Reading script…');
    try{
      const fileSizeKB=file.size/1024;
      const episodeMode=isPDF?(fileSizeKB>200):(fileSizeKB>50);
      const maxEntries=episodeMode?20:25;
      setProgress(episodeMode?`Large script — episode mode (max ${maxEntries} episodes)`:`Extracting up to ${maxEntries} scenes…`);
      let userContent;
      if(isPDF){const b64=await readFileAsBase64(file);userContent=[{type:'document',source:{type:'base64',media_type:'application/pdf',data:b64}},{type:'text',text:BREAKDOWN_PROMPT(episodeMode,maxEntries)}];}
      else{const txt=await readFileAsText(file);userContent=[{type:'text',text:`Script:\n\n${txt.slice(0,80000)}\n\n${BREAKDOWN_PROMPT(episodeMode,maxEntries)}`}];}
      setState('analyzing');setProgress('Analyzing your script…');
      const raw=await callClaude([{role:'user',content:userContent}],BREAKDOWN_SYS);
      const scenes=recoverScenes(raw);
      if(scenes.length===0)throw new Error('No scenes found — try uploading as a TXT file');
      sendNotif(scenes.length);
      // Save to localStorage — result survives screen lock, never lost
      try{localStorage.setItem(`nko_pending_breakdown_${project?.id}`,JSON.stringify({scenes,ts:Date.now()}));}catch{}
      onApply(scenes);setState('done');setProgress('');
    }catch(e){
      setErr(e.message.includes('fetch')?'Connection interrupted — screen may have locked. Try again.':e.message);
      setState('error');
    }
  };

  const onPick=e=>{const f=e.target.files[0];if(f)process(f);};
  const hasNotif=typeof Notification!=='undefined'&&notifPerm!=='unsupported';

  return(
    <div style={{marginBottom:18}}>
      {state==='analyzing'&&(
        <div style={{background:notifPerm==='granted'?'rgba(82,176,122,0.1)':' rgba(254,237,97,0.1)',border:`1px solid ${notifPerm==='granted'?T.sage:T.goldDim}`,borderRadius:8,padding:'10px 14px',marginBottom:10}}>
          {notifPerm==='granted'
            ?<div style={{fontSize:12,color:T.sage,fontFamily:'Manrope,sans-serif'}}>🔔 Notifications on — you can switch apps. You will be alerted when breakdown is done.</div>
            :<div style={{fontSize:12,color:T.gold,fontFamily:'Manrope,sans-serif'}}>⚠️ Keep this screen open during analysis. Allow notifications next time to switch apps freely.</div>
          }
        </div>
      )}
      <div style={{background:T.hi,border:`2px dashed ${state==='analyzing'?T.gold:state==='done'?T.sage:T.line}`,borderRadius:10,padding:'20px',textAlign:'center',cursor:(state==='idle'||state==='error')?'pointer':'default'}} onClick={()=>(state==='idle'||state==='error')&&fileRef.current.click()}>
        <input ref={fileRef} type="file" accept=".pdf,.txt,.fdx" style={{display:'none'}} onChange={onPick}/>
        {state==='idle'&&(
          <>
            <div style={{fontSize:28,marginBottom:8}}>📋</div>
            <div style={{fontFamily:'Fraunces,serif',fontSize:16,color:T.cream,marginBottom:4}}>AI Script Breakdown</div>
            <div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:10,lineHeight:1.5}}>Upload your script — cast, props, location, vehicles, wardrobe per scene</div>
            {hasNotif&&notifPerm==='default'&&<div style={{fontSize:11,color:T.goldDim,fontFamily:'Manrope,sans-serif',marginBottom:10,padding:'6px 12px',background:T.ink,borderRadius:6,border:`1px solid ${T.line}`}}>💡 Allow notifications so you can switch apps during analysis</div>}
            {hasNotif&&notifPerm==='granted'&&<div style={{fontSize:11,color:T.sage,fontFamily:'Manrope,sans-serif',marginBottom:10}}>🔔 Notifications on — safe to switch apps during analysis</div>}
            {hasNotif&&notifPerm==='denied'&&<div style={{fontSize:11,color:T.coral,fontFamily:'Manrope,sans-serif',marginBottom:10}}>⚠️ Notifications blocked — keep screen on during analysis</div>}
            <Btn variant="script" size="sm" onClick={e=>{e.stopPropagation();fileRef.current.click();}}>Choose script</Btn>
          </>
        )}
        {state==='reading'&&<><div style={{fontSize:28,marginBottom:8}}>📖</div><div style={{color:T.cream,fontFamily:'Manrope,sans-serif',marginBottom:4}}>Reading script…</div><div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{progress}</div></>}
        {state==='analyzing'&&(
          <>
            <div style={{fontSize:28,marginBottom:8}}>🤖</div>
            <div style={{fontFamily:'Fraunces,serif',fontSize:16,color:T.cream,marginBottom:6}}>Analyzing…</div>
            <div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:10}}>{progress}</div>
            <div style={{height:3,background:T.ink,borderRadius:2,overflow:'hidden',margin:'0 auto',maxWidth:200}}>
              <div style={{height:'100%',background:T.gold,borderRadius:2,animation:'pulse 1.5s ease-in-out infinite',width:'60%'}}/>
            </div>
            <style>{`@keyframes pulse{0%,100%{opacity:0.4;transform:scaleX(0.8)}50%{opacity:1;transform:scaleX(1)}}`}</style>
          </>
        )}
        {state==='done'&&(
          <>
            <div style={{fontSize:28,marginBottom:8}}>✅</div>
            <div style={{fontFamily:'Fraunces,serif',fontSize:16,color:T.sage,marginBottom:4}}>Breakdown complete</div>
            <button onClick={e=>{e.stopPropagation();setState('idle');setErr('');setProgress('');}} style={{color:T.gold,fontSize:12,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif',fontWeight:700}}>Analyze another →</button>
          </>
        )}
        {state==='error'&&(
          <>
            <div style={{fontSize:28,marginBottom:8}}>⚠️</div>
            <div style={{fontSize:12,color:T.coral,fontFamily:'Manrope,sans-serif',marginBottom:8,lineHeight:1.5}}>{err}</div>
            <Btn variant="ghost" size="sm" onClick={e=>{e.stopPropagation();setState('idle');setErr('');setProgress('');}}>Try again</Btn>
          </>
        )}
      </div>
    </div>
  );
}

/* Main Breakdown View */
function BreakdownView({project,scenes,onAddScene,onDeleteScene}){
  const [showForm,setShowForm]=useState(false);
  const [filter,setFilter]=useState('ALL');
  const [search,setSearch]=useState('');
  const isMobile=useIsMobile();
  if(!project)return <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>Select a production first.</div></div>;
  const pScenes=scenes.filter(s=>s.project_id===project.id);
  const filtered=pScenes.filter(s=>{
    const matchFilter=filter==='ALL'||(filter==='INT'&&s.intExt==='INT')||(filter==='EXT'&&s.intExt==='EXT')||(filter==='DAY'&&s.dayNight==='DAY')||(filter==='NIGHT'&&s.dayNight==='NIGHT');
    const matchSearch=!search||s.heading?.toLowerCase().includes(search.toLowerCase())||s.synopsis?.toLowerCase().includes(search.toLowerCase())||s.location?.toLowerCase().includes(search.toLowerCase());
    return matchFilter&&matchSearch;
  });
  const brand=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');
  return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:isMobile?22:26,color:T.cream}}>Breakdown — {project.name}</div>
        <div style={{fontSize:13,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Scene-by-scene: cast, props, location, vehicles, wardrobe and more.</div>
        <div style={{marginTop:14}}><FS/></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:20}}>
        <StatCard label="Total scenes" value={pScenes.length} sub="in breakdown"/>
        <StatCard label="INT scenes" value={pScenes.filter(s=>s.intExt==='INT').length} sub="interior"/>
        <StatCard label="EXT scenes" value={pScenes.filter(s=>s.intExt==='EXT').length} sub="exterior"/>
        <StatCard label="Night scenes" value={pScenes.filter(s=>s.dayNight==='NIGHT').length} sub="night shoot" accent={pScenes.filter(s=>s.dayNight==='NIGHT').length>0?T.coral:T.sage}/>
      </div>
      <BreakdownUploader project={project} onApply={newScenes=>{newScenes.forEach(sc=>onAddScene({...sc,project_id:project.id}));}}/>

      {/* Filter bar — horizontally scrollable on mobile */}
      <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch',marginBottom:12}}>
        <div style={{display:'flex',gap:6,paddingBottom:4,minWidth:'max-content'}}>
          {['ALL','INT','EXT','DAY','NIGHT'].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${filter===f?T.gold:T.line}`,background:filter===f?T.goldGlow:'transparent',color:filter===f?T.gold:T.dim,fontSize:12,fontFamily:'Manrope,sans-serif',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>{f}</button>)}
        </div>
      </div>

      {/* Action buttons — stack on mobile */}
      <div style={{display:'flex',flexDirection:isMobile?'column':'row',gap:8,marginBottom:14}}>
        <Inp placeholder="Search scenes…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,fontSize:12}}/>
        <div style={{display:'flex',gap:8}}>
          {pScenes.length>0&&<Btn size="sm" variant="outline" onClick={()=>downloadBreakdownPDF(filtered,project,brand)} style={{flex:isMobile?1:undefined}}>📄 Export PDF</Btn>}
          <Btn size="sm" onClick={()=>setShowForm(!showForm)} style={{flex:isMobile?1:undefined}}>+ Add scene</Btn>
        </div>
      </div>

      {showForm&&<AddSceneForm onSave={sc=>{onAddScene({...sc,project_id:project.id});setShowForm(false);}} onCancel={()=>setShowForm(false)}/>}
      {filtered.length===0?<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:32,textAlign:'center'}}><div style={{color:T.dim,fontSize:14,fontFamily:'Manrope,sans-serif'}}>{pScenes.length===0?'No scenes yet. Upload your script or add scenes manually.':'No scenes match your filter.'}</div></div>:filtered.map((sc,i)=><SceneCard key={sc.id||sc.sceneNumber} scene={sc} onDelete={onDeleteScene} isMobile={isMobile} index={i}/>)}
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
  const [scenes,setScenes]=useState([]);
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

  const deleteProjects=async(ids)=>{
    for(const id of ids){
      await supabase.from("projects").delete().eq("id",id);
    }
    setProjects(prev=>prev.filter(p=>!ids.includes(p.id)));
    setBudgetItems(prev=>prev.filter(i=>!ids.includes(i.project_id)));
    setAdvances(prev=>prev.filter(a=>!ids.includes(a.project_id)));
    setPayees(prev=>prev.filter(p=>!ids.includes(p.project_id)));
    setScenes(prev=>prev.filter(s=>!ids.includes(s.project_id)));
    if(ids.includes(currentId)){setCurrentId(null);setView("dashboard");}
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
    // Also apply bundled archetypal scenes if template has them
    if(tpl.scenes&&tpl.scenes.length>0){
      const sc=tpl.scenes.map(s=>({...s,project_id:currentId,id:Math.random().toString(36).slice(2,10)}));
      setScenes(prev=>[...prev,...sc]);
    }
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
        <TopBar view={view} setView={setView} projects={projects} currentId={currentId} onSelect={id=>setCurrentId(id||null)} onCreate={()=>setView("dashboard")}/>
        <main style={{flex:1,overflowY:"auto",padding:"24px 20px 100px"}}>
          {view==="dashboard"&&<DashboardView projects={projects} budgetItems={budgetItems} advances={advances} payees={payees} currentId={currentId} onSelect={id=>{setCurrentId(id);setView("budgets");}} onCreate={createProject} onDelete={deleteProjects}/>}
          {view==="budgets"&&<BudgetsView project={project} items={pBudget} advances={pAdvances} reconEntries={reconEntries.filter(e=>pAdvances.some(a=>a.id===e.advance_id))} onAdd={addBudgetItem} onUpdate={updateBudgetItem} onRemove={removeBudgetItem} onApplyTemplate={applyTemplate} onApplyScript={applyScriptBudget}/>}
          {view==="breakdown"&&<BreakdownView project={project} scenes={scenes} onAddScene={sc=>{const newSc={...sc,id:Math.random().toString(36).slice(2,9)};setScenes(prev=>[...prev,newSc]);}} onDeleteScene={id=>setScenes(prev=>prev.filter(s=>s.id!==id))}/>}
          {view==="recon"&&<ReconView project={project} advances={pAdvances} reconEntries={reconEntries.filter(e=>pAdvances.some(a=>a.id===e.advance_id))} onAddAdvance={addAdvance} onUpdateAdvance={updateAdvance} onAddEntry={addReconEntry} onRemoveEntry={removeReconEntry}/>}
          {view==="payments"&&<PaymentsView project={project} payees={payees} onAddPayee={addPayee} onAddPayment={addPayment} onRemovePayment={removePayment}/>}
          {view==="market"&&<MarketplaceView onApplyTemplate={async(tpl)=>{if(currentId){await applyTemplate(tpl);setView("budgets");}else{alert("Select a production first");}}}/>}
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
