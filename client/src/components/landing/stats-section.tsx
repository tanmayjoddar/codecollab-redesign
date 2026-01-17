import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { stats } from "@shared/constant";
import { TrendingUp, Users, Code2, Clock, Globe } from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  "ri-code-line": <Code2 className="w-7 h-7" />,
  "ri-time-line": <Clock className="w-7 h-7" />,
  "ri-global-line": <Globe className="w-7 h-7" />,
  "ri-user-line": <Users className="w-7 h-7" />,
};

// Animated counter component
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    const hasDecimal = value.includes(".");
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericValue * eased;

      if (hasDecimal) {
        setDisplayValue(current.toFixed(1));
      } else {
        setDisplayValue(Math.floor(current).toLocaleString());
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  // Extract prefix (like ">") if present
  const prefix = value.match(/^[^0-9]*/)?.[0] || "";
  const extractedSuffix = value.match(/[^0-9.]+$/)?.[0] || suffix;

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayValue}
      {extractedSuffix}
    </span>
  );
}

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const gradients = [
    "from-violet-500 to-purple-500",
    "from-cyan-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass-card p-6 md:p-8 rounded-2xl text-center hover:border-violet-500/20 transition-all duration-500 relative overflow-hidden">
        {/* Background gradient on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        />

        {/* Icon */}
        <div
          className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
          style={{
            boxShadow: `0 10px 40px -10px hsl(var(--violet-500) / 0.3)`,
          }}
        >
          {iconMap[stat.icon] || <TrendingUp className="w-7 h-7" />}
        </div>

        {/* Value */}
        <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
          <AnimatedCounter value={stat.value} />
        </div>

        {/* Label */}
        <p className="text-muted-foreground font-medium">{stat.label}</p>

        {/* Bottom accent */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
        />
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-violet-950/5 to-background" />
        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/2 left-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 right-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-button border-emerald-500/30 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              Growing Fast
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Numbers that speak <span className="gradient-text">volumes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join a thriving community of developers who ship better code,
            faster.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Live indicator */}
        <motion.div
          className="mt-16 md:mt-20 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass-card px-6 py-3 rounded-full flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-emerald-400">2,847</span>{" "}
              developers coding right now
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
