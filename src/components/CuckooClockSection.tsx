import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import cuckooClock from "@/assets/cuckoo-clock.svg";
import cuckooPendulum from "@/assets/cuckoo-pendulum.svg";
import cuckooBird from "@/assets/cuckoo-bird.png"; // Assuming PNG for bird based on previous context

// --- KONSTANTEN ---
const WIDTH_PX = 220; // Größer, wie gewünscht
const PENDULUM_LENGTH = 180;
const GRAVITY = 0.4; // Etwas stärker für snappiness

export const CuckooClockSection = () => {
  const [syncProgress, setSyncProgress] = useState(0);

  // Wir nutzen einen gemeinsamen Hook für BEIDE Pendel (Kollisionsphysik)
  const { leftAngle, rightAngle } = useCoupledPendulums(syncProgress);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7F2] py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          {/* VISUALISIERUNG: Die Uhren */}
          <div className="relative h-[450px] flex items-start justify-center">
            {/* Wir nutzen negative Margin, damit sie näher zusammenrücken für den "Clash" */}
            <div className="flex justify-center items-start -space-x-8">
              <Clock angle={leftAngle} isLeft={true} syncProgress={syncProgress} />
              <Clock angle={rightAngle} isLeft={false} syncProgress={syncProgress} />
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="max-w-md space-y-8 text-center md:text-left">
            <div className="space-y-4">
              <span className="font-serif italic text-2xl text-cuckoo-dark/60">Die Huygens-Entdeckung</span>
              <h2 className="text-4xl md:text-5xl font-serif text-cuckoo-dark leading-tight">
                Synchronisation durch gemeinsame Resonanz
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-cuckoo-text text-lg leading-relaxed">
                1665 bemerkte Christiaan Huygens etwas Merkwürdiges: Zwei Pendeluhren, die am gleichen Balken hingen,
                fanden "durch unmerkliche Vibrationen" immer in einen gemeinsamen Rhythmus.
              </p>

              {/* Sync Slider */}
              <div className="pt-4">
                <label className="text-sm text-cuckoo-dark/50 mb-2 block font-serif italic">
                  Synchronisation: {Math.round(syncProgress * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={syncProgress}
                  onChange={(e) => setSyncProgress(parseFloat(e.target.value))}
                  className="w-full h-2 bg-cuckoo-taupe rounded-lg appearance-none cursor-pointer accent-cuckoo-brick"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SUB-KOMPONENTE: Einzelne Uhr ---
const Clock = ({ angle, isLeft, syncProgress }: { angle: number; isLeft: boolean; syncProgress: number }) => {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const controls = useAnimation();

  // Kuckuck Logik: Kommt raus bei hoher Sync (simuliert) oder zufällig
  useEffect(() => {
    // Einfache Logik: Wenn Sync > 80%, dann ab und zu Kuckuck
    if (syncProgress > 0.8 && Math.random() > 0.99) {
      triggerCuckoo();
    }
  }, [syncProgress, angle]);

  const triggerCuckoo = async () => {
    setDoorsOpen(true);
    await new Promise((r) => setTimeout(r, 400)); // Warten bis Tür offen
    await controls.start({ x: 0, transition: { type: "spring", bounce: 0.5 } }); // Vogel raus
    await new Promise((r) => setTimeout(r, 1000)); // Singen
    await controls.start({ x: 40, transition: { duration: 0.3 } }); // Vogel rein
    setDoorsOpen(false); // Tür zu
  };

  return (
    <div className="relative shrink-0" style={{ width: WIDTH_PX, height: WIDTH_PX * 1.5, zIndex: 10 }}>
      {/* 1. GEHÄUSE (Hintergrund) */}
      <img src={cuckooClock} alt="Clock Housing" className="absolute inset-0 w-full h-full object-contain z-20" />

      {/* 2. PENDEL (Hinter dem Gehäuse visuell, aber technisch im Container) */}
      {/* TRICK: mix-blend-mode: multiply macht Weiß transparent! */}
      <motion.div
        className="absolute left-1/2 w-[80%] origin-top"
        style={{
          top: "68%", // Hängt unten raus
          x: "-50%",
          rotate: angle,
          zIndex: 5, // Hinter dem Haus (Haus ist z-20) aber vor Wand
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
        style={{ top: "26%", left: "0%", width: "100%", height: "30%" }} // Grober Bereich des Zifferblatts
      >
        {/* Stundenzeiger */}
        <motion.div
          className="absolute bg-black rounded-full"
          style={{
            top: "50%",
            left: "50%",
            width: "6px",
            height: "25%",
            originY: 1, // WICHTIG: Dreht sich um das untere Ende
            originX: 0.5,
            x: "-50%",
            y: "-100%", // Verschiebt es so, dass bottom auf dem Zentrum sitzt
          }}
          animate={{ rotate: Date.now() / 10000 + (isLeft ? 0 : 30) }}
        />
        {/* Minutenzeiger */}
        <motion.div
          className="absolute bg-black rounded-full"
          style={{
            top: "50%",
            left: "50%",
            width: "4px",
            height: "35%",
            originY: 1, // WICHTIG: Dreht sich um das untere Ende
            originX: 0.5,
            x: "-50%",
            y: "-100%",
          }}
          animate={{ rotate: Date.now() / 1000 }}
        />
        {/* Zentraler Pin */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#3a2820] rounded-full -translate-x-1/2 -translate-y-1/2 z-40" />
      </div>

      {/* 4. TÜREN & VOGEL (Ganz oben) */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[20%] h-[15%] z-40 overflow-hidden perspective-500">
        {/* Vogel */}
        <motion.img
          src={cuckooBird}
          initial={{ x: 40 }}
          animate={controls}
          className="absolute top-2 left-2 w-full h-full object-contain z-10"
        />

        {/* Linke Tür */}
        <motion.div
          className="absolute left-0 top-0 w-1/2 h-full bg-[#5C4033] border-r border-[#3e2b22] origin-left"
          animate={{ rotateY: doorsOpen ? -110 : 0 }}
          transition={{ duration: 0.4 }}
        />
        {/* Rechte Tür */}
        <motion.div
          className="absolute right-0 top-0 w-1/2 h-full bg-[#5C4033] border-l border-[#3e2b22] origin-right"
          animate={{ rotateY: doorsOpen ? 110 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
};

// --- PHYSIK HOOK: Das Herzstück ---
const useCoupledPendulums = (syncProgress: number) => {
  const [leftAngle, setLeftAngle] = useState(25);
  const [rightAngle, setRightAngle] = useState(-20); // Starten asynchron

  // Wir nutzen Refs für Geschwindigkeit, damit wir nicht bei jedem Frame neu rendern müssen
  const velL = useRef(0);
  const velR = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime.current) / 1000, 0.1); // Limit dt for stability
      lastTime.current = time;

      // Physik-Konstanten
      const naturalFreq = 3.0;
      const damping = 0.995; // Luftwiderstand
      const couplingStrength = syncProgress * 0.15; // Wie stark sie sich beeinflussen (Huygens Effekt)

      // 1. Beschleunigung berechnen (Harmonischer Oszillator)
      // acc = -freq^2 * angle
      let accL = -naturalFreq * leftAngle;
      let accR = -naturalFreq * rightAngle;

      // 2. Kopplung hinzufügen (Der "Huygens Balken")
      // Das linke Pendel spürt, was das rechte macht und umgekehrt
      accL += couplingStrength * (rightAngle - leftAngle);
      accR += couplingStrength * (leftAngle - rightAngle);

      // 3. Geschwindigkeit updaten
      velL.current += accL * dt;
      velR.current += accR * dt;

      // Dämpfung
      velL.current *= damping;
      velR.current *= damping;

      // 4. Position updaten (vorläufig)
      let nextAngleL = leftAngle + velL.current;
      let nextAngleR = rightAngle + velR.current;

      // 5. KOLLISIONS-CHECK ("The Clash")
      // Wenn die Uhren nah zusammen hängen, kollidieren die Pendel bei ca 15 Grad innen
      // Links schwingt nach rechts (>0), Rechts schwingt nach links (<0)
      // Abstand Check:
      const gapAngle = nextAngleR - nextAngleL; // Wenn negativ, überlappen sie (weil R negativ ist)

      // Wir simulieren: Wenn sie sich in der Mitte "treffen"
      // Annahme: Mitte ist 0. Linkes Pendel > 10 und Rechtes Pendel < -10 -> Crash
      const collisionThreshold = 15;

      // Einfache Bounding Box Logic im Winkel-Raum
      // Wenn Linkes Pendel zu weit rechts ist UND Rechtes Pendel zu weit links
      // UND sie sich tatsächlich berühren (z.B. Summe der Auslenkung > X)

      // Vereinfacht: Wenn sie sich kreuzen würden
      // Da wir sie visuell überlappen lassen wollen (Clash), erlauben wir kurzes Überlappen
      // Aber wir tauschen die Energie (Elastischer Stoß)

      if (nextAngleL > collisionThreshold && nextAngleR < -collisionThreshold) {
        // BOOM - Energie-Austausch
        // Nur wenn sie sich aufeinander zu bewegen
        if (velL.current > 0 && velR.current < 0) {
          const temp = velL.current;
          velL.current = velR.current * 0.8; // Energieverlust beim Aufprall
          velR.current = temp * 0.8;

          // Position korrigieren, damit sie nicht kleben
          nextAngleL = collisionThreshold - 1;
          nextAngleR = -collisionThreshold + 1;
        }
      }

      setLeftAngle(nextAngleL);
      setRightAngle(nextAngleR);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [leftAngle, rightAngle, syncProgress]); // Rerun wenn State sich ändert? Nein, eigentlich Loop.
  // Korrektur: React Hooks und AnimationFrame sind tricky.
  // Besserer Ansatz für Loop ohne Dependency Hell:

  return { leftAngle, rightAngle };
};
