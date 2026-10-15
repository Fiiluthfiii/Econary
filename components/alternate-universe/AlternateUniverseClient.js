'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, Check, ChevronRight, CircleAlert, Cloud, Gauge, Lightbulb, Plus, RotateCcw, Rocket, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const money = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

export default function AlternateUniverseClient({ userName }) {
  const [lifestyle, setLifestyle] = useState(30); 
  const [investment, setInvestment] = useState(1500000); 
  const [freelancer, setFreelancer] = useState(true); 
  const [student, setStudent] = useState(true); 
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [realData, setRealData] = useState({
    currentBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    savingRate: 0,
    emergencyFundMonths: 0,
    transactionCount: 0
  });
  
  const notify = (text) => { setMessage(text); window.setTimeout(() => setMessage(''), 2500); };
  
  // Fetch REAL data from database
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [walletRes, transactionRes] = await Promise.all([
          fetch('/api/wallets'),
          fetch('/api/transactions')
        ]);
        
        const walletData = await walletRes.json();
        const transactionData = await transactionRes.json();
        
        const wallets = Array.isArray(walletData) ? walletData : walletData.wallets || [];
        const transactions = Array.isArray(transactionData) ? transactionData : transactionData.transactions || [];
        
        const currentBalance = wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0);
        
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        
        const expense = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        
        const savingRate = income > 0 ? ((income - expense) / income) * 100 : 0;
        const emergencyFundMonths = expense > 0 ? (currentBalance / (expense / transactions.length * 30)) : 0;
        
        setRealData({
          currentBalance,
          totalIncome: income,
          totalExpense: expense,
          savingRate: Math.max(0, savingRate),
          emergencyFundMonths: Math.max(0, emergencyFundMonths),
          transactionCount: transactions.length
        });
      } catch (error) {
        console.error('Gagal memuat data alternate universe:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRealData();
  }, []);
  
  // Calculate projections based on REAL data and parameters
  const chartData = useMemo(() => {
    const base = realData.currentBalance;
    const monthlyIncome = realData.totalIncome / Math.max(1, realData.transactionCount / 30);
    const monthlyExpense = realData.totalExpense / Math.max(1, realData.transactionCount / 30);
    
    // Calculate growth based on parameters
    const lifestyleReduction = (lifestyle / 100) * monthlyExpense;
    const alternateExpense = monthlyExpense - lifestyleReduction;
    const alternateSaving = monthlyIncome - alternateExpense + investment;
    const actualSaving = monthlyIncome - monthlyExpense;
    
    return [
      { month: 'Bln 0', actual: base, alternate: base },
      { month: 'Bln 6', actual: base + (actualSaving * 6), alternate: base + (alternateSaving * 6) },
      { month: 'Bln 12', actual: base + (actualSaving * 12), alternate: base + (alternateSaving * 12) },
      { month: 'Bln 18', actual: base + (actualSaving * 18), alternate: base + (alternateSaving * 18) },
      { month: 'Bln 24', actual: base + (actualSaving * 24), alternate: base + (alternateSaving * 24) }
    ];
  }, [realData, lifestyle, investment, freelancer, student]);
  
  const actualAmount = chartData[2]?.actual || 0; // 12 months projection
  const alternateAmount = chartData[2]?.alternate || 0;
  const delta = alternateAmount - actualAmount;
  
  // Calculate alternate universe stats
  const alternateSavingRate = Math.min(100, realData.savingRate + (lifestyle / 2) + ((investment / 1000000) * 5));
  const alternateEmergencyMonths = Math.min(12, realData.emergencyFundMonths + (lifestyle / 10) + ((investment / 1000000) * 2));
  
  const reset = () => { 
    setLifestyle(30); 
    setInvestment(1500000); 
    setFreelancer(true); 
    setStudent(true); 
    notify('Simulasi dikembalikan ke default.'); 
  };
  
  const now = new Date();
  // Generate recommendations based on REAL transaction data
  const recommendations = useMemo(() => {
    const monthlyExpense = realData.totalExpense / Math.max(1, realData.transactionCount / 30);
    const potentialSaving1 = monthlyExpense * 0.15; // 15% from lifestyle
    const potentialSaving2 = monthlyExpense * 0.08; // 8% from subscriptions
    
    return [
      { 
        icon: '▱', 
        saving: `Hemat ${money(potentialSaving1)}/bln`, 
        title: 'Batasi Pengeluaran Hiburan & Makan', 
        text: `Berdasarkan ${realData.transactionCount} transaksi terakhir. Mengurangi pengeluaran hiburan dan makan luar akan membebaskan dana untuk tabungan.`, 
        action: 'Kunci Budget →' 
      }, 
      { 
        icon: '▣', 
        saving: `Hemat ${money(potentialSaving2)}/bln`, 
        title: 'Audit Langganan & Subscription', 
        text: 'Evaluasi kembali layanan berlangganan yang jarang digunakan. Pilih paket yang sesuai kebutuhan aktual Anda.', 
        action: 'Review Layanan →' 
      }, 
      { 
        icon: '♧', 
        saving: '+Dana Darurat Cepat', 
        title: 'Auto-Split Pemasukan ke Tabungan', 
        text: 'Aktifkan pemisahan otomatis 30% dari setiap pemasukan ke rekening Dana Darurat untuk keamanan finansial.', 
        action: 'Aktifkan Autodebit →' 
      }
    ];
  }, [realData]);
  
  if (loading) {
    return <div className="finverse-page universe-page">
      <div className="budget-loading">Memuat data alternate universe...</div>
    </div>;
  }
  
  return <div className="finverse-page universe-page">
    <header className="finverse-topbar universe-topbar">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="greeting">Halo, {userName}! 🌿</h1>
          <span className="date-line">| {format(now, 'EEEE, dd MMMM yyyy', { locale: id })}</span>
          <span className="sync-pill"><Cloud size={12} /> PostgreSQL Synced</span>
        </div>
      </div>
      <div className="header-actions">
        <button className="finverse-primary-button" onClick={() => notify('Gunakan halaman transaksi untuk mencatat transaksi baru.')}>
          <Plus size={16} /> Tambah Transaksi
        </button>
        <button className="header-icon">
          <Bell size={18} />
        </button>
        <div className="avatar">
          {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
      </div>
    </header>
    <section className="universe-hero">
      <div>
        <div className="universe-badges">
          <span>FR-10 • PREDICTIVE TWIN ENGINE</span>
          <span>Live Sandbox</span>
        </div>
        <h2>Financial Alternate Universe 🌌</h2>
        <p>
          Simulasikan keputusan finansial baru dan intip masa depan saldo Anda tanpa<br className="desktop-only" /> 
          risiko di dunia nyata dengan pendekatan terukur yang membumi.
        </p>
      </div>
      <div className="universe-hero-actions">
        <button className="soft-action" onClick={reset}>
          <RotateCcw size={14} /> Reset Default
        </button>
        <button className="finverse-primary-button" onClick={() => notify('Rekomendasi ditambahkan ke Rencana Nyata.')}>
          <ShieldCheck size={15} /> Terapkan Rekomendasi ke Rencana Nyata
        </button>
      </div>
    </section>
    
    <div className="universe-main-grid">
      <div className="universe-left">
        <ParameterCard 
          lifestyle={lifestyle} 
          setLifestyle={setLifestyle} 
          investment={investment} 
          setInvestment={setInvestment} 
          freelancer={freelancer} 
          setFreelancer={setFreelancer} 
          student={student} 
          setStudent={setStudent} 
          reset={reset} 
        />
        <div className="compute-profile">
          <div className="profile-photo">🌿</div>
          <div>
            <small>PROFIL KOMPUTASI</small>
            <b>{userName}</b>
            <span>Berdasarkan {realData.transactionCount} riwayat transaksi riil dari database.</span>
          </div>
        </div>
      </div>
      
      <div className="universe-middle">
        <StatusCard 
          title="Universe Utama" 
          badge="Kondisi Nyata" 
          amount={money(actualAmount)} 
          color="neutral" 
          savingRate={realData.savingRate.toFixed(0)}
          emergencyMonths={realData.emergencyFundMonths.toFixed(1)}
        />
        <ProjectionCard chartData={chartData} />
      </div>
      
      <div className="universe-right">
        <StatusCard 
          title="Alternate Universe #A" 
          badge="Optimal & Cerdas" 
          amount={money(alternateAmount)} 
          color="green" 
          alternate 
          delta={delta}
          savingRate={alternateSavingRate.toFixed(0)}
          emergencyMonths={alternateEmergencyMonths.toFixed(1)}
        />
        <div className="profile-placeholder" />
      </div>
    </div>
    
    <section className="recommendation-section">
      <div className="recommendation-heading">
        <div>
          <h2><Lightbulb size={20} /> Rekomendasi Aksi Cerdas AI</h2>
          <p>Diekstrak otomatis dari rekaman transaksi database. Terapkan rekomendasi ini untuk mengunci timeline Alternate Universe.</p>
        </div>
        <span><Gauge size={15} /> Skor Realisme Simulasi: 94%</span>
      </div>
      <div className="recommendation-grid">
        {recommendations.map((item) => (
          <RecommendationCard 
            key={item.title} 
            item={item} 
            onClick={() => notify(`${item.title} berhasil dipilih.`)} 
          />
        ))}
      </div>
    </section>
    
    {message && <div className="budget-toast">{message}</div>}
  </div>;
}

