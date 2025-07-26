import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  // Generate page numbers to show
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= 3) {
      // If 3 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always add first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        pages.push(2, 3);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...');
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
        pages.push(totalPages);
      } else {
        // Middle - show current page, 2 before and 2 after
        pages.push('...');
        pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-between pb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-500">Records per page</span>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px] border-gray-200">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-sm text-neutral-500">
          Showing {table.getFilteredRowModel().rows.length} out of {totalPages * table.getState().pagination.pageSize} line items
        </div>
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <div className="flex items-center gap-1">
          <Button
            variant="default"
            size="sm"
            className="h-8 w-24 rounded-md font-semibold bg-primary text-white dark:bg-primary dark:text-white border-none shadow-none hover:bg-primary/90 dark:hover:bg-primary/90 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:opacity-60"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>

          {pageNumbers.map((pageNum, idx) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-netrual-500">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={`page-${pageNum}`}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 rounded-md font-semibold ${currentPage === pageNum
                  ? "bg-primary text-white dark:bg-primary dark:text-white border-none"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#232A36] text-neutral-700 dark:text-neutral-200"
                  } !shadow-none`}
                onClick={() => table.setPageIndex(Number(pageNum) - 1)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="default"
            size="sm"
            className="h-8 w-18 rounded-md font-semibold bg-primary text-white dark:bg-primary dark:text-white border-none shadow-none hover:bg-primary/90 dark:hover:bg-primary/90 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:opacity-60"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
