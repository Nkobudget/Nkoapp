import { useState, useEffect, useRef, useCallback } from 'react';
import { CURRENCIES,DEPTS,UNITS,PROJ_TYPES,PAY_METHODS,TEMPLATES,T,
  CHAT_SYS,SCRIPT_SYS,SCRIPT_PROMPT,BREAKDOWN_SYS,BREAKDOWN_PROMPT,QUICK,
  today,fmt,sym,lTot,readFileAsBase64,readFileAsText,readImageAsDataURL,callClaude,
  supabase } from './data.js';
import { FS,Pill,StatCard,Inp,Sel,Btn,useIsMobile,useCountUp,recoverScenes,
  ACCENT_COLORS,EXPENSE_CATS } from './views1.jsx';
function ScriptUploader({project,onApplyBudget}){
  const [state,setState]=useState("idle"); const [err,setErr]=useState(""); const [result,setResult]=useState(null); const [dragOver,setDragOver]=useState(false);
  const [notifPerm,setNotifPerm]=useState(()=>typeof Notification!=='undefined'?Notification.permission:'unsupported');
  const resultRef=useRef(null);
  const fileRef=useRef();
  const STORAGE_KEY=`nko_pending_budget_${project?.id}`;

  // On mount: check if there's a pending result from a previous session
  useEffect(()=>{
    try{
      const pending=localStorage.getItem(STORAGE_KEY);
      if(pending){
        const {result:r,ts}=JSON.parse(pending);
        if(Date.now()-ts<600000){setResult(r);setState('done');}
        localStorage.removeItem(STORAGE_KEY);
      }
    }catch{}
  },[project?.id]);

  // When page becomes visible again, check localStorage
  useEffect(()=>{
    const h=()=>{
      if(document.visibilityState==='visible'){
        try{
          const pending=localStorage.getItem(STORAGE_KEY);
          if(pending){
            const {result:r}=JSON.parse(pending);
            setResult(r);setState('done');
            localStorage.removeItem(STORAGE_KEY);
          }
        }catch{}
      }
    };
    document.addEventListener('visibilitychange',h);
    return()=>document.removeEventListener('visibilitychange',h);
  },[project?.id]);

  const processFile=async(file)=>{
    const isPDF=file.type==="application/pdf";
    const isTxt=file.type==="text/plain"||file.name.endsWith(".txt")||file.name.endsWith(".fdx");
    if(!isPDF&&!isTxt){setErr("Upload a PDF, TXT or FDX script file.");setState("error");return;}
    await askNotif();
    setState("reading");setErr("");
    try{
      let userContent;
      if(isPDF){const b64=await readFileAsBase64(file);userContent=[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:SCRIPT_PROMPT(project.base_currency)}];}
      else{const txt=await readFileAsText(file);userContent=[{type:"text",text:`Script:\n\n${txt}\n\n${SCRIPT_PROMPT(project.base_currency)}`}];}
      setState("analyzing");
      const raw=await callClaude([{role:"user",content:userContent}],SCRIPT_SYS);
      let clean=raw.replace(/```json/gi,'').replace(/```/g,'').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g,'').trim();
      const start=clean.indexOf('{');const end=clean.lastIndexOf('}');
      if(start===-1||end===-1)throw new Error("No JSON found in response");
      clean=clean.slice(start,end+1);
      const parsed=JSON.parse(clean);
      sendNotif(`Budget generated for ${project.name} — tap to view`);
      if(document.visibilityState==='hidden'){
        // Save to localStorage so result survives screen lock
        try{localStorage.setItem(STORAGE_KEY,JSON.stringify({result:parsed,ts:Date.now()}));}catch{}
        setState('done'); // still show done state — result waiting in localStorage
      }else{setResult(parsed);setState("done");}
    }catch(e){setErr(`Analysis failed: ${e.message}`);setState("error");}
  };
  const onDrop=useCallback(e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)processFile(f);},[project]);
  const onPick=e=>{const f=e.target.files[0];if(f)processFile(f);};
  const hasNotif=typeof Notification!=='undefined'&&notifPerm!=='unsupported';
  return(
    <>
      <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={onDrop} onClick={()=>(state==="idle"||state==="error")&&fileRef.current.click()} style={{border:`2px dashed ${dragOver?T.sapphire:state==="analyzing"?T.goldMid:T.line}`,borderRadius:10,padding:"24px 20px",textAlign:"center",background:dragOver?`rgba(74,144,217,0.06)`:T.hi,cursor:(state==="idle"||state==="error")?"pointer":"default",marginBottom:18}}>
        <input ref={fileRef} type="file" accept=".pdf,.txt,.fdx" style={{display:"none"}} onChange={onPick}/>
        {state==="idle"&&<><div style={{fontSize:28,marginBottom:8}}>📄</div><div style={{fontFamily:"Fraunces,serif",fontSize:16,color:T.cream,marginBottom:4}}>Upload your script</div><div style={{fontSize:12,color:T.dim,fontFamily:"Manrope,sans-serif",marginBottom:8}}>Drop a PDF, TXT or FDX — NKO reads it and auto-builds your budget</div>{hasNotif&&notifPerm==='granted'&&<div style={{fontSize:11,color:T.sage,fontFamily:"Manrope,sans-serif",marginBottom:8}}>🔔 Notifications on — safe to switch apps</div>}{hasNotif&&notifPerm==='default'&&<div style={{fontSize:11,color:T.goldDim,fontFamily:"Manrope,sans-serif",marginBottom:8}}>💡 Allow notifications to switch apps during analysis</div>}<Btn variant="script" size="sm">Choose script file</Btn></>}
        {state==="reading"&&<><div style={{fontSize:28,marginBottom:8}}>📖</div><div style={{fontFamily:"Manrope,sans-serif",fontSize:14,color:T.cream}}>Reading script…</div></>}
        {state==="analyzing"&&<><div style={{fontSize:28,marginBottom:8}}>🤖</div><div style={{fontFamily:"Fraunces,serif",fontSize:16,color:T.cream,marginBottom:4}}>Analyzing…</div><div style={{fontSize:12,color:notifPerm==='granted'?T.sage:T.coral,fontFamily:"Manrope,sans-serif"}}>{notifPerm==='granted'?'🔔 You will be notified when done — safe to switch apps':'⚠️ Keep this screen open during analysis'}</div></>}
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
/* Mobile detection hook */
function useIsMobile(bp=640){
  const [mob,setMob]=useState(()=>window.innerWidth<bp);
  useEffect(()=>{const h=()=>setMob(window.innerWidth<bp);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h);},[bp]);
  return mob;
}

