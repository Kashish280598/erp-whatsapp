interface TableState {
  page: number;
  limit: number;
  sort?: {
    column: string;
    order: 'ASC' | 'DESC';
  };
  search_text?: string;
  filters?: Array<{ id: string; value: any[] }>;
}

// @ts-ignore
export const getTableState = (tableId: string): TableState => {
  const storedState = localStorage.getItem(`table_state_${tableId}`);
  if (storedState) {
    return JSON.parse(storedState);
  }
  return {
    page: 1,
    limit: 10,
  };
};

export const setTableState = (tableId: string, state: TableState): void => {
  localStorage.setItem(`table_state_${tableId}`, JSON.stringify(state));
};

export const clearTableState = (tableId: string): void => {
  localStorage.removeItem(`table_state_${tableId}`);
}; 