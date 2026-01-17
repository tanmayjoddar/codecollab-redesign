import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import {
  Settings,
  Code2,
  Users,
  Clock,
  TrendingUp,
  Folder,
  ArrowRight,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const stats = [
    {
      label: "Projects",
      value: "12",
      icon: Folder,
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "Collaborations",
      value: "8",
      icon: Users,
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "Hours Coded",
      value: "156",
      icon: Clock,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Lines Written",
      value: "24.5k",
      icon: Code2,
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto py-10 px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account and view activity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full blur-lg opacity-50" />
                  <Avatar className="relative h-28 w-28 border-4 border-background">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-3xl font-bold">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-background" />
                </div>

                {/* User info */}
                <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  User ID: {user.id}
                </p>

                {/* Quick stats */}
                <div className="w-full space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">March 2025</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Active sessions
                    </span>
                    <span className="font-medium text-emerald-400">
                      3 online
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Link href="/settings" className="w-full">
                  <Button className="w-full glass-button border-white/20 hover:border-white/40 group">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Settings
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="glass-card p-5 rounded-xl group hover:border-violet-500/30 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Activity Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Recent Activity</h3>
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Active today</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Edited main.py",
                    project: "Python Project",
                    time: "2 hours ago",
                    color: "from-cyan-500 to-blue-500",
                  },
                  {
                    title: "Started collaboration",
                    project: "React App",
                    time: "5 hours ago",
                    color: "from-violet-500 to-purple-500",
                  },
                  {
                    title: "Created new file",
                    project: "Node Server",
                    time: "Yesterday",
                    color: "from-emerald-500 to-teal-500",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                  >
                    <div
                      className={`w-2 h-10 rounded-full bg-gradient-to-b ${activity.color}`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.project}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Recent Projects</h3>
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-violet-400 hover:text-violet-300"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Folder className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Your recent projects will appear here
                </p>
                <Link href="/">
                  <Button className="btn-gradient text-white">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