/* CountUp — animates a number from 0 to target */
function useCountUp(target,duration=900,deps=[]){
  const [val,setVal]=useState(0);
  useEffect(()=>{
    if(!target)return;
    const start=Date.now();
    const tick=()=>{
      const p=Math.min(1,(Date.now()-start)/duration);
      const eased=1-Math.pow(1-p,3);
      setVal(Math.round(target*eased));
      if(p<1)requestAnimationFrame(tick);else setVal(target);
    };
    requestAnimationFrame(tick);
  },[target,...deps]);
  return val;
}

/* Robust JSON scene recovery — handles truncated responses */
function recoverScenes(raw){
  // Clean the string first
  let s=raw.replace(/```json/gi,'').replace(/```/g,'').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g,'').trim();
  // Find the array boundaries
  const arrStart=s.indexOf('[');
  if(arrStart===-1)return [];
  s=s.slice(arrStart);
  // Strategy 1: direct parse
  try{const r=JSON.parse(s);if(Array.isArray(r)&&r.length)return r;}catch{}
  // Strategy 2: scan for complete JSON objects individually
  const scenes=[];let depth=0;let start=-1;
  for(let i=0;i<s.length;i++){
    const c=s[i];
    if(c==='{'){if(depth===0)start=i;depth++;}
    else if(c==='}'){depth--;if(depth===0&&start!==-1){
      try{const obj=JSON.parse(s.slice(start,i+1));if(obj.sceneNumber||obj.heading)scenes.push(obj);}catch{}
      start=-1;
    }}
  }
  return scenes;
}

