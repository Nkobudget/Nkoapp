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
import { Navigate, Route, Routes, useNavigate } from "react-router";
import SignInPage from "./auth/SignInPage";
import OnboardingWelcome from "./onboarding/OnboardingWelcome";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-palette-black text-palette-ivory overflow-x-hidden">
      <Header />

      <main className="mx-auto w-[95%] max-w-screen-2xl flex flex-col gap-4 md:gap-8">
        <HeroSection />
        <ImageDiagram />
        <hr className="my-8 border-t border-palette-stone"/>
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

  return (
    <SignInPage
      accountPrompt="New to NKO?"
      accountLinkLabel="Get started"
      onAccountClick={() => navigate("/onboarding")}
    />
  );
}

function OnboardingRoute() {
  const navigate = useNavigate();

  return (
    <OnboardingWelcome
      onSetUpProduction={() => navigate("/sign-in")}
      onSkip={() => navigate("/")}
      onBack={() => navigate("/")}
    />
  );
}

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/sign-in" element={<SignInRoute />} />
    <Route path="/onboarding" element={<OnboardingRoute />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
