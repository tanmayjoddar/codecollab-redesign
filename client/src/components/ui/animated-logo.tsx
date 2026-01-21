import { motion } from "framer-motion";

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AnimatedLogo({
  size = "md",
  className = "",
}: AnimatedLogoProps) {
  const sizes = {
    sm: { icon: "h-10 w-auto" },
    md: { icon: "h-12 w-auto" },
    lg: { icon: "h-16 w-auto" },
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Animated Logo Icon */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <img
          src="/dp.png"
          alt="CodeBuddy Logo"
          className={`${sizes[size].icon} object-contain`}
        />
      </motion.div>
    </div>
  );
}

// Simple static logo for places where animation might be distracting
export function StaticLogo({ size = "md", className = "" }: AnimatedLogoProps) {
  const sizes = {
    sm: { icon: "h-10 w-auto" },
    md: { icon: "h-12 w-auto" },
    lg: { icon: "h-16 w-auto" },
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/dp.png"
        alt="CodeBuddy Logo"
        className={`${sizes[size].icon} object-contain`}
      />
    </div>
  );
}
