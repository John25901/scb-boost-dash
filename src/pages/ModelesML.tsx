import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell
} from "recharts";
import {
  Brain, Target, Layers, GitBranch, ShieldCheck, Users, ScanSearch,
  Bot, FileSearch, Cog, TrendingUp, AlertTriangle, ChevronRight
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

// 6 use cases
const useCases = [
  {
    id: "churn",
    label: "Churn Prediction",
    icon: TrendingUp,
    tech: "XGBoost, SHAP, R-Learner",
    impact: "–5% attrition / AUC 97%",
    priorite: "Moyenne",
    status: "Production",
    description: "Prédiction de l'attrition client avec explication causale via R-Learner pour identifier les leviers de rétention.",
    metrics: { precision: 94.2, rappel: 89.7, f1: 91.8, auc: 0.97 },
    features: [
      { feature: "Jours depuis dern. TX", importance: 28, impact: "négatif" },
      { feature: "Tendance solde 3 mois", importance: 22, impact: "positif" },
      { feature: "Fréq. MoMo mensuelle", importance: 18, impact: "positif" },
      { feature: "Ratio MoMo/bancaire", importance: 14, impact: "négatif" },
      { feature: "Score NPS", importance: 10, impact: "positif" },
      { feature: "Nb incidents paiement", importance: 8, impact: "négatif" },
    ],
    confusion: { tp: 897, fp: 58, fn: 103, tn: 4942 },
    rocData: Array.from({ length: 20 }, (_, i) => ({
      fpr: i / 20, tpr: Math.min(1, (i / 20) ** 0.25), random: i / 20,
    })),
  },
  {
    id: "recommandation",
    label: "Recommandation Fin.",
    icon: Users,
    tech: "Filtrage Collaboratif, NLP",
    impact: "+12% cross-sell",
    priorite: "Moyenne",
    status: "Production",
    description: "Recommandation de produits financiers personnalisés basée sur les profils similaires et l'analyse textuelle des interactions.",
    metrics: { precision: 88.5, rappel: 91.0, f1: 89.7, auc: 0.92 },
    features: [
      { feature: "Segment RFM", importance: 30, impact: "positif" },
      { feature: "Historique produits", importance: 25, impact: "positif" },
      { feature: "Score comportemental", importance: 20, impact: "positif" },
      { feature: "Canal principal", importance: 15, impact: "positif" },
      { feature: "Âge / Profession", importance: 10, impact: "positif" },
    ],
    confusion: { tp: 1245, fp: 142, fn: 118, tn: 3495 },
    rocData: Array.from({ length: 20 }, (_, i) => ({
      fpr: i / 20, tpr: Math.min(1, (i / 20) ** 0.35), random: i / 20,
    })),
  },
  {
    id: "scoring",
    label: "Credit Scoring IA",
    icon: Brain,
    tech: "Random Forest, Réseaux Neurones",
    impact: "Break-even 8% → 32%",
    priorite: "Élevée",
    status: "Production",
    description: "Scoring crédit multi-modèle avec explicabilité SHAP pour la conformité réglementaire COBAC.",
    metrics: { precision: 92.1, rappel: 88.3, f1: 90.1, auc: 0.94 },
    features: [
      { feature: "Stabilité revenus 6m", importance: 25, impact: "positif" },
      { feature: "Score comport. MoMo", importance: 22, impact: "positif" },
      { feature: "Ratio dette/revenu", importance: 20, impact: "négatif" },
      { feature: "Ancienneté client", importance: 15, impact: "positif" },
      { feature: "Nb TX mensuelles", importance: 10, impact: "positif" },
      { feature: "Secteur informel", importance: 8, impact: "négatif" },
    ],
    confusion: { tp: 823, fp: 72, fn: 108, tn: 4997 },
    rocData: Array.from({ length: 20 }, (_, i) => ({
      fpr: i / 20, tpr: Math.min(1, (i / 20) ** 0.3), random: i / 20,
    })),
  },
  {
    id: "fraude",
    label: "Détection Fraude / AML",
    icon: ShieldCheck,
    tech: "Isolation Forest, Clustering",
    impact: "–60% faux positifs",
    priorite: "Élevée",
    status: "Production",
    description: "Détection d'anomalies transactionnelles et patterns de blanchiment en temps réel avec clustering adaptatif.",
    metrics: { precision: 97.8, rappel: 85.2, f1: 91.1, auc: 0.98 },
    features: [
      { feature: "Vélocité TX/heure", importance: 30, impact: "négatif" },
      { feature: "Géoloc. inhabituelle", importance: 25, impact: "négatif" },
      { feature: "Montant vs historique", importance: 20, impact: "négatif" },
      { feature: "Heure transaction", importance: 15, impact: "négatif" },
      { feature: "Réseau bénéficiaires", importance: 10, impact: "négatif" },
    ],
    confusion: { tp: 412, fp: 9, fn: 72, tn: 9507 },
    rocData: Array.from({ length: 20 }, (_, i) => ({
      fpr: i / 20, tpr: Math.min(1, (i / 20) ** 0.15), random: i / 20,
    })),
  },
  {
    id: "kyc",
    label: "Automatisation KYC",
    icon: ScanSearch,
    tech: "OCR avancé, Computer Vision, NLP",
    impact: "–20% temps traitement",
    priorite: "Moyenne",
    status: "Staging",
    description: "Extraction automatique des données d'identité par OCR et validation croisée pour le KYC simplifié du secteur informel.",
    metrics: { precision: 95.3, rappel: 93.1, f1: 94.2, auc: 0.96 },
    features: [
      { feature: "Qualité image CNI", importance: 30, impact: "positif" },
      { feature: "Cohérence OCR/saisie", importance: 25, impact: "positif" },
      { feature: "Détection falsification", importance: 20, impact: "négatif" },
      { feature: "Matching facial", importance: 15, impact: "positif" },
      { feature: "Validité document", importance: 10, impact: "positif" },
    ],
    confusion: { tp: 1856, fp: 92, fn: 138, tn: 7914 },
    rocData: Array.from({ length: 20 }, (_, i) => ({
      fpr: i / 20, tpr: Math.min(1, (i / 20) ** 0.2), random: i / 20,
    })),
  },
  {
    id: "rpa",
    label: "RPA + ML Back-office",
    icon: Cog,
    tech: "Process Mining, Classification",
    impact: "–20% charges opéx",
    priorite: "Faible",
    status: "PoC",
    description: "Automatisation des processus back-office via Process Mining pour identifier les goulots et prioriser l'automatisation.",
    metrics: { precision: 89.5, rappel: 86.2, f1: 87.8, auc: 0.91 },
    features: [
      { feature: "Temps cycle processus", importance: 28, impact: "négatif" },
      { feature: "Taux erreur manuelle", importance: 24, impact: "négatif" },
      { feature: "Volume répétitions", importance: 20, impact: "négatif" },
      { feature: "Complexité workflow", importance: 16, impact: "négatif" },
      { feature: "Coût par transaction", importance: 12, impact: "négatif" },
    ],
    confusion: { tp: 675, fp: 78, fn: 108, tn: 5139 },
    rocData: Array.from({ length: 20 }, (_, i) => ({
      fpr: i / 20, tpr: Math.min(1, (i / 20) ** 0.38), random: i / 20,
    })),
  },
];

const statusColor = (s: string) =>
  s === "Production" ? "bg-kpi-positive/10 text-kpi-positive" :
  s === "Staging" ? "bg-kpi-warning/10 text-kpi-warning" :
  "bg-secondary text-muted-foreground";

const prioriteColor = (p: string) =>
  p === "Élevée" ? "bg-red-100 text-red-700" :
  p === "Moyenne" ? "bg-amber-100 text-amber-700" :
  "bg-green-100 text-green-700";

const radarData = useCases.map(uc => ({
  model: uc.label.slice(0, 12),
  precision: uc.metrics.precision,
  rappel: uc.metrics.rappel,
  f1: uc.metrics.f1,
  auc: uc.metrics.auc * 100,
}));

const ModelesML = () => {
  const [selected, setSelected] = useState(useCases[0]);

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Modèles Machine Learning</h1>
          <p className="text-xs text-muted-foreground">6 cas d'usage stratégiques — Performance, SHAP, matrices de confusion & ROC</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Modèles Production", value: "4", icon: Brain },
            { label: "AUC Moyen", value: "0.95", icon: Target },
            { label: "Cas d'usage", value: "6", icon: Layers },
            { label: "Pipelines Actifs", value: "8", icon: GitBranch },
          ].map(s => (
            <Card key={s.label} className="p-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                <s.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p className="text-lg font-display font-bold text-card-foreground">{s.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Use case selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {useCases.map(uc => (
            <button
              key={uc.id}
              onClick={() => setSelected(uc)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selected.id === uc.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <uc.icon size={16} className={selected.id === uc.id ? "text-primary" : "text-muted-foreground"} />
              <p className="text-xs font-medium mt-1.5 text-card-foreground leading-tight">{uc.label}</p>
              <div className="flex gap-1 mt-1.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${statusColor(uc.status)}`}>{uc.status}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected model detail */}
        <Card className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <selected.icon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-card-foreground">{selected.label}</h3>
                <p className="text-[10px] text-muted-foreground">{selected.tech}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={`text-[10px] ${statusColor(selected.status)}`}>{selected.status}</Badge>
              <Badge className={`text-[10px] ${prioriteColor(selected.priorite)}`}>Priorité {selected.priorite}</Badge>
              <Badge variant="outline" className="text-[10px]">{selected.impact}</Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{selected.description}</p>

          {/* Metrics cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Précision", value: `${selected.metrics.precision}%` },
              { label: "Rappel", value: `${selected.metrics.rappel}%` },
              { label: "F1-Score", value: `${selected.metrics.f1}%` },
              { label: "AUC", value: selected.metrics.auc.toFixed(2) },
            ].map(m => (
              <div key={m.label} className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
                <p className="text-xl font-display font-bold text-card-foreground">{m.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ROC Curve */}
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground mb-1">Courbe ROC — {selected.label}</h3>
            <p className="text-xs text-muted-foreground mb-4">AUC = {selected.metrics.auc.toFixed(2)}</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={selected.rocData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="fpr" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: "FPR", position: "bottom", fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: "TPR", angle: -90, position: "insideLeft", fontSize: 9 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="random" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                <Line type="monotone" dataKey="tpr" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Feature Importance SHAP */}
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground mb-1">Feature Importance (SHAP)</h3>
            <p className="text-xs text-muted-foreground mb-4">Variables les plus influentes</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={selected.features} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" width={110} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]} barSize={14}>
                  {selected.features.map((f, i) => (
                    <Cell key={i} fill={f.impact === "positif" ? "hsl(var(--kpi-positive))" : "hsl(var(--kpi-negative))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Confusion Matrix */}
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground mb-1">Matrice de Confusion</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {(selected.confusion.tp + selected.confusion.fp + selected.confusion.fn + selected.confusion.tn).toLocaleString()} observations
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
              {[
                { label: "Vrai Positif", value: selected.confusion.tp, positive: true },
                { label: "Faux Positif", value: selected.confusion.fp, positive: false },
                { label: "Faux Négatif", value: selected.confusion.fn, positive: false },
                { label: "Vrai Négatif", value: selected.confusion.tn, positive: true },
              ].map((cell, i) => (
                <div key={i} className={`p-5 rounded-lg text-center ${cell.positive ? "bg-kpi-positive/10" : "bg-kpi-negative/10"}`}>
                  <p className="text-2xl font-display font-bold text-card-foreground">{cell.value.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground mt-1">{cell.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Radar comparison */}
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground mb-1">Comparaison Radar — Tous Modèles</h3>
            <p className="text-xs text-muted-foreground mb-4">Précision, Rappel, F1, AUC</p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={[
                { axis: "Précision", ...Object.fromEntries(useCases.map(u => [u.id, u.metrics.precision])) },
                { axis: "Rappel", ...Object.fromEntries(useCases.map(u => [u.id, u.metrics.rappel])) },
                { axis: "F1-Score", ...Object.fromEntries(useCases.map(u => [u.id, u.metrics.f1])) },
                { axis: "AUC×100", ...Object.fromEntries(useCases.map(u => [u.id, u.metrics.auc * 100])) },
              ]}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[80, 100]} />
                <Radar dataKey={selected.id} fill="hsl(var(--primary))" fillOpacity={0.3} stroke="hsl(var(--primary))" strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Comparison table */}
        <Card className="p-5 overflow-x-auto">
          <h3 className="font-display font-semibold text-card-foreground mb-4">Tableau Comparatif — 6 Cas d'usage</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left py-2 pr-4">Modèle</th>
                <th className="text-center py-2 px-2">Technologies</th>
                <th className="text-center py-2 px-2">Précision</th>
                <th className="text-center py-2 px-2">AUC</th>
                <th className="text-center py-2 px-2">Impact</th>
                <th className="text-center py-2 px-2">Priorité</th>
                <th className="text-center py-2 px-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {useCases.map(uc => (
                <tr key={uc.id} className={`border-b border-border/50 cursor-pointer transition-colors ${selected.id === uc.id ? "bg-primary/5" : "hover:bg-muted/50"}`}
                  onClick={() => setSelected(uc)}>
                  <td className="py-3 pr-4 font-medium text-card-foreground flex items-center gap-2">
                    <uc.icon size={14} className="text-primary" /> {uc.label}
                  </td>
                  <td className="text-center py-3 px-2 text-[10px] text-muted-foreground">{uc.tech}</td>
                  <td className="text-center py-3 px-2">{uc.metrics.precision}%</td>
                  <td className="text-center py-3 px-2">{uc.metrics.auc.toFixed(2)}</td>
                  <td className="text-center py-3 px-2 text-[10px]">{uc.impact}</td>
                  <td className="text-center py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${prioriteColor(uc.priorite)}`}>{uc.priorite}</span>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${statusColor(uc.status)}`}>{uc.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default ModelesML;
