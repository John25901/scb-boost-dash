import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedPage from "@/components/AnimatedPage";
import {
  FileText, BookOpen, Brain, Database, Users, ShieldCheck,
  Layers, Target, Smartphone, Cog, TrendingUp, BarChart3,
  ChevronRight, Lightbulb, AlertTriangle, CheckCircle2, Shield,
  GitBranch, ScanSearch, Bot, Search, ArrowRight, Workflow,
  CreditCard, Banknote, Eye
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

// ====== KPI DICTIONARY ======
const kpiDictionary = [
  // Données Comptables
  { domaine: "Données Comptables", sousdomaine: "Encours", kpi: "Encours en Ligne Comptable", definition: "Solde comptable du compte à la date d'analyse après fusion. Ventilé par rubrique E/R (Emplois/Ressources), à partir du sens Actif/Passif affecté à chaque rubrique.", source: "filiale_sid_compte, BKSLCOM", frequence: "Quotidien" },
  { domaine: "Données Comptables", sousdomaine: "Encours", kpi: "Collecte Cumulée", definition: "Encours à fin P – Encours au 31/12/N-1. CPL = 0 pour les deux bornes. Seules les rubriques relatives aux ressources.", source: "kpi_encours (Gold)", frequence: "Mensuel" },
  { domaine: "Données Comptables", sousdomaine: "Encours", kpi: "Collecte Mensuelle", definition: "Encours à fin P – Encours à fin P-1. Peut être quotidienne, hebdomadaire ou mensuelle.", source: "kpi_encours (Gold)", frequence: "Mensuel" },
  { domaine: "Données Comptables", sousdomaine: "Encours", kpi: "Encours Moyen Mensuel", definition: "Somme des encours quotidiens du mois M / nombre de jours du mois M.", source: "filiale_sid_solde_compte", frequence: "Mensuel" },
  { domaine: "Données Comptables", sousdomaine: "Marché Comptes", kpi: "Solde", definition: "Solde comptable du compte à la date d'analyse (avant fusion, hors CPL actuellement).", source: "filiale_sid_compte", frequence: "Quotidien" },
  { domaine: "Données Comptables", sousdomaine: "Marché Comptes", kpi: "Mouvements Créditeurs", definition: "Somme des montants créditeurs du mois M, hors mouvements internes (déblocage crédit, agios, tombée CAT…).", source: "filiale_mouvement_comptable", frequence: "Mensuel" },
  { domaine: "Données Comptables", sousdomaine: "Marché Comptes", kpi: "Mouvements Débiteurs", definition: "Somme des montants débiteurs du mois M, hors mouvements internes (souscription CAT, remboursement crédit…).", source: "filiale_mouvement_comptable", frequence: "Mensuel" },
  { domaine: "Données Comptables", sousdomaine: "Marché Comptes", kpi: "Solde Moyen Créditeur", definition: "Somme des soldes créditeurs du mois M / nombre de jours du mois M.", source: "filiale_sid_solde_compte", frequence: "Mensuel" },
  // Comptes & DAT
  { domaine: "Comptes & DAT", sousdomaine: "Comptes à vue", kpi: "Stock Comptes à Vue", definition: "Nombre de comptes à vue ouverts non clôturés à la date t. Les comptes en instance de clôture sont comptabilisés.", source: "filiale_compte", frequence: "Quotidien" },
  { domaine: "Comptes & DAT", sousdomaine: "Comptes à vue", kpi: "Ouvertures Comptes à Vue", definition: "Nombre de comptes à vue ouverts dans la période P, y compris ouverts et clôturés dans la même période.", source: "filiale_compte", frequence: "Mensuel" },
  { domaine: "Comptes & DAT", sousdomaine: "Comptes à vue", kpi: "Clôtures Comptes à Vue", definition: "Nombre de comptes à vue clôturés dans la période P, y compris ouverts et clôturés dans la même période.", source: "filiale_compte", frequence: "Mensuel" },
  { domaine: "Comptes & DAT", sousdomaine: "DAT", kpi: "Stock DAT (nombre)", definition: "Nombre de DAT en vie à la date t (encours en ligne non nul), indépendamment de la date d'échéance.", source: "filiale_sid_dat", frequence: "Quotidien" },
  { domaine: "Comptes & DAT", sousdomaine: "DAT", kpi: "Souscription DAT", definition: "Nombre/montant de DAT souscrits dans la période P, y compris DAT souscrits et échus dans la période.", source: "filiale_sid_dat", frequence: "Mensuel" },
  { domaine: "Comptes & DAT", sousdomaine: "DAT", kpi: "Rachat DAT", definition: "Nombre/montant de rachats (sorties avant échéance) de DAT dans la période P.", source: "filiale_sid_dat", frequence: "Mensuel" },
  // Clients
  { domaine: "Client", sousdomaine: "Client", kpi: "Nombre de Clients (Stock)", definition: "Nombre d'ID internes détenant ≥ 1 contrat vivant. Multi-agences : compté 1× au niveau banque.", source: "filiale_sid_compte × filiale_sid_client", frequence: "Quotidien" },
  { domaine: "Client", sousdomaine: "Client", kpi: "Conquête Clients", definition: "Nouveaux clients dans la période P. Un client qui clôture tout et ré-adhère est considéré nouveau.", source: "filiale_sid_compte", frequence: "Mensuel" },
  { domaine: "Client", sousdomaine: "Client", kpi: "Défection Clients", definition: "Clients ayant clôturé leur dernier compte ouvert dans la période P (tous contrats résiliés).", source: "filiale_sid_compte", frequence: "Mensuel" },
  { domaine: "Client", sousdomaine: "Client", kpi: "Conquête à CMC Nul", definition: "Nouveaux clients n'ayant jamais mouvementé leur(s) compte(s) depuis l'entrée en relation.", source: "filiale_compte × filiale_mouvement_comptable", frequence: "Mensuel" },
  // Engagements
  { domaine: "Engagements", sousdomaine: "Cautions & Avals", kpi: "Stock Cautions (nombre)", definition: "Nombre de contrats cautions & avals vivants à la date t (délivrés non levés).", source: "filiale_SID_caution", frequence: "Quotidien" },
  { domaine: "Engagements", sousdomaine: "Cautions & Avals", kpi: "Encours Cautions", definition: "Somme (montant_caution – cumul_levées) des cautions vivantes.", source: "filiale_SID_caution", frequence: "Quotidien" },
  { domaine: "Engagements", sousdomaine: "Cautions & Avals", kpi: "Production Cautions", definition: "Nombre/montant de cautions délivrées dans la période P, y compris délivrées et levées.", source: "filiale_SID_caution", frequence: "Mensuel" },
  { domaine: "Engagements", sousdomaine: "Crédits", kpi: "Encours en Ligne", definition: "Total des engagements par décaissement, financements internationaux, garanties.", source: "filiale_sid_credit", frequence: "Quotidien" },
  { domaine: "Engagements", sousdomaine: "Crédits", kpi: "Montant Impayés", definition: "Somme des échéances de crédit non réglées à la date t.", source: "filiale_sid_credit", frequence: "Quotidien" },
  { domaine: "Engagements", sousdomaine: "Crédits", kpi: "Taux d'Utilisation", definition: "Encours en ligne / Montant autorisations. Mesure l'usage effectif des lignes de crédit.", source: "filiale_sid_credit", frequence: "Mensuel" },
  // Produits
  { domaine: "Contrats Produits", sousdomaine: "Monétique", kpi: "Stock Cartes Vivantes", definition: "Nombre de cartes monétiques actives, non expirées et non résiliées à la date t.", source: "filiale_sid_contrat_produit", frequence: "Quotidien" },
  { domaine: "Contrats Produits", sousdomaine: "Banque à Distance", kpi: "Contrats BAD Vivants", definition: "Nombre de contrats banque à distance (SMS, mobile, internet) en vie à la date t.", source: "filiale_sid_contrat_produit", frequence: "Quotidien" },
  { domaine: "Contrats Produits", sousdomaine: "Packages", kpi: "Stock Packs Vivants", definition: "Nombre de contrats packages en vie à la date t, y compris renouvellements.", source: "filiale_sid_contrat_produit", frequence: "Quotidien" },
  // Opérations Internationales
  { domaine: "Opérations", sousdomaine: "International", kpi: "Production Ops Internationales (nombre)", definition: "Nombre d'opérations CREDOC, REMDOC, transferts, rapatriements, MCNE, garanties validées/forcées dans la période.", source: "filiale_SID_credoc, filiale_SID_remdoc, filiale_SID_transfert", frequence: "Mensuel" },
  { domaine: "Opérations", sousdomaine: "International", kpi: "Production Ops Internationales (volume)", definition: "Montant en contrevaleur ML des opérations internationales validées dans la période.", source: "filiale_SID_credoc, filiale_SID_transfert", frequence: "Mensuel" },
  { domaine: "Opérations", sousdomaine: "International", kpi: "Taux de Captation Groupe", definition: "Production ops internationales orientées groupe / Production totale ops internationales filiale.", source: "Déductible", frequence: "Mensuel" },
];

const Rapports = () => {
  const [kpiSearch, setKpiSearch] = useState("");

  const filteredKPIs = kpiDictionary.filter(k =>
    !kpiSearch || k.kpi.toLowerCase().includes(kpiSearch.toLowerCase()) ||
    k.domaine.toLowerCase().includes(kpiSearch.toLowerCase()) ||
    k.definition.toLowerCase().includes(kpiSearch.toLowerCase())
  );

  const domains = [...new Set(filteredKPIs.map(k => k.domaine))];

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Rapports & Documentation</h1>
          <p className="text-xs text-muted-foreground">Documentation technique, Dictionnaire KPI, architecture, modèles ML et guide d'utilisation</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="text-xs">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="kpi-dict" className="text-xs">📊 Dictionnaire KPI</TabsTrigger>
            <TabsTrigger value="architecture" className="text-xs">Architecture</TabsTrigger>
            <TabsTrigger value="workflow" className="text-xs">Workflow & Pipeline</TabsTrigger>
            <TabsTrigger value="ml-models" className="text-xs">Modèles ML</TabsTrigger>
            <TabsTrigger value="features" className="text-xs">Feature Engineering</TabsTrigger>
            <TabsTrigger value="security" className="text-xs">Sécurité & RBAC</TabsTrigger>
            <TabsTrigger value="glossary" className="text-xs">Glossaire</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="p-5">
              <h2 className="font-display font-bold text-lg text-card-foreground flex items-center gap-2 mb-3">
                <BookOpen size={18} className="text-primary" /> SCB Intelligence — Plateforme Big Data & ML
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                SCB Intelligence est une plateforme analytique développée pour la <strong>Société Commerciale de Banque du Cameroun</strong>. 
                Elle exploite le <strong>Big Data</strong> et le <strong>Machine Learning</strong> pour optimiser l'expérience client, 
                améliorer les performances opérationnelles, et favoriser l'<strong>inclusion financière</strong> au Cameroun.
                Le système s'appuie sur un <strong>Dictionnaire des KPI Groupe</strong> standardisé couvrant 7 domaines bancaires.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { icon: Users, label: "128 444", desc: "Clients actifs" },
                  { icon: Brain, label: "6 Modèles ML", desc: "En production / staging" },
                  { icon: Database, label: "3.0 TB", desc: "Volume données" },
                  { icon: BarChart3, label: "30+ KPIs", desc: "Dictionnaire Groupe" },
                ].map(s => (
                  <div key={s.desc} className="p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-card-foreground">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3">Objectifs Stratégiques</h3>
              <div className="space-y-3">
                {[
                  { obj: "Réduire l'attrition client de 5%", model: "Churn Prediction (XGBoost)", status: "En cours" },
                  { obj: "Augmenter le cross-sell de 12%", model: "Recommandation (NLP + Filtrage Collaboratif)", status: "Production" },
                  { obj: "Améliorer le break-even crédit de 8% à 32%", model: "Credit Scoring (Random Forest + NN)", status: "Production" },
                  { obj: "Réduire les faux positifs fraude de 60%", model: "Détection Fraude (Isolation Forest)", status: "Production" },
                  { obj: "Réduire de 20% le temps KYC", model: "OCR + Computer Vision", status: "Staging" },
                  { obj: "Réduire de 20% les charges opérationnelles", model: "RPA + Process Mining", status: "PoC" },
                ].map((o, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{o.obj}</p>
                      <p className="text-[10px] text-muted-foreground">{o.model}</p>
                    </div>
                    <Badge className={`text-[9px] shrink-0 ${
                      o.status === "Production" ? "bg-kpi-positive/10 text-kpi-positive" :
                      o.status === "Staging" ? "bg-kpi-warning/10 text-kpi-warning" :
                      o.status === "En cours" ? "bg-amber-100 text-amber-700" :
                      "bg-secondary text-muted-foreground"
                    }`}>{o.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3">Contexte Camerounais — Défis Spécifiques</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  { title: "Secteur Informel (~70% PIB)", desc: "Les transactions comptant dominent. Le Mobile Money (MTN MoMo, Orange Money) est utilisé comme proxy pour évaluer la capacité financière des acteurs informels." },
                  { title: "Inclusion Financière", desc: "Seulement ~35% de bancarisation. Le « Moni Market » simplifié cible les jeunes, les femmes et les commerçants avec un KYC allégé." },
                  { title: "Mobile Money comme Source de Données", desc: "Fréquences et volumes MoMo servent de features prédictives : ratio_momo_vs_bancaire, volume_momo_mensuel, fréquence_momo_mensuel." },
                  { title: "Conformité COBAC", desc: "Toute décision automatisée doit être explicable (SHAP). Classification des créances en 4 classes de risque selon les normes CEMAC." },
                ].map((c, i) => (
                  <div key={i} className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium text-card-foreground text-xs mb-1">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* KPI DICTIONARY */}
          <TabsContent value="kpi-dict" className="space-y-4">
            <Card className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display font-semibold text-card-foreground flex items-center gap-2">
                    <BarChart3 size={16} className="text-primary" /> Dictionnaire des KPI Groupe
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Référentiel standardisé des indicateurs bancaires — {kpiDictionary.length} KPIs documentés</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un KPI..."
                    value={kpiSearch}
                    onChange={e => setKpiSearch(e.target.value)}
                    className="pl-9 h-8 text-xs"
                  />
                </div>
              </div>

              {domains.map(domain => (
                <div key={domain} className="mb-6">
                  <h4 className="font-display font-semibold text-sm text-primary mb-2 flex items-center gap-2">
                    <ChevronRight size={12} /> {domain}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-[10px] text-muted-foreground">
                          <th className="text-left py-1.5 pr-2 w-24">Sous-domaine</th>
                          <th className="text-left py-1.5 px-2">KPI</th>
                          <th className="text-left py-1.5 px-2 hidden lg:table-cell">Définition</th>
                          <th className="text-left py-1.5 px-2 w-28">Source</th>
                          <th className="text-center py-1.5 px-1 w-16">Freq.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredKPIs.filter(k => k.domaine === domain).map((k, i) => (
                          <tr key={i} className="border-b border-border/30 hover:bg-muted/30">
                            <td className="py-2 pr-2 text-[10px] text-muted-foreground">{k.sousdomaine}</td>
                            <td className="py-2 px-2 text-xs font-medium text-card-foreground">{k.kpi}</td>
                            <td className="py-2 px-2 text-[10px] text-muted-foreground hidden lg:table-cell leading-relaxed">{k.definition}</td>
                            <td className="py-2 px-2 text-[9px] font-mono text-primary/70">{k.source}</td>
                            <td className="py-2 px-1 text-center">
                              <Badge variant="outline" className="text-[8px]">{k.frequence}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* ARCHITECTURE */}
          <TabsContent value="architecture" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <Layers size={16} className="text-primary" /> Architecture Technique — Vue d'Ensemble
              </h3>
              <div className="space-y-4">
                {[
                  { layer: "Couche d'Ingestion", tech: "Apache NiFi, Oracle CDC, API Mobile Money", desc: "Capture des flux transactionnels depuis le Core Banking (Oracle), les APIs MoMo/Orange Money et les systèmes legacy. Change Data Capture pour les mises à jour incrémentales.", color: "border-l-blue-500" },
                  { layer: "Couche de Stockage (Data Lakehouse)", tech: "Delta Lake / Parquet, PostgreSQL", desc: "Architecture Medallion : Bronze (brut Parquet) → Silver (nettoyé, anonymisé k-anonymity) → Gold (agrégats KPI conformes au Dictionnaire Groupe).", color: "border-l-emerald-500" },
                  { layer: "Couche de Traitement", tech: "Apache Spark, Python (Pandas, Scikit-learn, XGBoost)", desc: "Feature Engineering distribué. Feature Store pour la réutilisation des variables ML. Entraînement batch avec versionnage MLflow.", color: "border-l-amber-500" },
                  { layer: "Couche d'Inférence & API", tech: "Edge Functions (Deno), API REST, Lovable AI Gateway", desc: "Serving des modèles en serverless. Credit Scoring et campagnes utilisent l'IA générative (Gemini) pour l'explicabilité SHAP.", color: "border-l-purple-500" },
                  { layer: "Couche de Présentation", tech: "React, TypeScript, Recharts, Tailwind CSS", desc: "Dashboard RBAC avec KPIs conformes au Dictionnaire Groupe. Visualisations temps réel et export rapports.", color: "border-l-red-500" },
                ].map((l, i) => (
                  <div key={i} className={`p-4 bg-muted/30 rounded-lg border-l-4 ${l.color}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-display font-semibold text-sm text-card-foreground">{l.layer}</h4>
                      <Badge variant="outline" className="text-[9px]">{l.tech}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{l.desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3">Architecture Fonctionnelle</h3>
              <p className="text-[10px] text-muted-foreground mb-4">Mapping entre les modules applicatifs et les couches techniques</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { module: "Dashboard KPI", couche: "Présentation + Gold", kpis: "Encours E/R, Stock clients, PNB, Conquête/Défection", icon: BarChart3 },
                  { module: "Intelligence Client", couche: "Inférence + Gold", kpis: "Credit Scoring, Campagnes, Segmentation RFM", icon: Users },
                  { module: "Modèles ML", couche: "Traitement + Feature Store", kpis: "6 modèles : Churn, Scoring, Fraude, Reco, KYC, RPA", icon: Brain },
                  { module: "Risques & Conformité", couche: "Gold + COBAC", kpis: "Classification créances, Impayés, SHAP, Audit", icon: ShieldCheck },
                  { module: "Big Data", couche: "Ingestion + Stockage", kpis: "Pipelines ETL, Data Lineage, Architecture Medallion", icon: Database },
                  { module: "Performance Ops", couche: "Silver + Gold", kpis: "NPS, Onboarding, RPA, Process Mining", icon: Cog },
                ].map(m => (
                  <div key={m.module} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <m.icon size={14} className="text-primary" />
                      <p className="text-xs font-semibold text-card-foreground">{m.module}</p>
                    </div>
                    <Badge variant="outline" className="text-[8px] mb-1.5">{m.couche}</Badge>
                    <p className="text-[9px] text-muted-foreground leading-relaxed">{m.kpis}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* WORKFLOW */}
          <TabsContent value="workflow" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-2 flex items-center gap-2">
                <Workflow size={16} className="text-primary" /> Workflow Complet — De la Donnée Brute à la Décision
              </h3>
              <p className="text-[10px] text-muted-foreground mb-4">Pipeline end-to-end détaillant chaque étape du traitement des données</p>

              <div className="space-y-3">
                {[
                  { step: "1. Extraction (E)", title: "Ingestion Multi-Sources", desc: "Apache NiFi capture les données du Core Banking Oracle (tables filiale_sid_*) via CDC (Change Data Capture). Les APIs Mobile Money (MTN MoMo, Orange Money) sont interrogées en batch toutes les heures. Les event logs sont streamés en temps réel.", tools: "Apache NiFi, Oracle CDC, REST APIs", output: "Zone Bronze (Parquet brut)" },
                  { step: "2. Transform (T)", title: "Nettoyage & Normalisation", desc: "Spark nettoie les données : déduplication par code_client, typage strict (dates, montants), gestion des valeurs manquantes (imputation médiane pour les numériques). Les données sont anonymisées (k-anonymity k=5) pour les Data Scientists. Les jointures client-compte sont effectuées.", tools: "Apache Spark, Pandas", output: "Zone Silver (Clean Parquet)" },
                  { step: "3. Agrégation", title: "Calcul des KPI Métier", desc: "Les indicateurs du Dictionnaire KPI Groupe sont calculés : encours par rubrique E/R, stock clients (COUNT DISTINCT code_client WHERE ≥1 compte vivant), collecte cumulée, PNB par nature. Les règles métier spécifiques SCB Cameroun sont appliquées (ex: conquête CMC nul).", tools: "Spark SQL, dbt", output: "Zone Gold (KPI Tables)" },
                  { step: "4. Feature Engineering", title: "Construction des Variables Prédictives", desc: "Variables calculées : ratio_momo_vs_bancaire (volume MoMo / total TX), stabilite_revenus_6mois (1 – coefficient de variation), score_comportemental (composite fréquence × régularité × diversité), tendance_solde_3mois (régression linéaire du solde). Normalisées et stockées dans le Feature Store.", tools: "Scikit-learn, Feature Store", output: "Feature Store (ML-ready)" },
                  { step: "5. Entraînement ML", title: "Modèles Prédictifs", desc: "6 modèles entraînés en batch : XGBoost (Churn, AUC 0.97), Random Forest (Credit Scoring), Isolation Forest (Fraude), NLP (Recommandation), OCR (KYC). Cross-validation 5-fold. Hyperparamètres optimisés via Grid Search. Versionnage MLflow.", tools: "XGBoost, Scikit-learn, MLflow", output: "Modèles versionnés (MLflow Registry)" },
                  { step: "6. Inférence", title: "Scoring & Prédictions", desc: "Les modèles sont déployés comme Edge Functions (Deno). Le Credit Scoring utilise l'IA générative (Gemini) pour produire des explications SHAP en langage naturel. Les campagnes d'inclusion sont générées par segment. Les prédictions de churn sont recalculées quotidiennement.", tools: "Edge Functions, AI Gateway", output: "Scores, recommandations, alertes" },
                  { step: "7. Visualisation", title: "Dashboard & Rapports", desc: "Les KPIs Gold alimentent le dashboard React en temps réel. Les charts Recharts visualisent les 7 domaines du Dictionnaire KPI. Le système RBAC contrôle l'accès : Métier (lecture), Data Scientist (modèles), Conformité (audit SHAP), Admin (tout).", tools: "React, Recharts, Tailwind CSS", output: "Interface utilisateur RBAC" },
                ].map(s => (
                  <div key={s.step} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary">{s.step.split(".")[0]}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-card-foreground">{s.title}</h4>
                        <Badge variant="outline" className="text-[8px] mt-0.5">{s.tools}</Badge>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed ml-10">{s.desc}</p>
                    <div className="ml-10 mt-1.5 flex items-center gap-1.5">
                      <ArrowRight size={10} className="text-primary" />
                      <span className="text-[9px] text-primary font-medium">Output: {s.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3">Choix des Modèles ML — Justification</h3>
              <div className="space-y-3">
                {[
                  { model: "XGBoost (Churn)", why: "Données tabulaires structurées avec features mixtes. XGBoost excelle sur ce type de données (meilleur que les réseaux de neurones pour <100K lignes). Le gradient boosting capture les interactions non-linéaires. R-Learner ajouté pour estimer l'effet causal des actions de rétention.", alt: "LightGBM, CatBoost" },
                  { model: "Random Forest + NN (Credit Scoring)", why: "Ensemble par stacking : RF robuste au bruit et interprétable (feature importance native), NN pour capturer les non-linéarités complexes. Le stacking combine les forces des deux. SHAP obligatoire pour la conformité COBAC.", alt: "XGBoost seul, Régression logistique" },
                  { model: "Isolation Forest (Fraude)", why: "Non supervisé : pas besoin de labels fraude (rares et coûteux à obtenir). Isole les anomalies par partitionnement aléatoire. Combiné avec DBSCAN pour le clustering des patterns normaux. Réduit les faux positifs vs règles statiques.", alt: "Autoencoders, One-Class SVM" },
                  { model: "Filtrage Collaboratif + NLP (Reco)", why: "CF identifie les produits pertinents via les profils similaires. NLP (BERT) analyse les commentaires NPS pour détecter les besoins implicites (ex: « voyager » → carte internationale). Approche hybride pour le cold-start.", alt: "Deep Learning (NCF)" },
                  { model: "OCR + CV (KYC)", why: "OCR (Tesseract/PaddleOCR) pour extraire le texte des CNI camerounaises. Computer Vision pour détecter les falsifications (textures). NLP pour valider la cohérence entre OCR et saisie manuelle. Critique pour le KYC simplifié du secteur informel.", alt: "Services cloud (AWS Textract)" },
                  { model: "Process Mining (RPA)", why: "Reconstitue les processus réels à partir des event logs. Identifie les goulots d'étranglement (ex: ouverture de compte 45→22 min). La classification ML priorise les processus par ROI d'automatisation.", alt: "Analyse manuelle des workflows" },
                ].map(m => (
                  <div key={m.model} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-card-foreground">{m.model}</p>
                      <Badge variant="outline" className="text-[8px]">Alt: {m.alt}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{m.why}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ML MODELS */}
          <TabsContent value="ml-models" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <Brain size={16} className="text-primary" /> Les 6 Modèles ML Stratégiques
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Churn Prediction", icon: TrendingUp, tech: "XGBoost + SHAP + R-Learner", target: "–5% d'attrition | AUC 97%", how: "XGBoost est un algorithme de boosting par arbres de décision. Chaque arbre corrige les erreurs du précédent. SHAP décompose la prédiction en contribution de chaque variable. R-Learner estime l'effet causal hétérogène du traitement sur la rétention.", features: "derniere_transaction_jours, tendance_solde_3mois, frequence_momo_mensuel, ratio_momo_vs_bancaire, score_nps, nombre_incidents_paiement", note: "⚠️ Le conseil d'administration reste réticent. Maintenu en observation." },
                  { name: "Recommandation Financière", icon: Users, tech: "Filtrage Collaboratif + NLP", target: "+12% cross-sell", how: "Le filtrage collaboratif identifie les clients similaires et recommande les produits de leurs pairs. Le NLP analyse les commentaires NPS pour détecter les besoins implicites.", features: "segment_rfm, historique_produits, score_comportemental, canal_principal, profession, age" },
                  { name: "Credit Scoring IA", icon: Brain, tech: "Random Forest + Réseaux de Neurones", target: "Break-even 8% → 32%", how: "Ensemble par stacking. RF pour la robustesse, NN pour les non-linéarités. Score 0-1000 avec catégorisation et SHAP pour la conformité COBAC.", features: "stabilite_revenus_6mois, score_comportemental, ratio_dette_revenu, anciennete_mois, nombre_transactions_mois, secteur_informel" },
                  { name: "Détection Fraude / AML", icon: ShieldCheck, tech: "Isolation Forest + Clustering", target: "–60% faux positifs", how: "Isolation Forest isole les anomalies par partitionnement aléatoire. DBSCAN regroupe les patterns normaux. Les outliers sont suspects.", features: "velocity_tx_1h, geoloc_inhabituelle, montant_vs_historique, heure_transaction, reseau_beneficiaires" },
                  { name: "Automatisation KYC", icon: ScanSearch, tech: "OCR + Computer Vision + NLP", target: "–20% temps traitement", how: "OCR extrait les données des CNI. CV détecte les falsifications. NLP valide la cohérence OCR/saisie.", features: "qualite_image_cni, coherence_ocr_saisie, detection_falsification, matching_facial, validite_document" },
                  { name: "RPA + ML Back-office", icon: Cog, tech: "Process Mining + Classification", target: "–20% charges opéx", how: "Process Mining reconstitue les processus réels. Classification ML priorise l'automatisation par ROI.", features: "temps_cycle_processus, taux_erreur_manuelle, volume_repetitions, complexite_workflow, cout_par_transaction" },
                ].map((m, i) => (
                  <div key={i} className="p-4 bg-muted/30 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <m.icon size={16} className="text-primary" />
                      <h4 className="font-display font-semibold text-sm text-card-foreground">{m.name}</h4>
                      <Badge variant="outline" className="text-[9px] ml-auto">{m.tech}</Badge>
                    </div>
                    <Badge className="bg-primary/10 text-primary text-[9px]">{m.target}</Badge>
                    <p className="text-[11px] text-muted-foreground leading-relaxed"><strong>Comment ça marche :</strong> {m.how}</p>
                    <p className="text-[10px] text-primary/70"><strong>Features clés :</strong> {m.features}</p>
                    {m.note && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-700 flex items-start gap-1">
                        <AlertTriangle size={10} className="mt-0.5 shrink-0" /> {m.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* FEATURE ENGINEERING */}
          <TabsContent value="features" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <GitBranch size={16} className="text-primary" /> Feature Engineering — Variables Prédictives
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Transformation des données brutes (KPIs du Dictionnaire Groupe) en variables exploitables par les modèles ML.
              </p>
              <div className="space-y-4">
                {[
                  { source: "Données Bancaires (Core Banking)", color: "border-l-blue-500", features: [
                    { name: "solde_actuel", type: "Numérique", desc: "Solde du compte courant (KPI: Solde comptable)", models: "Credit Scoring, Churn" },
                    { name: "nombre_transactions_mois", type: "Entier", desc: "TX mensuelles (KPI: Mouvements créditeurs + débiteurs)", models: "Churn, Fraude" },
                    { name: "montant_credit_en_cours", type: "Numérique", desc: "Encours crédit (KPI: Encours en ligne)", models: "Credit Scoring" },
                    { name: "nombre_incidents_paiement", type: "Entier", desc: "Impayés 12 mois (KPI: Montant impayés)", models: "Credit Scoring, Fraude" },
                    { name: "anciennete_mois", type: "Entier", desc: "Durée relation bancaire", models: "Churn, Credit Scoring" },
                    { name: "derniere_transaction_jours", type: "Entier", desc: "Jours depuis dernière TX (feature #1 Churn)", models: "Churn" },
                  ]},
                  { source: "Données Mobile Money (MoMo / Orange Money)", color: "border-l-orange-500", features: [
                    { name: "volume_momo_mensuel", type: "Numérique", desc: "Volume total MoMo sur le mois (FCFA)", models: "Credit Scoring, Inclusion" },
                    { name: "frequence_momo_mensuel", type: "Entier", desc: "Nombre de TX MoMo par mois", models: "Churn, Recommandation" },
                    { name: "ratio_momo_vs_bancaire", type: "Ratio [0-1]", desc: "Proportion MoMo vs bancaire classique", models: "Credit Scoring, Inclusion" },
                  ]},
                  { source: "Features Comportementales (Calculées)", color: "border-l-emerald-500", features: [
                    { name: "score_comportemental", type: "Score [0-100]", desc: "Composite : régularité TX × diversité produits × stabilité solde", models: "Credit Scoring, Reco" },
                    { name: "stabilite_revenus_6mois", type: "Ratio [0-1]", desc: "1 – CV(revenus 6 mois). 1 = parfaitement stable", models: "Credit Scoring (#1)" },
                    { name: "risque_churn", type: "Prob [0-1]", desc: "Score d'attrition XGBoost", models: "Churn, Campagnes" },
                    { name: "segment_rfm", type: "Catégoriel", desc: "Recency-Frequency-Monetary : Champion → Dormant", models: "Reco, Campagnes" },
                  ]},
                  { source: "Données Opérationnelles", color: "border-l-purple-500", features: [
                    { name: "duree_onboarding_minutes", type: "Entier", desc: "Temps ouverture compte (cible: 30 min)", models: "Process Mining, RPA" },
                    { name: "score_nps", type: "Entier [0-10]", desc: "Net Promoter Score", models: "Reco, Satisfaction" },
                    { name: "canal_principal", type: "Catégoriel", desc: "Agence, Mobile, Internet, ATM", models: "Reco, Campagnes" },
                    { name: "secteur_informel", type: "Booléen", desc: "Client du secteur informel", models: "Credit Scoring, Inclusion" },
                  ]},
                ].map((group, gi) => (
                  <div key={gi} className={`p-4 rounded-lg border-l-4 ${group.color} bg-muted/20`}>
                    <h4 className="font-display font-semibold text-sm text-card-foreground mb-3">{group.source}</h4>
                    <div className="space-y-2">
                      {group.features.map((f, fi) => (
                        <div key={fi} className="p-2.5 bg-background rounded border border-border/50">
                          <div className="flex items-center justify-between mb-1">
                            <code className="text-xs font-mono text-primary">{f.name}</code>
                            <Badge variant="outline" className="text-[8px]">{f.type}</Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                          <p className="text-[9px] text-primary/60 mt-0.5">Modèles: {f.models}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* SECURITY & RBAC */}
          <TabsContent value="security" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <Shield size={16} className="text-primary" /> Modèle RBAC — Contrôle d'Accès par Rôle
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="text-left py-2 pr-4">Rôle</th>
                      <th className="text-left py-2 px-2">Description</th>
                      <th className="text-left py-2 px-2">Pages Accessibles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: "🔐 Admin / RSSI", desc: "Supervision complète, gestion des permissions", pages: "Toutes" },
                      { role: "⚙️ Data Engineer", desc: "Maintenance des flux ETL (NiFi, Oracle → Lakehouse)", pages: "Dashboard, Big Data, Performance Ops, Paramètres" },
                      { role: "🧠 Data Scientist", desc: "Modèles ML — données anonymisées uniquement", pages: "Dashboard, Modèles ML, Expérience Client, Performance Ops" },
                      { role: "📊 Utilisateur Métier", desc: "Consultation KPI et prédictions en lecture seule", pages: "Dashboard, Expérience Client, Rapports" },
                      { role: "📋 Direction Conformité", desc: "Audit, traçabilité, explicabilité SHAP", pages: "Dashboard, Risques, Rapports, Modèles ML" },
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-3 pr-4 font-medium text-card-foreground whitespace-nowrap text-xs">{r.role}</td>
                        <td className="py-3 px-2 text-[10px] text-muted-foreground">{r.desc}</td>
                        <td className="py-3 px-2 text-[10px] text-muted-foreground">{r.pages}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3">Comptes de Test</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="text-left py-2 pr-4">Rôle</th>
                      <th className="text-left py-2 px-2">Email</th>
                      <th className="text-left py-2 px-2">Mot de passe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: "🔐 Admin/RSSI", email: "admin@scb-demo.cm", pass: "Admin2024!" },
                      { role: "🧠 Data Scientist", email: "ds@scb-demo.cm", pass: "DataSci2024!" },
                      { role: "⚙️ Data Engineer", email: "de@scb-demo.cm", pass: "DataEng2024!" },
                      { role: "📊 Utilisateur Métier", email: "metier@scb-demo.cm", pass: "Metier2024!" },
                      { role: "📋 Conformité", email: "conformite@scb-demo.cm", pass: "Conform2024!" },
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 pr-4 font-medium text-card-foreground text-xs">{r.role}</td>
                        <td className="py-2 px-2 text-xs font-mono text-primary">{r.email}</td>
                        <td className="py-2 px-2 text-xs font-mono text-muted-foreground">{r.pass}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Plage de codes clients de test : <strong>SCB-2024-0001</strong> à <strong>SCB-2024-0020</strong>
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3">Mesures de Sécurité</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Row Level Security (RLS)", desc: "Politiques RLS PostgreSQL garantissant que chaque utilisateur ne voit que les données autorisées pour son rôle." },
                  { title: "Fonctions Security Definer", desc: "Vérification des rôles via fonctions SECURITY DEFINER pour éviter les récursions RLS." },
                  { title: "Trigger handle_new_user()", desc: "Création automatique du profil et attribution du rôle par défaut (métier) à l'inscription." },
                  { title: "Authentification JWT", desc: "JWT avec refresh tokens, sessions persistantes et protection CSRF intégrée." },
                ].map((s, i) => (
                  <div key={i} className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs font-medium text-card-foreground flex items-center gap-1 mb-1">
                      <CheckCircle2 size={10} className="text-kpi-positive" /> {s.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* GLOSSARY */}
          <TabsContent value="glossary" className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-primary" /> Glossaire des Concepts
              </h3>
              <div className="space-y-2">
                {[
                  { term: "XGBoost", def: "eXtreme Gradient Boosting — Algorithme de boosting par arbres. Chaque arbre corrige les erreurs résiduelles du précédent. Très performant en classification tabulaire." },
                  { term: "SHAP", def: "SHapley Additive exPlanations — Méthode d'explicabilité basée sur la théorie des jeux. Attribue à chaque feature sa contribution marginale à la prédiction." },
                  { term: "R-Learner", def: "Estimation de l'effet causal hétérogène d'un traitement. Quantifie l'impact d'une action (ex: appel rétention) sur chaque client." },
                  { term: "Random Forest", def: "Ensemble d'arbres de décision sur des sous-échantillons aléatoires (bagging). Prédiction par vote majoritaire. Robuste au surapprentissage." },
                  { term: "Isolation Forest", def: "Détection d'anomalies par partitionnement aléatoire. Les points atypiques sont isolés en moins de partitions." },
                  { term: "RFM", def: "Recency-Frequency-Monetary — Segmentation basée sur la récence, fréquence et montant des transactions." },
                  { term: "NPS", def: "Net Promoter Score — « Recommanderiez-vous ? ». Promoteurs (9-10), Passifs (7-8), Détracteurs (0-6)." },
                  { term: "AUC", def: "Area Under ROC Curve — Capacité discriminante. AUC=1 parfait, AUC=0.5 aléatoire." },
                  { term: "Encours E/R", def: "Encours comptable ventilé par rubrique Emplois/Ressources, selon le sens Actif/Passif affecté." },
                  { term: "Collecte", def: "Variation des encours ressources entre deux dates. Collecte cumulée = Encours P – Encours 31/12/N-1." },
                  { term: "CMC", def: "Cumul Mouvements Créditeurs — Total des mouvements à l'initiative du client. Un CMC nul indique un client inactif." },
                  { term: "Architecture Medallion", def: "Raffinement progressif : Bronze (brut) → Silver (nettoyé) → Gold (agrégats KPI). Standard Data Lakehouse." },
                  { term: "CDC", def: "Change Data Capture — Capture incrémentale des modifications base source pour éviter les extractions complètes." },
                  { term: "Process Mining", def: "Reconstitution des processus réels à partir des event logs pour identifier goulots et automatiser via RPA." },
                  { term: "COBAC", def: "Commission Bancaire de l'Afrique Centrale — Régulateur zone CEMAC imposant l'explicabilité des décisions automatisées." },
                  { term: "KYC", def: "Know Your Customer — Vérification d'identité obligatoire pour la conformité anti-blanchiment." },
                  { term: "Feature Store", def: "Répertoire centralisé des variables ML calculées, versionné et partagé entre les modèles." },
                  { term: "PNB", def: "Produit Net Bancaire — Somme des revenus nets : intérêts + commissions + résultat change + autres." },
                  { term: "DAT", def: "Dépôt à Terme — Placement à durée et taux fixés. Sortie avant échéance = rachat." },
                ].map((g, i) => (
                  <div key={i} className="p-2.5 bg-muted/30 rounded flex items-start gap-2">
                    <code className="text-xs font-mono text-primary font-bold whitespace-nowrap">{g.term}</code>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{g.def}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default Rapports;
