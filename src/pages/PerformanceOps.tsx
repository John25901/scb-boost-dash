import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Activity, Cpu, HardDrive, Wifi } from "lucide-react";

const latencyData = [
  { heure: "00h", api: 120, db: 45, ml: 230 },
  { heure: "04h", api: 95, db: 38, ml: 210 },
  { heure: "08h", api: 180, db: 62, ml: 280 },
  { heure: "12h", api: 250, db: 78, ml: 350 },
  { heure: "16h", api: 220, db: 70, ml: 310 },
  { heure: "20h", api: 160, db: 50, ml: 260 },
];

const throughputData = [
  { jour: "Lun", transactions: 42000 },
  { jour: "Mar", transactions: 45000 },
  { jour: "Mer", transactions: 48000 },
  { jour: "Jeu", transactions: 46000 },
  { jour: "Ven", transactions: 52000 },
  { jour: "Sam", transactions: 38000 },
  { jour: "Dim", transactions: 28000 },
];

const systemMetrics = [
  { label: "CPU Cluster Spark", value: "72%", icon: Cpu, status: "normal" },
  { label: "Stockage HDFS", value: "4.2 TB / 8 TB", icon: HardDrive, status: "warning" },
  { label: "Uptime API", value: "99.97%", icon: Activity, status: "good" },
  { label: "Bande Passante", value: "2.4 Gbps", icon: Wifi, status: "normal" },
];

const PerformanceOps = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Performance Opérationnelle</h1>
      <p className="text-xs text-muted-foreground">Monitoring infrastructure, latence, throughput — Big Data Stack</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {systemMetrics.map((m) => (
        <Card key={m.label} className="p-4 flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
            m.status === "good" ? "bg-kpi-positive/10" : m.status === "warning" ? "bg-kpi-warning/10" : "bg-secondary"
          }`}>
            <m.icon size={20} className={
              m.status === "good" ? "text-kpi-positive" : m.status === "warning" ? "text-kpi-warning" : "text-primary"
            } />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="text-sm font-display font-bold text-card-foreground">{m.value}</p>
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-5">
        <h3 className="font-display font-semibold text-card-foreground mb-1">Latence par Service (ms)</h3>
        <p className="text-xs text-muted-foreground mb-4">API Gateway, Base de données, Inférence ML</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
            <XAxis dataKey="heure" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" unit="ms" />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="api" stroke="hsl(215, 80%, 28%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="db" stroke="hsl(160, 60%, 45%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="ml" stroke="hsl(35, 92%, 55%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> API</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> DB</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-kpi-warning" /> ML</span>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-card-foreground mb-1">Throughput Hebdomadaire</h3>
        <p className="text-xs text-muted-foreground mb-4">Volume de transactions traitées par jour</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={throughputData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
            <XAxis dataKey="jour" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [v.toLocaleString(), "Transactions"]} />
            <Bar dataKey="transactions" radius={[6, 6, 0, 0]} fill="hsl(215, 80%, 28%)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </div>
);

export default PerformanceOps;
