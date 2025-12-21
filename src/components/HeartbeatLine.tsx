import { motion } from "framer-motion";

interface HeartbeatLineProps {
  className?: string;
  animated?: boolean;
}

export const HeartbeatLine = ({ className = "", animated = false }: HeartbeatLineProps) => {
  // SVG path that creates the heartbeat/EKG pattern with hearts
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" as const },
        opacity: { duration: 0.5 },
      },
    },
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 800 60"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {animated ? (
          <motion.path
            d="M0 30 
               L60 30 
               L80 30 L90 10 L100 50 L110 10 L120 50 L130 30 
               L160 30 
               L180 30 L190 10 L200 50 L210 10 L220 50 L230 30 
               L280 30
               M280 30 C280 20, 295 10, 310 20 C325 10, 340 20, 340 30 C340 45, 310 55, 310 55 C310 55, 280 45, 280 30 Z
               M340 30 L380 30 
               M380 30 C380 20, 395 10, 410 20 C425 10, 440 20, 440 30 C440 45, 410 55, 410 55 C410 55, 380 45, 380 30 Z
               M440 30 L480 30
               L500 30 L510 10 L520 50 L530 10 L540 50 L550 30 
               L580 30 
               L600 30 L610 10 L620 50 L630 10 L640 50 L650 30 
               L700 30
               L760 30
               L800 30"
            fill="none"
            stroke="hsl(var(--heartbeat))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
          />
        ) : (
          <>
            {/* Static heartbeat line */}
            <path
              d="M0 30 
                 L60 30 
                 L80 30 L90 10 L100 50 L110 10 L120 50 L130 30 
                 L160 30 
                 L180 30 L190 10 L200 50 L210 10 L220 50 L230 30 
                 L280 30"
              fill="none"
              stroke="hsl(var(--heartbeat))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* First heart */}
            <path
              d="M295 30 C295 22, 305 15, 315 22 C325 15, 335 22, 335 30 C335 42, 315 52, 315 52 C315 52, 295 42, 295 30 Z"
              fill="none"
              stroke="hsl(var(--heartbeat))"
              strokeWidth="2"
            />
            {/* Middle segment */}
            <path
              d="M335 30 L395 30"
              fill="none"
              stroke="hsl(var(--heartbeat))"
              strokeWidth="2"
            />
            {/* Second heart */}
            <path
              d="M410 30 C410 22, 420 15, 430 22 C440 15, 450 22, 450 30 C450 42, 430 52, 430 52 C430 52, 410 42, 410 30 Z"
              fill="none"
              stroke="hsl(var(--heartbeat))"
              strokeWidth="2"
            />
            {/* End segment */}
            <path
              d="M450 30 L480 30
                 L500 30 L510 10 L520 50 L530 10 L540 50 L550 30 
                 L580 30 
                 L600 30 L610 10 L620 50 L630 10 L640 50 L650 30 
                 L700 30
                 L760 30
                 L800 30"
              fill="none"
              stroke="hsl(var(--heartbeat))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </div>
  );
};
