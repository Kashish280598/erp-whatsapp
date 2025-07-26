import { cn } from "@/lib/utils";

interface FindingChipProps {
    title: string;
    type: 'finding' | 'open' | 'resolved';
    value?: string | number;
    className?: string;
}

const findingTypes = {
    finding: {
        background: '#ECE4FD',
        indicator: '#9A4DEF',
    },
    open: {
        background: '#FDE9CE',
        indicator: '#CF7807',
    },
    resolved: {
        background: '#E6F4EE',
        indicator: '#077D48',
    }
};

const FindingChip = ({ title, value, type, className }: FindingChipProps) => {
    const color = findingTypes[type];

    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-colors duration-200" style={{ backgroundColor: color?.background }}>
                <div
                    className="w-2 h-2 rounded-[3px] transition-colors duration-200"
                    style={{ backgroundColor: color?.indicator }}
                />
                {value && <span className="text-[14px] font-semibold text-gray-900">{value}</span>}
                <span className="text-[13px] leading-5 font-[400] text-neutral">
                    {title}
                </span>
            </div>
        </div>
    );
};

export default FindingChip;