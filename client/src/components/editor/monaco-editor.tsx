import { useEffect, useRef, useState, useCallback } from "react";
import * as monaco from "monaco-editor";
import { Loader2 } from "lucide-react";
import { wsManager, type CursorPosition } from "@/lib/websocket";

// Configure Monaco Editor for Vite
const configureMonaco = () => {
  // Disable Monaco's built-in workers to avoid module resolution issues
  self.MonacoEnvironment = {
    getWorker: function (moduleId, label) {
      // Return a dummy worker to avoid the moduleIdToUrl issue
      return new Promise(() => {
        // This prevents the error but disables language services
      });
    },
  };
};

// Load the Monaco Editor assets dynamically
const loadMonacoScripts = async () => {
  // Configure Monaco before loading
  configureMonaco();

  // Load only basic editor functionality to avoid worker issues
  await import("monaco-editor/esm/vs/editor/editor.api.js");

  // Load basic language support without TypeScript services
  await import(
    "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution"
  );
  await import(
    "monaco-editor/esm/vs/basic-languages/python/python.contribution"
  );
  await import("monaco-editor/esm/vs/basic-languages/java/java.contribution");
  await import("monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution");
  await import("monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution");
};

type MonacoEditorProps = {
  value: string;
  language: string;
  fileId: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  participants?: Array<{
    id: string;
    userId: string;
    username: string;
    cursor: CursorPosition | null;
    color: string;
  }>;
};

// Map language IDs to Monaco language IDs
const languageMap: Record<string, string> = {
  javascript: "javascript",
  typescript: "javascript", // Use JavaScript mode for TypeScript to avoid worker issues
  python: "python",
  java: "java",
  cpp: "cpp",
  ruby: "ruby",
};

// Generate a color based on username
const generateUserColor = (username: string) => {
  const colors = [
    "#4F46E5", // Indigo
    "#10B981", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
  ];

  const hash = Array.from(username).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );

  return colors[hash % colors.length];
};

