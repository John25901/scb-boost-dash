import { BarChart3, Users, Brain, Settings, TrendingUp, ShieldCheck, LayoutDashboard, Database, Lock, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", path: "/" },
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
  const { hasAccess, user } = useAuth();

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "IM";

  const displayName = user?.user_metadata?.full_name || "Ingénieur ML";

  return (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="SCB Logo" className="h-8 w-8 object-contain" />
          <div>
            <h1 className="font-display text-lg font-bold text-sidebar-primary">SCB Intelligence</h1>
            <p className="text-xs text-sidebar-foreground/60">Big Data & ML Analytics</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                !allowed
                  ? "text-sidebar-foreground/30 cursor-not-allowed"
                  : isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:translate-x-0.5"
              }`}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {!allowed && <Lock size={12} className="text-sidebar-foreground/20" />}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-accent-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sidebar-primary truncate">{displayName}</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">{user?.email || "Projet Académique"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

// Desktop sidebar
export const DesktopSidebar = () => (
  <aside className="hidden lg:flex w-64 bg-sidebar text-sidebar-foreground min-h-screen flex-col shrink-0">
    <SidebarContent />
  </aside>
);

// Mobile sidebar (Sheet)
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
