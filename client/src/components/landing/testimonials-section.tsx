import { motion } from "framer-motion";
import { testimonials } from "@shared/constant";
import { Quote, MessageCircle } from "lucide-react";

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
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  // Generate a gradient based on index
  const gradients = [
    "from-violet-500 to-purple-500",
    "from-cyan-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div variants={cardVariants} className="group relative">
      <div className="glass-card p-6 md:p-8 rounded-2xl h-full relative overflow-hidden hover:border-violet-500/20 transition-all duration-500">
        {/* Quote icon */}
        <div
          className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
        >
          <Quote className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <p className="text-foreground/90 leading-relaxed mb-6 text-lg">
          "{testimonial.content}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg border-2 border-white/20`}
          >
            {testimonial.name
              .split(" ")
              .map(n => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>

        {/* Hover gradient effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
        />
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative py-20 md:py-28 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
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
            <MessageCircle className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-400">
              Loved by Developers
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Trusted by <span className="gradient-text">thousands</span> of
            developers
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our community has to say about their experience with
            CodeBuddy.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 md:mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass-card inline-flex items-center gap-4 px-6 py-4 rounded-2xl">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((letter, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 border-2 border-background flex items-center justify-center text-xs text-white font-bold"
                  style={{
                    background: `linear-gradient(135deg, hsl(${250 + i * 30}, 70%, 60%), hsl(${280 + i * 30}, 70%, 50%))`,
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">
                Join 50,000+ developers
              </p>
              <p className="text-sm text-muted-foreground">
                Start collaborating today
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
