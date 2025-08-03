# Dokumentasi RPC: `get_active_customer_count`

## Deskripsi

Fungsi ini bertujuan untuk menghitung jumlah customer yang memiliki order dengan status pengiriman 'pending' dan mengembalikan detail customer tersebut.

Fungsi ini tidak memerlukan parameter input dan secara otomatis menggunakan tanggal saat ini (berdasarkan timezone yang diatur di tabel `settings`) untuk kalkulasi.

## Cara Memanggil

Anda dapat memanggil fungsi ini menggunakan RPC dari Supabase client:

```javascript
const { data, error } = await supabase.rpc('get_active_customer_count');
```

## Struktur Respons

Fungsi akan mengembalikan objek JSON dengan struktur sebagai berikut:

### Respons Sukses (dengan data)

```json
{
  "success": true,
  "data": {
    "count": 2,
    "customers": [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "name": "Customer A",
        "pending_days": 5
      },
      {
        "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
        "name": "Customer B",
        "pending_days": 2
      }
    ]
  },
  "meta": {
    "timezone": "Asia/Makassar",
    "request_date": "2025-08-03"
  }
}
```

### Respons Sukses (tanpa data)

Jika tidak ada customer dengan order pending, `customers` akan menjadi array kosong dan `count` akan menjadi 0.

```json
{
  "success": true,
  "data": {
    "count": 0,
    "customers": []
  },
  "meta": {
    "timezone": "Asia/Makassar",
    "request_date": "2025-08-03"
  }
}
```

## Langkah-langkah Revert (Mengembalikan ke Versi Awal)

Untuk mengembalikan fungsi ini ke versi sebelumnya (yang hanya mengembalikan jumlah dalam bentuk `integer`), jalankan query SQL berikut melalui Supabase SQL Editor:

```sql
DROP FUNCTION IF EXISTS get_active_customer_count();

CREATE OR REPLACE FUNCTION get_active_customer_count(p_date date)
RETURNS integer AS $$
DECLARE
  v_timezone text;
BEGIN
  SELECT value INTO v_timezone FROM settings WHERE key = 'timezone' LIMIT 1;

  RETURN (
    SELECT COUNT(DISTINCT o.customer_id)
    FROM deliverydates dd
    JOIN orders o ON dd.order_id = o.id
    WHERE dd.status = 'pending'
    AND dd.tanggal >= p_date
  );
END;
$$ LANGUAGE plpgsql;
```
*Catatan: Versi revert ini mengembalikan fungsi ke versi yang membutuhkan parameter tanggal.*

## Update Log

### 2025-08-03
- ✅ **Fixed column name issue**: Changed `c.full_name` to `c.nama` to match actual database schema
- ✅ **Fixed frontend import paths**: Updated import paths from `@/` alias to relative paths
- ✅ **Fixed date logic**: Added `AND dd.tanggal >= v_current_date` to only count customers with pending orders from today onwards
- ✅ **Tested successfully**: RPC now correctly returns 5 active customers (not 66) with proper date filtering
- ✅ **Frontend integration**: Dashboard shows count, Settings shows detailed table

### Logika yang Benar
Fungsi ini menghitung customer yang memiliki pesanan dengan status 'pending' **mulai dari hari ini dan ke depan**.

**Kriteria Customer Aktif:**
- Customer memiliki minimal 1 pesanan dengan status 'pending' untuk hari ini atau ke depan
- Jika customer A pesan makanan untuk besok dengan status pending → masuk hitungan
- Jika customer B pesan makanan untuk kemarin dengan status pending → tidak masuk hitungan

**Perhitungan `pending_days`:**
- `pending_days` = jumlah hari unik yang customer tersebut memiliki pesanan pending
- Contoh: Customer pesan hari ini (pending) + besok (pending) + lusa (pending) = `pending_days: 3`
- Contoh: Customer pesan besok (pending) saja = `pending_days: 1`

**Urutan Data:**
- Customer diurutkan berdasarkan `pending_days` terbanyak (descending)