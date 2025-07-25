import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/use-debounce";
import { clearTableState, getTableState, setTableState } from "@/lib/table-storage";
import { cn } from "@/lib/utils";
import type { TableQueryParams, TableToolbar } from "@/types/table.types";
import { IconLoader } from "@tabler/icons-react";
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
import * as React from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableToolbar?: TableToolbar;
  fetchData: (params: TableQueryParams) => void;
  totalCount: number | undefined;
  loading: boolean;
  tableId: string; // Add this prop for unique table identification
  className?: string;
  headerClassName?: string;
  tableMainContainerClassName?: string;
  onRowClick?: (row: Row<TData>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tableToolbar,
  fetchData,
  totalCount = 0,
  loading,
  tableId,
  className,
  headerClassName,
  tableMainContainerClassName,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  // Get initial state from localStorage
  const storedState = React.useMemo(() => getTableState(tableId), [tableId]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: storedState.page > 0 ? storedState.page - 1 : 0,
    pageSize: storedState.limit,
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
    pageCount: Math.ceil(totalCount / pageSize),
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
    // Remove manualPagination/manualSorting/manualFiltering for client-side mode
    // manualPagination: false,
    // manualSorting: false,
    // manualFiltering: false,
  });

  // to get debounce search text
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    if (debouncedSearchTerm !== "") {
      setPagination({ pageIndex: 0, pageSize: 10 });
    }
  }, [debouncedSearchTerm]);

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
        : {}),
      search_text: debouncedSearchTerm,
      filters: columnFilters.map(filter => ({
        id: filter.id,
        value: Array.isArray(filter.value) ? filter.value : [filter.value],
      })),
    };
    setTableState(tableId, newState);
  }, [pageIndex, pageSize, sorting, debouncedSearchTerm, columnFilters, tableId]);

  // calling api function for data fetching
  const handleFetchData = React.useCallback(() => {
    const sortBy =
      sorting && sorting[0]
        ? {
          sort_column: sorting[0]?.id,
          sort_order: sorting[0]?.desc ? "DESC" : "ASC",
        }
        : {};
    fetchData({
      page: pageIndex + 1,
      limit: pageSize,
      search_text: debouncedSearchTerm,
      ...sortBy,
      filters: columnFilters,
    });
  }, [pageIndex, pageSize, sorting, debouncedSearchTerm, columnFilters, fetchData]);

  // when pagination and filter states are changed then useEffect is called
  React.useEffect(() => {
    handleFetchData();
  }, [pageIndex, pageSize, sorting, debouncedSearchTerm, columnFilters, handleFetchData]);

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
      <DataTableToolbar
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
                className={`${loading ? "opacity-40" : "opacity-100"} transition-all bg-white dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-800`}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
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
          <TableBody>
            {loading && table.getRowModel().rows?.length > 0 && (
              <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center">
                <IconLoader className="animate-spin w-7 h-7" />
              </div>
            )}
            {!loading || table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: Row<TData>, i) => (
                  <TableRow
                    key={`${row.id}-${i}`}
                    onClick={() => onRowClick?.(row)}
                    data-state={row.getIsSelected() && "selected"}
                    className={`${loading ? "opacity-40" : "opacity-100"} transition-all ${i % 2 !== 0 ? "bg-white" : "bg-[#F9FAFF]"} border-0 hover:bg-primary/10 dark:hover:bg-primary/20 hover:cursor-pointer ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="dark:text-neutral-100">
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
      <DataTablePagination table={table} />
    </div>
  );
}
