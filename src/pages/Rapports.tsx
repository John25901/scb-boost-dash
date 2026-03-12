import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedPage from "@/components/AnimatedPage";
import {
  FileText, BookOpen, Brain, Database, Users, ShieldCheck,
  Layers, Target, Smartphone, Cog, TrendingUp, BarChart3,
  ChevronRight, Lightbulb, AlertTriangle, CheckCircle2, Shield,
  GitBranch, ScanSearch, Bot
} from "lucide-react";

const Rapports = () => (
  <AnimatedPage>
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Rapports & Documentation</h1>
        <p className="text-xs text-muted-foreground">Documentation technique, concepts ML, architecture et guide d'utilisation</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" className="text-xs">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="architecture" className="text-xs">Architecture</TabsTrigger>
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
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Users, label: "127 450", desc: "Clients actifs analysés" },
                { icon: Brain, label: "6 Modèles ML", desc: "En production / staging" },
                { icon: Database, label: "3.0 TB", desc: "Volume données traitées" },
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
                { title: "Mobile Money comme Source de Données", desc: "Les fréquences et volumes MoMo servent de features prédictives : ratio_momo_vs_bancaire, volume_momo_mensuel, fréquence_momo_mensuel." },
                { title: "Conformité COBAC", desc: "Toute décision automatisée (scoring crédit, détection fraude) doit être explicable. SHAP est utilisé pour fournir cette explicabilité." },
              ].map((c, i) => (
                <div key={i} className="p-3 bg-muted/30 rounded-lg">
                  <p className="font-medium text-card-foreground text-xs mb-1">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* ARCHITECTURE */}
        <TabsContent value="architecture" className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground mb-3 flex items-center gap-2">
              <Layers size={16} className="text-primary" /> Architecture Technique
            </h3>
            <div className="space-y-4">
              {[
                {
                  layer: "Couche d'Ingestion",
                  tech: "Apache NiFi, Oracle CDC, API Mobile Money",
                  desc: "Capture des flux transactionnels en temps réel depuis le Core Banking System, les APIs Mobile Money (MTN MoMo, Orange Money) et les systèmes legacy Oracle.",
                  color: "border-l-blue-500",
                },
                {
                  layer: "Couche de Stockage",
                  tech: "Data Lakehouse (Delta Lake / Parquet), PostgreSQL",
                  desc: "Architecture Medallion (Bronze → Silver → Gold) pour le raffinement progressif des données. Bronze: données brutes ; Silver: données nettoyées et normalisées ; Gold: agrégats et features prêtes pour le ML.",
                  color: "border-l-emerald-500",
                },
                {
                  layer: "Couche de Traitement",
                  tech: "Apache Spark, Python (Pandas, Scikit-learn, XGBoost)",
                  desc: "Feature Engineering distribué avec Spark pour les volumes importants. Entraînement des modèles ML en batch avec monitoring MLflow.",
                  color: "border-l-amber-500",
                },
                {
                  layer: "Couche d'Inférence & API",
                  tech: "Edge Functions (Deno), API REST, Lovable AI Gateway",
                  desc: "Serving des modèles via des fonctions serverless. Le Credit Scoring et les campagnes d'inclusion utilisent l'IA générative (Gemini/GPT) pour l'explicabilité et les recommandations.",
                  color: "border-l-purple-500",
                },
                {
                  layer: "Couche de Présentation",
                  tech: "React, TypeScript, Recharts, Tailwind CSS",
                  desc: "Dashboard interactif avec visualisations temps réel, système RBAC pour le contrôle d'accès granulaire, et composants modulaires réutilisables.",
                  color: "border-l-red-500",
                },
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
            <h3 className="font-display font-semibold text-card-foreground mb-3">Pipeline de Données — Flux Principal</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                "Core Banking (Oracle)", "→", "Apache NiFi (CDC)", "→",
                "Data Lake Bronze", "→", "Spark ETL", "→",
                "Data Lake Gold", "→", "Feature Store", "→",
                "Modèles ML", "→", "Dashboard / API",
              ].map((step, i) => (
                <span key={i} className={step === "→" ? "text-primary font-bold" : "px-2 py-1 bg-muted rounded text-muted-foreground"}>
                  {step}
                </span>
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
                {
                  name: "Churn Prediction", icon: TrendingUp,
                  tech: "XGBoost + SHAP + R-Learner",
                  target: "–5% d'attrition | AUC 97%",
                  how: "XGBoost est un algorithme de boosting par arbres de décision. Chaque arbre corrige les erreurs du précédent. SHAP (SHapley Additive exPlanations) décompose la prédiction en contribution de chaque variable. R-Learner estime l'effet causal hétérogène du traitement (ex: appeler un client) sur la rétention.",
                  features: "Jours depuis dernière TX, tendance solde 3 mois, fréquence MoMo, ratio MoMo/bancaire, score NPS, incidents paiement",
                  note: "⚠️ Le conseil d'administration reste réticent sur ce volet. Maintenu en observation.",
                },
                {
                  name: "Recommandation Financière", icon: Users,
                  tech: "Filtrage Collaboratif + NLP",
                  target: "+12% cross-sell",
                  how: "Le filtrage collaboratif identifie les clients aux profils similaires et recommande les produits souscrits par leurs pairs. Le NLP analyse les commentaires NPS et les interactions pour détecter les besoins implicites (ex: « je voyage souvent » → carte internationale).",
                  features: "Segment RFM, historique produits, score comportemental, canal principal, profession/âge",
                },
                {
                  name: "Credit Scoring IA", icon: Brain,
                  tech: "Random Forest + Réseaux de Neurones",
                  target: "Break-even 8% → 32%",
                  how: "Random Forest : ensemble d'arbres de décision indépendants dont on agrège les votes (bagging). Robuste au bruit. Le réseau de neurones capture les non-linéarités complexes. L'ensemble combine les deux via stacking. Le scoring produit un score 0-1000 avec catégorisation et SHAP pour la conformité COBAC.",
                  features: "Stabilité revenus 6 mois, score comportemental MoMo, ratio dette/revenu, ancienneté, transactions/mois, secteur informel",
                },
                {
                  name: "Détection Fraude / AML", icon: ShieldCheck,
                  tech: "Isolation Forest + Clustering",
                  target: "–60% faux positifs",
                  how: "Isolation Forest isole les anomalies en partitionnant aléatoirement l'espace des features. Les points anormaux sont isolés en moins de partitions. Le clustering (DBSCAN) regroupe les transactions normales, les outliers étant suspects. Réduit les faux positifs par rapport aux systèmes à règles statiques.",
                  features: "Vélocité TX/heure, géolocalisation inhabituelle, montant vs historique, heure de transaction, réseau de bénéficiaires",
                },
                {
                  name: "Automatisation KYC", icon: ScanSearch,
                  tech: "OCR avancé + Computer Vision + NLP",
                  target: "–20% temps de traitement",
                  how: "OCR (Reconnaissance Optique de Caractères) extrait les informations textuelles des documents d'identité (CNI, passeport). Computer Vision détecte les falsifications (textures, hologrammes). NLP valide la cohérence des données extraites avec la saisie manuelle.",
                  features: "Qualité image CNI, cohérence OCR/saisie, détection falsification, matching facial, validité document",
                },
                {
                  name: "RPA + ML Back-office", icon: Cog,
                  tech: "Process Mining + Classification",
                  target: "–20% charges opérationnelles",
                  how: "Process Mining reconstitue les processus réels à partir des logs système (event logs). Il identifie les goulots d'étranglement, les variations et les activités candidates à l'automatisation RPA (Robotic Process Automation). La classification ML priorise les processus à automatiser selon le ROI.",
                  features: "Temps de cycle processus, taux d'erreur manuelle, volume de répétitions, complexité workflow, coût par transaction",
                },
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
              Le Feature Engineering est le processus de transformation des données brutes en variables significatives pour les modèles ML. 
              Voici les features clés utilisées dans notre système, regroupées par source de données.
            </p>

            <div className="space-y-4">
              {[
                {
                  source: "Données Bancaires (Core Banking)",
                  color: "border-l-blue-500",
                  features: [
                    { name: "solde_actuel", type: "Numérique", desc: "Solde du compte courant à la date d'extraction", models: "Credit Scoring, Churn" },
                    { name: "nombre_transactions_mois", type: "Entier", desc: "Nombre de transactions bancaires sur le dernier mois", models: "Churn, Fraude" },
                    { name: "montant_credit_en_cours", type: "Numérique", desc: "Encours total de crédit du client", models: "Credit Scoring" },
                    { name: "nombre_incidents_paiement", type: "Entier", desc: "Nombre d'incidents de paiement sur 12 mois (impayés, rejets)", models: "Credit Scoring, Fraude" },
                    { name: "anciennete_mois", type: "Entier", desc: "Durée de la relation bancaire en mois", models: "Churn, Credit Scoring" },
                    { name: "derniere_transaction_jours", type: "Entier", desc: "Nombre de jours depuis la dernière transaction", models: "Churn (feature #1)" },
                  ],
                },
                {
                  source: "Données Mobile Money (MoMo / Orange Money)",
                  color: "border-l-orange-500",
                  features: [
                    { name: "volume_momo_mensuel", type: "Numérique", desc: "Volume total des transactions Mobile Money sur le mois (FCFA)", models: "Credit Scoring, Inclusion" },
                    { name: "frequence_momo_mensuel", type: "Entier", desc: "Nombre de transactions MoMo effectuées par mois", models: "Churn, Recommandation" },
                    { name: "ratio_momo_vs_bancaire", type: "Ratio [0-1]", desc: "Proportion des transactions MoMo vs bancaires classiques. Un ratio élevé indique une préférence pour le mobile", models: "Credit Scoring, Inclusion" },
                  ],
                },
                {
                  source: "Features Comportementales (Calculées)",
                  color: "border-l-emerald-500",
                  features: [
                    { name: "score_comportemental", type: "Score [0-100]", desc: "Score composite basé sur la régularité des transactions, la diversité des produits utilisés et la stabilité du solde", models: "Credit Scoring, Recommandation" },
                    { name: "stabilite_revenus_6mois", type: "Ratio [0-1]", desc: "Coefficient de variation inversé des revenus sur 6 mois. 1 = revenus parfaitement stables", models: "Credit Scoring (feature #1)" },
                    { name: "risque_churn", type: "Probabilité [0-1]", desc: "Score de risque d'attrition calculé par le modèle XGBoost", models: "Churn, Campagnes" },
                    { name: "segment_rfm", type: "Catégoriel", desc: "Segmentation Recency-Frequency-Monetary : Champion, Fidèle, Nouveau, Standard, À risque, Dormant", models: "Recommandation, Campagnes" },
                  ],
                },
                {
                  source: "Données Opérationnelles",
                  color: "border-l-purple-500",
                  features: [
                    { name: "duree_onboarding_minutes", type: "Entier", desc: "Temps total du processus d'ouverture de compte (cible: 30 min)", models: "Process Mining, RPA" },
                    { name: "score_nps", type: "Entier [0-10]", desc: "Score Net Promoter du dernier questionnaire de satisfaction", models: "Recommandation, Satisfaction" },
                    { name: "canal_principal", type: "Catégoriel", desc: "Canal d'interaction privilégié : Agence, Mobile, Internet, ATM", models: "Recommandation, Campagnes" },
                    { name: "secteur_informel", type: "Booléen", desc: "Indique si le client opère dans le secteur informel", models: "Credit Scoring, Inclusion" },
                  ],
                },
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
            <p className="text-xs text-muted-foreground mb-4">
              Le système utilise le principe du <strong>moindre privilège</strong> : chaque utilisateur ne peut accéder qu'aux pages et fonctionnalités nécessaires à son rôle.
              Les rôles sont stockés en base de données et vérifiés côté serveur.
            </p>

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
                    { role: "🔐 Admin / RSSI", desc: "Supervision complète, gestion des permissions et clés de chiffrement", pages: "Toutes" },
                    { role: "⚙️ Data Engineer", desc: "Conception et maintenance des flux ETL (NiFi, Oracle → Data Lakehouse)", pages: "Dashboard, Big Data, Performance Ops, Paramètres" },
                    { role: "🧠 Data Scientist", desc: "Création et entraînement des modèles ML — données anonymisées", pages: "Dashboard, Modèles ML, Expérience Client, Performance Ops" },
                    { role: "📊 Utilisateur Métier", desc: "Consultation lecture seule des prédictions et tableaux de bord", pages: "Dashboard, Expérience Client, Rapports" },
                    { role: "📋 Direction Conformité", desc: "Audit des accès, traçabilité et explicabilité des modèles IA", pages: "Dashboard, Risques, Rapports, Modèles ML" },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-medium text-card-foreground whitespace-nowrap">{r.role}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{r.desc}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{r.pages}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold text-card-foreground mb-3">Comptes de Test</h3>
            <p className="text-xs text-muted-foreground mb-3">Identifiants pour tester les différents profils :</p>
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
                { title: "Row Level Security (RLS)", desc: "Les politiques RLS de PostgreSQL garantissent que chaque utilisateur ne peut voir que les données autorisées pour son rôle." },
                { title: "Fonctions Security Definer", desc: "La vérification des rôles utilise des fonctions SECURITY DEFINER pour éviter les récursions RLS et les fuites de permissions." },
                { title: "Trigger handle_new_user()", desc: "À l'inscription, un trigger crée automatiquement le profil et attribue le rôle par défaut (métier)." },
                { title: "Authentification Supabase", desc: "Authentification JWT avec refresh tokens, sessions persistantes et protection CSRF intégrée." },
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
                { term: "XGBoost", def: "eXtreme Gradient Boosting — Algorithme d'apprentissage par ensemble d'arbres de décision. Chaque arbre est entraîné pour corriger les erreurs résiduelles du précédent. Très performant en classification tabulaire." },
                { term: "SHAP", def: "SHapley Additive exPlanations — Méthode d'explicabilité basée sur la théorie des jeux coopératifs. Attribue à chaque feature sa contribution marginale à la prédiction. Essentiel pour la conformité COBAC." },
                { term: "R-Learner", def: "Méthode d'estimation de l'effet causal hétérogène d'un traitement. Permet de quantifier l'impact d'une action (ex: appel de rétention) sur chaque client individuellement." },
                { term: "Random Forest", def: "Forêt aléatoire — Ensemble d'arbres de décision entraînés sur des sous-échantillons aléatoires (bagging). La prédiction est le vote majoritaire. Robuste au surapprentissage." },
                { term: "Isolation Forest", def: "Algorithme de détection d'anomalies basé sur l'idée que les points atypiques sont plus faciles à isoler par partitionnement aléatoire." },
                { term: "RFM", def: "Recency-Frequency-Monetary — Segmentation client basée sur la récence de la dernière transaction, la fréquence d'achat et le montant total dépensé." },
                { term: "NPS", def: "Net Promoter Score — Indicateur de satisfaction basé sur une question unique : « Recommanderiez-vous ? ». Score de -100 à +100. Promoteurs (9-10), Passifs (7-8), Détracteurs (0-6)." },
                { term: "AUC", def: "Area Under the ROC Curve — Mesure de la capacité discriminante d'un modèle de classification. AUC=1 : parfait, AUC=0.5 : aléatoire." },
                { term: "Matrice de Confusion", def: "Tableau croisant les prédictions (positif/négatif) avec la réalité. 4 cellules : Vrais Positifs, Faux Positifs, Faux Négatifs, Vrais Négatifs." },
                { term: "Process Mining", def: "Discipline utilisant les event logs des systèmes d'information pour reconstituer, analyser et optimiser les processus métier réels." },
                { term: "OCR", def: "Optical Character Recognition — Technologie de reconnaissance optique de caractères permettant d'extraire du texte à partir d'images de documents." },
                { term: "RPA", def: "Robotic Process Automation — Automatisation des tâches répétitives par des bots logiciels mimant les actions humaines sur les interfaces." },
                { term: "COBAC", def: "Commission Bancaire de l'Afrique Centrale — Régulateur bancaire de la zone CEMAC qui impose des exigences de transparence et d'explicabilité pour les décisions automatisées." },
                { term: "KYC", def: "Know Your Customer — Processus de vérification de l'identité des clients, obligatoire pour la conformité réglementaire anti-blanchiment." },
                { term: "AML", def: "Anti-Money Laundering — Ensemble de procédures et systèmes de détection du blanchiment d'argent." },
                { term: "Feature Engineering", def: "Processus de création de variables prédictives à partir de données brutes. L'art de transformer les données en informations exploitables par les algorithmes." },
                { term: "Data Lakehouse", def: "Architecture hybride combinant la flexibilité du Data Lake (stockage de données brutes) et la structure du Data Warehouse (requêtes analytiques). Souvent implémenté avec Delta Lake." },
                { term: "ETL", def: "Extract, Transform, Load — Pipeline de données extrayant les données sources, les transformant (nettoyage, enrichissement) et les chargeant dans le système cible." },
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

export default Rapports;
