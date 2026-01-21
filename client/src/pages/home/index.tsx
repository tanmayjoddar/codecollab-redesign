import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  Flame,
  TrendingUp,
  Users,
  Code2,
  FolderOpen,
  Search,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useSessions,
  useCreateSession,
  useDeleteSession,
  useCollaborationSessions,
} from "@/hooks/use-sessions";
import { wsManager } from "@/lib/websocket";
import {
  ProjectCard,
  CreateProjectCard,
  CreateProjectDialog,
  ShareDialog,
  DeleteConfirmationDialog,
} from "./components";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

// Animated stat card for dashboard
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className="glass-card p-5 rounded-2xl group hover:border-white/20 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Empty state component
function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <motion.div
      className="col-span-full mt-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 mesh-gradient opacity-30" />

        <div className="relative z-10">
          <motion.div
            className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <FolderOpen className="w-12 h-12 text-violet-400" />
          </motion.div>

          <h3 className="text-2xl font-bold text-foreground mb-3">
            No projects yet
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create your first coding project to start collaborating with
            developers around the world.
          </p>

          <Button
            onClick={onCreateClick}
            className="btn-gradient text-white h-12 px-8 text-base font-medium group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Create Your First Project
            <Flame className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Section header component
function SectionHeader({
  title,
  count,
  icon: Icon,
}: {
  title: string;
  count?: number;
  icon: React.ElementType;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-violet-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {count !== undefined && (
          <p className="text-sm text-muted-foreground">
            {count} {count === 1 ? "project" : "projects"}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Session state
  const [newSessionId, setNewSessionId] = useState<string | null>(null);
  const [sharingUrl, setSharingUrl] = useState("");
  const [sessionIdToDelete, setSessionIdToDelete] = useState<string | null>(
    null
  );

  // Queries and mutations
  const { data: sessions, isLoading } = useSessions(true);
  const { data: collaborationSessions } = useCollaborationSessions();
  const createSessionMutation = useCreateSession();
  const deleteSessionMutation = useDeleteSession();

  // Connect to WebSocket when the page loads
  useEffect(() => {
    wsManager.connect();
    if (user) {
      wsManager.setUser(user);
    }
  }, [user]);

  const handleCreateSession = (data: {
    name: string;
    isPublic: boolean;
    language: string;
  }) => {
    createSessionMutation.mutate(data, {
      onSuccess: response => {
        setNewSessionId(response.session.id);
        const url = `${window.location.origin}/playground/${response.session.id}`;
        setSharingUrl(url);
        setIsCreateDialogOpen(false);

        if (data.isPublic) {
          setIsShareDialogOpen(true);
        } else {
          navigate(`/playground/${response.session.id}`);
        }
      },
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessionIdToDelete(sessionId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sessionIdToDelete) {
      deleteSessionMutation.mutate(sessionIdToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSessionIdToDelete(null);
        },
      });
    }
  };

  const handleNavigateToProject = () => {
    setIsShareDialogOpen(false);
    if (newSessionId) {
      navigate(`/playground/${newSessionId}`);
    }
  };

  // Filter sessions based on search query
  const filteredSessions = sessions?.filter(
    session =>
      session.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCollabSessions = collaborationSessions?.filter(
    session =>
      session.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Background effects */}
      <div className="fixed inset-0 mesh-gradient opacity-30 pointer-events-none" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Welcome section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Welcome back,{" "}
              <span className="gradient-text">{user?.username}</span>
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your projects today.
            </p>
          </motion.div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Code2}
              label="Your Projects"
              value={sessions?.length || 0}
              color="from-violet-600 to-purple-600"
              delay={0.1}
            />
            <StatCard
              icon={Users}
              label="Collaborations"
              value={collaborationSessions?.length || 0}
              color="from-cyan-600 to-blue-600"
              delay={0.2}
            />
            <StatCard
              icon={TrendingUp}
              label="Active Sessions"
              value={
                (sessions?.length || 0) + (collaborationSessions?.length || 0)
              }
              color="from-emerald-600 to-teal-600"
              delay={0.3}
            />
            <StatCard
              icon={Flame}
              label="This Week"
              value="+12%"
              color="from-amber-600 to-orange-600"
              delay={0.4}
            />
          </div>

          {/* Search and Create section */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="h-12 pl-12 input-modern w-full"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="btn-gradient text-white h-12 px-6 font-medium whitespace-nowrap group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              New Project
            </Button>
          </motion.div>

          {/* Loading state */}
          {isLoading ? (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
                <div className="absolute inset-0 h-12 w-12 rounded-full bg-violet-500/20 animate-ping" />
              </div>
              <p className="mt-4 text-muted-foreground">
                Loading your projects...
              </p>
            </motion.div>
          ) : sessions &&
            sessions.length === 0 &&
            (!collaborationSessions || collaborationSessions.length === 0) ? (
            <EmptyState onCreateClick={() => setIsCreateDialogOpen(true)} />
          ) : (
            <>
              {/* Your Projects Section */}
              <section className="mb-12">
                <SectionHeader
                  title="Your Projects"
                  count={filteredSessions?.length}
                  icon={Code2}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CreateProjectCard
                      onClick={() => setIsCreateDialogOpen(true)}
                    />
                  </motion.div>

                  <AnimatePresence mode="popLayout">
                    {filteredSessions?.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout
                      >
                        <ProjectCard
                          session={session}
                          onDelete={handleDeleteSession}
                          showDelete={true}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>

              {/* Collaboration Projects Section */}
              {filteredCollabSessions && filteredCollabSessions.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <SectionHeader
                    title="Collaboration Projects"
                    count={filteredCollabSessions.length}
                    icon={Users}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredCollabSessions.map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          layout
                        >
                          <ProjectCard session={session} showDelete={false} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              )}
            </>
          )}
        </div>
      </main>

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSession}
        isPending={createSessionMutation.isPending}
      />

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        sharingUrl={sharingUrl}
        onNavigate={handleNavigateToProject}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
