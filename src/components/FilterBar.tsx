import { useState } from "react";
import { Search, X, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AGENCES_SCB = [
  "Akwa","Bali","Bessengue","Bonanjo","Bonabéri","Deïdo","Kotto","Ndokoti","New-Bell",
  "Cité des Palmiers","Makepe","Bépanda","Logbessou","PK14","Yassa",
  "Centre-Ville Ydé","Bastos","Mvan","Biyem-Assi","Essos","Messa","Mvog-Ada","Nsimeyong","Nkolbisson",
  "Bafoussam","Dschang","Mbouda","Foumban","Bamenda","Kumba","Buea","Limbé","Tiko",
  "Garoua","Maroua","Ngaoundéré","Bertoua","Ebolowa","Kribi","Edéa","Nkongsamba",
  "Sangmélima","Mbalmayo","Obala","Monatélé","Akonolinga","Yokadouma","Kousseri","Mora",
  "Kumbo","Wum","Mamfe","Banyo","Meiganga","Nanga-Eboko"
];

export type FilterTag = {
  id: string;
  type: "agence" | "periode" | "type_carte" | "ville" | "segment" | "custom";
  label: string;
  value: string;
};

interface FilterBarProps {
  tags: FilterTag[];
  onAddTag: (tag: FilterTag) => void;
  onRemoveTag: (id: string) => void;
  onClearAll: () => void;
  extraFilters?: React.ReactNode;
}

const FilterBar = ({ tags, onAddTag, onRemoveTag, onClearAll, extraFilters }: FilterBarProps) => {
  const [agenceSearch, setAgenceSearch] = useState("");
  const [showAgences, setShowAgences] = useState(false);

  const filteredAgences = AGENCES_SCB.filter(a =>
    a.toLowerCase().includes(agenceSearch.toLowerCase()) &&
    !tags.some(t => t.type === "agence" && t.value === a)
  );

  const addAgence = (agence: string) => {
    onAddTag({ id: `agence-${agence}`, type: "agence", label: agence, value: agence });
    setAgenceSearch("");
    setShowAgences(false);
  };

  const tagColor = (type: FilterTag["type"]) => {
    switch (type) {
      case "agence": return "bg-primary/10 text-primary border-primary/20";
      case "periode": return "bg-accent/10 text-accent border-accent/20";
      case "type_carte": return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "ville": return "bg-kpi-positive/10 text-kpi-positive border-kpi-positive/20";
      case "segment": return "bg-kpi-warning/10 text-kpi-warning border-kpi-warning/20";
      default: return "bg-secondary text-secondary-foreground border-border";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher parmi les 54 agences SCB..."
            value={agenceSearch}
            onChange={e => { setAgenceSearch(e.target.value); setShowAgences(true); }}
            onFocus={() => setShowAgences(true)}
            className="pl-9 h-9 text-xs"
          />
          {showAgences && agenceSearch && filteredAgences.length > 0 && (
            <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredAgences.slice(0, 10).map(a => (
                <button
                  key={a}
                  onClick={() => addAgence(a)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-muted/50 transition-colors text-card-foreground"
                >
                  <MapPin size={12} className="inline mr-2 text-primary" />{a}
                </button>
              ))}
            </div>
          )}
        </div>

        <Select onValueChange={v => onAddTag({ id: `periode-${v}`, type: "periode", label: v, value: v })}>
          <SelectTrigger className="w-32 h-9 text-xs">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            {["Jan 2026","Fév 2026","Mar 2026","T1 2026","T2 2026","S1 2026","2025","2026"].map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={v => onAddTag({ id: `carte-${v}`, type: "type_carte", label: v, value: v })}>
          <SelectTrigger className="w-36 h-9 text-xs">
            <SelectValue placeholder="Type Carte" />
          </SelectTrigger>
          <SelectContent>
            {["Visa Classic","Visa Gold","Visa Business","Mastercard","Prépayée","GIM-UEMOA"].map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {extraFilters}

        {tags.length > 0 && (
          <button onClick={onClearAll} className="text-[10px] text-destructive hover:underline ml-auto">
            Tout effacer
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <Badge
              key={tag.id}
              variant="outline"
              className={`text-[10px] px-2 py-0.5 gap-1 ${tagColor(tag.type)}`}
            >
              <Filter size={10} />
              {tag.label}
              <button onClick={() => onRemoveTag(tag.id)} className="ml-0.5 hover:opacity-70">
                <X size={10} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
export { AGENCES_SCB };
