import { motion } from "framer-motion";
import cuckooHouse from "@/assets/cuckoo-house.svg";
import cuckooBird from "@/assets/cuckoo-bird.svg";
import cuckooDoorLeft from "@/assets/cuckoo-door-left.svg";
import cuckooDoorRight from "@/assets/cuckoo-door-right.svg";
import cuckooHourHand from "@/assets/cuckoo-hour-hand.svg";
import cuckooMinuteHand from "@/assets/cuckoo-minute-hand.svg";
import cuckooPendulum from "@/assets/cuckoo-pendulum.svg";

interface SingleCuckooClockProps {
  syncProgress: number;
  isLeftClock?: boolean;
}

export const SingleCuckooClock = ({
  syncProgress,
  isLeftClock = true
}: SingleCuckooClockProps) => {

  const initialPhase = isLeftClock ? 15 : -15; // Start opposite
  const currentPhase = initialPhase * (1 - syncProgress);

  return (
    // overflow-visible is CRITICAL so the pendulum can hang outside the box
    <div className="relative w-[220px] h-[300px] flex flex-col items-center overflow-visible">

      {/* --- LAYER 1: PENDULUM --- */}
      {/* Positioned at the BOTTOM of the clock, hanging down */}
      <motion.div
        className="absolute w-full flex justify-center z-10"
        style={{
          top: "260px", // Hangs out the bottom
          transformOrigin: "top center"
        }}
        animate={{
          rotate: [15 + currentPhase, -15 + currentPhase, 15 + currentPhase]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <img
          src={cuckooPendulum}
          alt="Pendulum"
          // blend-multiply helps if the asset has a white box around it
          className="w-[50px] h-auto drop-shadow-lg mix-blend-multiply"
        />
      </motion.div>

      {/* --- LAYER 2: HOUSE (Body) --- */}
      <div className="relative z-20 w-full h-full">
        <img
          src={cuckooHouse}
          alt="Clock Body"
          // blend-multiply makes the white background transparent so we see the wall behind
          className="w-full h-full object-contain drop-shadow-xl mix-blend-multiply"
        />

        {/* --- LAYER 2b: DOORS (Adjusted Positioning) --- */}
        {/* Moved slightly higher/centered based on your screenshot */}
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[60px] h-[70px] z-30">
            {/* The Bird (Hidden inside) */}
            <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
                <img src={cuckooBird} alt="Bird" className="w-8 h-auto translate-y-1" />
            </div>
            {/* The Doors */}
            <div className="absolute inset-0 flex justify-between pointer-events-none">
                <img src={cuckooDoorLeft} className="w-[48%] h-full object-contain mix-blend-multiply" alt="L" />
                <img src={cuckooDoorRight} className="w-[48%] h-full object-contain mix-blend-multiply" alt="R" />
            </div>
        </div>

        {/* --- LAYER 3: HANDS --- */}
        <div className="absolute top-[55%] left-[50%] w-0 h-0 z-40 flex items-center justify-center">
            {/* Hour Hand */}
            <motion.img
                src={cuckooHourHand}
                className="absolute w-[45px] h-auto -translate-y-[10%] -translate-x-[5%] mix-blend-multiply"
                style={{ originX: 0.5, originY: 0.8 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            {/* Minute Hand */}
            <motion.img
                src={cuckooMinuteHand}
                className="absolute w-[60px] h-auto -translate-y-[10%] -translate-x-[5%] mix-blend-multiply"
                style={{ originX: 0.5, originY: 0.8 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            {/* Center Cap */}
            <div className="absolute w-3 h-3 bg-[#4A3728] rounded-full z-50 shadow-sm" />
        </div>
      </div>
    </div>
  );
};
