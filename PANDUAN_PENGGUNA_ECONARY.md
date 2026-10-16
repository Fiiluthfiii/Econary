# 📘 Panduan Lengkap Penggunaan Sistem Econary

## Selamat Datang di Econary!
**Econary** adalah sistem manajemen keuangan personal yang dirancang khusus untuk **mahasiswa** dan **freelancer** untuk mencatat, mengelola, dan menganalisis keuangan pribadi secara terstruktur dan profesional.

---

## 📋 Daftar Isi
1. [Memulai - Registrasi & Login](#1-memulai---registrasi--login)
2. [Dashboard Keuangan](#2-dashboard-keuangan)
3. [Mengelola Dompet & Sumber Dana](#3-mengelola-dompet--sumber-dana)
4. [Mencatat Transaksi](#4-mencatat-transaksi)
5. [Mengelola Kategori](#5-mengelola-kategori)
6. [Perencanaan Anggaran (Budget)](#6-perencanaan-anggaran-budget)
7. [Target Tabungan](#7-target-tabungan)
8. [Financial Alternate Universe](#8-financial-alternate-universe)
9. [Laporan Keuangan](#9-laporan-keuangan)
10. [Pengaturan Akun](#10-pengaturan-akun)
11. [Tips & Best Practices](#11-tips--best-practices)

---

## 1. Memulai - Registrasi & Login

### 1.1 Registrasi Akun Baru
1. Buka aplikasi Econary di browser: `http://localhost:3000`
2. Klik tombol **"Daftar"** atau **"Register"** di halaman utama
3. Isi formulir registrasi:
   - **Nama Lengkap**: Masukkan nama Anda
   - **Email**: Gunakan email aktif yang valid
   - **Password**: Buat password minimal 6 karakter
   - **Konfirmasi Password**: Ketik ulang password yang sama
4. Klik tombol **"Daftar"** untuk membuat akun
5. Anda akan otomatis diarahkan ke halaman login

### 1.2 Login ke Sistem
1. Masukkan **Email** dan **Password** yang telah didaftarkan
2. Klik tombol **"Masuk"** atau **"Login"**
3. Anda akan diarahkan ke **Dashboard Keuangan**

---

## 2. Dashboard Keuangan

Dashboard adalah pusat kontrol keuangan Anda yang menampilkan ringkasan lengkap kondisi finansial.

### 2.1 Informasi yang Ditampilkan

**Ringkasan Kartu Statistik:**
- 💰 **Saldo Saat Ini**: Total saldo dari semua dompet
- 📥 **Total Pemasukan**: Jumlah pemasukan bulan ini
- 📤 **Total Pengeluaran**: Jumlah pengeluaran bulan ini
- 📊 **Rasio Tabungan**: Persentase tabungan dari pendapatan

**Grafik Arus Kas 6 Bulan:**
- Menampilkan tren pemasukan dan pengeluaran 6 bulan terakhir
- Membantu melihat pola keuangan dalam jangka menengah

**Kategori Pengeluaran (Donut Chart):**
- Distribusi pengeluaran berdasarkan kategori
- Membantu identifikasi pos pengeluaran terbesar

**Riwayat Transaksi Terbaru:**
- 5 transaksi terakhir yang tercatat
- Akses cepat untuk melihat aktivitas keuangan

**Banner Alternate Universe:**
- Simulasi proyeksi keuangan jika melakukan penghematan
- Menampilkan potensi tabungan dalam 6 bulan

### 2.2 Aksi Cepat dari Dashboard
- 🔘 **Tambah Transaksi**: Tombol hijau di kanan atas
- 📄 **Unduh Laporan**: Ekspor laporan keuangan
- ✨ **Buka Simulasi Universe**: Akses fitur prediksi keuangan

---

## 3. Mengelola Dompet & Sumber Dana

Dompet adalah wadah untuk menyimpan saldo dari berbagai sumber seperti rekening bank, e-wallet, kartu kredit, atau kas tunai.

### 3.1 Menambah Dompet Baru

**Langkah-langkah:**
1. Klik menu **"Dompet"** di sidebar kiri
2. Klik tombol **"Tambah Sumber Dana Baru"** (warna hijau)
3. Isi formulir dompet:
   - **Nama Dompet**: Contoh: "BCA Tabungan", "OVO", "Kas Tunai"
   - **Jenis Dompet**: Pilih salah satu:
     - 🏦 Bank (rekening tabungan/giro)
     - 📱 E-Wallet (OVO, GoPay, DANA, ShopeePay)
     - 💵 Cash (uang tunai)
     - 💳 Credit (kartu kredit)
     - 📦 Other (lainnya)
   - **Saldo Awal**: Masukkan saldo saat ini (gunakan angka tanpa titik/koma)
   - **Deskripsi**: (Opsional) Catatan tambahan
4. Klik tombol **"Simpan"**

**Contoh Pengisian:**
```
Nama: BCA Tabungan Utama
Jenis: Bank
Saldo Awal: 5000000
Deskripsi: Rekening untuk gaji freelance dan pengeluaran rutin
```

### 3.2 Mengedit Dompet
1. Di halaman Dompet, klik ikon **edit (pensil)** pada kartu dompet yang ingin diubah
2. Ubah informasi yang diperlukan
3. Klik **"Simpan Perubahan"**

### 3.3 Menghapus Dompet
1. Klik ikon **hapus (tempat sampah)** pada kartu dompet
2. Konfirmasi penghapusan
3. ⚠️ **PERHATIAN**: Menghapus dompet akan menghapus semua transaksi terkait

### 3.4 Transfer Antar Dompet
Fitur transfer memungkinkan Anda memindahkan saldo antar dompet:
1. Pergi ke halaman **"Riwayat Transaksi"**
2. Pilih jenis transaksi **"Transfer"**
3. Pilih dompet asal dan tujuan
4. Masukkan nominal transfer
5. Simpan transaksi

**Ringkasan Statistik Dompet:**
- **Total Saldo Terkonsolidasi**: Gabungan semua dompet
- **Likuiditas Kas & E-Wallet**: Total dompet likuid (mudah diakses)
- **Rekening Bank & Simpanan**: Total saldo di bank

---

## 4. Mencatat Transaksi

Transaksi adalah inti dari sistem Econary. Setiap pemasukan dan pengeluaran harus dicatat untuk tracking yang akurat.

### 4.1 Menambah Transaksi Baru

**Akses Halaman Transaksi:**
- Klik menu **"Riwayat Transaksi"** di sidebar
- ATAU klik tombol **"Tambah Transaksi"** di mana saja

**Langkah-langkah Pencatatan:**

#### Step 1: Pilih Jenis Transaksi
Pilih salah satu:
- 📤 **Pengeluaran**: Uang keluar (belanja, bayar tagihan, dll)
- 📥 **Pemasukan**: Uang masuk (gaji, freelance, kiriman orang tua)
- 🔄 **Transfer**: Pindah saldo antar dompet

#### Step 2: Masukkan Nominal
- Ketik nominal transaksi
- Gunakan tombol cepat (+20rb, +50rb, +100rb, dll) untuk menambah nilai
- Format otomatis menjadi format Rupiah

**Contoh:** `75000` → `Rp 75.000`

#### Step 3: Pilih Kategori
- Pilih kategori yang sesuai dengan jenis transaksi
- Kategori muncul sesuai jenis (pengeluaran/pemasukan)
- **Contoh Kategori Pengeluaran**: Makanan, Transport, Pendidikan, Hiburan
- **Contoh Kategori Pemasukan**: Gaji, Freelance, Bonus, Kiriman Orang Tua

⚠️ **Jika kategori belum ada**: 
- Buka menu **"Perencanaan Anggaran"** terlebih dahulu
- Buat kategori baru di sana

#### Step 4: Pilih Waktu Transaksi
- Default: Waktu saat ini
- Bisa diubah jika ingin mencatat transaksi masa lalu
- Klik **"Setel Sekarang"** untuk kembali ke waktu saat ini

#### Step 5: Pilih Metode Pembayaran (Dompet)
- Pilih dompet yang digunakan untuk transaksi
- Dropdown menampilkan nama dompet dan saldo saat ini
- **Contoh**: "BCA Tabungan (Rp 5.000.000)"

#### Step 6: Tambahkan Keterangan
- Isi keterangan detail transaksi
- **Contoh**: "Makan siang warteg + es teh manis"
- Membantu untuk tracking dan review nantinya

#### Step 7: (Opsional) Lampiran Bukti
- Upload foto struk/nota
- Format: JPG, PNG, PDF (Maks 5MB)
- Klik area upload atau drag & drop file

#### Step 8: Simpan
- Klik tombol **"Simpan ke PostgreSQL"**
- Transaksi akan langsung tersimpan ke database
- Saldo dompet otomatis terupdate

### 4.2 Contoh Kasus Pencatatan

**Contoh 1: Pengeluaran Makan**
```
Jenis: Pengeluaran
Nominal: Rp 35.000
Kategori: Makanan
Waktu: 16/10/2026 12:30
Dompet: OVO
Keterangan: Makan siang nasi goreng + teh manis
```

**Contoh 2: Pemasukan Freelance**
```
Jenis: Pemasukan
Nominal: Rp 2.500.000
Kategori: Freelance
Waktu: 16/10/2026 14:00
Dompet: BCA Tabungan
Keterangan: Payment project website PT ABC
✓ Tagihan Klien Freelance (dicentang)
```

**Contoh 3: Transfer Dompet**
```
Jenis: Transfer
Nominal: Rp 500.000
Dompet Asal: BCA Tabungan
Dompet Tujuan: OVO
Waktu: 16/10/2026 10:00
Keterangan: Top up OVO untuk kebutuhan harian
```

### 4.3 Informasi Panel Samping

Saat mengisi transaksi, panel kanan menampilkan:

**Pratinjau Dampak Saldo:**
- Saldo dompet saat ini
- Perubahan akibat transaksi
- Proyeksi saldo akhir
- Total akumulasi seluruh dompet

**Alokasi Budget Kategori:**
- Pemakaian budget bulan ini untuk kategori terpilih
- Persentase terpakai
- Sisa budget tersedia
- Peringatan jika mendekati/melampaui budget

**Dampak Alternate Universe:**
- Perbandingan skenario nyata vs alternatif
- Simulasi jika uang diinvestasikan

**Draf Cepat Terakhir:**
- 3 transaksi terakhir untuk referensi

---

## 5. Mengelola Kategori

Kategori membantu mengorganisir transaksi berdasarkan jenis pengeluaran atau pemasukan.

### 5.1 Kategori Bawaan Sistem

Econary menggunakan standar **SKPL FR-09** dengan kategori:

**Kategori Pengeluaran:**
- 🍽️ Makanan & Minuman
- 🚗 Transportasi
- 📚 Pendidikan
- 🎮 Hiburan
- 🛍️ Belanja
- 💊 Kesehatan
- ⚡ Utilitas (listrik, air, internet)

**Kategori Pemasukan:**
- 💰 Gaji
- 💼 Freelance
- 🎁 Bonus
- 👨‍👩‍👧 Kiriman Orang Tua

### 5.2 Menambah Kategori Kustom

**Langkah-langkah:**
1. Klik menu **"Kategori"** di sidebar
2. Klik tombol **"Tambah Kategori / Sub-Pos"**
3. Isi formulir:
   - **Nama Kategori**: Nama unik dan jelas
   - **Jenis**: Pengeluaran atau Pemasukan
   - **Ikon**: Pilih emoji atau simbol (opsional)
   - **Warna**: Pilih warna untuk identifikasi visual
   - **Deskripsi**: Penjelasan singkat
4. Klik **"Simpan"**

**Contoh Kategori Kustom:**
```
Nama: Buku & Jurnal Akademik
Jenis: Pengeluaran
Ikon: 📖
Warna: Biru
Deskripsi: Pembelian buku, jurnal, dan referensi kuliah
```

### 5.3 Mengedit Kategori
1. Klik ikon **pensil** pada kartu kategori
2. Ubah informasi yang diperlukan
3. Klik **"Simpan Perubahan"**

### 5.4 Menghapus Kategori
1. Klik ikon **tempat sampah** pada kartu kategori
2. Konfirmasi penghapusan
3. ⚠️ **Kategori standar SKPL tidak bisa dihapus**

### 5.5 Statistik Kategori

Halaman kategori menampilkan:
- **Total Kategori Utama**: Jumlah kategori aktif
- **Transaksi Bulan Ini**: Total transaksi semua kategori
- **Frekuensi Tertinggi**: Kategori paling sering digunakan
- **Porsi dari Total**: Persentase setiap kategori

---

## 6. Perencanaan Anggaran (Budget)

Budget membantu Anda membatasi pengeluaran per kategori setiap bulan untuk mengontrol keuangan.

### 6.1 Membuat Budget Baru

**Langkah-langkah:**
1. Klik menu **"Perencanaan Anggaran"** di sidebar
2. Klik tombol **"Atur Pos Anggaran Baru"**
3. Isi formulir budget:
   - **Kategori**: Pilih kategori yang akan dibuatkan budget
   - **Nominal Budget**: Masukkan batas maksimal pengeluaran
   - **Bulan & Tahun**: Pilih periode budget (default: bulan berjalan)
   - **Catatan**: (Opsional) Catatan pengingat
4. Klik **"Simpan Budget"**

**Contoh Budget:**
```
Kategori: Makanan & Minuman
Nominal: Rp 1.500.000
Periode: Oktober 2026
Catatan: Termasuk makan siang dan kopi di kampus
```

### 6.2 Ringkasan Budget

Dashboard Budget menampilkan:

**Kartu Statistik:**
- 💰 **Pagu Anggaran Total**: Total semua budget
- ✨ **Total Realisasi Terpakai**: Jumlah yang sudah digunakan
- ✅ **Sisa Anggaran Aman**: Budget yang tersisa

**Informasi Per Kategori:**
- Nama kategori dan budget
- Total terpakai dari budget
- Persentase pemakaian
- Progress bar visual
- Status: Hemat / Aman / Perhatian / Mendekati Batas
- Batas harian aman tersisa

### 6.3 Status Budget

Budget dikategorikan berdasarkan persentase pemakaian:

| Status | Persentase | Warna | Arti |
|--------|-----------|-------|------|
| 🟢 Hemat | < 50% | Hijau | Pengeluaran masih rendah |
| 🟢 Aman | 50-70% | Hijau Muda | Pengeluaran normal |
| 🟡 Perhatian | 70-85% | Kuning | Mulai waspada |
| 🔴 Mendekati Batas | > 85% | Merah | Segera kurangi pengeluaran |

### 6.4 Rekomendasi Penghematan

Panel "Aturan Budget Persona" memberikan saran:
- Kategori yang perlu dihemat
- Prediksi overbudget
- Tips penghematan spesifik untuk mahasiswa/freelancer

### 6.5 Fitur Tambahan

**Salin dari Bulan Lalu:**
- Duplikat budget bulan sebelumnya
- Hemat waktu untuk budget rutin

**Tips Penghematan Pekan Terakhir:**
- Muncul saat mendekati akhir bulan
- Saran praktis mengurangi pengeluaran

---

## 7. Target Tabungan

Fitur untuk menetapkan dan melacak tujuan finansial jangka menengah hingga panjang.

### 7.1 Membuat Target Tabungan Baru

**Langkah-langkah:**
1. Klik menu **"Target Tabungan"** di sidebar
2. Klik tombol **"Buat Target Baru"**
3. Isi formulir target:
   - **Nama Target**: Tujuan tabungan yang jelas
   - **Target Nominal**: Jumlah uang yang ingin dicapai
   - **Tanggal Target**: Deadline pencapaian
   - **Deskripsi**: Detail dan motivasi
   - **Kategori**: (Opsional) Jenis target
4. Klik **"Buat Target"**

**Contoh Target:**
```
Nama: Dana Darurat 6 Bulan
Target: Rp 18.000.000
Tanggal: 30 Juni 2027
Deskripsi: Dana darurat untuk cover pengeluaran 6 bulan jika tidak ada income
Kategori: Emergency Fund
```

**Contoh Target Lain:**
- Beli Laptop Baru (Rp 12.000.000)
- Liburan Akhir Tahun (Rp 5.000.000)
- Bayar UKT Semester Depan (Rp 7.500.000)
- Modal Usaha Sampingan (Rp 10.000.000)

### 7.2 Menyetor ke Target Tabungan

**Cara Setor Manual:**
1. Di halaman Target Tabungan, klik tombol **"Setor"** pada kartu target
2. Masukkan nominal setoran
3. Pilih dompet sumber dana
4. Tambahkan catatan (opsional)
5. Klik **"Simpan Setoran"**

**Cara Setor Otomatis:**
- Bisa diatur auto-debit bulanan dari pemasukan
- Persentase tetap dari setiap pemasukan

### 7.3 Informasi Kartu Target

Setiap kartu target menampilkan:
- **Nama dan Deskripsi Target**
- **Progress Bar**: Visual pencapaian
- **Persentase Tercapai**: Contoh: 45% tercapai
- **Jumlah Terkumpul**: Contoh: Rp 8.100.000 dari Rp 18.000.000
- **Sisa Kebutuhan**: Contoh: Perlu Rp 9.900.000 lagi
- **Tanggal Target**: Contoh: Target 30 Jun 2027
- **Waktu Tersisa**: Contoh: 8 bulan lagi
- **Alokasi Bulanan Ideal**: Rp yang harus disisihkan per bulan

### 7.4 Ringkasan Kesehatan Likuiditas

Panel "Kekuatan Likuiditas" menampilkan:
- **Dana Darurat**: Berapa bulan pengeluaran bisa dicover
- **Status**: Aman / Cukup / Kurang / Kritis
- **Rekomendasi**: Minimal 3-6 bulan untuk freelancer

### 7.5 Simulator Tabungan Fleksibel

Fitur interaktif untuk:
- Simulasi menambah setoran bulanan
- Melihat dampak penghematan pos lain
- Proyeksi percepatan pencapaian target
- Slider untuk adjust nominal simulasi

### 7.6 Histori Setoran

Melihat riwayat kontribusi ke target:
- Tanggal setoran
- Nominal
- Dompet sumber
- Catatan

---

## 8. Financial Alternate Universe

Fitur unik Econary untuk simulasi keputusan finansial tanpa risiko di dunia nyata.

### 8.1 Apa itu Alternate Universe?

**Financial Alternate Universe (AU)** adalah:
- Simulasi prediktif berbasis data keuangan real Anda
- Membantu melihat dampak keputusan finansial alternatif
- Membandingkan skenario nyata vs skenario optimal
- Proyeksi 6-24 bulan ke depan

**Manfaat:**
- Lihat "what if" tanpa risiko
- Motivasi untuk penghematan
- Identifikasi potensi tabungan tersembunyi
- Analisis efisiensi pengeluaran

### 8.2 Parameter Modifikasi

**A. Pangkas Hiburan & Belanja (Lifestyle Reduction)**
- Slider: 0% - 50%
- Simulasi pengurangan pengeluaran konsumtif
- **Contoh**: 30% = kurangi kopi dan nongkrong 30%

**B. Tambah Alokasi Investasi**
- Input nominal bulanan
- Simulasi rutin investasi/tabungan
- **Contoh**: Rp 1.500.000/bulan ke deposito atau reksadana

**C. Skenario Freelancer & Mahasiswa**
- Toggle persona spesifik
- Adjustment untuk gaya hidup freelancer
- Pertimbangan pengeluaran akademik mahasiswa

### 8.3 Cara Menggunakan

**Langkah-langkah:**
1. Klik menu **"Alternate Universe"** di sidebar
2. Atur parameter simulasi:
   - Geser slider **Pangkas Hiburan & Belanja**
   - Sesuaikan **Tambah Alokasi Investasi**
   - Aktifkan/nonaktifkan **Skenario Freelancer** dan **Mahasiswa**
3. Lihat hasil simulasi di:
   - **Grafik Proyeksi Garis Masa Depan** (Chart)
   - **Perbandingan Universe Utama vs AU #A**
   - **Proyeksi Tabungan 6 Bulan**
4. Jika cocok, klik **"Terapkan Rekomendasi ke Rencana Nyata"**

### 8.4 Interpretasi Hasil

**Universe Utama (Skenario Nyata):**
- Kondisi saat ini dengan pola pengeluaran existing
- **Contoh**: Saldo 6 bulan = Rp 0

**Alternate Universe #A (Skenario Optimasi):**
- Kondisi jika parameter AU diterapkan
- **Contoh**: Saldo 6 bulan = Rp 18.000.000

**Delta/Selisih:**
- Potensi tabungan tambahan
- **Contoh**: +Rp 18.000.000 lebih baik

### 8.5 Kartu Strategi Optimasi Aset

Rekomendasi spesifik berdasarkan data Anda:
1. **Batasi Pengeluaran Hiburan & Makan**
   - Hemat berdasarkan transaksi historis
   - Saran konkret: misal "kurangi Rp 450.000/bulan"
   
2. **Audit Langganan & Subscription**
   - Review Netflix, Spotify, dll
   - Cut yang jarang digunakan
   
3. **Auto-Split Pemasukan ke Tabungan**
   - Otomatis sisihkan % dari income
   - Build dana darurat lebih cepat

### 8.6 Probabilitas Risiko & Ketahanan

Panel menampilkan:
- **Peluang Overbudget**: Probabilitas melebihi budget
- **Peluah Dana Darurat Cukup**: Kemampuan survive tanpa income
- **Strategi Optimisasi Aset**: Saran portfolio keuangan

---

## 9. Laporan Keuangan

Fitur untuk mengunduh dan menganalisis laporan keuangan dalam berbagai periode.

### 9.1 Jenis Laporan

**A. Laporan Mingguan**
- Data transaksi 7 hari terakhir
- Cocok untuk review harian

**B. Laporan Bulanan**
- Data transaksi bulan berjalan
- Paling sering digunakan

**C. Laporan Tahunan**
- Data transaksi 1 tahun penuh
- Untuk analisis long-term

### 9.2 Cara Mengunduh Laporan

**Langkah-langkah:**
1. Klik menu **"Reports"** atau dari Dashboard klik **"Unduh Laporan"**
2. Pilih periode: Mingguan / Bulanan / Tahunan
3. Review data:
   - Total Pemasukan
   - Total Pengeluaran
   - Grafik Tren
   - Distribusi Pengeluaran per Kategori
   - Perbandingan Bulan Ini vs Bulan Lalu
4. Klik tombol **"Export Laporan"**
5. Pilih format:
   - **PDF**: Untuk print atau dokumen formal
   - **Excel/CSV**: Untuk analisis lebih lanjut
6. File akan terunduh otomatis

### 9.3 Isi Laporan PDF

Laporan PDF berisi:
- **Header**: Nama, periode, tanggal generate
- **Ringkasan Eksekutif**: Overview keuangan
- **Grafik Arus Kas**: Visual pemasukan vs pengeluaran
- **Distribusi Pengeluaran**: Pie chart per kategori
- **Tabel Transaksi**: Detail semua transaksi
- **Analisis Perbandingan**: Bulan ini vs bulan lalu
- **Statistik Tambahan**:
  - Rata-rata pengeluaran harian
  - Transaksi terbesar
  - Efisiensi belanja
  - Rekomendasi

### 9.4 Analisis Perbandingan

**Bulan Ini vs Bulan Lalu:**
- **Total Pemasukan**: +/- persentase
- **Total Pengeluaran**: +/- persentase
- **Selisih Tabungan**: Lebih baik/buruk dari bulan lalu
- **Interpretasi**: Status kesehatan finansial

**Metrik Tambahan:**
- **Rata-rata Harian**: Total pengeluaran / hari
- **Transaksi Terbesar**: Single transaction tertinggi
- **Efisiensi Belanja**: 
  - HEMAT: Pengeluaran turun
  - BOROS: Pengeluaran naik signifikan

### 9.5 Tips Menggunakan Laporan

1. **Review Bulanan Rutin**: Setiap akhir bulan
2. **Identifikasi Pola**: Cari pengeluaran yang konsisten tinggi
3. **Bandingkan Tren**: Apakah meningkat/menurun
4. **Set Goal Bulan Depan**: Berdasarkan insight laporan
5. **Simpan Arsip**: Untuk tracking long-term (tahunan)

---

## 10. Pengaturan Akun

Kelola profil, keamanan, dan preferensi sistem.

### 10.1 Profil Personal & Persona Finansial

**Mengedit Profil:**
1. Klik menu **"Pengaturan Akun"** di sidebar
2. Tab **"Profil Personal"**
3. Edit field:
   - **Nama Lengkap**
   - **Email Utama**
   - **Nomor Telepon / WhatsApp**
   - **Mata Uang Utama**: IDR / USD / EUR / dll
   - **Format Tanggal**: DD/MM/YYYY atau MM/DD/YYYY
4. Klik **"Simpan Profil"**

**Upload Foto Profil:**
1. Klik area foto profil
2. Pilih gambar dari komputer
3. Crop jika perlu
4. Klik **"Upload"**

### 10.2 Keamanan & Password

**Mengganti Password:**
1. Tab **"Keamanan"**
2. Isi formulir:
   - **Password Lama**: Password saat ini
   - **Password Baru**: Password baru minimal 6 karakter
   - **Konfirmasi Password Baru**: Ketik ulang password baru
3. Klik **"Simpan Perubahan"**

**Tips Password Aman:**
- Minimal 8 karakter
- Kombinasi huruf besar, kecil, angka, simbol
- Jangan gunakan tanggal lahir atau nama
- Ganti berkala (3-6 bulan sekali)

### 10.3 Preferensi Notifikasi

Atur notifikasi yang ingin diterima:

- ✅ **Peringatan Anggaran Kritis**: Notif saat budget >70%
- ✅ **Prompt Catat Transaksi Harian**: Reminder harian
- ✅ **Laporan Mingguan via Email**: Ringkasan mingguan
- ✅ **Insight Alternate Universe**: Update proyeksi AU

**Cara Setting:**
1. Tab **"Preferensi Notifikasi"**
2. Toggle on/off sesuai kebutuhan
3. Perubahan otomatis tersimpan

### 10.4 Identitas Personal

**Persona Ekonomi Anda:**
- Mahasiswa / Pelajar
- Freelancer / Wirausaha
- Karyawan Tetap
- Pebisnis

Persona mempengaruhi:
- Rekomendasi budget
- Fitur Alternate Universe
- Tips keuangan yang diberikan

### 10.5 Reset & Zona Berbahaya

**Hapus Akun Permanen:**
⚠️ **HATI-HATI - TIDAK BISA DIBATALKAN**

1. Tab **"Zona Berbahaya"**
2. Klik **"Hapus Akun Saya Selamanya"**
3. Masukkan password untuk konfirmasi
4. Klik **"Ya, Hapus Akun & Data Saya"**
5. Semua data (transaksi, dompet, budget, dll) akan terhapus permanen

**Sebelum Hapus Akun:**
- Export semua laporan penting
- Backup data jika diperlukan
- Yakin tidak akan menggunakan lagi

---

## 11. Tips & Best Practices

### 11.1 Kebiasaan Baik Pencatatan

**1. Catat Segera Setelah Transaksi**
- Jangan menunda-nunda
- Saat masih ingat detail
- Gunakan HP untuk input cepat

**2. Konsisten Setiap Hari**
- Alokasikan 5-10 menit per hari
- Cek semua transaksi hari ini
- Review saldo dompet

**3. Lampirkan Bukti**
- Foto struk/nota
- Memudahkan audit nantinya
- Bukti untuk klaim atau komplain

**4. Keterangan yang Jelas**
- Detail lokasi/toko
- Item yang dibeli
- Siapa yang terlibat (jika patungan)

**Contoh Baik:**
```
❌ Buruk: "Makan"
✅ Baik: "Makan siang warteg Bu Sri: nasi + ayam + sayur"
```

### 11.2 Strategi Budget yang Efektif

**Rumus 50/30/20:**
- **50%** untuk kebutuhan pokok (makan, transport, sewa)
- **30%** untuk keinginan (hiburan, nongkrong, shopping)
- **20%** untuk tabungan dan investasi

**Budget Realistis:**
- Jangan terlalu ketat → susah diikuti
- Jangan terlalu longgar → tidak efektif
- Base on data historis 2-3 bulan

**Review Bulanan:**
- Cek pencapaian budget
- Adjust jika perlu
- Identifikasi kategori yang sering over

### 11.3 Mengelola Dompet Multiple

**Strategi Envelope System:**
1. **Dompet Utama (Bank)**: Untuk tabungan jangka panjang
2. **Dompet Operasional (E-wallet)**: Untuk transaksi harian
3. **Kas Darurat (Cash)**: Untuk emergency

**Transfer Teratur:**
- Setiap terima income → alokasi ke 3 dompet
- Contoh: 60% bank, 30% e-wallet, 10% cash

### 11.4 Target Tabungan Efektif

**Prinsip SMART:**
- **S**pecific: Jelas tujuannya
- **M**easurable: Bisa diukur nominalnya
- **A**chievable: Realistis tercapai
- **R**elevant: Sesuai kebutuhan
- **T**ime-bound: Ada deadline

**Contoh Target SMART:**
```
❌ Tidak SMART: "Nabung buat liburan"
✅ SMART: "Nabung Rp 5.000.000 untuk liburan ke Bali tanggal 20 Desember 2026"
```

**Prioritas Target:**
1. **Dana Darurat** (3-6 bulan pengeluaran) - PRIORITAS TERTINGGI
2. **Kebutuhan Mendesak** (bayar UKT, ganti laptop rusak)
3. **Keinginan Jangka Menengah** (liburan, gadget)
4. **Investasi Jangka Panjang** (modal usaha, DP rumah)

### 11.5 Maksimalkan Alternate Universe

**Eksperimen Skenario:**
- Coba berbagai kombinasi parameter
- Lihat yang paling realistis diterapkan
- Terapkan bertahap, tidak sekaligus

**Evaluasi Berkala:**
- Bandingkan prediksi AU vs realisasi
- Adjust parameter jika meleset
- Semakin lama semakin akurat

### 11.6 Keamanan Data

**Proteksi Akun:**
- Jangan share password ke siapa pun
- Logout setelah selesai (terutama di komputer umum)
- Gunakan password unik (jangan sama dengan akun lain)

**Backup Data:**
- Export laporan bulanan
- Simpan di cloud (Google Drive, dll)
- Sebagai backup jika terjadi masalah sistem

### 11.7 Troubleshooting Umum

**1. Saldo Tidak Sesuai**
- Cek semua transaksi bulan ini
- Pastikan tidak ada transaksi yang terlewat
- Review transfer antar dompet

**2. Budget Selalu Over**
- Budget terlalu ketat → naikkan sedikit
- Pengeluaran tidak terkontrol → review kebiasaan
- Kategori salah → pisahkan kategori besar

**3. Lupa Password**
- Klik "Lupa Password" di halaman login
- Cek email untuk reset link
- Buat password baru

**4. Laporan Tidak Keluar**
- Pastikan ada transaksi di periode tersebut
- Refresh halaman
- Coba browser lain
- Hubungi support jika masih error

### 11.8 Rekomendasi untuk Mahasiswa

**Tracking Biaya Kuliah:**
- Buat kategori "Pendidikan"
- Sub-kategori: UKT, Buku, Fotocopy, Print, Transport kampus

**Manfaatkan Kiriman Orang Tua:**
- Catat sebagai pemasukan
- Alokasikan langsung ke budget
- Sisakan untuk tabungan

**Part-time Income:**
- Freelance, tutor, part-time job
- Catat terpisah dari kiriman orang tua
- Hitung net income setelah pajak

**Dana Darurat Mahasiswa:**
- Target minimal 2-3 bulan pengeluaran
- Untuk jaga-jaga jika kiriman telat
- Cover emergency (sakit, laptop rusak, dll)

### 11.9 Rekomendasi untuk Freelancer

**Income Tidak Tetap:**
- Catat semua project sebagai pemasukan terpisah
- Hitung rata-rata income 3 bulan
- Base budget pada rata-rata, bukan peak

**Pisahkan Rekening:**
- Rekening bisnis (terima payment client)
- Rekening personal (untuk pengeluaran)
- Transfer "gaji" bulanan dari bisnis ke personal

**Pajak Freelance:**
- Sisihkan 10-15% untuk pajak
- Buat kategori "Pajak & Administrasi"
- Bayar pajak tepat waktu

**Buffer Fund:**
- Target 6-9 bulan pengeluaran (lebih tinggi dari karyawan)
- Freelance income tidak stabil
- Bisa cover dry spell (periode sepi project)

### 11.10 Mindset Finansial Sehat

**1. Hidup di Bawah Kemampuan (Live Below Your Means)**
- Income naik, lifestyle tidak harus naik
- Save the difference

**2. Otomasi Tabungan**
- Saving first, spending later
- Auto-transfer ke tabungan setiap terima income

**3. Hindari Debt untuk Konsumsi**
- Utang untuk produktif (bisnis, pendidikan) OK
- Utang untuk konsumtif (gadget, fashion) AVOID

**4. Investasi pada Diri Sendiri**
- Skill development
- Pendidikan
- Kesehatan
- Return tertinggi jangka panjang

**5. Review & Reflect Berkala**
- Mingguan: Cek transaksi & budget
- Bulanan: Review laporan & adjust strategy
- Tahunan: Big picture financial health

---

## 🎯 Ringkasan Quick Start

**Langkah Setup Awal (30 Menit):**

1. ✅ **Registrasi & Login** (5 menit)
2. ✅ **Tambah Dompet Pertama** (5 menit)
   - Minimal 1 dompet utama (bank/e-wallet)
3. ✅ **Buat Kategori Kustom** (5 menit) - jika perlu
4. ✅ **Set Budget Bulan Ini** (10 menit)
   - Minimal 3 kategori utama: Makan, Transport, Hiburan
5. ✅ **Catat Transaksi Hari Ini** (5 menit)
   - Mulai dari sekarang, catat semua transaksi

**Rutinitas Harian (5-10 Menit):**
- Pagi: Review saldo & budget
- Setiap transaksi: Catat segera
- Malam: Cek apakah ada yang terlewat

**Rutinitas Mingguan (15 Menit):**
- Review semua transaksi minggu ini
- Cek budget progress
- Adjust jika ada anomali

**Rutinitas Bulanan (30 Menit):**
- Generate laporan bulan lalu
- Review vs target
- Set budget bulan depan
- Update target tabungan

---

## 📞 Dukungan & Bantuan

**Jika Mengalami Masalah:**
1. Cek bagian [Troubleshooting](#117-troubleshooting-umum)
2. Lihat dokumentasi ini kembali
3. Cari di FAQ (jika tersedia)
4. Hubungi tim support

**Feedback & Saran:**
Kami terus mengembangkan Econary. Jika ada:
- Fitur yang diinginkan
- Bug atau error
- Saran improvement

Silakan sampaikan melalui menu **"Bantuan"** atau email support.

---

## 🚀 Kesimpulan

Selamat! Anda sekarang sudah memahami cara menggunakan **Econary** secara lengkap.

**Ingat:**
- Konsistensi adalah kunci
- Mulai dari yang sederhana
- Jangan overthink di awal
- Improve bertahap seiring waktu

**Quote Finansial:**
> "Bukan seberapa besar penghasilan Anda, tapi seberapa baik Anda mengelolanya."

**Mari mulai perjalanan finansial yang lebih baik bersama Econary! 💰📊✨**

---

**Versi Dokumen**: 1.0  
**Terakhir Diperbarui**: 16 Oktober 2026  
**Sistem**: Econary Personal Finance & Alternate Universe  
**Platform**: Web Application (Next.js + PostgreSQL)

---

© 2026 Econary. All rights reserved.
