import { cn } from "@/lib/utils";
import clsx from "clsx";

interface SeverityChipProps {
    title: string;
    type: 'critical' | 'high' | 'medium' | 'low';
    value?: string | number;
    className?: string;
}


const SeverityChip = ({ title, value, type, className }: SeverityChipProps) => {

    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div className={clsx(`flex items-center gap-1.5 px-2 pl-1.5 py-0.5 rounded-[8px] transition-colors duration-200`, {
                'bg-error-300': type === 'critical',
                'bg-error-100': type === 'high',
                'bg-warning-500': type === 'medium',
                'bg-success-300': type === 'low',
            })}>
                <div
                    className={clsx(`w-2 h-2 rounded-[3px] transition-colors duration-200`, {
                        'bg-error-900': type === 'critical',
                        'bg-error': type === 'high',
                        'bg-warning': type === 'medium',
                        'bg-success-700': type === 'low',
                    })}
                />
                <span className="text-[13px] leading-5 font-[400] text-neutral text-nowrap capitalize">
                    {title}
                </span>
            </div>
            {value && <span className="text-2xl font-semibold text-gray-900">{value}</span>}
        </div>
    );
};

export default SeverityChip;