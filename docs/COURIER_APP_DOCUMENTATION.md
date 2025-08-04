# Dokumentasi Aplikasi Kurir - Sistem Pengiriman

## 📋 Overview

Aplikasi Kurir adalah PWA (Progressive Web App) terpisah yang memungkinkan kurir mengakses dan mengelola daftar pengiriman mereka tanpa perlu login. Aplikasi ini dibangun dengan arsitektur yang aman menggunakan token-based authentication.

## 🏗️ Arsitektur Sistem

### Backend (Supabase)
- **Database**: PostgreSQL dengan RLS (Row Level Security)
- **Authentication**: Token-based untuk kurir (tanpa login tradisional)
- **Real-time**: Supabase Realtime untuk notifikasi admin ke kurir
- **API**: RPC (Remote Procedure Call) functions

### Frontend (PWA)
- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **PWA**: Service Worker + Web Manifest
- **Real-time**: Supabase Realtime client

## 🗄️ Struktur Database

### Tabel yang Dimodifikasi

#### `couriers`
```sql
-- Kolom baru yang ditambahkan:
secret_token TEXT UNIQUE          -- Token unik untuk akses tanpa login
token_generated_at TIMESTAMPTZ    -- Timestamp pembuatan token
```

#### Tabel Baru: `courier_daily_reports`
```sql
CREATE TABLE courier_daily_reports (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    courier_id BIGINT REFERENCES couriers(id),
    report_date DATE NOT NULL,
    summary_notes TEXT,
    total_cod_collected NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(courier_id, report_date)
);
```

### Trigger Auto-Generate Token
```sql
-- Fungsi untuk generate token otomatis
CREATE OR REPLACE FUNCTION set_courier_secret_token()
RETURNS TRIGGER AS $$
BEGIN
  NEW.secret_token := encode(gen_random_bytes(16), 'hex');
  NEW.token_generated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger yang dijalankan saat kurir baru dibuat
CREATE TRIGGER on_courier_created
BEFORE INSERT ON couriers
FOR EACH ROW
EXECUTE FUNCTION set_courier_secret_token();
```

## 🔧 RPC Functions

### 1. Admin Functions

#### `generate_courier_token(target_courier_id BIGINT)`
**Tujuan**: Me-refresh token kurir untuk keamanan
**Akses**: Authenticated users only
**Return**: JSON dengan token baru

```sql
-- Contoh penggunaan
SELECT generate_courier_token(1);
-- Return: {"success": true, "data": {"new_token": "abc123..."}}
```

#### `send_courier_alert(target_courier_id BIGINT, alert_message TEXT)`
**Tujuan**: Mengirim notifikasi real-time ke kurir
**Akses**: Authenticated users only
**Return**: JSON status

```sql
-- Contoh penggunaan
SELECT send_courier_alert(1, 'Alamat si A berubah ke Jl. Baru No. 123');
```

### 2. Public Functions (Kurir)

#### `get_deliveries_for_courier(courier_token TEXT)`
**Tujuan**: Mengambil daftar pengiriman hari ini dan besok
**Akses**: Anonymous (public)
**Return**: JSON array dengan detail pengiriman

```sql
-- Contoh return
{
  "success": true,
  "data": [
    {
      "order_id": 123,
      "delivery_status": "pending",
      "payment_method": "cod",
      "customer_name": "John Doe",
      "customer_phone": "081234567890",
      "customer_address": "Jl. Contoh No. 123",
      "delivery_date": "2024-01-15",
      "notes_for_courier": "Rumah cat hijau",
      "order_details": [
        {
          "product_name": "Paket Family",
          "quantity": 1,
          "notes": "Extra pedas"
        }
      ]
    }
  ]
}
```

#### `update_delivery_status(courier_token TEXT, target_order_id BIGINT, new_status TEXT)`
**Tujuan**: Mengubah status pengiriman (pending/completed)
**Akses**: Anonymous (public)
**Validasi**: Hanya kurir pemilik order yang bisa mengubah

#### `batch_update_today_deliveries(courier_token TEXT)`
**Tujuan**: Menandai semua pengiriman hari ini sebagai selesai
**Akses**: Anonymous (public)
**Return**: JSON dengan jumlah order yang diupdate

#### `submit_daily_report(courier_token TEXT, summary_notes TEXT, total_cod_collected NUMERIC)`
**Tujuan**: Menyimpan laporan harian kurir
**Akses**: Anonymous (public)

## 📱 Aplikasi Kurir (PWA)

### Struktur Folder
```
src/
├── components/
│   ├── DeliveryPage.tsx      # Halaman utama
│   ├── DeliveryListItem.tsx  # Item pengiriman
│   ├── DailyReportModal.tsx  # Modal laporan harian
│   └── AlertBanner.tsx       # Banner notifikasi
├── lib/
│   └── supabase.ts          # Konfigurasi & API client
└── App.tsx
```

### Fitur Utama

#### 1. **Akses Tanpa Login**
- URL format: `http://localhost:5174/delivery/{secret_token}`
- Token divalidasi di backend untuk keamanan

