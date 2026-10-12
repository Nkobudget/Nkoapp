import { motion } from "framer-motion";
import { DURATION, EASE_OUT, VIEWPORT } from "../lib/motion";

const ImageDiagram = () => {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-5xl">
        <motion.img
          src="/assets/Background.png"
          alt="NKO dashboard showing budget breakdown and production schedule"
          loading="lazy"
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          className="w-full h-auto rounded-2xl shadow-2xl shadow-black/50"
        />
      </div>
    </section>
  );
};

export default ImageDiagram;
