import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { Calendar } from "lucide-react";

const DashboardLayout = () => (
  <div className="flex min-h-screen">
    <DashboardSidebar />
    <main className="flex-1 overflow-auto">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
          <Calendar size={14} />
          <span>Dernière mise à jour : Mars 2026</span>
        </div>
      </header>
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
