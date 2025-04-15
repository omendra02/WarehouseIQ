const API_BASE_URL = 'http://localhost:5000/api';

export interface StockItem {
  item_id: string;
  quantity: number;
  height: number;
  bin_id?: string;
  bin_capacity?: number;
}

export interface BinStatus {
  bin_id: string;
  occupied: number;
  max_capacity: number;
  items: Array<{
    item_id: string;
    qty: number;
    height: number;
    day: string;
  }>;
}

export const api = {
  // Stock Operations
  getStockStatus: async (): Promise<Record<string, number>> => {
    const response = await fetch(`${API_BASE_URL}/stock/status`);
    return response.json();
  },

  addStock: async (item: StockItem): Promise<{
    status: string;
    message: string;
    bin_status: BinStatus[];
  }> => {
    const response = await fetch(`${API_BASE_URL}/stock/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    return response.json();
  },

  dispatchStock: async (itemId: string, quantity: number): Promise<{
    status: string;
    message: string;
    stock_status: Record<string, number>;
  }> => {
    const response = await fetch(`${API_BASE_URL}/stock/dispatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_id: itemId, quantity }),
    });
    return response.json();
  },

  // Bin Operations
  getBinsStatus: async (): Promise<BinStatus[]> => {
    const response = await fetch(`${API_BASE_URL}/bins/status`);
    return response.json();
  },
}; 