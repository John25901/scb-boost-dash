import { useState } from "react";
import { Users, Zap, Clock, TrendingUp, Wallet, CreditCard, Building2, ArrowUpRight, ArrowDownRight, Landmark, BarChart3, PiggyBank, Banknote, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// === DONNÉES COMPTABLES ===
const encoursER = [
  { rubrique: "Crédits par décaissement", emplois: 42500, ressources: 0 },
  { rubrique: "Comptes ordinaires", emplois: 0, ressources: 68200 },
  { rubrique: "DAT / CAT", emplois: 0, ressources: 28500 },
  { rubrique: "Cautions & Avals", emplois: 12800, ressources: 0 },
  { rubrique: "Épargne", emplois: 0, ressources: 15600 },
  { rubrique: "Comptes d'ordre", emplois: 3200, ressources: 4100 },
];

const collecteData = [
  { mois: "Jan", collecte: 1200, cumulee: 1200 },
  { mois: "Fév", collecte: 980, cumulee: 2180 },
  { mois: "Mar", collecte: 1450, cumulee: 3630 },
  { mois: "Avr", collecte: 870, cumulee: 4500 },
  { mois: "Mai", collecte: 1320, cumulee: 5820 },
  { mois: "Juin", collecte: 1580, cumulee: 7400 },
];

const soldeMoyenData = [
  { mois: "Jan", crediteur: 485, debiteur: 62 },
  { mois: "Fév", crediteur: 502, debiteur: 58 },
  { mois: "Mar", crediteur: 518, debiteur: 55 },
  { mois: "Avr", crediteur: 495, debiteur: 70 },
  { mois: "Mai", crediteur: 530, debiteur: 48 },
  { mois: "Juin", crediteur: 548, debiteur: 45 },
];

// === COMPTES & DAT ===
const comptesData = [
  { mois: "Jan", ouvertures: 245, clotures: 42, stock: 127100 },
  { mois: "Fév", ouvertures: 280, clotures: 38, stock: 127342 },
  { mois: "Mar", ouvertures: 310, clotures: 55, stock: 127597 },
  { mois: "Avr", ouvertures: 265, clotures: 48, stock: 127814 },
  { mois: "Mai", ouvertures: 340, clotures: 35, stock: 128119 },
  { mois: "Juin", ouvertures: 355, clotures: 30, stock: 128444 },
];

const datData = [
  { mois: "Jan", souscriptions: 85, rachats: 12, stock_volume: 28500 },
  { mois: "Fév", souscriptions: 92, rachats: 15, stock_volume: 29200 },
  { mois: "Mar", souscriptions: 78, rachats: 8, stock_volume: 29800 },
  { mois: "Avr", souscriptions: 105, rachats: 20, stock_volume: 30400 },
  { mois: "Mai", souscriptions: 98, rachats: 10, stock_volume: 31100 },
  { mois: "Juin", souscriptions: 120, rachats: 14, stock_volume: 31900 },
];

// === CLIENTS ===
const clientsKPI = [
  { mois: "Jan", stock: 45200, conquete: 320, defection: 85, conquete_cmc_nul: 42 },
  { mois: "Fév", stock: 45435, conquete: 350, defection: 78, conquete_cmc_nul: 38 },
  { mois: "Mar", stock: 45707, conquete: 380, defection: 92, conquete_cmc_nul: 55 },
  { mois: "Avr", stock: 45995, conquete: 410, defection: 68, conquete_cmc_nul: 30 },
  { mois: "Mai", stock: 46337, conquete: 425, defection: 72, conquete_cmc_nul: 28 },
  { mois: "Juin", stock: 46690, conquete: 440, defection: 65, conquete_cmc_nul: 22 },
];

// === ENGAGEMENTS ===
const engagementsData = {
  cautions: { stock_nombre: 1245, stock_encours: 12800, production_nombre: 85, production_volume: 2400, mainlevees: 42 },
  credits: { autorisations_vivantes: 3420, encours_ligne: 42500, production_debloc: 580, impayés: 156, depassements: 45 },
};

// === REVENUS / PNB ===
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
  { name: "Commissions", value: 32, color: "hsl(var(--accent))" },
  { name: "Change", value: 8, color: "hsl(var(--kpi-warning))" },
  { name: "Autres", value: 5, color: "hsl(var(--muted-foreground))" },
];

