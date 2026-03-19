import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { ShieldCheck, AlertTriangle, ShieldAlert, TrendingDown, CreditCard, Banknote, Scale, Eye } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

const fraudData = [
  { mois: "Jan", détectées: 45, bloquées: 42, faux_positifs: 3 },
  { mois: "Fév", détectées: 52, bloquées: 50, faux_positifs: 2 },
  { mois: "Mar", détectées: 38, bloquées: 37, faux_positifs: 1 },
  { mois: "Avr", détectées: 61, bloquées: 58, faux_positifs: 3 },
  { mois: "Mai", détectées: 47, bloquées: 46, faux_positifs: 1 },
  { mois: "Juin", détectées: 33, bloquées: 33, faux_positifs: 0 },
];

const riskDistribution = [
  { name: "Faible", value: 62, color: "hsl(160, 60%, 45%)" },
  { name: "Moyen", value: 25, color: "hsl(35, 92%, 55%)" },
  { name: "Élevé", value: 10, color: "hsl(0, 72%, 51%)" },
  { name: "Critique", value: 3, color: "hsl(0, 72%, 35%)" },
];

// Engagements - Impayés
const impayesEvolution = [
  { mois: "Jan", montant: 1820, nombre: 178 },
  { mois: "Fév", montant: 1750, nombre: 172 },
  { mois: "Mar", montant: 1680, nombre: 165 },
  { mois: "Avr", montant: 1720, nombre: 168 },
  { mois: "Mai", montant: 1600, nombre: 160 },
  { mois: "Juin", montant: 1560, nombre: 156 },
];

// Taux de dépassement
const depassementData = [
  { mois: "Jan", taux_utilisation: 72, depassements: 52 },
  { mois: "Fév", taux_utilisation: 74, depassements: 48 },
  { mois: "Mar", taux_utilisation: 71, depassements: 50 },
  { mois: "Avr", taux_utilisation: 76, depassements: 46 },
  { mois: "Mai", taux_utilisation: 73, depassements: 45 },
  { mois: "Juin", taux_utilisation: 75, depassements: 42 },
];

// Créances par classe de risque COBAC
const classeRisqueCOBAC = [
  { classe: "Classe 1 (Sain)", encours: 38200, prov: 0, pct: 82 },
  { classe: "Classe 2 (Pré-douteux)", encours: 4500, prov: 450, pct: 10 },
  { classe: "Classe 3 (Douteux)", encours: 2200, prov: 1100, pct: 5 },
  { classe: "Classe 4 (Compromis)", encours: 1600, prov: 1600, pct: 3 },
];

// Concentration
const concentrationSectorielle = [
  { secteur: "Commerce", encours: 12500, pct: 27 },
  { secteur: "BTP", encours: 8200, pct: 18 },
  { secteur: "Agriculture", encours: 6800, pct: 15 },
  { secteur: "Industrie", encours: 5400, pct: 12 },
  { secteur: "Services", encours: 4800, pct: 10 },
  { secteur: "Transport", encours: 3200, pct: 7 },
  { secteur: "Particuliers", encours: 5100, pct: 11 },
];

