import { Users, Zap, Clock, TrendingUp, Calendar } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import KpiCard from "@/components/KpiCard";
import SatisfactionChart from "@/components/SatisfactionChart";
import ChurnPredictionChart from "@/components/ChurnPredictionChart";
import OperationalMetrics from "@/components/OperationalMetrics";
import RecentAlerts from "@/components/RecentAlerts";

const kpis = [
  { title: "Clients Actifs", value: "127 450", change: 12.3, changeLabel: "vs trim.", icon: <Users size={18} /> },
  { title: "Score NPS", value: "91/100", change: 8.5, changeLabel: "vs trim.", icon: <TrendingUp size={18} /> },
  { title: "Temps Traitement Moyen", value: "1.2s", change: -34, changeLabel: "vs trim.", icon: <Clock size={18} /> },
  { title: "Transactions/Jour", value: "48 320", change: 22.1, changeLabel: "vs trim.", icon: <Zap size={18} /> },
];

const Index = () => (
  <div className="flex min-h-screen">
    <DashboardSidebar />
    <main className="flex-1 overflow-auto">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Dashboard Analytique</h1>
          <p className="text-xs text-muted-foreground">Expérience Client & Performance Opérationnelle — Big Data & ML</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
          <Calendar size={14} />
          <span>Dernière mise à jour : Mars 2026</span>
        </div>
      </header>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SatisfactionChart />
          <OperationalMetrics />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChurnPredictionChart />
          <RecentAlerts />
        </div>
      </div>
    </main>
  </div>
);

export default Index;
