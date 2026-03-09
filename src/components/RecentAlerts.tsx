import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, Clock } from "lucide-react";

const alerts = [
  { type: "warning", icon: AlertTriangle, message: "Taux de churn segment Jeune en hausse (+5%)", time: "Il y a 2h", color: "text-kpi-warning" },
  { type: "success", icon: CheckCircle, message: "Modèle de scoring recalibré avec succès", time: "Il y a 4h", color: "text-kpi-positive" },
  { type: "info", icon: Info, message: "15 000 nouvelles transactions traitées (batch)", time: "Il y a 6h", color: "text-primary" },
  { type: "warning", icon: AlertTriangle, message: "Temps de réponse API > seuil sur canal USSD", time: "Il y a 8h", color: "text-kpi-warning" },
  { type: "success", icon: CheckCircle, message: "Pipeline ETL exécuté — 2.3M enregistrements", time: "Il y a 12h", color: "text-kpi-positive" },
];

const RecentAlerts = () => (
  <Card className="p-5 col-span-full">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-display font-semibold text-card-foreground">Alertes & Événements Récents</h3>
        <p className="text-xs text-muted-foreground mt-1">Notifications du système Big Data & ML</p>
      </div>
      <button className="text-xs font-medium text-primary hover:underline">Voir tout</button>
    </div>
    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
          <alert.icon size={16} className={`mt-0.5 shrink-0 ${alert.color}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-card-foreground">{alert.message}</p>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
            <Clock size={10} />
            {alert.time}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

export default RecentAlerts;
