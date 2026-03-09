import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { MobileSidebar } from "./DashboardSidebar";
import RoleSwitcher from "./RoleSwitcher";
import LogoutButton from "./LogoutButton";
import { Calendar, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardLayout = () => {
  const { hasAccess, roleConfig } = useAuth();
  const location = useLocation();
  const canAccess = hasAccess(location.pathname);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MobileSidebar />
            <RoleSwitcher />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
              <Calendar size={14} />
              <span>Mars 2026</span>
            </div>
            <LogoutButton />
          </div>
        </header>
        {canAccess ? (
          <Outlet />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-6 animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock size={28} className="text-destructive" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Accès Restreint</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Le rôle <strong>{roleConfig.label}</strong> n'a pas l'autorisation d'accéder à cette section.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
