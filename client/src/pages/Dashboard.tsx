import { motion } from "framer-motion";
import { GitBranch, Box, Activity, Layers, Server, User, Settings as SettingsIcon, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { usePipeline, useMetrics, useLogs } from "@/hooks/use-pipeline";
import { PipelineVisualizer } from "@/components/PipelineVisualizer";
import { MetricCard } from "@/components/MetricCard";
import { LogViewer } from "@/components/LogViewer";
import { DeploymentFrequencyChart, LatencyChart } from "@/components/Charts";
import { getPipelineEngine } from "@/data/pipelineEngine";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const { data: pipelineData, isLoading: isPipelineLoading } = usePipeline();
  const { data: metricsData, isLoading: isMetricsLoading } = useMetrics();
  const { data: logsData } = useLogs();
  const [location] = useLocation();
  const { toast } = useToast();

  const handleTriggerDeploy = () => {
    const engine = getPipelineEngine();
    engine.triggerDeployment();
    toast({
      title: "Deployment-Triggered",
      description: "A new deployment pipeline has been started.",
    });
    // Scroll to top to see the new deployment
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewHistory = () => {
    // Scroll to the logs section
    const logsSection = document.querySelector('[data-section="logs"]');
    if (logsSection) {
      logsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fallback: scroll to bottom where logs typically are
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              FlowOps
            </span>
          </div>
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
        {/* Header Section */}
        <header className="py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold font-display text-white mb-2">
                Production Pipeline
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Branch: <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-primary">main</code>
                <span className="w-1 h-1 rounded-full bg-white/20 mx-2" />
                Latest commit: <span className="text-foreground/80">3f8a12b</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleViewHistory}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                View History
              </button>
              <button 
                onClick={handleTriggerDeploy}
                className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Trigger Deploy
              </button>
            </div>
          </motion.div>
        </header>

        {/* Pipeline Visualization */}
        <section className="glass-panel rounded-2xl p-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {isPipelineLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <PipelineVisualizer steps={pipelineData?.steps || []} />
          )}
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isMetricsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
            ))
          ) : (
            metricsData?.map((metric, idx) => (
              <MetricCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                trend={metric.trend || undefined}
                description={metric.description}
                delay={idx * 0.1}
              />
            ))
          )}
        </section>

        {/* Charts & Logs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Left Column: Charts */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Deployment Success Rate
                </h3>
                <select className="bg-black/20 border border-white/10 rounded-md text-xs px-2 py-1 outline-none focus:border-primary/50">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <DeploymentFrequencyChart />
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-500" />
                  System Latency (ms)
                </h3>
              </div>
              <LatencyChart />
            </div>
          </div>

          {/* Right Column: Logs */}
          <div className="lg:col-span-1" data-section="logs">
            <div className="sticky top-24">
               <LogViewer logs={logsData || []} />
               
               {/* Context Card */}
               <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                 <h4 className="font-semibold text-indigo-400 mb-2 flex items-center gap-2">
                   <Box className="w-4 h-4" />
                   About FlowOps
                 </h4>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   This dashboard simulates a live DevOps environment. The pipeline steps update in real-time, logs stream in from the backend, and metrics reflect system health. 
                   <br/><br/>
                   Build using React, Tailwind, Framer Motion, and Recharts.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
