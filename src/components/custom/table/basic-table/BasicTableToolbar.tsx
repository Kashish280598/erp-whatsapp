import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconChevronRight } from "@tabler/icons-react";
import { BasicTableFilterOptions } from "./basic-table-filter-options";
import type { TableToolbar, filterOptionsTypes } from "@/types/table.types";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { FilterChips } from "../data-table/FilterChips";
import FilterIcon from "@/assets/icons/Filter-Icon.svg"; // Adjust the path as necessary
import { cn } from "@/lib/utils";

interface BasicTableToolbarProps<TData> {
    table: Table<TData>;
    tableToolbar?: TableToolbar;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

// Memoized Filter Option Component
const FilterOption = memo(({
    option,
    isSelected,
    selectedFilter,
    onOptionChange
}: {
    option: { label: string; value: string | number | boolean };
    isSelected: boolean;
    selectedFilter: string;
    onOptionChange: (checked: boolean) => void;
}) => (
    <div
        className={`flex items-center space-x-2 ${isSelected ? 'bg-primary-100' : ''} p-2 rounded-[4px]`}
    >
        <Checkbox
            id={`${selectedFilter}-${option.value}`}
            checked={isSelected}
            onCheckedChange={onOptionChange}
            className={`${isSelected ? 'border-primary bg-primary' : 'border-[#C8C8D0] bg-white'}`}
        />
        <label
            htmlFor={`${selectedFilter}-${option.value}`}
            className="text-[13px] font-[400] leading-4.5 text-neutral peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
            {option.label}
        </label>
    </div>
));

FilterOption.displayName = 'FilterOption';

// Memoized Filter Category Component
const FilterCategory = memo(({
    filter,
    isSelected,
    selectedValues,
    onClick
}: {
    filter: filterOptionsTypes;
    isSelected: boolean;
    selectedValues: string[];
    onClick: () => void;
}) => (
    <div
        role="button"
        onClick={onClick}
        className={`flex items-center justify-between mr-1 px-2 py-1.5 hover:bg-primary-200 cursor-pointer rounded-[4px] ${isSelected ? 'bg-primary-100' : ''
            }`}
    >
        <div className="flex items-center gap-2">
            <span className="text-[13px] font-[400] text-neutral leading-5 whitespace-nowrap">
                {filter.title}
            </span>
            {selectedValues.length > 0 && (
                <Badge variant="secondary" className={`px-2 py-0.5 text-[11px] font-[600] leading-3.5 text-neutral ${isSelected ? 'bg-white' : 'bg-primary-200'}`}>
                    {selectedValues.length?.toString().padStart(2, '0')}
                </Badge>
            )}
        </div>
        <IconChevronRight
            className={`ml-5 h-4 w-4 text-gray-400 transition-all duration-300 ${isSelected ? '!text-primary' : ''
                }`}
        />
    </div>
));

FilterCategory.displayName = 'FilterCategory';

export function BasicTableToolbar<TData>({
    table,
    tableToolbar,
    searchTerm,
    setSearchTerm,
}: BasicTableToolbarProps<TData>) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(
        tableToolbar?.filterOptions?.[0]?.column || null
    );
    const [pendingFilters, setPendingFilters] = useState<Record<string, string[]>>({});

    // Initialize pending filters when popover opens
    useEffect(() => {
        if (isFilterOpen) {
            const currentFilters: Record<string, string[]> = {};
            tableToolbar?.filterOptions?.forEach((filter) => {
                const column = table.getColumn(filter?.column || '');
                const values = (column?.getFilterValue() as string[]) || [];
                currentFilters[filter?.column || ''] = values;
            });
            setPendingFilters(currentFilters);
        }
    }, [isFilterOpen, table, tableToolbar?.filterOptions]);

    const enableSearch = tableToolbar?.enableSearch ?? true;
    const enableFilter = tableToolbar?.enableFilter ?? true;
    const searchPlaceholder = tableToolbar?.searchPlaceholder ?? 'Search...';
    const searchContainerClassName = tableToolbar?.searchContainerClassName ?? '';
    const enableCustomizeColumns = tableToolbar?.enableCustomizeColumns ?? true;

    // Memoize active filters
    const activeFilters = useMemo(() => {
        return table.getState().columnFilters;
    }, [table.getState().columnFilters]);

    // Memoized helper functions
    const getFilterLabel = useCallback((field: string, value: string) => {
        const option = tableToolbar?.filterOptions?.find(opt => opt.column === field)
            ?.options.find(opt => opt.value === value);
        return option?.label || value;
    }, [tableToolbar?.filterOptions]);

    const getSelectedValues = useCallback((field: string) => {
        return pendingFilters[field] || [];
    }, [pendingFilters]);

    const removeFilter = useCallback((field: string, value: string) => {
        const column = table.getColumn(field);
        if (!column) return;

        const currentFilters = column.getFilterValue() as string[] || [];
        const newFilters = currentFilters.filter(v => v !== value);
        column.setFilterValue(newFilters.length ? newFilters : undefined);
    }, [table]);

