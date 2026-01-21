import { motion } from "framer-motion";
import { pricingPlans } from "@shared/constant";
import { Button } from "@/components/ui/button";
import { Check, Flame, Zap, Building2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

// Plan icon mapping
const planIcons: Record<string, React.ReactNode> = {
  Free: <Zap className="w-6 h-6" />,
  Pro: <Flame className="w-6 h-6" />,
  Enterprise: <Building2 className="w-6 h-6" />,
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof pricingPlans)[0];
  index: number;
}) {
  const isPopular = plan.popular;

  return (
    <motion.div
      variants={cardVariants}
      className={`relative ${isPopular ? "lg:-mt-4 lg:mb-4" : ""}`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25">
            Most Popular
          </div>
        </div>
      )}

      <div
        className={`glass-card p-6 md:p-8 rounded-2xl h-full relative overflow-hidden transition-all duration-500
          ${
            isPopular
              ? "border-violet-500/50 shadow-2xl shadow-violet-500/10 hover:shadow-violet-500/20"
              : "hover:border-violet-500/20"
          }`}
      >
        {/* Background gradient for popular */}
        {isPopular && (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-600/10" />
        )}

        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center
              ${
                isPopular
                  ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              {planIcons[plan.name]}
            </div>
            <div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 h-12">
            {plan.description || getPlanDescription(plan.name)}
          </p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-bold gradient-text">
                {plan.price}
              </span>
              {plan.price !== "Custom" && (
                <span className="text-muted-foreground">/month</span>
              )}
            </div>
            {plan.name === "Pro" && (
              <p className="text-sm text-emerald-400 mt-1">
                Save 20% with annual billing
              </p>
            )}
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                  ${
                    isPopular
                      ? "bg-gradient-to-br from-violet-500 to-cyan-500"
                      : "bg-emerald-500/20"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 ${isPopular ? "text-white" : "text-emerald-400"}`}
                  />
                </div>
                <span className="text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link href="/signup">
            <Button
              className={`w-full h-12 font-semibold group
                ${
                  isPopular
                    ? "btn-gradient text-white"
                    : "glass-button border-white/20 hover:border-white/40"
                }`}
            >
              {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Decorative corner */}
        {isPopular && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-transparent rounded-bl-full" />
        )}
      </div>
    </motion.div>
  );
}

function getPlanDescription(name: string): string {
  switch (name) {
    case "Free":
      return "Perfect for getting started with collaborative coding.";
    case "Pro":
      return "For professional developers who need more power.";
    case "Enterprise":
      return "Advanced security and support for large teams.";
    default:
      return "";
  }
}

export function PricingSection() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-20" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-button border-violet-500/30 mb-6"
          >
            <Flame className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-400">
              Simple Pricing
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Choose your <span className="gradient-text">perfect plan</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {pricingPlans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.div
          className="mt-16 md:mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass-card inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-muted-foreground">
                No credit card required
              </span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/10" />
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-muted-foreground">
                14-day free trial on Pro
              </span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/10" />
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-muted-foreground">Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