#### 2. **Daftar Pengiriman Mobile-First**
- **Collapsed View**: Nama customer, tag COD, nomor order
- **Expanded View**: Detail pesanan, alamat, catatan, tombol aksi
- **Checkbox Besar**: Mudah disentuh dengan jempol
- **Animasi Smooth**: Fade-out saat item diselesaikan

#### 3. **Tombol Aksi**
- **WhatsApp**: Pesan otomatis "Paket sedang dalam perjalanan"
- **WhatsApp Alt**: Pesan "Apakah Anda sedang di lokasi?"
- **Google Maps**: Buka alamat di Google Maps

#### 4. **Batch Operations**
- Tombol "Selesaikan Semua Hari Ini" di bagian atas
- Otomatis memunculkan modal laporan saat semua selesai

#### 5. **Modal Laporan Harian**
- Input ringkasan opsional (misal: "Pengantaran si A terlambat karena hujan")
- Input total dana COD (wajib jika ada pengiriman COD)
- Validasi dan error handling

#### 6. **Notifikasi Real-time**
- Banner alert di bagian atas saat ada pesan dari admin
- Auto-hide setelah 10 detik
- Channel unik per kurir: `courier-{secret_token}`

#### 7. **PWA Features**
- Installable di mobile device
- Service Worker untuk caching
- Offline-ready (basic functionality)
- Mobile-optimized UI/UX

## 🔐 Keamanan

### 1. **Token-Based Security**
- Token 32-karakter hex (16 bytes random)
- Unique per kurir
- Dapat di-refresh oleh admin
- Tidak ada data sensitif di URL

### 2. **RLS Bypass yang Aman**
- RPC functions menggunakan `SECURITY DEFINER`
- Validasi token di setiap function
- Validasi kepemilikan order sebelum update
- Input sanitization dan validation

### 3. **Realtime Channel Security**
- Channel name berdasarkan secret token
- Hanya kurir dengan token valid yang bisa subscribe
- Pesan broadcast hanya dari admin authenticated

## 🚀 Deployment & Usage

### 1. **Setup Backend**
Semua migrasi dan RPC sudah diterapkan ke Supabase production.

### 2. **Setup Frontend**
```bash
npm install
npm run build
npm run preview  # atau deploy ke hosting
```

### 3. **Generate URL Kurir**
```sql
-- Di admin panel, panggil RPC untuk generate/refresh token
SELECT generate_courier_token(courier_id);

-- Berikan URL ke kurir:
-- https://your-domain.com/delivery/{token_dari_response}
```

### 4. **Monitoring**
- Cek tabel `courier_daily_reports` untuk laporan harian
- Monitor Supabase Realtime untuk aktivitas channel
- Log RPC calls untuk debugging

## 📊 Data Flow

### 1. **Load Pengiriman**
```
Kurir buka URL → Extract token → RPC get_deliveries_for_courier → 
Tampilkan list → Subscribe realtime channel
```

### 2. **Update Status**
```
Kurir centang checkbox → RPC update_delivery_status → 
Update UI → Cek jika semua selesai → Show modal laporan
```

### 3. **Batch Complete**
```
Kurir klik "Selesaikan Semua" → RPC batch_update_today_deliveries → 
Update semua status → Show modal laporan
```

### 4. **Submit Laporan**
```
Kurir isi modal → RPC submit_daily_report → 
Simpan ke database → Close modal → Show success
```

### 5. **Receive Alert**
```
Admin kirim alert → RPC send_courier_alert → 
Realtime broadcast → Kurir terima → Show banner
```

## 🔧 Maintenance

### 1. **Token Management**
- Token tidak expire otomatis
- Refresh manual via admin jika diperlukan
- Monitor `token_generated_at` untuk audit

### 2. **Database Cleanup**
- `courier_daily_reports` bisa di-archive bulanan
- Monitor ukuran tabel untuk performance

### 3. **Realtime Monitoring**
- Cek Supabase dashboard untuk connection count
- Monitor channel activity

## 🐛 Troubleshooting

### 1. **Token Invalid**
- Cek apakah token ada di database
- Generate token baru jika diperlukan
- Pastikan URL format benar

### 2. **Realtime Tidak Berfungsi**
- Cek Supabase Realtime status
- Verify channel name format
- Check browser console untuk errors

### 3. **RPC Errors**
- Cek Supabase logs
- Verify parameter types
- Check RLS policies (meskipun bypass dengan SECURITY DEFINER)

## 📈 Future Enhancements

1. **Push Notifications** untuk alert yang lebih reliable
2. **Offline Sync** untuk area dengan koneksi buruk
3. **GPS Tracking** untuk monitoring real-time lokasi kurir
4. **Photo Upload** untuk bukti pengiriman
5. **Rating System** dari customer
6. **Analytics Dashboard** untuk performance kurir

---

**Dokumentasi ini dibuat pada**: 3 Agustus 2025
**Versi**: 1.0
**Status**: Production Ready ✅