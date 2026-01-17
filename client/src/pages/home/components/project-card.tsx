import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Lock, Trash2, Clock, ArrowRight } from "lucide-react";
import { getLanguageIcon, getLanguageName } from "@/lib/language-utils";
import type { Session } from "@shared/schema";
import { motion } from "framer-motion";

interface ProjectCardProps {
  session: Session;
  onDelete?: (sessionId: string) => void;
  showDelete?: boolean;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function ProjectCard({
  session,
  onDelete,
  showDelete = true,
}: ProjectCardProps) {
  const langIcon = getLanguageIcon(session.language);

  return (
    <Link to={`/playground/${session.id}`}>
      <motion.div
        className="glass-card rounded-2xl overflow-hidden group cursor-pointer h-full"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Gradient top bar */}
        <div
          className={`h-1 bg-gradient-to-r ${
            session.isPublic
              ? "from-violet-500 via-purple-500 to-cyan-500"
              : "from-slate-500 via-slate-400 to-slate-500"
          }`}
        />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Language icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                <i className={`${langIcon.icon} ${langIcon.color} text-lg`}></i>
              </div>

              {/* Project info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-violet-400 transition-colors">
                  {session.name || "Untitled Project"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {getLanguageName(session.language)}
                </p>
              </div>
            </div>

            {/* Delete button */}
            {showDelete && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(session.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Last edited */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Edited {formatRelativeTime(session.updatedAt)}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {/* Visibility badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                session.isPublic
                  ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                  : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
              }`}
            >
              {session.isPublic ? (
                <>
                  <Globe className="w-3 h-3" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  <span>Private</span>
                </>
              )}
            </div>

            {/* Open indicator */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-violet-400 transition-colors">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                Open
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function CreateProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="glass-card rounded-2xl overflow-hidden cursor-pointer h-full min-h-[180px] group"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-full p-5 flex flex-col items-center justify-center relative">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Icon */}
        <motion.div
          className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mb-4 group-hover:border-violet-500/30 transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          <i className="ri-add-line text-2xl text-violet-400 group-hover:rotate-90 transition-transform duration-300"></i>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
        </motion.div>

        <h3 className="relative z-10 text-lg font-semibold text-foreground mb-1 group-hover:text-violet-400 transition-colors">
          New Project
        </h3>
        <p className="relative z-10 text-sm text-muted-foreground text-center">
          Start a fresh coding session
        </p>
      </div>
    </motion.div>
  );
}
