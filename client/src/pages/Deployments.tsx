import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Layers, Clock, CheckCircle, XCircle, Loader2, User, Settings as SettingsIcon, LogOut } from "lucide-react";
import { usePipeline } from "@/hooks/use-pipeline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function Deployments() {
  const { data: pipelineData, isLoading } = usePipeline();
  const [location] = useLocation();
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-emerald-500/20 bg-emerald-500/10";
      case "failed":
        return "border-red-500/20 bg-red-500/10";
      case "running":
        return "border-blue-500/20 bg-blue-500/10";
      default:
        return "border-white/10 bg-white/5";
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                FlowOps
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className={location === "/" ? "text-foreground hover:text-primary transition-colors" : "hover:text-primary transition-colors"}>
              Overview
            </Link>
            <Link href="/deployments" className={location === "/deployments" ? "text-foreground hover:text-primary transition-colors" : "hover:text-primary transition-colors"}>
              Deployments
            </Link>
            <Link href="/settings" className={location === "/settings" ? "text-foreground hover:text-primary transition-colors" : "hover:text-primary transition-colors"}>
              Settings
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent">
                  <span className="text-xs text-white font-medium">JD</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-white/10">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 focus:text-red-500"
                  onClick={() => {
                    toast({
                      title: "Logged out",
                      description: "You have been successfully logged out.",
                    });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header className="py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold font-display text-white mb-2">
              Deployment History
            </h1>
            <p className="text-muted-foreground">
              View and manage your deployment pipeline runs
            </p>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : pipelineData ? (
          <div className="space-y-4">
            <div className={`glass-panel rounded-2xl p-6 border-2 ${getStatusColor(pipelineData.run.status)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(pipelineData.run.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Deployment #{pipelineData.run.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="capitalize">{pipelineData.run.status}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Run</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                {pipelineData.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(step.status)}
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                    {step.duration !== null && (
                      <span className="text-xs text-muted-foreground">
                        {step.duration}s
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center py-8 text-muted-foreground">
              <p>More deployment history will appear here as runs complete.</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No deployments found.</p>
          </div>
        )}
      </main>
    </div>
  );
}

