import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useScroll, useTransform, useMotionValue } from "framer-motion";

// FIX: Korrekte Dateinamen aus deinem Assets-Ordner
import cuckooClock from "../assets/cuckoo-house.svg";
import cuckooPendulum from "../assets/cuckoo-pendulum.svg";
import cuckooBird from "../assets/cuckoo-bird.svg";

// --- KONSTANTEN ---
const WIDTH_PX = 220;

export const CuckooClockSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTriggeredCuckoo, setHasTriggeredCuckoo] = useState(false);

  // Track scroll progress through this section (0 = top, 1 = bottom)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to sync progress
  const syncProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  // Display value for percentage
  const syncPercentage = useTransform(syncProgress, (v) => Math.round(v * 100));

  // Wir nutzen einen gemeinsamen Hook für BEIDE Pendel (Kollisionsphysik)
  const { leftAngle, rightAngle } = useCoupledPendulums(syncProgress);

  // Trigger cuckoo when reaching 100% sync
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.85 && !hasTriggeredCuckoo) {
        setHasTriggeredCuckoo(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, hasTriggeredCuckoo]);

  return (
    <section
      ref={sectionRef}
      className="min-h-[200vh] flex flex-col items-center justify-center bg-paper py-20 relative overflow-hidden"
    >
      {/* Sticky container that stays in viewport while scrolling */}
      <div className="sticky top-0 w-full min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            {/* VISUALISIERUNG: Die Uhren */}
            <div className="relative h-[450px] flex items-start justify-center">
              <div className="flex justify-center items-start -space-x-8">
                <Clock
                  angle={leftAngle}
                  isLeft={true}
                  syncProgress={syncProgress}
                  shouldTriggerCuckoo={hasTriggeredCuckoo}
                />
                <Clock
                  angle={rightAngle}
                  isLeft={false}
                  syncProgress={syncProgress}
                  shouldTriggerCuckoo={hasTriggeredCuckoo}
                />
              </div>
            </div>

            {/* TEXT CONTENT */}
            <div className="max-w-md space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <span className="font-body italic text-2xl text-primary/60">Die Huygens-Entdeckung</span>
                <h2 className="text-4xl md:text-5xl font-display text-primary leading-tight">
                  Synchronisation durch gemeinsame Resonanz
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-foreground text-lg leading-relaxed font-body">
                  <span className="italic">1665:</span> Das Experiment
                </p>
                <p className="text-foreground text-lg leading-relaxed font-body">
                  Christiaan Huygens, der Erfinder der Pendeluhr, bemerkte etwas Merkwürdiges: Zwei Uhren,
                  die am gleichen Holzbalken hingen, synchronisierten ihre Schwingungen automatisch.
                </p>

                <blockquote className="italic text-muted-foreground border-l-4 border-primary pl-4">
                  "Sie fanden durch unmerkliche Vibrationen im Holz immer in einen gemeinsamen Rhythmus."
                </blockquote>

                <p className="text-foreground text-lg leading-relaxed font-body">
                  <span className="font-semibold text-primary">Hertz an Hertz:</span> Wir nutzen dieses Prinzip für Beziehungen.
                  Die Karten sind euer "Balken". Indem ihr euch auf die gleiche Frage (Frequenz) einstimmt,
                  schafft ihr Resonanz.
                </p>

                {/* Progress indicator */}
                <div className="pt-4">
                  <motion.div
                    className="h-2 bg-secondary rounded-full overflow-hidden"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      style={{ scaleX: syncProgress, transformOrigin: "left" }}
                    />
                  </motion.div>
                  <motion.p
                    className="text-sm text-muted-foreground mt-2 font-body italic text-center md:text-left"
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]) }}
                  >
                    Synchronisation: <motion.span className="text-primary font-semibold">{syncPercentage}%</motion.span>
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SUB-KOMPONENTE: Einzelne Uhr ---
const Clock = ({
  angle,
  isLeft,
  syncProgress,
  shouldTriggerCuckoo,
}: {
  angle: number;
  isLeft: boolean;
  syncProgress: any;
  shouldTriggerCuckoo: boolean;
}) => {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [cuckooHasRun, setCuckooHasRun] = useState(false);
  const controls = useAnimation();

  // Trigger cuckoo only once when signal received and only on one clock
  useEffect(() => {
    if (shouldTriggerCuckoo && !cuckooHasRun && isLeft) {
      triggerCuckoo();
      setCuckooHasRun(true);
    }
  }, [shouldTriggerCuckoo, cuckooHasRun, isLeft]);

  const triggerCuckoo = async () => {
    setDoorsOpen(true);
    await new Promise((r) => setTimeout(r, 400));
    await controls.start({ x: 0, transition: { type: "spring", bounce: 0.5 } });
    await new Promise((r) => setTimeout(r, 1500));
    await controls.start({ x: 40, transition: { duration: 0.3 } });
    setDoorsOpen(false);
  };

  // Calculate clock hands positions based on scroll progress
  // Start: 10:10 (hour hand at 310°, minute hand at 60°)
  // End: 10:15 (hour hand at 312.5°, minute hand at 90°)
  const hourHandRotation = useTransform(syncProgress, [0, 1], [310, 312.5]);
  const minuteHandRotation = useTransform(syncProgress, [0, 1], [60, 90]);

  return (
    <div className="relative shrink-0" style={{ width: WIDTH_PX, height: WIDTH_PX * 1.5, zIndex: 10 }}>
      {/* 1. GEHÄUSE (Hintergrund) */}
      <img src={cuckooClock} alt="Clock Housing" className="absolute inset-0 w-full h-full object-contain z-20" />

      {/* 2. PENDEL (Hinter dem Gehäuse visuell, aber technisch im Container) */}
      <motion.div
        className="absolute left-1/2 w-[80%] origin-top"
        style={{
          top: "68%",
          x: "-50%",
          rotate: angle,
          zIndex: 5,
        }}
      >
        <img
          src={cuckooPendulum}
          alt="Pendulum"
          className="w-full h-auto drop-shadow-md"
          style={{ mixBlendMode: "multiply" }}
        />
      </motion.div>

      {/* 3. ZEIGER (Müssen sich um Pivot drehen) */}
      <div
        className="absolute inset-0 z-30"
        style={{ top: "26%", left: "0%", width: "100%", height: "30%" }}
      >
        {/* Stundenzeiger */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: "50%",
            left: "50%",
            width: "6px",
            height: "25%",
            originY: 1,
            originX: 0.5,
            x: "-50%",
            y: "-100%",
            rotate: hourHandRotation,
            backgroundColor: "hsl(var(--ink))",
          }}
        />
        {/* Minutenzeiger */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: "50%",
            left: "50%",
            width: "4px",
            height: "35%",
            originY: 1,
            originX: 0.5,
            x: "-50%",
            y: "-100%",
            rotate: minuteHandRotation,
            backgroundColor: "hsl(var(--ink))",
          }}
        />
        {/* Zentraler Pin */}
        <div
          className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 z-40"
          style={{ backgroundColor: "hsl(var(--ink))" }}
        />
      </div>

      {/* 4. TÜREN & VOGEL (Ganz oben) */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[20%] h-[15%] z-40 overflow-hidden perspective-500">
        {/* Vogel */}
        <motion.img
          src={cuckooBird}
          initial={{ x: 40 }}
          animate={controls}
          className="absolute top-2 left-2 w-full h-full object-contain z-10"
          alt="Cuckoo bird"
        />

        {/* Linke Tür */}
        <motion.div
          className="absolute left-0 top-0 w-1/2 h-full origin-left"
          style={{
            backgroundColor: "hsl(var(--primary))",
            borderRight: "1px solid hsl(var(--ink))"
          }}
          animate={{ rotateY: doorsOpen ? -110 : 0 }}
          transition={{ duration: 0.4 }}
        />
        {/* Rechte Tür */}
        <motion.div
          className="absolute right-0 top-0 w-1/2 h-full origin-right"
          style={{
            backgroundColor: "hsl(var(--primary))",
            borderLeft: "1px solid hsl(var(--ink))"
          }}
          animate={{ rotateY: doorsOpen ? 110 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
};

// --- PHYSIK HOOK: Das Herzstück ---
const useCoupledPendulums = (syncProgress: any) => {
  const [leftAngle, setLeftAngle] = useState(25);
  const [rightAngle, setRightAngle] = useState(-20);

  const velL = useRef(0);
  const velR = useRef(0);
  const lastTime = useRef(performance.now());
  const currentSyncRef = useRef(0);

  // Subscribe to MotionValue changes without causing re-renders
  useEffect(() => {
    const unsubscribe = syncProgress.on("change", (latest: number) => {
      currentSyncRef.current = latest;
    });
    return () => unsubscribe();
  }, [syncProgress]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime.current) / 1000, 0.016); // Cap at 60fps
      lastTime.current = time;

      // Physik-Konstanten
      const naturalFreq = 3.0;
      const damping = 0.995;
      const couplingStrength = currentSyncRef.current * 0.15;

      // 1. Beschleunigung berechnen (Harmonischer Oszillator)
      let accL = -naturalFreq * leftAngle;
      let accR = -naturalFreq * rightAngle;

      // 2. Kopplung hinzufügen (Der "Huygens Balken")
      accL += couplingStrength * (rightAngle - leftAngle);
      accR += couplingStrength * (leftAngle - rightAngle);

      // 3. Geschwindigkeit updaten
      velL.current += accL * dt;
      velR.current += accR * dt;

      // Dämpfung
      velL.current *= damping;
      velR.current *= damping;

      // 4. Position updaten
      const nextAngleL = leftAngle + velL.current;
      const nextAngleR = rightAngle + velR.current;

      setLeftAngle(nextAngleL);
      setRightAngle(nextAngleR);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [leftAngle, rightAngle]); // Keep dependencies to restart on state change

  return { leftAngle, rightAngle };
};
