import type { ColumnDef } from "@tanstack/react-table";

export interface RowActions {
  onClick?: () => void;
  label: string;
}

export type filterOptionsTypes = {
  field?: string;
  column?: string;
  title: string;
  options: {
    label: string;
    value: string | number | boolean;
  }[];
};

export interface TableToolbar {
  enableSearch?: boolean;
  searchPlaceholder?: string;
  searchContainerClassName?: string;
  enableFilter?: boolean;
  enableCustomizeColumns?: boolean;
  enableSorting?: boolean;
  filterOptions?: filterOptionsTypes[];
  actions?: React.ComponentType<any>;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

export interface TableQueryParams {
  page: number;
  limit: number;
  search_column?: string;
  search_text?: string;
  sort_column?: string;
  sort_order?: string;
  filters?: any;
  from?: string;
  to?: string;
}

export interface ColumnMeta {
  header: string;
  title?: string;
  headerClassName?: string;
  isHidden?: boolean;
}

export type MetaColumnDef<TData> = ColumnDef<TData, unknown> & {
  meta?: ColumnMeta;
};

type ToolbarActionButton = {
  label: string;
  icon: React.ElementType; // assuming you're using icons as React components
  onClick?: () => void;
  to?: string;
  disabled?: boolean;
  variant?:
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"; // variant types
};

// Define the type for the overall actions structure
export type EnhancedTableToolbarAction = {
  primaryAction?: ToolbarActionButton[];
  dropdownActions?: ToolbarActionButton[];
};

export interface TableMetadata {
  page: number;
  limit: number;
  results: number;
  total: number;
}