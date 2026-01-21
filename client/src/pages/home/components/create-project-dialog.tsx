import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Globe, Lock, Flame, Code2, ArrowRight } from "lucide-react";
import { languages } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    isPublic: boolean;
    language: string;
  }) => void;
  isPending: boolean;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name, isPublic, language });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setName("");
      setIsPublic(false);
      setLanguage("javascript");
    }
    onOpenChange(newOpen);
  };

  const selectedLang = languages.find(l => l.id === language);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] glass-card border-white/10 p-0 overflow-hidden">
        {/* Gradient header */}
        <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500" />

        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  Create New Project
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm">
                  Set up your new coding workspace
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5">
            {/* Project name */}
            <div className="space-y-2">
              <Label
                htmlFor="project-name"
                className="text-sm font-medium text-foreground"
              >
                Project Name
              </Label>
              <Input
                id="project-name"
                placeholder="My Awesome Project"
                className="h-11 input-modern"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>

            {/* Language selector */}
            <div className="space-y-2">
              <Label
                htmlFor="language"
                className="text-sm font-medium text-foreground"
              >
                Programming Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-11 input-modern">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  {languages.map(lang => (
                    <SelectItem
                      key={lang.id}
                      value={lang.id}
                      className="rounded-lg cursor-pointer hover:bg-white/5 focus:bg-white/5"
                    >
                      <div className="flex items-center">
                        <i
                          className={`${lang.icon} ${lang.iconColor} mr-2`}
                        ></i>
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visibility toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="public-visibility"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Project Visibility
                </Label>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isPublic ? "text-violet-400" : "text-muted-foreground"
                    }`}
                  >
                    {isPublic ? "Public" : "Private"}
                  </span>
                  <Switch
                    id="public-visibility"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-600 data-[state=checked]:to-cyan-600"
                  />
                </div>
              </div>

              {/* Visibility info */}
              <AnimatePresence mode="wait">
                {isPublic ? (
                  <motion.div
                    key="public"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-violet-400 mb-1">
                          Public Project
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Discoverable in public projects. Collaborators need
                          your approval to join and edit.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="private"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-500/20 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-400 mb-1">
                          Private Project
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Only visible to you. Share the link and approve
                          requests to collaborate.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 gap-3">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="flex-1 h-11 glass-button border-white/10 hover:border-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="flex-1 h-11 btn-gradient text-white font-medium group"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Create Project
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
