import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
}

const KpiCard = ({ title, value, change, changeLabel, icon }: KpiCardProps) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card className="p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-display font-bold text-card-foreground">{value}</span>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          isNeutral ? "text-muted-foreground" : isPositive ? "text-kpi-positive" : "text-kpi-negative"
        }`}>
          {isNeutral ? <Minus size={14} /> : isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{isPositive ? "+" : ""}{change}%</span>
          <span className="text-muted-foreground ml-1">{changeLabel}</span>
        </div>
      </div>
    </Card>
  );
};

export default KpiCard;
