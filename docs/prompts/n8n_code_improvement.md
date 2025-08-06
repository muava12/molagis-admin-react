# Dokumentasi Perbaikan Kode N8N: Ekstraksi Data Paket

## 1. Konteks dan Tujuan

Dokumen ini bertujuan untuk menganalisis dan memberikan rekomendasi perbaikan untuk kode *Code Node* di N8N. Tujuannya adalah untuk mengekstrak data dari tabel `paket` Supabase secara andal dan mengubahnya menjadi format JSON sederhana yang berisi `id`, `nama_paket`, dan `harga`.

Berdasarkan pemeriksaan struktur tabel `paket` di Supabase, kolom yang relevan adalah:
- `id` (integer)
- `nama` (text)
- `harga_jual` (numeric) -> **Ini adalah harga yang harus direturn untuk pelanggan.**

## 2. Kode Awal (Sebelum Perbaikan)

```javascript
// N8N Code Node - Extract Package Data to Simple JSON
// Mengubah input data menjadi JSON sederhana dengan id, nama_paket, dan harga

// Ambil data dari input node sebelumnya
const inputData = $input.all();

// Array untuk menyimpan hasil
const results = [];

// Loop melalui setiap item input
for (let i = 0; i < inputData.length; i++) {
  const item = inputData[i];
  const data = item.json;
  
  // Ekstrak data yang diperlukan
  // Sesuaikan field names dengan struktur data Anda
  const extractedData = {
    id: data.id || i + 1, // Fallback ke index jika tidak ada id
    nama_paket: data.nama || 'Unknown Package',
    harga: data.harga_jual || 0
  };
  
  // Bersihkan harga jika berupa string (hapus karakter non-numerik)
  if (typeof extractedData.harga === 'string') {
    extractedData.harga = parseInt(extractedData.harga.replace(/[^\d]/g, '')) || 0;
  }
  
  results.push(extractedData);
}

// Return hasil sebagai array JSON
return results.map(item => ({ json: item }));
```

### Analisis Kelemahan Kode Awal

1.  **Terlalu Banyak Fallback yang Tidak Perlu:** Kode mencoba menebak nama kolom (`data.ID`, `data._id`, `data.package_name`, `data.title`, `data.price`, `data.cost`). Ini membuat kode tidak robust dan rentan error jika struktur data sumber berubah. Karena kita tahu sumber datanya adalah tabel `paket`, kita bisa menggunakan nama kolom yang pasti.
2.  **Penggunaan Harga yang Salah:** Kode menggunakan `harga_modal` sebagai salah satu opsi. Untuk konteks penjualan ke pelanggan, **`harga_jual` adalah kolom yang benar untuk digunakan.**
3.  **Pembersihan Harga yang Tidak Perlu:** Kode memiliki logika untuk membersihkan harga dari karakter non-numerik. Karena data harga dari Supabase sudah dalam format `numeric`, langkah ini tidak diperlukan dan bisa menyebabkan masalah jika harga mengandung desimal.
4.  **Kurang Efisien:** Menggunakan `for` loop dan `push` bisa disederhanakan dengan metode fungsional seperti `map` untuk kode yang lebih bersih dan modern.

## 3. Kode yang Disarankan (Revisi untuk Output String)

Kode berikut telah dimodifikasi untuk menghasilkan satu variabel string tunggal yang berisi semua data paket, sesuai untuk kebutuhan form.

```javascript
// N8N Code Node - Extract Package Data to Formatted String (v3)
// Mengubah input dari tabel 'paket' menjadi satu variabel string untuk form.

// Ambil data dari input node sebelumnya dan transformasikan
const results = $input.all().map(item => {
  const data = item.json;
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    nama_paket: data.nama,
    harga: data.harga_jual || 0
  };
}).filter(item => item !== null);

// Format hasil menjadi satu string tunggal, dipisahkan oleh newline
const outputString = results.map(pkg => {
  return `ID: ${pkg.id}, Nama Paket: ${pkg.nama_paket}, Harga: ${pkg.harga}`;
}).join('\n');

// Return hasil sebagai satu item JSON dengan key 'formString'
return [{ 
  json: {
    formString: outputString
  }
}];
```

### Penjelasan Kode Baru

1.  **Ekstraksi Data:** Bagian pertama kode tetap sama, yaitu mengekstrak dan membersihkan data dari input menjadi array objek (`results`).
2.  **Transformasi ke String:** Array `results` kemudian di-`map` lagi. Setiap objek diubah menjadi format string yang mudah dibaca, contoh: `ID: 1, Nama Paket: Single, Harga: 50000`.
3.  **Penggabungan:** Metode `.join('\n')` menggabungkan semua string tersebut menjadi satu blok teks tunggal, dengan setiap entri berada di baris baru.
4.  **Struktur Output:** Hasil akhir dikembalikan sebagai satu item dalam array, dengan objek JSON yang memiliki satu kunci, `formString`, yang berisi seluruh data sebagai string.

## 4. Kesimpulan

Dengan mengadopsi kode yang disarankan, output dari node N8N ini menjadi sebuah variabel string tunggal yang siap pakai untuk diisi ke dalam field form atau dikirim sebagai konteks dalam satu blok teks.