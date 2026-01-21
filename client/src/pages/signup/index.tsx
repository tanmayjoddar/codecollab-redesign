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
  Check,
  Code2,
  Users,
  Zap,
  Shield,
} from "lucide-react";
import { stats } from "@shared/constant";
import { motion } from "framer-motion";
import {
  getRedirectPath,
  clearRedirectParam,
  hasRedirectParam,
} from "@/lib/utils";

// Extend the insert schema with validation rules
const registerSchema = insertUserSchema
  .extend({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    email: z.string().email("Invalid email address"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ["Weak", "Fair", "Good", "Strong", "Excellent"];
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-emerald-500",
    "bg-cyan-500",
  ];

  if (password.length === 0) return null;

  return (
    <motion.div
      className="mt-2"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
    >
      <div className="flex gap-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? colors[strength - 1] : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        Password strength: {labels[Math.max(0, strength - 1)]}
      </span>
    </motion.div>
  );
}

// Benefits list item
function BenefitItem({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.li
      className="flex items-center gap-2 text-sm text-muted-foreground"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <Check className="w-3 h-3 text-emerald-400" />
      </div>
      {children}
    </motion.li>
  );
}

export default function SignupPage() {
  const { user, registerMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [password, setPassword] = useState("");

  // Handle redirect after successful registration
  useEffect(() => {
    if (user) {
      const redirectPath = getRedirectPath();
      clearRedirectParam();
      navigate(redirectPath);
    }
  }, [user, navigate]);

  // Registration form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData);
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
        className="w-[500px] h-[500px] bg-cyan-600 -top-48 -right-48"
        delay={0}
      />
      <FloatingOrb
        className="w-[400px] h-[400px] bg-violet-600 top-1/3 -left-48"
        delay={2}
      />
      <FloatingOrb
        className="w-[300px] h-[300px] bg-rose-600 bottom-0 right-1/4"
        delay={4}
      />

      {/* Hero Section - Left Side */}
      <div className="lg:w-1/2 xl:w-3/5 p-6 md:p-12 lg:p-16 flex items-center justify-center relative z-10 order-2 lg:order-1">
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.2]"
              style={{ fontFamily: "'Kaushan Script', cursive" }}
            >
              JOIN THE,
            </h1>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.2] mb-6 md:mb-8 text-violet-500"
              style={{ fontFamily: "'Kaushan Script', cursive" }}
            >
              FUTURE OF CODING
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              The collaborative code editor that brings your team together.
              Write, execute, and debug code in real-time with developers
              worldwide.
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="space-y-4 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FeatureHighlight
              icon={Code2}
              text="Access 10+ programming languages"
              delay={0.4}
            />
            <FeatureHighlight
              icon={Users}
              text="Collaborate in real-time with anyone"
              delay={0.5}
            />
            <FeatureHighlight
              icon={Zap}
              text="Instant code execution & debugging"
              delay={0.6}
            />
            <FeatureHighlight
              icon={Shield}
              text="Enterprise-grade security"
              delay={0.7}
            />
          </motion.div>

          {/* What you get */}
          <motion.div
            className="glass-card p-6 rounded-2xl hidden md:block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              What you'll get for free
            </h3>
            <ul className="space-y-3">
              <BenefitItem delay={0.6}>
                Unlimited public coding sessions
              </BenefitItem>
              <BenefitItem delay={0.7}>
                Real-time collaboration tools
              </BenefitItem>
              <BenefitItem delay={0.8}>
                Built-in chat & communication
              </BenefitItem>
              <BenefitItem delay={0.9}>
                Access to community templates
              </BenefitItem>
              <BenefitItem delay={1.0}>5 private projects included</BenefitItem>
            </ul>
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

      {/* Signup Form Section - Right Side */}
      <div className="lg:w-1/2 xl:w-2/5 p-6 md:p-12 flex items-center justify-center relative z-10 order-1 lg:order-2">
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
                  Create your account
                </h2>
                <p className="text-muted-foreground text-sm">
                  Start your coding journey today
                </p>
              </motion.div>
              {hasRedirectParam() && (
                <motion.div
                  className="mt-3 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-sm text-violet-400"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Flame className="inline-block w-4 h-4 mr-1" />
                  You'll be redirected after registration
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
                Sign up with GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 glass-button border-white/10 hover:border-white/20 group"
                type="button"
              >
                <Mail className="w-5 h-5 mr-2 group-hover:text-violet-400 transition-colors" />
                Sign up with Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Registration form */}
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground text-sm font-medium">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Choose a username"
                          className="h-11 input-modern"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="h-11 input-modern"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a strong password"
                          className="h-11 input-modern"
                          {...field}
                          onChange={e => {
                            field.onChange(e);
                            setPassword(e.target.value);
                          }}
                        />
                      </FormControl>
                      <PasswordStrength password={password} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground text-sm font-medium">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
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
                  className="w-full h-11 btn-gradient text-white font-medium group mt-2"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Terms */}
            <p className="mt-4 text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="#" className="text-violet-400 hover:text-violet-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-violet-400 hover:text-violet-300">
                Privacy Policy
              </Link>
            </p>

            {/* Sign in link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
