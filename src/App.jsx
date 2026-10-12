import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ImageDiagram from "./components/ImageDiagram";

const App = () => {
  return (
    <div className="min-h-screen bg-palette-black text-palette-ivory overflow-x-hidden">
      <Header />

      <main className="mx-auto w-[95%] max-w-screen-2xl flex flex-col gap-4 md:gap-8">
        <HeroSection />
        <ImageDiagram />
        <hr className="my-8 border-t border-palette-stone"/>
      </main>
    </div>
  );
};

export default App;