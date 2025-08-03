import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardMetrics } from '@/types/dashboard';

export function useDashboardMetrics() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
        const lastMonday = new Date(today.setDate(diff));
        const formattedDate = lastMonday.toISOString().split('T')[0];

        const [revenueRes, customersRes] = await Promise.all([
          supabase.rpc('get_total_revenue_from_date', { p_start_date: formattedDate }),
          supabase.rpc('get_active_customer_count')
        ]);

        if (revenueRes.error) throw revenueRes.error;
        if (customersRes.error) throw customersRes.error;

        setData({
          outstandingRevenue: revenueRes.data,
          activeCustomerCount: customersRes.data
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { data, loading, error };
}