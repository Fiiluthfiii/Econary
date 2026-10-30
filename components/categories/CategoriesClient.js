'use client';

import { useEffect, useState } from 'react';
import { BookOpen, CircleDollarSign, Gamepad2, HeartPulse, MoreHorizontal, Pencil, Plus, Search, ShoppingBag, Trash2, Utensils, WalletCards, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import CategoryModal from './CategoryModal';

const money = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
const categoryIcon = (name) => { 
  const value = name.toLowerCase(); 
  if (value.includes('makan')) return Utensils; 
  if (value.includes('transport')) return WalletCards; 
  if (value.includes('pendidikan')) return BookOpen; 
  if (value.includes('hibur')) return Gamepad2; 
  if (value.includes('belanja')) return ShoppingBag; 
  if (value.includes('kesehat')) return HeartPulse; 
  if (value.includes('util') || value.includes('listrik')) return Zap; 
  if (value.includes('pendapatan') || value.includes('gaji')) return CircleDollarSign; 
  return MoreHorizontal; 
};

export default function CategoriesClient({ userName }) {
  const [categories, setCategories] = useState([]); 
  const [stats, setStats] = useState({}); 
  const [loading, setLoading] = useState(true); 
  const [activeTab, setActiveTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [modalCategory, setModalCategory] = useState(null); 
  const [message, setMessage] = useState('');
  
  const notify = (text) => { setMessage(text); window.setTimeout(() => setMessage(''), 2500); };
  
  const fetchCategories = async () => { 
    try { 
      const [categoryResponse, transactionResponse] = await Promise.all([
        fetch('/api/categories'), 
        fetch('/api/transactions')
      ]); 
      
      const categoryData = await categoryResponse.json(); 
      const transactionData = await transactionResponse.json(); 
      
      const list = Array.isArray(categoryData) ? categoryData : categoryData.categories || []; 
      const transactions = Array.isArray(transactionData) ? transactionData : transactionData.transactions || []; 
      
      const current = new Date(); 
      const next = {}; 
      
      list.forEach((category) => { 
        const items = transactions.filter((tx) => 
          tx.categoryId === category.id && 
          new Date(tx.date).getMonth() === current.getMonth() && 
          new Date(tx.date).getFullYear() === current.getFullYear()
        ); 
        next[category.id] = { 
          count: items.length, 
          total: items.reduce((sum, tx) => sum + Number(tx.amount || 0), 0) 
        }; 
      }); 
      
      setCategories(list); 
      setStats(next); 
    } catch (error) { 
      console.error('Gagal memuat kategori:', error); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  useEffect(() => { fetchCategories(); }, []);
  
  const filtered = categories.filter((category) => 
    (activeTab === 'all' || category.type === activeTab) && 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const expenseCount = categories.filter((category) => category.type === 'expense').length; 
  const incomeCount = categories.filter((category) => category.type === 'income').length; 
  
  // Calculate top category from REAL data
  const topCategory = categories
    .filter((category) => category.type === 'expense')
    .sort((a, b) => (stats[b.id]?.total || 0) - (stats[a.id]?.total || 0))[0];
  
  const topCategoryTotal = topCategory ? stats[topCategory.id]?.total || 0 : 0;
  const allExpenseTotal = categories
    .filter(c => c.type === 'expense')
    .reduce((sum, c) => sum + (stats[c.id]?.total || 0), 0);
  const topCategoryPercent = allExpenseTotal > 0 ? ((topCategoryTotal / allExpenseTotal) * 100).toFixed(1) : 0;
  
  // Calculate total sub-categories (transaction count across all categories)
  const totalSubCategories = Object.values(stats).reduce((sum, s) => sum + (s.count || 0), 0);
  
  const remove = async (category) => { 
    if (category.isDefault) return notify('Kategori standar tidak dapat dihapus.'); 
    if (!window.confirm('Hapus kategori ini?')) return; 
    const response = await fetch(`/api/categories/${category.id}`, { method: 'DELETE' }); 
    if (response.ok) { 
      fetchCategories(); 
      notify('Kategori berhasil dihapus.'); 
    } 
  };
  
  const now = new Date();
  
  if (loading) {
    return <div className="finverse-page categories-page">
      <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8f6f0', borderRadius: 16, margin: '40px auto', maxWidth: 600 }}>
        <p style={{ color: '#666', fontSize: 15 }}>Memuat kategori dari database...</p>
      </div>
    </div>;
  }
  
  return <div className="finverse-page categories-page">
    <header className="finverse-topbar categories-topbar">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="greeting">Halo, {userName}!</h1>
          <span className="sync-pill">● PostgreSQL Synced</span>
        </div>
        <p className="date-line">{format(now, 'EEEE, dd MMMM yyyy', { locale: id })}</p>
      </div>
      <div className="header-actions">
        <button className="finverse-primary-button" onClick={() => notify('Catat transaksi melalui halaman Riwayat Transaksi.')}>
          <Plus size={15} /> Catat Transaksi
        </button>
        <div className="avatar">
          {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
      </div>
    </header>
    
    <div className="category-context">
      <span>● KONFIGURASI LEDGER • SKPL FR-09</span>
      <small>• Master Taksonomi Econary</small>
    </div>
    
    <section className="category-heading">
      <div>
        <h2>Kelola Kategori Transaksi</h2>
        <p>Atur kategori standar SKPL FR-09, buat sub-kategori kustom untuk<br className="desktop-only" /> kebutuhan mahasiswa &amp; freelancer, tentukan pagu default, dan sesuaikan ikon &amp; warna pos buku besar.</p>
      </div>
      <div className="category-heading-actions">
        <button className="soft-action" onClick={() => notify('Kategori standar SKPL telah dipulihkan.')}>↻ Reset ke Standar SKPL</button>
        <button className="finverse-primary-button" onClick={() => setModalCategory({})}><Plus size={15} /> Tambah Kategori / Sub-Pos</button>
      </div>
    </section>
    
    <div className="category-stats">
      <Stat 
        label="TOTAL KATEGORI UTAMA" 
        value={`${categories.length} Kategori`} 
        note="Kepatuhan Penuh SKPL FR-09" 
        tone="green" 
      />
      <Stat 
        label="TRANSAKSI BULAN INI" 
        value={`${totalSubCategories} Transaksi`} 
        note={`Pengeluaran (${expenseCount}) • Pemasukan (${incomeCount})`} 
        icon={<LayersIcon />} 
        tone="neutral" 
      />
      <Stat 
        label="FREKUENSI TERTINGGI" 
        value={topCategory?.name || 'Belum Ada Data'} 
        note={topCategory ? `${topCategoryPercent}% Porsi Total Ledger` : 'Tambahkan transaksi untuk melihat statistik'} 
        icon={topCategory ? (() => { const Icon = categoryIcon(topCategory.name); return <Icon size={17} />; })() : <Utensils size={17} />} 
        tone="gold" 
      />
    </div>
    
    <div className="categories-layout">
      <main>
        <div className="category-tabs">
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>
            Semua<br />Kategori ({categories.length})
          </button>
          <button className={activeTab === 'expense' ? 'active' : ''} onClick={() => setActiveTab('expense')}>
            Pengeluaran<br />({expenseCount})
          </button>
          <button className={activeTab === 'income' ? 'active' : ''} onClick={() => setActiveTab('income')}>
            Pemasukan<br />({incomeCount})
          </button>
          <label>
            <Search size={14} />
            <input placeholder="Cari pos transaksi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </label>
        </div>
        
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8f6f0', borderRadius: 16, marginTop: 20 }}>
            <p style={{ color: '#666', fontSize: 15, marginBottom: 12 }}>
              {searchTerm ? 'Tidak ada kategori yang sesuai dengan pencarian' : 'Belum ada kategori transaksi'}
            </p>
            {!searchTerm && (
              <p style={{ color: '#999', fontSize: 13 }}>
                Klik &quot;Tambah Kategori / Sub-Pos&quot; untuk membuat kategori baru
              </p>
            )}
          </div>
        ) : (
          filtered.map((category) => 
            <CategoryCard 
              key={category.id} 
              category={category} 
              stats={stats[category.id] || { count: 0, total: 0 }} 
              onEdit={() => setModalCategory(category)} 
              onDelete={() => remove(category)} 
              onAddSub={() => notify('Sub-kategori akan ditambahkan melalui transaksi.')} 
            />
          )
        )}
      </main>
      
      <aside className="category-sidebar">
        <section className="sub-category-panel">
          <div className="panel-title">
            <h3>▣ &nbsp; Buat Sub-Kategori Baru</h3>
            <span>SKPL SYNC</span>
          </div>
          <label>
            Kategori Induk
            <select>
              <option>Pendidikan</option>
              <option>Makanan &amp; Minuman</option>
              <option>Transportasi</option>
            </select>
          </label>
          <label>
            Nama Sub-Kategori
            <input placeholder="Alat Tulis & Cetak Skripsi" />
          </label>
          <small>Akan otomatis dikelompokkan ke buku kas yang dipilih.</small>
          <p className="panel-label">Pilih Ikon Penanda</p>
          <div className="icon-options">
            <button>▤</button><button>✎</button><button>▱</button><button>▣</button><button>▢</button>
          </div>
          <p className="panel-label">Warna Aksen Indikator</p>
          <div className="color-options">
            <i /><i /><i /><i /><i />
          </div>
          <label className="universe-check">
            <input type="checkbox" defaultChecked /> 
            <span>
              <b>Hubungkan ke Alternate Universe</b>
              <small>Pos ini dapat disimulasikan sebagai penghematan alternatif dana darurat &amp; investasi.</small>
            </span>
          </label>
          <button className="save-sub-button" onClick={() => setModalCategory({})}>
            Simpan Sub-Kategori
          </button>
        </section>
        
        <section className="taxonomy-panel">
          <h3>◎ &nbsp; STANDAR TAKSONOMI LEDGER</h3>
          <p>Struktur kategori diatur secara deterministik memenuhi ketentuan SKPL Econary FR-09. Seluruh mutasi kas, limit kartu debit, serta visualisasi Sankey Chart mengacu pada pos ini.</p>
          <span>● Auto-mapping aktif untuk kwitansi OCR &amp; e-Wallet hook</span>
        </section>
        
        <section className="tips-category">
          <small>TIPS MAHASISWA &amp; FREELANCER</small>
          <h3>Pisahkan Dana Kerja Proyek &amp; Uang Saku Kuliah</h3>
          <p>Gunakan sub-kategori custom untuk mengisolasi pengeluaran tools desain berbayar dari pos makan harian.</p>
        </section>
      </aside>
    </div>
    
    {message && <div className="budget-toast">{message}</div>}
    {modalCategory && <CategoryModal category={modalCategory.id ? modalCategory : null} onClose={() => setModalCategory(null)} onSuccess={() => { setModalCategory(null); fetchCategories(); notify('Kategori berhasil disimpan.'); }} />}
  </div>;
}

function LayersIcon() { return <span style={{ fontSize: 18 }}>▱</span>; }

function Stat({ label, value, note, icon, tone }) { 
  return <article className="category-stat">
    <div>
      <small>{label}</small>
      <i className={tone}>{icon}</i>
    </div>
    <h3>{value}</h3>
    <p className={tone}>{note}</p>
  </article>; 
}

function CategoryCard({ category, stats = {}, onEdit, onDelete, onAddSub }) { 
  const Icon = categoryIcon(category.name); 
  const transactionCount = stats.count || 0;
  
  return <article className="category-card">
    <div className="category-card-head">
      <div className="category-icon">
        <Icon size={21} />
      </div>
      <div className="category-card-title">
        <h3>{category.name}</h3>
        <div>
          <span>SKPL STANDARD</span>
          {category.type === 'income' && <span className="income-pill">ARUS MASUK &amp; BERSIH</span>}
        </div>
        <p>Tipe: {category.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} • Warna Ledger: {category.color || 'Sage'}</p>
      </div>
      <div className="category-budget">
        <small>PAGU<br />BULANAN</small>
        <b>{stats.total > 0 ? money(stats.total) : category.type === 'income' ? 'Multi-Source' : '-'}</b>
      </div>
      <div className="category-actions">
        <button onClick={onEdit}><Pencil size={14} /></button>
        <button onClick={onDelete}><Trash2 size={14} /></button>
      </div>
    </div>
    <div className="subcategory-box">
      <div>
        <span>Transaksi Bulan Ini ({transactionCount} transaksi)</span>
        <button onClick={onAddSub}>＋ Tambah Sub-Kategori</button>
      </div>
      {transactionCount > 0 ? (
        <div className="tag-list">
          <span>● {transactionCount} transaksi tercatat <b>✓</b></span>
        </div>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', background: '#fafaf8', borderRadius: 8, marginTop: 8 }}>
          <p style={{ color: '#999', fontSize: 13 }}>
            Belum ada transaksi untuk kategori ini bulan ini
          </p>
        </div>
      )}
    </div>
  </article>; 
}
