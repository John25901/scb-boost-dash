import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { mois: "Jan", score: 72, cible: 80 },
  { mois: "Fév", score: 74, cible: 80 },
  { mois: "Mar", score: 71, cible: 80 },
  { mois: "Avr", score: 76, cible: 80 },
  { mois: "Mai", score: 78, cible: 80 },
  { mois: "Juin", score: 80, cible: 80 },
  { mois: "Juil", score: 82, cible: 80 },
  { mois: "Août", score: 79, cible: 80 },
  { mois: "Sep", score: 84, cible: 80 },
  { mois: "Oct", score: 86, cible: 80 },
  { mois: "Nov", score: 88, cible: 80 },
  { mois: "Déc", score: 91, cible: 80 },
];

const SatisfactionChart = () => (
  <Card className="p-5 col-span-2">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-display font-semibold text-card-foreground">Score de Satisfaction Client (NPS)</h3>
        <p className="text-xs text-muted-foreground mt-1">Évolution mensuelle — impact des modèles ML</p>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Score NPS</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-kpi-warning" /> Cible</span>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="npsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(215, 80%, 28%)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(215, 80%, 28%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
        <XAxis dataKey="mois" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" />
        <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Area type="monotone" dataKey="cible" stroke="hsl(35, 92%, 55%)" strokeDasharray="5 5" fill="none" strokeWidth={2} />
        <Area type="monotone" dataKey="score" stroke="hsl(215, 80%, 28%)" fill="url(#npsGrad)" strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);

export default SatisfactionChart;
