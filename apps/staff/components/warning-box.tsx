import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface WarningBoxProps {
  children: ReactNode;
  icon: LucideIcon;
  boxColor: 'pink' | 'amber' | 'blue'; 
}

const WarningBox = ({ children, icon: Icon, boxColor }: WarningBoxProps) => {
  const colorMap: Record<WarningBoxProps['boxColor'], { container: string; iconBg: string; iconStroke: string }> = {
    pink: {
      container: "border-pink-500/20 bg-pink-500/5",
      iconBg: "border-pink-300 bg-pink-100 dark:border-pink-300/10 dark:bg-pink-400/10",
      iconStroke: "stroke-pink-700 dark:stroke-pink-500"
    },
    amber: {
      container: "border-amber-500/20 bg-amber-500/5",
      iconBg: "border-amber-300 bg-amber-100 dark:border-amber-300/10 dark:bg-amber-400/10",
      iconStroke: "stroke-amber-700 dark:stroke-amber-500"
    },
    blue: {
      container: "border-blue-500/20 bg-blue-500/5",
      iconBg: "border-blue-300 bg-blue-100 dark:border-blue-300/10 dark:bg-blue-400/10",
      iconStroke: "stroke-blue-700 dark:stroke-blue-500"
    }
  };

  const colors = colorMap[boxColor];

  return (
    <div className={`flex items-center rounded-lg border px-4 py-3 text-sm ${colors.container}`}>
      <div className={`inline-flex shrink-0 rounded-full border p-2 ${colors.iconBg}`}>
        <Icon className={`size-6 ${colors.iconStroke}`} />
      </div>
      <div className="ml-4">
        <div className="text-xs text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
};

export default WarningBox