import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const data = [
  { time: "09:00", success: 85, latency: 120 },
  { time: "10:00", success: 88, latency: 132 },
  { time: "11:00", success: 92, latency: 101 },
  { time: "12:00", success: 90, latency: 145 },
  { time: "13:00", success: 95, latency: 98 },
  { time: "14:00", success: 89, latency: 112 },
  { time: "15:00", success: 94, latency: 89 },
];

export function DeploymentFrequencyChart() {
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
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LatencyChart() {
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
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