function DeptSection({dept,items,baseCurrency,onAdd,onUpdate,onRemove}){
  const [open,setOpen]=useState(true);
  const isMobile=useIsMobile();
  const totals={};items.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
  const ts=Object.entries(totals).map(([c,a])=>`${sym(c)}${fmt(a)}`).join(" · ")||"—";
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,overflow:"hidden",marginBottom:8}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,color:T.goldDim}}>{open?"▼":"▶"}</span><span style={{fontFamily:"Fraunces,serif",fontSize:15,color:T.cream}}>{dept}</span><span style={{fontSize:11,color:T.faint,fontFamily:"Manrope,sans-serif"}}>({items.length})</span></div>
        <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:13,color:T.gold}}>{ts}</span>
      </button>
      {open&&(
        <div style={{borderTop:`1px solid ${T.line}`,padding:"4px 12px 14px"}}>
          {isMobile?(
            /* ── Mobile layout: stacked fields ── */
            <>
              {items.map(item=>(
                <div key={item.id} style={{borderTop:`1px solid ${T.line}`,padding:"8px 0"}}>
                  <Inp value={item.description||""} placeholder="Description" onChange={e=>onUpdate(item.id,{description:e.target.value})} style={{marginBottom:6}}/>
                  <div style={{display:"grid",gridTemplateColumns:"52px 1fr 80px 52px 20px",gap:4,alignItems:"center"}}>
                    <Inp type="number" min="0" value={item.qty} onChange={e=>onUpdate(item.id,{qty:e.target.value})} style={{fontSize:12}}/>
                    <Sel value={item.unit} onChange={e=>onUpdate(item.id,{unit:e.target.value})} style={{width:"100%",fontSize:12}}>{UNITS.map(u=><option key={u}>{u}</option>)}</Sel>
                    <Inp type="number" min="0" value={item.rate} onChange={e=>onUpdate(item.id,{rate:e.target.value})} style={{fontFamily:"IBM Plex Mono,monospace",fontSize:12}}/>
                    <Sel value={item.currency} onChange={e=>onUpdate(item.id,{currency:e.target.value})} style={{width:"100%",fontSize:10}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</Sel>
                    <button onClick={()=>onRemove(item.id)} style={{color:T.faint,fontSize:18,cursor:"pointer",background:"none",border:"none",lineHeight:1}}>×</button>
                  </div>
                  <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:12,color:T.gold,textAlign:"right",marginTop:4}}>{sym(item.currency)}{fmt(lTot(item))}</div>
                </div>
              ))}
            </>
          ):(
            /* ── Desktop layout: grid ── */
            <>
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
            </>
          )}
          <button onClick={()=>onAdd(dept)} style={{marginTop:10,color:T.gold,fontSize:12,fontWeight:700,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif"}}>+ Add line</button>
        </div>
      )}
    </div>
  );
}

