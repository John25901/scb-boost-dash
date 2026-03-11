import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth, ROLE_CONFIGS, roleIcons, type UserRole } from "@/contexts/AuthContext";
import {
  Settings, Bell, Shield, Database, Users, Loader2, Save, UserCog
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

interface UserWithRole {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

const settingSections = [
  {
    title: "Général",
    icon: Settings,
    items: [
      { label: "Langue de l'interface", value: "Français" },
      { label: "Fuseau horaire", value: "UTC+1 (Douala)" },
      { label: "Format de date", value: "JJ/MM/AAAA" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Alertes critiques", value: "Activé" },
      { label: "Rapports automatiques", value: "Hebdomadaire" },
      { label: "Alertes pipeline", value: "Activé" },
    ],
  },
  {
    title: "Sécurité",
    icon: Shield,
    items: [
      { label: "Authentification 2FA", value: "Activé" },
      { label: "Expiration session", value: "30 min" },
      { label: "Journalisation", value: "Complète" },
    ],
  },
  {
    title: "Sources de Données",
    icon: Database,
    items: [
      { label: "Core Banking System", value: "Connecté" },
      { label: "Data Lake (HDFS)", value: "Connecté" },
      { label: "API Mobile Banking", value: "Connecté" },
      { label: "Mobile Money (MoMo/OM)", value: "Connecté" },
    ],
  },
];

const Parametres = () => {
  const { currentRole } = useAuth();
  const isAdmin = currentRole === "admin";
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [savingRole, setSavingRole] = useState<string | null>(null);
  const [pendingRoles, setPendingRoles] = useState<Record<string, UserRole>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data: roles, error: rolesErr } = await supabase
        .from("user_roles")
        .select("user_id, role");
      if (rolesErr) throw rolesErr;

      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("user_id, full_name");
      if (profErr) throw profErr;

      const userList: UserWithRole[] = (roles || []).map((r: any) => {
        const profile = profiles?.find((p: any) => p.user_id === r.user_id);
        return {
          user_id: r.user_id,
          email: "",
          full_name: profile?.full_name || "Utilisateur",
          role: r.role as UserRole,
        };
      });
      setUsers(userList);
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateRole = async (userId: string) => {
    const newRole = pendingRoles[userId];
    if (!newRole) return;
    setSavingRole(userId);
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);
      if (error) throw error;
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
      setPendingRoles(prev => { const n = { ...prev }; delete n[userId]; return n; });
      toast({ title: "✅ Rôle mis à jour", description: `Nouveau rôle: ${ROLE_CONFIGS[newRole].label}` });
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setSavingRole(null);
    }
  };

  return (
    <AnimatedPage>
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Paramètres</h1>
          <p className="text-xs text-muted-foreground">Configuration, notifications, connexions et gestion des rôles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {settingSections.map((section) => (
            <Card key={section.title} className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <section.icon size={16} className="text-primary" />
                <h3 className="font-display font-semibold text-card-foreground">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-card-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Admin: Role management */}
        {isAdmin && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <UserCog size={16} className="text-primary" />
              <h3 className="font-display font-semibold text-card-foreground">Gestion des Rôles Utilisateurs</h3>
              <Badge variant="outline" className="ml-auto text-[10px]">Admin uniquement</Badge>
            </div>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucun utilisateur trouvé.</p>
            ) : (
              <div className="space-y-3">
                {users.map(u => {
                  const pending = pendingRoles[u.user_id];
                  const displayRole = pending || u.role;
                  return (
                    <div key={u.user_id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {u.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">{u.full_name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{u.user_id.slice(0, 8)}...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{roleIcons[displayRole]}</span>
                        <Select
                          value={displayRole}
                          onValueChange={(v) => setPendingRoles(prev => ({ ...prev, [u.user_id]: v as UserRole }))}
                        >
                          <SelectTrigger className="w-48 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(ROLE_CONFIGS) as UserRole[]).map(role => (
                              <SelectItem key={role} value={role} className="text-xs">
                                {roleIcons[role]} {ROLE_CONFIGS[role].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {pending && pending !== u.role && (
                          <Button size="sm" className="h-8 text-xs" onClick={() => updateRole(u.user_id)} disabled={savingRole === u.user_id}>
                            {savingRole === u.user_id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                            <span className="ml-1">Sauver</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Parametres;
