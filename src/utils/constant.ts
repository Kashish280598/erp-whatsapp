import type { StatusVariant } from "@/types/IDoc.types";

export const DATE_FORMATS = {
  DEFAULT: "YYYY-MM-DD",
  READABLE: "MMMM D, YYYY",
  SHORT: "MM/DD/YYYY",
  LONG: "dddd, MMMM D, YYYY",
  WITH_TIME: "YYYY-MM-DD HH:mm:ss",
  TIME: "HH:mm:ss",
  TIME_12H: "hh:mm A",
  TIME_24H: "HH:mm",
  ISO: "YYYY-MM-DDTHH:mm:ssZ",
};

export const STATUS_COLOR_VARIANT: {
  SERVICE_REQUEST: Record<
    string,
    | "success"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "warning"
    | "info"
  >;
} = {
  SERVICE_REQUEST: {
    open: "warning",
    closed: "success",
  },
};

export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
export const TOKEN_EXPIRY_KEY = import.meta.env.VITE_TOKEN_EXPIRY_KEY;
export const ORG_SLUG_KEY = import.meta.env.VITE_ORG_SLUG_KEY;

export const STATUSES: StatusVariant[] = [
  {
    label: "approved",
    variant: "success",
  },
  {
    label: "rejected",
    variant: "destructive",
  },
  {
    label: "pending",
    variant: "warning",
  },
];

export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_NUMBER: 1,
};



export const AUTH_METHODS = {
  Password: 'Password'
};


// Table Ids
export const UserDirectoryTabelId: string = 'user-management-directory';
export const InvitesSentTabelId: string = 'invites-sent-table';
export const MainDiscoveryTable: string = 'main-discovery-table';