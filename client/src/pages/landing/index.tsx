import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Code2, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  StatsSection,
  PricingSection,
  CTASection,
  Footer,
} from "@/components/landing";

// Landing page navigation
function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-4 mt-4"
      >
        <nav className="glass border border-white/10 rounded-2xl px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Code2 className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold gradient-text">
                CodeCollab
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="btn-gradient text-white font-medium group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden mt-4 pt-4 border-t border-white/10"
              >
                <div className="flex flex-col gap-4">
                  {navItems.map(item => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-center">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full justify-center btn-gradient text-white">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.div>
    </header>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
