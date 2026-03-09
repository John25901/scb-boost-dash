import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Database, Server, HardDrive, Layers } from "lucide-react";

const volumeData = [
  { mois: "Jan", volume: 1.2 },
  { mois: "Fév", volume: 1.4 },
  { mois: "Mar", volume: 1.3 },
  { mois: "Avr", volume: 1.6 },
  { mois: "Mai", volume: 1.8 },
  { mois: "Juin", volume: 2.0 },
  { mois: "Juil", volume: 2.1 },
  { mois: "Août", volume: 1.9 },
  { mois: "Sep", volume: 2.3 },
  { mois: "Oct", volume: 2.5 },
  { mois: "Nov", volume: 2.7 },
  { mois: "Déc", volume: 3.0 },
];

const sourceData = [
  { source: "Core Banking", records: 45000000 },
  { source: "Mobile App", records: 28000000 },
  { source: "Logs Serveurs", records: 120000000 },
  { source: "Réseaux Sociaux", records: 5000000 },
  { source: "IoT/ATM", records: 18000000 },
];

const pipelineJobs = [
  { nom: "ETL Transactions", statut: "Succès", durée: "12 min", records: "2.3M", dernier: "09/03 06:00" },
  { nom: "Ingestion Logs", statut: "Succès", durée: "8 min", records: "15M", dernier: "09/03 05:30" },
  { nom: "Feature Engineering", statut: "En cours", durée: "—", records: "1.8M", dernier: "09/03 07:00" },
  { nom: "Scoring Batch", statut: "Planifié", durée: "—", records: "—", dernier: "09/03 08:00" },
  { nom: "Export Rapports", statut: "Succès", durée: "3 min", records: "50K", dernier: "09/03 04:00" },
];

const BigData = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Big Data</h1>
      <p className="text-xs text-muted-foreground">Infrastructure données, pipelines ETL, volumes & sources</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {[
        { label: "Volume Total", value: "3.0 TB", icon: Database },
        { label: "Sources Connectées", value: "5", icon: Server },
        { label: "Records Traités/Jour", value: "18M", icon: HardDrive },
        { label: "Pipelines Actifs", value: "5", icon: Layers },
      ].map((s) => (
        <Card key={s.label} className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
            <s.icon size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-lg font-display font-bold text-card-foreground">{s.value}</p>
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-5">
        <h3 className="font-display font-semibold text-card-foreground mb-1">Évolution du Volume de Données (TB)</h3>
        <p className="text-xs text-muted-foreground mb-4">Croissance mensuelle du data lake</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={volumeData}>
            <defs>
              <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(215, 80%, 28%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(215, 80%, 28%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
            <XAxis dataKey="mois" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" unit=" TB" />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="volume" stroke="hsl(215, 80%, 28%)" fill="url(#volGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-card-foreground mb-1">Records par Source</h3>
        <p className="text-xs text-muted-foreground mb-4">Volume d'enregistrements par système source</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={sourceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
            <YAxis dataKey="source" type="category" tick={{ fontSize: 10 }} stroke="hsl(220, 15%, 50%)" width={110} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${(v / 1e6).toFixed(1)}M`, "Records"]} />
            <Bar dataKey="records" radius={[0, 6, 6, 0]} barSize={16} fill="hsl(160, 60%, 45%)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <Card className="p-5">
      <h3 className="font-display font-semibold text-card-foreground mb-4">Pipelines ETL</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="text-left py-2 pr-4">Job</th>
            <th className="text-center py-2 px-3">Statut</th>
            <th className="text-center py-2 px-3">Durée</th>
            <th className="text-center py-2 px-3">Records</th>
            <th className="text-center py-2 px-3">Dernier Run</th>
          </tr>
        </thead>
        <tbody>
          {pipelineJobs.map((j) => (
            <tr key={j.nom} className="border-b border-border/50">
              <td className="py-3 pr-4 font-medium text-card-foreground">{j.nom}</td>
              <td className="text-center py-3 px-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  j.statut === "Succès" ? "bg-kpi-positive/10 text-kpi-positive" :
                  j.statut === "En cours" ? "bg-kpi-warning/10 text-kpi-warning" :
                  "bg-secondary text-muted-foreground"
                }`}>{j.statut}</span>
              </td>
              <td className="text-center py-3 px-3 text-muted-foreground">{j.durée}</td>
              <td className="text-center py-3 px-3 text-muted-foreground">{j.records}</td>
              <td className="text-center py-3 px-3 text-muted-foreground">{j.dernier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

export default BigData;
