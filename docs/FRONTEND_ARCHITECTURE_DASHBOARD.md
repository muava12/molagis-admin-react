# Arsitektur Frontend untuk Metrik Dashboard

Dokumen ini merinci arsitektur frontend untuk mengambil dan menampilkan metrik `outstanding_revenue` dan `active_customer_count` di dashboard.

## 1. Struktur Data

Akan dibuat file baru di `src/types/dashboard.ts` untuk mendefinisikan tipe data yang akan digunakan.

```typescript
// src/types/dashboard.ts

export interface DashboardMetrics {
  outstandingRevenue: number;
  activeCustomerCount: number;
}
```

## 2. Custom Hook untuk Data Fetching

Sebuah custom hook akan dibuat di `src/hooks/use-dashboard-metrics.ts` untuk mengelola pengambilan data.

### Logika Hook

-   Menggunakan Supabase client untuk memanggil RPC.
-   Memanggil `get_outstanding_revenue` dan `get_active_customer_count` secara bersamaan.
-   Mengelola state untuk `loading`, `error`, dan `data`.

### Contoh Kode

```typescript
// src/hooks/use-dashboard-metrics.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client'; // Asumsi path ke Supabase client
import { DashboardMetrics } from '@/types/dashboard';

export function useDashboardMetrics() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [revenueRes, customersRes] = await Promise.all([
          supabase.rpc('get_outstanding_revenue', { p_start_date: '2025-08-01' }),
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
```

## 3. Integrasi dengan Komponen UI

Komponen `DashboardPage` akan diubah untuk menggunakan hook `useDashboardMetrics`.

### Contoh Penggunaan

```tsx
// src/pages/dashboard-page.tsx

import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics';
import { MetricCard } from '@/components/metric-card'; // Asumsi komponen kartu metrik

export function DashboardPage() {
  const { data, loading, error } = useDashboardMetrics();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Outstanding Revenue"
          value={data?.outstandingRevenue}
        />
        <MetricCard
          title="Active Customers"
          value={data?.activeCustomerCount}
        />
      </div>
    </div>
  );
}
```

Dengan arsitektur ini, komponen UI tetap bersih dan logika pengambilan data terpusat dalam sebuah hook yang dapat digunakan kembali.