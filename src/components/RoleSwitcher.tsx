import { useAuth, ROLE_CONFIGS, UserRole, roleIcons } from "@/contexts/AuthContext";
import { Shield, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const RoleSwitcher = () => {
  const { currentRole, setCurrentRole, roleConfig } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-foreground border border-border">
          <Shield size={14} className="text-primary" />
          <span className="hidden sm:inline">{roleIcons[currentRole]} {roleConfig.label}</span>
          <span className="sm:hidden">{roleIcons[currentRole]}</span>
          <ChevronDown size={12} className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Shield size={14} />
          Mode Démo RBAC — Sélecteur de Rôle
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.entries(ROLE_CONFIGS) as [UserRole, typeof roleConfig][]).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setCurrentRole(key)}
            className={`flex flex-col items-start gap-1 py-2.5 cursor-pointer ${currentRole === key ? "bg-accent/10" : ""}`}
          >
            <div className="flex items-center gap-2 w-full">
              <span>{roleIcons[key]}</span>
              <span className="font-medium text-sm">{config.label}</span>
              {currentRole === key && (
                <Badge variant="secondary" className="ml-auto text-[10px]">Actif</Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground pl-6 leading-snug">{config.description}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-2">
          <p className="text-[10px] text-muted-foreground text-center">
            🎓 Mode démonstration — Principe du moindre privilège appliqué
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;
