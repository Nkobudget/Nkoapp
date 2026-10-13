import { motion } from "framer-motion";
import { DURATION, EASE_OUT } from "../lib/motion";
import Pressable from "./motion/Pressable";

const Header = () => {
  const navLinks = [
    { label: "Products", href: "#products" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Resources", href: "#resources" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
      className="w-[90%] mx-auto flex items-center justify-between gap-8 py-4"
    >
     
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


      <div className="flex items-center gap-5">
        <button
          type="button"
          className="text-white text-sm font-medium hover:text-amber-400 transition-colors"
        >
          Login
        </button>
        
        <Pressable hover>
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
        </Pressable>
      </div>
    </motion.header>
  );
};

export default Header;