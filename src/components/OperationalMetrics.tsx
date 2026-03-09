import { Card } from "@/components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const modelMetrics = [
  { name: "Précision", value: 94.2, color: "hsl(215, 80%, 28%)" },
  { name: "Rappel", value: 89.7, color: "hsl(160, 60%, 45%)" },
  { name: "F1-Score", value: 91.8, color: "hsl(35, 92%, 55%)" },
];

const channelData = [
  { name: "Mobile Banking", value: 42, color: "hsl(215, 80%, 28%)" },
  { name: "Agence", value: 28, color: "hsl(160, 60%, 45%)" },
  { name: "Internet Banking", value: 18, color: "hsl(35, 92%, 55%)" },
  { name: "USSD", value: 12, color: "hsl(280, 60%, 55%)" },
];

const OperationalMetrics = () => (
  <Card className="p-5">
    <div className="mb-4">
      <h3 className="font-display font-semibold text-card-foreground">Performance des Modèles ML</h3>
      <p className="text-xs text-muted-foreground mt-1">Métriques du modèle de prédiction principal</p>
    </div>
    <div className="grid grid-cols-3 gap-3 mb-6">
      {modelMetrics.map((m) => (
        <div key={m.name} className="text-center">
          <div className="relative mx-auto w-20 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={90 - (m.value / 100) * 360} data={[m]}>
                <RadialBar dataKey="value" fill={m.color} background={{ fill: "hsl(220, 20%, 93%)" }} cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-card-foreground">
              {m.value}%
            </span>
          </div>
          <p className="text-[10px] font-medium text-muted-foreground mt-1">{m.name}</p>
        </div>
      ))}
    </div>
    <div className="border-t border-border pt-4">
      <h4 className="text-xs font-semibold text-card-foreground mb-3">Répartition des Canaux</h4>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value" strokeWidth={0}>
                {channelData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {channelData.map((c) => (
            <div key={c.name} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-muted-foreground">{c.name}</span>
              </span>
              <span className="font-semibold text-card-foreground">{c.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

export default OperationalMetrics;
