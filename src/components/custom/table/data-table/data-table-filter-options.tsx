import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import type { ColumnMeta } from "@/types/table.types";
import { IconCheck } from "@tabler/icons-react";

interface DataTableFilterOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterOptions<TData>({
  table,
}: DataTableFilterOptionsProps<TData>) {
  const columns = table.getAllColumns().filter((column) => column.getCanHide());
  const [visibleColumnIds, setVisibleColumnIds] = useState<Set<string>>(
    new Set(columns.filter(col => col.getIsVisible()).map(col => col.id))
  );

  const handleAllClick = () => {
    const shouldSelectAll = visibleColumnIds.size !== columns.length;
    const newVisibleColumns = new Set<string>();

    columns.forEach(column => {
      if (shouldSelectAll) {
        column.toggleVisibility(true);
        newVisibleColumns.add(column.id);
      } else {
        column.toggleVisibility(false);
      }
    });

    setVisibleColumnIds(newVisibleColumns);
  };

  const handleColumnToggle = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;

    const newVisibleColumns = new Set(visibleColumnIds);
    const isCurrentlyVisible = newVisibleColumns.has(columnId);

    if (isCurrentlyVisible) {
      newVisibleColumns.delete(columnId);
      column.toggleVisibility(false);
    } else {
      newVisibleColumns.add(columnId);
      column.toggleVisibility(true);
    }

    setVisibleColumnIds(newVisibleColumns);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 text-[13px] font-[600] text-neutral leading-5"
        >
          Customize Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="p-1.25 bg-white rounded-lg shadow-lg border border-gray-100"
      >
        <div className="flex flex-col gap-1">
          {/* All Option */}
          <div 
            role="button"
            onClick={handleAllClick}
            className={`flex items-center gap-2 px-2 py-1.25 rounded-md cursor-pointer pr-12 ${
              visibleColumnIds.size === columns.length ? 'bg-primary-100' : 'hover:bg-gray-50'
            }`}
          >
            <div className={`flex items-center justify-center w-4 h-4 rounded ${
              visibleColumnIds.size === columns.length ? 'bg-primary text-white' : 'border border-gray-200'
            }`}>
              {visibleColumnIds.size === columns.length && <IconCheck size={14} strokeWidth={2} />}
            </div>
            <span className="text-[13px] font-[400] text-[#323232] leading-5">All</span>
          </div>

          {/* Column Options */}
          {columns.map((column) => {
            const isVisible = visibleColumnIds.has(column.id);
            const title = (column.columnDef.meta as ColumnMeta)?.header || (column.id)?.replace?.(/([a-z])([A-Z])/g, '$1 $2')?.trim?.();
            
            return (
              <div
                key={column.id}
                role="button"
                onClick={() => handleColumnToggle(column.id)}
                className={`flex items-center gap-2 px-2 py-1.25 rounded-md cursor-pointer pr-12 ${
                  isVisible ? 'bg-primary-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`flex items-center justify-center w-4 h-4 rounded ${
                  isVisible ? 'bg-primary text-white' : 'border border-gray-200'
                }`}>
                  {isVisible && <IconCheck size={14} strokeWidth={2} />}
                </div>
                <span className="text-[13px] font-[400] text-[#323232] leading-5 capitalize">
                  {title}
                </span>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
