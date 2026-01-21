import { motion } from "framer-motion";
import { footerLinks, socialLinks } from "@shared/constant";
import { Link } from "wouter";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 md:py-20 px-4 border-t border-white/5">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-violet-950/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
            <Link href="/" className="flex items-center mb-4">
              <img
                src="/dp.png"
                alt="CodeBuddy Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              The modern collaborative code editor for teams who ship fast. Code
              together, anywhere.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(social => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass-button flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-violet-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <i className={`${social.icon} text-lg`} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((section, index) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link href={link.href}>
                      <span className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© {currentYear} CodeBuddy. Made with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 mx-1" />
            <span>for developers worldwide.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy">
              <span className="hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </span>
            </Link>
            <Link href="/terms">
              <span className="hover:text-foreground transition-colors duration-200">
                Terms of Service
              </span>
            </Link>
            <Link href="/cookies">
              <span className="hover:text-foreground transition-colors duration-200">
                Cookie Policy
              </span>
            </Link>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      </div>
    </footer>
  );
}