const Risques = () => (
  <AnimatedPage>
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Gestion des Risques & Conformité</h1>
        <p className="text-xs text-muted-foreground">Détection de fraude, risque crédit, engagements, classification COBAC — ML & Big Data</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Taux Détection Fraude", value: "98.2%", icon: ShieldCheck, color: "text-kpi-positive" },
          { label: "Impayés (nombre)", value: "156", icon: AlertTriangle, color: "text-kpi-warning" },
          { label: "Taux Créances Douteuses", value: "8%", icon: ShieldAlert, color: "text-kpi-negative" },
          { label: "Pertes Évitées", value: "₣245M", icon: TrendingDown, color: "text-primary" },
        ].map((s) => (
          <Card key={s.label} className="p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="text-sm font-display font-bold text-card-foreground">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="fraude" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="fraude" className="text-xs">Fraude / AML</TabsTrigger>
          <TabsTrigger value="credit" className="text-xs">Risque Crédit</TabsTrigger>
          <TabsTrigger value="engagements" className="text-xs">Engagements</TabsTrigger>
          <TabsTrigger value="cobac" className="text-xs">Classification COBAC</TabsTrigger>
        </TabsList>

        {/* FRAUDE */}
        <TabsContent value="fraude" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Détection de Fraude</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Modèle Isolation Forest + Clustering — Détectées vs Bloquées</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={fraudData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="détectées" fill="hsl(var(--kpi-negative))" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="bloquées" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-kpi-negative" /> Détectées</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Bloquées</span>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Distribution du Risque Global</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Répartition du portefeuille par niveau de risque</p>
              <div className="flex items-center gap-6">
                <div className="w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value" strokeWidth={0}>
                        {riskDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {riskDistribution.map((r) => (
                    <div key={r.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                        <span className="text-muted-foreground text-xs">{r.name}</span>
                      </span>
                      <span className="font-semibold text-card-foreground">{r.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-2">Features du Modèle de Détection</h3>
            <p className="text-[10px] text-muted-foreground mb-3">Variables utilisées par l'Isolation Forest pour identifier les transactions suspectes</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { feature: "velocity_tx_1h", desc: "Nombre de TX dans la dernière heure vs moyenne historique", weight: "30%" },
                { feature: "geoloc_inhabituelle", desc: "Distance entre lieu de TX et habitudes géographiques client", weight: "25%" },
                { feature: "montant_vs_historique", desc: "Écart du montant vs moyenne mobile 30 jours du client", weight: "20%" },
                { feature: "heure_transaction", desc: "Score d'anomalie horaire basé sur l'historique du client", weight: "15%" },
                { feature: "reseau_beneficiaires", desc: "Analyse de graphe des bénéficiaires (nouveaux, circulaires)", weight: "10%" },
              ].map(f => (
                <div key={f.feature} className="p-2.5 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <code className="text-[10px] font-mono text-primary">{f.feature}</code>
                    <Badge variant="outline" className="text-[8px]">{f.weight}</Badge>
                  </div>
                  <p className="text-[9px] text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* RISQUE CRÉDIT */}
        <TabsContent value="credit" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Évolution des Impayés</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Montant (M FCFA) et nombre d'impayés non réglés</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={impayesEvolution}>
                  <defs>
                    <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--kpi-negative))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--kpi-negative))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="montant" stroke="hsl(var(--kpi-negative))" fill="url(#impGrad)" strokeWidth={2} name="Montant (M)" />
                  <Line type="monotone" dataKey="nombre" stroke="hsl(var(--kpi-warning))" strokeWidth={2} dot={{ r: 3 }} name="Nombre" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Taux d'Utilisation & Dépassements</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Suivi des lignes de crédit</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={depassementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="taux_utilisation" stroke="hsl(var(--primary))" strokeWidth={2} name="Taux utilisation (%)" />
                  <Line type="monotone" dataKey="depassements" stroke="hsl(var(--kpi-negative))" strokeWidth={2} name="Dépassements" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Concentration Sectorielle du Portefeuille</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Répartition des engagements par secteur d'activité (en M FCFA)</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={concentrationSectorielle} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="secteur" type="category" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" width={90} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${v.toLocaleString()} M`, "Encours"]} />
                <Bar dataKey="encours" radius={[0, 6, 6, 0]} barSize={14} fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* ENGAGEMENTS */}
        <TabsContent value="engagements" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Encours Total Engagements", value: "₣55.3Mrd" },
              { label: "Autorisations Vivantes", value: "3 420" },
              { label: "Production Mois", value: "₣8.2Mrd" },
              { label: "Lignes en Dépassement", value: "42" },
            ].map(k => (
              <Card key={k.label} className="p-3">
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
                <p className="text-sm font-display font-bold text-card-foreground">{k.value}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Détail des Engagements</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Crédits par décaissement, financements internationaux, garanties, EPS — conformément au dictionnaire KPI</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left py-2 pr-4">Type d'Engagement</th>
                  <th className="text-right py-2 px-2">Encours (M)</th>
                  <th className="text-right py-2 px-2">Autorisations</th>
                  <th className="text-right py-2 px-2">Utilisations (M)</th>
                  <th className="text-right py-2 px-2">Taux Util.</th>
                  <th className="text-right py-2 px-2">Impayés</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Crédits par décaissement", encours: "42 500", autorisations: "2 850", utilisations: "38 200", taux: "89.9%", impayes: "128" },
                  { type: "Financement international (MCNE)", encours: "5 200", autorisations: "320", utilisations: "4 800", taux: "92.3%", impayes: "12" },
                  { type: "Cautions & Avals", encours: "12 800", autorisations: "1 245", utilisations: "9 200", taux: "71.9%", impayes: "8" },
                  { type: "Garanties internationales", encours: "3 800", autorisations: "180", utilisations: "3 200", taux: "84.2%", impayes: "4" },
                  { type: "Escompte papier commercial", encours: "2 100", autorisations: "95", utilisations: "1 800", taux: "85.7%", impayes: "4" },
                ].map(r => (
                  <tr key={r.type} className="border-b border-border/50">
                    <td className="py-2.5 pr-4 text-xs font-medium text-card-foreground">{r.type}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-muted-foreground">{r.encours}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-muted-foreground">{r.autorisations}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-muted-foreground">{r.utilisations}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-primary font-medium">{r.taux}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-kpi-negative font-medium">{r.impayes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        {/* COBAC */}
        <TabsContent value="cobac" className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-1 flex items-center gap-2">
              <Scale size={14} className="text-primary" /> Classification des Créances — Norme COBAC
            </h3>
            <p className="text-[10px] text-muted-foreground mb-4">Conformité réglementaire CEMAC — Provisionnement par classe de risque</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left py-2 pr-4">Classe</th>
                  <th className="text-right py-2 px-2">Encours (M)</th>
                  <th className="text-right py-2 px-2">Provisions (M)</th>
                  <th className="text-right py-2 px-2">% Portefeuille</th>
                  <th className="text-right py-2 px-2">Taux Prov.</th>
                </tr>
              </thead>
              <tbody>
                {classeRisqueCOBAC.map(c => (
                  <tr key={c.classe} className="border-b border-border/50">
                    <td className="py-2.5 pr-4 text-xs font-medium text-card-foreground">{c.classe}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-muted-foreground">{c.encours.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-muted-foreground">{c.prov.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right">
                      <Badge className={`text-[9px] ${c.pct >= 70 ? "bg-kpi-positive/10 text-kpi-positive" : c.pct >= 10 ? "bg-kpi-warning/10 text-kpi-warning" : "bg-kpi-negative/10 text-kpi-negative"}`}>{c.pct}%</Badge>
                    </td>
                    <td className="py-2.5 px-2 text-right text-xs font-medium text-card-foreground">{c.encours > 0 ? ((c.prov / c.encours) * 100).toFixed(0) + "%" : "0%"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground text-sm mb-2 flex items-center gap-2">
              <Eye size={14} className="text-primary" /> Explicabilité SHAP — Conformité COBAC
            </h3>
            <p className="text-[10px] text-muted-foreground mb-3">Chaque décision automatisée (scoring, fraude) est accompagnée d'une explication SHAP pour répondre aux exigences de transparence de la COBAC.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Droit à l'explication", desc: "Tout refus de crédit automatisé est accompagné des 5 principaux facteurs ayant contribué à la décision (valeurs SHAP)." },
                { title: "Traçabilité des modèles", desc: "Chaque version de modèle est versionnée (MLflow). L'historique des prédictions est conservé pour audit ultérieur." },
                { title: "Non-discrimination", desc: "Les variables sensibles (genre, ethnie, religion) sont exclues des features. Le modèle est audité pour détecter les biais statistiques." },
                { title: "Gouvernance des données", desc: "Les données utilisées pour l'entraînement sont anonymisées (k-anonymity). Les Data Scientists n'accèdent qu'aux données pseudonymisées." },
              ].map(s => (
                <div key={s.title} className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-semibold text-card-foreground mb-1">{s.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </AnimatedPage>
);

export default Risques;
