/*
  NKÒ — Budgets tailored just for you | Supabase Edition
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
  ink:'#141414', panel:'#1C1C1E', hi:'#242424', line:'#3A3A3A',
  gold:'#FEED61', goldDim:'#8C852E', goldGlow:'rgba(254,237,97,0.12)',
  cream:'#F0E8D0', dim:'#9A9080', faint:'#5A5A5A',
  coral:'#E06B52', sage:'#52B07A', sapphire:'#4A90D9',
};

/* ── Constants ── */
const CURRENCIES=[
  {code:'NGN',symbol:'₦'},{code:'GHS',symbol:'₵'},{code:'KES',symbol:'KSh'},
  {code:'ZAR',symbol:'R'},{code:'UGX',symbol:'USh'},{code:'TZS',symbol:'TSh'},
  {code:'XOF',symbol:'Fr'},{code:'ETB',symbol:'Br'},{code:'USD',symbol:'$'},{code:'GBP',symbol:'£'},
];
const DEPTS=["A - Research & Development", "B - Script & Story", "C - Pre-Production Expenses", "D - Production Team", "E - Creative Team", "F - Talents", "G - Camera & Grip Team", "H - Camera & Grip Equipment", "I - Light & Power Team", "J - Light & Power Equipment", "K - Sound Team", "L - Sound Equipment", "M - Art Team", "N - Set & Prop Expenses", "O - Location", "P - Wardrobe", "Q - Makeup & Hair", "R - SFX & Stunts", "S - Production Logistics", "T - Hospitality & Welfare", "U - Overhead & General Expenses", "V - Production Support", "W - Post-Production Team", "X - Post-Production Expenses", "Y - PR & Marketing", "Z - Sales & Distribution"];
const PHASES=[
  {name:'Pre-Production',depts:['A - Research & Development','B - Script & Story','C - Pre-Production Expenses']},
  {name:'Production',depts:['D - Production Team','E - Creative Team','F - Talents','G - Camera & Grip Team','H - Camera & Grip Equipment','I - Light & Power Team','J - Light & Power Equipment','K - Sound Team','L - Sound Equipment','M - Art Team','N - Set & Prop Expenses','O - Location','P - Wardrobe','Q - Makeup & Hair','R - SFX & Stunts','S - Production Logistics','T - Hospitality & Welfare','U - Overhead & General Expenses','V - Production Support']},
  {name:'Post-Production',depts:['W - Post-Production Team','X - Post-Production Expenses']},
  {name:'PR, Marketing & Distribution',depts:['Y - PR & Marketing','Z - Sales & Distribution']},
];

const UNITS=['day','week','flat','person','item'];
const PROJ_TYPES=['Feature Film','Vertical Series / Microdrama','Short Film','Music Video','Documentary','Branded Content','Animation / Cartoon','Other'];
const TRANSLATIONS={
  en:{
    tagline:'Budgets tailored just for you',
    signOut:'Sign out',
    studio:'Studio',
    navDashboard:'Dashboard',navBudgets:'Budgets',navBreakdown:'Breakdown',navRecon:'Recon',navPayments:'Payments',navMarketplace:'Marketplace',navAI:'AI Builder',navWorkspace:'Schedules and Call Sheets',
    selectProduction:'Select production…',newBtn:'+ New',back:'← Back',
    emailPlaceholder:'Email',passwordPlaceholder:'Password',show:'Show',hide:'Hide',
    forgotPassword:'Forgot password?',signIn:'Sign in',createAccount:'Create account',
    noAccountSignUp:'No account? Sign up',haveAccountSignIn:'Have an account? Sign in',
    getStarted:'Get started',continueBtn:'Continue',backBtn:'Back',finishBtn:'Finish',
    onboardTagline:'Budgets tailored just for you.',
    step1Of2:'Step 1 of 2',whatsYourRole:"What's your role?",roleSubtitle:"We'll tailor the workspace to what you manage day to day.",
    step2Of2:'Step 2 of 2',baseCurrency:'Base currency?',currencySubtitle:'Sets the default currency for budgets and payments.',
    dashHeaderTagline:'Budgets tailored just for you.',
    statProductions:'Productions',statActive:'active',statBudgetLines:'Budget lines',statAllProjects:'all projects',
    statOpenAdvances:'Open advances',statPending:'pending',statUnpaid:'Unpaid',statCastCrew:'cast & crew',
    statTotalSpend:'Total spend',statAcrossSlate:'across all productions',statTotalSaved:'Total saved',statOverBudget:'over budget',statUnderBudget:'under budget',
    statTotalBudget:'Total budget',statOpenAdv:'open',statUnpaidCrew:'Unpaid crew',allProductions:'← All productions',productionDashboard:'Production dashboard',statThisProduction:'this production',
    costReport:'Cost report',costReportSub:'Budget vs actual, pre-production through distribution',byPhase:'By phase',notStarted:'not started',totalBudgetLbl:'Total budget',actualSpentLbl:'Actual spent',remainingLbl:'Remaining',
    noProductionsYet:'No productions yet',createFirstDesc:'Create a production and start building your budget.',
    createFirstBtn:'Create your first production',productionsHeader:'Productions',
    selectAll:'Select all',clear:'Clear',deleteBtn:'🗑️ Delete',
    budgetHeader:'Budget',templates:'📋 Templates',shareBudgetPdf:'📄 Share Budget PDF',exportExcel:'📊 Export Excel',
    addDepartment:'+ Add a department…',totalBudget:'Total budget',
    phaseCostSummary:'Phase Cost Summary',preProduction:'Pre-Production',productionPhase:'Production',
    contingency:'Contingency',postProduction:'Post-Production',total:'Total',
    productionInfo:'Production Info',brandPanel:'Brand Panel',
    uploadScript:'Upload your script',chooseFile:'Choose file',
    breakdownHeader:'Breakdown',castSceneBreakdown:'Character Scene Breakdown',
    outlineSchedule:'Outline Schedule',locationsSummary:'Locations Summary',productionElements:'Production Elements',
    aiScriptBreakdown:'AI Script Breakdown',chooseScript:'Choose script',
    keepScreenOpen:'You can switch screens — results apply automatically when you come back',
    notifOn:'🔔 Notifications on — you can switch apps',
    analyzing:'Analyzing your script…',breakdownComplete:'Breakdown complete',
    reconHeader:'Recon',issueAdvance:'+ Issue advance',newAdvance:'New advance',
    logExpense:'+ Log expense',topUp:'💰 Top up',reconcileBtn:'✓ Reconcile',
    paymentsHeader:'Payments',addPayee:'+ Add payee',logPayment:'+ Log payment',
    marketplaceHeader:'Marketplace',useTemplate:'Use template',applied:'✓ Applied',
    aiBuilderHeader:'AI Builder',askPlaceholder:'Ask about rates, budgets, recon… or attach an image',send:'Send',
    save:'Save',cancel:'Cancel',deleteWord:'Delete',edit:'✏️ Edit',create:'Create',
  },
  fr:{
    tagline:'Des budgets pensés pour vous',
    signOut:'Se déconnecter',
    studio:'Studio',
    navDashboard:'Tableau de bord',navBudgets:'Budgets',navBreakdown:'Découpage',navRecon:'Rapprochement',navPayments:'Paiements',navMarketplace:'Place de marché',navAI:'Assistant IA',navWorkspace:'Plannings et feuilles de service',
    selectProduction:'Sélectionner une production…',newBtn:'+ Nouveau',back:'← Retour',
    emailPlaceholder:'E-mail',passwordPlaceholder:'Mot de passe',show:'Afficher',hide:'Masquer',
    forgotPassword:'Mot de passe oublié ?',signIn:'Se connecter',createAccount:'Créer un compte',
    noAccountSignUp:'Pas de compte ? Inscrivez-vous',haveAccountSignIn:'Déjà un compte ? Connectez-vous',
    getStarted:'Commencer',continueBtn:'Continuer',backBtn:'Retour',finishBtn:'Terminer',
    onboardTagline:'Des budgets pensés pour vous.',
    step1Of2:'Étape 1 sur 2',whatsYourRole:'Quel est votre rôle ?',roleSubtitle:"Nous adapterons l'espace de travail à vos tâches quotidiennes.",
    step2Of2:'Étape 2 sur 2',baseCurrency:'Devise de base ?',currencySubtitle:'Définit la devise par défaut pour les budgets et paiements.',
    dashHeaderTagline:'Des budgets pensés pour vous.',
    statProductions:'Productions',statActive:'actives',statBudgetLines:'Lignes budgétaires',statAllProjects:'tous projets',
    statOpenAdvances:'Avances ouvertes',statPending:'en attente',statUnpaid:'Impayés',statCastCrew:'acteurs et équipe',
    statTotalSpend:'Total dépensé',statAcrossSlate:'toutes productions',statTotalSaved:'Total économisé',statOverBudget:'dépassement',statUnderBudget:'sous le budget',
    statTotalBudget:'Budget total',statOpenAdv:'ouvertes',statUnpaidCrew:'Équipe impayée',allProductions:'← Toutes les productions',productionDashboard:'Tableau de bord de production',statThisProduction:'cette production',
    costReport:'Rapport de coûts',costReportSub:'Budget vs réel, de la pré-production à la distribution',byPhase:'Par phase',notStarted:'non commencé',totalBudgetLbl:'Budget total',actualSpentLbl:'Dépenses réelles',remainingLbl:'Restant',
    noProductionsYet:'Aucune production pour le moment',createFirstDesc:'Créez une production et commencez votre budget.',
    createFirstBtn:'Créer votre première production',productionsHeader:'Productions',
    selectAll:'Tout sélectionner',clear:'Effacer',deleteBtn:'🗑️ Supprimer',
    budgetHeader:'Budget',templates:'📋 Modèles',shareBudgetPdf:'📄 Partager le PDF du budget',exportExcel:'📊 Exporter Excel',
    addDepartment:'+ Ajouter un département…',totalBudget:'Budget total',
    phaseCostSummary:'Résumé des coûts par phase',preProduction:'Pré-production',productionPhase:'Production',
    contingency:'Imprévus',postProduction:'Post-production',total:'Total',
    productionInfo:'Infos production',brandPanel:'Panneau de marque',
    uploadScript:'Téléversez votre scénario',chooseFile:'Choisir un fichier',
    breakdownHeader:'Découpage',castSceneBreakdown:'Répartition des personnages par scène',
    outlineSchedule:'Calendrier de tournage',locationsSummary:'Résumé des lieux',productionElements:'Éléments de production',
    aiScriptBreakdown:'Découpage du scénario par IA',chooseScript:'Choisir un scénario',
    keepScreenOpen:'Vous pouvez changer d’écran — les résultats s’appliquent à votre retour',
    notifOn:'🔔 Notifications activées — vous pouvez changer d\u2019application',
    analyzing:'Analyse de votre scénario…',breakdownComplete:'Découpage terminé',
    reconHeader:'Rapprochement',issueAdvance:'+ Émettre une avance',newAdvance:'Nouvelle avance',
    logExpense:'+ Enregistrer une dépense',topUp:'💰 Recharger',reconcileBtn:'✓ Rapprocher',
    paymentsHeader:'Paiements',addPayee:'+ Ajouter un bénéficiaire',logPayment:'+ Enregistrer un paiement',
    marketplaceHeader:'Place de marché',useTemplate:'Utiliser le modèle',applied:'✓ Appliqué',
    aiBuilderHeader:'Assistant IA',askPlaceholder:'Posez une question sur les tarifs, budgets, rapprochements… ou joignez une image',send:'Envoyer',
    save:'Enregistrer',cancel:'Annuler',deleteWord:'Supprimer',edit:'✏️ Modifier',create:'Créer',
  },
};
const LangCtx=createContext(null);
const useLang=()=>useContext(LangCtx);
function LangProvider({children}){
  const[lang,setLangState]=useState(()=>{try{return localStorage.getItem('nko_lang')||'en';}catch{return'en';}});
  const setLang=l=>{try{localStorage.setItem('nko_lang',l);}catch{}setLangState(l);};
  const t=useCallback(key=>TRANSLATIONS[lang]?.[key]??TRANSLATIONS.en[key]??key,[lang]);
  return<LangCtx.Provider value={{lang,setLang,t}}>{children}</LangCtx.Provider>;
}
const ROLES=[
  {id:'line_producer',label:'Line Producer',sub:'Owns the top sheet and daily cost tracking'},
  {id:'production_manager',label:'Production Manager',sub:'Runs logistics, crew and locations'},
  {id:'producer',label:'Producer',sub:'Oversees the whole production'},
  {id:'production_accountant',label:'Production Accountant',sub:'Reconciles actuals and processes payments'},
];
const MARKETS=[
  {country:'Nigeria',code:'NGN',symbol:'₦'},
  {country:'Ghana',code:'GHS',symbol:'₵'},
  {country:'Kenya',code:'KES',symbol:'KSh'},
  {country:'South Africa',code:'ZAR',symbol:'R'},
  {country:'Uganda',code:'UGX',symbol:'USh'},
  {country:'Tanzania',code:'TZS',symbol:'TSh'},
];
const PAY_METHODS=['Cash','Bank Transfer','OPay / PalmPay','M-Pesa','MTN Mobile Money','Airtel Money','Cheque','Other'];
const EXPENSE_CATS=['Feeding','Transport','Fuel','Location fee','Props & materials','Equipment hire','Accommodation','Communication','Labour','Miscellaneous'];
const ACCENT_COLORS=['#FEED61','#E06B52','#52B07A','#4A90D9','#9B7FD4','#F5A623','#2ABFBF','#E8527A'];
/* Approximate local-currency-to-USD conversion rates, for the dual currency display on each budget line.
   These are illustrative rates and should be treated as approximate — update RATES_TO_USD as real rates move. */
const RATES_TO_USD={NGN:1/1550,GHS:1/15.5,KES:1/129,ZAR:1/18.2,UGX:1/3700,TZS:1/2500,XOF:1/605,ETB:1/128,USD:1,GBP:1.27};
const toUSD=(amount,code)=>Number(amount||0)*(RATES_TO_USD[code]??0);

