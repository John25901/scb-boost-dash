import { Card } from "@/components/ui/card";
import { FileText, Download, Calendar, BarChart3 } from "lucide-react";

const rapports = [
  { titre: "Rapport Trimestriel NPS Q4 2025", type: "PDF", date: "15 Jan 2026", taille: "2.4 MB", categorie: "Expérience Client" },
  { titre: "Analyse Prédictive Churn — Segment PME", type: "PDF", date: "20 Fév 2026", taille: "1.8 MB", categorie: "Machine Learning" },
  { titre: "Dashboard Opérationnel — Février 2026", type: "Excel", date: "01 Mar 2026", taille: "5.2 MB", categorie: "Opérations" },
  { titre: "Audit Pipeline ETL Q1 2026", type: "PDF", date: "05 Mar 2026", taille: "3.1 MB", categorie: "Big Data" },
  { titre: "Scoring Crédit — Résultats Backtesting", type: "PDF", date: "07 Mar 2026", taille: "1.5 MB", categorie: "Machine Learning" },
  { titre: "Rapport Mensuel Transactions — Février", type: "Excel", date: "02 Mar 2026", taille: "4.7 MB", categorie: "Opérations" },
];

const Rapports = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Rapports</h1>
      <p className="text-xs text-muted-foreground">Documents générés, exports et analyses périodiques</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { label: "Rapports Générés (Mois)", value: "24", icon: FileText },
        { label: "Exports Automatiques", value: "18", icon: Download },
        { label: "Prochaine Génération", value: "12 Mars", icon: Calendar },
      ].map((s) => (
        <Card key={s.label} className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
            <s.icon size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-lg font-display font-bold text-card-foreground">{s.value}</p>
          </div>
        </Card>
      ))}
    </div>

    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-primary" />
        <h3 className="font-display font-semibold text-card-foreground">Bibliothèque de Rapports</h3>
      </div>
      <div className="space-y-3">
        {rapports.map((r, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{r.titre}</p>
              <p className="text-[10px] text-muted-foreground">{r.categorie} • {r.type} • {r.taille}</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{r.date}</span>
            <button className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors shrink-0">
              <Download size={14} className="text-primary" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default Rapports;