    // const clearAllFilters = useCallback(() => {
    //   table.resetColumnFilters();
    // }, [table]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setSearchTerm(e.target.value || null);
    }, [setSearchTerm]);

    const handleOptionChange = useCallback((field: string, value: string | number | boolean, checked: boolean) => {
        setPendingFilters((prev: any) => {
            const currentValues = prev[field] || [];
            const newValues = checked
                ? [...currentValues, value]
                : currentValues.filter((v: any) => v !== value);

            return {
                ...prev,
                [field]: newValues
            };
        });
    }, []);

    const handleApplyFilters = useCallback(() => {
        // Apply filters first
        Object.entries(pendingFilters).forEach(([field, values]) => {
            const column = table.getColumn(field);
            if (column) {
                column.setFilterValue(values.length ? values : undefined);
            }
        });
        // Close after filters are applied
        requestAnimationFrame(() => {
            setIsFilterOpen(false);
        });
    }, [pendingFilters, table]);

    const handleClearFilter = useCallback(() => {
        setPendingFilters({});
    }, []);


    // Check if there are any pending filters selected
    const hasSelectedFilters = useMemo(() => {
        return Object.values(pendingFilters).some(values => values.length > 0);
    }, [pendingFilters]);

    // Check if current filters are different from pending filters
    const hasFilterChanges = useMemo(() => {
        const currentFilters: Record<string, string[]> = {};
        tableToolbar?.filterOptions?.forEach((filter) => {
            const column = table.getColumn(filter?.column || '');
            const values = (column?.getFilterValue() as string[]) || [];
            currentFilters[filter?.column || ''] = values;
        });

        return Object.entries(pendingFilters).some(([field, values]) => {
            const currentValues = currentFilters[field] || [];
            return values.length !== currentValues.length ||
                values.some(v => !currentValues.includes(v)) ||
                currentValues.some(v => !values.includes(v));
        });
    }, [pendingFilters, table, tableToolbar?.filterOptions]);

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                    {enableSearch && (
                        <div className={cn("w-[320px]", searchContainerClassName)}>
                            <Input
                                startIcon={<Search className="h-4 w-4" />}
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="h-9"
                            />
                        </div>
                    )}
                    {/* Filter Chips */}
                    {enableFilter && <FilterChips
                        chips={activeFilters.map(filter => ({
                            id: filter.id,
                            value: filter.value as string[]
                        }))}
                        filterOptions={tableToolbar?.filterOptions || []}
                        getFilterLabel={getFilterLabel}
                        removeFilter={removeFilter}
                    />}

                    {enableFilter && (
                        <div className="flex items-center gap-2 ml-auto">
                            {enableFilter && tableToolbar?.filterOptions && tableToolbar?.filterOptions?.length > 0 && <Popover
                                open={isFilterOpen}
                                onOpenChange={(open) => {
                                    if (!open) {
                                        // Reset pending filters when closing without applying
                                        const currentFilters: Record<string, string[]> = {};
                                        tableToolbar?.filterOptions?.forEach((filter) => {
                                            const column = table.getColumn(filter?.column || '');
                                            const values = (column?.getFilterValue() as string[]) || [];
                                            currentFilters[filter?.column || ''] = values;
                                        });
                                        setPendingFilters(currentFilters);
                                    }
                                    setIsFilterOpen(open);
                                }}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 px-3 text-[13px] font-[600] text-neutral leading-5 flex items-center gap-1 border-neutral-200"
                                    >
                                        <img src={FilterIcon} className="h-3 w-3" alt="F" />
                                        <span>Filters</span>
                                        {activeFilters.length > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-1 bg-neutral-200 text-neutral-500 text-[12px] font-[600] leading-4"
                                            >
                                                {activeFilters.length?.toString().padStart(2, '0')}
                                            </Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                {isFilterOpen && (
                                    <PopoverContent
                                        align="end"
                                        className="p-3 w-[435px] h-[300px]"
                                        onEscapeKeyDown={() => setIsFilterOpen(false)}
                                        onPointerDownOutside={() => setIsFilterOpen(false)}
                                    >
                                        <div className="flex h-full">
                                            {/* Left Panel - Filter Categories */}
                                            <div className="flex flex-col gap-1 w-[200px] mr-2 custom-scrollbar overflow-auto ">
                                                {tableToolbar?.filterOptions?.map((filter) => (
                                                    <FilterCategory
                                                        key={filter?.column || ''}
                                                        filter={filter}
                                                        isSelected={selectedFilter === filter?.column}
                                                        selectedValues={getSelectedValues(filter?.column || '')}
                                                        onClick={() => setSelectedFilter(filter?.column || '')}
                                                    />
                                                ))}
                                            </div>

                                            {/* Right Panel - Filter Options */}
                                            <div className="flex-1 px-3 border-l-1 border-neutral-200 pr-0 w-[235px] h-full flex flex-col justify-between">
                                                {selectedFilter && (
                                                    <>
                                                        <div className="space-y-1 pr-2 custom-scrollbar overflow-auto">
                                                            {tableToolbar?.filterOptions
                                                                ?.find(f => f?.column === selectedFilter)
                                                                ?.options.map((option) => {
                                                                    const selectedValues = getSelectedValues(selectedFilter || '');
                                                                    const isSelected = selectedValues.includes(option.value as string);

                                                                    return (
                                                                        <FilterOption
                                                                            key={option.value as string}
                                                                            option={option}
                                                                            isSelected={isSelected}
                                                                            selectedFilter={selectedFilter}
                                                                            onOptionChange={(checked) =>
                                                                                handleOptionChange(selectedFilter || '', option?.value, checked)
                                                                            }
                                                                        />
                                                                    );
                                                                })}
                                                        </div>
                                                        <div className="sticky bottom-0 flex justify-end gap-2 pt-4 bg-white">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleClearFilter}
                                                                disabled={!hasSelectedFilters}
                                                                className={!hasSelectedFilters ? 'opacity-50 cursor-not-allowed' : ''}
                                                            >
                                                                Clear All
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className={`bg-primary hover:bg-primary-400 text-white ${!hasFilterChanges ? 'opacity-50 cursor-not-allowed' : ''
                                                                    }`}
                                                                onClick={handleApplyFilters}
                                                                disabled={!hasFilterChanges}
                                                            >
                                                                Apply
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </PopoverContent>
                                )}
                            </Popover>}
                            {enableCustomizeColumns && <BasicTableFilterOptions table={table} />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
