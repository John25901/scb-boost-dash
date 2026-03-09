import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ShieldCheck, AlertTriangle, ShieldAlert, TrendingDown } from "lucide-react";

const riskByType = [
  { type: "Crédit", count: 342, severity: "Élevé" },
  { type: "Opérationnel", count: 128, severity: "Moyen" },
  { type: "Marché", count: 56, severity: "Faible" },
  { type: "Liquidité", count: 89, severity: "Moyen" },
  { type: "Conformité", count: 15, severity: "Faible" },
];

const fraudData = [
  { mois: "Jan", détectées: 45, bloquées: 42 },
  { mois: "Fév", détectées: 52, bloquées: 50 },
  { mois: "Mar", détectées: 38, bloquées: 37 },
  { mois: "Avr", détectées: 61, bloquées: 58 },
  { mois: "Mai", détectées: 47, bloquées: 46 },
  { mois: "Juin", détectées: 33, bloquées: 33 },
];

const riskDistribution = [
  { name: "Faible", value: 62, color: "hsl(160, 60%, 45%)" },
  { name: "Moyen", value: 25, color: "hsl(35, 92%, 55%)" },
  { name: "Élevé", value: 10, color: "hsl(0, 72%, 51%)" },
  { name: "Critique", value: 3, color: "hsl(0, 72%, 35%)" },
];

const Risques = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Gestion des Risques</h1>
      <p className="text-xs text-muted-foreground">Détection de fraude, scoring de risque, conformité — ML & Big Data</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {[
        { label: "Taux Détection Fraude", value: "98.2%", icon: ShieldCheck, color: "text-kpi-positive" },
        { label: "Alertes Actives", value: "23", icon: AlertTriangle, color: "text-kpi-warning" },
        { label: "Risques Élevés", value: "10%", icon: ShieldAlert, color: "text-kpi-negative" },
        { label: "Pertes Évitées", value: "₣245M", icon: TrendingDown, color: "text-primary" },
      ].map((s) => (
        <Card key={s.label} className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
            <s.icon size={20} className={s.color} />
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
        <h3 className="font-display font-semibold text-card-foreground mb-1">Détection de Fraude</h3>
        <p className="text-xs text-muted-foreground mb-4">Transactions frauduleuses détectées vs bloquées — Modèle LSTM</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={fraudData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
            <XAxis dataKey="mois" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="détectées" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} barSize={14} />
            <Bar dataKey="bloquées" fill="hsl(160, 60%, 45%)" radius={[6, 6, 0, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-kpi-negative" /> Détectées</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-kpi-positive" /> Bloquées</span>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-card-foreground mb-1">Distribution du Risque Global</h3>
        <p className="text-xs text-muted-foreground mb-4">Répartition du portefeuille par niveau de risque</p>
        <div className="flex items-center gap-6">
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {riskDistribution.map((r) => (
              <div key={r.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-muted-foreground">{r.name}</span>
                </span>
                <span className="font-semibold text-card-foreground">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>

    <Card className="p-5">
      <h3 className="font-display font-semibold text-card-foreground mb-4">Risques par Catégorie</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="text-left py-2 pr-4">Type</th>
            <th className="text-center py-2 px-3">Incidents</th>
            <th className="text-center py-2 px-3">Sévérité</th>
          </tr>
        </thead>
        <tbody>
          {riskByType.map((r) => (
            <tr key={r.type} className="border-b border-border/50">
              <td className="py-3 pr-4 font-medium text-card-foreground">{r.type}</td>
              <td className="text-center py-3 px-3">{r.count}</td>
              <td className="text-center py-3 px-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  r.severity === "Élevé" ? "bg-kpi-negative/10 text-kpi-negative" :
                  r.severity === "Moyen" ? "bg-kpi-warning/10 text-kpi-warning" :
                  "bg-kpi-positive/10 text-kpi-positive"
                }`}>{r.severity}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

export default Risques;
