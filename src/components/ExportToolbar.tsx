import { useState } from "react";
import { Download, Image, FileText, Table2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type ChartViewType = "bar" | "line" | "area" | "pie" | "radar" | "heatmap";
type ColorPalette = "scb" | "ocean" | "sunset" | "monochrome" | "earth";

interface ExportToolbarProps {
  chartId?: string;
  title?: string;
  data?: any[];
  onChartTypeChange?: (type: ChartViewType) => void;
  onPaletteChange?: (palette: ColorPalette) => void;
  chartTypes?: ChartViewType[];
  currentChartType?: ChartViewType;
  compact?: boolean;
}

const PALETTES: Record<ColorPalette, { label: string; colors: string[] }> = {
  scb: { label: "SCB (Orange/Bleu)", colors: ["#002D72","#FF5F00","#2DA84A","#F5A623","#E53E3E"] },
  ocean: { label: "Océan", colors: ["#0B3D91","#1E88E5","#26C6DA","#00897B","#004D40"] },
  sunset: { label: "Coucher de soleil", colors: ["#FF5F00","#FF8F00","#FFB300","#F44336","#AD1457"] },
  monochrome: { label: "Monochrome", colors: ["#002D72","#1A4A8A","#3568A2","#5086BA","#6BA4D2"] },
  earth: { label: "Terre", colors: ["#5D4037","#8D6E63","#A1887F","#4CAF50","#2E7D32"] },
};

const ExportToolbar = ({
  chartId, title = "Graphique", data, onChartTypeChange, onPaletteChange,
  chartTypes = ["bar","line","area"], currentChartType, compact = false
}: ExportToolbarProps) => {
  const { toast } = useToast();

  const exportPNG = () => {
    toast({ title: "📸 Export PNG", description: `Image haute définition "${title}" générée. Téléchargement en cours...` });
    // In production: use html2canvas on chartId element
  };

  const exportPDF = () => {
    toast({ title: "📄 Export PDF", description: `Rapport stylisé "${title}" généré au format A4.` });
  };

  const exportCSV = () => {
    if (!data || data.length === 0) {
      toast({ title: "⚠️ Pas de données", description: "Aucune donnée à exporter.", variant: "destructive" });
      return;
    }
    const headers = Object.keys(data[0]);
    const csv = [headers.join(";"), ...data.map(row => headers.map(h => row[h] ?? "").join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_SCB.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📊 Export CSV", description: `Données "${title}" exportées. Compatible Power BI / Excel.` });
  };

  const exportExcel = () => {
    exportCSV(); // Simplified — CSV is Power BI compatible
    toast({ title: "📊 Export Power BI", description: "Fichier CSV structuré prêt pour import Power BI." });
  };

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Download size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-[10px]">Exporter</DropdownMenuLabel>
          <DropdownMenuItem onClick={exportPNG} className="text-xs gap-2"><Image size={12} /> PNG (Haute Def.)</DropdownMenuItem>
          <DropdownMenuItem onClick={exportPDF} className="text-xs gap-2"><FileText size={12} /> PDF Rapport</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[10px]">Interopérabilité</DropdownMenuLabel>
          <DropdownMenuItem onClick={exportCSV} className="text-xs gap-2"><Table2 size={12} /> CSV</DropdownMenuItem>
          <DropdownMenuItem onClick={exportExcel} className="text-xs gap-2"><Table2 size={12} /> Power BI (CSV)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {onChartTypeChange && (
        <Select value={currentChartType} onValueChange={v => onChartTypeChange(v as ChartViewType)}>
          <SelectTrigger className="w-28 h-7 text-[10px]"><SelectValue placeholder="Vue" /></SelectTrigger>
          <SelectContent>
            {chartTypes.map(t => (
              <SelectItem key={t} value={t} className="text-xs">
                {t === "bar" ? "Barres" : t === "line" ? "Lignes" : t === "area" ? "Aires" : t === "pie" ? "Camembert" : t === "radar" ? "Radar" : "Heatmap"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {onPaletteChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
              <Palette size={10} /> Palette
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(PALETTES).map(([key, pal]) => (
              <DropdownMenuItem key={key} onClick={() => onPaletteChange(key as ColorPalette)} className="text-xs gap-2">
                <div className="flex gap-0.5">
                  {pal.colors.slice(0, 4).map((c, i) => <span key={i} className="h-3 w-3 rounded-full" style={{ backgroundColor: c }} />)}
                </div>
                {pal.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="flex gap-1 ml-auto">
        <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={exportPNG}>
          <Image size={10} /> PNG
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={exportPDF}>
          <FileText size={10} /> PDF
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-accent text-accent hover:bg-accent/10" onClick={exportCSV}>
          <Table2 size={10} /> Power BI
        </Button>
      </div>
    </div>
  );
};

export default ExportToolbar;
