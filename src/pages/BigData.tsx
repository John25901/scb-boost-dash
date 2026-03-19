import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import { Database, Server, HardDrive, Layers, ArrowRight, Clock, CheckCircle2, Zap } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

const volumeData = [
  { mois: "Jan", volume: 1.2 }, { mois: "Fév", volume: 1.4 }, { mois: "Mar", volume: 1.3 },
  { mois: "Avr", volume: 1.6 }, { mois: "Mai", volume: 1.8 }, { mois: "Juin", volume: 2.0 },
  { mois: "Juil", volume: 2.1 }, { mois: "Août", volume: 1.9 }, { mois: "Sep", volume: 2.3 },
  { mois: "Oct", volume: 2.5 }, { mois: "Nov", volume: 2.7 }, { mois: "Déc", volume: 3.0 },
];

const sourceData = [
  { source: "Core Banking (Oracle)", records: 45000000, tables: "filiale_sid_compte, filiale_mouvement_comptable" },
  { source: "Mobile Money (API)", records: 28000000, tables: "momo_transactions, orange_money_logs" },
  { source: "Logs Serveurs", records: 120000000, tables: "event_logs, process_mining_events" },
  { source: "Canaux Digitaux", records: 8000000, tables: "app_sessions, web_analytics" },
  { source: "IoT / ATM", records: 18000000, tables: "atm_transactions, atm_alerts" },
  { source: "Opérations Internationales", records: 5000000, tables: "filiale_SID_credoc, filiale_SID_transfert" },
];

const pipelineJobs = [
  { nom: "ETL Core Banking → Bronze", statut: "Succès", durée: "12 min", records: "2.3M", dernier: "19/03 06:00", type: "Ingestion" },
  { nom: "CDC Oracle Comptes", statut: "Succès", durée: "5 min", records: "850K", dernier: "19/03 06:15", type: "CDC" },
  { nom: "API MoMo Ingestion", statut: "Succès", durée: "8 min", records: "1.2M", dernier: "19/03 05:30", type: "API" },
  { nom: "Bronze → Silver (Nettoyage)", statut: "Succès", durée: "18 min", records: "4.3M", dernier: "19/03 06:30", type: "Transform" },
  { nom: "Silver → Gold (Agrégation)", statut: "En cours", durée: "—", records: "1.8M", dernier: "19/03 07:00", type: "Transform" },
  { nom: "Feature Engineering ML", statut: "Planifié", durée: "—", records: "—", dernier: "19/03 08:00", type: "ML" },
  { nom: "Scoring Batch Crédit", statut: "Planifié", durée: "—", records: "—", dernier: "19/03 09:00", type: "ML" },
  { nom: "Export Rapports KPI", statut: "Succès", durée: "3 min", records: "50K", dernier: "19/03 04:00", type: "Export" },
];

const medalionDistrib = [
  { name: "Bronze (brut)", value: 60, color: "hsl(30, 60%, 55%)" },
  { name: "Silver (nettoyé)", value: 25, color: "hsl(0, 0%, 70%)" },
  { name: "Gold (agrégé)", value: 15, color: "hsl(45, 90%, 55%)" },
];

