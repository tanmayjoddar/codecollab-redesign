import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { NotificationBell } from "@/components/ui/notification-bell";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Flame, ChevronDown, Menu, X } from "lucide-react";

export function AppHeader() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActivePath = (path: string) => {
    return location === path;
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "nav-blur shadow-lg shadow-black/5"
          : "bg-background/50 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <img
                src="/dp1.png"
                alt="CodeBuddy Logo"
                className="h-12 w-auto object-contain"
              />
            </motion.div>
          </Link>

          {/* Center navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button
                variant="ghost"
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActivePath("/")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActivePath("/") && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">Dashboard</span>
              </Button>
            </Link>
            <Link to="/playground">
              <Button
                variant="ghost"
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.startsWith("/playground")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {location.startsWith("/playground") && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">Playground</span>
              </Button>
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search button (placeholder for command palette) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
              <Search className="w-4 h-4" />
            </Button>

            <ThemeToggle />

            {/* Help button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
              <i className="ri-question-line text-lg"></i>
            </Button>

            <NotificationBell />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                  >
                    <Avatar className="h-8 w-8 border-2 border-violet-500/30 group-hover:border-violet-500/50 transition-colors">
                      <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-600 text-white text-sm font-medium">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:block text-sm font-medium text-foreground max-w-[100px] truncate">
                      {user.username}
                    </span>
                    <ChevronDown className="hidden lg:block w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 glass-card border-white/10 p-2"
                >
                  <div className="px-2 py-2 mb-2 border-b border-white/10">
                    <p className="text-sm font-medium text-foreground">
                      {user.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link to="/profile">
                    <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-white/5 focus:bg-white/5">
                      <i className="ri-user-line mr-2 text-muted-foreground"></i>
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/settings">
                    <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-white/5 focus:bg-white/5">
                      <i className="ri-settings-4-line mr-2 text-muted-foreground"></i>
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-white/5 focus:bg-white/5">
                    <Flame className="w-4 h-4 mr-2 text-amber-400" />
                    <span>Upgrade to Pro</span>
                    <span className="ml-auto text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                  >
                    <i className="ri-logout-box-r-line mr-2"></i>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5"
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Slide-in menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] glass-card border-l border-white/10 z-50 md:hidden"
            >
              <div className="flex flex-col h-full p-6">
                {/* Close button */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <img
                      src="/dp1.png"
                      alt="CodeBuddy Logo"
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Navigation links */}
                <nav className="flex flex-col gap-2 flex-1">
                  <Link to="/" onClick={() => setShowMobileMenu(false)}>
                    <Button
                      variant={isActivePath("/") ? "secondary" : "ghost"}
                      className="w-full justify-start rounded-xl h-11"
                    >
                      <i className="ri-dashboard-line mr-3 text-lg"></i>
                      Dashboard
                    </Button>
                  </Link>
                  <Link
                    to="/playground"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Button
                      variant={
                        location.startsWith("/playground")
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-start rounded-xl h-11"
                    >
                      <i className="ri-terminal-box-line mr-3 text-lg"></i>
                      Playground
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setShowMobileMenu(false)}>
                    <Button
                      variant={isActivePath("/profile") ? "secondary" : "ghost"}
                      className="w-full justify-start rounded-xl h-11"
                    >
                      <i className="ri-user-line mr-3 text-lg"></i>
                      Profile
                    </Button>
                  </Link>
                  <Link to="/settings" onClick={() => setShowMobileMenu(false)}>
                    <Button
                      variant={
                        isActivePath("/settings") ? "secondary" : "ghost"
                      }
                      className="w-full justify-start rounded-xl h-11"
                    >
                      <i className="ri-settings-4-line mr-3 text-lg"></i>
                      Settings
                    </Button>
                  </Link>
                </nav>

                {/* Upgrade button */}
                <div className="pt-4 border-t border-white/10">
                  <Button className="w-full h-11 btn-gradient text-white font-medium">
                    <Flame className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
