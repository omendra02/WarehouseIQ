import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/warehouse';

interface WarehouseMetrics {
    totalCapacity: number;
    occupiedSpace: number;
    spaceUtilization: number;
    totalBins: number;
    activeBins: number;
    efficiencyRate: number;
    avgProcessingTime: number;
    pendingDispatches: number;
    dailyMetrics: string[];
}

interface BinData {
    maxCapacity: number;
    day: number;
}

export const useWarehouseMetrics = () => {
    return useQuery<WarehouseMetrics>({
        queryKey: ['warehouseMetrics'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/metrics`);
            return data;
        },
        refetchInterval: 5000, // Refresh every 5 seconds
    });
};

export const useStoreBin = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (binData: BinData) => {
            const { data } = await axios.post(`${API_URL}/store`, binData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warehouseMetrics'] });
        },
    });
};

export const useDispatchItems = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ amount, day }: { amount: number; day: number }) => {
            const { data } = await axios.post(
                `${API_URL}/dispatch?amount=${amount}&day=${day}`
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warehouseMetrics'] });
        },
    });
};

export const useFindPath = () => {
    return useMutation({
        mutationFn: async ({
            startRow,
            startCol,
            endRow,
            endCol,
        }: {
            startRow: number;
            startCol: number;
            endRow: number;
            endCol: number;
        }) => {
            const { data } = await axios.get(
                `${API_URL}/path?startRow=${startRow}&startCol=${startCol}&endRow=${endRow}&endCol=${endCol}`
            );
            return data;
        },
    });
}; 