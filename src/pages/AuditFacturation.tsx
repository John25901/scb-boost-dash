import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import {
  Receipt, AlertTriangle, CheckCircle2, TrendingDown,
  ShieldCheck, Calculator, Scale, SlidersHorizontal
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import FilterBar, { type FilterTag } from "@/components/FilterBar";
import ExportToolbar from "@/components/ExportToolbar";

const commissionsData = [
  { flux: "Retrait DAB SCB", taux_parametre: 1.5, taux_reel: 1.5, ecart: 0, volume: 28500, statut: "OK" },
  { flux: "Retrait DAB confrère", taux_parametre: 2.0, taux_reel: 1.8, ecart: -0.2, volume: 12400, statut: "Sous-facturation" },
  { flux: "Paiement TPE local", taux_parametre: 1.2, taux_reel: 1.2, ecart: 0, volume: 18200, statut: "OK" },
  { flux: "Paiement e-commerce", taux_parametre: 2.5, taux_reel: 2.3, ecart: -0.2, volume: 9400, statut: "Sous-facturation" },
  { flux: "TX internationale Visa", taux_parametre: 3.0, taux_reel: 3.0, ecart: 0, volume: 3200, statut: "OK" },
  { flux: "Retrait international", taux_parametre: 3.5, taux_reel: 3.2, ecart: -0.3, volume: 1800, statut: "Sous-facturation" },
  { flux: "Frais tenue de carte", taux_parametre: 5000, taux_reel: 5000, ecart: 0, volume: 18450, statut: "OK" },
  { flux: "Commission interchange", taux_parametre: 0.8, taux_reel: 0.8, ecart: 0, volume: 42000, statut: "OK" },
];

const manqueAGagnerMensuel = [
  { mois: "Jan", montant: 4200 }, { mois: "Fév", montant: 3800 },
  { mois: "Mar", montant: 5100 }, { mois: "Avr", montant: 3200 },
  { mois: "Mai", montant: 4800 }, { mois: "Juin", montant: 5600 },
];

const repartitionCommissions = [
  { name: "Commissions DAB", value: 38, color: "hsl(var(--primary))" },
  { name: "Commissions TPE", value: 28, color: "hsl(var(--accent))" },
  { name: "Frais de tenue", value: 18, color: "hsl(var(--kpi-warning))" },
  { name: "Interchange", value: 12, color: "hsl(var(--chart-4))" },
  { name: "International", value: 4, color: "hsl(var(--muted-foreground))" },
];

const reconciliationData = [
  { mois: "Jan", ecritures_attendues: 42500, ecritures_recues: 42380, ecart: 120, taux_matching: 99.72 },
  { mois: "Fév", ecritures_attendues: 45200, ecritures_recues: 45050, ecart: 150, taux_matching: 99.67 },
  { mois: "Mar", ecritures_attendues: 48800, ecritures_recues: 48650, ecart: 150, taux_matching: 99.69 },
  { mois: "Avr", ecritures_attendues: 46200, ecritures_recues: 46100, ecart: 100, taux_matching: 99.78 },
  { mois: "Mai", ecritures_attendues: 52000, ecritures_recues: 51900, ecart: 100, taux_matching: 99.81 },
  { mois: "Juin", ecritures_attendues: 55200, ecritures_recues: 55120, ecart: 80, taux_matching: 99.86 },
];

const alertesFacturation = [
  { id: "ALR-001", type: "Sous-facturation", flux: "Retrait DAB confrère", ecart_pct: "-10%", montant_perdu: "₣2.48M", severite: "haute", date: "2026-03-28" },
  { id: "ALR-002", type: "Sous-facturation", flux: "Paiement e-commerce", ecart_pct: "-8%", montant_perdu: "₣2.16M", severite: "haute", date: "2026-03-27" },
  { id: "ALR-003", type: "Sous-facturation", flux: "Retrait international", ecart_pct: "-8.6%", montant_perdu: "₣576K", severite: "moyenne", date: "2026-03-26" },
];

const AuditFacturation = () => {
  const [filterTags, setFilterTags] = useState<FilterTag[]>([]);
  // PNB Simulation sliders
  const [simTauxDAB, setSimTauxDAB] = useState([1.8]);
  const [simTauxEcom, setSimTauxEcom] = useState([2.3]);
  const [simTauxIntl, setSimTauxIntl] = useState([3.2]);

  const addTag = (tag: FilterTag) => setFilterTags(prev => prev.some(t => t.id === tag.id) ? prev : [...prev, tag]);
  const anomalies = commissionsData.filter(c => c.statut !== "OK");
  const totalManqueAGagner = manqueAGagnerMensuel.reduce((s, m) => s + m.montant, 0);

  // Simulation calculations
  const gainDAB = ((simTauxDAB[0] - 1.8) / 100) * 12400 * 820000;
  const gainEcom = ((simTauxEcom[0] - 2.3) / 100) * 9400 * 350000;
  const gainIntl = ((simTauxIntl[0] - 3.2) / 100) * 1800 * 1500000;
  const totalSimGain = gainDAB + gainEcom + gainIntl;

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Audit & Facturation Monétique</h1>
          <p className="text-xs text-muted-foreground">Vérification commissions, simulation PNB, réconciliation — Monnaie : FCFA (XAF)</p>
        </div>

        <Card className="p-3">
          <FilterBar tags={filterTags} onAddTag={addTag} onRemoveTag={id => setFilterTags(p => p.filter(t => t.id !== id))} onClearAll={() => setFilterTags([])} />
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Flux Vérifiés", value: `${commissionsData.length}`, icon: CheckCircle2, change: "100%", positive: true },
            { label: "Anomalies Détectées", value: `${anomalies.length}`, icon: AlertTriangle, change: "Sous-facturation", positive: false },
            { label: "Manque à Gagner (6m)", value: `₣${(totalManqueAGagner / 1000).toFixed(1)}M`, icon: TrendingDown, change: "Cumulé", positive: false },
            { label: "Taux Réconciliation", value: "99.86%", icon: Scale, change: "+0.14pts", positive: true },
          ].map(k => (
            <Card key={k.label} className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-8 w-8 rounded-lg ${k.positive ? "bg-kpi-positive/10" : "bg-kpi-negative/10"} flex items-center justify-center`}>
                  <k.icon size={16} className={k.positive ? "text-kpi-positive" : "text-kpi-negative"} />
                </div>
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
              </div>
              <p className="text-lg font-display font-bold text-card-foreground">{k.value}</p>
              <p className={`text-[10px] font-medium ${k.positive ? "text-kpi-positive" : "text-kpi-negative"}`}>{k.change}</p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="commissions" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="commissions" className="text-xs">Vérification Commissions</TabsTrigger>
            <TabsTrigger value="simulation" className="text-xs">🎚️ Simulation Impact PNB</TabsTrigger>
            <TabsTrigger value="alertes" className="text-xs">Alertes</TabsTrigger>
            <TabsTrigger value="reconciliation" className="text-xs">Réconciliation</TabsTrigger>
          </TabsList>

          <TabsContent value="commissions" className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-card-foreground text-sm flex items-center gap-2">
                  <Calculator size={14} className="text-primary" /> Comparaison Taux Paramétrés vs Réels
                </h3>
                <ExportToolbar compact data={commissionsData} title="Commissions Monétique" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-[10px] text-muted-foreground">
                      <th className="text-left py-2">Flux Monétique</th>
                      <th className="text-right py-2">Paramétré</th>
                      <th className="text-right py-2">Réel</th>
                      <th className="text-right py-2">Écart</th>
                      <th className="text-right py-2">Volume TX</th>
                      <th className="text-center py-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionsData.map(c => (
                      <tr key={c.flux} className={`border-b border-border/30 hover:bg-muted/30 ${c.statut !== "OK" ? "bg-kpi-negative/5" : ""}`}>
                        <td className="py-2.5 text-xs font-medium text-card-foreground">{c.flux}</td>
                        <td className="py-2.5 text-right text-xs">{c.taux_parametre < 100 ? `${c.taux_parametre}%` : `₣${c.taux_parametre.toLocaleString("fr-FR")}`}</td>
                        <td className="py-2.5 text-right text-xs">{c.taux_reel < 100 ? `${c.taux_reel}%` : `₣${c.taux_reel.toLocaleString("fr-FR")}`}</td>
                        <td className={`py-2.5 text-right text-xs font-medium ${c.ecart < 0 ? "text-kpi-negative" : "text-kpi-positive"}`}>
                          {c.ecart !== 0 ? `${c.ecart}%` : "—"}
                        </td>
                        <td className="py-2.5 text-right text-xs">{c.volume.toLocaleString("fr-FR")}</td>
                        <td className="py-2.5 text-center">
                          <Badge className={`text-[8px] ${c.statut === "OK" ? "bg-kpi-positive/10 text-kpi-positive" : "bg-kpi-negative/10 text-kpi-negative"}`}>{c.statut}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-card-foreground text-sm">Manque à Gagner Mensuel</h3>
                <ExportToolbar compact data={manqueAGagnerMensuel} title="Manque à Gagner" />
              </div>
              <p className="text-[10px] text-muted-foreground mb-4">Pertes dues aux sous-facturations (en K FCFA)</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={manqueAGagnerMensuel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="montant" fill="hsl(var(--kpi-negative))" radius={[4, 4, 0, 0]} barSize={20} name="K FCFA" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* SIMULATION PNB */}
          <TabsContent value="simulation" className="space-y-4">
            <Card className="p-5 border-accent/20">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-1 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-accent" /> Simulation d'Impact PNB — Ajustement des Taux
              </h3>
              <p className="text-[10px] text-muted-foreground mb-5">
                Simulez l'impact financier d'un réalignement des taux de commission sur les flux sous-facturés
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Retrait DAB confrère (actuel : 1.8% → paramétré : 2.0%)</span>
                    <span className="font-bold text-accent">{simTauxDAB[0].toFixed(1)}%</span>
                  </div>
                  <Slider value={simTauxDAB} onValueChange={setSimTauxDAB} min={1.5} max={2.5} step={0.1} className="accent-accent" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Paiement e-commerce (actuel : 2.3% → paramétré : 2.5%)</span>
                    <span className="font-bold text-accent">{simTauxEcom[0].toFixed(1)}%</span>
                  </div>
                  <Slider value={simTauxEcom} onValueChange={setSimTauxEcom} min={2.0} max={3.0} step={0.1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Retrait international (actuel : 3.2% → paramétré : 3.5%)</span>
                    <span className="font-bold text-accent">{simTauxIntl[0].toFixed(1)}%</span>
                  </div>
                  <Slider value={simTauxIntl} onValueChange={setSimTauxIntl} min={2.8} max={4.0} step={0.1} />
                </div>
              </div>

              <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Impact PNB estimé (annuel)</p>
                    <p className="text-2xl font-display font-bold text-accent">
                      {totalSimGain >= 0 ? "+" : ""}₣{(totalSimGain / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-muted-foreground">DAB : {gainDAB >= 0 ? "+" : ""}₣{(gainDAB / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-muted-foreground">E-com : {gainEcom >= 0 ? "+" : ""}₣{(gainEcom / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-muted-foreground">Intl : {gainIntl >= 0 ? "+" : ""}₣{(gainIntl / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="alertes" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-3">Alertes de Facturation</h3>
              <div className="space-y-2">
                {alertesFacturation.map(a => (
                  <div key={a.id} className={`p-3 rounded-lg border ${
                    a.severite === "haute" ? "bg-kpi-negative/5 border-kpi-negative/20" : "bg-kpi-warning/5 border-kpi-warning/20"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[8px] ${a.severite === "haute" ? "bg-kpi-negative/10 text-kpi-negative" : "bg-kpi-warning/10 text-kpi-warning"}`}>{a.severite}</Badge>
                        <span className="text-xs font-medium text-card-foreground">{a.type}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{a.date}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Flux : <strong>{a.flux}</strong> — Écart : {a.ecart_pct} — Perte : {a.montant_perdu}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reconciliation" className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-card-foreground text-sm flex items-center gap-2">
                  <Scale size={14} className="text-primary" /> Réconciliation Contre-tickets vs Comptabilité
                </h3>
                <ExportToolbar compact data={reconciliationData} title="Réconciliation" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-[10px] text-muted-foreground">
                      <th className="text-left py-2">Mois</th>
                      <th className="text-right py-2">Attendues</th>
                      <th className="text-right py-2">Reçues</th>
                      <th className="text-right py-2">Écart</th>
                      <th className="text-right py-2">Matching</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reconciliationData.map(r => (
                      <tr key={r.mois} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="py-2.5 text-xs font-medium text-card-foreground">{r.mois}</td>
                        <td className="py-2.5 text-right text-xs">{r.ecritures_attendues.toLocaleString("fr-FR")}</td>
                        <td className="py-2.5 text-right text-xs">{r.ecritures_recues.toLocaleString("fr-FR")}</td>
                        <td className="py-2.5 text-right text-xs text-kpi-negative font-medium">{r.ecart}</td>
                        <td className="py-2.5 text-right">
                          <Badge className={`text-[8px] ${r.taux_matching >= 99.8 ? "bg-kpi-positive/10 text-kpi-positive" : "bg-kpi-warning/10 text-kpi-warning"}`}>
                            {r.taux_matching}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground text-sm mb-1">Taux de Matching Mensuel</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={reconciliationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[99.5, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="taux_matching" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4 }} name="Matching %" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default AuditFacturation;