/* ── Templates ── */
const TEMPLATES=[
  {id:'feature',label:'Feature Film — Full A-Z Top Sheet',type:'Feature Film',items:[
    {dept:'A - Research & Development',description:'Researcher',qty:1,unit:'flat',rate:0},
    {dept:'A - Research & Development',description:'Research support & gratis',qty:1,unit:'flat',rate:0},
    {dept:'A - Research & Development',description:'Research materials / archival footages',qty:1,unit:'flat',rate:0},
    {dept:'A - Research & Development',description:'Research logistics',qty:1,unit:'flat',rate:0},
    {dept:'A - Research & Development',description:'IP, rights & licensing',qty:1,unit:'flat',rate:0},
    {dept:'A - Research & Development',description:'Brainstorming sessions venue & meals',qty:1,unit:'flat',rate:0},
    {dept:'A - Research & Development',description:'Brainstorming sessions sitting allowance',qty:1,unit:'flat',rate:0},
    {dept:'A - Research & Development',description:'Deck creation',qty:1,unit:'flat',rate:0},
    {dept:'A - Research & Development',description:'Title art creation',qty:1,unit:'flat',rate:0},
    {dept:'B - Script & Story',description:'Script conference venue & meals',qty:1,unit:'flat',rate:0},
    {dept:'B - Script & Story',description:'Script conference sitting allowance',qty:1,unit:'flat',rate:0},
    {dept:'B - Script & Story',description:'Script writer',qty:1,unit:'flat',rate:0},
    {dept:'B - Script & Story',description:'Script revision venue & meals',qty:1,unit:'flat',rate:0},
    {dept:'B - Script & Story',description:'Script revision sitting allowance',qty:1,unit:'flat',rate:0},
    {dept:'B - Script & Story',description:'Script editor',qty:1,unit:'flat',rate:0},
    {dept:'B - Script & Story',description:'Copyright registration',qty:1,unit:'flat',rate:0},
    {dept:'B - Script & Story',description:'Idea patenting',qty:1,unit:'flat',rate:0},
    {dept:'B - Script & Story',description:'Logo trademarking',qty:1,unit:'flat',rate:0},
    {dept:'B - Script & Story',description:'Script printing',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Script breakdown',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Budget prep & revision',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Scheduling',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Production calendar / timeline',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Auditions announcement',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Auditions venue & coordination',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Closed audition / table casting',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Table read',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Cast rehearsals',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Technical rehearsals',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Test shoot',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Production meetings',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Equipment check',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Costume fitting',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Makeup test',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Location scouting',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Recce logistics — flights',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Recce logistics — accommodation',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Recce logistics — interstate travel',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Recce allowance — feeding',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Production office set-up',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Production office equipment rental',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Production office consumables',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Communication allowance / calls & data',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Pre-production logistics',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Special cast trainings',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Cast reveal',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Casting director',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Content creation',qty:1,unit:'flat',rate:0},
    {dept:'C - Pre-Production Expenses',description:'Press conference',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Producer / Creative Producer',qty:1,unit:'flat',rate:400000},
    {dept:'D - Production Team',description:'Executive Producer',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Studio Executive Producer allowance',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Line Producer',qty:1,unit:'flat',rate:250000},
    {dept:'D - Production Team',description:'Co-Producer',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Associate Producer',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Assistant Producer',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:"Producer's Assistant",qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Production Manager',qty:1,unit:'flat',rate:100000},
    {dept:'D - Production Team',description:'Production Coordinator',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Unit Production Manager / Fixer',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Unit Manager / Runner',qty:1,unit:'flat',rate:30000},
    {dept:'D - Production Team',description:'Accountant',qty:1,unit:'flat',rate:80000},
    {dept:'D - Production Team',description:'Cast Chaperone',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Production Assistant',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Admin / Secretariat',qty:1,unit:'flat',rate:0},
    {dept:'D - Production Team',description:'Production Interns',qty:1,unit:'flat',rate:0},
    {dept:'E - Creative Team',description:'Director',qty:1,unit:'flat',rate:500000},
    {dept:'E - Creative Team',description:'Director of Photography',qty:1,unit:'flat',rate:300000},
    {dept:'E - Creative Team',description:'1st AD',qty:1,unit:'flat',rate:150000},
    {dept:'E - Creative Team',description:'2nd AD',qty:1,unit:'flat',rate:80000},
    {dept:'E - Creative Team',description:'3rd AD',qty:1,unit:'flat',rate:50000},
    {dept:'E - Creative Team',description:'Script Supervisor / Continuity',qty:1,unit:'flat',rate:60000},
    {dept:'E - Creative Team',description:'Assistant Script Supervisor',qty:1,unit:'flat',rate:0},
    {dept:'E - Creative Team',description:"Director's Assistant",qty:1,unit:'flat',rate:0},
    {dept:'E - Creative Team',description:"Director's Intern",qty:1,unit:'flat',rate:0},
    {dept:'E - Creative Team',description:'Technical Director',qty:1,unit:'flat',rate:0},
    {dept:'E - Creative Team',description:'Cultural / Language Consultant',qty:1,unit:'flat',rate:0},
    {dept:'E - Creative Team',description:'Extras Coordinator',qty:1,unit:'flat',rate:0},
    {dept:'F - Talents',description:'Lead cast',qty:1,unit:'flat',rate:0},
    {dept:'F - Talents',description:'Supporting cast',qty:1,unit:'flat',rate:0},
    {dept:'F - Talents',description:'Extras / background talent',qty:1,unit:'flat',rate:0},
    {dept:'G - Camera & Grip Team',description:'1st AC / Focus Puller',qty:1,unit:'flat',rate:80000},
    {dept:'G - Camera & Grip Team',description:'2nd AC / Clapper Board Loader',qty:1,unit:'flat',rate:50000},
    {dept:'G - Camera & Grip Team',description:'3rd AC / Cam Assistant',qty:1,unit:'flat',rate:0},
    {dept:'G - Camera & Grip Team',description:'Camera Technician',qty:1,unit:'flat',rate:0},
    {dept:'G - Camera & Grip Team',description:'Drone Operator',qty:1,unit:'flat',rate:0},
    {dept:'G - Camera & Grip Team',description:'Steadicam Operator',qty:1,unit:'flat',rate:0},
    {dept:'G - Camera & Grip Team',description:'2nd Cam Operator',qty:1,unit:'flat',rate:0},
    {dept:'G - Camera & Grip Team',description:'Cam B 1st AC',qty:1,unit:'flat',rate:0},
    {dept:'G - Camera & Grip Team',description:'Key Grip',qty:1,unit:'flat',rate:80000},
    {dept:'G - Camera & Grip Team',description:'Best Boy Grip',qty:1,unit:'flat',rate:50000},
    {dept:'G - Camera & Grip Team',description:'Grip Technician',qty:1,unit:'flat',rate:0},
    {dept:'G - Camera & Grip Team',description:'DIT',qty:1,unit:'flat',rate:0},
    {dept:'G - Camera & Grip Team',description:'Data Wrangler',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Camera',qty:1,unit:'flat',rate:300000},
    {dept:'H - Camera & Grip Equipment',description:'Set of lenses',qty:1,unit:'flat',rate:150000},
    {dept:'H - Camera & Grip Equipment',description:'Video village',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Camera accessories',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Follow focus',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Tripod',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Hi-hat, tall legs & baby legs',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Track & dolly',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Mini jib',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Crane',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Car mount',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Drone',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Steadicam',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Easy rig',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Ronin',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Dana dolly',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Apple boxes',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Go-Pro',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Black cloth',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Sand bags',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Shoulder rig',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Camera consumables',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Grip consumables',qty:1,unit:'flat',rate:0},
    {dept:'H - Camera & Grip Equipment',description:'Grip intercity travel',qty:1,unit:'flat',rate:0},
    {dept:'I - Light & Power Team',description:'Lighting Designer',qty:1,unit:'flat',rate:0},
    {dept:'I - Light & Power Team',description:'Gaffer',qty:1,unit:'flat',rate:80000},
    {dept:'I - Light & Power Team',description:'Best Boy Electric',qty:1,unit:'flat',rate:50000},
    {dept:'I - Light & Power Team',description:'Spark',qty:1,unit:'flat',rate:0},
    {dept:'I - Light & Power Team',description:'Riggers',qty:1,unit:'flat',rate:0},
    {dept:'I - Light & Power Team',description:'Loaders',qty:1,unit:'flat',rate:0},
    {dept:'I - Light & Power Team',description:'Genny Operator',qty:1,unit:'flat',rate:0},
    {dept:'I - Light & Power Team',description:'Genny Technician',qty:1,unit:'flat',rate:0},
    {dept:'I - Light & Power Team',description:'Genny Truck Driver',qty:1,unit:'flat',rate:0},
    {dept:'I - Light & Power Team',description:'Genny Truck Loader',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Set of lights',qty:1,unit:'flat',rate:150000},
    {dept:'J - Light & Power Equipment',description:'Light grip',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Light accessories',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Generator & truck',qty:1,unit:'flat',rate:80000},
    {dept:'J - Light & Power Equipment',description:'Light consumables',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Practical light support',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Generator & truck diesel',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Haze machine',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Fog machine',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Smoke machine',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Power bill',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Servicing & maintenance',qty:1,unit:'flat',rate:0},
    {dept:'J - Light & Power Equipment',description:'Light support — C-stands, autopole etc',qty:1,unit:'flat',rate:0},
    {dept:'K - Sound Team',description:'Sound Engineer / Mixer',qty:1,unit:'flat',rate:100000},
    {dept:'K - Sound Team',description:'Boom Swinger',qty:1,unit:'flat',rate:50000},
    {dept:'K - Sound Team',description:'Sound Assistant',qty:1,unit:'flat',rate:0},
    {dept:'L - Sound Equipment',description:'Mixer / Recorder',qty:1,unit:'flat',rate:0},
    {dept:'L - Sound Equipment',description:'Lapel mics',qty:1,unit:'flat',rate:0},
    {dept:'L - Sound Equipment',description:'Boom mic & fish poles',qty:1,unit:'flat',rate:0},
    {dept:'L - Sound Equipment',description:'Headphones',qty:1,unit:'flat',rate:0},
    {dept:'L - Sound Equipment',description:'Monitors',qty:1,unit:'flat',rate:0},
    {dept:'L - Sound Equipment',description:'Sound consumables',qty:1,unit:'flat',rate:0},
    {dept:'L - Sound Equipment',description:'Time code kit',qty:1,unit:'flat',rate:0},
    {dept:'M - Art Team',description:'Production Designer',qty:1,unit:'flat',rate:150000},
    {dept:'M - Art Team',description:'Art Director',qty:1,unit:'flat',rate:100000},
    {dept:'M - Art Team',description:'Set Dresser',qty:1,unit:'flat',rate:0},
    {dept:'M - Art Team',description:'Swing Gang',qty:1,unit:'flat',rate:0},
    {dept:'M - Art Team',description:'Props Master',qty:1,unit:'flat',rate:60000},
    {dept:'M - Art Team',description:'Assistant Props Master',qty:1,unit:'flat',rate:0},
    {dept:'M - Art Team',description:'Buyer',qty:1,unit:'flat',rate:0},
    {dept:'M - Art Team',description:'Artisans',qty:1,unit:'flat',rate:0},
    {dept:'M - Art Team',description:'Armourer',qty:1,unit:'flat',rate:0},
    {dept:'M - Art Team',description:'Animal Handler',qty:1,unit:'flat',rate:0},
    {dept:'M - Art Team',description:'Graphic Designer',qty:1,unit:'flat',rate:0},
    {dept:'M - Art Team',description:'Artist',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Set construction',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Set dressing purchases',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Set dressing rentals',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Vehicle props',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Special sets & props',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Armoury / weaponry',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Props purchases',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Props rental',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Animals',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Art logistics',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Art consumables',qty:1,unit:'flat',rate:0},
    {dept:'N - Set & Prop Expenses',description:'Art logistics intercity travel',qty:1,unit:'flat',rate:0},
    {dept:'O - Location',description:'Location lease',qty:1,unit:'flat',rate:0},
    {dept:'O - Location',description:'Location logistics',qty:1,unit:'flat',rate:0},
    {dept:'O - Location',description:'Location scout',qty:1,unit:'flat',rate:0},
    {dept:'O - Location',description:'Location manager',qty:1,unit:'flat',rate:0},
    {dept:'O - Location',description:'Gratis',qty:1,unit:'flat',rate:0},
    {dept:'O - Location',description:'Location cleaning',qty:1,unit:'flat',rate:0},
    {dept:'O - Location',description:'Painting',qty:1,unit:'flat',rate:0},
    {dept:'O - Location',description:'Caution fee',qty:1,unit:'flat',rate:0},
    {dept:'O - Location',description:'Fixer',qty:1,unit:'flat',rate:0},
    {dept:'P - Wardrobe',description:'Stylist',qty:1,unit:'flat',rate:80000},
    {dept:'P - Wardrobe',description:'Wardrobe Manager',qty:1,unit:'flat',rate:60000},
    {dept:'P - Wardrobe',description:'Buyer',qty:1,unit:'flat',rate:0},
    {dept:'P - Wardrobe',description:'Wardrobe Assistant',qty:1,unit:'flat',rate:0},
    {dept:'P - Wardrobe',description:'Tailor',qty:1,unit:'flat',rate:0},
    {dept:'P - Wardrobe',description:'Dry cleaner',qty:1,unit:'flat',rate:0},
    {dept:'P - Wardrobe',description:'Costume purchase',qty:1,unit:'flat',rate:0},
    {dept:'P - Wardrobe',description:'Costume rentals',qty:1,unit:'flat',rate:0},
    {dept:'P - Wardrobe',description:'Costume consumables',qty:1,unit:'flat',rate:0},
    {dept:'P - Wardrobe',description:'Accessories',qty:1,unit:'flat',rate:0},
    {dept:'P - Wardrobe',description:'Dry cleaning',qty:1,unit:'flat',rate:0},
    {dept:'Q - Makeup & Hair',description:'Makeup Artist',qty:1,unit:'flat',rate:80000},
    {dept:'Q - Makeup & Hair',description:'Assistant Makeup Artist',qty:1,unit:'flat',rate:0},
    {dept:'Q - Makeup & Hair',description:'Hair Stylist',qty:1,unit:'flat',rate:60000},
    {dept:'Q - Makeup & Hair',description:'Assistant Hair Stylist',qty:1,unit:'flat',rate:0},
    {dept:'Q - Makeup & Hair',description:'Barber',qty:1,unit:'flat',rate:0},
    {dept:'Q - Makeup & Hair',description:'Makeup supplies',qty:1,unit:'flat',rate:0},
    {dept:'Q - Makeup & Hair',description:'Makeup equipment',qty:1,unit:'flat',rate:0},
    {dept:'Q - Makeup & Hair',description:'Makeup consumables',qty:1,unit:'flat',rate:0},
    {dept:'Q - Makeup & Hair',description:'Hair supplies',qty:1,unit:'flat',rate:0},
    {dept:'Q - Makeup & Hair',description:'Hair equipment',qty:1,unit:'flat',rate:0},
    {dept:'Q - Makeup & Hair',description:'Hair consumables',qty:1,unit:'flat',rate:0},
    {dept:'R - SFX & Stunts',description:'Makeup SFX',qty:1,unit:'flat',rate:0},
    {dept:'R - SFX & Stunts',description:'Fight Choreographer',qty:1,unit:'flat',rate:0},
    {dept:'R - SFX & Stunts',description:'Stunt Coordinator',qty:1,unit:'flat',rate:0},
    {dept:'R - SFX & Stunts',description:'Stunt people',qty:1,unit:'flat',rate:0},
    {dept:'R - SFX & Stunts',description:'Body double',qty:1,unit:'flat',rate:0},
    {dept:'R - SFX & Stunts',description:'Pyrotechnics',qty:1,unit:'flat',rate:0},
    {dept:'R - SFX & Stunts',description:'Special effects coach',qty:1,unit:'flat',rate:0},
    {dept:'R - SFX & Stunts',description:'Intimacy coordinator',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Air travel (local)',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Air travel (international)',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Visas',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Airport pick-up / drop off',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Inter-city travel',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Security — personnel & transportation',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Production bus — Coaster',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Production bus — Hiace',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Camera truck — Sienna',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Cast vehicle — Sienna',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Costume truck',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Grip van',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Production utility vehicle — unit bus',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Art department van',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Fuel',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Parking & toll',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Servicing & maintenance',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'RV caravans',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Excess luggage',qty:1,unit:'flat',rate:0},
    {dept:'S - Production Logistics',description:'Diesel',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Pre-production camp accommodation',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Pre-production camp welfare',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Accommodation — cast',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Accommodation — crew',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Food — cast',qty:1,unit:'flat',rate:30000},
    {dept:'T - Hospitality & Welfare',description:'Food — crew',qty:1,unit:'flat',rate:180000},
    {dept:'T - Hospitality & Welfare',description:'Food — extras',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Water',qty:1,unit:'flat',rate:10000},
    {dept:'T - Hospitality & Welfare',description:'Craft services — cast',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Craft services — crew',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'First aid',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Medic',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Hospital bills',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Ice',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Unit supplies purchases',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Unit supplies rentals',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Holding area',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Canopies & chairs',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Mobile toilet',qty:1,unit:'flat',rate:0},
    {dept:'T - Hospitality & Welfare',description:'Wrap party',qty:1,unit:'flat',rate:0},
    {dept:'U - Overhead & General Expenses',description:'Insurance',qty:1,unit:'flat',rate:100000},
    {dept:'U - Overhead & General Expenses',description:'Shoot permit',qty:1,unit:'flat',rate:50000},
    {dept:'U - Overhead & General Expenses',description:'Gratis',qty:1,unit:'flat',rate:0},
    {dept:'U - Overhead & General Expenses',description:'Bank charges',qty:1,unit:'flat',rate:0},
    {dept:'U - Overhead & General Expenses',description:'Courier charges',qty:1,unit:'flat',rate:0},
    {dept:'U - Overhead & General Expenses',description:'Police permit',qty:1,unit:'flat',rate:0},
    {dept:'U - Overhead & General Expenses',description:'Other permits',qty:1,unit:'flat',rate:0},
    {dept:'V - Production Support',description:'Audit',qty:1,unit:'flat',rate:0},
    {dept:'V - Production Support',description:'Tax',qty:1,unit:'flat',rate:0},
    {dept:'V - Production Support',description:'Legal support',qty:1,unit:'flat',rate:0},
    {dept:'V - Production Support',description:'Safety',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'Post Producer',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'Post-Production Supervisor',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'Editor',qty:1,unit:'flat',rate:300000},
    {dept:'W - Post-Production Team',description:'Offline Editor',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'Colorist',qty:1,unit:'flat',rate:150000},
    {dept:'W - Post-Production Team',description:'Sound Designer & Foley',qty:1,unit:'flat',rate:150000},
    {dept:'W - Post-Production Team',description:'Music Score',qty:1,unit:'flat',rate:150000},
    {dept:'W - Post-Production Team',description:'Dialogue Editor',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'ADR Sound Engineer',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'Final Mix',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'Subtitler & Translator',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'Quality Control',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'PR Content Editor — teaser, trailer',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'VFX Supervisor',qty:1,unit:'flat',rate:200000},
    {dept:'W - Post-Production Team',description:'VFX Artist',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'Music Supervisor',qty:1,unit:'flat',rate:0},
    {dept:'W - Post-Production Team',description:'Animator',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Post-production studio',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Editing suite',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Sound studio space',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Visual test',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Storage hard drive',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Back-up hard drive',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:"Producer's back-up hard drive",qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'BTS hard drive',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Transport hard drive',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Post-production logistics',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Music license',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Footage license',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Soundtrack album production',qty:1,unit:'flat',rate:0},
    {dept:'X - Post-Production Expenses',description:'Dolby sound export',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Poster photoshoot',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Poster design',qty:1,unit:'flat',rate:60000},
    {dept:'Y - PR & Marketing',description:'BTS photos',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'BTS videos',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'BTS phone reels',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Cast & key crew gift item',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Merch',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Online promotions',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'OOH advertising',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Traditional media',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Publicist / PR consultant',qty:1,unit:'flat',rate:150000},
    {dept:'Y - PR & Marketing',description:'Premiere(s)',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Media screening',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Exhibitor screening',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Social media & website promotion — in-house',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Road shows & activations',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Meet & greet',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Fans challenge & activation',qty:1,unit:'flat',rate:0},
    {dept:'Y - PR & Marketing',description:'Press conference',qty:1,unit:'flat',rate:0},
    {dept:'Z - Sales & Distribution',description:'DCP generation — cinema',qty:1,unit:'flat',rate:0},
    {dept:'Z - Sales & Distribution',description:'Packaging & handling — streaming',qty:1,unit:'flat',rate:0},
    {dept:'Z - Sales & Distribution',description:"Distributor's marketing fund",qty:1,unit:'flat',rate:0},
    {dept:'Z - Sales & Distribution',description:'Festival runs',qty:1,unit:'flat',rate:0},
  ]},
  {id:'vertical',label:'Vertical Series (7-day)',type:'Vertical Series / Microdrama',items:[
    {dept:'F - Talents',description:'Lead actor',qty:1,unit:'flat',rate:120000},
    {dept:'F - Talents',description:'Supporting cast (2)',qty:2,unit:'person',rate:40000},
    {dept:'E - Creative Team',description:'Director / DOP combo',qty:1,unit:'flat',rate:180000},
    {dept:'G - Camera & Grip Team',description:'Camera operator',qty:1,unit:'flat',rate:60000},
    {dept:'K - Sound Team',description:'Sound (boom & lav)',qty:1,unit:'flat',rate:50000},
    {dept:'E - Creative Team',description:'Script supervisor / continuity',qty:1,unit:'flat',rate:30000},
    {dept:'Q - Makeup & Hair',description:'Hair & make-up artist',qty:1,unit:'flat',rate:40000},
    {dept:'S - Production Logistics',description:'Location fees',qty:4,unit:'day',rate:20000},
    {dept:'T - Hospitality & Welfare',description:'Feeding (15 crew)',qty:7,unit:'day',rate:60000},
    {dept:'P - Wardrobe',description:'Costume & wardrobe items',qty:1,unit:'flat',rate:40000},
    {dept:'T - Hospitality & Welfare',description:'Unit supplies — water, consumables',qty:7,unit:'day',rate:5000},
    {dept:'S - Production Logistics',description:'Cast & crew transport',qty:7,unit:'day',rate:15000},
    {dept:'H - Camera & Grip Equipment',description:'Camera + gimbal package',qty:7,unit:'day',rate:20000},
    {dept:'J - Light & Power Equipment',description:'Lighting (LED panels)',qty:7,unit:'day',rate:10000},
    {dept:'W - Post-Production Team',description:'Edit (all episodes)',qty:1,unit:'flat',rate:100000},
    {dept:'W - Post-Production Team',description:'Subtitles & captions',qty:1,unit:'flat',rate:20000},
    {dept:'V - Production Support',description:'Contingency (10%)',qty:1,unit:'flat',rate:70000},
  ]},
  {id:'shortfilm',label:'Short Film (2-day)',type:'Short Film',items:[
    {dept:'F - Talents',description:'Lead cast (2)',qty:2,unit:'person',rate:50000},
    {dept:'E - Creative Team',description:'Director',qty:1,unit:'flat',rate:80000},
    {dept:'E - Creative Team',description:'DOP',qty:1,unit:'flat',rate:60000},
    {dept:'K - Sound Team',description:'Sound recordist',qty:1,unit:'flat',rate:30000},
    {dept:'I - Light & Power Team',description:'Gaffer / lighting',qty:1,unit:'flat',rate:25000},
    {dept:'Q - Makeup & Hair',description:'Hair & make-up artist',qty:1,unit:'flat',rate:20000},
    {dept:'P - Wardrobe',description:'Costume & wardrobe',qty:1,unit:'flat',rate:15000},
    {dept:'T - Hospitality & Welfare',description:'Unit supplies — water, consumables',qty:2,unit:'day',rate:5000},
    {dept:'S - Production Logistics',description:'Location fee',qty:1,unit:'flat',rate:30000},
    {dept:'T - Hospitality & Welfare',description:'Feeding (10 crew)',qty:2,unit:'day',rate:30000},
    {dept:'H - Camera & Grip Equipment',description:'Camera package',qty:2,unit:'day',rate:25000},
    {dept:'J - Light & Power Equipment',description:'Lighting',qty:2,unit:'day',rate:15000},
    {dept:'W - Post-Production Team',description:'Edit & grade',qty:1,unit:'flat',rate:60000},
    {dept:'V - Production Support',description:'Contingency (10%)',qty:1,unit:'flat',rate:40000},
  ]},
  {id:'musicvideo',label:'Music Video (1-day)',type:'Music Video',items:[
    {dept:'F - Talents',description:'Artist fee',qty:1,unit:'flat',rate:200000},
    {dept:'F - Talents',description:'Dancers / background (6)',qty:6,unit:'person',rate:20000},
    {dept:'E - Creative Team',description:'Director',qty:1,unit:'flat',rate:300000},
    {dept:'E - Creative Team',description:'DOP',qty:1,unit:'flat',rate:150000},
    {dept:'Q - Makeup & Hair',description:'Hair & make-up artist',qty:1,unit:'flat',rate:60000},
    {dept:'P - Wardrobe',description:'Wardrobe stylist',qty:1,unit:'flat',rate:50000},
    {dept:'S - Production Logistics',description:'Location fee',qty:1,unit:'flat',rate:50000},
    {dept:'T - Hospitality & Welfare',description:'Feeding',qty:1,unit:'day',rate:80000},
    {dept:'P - Wardrobe',description:'Costume purchases',qty:1,unit:'flat',rate:60000},
    {dept:'T - Hospitality & Welfare',description:'Unit supplies — water, consumables',qty:1,unit:'day',rate:10000},
    {dept:'H - Camera & Grip Equipment',description:'Camera + crane / drone',qty:1,unit:'day',rate:80000},
    {dept:'J - Light & Power Equipment',description:'Lighting package',qty:1,unit:'day',rate:40000},
    {dept:'W - Post-Production Team',description:'Edit & grade',qty:1,unit:'flat',rate:150000},
    {dept:'Y - PR & Marketing',description:'Thumbnail & promo',qty:1,unit:'flat',rate:30000},
    {dept:'V - Production Support',description:'Contingency (10%)',qty:1,unit:'flat',rate:120000},
  ]},
  {id:'documentary',label:'Documentary (5-day)',type:'Documentary',items:[
    {dept:'F - Talents',description:'Principal subjects (2)',qty:2,unit:'flat',rate:0},
    {dept:'E - Creative Team',description:'Director',qty:1,unit:'flat',rate:200000},
    {dept:'E - Creative Team',description:'DOP / camera',qty:1,unit:'flat',rate:150000},
    {dept:'K - Sound Team',description:'Sound recordist',qty:1,unit:'flat',rate:80000},
    {dept:'D - Production Team',description:'Researcher / producer',qty:1,unit:'flat',rate:100000},
    {dept:'S - Production Logistics',description:'Location permits',qty:3,unit:'item',rate:20000},
    {dept:'S - Production Logistics',description:'Field transport',qty:5,unit:'day',rate:25000},
    {dept:'T - Hospitality & Welfare',description:'Feeding (6 crew)',qty:5,unit:'day',rate:36000},
    {dept:'T - Hospitality & Welfare',description:'Field accommodation',qty:4,unit:'day',rate:40000},
    {dept:'Q - Makeup & Hair',description:'Hair & make-up (interview days)',qty:2,unit:'day',rate:10000},
    {dept:'T - Hospitality & Welfare',description:'Unit supplies — water, consumables',qty:5,unit:'day',rate:5000},
    {dept:'H - Camera & Grip Equipment',description:'Camera (run-and-gun)',qty:5,unit:'day',rate:30000},
    {dept:'L - Sound Equipment',description:'Lapel & boom mics',qty:5,unit:'day',rate:10000},
    {dept:'W - Post-Production Team',description:'Edit & grade',qty:1,unit:'flat',rate:200000},
    {dept:'W - Post-Production Team',description:'Music licence / score',qty:1,unit:'flat',rate:60000},
    {dept:'V - Production Support',description:'Contingency (10%)',qty:1,unit:'flat',rate:90000},
  ]},
  {id:'branded',label:'Branded Content (1-day)',type:'Branded Content',items:[
    {dept:'F - Talents',description:'Host / presenter',qty:1,unit:'flat',rate:150000},
    {dept:'E - Creative Team',description:'Director',qty:1,unit:'flat',rate:200000},
    {dept:'E - Creative Team',description:'DOP',qty:1,unit:'flat',rate:120000},
    {dept:'K - Sound Team',description:'Sound recordist',qty:1,unit:'flat',rate:50000},
    {dept:'Q - Makeup & Hair',description:'Hair & make-up artist',qty:1,unit:'flat',rate:40000},
    {dept:'S - Production Logistics',description:'Studio / location',qty:1,unit:'flat',rate:100000},
    {dept:'T - Hospitality & Welfare',description:'Feeding',qty:1,unit:'day',rate:50000},
    {dept:'P - Wardrobe',description:'Costume & styling',qty:1,unit:'flat',rate:30000},
    {dept:'H - Camera & Grip Equipment',description:'Camera + lights',qty:1,unit:'day',rate:60000},
    {dept:'T - Hospitality & Welfare',description:'Unit supplies — water, consumables',qty:1,unit:'day',rate:8000},
    {dept:'W - Post-Production Team',description:'Edit & graphics / lower thirds',qty:1,unit:'flat',rate:100000},
    {dept:'Y - PR & Marketing',description:'Social cutdowns (3)',qty:3,unit:'item',rate:20000},
    {dept:'V - Production Support',description:'Contingency (10%)',qty:1,unit:'flat',rate:90000},
  ]},
  {id:'animation',label:'Animation / Cartoon',type:'Animation / Cartoon',items:[
    {dept:'F - Talents',description:'Lead voice actor',qty:1,unit:'flat',rate:150000},
    {dept:'F - Talents',description:'Supporting voice cast (3)',qty:3,unit:'person',rate:50000},
    {dept:'W - Post-Production Team',description:'Animation director',qty:1,unit:'flat',rate:300000},
    {dept:'W - Post-Production Team',description:'Lead character animator',qty:1,unit:'flat',rate:200000},
    {dept:'W - Post-Production Team',description:'Background / environment artist',qty:1,unit:'flat',rate:100000},
    {dept:'W - Post-Production Team',description:'Storyboard artist',qty:1,unit:'flat',rate:80000},
    {dept:'W - Post-Production Team',description:'Colourist / compositor',qty:1,unit:'flat',rate:120000},
    {dept:'W - Post-Production Team',description:'Sound designer & composer',qty:1,unit:'flat',rate:100000},
    {dept:'X - Post-Production Expenses',description:'Animation workstations (2)',qty:2,unit:'item',rate:50000},
    {dept:'X - Post-Production Expenses',description:'Software licences',qty:1,unit:'flat',rate:80000},
    {dept:'X - Post-Production Expenses',description:'Drawing tablets',qty:2,unit:'item',rate:30000},
    {dept:'X - Post-Production Expenses',description:'Recording studio (voice)',qty:1,unit:'day',rate:60000},
    {dept:'T - Hospitality & Welfare',description:'Feeding — studio and voice days',qty:5,unit:'day',rate:15000},
    {dept:'W - Post-Production Team',description:'Episode render & assembly',qty:1,unit:'flat',rate:80000},
    {dept:'W - Post-Production Team',description:'Sound mix & subtitles',qty:1,unit:'flat',rate:40000},
    {dept:'Y - PR & Marketing',description:'Promo art & trailer',qty:1,unit:'flat',rate:50000},
    {dept:'V - Production Support',description:'Contingency (10%)',qty:1,unit:'flat',rate:130000},
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
  sceneNumber:num,heading,intExt:ie,dayNight:dn,timeNotes:'',
  cast:cast||[],extras:'',location:heading.split(' - ')[0].replace(/INT\.|EXT\./,'').trim(),
  props:props||[],vehicles:[],wardrobe:[],hairMakeup:'Per character brief',
  specialEquip:[],vfxSfx:'None',sound:'Location sound',languageNotes:'',notes:notes||''
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
const SCRIPT_SYS=`You are a script budget AI for African film productions. Return ONLY valid JSON. No markdown. No code fences. No apostrophes in strings.

You must classify every budget line into exactly one of these 26 department codes. Use the string EXACTLY as written below, including the letter prefix. Never invent a new department name.

A - Research & Development
B - Script & Story
C - Pre-Production Expenses
D - Production Team
E - Creative Team
F - Talents
G - Camera & Grip Team
H - Camera & Grip Equipment
I - Light & Power Team
J - Light & Power Equipment
K - Sound Team
L - Sound Equipment
M - Art Team
N - Set & Prop Expenses
O - Location
P - Wardrobe
Q - Makeup & Hair
R - SFX & Stunts
S - Production Logistics
T - Hospitality & Welfare
U - Overhead & General Expenses
V - Production Support
W - Post-Production Team
X - Post-Production Expenses
Y - PR & Marketing
Z - Sales & Distribution

Classification rules, follow these closely:
- Producer, Line Producer, Production Manager, Unit Manager, Accountant, Production Assistant, Production Coordinator -> D - Production Team
- Director, DOP, 1st/2nd/3rd AD, Script Supervisor, Continuity Supervisor, dialect or cultural consultants working with the director -> E - Creative Team
- Any actor, cast member, lead or supporting performer, background extras, on-camera performers of any kind including ritual performers, musical guest performers, wrestling or fight performers appearing on camera -> F - Talents
- Camera operators, focus pullers, camera assistants, drone or steadicam operators, key grip, gaffers grip crew -> G - Camera & Grip Team
- Cameras, lenses, tripods, cranes, drones, camera consumables -> H - Camera & Grip Equipment
- Gaffer, best boy electric, lighting technicians, electricians -> I - Light & Power Team
- Lights, generators, power equipment -> J - Light & Power Equipment
- Sound recordist, boom operator, sound mixer, sound assistant -> K - Sound Team
- Microphones, recorders, sound equipment -> L - Sound Equipment
- Production designer, art director, props master, set dressers, artisans -> M - Art Team
- Set construction, prop purchases or rentals, set materials -> N - Set & Prop Expenses
- Location fees, location manager, location scouting, location permits -> O - Location
- Costume designer, wardrobe manager or stylist, costume purchase, rental or dry cleaning -> P - Wardrobe
- Makeup artist, hair stylist, body paint or traditional makeup specialists, makeup and hair supplies -> Q - Makeup & Hair
- Stunt coordinator, stunt performers acting purely as stunt doubles or riggers, fight choreographer, special effects supervisor, pyrotechnics, practical FX, SFX makeup, prop fabrication tied to stunts or effects such as masks or weapons -> R - SFX & Stunts
- Vehicles, fuel, transport, travel, security -> S - Production Logistics
- Feeding, accommodation, welfare, medical, water, craft services -> T - Hospitality & Welfare
- Insurance, general permits, bank charges -> U - Overhead & General Expenses
- Legal, audit, tax, safety consulting -> V - Production Support
- Editor, colorist, sound designer, VFX artist, composer -> W - Post-Production Team
- Editing suite, hard drives, music or footage licensing -> X - Post-Production Expenses
- Posters, publicity, social media, press -> Y - PR & Marketing
- Distribution, festival runs, DCP generation -> Z - Sales & Distribution

If an item does not obviously fit, choose the single closest department from the list above. Never return a department that is not in this list, and never leave dept blank.`;
const SCRIPT_PROMPT=(cur)=>`Analyze this script and return a production budget as JSON: {"title":"string","budget":[{"dept":"string","description":"string","qty":number,"unit":"string","rate":number,"currency":"${cur}"}],"summary":"string"}`;
const BREAKDOWN_SYS=`You are a script breakdown AI for African film productions. Return ONLY valid JSON array. No markdown. No apostrophes. Keep values short and clean.`;
const BREAKDOWN_PROMPT=(ep,max)=>`${ep?`Multi-episode script: ONE entry per episode, max ${max} episodes.`:`Extract scenes, max ${max} scenes.`} If dialogue is in a specific language (e.g. Yoruba, Igbo, Hausa, Pidgin) or needs subtitles, note it in languageNotes. If the script states a specific time (e.g. "Morning (9AM)", "Same time as previous scene", "5PM"), capture it in timeNotes — otherwise leave timeNotes blank. Return ONLY: [{"sceneNumber":"1","heading":"INT. LOCATION - DAY","intExt":"INT","dayNight":"DAY","timeNotes":"","synopsis":"Brief description","pageCount":1,"cast":["Name"],"extras":"","location":"Place","props":["Prop"],"vehicles":[],"wardrobe":[],"hairMakeup":"","specialEquip":[],"vfxSfx":"None","sound":"","languageNotes":"","notes":""}]`;
const QUICK=['Day rate for DOP in Lagos?','Estimate 1-day music video in Naira','Structure cash advances for crew','Contingency % for Nollywood?','Post costs for 5-episode vertical?','Mobile money payments in Kenya?'];

/* ── Helpers ── */
const today=()=>new Date().toISOString().slice(0,10);
const fmt=n=>Number(n||0).toLocaleString('en',{maximumFractionDigits:0});
const sym=code=>(CURRENCIES.find(c=>c.code===code)||CURRENCIES[0]).symbol;
const lTot=i=>(Number(i.qty)||0)*(Number(i.rate)||0);
const readB64=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(',')[1]);r.onerror=rej;r.readAsDataURL(f);});
const readTxt=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsText(f);});
const readImg=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f);});
/* Excel export — real structured data (SheetJS), separate from the PDF export which is a formatted
   document. Loaded from the official SheetJS CDN, same lazy-load pattern as the PDF.js reader above. */
let xlsxLoadPromise=null;
const loadXLSX=()=>{
  if(window.XLSX)return Promise.resolve(window.XLSX);
  if(xlsxLoadPromise)return xlsxLoadPromise;
  xlsxLoadPromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
    script.onload=()=>resolve(window.XLSX);
    script.onerror=()=>reject(new Error('Could not load the Excel export library. Check your connection and try again.'));
    document.head.appendChild(script);
  });
  return xlsxLoadPromise;
};
const budgetExcel=async(items,project)=>{
  const XLSX=await loadXLSX();
  const wb=XLSX.utils.book_new();
  const brand=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');
  const info=JSON.parse(localStorage.getItem(`nko_info_${project.id}`)||'{}');
  const grand={};
  const phaseTotals=PHASES.map(ph=>{
    const t={};ph.depts.forEach(d=>{items.filter(i=>i.dept===d).forEach(i=>{t[i.currency]=(t[i.currency]||0)+lTot(i);grand[i.currency]=(grand[i.currency]||0)+lTot(i);});});
    return{ph,t};
  });
  const fmtT=t=>Object.entries(t).map(([c,a])=>`${fmt(a)} ${c}`).join(' · ')||'—';
  const grandUSD=items.reduce((s,i)=>s+toUSD(lTot(i),i.currency),0);

  // ---- Top Sheet ----
  const top=[
    ['PRODUCTION BUDGET — TOP SHEET'],
    [brand.productionTitle||project.name||''],
    [project.type||'',project.base_currency||''],
    [],
  ];
  const infoRows=[
    ['Company',brand.companyName],
    ['Producer',info.producer],['Line Producer',info.lineProducer],['Executive Producer',info.execProducer],['Prepared By',info.preparedBy],
    ['Pre-production',info.prepStart&&`${info.prepStart} → ${info.prepEnd||''}`],
    ['Shoot',info.shootStart&&`${info.shootStart} → ${info.shootEnd||''}`],
    ['Post-production',info.postStart&&`${info.postStart} → ${info.postEnd||''}`],
  ].filter(([,v])=>v);
  if(infoRows.length){infoRows.forEach(([k,v])=>top.push([k,v]));top.push([]);}
  top.push(['Account','Department','Total','Total (USD equiv.)']);
  phaseTotals.forEach(({ph,t})=>{
    top.push([ph.name,'','','']);
    ph.depts.forEach(d=>{
      const di=items.filter(i=>i.dept===d);if(!di.length)return;
      const dt={};di.forEach(i=>{dt[i.currency]=(dt[i.currency]||0)+lTot(i);});
      const dUSD=di.reduce((s,i)=>s+toUSD(lTot(i),i.currency),0);
      top.push(['',d,fmtT(dt),`$${fmt(dUSD)}`]);
    });
    const phaseUSD=items.filter(i=>ph.depts.includes(i.dept)).reduce((s,i)=>s+toUSD(lTot(i),i.currency),0);
    top.push(['',`${ph.name} Subtotal`,fmtT(t),`$${fmt(phaseUSD)}`]);
    top.push([]);
  });
  top.push(['','GRAND TOTAL',fmtT(grand),`$${fmt(grandUSD)}`]);
  const topWs=XLSX.utils.aoa_to_sheet(top);
  topWs['!cols']=[{wch:24},{wch:32},{wch:22},{wch:18}];
  XLSX.utils.book_append_sheet(wb,topWs,'Top Sheet');

  // ---- Detail (department blocks, matches PDF layout, USD equivalent per line) ----
  const det=[];
  PHASES.forEach(ph=>{
    const phDepts=ph.depts.filter(d=>items.some(i=>i.dept===d));
    if(!phDepts.length)return;
    det.push([ph.name]);
    phDepts.forEach(d=>{
      const di=items.filter(i=>i.dept===d);
      const dt={};di.forEach(i=>{dt[i.currency]=(dt[i.currency]||0)+lTot(i);});
      det.push([d,'','','','',fmtT(dt),'']);
      det.push(['Description','Qty','Unit','Rate','Currency','Total','Total (USD)']);
      di.forEach(i=>det.push([i.description||'',i.qty,i.unit,i.rate,i.currency,lTot(i),Number(toUSD(lTot(i),i.currency).toFixed(2))]));
      det.push([]);
    });
  });
  const detWs=XLSX.utils.aoa_to_sheet(det);
  detWs['!cols']=[{wch:40},{wch:8},{wch:10},{wch:12},{wch:10},{wch:14},{wch:14}];
  XLSX.utils.book_append_sheet(wb,detWs,'Detail');

  XLSX.writeFile(wb,`${(project.name||'Budget').replace(/[^a-z0-9]/gi,'_')}_Budget.xlsx`);
};
const breakdownExcel=async(scenes,project,characters=[])=>{
  const XLSX=await loadXLSX();
  const wb=XLSX.utils.book_new();
  const brand=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');
  const uniq=arr=>[...new Set(arr.filter(Boolean))];
  const allCast=uniq(scenes.flatMap(s=>s.cast||[]));
  const allProps=uniq(scenes.flatMap(s=>s.props||[]));
  const allWardrobe=uniq(scenes.flatMap(s=>s.wardrobe||[]));
  const allVehicles=uniq(scenes.flatMap(s=>s.vehicles||[]));
  const allEquip=uniq(scenes.flatMap(s=>s.specialEquip||[]));
  const intCount=scenes.filter(s=>s.intExt==='INT').length,extCount=scenes.filter(s=>s.intExt==='EXT').length;
  const dayCount=scenes.filter(s=>s.dayNight==='DAY').length,nightCount=scenes.filter(s=>s.dayNight==='NIGHT').length;

  // ---- Top Sheet ----
  const top=[['SCRIPT BREAKDOWN — TOP SHEET'],[brand.productionTitle||project.name||''],[project.type||''],[],
    ['Summary','Count'],
    ['Total Scenes',scenes.length],
    ['Interior / Exterior',`${intCount} INT · ${extCount} EXT`],
    ['Day / Night',`${dayCount} DAY · ${nightCount} NIGHT`],
    [],
    ['Element','Unique Count'],
    ['Cast',allCast.length],
    ['Props',allProps.length],
    ['Wardrobe',allWardrobe.length],
    ['Vehicles',allVehicles.length],
    ['Special Equipment',allEquip.length],
    [],
    ['Cast Member','Scene Count'],
  ];
  allCast.forEach(name=>{
    const n=scenes.filter(s=>(s.cast||[]).includes(name)).length;
    top.push([name,n]);
  });
  const topWs=XLSX.utils.aoa_to_sheet(top);
  topWs['!cols']=[{wch:26},{wch:24}];
  XLSX.utils.book_append_sheet(wb,topWs,'Top Sheet');

  // ---- Detail (scene by scene) ----
  const det=[['Scene #','Heading','Int/Ext','Day/Night','Synopsis','Cast','Props','Wardrobe','Vehicles','Special Equipment']];
  scenes.forEach(s=>{
    det.push([s.sceneNumber||'',s.heading||'',s.intExt||'',s.dayNight||'',s.synopsis||'',
      (s.cast||[]).join(', '),(s.props||[]).join(', '),(s.wardrobe||[]).join(', '),
      (s.vehicles||[]).join(', '),(s.specialEquip||[]).join(', ')]);
  });
  const detWs=XLSX.utils.aoa_to_sheet(det);
  detWs['!cols']=[{wch:8},{wch:26},{wch:8},{wch:9},{wch:36},{wch:26},{wch:26},{wch:26},{wch:20},{wch:26}];
  XLSX.utils.book_append_sheet(wb,detWs,'Detail');

  XLSX.writeFile(wb,`${(project.name||'Breakdown').replace(/[^a-z0-9]/gi,'_')}_Breakdown.xlsx`);
};
const scheduleExcel=async(days,scenes,project,characters=[])=>{
  const XLSX=await loadXLSX();
  const wb=XLSX.utils.book_new();
  const castNum=name=>{const i=characters.findIndex(c=>c.name.trim().toLowerCase()===name.trim().toLowerCase());return i>=0?i+1:'—';};
  // ---- Top Sheet ----
  const top=[['SHOOTING SCHEDULE — TOP SHEET'],[project.name||''],[],['Cast','']];
  characters.forEach((c,i)=>top.push([`${i+1}. ${c.name}`,'']));
  top.push([]);top.push(['Day','Date','Scenes','Cast Call']);
  days.forEach(d=>{
    const daySc=scenes.filter(s=>s.shootDayId===d.id);
    const cast=[...new Set(daySc.flatMap(s=>s.cast||[]))];
    top.push([`Day ${d.dayNumber}`,d.date||'',daySc.length,cast.join(', ')||'—']);
  });
  const topWs=XLSX.utils.aoa_to_sheet(top);
  topWs['!cols']=[{wch:20},{wch:14},{wch:10},{wch:40}];
  XLSX.utils.book_append_sheet(wb,topWs,'Top Sheet');
  // ---- Detail ----
  const det=[['Day','Date','Scene #','Int/Ext','Location','Day/Night','Cast','Synopsis']];
  days.forEach(d=>{
    scenes.filter(s=>s.shootDayId===d.id).forEach(s=>{
      det.push([`Day ${d.dayNumber}`,d.date||'',s.sceneNumber||'',s.intExt||'',parseLocation(s.heading),s.dayNight||'',(s.cast||[]).map(castNum).join(', '),s.synopsis||'']);
    });
  });
  const unsch=scenes.filter(s=>!s.shootDayId);
  if(unsch.length){det.push([]);det.push(['UNSCHEDULED']);unsch.forEach(s=>det.push(['','',s.sceneNumber||'',s.intExt||'',parseLocation(s.heading),s.dayNight||'',(s.cast||[]).map(castNum).join(', '),s.synopsis||'']));}
  const detWs=XLSX.utils.aoa_to_sheet(det);
  detWs['!cols']=[{wch:10},{wch:12},{wch:8},{wch:8},{wch:22},{wch:10},{wch:14},{wch:40}];
  XLSX.utils.book_append_sheet(wb,detWs,'Detail');
  XLSX.writeFile(wb,`${(project.name||'Schedule').replace(/[^a-z0-9]/gi,'_')}_Schedule.xlsx`);
};
/* Schedule and Call Sheet PDFs use a light, print-friendly style rather than NKÒ's dark theme —
   these are working documents meant to be printed and read on set, where a dark background
   wastes ink/toner and is harder to read outdoors than black text on white/light colour. */
const schedulePDF=(days,scenes,project,characters=[])=>{
  const castNum=name=>{const i=characters.findIndex(c=>c.name.trim().toLowerCase()===name.trim().toLowerCase());return i>=0?i+1:'—';};
  const castList=characters.map((c,i)=>`${i+1}. ${c.name}`).join('&nbsp;&nbsp;&nbsp;');
  const dayBlocks=days.map(d=>{
    const daySc=scenes.filter(s=>s.shootDayId===d.id);
    const cast=[...new Set(daySc.flatMap(s=>s.cast||[]))];
    const rows=daySc.map(s=>{const loc=parseLocation(s.heading);const c=locationColor(project,loc);
      return`<tr style="background:${c.bg}"><td style="padding:6px 8px;color:${c.text};font-weight:600;border:1px solid #ccc">#${s.sceneNumber}</td><td style="padding:6px 8px;color:${c.text};border:1px solid #ccc">${s.intExt||''}</td><td style="padding:6px 8px;color:${c.text};border:1px solid #ccc">${loc} · ${s.dayNight||''}</td><td style="padding:6px 8px;color:${c.text};border:1px solid #ccc;text-align:right">${(s.cast||[]).map(castNum).join(', ')||'—'}</td></tr>`;
    }).join('');
    return`<div style="page-break-inside:avoid;margin-bottom:14px">
      <div style="background:#2a1414;color:#fff;padding:8px 14px;font-family:Georgia,serif;font-size:14px">START SHOOT DAY ${d.dayNumber}${d.date?` (${d.date})`:''}</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;font-family:Arial">${rows||`<tr><td style="padding:8px">No scenes assigned.</td></tr>`}</table>
      <div style="background:#666;color:#fff;padding:6px 14px;font-size:11px;font-family:Arial">End of Shooting Day ${d.dayNumber}${cast.length?` — Cast: ${cast.join(', ')}`:''}</div>
    </div>`;
  }).join('');
  const html=`<!DOCTYPE html><html><head><title>Schedule — ${project.name}</title></head><body style="margin:0;font-family:Arial;background:#fff;padding:24px">
    <h1 style="font-family:Georgia,serif;font-size:20px;margin:0 0 4px">${project.name} — Shooting Schedule</h1>
    <div style="font-size:11px;color:#666;margin-bottom:14px">Cast: ${castList||'—'}</div>
    ${dayBlocks}
    <div class="np" style="margin-top:20px;text-align:center"><button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 22px;font-size:13px;font-weight:700;cursor:pointer;border-radius:6px">Print / Save as PDF</button></div>
  </body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};
/* Client-side PDF text extraction. Screenplay text is tiny compared to the raw PDF binary —
   extracting it in the browser avoids Vercel's 4.5MB serverless function payload limit, which
   is the actual cause of "large script fails to upload" (base64-encoding a ~3.3MB+ PDF pushes
   the request over that limit). Falls back to sending the raw PDF only if extraction fails
   (e.g. a scanned/image-only script with no embedded text layer), and only for smaller files. */
let pdfjsLoadPromise=null;
const loadPdfjs=()=>{
  if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
  if(pdfjsLoadPromise)return pdfjsLoadPromise;
  pdfjsLoadPromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js';
    script.onload=()=>{
      window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    script.onerror=()=>reject(new Error('Could not load the PDF reader. Check your connection and try again.'));
    document.head.appendChild(script);
  });
  return pdfjsLoadPromise;
};
const extractPdfText=async file=>{
  const pdfjsLib=await loadPdfjs();
  const buf=await file.arrayBuffer();
  const pdf=await pdfjsLib.getDocument({data:buf}).promise;
  let text='';
  for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i);
    const content=await page.getTextContent();
    text+=content.items.map(it=>it.str).join(' ')+'\n\n';
  }
  return text.trim();
};
const callClaude=async(msgs,sys,maxTokens=8000)=>{
  const r=await fetch('/api/claude',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system:sys,messages:msgs,max_tokens:maxTokens})});
  if(!r.ok)throw new Error(`API ${r.status}`);
  const d=await r.json();
  return d.content?.map(c=>c.text||'').join('')||'';
};
/* Sorts scenes by scene number correctly (1,2,...,10,11 — not lexicographic 1,10,11,2).
   Falls back to string comparison for non-numeric labels like "Ep 1" or "OTV". */
const sortScenes=arr=>[...arr].sort((a,b)=>{
  const na=parseInt(String(a.sceneNumber||'').match(/\d+/)?.[0],10);
  const nb=parseInt(String(b.sceneNumber||'').match(/\d+/)?.[0],10);
  const va=isNaN(na)?Infinity:na,vb=isNaN(nb)?Infinity:nb;
  if(va!==vb)return va-vb;
  return String(a.sceneNumber||'').localeCompare(String(b.sceneNumber||''));
});
const recoverScenes=raw=>{
  let s=raw.replace(/```json/gi,'').replace(/```/g,'').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,'').trim();
  const a=s.indexOf('[');if(a===-1)return[];s=s.slice(a);
  try{const r=JSON.parse(s);if(Array.isArray(r))return r;}catch{}
  const scenes=[];let depth=0,start=-1;
  for(let i=0;i<s.length;i++){const c=s[i];if(c==='{'){if(!depth)start=i;depth++;}else if(c==='}'){depth--;if(!depth&&start!==-1){try{const o=JSON.parse(s.slice(start,i+1));if(o.sceneNumber||o.heading)scenes.push(o);}catch{}start=-1;}}}
  return scenes;
};
/* Recover a script budget from Claude's JSON response, tolerating truncation (hit token limit)
   or stray syntax issues — salvages every complete line item it can find rather than failing outright. */
const recoverBudget=raw=>{
  let s=raw.replace(/```json/gi,'').replace(/```/g,'').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,'').trim();
  const start=s.indexOf('{');if(start===-1)return null;
  s=s.slice(start);
  try{
    const end=s.lastIndexOf('}');
    if(end!==-1){
      const parsed=JSON.parse(s.slice(0,end+1));
      if(parsed&&Array.isArray(parsed.budget)&&parsed.budget.length)return{...parsed,truncated:false};
    }
  }catch{}
  const titleMatch=s.match(/"title"\s*:\s*"([^"]*)"/);
  const summaryMatch=s.match(/"summary"\s*:\s*"([^"]*)"/);
  const budgetIdx=s.indexOf('"budget"');
  const items=[];
  if(budgetIdx!==-1){
    const arrStart=s.indexOf('[',budgetIdx);
    if(arrStart!==-1){
      let depth=0,itemStart=-1;
      for(let i=arrStart;i<s.length;i++){
        const c=s[i];
        if(c==='{'){if(!depth)itemStart=i;depth++;}
        else if(c==='}'){depth--;if(!depth&&itemStart!==-1){try{const o=JSON.parse(s.slice(itemStart,i+1));if(o.description||o.dept)items.push(o);}catch{}itemStart=-1;}}
      }
    }
  }
  if(!items.length)return null;
  return{
    title:titleMatch?titleMatch[1]:'Script budget',
    budget:items,
    summary:summaryMatch?summaryMatch[1]:`Recovered ${items.length} line item${items.length!==1?'s':''} — the response was cut off, so some later lines may be missing. Re-run on a shorter script excerpt for a complete budget.`,
    truncated:true,
  };
};
const useIsMobile=(bp=640)=>{const[m,setM]=useState(()=>window.innerWidth<bp);useEffect(()=>{const h=()=>setM(window.innerWidth<bp);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h);},[bp]);return m;};
/* Keyword safety net — used only if the AI ever returns a department outside the DEPTS list */
/* Hard override — some keywords are unambiguous enough that they should win regardless of what
   department the AI claims, since the AI sometimes returns a VALID department that is simply wrong
   (e.g. filing cast members under Production Team). Checked before trusting the AI's own dept value. */
const forceDeptOverride=(desc='')=>{
  const t=desc.toLowerCase();
  if(/\bcast\b/.test(t))return'F - Talents';
  if(/\bextras?\b/.test(t))return'F - Talents';
  if(/\bactor\b|\bactress\b|\bperformer\b/.test(t))return'F - Talents';
  if(/^lead\s*-|^supporting\s*-|^background\s*-/.test(t))return'F - Talents';
  if(/\bwrestl/.test(t))return'F - Talents';
  if(/\britual performer/.test(t))return'F - Talents';
  if(/\bcostume\b|\bwardrobe\b|\btailor\b|\bdry clean/.test(t))return'P - Wardrobe';
  if(/\bmakeup\b|\bmake-up\b|\bhair styl|\bbody paint/.test(t))return'Q - Makeup & Hair';
  if(/\bstunt\b|\bpyro|\bfight choreo|\bsfx makeup|\bprop fabrication/.test(t))return'R - SFX & Stunts';
  return null;
};
const smartDeptFallback=(desc='',rawDept='')=>{
  const t=`${desc} ${rawDept}`.toLowerCase();
  const has=(...words)=>words.some(w=>t.includes(w));
  if(has('actor','cast','talent','extra','performer','lead','supporting','ritual','wrestl'))return'F - Talents';
  if(has('costume','wardrobe','tailor','stylist','dry clean'))return'P - Wardrobe';
  if(has('makeup','make-up','hair','wig','body paint'))return'Q - Makeup & Hair';
  if(has('stunt','sfx','special effect','pyro','fight choreo','armour','weapon prop','python prop','mask'))return'R - SFX & Stunts';
  if(has('director','dop','director of photography','1st ad','2nd ad','3rd ad','script supervisor','continuity','dialect','language coach'))return'E - Creative Team';
  if(has('camera operator','focus puller','grip','1st ac','2nd ac','drone operator','steadicam'))return'G - Camera & Grip Team';
  if(has('camera','lens','tripod','crane','gimbal'))return'H - Camera & Grip Equipment';
  if(has('gaffer','electric','lighting tech'))return'I - Light & Power Team';
  if(has('light','generator','genny'))return'J - Light & Power Equipment';
  if(has('sound recordist','boom','mixer','sound engineer'))return'K - Sound Team';
  if(has('mic','recorder'))return'L - Sound Equipment';
  if(has('production designer','art director','props master','set dresser'))return'M - Art Team';
  if(has('set construction','prop purchase','prop rental','set dressing'))return'N - Set & Prop Expenses';
  if(has('location'))return'O - Location';
  if(has('feeding','food','accommodation','welfare','medic','water'))return'T - Hospitality & Welfare';
  if(has('editor','colorist','vfx','sound design','composer'))return'W - Post-Production Team';
  if(has('poster','publicity','marketing','press','social media'))return'Y - PR & Marketing';
  if(has('producer','production manager','unit manager','accountant'))return'D - Production Team';
  return'D - Production Team';
};

/* ── Atoms ── */
const NAV=[{id:'dashboard',e:'🎬',l:'Dashboard'},{id:'budgets',e:'📊',l:'Budgets'},{id:'breakdown',e:'📋',l:'Breakdown'},{id:'workspace',e:'🗓️',l:'Schedules and Call Sheets'},{id:'recon',e:'🧾',l:'Recon'},{id:'payments',e:'💳',l:'Payments'},{id:'market',e:'🏪',l:'Marketplace'},{id:'ai',e:'✦',l:'AI Builder'}];
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
function ExportMenu({onPdf,onExcel}){
  const[open,setOpen]=useState(false);
  const ref=useRef();
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);
  },[]);
  const item={display:'block',width:'100%',textAlign:'left',padding:'10px 14px',background:'none',border:'none',color:T.cream,fontSize:13,cursor:'pointer',fontFamily:'Manrope,sans-serif'};
  return(
    <div ref={ref} style={{position:'relative',display:'inline-block'}}>
      <Btn variant="outline" size="sm" onClick={()=>setOpen(o=>!o)}>⬇️ Export ▾</Btn>
      {open&&<div style={{position:'absolute',top:'110%',left:0,background:T.panel,border:`1px solid ${T.line}`,borderRadius:8,overflow:'hidden',zIndex:20,minWidth:200,boxShadow:'0 4px 16px rgba(0,0,0,.4)'}}>
        <button onClick={()=>{onPdf();setOpen(false);}} style={item}>📄 PDF Document</button>
        <button onClick={()=>{onExcel();setOpen(false);}} style={{...item,borderTop:`1px solid ${T.line}`}}>📊 Excel Spreadsheet (.xlsx)</button>
      </div>}
    </div>
  );
}
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
  const{t}=useLang();
  const[mode,setMode]=useState('login');const[email,setEmail]=useState('');const[pass,setPass]=useState('');const[err,setErr]=useState('');const[ok,setOk]=useState('');const[showPass,setShowPass]=useState(false);
  const submit=async()=>{setErr('');setOk('');
    const fn=mode==='login'?sb.auth.signInWithPassword:sb.auth.signUp;
    const{error}=await fn.call(sb.auth,{email,password:pass});
    if(error){
      const readable=typeof error.message==='string'&&error.message.trim()&&error.message.trim()!=='{}'?error.message:'Something went wrong on our end. Please try again in a moment, or contact support if this keeps happening.';
      setErr(readable);
    }else if(mode==='signup')setOk('Check your email to confirm your account.');
  };
  const forgotPassword=async()=>{
    setErr('');setOk('');
    if(!email){setErr('Enter your email above first, then tap Forgot password.');return;}
    const{error}=await sb.auth.resetPasswordForEmail(email);
    if(error)setErr(error.message);else setOk('Password reset link sent — check your email.');
  };
  return(
    <div style={{minHeight:'100vh',background:T.ink,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:'100%',maxWidth:380,background:T.panel,border:`1px solid ${T.line}`,borderRadius:14,padding:32}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:10}}><LangToggle compact/></div>
        <div style={{fontFamily:'Fraunces,serif',fontSize:30,color:T.gold,textAlign:'center',marginBottom:4}}>NKÒ</div>
        <div style={{fontSize:11,color:T.goldDim,textAlign:'center',fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.14em',marginBottom:28}}>{t('tagline')}</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <Inp type="email" placeholder={t('emailPlaceholder')} value={email} onChange={e=>setEmail(e.target.value)}/>
          <div style={{position:'relative'}}>
            <Inp type={showPass?'text':'password'} placeholder={t('passwordPlaceholder')} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} style={{paddingRight:56}}/>
            <button type="button" onClick={()=>setShowPass(s=>!s)} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:T.goldDim,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Manrope,sans-serif'}}>{showPass?t('hide'):t('show')}</button>
          </div>
          {mode==='login'&&<button onClick={forgotPassword} style={{background:'none',border:'none',color:T.goldDim,fontSize:12,cursor:'pointer',fontFamily:'Manrope,sans-serif',textAlign:'right',padding:0}}>{t('forgotPassword')}</button>}
          {err&&<div style={{fontSize:12,color:T.coral,fontFamily:'Manrope,sans-serif'}}>{err}</div>}
          {ok&&<div style={{fontSize:12,color:T.sage,fontFamily:'Manrope,sans-serif'}}>{ok}</div>}
          <Btn onClick={submit}>{mode==='login'?t('signIn'):t('createAccount')}</Btn>
          <button onClick={()=>{setMode(m=>m==='login'?'signup':'login');setErr('');setOk('');}} style={{background:'none',border:'none',color:T.goldDim,fontSize:12,cursor:'pointer',fontFamily:'Manrope,sans-serif'}}>{mode==='login'?t('noAccountSignUp'):t('haveAccountSignIn')}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Navigation ── */
const NAV_KEY={dashboard:'navDashboard',budgets:'navBudgets',breakdown:'navBreakdown',workspace:'navWorkspace',recon:'navRecon',payments:'navPayments',market:'navMarketplace',ai:'navAI'};
function LangToggle({compact}){
  const{lang,setLang}=useLang();
  return(
    <div style={{display:'flex',border:`1px solid ${T.line}`,borderRadius:6,overflow:'hidden',flexShrink:0}}>
      {['en','fr'].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:compact?'4px 8px':'5px 10px',background:lang===l?T.gold:'transparent',color:lang===l?T.ink:T.dim,border:'none',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Manrope,sans-serif'}}>{l.toUpperCase()}</button>)}
    </div>
  );
}
function Sidebar({view,setView,onSignOut,userEmail}){
  const{t}=useLang();
  return(
    <div style={{width:210,minHeight:'100vh',background:T.panel,borderRight:`1px solid ${T.line}`,display:'flex',flexDirection:'column',flexShrink:0}}>
      <div style={{padding:'22px 18px 14px'}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.gold,fontWeight:700}}>NKÒ</div>
        <div style={{fontSize:9,color:T.goldDim,fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',marginTop:2}}>{t('tagline')}</div>
      </div>
      <FS/>
      <nav style={{flex:1,padding:'14px 10px'}}>
        {NAV.map(n=>{const on=view===n.id;return<button key={n.id} onClick={()=>setView(n.id)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',cursor:'pointer',background:on?T.goldGlow:'transparent',color:on?T.gold:T.dim,fontFamily:'Manrope,sans-serif',fontSize:13,fontWeight:600,textAlign:'left',marginBottom:2,borderLeft:`2px solid ${on?T.gold:'transparent'}`}}><span style={{fontSize:15}}>{n.e}</span>{t(NAV_KEY[n.id])}</button>;})}
      </nav>
      <div style={{padding:'14px 16px',borderTop:`1px solid ${T.line}`}}>
        <div style={{marginBottom:12}}><LangToggle/></div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:T.hi,border:`1px solid ${T.goldDim}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:T.gold,fontWeight:700,fontFamily:'Manrope,sans-serif',flexShrink:0}}>{userEmail?.charAt(0).toUpperCase()||'?'}</div>
          <div style={{overflow:'hidden'}}><div style={{fontSize:11,color:T.cream,fontFamily:'Manrope,sans-serif',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t('studio')}</div><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userEmail}</div></div>
        </div>
        <Btn variant="ghost" size="sm" onClick={onSignOut} style={{width:'100%'}}>{t('signOut')}</Btn>
      </div>
    </div>
  );
}
function TopBar({view,setView,projects,currentId,onSelect,onCreate}){
  const{t}=useLang();
  return(
    <div style={{background:T.panel,borderBottom:`1px solid ${T.line}`,padding:'10px 20px',display:'flex',alignItems:'center',gap:10}}>
      {view!=='dashboard'&&<Btn variant="ghost" size="sm" onClick={()=>setView('dashboard')}>{t('back')}</Btn>}
      <Sel value={currentId||''} onChange={e=>onSelect(e.target.value||null)} style={{flex:1,maxWidth:280}}>
        <option value="">{t('selectProduction')}</option>
        {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </Sel>
      <Btn onClick={onCreate} size="sm">{t('newBtn')}</Btn>
      <LangToggle compact/>
    </div>
  );
}
function MobileNav({view,setView}){
  const{t}=useLang();
  return(
    <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:50,background:T.panel,borderTop:`1px solid ${T.line}`,display:'flex',overflowX:'auto'}}>
      {NAV.map(n=>{const on=view===n.id;const lbl=t(NAV_KEY[n.id]);return<button key={n.id} onClick={()=>setView(n.id)} style={{flex:'0 0 auto',padding:'8px 12px 6px',border:'none',background:on?T.goldGlow:'transparent',color:on?T.gold:T.dim,display:'flex',flexDirection:'column',alignItems:'center',gap:2,fontSize:9,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',cursor:'pointer'}}><span style={{fontSize:18}}>{n.e}</span>{lbl.split(' ')[0]}</button>;})}
    </div>
  );
}

/* ── New Project Modal ── */
function NewProjectModal({onClose,onCreate,defaultCurrency='NGN'}){
  const[name,setName]=useState('');const[type,setType]=useState(PROJ_TYPES[0]);const[cur,setCur]=useState(defaultCurrency);
  const create=async()=>{if(name)await onCreate({name,type,base_currency:cur});};
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(20,20,20,.88)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:100}}>
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
function DashboardView({projects,budgetItems,advances,reconEntries,payees,currentId,onSelect,onCreate,onDelete,showModal,setShowModal,defaultCurrency}){
  const{t}=useLang();
  const[confirmDel,setConfirmDel]=useState(null);const[selected,setSelected]=useState(new Set());const[confirmMulti,setConfirmMulti]=useState(false);
  const toggle=id=>{const n=new Set(selected);n.has(id)?n.delete(id):n.add(id);setSelected(n);};
  const unpaid=payees.filter(p=>{const paid=(p.payments||[]).reduce((s,x)=>s+x.amount,0);return paid<p.agreed_fee;}).length;
  const advCurrency=id=>advances.find(a=>a.id===id)?.currency||'NGN';
  const totalBudgetUSD=budgetItems.reduce((s,i)=>s+toUSD(lTot(i),i.currency),0);
  const totalSpentUSD=reconEntries.filter(e=>!e.description?.startsWith('[CASH-IN]')).reduce((s,e)=>s+toUSD(Number(e.amount)||0,advCurrency(e.advance_id)),0);
  const savedUSD=totalBudgetUSD-totalSpentUSD;
  return(
    <div>
      <div style={{marginBottom:22}}><div style={{fontFamily:'Fraunces,serif',fontSize:32,color:T.gold}}>NKÒ</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>{t('dashHeaderTagline')}</div><div style={{marginTop:16}}><FS/></div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:24}}>
        <StatCard label={t('statProductions')} value={projects.length} sub={t('statActive')}/>
        <StatCard label={t('statTotalSpend')} value={`≈ $${fmt(totalSpentUSD)}`} sub={t('statAcrossSlate')}/>
        <StatCard label={t('statTotalSaved')} value={`≈ $${fmt(Math.abs(savedUSD))}`} sub={savedUSD<0?t('statOverBudget'):t('statUnderBudget')} accent={savedUSD<0?T.coral:T.sage}/>
        <StatCard label={t('statUnpaid')} value={unpaid} sub={t('statCastCrew')} accent={unpaid>0?T.coral:T.sage}/>
      </div>
      {confirmDel&&<div style={{position:'fixed',inset:0,background:'rgba(20,20,20,.9)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:100}}><div style={{background:T.panel,border:`1px solid ${T.coral}`,borderRadius:12,padding:26,maxWidth:360,textAlign:'center'}}><div style={{fontFamily:'Fraunces,serif',fontSize:17,color:T.cream,marginBottom:8}}>Delete "{confirmDel.name}"?</div><div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:16}}>All budget lines, advances and payments will be deleted.</div><div style={{display:'flex',gap:8,justifyContent:'center'}}><Btn variant="danger" onClick={async()=>{await onDelete([confirmDel.id]);setConfirmDel(null);}}>{t('deleteWord')}</Btn><Btn variant="ghost" onClick={()=>setConfirmDel(null)}>{t('cancel')}</Btn></div></div></div>}
      {confirmMulti&&<div style={{position:'fixed',inset:0,background:'rgba(20,20,20,.9)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:100}}><div style={{background:T.panel,border:`1px solid ${T.coral}`,borderRadius:12,padding:26,maxWidth:360,textAlign:'center'}}><div style={{fontFamily:'Fraunces,serif',fontSize:17,color:T.cream,marginBottom:8}}>Delete {selected.size} productions?</div><div style={{display:'flex',gap:8,justifyContent:'center',marginTop:12}}><Btn variant="danger" onClick={async()=>{await onDelete([...selected]);setSelected(new Set());setConfirmMulti(false);}}>Delete all</Btn><Btn variant="ghost" onClick={()=>setConfirmMulti(false)}>{t('cancel')}</Btn></div></div></div>}
      {projects.length===0?<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:12,padding:44,textAlign:'center'}}><div style={{fontSize:36,marginBottom:12}}>🎬</div><div style={{fontFamily:'Fraunces,serif',fontSize:20,color:T.cream,marginBottom:8}}>{t('noProductionsYet')}</div><div style={{color:T.dim,fontSize:13,marginBottom:20,fontFamily:'Manrope,sans-serif'}}>{t('createFirstDesc')}</div><Btn onClick={()=>setShowModal(true)}>{t('createFirstBtn')}</Btn></div>:(
      <>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14,flexWrap:'wrap',gap:8}}>
          <div style={{fontFamily:'Fraunces,serif',fontSize:18,color:T.cream}}>{t('productionsHeader')}</div>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            {selected.size>0&&<><span style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{selected.size} selected</span><Btn size="sm" variant="ghost" onClick={()=>setSelected(new Set())}>Clear</Btn><Btn size="sm" variant="danger" onClick={()=>setConfirmMulti(true)}>🗑️ Delete</Btn></>}
            {selected.size===0&&projects.length>1&&<Btn size="sm" variant="ghost" onClick={()=>setSelected(new Set(projects.map(p=>p.id)))}>Select all</Btn>}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
          {projects.map(p=>{
            const pi=budgetItems.filter(i=>i.project_id===p.id);const totals={};pi.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
            const open=advances.filter(a=>a.project_id===p.id&&a.status!=='reconciled').length;const isSel=selected.has(p.id);
            const pAdvIds=advances.filter(a=>a.project_id===p.id).map(a=>a.id);
            const spentTotals={};reconEntries.filter(e=>pAdvIds.includes(e.advance_id)&&!e.description?.startsWith('[CASH-IN]')).forEach(e=>{const c=advCurrency(e.advance_id);spentTotals[c]=(spentTotals[c]||0)+(Number(e.amount)||0);});
            const budgetUSD=pi.reduce((s,i)=>s+toUSD(lTot(i),i.currency),0);
            const spentUSD=reconEntries.filter(e=>pAdvIds.includes(e.advance_id)&&!e.description?.startsWith('[CASH-IN]')).reduce((s,e)=>s+toUSD(Number(e.amount)||0,advCurrency(e.advance_id)),0);
            const pct=budgetUSD>0?Math.min(100,(spentUSD/budgetUSD)*100):0;const over=spentUSD>budgetUSD;
          return<div key={p.id} style={{background:isSel?'rgba(224,107,82,.08)':p.id===currentId?T.hi:T.panel,border:`1px solid ${isSel?T.coral:p.id===currentId?T.gold:T.line}`,borderRadius:10,padding:18,position:'relative'}}>
            <button onClick={e=>{e.stopPropagation();toggle(p.id);}} style={{position:'absolute',top:12,right:12,width:18,height:18,borderRadius:4,border:`2px solid ${isSel?T.coral:T.faint}`,background:isSel?T.coral:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>{isSel&&<span style={{color:T.ink,fontSize:11,fontWeight:700}}>✓</span>}</button>
            <button onClick={()=>onSelect(p.id)} style={{background:'none',border:'none',cursor:'pointer',textAlign:'left',width:'100%',paddingRight:28}}>
              <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>{p.name}</div>
              <div style={{fontSize:10,color:T.goldDim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginTop:2,marginBottom:8}}>{p.type}</div>
              <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:13,color:T.cream,marginBottom:8}}>{Object.entries(totals).length===0?<span style={{color:T.faint}}>No budget yet</span>:Object.entries(totals).map(([c,a])=><div key={c}>{sym(c)}{fmt(a)}</div>)}</div>
              {budgetUSD>0&&<>
                <div style={{height:6,background:T.line,borderRadius:3,overflow:'hidden',marginBottom:6}}><div style={{width:`${pct}%`,height:'100%',background:over?T.coral:T.sage}}/></div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:T.dim,fontFamily:'IBM Plex Mono,monospace',marginBottom:8}}>
                  <span>{Object.entries(spentTotals).length===0?'No spend yet':Object.entries(spentTotals).map(([c,a])=>`${sym(c)}${fmt(a)}`).join(' · ')}</span>
                  <span style={{color:over?T.coral:T.sage}}>{over?'Over pace':`${Math.round(pct)}%`}</span>
                </div>
              </>}
              <div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{pi.length} lines · {open} open advances</div>
            </button>
            <button onClick={e=>{e.stopPropagation();setConfirmDel(p);}} style={{position:'absolute',bottom:12,right:12,background:'none',border:'none',cursor:'pointer',color:T.faint,fontSize:14}}>🗑️</button>
          </div>;})}
        </div>
      </>
      )}
      {showModal&&<NewProjectModal onClose={()=>setShowModal(false)} onCreate={async(d)=>{const ok=await onCreate(d);if(ok)setShowModal(false);}} defaultCurrency={defaultCurrency}/>}
    </div>
  );
}

/* ── Per-production Dashboard — shown when a production is selected ── */
function ProductionDashboardView({project,items,advances,payees,onBack}){
  const{t}=useLang();
  const totals={};items.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
  const openAdv=advances.filter(a=>a.status!=='reconciled').length;
  const unpaid=payees.filter(p=>{const paid=(p.payments||[]).reduce((s,x)=>s+x.amount,0);return paid<p.agreed_fee;}).length;
  return(
    <div>
      <button onClick={onBack} style={{background:'none',border:'none',color:T.goldDim,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Manrope,sans-serif',marginBottom:14,padding:0}}>{t('allProductions')}</button>
      <div style={{marginBottom:22}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:28,color:T.cream}}>{project.name}</div>
        <div style={{fontSize:11,color:T.goldDim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginTop:4}}>{project.type}</div>
        <div style={{fontSize:13,color:T.dim,marginTop:6,fontFamily:'Manrope,sans-serif'}}>{t('productionDashboard')}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10}}>
        <StatCard label={t('statTotalBudget')} value={Object.entries(totals).length===0?'—':Object.entries(totals).map(([c,a])=>`${sym(c)}${fmt(a)}`).join(' · ')} sub={project.base_currency}/>
        <StatCard label={t('statBudgetLines')} value={items.length} sub={t('statThisProduction')}/>
        <StatCard label={t('statOpenAdvances')} value={openAdv} sub={t('statPending')} accent={openAdv>0?T.coral:T.sage}/>
        <StatCard label={t('statUnpaidCrew')} value={unpaid} sub={t('statCastCrew')} accent={unpaid>0?T.coral:T.sage}/>
      </div>
    </div>
  );
}
/* ── Budgets ── */
function DeptSection({dept,items,onAdd,onUpdate,onRemove}){
  const[open,setOpen]=useState(true);const mob=useIsMobile();
  const totals={};items.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
  const ts=Object.entries(totals).map(([c,a])=>`${sym(c)}${fmt(a)}`).join(' · ')||'—';
  const usdTotal=items.reduce((s,i)=>s+toUSD(lTot(i),i.currency),0);
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,overflow:'hidden',marginBottom:8}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span><span style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>{dept}</span><span style={{fontSize:11,color:T.faint,fontFamily:'Manrope,sans-serif'}}>({items.length})</span></div>
        <div style={{textAlign:'right'}}>
          <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:13,color:T.gold}}>{ts}</div>
          {items.length>0&&<div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:T.dim}}>≈ ${fmt(usdTotal)}</div>}
        </div>
      </button>
      {open&&<div style={{borderTop:`1px solid ${T.line}`,padding:'4px 12px 14px'}}>
        {!mob&&items.length>0&&<div style={{display:'grid',gridTemplateColumns:'2fr 52px 80px 100px 120px 56px 20px',gap:4,padding:'8px 0 4px',fontSize:9,color:T.faint,fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase'}}><span>Description</span><span>Qty</span><span>Unit</span><span>Unit cost</span><span style={{textAlign:'right'}}>Line total</span><span>Cur</span><span/></div>}
        {items.map(item=>{const usd=toUSD(lTot(item),item.currency);return<div key={item.id} style={{padding:mob?'14px 0':'8px 0',borderBottom:`1px solid ${T.line}`}}>
          {mob?<>
            <div style={{display:'flex',gap:8,marginBottom:10}}>
              <Inp value={item.description||''} placeholder="Description" onChange={e=>onUpdate(item.id,{description:e.target.value})} style={{flex:1}}/>
              <button onClick={()=>onRemove(item.id)} style={{color:T.faint,fontSize:20,cursor:'pointer',background:'none',border:'none',flexShrink:0,width:28}}>×</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
              <div><div style={{fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif',marginBottom:4}}>Qty</div><Inp type="number" min="0" value={item.qty} onChange={e=>onUpdate(item.id,{qty:e.target.value})} style={{fontSize:13}}/></div>
              <div><div style={{fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif',marginBottom:4}}>Unit</div><Sel value={item.unit} onChange={e=>onUpdate(item.id,{unit:e.target.value})} style={{width:'100%',fontSize:13}}>{UNITS.map(u=><option key={u}>{u}</option>)}</Sel></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
              <div><div style={{fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif',marginBottom:4}}>Unit cost</div><Inp type="number" min="0" value={item.rate} onChange={e=>onUpdate(item.id,{rate:e.target.value})} style={{fontFamily:'IBM Plex Mono,monospace',fontSize:13}}/></div>
              <div><div style={{fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif',marginBottom:4}}>Currency</div><Sel value={item.currency} onChange={e=>onUpdate(item.id,{currency:e.target.value})} style={{width:'100%',fontSize:13}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</Sel></div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:14,color:T.gold,fontWeight:700}}>Line total: {sym(item.currency)}{fmt(lTot(item))}</div>
              <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11,color:T.dim}}>≈ ${fmt(usd)}</div>
            </div>
          </>:<>
            <div style={{display:'grid',gridTemplateColumns:'2fr 52px 80px 100px 120px 56px 20px',gap:4,alignItems:'center'}}>
              <Inp value={item.description||''} placeholder="Description" onChange={e=>onUpdate(item.id,{description:e.target.value})}/>
              <Inp type="number" min="0" value={item.qty} onChange={e=>onUpdate(item.id,{qty:e.target.value})} style={{fontSize:12}}/>
              <Sel value={item.unit} onChange={e=>onUpdate(item.id,{unit:e.target.value})} style={{width:'100%',fontSize:11}}>{UNITS.map(u=><option key={u}>{u}</option>)}</Sel>
              <Inp type="number" min="0" value={item.rate} onChange={e=>onUpdate(item.id,{rate:e.target.value})} style={{fontFamily:'IBM Plex Mono,monospace',fontSize:12}}/>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:13,color:T.gold,fontWeight:700}}>{sym(item.currency)}{fmt(lTot(item))}</div>
                <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:T.dim}}>≈ ${fmt(usd)}</div>
              </div>
              <Sel value={item.currency} onChange={e=>onUpdate(item.id,{currency:e.target.value})} style={{width:'100%',fontSize:10}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</Sel>
              <button onClick={()=>onRemove(item.id)} style={{color:T.faint,fontSize:18,cursor:'pointer',background:'none',border:'none'}}>×</button>
            </div>
          </>}
        </div>;})}
        <button onClick={()=>onAdd(dept)} style={{marginTop:10,color:T.gold,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>+ Add line</button>
      </div>}
    </div>
  );
}
/* ── Production Info — title-page metadata like a real budget document ── */
const PI_FIELDS=[
  ['producer','Producer'],['lineProducer','Line Producer'],['execProducer','Executive Producer'],['preparedBy','Prepared By'],
  ['prepStart','Pre-production Start'],['prepEnd','Pre-production End'],
  ['shootStart','Shoot Commencement'],['shootEnd','Wrap Date'],
  ['postStart','Post-production Start'],['postEnd','Post-production End'],
];
/* ── Phase Cost Summary — manual input for pre/production/post totals ── */
function PhaseCostPanel({project,items}){
  const{t}=useLang();
  const preDepts=['A - Research & Development','B - Script & Story','C - Pre-Production Expenses'];
  const postDepts=['W - Post-Production Team','X - Post-Production Expenses'];
  const prodDepts=PHASES[1].depts;
  let autoPre=0,autoProd=0,autoContingency=0,autoPost=0;
  items.forEach(i=>{
    const t=lTot(i);
    if(/contingency/i.test(i.description||'')){autoContingency+=t;return;}
    if(preDepts.includes(i.dept))autoPre+=t;
    else if(prodDepts.includes(i.dept))autoProd+=t;
    else if(postDepts.includes(i.dept))autoPost+=t;
  });
  const[costs,setCosts]=useState({pre:'',prod:'',contingency:'',post:''});
  const[isAuto,setIsAuto]=useState(true);
  useEffect(()=>{
    if(!project)return;
    let saved=null;
    try{saved=JSON.parse(localStorage.getItem(`nko_phasecost_${project.id}`)||'null');}catch{}
    if(saved&&saved.manualOverride){
      setCosts({pre:saved.pre||'',prod:saved.prod||'',contingency:saved.contingency||'',post:saved.post||''});
      setIsAuto(false);
    }else{
      setCosts({pre:String(autoPre||''),prod:String(autoProd||''),contingency:String(autoContingency||''),post:String(autoPost||'')});
      setIsAuto(true);
    }
  },[project?.id,autoPre,autoProd,autoContingency,autoPost]);
  const set=(k,v)=>{const upd={...costs,[k]:v};setCosts(upd);setIsAuto(false);localStorage.setItem(`nko_phasecost_${project.id}`,JSON.stringify({...upd,manualOverride:true}));};
  const resetToAuto=()=>{localStorage.removeItem(`nko_phasecost_${project.id}`);setCosts({pre:String(autoPre||''),prod:String(autoProd||''),contingency:String(autoContingency||''),post:String(autoPost||'')});setIsAuto(true);};
  const total=(Number(costs.pre)||0)+(Number(costs.prod)||0)+(Number(costs.contingency)||0)+(Number(costs.post)||0);
  const cols=[['pre',t('preProduction')],['prod',t('productionPhase')],['contingency',t('contingency')],['post',t('postProduction')]];
  return(
    <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:16,marginBottom:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,flexWrap:'wrap',gap:6}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>{t('phaseCostSummary')}</div>
        {isAuto&&items.length>0&&<span style={{fontSize:10,color:T.sage,fontFamily:'Manrope,sans-serif',fontWeight:700}}>✓ Auto-calculated from budget</span>}
        {!isAuto&&<button onClick={resetToAuto} style={{fontSize:11,color:T.goldDim,background:'none',border:'none',cursor:'pointer',fontFamily:'Manrope,sans-serif',fontWeight:700}}>↺ Recalculate from budget</button>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10}}>
        {cols.map(([k,label])=><div key={k}>
          <div style={{fontSize:10,color:T.goldDim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>{label}</div>
          <Inp type="number" placeholder="0" value={costs[k]} onChange={e=>set(k,e.target.value)} style={{fontFamily:'IBM Plex Mono,monospace'}}/>
        </div>)}
        <div>
          <div style={{fontSize:10,color:T.sage,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>{t('total')}</div>
          <div style={{background:T.hi,border:`1px solid ${T.sage}`,borderRadius:6,padding:'8px 10px',color:T.sage,fontFamily:'IBM Plex Mono,monospace',fontSize:13,fontWeight:700}}>{fmt(total)}</div>
        </div>
      </div>
    </div>
  );
}

function ProductionInfoPanel({project}){
  const{t}=useLang();
  const[open,setOpen]=useState(false);const[info,setInfo]=useState({});const[saved,setSaved]=useState(false);
  useEffect(()=>{if(!project)return;try{const s=JSON.parse(localStorage.getItem(`nko_info_${project.id}`)||'{}');setInfo(s);setSaved(Object.keys(s).length>0);}catch{}},[project?.id]);
  const set=(k,v)=>setInfo(p=>({...p,[k]:v}));
  const save=()=>{localStorage.setItem(`nko_info_${project.id}`,JSON.stringify(info));setSaved(true);setOpen(false);};
  return(
    <div style={{background:T.panel,border:`1px solid ${saved?T.sage:T.line}`,borderRadius:10,marginBottom:12,overflow:'hidden'}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>📋 {t('productionInfo')} <span style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>— producer credits & phase dates</span></span>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>{saved&&<span style={{fontSize:11,color:T.sage,fontFamily:'Manrope,sans-serif',fontWeight:700}}>Set ✓</span>}<span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span></div>
      </button>
      {open&&<div style={{borderTop:`1px solid ${T.line}`,padding:16}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:8}}>
          {PI_FIELDS.map(([k,label])=><div key={k}><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',fontWeight:700,marginBottom:3}}>{label}</div><Inp type={k.includes('Start')||k.includes('End')?'date':'text'} value={info[k]||''} onChange={e=>set(k,e.target.value)}/></div>)}
        </div>
        <div style={{display:'flex',gap:8,marginTop:12}}><Btn size="sm" variant="sage" onClick={save}>Save info</Btn><Btn size="sm" variant="ghost" onClick={()=>setOpen(false)}>Cancel</Btn></div>
      </div>}
    </div>
  );
}

function BrandPanel({project}){
  const{t}=useLang();
  const[open,setOpen]=useState(false);const[cname,setCname]=useState('');const[ptitle,setPtitle]=useState('');const[logo,setLogo]=useState(null);const[accent,setAccent]=useState('#FEED61');const[saved,setSaved]=useState(false);const lr=useRef();
  useEffect(()=>{if(!project)return;try{const s=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');setCname(s.companyName||'');setPtitle(s.productionTitle||project.name||'');setLogo(s.logo||null);setAccent(s.accentColor||'#FEED61');setSaved(!!(s.companyName||s.logo));}catch{}},[project?.id]);
  const save=()=>{localStorage.setItem(`nko_brand_${project.id}`,JSON.stringify({companyName:cname,productionTitle:ptitle,logo,accentColor:accent}));setSaved(true);setOpen(false);};
  return(
    <div style={{background:T.panel,border:`1px solid ${saved?accent:T.line}`,borderRadius:10,marginBottom:18,overflow:'hidden'}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>{logo&&<img src={logo} style={{height:28,objectFit:'contain'}}/>}<div style={{width:10,height:10,borderRadius:'50%',background:accent}}/><span style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>{t('brandPanel')}</span></div>
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
    <div style={{position:'fixed',inset:0,background:'rgba(20,20,20,.92)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:100}}>
      <div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:12,padding:24,width:'100%',maxWidth:480,maxHeight:'80vh',overflow:'auto'}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:18,color:T.cream,marginBottom:4}}>{result.title||'Script budget'}</div>
        {result.truncated&&<div style={{background:'rgba(224,107,82,.12)',border:`1px solid ${T.coral}`,borderRadius:8,padding:'8px 12px',fontSize:11,color:T.coral,fontFamily:'Manrope,sans-serif',marginBottom:10}}>⚠️ Response was cut off — showing {result.budget.length} recovered line item{result.budget.length!==1?'s':''}. Review before applying, or re-run on a shorter excerpt for a complete budget.</div>}
        {result.summary&&<div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:16}}>{result.summary}</div>}
        <div style={{marginBottom:16}}>{(result.budget||[]).slice(0,12).map((item,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:`1px solid ${T.line}`,fontSize:12,fontFamily:'Manrope,sans-serif'}}><span style={{color:T.cream}}>{item.description}</span><span style={{color:T.gold,fontFamily:'IBM Plex Mono,monospace'}}>{sym(currency)}{fmt(item.rate*item.qty)}</span></div>)}</div>
        <div style={{display:'flex',gap:8}}><Btn onClick={onApply}>Apply to budget</Btn><Btn variant="ghost" onClick={onClose}>Discard</Btn></div>
      </div>
    </div>
  );
}
function ScriptUploader({project,onApplyBudget}){
  const{t}=useLang();
  const[state,setState]=useState('idle');const[err,setErr]=useState('');const[result,setResult]=useState(null);const fr=useRef();
  const process=async f=>{
    const isPDF=f.type==='application/pdf',isTxt=f.type==='text/plain'||f.name.endsWith('.txt')||f.name.endsWith('.fdx');
    if(!isPDF&&!isTxt){setErr('Upload a PDF, TXT or FDX file.');setState('error');return;}
    setState('reading');setErr('');
    try{
      let uc;
      if(isPDF){
        let extracted='';
        try{extracted=await extractPdfText(f);}catch{extracted='';}
        if(extracted&&extracted.length>200){
          uc=[{type:'text',text:`Script:\n\n${extracted.slice(0,300000)}\n\n${SCRIPT_PROMPT(project.base_currency)}`}];
        }else{
          const sizeMB=f.size/1024/1024;
          if(sizeMB>3.2)throw new Error(`This PDF looks like scanned pages with no selectable text, and is too large (${sizeMB.toFixed(1)}MB) to upload directly. Try exporting it as a text-based PDF, or paste the script into a .txt file instead.`);
          const b=await readB64(f);
          uc=[{type:'document',source:{type:'base64',media_type:'application/pdf',data:b}},{type:'text',text:SCRIPT_PROMPT(project.base_currency)}];
        }
      }else{
        const txt=await readTxt(f);
        uc=[{type:'text',text:`Script:\n\n${txt}\n\n${SCRIPT_PROMPT(project.base_currency)}`}];
      }
      setState('analyzing');
      const raw=await callClaude([{role:'user',content:uc}],SCRIPT_SYS,24000);
      const recovered=recoverBudget(raw);
      if(!recovered||!recovered.budget?.length)throw new Error('Could not read a budget from the response. Try again, or upload a shorter script excerpt.');
      setResult(recovered);setState('done');
    }catch(e){setErr(`Failed: ${e.message}`);setState('error');}
  };
  return(
    <>
      <div onClick={()=>(state==='idle'||state==='error')&&fr.current.click()} style={{border:`2px dashed ${state==='analyzing'?T.gold:T.line}`,borderRadius:10,padding:24,textAlign:'center',background:T.hi,cursor:(state==='idle'||state==='error')?'pointer':'default',marginBottom:18}}>
        <input ref={fr} type="file" accept=".pdf,.txt,.fdx" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f)process(f);}}/>
        {state==='idle'&&<><div style={{fontSize:24,marginBottom:8}}>📄</div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:4}}>{t('uploadScript')}</div><div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:10}}>PDF, TXT or FDX — NKÒ reads it and builds your budget</div><Btn variant="ghost" size="sm">{t('chooseFile')}</Btn></>}
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
  const info=JSON.parse(localStorage.getItem(`nko_info_${project.id}`)||'{}');
  const logoHtml=brand.logo?`<img src="${brand.logo}" style="height:40px;object-fit:contain"/>`:'';
  const infoRows=[['Producer',info.producer],['Line Producer',info.lineProducer],['Executive Producer',info.execProducer],['Prepared By',info.preparedBy],['Pre-production',info.prepStart&&`${info.prepStart} → ${info.prepEnd||''}`],['Shoot',info.shootStart&&`${info.shootStart} → ${info.shootEnd||''}`],['Post-production',info.postStart&&`${info.postStart} → ${info.postEnd||''}`]].filter(([,v])=>v);
  const infoBlock=infoRows.length?`<table style="width:100%;border-collapse:collapse;margin-bottom:18px;border:1px solid #3A3A3A;border-radius:8px;overflow:hidden">${infoRows.map(([k,v])=>`<tr><td style="padding:6px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;width:170px;background:#1C1C1E;border-bottom:1px solid #3A3A3A">${k}</td><td style="padding:6px 12px;font-size:12px;color:#F0E8D0;font-weight:600;background:#1C1C1E;border-bottom:1px solid #3A3A3A">${v}</td></tr>`).join('')}</table>`:'';
  const grand={};items.forEach(i=>{grand[i.currency]=(grand[i.currency]||0)+lTot(i);});
  const phaseSummary=PHASES.map(ph=>{
    const pi=items.filter(i=>ph.depts.includes(i.dept));
    const t={};pi.forEach(i=>{t[i.currency]=(t[i.currency]||0)+lTot(i);});
    const line=Object.entries(t).map(([cc,a])=>`${sym(cc)}${fmt(a)}`).join(' · ')||'—';
    return`<div style="flex:1;background:#1C1C1E;border:1px solid #3A3A3A;border-radius:8px;padding:10px;text-align:center"><div style="font-size:8px;color:#9A9080;text-transform:uppercase;letter-spacing:1px">${ph.name}</div><div style="font-size:13px;font-weight:700;font-family:monospace;color:#FEED61;margin-top:3px">${line}</div></div>`;
  }).join('');
  const deptBlocks=PHASES.map((ph,phIdx)=>{
    const phBlocks=ph.depts.map(d=>{
    const di=items.filter(i=>i.dept===d);if(!di.length)return'';
    const sub={};di.forEach(i=>{sub[i.currency]=(sub[i.currency]||0)+lTot(i);});
    const rows=di.map(i=>`<tr><td style="padding:5px 10px;font-size:11px;color:#F0E8D0;border-bottom:1px solid #3A3A3A">${i.description||'—'}</td><td style="padding:5px 10px;font-size:11px;color:#F0E8D0;text-align:center;border-bottom:1px solid #3A3A3A">${i.qty}</td><td style="padding:5px 10px;font-size:11px;color:#F0E8D0;text-align:center;border-bottom:1px solid #3A3A3A">${i.unit}</td><td style="padding:5px 10px;font-size:11px;color:#F0E8D0;text-align:right;font-family:monospace;border-bottom:1px solid #3A3A3A">${sym(i.currency)}${fmt(i.rate)}</td><td style="padding:5px 10px;font-size:11px;text-align:right;font-family:monospace;font-weight:600;color:#FEED61;border-bottom:1px solid #3A3A3A">${sym(i.currency)}${fmt(lTot(i))}</td></tr>`).join('');
    const subLine=Object.entries(sub).map(([cc,a])=>`${sym(cc)}${fmt(a)}`).join(' · ');
    return`<div style="margin-bottom:16px;page-break-inside:avoid"><div style="background:#1C1C1E;color:#FEED61;padding:7px 12px;font-size:12px;font-weight:700;border-radius:6px 6px 0 0;display:flex;justify-content:space-between;border:1px solid #3A3A3A;border-bottom:none"><span>${d}</span><span style="font-family:monospace">${subLine}</span></div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #3A3A3A;border-top:none"><tr style="background:#242424">${['Description','Qty','Unit','Rate','Total'].map((h,i)=>`<th style="padding:5px 10px;font-size:9px;color:#9A9080;text-transform:uppercase;text-align:${i>2?'right':i>0?'center':'left'}">${h}</th>`).join('')}</tr>${rows}</table></div>`;
    }).join('');
    if(!phBlocks)return'';
    return`<div style="margin-bottom:8px;${phIdx>0?'page-break-before:always;':''}"><div style="font-size:14px;font-weight:700;font-family:Georgia;color:#F0E8D0;border-bottom:2px solid #FEED61;padding-bottom:4px;margin-bottom:10px">${ph.name}</div>${phBlocks}</div>`;
  }).join('');
  const grandLine=Object.entries(grand).map(([cc,a])=>`${sym(cc)}${fmt(a)}`).join(' · ');
  const html=`<!DOCTYPE html><html><head><title>Budget — ${project.name}</title><style>@media print{.np{display:none}}body{margin:0;font-family:Arial;background:#141414}</style></head><body>
    <div class="np" style="background:#141414;padding:12px;text-align:center;border-bottom:1px solid #3A3A3A"><button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 24px;font-weight:700;cursor:pointer;border-radius:6px">Save as PDF</button><div style="color:#9A9080;font-size:11px;margin-top:6px">Save the PDF, then share via WhatsApp or email</div></div>
    <div style="max-width:700px;margin:0 auto;padding:26px;background:#141414">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #FEED61;padding-bottom:14px;margin-bottom:8px">
        <div><div style="font-size:22px;font-weight:700;font-family:Georgia;color:#F0E8D0">${brand.companyName||'NKÒ'}</div>
        <div style="font-size:11px;color:#8C852E;text-transform:uppercase;letter-spacing:1.5px">${project.type} · ${brand.productionTitle||project.name}</div>
        <div style="font-size:10px;color:#9A9080;margin-top:3px">Created ${new Date().getFullYear()}</div></div>${logoHtml}
      </div>
      ${infoBlock}
      <div style="background:#1C1C1E;border:1px solid #3A3A3A;border-radius:8px;padding:14px;text-align:center;margin-bottom:20px">
        <div style="font-size:9px;color:#9A9080;text-transform:uppercase;letter-spacing:1.5px">Grand Total</div>
        <div style="font-size:26px;font-weight:700;font-family:monospace;color:#FEED61;margin-top:3px">${grandLine||'—'}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:20px">${phaseSummary}</div>
      ${deptBlocks}
      <div style="text-align:center;font-size:10px;color:#5A5A5A;margin-top:18px">Generated by NKÒ — Budgets tailored just for you · nko-nko.vercel.app</div>
    </div></body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};

function BudgetsView({project,items,advances,reconEntries,onAdd,onUpdate,onRemove,onApplyTemplate,onApplyScript}){
  const{t:tr}=useLang();
  const[showTpl,setShowTpl]=useState(false);const mob=useIsMobile();
  if(!project)return<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>Select a production first.</div></div>;
  const pItems=items.filter(i=>i.project_id===project.id);
  const totals={};pItems.forEach(i=>{totals[i.currency]=(totals[i.currency]||0)+lTot(i);});
  const pAdv=advances.filter(a=>a.project_id===project.id);
  const totalAdv=pAdv.reduce((s,a)=>s+a.amount,0);
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>{tr('budgetHeader')} — {project.name}</div><div style={{marginTop:14}}><FS/></div></div>
      <PhaseCostPanel project={project} items={pItems}/>
      <ProductionInfoPanel project={project}/>
      <BrandPanel project={project}/>
      {Object.keys(totals).length>0&&<div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:16,marginBottom:18}}>
        <div style={{fontSize:10,color:T.goldDim,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>{tr('totalBudget')}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:20}}>{Object.entries(totals).map(([c,a])=><div key={c}><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:28,color:T.cream}}>{sym(c)}{fmt(a)}</div><div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{c}</div></div>)}</div>
        {totalAdv>0&&<div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif',marginTop:8}}>Advances issued: {sym(project.base_currency)}{fmt(totalAdv)}</div>}
      </div>}
      <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
        <Btn variant="outline" size="sm" onClick={()=>setShowTpl(!showTpl)}>{tr('templates')}</Btn>
        {pItems.length>0&&<ExportMenu onPdf={()=>budgetPDF(pItems,project,advances,reconEntries)} onExcel={()=>budgetExcel(pItems,project)}/>}
      </div>
      {showTpl&&<div style={{background:T.hi,border:`1px solid ${T.line}`,borderRadius:10,padding:16,marginBottom:18}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:12}}>Apply a template</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:8}}>
          {TEMPLATES.map(tpl=><button key={tpl.id} onClick={()=>{onApplyTemplate(tpl);setShowTpl(false);}} style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:8,padding:12,cursor:'pointer',textAlign:'left'}}><div style={{fontFamily:'Fraunces,serif',fontSize:13,color:T.cream}}>{tpl.label}</div><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',marginTop:3}}>{tpl.items.length} line items</div></button>)}
        </div>
      </div>}
      <ScriptUploader project={project} onApplyBudget={onApplyScript}/>
      {(()=>{
        const activeDepts=DEPTS.filter(d=>pItems.some(i=>i.dept===d));
        const emptyDepts=DEPTS.filter(d=>!activeDepts.includes(d));
        return(
          <>
            {activeDepts.map(d=>{const di=pItems.filter(i=>i.dept===d);return<DeptSection key={d} dept={d} items={di} onAdd={onAdd} onUpdate={onUpdate} onRemove={onRemove}/>;})}
            <Sel defaultValue="" onChange={e=>{if(e.target.value){onAdd(e.target.value);e.target.value='';}}} style={{width:'100%',marginTop:4}}>
              <option value="">{tr('addDepartment')}</option>
              {emptyDepts.map(d=><option key={d} value={d}>{d}</option>)}
            </Sel>
          </>
        );
      })()}
    </div>
  );
}

/* ── Recon ── */
function AdvanceCard({advance,entries,onUpdate,onAddEntry,onRemoveEntry,onTopUp}){
  const{t:tr}=useLang();
  const[show,setShow]=useState(false);const[eDesc,setEDesc]=useState('');const[eAmt,setEAmt]=useState('');const[eDate,setEDate]=useState(today());const[eCat,setECat]=useState('Miscellaneous');const[eRef,setERef]=useState('');const mob=useIsMobile();
  const cashIn=entries.filter(e=>e.description?.startsWith('[CASH-IN]')).reduce((s,e)=>s+(Number(e.amount)||0),0);
  const spent=entries.filter(e=>!e.description?.startsWith('[CASH-IN]')).reduce((s,e)=>s+(Number(e.amount)||0),0);
  const funds=Number(advance.amount)+cashIn;const bal=funds-spent;const pct=funds>0?Math.min(100,(spent/funds)*100):0;
  const sc=advance.status==='reconciled'?T.sage:bal<0?T.coral:T.gold;
  const save=()=>{if(eDesc&&eAmt){onAddEntry({advance_id:advance.id,description:`[${eCat}] ${eDesc}${eRef?` · Ref: ${eRef}`:''}`,amount:Number(eAmt),date:eDate});setEDesc('');setEAmt('');setERef('');setECat('Miscellaneous');}setShow(false);};
  return(
    <div style={{background:T.panel,border:`1px solid ${bal<0?T.coral:T.line}`,borderRadius:10,overflow:'hidden',marginBottom:12}}>
      <div style={{padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:mob?'wrap':'nowrap',gap:8}}>
        <div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>{advance.recipient}{advance.dept&&<span style={{color:T.dim,fontFamily:'Manrope,sans-serif',fontSize:13,fontWeight:400}}> · {advance.dept}</span>}</div><div style={{fontSize:11,color:T.dim,marginTop:2,fontFamily:'Manrope,sans-serif'}}>{advance.purpose||'No purpose'} · {advance.date_issued}</div></div>
        <div style={{textAlign:'right'}}><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:18,color:T.cream}}>{sym(advance.currency)}{fmt(advance.amount)}</div><Pill color={sc}>{advance.status==='reconciled'?'Reconciled':bal<0?'Overspent':bal===0?'Balanced':'Open'}</Pill></div>
      </div>
      <div style={{padding:'0 16px 10px'}}><div style={{height:6,borderRadius:3,background:T.ink,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:bal<0?T.coral:T.gold}}/></div><div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}><span>Spent {sym(advance.currency)}{fmt(spent)} · {Math.round(pct)}%</span><span style={{color:bal<0?T.coral:T.dim}}>{bal<0?`Over by ${sym(advance.currency)}${fmt(Math.abs(bal))}`:`Balance ${sym(advance.currency)}${fmt(bal)}`}</span></div></div>
      {entries.length>0&&<div style={{borderTop:`1px solid ${T.line}`,padding:'6px 16px'}}><div style={{fontSize:10,color:T.faint,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',padding:'4px 0'}}>Expense log</div>{entries.map(en=>{const isIn=en.description?.startsWith('[CASH-IN]');const cat=en.description?.match(/^\[([^\]]+)\]/)?.[1]||'';const desc=(en.description||'').replace(/^\[[^\]]+\]\s*/,'');return<div key={en.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${T.line}`,gap:8}}><div style={{flex:1}}>{cat&&<span style={{fontSize:9,background:isIn?'rgba(82,176,122,.2)':T.hi,color:isIn?T.sage:T.gold,borderRadius:4,padding:'1px 5px',marginRight:5,fontFamily:'Manrope,sans-serif',fontWeight:700}}>{isIn?'CASH IN':cat}</span>}<span style={{color:T.cream,fontFamily:'Manrope,sans-serif',fontSize:12}}>{desc}</span>{en.date&&<div style={{color:T.dim,fontSize:10,marginTop:1}}>{en.date}</div>}</div><div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}><span style={{fontFamily:'IBM Plex Mono,monospace',color:isIn?T.sage:T.cream,fontSize:12}}>{isIn?'+':''}{sym(advance.currency)}{fmt(en.amount)}</span><button onClick={()=>onRemoveEntry(en.id)} style={{color:T.faint,fontSize:16,cursor:'pointer',background:'none',border:'none'}}>×</button></div></div>;})}
        <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',fontSize:12,fontFamily:'Manrope,sans-serif'}}><span style={{color:T.dim}}>{entries.length} expense{entries.length!==1?'s':''}</span><span style={{fontFamily:'IBM Plex Mono,monospace',color:bal<0?T.coral:T.gold,fontWeight:700}}>{sym(advance.currency)}{fmt(spent)}</span></div>
      </div>}
      {show&&<div style={{padding:'10px 16px',borderTop:`1px solid ${T.line}`,background:T.hi,display:'flex',flexDirection:'column',gap:8}}>
        <Sel value={eCat} onChange={e=>setECat(e.target.value)} style={{width:'100%'}}>{EXPENSE_CATS.map(c=><option key={c}>{c}</option>)}</Sel>
        <Inp placeholder="What was spent on?" value={eDesc} onChange={e=>setEDesc(e.target.value)}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><Inp type="number" placeholder="Amount" value={eAmt} onChange={e=>setEAmt(e.target.value)}/><Inp type="date" value={eDate} onChange={e=>setEDate(e.target.value)}/></div>
        <Inp placeholder="Receipt / voucher ref (optional)" value={eRef} onChange={e=>setERef(e.target.value)}/>
        <div style={{display:'flex',gap:8}}><Btn size="sm" onClick={save}>Save</Btn><Btn size="sm" variant="ghost" onClick={()=>setShow(false)}>Cancel</Btn></div>
      </div>}
      {advance.status!=='reconciled'&&!show&&<div style={{padding:'8px 16px 12px',display:'flex',gap:14,flexWrap:'wrap'}}><button onClick={()=>setShow(true)} style={{color:T.gold,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>{tr('logExpense')}</button><button onClick={()=>{const extra=window.prompt(`Top up this advance — how much extra ${advance.currency} was given to ${advance.recipient}?`);if(extra&&Number(extra)>0)onTopUp(advance.id,Number(extra));}} style={{color:T.sapphire,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>{tr('topUp')}</button>{bal>=0&&<button onClick={()=>onUpdate(advance.id,{status:'reconciled'})} style={{color:T.sage,fontSize:12,fontWeight:700,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif'}}>{tr('reconcileBtn')}</button>}</div>}
      {advance.status!=='reconciled'&&!show&&bal<0&&<div style={{padding:'0 16px 12px',fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>Overspent — top up with new cash received, or remove a logged expense with the × button above.</div>}
    </div>
  );
}
/* ── Cost Report — budget vs actual by phase, using dept tag on advances ── */
function CostReportPanel({project,items,advances,reconEntries}){
  const{t:tr}=useLang();
  const advIds=advances.map(a=>a.id);
  const advCur=id=>advances.find(a=>a.id===id)?.currency||project.base_currency;
  const spendEntries=reconEntries.filter(e=>advIds.includes(e.advance_id)&&!e.description?.startsWith('[CASH-IN]'));
  const budgetByCur={};items.forEach(i=>{budgetByCur[i.currency]=(budgetByCur[i.currency]||0)+lTot(i);});
  const spentByCur={};spendEntries.forEach(e=>{const c=advCur(e.advance_id);spentByCur[c]=(spentByCur[c]||0)+(Number(e.amount)||0);});
  const budgetUSD=items.reduce((s,i)=>s+toUSD(lTot(i),i.currency),0);
  const spentUSD=spendEntries.reduce((s,e)=>s+toUSD(Number(e.amount)||0,advCur(e.advance_id)),0);
  const remainUSD=budgetUSD-spentUSD;
  const curs=[...new Set([...Object.keys(budgetByCur),...Object.keys(spentByCur),project.base_currency])];
  const fmtCur=obj=>curs.filter(c=>obj[c]).map(c=>`${sym(c)}${fmt(obj[c])}`).join(' · ')||`${sym(project.base_currency)}0`;
  const remainingByCur={};curs.forEach(c=>{remainingByCur[c]=(budgetByCur[c]||0)-(spentByCur[c]||0);});
  const untaggedSpentUSD=spendEntries.filter(e=>{const a=advances.find(x=>x.id===e.advance_id);return a&&!a.dept;}).reduce((s,e)=>s+toUSD(Number(e.amount)||0,advCur(e.advance_id)),0);
  if(items.length===0&&advances.length===0)return null;
  return(
    <div style={{marginBottom:22}}>
      <div style={{fontFamily:'Fraunces,serif',fontSize:17,color:T.cream,marginBottom:2}}>{tr('costReport')}</div>
      <div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:12}}>{tr('costReportSub')}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10,marginBottom:12}}>
        <StatCard label={tr('totalBudgetLbl')} value={fmtCur(budgetByCur)} sub={project.base_currency}/>
        <StatCard label={tr('actualSpentLbl')} value={fmtCur(spentByCur)} sub={project.base_currency}/>
        <StatCard label={tr('remainingLbl')} value={fmtCur(remainingByCur)} sub={remainUSD<0?tr('statOverBudget'):tr('statUnderBudget')} accent={remainUSD<0?T.coral:T.sage}/>
      </div>
      {untaggedSpentUSD>0&&<div style={{fontSize:11,color:T.goldDim,fontFamily:'Manrope,sans-serif',marginBottom:12,background:'rgba(254,237,97,.08)',border:`1px solid ${T.goldDim}`,borderRadius:8,padding:'8px 12px'}}>≈ ${fmt(untaggedSpentUSD)} spent on advances with no department set — tag them when issuing an advance for an accurate phase breakdown.</div>}
      <div style={{fontSize:10,color:T.goldDim,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10,fontFamily:'Manrope,sans-serif'}}>{tr('byPhase')}</div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {PHASES.map(ph=>{
          const bItems=items.filter(i=>ph.depts.includes(i.dept));
          const bByCur={};bItems.forEach(i=>{bByCur[i.currency]=(bByCur[i.currency]||0)+lTot(i);});
          const advIdsPhase=advances.filter(a=>ph.depts.includes(a.dept)).map(a=>a.id);
          const sByCur={};spendEntries.filter(e=>advIdsPhase.includes(e.advance_id)).forEach(e=>{const c=advCur(e.advance_id);sByCur[c]=(sByCur[c]||0)+(Number(e.amount)||0);});
          const bUSD=bItems.reduce((s,i)=>s+toUSD(lTot(i),i.currency),0);
          const sUSD=spendEntries.filter(e=>advIdsPhase.includes(e.advance_id)).reduce((s,e)=>s+toUSD(Number(e.amount)||0,advCur(e.advance_id)),0);
          const pct=bUSD>0?Math.min(100,(sUSD/bUSD)*100):0;const over=sUSD>bUSD;const diffUSD=sUSD-bUSD;
          return(
            <div key={ph.name} style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:'12px 16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,gap:8,flexWrap:'wrap'}}>
                <span style={{color:T.cream,fontSize:13,fontFamily:'Manrope,sans-serif'}}>{ph.name}</span>
                <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:12,color:sUSD===0?T.dim:(over?T.coral:T.sage)}}>{sUSD===0?tr('notStarted'):`${over?'+':'-'}$${fmt(Math.abs(diffUSD))} ${over?tr('statOverBudget'):tr('statUnderBudget')}`}</span>
              </div>
              <div style={{height:6,background:T.line,borderRadius:3,overflow:'hidden',marginBottom:5}}><div style={{width:`${pct}%`,height:'100%',background:over?T.coral:T.sage}}/></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:T.dim,fontFamily:'IBM Plex Mono,monospace',flexWrap:'wrap',gap:6}}>
                <span>Budget {fmtCur(bByCur)}</span><span>Spent {fmtCur(sByCur)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function ReconView({project,items,advances,reconEntries,onAddAdvance,onUpdateAdvance,onAddEntry,onRemoveEntry,onTopUp}){
  const{t:tr}=useLang();
  const[showForm,setShowForm]=useState(false);const[rec,setRec]=useState({recipient:'',dept:'',amount:'',currency:'NGN',purpose:'',date_issued:today()});
  if(!project)return<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>Select a production first.</div></div>;
  const pAdv=advances.filter(a=>a.project_id===project.id);
  const total=pAdv.reduce((s,a)=>s+a.amount,0);const spent=pAdv.map(a=>reconEntries.filter(e=>e.advance_id===a.id).reduce((s,e)=>s+Number(e.amount),0)).reduce((a,b)=>a+b,0);
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>{tr('reconHeader')} — {project.name}</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Track every cash advance. Log expenses against each. Reduce discrepancies.</div><div style={{marginTop:14}}><FS/></div></div>
      <CostReportPanel project={project} items={items} advances={pAdv} reconEntries={reconEntries}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:20}}>
        <StatCard label="Advances" value={pAdv.length} sub="issued"/><StatCard label="Total issued" value={`${sym(project.base_currency)}${fmt(total)}`} sub={project.base_currency}/><StatCard label="Total spent" value={`${sym(project.base_currency)}${fmt(spent)}`} sub="logged"/><StatCard label="Reconciled" value={pAdv.filter(a=>a.status==='reconciled').length} sub="of total" accent={T.sage}/>
      </div>
      {showForm&&<div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:18,marginBottom:16}}>
        <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:12}}>{tr('newAdvance')}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
          <Inp placeholder="Recipient name" value={rec.recipient} onChange={e=>setRec(p=>({...p,recipient:e.target.value}))}/>
          <Sel value={rec.dept} onChange={e=>setRec(p=>({...p,dept:e.target.value}))} style={{width:'100%'}}><option value="">Department (optional)</option>{DEPTS.map(d=><option key={d} value={d}>{d}</option>)}</Sel>
          <Inp type="number" placeholder="Amount" value={rec.amount} onChange={e=>setRec(p=>({...p,amount:e.target.value}))}/>
          <Sel value={rec.currency} onChange={e=>setRec(p=>({...p,currency:e.target.value}))} style={{width:'100%'}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</Sel>
          <Inp placeholder="Purpose" value={rec.purpose} onChange={e=>setRec(p=>({...p,purpose:e.target.value}))} style={{gridColumn:'span 2'}}/>
          <Inp type="date" value={rec.date_issued} onChange={e=>setRec(p=>({...p,date_issued:e.target.value}))} style={{gridColumn:'span 2'}}/>
        </div>
        <div style={{display:'flex',gap:8}}><Btn size="sm" onClick={()=>{if(rec.recipient&&rec.amount){onAddAdvance({...rec,amount:Number(rec.amount),status:'open',project_id:project.id});setRec({recipient:'',dept:'',amount:'',currency:'NGN',purpose:'',date_issued:today()});setShowForm(false);}}}>{tr('issueAdvance').replace('+ ','')}</Btn><Btn size="sm" variant="ghost" onClick={()=>setShowForm(false)}>{tr('cancel')}</Btn></div>
      </div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14,flexWrap:'wrap',gap:8}}><div style={{fontFamily:'Fraunces,serif',fontSize:16,color:T.cream}}>{pAdv.length} advance{pAdv.length!==1?'s':''}</div><div style={{display:'flex',gap:8}}>{pAdv.length>0&&<Btn size="sm" variant="outline" onClick={()=>reconReportPDF(pAdv,reconEntries,project)}>📄 Export Recon Report</Btn>}<Btn size="sm" onClick={()=>setShowForm(true)}>{tr('issueAdvance')}</Btn></div></div>
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
  const html=`<!DOCTYPE html><html><head><title>Receipt — ${payee.name}</title><style>@media print{.np{display:none}}body{margin:0;font-family:Arial;background:#141414}</style></head><body>
    <div class="np" style="background:#141414;padding:12px;text-align:center;border-bottom:1px solid #3A3A3A">
      <button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 24px;font-weight:700;cursor:pointer;border-radius:6px">Save as PDF</button>
      <div style="color:#9A9080;font-size:11px;margin-top:6px">Save the PDF, then attach it in WhatsApp or email</div>
    </div>
    <div style="max-width:420px;margin:24px auto;background:#1C1C1E;border:1px solid #3A3A3A;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.4)">
      <div style="background:#141414;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #FEED61">
        <div><div style="color:#FEED61;font-size:20px;font-weight:700;font-family:Georgia">${brand.companyName||'NKÒ'}</div>
        <div style="color:#8C852E;font-size:9px;text-transform:uppercase;letter-spacing:2px">Payment Receipt</div></div>
        ${logoHtml}
      </div>
      <div style="padding:22px;text-align:center;border-bottom:1px dashed #3A3A3A">
        <div style="font-size:11px;color:#9A9080;margin-bottom:4px">Amount Paid</div>
        <div style="font-size:34px;font-weight:700;color:#FEED61">${sym(payee.currency)}${fmt(payment.amount)}</div>
        <div style="display:inline-block;margin-top:8px;background:rgba(82,176,122,.15);color:#52B07A;font-size:11px;font-weight:700;padding:4px 14px;border-radius:12px">✓ PAID</div>
      </div>
      <div style="padding:16px 22px">
        ${[['Paid to',payee.name],['Role',payee.role||'—'],['Production',project.name],['Payment method',payment.method],['Date',payment.date],['Reference',ref]].map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #3A3A3A"><span style="font-size:12px;color:#9A9080">${k}</span><span style="font-size:12px;color:#F0E8D0;font-weight:600;text-align:right">${v}</span></div>`).join('')}
      </div>
      <div style="padding:12px 22px 20px;text-align:center">
        <div style="font-size:10px;color:#5A5A5A">Generated by NKÒ — Budgets tailored just for you</div>
        <div style="font-size:10px;color:#3A3A3A;margin-top:2px">nko-nko.vercel.app</div>
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
      return`<tr><td style="padding:6px 10px;font-size:11px;color:#9A9080;border-bottom:1px solid #3A3A3A">${en.date||''}</td><td style="padding:6px 10px;font-size:11px;color:#F0E8D0;border-bottom:1px solid #3A3A3A">${cat?`<span style="background:#242424;color:#8C852E;font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;margin-right:5px">${cat}</span>`:''}${desc}</td><td style="padding:6px 10px;font-size:11px;text-align:right;font-family:monospace;color:#F0E8D0;border-bottom:1px solid #3A3A3A">${sym(a.currency)}${fmt(en.amount)}</td></tr>`;
    }).join('');
    return`<div style="margin-bottom:22px;border:1px solid #3A3A3A;border-radius:8px;overflow:hidden;page-break-inside:avoid">
      <div style="background:#1C1C1E;padding:10px 14px;display:flex;justify-content:space-between">
        <div><span style="color:#F0E8D0;font-weight:700;font-size:13px">${a.recipient}</span>${a.dept?`<span style="color:#9A9080;font-size:11px"> · ${a.dept}</span>`:''}
        <div style="color:#8C852E;font-size:10px;margin-top:2px">${a.purpose||''} · Issued ${a.date_issued}</div></div>
        <div style="text-align:right"><div style="color:#FEED61;font-family:monospace;font-size:15px">${sym(a.currency)}${fmt(a.amount)}</div>
        <div style="font-size:10px;color:${bal<0?'#E06B52':bal===0?'#52B07A':'#9A9080'}">${a.status==='reconciled'?'✓ Reconciled':bal<0?`Over by ${sym(a.currency)}${fmt(Math.abs(bal))}`:`Balance ${sym(a.currency)}${fmt(bal)}`}</div></div>
      </div>
      ${entries.length?`<table style="width:100%;border-collapse:collapse;background:#141414"><tr style="background:#242424"><th style="padding:6px 10px;font-size:9px;color:#9A9080;text-align:left;text-transform:uppercase">Date</th><th style="padding:6px 10px;font-size:9px;color:#9A9080;text-align:left;text-transform:uppercase">Expense</th><th style="padding:6px 10px;font-size:9px;color:#9A9080;text-align:right;text-transform:uppercase">Amount</th></tr>${rows}
      <tr><td colspan="2" style="padding:8px 10px;font-size:11px;font-weight:700;color:#F0E8D0;text-align:right">Total spent</td><td style="padding:8px 10px;font-size:12px;font-weight:700;color:#FEED61;text-align:right;font-family:monospace">${sym(a.currency)}${fmt(spent)}</td></tr></table>`:`<div style="padding:12px 14px;font-size:11px;color:#9A9080;background:#141414">No expenses logged against this advance yet.</div>`}
    </div>`;
  }).join('');
  const html=`<!DOCTYPE html><html><head><title>Recon Report — ${project.name}</title><style>@media print{.np{display:none}}body{margin:0;font-family:Arial;background:#141414}</style></head><body>
    <div class="np" style="background:#141414;padding:12px;text-align:center;border-bottom:1px solid #3A3A3A">
      <button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 24px;font-weight:700;cursor:pointer;border-radius:6px">Save as PDF</button>
      <div style="color:#9A9080;font-size:11px;margin-top:6px">Save the PDF, then attach it in WhatsApp or email</div>
    </div>
    <div style="max-width:680px;margin:0 auto;padding:26px;background:#141414">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #FEED61;padding-bottom:14px;margin-bottom:18px">
        <div><div style="font-size:22px;font-weight:700;font-family:Georgia;color:#F0E8D0">${brand.companyName||'NKÒ'}</div>
        <div style="font-size:11px;color:#8C852E;text-transform:uppercase;letter-spacing:1.5px">Reconciliation Report — ${project.name}</div>
        <div style="font-size:10px;color:#9A9080;margin-top:3px">Created ${new Date().getFullYear()}</div></div>
        ${logoHtml}
      </div>
      <div style="display:flex;gap:12px;margin-bottom:22px">
        ${[['Advances issued',`${sym(project.base_currency)}${fmt(totalIssued)}`],['Total spent',`${sym(project.base_currency)}${fmt(totalSpent)}`],['Outstanding',`${sym(project.base_currency)}${fmt(totalIssued-totalSpent)}`]].map(([k,v])=>`<div style="flex:1;background:#1C1C1E;border:1px solid #3A3A3A;border-radius:8px;padding:12px;text-align:center"><div style="font-size:9px;color:#9A9080;text-transform:uppercase;letter-spacing:1px">${k}</div><div style="font-size:17px;font-weight:700;font-family:monospace;color:#FEED61;margin-top:3px">${v}</div></div>`).join('')}
      </div>
      ${blocks||'<div style="color:#9A9080;font-size:12px">No advances issued yet.</div>'}
      <div style="text-align:center;font-size:10px;color:#5A5A5A;margin-top:20px">Generated by NKÒ — Budgets tailored just for you · nko-nko.vercel.app</div>
    </div>
  </body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};

function PaymentsView({project,payees,onAddPayee,onAddPayment,onRemovePayment}){
  const{t:tr}=useLang();
  const[showForm,setShowForm]=useState(false);const[np,setNp]=useState({name:'',role:'',agreed_fee:'',currency:'NGN'});
  if(!project)return<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>Select a production first.</div></div>;
  const pPayees=payees.filter(p=>p.project_id===project.id);
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>{tr('paymentsHeader')} — {project.name}</div><div style={{marginTop:14}}><FS/></div></div>
      {showForm&&<div style={{background:T.panel,border:`1px solid ${T.gold}`,borderRadius:10,padding:18,marginBottom:16}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
          <Inp placeholder="Name" value={np.name} onChange={e=>setNp(p=>({...p,name:e.target.value}))}/>
          <Inp placeholder="Role" value={np.role} onChange={e=>setNp(p=>({...p,role:e.target.value}))}/>
          <Inp type="number" placeholder="Agreed fee" value={np.agreed_fee} onChange={e=>setNp(p=>({...p,agreed_fee:e.target.value}))}/>
          <Sel value={np.currency} onChange={e=>setNp(p=>({...p,currency:e.target.value}))} style={{width:'100%'}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code}</option>)}</Sel>
        </div>
        <div style={{display:'flex',gap:8}}><Btn size="sm" onClick={()=>{if(np.name){onAddPayee({...np,agreed_fee:Number(np.agreed_fee),project_id:project.id,payments:[]});setNp({name:'',role:'',agreed_fee:'',currency:'NGN'});setShowForm(false);}}}>Add</Btn><Btn size="sm" variant="ghost" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
      </div>}
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}><Btn size="sm" onClick={()=>setShowForm(true)}>{tr('addPayee')}</Btn></div>
      {pPayees.length===0?<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:32,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>No payees yet.</div></div>:pPayees.map(p=>{
        const paid=(p.payments||[]).reduce((s,x)=>s+x.amount,0);const bal=p.agreed_fee-paid;const pct=p.agreed_fee>0?Math.min(100,(paid/p.agreed_fee)*100):0;
        return<div key={p.id} style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:16,marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>{p.name}</div><div style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>{p.role}</div></div><div style={{textAlign:'right'}}><div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:15,color:T.cream}}>{sym(p.currency)}{fmt(p.agreed_fee)}</div><Pill color={bal<=0?T.sage:T.gold}>{bal<=0?'Paid in full':`Owing ${sym(p.currency)}${fmt(bal)}`}</Pill></div></div>
          <div style={{height:4,borderRadius:2,background:T.ink,overflow:'hidden',marginBottom:6}}><div style={{height:'100%',width:`${pct}%`,background:pct>=100?T.sage:T.gold}}/></div>
          {(p.payments||[]).map((pay,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:12,padding:'4px 0',borderBottom:`1px solid ${T.line}`}}><span style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>{pay.date} · {pay.method}</span><div style={{display:'flex',gap:8,alignItems:'center'}}><span style={{fontFamily:'IBM Plex Mono,monospace',color:T.cream}}>{sym(p.currency)}{fmt(pay.amount)}</span><button onClick={()=>receiptPDF(p,pay,project)} title="Generate PDF receipt" style={{color:T.gold,fontSize:11,fontWeight:700,cursor:'pointer',background:'none',border:`1px solid ${T.goldDim}`,borderRadius:6,padding:'2px 8px',fontFamily:'Manrope,sans-serif'}}>🧾 Receipt</button><button onClick={()=>onRemovePayment(p.id,i)} style={{color:T.faint,fontSize:14,cursor:'pointer',background:'none',border:'none'}}>×</button></div></div>)}
          {bal>0&&<div style={{marginTop:8}}><Btn size="sm" variant="outline" onClick={()=>{const amt=window.prompt(`Amount to pay (${p.currency}):`);const method=window.prompt('Payment method:','Cash');if(amt&&method)onAddPayment(p.id,{amount:Number(amt),method,date:today()});}}>{tr('logPayment')}</Btn></div>}
        </div>;})}
    </div>
  );
}

/* ── AI Builder ── */
function AIView({project,budgetItems,advances}){
  const{t:tr}=useLang();
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
      <div style={{marginBottom:18}}><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>{tr('aiBuilderHeader')}</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Production finance co-pilot — calibrated for African markets.</div><div style={{marginTop:14}}><FS/></div></div>
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
        <Inp placeholder={tr('askPlaceholder')} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} style={{flex:1}}/>
        <Btn onClick={()=>send()} style={{flexShrink:0,opacity:loading?.5:1}}>{tr('send')}</Btn>
      </div>
    </div>
  );
}

/* ── Breakdown ── */
const BKCAT=[{key:'location',label:'Location',icon:'📍'},{key:'timeNotes',label:'Time of Day',icon:'🕐'},{key:'cast',label:'Cast',icon:'👤'},{key:'extras',label:'Extras',icon:'👥'},{key:'props',label:'Props',icon:'🎭'},{key:'vehicles',label:'Vehicles',icon:'🚗'},{key:'wardrobe',label:'Wardrobe',icon:'👗'},{key:'hairMakeup',label:'Hair & Make-up',icon:'💄'},{key:'specialEquip',label:'Special Equipment',icon:'🎥'},{key:'vfxSfx',label:'Stunts / SFX / VFX',icon:'✨'},{key:'sound',label:'Sound',icon:'🎵'},{key:'languageNotes',label:'Language Notes',icon:'🗣️'},{key:'notes',label:'Notes',icon:'📝'}];
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
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <Inp placeholder="Location" value={draft.location||''} onChange={e=>d('location',e.target.value)}/>
          <Inp placeholder="Time of day — e.g. Morning (9AM)" value={draft.timeNotes||''} onChange={e=>d('timeNotes',e.target.value)}/>
        </div>
        <Inp placeholder="Cast — comma separated" value={draft.cast||''} onChange={e=>d('cast',e.target.value)}/>
        <Inp placeholder="Extras" value={draft.extras||''} onChange={e=>d('extras',e.target.value)}/>
        <Inp placeholder="Props — comma separated" value={draft.props||''} onChange={e=>d('props',e.target.value)}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <Inp placeholder="Vehicles — comma separated" value={draft.vehicles||''} onChange={e=>d('vehicles',e.target.value)}/>
          <Inp placeholder="Wardrobe — comma separated" value={draft.wardrobe||''} onChange={e=>d('wardrobe',e.target.value)}/>
          <Inp placeholder="Hair & make-up" value={draft.hairMakeup||''} onChange={e=>d('hairMakeup',e.target.value)}/>
          <Inp placeholder="Special equipment" value={draft.specialEquip||''} onChange={e=>d('specialEquip',e.target.value)}/>
          <Inp placeholder="Stunts / SFX / VFX" value={draft.vfxSfx||''} onChange={e=>d('vfxSfx',e.target.value)}/>
          <Inp placeholder="Sound" value={draft.sound||''} onChange={e=>d('sound',e.target.value)}/>
          <Inp placeholder="Language notes — e.g. Yoruba dialogue (subtitled)" value={draft.languageNotes||''} onChange={e=>d('languageNotes',e.target.value)}/>
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
const shareBreakdown=(scenesIn,project,charactersIn=[])=>{
  const scenes=sortScenes(scenesIn);
  const brand=JSON.parse(localStorage.getItem(`nko_brand_${project.id}`)||'{}');
  const logoHtml=brand.logo?`<img src="${brand.logo}" style="height:38px;object-fit:contain;display:block;margin-bottom:6px"/>`:'';
  const castMap={};
  scenes.forEach(s=>{(s.cast||[]).forEach(name=>{const key=String(name||'').trim();if(!key)return;const lk=key.toLowerCase();if(!castMap[lk])castMap[lk]={name:key,scenes:[]};castMap[lk].scenes.push(s.sceneNumber);});});
  const findMeta=name=>charactersIn.find(c=>c.project_id===project.id&&c.name.trim().toLowerCase()===name.trim().toLowerCase());
  const castRows=Object.values(castMap).sort((a,b)=>b.scenes.length-a.scenes.length).map(r=>({...r,meta:findMeta(r.name)||{}}));
  const locMap={};
  scenes.forEach(s=>{const key=(s.location||'').trim()||'Unspecified';if(!locMap[key])locMap[key]={location:key,intExt:s.intExt||'',scenes:[]};locMap[key].scenes.push(s.sceneNumber);});
  const locRows=Object.values(locMap).sort((a,b)=>b.scenes.length-a.scenes.length);
  const scheduleRows=(()=>{const out=[];let current=null;scenes.forEach(s=>{const loc=(s.location||'').trim()||'Unspecified';if(current&&current.location===loc){current.scenes.push(s.sceneNumber);}else{current={location:loc,scenes:[s.sceneNumber]};out.push(current);}});return out;})();
  const allCast=dedupeList(scenes.flatMap(s=>s.cast||[]));
  const allProps=dedupeList(scenes.flatMap(s=>s.props||[]));
  const allCostume=dedupeList(scenes.flatMap(s=>s.wardrobe||[]));
  const allEquip=dedupeList(scenes.flatMap(s=>s.specialEquip||[]));
  const summaryHeader=title=>`<div style="background:#141414;color:#FEED61;padding:12px 18px;border-radius:6px 6px 0 0;display:flex;justify-content:space-between;border:1px solid #3A3A3A;border-bottom:none">
    <div><div style="font-size:10px;text-transform:uppercase;color:#8C852E;margin-bottom:2px">${brand.companyName||'NKÒ'} · ${project.name}</div>
    <div style="font-size:17px;font-weight:700">${title}</div></div>${logoHtml}</div>`;
  const castPage=castRows.length?`<div style="page-break-after:always;padding:18px 26px;font-family:Arial;background:#141414">
    ${summaryHeader('Character Scene Breakdown')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #3A3A3A;border-top:none;background:#141414">
      <tr style="background:#242424"><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:left">S/N</th><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:left">Character</th><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:left">Age / description</th><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:left">Role notes</th><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:left">Scene numbers</th><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:right">Total</th></tr>
      ${castRows.map((r,i)=>`<tr><td style="padding:7px 12px;font-size:11px;color:#9A9080;border-top:1px solid #3A3A3A">${i+1}</td><td style="padding:7px 12px;font-size:12px;color:#F0E8D0;border-top:1px solid #3A3A3A">${r.name}</td><td style="padding:7px 12px;font-size:11px;color:#9A9080;border-top:1px solid #3A3A3A">${r.meta.age_description||''}</td><td style="padding:7px 12px;font-size:11px;color:#9A9080;border-top:1px solid #3A3A3A">${r.meta.role_notes||''}</td><td style="padding:7px 12px;font-size:11px;color:#9A9080;border-top:1px solid #3A3A3A">${r.scenes.join(', ')}</td><td style="padding:7px 12px;font-size:12px;color:#FEED61;text-align:right;border-top:1px solid #3A3A3A;font-weight:700">${r.scenes.length}</td></tr>`).join('')}
    </table>
  </div>`:'';
  const schedulePage=scheduleRows.length?`<div style="page-break-after:always;padding:18px 26px;font-family:Arial;background:#141414">
    ${summaryHeader('Outline Schedule')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #3A3A3A;border-top:none;background:#141414">
      <tr style="background:#242424"><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:left">S/N</th><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:left">Set / Location</th><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:left">Scene numbers</th><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:right">Total</th></tr>
      ${scheduleRows.map((r,i)=>`<tr><td style="padding:7px 12px;font-size:11px;color:#9A9080;border-top:1px solid #3A3A3A">${i+1}</td><td style="padding:7px 12px;font-size:12px;color:#F0E8D0;border-top:1px solid #3A3A3A">${r.location}</td><td style="padding:7px 12px;font-size:11px;color:#9A9080;border-top:1px solid #3A3A3A">${r.scenes.join(', ')}</td><td style="padding:7px 12px;font-size:12px;color:#FEED61;text-align:right;border-top:1px solid #3A3A3A;font-weight:700">${r.scenes.length}</td></tr>`).join('')}
    </table>
  </div>`:'';
  const locPage=locRows.length?`<div style="page-break-after:always;padding:18px 26px;font-family:Arial;background:#141414">
    ${summaryHeader('Locations Summary')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #3A3A3A;border-top:none;background:#141414">
      <tr style="background:#242424"><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:left">Location</th><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase">Int/Ext</th><th style="padding:7px 12px;font-size:10px;color:#9A9080;text-transform:uppercase;text-align:right">Scenes</th></tr>
      ${locRows.map(r=>`<tr><td style="padding:7px 12px;font-size:12px;color:#F0E8D0;border-top:1px solid #3A3A3A">${r.location}</td><td style="padding:7px 12px;font-size:12px;color:#9A9080;text-align:center;border-top:1px solid #3A3A3A">${r.intExt}</td><td style="padding:7px 12px;font-size:12px;color:#9A9080;text-align:right;border-top:1px solid #3A3A3A">${r.scenes.join(', ')}</td></tr>`).join('')}
    </table>
  </div>`:'';
  const elementGroup=(label,items)=>items.length?`<div style="margin-bottom:16px"><div style="font-size:10px;text-transform:uppercase;color:#8C852E;font-weight:700;margin-bottom:6px">${label}</div><div style="display:flex;flex-wrap:wrap;gap:6px">${items.map(it=>`<span style="background:#242424;border:1px solid #3A3A3A;border-radius:6px;padding:4px 10px;font-size:11px;color:#F0E8D0">${it}</span>`).join('')}</div></div>`:`<div style="margin-bottom:16px"><div style="font-size:10px;text-transform:uppercase;color:#8C852E;font-weight:700;margin-bottom:6px">${label}</div><div style="font-size:11px;color:#5A5A5A;font-style:italic">None identified</div></div>`;
  const elementsPage=`<div style="page-break-after:always;padding:18px 26px;font-family:Arial;background:#141414">
    ${summaryHeader('Production Elements')}
    <div style="border:1px solid #3A3A3A;border-top:none;padding:16px;background:#141414">
      ${elementGroup('All Cast',allCast)}
      ${elementGroup('All Props',allProps)}
      ${elementGroup('All Costume',allCostume)}
      ${elementGroup('All Equipment',allEquip)}
    </div>
  </div>`;
  const sheets=scenes.map(sc=>{
    const rows=BKCAT.map(cat=>{
      const val=sc[cat.key];
      if(!val||(Array.isArray(val)&&!val.length))return'';
      const display=Array.isArray(val)?val.join(', '):val;
      return`<tr><td style="padding:7px 12px;background:#242424;color:#FEED61;font-size:10px;font-weight:700;text-transform:uppercase;width:150px;white-space:nowrap;font-family:Arial;border-bottom:1px solid #3A3A3A">${cat.icon} ${cat.label}</td><td style="padding:7px 12px;font-size:12px;color:#F0E8D0;font-family:Arial;background:#141414;border-bottom:1px solid #3A3A3A">${display}</td></tr>`;
    }).join('');
    return`<div style="page-break-after:always;padding:18px 26px;font-family:Arial;background:#141414">
      <div style="background:#141414;color:#FEED61;padding:12px 18px;border-radius:6px 6px 0 0;display:flex;justify-content:space-between;border:1px solid #3A3A3A;border-bottom:none">
        <div><div style="font-size:10px;text-transform:uppercase;color:#8C852E;margin-bottom:2px">${brand.companyName||'NKÒ'} · ${project.name}</div>
        <div style="font-size:17px;font-weight:700">Scene ${sc.sceneNumber||'—'}</div>
        <div style="font-size:12px;color:#9A9080;margin-top:2px">${sc.heading||''}</div></div>
        <div style="text-align:right">${logoHtml}<div style="font-size:10px;color:#8C852E">${sc.intExt||''} · ${sc.dayNight||''}</div></div>
      </div>
      ${sc.synopsis?`<div style="background:#1C1C1E;border:1px solid #3A3A3A;border-top:none;padding:9px 18px;font-size:12px;color:#F0E8D0;font-style:italic">${sc.synopsis}</div>`:''}
      <table style="width:100%;border-collapse:collapse;border:1px solid #3A3A3A;border-top:none">${rows}</table>
    </div>`;
  }).join('');
  const html=`<!DOCTYPE html><html><head><title>Breakdown — ${project.name}</title><style>@media print{.np{display:none}}body{margin:0;background:#141414}</style></head><body>
    <div class="np" style="background:#141414;padding:12px 18px;text-align:center;font-family:Arial;border-bottom:1px solid #3A3A3A">
      <button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 22px;font-size:13px;font-weight:700;cursor:pointer;border-radius:6px">Print / Save as PDF</button>
      <span style="color:#9A9080;font-size:11px;margin-left:10px">${scenes.length} scene${scenes.length!==1?'s':''} · ${project.name}</span>
    </div>${castPage}${schedulePage}${locPage}${elementsPage}${sheets}</body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};
function BreakdownUploader({project,onApply}){
  const{t:tr}=useLang();
  const[state,setState]=useState('idle');const[err,setErr]=useState('');const[notif,setNotif]=useState(()=>typeof Notification!=='undefined'?Notification.permission:'unsupported');const fr=useRef();const resRef=useRef();
  const askNotif=async()=>{if(typeof Notification==='undefined'||Notification.permission!=='default')return;const p=await Notification.requestPermission();setNotif(p);};
  const sendNotif=n=>{if(typeof Notification==='undefined'||Notification.permission!=='granted')return;try{new Notification('NKÒ Breakdown Complete',{body:`${n} scenes extracted from ${project.name}`});}catch{}};
  useEffect(()=>{const h=()=>{if(document.visibilityState==='visible'&&resRef.current){onApply(resRef.current);resRef.current=null;setState('done');}};document.addEventListener('visibilitychange',h);return()=>document.removeEventListener('visibilitychange',h);},[]);
  const process=async f=>{
    const isPDF=f.type==='application/pdf',isTxt=f.type==='text/plain'||f.name.endsWith('.txt')||f.name.endsWith('.fdx');
    if(!isPDF&&!isTxt){setErr('Upload a PDF, TXT or FDX file.');setState('error');return;}
    await askNotif();setState('reading');setErr('');
    try{
      const kb=f.size/1024;const ep=isPDF?kb>200:kb>50;const max=ep?20:25;
      let uc;
      if(isPDF){
        let extracted='';
        try{extracted=await extractPdfText(f);}catch{extracted='';}
        if(extracted&&extracted.length>200){
          uc=[{type:'text',text:`Script:\n\n${extracted.slice(0,300000)}\n\n${BREAKDOWN_PROMPT(ep,max)}`}];
        }else{
          const sizeMB=f.size/1024/1024;
          if(sizeMB>3.2)throw new Error(`This PDF looks like scanned pages with no selectable text, and is too large (${sizeMB.toFixed(1)}MB) to upload directly. Try exporting it as a text-based PDF, or paste the script into a .txt file instead.`);
          const b=await readB64(f);
          uc=[{type:'document',source:{type:'base64',media_type:'application/pdf',data:b}},{type:'text',text:BREAKDOWN_PROMPT(ep,max)}];
        }
      }else{
        const txt=await readTxt(f);
        uc=[{type:'text',text:`Script:\n\n${txt.slice(0,80000)}\n\n${BREAKDOWN_PROMPT(ep,max)}`}];
      }
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
      {state==='analyzing'&&<div style={{background:'rgba(82,176,122,.1)',border:`1px solid ${T.sage}`,borderRadius:8,padding:'10px 14px',marginBottom:10}}><div style={{fontSize:12,color:T.sage,fontFamily:'Manrope,sans-serif'}}>{notif==='granted'?tr('notifOn'):tr('keepScreenOpen')}</div></div>}
      <div onClick={()=>(state==='idle'||state==='error')&&fr.current.click()} style={{background:T.hi,border:`2px dashed ${state==='analyzing'?T.gold:T.line}`,borderRadius:10,padding:20,textAlign:'center',cursor:(state==='idle'||state==='error')?'pointer':'default'}}>
        <input ref={fr} type="file" accept=".pdf,.txt,.fdx" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f)process(f);}}/>
        {state==='idle'&&<><div style={{fontSize:24,marginBottom:8}}>📋</div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream,marginBottom:4}}>{tr('aiScriptBreakdown')}</div><div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:10}}>Upload your script — cast, props, location, vehicles per scene</div>{notif==='granted'&&<div style={{fontSize:11,color:T.sage,fontFamily:'Manrope,sans-serif',marginBottom:8}}>🔔 Safe to switch apps during analysis</div>}{notif==='default'&&<div style={{fontSize:11,color:T.goldDim,fontFamily:'Manrope,sans-serif',marginBottom:8}}>💡 Allow notifications to switch apps freely</div>}<Btn variant="ghost" size="sm">{tr('chooseScript')}</Btn></>}
        {state==='reading'&&<><div style={{fontSize:24,marginBottom:8}}>📖</div><div style={{color:T.cream,fontFamily:'Manrope,sans-serif'}}>Reading…</div></>}
        {state==='analyzing'&&<><div style={{fontSize:24,marginBottom:8}}>🤖</div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>Analyzing your script…</div></>}
        {state==='done'&&<><div style={{fontSize:24,marginBottom:8}}>✅</div><div style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.sage,marginBottom:4}}>Breakdown complete</div><button onClick={e=>{e.stopPropagation();setState('idle');}} style={{color:T.gold,fontSize:12,cursor:'pointer',background:'none',border:'none',fontFamily:'Manrope,sans-serif',fontWeight:700}}>Analyze another →</button></>}
        {state==='error'&&<><div style={{fontSize:24,marginBottom:8}}>⚠️</div><div style={{fontSize:12,color:T.coral,fontFamily:'Manrope,sans-serif',marginBottom:8}}>{err}</div><Btn variant="ghost" size="sm" onClick={e=>{e.stopPropagation();setState('idle');setErr('');}}>Try again</Btn></>}
      </div>
    </div>
  );
}
const dedupeList=arr=>{
  const seen={};
  arr.forEach(v=>{const t=String(v||'').trim();if(!t)return;const key=t.toLowerCase();if(!seen[key])seen[key]=t;});
  return Object.values(seen);
};
function ProductionElementsPanel({scenes}){
  const{t:tr}=useLang();
  const[open,setOpen]=useState(false);
  const allCast=dedupeList(scenes.flatMap(s=>s.cast||[]));
  const allProps=dedupeList(scenes.flatMap(s=>s.props||[]));
  const allCostume=dedupeList(scenes.flatMap(s=>s.wardrobe||[]));
  const allEquip=dedupeList(scenes.flatMap(s=>s.specialEquip||[]));
  const Group=({label,items,color})=>(
    <div style={{marginBottom:16}}>
      <div style={{fontSize:10,color,fontFamily:'Manrope,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>{label}</div>
      {items.length===0?<div style={{color:T.faint,fontSize:12,fontFamily:'Manrope,sans-serif',fontStyle:'italic'}}>None identified</div>:
      <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{items.map((it,i)=><span key={i} style={{background:T.hi,border:`1px solid ${color}`,color:T.cream,borderRadius:6,padding:'4px 10px',fontSize:12,fontFamily:'Manrope,sans-serif'}}>{it}</span>)}</div>}
    </div>
  );
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,marginBottom:12,overflow:'hidden'}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>🧾 {tr('productionElements')} <span style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>— every cast, prop, costume & equipment item across the script</span></span>
        <span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span>
      </button>
      {open&&<div style={{borderTop:`1px solid ${T.line}`,padding:'14px 16px 4px'}}>
        <Group label="All Cast" items={allCast} color={T.sage}/>
        <Group label="All Props" items={allProps} color={T.coral}/>
        <Group label="All Costume" items={allCostume} color={T.sapphire}/>
        <Group label="All Equipment" items={allEquip} color={T.gold}/>
      </div>}
    </div>
  );
}
/* ── Schedules — day-out-of-days, built from Breakdown scenes ── */
const LOCATION_PALETTE=[
  {bg:'#f5b878',text:'#4a2c0c'},{bg:'#7fae4a',text:'#183609'},{bg:'#d9d16a',text:'#3a3608'},
  {bg:'#8fb8d9',text:'#0c2c40'},{bg:'#c98fd9',text:'#3a0c40'},{bg:'#d98f9f',text:'#40141c'},
  {bg:'#9fd9c9',text:'#0c4034'},{bg:'#d9b88f',text:'#40280c'},{bg:'#a8d98f',text:'#1c400c'},
  {bg:'#8f9fd9',text:'#0c1440'},
];
const parseLocation=heading=>{
  if(!heading)return'Unknown';
  let s=heading.trim().toUpperCase().replace(/^(INT|EXT|INT\/EXT|I\/E)[.\s\/]+/,'');
  s=s.split(/\s+-\s+/)[0].split('—')[0].trim();
  return s||'Unknown';
};
function LocationColorPanel({project,locations}){
  const[open,setOpen]=useState(false);const[map,setMap]=useState({});
  useEffect(()=>{if(!project)return;try{setMap(JSON.parse(localStorage.getItem(`nko_schedcolors_${project.id}`)||'{}'));}catch{}},[project?.id]);
  const setColor=(loc,idx)=>{const nm={...map,[loc]:idx};setMap(nm);localStorage.setItem(`nko_schedcolors_${project.id}`,JSON.stringify(nm));};
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,marginBottom:14,overflow:'hidden'}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:12,color:T.cream,fontFamily:'Manrope,sans-serif'}}>🎨 Location colours <span style={{color:T.dim,fontSize:11}}>— pick which colour each location uses</span></span>
        <span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span>
      </button>
      {open&&<div style={{borderTop:`1px solid ${T.line}`,padding:14,display:'flex',flexDirection:'column',gap:8}}>
        {locations.map(loc=>{const idx=map[loc]!=null?map[loc]:Math.abs([...loc].reduce((h,c)=>h+c.charCodeAt(0),0))%LOCATION_PALETTE.length;
        return(<div key={loc} style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:11,color:T.cream,fontFamily:'Manrope,sans-serif',minWidth:140}}>{loc}</span>
          <div style={{display:'flex',gap:5}}>{LOCATION_PALETTE.map((c,i)=><button key={i} onClick={()=>setColor(loc,i)} style={{width:20,height:20,borderRadius:5,background:c.bg,border:idx===i?`2px solid ${T.gold}`:'2px solid transparent',cursor:'pointer'}}/>)}</div>
        </div>);})}
        {!locations.length&&<div style={{fontSize:12,color:T.dim}}>No locations found yet — add scenes in Breakdown first.</div>}
      </div>}
    </div>
  );
}
function locationColor(project,loc){
  let map={};try{map=JSON.parse(localStorage.getItem(`nko_schedcolors_${project.id}`)||'{}');}catch{}
  const idx=map[loc]!=null?map[loc]:Math.abs([...loc].reduce((h,c)=>h+c.charCodeAt(0),0))%LOCATION_PALETTE.length;
  return LOCATION_PALETTE[idx];
}
const CALLSHEET_FIELDS=[
  ['crew',[['execProducer','Executive Producer'],['producer','Producer'],['director','Director'],['prodManager','Production Manager'],['ad1','1st Assistant Director'],['ad2','2nd Assistant Director'],['dp','Director of Photography'],['camOp','Camera Operator'],['ac1','1st AC'],['keyGrip','Key Grip'],['gaffer','Gaffer'],['scriptSup','Script Supervisor'],['sound','Sound'],['unitManager','Unit Manager'],['dit','DIT'],['costumeDesigner','Costume Designer'],['artDirector','Art Director'],['hmu','HMU / SFX']]],
  ['times',[['crewCall','Crew Call'],['artCall','Art Department Call'],['hmuCall','HMU / Wardrobe Call'],['crewPickup','Crew Pickup From Base'],['castCall','Cast Member Call'],['firstShot','1st Shot'],['estWrap','Est. Wrap']]],
  ['location',[['locationName','Location Name'],['locationAddress','Address'],['sunrise','Sunrise'],['sunset','Sunset'],['weather','Weather'],['notes','Notes']]],
];
function CallSheetModal({project,day,scenes,characters,onClose}){
  const key=`nko_callsheet_${project.id}_${day.id}`;
  const[info,setInfo]=useState({});const[castTimes,setCastTimes]=useState({});
  useEffect(()=>{try{const s=JSON.parse(localStorage.getItem(key)||'{}');setInfo(s.info||{});setCastTimes(s.castTimes||{});}catch{}},[key]);
  const set=(k,v)=>setInfo(p=>({...p,[k]:v}));
  const setCast=(name,field,v)=>setCastTimes(p=>({...p,[name]:{...(p[name]||{}),[field]:v}}));
  const save=()=>{localStorage.setItem(key,JSON.stringify({info,castTimes}));};
  const daySc=scenes.filter(s=>s.shootDayId===day.id);
  const cast=[...new Set(daySc.flatMap(s=>s.cast||[]))];
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:T.ink,border:`1px solid ${T.line}`,borderRadius:12,maxWidth:640,width:'100%',maxHeight:'85vh',overflowY:'auto',padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div style={{fontFamily:'Fraunces,serif',fontSize:18,color:T.cream}}>Call Sheet — Day {day.dayNumber}</div>
          <button onClick={onClose} style={{background:'none',border:'none',color:T.dim,fontSize:18,cursor:'pointer'}}>✕</button>
        </div>
        {CALLSHEET_FIELDS.map(([section,fields])=>(
          <div key={section} style={{marginBottom:16}}>
            <div style={{fontSize:10,color:T.goldDim,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>{section==='crew'?'Key Crew':section==='times'?'Call Times':'Location & Notes'}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:8}}>
              {fields.map(([k,label])=><div key={k}><div style={{fontSize:10,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:3}}>{label}</div><Inp value={info[k]||''} onChange={e=>set(k,e.target.value)}/></div>)}
            </div>
          </div>
        ))}
        {cast.length>0&&<div style={{marginBottom:16}}>
          <div style={{fontSize:10,color:T.goldDim,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Cast Schedule</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {cast.map(name=><div key={name} style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:8,padding:10}}>
              <div style={{color:T.cream,fontSize:12,marginBottom:6,fontFamily:'Manrope,sans-serif'}}>{name}</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(90px,1fr))',gap:6}}>
                {[['pickup','Pickup'],['depart','Depart'],['arrive','Arrive'],['makeup','Makeup'],['costume','Costume'],['onSet','On Set']].map(([f,l])=>
                  <div key={f}><div style={{fontSize:9,color:T.dim,marginBottom:2}}>{l}</div><Inp value={castTimes[name]?.[f]||''} onChange={e=>setCast(name,f,e.target.value)} style={{fontSize:11,padding:'4px 6px'}}/></div>
                )}
              </div>
            </div>)}
          </div>
        </div>}
        <div style={{display:'flex',gap:8}}>
          <Btn variant="sage" onClick={()=>{save();callSheetPDF(day,daySc,project,info,castTimes,characters);}}>📄 Save & Generate PDF</Btn>
          <Btn variant="ghost" onClick={()=>{save();onClose();}}>Save & Close</Btn>
        </div>
      </div>
    </div>
  );
}
const callSheetPDF=(day,daySc,project,info,castTimes,characters=[])=>{
  const rows=daySc.map(s=>{const loc=parseLocation(s.heading);const c=locationColor(project,loc);
    const castNum=name=>{const i=characters.findIndex(ch=>ch.name.trim().toLowerCase()===name.trim().toLowerCase());return i>=0?i+1:'—';};
    return`<tr style="background:${c.bg}"><td style="padding:5px 8px;border:1px solid #ccc;color:${c.text};font-weight:600">SC ${s.sceneNumber}</td><td style="padding:5px 8px;border:1px solid #ccc;color:${c.text}">${loc}</td><td style="padding:5px 8px;border:1px solid #ccc;color:${c.text};max-width:260px">${s.synopsis||''}</td><td style="padding:5px 8px;border:1px solid #ccc;color:${c.text}">${s.dayNight||''}</td><td style="padding:5px 8px;border:1px solid #ccc;color:${c.text}">${s.intExt||''}</td><td style="padding:5px 8px;border:1px solid #ccc;color:${c.text};text-align:right">${(s.cast||[]).map(castNum).join(', ')||'—'}</td></tr>`;
  }).join('');
  const crewRows=CALLSHEET_FIELDS[0][1].filter(([k])=>info[k]).map(([k,label])=>`<tr><td style="padding:3px 8px;font-size:11px;color:#666">${label}</td><td style="padding:3px 8px;font-size:11px;font-weight:600">${info[k]}</td></tr>`).join('');
  const timeRows=CALLSHEET_FIELDS[1][1].filter(([k])=>info[k]).map(([k,label])=>`<tr><td style="padding:3px 8px;font-size:11px;color:#666">${label}</td><td style="padding:3px 8px;font-size:11px;font-weight:600">${info[k]}</td></tr>`).join('');
  const castRows=Object.entries(castTimes).map(([name,t])=>`<tr><td style="padding:4px 8px;border:1px solid #ccc;font-weight:600">${name}</td>${['pickup','depart','arrive','makeup','costume','onSet'].map(f=>`<td style="padding:4px 8px;border:1px solid #ccc;text-align:center">${t?.[f]||'—'}</td>`).join('')}</tr>`).join('');
  const html=`<!DOCTYPE html><html><head><title>Call Sheet — Day ${day.dayNumber}</title></head><body style="margin:0;font-family:Arial;background:#fff;padding:24px;color:#222">
    <h1 style="font-family:Georgia,serif;font-size:20px;margin:0">${project.name} — Call Sheet</h1>
    <div style="font-size:14px;font-weight:700;margin:4px 0 2px">DAY ${day.dayNumber}${day.date?` — ${day.date}`:''}</div>
    <table style="width:100%;border-collapse:collapse;margin:14px 0"><tr>
      <td style="vertical-align:top;width:50%"><table style="width:100%;border-collapse:collapse">${crewRows}</table></td>
      <td style="vertical-align:top;width:50%"><table style="width:100%;border-collapse:collapse">${timeRows}</table></td>
    </tr></table>
    ${info.locationName||info.locationAddress?`<div style="background:#f5f5f5;border:1px solid #ddd;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:11px"><b>${info.locationName||'Location'}</b><br/>${info.locationAddress||''}${info.sunrise?` &nbsp;·&nbsp; Sunrise ${info.sunrise}`:''}${info.sunset?` &nbsp;·&nbsp; Sunset ${info.sunset}`:''}${info.weather?` &nbsp;·&nbsp; Weather ${info.weather}`:''}${info.notes?`<br/><i>${info.notes}</i>`:''}</div>`:''}
    <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:14px">
      <tr style="background:#333;color:#fff"><th style="padding:5px 8px;text-align:left">Scene</th><th style="padding:5px 8px;text-align:left">Location</th><th style="padding:5px 8px;text-align:left">Description</th><th style="padding:5px 8px;text-align:left">D/N</th><th style="padding:5px 8px;text-align:left">I/E</th><th style="padding:5px 8px;text-align:right">Cast</th></tr>
      ${rows||'<tr><td colspan="6" style="padding:8px">No scenes assigned.</td></tr>'}
    </table>
    ${castRows?`<table style="width:100%;border-collapse:collapse;font-size:11px"><tr style="background:#333;color:#fff"><th style="padding:5px 8px;text-align:left">Cast</th><th style="padding:5px 8px">Pickup</th><th style="padding:5px 8px">Depart</th><th style="padding:5px 8px">Arrive</th><th style="padding:5px 8px">Makeup</th><th style="padding:5px 8px">Costume</th><th style="padding:5px 8px">On Set</th></tr>${castRows}</table>`:''}
    <div class="np" style="margin-top:20px;text-align:center"><button onclick="window.print()" style="background:#FEED61;border:none;padding:8px 22px;font-size:13px;font-weight:700;cursor:pointer;border-radius:6px">Print / Save as PDF</button></div>
  </body></html>`;
  const w=window.open('','_blank');w.document.write(html);w.document.close();
};
function SchedulesView({project,scenes,shootDays,characters,onUpdateScene,onAddDay,onUpdateDay,onDeleteDay}){
  const[newDate,setNewDate]=useState('');
  const[callSheetDay,setCallSheetDay]=useState(null);
  const pScenes=scenes.filter(s=>s.project_id===project?.id);
  const pDays=shootDays.filter(d=>d.project_id===project?.id).sort((a,b)=>(a.dayNumber||0)-(b.dayNumber||0));
  const unscheduled=pScenes.filter(s=>!s.shootDayId);
  const locations=[...new Set(pScenes.map(s=>parseLocation(s.heading)))];
  const castList=[...new Set(pScenes.flatMap(s=>s.cast||[]))].map(name=>({id:name,name}));
  const castNum=name=>{const i=castList.findIndex(c=>c.name.trim().toLowerCase()===name.trim().toLowerCase());return i>=0?i+1:'—';};
  const addDay=()=>{onAddDay({dayNumber:pDays.length+1,date:newDate||''});setNewDate('');};
  if(!project)return<div style={{color:T.dim}}>Select a production first.</div>;
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14,flexWrap:'wrap',gap:10}}>
        <div><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>Schedules — {project.name}</div><div style={{color:T.dim,fontSize:13,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Shooting schedule, built from your breakdown</div></div>
        {pDays.length>0&&<ExportMenu onPdf={()=>schedulePDF(pDays,pScenes,project,castList)} onExcel={()=>scheduleExcel(pDays,pScenes,project,castList)}/>}
      </div>
      {castList.length>0&&<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:'10px 14px',marginBottom:12,display:'flex',gap:16,flexWrap:'wrap',alignItems:'center'}}>
        <span style={{fontSize:10,color:T.goldDim,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em'}}>Cast</span>
        {castList.map((c,i)=><span key={c.id} style={{fontSize:12,color:T.cream,fontFamily:'Manrope,sans-serif'}}><b style={{color:T.gold}}>{i+1}</b> {c.name}</span>)}
      </div>}
      <LocationColorPanel project={project} locations={locations}/>
      <div style={{background:T.panel,border:`1px dashed ${T.line}`,borderRadius:10,padding:'10px 14px',marginBottom:16}}>
        <span style={{fontSize:10,color:T.goldDim,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginRight:10}}>Unscheduled ({unscheduled.length})</span>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:8}}>
          {unscheduled.map(s=><div key={s.id} style={{background:T.hi,borderRadius:6,padding:'4px 4px 4px 9px',display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontSize:11,color:T.cream,fontFamily:'IBM Plex Mono,monospace'}}>#{s.sceneNumber} · {s.heading}</span>
            <select onChange={e=>{if(e.target.value)onUpdateScene(s.id,{shootDayId:e.target.value});}} defaultValue="" style={{background:T.panel,color:T.cream,border:`1px solid ${T.line}`,borderRadius:4,fontSize:10,padding:'2px 4px'}}>
              <option value="">+ day</option>
              {pDays.map(d=><option key={d.id} value={d.id}>Day {d.dayNumber}</option>)}
            </select>
          </div>)}
          {!unscheduled.length&&<span style={{fontSize:11,color:T.dim}}>All scenes scheduled.</span>}
        </div>
      </div>
      {pDays.map(day=>{
        const daySc=pScenes.filter(s=>s.shootDayId===day.id);
        const cast=[...new Set(daySc.flatMap(s=>s.cast||[]))];
        return(
          <div key={day.id} style={{marginBottom:16}}>
            <div style={{background:'#2a1414',borderRadius:'8px 8px 0 0',padding:'10px 14px',border:`1px solid ${T.line}`,borderBottom:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{color:T.cream,fontFamily:'Fraunces,serif',fontSize:14}}>Shoot Day {day.dayNumber} {day.date&&<span style={{color:'#cc9999',fontSize:11,fontFamily:'Manrope,sans-serif',marginLeft:8}}>{day.date}</span>}</div>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <button onClick={()=>setCallSheetDay(day)} style={{background:'none',border:'none',color:T.gold,fontSize:11,cursor:'pointer',fontFamily:'Manrope,sans-serif',fontWeight:700}}>📋 Call Sheet</button>
                <button onClick={()=>onDeleteDay(day.id)} style={{background:'none',border:'none',color:T.faint,fontSize:11,cursor:'pointer'}}>Delete day</button>
              </div>
            </div>
            <div style={{border:`1px solid ${T.line}`,borderTop:'none',overflow:'hidden'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}><tbody>
                {daySc.map(s=>{const loc=parseLocation(s.heading);const c=locationColor(project,loc);
                return(<tr key={s.id} style={{background:c.bg}}>
                  <td style={{padding:'6px 8px',color:c.text,fontWeight:500,width:40}}>#{s.sceneNumber}</td>
                  <td style={{padding:'6px 8px',color:c.text,fontWeight:500,width:38}}>{s.intExt}</td>
                  <td style={{padding:'6px 8px',color:c.text,fontWeight:500}}>{loc} · {s.dayNight}</td>
                  <td style={{padding:'6px 8px',color:c.text,textAlign:'right',width:60}}>{(s.cast||[]).map(castNum).join(', ')||'—'}</td>
                  <td style={{padding:'6px 8px',width:24}}><button onClick={()=>onUpdateScene(s.id,{shootDayId:null})} style={{background:'none',border:'none',color:c.text,cursor:'pointer',fontSize:11}}>✕</button></td>
                </tr>);})}
                {!daySc.length&&<tr><td colSpan={5} style={{padding:'10px 8px',color:T.dim,fontSize:11}}>No scenes assigned yet.</td></tr>}
              </tbody></table>
            </div>
            <div style={{background:'#4a4a4a',color:'#e8e8e8',fontSize:11,padding:'6px 14px',borderRadius:'0 0 6px 6px'}}>End of Shooting Day {day.dayNumber}{cast.length?` — Cast call: ${cast.join(', ')}`:''}</div>
          </div>
        );
      })}
      <div style={{background:T.panel,border:`1px dashed ${T.line}`,borderRadius:10,padding:14,display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
        <Inp type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} style={{width:160}}/>
        <Btn size="sm" variant="sage" onClick={addDay}>+ Add shoot day {pDays.length+1}</Btn>
      </div>
      {callSheetDay&&<CallSheetModal project={project} day={callSheetDay} scenes={pScenes} characters={castList} onClose={()=>setCallSheetDay(null)}/>}
    </div>
  );
}
function CastSummaryPanel({scenes,characters,onSaveCharacter}){
  const{t:tr}=useLang();
  const[open,setOpen]=useState(false);
  const[editingRow,setEditingRow]=useState(null);
  const rows=(()=>{
    const map={};
    scenes.forEach(s=>{(s.cast||[]).forEach(name=>{const key=String(name||'').trim();if(!key)return;const lk=key.toLowerCase();if(!map[lk])map[lk]={name:key,scenes:[]};map[lk].scenes.push(s.sceneNumber);});});
    return Object.values(map).sort((a,b)=>b.scenes.length-a.scenes.length);
  })();
  const findMeta=name=>characters.find(c=>c.name.trim().toLowerCase()===name.trim().toLowerCase());
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,marginBottom:12,overflow:'hidden'}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>👤 {tr('castSceneBreakdown')} <span style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>— {rows.length} character{rows.length!==1?'s':''}</span></span>
        <span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span>
      </button>
      {open&&<div style={{borderTop:`1px solid ${T.line}`,padding:'4px 16px 8px'}}>
        {rows.length===0?<div style={{color:T.dim,fontSize:12,fontFamily:'Manrope,sans-serif',padding:'10px 0'}}>No cast assigned to scenes yet.</div>:<>
        <div style={{display:'grid',gridTemplateColumns:'28px 1fr 1fr 44px 24px',gap:8,padding:'8px 0 4px',fontSize:9,color:T.faint,fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase'}}><span>S/N</span><span>Character</span><span>Scene numbers</span><span style={{textAlign:'right'}}>Total</span><span/></div>
        {rows.map((r,i)=>{const meta=findMeta(r.name)||{};const isEditing=editingRow===r.name;return<div key={r.name}>
          <div style={{display:'grid',gridTemplateColumns:'28px 1fr 1fr 44px 24px',gap:8,alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${T.line}`}}>
            <span style={{color:T.faint,fontSize:11,fontFamily:'IBM Plex Mono,monospace'}}>{i+1}</span>
            <span style={{color:T.cream,fontFamily:'Manrope,sans-serif',fontSize:13,fontWeight:600}}>{r.name}</span>
            <span style={{color:T.dim,fontSize:11,fontFamily:'Manrope,sans-serif'}}>{r.scenes.join(', ')}</span>
            <span style={{color:T.gold,fontFamily:'IBM Plex Mono,monospace',fontSize:13,textAlign:'right'}}>{r.scenes.length}</span>
            <button onClick={()=>setEditingRow(isEditing?null:r.name)} style={{background:'none',border:'none',color:T.goldDim,cursor:'pointer',fontSize:13}} title="Edit age/role notes">✏️</button>
          </div>
          {isEditing&&<div style={{padding:'8px 0 12px 36px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <Inp placeholder="Age / description" defaultValue={meta.age_description||''} onBlur={e=>{if(e.target.value!==(meta.age_description||''))onSaveCharacter(r.name,{age_description:e.target.value});}} style={{fontSize:12}}/>
            <Inp placeholder="Role notes" defaultValue={meta.role_notes||''} onBlur={e=>{if(e.target.value!==(meta.role_notes||''))onSaveCharacter(r.name,{role_notes:e.target.value});}} style={{fontSize:12}}/>
          </div>}
        </div>;})}
        </>}
      </div>}
    </div>
  );
}
function OutlineSchedulePanel({scenes}){
  const{t:tr}=useLang();
  const[open,setOpen]=useState(false);
  const rows=(()=>{
    const out=[];let current=null;
    scenes.forEach(s=>{
      const loc=(s.location||'').trim()||'Unspecified';
      if(current&&current.location===loc){current.scenes.push(s.sceneNumber);}
      else{current={location:loc,intExt:s.intExt||'',scenes:[s.sceneNumber]};out.push(current);}
    });
    return out;
  })();
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,marginBottom:12,overflow:'hidden'}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>🗓️ {tr('outlineSchedule')} <span style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>— {rows.length} block{rows.length!==1?'s':''}, in script order</span></span>
        <span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span>
      </button>
      {open&&<div style={{borderTop:`1px solid ${T.line}`,padding:'4px 16px 8px'}}>
        {rows.length===0?<div style={{color:T.dim,fontSize:12,fontFamily:'Manrope,sans-serif',padding:'10px 0'}}>No scenes yet.</div>:<>
        <div style={{display:'grid',gridTemplateColumns:'28px 1fr 1fr 44px',gap:8,padding:'8px 0 4px',fontSize:9,color:T.faint,fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase'}}><span>S/N</span><span>Set / Location</span><span>Scene numbers</span><span style={{textAlign:'right'}}>Total</span></div>
        {rows.map((r,i)=><div key={i} style={{display:'grid',gridTemplateColumns:'28px 1fr 1fr 44px',gap:8,alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${T.line}`}}>
          <span style={{color:T.faint,fontSize:11,fontFamily:'IBM Plex Mono,monospace'}}>{i+1}</span>
          <span style={{color:T.cream,fontFamily:'Manrope,sans-serif',fontSize:13,fontWeight:600}}>{r.location}</span>
          <span style={{color:T.dim,fontSize:11,fontFamily:'Manrope,sans-serif'}}>{r.scenes.join(', ')}</span>
          <span style={{color:T.gold,fontFamily:'IBM Plex Mono,monospace',fontSize:13,textAlign:'right'}}>{r.scenes.length}</span>
        </div>)}
        </>}
      </div>}
    </div>
  );
}
function LocationsSummaryPanel({scenes}){
  const{t:tr}=useLang();
  const[open,setOpen]=useState(false);
  const rows=(()=>{
    const map={};
    scenes.forEach(s=>{
      const key=(s.location||'').trim()||'Unspecified';
      if(!map[key])map[key]={location:key,intExt:s.intExt||'',scenes:[]};
      map[key].scenes.push(s.sceneNumber);
    });
    return Object.values(map).sort((a,b)=>b.scenes.length-a.scenes.length);
  })();
  return(
    <div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,marginBottom:12,overflow:'hidden'}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontFamily:'Fraunces,serif',fontSize:15,color:T.cream}}>📍 {tr('locationsSummary')} <span style={{fontSize:11,color:T.dim,fontFamily:'Manrope,sans-serif'}}>— {rows.length} location{rows.length!==1?'s':''}, grouped by scene count</span></span>
        <span style={{fontSize:10,color:T.goldDim}}>{open?'▼':'▶'}</span>
      </button>
      {open&&<div style={{borderTop:`1px solid ${T.line}`,padding:'4px 16px 14px'}}>
        {rows.length===0?<div style={{color:T.dim,fontSize:12,fontFamily:'Manrope,sans-serif',padding:'10px 0'}}>No locations assigned to scenes yet.</div>:
        rows.map(r=><div key={r.location} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${T.line}`,gap:10}}>
          <div>
            <div style={{color:T.cream,fontFamily:'Manrope,sans-serif',fontSize:13,fontWeight:600}}>{r.location}</div>
            <div style={{color:T.dim,fontSize:10,fontFamily:'Manrope,sans-serif',marginTop:2}}>{r.intExt}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{color:T.gold,fontFamily:'IBM Plex Mono,monospace',fontSize:12}}>{r.scenes.length} scene{r.scenes.length!==1?'s':''}</div>
            <div style={{color:T.dim,fontSize:10,fontFamily:'Manrope,sans-serif'}}>Sc. {r.scenes.join(', ')}</div>
          </div>
        </div>)}
      </div>}
    </div>
  );
}
function BreakdownView({project,scenes,characters,onSaveCharacter,onAddScene,onAddScenes,onDeleteScene,onUpdateScene}){
  const{t:tr}=useLang();
  const[filter,setFilter]=useState('ALL');const[search,setSearch]=useState('');const mob=useIsMobile();
  if(!project)return<div style={{background:T.panel,border:`1px solid ${T.line}`,borderRadius:10,padding:40,textAlign:'center'}}><div style={{color:T.dim,fontFamily:'Manrope,sans-serif'}}>Select a production first.</div></div>;
  const ps=sortScenes(scenes.filter(s=>s.project_id===project.id));
  const filtered=ps.filter(s=>{const mf=filter==='ALL'||(filter==='INT'&&s.intExt==='INT')||(filter==='EXT'&&s.intExt==='EXT')||(filter==='DAY'&&s.dayNight==='DAY')||(filter==='NIGHT'&&s.dayNight==='NIGHT');const ms=!search||s.heading?.toLowerCase().includes(search.toLowerCase())||s.location?.toLowerCase().includes(search.toLowerCase());return mf&&ms;});
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:'Fraunces,serif',fontSize:mob?22:26,color:T.cream}}>{tr('breakdownHeader')} — {project.name}</div><div style={{fontSize:13,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Scene-by-scene: cast, props, location, vehicles, wardrobe and more.</div><div style={{marginTop:14}}><FS/></div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:20}}>
        <StatCard label="Scenes" value={ps.length} sub="in breakdown"/><StatCard label="INT" value={ps.filter(s=>s.intExt==='INT').length} sub="interior"/><StatCard label="EXT" value={ps.filter(s=>s.intExt==='EXT').length} sub="exterior"/><StatCard label="Night" value={ps.filter(s=>s.dayNight==='NIGHT').length} sub="shoots" accent={ps.filter(s=>s.dayNight==='NIGHT').length>0?T.coral:T.sage}/>
      </div>
      <CastSummaryPanel scenes={ps} characters={characters.filter(c=>c.project_id===project.id)} onSaveCharacter={onSaveCharacter}/>
      <OutlineSchedulePanel scenes={ps}/>
      <LocationsSummaryPanel scenes={ps}/>
      <ProductionElementsPanel scenes={ps}/>
      <BreakdownUploader project={project} onApply={ns=>onAddScenes(ns.map(sc=>({...sc,project_id:project.id,id:Math.random().toString(36).slice(2,10)})))}/>
      <div style={{overflowX:'auto',marginBottom:12}}><div style={{display:'flex',gap:6,minWidth:'max-content',paddingBottom:4}}>{['ALL','INT','EXT','DAY','NIGHT'].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${filter===f?T.gold:T.line}`,background:filter===f?T.goldGlow:'transparent',color:filter===f?T.gold:T.dim,fontSize:12,fontFamily:'Manrope,sans-serif',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>{f}</button>)}</div></div>
      <div style={{display:'flex',flexDirection:mob?'column':'row',gap:8,marginBottom:14}}>
        <Inp placeholder="Search scenes…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1}}/>
        {ps.length>0&&<ExportMenu onPdf={()=>shareBreakdown(filtered,project,characters)} onExcel={()=>breakdownExcel(filtered,project,characters)}/>}
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
      {creator.verified&&<div style={{fontSize:9,color:T.sage,fontFamily:'Manrope,sans-serif',fontWeight:700,marginTop:4}}>✓ NKÒ Verified</div>}
    </button>
  );
}
function MarketplaceView({onApplyTemplate}){
  const{t:tr}=useLang();
  const[cat,setCat]=useState('All');const[sel,setSel]=useState(null);const[search,setSearch]=useState('');const[applied,setApplied]=useState(null);const mob=useIsMobile();
  const filtered=COMMUNITY_TEMPLATES.filter(t=>(cat==='All'||t.type===cat)&&(!sel||t.author===sel)&&(!search||t.label.toLowerCase().includes(search.toLowerCase())||t.author.toLowerCase().includes(search.toLowerCase())));
  const featured=CREATORS[0];
  return(
    <div>
      <div style={{marginBottom:20}}><div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream}}>{tr('marketplaceHeader')}</div><div style={{fontSize:14,color:T.dim,marginTop:4,fontFamily:'Manrope,sans-serif'}}>Community templates — budget + archetypal scenes bundled together.</div><div style={{marginTop:14}}><FS/></div></div>
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
            <Btn size="sm" variant={isApp?'sage':'outline'} onClick={()=>{onApplyTemplate(tpl);setApplied(tpl.id);setTimeout(()=>setApplied(null),3000);}}>{isApp?tr('applied'):tr('useTemplate')}</Btn>
          </div>
        </div>;})}
      </div>}
      <div style={{marginTop:28,padding:'20px 24px',background:T.panel,border:`1px solid ${T.line}`,borderRadius:12,textAlign:'center'}}><div style={{fontFamily:'Fraunces,serif',fontSize:17,color:T.cream,marginBottom:6}}>Publish your template</div><div style={{fontSize:12,color:T.dim,fontFamily:'Manrope,sans-serif',marginBottom:14,lineHeight:1.6}}>Share a budget that works and earn an NKÒ Verified badge.</div><Btn variant="outline" onClick={()=>window.open('mailto:hello@nko.film?subject=Template submission','_blank')}>Submit a template →</Btn></div>
    </div>
  );
}