/* Brand Panel */
const ACCENT_COLORS=[
  {name:'Gold',value:'#FEED61'},{name:'Coral',value:'#E06B52'},{name:'Sage',value:'#52B07A'},
  {name:'Sapphire',value:'#4A90D9'},{name:'Lavender',value:'#9B7FD4'},{name:'Amber',value:'#F5A623'},
  {name:'Teal',value:'#2ABFBF'},{name:'Rose',value:'#E8527A'},
];
function BrandPanel({project,onSave}){
  const [open,setOpen]=useState(false);
  const [companyName,setCompanyName]=useState('');
  const [productionTitle,setProductionTitle]=useState('');
  const [logo,setLogo]=useState(null);
  const [accentColor,setAccentColor]=useState('#FEED61');
  const [saved,setSaved]=useState(false);
  const logoRef=useRef();

  useEffect(()=>{
    if(!project)return;
    try{
      const stored=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');
      setCompanyName(stored.companyName||'');
      setProductionTitle(stored.productionTitle||project.name||'');
      setLogo(stored.logo||project.logo_url||null);
      setAccentColor(stored.accentColor||'#FEED61');
      setSaved(!!(stored.companyName||stored.productionTitle||stored.logo));
    }catch{}
  },[project?.id]);

  const pickLogo=async(e)=>{const f=e.target.files[0];if(f){const url=await readImageAsDataURL(f);setLogo(url);}};
  const save=()=>{
    const brand={companyName,productionTitle,logo,accentColor};
    localStorage.setItem(`nko_brand_${project.id}`,JSON.stringify(brand));
    setSaved(true);setOpen(false);
    onSave&&onSave(brand);
  };
  const isSet=!!(companyName||productionTitle||logo);

  return(
    <div style={{background:T.panel,border:`1px solid ${isSet?accentColor:T.line}`,borderRadius:10,marginBottom:18,overflow:'hidden'}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {logo&&<img src={logo} style={{height:28,objectFit:'contain',borderRadius:3}}/>}
          <div style={{width:10,height:10,borderRadius:'50%',background:accentColor,flexShrink:0}}/>
          <span style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>Brand Panel</span>
          <span style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>Logo · Company · Title · Colour</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {saved&&isSet&&<span style={{fontSize:11,color:T.sage,fontFamily:'Manrope,sans-serif',fontWeight:700}}>Brand set ✓</span>}
          <span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span>
        </div>
      </button>
      {open&&(
        <div style={{borderTop:`1px solid ${T.line}`,padding:16,display:'flex',flexDirection:'column',gap:10}}>
          <div style={{border:`1px dashed ${T.line}`,borderRadius:8,padding:12,textAlign:'center',cursor:'pointer',background:T.hi}} onClick={()=>logoRef.current.click()}>
            <input ref={logoRef} type="file" accept="image/*" style={{display:'none'}} onChange={pickLogo}/>
            {logo?<img src={logo} style={{height:44,objectFit:'contain',display:'block',margin:'0 auto 6px'}}/>:<div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>📷 Upload company logo</div>}
            {logo&&<div style={{fontSize:10,color:T.goldDim,fontFamily:'Manrope,sans-serif'}}>Tap to change</div>}
          </div>
          <Inp placeholder="Company name (e.g. Zestyn Media)" value={companyName} onChange={e=>setCompanyName(e.target.value)}/>
          <Inp placeholder="Production title (e.g. My Wicked Mother in Law)" value={productionTitle} onChange={e=>setProductionTitle(e.target.value)}/>
          {/* Accent colour picker */}
          <div>
            <div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:8,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em'}}>Accent colour</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {ACCENT_COLORS.map(c=>(
                <button key={c.value} onClick={()=>setAccentColor(c.value)} title={c.name} style={{width:28,height:28,borderRadius:'50%',background:c.value,border:`3px solid ${accentColor===c.value?T.cream:'transparent'}`,cursor:'pointer',boxShadow:accentColor===c.value?`0 0 0 2px ${c.value}`:'none'}}/>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:8,marginTop:4}}>
            <Btn onClick={save} variant="sage">Save brand ✓</Btn>
            <Btn variant="ghost" onClick={()=>setOpen(false)}>Cancel</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function BudgetsView({project,items,advances,reconEntries,onAdd,onUpdate,onRemove,onApplyTemplate,onApplyScript}){
  const [showPicker,setShowPicker]=useState(false);
  const [brand,setBrand]=useState({});
  if(!project)return <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:"center"}}><div style={{color:T.dim,fontFamily:"Manrope,sans-serif"}}>Select a production first.</div></div>;
  const totals={};items.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:"Fraunces,serif",fontSize:26,color:T.cream}}>{project.name}</div><div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}><Pill>{project.type}</Pill><Pill color={T.goldDim}>{project.base_currency}</Pill></div><div style={{marginTop:14}}><FS/></div></div>
      <BrandPanel project={project} onSave={b=>setBrand(b)}/>
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
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:10,color:T.goldDim,letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:700,marginBottom:12,fontFamily:"Manrope,sans-serif"}}>Total budget</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:24}}>{Object.entries(totals).map(([c,a])=><div key={c}><div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:28,color:T.cream,fontWeight:500}}>{sym(c)}{fmt(a)}</div><div style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif"}}>{c}</div></div>)}</div>
            </div>
            <Btn variant="outline" size="sm" onClick={()=>downloadBudgetPDF(project,items,advances||[],reconEntries||[],brand)}>📄 Export budget PDF</Btn>
          </div>
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
const EXPENSE_CATS=['Feeding','Transport','Fuel','Location fee','Props & materials','Equipment hire','Accommodation','Communication','Labour','Miscellaneous'];

