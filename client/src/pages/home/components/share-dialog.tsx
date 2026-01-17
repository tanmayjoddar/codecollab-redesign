import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Globe, Check, ArrowRight, Share2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sharingUrl: string;
  onNavigate: () => void;
}

export function ShareDialog({
  open,
  onOpenChange,
  sharingUrl,
  onNavigate,
}: ShareDialogProps) {
  const urlInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sharingUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link with your collaborators",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      if (urlInputRef.current) {
        urlInputRef.current.select();
        document.execCommand("copy");
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "Share this link with your collaborators",
        });
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] glass-card border-white/10 p-0 overflow-hidden">
        {/* Success gradient header */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />

        <div className="p-6">
          <DialogHeader className="mb-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                Project Created! 🎉
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Your public project is ready. Share the link below to start
                collaborating!
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* URL input with copy button */}
            <div className="relative">
              <Input
                ref={urlInputRef}
                readOnly
                value={sharingUrl}
                className="h-12 pr-24 input-modern font-mono text-sm"
              />
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
                className={`absolute right-1 top-1/2 -translate-y-1/2 h-10 px-4 rounded-lg transition-all ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Copied</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>

            {/* Info box */}
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-violet-400 mb-1">
                    Public Access
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Anyone with this link can view and participate in your
                    coding session. No approval required.
                  </p>
                </div>
              </div>
            </div>

            {/* Share options */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-muted-foreground">
                Quick share:
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(sharingUrl)}&text=${encodeURIComponent("Join my coding session on CodeBuddy!")}`,
                      "_blank"
                    )
                  }
                >
                  <i className="ri-twitter-x-line text-sm"></i>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharingUrl)}`,
                      "_blank"
                    )
                  }
                >
                  <i className="ri-linkedin-line text-sm"></i>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    window.open(
                      `mailto:?subject=${encodeURIComponent("Join my CodeBuddy session")}&body=${encodeURIComponent(`Join my coding session: ${sharingUrl}`)}`,
                      "_blank"
                    )
                  }
                >
                  <i className="ri-mail-line text-sm"></i>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button
            onClick={onNavigate}
            className="w-full h-12 btn-gradient text-white font-medium group"
          >
            Go to Project
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