/* ── MainApp ── */
function MainApp(){
  const{user,signOut}=useAuth();
  const[view,setView]=useState('dashboard');
  const[projects,setProjects]=useState([]);const[budgetItems,setBudgetItems]=useState([]);const[advances,setAdvances]=useState([]);const[reconEntries,setReconEntries]=useState([]);const[payees,setPayees]=useState([]);const[scenes,setScenes]=useState([]);const[characters,setCharacters]=useState([]);const[shootDays,setShootDays]=useState([]);
  const[currentId,setCurrentId]=useState(null);const[mobile,setMobile]=useState(window.innerWidth<700);const[showNewModal,setShowNewModal]=useState(false);
  const[defaultCurrency,setDefaultCurrency]=useState('NGN');
  useEffect(()=>{if(!user)return;try{const s=JSON.parse(localStorage.getItem(`nko_onboarding_${user.id}`)||'null');if(s?.market)setDefaultCurrency(s.market);}catch{}},[user]);
  useEffect(()=>{const h=()=>setMobile(window.innerWidth<700);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h);},[]);

  useEffect(()=>{if(!user)return;
    const loadAll=async()=>{
      const[pr,bi,ad,re,py,sc,ch,sd]=await Promise.all([
        sb.from('projects').select('*').eq('user_id',user.id).order('created_at',{ascending:false}),
        sb.from('budget_items').select('*').eq('user_id',user.id),
        sb.from('advances').select('*').eq('user_id',user.id),
        sb.from('recon_entries').select('*').eq('user_id',user.id),
        sb.from('payees').select('*').eq('user_id',user.id),
        sb.from('scenes').select('*').eq('user_id',user.id),
        sb.from('characters').select('*').eq('user_id',user.id),
        sb.from('shoot_days').select('*').eq('user_id',user.id),
      ]);
      if(pr.data)setProjects(pr.data);if(bi.data)setBudgetItems(bi.data);if(ad.data)setAdvances(ad.data);if(re.data)setReconEntries(re.data);if(py.data)setPayees(py.data);
      if(sd.data)setShootDays(sd.data.map(r=>({...r.data,id:r.id,project_id:r.project_id})));
      if(sc.data)setScenes(sc.data.map(r=>({...r.data,id:r.id,project_id:r.project_id})));
      if(ch.data)setCharacters(ch.data);
    };loadAll();},[user]);

  const project=projects.find(p=>p.id===currentId)||null;
  const pBudget=budgetItems.filter(i=>i.project_id===currentId);
  const pAdvances=advances.filter(a=>a.project_id===currentId);

  const createProject=async d=>{
    const{data,error}=await sb.from('projects').insert({...d,user_id:user.id}).select().single();
    if(error){alert(`Could not create production: ${error.message}`);return false;}
    if(data){setProjects(p=>[data,...p]);setCurrentId(data.id);setView('budgets');return true;}
    return false;
  };
  const deleteProjects=async ids=>{for(const id of ids)await sb.from('projects').delete().eq('id',id);setProjects(p=>p.filter(x=>!ids.includes(x.id)));setBudgetItems(p=>p.filter(x=>!ids.includes(x.project_id)));setAdvances(p=>p.filter(x=>!ids.includes(x.project_id)));setPayees(p=>p.filter(x=>!ids.includes(x.project_id)));setScenes(p=>p.filter(x=>!ids.includes(x.project_id)));setCharacters(p=>p.filter(x=>!ids.includes(x.project_id)));if(ids.includes(currentId)){setCurrentId(null);setView('dashboard');}};
  const addBudgetItem=async dept=>{const{data,error}=await sb.from('budget_items').insert({project_id:currentId,user_id:user.id,dept,description:'',qty:1,unit:'flat',rate:0,currency:project.base_currency}).select().single();if(error){alert(`Could not add line: ${error.message}`);return;}if(data)setBudgetItems(p=>[...p,data]);};
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
    if(tpl.scenes?.length){
      const sceneRows=tpl.scenes.map(s=>({id:Math.random().toString(36).slice(2,10),project_id:currentId,user_id:user.id,data:s}));
      const{data:scData,error:scError}=await sb.from('scenes').insert(sceneRows).select();
      if(scError){alert(`Budget applied, but could not save template scenes: ${scError.message}`);}
      else if(scData)setScenes(p=>[...p,...scData.map(r=>({...r.data,id:r.id,project_id:r.project_id}))]);
    }
  };
  const applyScriptBudget=async lines=>{
    const rows=lines.map(l=>({
      project_id:currentId,
      user_id:user.id,
      dept:forceDeptOverride(l.description)||(DEPTS.includes(l.dept)?l.dept:smartDeptFallback(l.description,l.dept)),
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
    const{data,error}=await sb.from('recon_entries').insert({advance_id:id,user_id:user.id,description:'[CASH-IN] Top-up received',amount:Number(extra),date:today()}).select().single();
    if(error){alert(`Could not top up: ${error.message}`);return;}
    if(data)setReconEntries(p=>[...p,data]);
    setAdvances(p=>p.map(a=>a.id===id&&a.status==='reconciled'?{...a,status:'open'}:a));
    await sb.from('advances').update({status:'open'}).eq('id',id);
  };
  const removeReconEntry=async id=>{setReconEntries(p=>p.filter(e=>e.id!==id));await sb.from('recon_entries').delete().eq('id',id);};
  /* Scene breakdown persistence — stores the full scene object in a JSONB 'data' column */
  const addScene=async sc=>{
    const id=sc.id||Math.random().toString(36).slice(2,10);
    const{id:_omit,project_id:_omit2,...rest}=sc;
    const{data,error}=await sb.from('scenes').insert({id,project_id:currentId,user_id:user.id,data:rest}).select().single();
    if(error){alert(`Could not save scene: ${error.message}`);return;}
    if(data)setScenes(p=>[...p,{...data.data,id:data.id,project_id:data.project_id}]);
  };
  const addScenesBatch=async scenesArr=>{
    const rows=scenesArr.map(sc=>{const{id,project_id,...rest}=sc;return{id:id||Math.random().toString(36).slice(2,10),project_id:currentId,user_id:user.id,data:rest};});
    const{data,error}=await sb.from('scenes').insert(rows).select();
    if(error){alert(`Could not save scenes: ${error.message}`);return;}
    if(data)setScenes(p=>[...p,...data.map(r=>({...r.data,id:r.id,project_id:r.project_id}))]);
  };
  const updateScene=async(id,upd)=>{
    setScenes(p=>p.map(s=>s.id===id?{...s,...upd}:s));
    const merged=scenes.find(s=>s.id===id);
    const{id:_omit,project_id:_omit2,...rest}={...merged,...upd};
    const{error}=await sb.from('scenes').update({data:rest}).eq('id',id);
    if(error)alert(`Could not save scene changes: ${error.message}`);
  };
  const deleteScene=async id=>{
    setScenes(p=>p.filter(s=>s.id!==id));
    const{error}=await sb.from('scenes').delete().eq('id',id);
    if(error)alert(`Could not delete scene: ${error.message}`);
  };
  /* Shoot day persistence — same JSONB 'data' pattern as scenes. Scene→day assignment is
     just a shootDayId field on the scene itself, set via the existing updateScene function. */
  const addShootDay=async d=>{
    const id=Math.random().toString(36).slice(2,10);
    const{data,error}=await sb.from('shoot_days').insert({id,project_id:currentId,user_id:user.id,data:d}).select().single();
    if(error){alert(`Could not add shoot day: ${error.message}`);return;}
    if(data)setShootDays(p=>[...p,{...data.data,id:data.id,project_id:data.project_id}]);
  };
  const updateShootDay=async(id,upd)=>{
    setShootDays(p=>p.map(d=>d.id===id?{...d,...upd}:d));
    const merged=shootDays.find(d=>d.id===id);
    const{id:_omit,project_id:_omit2,...rest}={...merged,...upd};
    const{error}=await sb.from('shoot_days').update({data:rest}).eq('id',id);
    if(error)alert(`Could not save shoot day changes: ${error.message}`);
  };
  const deleteShootDay=async id=>{
    setShootDays(p=>p.filter(d=>d.id!==id));
    scenes.filter(s=>s.shootDayId===id).forEach(s=>updateScene(s.id,{shootDayId:null}));
    const{error}=await sb.from('shoot_days').delete().eq('id',id);
    if(error)alert(`Could not delete shoot day: ${error.message}`);
  };
  /* Character metadata (Age/Description, Role Notes) — upserts by project_id + name */
  const saveCharacterMeta=async(name,updates)=>{
    if(!currentId||!name)return;
    const existing=characters.find(c=>c.project_id===currentId&&c.name.trim().toLowerCase()===name.trim().toLowerCase());
    const payload={age_description:updates.age_description??existing?.age_description??'',role_notes:updates.role_notes??existing?.role_notes??''};
    if(existing){
      setCharacters(p=>p.map(c=>c.id===existing.id?{...c,...payload}:c));
      const{error}=await sb.from('characters').update(payload).eq('id',existing.id);
      if(error)alert(`Could not save character notes: ${error.message}`);
    }else{
      const id=Math.random().toString(36).slice(2,10);
      const row={id,project_id:currentId,user_id:user.id,name:name.trim(),...payload};
      setCharacters(p=>[...p,row]);
      const{error}=await sb.from('characters').insert(row);
      if(error)alert(`Could not save character notes: ${error.message}`);
    }
  };
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
        <TopBar view={view} setView={setView} projects={projects} currentId={currentId} onSelect={id=>{setCurrentId(id||null);}} onCreate={()=>{setCurrentId(null);setView('dashboard');setShowNewModal(true);}}/>
        <div style={{flex:1,overflowY:'auto',padding:mobile?'16px 14px 90px':'24px 28px'}}>
          {view==='dashboard'&&(project?
            <ProductionDashboardView project={project} items={pBudget} advances={pAdvances} payees={payees.filter(p=>p.project_id===currentId)} onBack={()=>setCurrentId(null)}/>
            :<DashboardView projects={projects} budgetItems={budgetItems} advances={advances} reconEntries={reconEntries} payees={payees} currentId={currentId} onSelect={id=>{setCurrentId(id);}} onCreate={createProject} onDelete={deleteProjects} showModal={showNewModal} setShowModal={setShowNewModal} defaultCurrency={defaultCurrency}/>
          )}
          {view==='budgets'&&<BudgetsView project={project} items={pBudget} advances={pAdvances} reconEntries={pReconEntries} onAdd={addBudgetItem} onUpdate={updateBudgetItem} onRemove={removeBudgetItem} onApplyTemplate={applyTemplate} onApplyScript={applyScriptBudget}/>}
          {view==='breakdown'&&<BreakdownView project={project} scenes={scenes} characters={characters} onSaveCharacter={saveCharacterMeta} onAddScene={addScene} onAddScenes={addScenesBatch} onDeleteScene={deleteScene} onUpdateScene={updateScene}/>}
          {view==='workspace'&&<SchedulesView project={project} scenes={scenes} shootDays={shootDays} characters={characters.filter(c=>c.project_id===currentId)} onUpdateScene={updateScene} onAddDay={addShootDay} onUpdateDay={updateShootDay} onDeleteDay={deleteShootDay}/>}
          {view==='recon'&&<ReconView project={project} items={pBudget} advances={pAdvances} reconEntries={pReconEntries} onAddAdvance={addAdvance} onUpdateAdvance={updateAdvance} onAddEntry={addReconEntry} onRemoveEntry={removeReconEntry} onTopUp={topUpAdvance}/>}
          {view==='payments'&&<PaymentsView project={project} payees={payees.filter(p=>p.project_id===currentId)} onAddPayee={addPayee} onAddPayment={addPayment} onRemovePayment={removePayment}/>}
          {view==='market'&&<MarketplaceView onApplyTemplate={async tpl=>{if(!currentId){alert('Select a production first (top dropdown), or create one, before applying a template.');return;}await applyTemplate(tpl);setView('budgets');}}/>}
          {view==='ai'&&<AIView project={project} budgetItems={pBudget} advances={pAdvances}/>}
        </div>
      </div>
      {mobile&&<MobileNav view={view} setView={setView}/>}
    </div>
  );
}

/* ── Root ── */
function OnboardingScreen({onComplete}){
  const{t}=useLang();
  const[step,setStep]=useState(0);
  const[role,setRole]=useState(null);
  const[market,setMarket]=useState(null);
  const RadioCard=({selected,title,sub,onClick})=>(
    <button onClick={onClick} style={{width:'100%',textAlign:'left',background:selected?T.hi:T.panel,border:`1px solid ${selected?T.gold:T.line}`,borderRadius:10,padding:'14px 16px',marginBottom:10,cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div>
        <div style={{color:T.cream,fontFamily:'Manrope,sans-serif',fontSize:14,fontWeight:700}}>{title}</div>
        <div style={{color:T.dim,fontFamily:'Manrope,sans-serif',fontSize:12,marginTop:2}}>{sub}</div>
      </div>
      <div style={{width:16,height:16,borderRadius:'50%',border:`2px solid ${selected?T.gold:T.faint}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
        {selected&&<div style={{width:8,height:8,borderRadius:'50%',background:T.gold}}/>}
      </div>
    </button>
  );
  const canContinue=step===0||(step===1&&role)||(step===2&&market);
  return(
    <div style={{minHeight:'100vh',background:T.ink,display:'flex',flexDirection:'column',padding:'32px 24px',boxSizing:'border-box'}}>
      <div style={{display:'flex',justifyContent:'flex-end',maxWidth:420,margin:'0 auto',width:'100%'}}><LangToggle compact/></div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:step===0?'center':'flex-start',maxWidth:420,margin:'0 auto',width:'100%'}}>
        {step===0&&<>
          <div style={{fontFamily:'Fraunces,serif',fontSize:40,color:T.gold}}>NKÒ</div>
          <div style={{width:40,height:2,background:T.gold,margin:'16px 0'}}/>
          <div style={{color:T.dim,fontFamily:'Manrope,sans-serif',fontSize:15,lineHeight:1.6}}>{t('onboardTagline')}</div>
        </>}
        {step===1&&<>
          <div style={{color:T.goldDim,fontFamily:'Manrope,sans-serif',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>{t('step1Of2')}</div>
          <div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream,marginTop:8,marginBottom:6}}>{t('whatsYourRole')}</div>
          <div style={{color:T.dim,fontFamily:'Manrope,sans-serif',fontSize:13,marginBottom:24}}>{t('roleSubtitle')}</div>
          {ROLES.map(r=><RadioCard key={r.id} selected={role===r.id} title={r.label} sub={r.sub} onClick={()=>setRole(r.id)}/>)}
        </>}
        {step===2&&<>
          <div style={{color:T.goldDim,fontFamily:'Manrope,sans-serif',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>{t('step2Of2')}</div>
          <div style={{fontFamily:'Fraunces,serif',fontSize:26,color:T.cream,marginTop:8,marginBottom:6}}>{t('baseCurrency')}</div>
          <div style={{color:T.dim,fontFamily:'Manrope,sans-serif',fontSize:13,marginBottom:24}}>{t('currencySubtitle')}</div>
          {MARKETS.map(m=><RadioCard key={m.code} selected={market===m.code} title={m.country} sub={`${m.code} · ${m.symbol}`} onClick={()=>setMarket(m.code)}/>)}
        </>}
      </div>
      <div style={{maxWidth:420,margin:'0 auto',width:'100%'}}>
        <div style={{display:'flex',gap:6,marginBottom:20}}>
          {[0,1,2].map(i=><div key={i} style={{height:4,borderRadius:2,flex:1,background:i<=step?T.gold:T.line}}/>)}
        </div>
        <div style={{display:'flex',justifyContent:step===0?'flex-end':'space-between'}}>
          {step>0&&<Btn variant="ghost" onClick={()=>setStep(s=>s-1)}>{t('backBtn')}</Btn>}
          {step<2&&<Btn onClick={()=>canContinue&&setStep(s=>s+1)} style={{opacity:canContinue?1:.5}}>{step===0?t('getStarted'):t('continueBtn')}</Btn>}
          {step===2&&<Btn onClick={()=>canContinue&&onComplete({role,market})} style={{opacity:canContinue?1:.5}}>{t('finishBtn')}</Btn>}
        </div>
      </div>
    </div>
  );
}

function AuthGate(){
  const{user}=useAuth();
  const[onboardDone,setOnboardDone]=useState(true);
  useEffect(()=>{
    if(!user){setOnboardDone(true);return;}
    try{const s=JSON.parse(localStorage.getItem(`nko_onboarding_${user.id}`)||'null');setOnboardDone(!!s);}catch{setOnboardDone(false);}
  },[user]);
  if(!user)return<AuthScreen/>;
  if(!onboardDone)return<OnboardingScreen onComplete={({role,market})=>{localStorage.setItem(`nko_onboarding_${user.id}`,JSON.stringify({role,market,completedAt:Date.now()}));setOnboardDone(true);}}/>;
  return<MainApp/>;
}
export default function App(){
  useEffect(()=>{
    document.body.style.background='#141414';
    document.body.style.margin='0';
    document.body.style.padding='0';
  },[]);
  return<LangProvider><AuthProvider><AuthGate/></AuthProvider></LangProvider>;
}
