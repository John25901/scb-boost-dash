import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type UserRole = "admin" | "data_engineer" | "data_scientist" | "metier" | "conformite";

export interface RoleConfig {
  label: string;
  description: string;
  allowedPaths: string[];
  permissions: {
    canAccessRawData: boolean;
    canTrainModels: boolean;
    canManagePipelines: boolean;
    canViewPredictions: boolean;
    canAuditLogs: boolean;
    canManageUsers: boolean;
    canViewAnonymizedData: boolean;
    canModifySettings: boolean;
    canExportReports: boolean;
  };
}

const ALL_PATHS = ["/", "/porteurs-cartes", "/cycle-vie-cartes", "/audit-facturation", "/performance-tpe", "/experience-client", "/performance-ops", "/modeles-ml", "/big-data", "/rapports", "/risques", "/parametres"];

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    label: "Directrice Monétique",
    description: "Full Access — Supervision complète de l'activité monétique, rapports et exports",
    allowedPaths: ALL_PATHS,
    permissions: {
      canAccessRawData: true, canTrainModels: true, canManagePipelines: true,
      canViewPredictions: true, canAuditLogs: true, canManageUsers: true,
      canViewAnonymizedData: true, canModifySettings: true, canExportReports: true,
    },
  },
  metier: {
    label: "Analyste Monétique",
    description: "Dashboards + Exports uniquement — Consultation et analyse des données monétiques",
    allowedPaths: ["/", "/porteurs-cartes", "/cycle-vie-cartes", "/audit-facturation", "/performance-tpe", "/experience-client", "/rapports"],
    permissions: {
      canAccessRawData: false, canTrainModels: false, canManagePipelines: false,
      canViewPredictions: true, canAuditLogs: false, canManageUsers: false,
      canViewAnonymizedData: true, canModifySettings: false, canExportReports: true,
    },
  },
  data_engineer: {
    label: "Data Engineer",
    description: "Conception et maintenance des flux d'ingestion",
    allowedPaths: ["/", "/porteurs-cartes", "/cycle-vie-cartes", "/performance-tpe", "/big-data", "/performance-ops", "/parametres"],
    permissions: {
      canAccessRawData: true, canTrainModels: false, canManagePipelines: true,
      canViewPredictions: false, canAuditLogs: false, canManageUsers: false,
      canViewAnonymizedData: true, canModifySettings: true, canExportReports: false,
    },
  },
  data_scientist: {
    label: "Data Scientist",
    description: "Modèles ML et données anonymisées",
    allowedPaths: ["/", "/porteurs-cartes", "/cycle-vie-cartes", "/modeles-ml", "/experience-client", "/performance-ops"],
    permissions: {
      canAccessRawData: false, canTrainModels: true, canManagePipelines: false,
      canViewPredictions: true, canAuditLogs: false, canManageUsers: false,
      canViewAnonymizedData: true, canModifySettings: false, canExportReports: true,
    },
  },
  conformite: {
    label: "Direction Conformité",
    description: "Audit des accès et traçabilité",
    allowedPaths: ["/", "/audit-facturation", "/risques", "/rapports", "/modeles-ml"],
    permissions: {
      canAccessRawData: false, canTrainModels: false, canManagePipelines: false,
      canViewPredictions: true, canAuditLogs: true, canManageUsers: false,
      canViewAnonymizedData: true, canModifySettings: false, canExportReports: true,
    },
  },
};

export const roleIcons: Record<UserRole, string> = {
  admin: "👩‍💼",
  metier: "📊",
  data_engineer: "⚙️",
  data_scientist: "🧠",
  conformite: "📋",
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roleLoading: boolean;
  currentRole: UserRole;
  roleConfig: RoleConfig;
  hasAccess: (path: string) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>("metier");

  const fetchRole = async (userId: string) => {
    setRoleLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_user_role', { _user_id: userId });
      if (!error && data) {
        setCurrentRole(data as UserRole);
      }
    } catch (e) {
      console.error("Error fetching role:", e);
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setTimeout(() => fetchRole(session.user.id), 0);
      } else {
        setCurrentRole("metier");
        setRoleLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setRoleLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const roleConfig = ROLE_CONFIGS[currentRole];
  const hasAccess = (path: string) => roleConfig.allowedPaths.includes(path);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setCurrentRole("metier");
  };

  return (
    <AuthContext.Provider value={{
      user, session, loading, roleLoading, currentRole,
      roleConfig, hasAccess, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const useRole = useAuth;
