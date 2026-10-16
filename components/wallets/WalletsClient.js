'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeftRight, Banknote, Bell, CheckCircle, CreditCard, EllipsisVertical, Filter, Landmark, Plus, Search, Settings2, Smartphone, SlidersHorizontal, Wallet, X } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import WalletModal from './WalletModal';

const money = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
const typeIcons = { bank: Landmark, 'e-wallet': Smartphone, cash: Banknote, credit: CreditCard, other: Wallet };

export default function WalletsClient({ userName }) {
  const [wallets, setWallets] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [modalWallet, setModalWallet] = useState(null); 
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  
  // Use REAL data only - NO fallback
  const filtered = wallets.filter((wallet) => wallet.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalBalance = wallets.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0);
  const bankTotal = wallets.filter((wallet) => wallet.type === 'bank' || wallet.type === 'credit').reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0);
  const cashTotal = wallets.filter((wallet) => wallet.type === 'cash' || wallet.type === 'e-wallet').reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0);
  
  // Calculate liquidity percentages from REAL data
  const bankPercent = totalBalance > 0 ? ((bankTotal / totalBalance) * 100).toFixed(1) : 0;
  const ewalletPercent = totalBalance > 0 ? ((wallets.filter(w => w.type === 'e-wallet').reduce((sum, w) => sum + Number(w.balance || 0), 0) / totalBalance) * 100).toFixed(1) : 0;
  const cashPercent = totalBalance > 0 ? ((wallets.filter(w => w.type === 'cash').reduce((sum, w) => sum + Number(w.balance || 0), 0) / totalBalance) * 100).toFixed(1) : 0;
  
  const notify = (text) => { setMessage(text); window.setTimeout(() => setMessage(''), 2500); };
  
  const fetchWallets = async () => { 
    try { 
      const [walletRes, transactionRes] = await Promise.all([
        fetch('/api/wallets'),
        fetch('/api/transactions')
      ]);
      
      const walletData = await walletRes.json(); 
      const transactionData = await transactionRes.json();
      
      setWallets(Array.isArray(walletData) ? walletData : walletData.wallets || []); 
      
      // Get recent transfer transactions
      const allTransactions = Array.isArray(transactionData) ? transactionData : transactionData.transactions || [];
      const transferTransactions = allTransactions
        .filter(t => t.type === 'transfer' || t.type === 'income')
        .slice(0, 4);
      setTransactions(transferTransactions);
    } catch (error) { 
      console.error('Gagal memuat dompet:', error); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  useEffect(() => { fetchWallets(); }, []);
  
  const handleDelete = async (wallet) => { 
    if (wallets.length <= 1) return alert('Minimal satu dompet harus tersedia.'); 
    if (!window.confirm('Hapus dompet ini? Transaksi terkait juga akan terhapus.')) return; 
    const response = await fetch(`/api/wallets/${wallet.id}`, { method: 'DELETE' }); 
    if (response.ok) { 
      fetchWallets(); 
      notify('Dompet berhasil dihapus.'); 
    } 
  };
  
  const openEdit = (wallet) => { 
    setModalWallet(wallet); 
  };
  
  const now = new Date();
  
  return <div className="finverse-page wallets-page">
    <header className="finverse-topbar wallets-topbar">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="greeting">Halo, {userName}!</h1>
          <span className="sync-pill">● PostgreSQL Synced</span>
        </div>
        <p className="date-line">{format(now, 'EEEE, dd MMMM yyyy', { locale: id })}</p>
      </div>
      <div className="header-actions">
        <button className="finverse-primary-button" onClick={() => notify('Catat transaksi melalui halaman Riwayat Transaksi.')}>
          <Plus size={16} /> Catat Transaksi
        </button>
        <button className="header-icon">
          <Bell size={18} />
        </button>
        <div className="avatar">
          {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
      </div>
    </header>
    <div className="wallets-context">
      <span>● Pusat Keuangan • Multi-Account &amp; E-Wallet</span>
      <small>Sinkronisasi Real-Time</small>
    </div>
    
    <section className="wallets-heading">
      <div>
        <h2>Dompet &amp; Sumber Dana</h2>
        <p>
          Kelola seluruh rekening bank, e-wallet, kartu debit/kredit, dan kas<br className="desktop-only" /> 
          tunai fisik yang terhubung untuk pencatatan mutasi transaksi<br className="desktop-only" /> 
          otomatis &amp; manual secara terstruktur.
        </p>
      </div>
      <div className="wallet-heading-actions">
        <button className="soft-action" onClick={() => notify('Fitur transfer antar dompet siap digunakan dari alur transaksi.')}>
          ↔ Transfer Antar Dompet
        </button>
        <button className="finverse-primary-button" onClick={() => setModalWallet({})}>
          <Plus size={16} /> Tambah Sumber Dana Baru
        </button>
      </div>
    </section>
    
    <div className="wallet-summary">
      <Summary 
        label="TOTAL SALDO TERKONSOLIDASI" 
        value={money(totalBalance)} 
        icon={<Landmark size={16} />} 
        note={wallets.length > 0 ? `${wallets.length} rekening aktif` : 'Belum ada dompet'} 
        tone="green" 
      />
      <Summary 
        label="LIKUIDITAS KAS & E-WALLET" 
        value={money(cashTotal)} 
        icon={<Smartphone size={16} />} 
        note={totalBalance > 0 ? `${((cashTotal / totalBalance) * 100).toFixed(1)}% dari Total` : '0% dari Total'} 
        tone="gold" 
      />
      <Summary 
        label="REKENING BANK & SIMPANAN" 
        value={money(bankTotal)} 
        icon={<Wallet size={16} />} 
        note={totalBalance > 0 ? `${((bankTotal / totalBalance) * 100).toFixed(1)}% dari Total` : '0% dari Total'} 
        tone="neutral" 
      />
    </div>
    
    <section className="wallet-list-section">
      <div className="wallet-list-heading">
        <div>
          <h3>Daftar Dompet &amp; Rekening Aktif</h3>
          <p>{filtered.length} rekening aktif terhubung dengan otorisasi aman perbankan Econary.</p>
        </div>
        <div className="wallet-list-tools">
          <button><Filter size={15} /></button>
          <button><SlidersHorizontal size={15} /></button>
        </div>
      </div>
      
      {loading ? (
        <div className="wallet-loading">Memuat dompet...</div>
      ) : wallets.length === 0 ? (
        <div style={{ 
          padding: '60px 20px', 
          textAlign: 'center', 
          background: '#f8f6f0', 
          borderRadius: '16px',
          border: '1px solid #e8e5dd',
          color: '#6f736b',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontWeight: '600', color: '#4b4f48', fontSize: '18px', fontFamily: 'Georgia, serif' }}>
            Belum Ada Dompet atau Rekening
          </h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '13px', lineHeight: '1.6', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
            Mulai kelola keuangan Anda dengan menambahkan dompet pertama.<br />
            Anda dapat menambahkan rekening bank, e-wallet (OVO, GoPay, DANA),<br />
            kartu kredit, atau kas tunai untuk pencatatan yang lebih terstruktur.
          </p>
          <button 
            className="finverse-primary-button" 
            onClick={() => setModalWallet({})}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Tambah Dompet Pertama
          </button>
        </div>
      ) : (
        <div className="wallet-card-grid">
          {filtered.map((wallet) => (
            <WalletCard 
              key={wallet.id} 
              wallet={wallet} 
              onEdit={() => openEdit(wallet)} 
              onDelete={() => handleDelete(wallet)} 
              onAction={(action) => notify(`${action} untuk ${wallet.name}.`)} 
            />
          ))}
          <button className="connect-card" onClick={() => setModalWallet({})}>
            <span><Plus size={22} /></span>
            <b>Sambungkan Rekening Baru</b>
            <p>Mendukung integrasi BCA, BNI, BRI, OVO, DANA, ShopeePay, &amp; Kas Kustom</p>
            <strong>Mulai Hubungkan →</strong>
          </button>
        </div>
      )}
    </section>
    <div className="wallet-lower">
      <section className="flow-card">
        <div className="wallet-lower-heading">
          <div>
            <h3>Arus Mutasi Antar Dompet</h3>
            <p>Aktivitas transfer saldo dan pergeseran likuiditas terkini</p>
          </div>
          <button onClick={() => notify('Menampilkan semua arus mutasi.')}>Lihat Semua →</button>
        </div>
        {transactions.length > 0 ? (
          transactions.map((tx, index) => {
            const isIncome = tx.type === 'income';
            const isTransfer = tx.type === 'transfer';
            const icon = isIncome ? <ArrowDown size={16} /> : isTransfer ? <ArrowLeftRight size={16} /> : <Banknote size={16} />;
            const title = tx.note || tx.category?.name || 'Transaksi';
            const sub = `${format(new Date(tx.date), 'dd MMM yyyy', { locale: id })} • ${tx.wallet?.name || 'Dompet'}`;
            const amount = `${isIncome ? '+' : ''}${money(tx.amount)}`;
            const tag = isIncome ? 'Masuk' : isTransfer ? 'Transfer' : 'Keluar';
            
            return (
              <FlowRow 
                key={tx.id || index} 
                icon={icon} 
                title={title} 
                sub={sub} 
                amount={amount} 
                tag={tag} 
                positive={isIncome} 
              />
            );
          })
        ) : (
          <div className="flow-empty" style={{ 
            padding: '40px 20px', 
            textAlign: 'center', 
            background: '#f8f6f0', 
            borderRadius: '12px',
            color: '#6f736b'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#4b4f48', fontSize: '14px' }}>
              Belum Ada Aktivitas Mutasi Dompet
            </p>
            <p style={{ margin: '0', fontSize: '12px', lineHeight: '1.5' }}>
              Riwayat transfer, pemasukan, dan pergeseran saldo antar dompet<br />
              akan ditampilkan di sini setelah Anda melakukan transaksi.
            </p>
          </div>
        )}
      </section>
      
      <section className="liquidity-card-wallet">
        <div className="wallet-lower-heading">
          <h3>Alokasi Likuiditas Econary</h3>
          <span>◉</span>
        </div>
        <p>
          Proporsi persebaran dana aktif berdasarkan profil keuangan freelance &amp; 
          kebutuhan operasional bulanan Anda.
        </p>
        
        {wallets.length > 0 ? (
          <>
            <div className="liquidity-bar">
              <i style={{ width: `${bankPercent}%` }} />
              <i style={{ width: `${ewalletPercent}%` }} />
              <i style={{ width: `${cashPercent}%` }} />
            </div>
            <div className="liquidity-legend">
              <span>● Bank ({bankPercent}%)</span>
              <span>● E-Wallet ({ewalletPercent}%)</span>
              <span>● Kas ({cashPercent}%)</span>
            </div>
            <div className="liquidity-mini">
              <div>
                <small>Likuiditas Segera</small>
                <b>{money(cashTotal)}</b>
                <span>Siap belanja/QRS</span>
              </div>
              <div>
                <small>Simpanan Aman</small>
                <b>{money(bankTotal)}</b>
                <span>Simpanan cadangan</span>
              </div>
            </div>
            <div className="wallet-tip">
              💡 <span>
                <b>Rekomendasi Persona Econary</b><br />
                Jaga minimal <strong>20%</strong> kas likuid di e-wallet untuk kelancaran transportasi harian.
              </span>
            </div>
          </>
        ) : (
          <div style={{ 
            padding: '40px 20px', 
            textAlign: 'center', 
            background: '#f8f6f0', 
            borderRadius: '12px',
            color: '#6f736b',
            marginTop: '20px'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#4b4f48', fontSize: '14px' }}>
              Belum Ada Data Alokasi Likuiditas
            </p>
            <p style={{ margin: '0', fontSize: '12px', lineHeight: '1.5' }}>
              Grafik alokasi dana akan muncul setelah Anda menambahkan<br />
              minimal satu dompet atau rekening ke sistem Econary.
            </p>
          </div>
        )}
      </section>
    </div>
    
    {message && <div className="budget-toast">{message}</div>}
    {modalWallet && (
      <WalletModal 
        wallet={modalWallet.id ? modalWallet : null} 
        onClose={() => setModalWallet(null)} 
        onSuccess={() => { 
          setModalWallet(null); 
          fetchWallets(); 
          notify('Sumber dana berhasil disimpan.'); 
        }} 
      />
    )}
  </div>;
}

function Summary({ label, value, icon, note, tone }) { return <article className="wallet-summary-card"><div><span>{label}</span><i className={tone}>{icon}</i></div><h3>{value}</h3><p className={tone}>{note}</p></article>; }
function WalletCard({ wallet, onEdit, onDelete, onAction }) { const Icon = typeIcons[wallet.type] || Wallet; return <article className="wallet-card"><div className="wallet-card-head"><div className={`wallet-icon ${wallet.tone || 'green'}`}><Icon size={18} /></div><div className="wallet-card-name"><h4>{wallet.name}</h4><p>{wallet.description || 'Sumber dana terhubung'}</p></div><span className={`wallet-badge ${wallet.tone || 'green'}`}>{wallet.badge || 'Aktif'}</span></div><small className="wallet-balance-label">SALDO TERSEDIA</small><strong className="wallet-balance">{money(wallet.balance)}</strong><div className="wallet-meta"><p><span>Nomor Rekening:</span><b>*** {wallet.id.slice(-8)}</b></p><p><span>Status:</span><b className="verified">◉ Terverifikasi</b></p></div><div className="wallet-actions"><button onClick={() => onAction('Mutasi')}>Mutasi</button><button onClick={() => onAction('Transfer')}>Transfer</button><button onClick={onEdit}>Edit</button><button className="danger-action" aria-label="Hapus dompet" onClick={onDelete}><EllipsisVertical size={15} /></button></div></article>; }
function FlowRow({ icon, title, sub, amount, tag, positive }) { return <div className="flow-row"><span className="flow-icon">{icon}</span><div><b>{title}</b><small>{sub}</small></div><strong className={positive ? 'positive' : ''}>{amount}<em>{tag}</em></strong></div>; }
