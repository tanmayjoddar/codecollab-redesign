import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Users, Flame } from "lucide-react";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-20 md:pt-24">
      {/* Enhanced background with better visibility on all devices */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat opacity-60 md:opacity-50"
        style={{
          backgroundImage: `url('/BG.png')`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      />

      {/* Mobile-friendly gradient overlay - less opacity on mobile */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            110deg,
            rgba(2, 6, 23, 0.95) 0%,
            rgba(15, 23, 42, 0.85) 25%,
            rgba(30, 41, 59, 0.5) 50%,
            rgba(51, 65, 85, 0.3) 75%,
            transparent 100%
          )`,
        }}
      />

      {/* Modern mesh gradient accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-cyan-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[90px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full py-12 md:py-20">
        <div className="max-w-4xl">
          {/* Main Headline - Responsive sizing with Kaushan Script font */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.2] mb-6 md:mb-8"
            style={{ fontFamily: "'Kaushan Script', cursive" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-white">Code together,</span>
            <br />
            <span className="inline-block mt-1 md:mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500 animate-gradient">
                ship faster
              </span>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 max-w-2xl mb-8 md:mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            The{" "}
            <span className="text-white font-semibold">
              collaborative code editor
            </span>{" "}
            for modern teams. Write, execute, and debug code in{" "}
            <span className="text-cyan-400 font-semibold">real-time</span> with
            developers worldwide.
          </motion.p>

          {/* CTA Buttons - Responsive */}
          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/signup">
              <Button className="group relative w-full sm:w-auto h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg font-semibold text-white rounded-lg sm:rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-fuchsia-500/30 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full sm:w-auto h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg font-semibold rounded-lg sm:rounded-xl border-slate-700 bg-slate-900/50 text-white hover:bg-slate-800/80 hover:border-slate-600 backdrop-blur-sm transition-all duration-300"
            >
              View Demo
            </Button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-slate-800/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {[
              { icon: Code2, text: "20+ Languages" },
              { icon: Users, text: "Live Collaboration" },
              { icon: Flame, text: "Instant Execution" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-slate-400"
              >
                <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                <span className="text-xs sm:text-sm font-medium">
                  {feature.text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating code preview (optional enhancement) */}
      <motion.div
        className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-[500px]"
        initial={{ opacity: 0, x: 100, rotateY: -15 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-2xl blur-3xl" />
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-slate-500 ml-2">main.js</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="text-slate-500">// Real-time collaboration</div>
              <div className="mt-2">
                <span className="text-violet-400">const</span>{" "}
                <span className="text-cyan-400">team</span> ={" "}
                <span className="text-yellow-300">'awesome'</span>;
              </div>
              <div className="mt-2">
                <span className="text-violet-400">console</span>
                <span className="text-slate-300">.</span>
                <span className="text-cyan-400">log</span>
                <span className="text-slate-300">(</span>
                <span className="text-yellow-300">
                  `Ship ${"{"}team{"}"}`
                </span>
                <span className="text-slate-300">);</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
