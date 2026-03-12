import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { Shield, LogIn, UserPlus, Loader2, Info } from "lucide-react";

const demoAccounts = [
  { role: "🔐 Admin", email: "admin@scb-demo.cm", pass: "Admin2024!" },
  { role: "🧠 Data Scientist", email: "ds@scb-demo.cm", pass: "DataSci2024!" },
  { role: "⚙️ Data Engineer", email: "de@scb-demo.cm", pass: "DataEng2024!" },
  { role: "📊 Métier", email: "metier@scb-demo.cm", pass: "Metier2024!" },
  { role: "📋 Conformité", email: "conformite@scb-demo.cm", pass: "Conform2024!" },
];

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "✅ Compte créé avec succès",
          description: "Vous pouvez maintenant vous connecter.",
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({
          title: "✅ Connexion réussie",
          description: "Bienvenue sur SCB Intelligence !",
        });
      }
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSignUp(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="SCB Logo" className="h-12 w-12 object-contain" />
            <h1 className="font-display text-2xl font-bold text-foreground">SCB Intelligence</h1>
          </div>
          <p className="text-sm text-muted-foreground">Big Data & Machine Learning Analytics Platform</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
            <Shield size={14} className="text-primary" />
            <span>Accès sécurisé — Modèle RBAC actif</span>
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-display font-semibold text-lg text-card-foreground text-center">
              {isSignUp ? "Créer un compte" : "Se connecter"}
            </h2>

            {isSignUp && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@scb-cameroun.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : isSignUp ? (
                <UserPlus size={16} className="mr-2" />
              ) : (
                <LogIn size={16} className="mr-2" />
              )}
              {isSignUp ? "Créer le compte" : "Se connecter"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
            </button>
          </div>
        </Card>

        {/* Demo accounts */}
        <Card className="mt-4 p-4">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between text-xs font-medium text-card-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Info size={14} className="text-primary" />
              Comptes de démonstration
            </span>
            <span className="text-primary">{showDemo ? "Masquer" : "Afficher"}</span>
          </button>
          {showDemo && (
            <div className="mt-3 space-y-1.5">
              {demoAccounts.map(d => (
                <button
                  key={d.email}
                  onClick={() => quickLogin(d.email, d.pass)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-xs"
                >
                  <span className="font-medium text-card-foreground">{d.role}</span>
                  <span className="text-muted-foreground font-mono">{d.email}</span>
                </button>
              ))}
              <p className="text-[9px] text-muted-foreground text-center mt-2">
                Cliquez sur un compte pour pré-remplir le formulaire
              </p>
            </div>
          )}
        </Card>

        <p className="text-center text-[10px] text-muted-foreground mt-6">
          © 2026 SCB Cameroun — Projet Académique · Principe du moindre privilège
        </p>
      </div>
    </div>
  );
};

export default Login;
