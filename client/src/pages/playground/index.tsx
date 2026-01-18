import { SessionControls } from "@/components/layout/session-controls";
import { MonacoEditor } from "@/components/editor/monaco-editor";
import { FileExplorer } from "@/components/editor/file-explorer";
import { CollaborationPanel } from "@/components/editor/collaboration-panel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  AuthRequiredView,
  CollaborationRequiredView,
  ErrorView,
  LoadingView,
  FileTabs,
  MobileControls,
} from "./components";
import { usePlayground } from "./use-playground";

export default function PlaygroundPage() {
  const {
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
  } = usePlayground();

  const navigateToDashboard = () => {
    window.location.href = "/";
  };

  // Loading state
  if (isLoading) {
    return <LoadingView />;
  }

  // Auth required
  if (accessError?.requiresAuth) {
    return <AuthRequiredView onReturn={navigateToDashboard} />;
  }

  // Collaboration required
  if (accessError?.requiresRequest) {
    return (
      <CollaborationRequiredView
        onRequestAccess={sendCollaborationRequest}
        onReturn={navigateToDashboard}
      />
    );
  }

  // Error state
  if (error || !sessionData) {
    return (
      <ErrorView
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        }
        onReturn={navigateToDashboard}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-violet-950/10 overflow-hidden">
      {/* Session Controls */}
      <SessionControls
        sessionId={sessionData.session.id}
        sessionName={sessionData.session.name}
        language={sessionData.session.language}
        onLanguageChange={handleLanguageChange}
        activeFile={activeFile}
        onExecute={handleExecute}
        isRunning={isRunning}
      />

      {/* Main Workspace with Resizable Panels */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Sidebar (File Explorer) */}
          <ResizablePanel
            defaultSize={15}
            minSize={10}
            maxSize={30}
            className={`bg-gradient-to-b from-card/50 to-card/30 backdrop-blur-sm border-r border-white/5 overflow-auto ${
              showSidebar ? "block" : "hidden"
            } md:block`}
          >
            <FileExplorer
              files={sessionData.files}
              activeFileId={activeFileId || ""}
              sessionId={sessionData.session.id}
              onFileSelect={handleFileSelect}
              onFileUpdated={() => refetch()}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Editor Panel */}
          <ResizablePanel
            defaultSize={showCollaborationPanel ? 60 : 85}
            minSize={30}
          >
            <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm overflow-hidden">
              {/* File tabs */}
              <FileTabs
                files={openFiles}
                activeFileId={activeFileId}
                onSelect={handleSelectFileTab}
                onClose={handleCloseFileTab}
              />

              {/* Code editor - flex-1 ensures it takes remaining height */}
              <div className="flex-1 min-h-0 relative overflow-hidden rounded-tl-2xl border-l border-t border-white/5 bg-[#1a1a2e]">
                {activeFile ? (
                  <MonacoEditor
                    key={activeFile.id}
                    value={activeFile.content}
                    language={sessionData.session.language}
                    fileId={activeFile.id}
                    onChange={handleCodeChange}
                    participants={enhancedParticipants}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center mb-4">
                      <i className="ri-file-code-line text-3xl text-violet-400"></i>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      No file selected
                    </p>
                    <p className="text-muted-foreground/50 text-xs mt-1">
                      Create or select a file to start coding
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          {/* Collaboration Panel */}
          {showCollaborationPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
                <CollaborationPanel
                  sessionId={sessionData.session.id}
                  participants={enhancedParticipants}
                  executionResult={executionResult}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Mobile controls */}
      <MobileControls
        showSidebar={showSidebar}
        showCollaborationPanel={showCollaborationPanel}
        isRunning={isRunning}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleCollaborationPanel={() =>
          setShowCollaborationPanel(!showCollaborationPanel)
        }
        onRunCode={runCode}
      />
    </div>
  );
}
