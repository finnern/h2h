import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SingleCuckooClock } from "./SingleCuckooClock";

export const CuckooClockSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const syncProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const [currentSync, setCurrentSync] = useState(0);

  useEffect(() => {
    const unsubscribe = syncProgress.on("change", (v) => setCurrentSync(v));
    return () => unsubscribe();
  }, [syncProgress]);

  return (
    // Changed bg to a warm cream tone to match the Hertz vibe
    <section ref={containerRef} className="relative w-full bg-[#FAF9F6] text-[#4A3728] py-24 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16 items-start">

        {/* --- LEFT COLUMN --- */}
        <div className="hidden lg:flex sticky top-20 flex-col items-center w-full">

          {/* Clocks - Added extra padding bottom for pendulums */}
          <div className="flex justify-center gap-4 w-full mb-24 pt-8">
            <SingleCuckooClock syncProgress={currentSync} isLeftClock={true} />
            <SingleCuckooClock syncProgress={currentSync} isLeftClock={false} />
          </div>

          {/* Sync Meter - Warm Colors */}
          <div className="w-full max-w-xs">
             <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60 mb-3">
                <span>Chaos</span>
                <span>Resonance</span>
             </div>
             <div className="w-full h-1.5 bg-[#E5E0D8] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-rose-600"
                  style={{ width: `${currentSync * 100}%` }}
                />
             </div>
             <p className="text-center opacity-50 text-sm mt-3 font-serif italic">
               Synchronisation: {Math.round(currentSync * 100)}%
             </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="relative pt-4">

          {/* Mobile Clocks */}
          <div className="lg:hidden flex justify-center gap-2 mb-20 scale-90 origin-top">
            <SingleCuckooClock syncProgress={currentSync} isLeftClock={true} />
            <SingleCuckooClock syncProgress={currentSync} isLeftClock={false} />
          </div>

          <span className="text-rose-600 font-serif italic text-xl mb-4 block">
            Die Huygens-Entdeckung
          </span>

          <h2 className="text-4xl md:text-5xl font-serif mb-10 leading-[1.15]">
            Synchronisation durch<br/>gemeinsame Resonanz
          </h2>

          <div className="prose prose-lg text-[#4A3728]/80 leading-relaxed space-y-12">
            <div>
              <p className="font-semibold text-[#4A3728]">1665: Das Experiment</p>
              <p>
                Christiaan Huygens, der Erfinder der Pendeluhr, bemerkte etwas Merkwürdiges:
                Zwei Uhren, die am gleichen Holzbalken hingen, synchronisierten ihre Schwingungen
                automatisch.
              </p>
            </div>

            <div className="pl-6 border-l-2 border-rose-200">
              <p className="italic opacity-70">
                "Sie fanden durch unmerkliche Vibrationen im Holz immer in einen gemeinsamen Rhythmus."
              </p>
            </div>

            <div>
              <p className="font-semibold text-[#4A3728]">Hertz an Hertz</p>
              <p>
                Wir nutzen dieses Prinzip für Beziehungen. Die Karten sind euer "Balken".
                Indem ihr euch auf die gleiche Frage (Frequenz) einstimmt, schafft ihr
                die Resonanz.
              </p>
            </div>

             <div className="h-[20vh]"></div>
          </div>
        </div>

      </div>
    </section>
  );
};
