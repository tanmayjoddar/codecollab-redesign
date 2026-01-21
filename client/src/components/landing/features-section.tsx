import { motion } from "framer-motion";
import { features } from "@shared/constant";
import {
  Users,
  Code2,
  Lock,
  Zap,
  Monitor,
  GitBranch,
  Flame,
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  "ri-team-line": <Users className="w-6 h-6" />,
  "ri-code-s-slash-line": <Code2 className="w-6 h-6" />,
  "ri-shield-check-line": <Lock className="w-6 h-6" />,
  "ri-speed-line": <Zap className="w-6 h-6" />,
  "ri-palette-line": <Monitor className="w-6 h-6" />,
  "ri-git-branch-line": <GitBranch className="w-6 h-6" />,
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  return (
    <motion.div variants={itemVariants} className="group relative">
      {/* Card */}
      <div className="glass-card p-6 md:p-8 rounded-2xl h-full relative overflow-hidden hover:border-violet-500/30 transition-all duration-500">
        {/* Gradient background on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient || "from-violet-600/10 to-cyan-600/10"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Badge */}
        {feature.badge && (
          <div className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
            {feature.badge}
          </div>
        )}

        {/* Icon container */}
        <div
          className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient || "from-violet-500 to-cyan-500"} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300`}
        >
          <div className="text-white">
            {iconMap[feature.icon] || <Flame className="w-6 h-6" />}
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-50" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all duration-300">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>

        {/* Bottom accent line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient || "from-violet-500 to-cyan-500"} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
        />
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-button border-cyan-500/30 mb-6"
          >
            <Flame className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">
              Powerful Features
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Everything you need to{" "}
            <span className="gradient-text">build amazing things</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From real-time collaboration to powerful execution engines, we've
            got all the tools to supercharge your development workflow.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          className="mt-16 md:mt-20 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-violet-500/50" />
            <span>And much more...</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