const BigData = () => (
  <AnimatedPage>
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Big Data & Infrastructure</h1>
        <p className="text-xs text-muted-foreground">Architecture Medallion, pipelines ETL, sources de données & lineage — Dictionnaire KPI</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Volume Total", value: "3.0 TB", icon: Database },
          { label: "Sources Connectées", value: "6", icon: Server },
          { label: "Records Traités/Jour", value: "22M", icon: HardDrive },
          { label: "Pipelines Actifs", value: "8", icon: Layers },
        ].map(s => (
          <Card key={s.label} className="p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
              <s.icon size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="text-sm font-display font-bold text-card-foreground">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="pipeline" className="text-xs">Pipelines ETL</TabsTrigger>
          <TabsTrigger value="sources" className="text-xs">Sources de Données</TabsTrigger>
          <TabsTrigger value="architecture" className="text-xs">Architecture Medallion</TabsTrigger>
          <TabsTrigger value="lineage" className="text-xs">Data Lineage KPI</TabsTrigger>
        </TabsList>

        {/* PIPELINES */}
        <TabsContent value="pipeline" className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-4">Pipelines ETL — Statut Temps Réel</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left py-2 pr-3">Job</th>
                  <th className="text-center py-2 px-2">Type</th>
                  <th className="text-center py-2 px-2">Statut</th>
                  <th className="text-center py-2 px-2">Durée</th>
                  <th className="text-center py-2 px-2">Records</th>
                  <th className="text-center py-2 px-2">Dernier Run</th>
                </tr>
              </thead>
              <tbody>
                {pipelineJobs.map(j => (
                  <tr key={j.nom} className="border-b border-border/50">
                    <td className="py-2.5 pr-3 font-medium text-card-foreground text-xs">{j.nom}</td>
                    <td className="text-center py-2.5 px-2">
                      <Badge variant="outline" className="text-[8px]">{j.type}</Badge>
                    </td>
                    <td className="text-center py-2.5 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                        j.statut === "Succès" ? "bg-kpi-positive/10 text-kpi-positive" :
                        j.statut === "En cours" ? "bg-kpi-warning/10 text-kpi-warning" :
                        "bg-secondary text-muted-foreground"
                      }`}>{j.statut}</span>
                    </td>
                    <td className="text-center py-2.5 px-2 text-xs text-muted-foreground">{j.durée}</td>
                    <td className="text-center py-2.5 px-2 text-xs text-muted-foreground">{j.records}</td>
                    <td className="text-center py-2.5 px-2 text-xs text-muted-foreground">{j.dernier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Croissance du Volume de Données (TB)</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Data Lakehouse — évolution mensuelle</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" unit=" TB" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="volume" stroke="hsl(var(--primary))" fill="url(#volGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* SOURCES */}
        <TabsContent value="sources" className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-4">Sources de Données Connectées</h3>
            <div className="space-y-3">
              {sourceData.map(s => (
                <div key={s.source} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-card-foreground">{s.source}</p>
                    <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.tables}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-primary">{(s.records / 1e6).toFixed(0)}M</p>
                    <p className="text-[9px] text-muted-foreground">records</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Volume par Source</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Répartition des enregistrements</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} />
                <YAxis dataKey="source" type="category" tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))" width={130} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${(v / 1e6).toFixed(1)}M`, "Records"]} />
                <Bar dataKey="records" radius={[0, 6, 6, 0]} barSize={14} fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* ARCHITECTURE MEDALLION */}
        <TabsContent value="architecture" className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Architecture Medallion (Bronze → Silver → Gold)</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Raffinement progressif des données dans le Data Lakehouse</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { layer: "Bronze", color: "border-l-amber-700", desc: "Données brutes ingérées (Core Banking Oracle, API MoMo, logs). Format Parquet non transformé. Conservation illimitée.", tables: "raw_comptes, raw_mouvements, raw_momo, raw_credoc" },
                { layer: "Silver", color: "border-l-gray-400", desc: "Données nettoyées, typées, dédupliquées. Jointures client. Anonymisation k-anonymity pour les Data Scientists.", tables: "clean_clients, clean_transactions, clean_engagements" },
                { layer: "Gold", color: "border-l-yellow-500", desc: "Agrégats métiers prêts pour le dashboarding et le Feature Store ML. Conformes au Dictionnaire des KPI.", tables: "kpi_encours, kpi_clients, kpi_pnb, feature_store" },
              ].map(l => (
                <div key={l.layer} className={`p-4 bg-muted/30 rounded-lg border-l-4 ${l.color}`}>
                  <h4 className="font-display font-semibold text-sm text-card-foreground mb-1">{l.layer}</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{l.desc}</p>
                  <p className="text-[9px] font-mono text-primary/70">{l.tables}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Répartition des Données par Couche</h3>
            <div className="flex items-center gap-6">
              <div className="w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={medalionDistrib} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value" strokeWidth={0}>
                      {medalionDistrib.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {medalionDistrib.map(r => (
                  <div key={r.name} className="flex items-center justify-between text-xs">
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
        </TabsContent>

        {/* DATA LINEAGE KPI */}
        <TabsContent value="lineage" className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-2">Data Lineage — Traçabilité des KPI</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Comment chaque KPI du Dictionnaire est calculé, de la source brute au dashboard</p>
            <div className="space-y-4">
              {[
                {
                  kpi: "Encours en Ligne Comptable",
                  pipeline: ["Core Banking (BKSLCOM)", "CDC Oracle", "Bronze (raw_soldes)", "Silver (clean_comptes)", "Gold (kpi_encours)"],
                  script: "Solde après fusion, ventilé par rubrique E/R. Sens A/P → valeur absolue.",
                },
                {
                  kpi: "Stock Clients",
                  pipeline: ["filiale_sid_compte", "filiale_sid_client", "Bronze", "Silver (jointure client-compte)", "Gold (kpi_clients)"],
                  script: "COUNT DISTINCT code_client WHERE ≥1 compte vivant. Multi-agence : compté 1× au niveau banque.",
                },
                {
                  kpi: "Collecte Cumulée",
                  pipeline: ["kpi_encours (Gold)", "Calcul différentiel", "kpi_collecte"],
                  script: "Encours à fin P – Encours au 31/12/N-1. CPL = 0 pour les deux bornes.",
                },
                {
                  kpi: "Production Cautions (nombre)",
                  pipeline: ["filiale_SID_caution", "Bronze (raw_cautions)", "Silver (clean_engagements)", "Gold (kpi_engagements)"],
                  script: "COUNT WHERE code_traitement IN (3,4,5) AND statut IN (VA,FO,VF) AND dt_creation IN période.",
                },
                {
                  kpi: "Score Comportemental MoMo",
                  pipeline: ["API MoMo/Orange Money", "Bronze (raw_momo)", "Silver", "Feature Store", "ML Scoring"],
                  script: "Composite : fréquence × régularité × diversité opérations. Normalisé [0-100].",
                },
              ].map(l => (
                <div key={l.kpi} className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-semibold text-card-foreground mb-2">{l.kpi}</p>
                  <div className="flex flex-wrap items-center gap-1 mb-2">
                    {l.pipeline.map((step, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 bg-background rounded text-[9px] text-muted-foreground border border-border/50">{step}</span>
                        {i < l.pipeline.length - 1 && <ArrowRight size={10} className="text-primary" />}
                      </span>
                    ))}
                  </div>
                  <p className="text-[9px] text-muted-foreground font-mono">{l.script}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </AnimatedPage>
);

export default BigData;
