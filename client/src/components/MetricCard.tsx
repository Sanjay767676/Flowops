import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  description?: string | null;
  delay?: number;
}

export function MetricCard({ label, value, trend, description, delay = 0 }: MetricCardProps) {
  const isPositive = trend?.startsWith('+');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Activity className="w-24 h-24" />
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</h3>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-3xl font-bold font-display tracking-tight text-foreground">{value}</span>
          {trend && (
            <span className={cn(
              "flex items-center text-sm font-medium px-2 py-0.5 rounded-full bg-opacity-10",
              isPositive ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
            )}>
              {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {trend}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-2 text-xs text-muted-foreground/80 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors" />
    </motion.div>
  );
}
