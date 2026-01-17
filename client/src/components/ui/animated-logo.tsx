import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function AnimatedLogo({
  size = "md",
  showText = true,
  className = "",
}: AnimatedLogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg", iconSize: "w-4 h-4" },
    md: { icon: "w-10 h-10", text: "text-xl", iconSize: "w-5 h-5" },
    lg: { icon: "w-14 h-14", text: "text-3xl", iconSize: "w-7 h-7" },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const text = "CodeBuddy";
  const codeText = "Code";
  const buddyText = "Buddy";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Animated Logo Icon */}
      <motion.div
        className={`${sizes[size].icon} rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 relative overflow-hidden`}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {/* Animated background shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />

        {/* Terminal icon with pulse */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Terminal
            className={`${sizes[size].iconSize} text-white relative z-10`}
          />
        </motion.div>

        {/* Blinking cursor indicator */}
        <motion.div
          className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>

      {/* Animated Text */}
      {showText && (
        <div className={`${sizes[size].text} font-bold flex`}>
          {/* "Code" part */}
          <span className="text-foreground">
            {codeText.split("").map((char, i) => (
              <motion.span
                key={`code-${i}`}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>

          {/* "Buddy" part with gradient */}
          <span className="gradient-text">
            {buddyText.split("").map((char, i) => (
              <motion.span
                key={`buddy-${i}`}
                custom={i + codeText.length}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>

          {/* Blinking cursor after text */}
          <motion.span
            className="inline-block w-0.5 h-[1em] bg-violet-500 ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>
      )}
    </div>
  );
}

// Simple static logo for places where animation might be distracting
export function StaticLogo({
  size = "md",
  showText = true,
  className = "",
}: AnimatedLogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg", iconSize: "w-4 h-4" },
    md: { icon: "w-10 h-10", text: "text-xl", iconSize: "w-5 h-5" },
    lg: { icon: "w-14 h-14", text: "text-3xl", iconSize: "w-7 h-7" },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${sizes[size].icon} rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30`}
      >
        <Terminal className={`${sizes[size].iconSize} text-white`} />
      </div>
      {showText && (
        <span className={`${sizes[size].text} font-bold`}>
          <span className="text-foreground">Code</span>
          <span className="gradient-text">Buddy</span>
        </span>
      )}
    </div>
  );
}
