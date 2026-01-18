import { getFileIcon } from "@/lib/language-utils";
import type { File } from "@shared/schema";
import { X } from "lucide-react";

interface FileTabsProps {
  files: File[];
  activeFileId: string | null;
  onSelect: (fileId: string) => void;
  onClose: (fileId: string) => void;
}

export function FileTabs({
  files,
  activeFileId,
  onSelect,
  onClose,
}: FileTabsProps) {
  return (
    <div className="bg-background/50 backdrop-blur-sm border-b border-white/5 flex overflow-x-auto hide-scrollbar px-2 py-1.5 gap-1">
      {files.map(file => {
        const icon = getFileIcon(file.name);
        const isActive = file.id === activeFileId;

        return (
          <div
            key={file.id}
            className={`group px-3 py-1.5 flex items-center rounded-lg cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-violet-500/15 to-purple-500/15 border border-violet-500/20 text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
            }`}
            onClick={() => onSelect(file.id)}
          >
            <i className={`${icon.icon} ${icon.color} mr-2 text-sm`}></i>
            <span className="text-xs font-mono">{file.name}</span>
            <button
              className={`ml-2 rounded-md p-0.5 transition-all ${
                isActive
                  ? "text-muted-foreground hover:text-foreground hover:bg-white/10"
                  : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
              onClick={e => {
                e.stopPropagation();
                onClose(file.id);
              }}
            >
              <X className="w-3 h-3" />
            </button>
            {isActive && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
}
