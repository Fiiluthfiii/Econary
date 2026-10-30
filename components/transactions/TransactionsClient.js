'use client';

import { useEffect, useRef, useState } from 'react';
// Icons removed for simplicity
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const money = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

export default function TransactionsClient({ userId, userName: initialUserName }) {
  const [activeTab, setActiveTab] = useState('expense');
  const [amount, setAmount] = useState('75000');
  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [isFreelanceClient, setIsFreelanceClient] = useState(true);
  const [useFriendMoney, setUseFriendMoney] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(initialUserName || 'User');
  const [budgetInfo, setBudgetInfo] = useState([]);
  const fileRef = useRef(null);
  const amountRef = useRef(null);

  const currentWallet = wallets.find((wallet) => wallet.id === selectedWallet);
  const currentBalance = Number(currentWallet?.balance || 0);
  const totalBalance = wallets.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0);
  const numericAmount = Number(amount || 0);
  const signedAmount = activeTab === 'expense' ? -numericAmount : numericAmount;
  const categoriesForType = categories.filter((category) => category.type === (activeTab === 'income' ? 'income' : 'expense'));
  
  // Use real categories from database, no fallback dummy data
  const visibleCategories = categoriesForType.slice(0, 8);
  
  // Get budget for selected category
  const selectedCategoryBudget = selectedCategory 
    ? budgetInfo?.find(b => b.categoryId === selectedCategory)
    : budgetInfo?.[0];

  const fetchData = async () => {
    try {
      const [catRes, walletRes, txRes, userRes, budgetRes] = await Promise.all([
        fetch('/api/categories'), 
        fetch('/api/wallets'), 
        fetch('/api/transactions'),
        fetch('/api/user/profile'),
        fetch('/api/budgets')
      ]);
      
      const catData = await catRes.json(); 
      const walletData = await walletRes.json(); 
      const txData = await txRes.json();
      const userData = await userRes.json();
      const budgetData = await budgetRes.json();
      
      setCategories(catData.categories || []); 
      setWallets(walletData.wallets || []);
      setUserName(userData.user?.name || 'User');
      
      if (!selectedWallet && walletData.wallets?.[0]) setSelectedWallet(walletData.wallets[0].id);
      setRecentTransactions((txData.transactions || txData || []).slice(0, 3));
      
      // Set budget info as array
      if (budgetData.budgets && budgetData.budgets.length > 0) {
        setBudgetInfo(budgetData.budgets);
      } else {
        setBudgetInfo([]);
      }
    } catch (error) { 
      console.error('Gagal memuat data transaksi:', error); 
    }
  };
  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = () => { setAmount('75000'); setNote(''); setSelectedCategory(null); setReceipt(null); setTransactionDate(new Date()); };
  const handleSubmit = async () => {
    if (!selectedCategory || !selectedWallet || numericAmount <= 0) return alert('Mohon lengkapi kategori, dompet, dan nominal transaksi.');
    setLoading(true);
    try {
      const response = await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: activeTab === 'transfer' ? 'expense' : activeTab, amount: numericAmount, categoryId: selectedCategory, walletId: selectedWallet, note: note || `${activeTab === 'expense' ? 'Pengeluaran' : 'Pemasukan'} transaksi`, date: transactionDate.toISOString() }) });
      if (!response.ok) throw new Error('Gagal menyimpan transaksi');
      alert('Transaksi berhasil disimpan!'); resetForm(); await fetchData();
    } catch (error) { alert(error.message || 'Terjadi kesalahan saat menyimpan transaksi'); } finally { setLoading(false); }
  };

  return (
    <div className="finverse-page transaction-page">
      <header className="finverse-topbar transaction-topbar">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="greeting">Halo, {userName}!</h1>
            <span className="sync-pill">● PostgreSQL Synced</span>
          </div>
          <p className="date-line">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}</p>
          <p className="module-line">MODUL TRANSAKSI <span>•</span> SKPL FR-04 / FR-05</p>
        </div>
        <div className="header-actions">
          <button className="finverse-primary-button" onClick={() => amountRef.current?.focus()}>
            Tambah Transaksi
          </button>
          <button className="header-icon" aria-label="Notifikasi">
            🔔
          </button>
          <div className="profile-chip">
            <div className="avatar">
              {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <b>{userName}</b>
              <small>Freelancer / Mahasiswa</small>
            </div>
          </div>
        </div>
      </header>
      <div className="transaction-title-row"><h2 className="display-title">Tambah &amp; Kelola Catatan Transaksi</h2><div className="title-status"><span>● PostgreSQL Active <small>v16.2</small></span><span>◌ Auto-Save Aktif</span></div></div>
      <div className="transaction-grid">
        <section className="transaction-form finverse-card">
          <label className="form-label">JENIS TRANSAKSI</label><div className="type-switcher">{[['expense', 'Pengeluaran'], ['income', 'Pemasukan'], ['transfer', 'Transfer']].map(([key, label]) => <button key={key} onClick={() => { setActiveTab(key); setSelectedCategory(null); }} className={activeTab === key ? `type-active ${key}` : ''}>{label}</button>)}</div>
          <div className="amount-panel"><div className="form-label-row"><label className="form-label">NOMINAL TRANSAKSI</label><span>Maksimal 12 Digit (IDR)</span></div><input ref={amountRef} className="amount-input" value={money(amount)} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ''))} /><div className="quick-amounts">{[20000, 50000, 100000, 500000, 1000000].map((value) => <button key={value} onClick={() => setAmount(String(numericAmount + value))}>+{value >= 1000000 ? '1 jt' : `${value / 1000}rb`}</button>)}</div></div>
          <div>
            <div className="form-label-row">
              <label className="form-label">KATEGORI KEUANGAN</label>
              <span className="green-note">SKPL FR-09 Standard</span>
            </div>
            {visibleCategories.length > 0 ? (
              <div className="category-grid">
                {visibleCategories.map((category) => { 
                  return (
                    <button 
                      key={category.id} 
                      onClick={() => setSelectedCategory(category.id)} 
                      className={`category-tile ${selectedCategory === category.id ? 'selected' : ''}`}
                    >
                      <b>{category.name}</b>
                      <small>
                        {category.name === 'Makanan' ? 'Konsumsi harian' : 
                         category.name === 'Transport' ? 'BBM, KRL & Ojol' : 
                         category.name === 'Pendidikan' ? 'Buku & Kursus' : 
                         category.name === 'Hiburan' ? 'Streaming, Game' : 
                         category.name}
                      </small>
                    </button>
                  ); 
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '20px', textAlign: 'center', background: '#fef3c7', borderRadius: '8px', marginTop: '10px' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#92400e' }}>
                  Belum ada kategori {activeTab === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>
                  Silakan tambahkan kategori terlebih dahulu di menu <strong>Perencanaan Anggaran</strong>
                </p>
              </div>
            )}
          </div>
          <div className="two-fields"><div><div className="form-label-row"><label className="form-label">WAKTU TRANSAKSI</label><button className="set-now" onClick={() => setTransactionDate(new Date())}>Setel Sekarang</button></div><div className="field-with-icon"><input type="datetime-local" value={format(transactionDate, "yyyy-MM-dd'T'HH:mm")} onChange={(event) => setTransactionDate(new Date(event.target.value))} /></div></div><div><label className="form-label">METODE PEMBAYARAN</label><select className="styled-field" value={selectedWallet} onChange={(event) => setSelectedWallet(event.target.value)}><option value="">Pilih dompet</option>{wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name} ({money(wallet.balance)})</option>)}</select></div></div>
          <div><label className="form-label">KETERANGAN &amp; CATATAN TRANSAKSI</label><input className="styled-field" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Makan siang tim freelance & kopi americano" /></div>
          <div><label className="form-label">PENANDA KHUSUS PERSONA MAHASISWA / FREELANCER</label><div className="persona-fields"><label><span>💼</span><span>Tagihan Klien Freelance</span><input type="checkbox" checked={isFreelanceClient} onChange={(event) => setIsFreelanceClient(event.target.checked)} /></label><label><span>♟</span><span>Uang Saku Orang Tua</span><input type="checkbox" checked={useFriendMoney} onChange={(event) => setUseFriendMoney(event.target.checked)} /></label></div></div>
          <div><label className="form-label">LAMPIRAN BUKTI TRANSAKSI / NOTA</label><button className="upload-box" onClick={() => fileRef.current?.click()}><span style={{fontSize: '25px'}}>☁️</span><b>{receipt ? receipt.name : 'Tarik nota struk ke sini'} <span>atau klik untuk memilih file</span></b><small>Mendukung JPG, PNG, PDF (Maksimal 5MB)</small></button><input ref={fileRef} hidden type="file" accept="image/jpeg,image/png,application/pdf" onChange={(event) => setReceipt(event.target.files?.[0] || null)} /></div>
          <div className="form-actions"><button className="save-button" onClick={handleSubmit} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Transaksi'}</button><button className="reset-button" onClick={resetForm}>Batal / Reset</button></div>
        </section>
        <aside className="transaction-aside">
          <InfoCard title="PRATINJAU DAMPAK SALDO" badge="LIVE SYNC">
            <div className="info-rows">
              <p>
                <span>Dompet Terpilih</span>
                <b>{currentWallet?.name || 'Pilih dompet'}</b>
              </p>
              <p>
                <span>Saldo Saat Ini</span>
                <b>{money(currentBalance)}</b>
              </p>
              <p>
                <span>Perubahan Transaksi</span>
                <b className={signedAmount < 0 ? 'negative' : 'positive'}>
                  {signedAmount < 0 ? '- ' : '+ '}{money(Math.abs(signedAmount))}
                </b>
              </p>
              <hr />
              <p>
                <span>Saldo Akhir<small>Real-time projection</small></span>
                <strong>{money(currentBalance + signedAmount)}</strong>
              </p>
            </div>
            <div className="total-row">
              <span>Total Akumulasi Seluruh Dompet:</span>
              <b>{money(totalBalance)}</b>
            </div>
          </InfoCard>
          <InfoCard title="ALOKASI BUDGET KATEGORI" badge={selectedCategoryBudget?.category?.name || 'Budget'}>
            {selectedCategoryBudget ? (
              <>
                <p className="budget-line">
                  <span>Pemakaian Bulan Ini</span>
                  <b>{money(selectedCategoryBudget.spent)} <small>/ {money(selectedCategoryBudget.amount)}</small></b>
                </p>
                <div className="budget-track">
                  <i style={{ width: `${Math.min((selectedCategoryBudget.spent / selectedCategoryBudget.amount) * 100, 100)}%` }} />
                </div>
                <p className="budget-line">
                  <small>{Math.round((selectedCategoryBudget.spent / selectedCategoryBudget.amount) * 100)}% terpakai</small>
                  <small>Tersisa {money(Math.max(selectedCategoryBudget.amount - selectedCategoryBudget.spent, 0))}</small>
                </p>
                {(selectedCategoryBudget.spent / selectedCategoryBudget.amount) > 0.7 && (
                  <div className="notice">
                    ⚠️
                    {(selectedCategoryBudget.spent / selectedCategoryBudget.amount) >= 1 
                      ? 'Budget sudah terlampaui! Segera kurangi pengeluaran kategori ini.'
                      : 'Pengeluaran mendekati batas budget. Gunakan dengan bijak.'}
                  </div>
                )}
              </>
            ) : (
              <p className="empty-recent">Belum ada budget untuk bulan ini. Buat budget di menu Perencanaan Anggaran.</p>
            )}
          </InfoCard>
          <InfoCard title="DAMPAK ALTERNATE UNIVERSE" badge="SIMULATION" className="universe-card">
            <p>Setiap rupiah yang dicatat mengaktifkan model komparasi Econary AU: membandingkan keputusan finansial Anda saat ini dengan skenario alternatif investasi rebalancing & tabungan darurat.</p>
            <div className="scenario-grid">
              <div>
                <small>SKENARIO NYATA</small>
                <b>Pengeluaran Konsumtif</b>
                <span>Dampak -{money(numericAmount)}</span>
              </div>
              <div>
                <small>SKENARIO AU #2</small>
                <b>Jika Diinvestasikan</b>
                <span>+{money(Math.round(numericAmount * 0.15))} (3 Thn)</span>
              </div>
            </div>
          </InfoCard>
          <InfoCard title="DRAF CEPAT TERAKHIR" badge="Kelola"><div className="recent-list">{recentTransactions.length ? recentTransactions.map((tx) => <div className="recent-item" key={tx.id}><span>{tx.category?.icon || '↻'}</span><div><b>{tx.note || tx.category?.name || 'Transaksi'}</b><small>{tx.category?.name || 'Makanan'} • {tx.wallet?.name || 'Dompet'}</small></div><strong>{tx.type === 'expense' ? '-' : '+'}{money(tx.amount)}</strong></div>) : <p className="empty-recent">Belum ada transaksi</p>}</div></InfoCard>
        </aside>
      </div>
    </div>
  );
}

function InfoCard({ title, badge, children, className = '' }) { return <section className={`info-card finverse-card ${className}`}><div className="info-title"><h3>{title}</h3>{badge && <span>{badge}</span>}</div>{children}</section>; }
