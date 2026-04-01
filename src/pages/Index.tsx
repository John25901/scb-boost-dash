import { useState, useEffect } from "react";
import { Users, Zap, TrendingUp, Wallet, CreditCard, BarChart3, ArrowUpRight, ArrowDownRight, Landmark, PiggyBank, ExternalLink, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import KpiCard from "@/components/KpiCard";
import SatisfactionChart from "@/components/SatisfactionChart";
import ChurnPredictionChart from "@/components/ChurnPredictionChart";
import RecentAlerts from "@/components/RecentAlerts";
import AnimatedPage from "@/components/AnimatedPage";
import FilterBar, { type FilterTag } from "@/components/FilterBar";
import ExportToolbar from "@/components/ExportToolbar";

// === NEWS CAROUSEL ===
const newsItems = [
  {
    id: 1,
    titre: "GIMAC : +28% de transactions inter-bancaires au Cameroun en Q1 2026",
    resume: "Le volume des transactions GIMAC a bondi de 28% ce trimestre, portées par l'interopérabilité mobile money. SCB capte 18% du flux régional CEMAC.",
    source: "BEAC - Rapport Trimestriel",
    url: "https://www.beac.int",
    date: "28 Mars 2026",
    kpi_impact: "TX GIMAC SCB : 12 400/mois (+32% vs KPI cible)",
    tag: "GIMAC"
  },
  {
    id: 2,
    titre: "Visa : Déploiement du paiement sans contact en Afrique Centrale",
    resume: "Visa annonce l'extension du tap-to-pay à 15 000 TPE supplémentaires dans la zone CEMAC d'ici fin 2026. Opportunité pour le parc SCB.",
    source: "Visa Inc. Press Release",
    url: "https://www.visa.com",
    date: "25 Mars 2026",
    kpi_impact: "Potentiel : +35% de TX TPE si migration sans-contact",
    tag: "International"
  },
  {
    id: 3,
    titre: "COBAC : Nouvelles directives sur la classification des risques monétiques",
    resume: "La COBAC impose un reporting mensuel des fraudes carte > 500 000 FCFA. Impact direct sur le module de détection SCB.",
    source: "Commission Bancaire Afrique Centrale",
    url: "https://www.cobac.org",
    date: "22 Mars 2026",
    kpi_impact: "Conformité fraude : 98.2% (seuil COBAC : 95%)",
    tag: "Réglementation"
  },
  {
    id: 4,
    titre: "MTN MoMo : Partenariat banque-mobile money pour les paiements marchands",
    resume: "Accord-cadre entre MTN Cameroun et les banques CEMAC pour l'interopérabilité MoMo → Carte → TPE.",
    source: "MTN Cameroon / APECCAM",
    url: "https://www.mtn.cm",
    date: "20 Mars 2026",
    kpi_impact: "ratio_momo_vs_bancaire moyen SCB : 0.42 (cible : 0.6)",
    tag: "Mobile Money"
  },
];

// === DONNÉES ===
const encoursER = [
  { rubrique: "Crédits décaissement", emplois: 42500, ressources: 0 },
  { rubrique: "Comptes ordinaires", emplois: 0, ressources: 68200 },
  { rubrique: "DAT / CAT", emplois: 0, ressources: 28500 },
  { rubrique: "Cautions & Avals", emplois: 12800, ressources: 0 },
  { rubrique: "Épargne", emplois: 0, ressources: 15600 },
];

const collecteData = [
  { mois: "Jan", collecte: 1200, cumulee: 1200 },
  { mois: "Fév", collecte: 980, cumulee: 2180 },
  { mois: "Mar", collecte: 1450, cumulee: 3630 },
  { mois: "Avr", collecte: 870, cumulee: 4500 },
  { mois: "Mai", collecte: 1320, cumulee: 5820 },
  { mois: "Juin", collecte: 1580, cumulee: 7400 },
];

const pnbData = [
  { mois: "Jan", commissions: 1850, interets: 3200, change: 420, total: 5470 },
  { mois: "Fév", commissions: 1920, interets: 3350, change: 380, total: 5650 },
  { mois: "Mar", commissions: 2100, interets: 3180, change: 510, total: 5790 },
  { mois: "Avr", commissions: 1980, interets: 3420, change: 450, total: 5850 },
  { mois: "Mai", commissions: 2250, interets: 3500, change: 520, total: 6270 },
  { mois: "Juin", commissions: 2380, interets: 3650, change: 490, total: 6520 },
];

const pnbDistrib = [
  { name: "Intérêts", value: 55, color: "hsl(var(--primary))" },
  { name: "Commissions Monétique", value: 32, color: "hsl(var(--accent))" },
  { name: "Change", value: 8, color: "hsl(var(--kpi-warning))" },
  { name: "Autres", value: 5, color: "hsl(var(--muted-foreground))" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterTags, setFilterTags] = useState<FilterTag[]>([]);
  const [newsIndex, setNewsIndex] = useState(0);

  // Auto-carousel
  useEffect(() => {
    const timer = setInterval(() => setNewsIndex(i => (i + 1) % newsItems.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const addTag = (tag: FilterTag) => setFilterTags(prev => prev.some(t => t.id === tag.id) ? prev : [...prev, tag]);
  const removeTag = (id: string) => setFilterTags(prev => prev.filter(t => t.id !== id));
  const currentNews = newsItems[newsIndex];

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">SCB Monétique Intelligence 360°</h1>
            <p className="text-xs text-muted-foreground">Pilotage stratégique — Big Data & ML · Monnaie : FCFA (XAF)</p>
          </div>
        </div>

        {/* FILTER BAR */}
        <Card className="p-3">
          <FilterBar tags={filterTags} onAddTag={addTag} onRemoveTag={removeTag} onClearAll={() => setFilterTags([])} />
        </Card>

        {/* NEWS CAROUSEL */}
        <Card className="p-0 overflow-hidden border-accent/20">
          <div className="flex items-stretch">
            <div className="bg-accent/10 px-3 flex items-center">
              <Newspaper size={18} className="text-accent" />
            </div>
            <div className="flex-1 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="text-[8px] bg-accent/10 text-accent border-accent/20">{currentNews.tag}</Badge>
                    <span className="text-[10px] text-muted-foreground">{currentNews.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-card-foreground leading-tight mb-1">{currentNews.titre}</h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{currentNews.resume}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-[9px] bg-primary/5 text-primary">{currentNews.kpi_impact}</Badge>
                    <a href={currentNews.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-accent hover:underline flex items-center gap-1">
                      {currentNews.source} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setNewsIndex(i => (i - 1 + newsItems.length) % newsItems.length)}>
                    <ChevronLeft size={12} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setNewsIndex(i => (i + 1) % newsItems.length)}>
                    <ChevronRight size={12} />
                  </Button>
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                {newsItems.map((_, i) => (
                  <button key={i} onClick={() => setNewsIndex(i)}
                    className={`h-1 rounded-full transition-all ${i === newsIndex ? "w-6 bg-accent" : "w-2 bg-border"}`} />
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="text-xs">Vue Synthèse</TabsTrigger>
            <TabsTrigger value="comptable" className="text-xs">Données Comptables</TabsTrigger>
            <TabsTrigger value="pnb" className="text-xs">PNB & Revenus</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <KpiCard title="Cartes Vivantes" value="18 450" change={8.2} changeLabel="vs trim." icon={<CreditCard size={18} />} />
              <KpiCard title="Volume TX/mois" value="₣12.4Mrd" change={18} changeLabel="vs trim." icon={<TrendingUp size={18} />} />
              <KpiCard title="TPE Actifs" value="505 (72%)" change={5} changeLabel="vs trim." icon={<BarChart3 size={18} />} />
              <KpiCard title="PNB Monétique" value="₣2.38Mrd" change={12.3} changeLabel="vs M-1" icon={<Wallet size={18} />} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <KpiCard title="TX GIMAC" value="12 400" change={32} changeLabel="vs trim." icon={<Zap size={18} />} />
              <KpiCard title="Taux Réconciliation" value="99.86%" change={0.14} changeLabel="pts" icon={<TrendingUp size={18} />} />
              <KpiCard title="Porteurs Actifs" value="15 620" change={5.4} changeLabel="vs trim." icon={<Users size={18} />} />
              <KpiCard title="Terminaux Dormants" value="98 (14%)" change={-3} changeLabel="pts" icon={<BarChart3 size={18} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <SatisfactionChart />
              <Card className="p-4 col-span-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-semibold text-card-foreground text-sm">Répartition PNB</h3>
                  <ExportToolbar compact data={pnbDistrib} title="Répartition PNB" />
                </div>
                <p className="text-[10px] text-muted-foreground mb-3">Structure des revenus monétiques</p>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pnbDistrib} cx="50%" cy="50%" innerRadius={25} outerRadius={48} dataKey="value" strokeWidth={0}>
                          {pnbDistrib.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {pnbDistrib.map(r => (
                      <div key={r.name} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                          <span className="text-muted-foreground">{r.name}</span>
                        </span>
                        <span className="font-semibold text-card-foreground">{r.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChurnPredictionChart />
              <RecentAlerts />
            </div>
          </TabsContent>

          <TabsContent value="comptable" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Encours Emplois", value: "₣58.5Mrd", icon: ArrowUpRight, change: "+4.1%" },
                { label: "Encours Ressources", value: "₣116.4Mrd", icon: ArrowDownRight, change: "+5.8%" },
                { label: "Collecte Cumulée", value: "₣7.4Mrd", icon: PiggyBank, change: "+12%" },
                { label: "Solde Moyen Créditeur", value: "₣548M", icon: Landmark, change: "+3.2%" },
              ].map(k => (
                <Card key={k.label} className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <k.icon size={16} className="text-primary" />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{k.label}</p>
                  </div>
                  <p className="text-lg font-display font-bold text-card-foreground">{k.value}</p>
                  <p className="text-[10px] text-kpi-positive font-medium">{k.change} vs trim.</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-semibold text-card-foreground text-sm">Encours par Rubrique E/R</h3>
                  <ExportToolbar compact data={encoursER} title="Encours E/R" />
                </div>
                <p className="text-[10px] text-muted-foreground mb-4">Ventilation Emplois / Ressources (en M FCFA)</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={encoursER}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="rubrique" tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))" angle={-15} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="emplois" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={16} name="Emplois" />
                    <Bar dataKey="ressources" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={16} name="Ressources" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-semibold text-card-foreground text-sm">Collecte Mensuelle & Cumulée</h3>
                  <ExportToolbar compact data={collecteData} title="Collecte" />
                </div>
                <p className="text-[10px] text-muted-foreground mb-4">Collecte de ressources (en M FCFA)</p>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={collecteData}>
                    <defs>
                      <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="cumulee" stroke="hsl(var(--accent))" fill="url(#colGrad)" strokeWidth={2} name="Cumulée" />
                    <Bar dataKey="collecte" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={14} name="Mensuelle" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pnb" className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-card-foreground text-sm">Évolution PNB Mensuel</h3>
                <ExportToolbar compact data={pnbData} title="PNB Mensuel" />
              </div>
              <p className="text-[10px] text-muted-foreground mb-4">Commissions, intérêts et change (en M FCFA)</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pnbData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="commissions" stackId="a" fill="hsl(var(--accent))" name="Commissions" />
                  <Bar dataKey="interets" stackId="a" fill="hsl(var(--primary))" name="Intérêts" />
                  <Bar dataKey="change" stackId="a" fill="hsl(var(--kpi-warning))" radius={[4, 4, 0, 0]} name="Change" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default Index;
