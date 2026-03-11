import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import AnimatedPage from "@/components/AnimatedPage";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import {
  Activity, Cpu, HardDrive, Wifi, Clock, Users, MessageSquare,
  Send, Loader2, Star, TrendingUp, Cog, Timer, ThumbsUp
} from "lucide-react";

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

const onboardingData = [
  { mois: "Oct", moyen: 52, cible: 30 },
  { mois: "Nov", moyen: 48, cible: 30 },
  { mois: "Déc", moyen: 45, cible: 30 },
  { mois: "Jan", moyen: 40, cible: 30 },
  { mois: "Fév", moyen: 35, cible: 30 },
  { mois: "Mar", moyen: 32, cible: 30 },
];

const rpaProcesses = [
  { process: "Ouverture de compte", avant: 45, apres: 22, gain: "51%", statut: "Automatisé" },
  { process: "Vérification KYC", avant: 35, apres: 12, gain: "66%", statut: "Automatisé" },
  { process: "Traitement réclamation", avant: 60, apres: 38, gain: "37%", statut: "En cours" },
  { process: "Clôture de compte", avant: 25, apres: 15, gain: "40%", statut: "Automatisé" },
  { process: "Mise à jour client", avant: 20, apres: 8, gain: "60%", statut: "Automatisé" },
];

const npsDistribution = [
  { name: "Promoteurs (9-10)", value: 45, color: "hsl(var(--kpi-positive))" },
  { name: "Passifs (7-8)", value: 32, color: "hsl(var(--kpi-warning))" },
  { name: "Détracteurs (0-6)", value: 23, color: "hsl(var(--kpi-negative))" },
];

const npsTrend = [
  { mois: "Oct", score: 62 },
  { mois: "Nov", score: 65 },
  { mois: "Déc", score: 68 },
  { mois: "Jan", score: 72 },
  { mois: "Fév", score: 75 },
  { mois: "Mar", score: 78 },
];

const systemMetrics = [
  { label: "CPU Cluster Spark", value: "72%", icon: Cpu, status: "normal" },
  { label: "Temps Onboarding Moy.", value: "32 min", icon: Timer, status: "warning" },
  { label: "Score NPS Global", value: "78/100", icon: ThumbsUp, status: "good" },
  { label: "Taux Automatisation", value: "68%", icon: Cog, status: "good" },
];

