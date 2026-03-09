import { BarChart3, Users, Brain, Settings, TrendingUp, ShieldCheck, LayoutDashboard, Database } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", active: true },
  { icon: Users, label: "Expérience Client", active: false },
  { icon: TrendingUp, label: "Performance Ops.", active: false },
  { icon: Brain, label: "Modèles ML", active: false },
  { icon: Database, label: "Big Data", active: false },
  { icon: BarChart3, label: "Rapports", active: false },
  { icon: ShieldCheck, label: "Risques", active: false },
  { icon: Settings, label: "Paramètres", active: false },
];

const DashboardSidebar = () => (
  <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen flex flex-col">
    <div className="p-6 border-b border-sidebar-border">
      <h1 className="font-display text-lg font-bold text-sidebar-primary">SCB Cameroun</h1>
      <p className="text-xs text-sidebar-foreground/60 mt-1">Big Data & ML Analytics</p>
    </div>
    <nav className="flex-1 p-3 space-y-1">
      {navItems.map((item) => (
        <button
          key={item.label}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            item.active
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          }`}
        >
          <item.icon size={18} />
          {item.label}
        </button>
      ))}
    </nav>
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-accent-foreground">
          IM
        </div>
        <div>
          <p className="text-xs font-medium text-sidebar-primary">Ingénieur ML</p>
          <p className="text-[10px] text-sidebar-foreground/50">Projet Académique</p>
        </div>
      </div>
    </div>
  </aside>
);

export default DashboardSidebar;
