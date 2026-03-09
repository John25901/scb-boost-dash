import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = 
  | "admin"        // Administrateur Système / RSSI
  | "data_engineer" // Ingénieur de la donnée
  | "data_scientist" // Data Scientist
  | "metier"       // Utilisateur Métier (Directeur d'agence, Conseiller)
  | "conformite";  // Direction Conformité & Contrôle Interne

export interface RoleConfig {
  label: string;
  description: string;
  color: string;
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
    color: "hsl(0, 72%, 51%)",
    allowedPaths: ["/", "/experience-client", "/performance-ops", "/modeles-ml", "/big-data", "/rapports", "/risques", "/parametres"],
    permissions: {
      canAccessRawData: false,
      canTrainModels: false,
      canManagePipelines: true,
      canViewPredictions: true,
      canAuditLogs: true,
      canManageUsers: true,
      canViewAnonymizedData: true,
      canModifySettings: true,
      canExportReports: true,
    },
  },
  data_engineer: {
    label: "Data Engineer",
    description: "Conception et maintenance des flux d'ingestion (Apache NiFi, Oracle → Data Lakehouse)",
    color: "hsl(215, 80%, 50%)",
    allowedPaths: ["/", "/big-data", "/performance-ops", "/parametres"],
    permissions: {
      canAccessRawData: true,
      canTrainModels: false,
      canManagePipelines: true,
      canViewPredictions: false,
      canAuditLogs: false,
      canManageUsers: false,
      canViewAnonymizedData: true,
      canModifySettings: true,
      canExportReports: false,
    },
  },
  data_scientist: {
    label: "Data Scientist",
    description: "Création et entraînement des modèles ML (Credit Scoring, Churn) — données anonymisées uniquement",
    color: "hsl(270, 60%, 55%)",
    allowedPaths: ["/", "/modeles-ml", "/experience-client", "/performance-ops"],
    permissions: {
      canAccessRawData: false,
      canTrainModels: true,
      canManagePipelines: false,
      canViewPredictions: true,
      canAuditLogs: false,
      canManageUsers: false,
      canViewAnonymizedData: true,
      canModifySettings: false,
      canExportReports: true,
    },
  },
  metier: {
    label: "Utilisateur Métier",
    description: "Consultation en lecture seule des prédictions et tableaux de bord",
    color: "hsl(160, 60%, 45%)",
    allowedPaths: ["/", "/experience-client", "/rapports"],
    permissions: {
      canAccessRawData: false,
      canTrainModels: false,
      canManagePipelines: false,
      canViewPredictions: true,
      canAuditLogs: false,
      canManageUsers: false,
      canViewAnonymizedData: false,
      canModifySettings: false,
      canExportReports: false,
    },
  },
  conformite: {
    label: "Direction Conformité",
    description: "Audit des accès, traçabilité et explicabilité des modèles IA",
    color: "hsl(35, 90%, 50%)",
    allowedPaths: ["/", "/risques", "/rapports", "/modeles-ml"],
    permissions: {
      canAccessRawData: false,
      canTrainModels: false,
      canManagePipelines: false,
      canViewPredictions: true,
      canAuditLogs: true,
      canManageUsers: false,
      canViewAnonymizedData: true,
      canModifySettings: false,
      canExportReports: true,
    },
  },
};

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  roleConfig: RoleConfig;
  isDemo: boolean;
  hasAccess: (path: string) => boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>("admin");
  const roleConfig = ROLE_CONFIGS[currentRole];

  const hasAccess = (path: string) => roleConfig.allowedPaths.includes(path);

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, roleConfig, isDemo: true, hasAccess }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
