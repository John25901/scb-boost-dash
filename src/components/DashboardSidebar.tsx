import { BarChart3, Users, Brain, Settings, TrendingUp, ShieldCheck, LayoutDashboard, Database, Lock, Menu, CreditCard, Package, Receipt, Monitor } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth, roleIcons } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", path: "/" },
  { icon: CreditCard, label: "Porteurs Cartes", path: "/porteurs-cartes" },
  { icon: Package, label: "Cycle Vie Cartes", path: "/cycle-vie-cartes" },
  { icon: Receipt, label: "Audit & Facturation", path: "/audit-facturation" },
  { icon: Monitor, label: "Performance TPE", path: "/performance-tpe" },
  { icon: Users, label: "Expérience Client", path: "/experience-client" },
  { icon: TrendingUp, label: "Performance Ops.", path: "/performance-ops" },
  { icon: Brain, label: "Modèles ML", path: "/modeles-ml" },
  { icon: Database, label: "Big Data", path: "/big-data" },
  { icon: BarChart3, label: "Rapports", path: "/rapports" },
  { icon: ShieldCheck, label: "Risques", path: "/risques" },
  { icon: Settings, label: "Paramètres", path: "/parametres" },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();
  const { hasAccess, user, currentRole } = useAuth();

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "SC";

  const displayName = user?.user_metadata?.full_name || "SCB Cameroun";

  return (
    <>
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shadow-lg">
            <CreditCard size={20} className="text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-sidebar-primary">SCB Monétique</h1>
            <p className="text-[10px] text-sidebar-foreground/60">Intelligence 360°</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const allowed = hasAccess(item.path);
          return (
            <NavLink
              key={item.label}
              to={allowed ? item.path : "#"}
              onClick={(e) => {
                if (!allowed) { e.preventDefault(); return; }
                onNavigate?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                !allowed
                  ? "text-sidebar-foreground/30 cursor-not-allowed"
                  : isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground hover:translate-x-0.5"
              }`}
            >
              <item.icon size={16} />
              <span className="flex-1 truncate">{item.label}</span>
              {!allowed && <Lock size={12} className="text-sidebar-foreground/20" />}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sidebar-primary truncate">{displayName}</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">{roleIcons[currentRole]} {user?.email || "Projet Académique"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const DesktopSidebar = () => (
  <aside className="hidden lg:flex w-64 bg-sidebar text-sidebar-foreground min-h-screen flex-col shrink-0">
    <SidebarContent />
  </aside>
);

export const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
          <Menu size={20} className="text-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-sidebar text-sidebar-foreground border-sidebar-border">
        <div className="flex flex-col h-full">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

const DashboardSidebar = () => <DesktopSidebar />;
export default DashboardSidebar;