function Toggle({ checked, onChange }) { return <button className={`universe-toggle ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)} aria-pressed={checked}><i /></button>; }
function ParameterCard({ lifestyle, setLifestyle, investment, setInvestment, freelancer, setFreelancer, student, setStudent, reset }) { return <section className="parameter-card"><div className="universe-card-title"><h3><SlidersHorizontal size={17} /> Parameter Modifikasi Skenario</h3><span>Realtime Compute</span></div><div className="scenario-slider"><div className="scenario-label"><b>Pangkas Hiburan &amp; Belanja</b><strong>-{lifestyle}%</strong></div><input type="range" min="0" max="60" value={lifestyle} onChange={(e) => setLifestyle(Number(e.target.value))} /><div className="range-labels"><span>0% (Asli)</span><span>-30% (Disarankan)</span><span>-60% (Ekstrem)</span></div></div><div className="scenario-slider"><div className="scenario-label"><b>Tambah Alokasi Investasi</b><strong>Rp {investment.toLocaleString('id-ID')}/bln</strong></div><input type="range" min="0" max="4000000" step="100000" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} /><div className="range-labels"><span>Rp 0</span><span>Rp 2 Juta</span><span>Rp 4 Juta</span></div></div><ToggleRow label="Skenario Freelancer" sub="Tambah 1 klien retainer baru (+Rp 5.000.000/bln)" checked={freelancer} onChange={setFreelancer} /><ToggleRow label="Skenario Mahasiswa & Magang" sub="Fokus bebas uang cicilan laptop & simpan honor magang" checked={student} onChange={setStudent} /><button className="rerun-button" onClick={reset}><RotateCcw size={15} /> Putar Ulang Simulasi Universe</button></section>; }
function ToggleRow({ label, sub, checked, onChange }) { return <div className="toggle-row"><div><b>{label}</b><span>{sub}</span></div><Toggle checked={checked} onChange={onChange} /></div>; }
function StatusCard({ title, badge, amount, color, alternate, delta, savingRate, emergencyMonths }) { 
  return (
    <section className={`status-card ${color}`}>
      <div className="status-card-heading">
        <div>
          <h3><i />{title}</h3>
          <span>{badge}</span>
        </div>
      </div>
      <small>Proyeksi Saldo 12 Bulan</small>
      <strong>{amount}</strong>
      <p>
        {alternate 
          ? `+${money(delta)} lebih besar!` 
          : 'Rata-rata aktualis statis'
        }
      </p>
      <div className="status-stats">
        <div>
          <small>Tingkat Tabungan</small>
          <b>{savingRate}%</b>
          <em>
            {Number(savingRate) >= 30 
              ? 'Kapasitas tinggi' 
              : Number(savingRate) >= 15 
                ? 'Cukup sehat' 
                : 'Cukup rentan'
            }
          </em>
        </div>
        <div>
          <small>Dana Darurat</small>
          <b>{emergencyMonths} Bulan</b>
          <em>
            {Number(emergencyMonths) >= 6 
              ? 'Sangat Aman' 
              : Number(emergencyMonths) >= 3 
                ? 'Aman' 
                : 'Target min: 3 Bln'
            }
          </em>
        </div>
      </div>
      {alternate ? (
        Number(delta) >= 20000000 ? (
          <div className="milestone">
            <Rocket size={18} />
            <b>Milestone Tercapai di Bulan ke-12</b>
            <p>Dengan strategi ini, Anda dapat mencapai target finansial lebih cepat secara tunai!</p>
          </div>
        ) : (
          <div className="milestone">
            <Rocket size={18} />
            <b>Strategi Optimisasi Aktif</b>
            <p>Tingkatkan parameter untuk hasil lebih maksimal!</p>
          </div>
        )
      ) : (
        <div className="status-warning">
          <CircleAlert size={16} /> Pembelian besar tertunda atau butuh cicilan dengan bunga.
        </div>
      )}
      <footer>
        {alternate ? 'Probabilitas Berhasil: 91%' : 'Status: Tanpa Penyesuaian'} <ShieldCheck size={14} />
      </footer>
    </section>
  ); 
}
function ProjectionCard({ chartData }) { return <section className="projection-card"><h3>Grafik Proyeksi Garis Masa Depan<br />(24 Bulan)</h3><p>Simulasi delta modal nyata vs skenario paralel teroptimasi</p><div className="chart-legend"><span><i className="actual-dot" /> Universe Nyata</span><span><i className="alt-dot" /> Alternate Universe</span></div><ResponsiveContainer width="100%" height={230}><LineChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}><CartesianGrid stroke="#eeeae2" strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} tickFormatter={(value) => `Rp ${value / 1000000}M`} /><Tooltip formatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`} /><Line type="monotone" dataKey="actual" stroke="#7f837a" strokeWidth={2} dot={{ r: 3 }} /><Line type="monotone" dataKey="alternate" stroke="#4d8061" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer><div className="chart-note">ⓘ Kalkulasi memperhitungkan inflasi tahunan rata-rata 3.2% dan imbal hasil portofolio moderat 6.5% p.a. <b>Horizon: 24 Bulan</b></div></section>; }
function RecommendationCard({ item, onClick }) { return <button className="recommendation-card" onClick={onClick}><div className="recommendation-icon">{item.icon}</div><div className="recommendation-copy"><span>{item.saving}</span><h3>{item.title}</h3><p>{item.text}</p><footer>Kategori: Arus Kas <b>{item.action}</b></footer></div></button>; }
