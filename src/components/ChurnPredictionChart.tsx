import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { segment: "Premium", risque: 8, clients: 2400 },
  { segment: "Entreprise", risque: 12, clients: 5200 },
  { segment: "PME", risque: 22, clients: 8100 },
  { segment: "Particulier", risque: 18, clients: 34000 },
  { segment: "Jeune", risque: 31, clients: 12000 },
  { segment: "Diaspora", risque: 15, clients: 4800 },
];

const getBarColor = (risque: number) => {
  if (risque <= 10) return "hsl(160, 60%, 45%)";
  if (risque <= 20) return "hsl(35, 92%, 55%)";
  return "hsl(0, 72%, 51%)";
};

const ChurnPredictionChart = () => (
  <Card className="p-5">
    <div className="mb-4">
      <h3 className="font-display font-semibold text-card-foreground">Prédiction de Churn par Segment</h3>
      <p className="text-xs text-muted-foreground mt-1">Taux de risque d'attrition (%) — Modèle Random Forest</p>
    </div>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" horizontal={false} />
        <XAxis type="number" domain={[0, 40]} tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" unit="%" />
        <YAxis dataKey="segment" type="category" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" width={80} />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(val: number) => [`${val}%`, "Risque"]} />
        <Bar dataKey="risque" radius={[0, 6, 6, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell key={index} fill={getBarColor(entry.risque)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

export default ChurnPredictionChart;
