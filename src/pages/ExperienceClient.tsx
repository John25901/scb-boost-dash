import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AnimatedPage from "@/components/AnimatedPage";
import {
  Search, User, Briefcase, Building2, Calendar, CreditCard, 
  TrendingUp, AlertTriangle, CheckCircle2, Loader2, Brain,
  Phone, Mail, MapPin, Banknote, Activity, ShieldCheck,
  Target, Lightbulb, Users, Sparkles, ChevronRight
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface CampaignSuggestions {
  segment_analyse: string;
  campagnes: {
    titre: string;
    description: string;
    cible: string;
    actions_concretes: string[];
    impact_estime: string;
    budget_estime: string;
    priorite: string;
    canal_principal: string;
    indicateurs_succes: string[];
  }[];
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
  const [activeTab, setActiveTab] = useState<"info" | "scoring" | "campaigns">("info");
  const { toast } = useToast();

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

  const runCreditScoring = async () => {
    if (!client) return;
    setShowScoringConfirm(false);
    setScoringLoading(true);
    setActiveTab("scoring");

    try {
      const { data, error } = await supabase.functions.invoke("credit-scoring", {
        body: { client },
      });
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

    // Determine segment
    const age = client.date_naissance
      ? Math.floor((Date.now() - new Date(client.date_naissance).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null;
    const segment = age && age < 30 ? "Jeunes (< 30 ans)"
      : client.genre === "F" ? "Femmes"
      : client.type_personne === "morale" ? "Entreprises/Associations"
      : "Général";

    try {
      const { data, error } = await supabase.functions.invoke("campaign-suggestions", {
        body: {
          segment,
          clients_stats: {
            client_exemple: `${client.prenom} ${client.nom}`,
            age,
            genre: client.genre,
            type_personne: client.type_personne,
            profession: client.profession,
            secteur: client.secteur_activite,
            revenu_mensuel: client.revenu_mensuel,
            ville: client.ville,
            type_compte: client.type_compte,
            anciennete_mois: client.anciennete_mois,
            solde_actuel: client.solde_actuel,
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

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Intelligence Client</h1>
          <p className="text-xs text-muted-foreground">Recherche client, Credit Scoring IA & Suggestions de campagnes d'inclusion</p>
        </div>

        {/* Search Bar */}
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

        {/* Client found */}
        {client && (
          <div className="space-y-4 animate-fade-in">
            {/* Tab buttons */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "info" as const, label: "Profil Client", icon: User },
                { key: "scoring" as const, label: "Credit Scoring IA", icon: Brain },
                { key: "campaigns" as const, label: "Campagnes Inclusion", icon: Target },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (tab.key === "scoring" && !scoring && !scoringLoading) {
                      setShowScoringConfirm(true);
                    } else if (tab.key === "campaigns" && !campaigns && !campaignLoading) {
                      setShowCampaignConfirm(true);
                    } else {
                      setActiveTab(tab.key);
                    }
                  }}
                >
                  <tab.icon size={14} className="mr-1.5" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* INFO TAB */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
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
                    <Badge variant="outline" className="ml-auto">
                      {client.type_personne === "physique" ? "Personne Physique" : "Personne Morale"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {client.date_naissance && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} />
                        <span>Né(e) le {new Date(client.date_naissance).toLocaleDateString("fr-FR")}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User size={14} />
                      <span>{client.genre === "M" ? "Homme" : "Femme"}</span>
                    </div>
                    {client.profession && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase size={14} />
                        <span>{client.profession}</span>
                      </div>
                    )}
                    {client.secteur_activite && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 size={14} />
                        <span>{client.secteur_activite}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail size={14} />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.telephone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone size={14} />
                        <span>{client.telephone}</span>
                      </div>
                    )}
                    {client.ville && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={14} />
                        <span>{client.ville}</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Account info */}
                <Card className="p-5 space-y-4">
                  <h3 className="font-display font-semibold text-card-foreground flex items-center gap-2">
                    <CreditCard size={16} className="text-primary" />
                    Informations Compte
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Type de compte</span>
                      <Badge>{client.type_compte}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Date d'ouverture</span>
                      <span className="text-sm font-medium">{new Date(client.date_ouverture_compte).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Ancienneté</span>
                      <span className="text-sm font-medium">{client.anciennete_mois} mois</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Solde actuel</span>
                      <span className="text-sm font-bold text-primary">{formatCFA(client.solde_actuel)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Revenu mensuel</span>
                      <span className="text-sm font-medium">{client.revenu_mensuel ? formatCFA(client.revenu_mensuel) : "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Transactions/mois</span>
                      <span className="text-sm font-medium flex items-center gap-1"><Activity size={12} /> {client.nombre_transactions_mois}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Crédit en cours</span>
                      <span className="text-sm font-medium">{formatCFA(client.montant_credit_en_cours)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Incidents paiement</span>
                      <span className={`text-sm font-bold ${client.nombre_incidents_paiement > 0 ? "text-destructive" : "text-emerald-600"}`}>
                        {client.nombre_incidents_paiement}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Statut</span>
                      <Badge variant={client.statut === "actif" ? "default" : "destructive"}>{client.statut}</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* SCORING TAB */}
            {activeTab === "scoring" && (
              <div className="animate-fade-in">
                {scoringLoading ? (
                  <Card className="p-12 flex flex-col items-center gap-4">
                    <Loader2 size={32} className="animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Analyse IA en cours... Le modèle évalue le profil du client.</p>
                  </Card>
                ) : scoring ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Score Card */}
                    <Card className="p-5 lg:col-span-1 space-y-4">
                      <h3 className="font-display font-semibold text-card-foreground flex items-center gap-2">
                        <Brain size={16} className="text-primary" />
                        Score de Crédit
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

                    {/* Factors & Features */}
                    <Card className="p-5 lg:col-span-2 space-y-4">
                      <h3 className="font-display font-semibold text-card-foreground">Analyse détaillée</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Facteurs positifs</p>
                          {scoring.facteurs_positifs.map((f, i) => (
                            <p key={i} className="text-xs text-muted-foreground pl-4 flex items-start gap-1">
                              <ChevronRight size={10} className="mt-0.5 shrink-0 text-emerald-500" /> {f}
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

                      {/* Feature importance */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-card-foreground">Importance des Features (Explicabilité IA)</p>
                        {scoring.features_importance?.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="w-32 truncate text-muted-foreground">{f.feature}</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div className={`h-2 rounded-full ${f.impact === "positif" ? "bg-emerald-500" : "bg-red-400"}`}
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
                    <p className="text-sm text-muted-foreground">Cliquez sur l'onglet pour lancer l'analyse de credit scoring IA.</p>
                  </Card>
                )}
              </div>
            )}

            {/* CAMPAIGNS TAB */}
            {activeTab === "campaigns" && (
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
          </div>
        )}

        {/* Confirmation Dialogs */}
        <AlertDialog open={showScoringConfirm} onOpenChange={setShowScoringConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><Brain size={18} className="text-primary" /> Lancer le Credit Scoring IA ?</AlertDialogTitle>
              <AlertDialogDescription>
                Le modèle d'IA va analyser le profil de <strong>{client?.prenom} {client?.nom}</strong> et produire un score de crédit détaillé avec explicabilité des features.
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
                L'IA va analyser le segment du client <strong>{client?.prenom} {client?.nom}</strong> et proposer des campagnes d'inclusion financière ciblées (jeunes, femmes, etc.).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={runCampaignSuggestions}>Générer les campagnes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AnimatedPage>
  );
};

export default ExperienceClient;
