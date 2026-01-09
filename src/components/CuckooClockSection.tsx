import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// Import cuckoo clock assets
import cuckooHouse from "@/assets/cuckoo-house.svg";
import cuckooBird from "@/assets/cuckoo-bird.svg";
import cuckooDoorLeft from "@/assets/cuckoo-door-left.svg";
import cuckooDoorRight from "@/assets/cuckoo-door-right.svg";
import cuckooHourHand from "@/assets/cuckoo-hour-hand.svg";
import cuckooMinuteHand from "@/assets/cuckoo-minute-hand.svg";
import cuckooPendulum from "@/assets/cuckoo-pendulum.svg";

// Pendulum physics simulation with chaotic-to-sync behavior
const usePendulumSwing = (isLeft: boolean, syncProgress: number) => {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const frequency = 2.2;

      // Phase offset for chaotic start, reduces to 0 as sync increases
      const basePhaseOffset = isLeft ? 0 : Math.PI * 0.7;
      const effectivePhaseOffset = basePhaseOffset * (1 - syncProgress);

      // Chaos when not synced
      const chaosAmount = (1 - syncProgress) * 0.4;
      const chaos =
        chaosAmount *
        Math.sin(elapsed * 1.3 + (isLeft ? 0 : 2)) *
        Math.sin(elapsed * 0.7);

      const amplitude = 28 + (1 - syncProgress) * 8;
      const pendulumAngle =
        Math.sin(elapsed * frequency + effectivePhaseOffset + chaos) * amplitude;

      setAngle(pendulumAngle);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isLeft, syncProgress]);

  return angle;
};

interface CuckooClockProps {
  isLeft: boolean;
  syncProgress: number;
  minuteHandRotation: number;
  doorsOpen: boolean;
  birdOut: boolean;
}