function AdvanceCard({advance,entries,onUpdate,onAddEntry,onRemoveEntry}){
  const [showEntry,setShowEntry]=useState(false);
  const [eDesc,setEDesc]=useState(""); const [eAmt,setEAmt]=useState(""); const [eDate,setEDate]=useState(today());
  const [eCat,setECat]=useState("Miscellaneous"); const [eRef,setERef]=useState("");
  const isMobile=useIsMobile();
  const spent=entries.reduce((s,e)=>s+(Number(e.amount)||0),0);
  const balance=advance.amount-spent;
  const pct=advance.amount>0?Math.min(100,(spent/advance.amount)*100):0;
  const sc=advance.status==="reconciled"?T.sage:balance<0?T.coral:balance===0?T.sage:T.gold;
  const sl=advance.status==="reconciled"?"Reconciled":balance<0?"Overspent":balance===0?"Balanced":"Open";
  const saveEntry=()=>{
    if(eDesc&&eAmt){
      onAddEntry({advance_id:advance.id,description:`[${eCat}] ${eDesc}${eRef?` · Ref: ${eRef}`:''}`,amount:Number(eAmt),date:eDate});
      setEDesc("");setEAmt("");setERef("");setECat("Miscellaneous");
    }
    setShowEntry(false);
  };
  return(
    <div style={{background:T.panel,border:`1px solid ${balance<0?T.coral:T.line}`,borderRadius:10,overflow:"hidden",marginBottom:12}}>
      <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:isMobile?"wrap":"nowrap"}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:"Fraunces,serif",fontSize:15,color:T.cream}}>{advance.recipient}{advance.dept&&<span style={{color:T.dim,fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:400}}> · {advance.dept}</span>}</div>
          <div style={{fontSize:11,color:T.dim,marginTop:2,fontFamily:"Manrope,sans-serif"}}>{advance.purpose||"No purpose"} · {advance.date_issued}</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:18,color:T.cream}}>{sym(advance.currency)}{fmt(advance.amount)}</div>
          <Pill color={sc}>{sl}</Pill>
        </div>
      </div>
      <div style={{padding:"0 16px 8px"}}>
        <div style={{height:6,borderRadius:3,background:T.ink,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:balance<0?T.coral:pct>80?T.gold:T.goldMid,transition:"width 0.3s"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.dim,marginTop:4,fontFamily:"Manrope,sans-serif"}}>
          <span>Spent {sym(advance.currency)}{fmt(spent)} · {Math.round(pct)}%</span>
          <span style={{color:balance<0?T.coral:balance===0?T.sage:T.dim}}>{balance<0?`⚠️ Over by ${sym(advance.currency)}${fmt(Math.abs(balance))}`:`Balance ${sym(advance.currency)}${fmt(balance)}`}</span>
        </div>
      </div>

      {/* Expense entries — audit trail */}
      {entries.length>0&&(
        <div style={{borderTop:`1px solid ${T.line}`,padding:"6px 16px"}}>
          <div style={{fontSize:10,color:T.faint,fontFamily:"Manrope,sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",padding:"6px 0 4px"}}>Expense log</div>
          {entries.map(en=>{
            const parts=en.description||"";
            const catMatch=parts.match(/^\[([^\]]+)\]/);
            const cat=catMatch?catMatch[1]:'';
            const desc=parts.replace(/^\[[^\]]+\]\s*/,'');
            return(
              <div key={en.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 0",borderBottom:`1px solid ${T.line}`,gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  {cat&&<span style={{fontSize:10,background:T.hi,color:T.gold,borderRadius:4,padding:"1px 6px",fontFamily:"Manrope,sans-serif",fontWeight:700,marginRight:6}}>{cat}</span>}
                  <span style={{color:T.cream,fontFamily:"Manrope,sans-serif",fontSize:13}}>{desc}</span>
                  {en.date&&<div style={{color:T.dim,fontSize:11,marginTop:2}}>{en.date}</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  <span style={{fontFamily:"IBM Plex Mono,monospace",color:T.cream,fontSize:13}}>{sym(advance.currency)}{fmt(en.amount)}</span>
                  <button onClick={()=>onRemoveEntry(en.id)} style={{color:T.faint,fontSize:18,cursor:"pointer",background:"none",border:"none"}}>×</button>
                </div>
              </div>
            );
          })}
          {/* Summary */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:12,fontFamily:"Manrope,sans-serif"}}>
            <span style={{color:T.dim}}>{entries.length} expense{entries.length!==1?'s':''}</span>
            <span style={{fontFamily:"IBM Plex Mono,monospace",color:balance<0?T.coral:T.gold,fontWeight:700}}>{sym(advance.currency)}{fmt(spent)} spent</span>
          </div>
        </div>
      )}

      {/* Log expense form */}
      {showEntry&&(
        <div style={{padding:"12px 16px",borderTop:`1px solid ${T.line}`,background:T.hi}}>
          <div style={{fontSize:11,color:T.dim,fontFamily:"Manrope,sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Log expense</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <Sel value={eCat} onChange={e=>setECat(e.target.value)} style={{width:"100%"}}>
              {EXPENSE_CATS.map(c=><option key={c}>{c}</option>)}
            </Sel>
            <Inp placeholder="Description — what was this for?" value={eDesc} onChange={e=>setEDesc(e.target.value)}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <Inp type="number" placeholder="Amount" value={eAmt} onChange={e=>setEAmt(e.target.value)}/>
              <Inp type="date" value={eDate} onChange={e=>setEDate(e.target.value)}/>
            </div>
            <Inp placeholder="Receipt ref / voucher number (optional)" value={eRef} onChange={e=>setERef(e.target.value)}/>
            <div style={{display:"flex",gap:8}}>
              <Btn size="sm" onClick={saveEntry}>Save expense</Btn>
              <Btn size="sm" variant="ghost" onClick={()=>setShowEntry(false)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      {advance.status!=="reconciled"&&!showEntry&&(
        <div style={{padding:"8px 16px 12px",display:"flex",gap:14}}>
          <button onClick={()=>setShowEntry(true)} style={{color:T.gold,fontSize:12,fontWeight:700,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif"}}>+ Log expense</button>
          {balance>=0&&<button onClick={()=>onUpdate(advance.id,{status:"reconciled"})} style={{color:T.sage,fontSize:12,fontWeight:700,cursor:"pointer",background:"none",border:"none",fontFamily:"Manrope,sans-serif"}}>✓ Mark reconciled</button>}
        </div>
      )}
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
      {project.logo_url&&<img src={project.logo_url} style={{height:36,objectFit:"contain",marginBottom:12,display:"block"}}/>}
      <pre style={{background:T.ink,border:`1px solid ${T.line}`,borderRadius:8,padding:16,fontSize:12,color:T.cream,fontFamily:"IBM Plex Mono,monospace",whiteSpace:"pre-wrap",marginBottom:16,lineHeight:1.7}}>{text}</pre>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <Btn variant="wa" onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank")}>📱 WhatsApp</Btn>
        <Btn variant="outline" onClick={()=>downloadReceiptPDF(payment,payee,project)}>📄 PDF</Btn>
        <Btn variant="ghost" onClick={onClose}>Close</Btn>
      </div>
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
  const [notifPerm,setNotifPerm]=useState(()=>typeof Notification!=='undefined'?Notification.permission:'unsupported');
  const pendingRef=useRef(null);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const askNotif=async()=>{if(typeof Notification==='undefined'||Notification.permission!=='default')return;const p=await Notification.requestPermission();setNotifPerm(p);};
  const sendNotif=()=>{if(typeof Notification==='undefined'||Notification.permission!=='granted')return;try{new Notification('NKO AI Builder',{body:'Your question has been answered — tap to view'});}catch{}};

  useEffect(()=>{
    const h=()=>{if(document.visibilityState==='visible'&&pendingRef.current){setMessages(prev=>[...prev,pendingRef.current]);pendingRef.current=null;setLoading(false);}};
    document.addEventListener('visibilitychange',h);return()=>document.removeEventListener('visibilitychange',h);
  },[]);

  const ctx=project?`Project: "${project.name}" (${project.type}, ${project.base_currency}). Budget lines: ${budgetItems.length}. Total: ${fmt(budgetItems.reduce((s,i)=>s+lTot(i),0))} ${project.base_currency}.`:"No project.";
  const send=async(text)=>{
    const msg=(text||input).trim();if(!msg||loading)return;
    await askNotif();
    setInput("");setMessages(prev=>[...prev,{role:"user",content:msg}]);setLoading(true);
    try{
      const history=messages.map(m=>({role:m.role,content:m.content}));
      const reply=await callClaude([...history,{role:"user",content:`[${ctx}]\n\n${msg}`}],CHAT_SYS);
      const assistantMsg={role:"assistant",content:reply};
      sendNotif();
      if(document.visibilityState==='hidden'){
        // Store in localStorage so message survives screen lock
        try{localStorage.setItem('nko_pending_ai_msg',JSON.stringify({msg:assistantMsg,ts:Date.now()}));}catch{}
        setMessages(prev=>[...prev,assistantMsg]);setLoading(false); // still add it — will show when user returns
      }else{setMessages(prev=>[...prev,assistantMsg]);setLoading(false);}
    }
    catch{setMessages(prev=>[...prev,{role:"assistant",content:"Connection error — try again."}]);setLoading(false);}
  };
  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
      <div style={{marginBottom:18}}>
        <div style={{fontFamily:"Fraunces,serif",fontSize:26,color:T.cream}}>AI Builder</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginTop:4}}>
          <div style={{fontSize:14,color:T.dim,fontFamily:"Manrope,sans-serif"}}>Your production finance co-pilot — calibrated for African context.</div>
          {notifPerm==='granted'&&<div style={{fontSize:11,color:T.sage,fontFamily:"Manrope,sans-serif"}}>🔔 Notifications on</div>}
          {notifPerm==='default'&&<button onClick={askNotif} style={{fontSize:11,color:T.goldDim,fontFamily:"Manrope,sans-serif",background:"none",border:`1px solid ${T.line}`,borderRadius:20,padding:"3px 10px",cursor:"pointer"}}>💡 Allow notifications</button>}
        </div>
        <div style={{marginTop:14}}><FS/></div>
      </div>
      <div style={{flex:1,overflowY:"auto",marginBottom:12}}>
        {messages.length===0&&<div style={{marginBottom:22}}><div style={{fontSize:10,color:T.dim,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12,fontFamily:"Manrope,sans-serif"}}>Quick prompts</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{QUICK.map(q=><button key={q} onClick={()=>send(q)} style={{background:T.hi,border:`1px solid ${T.line}`,borderRadius:20,padding:"6px 14px",fontSize:12,color:T.cream,cursor:"pointer",fontFamily:"Manrope,sans-serif"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=T.line}>{q}</button>)}</div></div>}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {messages.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"82%",padding:"10px 14px",borderRadius:10,fontSize:14,lineHeight:1.65,background:m.role==="user"?T.goldGlow:T.panel,border:`1px solid ${m.role==="user"?T.goldDim:T.line}`,color:T.cream,fontFamily:"Manrope,sans-serif",whiteSpace:"pre-wrap"}}>{m.content}</div></div>)}
          {loading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:"10px 16px",color:T.dim,fontSize:14,fontFamily:"Manrope,sans-serif"}}>{notifPerm==='granted'?'Thinking… 🔔 You will be notified when done':'Thinking…'}</div></div>}
        </div>
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:8}}><Inp placeholder="Ask about rates, budgets, recon, payments…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} style={{flex:1}}/><Btn onClick={()=>send()} style={{flexShrink:0,opacity:loading?.5:1}}>Send</Btn></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCRIPT BREAKDOWN
═══════════════════════════════════════════════════════ */

