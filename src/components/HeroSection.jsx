import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Link } from "react-router";
import { fadeUp, staggerContainer } from "../lib/motion";
import Pressable from "./motion/Pressable";

const HeroSection = () => {
  return (
    <motion.section
      variants={staggerContainer(0.09, 0.05)}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center gap-6 px-4 pt-14 pb-10 md:pt-20 md:pb-14 lg:pt-24 lg:pb-16"
    >
    
      <motion.span
        variants={fadeUp}
        className="text-sm md:text-[14px] font-medium tracking-wide text-palette-apricot"
      >
        AI-Powered Production Management
      </motion.span>

      <motion.h1
        variants={fadeUp}
        className="text-4xl md:text-5xl lg:text-[64px] font-medium leading-[1.1] tracking-tight text-palette-ivory text-balance"
      >
        Build smarter productions{" "}
        <span className="block text-palette-stone">
          Budget with confidence.
        </span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="max-w-[648px] text-base md:text-lg leading-relaxed text-palette-stone text-pretty"
      >
        NKO brings budgeting, production breakdowns, schedules, reconciliation,
        and payments into one intelligent workspace helping production teams
        spend less time managing spreadsheets and more time bringing stories to
        life.
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="mt-2 flex flex-col sm:flex-row items-center gap-4"
      >

        <Pressable hover className="inline-flex">
          <Link
            to="/app?mode=signup"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl
                       bg-palette-apricot px-6 py-4 text-[15px] font-medium text-black
                       transition-all duration-200 cursor-pointer
                       hover:brightness-110
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-apricot focus-visible:ring-offset-2 focus-visible:ring-offset-black
                       shadow-[0_8px_24px_rgba(255,179,71,0.25)] hover:shadow-[0_10px_30px_rgba(255,179,71,0.45)]"
          >
            Create Your Production
            <MoveRight
              strokeWidth={1.5}
              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </Pressable>


        <Pressable className="inline-flex">
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-2xl
                       border border-palette-ivory/80 px-6 py-4 text-[15px] font-medium text-palette-ivory
                       transition-colors duration-200 cursor-pointer
                       hover:bg-palette-ivory hover:text-black
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            See How NKO Works
          </a>
        </Pressable>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
