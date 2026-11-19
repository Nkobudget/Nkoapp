import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ImageDiagram from "./components/ImageDiagram";
import ProductionComplexitySection from "./components/ProductionComplexitySection";
import ProductionFeatures from "./components/ProductionFeatures";
import ProductionIntelligenceSection from "./components/ProductionIntelligenceSection";
import ProductionOverviewSection from "./components/ProductionOverviewSection";
import ProductionWorkflowSection from "./components/ProductionWorkflowSection"
import ProductionRolesSection from "./components/ProductionRolesSection"
import AIControlSection from "./components/AIControlSection"
import ProductionCTASection from "./components/ProductionCTASection"
import Footer from "./components/Footer"
import { Component, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import SignInPage from "./auth/SignInPage";
import OnboardingWelcome from "./onboarding/OnboardingWelcome";
import OnboardingSetupPage from "./onboarding/OnboardingSetupPage";
import OnboardingProductionChoicePage from "./onboarding/OnboardingProductionChoicePage";
import OnboardingProductionDetailsPage from "./onboarding/OnboardingProductionDetailsPage";
import OnboardingScalePage from "./onboarding/OnboardingScalePage";
import OnboardingGoalsPage from "./onboarding/OnboardingGoalsPage";
import OnboardingAISetupPage from "./onboarding/OnboardingAISetupPage";
import OnboardingStartingPointPage from "./onboarding/OnboardingStartingPointPage";
import { useAuth } from "./auth/AuthContext";
import AuthGate from "./auth/AuthGate";
import AuthProvider from "./auth/AuthProvider";
import PendingProductionSaver, { PENDING_KEY, readPending, clearPending } from "./auth/PendingProductionSaver";
import { saveOnboardingProduction } from "./onboarding/saveOnboardingProduction";
import { supabase } from "./lib/supabaseClient";
import LangProvider from "./i18n/LangProvider";
import { isRecoveryCallback, isSessionCallback, authCallbackError } from "./lib/supabaseClient";
import AuthStatus from "./auth/AuthStatus";


class DashboardBoundary extends Component {
  state = { failed: false, error: null };
  static getDerivedStateFromError(error) { return { failed: true, error }; }
  componentDidCatch(error, errorInfo) {
    console.error("DashboardBoundary caught an error:", error, errorInfo);
  }
  render() {
    return this.state.failed ? <main className="min-h-svh bg-palette-black p-8 text-palette-ivory">
      <h1 className="text-2xl">The workspace could not load.</h1>
      <p className="mt-3">Please reload the page and try again.</p>
      {this.state.error && (
        <div className="mt-4 max-w-xl rounded border border-palette-graphite bg-palette-charcoal p-4 text-xs font-mono text-palette-apricot">
          {this.state.error.message || String(this.state.error)}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="button" className="rounded bg-palette-gold px-4 py-3 text-palette-black font-semibold" onClick={() => window.location.reload()}>Reload workspace</button>
        <button type="button" className="rounded border border-palette-graphite px-4 py-3 text-palette-ivory text-sm hover:border-palette-gold" onClick={() => { try { localStorage.clear(); sessionStorage.clear(); } catch {} window.location.href = '/app'; }}>Clear session & retry</button>
        <Link to="/" className="underline text-sm">Return home</Link>
      </div>
    </main> : this.props.children;
  }
}

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-palette-black text-palette-ivory overflow-x-hidden">
      <Header />

      <main className="mx-auto w-[95%] max-w-screen-2xl flex flex-col">
        <HeroSection />
        <ImageDiagram />
        <ProductionFeatures id="features" />
        <ProductionComplexitySection
          productionImage="/assets/product-complex2.png"
          workspaceImage="/assets/product-complex1.png"
          productionImageAlt="Film crew working on set"
          workspaceImageAlt="Production planning workspace"
         />
         <ProductionIntelligenceSection/>
         <ProductionWorkflowSection
          images={{
            budgeting: "/assets/budget.png",
            breakdown: "/assets/planning.png",
            schedule: "/assets/knowing.png",
            reconciliation: "/assets/money.png",
            payments: "/assets/control.png",
          }}
        />
        <ProductionOverviewSection/>
        <ProductionRolesSection />
        <AIControlSection />
        <ProductionCTASection
         backgroundImage="/assets/studio.png" 
         />
        <Footer/> 
      </main>
    </div>
  );
};

function SignInRoute() {
  const navigate = useNavigate();
  // CHANGED: also pull signInWithGoogle from the auth context.
  const { status, error, retry, signInWithGoogle } = useAuth();

  if (status === "authenticated") return <Navigate to="/app" replace />;
  if (status === "loading") return <AuthStatus />;
  if (status === "error") return <AuthStatus error={error} onRetry={retry} />;

  return (
    <SignInPage
      introText="Sign in to your NKŌ workspace and keep your production moving."
      // CHANGED: Google handler passed in, so the button is enabled.
      onGoogleContinue={signInWithGoogle}
      onEmailContinue={() => navigate("/app")}
      // CHANGED: removed googleUnavailableMessage (Google is now enabled).
      accountPrompt="New to NKO?"
      accountLinkLabel="Get started"
      onAccountClick={() => navigate("/onboarding")}
    />
  );
}

function OnboardingRoute() {
  const navigate = useNavigate();
  const { status } = useAuth();
  if (status === "loading") return <AuthStatus />;
  if (status === "authenticated") return <Navigate to="/app" replace />;

  return (
    <OnboardingWelcome
      onSetUpProduction={() => navigate("/onboarding/setup")}
      onSkip={() => navigate("/")}
      onBack={() => navigate("/")}
    />
  );
}

function OnboardingSetupRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAuth();
  if (status === "loading") return <AuthStatus />;

  const profile = location.state || readPending();

  return (
    <OnboardingSetupPage
      profile={profile}
      onBack={() => navigate("/onboarding")}
      onContinue={(nextProfile) => {
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(nextProfile)); } catch {}
        navigate("/onboarding/production", { state: nextProfile });
      }}
    />
  );
}

function OnboardingProductionRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAuth();
  if (status === "loading") return <AuthStatus />;

  const profile = location.state || readPending();

  return (
    <OnboardingProductionChoicePage
      profile={profile}
      onBack={() => navigate("/onboarding/setup", { state: profile })}
      onSelectOption={(choice) => {
        const nextProfile = { ...(profile || {}), choice };
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(nextProfile)); } catch {}
        navigate("/onboarding/production/details", { state: nextProfile });
      }}
    />
  );
}

function OnboardingProductionDetailsRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAuth();
  if (status === "loading") return <AuthStatus />;

  const profile = location.state || readPending();

  return (
    <OnboardingProductionDetailsPage
      profile={profile}
      onBack={() => navigate("/onboarding/production", { state: profile })}
      onContinue={(nextProfile) => {
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(nextProfile)); } catch {}
        navigate("/onboarding/scale", { state: nextProfile });
      }}
    />
  );
}

function OnboardingScaleRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAuth();
  if (status === "loading") return <AuthStatus />;

  const profile = location.state || readPending();

  return (
    <OnboardingScalePage
      profile={profile}
      onBack={() => navigate("/onboarding/production/details", { state: profile })}
      onContinue={(nextProfile) => {
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(nextProfile)); } catch {}
        navigate("/onboarding/goals", { state: nextProfile });
      }}
    />
  );
}

function OnboardingGoalsRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAuth();
  if (status === "loading") return <AuthStatus />;

  const profile = location.state || readPending();

  return (
    <OnboardingGoalsPage
      profile={profile}
      onBack={() => navigate("/onboarding/scale", { state: profile })}
      onContinue={(nextProfile) => {
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(nextProfile)); } catch {}
        navigate("/onboarding/ai-setup", { state: nextProfile });
      }}
    />
  );
}

function OnboardingAISetupRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAuth();
  if (status === "loading") return <AuthStatus />;

  const profile = location.state || readPending();

  return (
    <OnboardingAISetupPage
      profile={profile}
      onBack={() => navigate("/onboarding/goals", { state: profile })}
      onGenerate={(nextProfile) => {
        const merged = nextProfile || profile;
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(merged)); } catch {}
        navigate("/onboarding/starting-point", { state: merged });
      }}
    />
  );
}

function OnboardingStartingPointRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, user } = useAuth();
  const [saving, setSaving] = useState(false);

  if (status === "loading" || saving) return <AuthStatus />;

  const profile = location.state || readPending();

  return (
    <OnboardingStartingPointPage
      profile={profile}
      onBack={() => navigate("/onboarding/ai-setup", { state: profile })}
      onMakeChanges={() => navigate("/onboarding/setup", { state: profile })}
      onOpenProduction={async () => {
        const draft = profile || {};
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(draft)); } catch {}

        if (status === "authenticated" && user && supabase) {
          setSaving(true);
          try {
            const saved = await saveOnboardingProduction(supabase, user, draft);
            if (saved) {
              clearPending();
              window.location.replace("/app");
              return;
            }
          } catch (err) {
            console.error("Direct production saving failed, falling back to sign-in saver:", err);
          } finally {
            setSaving(false);
          }
        }
        navigate("/sign-in");
      }}
    />
  );
}

function AppRoutes() {
  const { recovery, status } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [rootCallback, setRootCallback] = useState(() => location.pathname === "/" && (isRecoveryCallback || isSessionCallback || !!authCallbackError));
  useEffect(() => {
    // Old emailed root URLs still work; wait until the SDK has consumed tokens.
    if (rootCallback && status !== "loading") {
      setRootCallback(false);
      navigate("/app", { replace: true });
    }
  }, [rootCallback, status, navigate]);
  if (rootCallback || recovery) return <DashboardBoundary><AuthGate /></DashboardBoundary>;
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/sign-in" element={<SignInRoute />} />
    <Route path="/onboarding" element={<OnboardingRoute />} />
    <Route path="/onboarding/setup" element={<OnboardingSetupRoute />} />
    <Route path="/onboarding/production" element={<OnboardingProductionRoute />} />
    <Route path="/onboarding/production/details" element={<OnboardingProductionDetailsRoute />} />
    <Route path="/onboarding/scale" element={<OnboardingScaleRoute />} />
    <Route path="/onboarding/goals" element={<OnboardingGoalsRoute />} />
    <Route path="/onboarding/ai-setup" element={<OnboardingAISetupRoute />} />
    <Route path="/onboarding/starting-point" element={<OnboardingStartingPointRoute />} />
    <Route path="/app/*" element={<DashboardBoundary><AuthGate /></DashboardBoundary>} />
    <Route path="/dashboard" element={<Navigate to="/app" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

export default function App() {
  return <LangProvider><AuthProvider><PendingProductionSaver /><AppRoutes /></AuthProvider></LangProvider>;
}