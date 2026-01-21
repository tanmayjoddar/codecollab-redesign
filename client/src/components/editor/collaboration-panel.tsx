import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { wsManager, ExecutionResult } from "@/lib/websocket";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  MessageCircle,
  Users,
  UserPlus,
  Send,
  Check,
  X,
  Flame,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  Circle,
} from "lucide-react";

type CollaborationPanelProps = {
  sessionId: string;
  participants: Array<{
    userId: string;
    username: string;
    isActive: boolean;
  }>;
  executionResult?: ExecutionResult;
};

type CollaborationRequest = {
  id: string;
  sessionId: string;
  fromUserId: string;
  status: string;
  createdAt: Date;
  username?: string;
};

type Message = {
  id: string;
  content: string;
  userId: string;
  username: string;
  createdAt: Date;
};

export function CollaborationPanel({
  sessionId,
  participants,
  executionResult,
}: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState("output");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch collaboration requests (only if current user is the session owner)
  const { data: sessionData } = useQuery<{
    session: { id: string; ownerId: string };
  }>({
    queryKey: ["/api/sessions", sessionId],
    enabled: !!user && !!sessionId,
  });

  const isSessionOwner = sessionData?.session.ownerId === user?.id;

  // Fetch collaboration requests
  const { data: allRequests = [], refetch: refetchRequests } = useQuery<
    CollaborationRequest[]
  >({
    queryKey: ["/api/sessions", sessionId, "collaboration-requests"],
    queryFn: async () => {
      const response = await apiRequest(
        "GET",
        `/api/sessions/${sessionId}/collaboration-requests`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch collaboration requests");
      }
      return response.json();
    },
    enabled: !!isSessionOwner && !!sessionId,
  });

  // Filter to only show pending requests
  const collaborationRequests = allRequests.filter(
    req => req.status === "pending"
  );

  // Listen for new collaboration requests via WebSocket
  useEffect(() => {
    if (!isSessionOwner || !sessionId) return;

    // Listen for collaboration request notifications (new requests and updates)
    const unsubscribeNotification = wsManager.on(
      "notification",
      (data: any) => {
        const notification = data.notification;
        const notificationSessionId = notification?.data?.sessionId;

        if (notificationSessionId === sessionId) {
          // Refetch requests when:
          // 1. A new collaboration request arrives
          // 2. A request is accepted/rejected (to remove it from pending list)
          if (
            notification?.type === "collaboration_request" ||
            notification?.type === "request_accepted" ||
            notification?.type === "request_rejected"
          ) {
            refetchRequests();
          }
        }
      }
    );

    // Also listen for direct collaboration_request_sent event (if server sends it)
    const unsubscribeRequest = wsManager.on("new_collaboration_request", () => {
      refetchRequests();
    });

    return () => {
      unsubscribeNotification();
      unsubscribeRequest();
    };
  }, [isSessionOwner, sessionId, refetchRequests]);

  // Handle request response (accept/reject)
  const handleRequestResponse = async (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      const response = await apiRequest(
        "PATCH",
        `/api/collaboration-requests/${requestId}`,
        { status }
      );

      if (response.ok) {
        toast({
          title: `Request ${status}`,
          description: `The collaboration request has been ${status}.`,
        });

        // Refetch the collaboration requests to remove accepted/rejected ones
        await refetchRequests();
      }
    } catch (error) {
      toast({
        title: "Failed to respond to request",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && activeTab === "chat") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // Auto-scroll output when execution results change
  useEffect(() => {
    if (outputEndRef.current && activeTab === "output" && executionResult) {
      outputEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [executionResult, activeTab]);

  // Subscribe to chat messages from websocket
  useEffect(() => {
    const unsubscribe = wsManager.on("chat_message", data => {
      const sender = participants.find(p => p.userId === data.message.userId);
      if (sender) {
        setMessages(prev => [
          ...prev,
          {
            ...data.message,
            username: sender.username,
            createdAt: new Date(data.message.createdAt),
          },
        ]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [participants]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    wsManager.sendChatMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate gradient colors based on username
  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-violet-500 to-purple-500",
      "from-cyan-500 to-blue-500",
      "from-emerald-500 to-teal-500",
      "from-rose-500 to-pink-500",
      "from-amber-500 to-orange-500",
      "from-indigo-500 to-violet-500",
      "from-fuchsia-500 to-pink-500",
    ];
    const hash = Array.from(name).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    return gradients[hash % gradients.length];
  };

  return (
    <div className="h-full bg-gradient-to-b from-background to-background/95 border-l border-white/5 flex flex-col overflow-hidden backdrop-blur-xl">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        {/* Modern Tab Navigation */}
        <TabsList className="flex p-1.5 mx-3 mt-3 bg-white/5 rounded-xl border border-white/5">
          <TabsTrigger
            value="output"
            className="flex-1 py-2 px-3 text-xs font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border data-[state=active]:border-emerald-500/30 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground transition-all duration-200"
          >
            <Terminal className="w-3.5 h-3.5 mr-1.5" />
            Output
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="flex-1 py-2 px-3 text-xs font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-violet-400 data-[state=active]:border data-[state=active]:border-violet-500/30 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground transition-all duration-200"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="people"
            className="flex-1 py-2 px-3 text-xs font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border data-[state=active]:border-cyan-500/30 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground transition-all duration-200"
          >
            <Users className="w-3.5 h-3.5 mr-1.5" />
            People
          </TabsTrigger>
          {isSessionOwner && (
            <TabsTrigger
              value="requests"
              className="flex-1 py-2 px-3 text-xs font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-400 data-[state=active]:border data-[state=active]:border-amber-500/30 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground transition-all duration-200 relative"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Requests
              {collaborationRequests.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold shadow-lg shadow-rose-500/30"
                >
                  {collaborationRequests.length}
                </motion.span>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Output Tab - Terminal Style */}
        <TabsContent
          value="output"
          className="flex-1 overflow-auto m-3 rounded-xl bg-black/40 border border-white/5 font-mono text-sm"
        >
          <div className="p-4">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] text-muted-foreground ml-2">
                output
              </span>
              {executionResult && (
                <Badge
                  variant="outline"
                  className={`ml-auto text-[10px] ${executionResult.error ? "border-red-500/30 text-red-400" : "border-emerald-500/30 text-emerald-400"}`}
                >
                  {executionResult.error ? "Error" : "Success"}
                </Badge>
              )}
            </div>

            {executionResult ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {executionResult.logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="text-muted-foreground whitespace-pre-wrap mb-1 flex items-start gap-2"
                    >
                      <span className="text-cyan-500/50 select-none">›</span>
                      {log}
                    </motion.div>
                  ))}

                  {executionResult.error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 whitespace-pre-wrap"
                    >
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold">
                        <XCircle className="w-4 h-4" />
                        Error
                      </div>
                      {executionResult.error}
                    </motion.div>
                  )}

                  {!executionResult.error && executionResult.output && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 whitespace-pre-wrap"
                    >
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Output
                      </div>
                      {executionResult.output}
                    </motion.div>
                  )}

                  <div ref={outputEndRef} />
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Run your code to see output
                </p>
                <p className="text-muted-foreground/50 text-xs mt-1">
                  Press Ctrl+Enter or click Run
                </p>
              </motion.div>
            )}
          </div>
        </TabsContent>

        {/* Chat Tab - Modern Messenger Style */}
        <TabsContent
          value="chat"
          className="flex-1 flex flex-col overflow-hidden mx-3 mb-3 rounded-xl bg-black/20 border border-white/5"
        >
          <div className="flex-1 overflow-auto p-4">
            {messages.length > 0 ? (
              <AnimatePresence>
                {messages.map((message, index) => {
                  const isCurrentUser = user?.id === message.userId;
                  const gradient = getAvatarGradient(message.username);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`mb-4 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isCurrentUser && (
                        <div
                          className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-[10px] text-white font-bold mr-2 flex-shrink-0 shadow-lg`}
                        >
                          {getInitials(message.username)}
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] ${
                          isCurrentUser
                            ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-2xl rounded-br-md shadow-lg shadow-violet-500/20"
                            : "bg-white/5 border border-white/10 text-foreground rounded-2xl rounded-bl-md"
                        } px-4 py-2.5`}
                      >
                        {!isCurrentUser && (
                          <div className="text-[10px] text-violet-400 font-medium mb-1">
                            {message.username}
                          </div>
                        )}
                        <div className="text-sm leading-relaxed">
                          {message.content}
                        </div>
                        <div
                          className={`text-[10px] mt-1.5 ${isCurrentUser ? "text-white/60" : "text-muted-foreground"}`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-violet-400" />
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  No messages yet
                </p>
                <p className="text-muted-foreground/50 text-xs mt-1">
                  Start the conversation!
                </p>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Modern Chat Input */}
          <div className="p-3 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-1.5 focus-within:border-violet-500/30 transition-colors">
              <Input
                className="flex-1 bg-transparent border-0 text-sm h-9 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="sm"
                className="h-9 w-9 p-0 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/25 disabled:opacity-50"
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* People Tab - Modern Social Style */}
        <TabsContent
          value="people"
          className="flex-1 overflow-auto mx-3 mb-3 rounded-xl bg-black/20 border border-white/5 p-4"
        >
          {/* Active Collaborators */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Online Now
              </h3>
              <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                {participants.filter(p => p.isActive).length}
              </span>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {participants
                  .filter(p => p.isActive)
                  .map((participant, index) => {
                    const gradient = getAvatarGradient(participant.username);
                    const isYou = participant.userId === user?.id;

                    return (
                      <motion.div
                        key={participant.userId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center p-3 rounded-xl ${isYou ? "bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20" : "bg-white/5 border border-white/5 hover:border-white/10"} transition-all duration-200 cursor-pointer group`}
                      >
                        <div className="relative">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xs text-white font-bold shadow-lg`}
                          >
                            {getInitials(participant.username)}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-background" />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {participant.username}
                            </span>
                            {isYou && (
                              <Badge className="text-[10px] px-1.5 py-0 h-4 bg-violet-500/20 text-violet-400 border-violet-500/30">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                            <Flame className="w-3 h-3" />
                            Active now
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>

              {participants.filter(p => p.isActive).length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">No one online</p>
                </div>
              )}
            </div>
          </div>

          {/* Offline Participants */}
          {participants.some(p => !p.isActive) && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Circle className="w-2 h-2 text-muted-foreground" />
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Offline
                </h3>
              </div>

              <div className="space-y-2">
                {participants
                  .filter(p => !p.isActive)
                  .map(participant => {
                    const gradient = getAvatarGradient(participant.username);

                    return (
                      <div
                        key={participant.userId}
                        className="flex items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 opacity-60"
                      >
                        <div className="relative">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xs text-white font-bold opacity-50`}
                          >
                            {getInitials(participant.username)}
                          </div>
                        </div>
                        <div className="ml-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            {participant.username}
                          </span>
                          <p className="text-xs text-muted-foreground/50 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Offline
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Requests Tab - Modern Card Style */}
        {isSessionOwner && (
          <TabsContent
            value="requests"
            className="flex-1 overflow-auto mx-3 mb-3 rounded-xl bg-black/20 border border-white/5 p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Pending Requests
              </h3>
            </div>

            {collaborationRequests.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {collaborationRequests.map((request, index) => {
                    const gradient = getAvatarGradient(
                      request.username || `User ${request.fromUserId}`
                    );

                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20"
                      >
                        <div className="flex items-center mb-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xs text-white font-bold shadow-lg`}
                          >
                            {getInitials(
                              request.username || `User ${request.fromUserId}`
                            )}
                          </div>
                          <div className="ml-3 flex-1">
                            <span className="text-sm font-medium text-foreground">
                              {request.username || `User ${request.fromUserId}`}
                            </span>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                            Pending
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 h-9 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/25"
                            onClick={() =>
                              handleRequestResponse(request.id, "accepted")
                            }
                          >
                            <Check className="w-4 h-4 mr-1.5" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-9 border-white/10 hover:bg-white/5 hover:border-white/20"
                            onClick={() =>
                              handleRequestResponse(request.id, "rejected")
                            }
                          >
                            <X className="w-4 h-4 mr-1.5" />
                            Decline
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center mb-4">
                  <UserPlus className="w-8 h-8 text-amber-400" />
                </div>
                <p className="text-muted-foreground text-sm">
                  No pending requests
                </p>
                <p className="text-muted-foreground/50 text-xs mt-1">
                  Requests will appear here
                </p>
              </motion.div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
