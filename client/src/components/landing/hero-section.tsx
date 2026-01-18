import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
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
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

// Animated code preview - more compact
function CodePreview() {
  return (
    <motion.div
      className="glass-card p-3 rounded-2xl overflow-hidden max-w-sm w-full"
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      {/* Window controls */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[10px] text-muted-foreground font-mono">
          app.js
        </span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400">3 online</span>
        </div>
      </div>

      {/* Code content - more compact */}
      <div className="font-mono text-xs space-y-1">
        <motion.div
          className="flex"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-muted-foreground/50 w-5 text-right mr-3">
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
          transition={{ delay: 0.75 }}
        >
          <span className="text-muted-foreground/50 w-5 text-right mr-3">
            2
          </span>
          <span>
            <span className="text-violet-400">const</span>{" "}
            <span className="text-cyan-400">code</span> ={" "}
            <span className="text-emerald-400">collaborate</span>();
          </span>
        </motion.div>
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <span className="text-muted-foreground/50 w-5 text-right mr-3">
            3
          </span>
          <span className="flex items-center gap-1">
            <span className="text-rose-400">export</span>{" "}
            <span className="text-foreground/90">{"{ team, code };"}</span>
            <motion.span
              className="inline-block w-0.5 h-4 bg-violet-500"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </span>
        </motion.div>
      </div>

      {/* User avatars */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
        <div className="flex -space-x-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 border-2 border-background flex items-center justify-center text-[8px] text-white font-medium">
            J
          </div>
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 border-2 border-background flex items-center justify-center text-[8px] text-white font-medium">
            S
          </div>
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-background flex items-center justify-center text-[8px] text-white font-medium">
            M
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground">
          3 collaborators editing...
        </span>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-12 px-4">
      {/* Background effects - reduced size */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <FloatingOrb
        className="w-[400px] h-[400px] bg-violet-600/25 -top-32 -left-32"
        delay={0}
      />
      <FloatingOrb
        className="w-[350px] h-[350px] bg-cyan-600/20 top-1/4 -right-32"
        delay={2}
      />
      <FloatingOrb
        className="w-[300px] h-[300px] bg-rose-600/15 bottom-0 left-1/4"
        delay={4}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-button border-violet-500/30 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium">
                AI-powered code suggestions
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                New
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Code together, <span className="gradient-text">ship faster</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              The collaborative code editor for modern teams. Write, execute,
              and debug code in real-time with developers worldwide.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/signup">
                <Button className="h-12 px-6 text-sm btn-gradient text-white font-semibold group">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-12 px-6 text-sm glass-button border-white/20 hover:border-white/40 group"
              >
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Social proof - simplified without stars */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br border-2 border-background flex items-center justify-center text-[10px] text-white font-bold"
                    style={{
                      background: `linear-gradient(135deg, hsl(${250 + i * 25}, 70%, 60%), hsl(${280 + i * 25}, 70%, 50%))`,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">50,000+</span>{" "}
                developers trust CodeBuddy
              </p>
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
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-1.5 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