// === PRODUITS ===
const produitsData = {
  monetique: { cartes_vivantes: 18450, production: 1250, renouvellements: 380, resiliations: 120, clients_equipes: 15200 },
  banqueDistance: { contrats_vivants: 32800, production: 2100, resiliations: 180, clients_equipes: 28500 },
  packages: { packs_vivants: 12400, production: 850, resiliations: 95 },
};

const formatM = (v: number) => `${(v / 1000).toFixed(1)}Mrd`;

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Dashboard Analytique SCB</h1>
          <p className="text-xs text-muted-foreground">KPIs bancaires, Expérience Client & Performance Opérationnelle — Big Data & ML</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="text-xs">Vue Synthèse</TabsTrigger>
            <TabsTrigger value="comptable" className="text-xs">Données Comptables</TabsTrigger>
            <TabsTrigger value="comptes" className="text-xs">Comptes & DAT</TabsTrigger>
            <TabsTrigger value="clients" className="text-xs">Clients</TabsTrigger>
            <TabsTrigger value="engagements" className="text-xs">Engagements</TabsTrigger>
            <TabsTrigger value="pnb" className="text-xs">PNB & Revenus</TabsTrigger>
            <TabsTrigger value="produits" className="text-xs">Produits</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <KpiCard title="Clients Actifs" value="128 444" change={3.2} changeLabel="vs trim." icon={<Users size={18} />} />
              <KpiCard title="Encours Ressources" value="₣116.4Mrd" change={5.8} changeLabel="vs trim." icon={<Wallet size={18} />} />
              <KpiCard title="Encours Emplois" value="₣58.5Mrd" change={4.1} changeLabel="vs trim." icon={<CreditCard size={18} />} />
              <KpiCard title="PNB Mensuel" value="₣6.52Mrd" change={12.3} changeLabel="vs M-1" icon={<TrendingUp size={18} />} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <KpiCard title="Score NPS" value="78/100" change={8.5} changeLabel="vs trim." icon={<TrendingUp size={18} />} />
              <KpiCard title="Conquête Nette" value="+375/mois" change={15} changeLabel="vs trim." icon={<Users size={18} />} />
              <KpiCard title="Transactions/Jour" value="48 320" change={22.1} changeLabel="vs trim." icon={<Zap size={18} />} />
              <KpiCard title="Taux Équipement" value="2.4 prod." change={6} changeLabel="vs trim." icon={<BarChart3 size={18} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <SatisfactionChart />
              <Card className="p-4 col-span-1">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Répartition PNB</h3>
                <p className="text-[10px] text-muted-foreground mb-3">Structure des revenus bancaires</p>
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

          {/* DONNÉES COMPTABLES */}
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
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Encours par Rubrique E/R</h3>
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
                <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Emplois</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Ressources</span>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Collecte Mensuelle & Cumulée</h3>
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

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Solde Moyen Mensuel</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Créditeur vs Débiteur (en M FCFA)</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={soldeMoyenData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="crediteur" stroke="hsl(var(--accent))" strokeWidth={2} name="Créditeur" />
                  <Line type="monotone" dataKey="debiteur" stroke="hsl(var(--kpi-negative))" strokeWidth={2} name="Débiteur" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* COMPTES & DAT */}
          <TabsContent value="comptes" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Stock Comptes à Vue", value: "128 444", change: "+1.1%" },
                { label: "Ouvertures Mois", value: "355", change: "+4.4%" },
                { label: "Stock DAT", value: "2 845", change: "+8.2%" },
                { label: "Encours DAT", value: "₣31.9Mrd", change: "+12%" },
              ].map(k => (
                <Card key={k.label} className="p-3">
                  <p className="text-[10px] text-muted-foreground">{k.label}</p>
                  <p className="text-lg font-display font-bold text-card-foreground">{k.value}</p>
                  <p className="text-[10px] text-kpi-positive font-medium">{k.change}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Comptes à Vue — Ouvertures vs Clôtures</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Dynamique de conquête nette mensuelle</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={comptesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="ouvertures" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={14} name="Ouvertures" />
                    <Bar dataKey="clotures" fill="hsl(var(--kpi-negative))" radius={[4, 4, 0, 0]} barSize={14} name="Clôtures" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">DAT — Souscriptions vs Rachats</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Dynamique des dépôts à terme</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={datData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="souscriptions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={14} name="Souscriptions" />
                    <Bar dataKey="rachats" fill="hsl(var(--kpi-warning))" radius={[4, 4, 0, 0]} barSize={14} name="Rachats" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* CLIENTS */}
          <TabsContent value="clients" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Stock Clients", value: "46 690", change: "+3.3%" },
                { label: "Conquête Mois", value: "440", change: "+3.5%" },
                { label: "Défection Mois", value: "65", change: "-9.7%" },
                { label: "Conquête CMC nul", value: "22", change: "-21%" },
              ].map(k => (
                <Card key={k.label} className="p-3">
                  <p className="text-[10px] text-muted-foreground">{k.label}</p>
                  <p className="text-lg font-display font-bold text-card-foreground">{k.value}</p>
                  <p className={`text-[10px] font-medium ${k.label === "Défection Mois" || k.label === "Conquête CMC nul" ? "text-kpi-positive" : "text-kpi-positive"}`}>{k.change}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Conquête vs Défection Clients</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Dynamique du portefeuille client</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={clientsKPI}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="conquete" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={14} name="Conquête" />
                    <Bar dataKey="defection" fill="hsl(var(--kpi-negative))" radius={[4, 4, 0, 0]} barSize={14} name="Défection" />
                    <Bar dataKey="conquete_cmc_nul" fill="hsl(var(--kpi-warning))" radius={[4, 4, 0, 0]} barSize={14} name="CMC nul" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Conquête</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-kpi-negative" /> Défection</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-kpi-warning" /> CMC nul</span>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Évolution Stock Clients</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Croissance nette du portefeuille</p>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={clientsKPI}>
                    <defs>
                      <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[45000, 47000]} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="stock" stroke="hsl(var(--primary))" fill="url(#stockGrad)" strokeWidth={2.5} name="Stock" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Indicateurs Clés Clients</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Définitions conformes au Dictionnaire des KPIs Groupe</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { kpi: "Stock clients", def: "Nombre d'ID internes détenant ≥ 1 contrat vivant. Multi-agences : compté une seule fois au niveau banque." },
                  { kpi: "Conquête clients", def: "Nouveaux clients sur la période. Un client qui ré-adhère après clôture totale est considéré nouveau." },
                  { kpi: "Défection clients", def: "Clients ayant clôturé leur dernier compte ouvert dans la période (tous contrats résiliés)." },
                  { kpi: "Conquête à CMC nul", def: "Nouveaux clients n'ayant jamais mouvementé leur(s) compte(s) depuis l'entrée en relation." },
                ].map(k => (
                  <div key={k.kpi} className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs font-semibold text-card-foreground mb-0.5">{k.kpi}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{k.def}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ENGAGEMENTS */}
          <TabsContent value="engagements" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Autorisations Vivantes", value: "3 420", icon: CreditCard },
                { label: "Encours Crédit", value: "₣42.5Mrd", icon: Banknote },
                { label: "Stock Cautions", value: "1 245", icon: Building2 },
                { label: "Impayés", value: "156", icon: Receipt },
              ].map(k => (
                <Card key={k.label} className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <k.icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">{k.label}</p>
                    <p className="text-sm font-display font-bold text-card-foreground">{k.value}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Crédits par Décaissement</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { kpi: "Autorisations vivantes", val: "3 420" },
                      { kpi: "Encours en ligne", val: "₣42 500M" },
                      { kpi: "Production déblocages (nombre)", val: "580" },
                      { kpi: "Production déblocages (volume)", val: "₣8 200M" },
                      { kpi: "Montant impayés", val: "₣1 560M" },
                      { kpi: "Lignes en dépassement", val: "45" },
                      { kpi: "Montant dépassements", val: "₣890M" },
                      { kpi: "Remboursements anticipés", val: "32" },
                      { kpi: "Contrats rejetés", val: "18" },
                    ].map(r => (
                      <tr key={r.kpi} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-xs text-muted-foreground">{r.kpi}</td>
                        <td className="py-2 text-right font-medium text-card-foreground text-xs">{r.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Cautions & Avals</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { kpi: "Stock cautions vivantes", val: "1 245" },
                      { kpi: "Encours en ligne", val: "₣12 800M" },
                      { kpi: "Production (nombre)", val: "85" },
                      { kpi: "Production (volume)", val: "₣2 400M" },
                      { kpi: "Main levées (nombre)", val: "42" },
                      { kpi: "Main levées (volume)", val: "₣1 200M" },
                      { kpi: "Taux d'utilisation", val: "72%" },
                    ].map(r => (
                      <tr key={r.kpi} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-xs text-muted-foreground">{r.kpi}</td>
                        <td className="py-2 text-right font-medium text-card-foreground text-xs">{r.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          </TabsContent>

          {/* PNB & REVENUS */}
          <TabsContent value="pnb" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "PNB Total (Cumul)", value: "₣35.6Mrd", change: "+8.5%" },
                { label: "Intérêts Nets", value: "₣20.3Mrd", change: "+6.2%" },
                { label: "Commissions", value: "₣12.5Mrd", change: "+11.3%" },
                { label: "Résultat Change", value: "₣2.8Mrd", change: "+3.8%" },
              ].map(k => (
                <Card key={k.label} className="p-3">
                  <p className="text-[10px] text-muted-foreground">{k.label}</p>
                  <p className="text-lg font-display font-bold text-card-foreground">{k.value}</p>
                  <p className="text-[10px] text-kpi-positive font-medium">{k.change}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Évolution PNB Mensuel</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Décomposition par nature de revenus (en M FCFA)</p>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={pnbData}>
                    <defs>
                      <linearGradient id="pnbGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="interets" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Intérêts" />
                    <Area type="monotone" dataKey="commissions" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} name="Commissions" />
                    <Area type="monotone" dataKey="change" stackId="1" stroke="hsl(var(--kpi-warning))" fill="hsl(var(--kpi-warning))" fillOpacity={0.3} name="Change" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Structure PNB</h3>
                <p className="text-[10px] text-muted-foreground mb-4">Répartition par nature</p>
                <div className="flex items-center gap-6">
                  <div className="w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pnbDistrib} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" strokeWidth={0}>
                          {pnbDistrib.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {pnbDistrib.map(r => (
                      <div key={r.name} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                          <span className="text-muted-foreground">{r.name}</span>
                        </span>
                        <span className="font-semibold text-card-foreground">{r.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* PRODUITS */}
          <TabsContent value="produits" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Monétique */}
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1 flex items-center gap-2">
                  <CreditCard size={14} className="text-primary" /> Monétique
                </h3>
                <p className="text-[10px] text-muted-foreground mb-3">Stock & production de cartes</p>
                <div className="space-y-2">
                  {[
                    { kpi: "Cartes vivantes", val: "18 450" },
                    { kpi: "Production cartes", val: "1 250" },
                    { kpi: "Renouvellements", val: "380" },
                    { kpi: "Résiliations", val: "120" },
                    { kpi: "Clients équipés", val: "15 200" },
                    { kpi: "Taux équipement", val: "32.5%" },
                  ].map(r => (
                    <div key={r.kpi} className="flex justify-between items-center py-1 border-b border-border/30">
                      <span className="text-[10px] text-muted-foreground">{r.kpi}</span>
                      <span className="text-xs font-medium text-card-foreground">{r.val}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Banque à Distance */}
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1 flex items-center gap-2">
                  <Zap size={14} className="text-primary" /> Banque à Distance
                </h3>
                <p className="text-[10px] text-muted-foreground mb-3">SMS Banking, Mobile, Internet</p>
                <div className="space-y-2">
                  {[
                    { kpi: "Contrats vivants", val: "32 800" },
                    { kpi: "Production", val: "2 100" },
                    { kpi: "Résiliations", val: "180" },
                    { kpi: "Clients équipés", val: "28 500" },
                    { kpi: "Taux pénétration", val: "61%" },
                  ].map(r => (
                    <div key={r.kpi} className="flex justify-between items-center py-1 border-b border-border/30">
                      <span className="text-[10px] text-muted-foreground">{r.kpi}</span>
                      <span className="text-xs font-medium text-card-foreground">{r.val}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Packages */}
              <Card className="p-5">
                <h3 className="font-display font-semibold text-card-foreground text-sm mb-1 flex items-center gap-2">
                  <Landmark size={14} className="text-primary" /> Packages
                </h3>
                <p className="text-[10px] text-muted-foreground mb-3">Offres packagées clients</p>
                <div className="space-y-2">
                  {[
                    { kpi: "Packs vivants", val: "12 400" },
                    { kpi: "Production", val: "850" },
                    { kpi: "Résiliations", val: "95" },
                    { kpi: "Taux souscription", val: "26.5%" },
                  ].map(r => (
                    <div key={r.kpi} className="flex justify-between items-center py-1 border-b border-border/30">
                      <span className="text-[10px] text-muted-foreground">{r.kpi}</span>
                      <span className="text-xs font-medium text-card-foreground">{r.val}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default Index;
