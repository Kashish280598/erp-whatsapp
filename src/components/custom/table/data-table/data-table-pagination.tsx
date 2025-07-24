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
            variant="link"
            size="icon"
            className="h-8 w-25 border-gray-200 cursor-pointer underline-offset-0 no-underline hover:no-underline disabled:bg-white disabled:text-primary disabled:opacity-50"
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
                size="icon"
                className={`h-8 w-8 ${currentPage === pageNum
                  ? "bg-[#EEF1FF] text-primary hover:bg-[#EEF1FF] hover:text-primary border-primary"
                  : "border-gray-200"
                  } !shadow-none`}
                onClick={() => table.setPageIndex(Number(pageNum) - 1)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="link"
            size="icon"
            className="h-8 w-18 cursor-pointer underline-offset-0 no-underline hover:no-underline disabled:bg-white disabled:text-primary disabled:opacity-50"
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
