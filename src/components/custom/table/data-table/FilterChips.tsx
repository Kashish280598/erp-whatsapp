import React, { useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { IconX } from '@tabler/icons-react';
import type { filterOptionsTypes } from '@/types/table.types';

type FilterChipsProps = {
    chips: {
        id: string;
        value: string[];
    }[];
    containerClassName?: string;
    getFilterLabel: (id: string, value: string) => string;
    removeFilter: (id: string, value: string) => void;
    filterOptions: filterOptionsTypes[]
};

export const FilterChips: React.FC<FilterChipsProps> = ({
    chips,
    containerClassName = '',
    getFilterLabel,
    removeFilter,
    filterOptions
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(0);
    const [totalWidth, setTotalWidth] = useState<number[]>([]);
    // Flatten the chip values into a single array of { id, value }
    const flattenedChips = chips.flatMap((chip) =>
        chip.value.map((value) => ({
            id: chip.id,
            value,
            filterOption: filterOptions.find(a => a.field === chip.id || a.column === chip.id)
        }))
    );

    useEffect(() => {
        const calculateVisibleChips = () => {
            if (!containerRef.current) return;
            const totalWidth = [];
            for (let i = 0; i < flattenedChips.length; i++) {
                const chip = chipRefs.current[i];
                if (chip) {
                    const chipWidth = chip.clientWidth + 12; // add spacing
                    totalWidth.push(chipWidth);
                }
            }
            setTotalWidth(totalWidth);
        };
        calculateVisibleChips();
        window.addEventListener('resize', calculateVisibleChips);
        return () => window.removeEventListener('resize', calculateVisibleChips);
    }, [flattenedChips?.length]);

    useEffect(() => {
        const containerWidth = containerRef.current?.clientWidth ?? 0;
        const visibleChips = totalWidth.reduce((acc, curr) => {
            if (acc.total + curr <= containerWidth) {
                return {
                    total: acc.total + curr,
                    visible: acc.visible + 1
                };
            }
            return acc;
        }, {
            total: 65,  // 65 is the width of the badge
            visible: 0
        });
        setVisibleCount(visibleChips.visible);
    }, [totalWidth]);

    const visibleChips = flattenedChips.slice(0, visibleCount);
    const hiddenChips = flattenedChips.slice(visibleCount);

    return (
        <div className={`relative flex flex-wrap items-center gap-2 flex-1 ${containerClassName}`} ref={containerRef}>
            <div className="absolute invisible w-full flex flex-wrap items-center gap-2 flex-1">
                {flattenedChips.map((chip, idx) => (
                    <div
                        key={`${chip.id}-${chip.value}`}
                        ref={(el: HTMLDivElement | null): void => {
                            chipRefs.current[idx] = el;
                        }}
                        className=""
                    >
                        <Badge
                            variant="secondary"
                            className="h-8 px-2 flex items-center gap-1.5 bg-primary-300 text-neutral-500 font-[600] hover:bg-gray-100 border border-[#E4E4E8]"
                        >
                            <span className="font-[400] capitalize">{chip.filterOption?.title}:</span>
                            <span>{getFilterLabel(chip.id, chip.value)}</span>
                            <button
                                className="cursor-pointer h-4 w-4 bg-white text-neutral hover:text-gray-600 rounded-full border border-[#070822] flex items-center justify-center"
                                onClick={() => removeFilter(chip.id, chip.value)}
                            >
                                <IconX height={12} width={12} strokeWidth={2} />
                            </button>
                        </Badge>
                    </div>
                ))}
            </div>
            {visibleChips.map((chip) => (
                <div key={`${chip.id}-${chip.value}`}>
                    <Badge
                        variant="secondary"
                        className="h-8 px-2 flex items-center gap-1.5 bg-primary-300 text-neutral-500 font-[600] hover:bg-gray-100 border border-[#E4E4E8]"
                    >
                        <span className="font-[400] capitalize">{chip.filterOption?.title}:</span>
                        <span>{getFilterLabel(chip.id, chip.value)}</span>
                        <button
                            className="cursor-pointer h-4 w-4 bg-white text-neutral hover:text-gray-600 rounded-full border border-[#070822] flex items-center justify-center"
                            onClick={() => removeFilter(chip.id, chip.value)}
                        >
                            <IconX height={12} width={12} strokeWidth={2} />
                        </button>
                    </Badge>
                </div>
            ))}

            {hiddenChips.length > 0 && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Badge variant="outline" className="h-8 px-2 flex items-center gap-1.5 bg-primary-300 text-neutral-500 font-[600] hover:bg-gray-100 border border-[#E4E4E8] cursor-pointer">+{hiddenChips.length} More</Badge>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-fit max-w-xs p-2">
                        <div className="flex flex-col gap-2">
                            {hiddenChips.map((chip) => (
                                <Badge
                                    key={`${chip.id}-${chip.value}`}
                                    variant="secondary"
                                    className="w-full h-8 px-2 flex items-center gap-1.5 bg-primary-300 text-neutral-500 font-[600] hover:bg-gray-100 border border-[#E4E4E8]"
                                >
                                    <span className="font-[400] capitalize">{chip.filterOption?.title}:</span>
                                    <span>{getFilterLabel(chip.id, chip.value)}</span>
                                    <button
                                        className="cursor-pointer h-4 w-4 bg-white text-neutral hover:text-gray-600 rounded-full border border-[#070822] flex items-center justify-center ml-auto"
                                        onClick={() => removeFilter(chip.id, chip.value)}
                                    >
                                        <IconX height={12} width={12} strokeWidth={2} />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
};