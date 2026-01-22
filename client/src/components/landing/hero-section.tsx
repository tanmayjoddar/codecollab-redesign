import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image - more visible */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/BG.png')`,
          backgroundPosition: "right center",
        }}
      />

      {/* Lighter gradient overlay - reveals more of the image */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            100deg,
            rgba(8, 8, 18, 0.95) 0%,
            rgba(12, 12, 28, 0.85) 35%,
            rgba(15, 15, 35, 0.6) 55%,
            rgba(20, 25, 45, 0.3) 75%,
            transparent 100%
          )`,
        }}
      />

      {/* Subtle glow accents */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-[80px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-2xl">
          {/* Animated badge */}
         

          {/* Main Headline with animated letters */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* "Code" with letter animation */}
            <span className="inline-block overflow-hidden">
              {"Code".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-white"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>{" "}
            {/* "together," with staggered animation */}
            <span className="inline-block overflow-hidden">
              {"together,".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
            <br />
            {/* "ship" with glow effect */}
            <span className="inline-block overflow-hidden">
              {"ship".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400"
                  style={{
                    textShadow: "0 0 40px rgba(167, 139, 250, 0.5)",
                    filter: "drop-shadow(0 0 20px rgba(167, 139, 250, 0.3))",
                  }}
                  initial={{ y: 100, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>{" "}
            {/* "faster" with cyan gradient */}
            <span className="inline-block overflow-hidden">
              {"faster".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400"
                  style={{
                    textShadow: "0 0 40px rgba(34, 211, 238, 0.4)",
                    filter: "drop-shadow(0 0 20px rgba(34, 211, 238, 0.25))",
                  }}
                  initial={{ y: 100, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.7 + i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
            {/* Animated underline */}
            <motion.div
              className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-full mt-2"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "60%", opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            />
          </motion.h1>

          {/* Supporting Description with fade-in words */}
          <motion.p
            className="text-lg sm:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
          >
            The{" "}
            <span className="text-white font-medium">
              collaborative code editor
            </span>{" "}
            for modern teams. Write, execute, and debug code in{" "}
            <span className="text-cyan-400 font-medium">real-time</span> with
            developers worldwide.
          </motion.p>

          {/* CTA Button with glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
          >
            <Link href="/signup">
              <Button className="relative h-14 px-8 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-cyan-500 shadow-2xl shadow-violet-500/30 hover:shadow-fuchsia-500/40 transition-all duration-300 group overflow-hidden">
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
