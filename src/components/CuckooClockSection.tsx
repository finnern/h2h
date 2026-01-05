import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// Import cuckoo clock assets
import cuckooHouse from "@/assets/cuckoo-house.svg";
import cuckooBird from "@/assets/cuckoo-bird.svg";
import cuckooDoorLeft from "@/assets/cuckoo-door-left.svg";
import cuckooDoorRight from "@/assets/cuckoo-door-right.svg";
import cuckooHourHand from "@/assets/cuckoo-hour-hand.svg";
import cuckooMinuteHand from "@/assets/cuckoo-minute-hand.svg";
import cuckooPendulum from "@/assets/cuckoo-pendulum.svg";

// Pendulum physics simulation
const usePendulumSwing = (
  baseFrequency: number,
  phaseOffset: number,
  syncProgress: number // 0 to 1, where 1 = fully synced
) => {
  const time = useMotionValue(0);
  const [angle, setAngle] = useState(0);
  
  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      // Base pendulum swing with physics-based easing
      // As syncProgress increases, the phase offset decreases
      const effectivePhaseOffset = phaseOffset * (1 - syncProgress);
      
      // Add some randomness when desynchronized
      const chaos = (1 - syncProgress) * Math.sin(elapsed * 0.7) * 0.3;
      
      // Physics-based pendulum motion (approximation of simple harmonic motion)
      const baseAngle = Math.sin((elapsed * baseFrequency) + effectivePhaseOffset + chaos) * 25;
      
      setAngle(baseAngle);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [baseFrequency, phaseOffset, syncProgress]);
  
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
  // Different phase for left vs right clock to create async effect
  const phaseOffset = isLeft ? 0 : Math.PI * 0.8;
  const pendulumAngle = usePendulumSwing(2.5, phaseOffset, syncProgress);
  
  // Door animation - left door pivots from left edge, right door from right edge
  const doorRotation = doorsOpen ? (isLeft ? -85 : 85) : 0;
  
  return (
    <div className="relative w-40 h-64 md:w-56 md:h-80 lg:w-64 lg:h-96">
      {/* Clock assembly */}
      <div className="relative w-full h-[70%]">
        {/* Black hole behind the door */}
        <div 
          className="absolute bg-black rounded-sm"
          style={{
            top: '35%',
            left: '30%',
            width: '40%',
            height: '20%',
            zIndex: 1,
          }}
        />
        
        {/* Bird */}
        <motion.img
          src={cuckooBird}
          alt="Cuckoo bird"
          className="absolute w-[30%] h-auto"
          style={{
            top: '32%',
            left: '35%',
            zIndex: 2,
          }}
          animate={{
            scale: birdOut ? 1.15 : 1,
            y: birdOut ? -8 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />
        
        {/* House (frame) */}
        <img
          src={cuckooHouse}
          alt="Cuckoo clock house"
          className="absolute w-full h-full object-contain"
          style={{ zIndex: 3 }}
        />
        
        {/* Door */}
        <motion.img
          src={isLeft ? cuckooDoorLeft : cuckooDoorRight}
          alt="Clock door"
          className="absolute w-[25%] h-auto"
          style={{
            top: '33%',
            left: isLeft ? '30%' : '45%',
            zIndex: 4,
            transformOrigin: isLeft ? 'left center' : 'right center',
          }}
          animate={{
            rotateY: doorRotation,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
        />
        
        {/* Clock hands container - positioned at clock face center */}
        <div 
          className="absolute"
          style={{
            top: '62%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          }}
        >
          {/* Hour hand - fixed at 10 o'clock position (-60 degrees from 12) */}
          <motion.img
            src={cuckooHourHand}
            alt="Hour hand"
            className="absolute w-4 md:w-5 lg:w-6 h-auto"
            style={{
              transformOrigin: 'center 75%',
              left: '50%',
              bottom: '50%',
              marginLeft: '-0.5rem',
            }}
            animate={{
              rotate: -60, // 10 o'clock position
            }}
          />
          
          {/* Minute hand - rotates from 10 min to 15 min position */}
          <motion.img
            src={cuckooMinuteHand}
            alt="Minute hand"
            className="absolute w-3 md:w-4 lg:w-5 h-auto"
            style={{
              transformOrigin: 'center 80%',
              left: '50%',
              bottom: '50%',
              marginLeft: '-0.375rem',
            }}
            animate={{
              rotate: minuteHandRotation,
            }}
            transition={{
              type: "tween",
              ease: "linear",
            }}
          />
        </div>
      </div>
      
      {/* Pendulum */}
      <motion.img
        src={cuckooPendulum}
        alt="Pendulum"
        className="absolute w-[25%] h-auto"
        style={{
          top: '60%',
          left: '37.5%',
          transformOrigin: 'center top',
          zIndex: 0,
        }}
        animate={{
          rotate: pendulumAngle,
        }}
        transition={{
          type: "tween",
          ease: [0.4, 0, 0.2, 1], // Physics-like easing
          duration: 0.05,
        }}
      />
    </div>
  );
};

export const CuckooClockSection = () => {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasCuckooed, setHasCuckooed] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [birdOut, setBirdOut] = useState(false);
  
  // Scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  
  // Map scroll progress to sync progress (0% scroll = 0 sync, 99% scroll = ~1 sync)
  const syncProgress = useTransform(smoothProgress, [0.2, 0.8], [0, 1]);
  
  // Minute hand rotation: 10 minutes = 60 degrees, 15 minutes = 90 degrees
  // So we go from 60 to 90 degrees as user scrolls
  const minuteHandRotation = useTransform(smoothProgress, [0.2, 0.8], [60, 90]);
  
  // Track current values for the cuckoo event
  const [currentSync, setCurrentSync] = useState(0);
  const [currentMinuteRotation, setCurrentMinuteRotation] = useState(60);
  
  useEffect(() => {
    const unsubscribeSync = syncProgress.on("change", (v) => {
      setCurrentSync(Math.min(1, Math.max(0, v)));
    });
    const unsubscribeMinute = minuteHandRotation.on("change", (v) => {
      setCurrentMinuteRotation(v);
    });
    
    return () => {
      unsubscribeSync();
      unsubscribeMinute();
    };
  }, [syncProgress, minuteHandRotation]);
  
  // Trigger cuckoo event at 100% scroll (sync = 1)
  useEffect(() => {
    if (currentSync >= 0.98 && !hasCuckooed) {
      setHasCuckooed(true);
      
      // Open doors
      setDoorsOpen(true);
      
      // Bird pops out after doors open
      setTimeout(() => {
        setBirdOut(true);
        
        // Play cuckoo sound (respecting autoplay policies)
        try {
          // Create a simple cuckoo sound using Web Audio API
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const playNote = (frequency: number, startTime: number, duration: number) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
          };
          
          // Cuckoo sound: two notes
          const now = audioContext.currentTime;
          playNote(784, now, 0.3); // G5
          playNote(659, now + 0.35, 0.4); // E5
        } catch (e) {
          console.log('Audio playback not available');
        }
      }, 400);
      
      // Reset after animation
      setTimeout(() => {
        setBirdOut(false);
        setTimeout(() => {
          setDoorsOpen(false);
        }, 300);
      }, 1500);
    }
    
    // Reset hasCuckooed when scrolling back up
    if (currentSync < 0.9 && hasCuckooed) {
      setHasCuckooed(false);
    }
  }, [currentSync, hasCuckooed]);
  
  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] bg-gradient-to-b from-muted/30 via-background to-muted/30"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Section title */}
        <motion.div
          className="text-center mb-8 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-primary mb-3">
            {language === "de" 
              ? "Synchronisation durch Resonanz" 
              : "Synchronization through Resonance"}
          </h2>
          <p className="font-body text-sm md:text-base text-ink/70 max-w-xl mx-auto">
            {language === "de"
              ? "Scrolle weiter und beobachte, wie zwei Uhren ihren Rhythmus finden – genau wie Huygens' Pendel 1665."
              : "Keep scrolling and watch two clocks find their rhythm – just like Huygens' pendulums in 1665."}
          </p>
        </motion.div>
        
        {/* Clocks container */}
        <div className="relative flex items-center justify-center gap-4 md:gap-8 lg:gap-16">
          {/* Connection beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-full shadow-lg" 
            style={{ 
              background: 'linear-gradient(to bottom, #92400e, #78350f, #92400e)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
            }}
          />
          
          {/* Left clock */}
          <CuckooClock
            isLeft={true}
            syncProgress={currentSync}
            minuteHandRotation={currentMinuteRotation}
            doorsOpen={doorsOpen}
            birdOut={birdOut}
          />
          
          {/* Right clock */}
          <CuckooClock
            isLeft={false}
            syncProgress={currentSync}
            minuteHandRotation={currentMinuteRotation}
            doorsOpen={doorsOpen}
            birdOut={birdOut}
          />
        </div>
        
        {/* Sync indicator */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-48 md:w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto mb-2">
            <motion.div
              className="h-full bg-primary rounded-full"
              style={{ width: `${currentSync * 100}%` }}
            />
          </div>
          <p className="font-body text-xs md:text-sm text-ink/60">
            {language === "de" 
              ? `Synchronisation: ${Math.round(currentSync * 100)}%` 
              : `Synchronization: ${Math.round(currentSync * 100)}%`}
          </p>
        </motion.div>
        
        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex flex-col items-center text-ink/50">
            <span className="font-body text-xs mb-1">
              {language === "de" ? "Weiter scrollen" : "Keep scrolling"}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
