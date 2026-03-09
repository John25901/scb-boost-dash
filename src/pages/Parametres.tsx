import { Card } from "@/components/ui/card";
import { Settings, Bell, Shield, Database, Palette, Globe } from "lucide-react";

const settingSections = [
  {
    title: "Général",
    icon: Settings,
    items: [
      { label: "Langue de l'interface", value: "Français" },
      { label: "Fuseau horaire", value: "UTC+1 (Douala)" },
      { label: "Format de date", value: "JJ/MM/AAAA" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Alertes critiques", value: "Activé" },
      { label: "Rapports automatiques", value: "Hebdomadaire" },
      { label: "Alertes pipeline", value: "Activé" },
    ],
  },
  {
    title: "Sécurité",
    icon: Shield,
    items: [
      { label: "Authentification 2FA", value: "Activé" },
      { label: "Expiration session", value: "30 min" },
      { label: "Journalisation", value: "Complète" },
    ],
  },
  {
    title: "Sources de Données",
    icon: Database,
    items: [
      { label: "Core Banking System", value: "Connecté" },
      { label: "Data Lake (HDFS)", value: "Connecté" },
      { label: "API Mobile Banking", value: "Connecté" },
    ],
  },
];

const Parametres = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Paramètres</h1>
      <p className="text-xs text-muted-foreground">Configuration du dashboard, notifications et connexions</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {settingSections.map((section) => (
        <Card key={section.title} className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <section.icon size={16} className="text-primary" />
            <h3 className="font-display font-semibold text-card-foreground">{section.title}</h3>
          </div>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-card-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Parametres;
