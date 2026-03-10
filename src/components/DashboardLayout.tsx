import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { MobileSidebar } from "./DashboardSidebar";
import LogoutButton from "./LogoutButton";
import { Calendar, Lock, Shield } from "lucide-react";
import { useAuth, roleIcons } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const DashboardLayout = () => {
  const { hasAccess, roleConfig, currentRole } = useAuth();
  const location = useLocation();
  const canAccess = hasAccess(location.pathname);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MobileSidebar />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium text-foreground border border-border">
              <Shield size={14} className="text-primary" />
              <span className="hidden sm:inline">{roleIcons[currentRole]} {roleConfig.label}</span>
              <span className="sm:hidden">{roleIcons[currentRole]}</span>
            </div>
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
