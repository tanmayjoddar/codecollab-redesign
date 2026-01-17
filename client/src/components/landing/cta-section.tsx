import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "wouter";

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-background to-cyan-950/50" />

        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="glass-card p-8 md:p-12 lg:p-16 rounded-3xl text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative gradient border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/20 via-transparent to-cyan-500/20 p-px">
            <div className="absolute inset-0 rounded-3xl bg-background/80 backdrop-blur-xl" />
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-tl-full" />

          <div className="relative">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-button border-violet-500/30 mb-8"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">Free to get started</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Ready to transform how <br className="hidden sm:block" />
              <span className="gradient-text">you code?</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Join thousands of developers who are already shipping faster with
              collaborative coding. Start for free, no credit card required.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/signup">
                <Button className="h-14 px-8 text-base btn-gradient text-white font-semibold group">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-14 px-8 text-base glass-button border-white/20 hover:border-white/40"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
