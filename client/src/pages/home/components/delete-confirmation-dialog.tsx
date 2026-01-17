import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] glass-card border-white/10 p-0 overflow-hidden">
        {/* Danger gradient header */}
        <div className="h-2 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500" />

        <div className="p-6">
          <DialogHeader className="mb-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"
            >
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </motion.div>

            <DialogTitle className="text-xl font-bold text-foreground text-center">
              Delete Project?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-center">
              This action cannot be undone. The project and all its contents
              will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          {/* Warning box */}
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-400 mb-1">
                  Permanent Deletion
                </p>
                <p className="text-xs text-muted-foreground">
                  All code, files, and collaboration history will be lost
                  forever.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 glass-button border-white/10 hover:border-white/20"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1 h-11 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium border-0"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
