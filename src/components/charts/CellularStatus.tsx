import React from "react";
import { cn } from "@/lib/utils";

type Status = "critical" | "high" | "medium" | "low";

interface CellularStatusProps {
  status: Status;
}

const STATUS_CONFIG: Record<
  Status,
  {
    label: string;
    textColor: string;
    barColors: string[];
  }
> = {
  critical: {
    label: "Critical",
    textColor: "text-error-900",
    barColors: ["bg-error-900", "bg-error-900", "bg-error-900", "bg-error-900"],
  },
  high: {
    label: "High",
    textColor: "text-error",
    barColors: ["bg-error", "bg-error", "bg-error", "bg-error/20"],
  },
  medium: {
    label: "Medium",
    textColor: "text-[#F79212]",
    barColors: ["bg-[#F79212]", "bg-[#F79212]", "bg-[#F79212]/30", "bg-[#F79212]/30"],
  },
  low: {
    label: "Low",
    textColor: "text-success",
    barColors: ["bg-success", "bg-success/30", "bg-success/30", "bg-success/30"],
  },
};

const CellularStatus: React.FC<CellularStatusProps> = ({ status }) => {
  const { label, textColor, barColors } = STATUS_CONFIG[status];

  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-[1px] items-end">
        {barColors.map((barColor, index) => (
          <div
            key={index}
            className={cn("w-[3px] rounded-sm", barColor)}
            style={{ height: `${(index + 1) * 4}px` }}
          />
        ))}
      </div>
      <span className={cn("text-[13px] font-[400] leading-5", textColor)}>{label}</span>
    </div>
  );
};

export default CellularStatus;