const CuckooClock = ({
  isLeft,
  syncProgress,
  minuteHandRotation,
  doorsOpen,
  birdOut,
}: CuckooClockProps) => {
  const pendulumAngle = usePendulumSwing(isLeft, syncProgress);

  // Visual tuning constants (easy to tweak step-by-step)
  const WIDTH_PX = 150;
  const PENDULUM = {
    top: "43%", // ensures top part is behind the house
    left: "-6%",
    width: "112%", // bigger
  } as const;

  const BIRD = {
    top: "7.5%",
    left: "42.5%",
    width: "14%",
  } as const;

  const DOOR = {
    top: "7.3%",
    leftLeft: "38.5%",
    leftRight: "50%",
    width: "19%", // each door; combined covers the hole
  } as const;

  const HANDS_SCALE = 0.62;

  const doorLeftRotation = doorsOpen ? -80 : 0;
  const doorRightRotation = doorsOpen ? 80 : 0;

  return (
    // Reference frame (overflow visible so the pendulum can hang below)
    <div
      className="clock-wrapper relative overflow-visible"
      style={{
        width: `${WIDTH_PX}px`,
        aspectRatio: "1 / 1.2",
      }}
    >
      {/* White card background (hides the pendulum SVG's white frame while swinging) */}
      <div
        className="absolute inset-0 rounded-md bg-paper shadow-sm"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Pendulum (BEHIND the house) */}
      <motion.img
        src={cuckooPendulum}
        alt="Pendel"
        className="absolute"
        style={{
          zIndex: 1,
          mixBlendMode: "multiply",
          height: "auto",
          top: PENDULUM.top,
          left: PENDULUM.left,
          width: PENDULUM.width,
          transformOrigin: "50% 6%",
        }}
        animate={{ rotate: pendulumAngle }}
        transition={{
          type: "tween",
          ease: [0.37, 0, 0.63, 1],
          duration: 0.016,
        }}
      />

      {/* House */}
      <img
        src={cuckooHouse}
        alt="Kuckucksuhr-Gehäuse"
        className="absolute"
        style={{
          zIndex: 10,
          mixBlendMode: "multiply",
          width: "100%",
          height: "auto",
          top: 0,
          left: 0,
        }}
      />

      {/* Clock hands (SVG pointers, scaled down) */}
      <div
        className="absolute"
        style={{
          zIndex: 16,
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <motion.img
          src={cuckooHourHand}
          alt="Stundenzeiger"
          className="absolute"
          style={{
            inset: 0,
            width: "100%",
            height: "100%",
            mixBlendMode: "multiply",
            transformOrigin: "50% 50%",
            scale: HANDS_SCALE,
          }}
          animate={{ rotate: -60 }}
          transition={{ type: "tween", ease: "linear" }}
        />

        <motion.img
          src={cuckooMinuteHand}
          alt="Minutenzeiger"
          className="absolute"
          style={{
            inset: 0,
            width: "100%",
            height: "100%",
            mixBlendMode: "multiply",
            transformOrigin: "50% 50%",
            scale: HANDS_SCALE,
          }}
          animate={{ rotate: minuteHandRotation }}
          transition={{ type: "tween", ease: "linear" }}
        />
      </div>

      {/* Bird (hidden behind doors until cuckoo moment) */}
      <motion.img
        src={cuckooBird}
        alt="Kuckuck"
        className="absolute"
        style={{
          zIndex: 18,
          mixBlendMode: "multiply",
          width: BIRD.width,
          height: "auto",
          top: BIRD.top,
          left: BIRD.left,
        }}
        animate={{
          opacity: birdOut ? 1 : 0,
          scale: birdOut ? 1 : 0.85,
          y: birdOut ? "-6%" : "8%",
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 20,
        }}
      />

      {/* Doors (bigger, cover the whole hole) */}
      <motion.img
        src={cuckooDoorLeft}
        alt="Tür links"
        className="absolute"
        style={{
          zIndex: 25,
          mixBlendMode: "multiply",
          width: DOOR.width,
          height: "auto",
          top: DOOR.top,
          left: DOOR.leftLeft,
          transformOrigin: "0% 50%",
        }}
        animate={{ rotateY: doorLeftRotation }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      />

      <motion.img
        src={cuckooDoorRight}
        alt="Tür rechts"
        className="absolute"
        style={{
          zIndex: 25,
          mixBlendMode: "multiply",
          width: DOOR.width,
          height: "auto",
          top: DOOR.top,
          left: DOOR.leftRight,
          transformOrigin: "100% 50%",
        }}
        animate={{ rotateY: doorRightRotation }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      />
    </div>
  );
};

export const CuckooClockSection = () => {
  const { language } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasCuckooed, setHasCuckooed] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [birdOut, setBirdOut] = useState(false);

  // Track scroll of the RIGHT column (content area)
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  const syncProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  const minuteHandRotation = useTransform(scrollYProgress, [0, 0.9], [60, 90]);

  const [currentSync, setCurrentSync] = useState(0);
  const [currentMinuteRotation, setCurrentMinuteRotation] = useState(60);

  useEffect(() => {
    const unsubSync = syncProgress.on("change", (v) => {
      setCurrentSync(Math.min(1, Math.max(0, v)));
    });
    const unsubMinute = minuteHandRotation.on("change", (v) => {
      setCurrentMinuteRotation(v);
    });

    return () => {
      unsubSync();
      unsubMinute();
    };
  }, [syncProgress, minuteHandRotation]);

  // Trigger cuckoo at bottom
  useEffect(() => {
    if (currentSync >= 0.98 && !hasCuckooed) {
      setHasCuckooed(true);
      setDoorsOpen(true);

      setTimeout(() => {
        setBirdOut(true);

        // Play cuckoo sound
        try {
          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const playNote = (freq: number, start: number, dur: number) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = "sine";
            gain.gain.setValueAtTime(0.25, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
            osc.start(start);
            osc.stop(start + dur);
          };
          const now = audioContext.currentTime;
          playNote(784, now, 0.25);
          playNote(659, now + 0.3, 0.35);
        } catch (e) {
          console.log("Audio not available");
        }
      }, 350);

      // Reset after animation
      setTimeout(() => {
        setBirdOut(false);
        setTimeout(() => setDoorsOpen(false), 250);
      }, 1400);
    }

    if (currentSync < 0.9 && hasCuckooed) {
      setHasCuckooed(false);
    }
  }, [currentSync, hasCuckooed]);

  const content = {
    en: {
      title: "The Huygens Principle",
      subtitle: "Synchronization Through Shared Resonance",
      story: [
        {
          heading: "Two Clocks, One Room",
          text: "In 1665, Dutch scientist Christiaan Huygens noticed something peculiar. Two pendulum clocks, mounted on the same wooden beam, would gradually synchronize their swings—even when started at different times.",
        },
        {
          heading: "The Invisible Thread",
          text: "The clocks weren't touching. Yet somehow, through imperceptible vibrations traveling through the shared surface, they found their rhythm together. Huygens called it 'an odd kind of sympathy.'",
        },
        {
          heading: "Resonance in Relationships",
          text: "Like those clocks, couples sharing the same space naturally begin to synchronize. Your breathing patterns align. Your heartbeats find a common tempo. Your thoughts begin to resonate.",
        },
        {
          heading: "Hertz Creates the Frequency",
          text: "Our cards are the wooden beam—the shared medium that connects two hearts. By exploring the same questions together, you create the conditions for deep synchronization.",
        },
      ],
    },
    de: {
      title: "Das Huygens-Prinzip",
      subtitle: "Synchronisation durch gemeinsame Resonanz",
      story: [
        {
          heading: "Zwei Uhren, ein Raum",
          text: "1665 bemerkte der niederländische Wissenschaftler Christiaan Huygens etwas Merkwürdiges. Zwei Pendeluhren, die am gleichen Holzbalken befestigt waren, synchronisierten allmählich ihre Schwingungen.",
        },
        {
          heading: "Der unsichtbare Faden",
          text: "Die Uhren berührten sich nicht. Doch irgendwie, durch unmerkliche Vibrationen, fanden sie ihren gemeinsamen Rhythmus. Huygens nannte es 'eine seltsame Art von Sympathie.'",
        },
        {
          heading: "Resonanz in Beziehungen",
          text: "Wie diese Uhren beginnen Paare, die den gleichen Raum teilen, sich natürlich zu synchronisieren. Eure Atemmuster gleichen sich an. Eure Herzschläge finden ein gemeinsames Tempo.",
        },
        {
          heading: "Hertz erzeugt die Frequenz",
          text: "Unsere Karten sind der Holzbalken—das gemeinsame Medium, das zwei Herzen verbindet. Indem ihr dieselben Fragen erkundet, schafft ihr die Bedingungen für tiefe Synchronisation.",
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section
      ref={scrollContainerRef}
      className="relative min-h-[200vh] bg-cream"
    >
      {/* DESKTOP: 30/70 Grid Layout */}
      <div className="hidden md:grid md:grid-cols-[30%_70%] min-h-screen">
        {/* LEFT COLUMN: Sticky Clocks (30%) */}
        <div className="sticky top-5 h-fit p-4 lg:p-6">
          <div className="flex flex-col items-start gap-4">
            {/* Two clocks side by side */}
            <div className="flex items-start justify-center gap-3 w-full">
              <CuckooClock
                isLeft={true}
                syncProgress={currentSync}
                minuteHandRotation={currentMinuteRotation}
                doorsOpen={doorsOpen}
                birdOut={birdOut}
              />
              <CuckooClock
                isLeft={false}
                syncProgress={currentSync}
                minuteHandRotation={currentMinuteRotation}
                doorsOpen={doorsOpen}
                birdOut={birdOut}
              />
            </div>

            {/* Sync indicator - positioned lower */}
            <div className="w-full flex flex-col items-center mt-auto pt-16">
              <div className="w-full max-w-[200px] h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary/80 rounded-full"
                  style={{ width: `${currentSync * 100}%` }}
                />
              </div>
              <p className="font-body text-sm text-ink/50 mt-2 italic">
                {language === "de"
                  ? `Synchronisation: ${Math.round(currentSync * 100)}%`
                  : `Synchronisation: ${Math.round(currentSync * 100)}%`}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrollable Content (70%) */}
        <div className="p-8 lg:p-12 xl:p-16">
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl lg:text-4xl text-ink mb-2">
              {t.title}
            </h2>
            <p className="font-body text-lg text-ink/60 mb-12">{t.subtitle}</p>

            <div className="space-y-16">
              {t.story.map((section, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-primary/20">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary/30" />
                  <h3 className="font-heading text-xl text-ink mb-3">
                    {section.heading}
                  </h3>
                  <p className="font-body text-base text-ink/70 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Extra scroll space to complete animation */}
            <div className="h-[40vh]" />
          </div>
        </div>
      </div>

      {/* MOBILE: Stacked Layout */}
      <div className="md:hidden">
        {/* Clocks on top (relative, scrolls away) */}
        <div className="p-4 pt-8 flex flex-col items-center">
          <div className="flex items-start justify-center gap-4">
            <CuckooClock
              isLeft={true}
              syncProgress={currentSync}
              minuteHandRotation={currentMinuteRotation}
              doorsOpen={doorsOpen}
              birdOut={birdOut}
            />
            <CuckooClock
              isLeft={false}
              syncProgress={currentSync}
              minuteHandRotation={currentMinuteRotation}
              doorsOpen={doorsOpen}
              birdOut={birdOut}
            />
          </div>

          {/* Sync indicator */}
          <div className="w-full flex flex-col items-center mt-8">
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary/80 rounded-full"
                style={{ width: `${currentSync * 100}%` }}
              />
            </div>
            <p className="font-body text-sm text-ink/50 mt-2 italic">
              {language === "de"
                ? `Synchronisation: ${Math.round(currentSync * 100)}%`
                : `Synchronisation: ${Math.round(currentSync * 100)}%`}
            </p>
          </div>
        </div>

        {/* Content below */}
        <div className="p-6 pt-8">
          <h2 className="font-heading text-2xl text-ink mb-2">{t.title}</h2>
          <p className="font-body text-base text-ink/60 mb-8">{t.subtitle}</p>

          <div className="space-y-10">
            {t.story.map((section, idx) => (
              <div key={idx} className="relative pl-5 border-l-2 border-primary/20">
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-primary/30" />
                <h3 className="font-heading text-lg text-ink mb-2">
                  {section.heading}
                </h3>
                <p className="font-body text-sm text-ink/70 leading-relaxed">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          {/* Extra scroll space */}
          <div className="h-[30vh]" />
        </div>
      </div>
    </section>
  );
};
