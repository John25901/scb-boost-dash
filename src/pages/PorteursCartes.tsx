import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap
} from "recharts";
import {
  CreditCard, Users, TrendingUp, Globe, MapPin, Filter,
  ArrowUpRight, ArrowDownRight, Smartphone, Wallet, BarChart3,
  Activity, Eye
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

// === DONNÉES PORTEURS ===
const porteurSegmentation = [
  { segment: "Premium", porteurs: 2850, volume_moyen: 1250000, pct_retraits: 35, pct_paiements: 65 },
  { segment: "Business", porteurs: 5420, volume_moyen: 820000, pct_retraits: 45, pct_paiements: 55 },
  { segment: "Standard", porteurs: 7200, volume_moyen: 380000, pct_retraits: 72, pct_paiements: 28 },
  { segment: "Prépayée", porteurs: 2980, volume_moyen: 125000, pct_retraits: 85, pct_paiements: 15 },
];

const usageHabitudes = [
  { mois: "Jan", retraits_dab: 28500, paiements_tpe: 12400, paiements_web: 5200, international: 1800 },
  { mois: "Fév", retraits_dab: 26800, paiements_tpe: 13200, paiements_web: 5800, international: 2100 },
  { mois: "Mar", retraits_dab: 30200, paiements_tpe: 14800, paiements_web: 6500, international: 2400 },
  { mois: "Avr", retraits_dab: 27900, paiements_tpe: 15200, paiements_web: 7200, international: 2600 },
  { mois: "Mai", retraits_dab: 29400, paiements_tpe: 16500, paiements_web: 8100, international: 2800 },
  { mois: "Juin", retraits_dab: 31200, paiements_tpe: 18200, paiements_web: 9400, international: 3200 },
];

const typesCartes = [
  { name: "Visa Classic", value: 42, color: "hsl(var(--primary))" },
  { name: "Visa Gold", value: 18, color: "hsl(var(--accent))" },
  { name: "Mastercard", value: 15, color: "hsl(var(--kpi-warning))" },
  { name: "Prépayée", value: 16, color: "hsl(var(--chart-4))" },
  { name: "Visa Business", value: 9, color: "hsl(var(--muted-foreground))" },
];

const geoData = [
  { zone: "Douala", porteurs: 7200, volume: 4800, pct: 39 },
  { zone: "Yaoundé", porteurs: 5800, volume: 3900, pct: 31 },
  { zone: "Bafoussam", porteurs: 1850, volume: 1200, pct: 10 },
  { zone: "Garoua", porteurs: 1200, volume: 680, pct: 6.5 },
  { zone: "Limbé", porteurs: 980, volume: 520, pct: 5.3 },
  { zone: "Autres", porteurs: 1420, volume: 720, pct: 8.2 },
];

const usageLocalVsInternational = [
  { mois: "Jan", local: 85, international: 15 },
  { mois: "Fév", local: 83, international: 17 },
  { mois: "Mar", local: 81, international: 19 },
  { mois: "Avr", local: 80, international: 20 },
  { mois: "Mai", local: 79, international: 21 },
  { mois: "Juin", local: 77, international: 23 },
];

const radarSegment = [
  { axis: "Retraits DAB", Premium: 35, Business: 45, Standard: 72, Prépayée: 85 },
  { axis: "Paiements TPE", Premium: 65, Business: 55, Standard: 28, Prépayée: 15 },
  { axis: "E-commerce", Premium: 78, Business: 42, Standard: 12, Prépayée: 5 },
  { axis: "International", Premium: 62, Business: 38, Standard: 8, Prépayée: 2 },
  { axis: "Sans contact", Premium: 55, Business: 30, Standard: 10, Prépayée: 3 },
  { axis: "Mobile Pay", Premium: 48, Business: 52, Standard: 45, Prépayée: 35 },
];

const transactionsParJour = [
  { jour: "Lun", volume: 4200, montant: 185 },
  { jour: "Mar", volume: 4500, montant: 198 },
  { jour: "Mer", volume: 4800, montant: 212 },
  { jour: "Jeu", volume: 4600, montant: 205 },
  { jour: "Ven", volume: 5800, montant: 268 },
  { jour: "Sam", volume: 6200, montant: 310 },
  { jour: "Dim", volume: 3200, montant: 142 },
];

type ChartMetric = "volume" | "nombre" | "montant_moyen";

const PorteursCartes = () => {
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");
  const [metric, setMetric] = useState<ChartMetric>("volume");
  const [zone, setZone] = useState("all");

  const filteredGeo = zone === "all" ? geoData : geoData.filter(g => g.zone === zone);

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Analyse Porteurs de Cartes</h1>
          <p className="text-xs text-muted-foreground">Segmentation dynamique, habitudes d'usage, analyse géographique — Monétique SCB Cameroun</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Cartes Vivantes", value: "18 450", change: "+8.2%", icon: CreditCard },
            { label: "Porteurs Actifs", value: "15 620", change: "+5.4%", icon: Users },
            { label: "TX/mois (volume)", value: "₣12.4Mrd", change: "+18%", icon: TrendingUp },
            { label: "% Paiements vs Retraits", value: "38% / 62%", change: "+4pts", icon: BarChart3 },
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

        <Tabs defaultValue="segmentation" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="segmentation" className="text-xs">Segmentation</TabsTrigger>
            <TabsTrigger value="usage" className="text-xs">Habitudes d'Usage</TabsTrigger>
            <TabsTrigger value="geo" className="text-xs">Analyse Géographique</TabsTrigger>
            <TabsTrigger value="temporal" className="text-xs">Analyse Temporelle</TabsTrigger>
          </TabsList>

          {/* SEGMENTATION */}
          <TabsContent value="segmentation" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Segmentation par Type de Carte</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Répartition du parc de cartes vivantes</p>
                <div className="flex items-center gap-6">
                  <div className="w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={typesCartes} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" strokeWidth={0}>
                          {typesCartes.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {typesCartes.map(t => (
                      <div key={t.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                          <span className="text-muted-foreground">{t.name}</span>
                        </span>
                        <span className="font-semibold text-card-foreground">{t.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Profil Radar par Segment</h3>
                <p className="text-[10px] text-muted-foreground mb-3">Habitudes d'usage multi-dimensionnelles</p>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarSegment}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                    <Radar name="Premium" dataKey="Premium" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                    <Radar name="Business" dataKey="Business" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.1} />
                    <Radar name="Standard" dataKey="Standard" stroke="hsl(var(--kpi-warning))" fill="hsl(var(--kpi-warning))" fillOpacity={0.1} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 text-[10px] text-muted-foreground justify-center">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Premium</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Business</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-kpi-warning" /> Standard</span>
                </div>
              </Card>
            </div>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Détail par Segment Porteur</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-[10px] text-muted-foreground">
                      <th className="text-left py-2">Segment</th>
                      <th className="text-right py-2">Porteurs</th>
                      <th className="text-right py-2">Vol. Moyen/mois</th>
                      <th className="text-right py-2">% Retraits</th>
                      <th className="text-right py-2">% Paiements</th>
                      <th className="text-center py-2">Tendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {porteurSegmentation.map(s => (
                      <tr key={s.segment} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="py-2.5 text-xs font-medium text-card-foreground">
                          <Badge variant="outline" className="text-[9px]">{s.segment}</Badge>
                        </td>
                        <td className="py-2.5 text-right text-xs">{s.porteurs.toLocaleString("fr-FR")}</td>
                        <td className="py-2.5 text-right text-xs font-medium">₣{(s.volume_moyen / 1000).toFixed(0)}K</td>
                        <td className="py-2.5 text-right text-xs">{s.pct_retraits}%</td>
                        <td className="py-2.5 text-right text-xs">{s.pct_paiements}%</td>
                        <td className="py-2.5 text-center">
                          <ArrowUpRight size={14} className="text-kpi-positive inline" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* HABITUDES D'USAGE */}
          <TabsContent value="usage" className="space-y-4">
            {/* Filtres dynamiques */}
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">Filtres :</span>
                </div>
                <Select value={chartType} onValueChange={(v: "bar" | "line" | "area") => setChartType(v)}>
                  <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Barres</SelectItem>
                    <SelectItem value="line">Lignes</SelectItem>
                    <SelectItem value="area">Aires</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={metric} onValueChange={(v: ChartMetric) => setMetric(v)}>
                  <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volume">Volume (FCFA)</SelectItem>
                    <SelectItem value="nombre">Nombre TX</SelectItem>
                    <SelectItem value="montant_moyen">Montant Moyen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Répartition des Usages Carte</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Retraits DAB vs Paiements TPE vs E-commerce vs International</p>
                <ResponsiveContainer width="100%" height={280}>
                  {chartType === "bar" ? (
                    <BarChart data={usageHabitudes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                      <Bar dataKey="retraits_dab" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={10} name="Retraits DAB" />
                      <Bar dataKey="paiements_tpe" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={10} name="Paiements TPE" />
                      <Bar dataKey="paiements_web" fill="hsl(var(--kpi-warning))" radius={[4, 4, 0, 0]} barSize={10} name="E-commerce" />
                      <Bar dataKey="international" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} barSize={10} name="International" />
                    </BarChart>
                  ) : chartType === "line" ? (
                    <LineChart data={usageHabitudes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                      <Line type="monotone" dataKey="retraits_dab" stroke="hsl(var(--primary))" strokeWidth={2} name="Retraits DAB" />
                      <Line type="monotone" dataKey="paiements_tpe" stroke="hsl(var(--accent))" strokeWidth={2} name="Paiements TPE" />
                      <Line type="monotone" dataKey="paiements_web" stroke="hsl(var(--kpi-warning))" strokeWidth={2} name="E-commerce" />
                      <Line type="monotone" dataKey="international" stroke="hsl(var(--chart-4))" strokeWidth={2} name="International" />
                    </LineChart>
                  ) : (
                    <AreaChart data={usageHabitudes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                      <Area type="monotone" dataKey="retraits_dab" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Retraits DAB" />
                      <Area type="monotone" dataKey="paiements_tpe" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} name="Paiements TPE" />
                      <Area type="monotone" dataKey="paiements_web" stackId="1" stroke="hsl(var(--kpi-warning))" fill="hsl(var(--kpi-warning))" fillOpacity={0.3} name="E-commerce" />
                      <Area type="monotone" dataKey="international" stackId="1" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.3} name="International" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Retraits DAB</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Paiements TPE</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-kpi-warning" /> E-commerce</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(var(--chart-4))" }} /> International</span>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Local vs International</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Évolution de la part des transactions internationales</p>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={usageLocalVsInternational}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="local" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Local" />
                    <Area type="monotone" dataKey="international" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} name="International" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground">
                    <strong className="text-card-foreground">Insight IA :</strong> La part des transactions internationales progresse de +8pts en 6 mois (15% → 23%). 
                    Recommandation : lancer une campagne de promotion des cartes Visa Gold pour les voyageurs d'affaires.
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* GÉO */}
          <TabsContent value="geo" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-muted-foreground" />
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Toutes zones" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes zones</SelectItem>
                    {geoData.map(g => <SelectItem key={g.zone} value={g.zone}>{g.zone}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Porteurs par Zone Géographique</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Concentration du parc de cartes</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={filteredGeo} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="zone" type="category" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={80} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="porteurs" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={16} name="Porteurs" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Répartition Géographique</h3>
                <div className="space-y-2">
                  {geoData.map(g => (
                    <div key={g.zone} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20">{g.zone}</span>
                      <div className="flex-1 h-4 bg-muted/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/80 rounded-full" style={{ width: `${g.pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-card-foreground w-12 text-right">{g.pct}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground">
                    <strong className="text-card-foreground">Concentration :</strong> Douala + Yaoundé = 70% du parc. 
                    Potentiel de développement : zones Nord (Garoua, Maroua) sous-pénétrées.
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* TEMPOREL */}
          <TabsContent value="temporal" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Transactions par Jour de Semaine</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Pattern de consommation hebdomadaire</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={transactionsParJour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="jour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} name="Nb TX" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground">
                    <strong className="text-card-foreground">Pattern détecté :</strong> Pic le samedi (marché), creux le dimanche. 
                    Les vendredis montrent une hausse liée aux salaires.
                  </p>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Montant Moyen TX par Jour (M FCFA)</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Ticket moyen de transaction carte</p>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={transactionsParJour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="jour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Line type="monotone" dataKey="montant" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4 }} name="Montant Moyen" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default PorteursCartes;