export function MonacoEditor({
  value,
  language,
  fileId,
  readOnly = false,
  onChange,
  participants = [],
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track if we're applying a remote change to avoid triggering onChange
  const isApplyingRemoteChange = useRef(false);
  // Track the last value we set to avoid duplicate updates
  const lastSetValueRef = useRef<string>("");
  // Track if user is actively typing
  const isUserTypingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize Monaco editor
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await loadMonacoScripts();

        if (!mounted || !containerRef.current) return;

        const monacoLanguage = languageMap[language] || "javascript";

        // Create the editor with modern styling
        const editor = monaco.editor.create(containerRef.current, {
          value,
          language: monacoLanguage,
          theme: "vs-dark",
          automaticLayout: true,
          minimap: {
            enabled: true,
            scale: 0.75,
            showSlider: "mouseover",
            renderCharacters: false,
          },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          lineNumbers: "on",
          readOnly,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          lineHeight: 24,
          letterSpacing: 0.5,
          renderLineHighlight: "all",
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
            highlightActiveIndentation: true,
          },
          scrollbar: {
            vertical: "visible",
            horizontal: "auto",
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            useShadows: false,
          },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: false,
          // Disable features that might trigger worker loading
          quickSuggestions: false,
          parameterHints: { enabled: false },
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: "off",
        });

        editorRef.current = editor;
        setIsLoading(false);

        // Handle content changes - only trigger onChange for user edits
        editor.onDidChangeModelContent(e => {
          // Skip if we're applying a remote change
          if (isApplyingRemoteChange.current) return;

          // Mark user as typing
          isUserTypingRef.current = true;
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            isUserTypingRef.current = false;
          }, 500);

          if (onChange && !readOnly) {
            const newValue = editor.getValue();
            lastSetValueRef.current = newValue;
            onChange(newValue);
          }
        });

        // Handle cursor position changes
        editor.onDidChangeCursorPosition(e => {
          if (!readOnly && !isApplyingRemoteChange.current) {
            const cursor: CursorPosition = {
              line: e.position.lineNumber,
              column: e.position.column,
              fileId,
            };
            wsManager.updateCursor(cursor);
          }
        });

        // Cleanup
        return () => {
          editor.dispose();
        };
      } catch (error) {
        console.error("Failed to initialize Monaco Editor:", error);
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Update editor value when prop changes (remote changes)
  useEffect(() => {
    if (!editorRef.current) return;

    const currentValue = editorRef.current.getValue();

    // Skip if the value is the same or if it's our own change
    if (value === currentValue || value === lastSetValueRef.current) {
      return;
    }

    // Don't interrupt user while they're actively typing
    // Instead, queue the update
    if (isUserTypingRef.current) {
      return;
    }

    // Mark as remote change to prevent triggering onChange
    isApplyingRemoteChange.current = true;

    // Save cursor position before update
    const selection = editorRef.current.getSelection();
    const scrollTop = editorRef.current.getScrollTop();

    // Apply the remote change using executeEdits for better undo support
    const model = editorRef.current.getModel();
    if (model) {
      const fullRange = model.getFullModelRange();
      editorRef.current.executeEdits("remote-sync", [
        {
          range: fullRange,
          text: value,
          forceMoveMarkers: true,
        },
      ]);
    }

    // Restore cursor position if possible
    if (selection) {
      // Clamp the cursor position to valid range
      const newModel = editorRef.current.getModel();
      if (newModel) {
        const lineCount = newModel.getLineCount();
        const newLine = Math.min(selection.startLineNumber, lineCount);
        const maxColumn = newModel.getLineMaxColumn(newLine);
        const newColumn = Math.min(selection.startColumn, maxColumn);

        editorRef.current.setSelection({
          startLineNumber: newLine,
          startColumn: newColumn,
          endLineNumber: newLine,
          endColumn: newColumn,
        });
      }
    }

    // Restore scroll position
    editorRef.current.setScrollTop(scrollTop);

    // Update last set value
    lastSetValueRef.current = value;

    // Reset flag after a short delay
    setTimeout(() => {
      isApplyingRemoteChange.current = false;
    }, 10);
  }, [value]);

  // Update editor language when prop changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const monacoLanguage = languageMap[language] || "javascript";
        monaco.editor.setModelLanguage(model, monacoLanguage);
      }
    }
  }, [language]);

  // Update cursor decorations when participants change
  useEffect(() => {
    if (!editorRef.current) return;

    // Clear previous decorations
    if (decorationsRef.current.length > 0) {
      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        []
      );
    }

    // Add cursor decorations for each participant
    const decorations = participants
      .filter(participant => participant.cursor?.fileId === fileId)
      .map(participant => {
        const { cursor, username, color } = participant;
        if (!cursor) return null;

        return {
          range: new monaco.Range(
            cursor.line,
            cursor.column,
            cursor.line,
            cursor.column + 1
          ),
          options: {
            className: `cursor-${username}`,
            hoverMessage: { value: username },
            beforeContentClassName: "relative",
            minimap: {
              color: color || generateUserColor(username),
              position: 1,
            },
            overviewRuler: {
              color: color || generateUserColor(username),
              position: 1,
            },
            glyphMarginClassName: "flex items-center justify-center",
            glyphMarginHoverMessage: { value: username },
            isWholeLine: false,
            inlineClassName: `relative border-l-2 border-${
              color || generateUserColor(username)
            }`,
          },
        };
      })
      .filter(Boolean) as monaco.editor.IModelDeltaDecoration[];

    // Apply the decorations
    if (decorations.length > 0) {
      decorationsRef.current = editorRef.current.deltaDecorations(
        [],
        decorations
      );
    }
  }, [participants, fileId]);

  return (
    <div className="h-full relative rounded-xl overflow-hidden border border-white/5 bg-[#1e1e1e]">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e1e1e] z-10 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <span className="text-sm text-muted-foreground">
            Loading editor...
          </span>
        </div>
      )}
      <div ref={containerRef} className="h-full" />

      {/* Visual cursor indicators for participants */}
      {participants
        .filter(
          participant =>
            participant.cursor?.fileId === fileId && editorRef.current
        )
        .map(participant => (
          <div
            key={participant.id}
            className="absolute pointer-events-none z-20"
            style={{
              left: "0", // Will be positioned by CSS
              top: "0", // Will be positioned by CSS
              opacity: editorRef.current ? 1 : 0,
            }}
          >
            {/* This is for visual reference - actual cursor positions are handled by Monaco decorations */}
          </div>
        ))}
    </div>
  );
}
