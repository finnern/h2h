import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
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
const usePendulumSwing = (
  isLeft: boolean,
  syncProgress: number
) => {
  const [angle, setAngle] = useState(0);
  
  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      // Base frequency with physics-like period (~2.5s swing)
      const frequency = 2.2;
      
      // Phase offset: starts at π/2 for right clock (opposite swing)
      // As sync increases, phase offset decreases to 0
      const basePhaseOffset = isLeft ? 0 : Math.PI * 0.7;
      const effectivePhaseOffset = basePhaseOffset * (1 - syncProgress);
      
      // Add chaos when not synced - random-ish perturbations
      const chaosAmount = (1 - syncProgress) * 0.4;
      const chaos = chaosAmount * Math.sin(elapsed * 1.3 + (isLeft ? 0 : 2)) * Math.sin(elapsed * 0.7);
      
      // Amplitude: slightly larger swing when chaotic, settling when synced
      const amplitude = 28 + (1 - syncProgress) * 8;
      
      // Simple harmonic motion with chaos overlay
      const pendulumAngle = Math.sin(elapsed * frequency + effectivePhaseOffset + chaos) * amplitude;
      
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
  birdOut 
}: CuckooClockProps) => {
  const pendulumAngle = usePendulumSwing(isLeft, syncProgress);
  
  // Door animation - hinges on OUTER edge
  // Left clock door: rotateY opens to the LEFT (negative), pivot on LEFT edge
  // Right clock door: rotateY opens to the RIGHT (positive), pivot on RIGHT edge
  const doorRotation = doorsOpen ? (isLeft ? -75 : 75) : 0;
  
  return (
    <div className="relative w-32 h-auto sm:w-40 md:w-48 lg:w-56">
      {/* Clock House Container */}
      <div className="relative w-full aspect-[3/4]">
        
        {/* LAYER 0 (Back): Clock House */}
        <img
          src={cuckooHouse}
          alt="Cuckoo clock house"
          className="absolute inset-0 w-full h-full object-contain z-0"
        />
        
        {/* LAYER 1: Black hole behind the door opening */}
        <div 
          className="absolute bg-zinc-900 rounded-sm z-10"
          style={{
            top: '28%',
            left: '33%',
            width: '34%',
            height: '18%',
          }}
        />
        
        {/* LAYER 2: Bird (hidden behind doors initially) */}
        <motion.img
          src={cuckooBird}
          alt="Cuckoo bird"
          className="absolute z-20"
          style={{
            top: '26%',
            left: '35%',
            width: '30%',
            height: 'auto',
          }}
          animate={{
            scale: birdOut ? 1.25 : 1,
            y: birdOut ? '-15%' : '0%',
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 18,
          }}
        />
        
        {/* LAYER 3: Doors - placed to cover the bird window */}
        <motion.img
          src={isLeft ? cuckooDoorLeft : cuckooDoorRight}
          alt="Clock door"
          className="absolute z-30"
          style={{
            top: '26%',
            left: isLeft ? '33%' : '50%',
            width: '20%',
            height: 'auto',
            // CRITICAL: Pivot on the OUTER edge
            transformOrigin: isLeft ? '0% 50%' : '100% 50%',
          }}
          animate={{
            rotateY: doorRotation,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 22,
          }}
        />
        
        {/* LAYER 4: Clock Hands - centered on clock face */}
        <div 
          className="absolute z-40"
          style={{
            top: '58%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Hour hand - fixed at 10 o'clock (-60° from 12) */}
          <motion.img
            src={cuckooHourHand}
            alt="Hour hand"
            className="absolute"
            style={{
              width: '8px',
              height: '22px',
              left: '50%',
              top: '50%',
              marginLeft: '-4px',
              marginTop: '-18px',
              transformOrigin: '50% 82%', // Pivot near bottom
            }}
            animate={{ rotate: -60 }}
          />
          
          {/* Minute hand - rotates from 60° (10 min) to 90° (15 min) */}
          <motion.img
            src={cuckooMinuteHand}
            alt="Minute hand"
            className="absolute"
            style={{
              width: '6px',
              height: '28px',
              left: '50%',
              top: '50%',
              marginLeft: '-3px',
              marginTop: '-24px',
              transformOrigin: '50% 86%', // Pivot near bottom
            }}
            animate={{ rotate: minuteHandRotation }}
            transition={{ type: "tween", ease: "linear" }}
          />
          
          {/* Center pin */}
          <div 
            className="absolute w-2 h-2 bg-amber-900 rounded-full border border-amber-700"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </div>
      
      {/* LAYER 5: Pendulum - 1.5x scale, hangs below house */}
      <motion.div
        className="absolute z-0"
        style={{
          top: '68%',
          left: '50%',
          width: '40%',
          transformOrigin: '50% 0%', // Pivot at TOP tip
          marginLeft: '-20%',
        }}
        animate={{ rotate: pendulumAngle }}
        transition={{
          type: "tween",
          ease: [0.37, 0, 0.63, 1], // Smooth physics-like ease
          duration: 0.016,
        }}
      >
        <img
          src={cuckooPendulum}
          alt="Pendulum"
          className="w-full h-auto"
          style={{
            transform: 'scaleY(1.5)', // Make pendulum 1.5x longer
            transformOrigin: 'top center',
          }}
        />
      </motion.div>
    </div>
  );
};

export const CuckooClockSection = () => {
  const { language } = useLanguage();
  const [hasCuckooed, setHasCuckooed] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [birdOut, setBirdOut] = useState(false);
  
  // Use FULL PAGE scroll progress (not section-specific)
  const { scrollYProgress } = useScroll();
  
  // Map page scroll to sync (0 at top, 1 near bottom)
  const syncProgress = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  
  // Minute hand: 10:10 = 60°, 10:15 = 90°
  const minuteHandRotation = useTransform(scrollYProgress, [0, 0.85], [60, 90]);
  
  // Track current values
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
  
  // Trigger cuckoo at bottom of page
  useEffect(() => {
    if (currentSync >= 0.98 && !hasCuckooed) {
      setHasCuckooed(true);
      setDoorsOpen(true);
      
      setTimeout(() => {
        setBirdOut(true);
        
        // Play cuckoo sound
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const playNote = (freq: number, start: number, dur: number) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.25, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
            osc.start(start);
            osc.stop(start + dur);
          };
          const now = audioContext.currentTime;
          playNote(784, now, 0.25);
          playNote(659, now + 0.3, 0.35);
        } catch (e) {
          console.log('Audio not available');
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
  
  return (
    <>
      {/* Sticky clocks container - stays at top while scrolling */}
      <div 
        className="sticky top-4 md:top-6 z-50 pointer-events-none"
        style={{ marginBottom: '-180px' }}
      >
        <div className="flex items-start justify-center gap-4 md:gap-8 lg:gap-12">
          {/* Wooden beam connecting clocks */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] max-w-md h-3 rounded-full"
            style={{
              background: 'linear-gradient(to bottom, #92400e, #78350f, #6b3410)',
              boxShadow: '0 3px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.15)',
            }}
          />
          
          {/* Left Clock */}
          <CuckooClock
            isLeft={true}
            syncProgress={currentSync}
            minuteHandRotation={currentMinuteRotation}
            doorsOpen={doorsOpen}
            birdOut={birdOut}
          />
          
          {/* Right Clock */}
          <CuckooClock
            isLeft={false}
            syncProgress={currentSync}
            minuteHandRotation={currentMinuteRotation}
            doorsOpen={doorsOpen}
            birdOut={birdOut}
          />
        </div>
        
        {/* Sync indicator */}
        <div className="mt-4 flex flex-col items-center">
          <div className="w-40 md:w-56 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary/80 rounded-full"
              style={{ width: `${currentSync * 100}%` }}
            />
          </div>
          <p className="font-body text-xs text-ink/50 mt-1">
            {language === "de" 
              ? `Synchronisation: ${Math.round(currentSync * 100)}%` 
              : `Sync: ${Math.round(currentSync * 100)}%`}
          </p>
        </div>
      </div>
    </>
  );
};
