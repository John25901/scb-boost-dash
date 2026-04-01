import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedPage from "@/components/AnimatedPage";
import ExportToolbar from "@/components/ExportToolbar";
import {
  Search, User, Briefcase, Building2, Calendar, CreditCard,
  TrendingUp, AlertTriangle, CheckCircle2, Loader2, Brain,
  Phone, Mail, MapPin, Activity, ShieldCheck,
  Target, Lightbulb, Users, Sparkles, ChevronRight,
  Smartphone, Wallet, BarChart3, Zap, Send, Filter,
  Megaphone, MessageSquare, XCircle
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

interface Client {
  id: string;
  code_client: string;
  nom: string;
  prenom: string;
  date_naissance: string | null;
  genre: string;
  type_personne: string;
  profession: string | null;
  secteur_activite: string | null;
  revenu_mensuel: number | null;
  email: string | null;
  telephone: string | null;
  ville: string | null;
  date_ouverture_compte: string;
  type_compte: string;
  solde_actuel: number;
  nombre_transactions_mois: number;
  montant_credit_en_cours: number;
  nombre_incidents_paiement: number;
  anciennete_mois: number;
  statut: string;
  volume_momo_mensuel: number;
  frequence_momo_mensuel: number;
  ratio_momo_vs_bancaire: number;
  score_nps: number | null;
  segment_rfm: string;
  secteur_informel: boolean;
  canal_principal: string;
  score_comportemental: number | null;
  stabilite_revenus_6mois: number | null;
  duree_onboarding_minutes: number | null;
  risque_churn: number | null;
  derniere_transaction_jours: number;
}

interface CreditScore {
  score: number;
  categorie: string;
  probabilite_defaut: number;
  facteurs_positifs: string[];
  facteurs_negatifs: string[];
  recommandation: string;
  limite_credit_suggeree: number;
  features_importance: { feature: string; importance: number; impact: string }[];
}

interface Campaign {
  titre: string;
  description: string;
  cible: string;
  actions_concretes: string[];
  impact_estime: string;
  budget_estime: string;
  priorite: string;
  canal_principal: string;
  indicateurs_succes: string[];
}

interface CampaignSuggestions {
  segment_analyse: string;
  campagnes: Campaign[];
  recommandation_generale: string;
}

const formatCFA = (n: number) => new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(n);

const scoreColor = (cat: string) => {
  switch (cat) {
    case "Excellent": return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "Bon": return "text-blue-600 bg-blue-50 border-blue-200";
    case "Moyen": return "text-amber-600 bg-amber-50 border-amber-200";
    case "Risqué": return "text-orange-600 bg-orange-50 border-orange-200";
    default: return "text-red-600 bg-red-50 border-red-200";
  }
};

const scoreBarColor = (cat: string) => {
  switch (cat) {
    case "Excellent": return "bg-emerald-500";
    case "Bon": return "bg-blue-500";
    case "Moyen": return "bg-amber-500";
    case "Risqué": return "bg-orange-500";
    default: return "bg-red-500";
  }
};

const prioriteColor = (p: string) => {
  switch (p) {
    case "haute": return "bg-red-100 text-red-700 border-red-200";
    case "moyenne": return "bg-amber-100 text-amber-700 border-amber-200";
    default: return "bg-green-100 text-green-700 border-green-200";
  }
};

const churnColor = (r: number) => r >= 0.7 ? "text-kpi-negative" : r >= 0.4 ? "text-kpi-warning" : "text-kpi-positive";
const rfmColor = (s: string) => {
  switch (s) {
    case "Champion": return "bg-emerald-100 text-emerald-700";
    case "Fidèle": return "bg-blue-100 text-blue-700";
    case "Nouveau": return "bg-purple-100 text-purple-700";
    case "À risque": return "bg-orange-100 text-orange-700";
    case "Dormant": return "bg-red-100 text-red-700";
    default: return "bg-secondary text-muted-foreground";
  }
};

// Segment filter options
const SEGMENT_FILTERS = [
  { value: "all", label: "Tous les clients" },
  { value: "jeunes", label: "Jeunes (< 30 ans)" },
  { value: "femmes", label: "Femmes" },
  { value: "informel", label: "Secteur Informel" },
  { value: "entreprises", label: "Entreprises / Associations" },
  { value: "champion", label: "RFM: Champions" },
  { value: "a_risque", label: "RFM: À risque" },
  { value: "dormant", label: "RFM: Dormants" },
  { value: "momo_actif", label: "MoMo Actifs (>50%)" },
];

const CHART_ATTRIBUTES = [
  { value: "solde_actuel", label: "Solde actuel" },
  { value: "volume_momo_mensuel", label: "Volume MoMo" },
  { value: "nombre_transactions_mois", label: "Transactions/mois" },
  { value: "anciennete_mois", label: "Ancienneté (mois)" },
  { value: "risque_churn", label: "Risque Churn" },
  { value: "score_comportemental", label: "Score Comportemental" },
  { value: "revenu_mensuel", label: "Revenu mensuel" },
];

// === RESPONSE CODES (Motifs d'échec TX) ===
const responseCodesData = [
  { code: "00", libelle: "Transaction approuvée", count: 485200, pct: 87.2, categorie: "Succès" },
  { code: "51", libelle: "Fonds insuffisants", count: 28400, pct: 5.1, categorie: "Échec Client" },
  { code: "05", libelle: "Ne pas honorer", count: 12800, pct: 2.3, categorie: "Échec Banque" },
  { code: "14", libelle: "Numéro de carte invalide", count: 8500, pct: 1.5, categorie: "Échec Client" },
  { code: "54", libelle: "Carte expirée", count: 6200, pct: 1.1, categorie: "Échec Client" },
  { code: "61", libelle: "Dépassement plafond retrait", count: 5800, pct: 1.0, categorie: "Limite" },
  { code: "91", libelle: "Émetteur indisponible", count: 3200, pct: 0.6, categorie: "Technique" },
  { code: "96", libelle: "Dysfonctionnement système", count: 2100, pct: 0.4, categorie: "Technique" },
  { code: "41", libelle: "Carte perdue", count: 1800, pct: 0.3, categorie: "Fraude" },
  { code: "43", libelle: "Carte volée", count: 1200, pct: 0.2, categorie: "Fraude" },
  { code: "65", libelle: "Dépassement nb retraits", count: 980, pct: 0.2, categorie: "Limite" },
  { code: "03", libelle: "Commerçant invalide", count: 650, pct: 0.1, categorie: "Technique" },
];

const rcCategorieColor = (cat: string) => {
  switch (cat) {
    case "Succès": return "bg-kpi-positive/10 text-kpi-positive";
    case "Échec Client": return "bg-kpi-warning/10 text-kpi-warning";
    case "Échec Banque": return "bg-kpi-negative/10 text-kpi-negative";
    case "Technique": return "bg-primary/10 text-primary";
    case "Fraude": return "bg-destructive/10 text-destructive";
    case "Limite": return "bg-secondary text-secondary-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const ExperienceClient = () => {
  const [searchCode, setSearchCode] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [scoring, setScoring] = useState<CreditScore | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignSuggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [scoringLoading, setScoringLoading] = useState(false);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [showScoringConfirm, setShowScoringConfirm] = useState(false);
  const [showCampaignConfirm, setShowCampaignConfirm] = useState(false);
  const [showLaunchConfirm, setShowLaunchConfirm] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "scoring" | "campaigns" | "segment">("info");
  const { toast } = useToast();

  // Segment analysis state
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [chartAttribute, setChartAttribute] = useState("solde_actuel");
  const [segmentClients, setSegmentClients] = useState<Client[]>([]);
  const [segmentLoading, setSegmentLoading] = useState(false);
  const [segmentCampaigns, setSegmentCampaigns] = useState<CampaignSuggestions | null>(null);
  const [segmentCampaignLoading, setSegmentCampaignLoading] = useState(false);

  const searchClient = async () => {
    if (!searchCode.trim()) return;
    setLoading(true);
    setClient(null);
    setScoring(null);
    setCampaigns(null);
    setActiveTab("info");

    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .or(`code_client.eq.${searchCode.trim()},nom.ilike.%${searchCode.trim()}%,prenom.ilike.%${searchCode.trim()}%`)
        .limit(1)
        .single();

      if (error || !data) {
        toast({ title: "❌ Client introuvable", description: "Vérifiez le code client ou le nom.", variant: "destructive" });
        return;
      }
      setClient(data as unknown as Client);
      toast({ title: "✅ Client trouvé", description: `${data.prenom} ${data.nom} — ${data.code_client}` });
    } catch {
      toast({ title: "❌ Erreur", description: "Impossible de rechercher le client.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadSegmentClients = async (filter: string) => {
    setSegmentLoading(true);
    setSegmentCampaigns(null);
    try {
      let query = supabase.from("clients").select("*");

      switch (filter) {
        case "jeunes":
          query = query.gte("date_naissance", "1996-01-01");
          break;
        case "femmes":
          query = query.eq("genre", "F");
          break;
        case "informel":
          query = query.eq("secteur_informel", true);
          break;
        case "entreprises":
          query = query.eq("type_personne", "morale");
          break;
        case "champion":
          query = query.eq("segment_rfm", "Champion");
          break;
        case "a_risque":
          query = query.eq("segment_rfm", "À risque");
          break;
        case "dormant":
          query = query.eq("segment_rfm", "Dormant");
          break;
        case "momo_actif":
          query = query.gte("ratio_momo_vs_bancaire", 0.5);
          break;
      }

      const { data, error } = await query.order("code_client");
      if (error) throw error;
      setSegmentClients((data || []) as unknown as Client[]);
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setSegmentLoading(false);
    }
  };

  const generateSegmentCampaigns = async () => {
    if (segmentClients.length === 0) return;
    setSegmentCampaignLoading(true);

    const segmentLabel = SEGMENT_FILTERS.find(f => f.value === segmentFilter)?.label || "Général";
    const avgSolde = segmentClients.reduce((a, c) => a + (c.solde_actuel || 0), 0) / segmentClients.length;
    const avgMomo = segmentClients.reduce((a, c) => a + (c.volume_momo_mensuel || 0), 0) / segmentClients.length;
    const avgChurn = segmentClients.reduce((a, c) => a + (c.risque_churn || 0), 0) / segmentClients.length;

    try {
      const { data, error } = await supabase.functions.invoke("campaign-suggestions", {
        body: {
          segment: segmentLabel,
          clients_stats: {
            nombre_clients: segmentClients.length,
            solde_moyen: Math.round(avgSolde),
            volume_momo_moyen: Math.round(avgMomo),
            risque_churn_moyen: (avgChurn * 100).toFixed(1) + "%",
            villes: [...new Set(segmentClients.map(c => c.ville).filter(Boolean))].join(", "),
            canaux: [...new Set(segmentClients.map(c => c.canal_principal))].join(", "),
          },
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSegmentCampaigns(data);
      toast({ title: "🎯 Campagnes segment générées", description: `${data.campagnes?.length || 0} campagnes pour ${segmentLabel}` });
    } catch (e: any) {
      toast({ title: "❌ Erreur", description: e.message, variant: "destructive" });
    } finally {
      setSegmentCampaignLoading(false);
    }
  };

  const launchCampaign = (campaign: Campaign, index: number) => {
    setShowLaunchConfirm(null);
    toast({
      title: "🚀 Campagne lancée !",
      description: `"${campaign.titre}" — ${segmentClients.length} clients ciblés via ${campaign.canal_principal}. Notification envoyée au Back-office Marketing.`,
    });
  };

  const runCreditScoring = async () => {
    if (!client) return;
    setShowScoringConfirm(false);
    setScoringLoading(true);
    setActiveTab("scoring");

    try {
      const { data, error } = await supabase.functions.invoke("credit-scoring", { body: { client } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setScoring(data);
      toast({ title: "🧠 Credit Scoring terminé", description: `Score: ${data.score}/1000 — ${data.categorie}` });
    } catch (e: any) {
      toast({ title: "❌ Erreur scoring", description: e.message, variant: "destructive" });
    } finally {
      setScoringLoading(false);
    }
  };

  const runCampaignSuggestions = async () => {
    if (!client) return;
    setShowCampaignConfirm(false);
    setCampaignLoading(true);
    setActiveTab("campaigns");

    const age = client.date_naissance
      ? Math.floor((Date.now() - new Date(client.date_naissance).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null;
    const segment = age && age < 30 ? "Jeunes (< 30 ans)"
      : client.genre === "F" ? "Femmes"
      : client.type_personne === "morale" ? "Entreprises/Associations"
      : client.secteur_informel ? "Secteur Informel"
      : "Général";

    try {
      const { data, error } = await supabase.functions.invoke("campaign-suggestions", {
        body: {
          segment,
          clients_stats: {
            client_exemple: `${client.prenom} ${client.nom}`,
            age, genre: client.genre, type_personne: client.type_personne,
            profession: client.profession, secteur: client.secteur_activite,
            revenu_mensuel: client.revenu_mensuel, ville: client.ville,
            type_compte: client.type_compte, anciennete_mois: client.anciennete_mois,
            solde_actuel: client.solde_actuel,
            volume_momo: client.volume_momo_mensuel,
            ratio_momo: client.ratio_momo_vs_bancaire,
            secteur_informel: client.secteur_informel,
            canal_principal: client.canal_principal,
            segment_rfm: client.segment_rfm,
          },
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setCampaigns(data);
      toast({ title: "🎯 Suggestions générées", description: `${data.campagnes?.length || 0} campagnes proposées` });
    } catch (e: any) {
      toast({ title: "❌ Erreur campagnes", description: e.message, variant: "destructive" });
    } finally {
      setCampaignLoading(false);
    }
  };

  // Chart data from segment clients
  const getChartData = () => {
    if (segmentClients.length === 0) return [];
    return segmentClients.slice(0, 20).map(c => ({
      name: c.code_client.replace("SCB-2024-", ""),
      value: (c as any)[chartAttribute] || 0,
      fullName: `${c.prenom} ${c.nom}`,
    }));
  };

  // Radar data for segment
  const getRadarData = () => {
    if (segmentClients.length === 0) return [];
    const avg = (key: keyof Client) => segmentClients.reduce((a, c) => a + (Number((c as any)[key]) || 0), 0) / segmentClients.length;
    return [
      { axis: "Solde (norm.)", value: Math.min(100, avg("solde_actuel") / 10000) },
      { axis: "MoMo Vol.", value: Math.min(100, avg("volume_momo_mensuel") / 5000) },
      { axis: "TX/mois", value: Math.min(100, avg("nombre_transactions_mois") * 5) },
      { axis: "Score Comport.", value: avg("score_comportemental") || 50 },
      { axis: "Stabilité Rev.", value: (avg("stabilite_revenus_6mois") || 0.5) * 100 },
      { axis: "Ancienneté", value: Math.min(100, avg("anciennete_mois") * 2) },
    ];
  };

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Intelligence Client</h1>
          <p className="text-xs text-muted-foreground">Recherche client, Credit Scoring IA, campagnes d'inclusion & analyse par segment</p>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Code client (ex: SCB-2024-0001) ou nom..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchClient()}
                className="pl-9"
              />
            </div>
            <Button onClick={searchClient} disabled={loading || !searchCode.trim()}>
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Search size={16} className="mr-2" />}
              Rechercher
            </Button>
          </div>
        </Card>

        {/* Main Tabs */}
        <div className="flex gap-2 flex-wrap">
          {([
            ...(client ? [
              { key: "info" as const, label: "Profil Client", icon: User },
              { key: "scoring" as const, label: "Credit Scoring IA", icon: Brain },
              { key: "campaigns" as const, label: "Campagnes Inclusion", icon: Target },
            ] : []),
          { key: "segment" as const, label: "Analyse par Segment", icon: Users },
            { key: "response_codes" as const, label: "Response Codes", icon: XCircle },
          ]).map(tab => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (tab.key === "scoring" && !scoring && !scoringLoading) setShowScoringConfirm(true);
                else if (tab.key === "campaigns" && !campaigns && !campaignLoading) setShowCampaignConfirm(true);
                else setActiveTab(tab.key);
              }}
            >
              <tab.icon size={14} className="mr-1.5" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* INFO TAB */}
        {activeTab === "info" && client && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Segment RFM</p>
                <Badge className={`mt-1 text-[10px] ${rfmColor(client.segment_rfm)}`}>{client.segment_rfm}</Badge>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Risque Churn</p>
                <p className={`text-lg font-display font-bold ${churnColor(client.risque_churn || 0)}`}>
                  {((client.risque_churn || 0) * 100).toFixed(0)}%
                </p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Score NPS</p>
                <p className="text-lg font-display font-bold text-card-foreground">{client.score_nps ?? "—"}/10</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Score Comportemental</p>
                <p className="text-lg font-display font-bold text-primary">{client.score_comportemental ?? "—"}/100</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Personal info */}
              <Card className="p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {client.type_personne === "morale" ? <Building2 size={20} className="text-primary" /> : <User size={20} className="text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-card-foreground">{client.prenom} {client.nom}</h3>
                    <p className="text-xs text-muted-foreground">{client.code_client}</p>
                  </div>
                  <div className="ml-auto flex gap-1.5">
                    <Badge variant="outline">{client.type_personne === "physique" ? "Personne Physique" : "Personne Morale"}</Badge>
                    {client.secteur_informel && <Badge className="bg-amber-100 text-amber-700 text-[9px]">Informel</Badge>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {client.date_naissance && (
                    <div className="flex items-center gap-2 text-muted-foreground"><Calendar size={14} /><span>Né(e) le {new Date(client.date_naissance).toLocaleDateString("fr-FR")}</span></div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground"><User size={14} /><span>{client.genre === "M" ? "Homme" : "Femme"}</span></div>
                  {client.profession && <div className="flex items-center gap-2 text-muted-foreground"><Briefcase size={14} /><span>{client.profession}</span></div>}
                  {client.secteur_activite && <div className="flex items-center gap-2 text-muted-foreground"><Building2 size={14} /><span>{client.secteur_activite}</span></div>}
                  {client.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail size={14} /><span className="truncate">{client.email}</span></div>}
                  {client.telephone && <div className="flex items-center gap-2 text-muted-foreground"><Phone size={14} /><span>{client.telephone}</span></div>}
                  {client.ville && <div className="flex items-center gap-2 text-muted-foreground"><MapPin size={14} /><span>{client.ville}</span></div>}
                  <div className="flex items-center gap-2 text-muted-foreground"><Zap size={14} /><span>Canal: {client.canal_principal}</span></div>
                </div>
              </Card>

              {/* Account info */}
              <Card className="p-5 space-y-3">
                <h3 className="font-display font-semibold text-card-foreground flex items-center gap-2">
                  <CreditCard size={16} className="text-primary" /> Informations Compte
                </h3>
                {[
                  { label: "Type de compte", value: <Badge>{client.type_compte}</Badge> },
                  { label: "Date d'ouverture", value: new Date(client.date_ouverture_compte).toLocaleDateString("fr-FR") },
                  { label: "Ancienneté", value: `${client.anciennete_mois} mois` },
                  { label: "Solde actuel", value: <span className="font-bold text-primary">{formatCFA(client.solde_actuel)}</span> },
                  { label: "Revenu mensuel", value: client.revenu_mensuel ? formatCFA(client.revenu_mensuel) : "N/A" },
                  { label: "TX/mois", value: <span className="flex items-center gap-1"><Activity size={12} /> {client.nombre_transactions_mois}</span> },
                  { label: "Crédit en cours", value: formatCFA(client.montant_credit_en_cours) },
                  { label: "Incidents", value: <span className={client.nombre_incidents_paiement > 0 ? "text-destructive font-bold" : "text-kpi-positive font-bold"}>{client.nombre_incidents_paiement}</span> },
                  { label: "Dern. TX", value: `il y a ${client.derniere_transaction_jours} jours` },
                  { label: "Stabilité revenus", value: client.stabilite_revenus_6mois ? `${(client.stabilite_revenus_6mois * 100).toFixed(0)}%` : "N/A" },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </Card>
            </div>

            {/* Mobile Money */}
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground flex items-center gap-2 mb-4">
                <Smartphone size={16} className="text-primary" /> Données Mobile Money (MoMo / Orange Money)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <Wallet size={16} className="mx-auto text-primary mb-1" />
                  <p className="text-[10px] text-muted-foreground">Volume MoMo/mois</p>
                  <p className="text-sm font-display font-bold text-card-foreground">{formatCFA(client.volume_momo_mensuel)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <Activity size={16} className="mx-auto text-primary mb-1" />
                  <p className="text-[10px] text-muted-foreground">Fréquence/mois</p>
                  <p className="text-sm font-display font-bold text-card-foreground">{client.frequence_momo_mensuel} TX</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <BarChart3 size={16} className="mx-auto text-primary mb-1" />
                  <p className="text-[10px] text-muted-foreground">Ratio MoMo/Bancaire</p>
                  <p className="text-sm font-display font-bold text-card-foreground">{(client.ratio_momo_vs_bancaire * 100).toFixed(0)}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <TimerIcon size={16} className="mx-auto text-primary mb-1" />
                  <p className="text-[10px] text-muted-foreground">Onboarding</p>
                  <p className="text-sm font-display font-bold text-card-foreground">{client.duree_onboarding_minutes ?? "—"} min</p>
                </div>
              </div>
            </Card>

            {/* Predictive Features used */}
            <Card className="p-5">
              <h3 className="font-display font-semibold text-card-foreground flex items-center gap-2 mb-3">
                <Brain size={16} className="text-primary" /> Features Prédictives — Profil Client
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Variables utilisées par les modèles ML pour l'analyse de ce client</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  { feature: "Risque Churn (XGBoost)", value: `${((client.risque_churn || 0) * 100).toFixed(0)}%`, model: "Churn Prediction", color: churnColor(client.risque_churn || 0) },
                  { feature: "Score Comportemental", value: `${client.score_comportemental ?? "—"}/100`, model: "Credit Scoring", color: "text-primary" },
                  { feature: "Stabilité Revenus 6m", value: client.stabilite_revenus_6mois ? `${(client.stabilite_revenus_6mois * 100).toFixed(0)}%` : "N/A", model: "Credit Scoring", color: "text-primary" },
                  { feature: "Ratio MoMo/Bancaire", value: `${(client.ratio_momo_vs_bancaire * 100).toFixed(0)}%`, model: "Inclusion Financière", color: "text-primary" },
                  { feature: "Jours depuis dern. TX", value: `${client.derniere_transaction_jours}j`, model: "Churn Prediction", color: client.derniere_transaction_jours > 30 ? "text-kpi-negative" : "text-kpi-positive" },
                  { feature: "Nb Incidents Paiement", value: `${client.nombre_incidents_paiement}`, model: "Credit Scoring / Fraude", color: client.nombre_incidents_paiement > 0 ? "text-kpi-negative" : "text-kpi-positive" },
                  { feature: "Segment RFM", value: client.segment_rfm, model: "Recommandation", color: "text-primary" },
                  { feature: "Score NPS", value: `${client.score_nps ?? "—"}/10`, model: "Satisfaction", color: "text-primary" },
                  { feature: "Secteur Informel", value: client.secteur_informel ? "Oui" : "Non", model: "Inclusion", color: "text-primary" },
                ].map((f, i) => (
                  <div key={i} className="p-2.5 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{f.feature}</span>
                      <span className={`text-xs font-bold ${f.color}`}>{f.value}</span>
                    </div>
                    <span className="text-[9px] text-primary/60 italic">→ {f.model}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* SCORING TAB */}
        {activeTab === "scoring" && client && (
          <div className="animate-fade-in">
            {scoringLoading ? (
              <Card className="p-12 flex flex-col items-center gap-4">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyse IA en cours... Le modèle évalue le profil du client.</p>
              </Card>
            ) : scoring ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="p-5 lg:col-span-1 space-y-4">
                  <h3 className="font-display font-semibold text-card-foreground flex items-center gap-2">
                    <Brain size={16} className="text-primary" /> Score de Crédit
                  </h3>
                  <div className="text-center space-y-3">
                    <div className={`inline-flex flex-col items-center p-6 rounded-2xl border-2 ${scoreColor(scoring.categorie)}`}>
                      <span className="text-4xl font-display font-black">{scoring.score}</span>
                      <span className="text-xs font-medium">/1000</span>
                    </div>
                    <Badge className={`text-sm px-3 py-1 ${scoreColor(scoring.categorie)}`}>{scoring.categorie}</Badge>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all duration-1000 ${scoreBarColor(scoring.categorie)}`}
                        style={{ width: `${scoring.score / 10}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Prob. défaut</span>
                      <span className="font-bold">{scoring.probabilite_defaut}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Limite crédit</span>
                      <span className="font-bold">{formatCFA(scoring.limite_credit_suggeree)}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 lg:col-span-2 space-y-4">
                  <h3 className="font-display font-semibold text-card-foreground">Analyse détaillée</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-kpi-positive flex items-center gap-1"><CheckCircle2 size={12} /> Facteurs positifs</p>
                      {scoring.facteurs_positifs.map((f, i) => (
                        <p key={i} className="text-xs text-muted-foreground pl-4 flex items-start gap-1">
                          <ChevronRight size={10} className="mt-0.5 shrink-0 text-kpi-positive" /> {f}
                        </p>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-destructive flex items-center gap-1"><AlertTriangle size={12} /> Facteurs négatifs</p>
                      {scoring.facteurs_negatifs.map((f, i) => (
                        <p key={i} className="text-xs text-muted-foreground pl-4 flex items-start gap-1">
                          <ChevronRight size={10} className="mt-0.5 shrink-0 text-destructive" /> {f}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-card-foreground">Feature Importance (Explicabilité SHAP)</p>
                    {scoring.features_importance?.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-36 truncate text-muted-foreground">{f.feature}</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className={`h-2 rounded-full ${f.impact === "positif" ? "bg-kpi-positive" : "bg-kpi-negative"}`}
                            style={{ width: `${f.importance}%` }} />
                        </div>
                        <span className="w-8 text-right font-medium">{f.importance}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-xs font-medium text-primary flex items-center gap-1 mb-1"><Lightbulb size={12} /> Recommandation</p>
                    <p className="text-xs text-muted-foreground">{scoring.recommandation}</p>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 flex flex-col items-center gap-4 text-center">
                <Brain size={32} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Cliquez sur l'onglet pour lancer l'analyse.</p>
              </Card>
            )}
          </div>
        )}

        {/* CAMPAIGNS TAB (individual client) */}
        {activeTab === "campaigns" && client && (
          <div className="animate-fade-in">
            {campaignLoading ? (
              <Card className="p-12 flex flex-col items-center gap-4">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">L'IA génère des suggestions de campagnes d'inclusion financière...</p>
              </Card>
            ) : campaigns ? (
              <div className="space-y-4">
                <Card className="p-4 bg-primary/5 border-primary/10">
                  <p className="text-xs font-medium text-primary flex items-center gap-1"><Sparkles size={12} /> Segment analysé: {campaigns.segment_analyse}</p>
                  <p className="text-xs text-muted-foreground mt-1">{campaigns.recommandation_generale}</p>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {campaigns.campagnes?.map((c, i) => (
                    <Card key={i} className="p-5 space-y-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-semibold text-sm text-card-foreground">{c.titre}</h4>
                        <Badge className={`text-[10px] shrink-0 ${prioriteColor(c.priorite)}`}>{c.priorite}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Users size={12} className="text-primary" />
                        <span className="text-muted-foreground">Cible: {c.cible}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium text-card-foreground">Actions concrètes :</p>
                        {c.actions_concretes?.map((a, j) => (
                          <p key={j} className="text-[11px] text-muted-foreground flex items-start gap-1">
                            <ChevronRight size={10} className="mt-0.5 shrink-0 text-primary" /> {a}
                          </p>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className="px-2 py-0.5 bg-muted rounded">💰 {c.budget_estime}</span>
                        <span className="px-2 py-0.5 bg-muted rounded">📡 {c.canal_principal}</span>
                        <span className="px-2 py-0.5 bg-muted rounded">📈 {c.impact_estime}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="p-12 flex flex-col items-center gap-4 text-center">
                <Target size={32} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Cliquez sur l'onglet pour générer des suggestions de campagnes.</p>
              </Card>
            )}
          </div>
        )}

        {/* SEGMENT TAB */}
        {activeTab === "segment" && (
          <div className="space-y-4 animate-fade-in">
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-medium text-card-foreground flex items-center gap-1">
                    <Filter size={12} /> Segment Client
                  </label>
                  <Select value={segmentFilter} onValueChange={(v) => { setSegmentFilter(v); loadSegmentClients(v); }}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEGMENT_FILTERS.map(f => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-medium text-card-foreground flex items-center gap-1">
                    <BarChart3 size={12} /> Attribut graphique
                  </label>
                  <Select value={chartAttribute} onValueChange={setChartAttribute}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHART_ATTRIBUTES.map(a => (
                        <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => loadSegmentClients(segmentFilter)} disabled={segmentLoading} size="sm">
                  {segmentLoading ? <Loader2 size={14} className="animate-spin mr-1" /> : <Search size={14} className="mr-1" />}
                  Charger
                </Button>
              </div>
            </Card>

            {segmentClients.length > 0 && (
              <>
                {/* Segment KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Card className="p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Clients dans le segment</p>
                    <p className="text-lg font-display font-bold text-card-foreground">{segmentClients.length}</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Solde moyen</p>
                    <p className="text-sm font-display font-bold text-primary">
                      {formatCFA(segmentClients.reduce((a, c) => a + (c.solde_actuel || 0), 0) / segmentClients.length)}
                    </p>
                  </Card>
                  <Card className="p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Churn moyen</p>
                    <p className={`text-lg font-display font-bold ${churnColor(segmentClients.reduce((a, c) => a + (c.risque_churn || 0), 0) / segmentClients.length)}`}>
                      {((segmentClients.reduce((a, c) => a + (c.risque_churn || 0), 0) / segmentClients.length) * 100).toFixed(0)}%
                    </p>
                  </Card>
                  <Card className="p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Vol. MoMo moyen</p>
                    <p className="text-sm font-display font-bold text-card-foreground">
                      {formatCFA(segmentClients.reduce((a, c) => a + (c.volume_momo_mensuel || 0), 0) / segmentClients.length)}
                    </p>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="p-5">
                    <h3 className="font-display font-semibold text-card-foreground mb-1">
                      {CHART_ATTRIBUTES.find(a => a.value === chartAttribute)?.label} par Client
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">Visualisation filtrée par attribut sélectionné</p>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={getChartData()}>
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} labelFormatter={(v) => {
                          const item = getChartData().find(d => d.name === v);
                          return item ? item.fullName : v;
                        }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-5">
                    <h3 className="font-display font-semibold text-card-foreground mb-1">Profil Radar du Segment</h3>
                    <p className="text-xs text-muted-foreground mb-4">Moyennes normalisées des features clés</p>
                    <ResponsiveContainer width="100%" height={260}>
                      <RadarChart data={getRadarData()}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9 }} />
                        <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                        <Radar dataKey="value" fill="hsl(var(--primary))" fillOpacity={0.3} stroke="hsl(var(--primary))" strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                {/* Segment Distribution by RFM */}
                <Card className="p-5">
                  <h3 className="font-display font-semibold text-card-foreground mb-3">Distribution du Segment</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {["Champion", "Fidèle", "Nouveau", "Standard", "À risque", "Dormant"].map(rfm => {
                      const count = segmentClients.filter(c => c.segment_rfm === rfm).length;
                      if (count === 0) return null;
                      return (
                        <div key={rfm} className="p-2.5 rounded-lg bg-muted/50 text-center">
                          <Badge className={`text-[9px] ${rfmColor(rfm)}`}>{rfm}</Badge>
                          <p className="text-lg font-display font-bold text-card-foreground mt-1">{count}</p>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Campaign Generation for Segment */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-card-foreground flex items-center gap-2">
                        <Megaphone size={16} className="text-primary" /> Campagnes pour ce Segment
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Générez et lancez des campagnes ciblées pour les {segmentClients.length} clients de ce segment
                      </p>
                    </div>
                    <Button onClick={generateSegmentCampaigns} disabled={segmentCampaignLoading} size="sm">
                      {segmentCampaignLoading ? <Loader2 size={14} className="animate-spin mr-1" /> : <Sparkles size={14} className="mr-1" />}
                      Générer Campagnes IA
                    </Button>
                  </div>

                  {segmentCampaigns && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-xs text-muted-foreground">{segmentCampaigns.recommandation_generale}</p>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {segmentCampaigns.campagnes?.map((c, i) => (
                          <Card key={i} className="p-4 space-y-3 border-2 border-border hover:border-primary/30 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-display font-semibold text-sm text-card-foreground">{c.titre}</h4>
                              <Badge className={`text-[10px] shrink-0 ${prioriteColor(c.priorite)}`}>{c.priorite}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{c.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users size={12} className="text-primary" /> Cible: {c.cible}
                            </div>
                            <div className="space-y-1">
                              {c.actions_concretes?.slice(0, 3).map((a, j) => (
                                <p key={j} className="text-[11px] text-muted-foreground flex items-start gap-1">
                                  <ChevronRight size={10} className="mt-0.5 shrink-0 text-primary" /> {a}
                                </p>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px]">
                              <span className="px-2 py-0.5 bg-muted rounded">💰 {c.budget_estime}</span>
                              <span className="px-2 py-0.5 bg-muted rounded">📡 {c.canal_principal}</span>
                              <span className="px-2 py-0.5 bg-muted rounded">📈 {c.impact_estime}</span>
                            </div>
                            <Button
                              onClick={() => setShowLaunchConfirm(i)}
                              className="w-full mt-2"
                              size="sm"
                              variant="default"
                            >
                              <Send size={12} className="mr-1.5" />
                              Lancer cette campagne ({segmentClients.length} clients)
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>

                {/* Clients list */}
                <Card className="p-5">
                  <h3 className="font-display font-semibold text-card-foreground mb-3">Clients du Segment ({segmentClients.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs text-muted-foreground">
                          <th className="text-left py-2 pr-3">Code</th>
                          <th className="text-left py-2 px-2">Nom</th>
                          <th className="text-center py-2 px-2">Ville</th>
                          <th className="text-center py-2 px-2">Segment RFM</th>
                          <th className="text-center py-2 px-2">Churn</th>
                          <th className="text-center py-2 px-2">Vol. MoMo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {segmentClients.slice(0, 15).map(c => (
                          <tr key={c.id} className="border-b border-border/50 cursor-pointer hover:bg-muted/50"
                            onClick={() => { setClient(c); setActiveTab("info"); setScoring(null); setCampaigns(null); }}>
                            <td className="py-2 pr-3 font-medium text-primary text-xs">{c.code_client}</td>
                            <td className="py-2 px-2 text-card-foreground">{c.prenom} {c.nom}</td>
                            <td className="text-center py-2 px-2 text-muted-foreground text-xs">{c.ville || "—"}</td>
                            <td className="text-center py-2 px-2">
                              <Badge className={`text-[9px] ${rfmColor(c.segment_rfm)}`}>{c.segment_rfm}</Badge>
                            </td>
                            <td className="text-center py-2 px-2">
                              <span className={`text-xs font-bold ${churnColor(c.risque_churn || 0)}`}>
                                {((c.risque_churn || 0) * 100).toFixed(0)}%
                              </span>
                            </td>
                            <td className="text-center py-2 px-2 text-xs text-muted-foreground">{formatCFA(c.volume_momo_mensuel)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Confirmation Dialogs */}
        <AlertDialog open={showScoringConfirm} onOpenChange={setShowScoringConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><Brain size={18} className="text-primary" /> Lancer le Credit Scoring IA ?</AlertDialogTitle>
              <AlertDialogDescription>
                Le modèle d'IA va analyser le profil de <strong>{client?.prenom} {client?.nom}</strong> incluant les données Mobile Money et le score comportemental.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={runCreditScoring}>Lancer l'analyse</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showCampaignConfirm} onOpenChange={setShowCampaignConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><Target size={18} className="text-primary" /> Générer des suggestions de campagnes ?</AlertDialogTitle>
              <AlertDialogDescription>
                L'IA va analyser le segment du client <strong>{client?.prenom} {client?.nom}</strong> et proposer des campagnes d'inclusion ciblées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={runCampaignSuggestions}>Générer les campagnes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Campaign Launch Confirmation */}
        <AlertDialog open={showLaunchConfirm !== null} onOpenChange={() => setShowLaunchConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><Megaphone size={18} className="text-primary" /> Lancer la campagne ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action va envoyer la campagne <strong>"{segmentCampaigns?.campagnes?.[showLaunchConfirm ?? 0]?.titre}"</strong> à <strong>{segmentClients.length} clients</strong> du segment via {segmentCampaigns?.campagnes?.[showLaunchConfirm ?? 0]?.canal_principal}. 
                <br /><br />
                <span className="text-[10px] text-muted-foreground">En production, cela déclencherait l'envoi de SMS/notifications push via l'API Mobile Money ou le canal configuré.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (showLaunchConfirm !== null && segmentCampaigns?.campagnes?.[showLaunchConfirm]) {
                  launchCampaign(segmentCampaigns.campagnes[showLaunchConfirm], showLaunchConfirm);
                }
              }}>
                <Send size={14} className="mr-1.5" />
                Confirmer le lancement
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AnimatedPage>
  );
};

// Timer icon
const TimerIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>
);

export default ExperienceClient;
