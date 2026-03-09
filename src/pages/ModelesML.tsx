import { Card } from "@/components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ScatterChart, Scatter, Cell } from "recharts";
import { Brain, Target, Layers, GitBranch } from "lucide-react";

const models = [
  { nom: "Random Forest (Churn)", precision: 94.2, rappel: 89.7, f1: 91.8, auc: 0.96, status: "Production" },
  { nom: "XGBoost (Scoring)", precision: 92.1, rappel: 88.3, f1: 90.1, auc: 0.94, status: "Production" },
  { nom: "LSTM (Fraude)", precision: 97.8, rappel: 85.2, f1: 91.1, auc: 0.98, status: "Production" },
  { nom: "BERT (Sentiment)", precision: 88.5, rappel: 91.0, f1: 89.7, auc: 0.92, status: "Staging" },
];

const confusionMatrix = [
  { predicted: "Churn", actual: "Churn", value: 897 },
  { predicted: "Churn", actual: "No Churn", value: 58 },
  { predicted: "No Churn", actual: "Churn", value: 103 },
  { predicted: "No Churn", actual: "No Churn", value: 4942 },
];

const rocData = Array.from({ length: 20 }, (_, i) => ({
  fpr: i / 20,
  tpr: Math.min(1, (i / 20) ** 0.3),
  random: i / 20,
}));

const featureImportance = [
  { feature: "Fréquence TX", importance: 0.28 },
  { feature: "Solde Moyen", importance: 0.22 },
  { feature: "Ancienneté", importance: 0.18 },
  { feature: "Nb Réclamations", importance: 0.14 },
  { feature: "Canal Préféré", importance: 0.10 },
  { feature: "Âge", importance: 0.08 },
];

const ModelesML = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Modèles Machine Learning</h1>
      <p className="text-xs text-muted-foreground">Performance, métriques, matrice de confusion & feature importance</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {[
        { label: "Modèles en Production", value: "3", icon: Brain },
        { label: "AUC Moyen", value: "0.96", icon: Target },
        { label: "Modèles Entraînés", value: "12", icon: Layers },
        { label: "Pipelines Actifs", value: "5", icon: GitBranch },
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

    {/* Models table */}
    <Card className="p-5 overflow-x-auto">
      <h3 className="font-display font-semibold text-card-foreground mb-4">Comparaison des Modèles</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="text-left py-2 pr-4">Modèle</th>
            <th className="text-center py-2 px-3">Précision</th>
            <th className="text-center py-2 px-3">Rappel</th>
            <th className="text-center py-2 px-3">F1-Score</th>
            <th className="text-center py-2 px-3">AUC</th>
            <th className="text-center py-2 px-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.nom} className="border-b border-border/50">
              <td className="py-3 pr-4 font-medium text-card-foreground">{m.nom}</td>
              <td className="text-center py-3 px-3">{m.precision}%</td>
              <td className="text-center py-3 px-3">{m.rappel}%</td>
              <td className="text-center py-3 px-3">{m.f1}%</td>
              <td className="text-center py-3 px-3">{m.auc}</td>
              <td className="text-center py-3 px-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  m.status === "Production" ? "bg-kpi-positive/10 text-kpi-positive" : "bg-kpi-warning/10 text-kpi-warning"
                }`}>{m.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-5">
        <h3 className="font-display font-semibold text-card-foreground mb-1">Courbe ROC — Modèle Churn</h3>
        <p className="text-xs text-muted-foreground mb-4">AUC = 0.96</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={rocData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
            <XAxis dataKey="fpr" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" label={{ value: "FPR", position: "bottom", fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" label={{ value: "TPR", angle: -90, position: "insideLeft", fontSize: 10 }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="random" stroke="hsl(220, 15%, 70%)" strokeDasharray="5 5" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="tpr" stroke="hsl(215, 80%, 28%)" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-card-foreground mb-1">Feature Importance — Random Forest</h3>
        <p className="text-xs text-muted-foreground mb-4">Variables les plus influentes dans la prédiction</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={featureImportance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(220, 15%, 50%)" />
            <YAxis dataKey="feature" type="category" tick={{ fontSize: 10 }} stroke="hsl(220, 15%, 50%)" width={100} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="importance" radius={[0, 6, 6, 0]} barSize={16} fill="hsl(215, 80%, 28%)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Confusion Matrix */}
    <Card className="p-5">
      <h3 className="font-display font-semibold text-card-foreground mb-1">Matrice de Confusion — Modèle Churn</h3>
      <p className="text-xs text-muted-foreground mb-4">Résultats sur le jeu de test (6 000 observations)</p>
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        {confusionMatrix.map((cell, i) => (
          <div key={i} className={`p-6 rounded-lg text-center ${
            (i === 0 || i === 3) ? "bg-kpi-positive/10" : "bg-kpi-negative/10"
          }`}>
            <p className="text-2xl font-display font-bold text-card-foreground">{cell.value.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Prédit: {cell.predicted}<br />Réel: {cell.actual}
            </p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default ModelesML;
