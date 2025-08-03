# Analisis RPC untuk Dashboard

Dokumen ini menganalisis Remote Procedure Calls (RPC) yang tersedia di Supabase untuk menentukan mana yang paling cocok untuk ditampilkan di dashboard utama.

## Daftar RPC Kandidat

Berikut adalah daftar RPC yang paling relevan untuk kebutuhan dashboard, diurutkan berdasarkan potensi kegunaan:

1.  **`get_financial_overview`**
    *   **Deskripsi**: Tampaknya memberikan ringkasan finansial lengkap, termasuk pendapatan, HPP, laba kotor, dan laba bersih.
    *   **Analisis**: Ini adalah kandidat utama. Data yang dikembalikan sangat ideal untuk memberikan gambaran umum kesehatan finansial perusahaan kepada pemilik.
    *   **Status**: **Direkomendasikan**.

2.  **`get_weekly_metrics`**
    *   **Deskripsi**: Kemungkinan memberikan metrik kunci dalam rentang waktu mingguan.
    *   **Analisis**: Sangat berguna untuk melacak kinerja dari minggu ke minggu. Bisa menjadi sumber data untuk grafik tren atau perbandingan mingguan.
    *   **Status**: Kandidat sekunder yang baik, bisa digabungkan dengan `get_financial_overview`.

3.  **`get_report_summary`**
    *   **Deskripsi**: Nama yang umum, bisa berisi ringkasan dari berbagai laporan.
    *   **Analisis**: Perlu diselidiki lebih lanjut untuk mengetahui data spesifik apa yang dikembalikan. Bisa jadi alternatif atau pelengkap untuk `get_financial_overview`.
    *   **Status**: Perlu investigasi.

4.  **`get_customer_crm_stats`**
    *   **Deskripsi**: Fokus pada statistik pelanggan dari CRM.
    *   **Analisis**: Berguna untuk menampilkan metrik seperti jumlah pelanggan baru, pelanggan aktif, atau tingkat retensi. Bisa menjadi bagian dari dashboard, tetapi mungkin tidak sepenting data finansial.
    *   **Status**: Berguna untuk bagian CRM di dashboard.

5.  **`get_outstanding_revenue`**
    *   **Deskripsi**: Sepertinya mengembalikan pendapatan yang belum dibayar atau tertunda.
    *   **Analisis**: Metrik penting untuk manajemen arus kas. Bisa ditampilkan sebagai "Piutang" atau "Pendapatan Tertunda" di dashboard.
    *   **Status**: Metrik pendukung yang penting.

## Rekomendasi

Berdasarkan analisis awal, saya merekomendasikan untuk fokus pada **`get_financial_overview`** sebagai sumber data utama untuk kartu metrik di dashboard.

RPC lain seperti `get_weekly_metrics` dan `get_customer_crm_stats` dapat digunakan di masa depan untuk memperkaya dashboard dengan grafik tren dan statistik pelanggan.