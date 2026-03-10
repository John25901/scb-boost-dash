import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type UserRole = 
  | "admin"
  | "data_engineer"
  | "data_scientist"
  | "metier"
  | "conformite";

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

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    label: "Administrateur / RSSI",
    description: "Supervision complète, gestion des permissions et clés de chiffrement",
    allowedPaths: ["/", "/experience-client", "/performance-ops", "/modeles-ml", "/big-data", "/rapports", "/risques", "/parametres"],
    permissions: {
      canAccessRawData: false, canTrainModels: false, canManagePipelines: true,
      canViewPredictions: true, canAuditLogs: true, canManageUsers: true,
      canViewAnonymizedData: true, canModifySettings: true, canExportReports: true,
    },
  },
  data_engineer: {
    label: "Data Engineer",
    description: "Conception et maintenance des flux d'ingestion (Apache NiFi, Oracle → Data Lakehouse)",
    allowedPaths: ["/", "/big-data", "/performance-ops", "/parametres"],
    permissions: {
      canAccessRawData: true, canTrainModels: false, canManagePipelines: true,
      canViewPredictions: false, canAuditLogs: false, canManageUsers: false,
      canViewAnonymizedData: true, canModifySettings: true, canExportReports: false,
    },
  },
  data_scientist: {
    label: "Data Scientist",
    description: "Création et entraînement des modèles ML — données anonymisées uniquement",
    allowedPaths: ["/", "/modeles-ml", "/experience-client", "/performance-ops"],
    permissions: {
      canAccessRawData: false, canTrainModels: true, canManagePipelines: false,
      canViewPredictions: true, canAuditLogs: false, canManageUsers: false,
      canViewAnonymizedData: true, canModifySettings: false, canExportReports: true,
    },
  },
  metier: {
    label: "Utilisateur Métier",
    description: "Consultation en lecture seule des prédictions et tableaux de bord",
    allowedPaths: ["/", "/experience-client", "/rapports"],
    permissions: {
      canAccessRawData: false, canTrainModels: false, canManagePipelines: false,
      canViewPredictions: true, canAuditLogs: false, canManageUsers: false,
      canViewAnonymizedData: false, canModifySettings: false, canExportReports: false,
    },
  },
  conformite: {
    label: "Direction Conformité",
    description: "Audit des accès, traçabilité et explicabilité des modèles IA",
    allowedPaths: ["/", "/risques", "/rapports", "/modeles-ml"],
    permissions: {
      canAccessRawData: false, canTrainModels: false, canManagePipelines: false,
      canViewPredictions: true, canAuditLogs: true, canManageUsers: false,
      canViewAnonymizedData: true, canModifySettings: false, canExportReports: true,
    },
  },
};

export const roleIcons: Record<UserRole, string> = {
  admin: "🔐",
  data_engineer: "⚙️",
  data_scientist: "🧠",
  metier: "📊",
  conformite: "📋",
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
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
  const [currentRole, setCurrentRole] = useState<UserRole>("metier");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => {
          supabase.rpc('get_user_role', { _user_id: session.user.id })
            .then(({ data }) => {
              if (data) {
                setCurrentRole(data as UserRole);
              }
            });
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const roleConfig = ROLE_CONFIGS[currentRole];
  const hasAccess = (path: string) => roleConfig.allowedPaths.includes(path);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user, session, loading, currentRole,
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
