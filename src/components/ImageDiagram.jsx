import { motion } from "framer-motion";
import { DURATION, EASE_OUT, VIEWPORT } from "../lib/motion";




const SRC_W = 1256;
const SRC_H = 749;
const WIN_X = 97;
const WIN_Y = 62;
const WIN_W = 1062;
const WIN_H = 555;
const WIN_RADIUS = 8;

const pct = (n) => `${(n * 100).toFixed(4)}%`;

const frameStyle = {
  aspectRatio: `${WIN_W} / ${WIN_H}`,
  
  borderRadius: `${pct(WIN_RADIUS / WIN_W)} / ${pct(WIN_RADIUS / WIN_H)}`,
};

const imgStyle = {
  width: pct(SRC_W / WIN_W),
  left: pct(-WIN_X / WIN_W),
  top: pct(-WIN_Y / WIN_H),
  
  
  filter: "brightness(1.06) contrast(1.1) saturate(1.06)",
};

const ImageDiagram = () => {
  return (
    <section className="w-full pb-14 sm:pb-20 lg:pb-24">
      {}
      <div className="mx-auto w-full max-w-[1062px]">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          className="relative w-full overflow-hidden bg-[#111111] ring-1 ring-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.9),0_24px_60px_-12px_rgba(0,0,0,0.85),0_0_80px_-20px_rgba(255,178,62,0.18)]"
          style={frameStyle}
        >
          <img
            src="/assets/Background.png"
            alt="NKO dashboard showing budget breakdown and production schedule"
            loading="lazy"
            decoding="async"
            width={SRC_W}
            height={SRC_H}
            draggable={false}
            className="absolute h-auto max-w-none select-none"
            style={imgStyle}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ImageDiagram;
