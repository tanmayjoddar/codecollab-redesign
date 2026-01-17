import { useState, useEffect } from "react";
import { LanguageSelector } from "@/components/editor/language-selector";
import { ActionButtons } from "@/components/editor/action-buttons";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { File } from "@shared/schema";
import { ExecutionResult } from "@/lib/websocket";

type SessionControlsProps = {
  sessionId: string;
  sessionName: string;
  language: string;
  onLanguageChange: (language: string) => void;
  activeFile: File;
  onExecute: (result: ExecutionResult) => void;
  isRunning: boolean;
};

export function SessionControls({
  sessionId,
  sessionName,
  language,
  onLanguageChange,
  activeFile,
  onExecute,
  isRunning,
}: SessionControlsProps) {
  const [name, setName] = useState(sessionName);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Update local state when session name prop changes
  useEffect(() => {
    setName(sessionName);
  }, [sessionName]);

  const handleNameChange = async () => {
    if (name === sessionName) {
      setIsEditing(false);
      return;
    }

    try {
      await apiRequest("PATCH", `/api/sessions/${sessionId}`, {
        name,
      });

      toast({
        title: "Session renamed",
        description: "Session name has been updated successfully.",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Rename failed",
        description: "Failed to rename session. Please try again.",
        variant: "destructive",
      });

      // Reset to original name
      setName(sessionName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameChange();
    } else if (e.key === "Escape") {
      setName(sessionName);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-background via-background to-background/95 border-b border-white/5 py-3 px-4 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Session Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center">
              <i className="ri-code-s-slash-line text-violet-400 text-sm"></i>
            </div>
            {isEditing ? (
              <Input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={handleNameChange}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-white/5 border border-white/10 hover:border-violet-500/30 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-violet-500/50 text-foreground h-auto w-auto min-w-[150px]"
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-transparent border border-transparent hover:border-white/10 rounded-lg px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-white/5 transition-all duration-200"
              >
                {name || "Untitled Project"}
              </button>
            )}
          </div>

          <div className="h-6 w-px bg-white/10" />

          <LanguageSelector
            currentLanguage={language}
            onSelect={onLanguageChange}
          />
        </div>

        {/* Action Buttons */}
        <ActionButtons
          sessionId={sessionId}
          sessionName={sessionName}
          activeFile={activeFile}
          language={language}
          onExecute={onExecute}
          isRunning={isRunning}
        />
      </div>
    </div>
  );
}
