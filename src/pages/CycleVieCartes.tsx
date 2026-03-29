import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import {
  CreditCard, Clock, Package, Truck, CheckCircle2, AlertTriangle,
  ArrowRight, Timer, Activity, TrendingDown, Eye
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

// === PIPELINE CYCLE DE VIE ===
const pipelineStages = [
  { etape: "Commande", en_cours: 320, delai_moyen: 0, blocages: 0, color: "bg-primary" },
  { etape: "Fabrication", en_cours: 185, delai_moyen: 5, blocages: 12, color: "bg-accent" },
  { etape: "Personnalisation", en_cours: 142, delai_moyen: 3, blocages: 8, color: "bg-kpi-warning" },
  { etape: "Expédition", en_cours: 98, delai_moyen: 4, blocages: 15, color: "bg-chart-4" },
  { etape: "Réception Agence", en_cours: 65, delai_moyen: 7, blocages: 22, color: "bg-kpi-negative" },
  { etape: "Remise Client", en_cours: 45, delai_moyen: 5, blocages: 18, color: "bg-primary" },
  { etape: "Activation", en_cours: 28, delai_moyen: 3, blocages: 5, color: "bg-accent" },
];

const delaisParMois = [
  { mois: "Jan", commande_activation: 32, cible: 21, fabrication: 6, expedition: 12, remise: 8, activation: 6 },
  { mois: "Fév", commande_activation: 30, cible: 21, fabrication: 5, expedition: 11, remise: 8, activation: 6 },
  { mois: "Mar", commande_activation: 28, cible: 21, fabrication: 5, expedition: 10, remise: 7, activation: 6 },
  { mois: "Avr", commande_activation: 27, cible: 21, fabrication: 5, expedition: 9, remise: 7, activation: 6 },
  { mois: "Mai", commande_activation: 25, cible: 21, fabrication: 5, expedition: 8, remise: 7, activation: 5 },
  { mois: "Juin", commande_activation: 23, cible: 21, fabrication: 4, expedition: 8, remise: 6, activation: 5 },
];

const blocagesParEtape = [
  { etape: "Données client incomplètes", nombre: 35, pct: 28, etape_source: "Commande" },
  { etape: "Retard fournisseur", nombre: 22, pct: 18, etape_source: "Fabrication" },
  { etape: "Stock agence saturé", nombre: 18, pct: 14, etape_source: "Réception" },
  { etape: "Client injoignable", nombre: 25, pct: 20, etape_source: "Remise" },
  { etape: "Code PIN non reçu", nombre: 15, pct: 12, etape_source: "Activation" },
  { etape: "Problème réseau", nombre: 10, pct: 8, etape_source: "Activation" },
];

const tauxActivation = [
  { mois: "Jan", commandees: 420, activees: 310, taux: 73.8 },
  { mois: "Fév", commandees: 450, activees: 345, taux: 76.7 },
  { mois: "Mar", commandees: 480, activees: 380, taux: 79.2 },
  { mois: "Avr", commandees: 460, activees: 372, taux: 80.9 },
  { mois: "Mai", commandees: 510, activees: 425, taux: 83.3 },
  { mois: "Juin", commandees: 540, activees: 462, taux: 85.6 },
];

const statutCartes = [
  { name: "Actives", value: 62, color: "hsl(var(--accent))" },
  { name: "En attente activation", value: 15, color: "hsl(var(--kpi-warning))" },
  { name: "En transit", value: 10, color: "hsl(var(--primary))" },
  { name: "En fabrication", value: 8, color: "hsl(var(--chart-4))" },
  { name: "Bloquées", value: 5, color: "hsl(var(--kpi-negative))" },
];

const CycleVieCartes = () => (
  <AnimatedPage>
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Cycle de Vie des Cartes</h1>
        <p className="text-xs text-muted-foreground">Tracking logistique commande → activation, détection des blocages, analyse des délais</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Délai Moyen Cmd→Activ.", value: "23 jours", change: "-28%", icon: Timer, positive: true },
          { label: "Taux Activation", value: "85.6%", change: "+11.8pts", icon: CheckCircle2, positive: true },
          { label: "Cartes en Blocage", value: "125", change: "-15%", icon: AlertTriangle, positive: true },
          { label: "Cartes Non Activées >30j", value: "82", change: "-22%", icon: TrendingDown, positive: true },
        ].map(k => (
          <Card key={k.label} className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-8 w-8 rounded-lg ${k.positive ? "bg-kpi-positive/10" : "bg-kpi-negative/10"} flex items-center justify-center`}>
                <k.icon size={16} className={k.positive ? "text-kpi-positive" : "text-kpi-negative"} />
              </div>
              <p className="text-[10px] text-muted-foreground">{k.label}</p>
            </div>
            <p className="text-lg font-display font-bold text-card-foreground">{k.value}</p>
            <p className={`text-[10px] font-medium ${k.positive ? "text-kpi-positive" : "text-kpi-negative"}`}>{k.change} vs trim.</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="pipeline" className="text-xs">Pipeline Visuel</TabsTrigger>
          <TabsTrigger value="delais" className="text-xs">Analyse des Délais</TabsTrigger>
          <TabsTrigger value="blocages" className="text-xs">Points de Blocage</TabsTrigger>
          <TabsTrigger value="activation" className="text-xs">Taux d'Activation</TabsTrigger>
        </TabsList>

        {/* PIPELINE */}
        <TabsContent value="pipeline" className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-4">Pipeline Commande → Activation</h3>
            <div className="space-y-3">
              {pipelineStages.map((s, i) => (
                <div key={s.etape} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-card-foreground">{s.etape}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[8px]">{s.en_cours} en cours</Badge>
                        {s.blocages > 0 && (
                          <Badge className="text-[8px] bg-kpi-negative/10 text-kpi-negative">{s.blocages} blocages</Badge>
                        )}
                      </div>
                    </div>
                    <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full transition-all duration-500`} style={{ width: `${(s.en_cours / 320) * 100}%` }} />
                    </div>
                    {s.delai_moyen > 0 && (
                      <p className="text-[9px] text-muted-foreground mt-0.5">Délai moyen : {s.delai_moyen} jours</p>
                    )}
                  </div>
                  {i < pipelineStages.length - 1 && (
                    <ArrowRight size={12} className="text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-kpi-warning/5 border border-kpi-warning/20 rounded-lg">
              <p className="text-[10px] text-kpi-warning font-medium flex items-center gap-1.5">
                <AlertTriangle size={12} />
                Bottleneck détecté : "Réception Agence" concentre 22 blocages (35% du total). Cause principale : capacité de stockage insuffisante.
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Statut Global du Parc</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Répartition des cartes par état</p>
            <div className="flex items-center gap-6">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statutCartes} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" strokeWidth={0}>
                      {statutCartes.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {statutCartes.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-muted-foreground">{s.name}</span>
                    </span>
                    <span className="font-semibold text-card-foreground">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* DÉLAIS */}
        <TabsContent value="delais" className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Délai Commande → Activation</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Objectif cible : 21 jours (ligne rouge)</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={delaisParMois}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[15, 35]} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="commande_activation" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} name="Délai réel (j)" />
                <Line type="monotone" dataKey="cible" stroke="hsl(var(--kpi-negative))" strokeDasharray="5 5" strokeWidth={1.5} name="Cible (21j)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Décomposition des Délais par Phase</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Contribution de chaque étape au délai total</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={delaisParMois}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="fabrication" stackId="a" fill="hsl(var(--primary))" name="Fabrication" />
                <Bar dataKey="expedition" stackId="a" fill="hsl(var(--accent))" name="Expédition" />
                <Bar dataKey="remise" stackId="a" fill="hsl(var(--kpi-warning))" name="Remise" />
                <Bar dataKey="activation" stackId="a" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} name="Activation" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Fabrication</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Expédition</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-kpi-warning" /> Remise</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(var(--chart-4))" }} /> Activation</span>
            </div>
          </Card>
        </TabsContent>

        {/* BLOCAGES */}
        <TabsContent value="blocages" className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Points de Blocage Identifiés</h3>
            <div className="space-y-3">
              {blocagesParEtape.map((b, i) => (
                <div key={b.etape} className="p-3 bg-muted/30 rounded-lg flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    b.pct > 20 ? "bg-kpi-negative/10" : b.pct > 15 ? "bg-kpi-warning/10" : "bg-muted"
                  }`}>
                    <span className={`text-[10px] font-bold ${
                      b.pct > 20 ? "text-kpi-negative" : b.pct > 15 ? "text-kpi-warning" : "text-muted-foreground"
                    }`}>#{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-card-foreground">{b.etape}</span>
                      <Badge variant="outline" className="text-[8px]">{b.etape_source}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${b.pct > 20 ? "bg-kpi-negative" : b.pct > 15 ? "bg-kpi-warning" : "bg-primary"}`} style={{ width: `${b.pct}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-card-foreground">{b.nombre} cas ({b.pct}%)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Recommandations IA</h3>
            <div className="space-y-2">
              {[
                { action: "Digitaliser la collecte des données client en amont", impact: "Élevé", blocage: "Données incomplètes (-35 cas)" },
                { action: "Pré-notifier les clients par SMS avant remise", impact: "Élevé", blocage: "Client injoignable (-25 cas)" },
                { action: "Augmenter la capacité de stockage des agences Douala Centre et Yaoundé", impact: "Moyen", blocage: "Stock saturé (-18 cas)" },
                { action: "Automatiser l'envoi du code PIN par SMS sécurisé", impact: "Moyen", blocage: "Code PIN non reçu (-15 cas)" },
              ].map((r, i) => (
                <div key={i} className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-card-foreground">{r.action}</span>
                    <Badge className={`text-[8px] ${r.impact === "Élevé" ? "bg-kpi-positive/10 text-kpi-positive" : "bg-kpi-warning/10 text-kpi-warning"}`}>{r.impact}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{r.blocage}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* ACTIVATION */}
        <TabsContent value="activation" className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Taux d'Activation Mensuel</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Cartes activées / Cartes commandées</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={tauxActivation}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="commandees" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={14} name="Commandées" />
                <Bar yAxisId="left" dataKey="activees" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={14} name="Activées" />
                <Line yAxisId="right" type="monotone" dataKey="taux" stroke="hsl(var(--kpi-warning))" strokeWidth={2} dot={{ r: 3 }} name="Taux (%)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Commandées</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Activées</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-kpi-warning" /> Taux %</span>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </AnimatedPage>
);

export default CycleVieCartes;
