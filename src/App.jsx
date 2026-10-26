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
import { useAuth } from "./auth/AuthContext";
import AuthGate from "./auth/AuthGate";
import AuthProvider from "./auth/AuthProvider";
import LangProvider from "./i18n/LangProvider";
import { isRecoveryCallback, isSessionCallback, authCallbackError } from "./lib/supabaseClient";
import AuthStatus from "./auth/AuthStatus";


class DashboardBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <main className="min-h-svh bg-palette-black p-8 text-palette-ivory">
      <h1 className="text-2xl">The workspace could not load.</h1>
      <p className="mt-3">Please reload the page and try again.</p>
      <button type="button" className="mt-5 rounded bg-palette-gold px-4 py-3 text-palette-black" onClick={() => window.location.reload()}>Reload workspace</button>
      <Link to="/" className="ml-4 underline">Return home</Link>
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
  const { status, error, retry } = useAuth();

  if (status === "authenticated") return <Navigate to="/app" replace />;
  if (status === "loading") return <AuthStatus />;
  if (status === "error") return <AuthStatus error={error} onRetry={retry} />;

  return (
    <SignInPage
      introText="Sign in to your NKŌ workspace and keep your production moving."
      onEmailContinue={() => navigate("/app")}
      googleUnavailableMessage="Google sign-in is not enabled yet. Please continue with email."
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
      onSetUpProduction={() => navigate("/sign-in")}
      onSkip={() => navigate("/")}
      onBack={() => navigate("/")}
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
    <Route path="/app/*" element={<DashboardBoundary><AuthGate /></DashboardBoundary>} />
    <Route path="/dashboard" element={<Navigate to="/app" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

export default function App() {
  return <LangProvider><AuthProvider><AppRoutes /></AuthProvider></LangProvider>;
}