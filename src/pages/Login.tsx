import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, LogIn, Loader2, CreditCard } from "lucide-react";

const demoAccounts = [
  { role: "👩‍💼 Directrice Monétique", email: "admin@scb-demo.cm", pass: "Admin2024!", desc: "Full Access" },
  { role: "📊 Analyste Monétique", email: "metier@scb-demo.cm", pass: "Metier2024!", desc: "Dashboards + Exports" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "✅ Connexion réussie", description: "Bienvenue sur SCB Monétique Intelligence 360" });
    } catch (error: any) {
      toast({ title: "❌ Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: "linear-gradient(135deg, hsl(216 100% 14%) 0%, hsl(216 100% 22%) 50%, hsl(22 100% 50%) 100%)"
    }}>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center shadow-lg">
              <CreditCard size={28} className="text-accent-foreground" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">SCB Monétique Intelligence</h1>
          <p className="text-sm text-white/70 mt-1">Plateforme de Pilotage Stratégique — 360°</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-white/50">
            <Shield size={14} />
            <span>Accès sécurisé — Pas d'auto-inscription</span>
          </div>
        </div>

        <Card className="p-6 shadow-2xl border-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-display font-semibold text-lg text-card-foreground text-center">
              Connexion
            </h2>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="nom@scb-cameroun.cm" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <LogIn size={16} className="mr-2" />}
              Se connecter
            </Button>
          </form>
        </Card>

        <Card className="mt-4 p-4 border-0 bg-white/10 backdrop-blur-sm">
          <button onClick={() => setShowDemo(!showDemo)} className="w-full flex items-center justify-between text-xs font-medium text-white">
            <span>Comptes de démonstration</span>
            <span className="text-accent">{showDemo ? "Masquer" : "Afficher"}</span>
          </button>
          {showDemo && (
            <div className="mt-3 space-y-2">
              {demoAccounts.map(d => (
                <button
                  key={d.email}
                  onClick={() => quickLogin(d.email, d.pass)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs"
                >
                  <div className="text-left">
                    <span className="font-semibold text-white">{d.role}</span>
                    <p className="text-[10px] text-white/60">{d.desc}</p>
                  </div>
                  <span className="text-white/50 font-mono text-[10px]">{d.email}</span>
                </button>
              ))}
            </div>
          )}
        </Card>

        <p className="text-center text-[10px] text-white/40 mt-6">
          © 2026 SCB Cameroun — Projet Académique IUS · Jean Ernest
        </p>
      </div>
    </div>
  );
};

export default Login;
