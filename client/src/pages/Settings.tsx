import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Layers, Bell, Shield, Database, GitBranch, User, Settings as SettingsIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [location] = useLocation();
  const { toast } = useToast();

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
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your FlowOps configuration and preferences
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure deployment and pipeline notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email notifications</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Slack integration</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-5 h-5 text-primary" />
                <CardTitle>Repository</CardTitle>
              </div>
              <CardDescription>
                Manage connected repositories and branches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Main branch</span>
                <code className="text-xs bg-white/10 px-2 py-1 rounded">main</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-deploy</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>
                Security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API keys</span>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-factor authentication</span>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-primary" />
                <CardTitle>Data & Storage</CardTitle>
              </div>
              <CardDescription>
                Database and storage configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Log retention</span>
                <span className="text-xs text-muted-foreground">30 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup frequency</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

