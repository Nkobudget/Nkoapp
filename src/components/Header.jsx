const Header = () => {
  const navLinks = [
    { label: "Products", href: "#products" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Resources", href: "#resources" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="w-[95%] mx-auto flex items-center justify-between gap-8 py-4">
     
      <a href="/" className="shrink-0">
        <img
          src="/assets/logo.png"
          alt="Company logo"
          className="h-10 w-auto"
        />
      </a>

     
      <nav className="hidden md:flex items-center gap-8 text-white text-sm font-medium">
        {navLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="hover:text-amber-400 transition-colors"
          >
            {label}
          </a>
        ))}
      </nav>


      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-white text-sm font-medium hover:text-amber-400 transition-colors"
        >
          Login
        </button>
        
        <button
          type="button"
          className="rounded-full bg-palette-apricot px-5 py-2 text-sm font-semibold text-black 
                     transition-all duration-300 
                     shadow-[0_8px_20px_rgba(255,179,71,0.5)] 
                     hover:bg-amber-400 
                     hover:shadow-[0_8px_30px_rgba(255,179,71,0.8)]"
        >
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;