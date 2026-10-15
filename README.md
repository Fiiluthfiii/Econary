# 💰 Econary - Aplikasi Pencatat Keuangan Pribadi

Econary adalah aplikasi web modern untuk mencatat, mengelola, dan menganalisis keuangan pribadi Anda. Dilengkapi dengan fitur Alternate Universe untuk simulasi keputusan finansial. Dibuat dengan Next.js, Tailwind CSS, dan PostgreSQL.

![Econary Preview](https://via.placeholder.com/1200x600/4d8061/ffffff?text=Econary+Financial+Tracker)

## ✨ Fitur Utama

- 📊 **Dashboard Interaktif** - Lihat ringkasan keuangan Anda dengan visualisasi yang menarik
- 💸 **Manajemen Transaksi** - Catat pemasukan dan pengeluaran dengan mudah
- 📁 **Kategori Custom** - Organisir transaksi dengan kategori yang bisa disesuaikan
- 💰 **Multi-Dompet** - Kelola berbagai sumber dana (cash, bank, e-wallet)
- 📈 **Laporan & Grafik** - Analisis keuangan dengan grafik interaktif
- 🎯 **Perencanaan Anggaran** - Atur dan pantau target pengeluaran bulanan
- 🎯 **Target Tabungan** - Buat dan lacak progress target tabungan Anda
- 🌌 **Alternate Universe** - Simulasi keputusan finansial dengan AI prediktif
- 🌙 **Dark Mode** - Tampilan gelap untuk kenyamanan mata
- 📱 **Responsive** - Optimal di desktop, tablet, dan mobile
- 🌐 **Multi-bahasa** - Dukungan Bahasa Indonesia dan English

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, JavaScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🚀 Quick Start

### Prasyarat

- Node.js 18+ dan npm/yarn
- Akun PostgreSQL (disarankan: [Neon](https://neon.tech))

### Instalasi

1. Clone repository ini:
```bash
git clone https://github.com/Fiiluthfiii/Econary.git
cd Econary
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
```

3. Setup Environment Variables:

Buat file `.env` dan `.env.local` di root folder dan isi dengan konfigurasi berikut:

```env
# Database - Dapatkan dari Neon.tech
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-dengan-openssl-rand-base64-32"

# Optional: Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

**Cara generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

4. Setup Database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database dengan data demo
npx prisma db seed
```

5. Jalankan development server:

```bash
npm run dev
# atau
yarn dev
```

6. Buka browser dan akses:
```
http://localhost:3000
```

## 👤 Akun Demo

Setelah menjalankan seed, Anda bisa login dengan:

- **Email**: demo@pocket.com
- **Password**: demo123

## 📁 Struktur Project

```
Econary/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── transactions/
│   │   ├── categories/
│   │   ├── wallets/
│   │   ├── budgets/
│   │   └── saving-goals/
│   ├── dashboard/       # Dashboard pages
│   │   ├── transactions/
│   │   ├── categories/
│   │   ├── wallets/
│   │   ├── budget/
│   │   ├── saving-goals/
│   │   ├── alternate-universe/
│   │   ├── reports/
│   │   └── settings/
│   ├── login/          # Login page
│   ├── register/       # Register page
│   ├── layout.js       # Root layout
│   ├── page.js         # Landing page
│   └── globals.css     # Global styles
├── components/
│   ├── dashboard/      # Dashboard components
│   ├── transactions/   # Transaction components
│   ├── budget/         # Budget components
│   ├── saving-goals/   # Saving goals components
│   ├── alternate-universe/ # AU components
│   ├── settings/       # Settings components
│   └── providers/      # Context providers
├── lib/
│   ├── prisma.js       # Prisma client
│   ├── auth.js         # Auth utilities
│   ├── translations.js # i18n translations
│   └── exportPDF.js    # PDF export utility
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.js         # Seed data
├── public/             # Static assets
├── .env.example        # Environment variables template
├── package.json
├── tailwind.config.js
└── README.md
```

## 🗄️ Database Schema

Aplikasi menggunakan 7 model utama:

- **User** - Data pengguna
- **Wallet** - Dompet/akun keuangan
- **Category** - Kategori transaksi
- **Transaction** - Transaksi keuangan
- **Budget** - Anggaran bulanan per kategori
- **SavingGoal** - Target tabungan
- **SavingTransaction** - Transaksi setoran ke target tabungan

Lihat detail schema di `prisma/schema.prisma`

## 🌌 Fitur Alternate Universe

Fitur unggulan Econary yang memungkinkan Anda untuk:

- Simulasi keputusan finansial tanpa risiko
- Bandingkan skenario "Universe Utama" vs "Alternate Universe"
- Proyeksi 24 bulan ke depan berdasarkan data real
- Modifikasi parameter: lifestyle, investasi, skenario freelancer/mahasiswa
- Rekomendasi AI berdasarkan pola transaksi
- Visualisasi grafik proyeksi interaktif

## 🔐 Keamanan

- Password di-hash menggunakan bcrypt
- Session management dengan JWT
- Protected routes dengan NextAuth middleware
- Input validation di client dan server side
- Environment variables untuk kredensial sensitif
- CSRF protection

## 📱 Responsive Design

Aplikasi dioptimalkan untuk berbagai ukuran layar:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎨 Design System

Econary menggunakan design system yang konsisten:

- **Primary Color**: Green (#4d8061)
- **Secondary Color**: Gold (#80672d)
- **Background**: Warm beige (#f8f5ef, #f4f1e9)
- **Typography**: Inter + Georgia serif untuk headings
- **Components**: Card-based layout dengan border radius konsisten
- **Spacing**: Tailwind spacing scale
- **Shadows**: Subtle shadows untuk depth

## 📄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Wallets
- `GET /api/wallets` - Get all wallets
- `POST /api/wallets` - Create wallet
- `PUT /api/wallets/[id]` - Update wallet
- `DELETE /api/wallets/[id]` - Delete wallet

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget

### Saving Goals
- `GET /api/saving-goals` - Get all saving goals
- `POST /api/saving-goals` - Create saving goal
- `PUT /api/saving-goals/[id]` - Update saving goal
- `DELETE /api/saving-goals/[id]` - Delete saving goal
- `GET /api/saving-goals/[id]/transactions` - Get goal transactions
- `POST /api/saving-goals/[id]/transactions` - Add deposit to goal

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password
- `DELETE /api/user/delete` - Delete account

## 🌐 Multi-language Support

Econary mendukung 2 bahasa:
- 🇮🇩 Bahasa Indonesia (default)
- 🇬🇧 English

Ganti bahasa melalui halaman Settings.

## 🚧 Roadmap

- [x] Dashboard interaktif dengan real data
- [x] Manajemen transaksi lengkap
- [x] Kategori dan dompet custom
- [x] Perencanaan anggaran bulanan
- [x] Target tabungan dengan tracking
- [x] Alternate Universe simulator
- [x] Multi-language support
- [ ] Export laporan ke PDF/CSV
- [ ] Notifikasi anggaran via email
- [ ] Upload foto struk
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Sharing budget dengan keluarga

## 🤝 Kontribusi

Kontribusi selalu welcome! Silakan:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Project ini dibuat untuk keperluan pembelajaran dan portfolio.

## 👨‍💻 Author

Dibuat dengan ❤️ oleh Fiiluthfiii

## 🙏 Acknowledgments

- Design inspiration dari modern fintech apps
- Icons dari Lucide React
- Charts dari Recharts
- UI framework dari Tailwind CSS
- Database dari Neon.tech
- Deployment dari Vercel

---

**Happy tracking your finances with Econary! 💰✨**
