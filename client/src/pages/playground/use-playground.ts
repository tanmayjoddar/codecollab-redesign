import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useSession } from "@/hooks/use-sessions";
import { useCreateCollaborationRequest } from "@/hooks/use-collaboration";
import { useToast } from "@/hooks/use-toast";
import {
  wsManager,
  type CursorPosition,
  type ExecutionResult,
} from "@/lib/websocket";
import { generateUserColor } from "@/lib/language-utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/query-keys";
import type { File } from "@shared/schema";

export interface EnhancedParticipant {
  id: string;
  userId: string;
  username: string;
  cursor: CursorPosition | null;
  isActive: boolean;
  color: string;
}

interface AccessError {
  requiresAuth?: boolean;
  requiresRequest?: boolean;
  sessionId?: string;
  ownerId?: string;
  message: string;
}

// Debounce function for code changes
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function usePlayground() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const sessionId = params?.id ?? null;

  // State
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<File[]>([]);
  const [cursorPositions, setCursorPositions] = useState<
    Map<string, CursorPosition>
  >(new Map());
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(true);
  const [executionResult, setExecutionResult] = useState<
    ExecutionResult | undefined
  >();
  const [isRunning, setIsRunning] = useState(false);
  const [enhancedParticipants, setEnhancedParticipants] = useState<
    EnhancedParticipant[]
  >([]);
  const [accessError, setAccessError] = useState<AccessError | null>(null);

  // Track remote vs local changes to prevent loops - per file tracking
  const isRemoteChangeRef = useRef(false);
  const lastLocalChangesRef = useRef<
    Map<string, { content: string; timestamp: number }>
  >(new Map());
  const pendingChangesRef = useRef<Map<string, string>>(new Map());
  // Track file content versions for conflict resolution
  const fileVersionsRef = useRef<Map<string, number>>(new Map());
  // Track if we're processing a remote update for each file
  const processingRemoteRef = useRef<Set<string>>(new Set());

  const hasJoinedSession = useRef(false);

  // Query
  const {
    data: sessionData,
    isLoading,
    error,
    refetch,
  } = useSession(sessionId);

  // Map API error flags (requiresAuth / requiresRequest) into accessError
  useEffect(() => {
    if (!error) {
      setAccessError(null);
      return;
    }

    const err = error as any;

    if (err.requiresAuth || err.requiresRequest) {
      setAccessError({
        requiresAuth: err.requiresAuth,
        requiresRequest: err.requiresRequest,
        sessionId: err.sessionId,
        ownerId: err.ownerId,
        message: err.message,
      });
      return;
    }

    // For other errors, leave accessError null so generic ErrorView is used
    setAccessError(null);
  }, [error]);

  // Mutations
  const createCollaborationRequest = useCreateCollaborationRequest();

  // WebSocket connection
  useEffect(() => {
    wsManager.connect();
    if (user) {
      wsManager.setUser(user);
    }
    return () => {
      if (sessionId) {
        wsManager.leaveSession();
      }
    };
  }, [user, sessionId]);

  // Listen for collaboration request approval notifications
  useEffect(() => {
    if (!user || !sessionId) return;

    // Listen for collaboration request approval notifications
    const unsubscribeNotification = wsManager.on(
      "notification",
      (data: any) => {
        const notification = data.notification;
        if (
          notification?.type === "request_accepted" &&
          notification?.data?.sessionId === sessionId
        ) {
          // Request was accepted - refetch session data to get access
          refetch();
          setAccessError(null); // Clear access error
        }
      }
    );

    // Also listen for direct collaboration_request_approved event
    const unsubscribeApproved = wsManager.on(
      "collaboration_request_approved",
      (data: any) => {
        if (data.session?.id === sessionId) {
          refetch();
          setAccessError(null);
        }
      }
    );

    return () => {
      unsubscribeNotification();
      unsubscribeApproved();
    };
  }, [user, sessionId, refetch]);

  // Join session when data is available
  useEffect(() => {
    if (sessionData && user && sessionId && !hasJoinedSession.current) {
      wsManager.joinSession(sessionId);
      hasJoinedSession.current = true;
    }
  }, [sessionData, user, sessionId]);

  // Process participants
  useEffect(() => {
    if (sessionData?.participants) {
      const participants = sessionData.participants.map((p: any) => ({
        ...p,
        username: p.username || `User ${p.userId}`,
        cursor: cursorPositions.get(p.userId) || p.cursor,
        color: generateUserColor(p.username || `User ${p.userId}`),
      }));
      setEnhancedParticipants(participants);
    }
  }, [sessionData, cursorPositions]);

  // Set initial active file
  useEffect(() => {
    if (sessionData?.files && sessionData.files.length > 0 && !activeFileId) {
      setActiveFileId(sessionData.files[0].id);
      setOpenFiles([sessionData.files[0]]);
    }
  }, [sessionData, activeFileId]);

  // Sync openFiles with sessionData.files to keep content in sync
  useEffect(() => {
    if (!sessionData?.files) return;
    
    setOpenFiles(prev => {
      // Update content of open files from session data while preserving local edits
      return prev.map(openFile => {
        const sessionFile = sessionData.files.find(f => f.id === openFile.id);
        if (sessionFile) {
          // Check if we have recent local changes for this file
          const localChange = lastLocalChangesRef.current.get(openFile.id);
          const hasRecentLocalChange = localChange && (Date.now() - localChange.timestamp < 2000);
          
          // If no recent local change, use session data
          if (!hasRecentLocalChange) {
            return { ...openFile, name: sessionFile.name, content: sessionFile.content };
          }
        }
        return openFile;
      }).filter(f => sessionData.files.some(sf => sf.id === f.id)); // Remove files that no longer exist
    });
  }, [sessionData?.files]);

  // WebSocket event handlers
  useEffect(() => {
    const onCodeChange = (data: any) => {
      const { fileId, content, userId } = data;

      // Ignore our own changes
      if (userId === user?.id) return;

      // Ignore if fileId is missing
      if (!fileId) {
        console.warn("Received code_change without fileId");
        return;
      }

      // Check if this is our own change echoed back (compare per-file)
      const lastLocalChange = lastLocalChangesRef.current.get(fileId);
      if (lastLocalChange && lastLocalChange.content === content) {
        // This is our own change echoed back, skip it
        return;
      }

      // Mark this file as processing remote update
      processingRemoteRef.current.add(fileId);

      // Update the specific file content
      setOpenFiles(prev => {
        // Only update the file with matching fileId
        const updated = prev.map(file => {
          if (file.id === fileId) {
            // Increment version for this file
            const currentVersion = fileVersionsRef.current.get(fileId) || 0;
            fileVersionsRef.current.set(fileId, currentVersion + 1);
            return { ...file, content };
          }
          return file;
        });
        return updated;
      });

      // Also update in sessionData cache if file exists there but not in openFiles
      if (sessionData?.files) {
        const fileInSession = sessionData.files.find(f => f.id === fileId);
        if (fileInSession) {
          // Update the file in the query cache
          queryClient.setQueryData(
            queryKeys.sessions.detail(sessionId!),
            (old: any) => {
              if (!old) return old;
              return {
                ...old,
                files: old.files.map((f: any) =>
                  f.id === fileId ? { ...f, content } : f
                ),
              };
            }
          );
        }
      }

      // Clear remote processing flag after a short delay
      setTimeout(() => {
        processingRemoteRef.current.delete(fileId);
      }, 100);
    };

    const onCursorUpdate = (data: any) => {
      if (data.userId !== user?.id) {
        setCursorPositions(prev => {
          const newMap = new Map(prev);
          newMap.set(data.userId, data.cursor);
          return newMap;
        });
      }
    };

    const onParticipantsUpdate = (data: any) => {
      if (sessionData) {
        const participants = data.participants.map((p: any) => ({
          ...p,
          username: p.username || `User ${p.userId}`,
          cursor: cursorPositions.get(p.userId) || p.cursor,
          color: generateUserColor(p.username || `User ${p.userId}`),
          isActive: p.isActive ?? true, // Default to active
        }));
        setEnhancedParticipants(participants);
      }
    };

    const onFileCreated = (data: any) => {
      // Initialize version for new file
      if (data.file?.id) {
        fileVersionsRef.current.set(data.file.id, 0);
      }
      refetch();
    };

    const onFileUpdated = (data: any) => {
      // Handle file metadata updates (not content changes)
      if (data.file) {
        setOpenFiles(prev =>
          prev.map(f =>
            f.id === data.file.id ? { ...f, name: data.file.name } : f
          )
        );
      }
      refetch();
    };

    const onFileDeleted = (data: any) => {
      // Clean up version tracking
      if (data.fileId) {
        fileVersionsRef.current.delete(data.fileId);
        lastLocalChangesRef.current.delete(data.fileId);
        processingRemoteRef.current.delete(data.fileId);
      }

      setOpenFiles(prev => prev.filter(f => f.id !== data.fileId));
      if (activeFileId === data.fileId && openFiles.length > 1) {
        const newActiveFile = openFiles.find(f => f.id !== data.fileId);
        if (newActiveFile) setActiveFileId(newActiveFile.id);
      }
      refetch();
    };

    const unsubscribers = [
      wsManager.on("code_change", onCodeChange),
      wsManager.on("cursor_update", onCursorUpdate),
      wsManager.on("participants_update", onParticipantsUpdate),
      wsManager.on("file_created", onFileCreated),
      wsManager.on("folder_created", onFileCreated),
      wsManager.on("file_updated", onFileUpdated),
      wsManager.on("file_deleted", onFileDeleted),
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, [
    sessionData,
    activeFileId,
    openFiles,
    cursorPositions,
    refetch,
    user?.id,
  ]);

  // File selection handlers
  const handleFileSelect = useCallback(
    (fileId: string) => {
      setActiveFileId(fileId);
      if (!openFiles.some(f => f.id === fileId) && sessionData) {
        const file = sessionData.files.find(f => f.id === fileId);
        if (file) setOpenFiles(prev => [...prev, file]);
      }
    },
    [openFiles, sessionData]
  );

  const handleSelectFileTab = useCallback((fileId: string) => {
    setActiveFileId(fileId);
  }, []);

  const handleCloseFileTab = useCallback(
    (fileId: string) => {
      setOpenFiles(prev => prev.filter(f => f.id !== fileId));
      if (activeFileId === fileId && openFiles.length > 1) {
        const newActiveFile = openFiles.find(f => f.id !== fileId);
        if (newActiveFile) setActiveFileId(newActiveFile.id);
      }
    },
    [activeFileId, openFiles]
  );

  // Code change handler - debounced to prevent flooding
  const debouncedSendChange = useCallback(
    debounce((fileId: string, content: string) => {
      wsManager.sendCodeChange(fileId, content);
    }, 100),
    []
  );

  const handleCodeChange = useCallback(
    (content: string, incomingFileId?: string) => {
      // Use the provided fileId or fall back to activeFileId
      const targetFileId = incomingFileId || activeFileId;

      if (!targetFileId) {
        console.warn("handleCodeChange called without fileId");
        return;
      }

      // Skip if this file is currently processing a remote change
      if (processingRemoteRef.current.has(targetFileId)) {
        return;
      }

      // Verify the file exists in openFiles before updating
      const fileExists = openFiles.some(f => f.id === targetFileId);
      if (!fileExists) {
        console.warn(
          `File ${targetFileId} not found in openFiles, skipping update`
        );
        return;
      }

      // Track this as our local change for this specific file
      lastLocalChangesRef.current.set(targetFileId, {
        content,
        timestamp: Date.now(),
      });

      // Increment local version
      const currentVersion = fileVersionsRef.current.get(targetFileId) || 0;
      fileVersionsRef.current.set(targetFileId, currentVersion + 1);

      // Update local state immediately for responsive feel
      setOpenFiles(prev =>
        prev.map(file =>
          file.id === targetFileId ? { ...file, content } : file
        )
      );

      // Send to server with debouncing
      debouncedSendChange(targetFileId, content);

      // Clean up old local change tracking after a delay
      setTimeout(() => {
        const change = lastLocalChangesRef.current.get(targetFileId);
        if (change && Date.now() - change.timestamp > 5000) {
          lastLocalChangesRef.current.delete(targetFileId);
        }
      }, 5000);
    },
    [activeFileId, openFiles, debouncedSendChange]
  );

  // Language change handler
  const handleLanguageChange = useCallback(
    async (language: string) => {
      if (!sessionData) return;
      try {
        await apiRequest("PATCH", `/api/sessions/${sessionData.session.id}`, {
          language,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.detail(sessionData.session.id),
        });
        toast({
          title: "Language changed",
          description: `Language set to ${language}`,
        });
      } catch {
        toast({
          title: "Failed to change language",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    },
    [sessionData, toast]
  );

  // Code execution
  const handleExecute = useCallback((result: ExecutionResult) => {
    setExecutionResult(result);
    setIsRunning(false);
    setShowCollaborationPanel(true);
  }, []);

  const runCode = useCallback(async () => {
    if (!activeFileId || !sessionData) return;
    setIsRunning(true);
    try {
      const activeFile = openFiles.find(f => f.id === activeFileId);
      if (!activeFile) return;
      const response = await apiRequest("POST", "/api/execute", {
        code: activeFile.content,
        language: sessionData.session.language,
      });
      const result = await response.json();
      handleExecute(result);
    } catch {
      toast({
        title: "Execution failed",
        description: "Failed to execute code.",
        variant: "destructive",
      });
      setIsRunning(false);
    }
  }, [activeFileId, sessionData, openFiles, handleExecute, toast]);

  // Collaboration request
  const sendCollaborationRequest = useCallback(() => {
    if (accessError?.sessionId) {
      createCollaborationRequest.mutate(accessError.sessionId);
    }
  }, [accessError, createCollaborationRequest]);

  const activeFile = openFiles.find(f => f.id === activeFileId) || openFiles[0];

  return {
    // State
    sessionId,
    sessionData,
    isLoading,
    error,
    accessError,
    activeFile,
    activeFileId,
    openFiles,
    showSidebar,
    showCollaborationPanel,
    executionResult,
    isRunning,
    enhancedParticipants,

    // Actions
    setShowSidebar,
    setShowCollaborationPanel,
    handleFileSelect,
    handleSelectFileTab,
    handleCloseFileTab,
    handleCodeChange,
    handleLanguageChange,
    handleExecute,
    runCode,
    sendCollaborationRequest,
    refetch,
  };
}
