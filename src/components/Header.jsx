import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DURATION, EASE_OUT } from "../lib/motion";
import Pressable from "./motion/Pressable";
import { Link } from "react-router";
import BrandHomeLink from "./BrandHomeLink";
import AccountMenu from "./AccountMenu";
import { useAuth } from "../auth/AuthContext";

const Header = () => {
  const { status, user } = useAuth();
  const loginRef = useRef(null);
  const [signedOutHere, setSignedOutHere] = useState(false);
  const navLinks = [
    { label: "Products", href: "#products" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Resources", href: "#resources" },
    { label: "Pricing", href: "#pricing" },
  ];

  const signedIn = status === "authenticated" && !!user;

  // After signing out from the account menu, keep keyboard focus in the header.
  useEffect(() => {
    if (signedOutHere && !signedIn) {
      loginRef.current?.focus();
      setSignedOutHere(false);
    }
  }, [signedOutHere, signedIn]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
      className="relative z-50 w-[90%] mx-auto flex items-center justify-between gap-4 py-4 lg:gap-8"
    >
     
      <BrandHomeLink className="h-10 w-auto" />

     
      <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8 text-white text-sm font-medium">
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


      <div className="flex min-h-10 items-center gap-5">
        {status === "loading" ? (
          // Reserve space while the session is restored so the header doesn't flash Login.
          <span aria-hidden="true" className="block size-10" />
        ) : signedIn ? (
          <AccountMenu onSignedOut={() => setSignedOutHere(true)} />
        ) : (
          <>
            <Link
              ref={loginRef}
              to="/app"
              className="rounded-sm text-white text-sm font-medium hover:text-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-apricot"
            >
              Login
            </Link>
            
            <Pressable hover>
              <Link
                to="/onboarding"
                className="rounded-full bg-palette-apricot px-5 py-2 text-sm font-semibold text-black 
                           transition-all duration-300 
                           shadow-[0_8px_20px_rgba(255,179,71,0.5)] 
                           hover:bg-amber-400 
                           hover:shadow-[0_8px_30px_rgba(255,179,71,0.8)]"
              >
                Get Started
              </Link>
            </Pressable>
          </>
        )}
      </div>
    </motion.header>
  );
};

export default Header;