import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient.getDashboardStats(),
  });
}

export function useMarketingStats() {
  return useQuery({
    queryKey: ['dashboard', 'marketing'],
    queryFn: () => apiClient.getMarketingStats(),
  });
}

export function useFinances() {
  return useQuery({
    queryKey: ['finances'],
    queryFn: () => apiClient.getFinances(),
  });
}

export function useNotifications(params?: { limit?: number; unreadOnly?: boolean }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => apiClient.getNotifications(params),
  });
}


