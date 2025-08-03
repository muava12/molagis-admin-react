# Rancangan RPC: `get_active_customer_count`

Dokumen ini merinci rancangan untuk Remote Procedure Call (RPC) baru yang akan menghitung jumlah pelanggan aktif.

## Definisi Pelanggan Aktif

Seorang pelanggan dianggap "aktif" jika mereka memiliki setidaknya satu pesanan yang sedang dalam proses pengiriman (memiliki `deliverydates` dengan status `pending`).

## Skema SQL

Berikut adalah kode SQL untuk membuat fungsi `get_active_customer_count`:

```sql
CREATE OR REPLACE FUNCTION get_active_customer_count()
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT o.customer_id)
    FROM deliverydates dd
    JOIN orders o ON dd.order_id = o.id
    WHERE dd.status = 'pending'
  );
END;
$$ LANGUAGE plpgsql;
```

### Logika Query

1.  **`SELECT COUNT(DISTINCT o.customer_id)`**: Menghitung jumlah pelanggan unik. Ini memastikan bahwa jika seorang pelanggan memiliki beberapa pesanan yang pending, mereka hanya dihitung satu kali.
2.  **`FROM deliverydates dd`**: Memulai query dari tabel `deliverydates` yang berisi status pengiriman.
3.  **`JOIN orders o ON dd.order_id = o.id`**: Menggabungkan dengan tabel `orders` untuk mendapatkan `customer_id`.
4.  **`WHERE dd.status = 'pending'`**: Menyaring hanya untuk pengiriman yang masih dalam status "pending".

## Penggunaan

RPC ini dapat dipanggil dari frontend untuk mendapatkan satu nilai integer yang mewakili jumlah pelanggan aktif saat ini.