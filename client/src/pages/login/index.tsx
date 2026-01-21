import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  ArrowRight,
  Github,
  Mail,
  Flame,
  Code2,
  Users,
  Zap,
} from "lucide-react";
import { features, stats } from "@shared/constant";
import { motion, AnimatePresence } from "framer-motion";
import {
  getRedirectPath,
  clearRedirectParam,
  hasRedirectParam,
} from "@/lib/utils";

// Extend the insert schema with validation rules
const loginSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Animated background orb component
function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
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

// Animated code line for background
function CodeLine({ delay, width }: { delay: number; width: string }) {
  return (
    <motion.div
      className={`h-2 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 ${width}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    />
  );
}

// Feature highlight component
function FeatureHighlight({
  icon: Icon,
  text,
  delay,
}: {
  icon: React.ElementType;
  text: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 text-muted-foreground"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-violet-400" />
      </div>
      <span className="text-sm">{text}</span>
    </motion.div>
  );
}

export default function LoginPage() {
  const { user, loginMutation } = useAuth();
  const [location, navigate] = useLocation();

  // Handle redirect after successful login
  useEffect(() => {
    if (user) {
      const redirectPath = getRedirectPath();
      clearRedirectParam();
      navigate(redirectPath);
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <FloatingOrb
        className="w-[500px] h-[500px] bg-violet-600 -top-48 -left-48"
        delay={0}
      />
      <FloatingOrb
        className="w-[400px] h-[400px] bg-cyan-600 top-1/3 right-0"
        delay={2}
      />
      <FloatingOrb
        className="w-[300px] h-[300px] bg-rose-600 bottom-0 left-1/4"
        delay={4}
      />

      {/* Hero Section - Left Side */}
      <div className="lg:w-1/2 xl:w-3/5 p-6 md:p-12 lg:p-16 flex items-center justify-center relative z-10">
        <div className="max-w-xl w-full">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/">
              <img
                src="/dp1.png"
                alt="CodeBuddy Logo"
                className="h-14 w-auto object-contain"
              />
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.2] mb-6 md:mb-8"
              style={{ fontFamily: "'Kaushan Script', cursive" }}
            >
              Code Together
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              The collaborative code editor that brings your team together.
              Write, execute, and debug code in real-time with developers
              worldwide.
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="space-y-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FeatureHighlight
              icon={Code2}
              text="Support for 10+ programming languages"
              delay={0.4}
            />
            <FeatureHighlight
              icon={Users}
              text="Real-time collaboration with live cursors"
              delay={0.5}
            />
            <FeatureHighlight
              icon={Zap}
              text="Instant code execution in secure sandboxes"
              delay={0.6}
            />
          </motion.div>

          {/* Code preview mockup */}
          <motion.div
            className="glass-card p-4 rounded-2xl overflow-hidden hidden md:block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">
                main.js
              </span>
            </div>
            <div className="font-mono text-sm space-y-2">
              <div className="flex">
                <span className="text-muted-foreground/50 w-8">1</span>
                <span>
                  <span className="text-violet-400">const</span>{" "}
                  <span className="text-cyan-400">team</span> ={" "}
                  <span className="text-amber-400">"awesome"</span>;
                </span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground/50 w-8">2</span>
                <span>
                  <span className="text-violet-400">const</span>{" "}
                  <span className="text-cyan-400">code</span> ={" "}
                  <span className="text-emerald-400">collaborate</span>();
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground/50 w-8">3</span>
                <span className="flex items-center gap-2">
                  <span className="text-violet-400">return</span>{" "}
                  <span className="text-cyan-400">magic</span>;
                  <motion.span
                    className="inline-block w-0.5 h-4 bg-violet-500"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 hidden lg:grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {stats.slice(0, 4).map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="text-2xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Login Form Section - Right Side */}
      <div className="lg:w-1/2 xl:w-2/5 p-6 md:p-12 flex items-center justify-center relative z-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Form card */}
          <div className="glass-card p-8 md:p-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome back
                </h2>
                <p className="text-muted-foreground text-sm">
                  Sign in to continue
                </p>
              </motion.div>
              {hasRedirectParam() && (
                <motion.div
                  className="mt-3 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-sm text-violet-400"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Flame className="inline-block w-4 h-4 mr-1" />
                  You'll be redirected after login
                </motion.div>
              )}
            </div>

            {/* Social login buttons */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full h-11 glass-button border-white/10 hover:border-white/20 group"
                type="button"
              >
                <Github className="w-5 h-5 mr-2 group-hover:text-violet-400 transition-colors" />
                Continue with GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 glass-button border-white/10 hover:border-white/20 group"
                type="button"
              >
                <Mail className="w-5 h-5 mr-2 group-hover:text-violet-400 transition-colors" />
                Continue with Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            {/* Login form */}
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground text-sm font-medium">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          className="h-11 input-modern"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground text-sm font-medium">
                          Password
                        </FormLabel>
                        <Link
                          href="#"
                          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="h-11 input-modern"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 btn-gradient text-white font-medium group"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>

          {/* Security note */}
          <motion.div
            className="mt-6 text-center text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <i className="ri-shield-check-line mr-1 text-emerald-400"></i>
            Protected by enterprise-grade security
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
