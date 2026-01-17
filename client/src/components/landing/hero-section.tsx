import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Code2 } from "lucide-react";
import { Link } from "wouter";

// Floating orb animation component
function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

// Animated code preview
function CodePreview() {
  return (
    <motion.div
      className="glass-card p-4 rounded-2xl overflow-hidden max-w-md w-full"
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Window controls */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-muted-foreground font-mono">
          collab.js
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">3 online</span>
        </div>
      </div>

      {/* Code content */}
      <div className="font-mono text-sm space-y-1.5">
        <motion.div
          className="flex"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span className="text-muted-foreground/50 w-6 text-right mr-4">
            1
          </span>
          <span>
            <span className="text-violet-400">const</span>{" "}
            <span className="text-cyan-400">team</span> ={" "}
            <span className="text-amber-400">"awesome"</span>;
          </span>
        </motion.div>
        <motion.div
          className="flex"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <span className="text-muted-foreground/50 w-6 text-right mr-4">
            2
          </span>
          <span>
            <span className="text-violet-400">const</span>{" "}
            <span className="text-cyan-400">productivity</span> ={" "}
            <span className="text-emerald-400">collaborate</span>();
          </span>
        </motion.div>
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <span className="text-muted-foreground/50 w-6 text-right mr-4">
            3
          </span>
          <span className="flex items-center gap-2">
            <span className="text-rose-400">export</span>{" "}
            <span className="text-foreground/90">
              {"{ team, productivity };"}
            </span>
            <motion.span
              className="inline-block w-0.5 h-5 bg-violet-500"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </span>
        </motion.div>
        <motion.div
          className="flex"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3 }}
        >
          <span className="text-muted-foreground/50 w-6 text-right mr-4">
            4
          </span>
          <span className="text-muted-foreground/50">
            // ✨ Magic happens here
          </span>
        </motion.div>
      </div>

      {/* User avatars */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-medium">
            JD
          </div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-medium">
            SC
          </div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-medium">
            MR
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          3 collaborators editing...
        </span>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 mesh-gradient opacity-60" />
      <FloatingOrb
        className="w-[600px] h-[600px] bg-violet-600/30 -top-64 -left-64"
        delay={0}
      />
      <FloatingOrb
        className="w-[500px] h-[500px] bg-cyan-600/25 top-1/4 -right-48"
        delay={2}
      />
      <FloatingOrb
        className="w-[400px] h-[400px] bg-rose-600/20 bottom-0 left-1/3"
        delay={4}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-button border-violet-500/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">
                Now with AI-powered code suggestions
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                New
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Code together, <span className="gradient-text">ship faster</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The collaborative code editor designed for modern teams. Write,
              execute, and debug code in real-time with developers worldwide.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/signup">
                <Button className="h-14 px-8 text-base btn-gradient text-white font-semibold group">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-14 px-8 text-base glass-button border-white/20 hover:border-white/40 group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex -space-x-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 border-3 border-background flex items-center justify-center text-xs text-white font-bold"
                    style={{
                      background: `linear-gradient(135deg, hsl(${250 + i * 25}, 70%, 60%), hsl(${280 + i * 25}, 70%, 50%))`,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-sm"></i>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">50,000+</span>{" "}
                  developers trust CodeCollab
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right side - Code preview */}
          <div className="flex justify-center lg:justify-end">
            <CodePreview />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