/* Breakdown categories shown on each scene card */
const BREAKDOWN_CATS = [
  {key:"cast",        label:"Cast",             icon:"👤"},
  {key:"extras",      label:"Background/Extras", icon:"👥"},
  {key:"location",    label:"Location",          icon:"📍"},
  {key:"props",       label:"Props",             icon:"🎭"},
  {key:"vehicles",    label:"Vehicles",          icon:"🚗"},
  {key:"wardrobe",    label:"Wardrobe",          icon:"👗"},
  {key:"hairMakeup",  label:"Hair & Make-up",    icon:"💄"},
  {key:"specialEquip",label:"Special Equipment", icon:"🎥"},
  {key:"vfxSfx",      label:"VFX / SFX",         icon:"✨"},
  {key:"sound",       label:"Sound / Music",     icon:"🎵"},
  {key:"notes",       label:"Notes",             icon:"📝"},
];

const BREAKDOWN_SYS = `You are a professional script breakdown AI for African film productions. Extract scenes from the script and return ONLY a valid JSON array. No markdown. No code fences. No special characters or apostrophes in any string value. Keep all text simple and clean. Be concise — short values only.`;

const BREAKDOWN_PROMPT = (episodeMode, maxEntries) => `${episodeMode
  ? `This is a multi-episode script. Create EXACTLY ONE breakdown entry per episode. Do NOT break down individual scenes. Consolidate ALL elements from ALL scenes within each episode into one entry. Maximum ${maxEntries} entries total.`
  : `Extract every scene from this script. Maximum ${maxEntries} entries total.`}

Return ONLY this JSON array — no other text, no markdown:
[{
  "sceneNumber": "${episodeMode?'Ep 1':'1'}",
  "heading": "${episodeMode?'EPISODE 1 — TITLE':'INT. LOCATION - DAY'}",
  "intExt": "INT",
  "dayNight": "DAY",
  "synopsis": "One sentence description",
  "pageCount": ${episodeMode?'22':'1.5'},
  "cast": ["Name1","Name2","Name3"],
  "extras": "Brief extras description",
  "location": "${episodeMode?'All locations this episode':'Specific location'}",
  "props": ["Prop1","Prop2","Prop3"],
  "vehicles": ["Vehicle1"],
  "wardrobe": ["Item1","Item2"],
  "hairMakeup": "Brief hair and makeup notes",
  "specialEquip": ["Equipment1"],
  "vfxSfx": "None or brief description",
  "sound": "Brief sound notes",
  "notes": "Key production notes"
}]
STRICT RULES:
- Maximum 5 items per array field
- Maximum 10 words per string value
- No apostrophes anywhere
- No special characters
- Return ONLY the JSON array`;

