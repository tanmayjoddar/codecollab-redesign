import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Bell,
  Palette,
  Shield,
  Key,
  Moon,
  Sun,
  Mail,
  MessageSquare,
  Loader2,
  Check,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  if (!user) {
    return null;
  }

  const handleSavePreferences = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    }, 1000);
  };

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto py-10 px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account preferences and security
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-4 rounded-2xl space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-foreground border border-violet-500/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    Account Information
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Update your account details
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={user.username}
                      disabled
                      className="input-modern bg-white/5 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Username cannot be changed at this time
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Key className="w-5 h-5 text-violet-400" />
                      Change Password
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Enter current password"
                          className="input-modern bg-white/5 border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Enter new password"
                          className="input-modern bg-white/5 border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm new password"
                          className="input-modern bg-white/5 border-white/10"
                        />
                      </div>

                      <Button
                        onClick={() => {
                          toast({
                            title: "Password updated",
                            description:
                              "Your password has been changed successfully.",
                          });
                        }}
                        className="btn-gradient text-white mt-2"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-2">Preferences</h2>
                  <p className="text-muted-foreground text-sm">
                    Customize your coding environment
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">
                      Theme Preference
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setTheme("dark")}
                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                          theme === "dark"
                            ? "bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-violet-500/50"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <Moon className="w-5 h-5" />
                        <span className="font-medium">Dark</span>
                        {theme === "dark" && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                      <button
                        onClick={() => setTheme("light")}
                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                          theme === "light"
                            ? "bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-violet-500/50"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <Sun className="w-5 h-5" />
                        <span className="font-medium">Light</span>
                        {theme === "light" && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="btn-gradient text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-2">Notifications</h2>
                  <p className="text-muted-foreground text-sm">
                    Manage how you receive updates
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive email about collaboration requests
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about activity in real-time
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>

                  <Button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="btn-gradient text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-2">Security</h2>
                  <p className="text-muted-foreground text-sm">
                    Manage your account security
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium text-emerald-400">
                        Account Secure
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your account is protected with a strong password.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">
                              Chrome on Linux • Active now
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-400 px-2 py-1 rounded-full bg-emerald-400/10">
                          Current
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                  >
                    Sign Out All Devices
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
