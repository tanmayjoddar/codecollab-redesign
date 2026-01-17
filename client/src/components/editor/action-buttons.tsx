import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Play, Save, GitFork, Share2, Copy, Check } from "lucide-react";
import { ExecutionResult } from "@/lib/websocket";

type ActionButtonsProps = {
  sessionId: string;
  sessionName: string;
  activeFile: { id: string; content: string; name: string };
  language: string;
  onExecute: (result: ExecutionResult) => void;
  isRunning: boolean;
};

export function ActionButtons({
  sessionId,
  sessionName,
  activeFile,
  language,
  onExecute,
  isRunning,
}: ActionButtonsProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const saveCode = async () => {
    try {
      await apiRequest("PATCH", `/api/files/${activeFile.id}`, {
        content: activeFile.content,
      });

      toast({
        title: "Code saved",
        description: "Your code has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const runCode = async () => {
    try {
      const response = await apiRequest("POST", "/api/execute", {
        code: activeFile.content,
        language,
      });

      const result = await response.json();
      onExecute(result);
    } catch (error) {
      toast({
        title: "Execution failed",
        description: "Failed to execute code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const forkProject = async () => {
    try {
      const response = await apiRequest("POST", "/api/sessions", {
        name: `Fork of ${sessionName}`,
        language,
        isPublic: true,
      });

      const { session, files } = await response.json();

      // Copy the content of the current file to the new session's default file
      if (files && files.length > 0) {
        await apiRequest("PATCH", `/api/files/${files[0].id}`, {
          content: activeFile.content,
        });
      }

      toast({
        title: "Project forked",
        description: "A copy of this project has been created in your account.",
      });

      // Redirect to the new session
      window.location.href = `/playground/${session.id}`;
    } catch (error) {
      toast({
        title: "Fork failed",
        description: "Failed to fork project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareProject = () => {
    // Generate shareable link
    const origin = window.location.origin;
    const link = `${origin}/playground/${sessionId}`;
    setShareableLink(link);
    setIsSharing(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast({
      title: "Link copied",
      description: "Shareable link has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        {/* Save Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg transition-all duration-200"
              onClick={saveCode}
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Save code (Ctrl+S)
          </TooltipContent>
        </Tooltip>

        {/* Fork Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg transition-all duration-200"
              onClick={forkProject}
            >
              <GitFork className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Fork</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Create a copy of this project
          </TooltipContent>
        </Tooltip>

        {/* Run Button - Primary Action */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="h-9 px-4 gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={runCode}
              disabled={isRunning}
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span className="text-sm">Run</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Execute code (Ctrl+Enter)
          </TooltipContent>
        </Tooltip>

        {/* Share Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg transition-all duration-200"
              onClick={shareProject}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Share this project
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Share Dialog */}
      <Dialog open={isSharing} onOpenChange={setIsSharing}>
        <DialogContent className="sm:max-w-md glass border-white/10">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Share Project</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Anyone with this link can access and collaborate on this project.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-4">
            <Input 
              value={shareableLink} 
              readOnly 
              className="flex-1 h-10 bg-white/5 border-white/10 text-sm font-mono"
            />
            <Button 
              onClick={copyLink}
              className="h-10 px-4 gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white font-medium"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
