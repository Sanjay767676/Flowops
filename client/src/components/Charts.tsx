// Real-time chart components
// In production, these would receive data via WebSocket or Server-Sent Events
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useChartData } from "@/hooks/use-pipeline";
import { useEffect, useState } from "react";

export function DeploymentFrequencyChart() {
  const chartData = useChartData();
  const [displayData, setDisplayData] = useState<Array<{ time: string; success: number; latency: number }>>([]);

  // Smoothly update chart data with animation
  useEffect(() => {
    if (chartData.length > 0) {
      setDisplayData([...chartData]);
    } else {
      // Initialize with empty data if no data yet
      setDisplayData([]);
    }
  }, [chartData]);

  // Ensure we have at least some data points for the chart
  const data = displayData.length > 0 ? displayData : [
    { time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), success: 0, latency: 0 }
  ];

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.3)" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[0, 100]}
            stroke="rgba(255,255,255,0.3)" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="success" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorSuccess)"
            animationDuration={300}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LatencyChart() {
  const chartData = useChartData();
  const [displayData, setDisplayData] = useState<Array<{ time: string; success: number; latency: number }>>([]);

  // Smoothly update chart data with animation
  useEffect(() => {
    if (chartData.length > 0) {
      setDisplayData([...chartData]);
    } else {
      // Initialize with empty data if no data yet
      setDisplayData([]);
    }
  }, [chartData]);

  // Ensure we have at least some data points for the chart
  const data = displayData.length > 0 ? displayData : [
    { time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), success: 0, latency: 0 }
  ];

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.3)" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[0, 200]}
            stroke="rgba(255,255,255,0.3)" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
             contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="latency" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={300}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
