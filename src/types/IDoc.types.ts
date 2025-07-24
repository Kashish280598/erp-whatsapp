export default interface IDoc {
    id: any;
  }
  
  export interface Options {
    value: any;
    label: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
    message: string;
    code: number;
    success: boolean;
    error?: string;
  }
  
  export type StatusVariant = {
    label: string;
    variant: "success" | "destructive" | "warning" | "info"; // Ensure these are the allowed values
  };
  
  export type RowActionTypes = {
    label: string;
    link?: string;
    onClick?: () => void;
  };
  