# Dokumentasi RPC: `get_active_customer_count`

Dokumen ini berisi detail mengenai RPC `get_active_customer_count` yang baru ditambahkan ke database Supabase.

## Deskripsi

Fungsi `get_active_customer_count` adalah sebuah Remote Procedure Call (RPC) yang dirancang untuk menghitung jumlah pelanggan unik yang saat ini memiliki pesanan dengan status pengiriman "pending".

Seorang pelanggan dianggap "aktif" jika mereka memiliki setidaknya satu item dalam tabel `deliverydates` dengan kolom `status` bernilai `pending`. Fungsi ini memastikan bahwa setiap pelanggan hanya dihitung satu kali, bahkan jika mereka memiliki beberapa pengiriman yang tertunda.

## Kode SQL

Berikut adalah kode SQL yang digunakan untuk membuat fungsi ini:

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

## Langkah-langkah Revert

Jika diperlukan untuk menghapus atau mengembalikan perubahan ini, jalankan perintah SQL berikut untuk menghapus fungsi dari database:

```sql
DROP FUNCTION IF EXISTS get_active_customer_count();