'use client';

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BasicTablePagination } from "./BasicTablePagination";
import { BasicTableToolbar } from "./BasicTableToolbar";
import { IconLoader } from "@tabler/icons-react";
import { clearTableState, getTableState, setTableState } from "@/lib/table-storage";
import type { TableToolbar } from "@/types/table.types";

interface BasicTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableToolbar?: TableToolbar;
  loading: boolean;
  tableId: string; // Add this prop for unique table identification
  className?: string;
  headerClassName?: string;
  tableMainContainerClassName?: string;
  onRowClick?: (row: Row<TData>) => void;
  showPagination?: boolean;
  tableBodyClassName?: string;
}

export function BasicTable<TData, TValue>({
  columns,
  data,
  tableToolbar,
  loading,
  tableId,
  className,
  headerClassName,
  tableMainContainerClassName,
  onRowClick,
  showPagination = true,
  tableBodyClassName
}: BasicTableProps<TData, TValue>) {
  // Get initial state from localStorage
  const storedState = React.useMemo(() => getTableState(tableId), [tableId]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: storedState.page > 0 ? storedState.page - 1 : 0,
    pageSize: showPagination ? storedState.limit : data.length,
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    Object.fromEntries(
      columns
        .filter(column => column.meta && 'isHidden' in column.meta)
        .map(column => [column.id, false])
    )
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    storedState.filters || []
  );

  const [sorting, setSorting] = React.useState<SortingState>(
    storedState.sort
      ? [{
        id: storedState.sort.column,
        desc: storedState.sort.order === 'DESC',
      }]
      : []
  );

  const [searchTerm, setSearchTerm] = React.useState<string>(storedState.search_text || "");
  const { pageIndex, pageSize } = pagination;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
  });

  // Search filter (client-side)
  React.useEffect(() => {
    if (searchTerm !== "") {
      setPagination({ pageIndex: 0, pageSize });
      table.setGlobalFilter?.(searchTerm);
    }
  }, [searchTerm, pageSize, table]);


  // Update localStorage when table state changes
  React.useEffect(() => {
    const newState = {
      page: pageIndex + 1,
      limit: pageSize,
      ...(sorting[0]
        ? {
          sort_column: sorting[0].id,
          sort_order: sorting[0].desc ? 'DESC' as const : 'ASC' as const,
        }
        : { undefined }),
      search_text: searchTerm,
      filters: columnFilters.map(filter => ({
        id: filter.id,
        value: Array.isArray(filter.value) ? filter.value : [filter.value],
      })),
    };
    setTableState(tableId, newState);
  }, [pageIndex, pageSize, sorting, searchTerm, columnFilters, tableId]);

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      clearTableState(tableId);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearTableState(tableId);
    };
  }, []);


  return (
    <div className="space-y-4">
      <BasicTableToolbar
        tableToolbar={tableToolbar}
        table={table}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
      />
      <div className={cn("rounded-md border overflow-hidden", tableMainContainerClassName)}>
        <Table className={cn(className)} tableMainContainerClassName={tableMainContainerClassName}>
          <TableHeader className={headerClassName}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={`${loading ? "opacity-40" : "opacity-100"} transition-all bg-white hover:bg-white`}
              >
                {headerGroup.headers.map((header, headerIndex) => {
                  return (
                    <TableHead
                      key={`${header.id}-${headerIndex}`}
                      colSpan={header.colSpan}
                      // @ts-ignore
                      className={header.column.columnDef.meta?.headerClassName}
                      style={{ position: "relative", width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={tableBodyClassName}>
            {loading && table.getRowModel().rows?.length > 0 && (
              <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center">
                <IconLoader className="animate-spin w-7 h-7" />
              </div>
            )}
            {!loading || table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: Row<TData>, rowIndex) => (
                  <TableRow
                    key={`${row.id}-${rowIndex}`}
                    data-state={row.getIsSelected() && "selected"}
                    className={`${loading ? "opacity-40" : "opacity-100"} transition-all ${rowIndex % 2 !== 0 ? "bg-white" : "bg-[#F9FAFF]"} border-0 hover:bg-[#d7d8dd78] hover:cursor-pointer ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell key={`${cell.id}-${cellIndex}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )
            ) : (
              Array(pageSize)
                .fill("")
                .map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, i) => (
                      <TableCell key={i}>
                        <Skeleton className="h-[20px] my-1.5 rounded-md" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && <BasicTablePagination table={table} />}
    </div>
  );
}