/* PDF export for breakdown sheets */
const downloadBreakdownPDF = (scenes, project, brand={}) => {
  const logoSrc=brand.logo||project.logo_url;
  const logoHtml=logoSrc?`<img src="${logoSrc}" style="height:40px;object-fit:contain;margin-bottom:8px;display:block"/>`:'' ;
  const companyName=brand.companyName||'';
  const sheets=scenes.map(sc=>`
    <div style="page-break-after:always;padding:20px 30px;font-family:Arial,sans-serif">
      <div style="background:#0F0120;color:#FEED61;padding:14px 20px;border-radius:6px 6px 0 0;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#8C852E;margin-bottom:2px">${companyName||'NKO'} · ${project.name}</div>
          <div style="font-size:18px;font-weight:700">Scene ${sc.sceneNumber||'—'}</div>
          <div style="font-size:13px;color:#9A9080;margin-top:2px">${sc.heading||''}</div>
        </div>
        <div style="text-align:right">
          ${logoHtml}
          <div style="font-size:11px;color:#8C852E">${sc.intExt||''} · ${sc.dayNight||''}</div>
          <div style="font-size:11px;color:#8C852E">Pages: ${sc.pageCount||0}</div>
        </div>
      </div>
      ${sc.synopsis?`<div style="background:#f9f9f9;border:1px solid #eee;border-top:none;padding:10px 20px;font-size:13px;color:#444;font-style:italic">${sc.synopsis}</div>`:''}
      <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;border-top:none">
        ${BREAKDOWN_CATS.map(cat=>{
          const val=sc[cat.key];
          if(!val||(Array.isArray(val)&&val.length===0)) return '';
          const display=Array.isArray(val)?val.join(', '):val;
          return `<tr style="border-bottom:1px solid #eee">
            <td style="padding:8px 14px;background:#1A0835;color:#FEED61;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;width:160px;white-space:nowrap">${cat.icon} ${cat.label}</td>
            <td style="padding:8px 14px;font-size:13px;color:#222">${display}</td>
          </tr>`;
        }).join('')}
      </table>
    </div>
  `).join('');
  const html=`<!DOCTYPE html><html><head><title>Breakdown — ${project.name}</title><style>*{box-sizing:border-box}body{margin:0;padding:0}@media print{.no-print{display:none}}</style></head><body>
    <div class="no-print" style="background:#0F0120;padding:14px 20px;text-align:center">
      <button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 24px;font-size:14px;font-weight:700;cursor:pointer;border-radius:6px">Print / Save as PDF</button>
      <span style="color:#9A9080;font-size:12px;margin-left:12px">${scenes.length} scene${scenes.length!==1?'s':''} · ${project.name}</span>
    </div>
    ${sheets}
  </body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};

/* Single scene card */

export { ScriptResultModal,ScriptUploader,DeptSection,BrandPanel,BudgetsView,
  ReconView,AdvanceCard,PaymentsView,AIView };
