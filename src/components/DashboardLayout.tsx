import { Outlet, useLocation, Navigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import RoleSwitcher from "./RoleSwitcher";
import { Calendar, Lock } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

const DashboardLayout = () => {
  const { hasAccess, roleConfig } = useRole();
  const location = useLocation();
  const canAccess = hasAccess(location.pathname);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center justify-between gap-3">
          <RoleSwitcher />
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
            <Calendar size={14} />
            <span>Dernière mise à jour : Mars 2026</span>
          </div>
        </header>
        {canAccess ? (
          <Outlet />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-6">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock size={28} className="text-destructive" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Accès Restreint</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Le rôle <strong>{roleConfig.label}</strong> n'a pas l'autorisation d'accéder à cette section.
              <br />
              Conformément au principe du moindre privilège (RBAC), seules les pages autorisées sont accessibles.
            </p>
            <p className="text-xs text-muted-foreground">
              Pages autorisées : {roleConfig.allowedPaths.join(", ")}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
