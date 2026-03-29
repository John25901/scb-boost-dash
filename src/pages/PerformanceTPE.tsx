import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import {
  Monitor, AlertTriangle, TrendingUp, TrendingDown, Search,
  MapPin, Store, Wifi, WifiOff, Activity, Eye, Star,
  Phone, Building2, BarChart3, Zap, ArrowUpRight
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

// === TPE DATA ===
const tpeStatut = [
  { name: "Actifs (TX > 0)", value: 68, color: "hsl(var(--accent))" },
  { name: "Faible activité", value: 18, color: "hsl(var(--kpi-warning))" },
  { name: "Dormants (0 TX)", value: 14, color: "hsl(var(--kpi-negative))" },
];

const tpeDormants = [
  { id: "TPE-0145", commercant: "Boulangerie Le Bon Pain", ville: "Douala", derniere_tx: "2025-11-15", jours_inactif: 134, revenu_perdu: 45000 },
  { id: "TPE-0287", commercant: "Pressing Express", ville: "Yaoundé", derniere_tx: "2025-12-02", jours_inactif: 117, revenu_perdu: 32000 },
  { id: "TPE-0312", commercant: "Pharmacie Centrale", ville: "Bafoussam", derniere_tx: "2025-10-20", jours_inactif: 160, revenu_perdu: 68000 },
  { id: "TPE-0098", commercant: "Station Total Akwa", ville: "Douala", derniere_tx: "2026-01-05", jours_inactif: 83, revenu_perdu: 120000 },
  { id: "TPE-0456", commercant: "Hôtel Mont Fébé", ville: "Yaoundé", derniere_tx: "2025-09-28", jours_inactif: 182, revenu_perdu: 210000 },
  { id: "TPE-0523", commercant: "Supermarché Santa Lucia", ville: "Douala", derniere_tx: "2026-02-10", jours_inactif: 47, revenu_perdu: 28000 },
];

const topCommercants = [
  { rang: 1, commercant: "Carrefour Market Douala", tx_mois: 4520, volume: 28500000, frais_generes: 342000, tendance: "up" },
  { rang: 2, commercant: "Mahima Supermarchés", tx_mois: 3800, volume: 22100000, frais_generes: 265200, tendance: "up" },
  { rang: 3, commercant: "SABC (Brasseries)", tx_mois: 3200, volume: 18900000, frais_generes: 226800, tendance: "stable" },
  { rang: 4, commercant: "Casino Supermarché", tx_mois: 2950, volume: 17200000, frais_generes: 206400, tendance: "up" },
  { rang: 5, commercant: "Hôtel Hilton Yaoundé", tx_mois: 2400, volume: 15800000, frais_generes: 189600, tendance: "down" },
];

const flopCommercants = [
  { rang: 1, commercant: "Pressing Express", tx_mois: 8, volume: 52000, frais_generes: 624, tendance: "down" },
  { rang: 2, commercant: "Boutique Chez Mama", tx_mois: 12, volume: 78000, frais_generes: 936, tendance: "down" },
  { rang: 3, commercant: "Salon de coiffure Grâce", tx_mois: 15, volume: 95000, frais_generes: 1140, tendance: "down" },
  { rang: 4, commercant: "Quincaillerie du Coin", tx_mois: 22, volume: 148000, frais_generes: 1776, tendance: "stable" },
  { rang: 5, commercant: "Librairie Universitaire", tx_mois: 28, volume: 185000, frais_generes: 2220, tendance: "up" },
];

const tpeParZone = [
  { zone: "Douala", total: 285, actifs: 210, dormants: 35, taux_activite: 73.7 },
  { zone: "Yaoundé", total: 220, actifs: 168, dormants: 25, taux_activite: 76.4 },
  { zone: "Bafoussam", total: 65, actifs: 42, dormants: 12, taux_activite: 64.6 },
  { zone: "Garoua", total: 45, actifs: 28, dormants: 10, taux_activite: 62.2 },
  { zone: "Limbé", total: 35, actifs: 25, dormants: 5, taux_activite: 71.4 },
  { zone: "Autres", total: 50, actifs: 32, dormants: 8, taux_activite: 64.0 },
];

const volumeTPEMensuel = [
  { mois: "Jan", volume: 820, nombre_tx: 32000 },
  { mois: "Fév", volume: 880, nombre_tx: 34500 },
  { mois: "Mar", volume: 950, nombre_tx: 38200 },
  { mois: "Avr", volume: 920, nombre_tx: 36800 },
  { mois: "Mai", volume: 1050, nombre_tx: 42500 },
  { mois: "Juin", volume: 1180, nombre_tx: 48200 },
];

// Feux tricolores alertes
const alertesSante = [
  { commercant: "Hôtel Hilton Yaoundé", statut: "orange", message: "Chute de 32% du volume sur 3 mois", action: "Contacter le gérant" },
  { commercant: "Station Total Akwa", statut: "rouge", message: "0 transaction depuis 83 jours", action: "Récupérer ou réallouer le TPE" },
  { commercant: "Hôtel Mont Fébé", statut: "rouge", message: "0 transaction depuis 182 jours", action: "Visite terrain urgente" },
  { commercant: "Casino Supermarché", statut: "vert", message: "Volume en hausse de 15% ce mois", action: "Proposer un 2e TPE" },
  { commercant: "Carrefour Market", statut: "vert", message: "Top performeur — volume stable", action: "Fidélisation partenaire" },
  { commercant: "Pharmacie Centrale", statut: "rouge", message: "0 transaction depuis 160 jours", action: "Réallocation recommandée" },
];

const formatCFA = (n: number) => `₣${(n / 1000000).toFixed(1)}M`;

const PerformanceTPE = () => {
  const [searchTpe, setSearchTpe] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<typeof topCommercants[0] | null>(null);

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Performance TPE & Commerçants</h1>
          <p className="text-xs text-muted-foreground">Acquisition, terminaux dormants, Top/Flop commerçants, feux tricolores — Monétique SCB</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "TPE Déployés", value: "700", icon: Monitor, change: "+12%" },
            { label: "TPE Actifs", value: "505 (72%)", icon: Activity, change: "+5pts" },
            { label: "Dormants (0 TX)", value: "98 (14%)", icon: WifiOff, change: "-3pts" },
            { label: "Volume TX/mois", value: "₣1.18Mrd", icon: TrendingUp, change: "+18%" },
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

        <Tabs defaultValue="dormants" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="dormants" className="text-xs">Terminaux Dormants</TabsTrigger>
            <TabsTrigger value="topflop" className="text-xs">Top/Flop Commerçants</TabsTrigger>
            <TabsTrigger value="alertes" className="text-xs">Feux Tricolores</TabsTrigger>
            <TabsTrigger value="fiche360" className="text-xs">Fiche 360° Commerçant</TabsTrigger>
          </TabsList>

          {/* DORMANTS */}
          <TabsContent value="dormants" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Statut du Parc TPE</h3>
                <p className="text-[10px] text-muted-foreground mb-3">Répartition par niveau d'activité</p>
                <div className="w-36 h-36 mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={tpeStatut} cx="50%" cy="50%" innerRadius={30} outerRadius={58} dataKey="value" strokeWidth={0}>
                        {tpeStatut.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-3">
                  {tpeStatut.map(s => (
                    <div key={s.name} className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-muted-foreground">{s.name}</span>
                      </span>
                      <span className="font-semibold text-card-foreground">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 col-span-1 lg:col-span-2">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-3 flex items-center gap-2">
                  <WifiOff size={14} className="text-kpi-negative" /> Terminaux Dormants — Action Requise
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-[10px] text-muted-foreground">
                        <th className="text-left py-2">ID TPE</th>
                        <th className="text-left py-2">Commerçant</th>
                        <th className="text-left py-2">Ville</th>
                        <th className="text-right py-2">Inactif (j)</th>
                        <th className="text-right py-2">Revenu perdu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tpeDormants.map(t => (
                        <tr key={t.id} className="border-b border-border/30 hover:bg-muted/30">
                          <td className="py-2 text-xs font-mono text-primary">{t.id}</td>
                          <td className="py-2 text-xs text-card-foreground">{t.commercant}</td>
                          <td className="py-2 text-xs text-muted-foreground">{t.ville}</td>
                          <td className="py-2 text-right text-xs">
                            <Badge className={`text-[8px] ${t.jours_inactif > 120 ? "bg-kpi-negative/10 text-kpi-negative" : "bg-kpi-warning/10 text-kpi-warning"}`}>
                              {t.jours_inactif}j
                            </Badge>
                          </td>
                          <td className="py-2 text-right text-xs font-medium text-kpi-negative">₣{(t.revenu_perdu / 1000).toFixed(0)}K</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 p-3 bg-kpi-negative/5 border border-kpi-negative/20 rounded-lg">
                  <p className="text-[10px] text-kpi-negative font-medium">
                    Revenu perdu total estimé : ₣{(tpeDormants.reduce((s, t) => s + t.revenu_perdu, 0) / 1000).toFixed(0)}K/mois. 
                    Recommandation : récupérer les 3 TPE inactifs {">"} 120 jours et les réallouer.
                  </p>
                </div>
              </Card>
            </div>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">TPE par Zone Géographique</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={tpeParZone}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="zone" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="actifs" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={14} name="Actifs" />
                  <Bar dataKey="dormants" fill="hsl(var(--kpi-negative))" radius={[4, 4, 0, 0]} barSize={14} name="Dormants" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* TOP/FLOP */}
          <TabsContent value="topflop" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-3 flex items-center gap-2">
                  <Star size={14} className="text-kpi-positive" /> Top 5 Commerçants
                </h3>
                <div className="space-y-2">
                  {topCommercants.map(c => (
                    <div key={c.rang} className="p-3 bg-accent/5 border border-accent/10 rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                      onClick={() => setSelectedMerchant(c)}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-kpi-positive/10 flex items-center justify-center text-[10px] font-bold text-kpi-positive">#{c.rang}</span>
                          <span className="text-xs font-medium text-card-foreground">{c.commercant}</span>
                        </div>
                        <ArrowUpRight size={12} className="text-kpi-positive" />
                      </div>
                      <div className="flex gap-4 text-[10px] text-muted-foreground">
                        <span>{c.tx_mois.toLocaleString("fr-FR")} TX/mois</span>
                        <span>{formatCFA(c.volume)}</span>
                        <span className="text-kpi-positive font-medium">₣{(c.frais_generes / 1000).toFixed(0)}K frais</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-3 flex items-center gap-2">
                  <TrendingDown size={14} className="text-kpi-negative" /> Flop 5 Commerçants
                </h3>
                <div className="space-y-2">
                  {flopCommercants.map(c => (
                    <div key={c.rang} className="p-3 bg-kpi-negative/5 border border-kpi-negative/10 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-kpi-negative/10 flex items-center justify-center text-[10px] font-bold text-kpi-negative">#{c.rang}</span>
                          <span className="text-xs font-medium text-card-foreground">{c.commercant}</span>
                        </div>
                        <TrendingDown size={12} className="text-kpi-negative" />
                      </div>
                      <div className="flex gap-4 text-[10px] text-muted-foreground">
                        <span>{c.tx_mois} TX/mois</span>
                        <span>₣{(c.volume / 1000).toFixed(0)}K</span>
                        <span className="text-kpi-negative">₣{c.frais_generes.toLocaleString("fr-FR")} frais</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Volume TPE Mensuel</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={volumeTPEMensuel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} name="Volume (M FCFA)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* FEUX TRICOLORES */}
          <TabsContent value="alertes" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Système de Feux Tricolores — Santé Commerçants</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Alertes proactives basées sur l'activité des 30 derniers jours</p>
              <div className="space-y-2">
                {alertesSante.map((a, i) => (
                  <div key={i} className={`p-3 rounded-lg border flex items-center gap-3 ${
                    a.statut === "rouge" ? "bg-kpi-negative/5 border-kpi-negative/20" :
                    a.statut === "orange" ? "bg-kpi-warning/5 border-kpi-warning/20" :
                    "bg-kpi-positive/5 border-kpi-positive/20"
                  }`}>
                    <div className={`h-4 w-4 rounded-full shrink-0 ${
                      a.statut === "rouge" ? "bg-kpi-negative" :
                      a.statut === "orange" ? "bg-kpi-warning" :
                      "bg-kpi-positive"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-card-foreground">{a.commercant}</span>
                        <Badge variant="outline" className="text-[8px]">{a.statut.toUpperCase()}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{a.message}</p>
                    </div>
                    <Badge className={`text-[8px] shrink-0 ${
                      a.statut === "rouge" ? "bg-kpi-negative/10 text-kpi-negative" :
                      a.statut === "orange" ? "bg-kpi-warning/10 text-kpi-warning" :
                      "bg-kpi-positive/10 text-kpi-positive"
                    }`}>{a.action}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* FICHE 360° */}
          <TabsContent value="fiche360" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Search size={14} className="text-muted-foreground" />
                <Input
                  placeholder="Rechercher un commerçant..."
                  value={searchTpe}
                  onChange={e => setSearchTpe(e.target.value)}
                  className="h-8 text-xs max-w-sm"
                />
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-4 flex items-center gap-2">
                <Store size={14} className="text-primary" /> Vision 360° — {selectedMerchant?.commercant || "Carrefour Market Douala"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "TX / mois", value: (selectedMerchant?.tx_mois || 4520).toLocaleString("fr-FR"), icon: Activity },
                  { label: "Volume mensuel", value: formatCFA(selectedMerchant?.volume || 28500000), icon: BarChart3 },
                  { label: "Frais générés", value: `₣${((selectedMerchant?.frais_generes || 342000) / 1000).toFixed(0)}K`, icon: Zap },
                  { label: "TPE actifs", value: "3", icon: Monitor },
                ].map(m => (
                  <div key={m.label} className="p-3 bg-muted/30 rounded-lg flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <m.icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">{m.label}</p>
                      <p className="font-display font-bold text-card-foreground text-sm">{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="text-xs font-semibold text-card-foreground mb-2">Informations Générales</h4>
                  <div className="space-y-1.5">
                    {[
                      { label: "Secteur", value: "Grande Distribution" },
                      { label: "Code MCC", value: "5411 — Grocery Stores" },
                      { label: "Ville", value: "Douala — Akwa" },
                      { label: "Date mise en service", value: "15/03/2023" },
                      { label: "Gestionnaire compte", value: "M. Nkotto Pascal" },
                      { label: "Contact", value: "+237 6XX XXX XXX" },
                    ].map(i => (
                      <div key={i.label} className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">{i.label}</span>
                        <span className="text-card-foreground font-medium">{i.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="text-xs font-semibold text-card-foreground mb-2">Performance & Rentabilité</h4>
                  <div className="space-y-1.5">
                    {[
                      { label: "Rentabilité annuelle", value: "₣4.1M", badge: "Élevée" },
                      { label: "Taux d'activité", value: "98.5%", badge: "Excellent" },
                      { label: "Ticket moyen", value: "₣6 308", badge: null },
                      { label: "TX internationales", value: "12%", badge: null },
                      { label: "Taux de refus", value: "0.8%", badge: "Bon" },
                      { label: "Score fidélité", value: "92/100", badge: "Top Partner" },
                    ].map(p => (
                      <div key={p.label} className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground">{p.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-card-foreground font-medium">{p.value}</span>
                          {p.badge && <Badge className="text-[7px] bg-kpi-positive/10 text-kpi-positive">{p.badge}</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default PerformanceTPE;