const PerformanceOps = () => {
  const [npsScore, setNpsScore] = useState([7]);
  const [npsComment, setNpsComment] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentiment, setSentiment] = useState<{ sentiment: string; score: number } | null>(null);
  const { toast } = useToast();

  const submitNPS = async () => {
    if (!clientCode.trim()) {
      toast({ title: "Entrez un code client", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setSentiment(null);

    try {
      // Find client
      const { data: client, error: cErr } = await supabase
        .from("clients")
        .select("id")
        .eq("code_client", clientCode.trim())
        .single();
      if (cErr || !client) throw new Error("Client introuvable");

      // Analyze sentiment if comment exists
      let sentimentResult = { sentiment: "neutre", score: 0 };
      if (npsComment.trim()) {
        const { data: aiData, error: aiErr } = await supabase.functions.invoke("nps-sentiment", {
          body: { commentaire: npsComment, score_nps: npsScore[0] },
        });
        if (!aiErr && aiData && !aiData.error) {
          sentimentResult = aiData;
        }
      }

      // Save NPS
      const { error: insertErr } = await supabase.from("nps_responses").insert({
        client_id: client.id,
        score: npsScore[0],
        commentaire: npsComment || null,
        sentiment: sentimentResult.sentiment,
        sentiment_score: sentimentResult.score,
        canal: "dashboard",
      });
      if (insertErr) throw insertErr;

      setSentiment(sentimentResult);
      toast({ title: "✅ NPS enregistré", description: `Score: ${npsScore[0]}/10 — Sentiment: ${sentimentResult.sentiment}` });
      setNpsComment("");
      setClientCode("");
      setNpsScore([7]);
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const npsColor = (s: number) => s >= 9 ? "text-kpi-positive" : s >= 7 ? "text-kpi-warning" : "text-kpi-negative";

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Performance Opérationnelle</h1>
          <p className="text-xs text-muted-foreground">Infrastructure, NPS, onboarding, RPA & Process Mining</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {systemMetrics.map(m => (
            <Card key={m.label} className="p-3 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                m.status === "good" ? "bg-kpi-positive/10" : m.status === "warning" ? "bg-kpi-warning/10" : "bg-secondary"
              }`}>
                <m.icon size={18} className={m.status === "good" ? "text-kpi-positive" : m.status === "warning" ? "text-kpi-warning" : "text-primary"} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
                <p className="text-sm font-display font-bold text-card-foreground">{m.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Latency & Throughput */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground mb-1">Latence par Service (ms)</h3>
            <p className="text-xs text-muted-foreground mb-4">API Gateway, Base de données, Inférence ML</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="heure" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" unit="ms" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="api" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="db" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ml" stroke="hsl(var(--kpi-warning))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> API</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> DB</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-kpi-warning" /> ML</span>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground mb-1">Throughput Hebdomadaire</h3>
            <p className="text-xs text-muted-foreground mb-4">Transactions traitées par jour</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="jour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [v.toLocaleString(), "TX"]} />
                <Bar dataKey="transactions" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Onboarding & NPS trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground mb-1">Temps d'Onboarding (min)</h3>
            <p className="text-xs text-muted-foreground mb-4">Process Mining — Réduction du temps d'ouverture de compte</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={onboardingData}>
                <defs>
                  <linearGradient id="onbGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" unit=" min" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="moyen" stroke="hsl(var(--primary))" fill="url(#onbGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="cible" stroke="hsl(var(--kpi-positive))" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Réel</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-kpi-positive" /> Cible</span>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground mb-1">Évolution NPS</h3>
            <p className="text-xs text-muted-foreground mb-4">Score Net Promoter — Tendance 6 mois</p>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={npsDistribution} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
                      {npsDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5">
                {npsDistribution.map(r => (
                  <div key={r.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-muted-foreground">{r.name}</span>
                    </span>
                    <span className="font-semibold text-card-foreground">{r.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={100} className="mt-3">
              <LineChart data={npsTrend}>
                <XAxis dataKey="mois" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" domain={[50, 100]} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--kpi-positive))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* RPA Table */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cog size={16} className="text-primary" />
            <h3 className="font-display font-semibold text-card-foreground">RPA & Process Mining — Automatisation Back-office</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left py-2 pr-4">Processus</th>
                <th className="text-center py-2 px-2">Avant (min)</th>
                <th className="text-center py-2 px-2">Après (min)</th>
                <th className="text-center py-2 px-2">Gain</th>
                <th className="text-center py-2 px-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rpaProcesses.map(p => (
                <tr key={p.process} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium text-card-foreground">{p.process}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{p.avant}</td>
                  <td className="text-center py-3 px-2 font-bold text-primary">{p.apres}</td>
                  <td className="text-center py-3 px-2">
                    <Badge className="bg-kpi-positive/10 text-kpi-positive text-[10px]">{p.gain}</Badge>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      p.statut === "Automatisé" ? "bg-kpi-positive/10 text-kpi-positive" : "bg-kpi-warning/10 text-kpi-warning"
                    }`}>{p.statut}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* NPS Collection Form */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={16} className="text-primary" />
            <h3 className="font-display font-semibold text-card-foreground">Collecte NPS — Analyse de Sentiment IA</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-card-foreground">Code Client</label>
                <Input
                  placeholder="SCB-2024-0001"
                  value={clientCode}
                  onChange={e => setClientCode(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-card-foreground">
                  Score NPS : <span className={`text-lg font-display font-bold ${npsColor(npsScore[0])}`}>{npsScore[0]}</span>/10
                </label>
                <Slider value={npsScore} onValueChange={setNpsScore} max={10} min={0} step={1} className="py-2" />
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>Détracteur</span>
                  <span>Passif</span>
                  <span>Promoteur</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-card-foreground">Commentaire (optionnel)</label>
                <Textarea
                  placeholder="Le service est rapide mais les frais sont trop élevés..."
                  value={npsComment}
                  onChange={e => setNpsComment(e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={submitNPS} disabled={submitting || !clientCode.trim()} className="w-full">
                {submitting ? <Loader2 size={14} className="animate-spin mr-2" /> : <Send size={14} className="mr-2" />}
                Enregistrer & Analyser
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-card-foreground">Résultat d'analyse</p>
              {sentiment ? (
                <div className="p-4 bg-muted/50 rounded-lg space-y-3 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg ${
                      sentiment.sentiment === "positif" ? "bg-kpi-positive/10" :
                      sentiment.sentiment === "négatif" ? "bg-kpi-negative/10" : "bg-kpi-warning/10"
                    }`}>
                      {sentiment.sentiment === "positif" ? "😊" : sentiment.sentiment === "négatif" ? "😞" : "😐"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-card-foreground capitalize">{sentiment.sentiment}</p>
                      <p className="text-[10px] text-muted-foreground">Score de confiance: {(sentiment.score * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-muted/30 rounded-lg text-center">
                  <Star size={24} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Soumettez un NPS pour voir l'analyse de sentiment IA</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default PerformanceOps;
