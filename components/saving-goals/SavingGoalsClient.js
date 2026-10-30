'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, Calculator, CalendarDays, CheckCircle, ChevronDown, Clock3, Copy, CreditCard, Landmark, Lightbulb, Plus, Rocket, Shield, SlidersHorizontal, Sparkles, Target, TrendingUp, WalletCards } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import SavingGoalModal from '@/components/budget/SavingGoalModal';
import SavingTransactionModal from '@/components/budget/SavingTransactionModal';

const money = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

export default function SavingGoalsClient({ userName }) {
  const [goals, setGoals] = useState([]); 
  const [wallets, setWallets] = useState([]); 
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [goalModal, setGoalModal] = useState(null); 
  const [depositGoal, setDepositGoal] = useState(null); 
  const [message, setMessage] = useState(''); 
  const [simulated, setSimulated] = useState(500000);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'percentage', 'amount'
  
  // Calculate from REAL database data only
  const totalSaved = goals.reduce((sum, goal) => sum + Number(goal.savedAmount || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.targetAmount || 0), 0);
  
  // Sort goals based on sortBy state
  const sortedGoals = [...goals].sort((a, b) => {
    if (sortBy === 'date') {
      // Sort by targetDate (closest first)
      return new Date(a.targetDate) - new Date(b.targetDate);
    } else if (sortBy === 'percentage') {
      // Sort by completion percentage (highest first)
      const percentA = (a.savedAmount / a.targetAmount) * 100;
      const percentB = (b.savedAmount / b.targetAmount) * 100;
      return percentB - percentA;
    } else if (sortBy === 'amount') {
      // Sort by target amount (highest first)
      return b.targetAmount - a.targetAmount;
    }
    return 0;
  });
  const percent = totalTarget > 0 ? Math.min(100, (totalSaved / totalTarget) * 100) : 0;
  const notify = (text) => { setMessage(text); window.setTimeout(() => setMessage(''), 2600); };

  const fetchData = async () => { 
    try { 
      const [goalRes, walletRes] = await Promise.all([
        fetch('/api/saving-goals'), 
        fetch('/api/wallets')
      ]); 
      const goalData = await goalRes.json(); 
      const walletData = await walletRes.json(); 
      const actualGoals = Array.isArray(goalData) ? goalData : goalData.goals || []; 
      setGoals(actualGoals); 
      setWallets(Array.isArray(walletData) ? walletData : walletData.wallets || []); 
      if (actualGoals[0]?.id) { 
        const txRes = await fetch(`/api/saving-goals/${actualGoals[0].id}/transactions`); 
        const txData = await txRes.json(); 
        setHistory(Array.isArray(txData) ? txData : []); 
      } 
    } catch (error) { 
      console.error('Gagal memuat target tabungan:', error); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const closeGoalModal = () => setGoalModal(null);
  const openDeposit = (goal) => { 
    setDepositGoal(goal); 
  };
  
  const cycleSortBy = () => {
    if (sortBy === 'date') {
      setSortBy('percentage');
      notify('Diurutkan berdasarkan: Persentase Tertinggi');
    } else if (sortBy === 'percentage') {
      setSortBy('amount');
      notify('Diurutkan berdasarkan: Target Terbesar');
    } else {
      setSortBy('date');
      notify('Diurutkan berdasarkan: Prioritas Terdekat');
    }
  };
  
  const sortLabel = sortBy === 'date' 
    ? 'Prioritas Terdekat' 
    : sortBy === 'percentage' 
      ? 'Persentase Tertinggi' 
      : 'Target Terbesar';

  const now = new Date();

  return <div className="finverse-page saving-page">
    <header className="finverse-topbar saving-topbar">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="greeting">Halo, {userName}!</h1>
          <span className="sync-pill">● PostgreSQL Synced</span>
        </div>
        <p className="date-line">{format(now, 'EEEE, dd MMMM yyyy', { locale: id })}</p>
      </div>
      <div className="header-actions">
        <button className="finverse-primary-button" onClick={() => notify('Gunakan tombol Buat Target Baru untuk mengatur target tabungan.')}>
          <Plus size={16} /> Tambah Transaksi
        </button>
        <button className="header-icon" aria-label="Notifikasi">
          <Bell size={18} />
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
    <div className="saving-layout-top">
      <section className="saving-hero">
        <div className="saving-hero-copy">
          <div className="hero-badges">
            <span>◒ Fokus Finansial {now.getFullYear()}</span>
            <span>Sinkronisasi Database Aktif</span>
          </div>
          <h2>Target Tabungan &amp; Dana Impian</h2>
          <p>Wujudkan target finansial terukur untuk kebutuhan akademik<br className="desktop-only" /> mahasiswa dan masa depan mandiri freelancer.</p>
          <div className="saving-total">
            <strong>{money(totalSaved)}</strong>
            <span>dari Target {money(totalTarget)}</span>
          </div>
          <div className="saving-progress">
            <i style={{ width: `${percent}%` }} />
          </div>
          <div className="saving-progress-meta">
            <b>{percent.toFixed(1)}% Tercapai</b>
            <span>⌁ Alokasi Rutin: +{money(simulated)}/bln</span>
          </div>
        </div>
        <div className="saving-hero-actions">
          <button className="soft-action" onClick={() => notify('Kalkulator proyeksi siap digunakan.')}>
            <Calculator size={15} /> Kalkulator Proyeksi
          </button>
          <button className="finverse-primary-button" onClick={() => setGoalModal({})}>
            <Plus size={16} /> Buat Target Baru
          </button>
        </div>
      </section>
      <LiquidityCard goals={goals} totalSaved={totalSaved} />
    </div>
    
    <section className="goals-section">
      <div className="section-heading">
        <h3>Target Berjalan <span>{goals.length} Aktif</span></h3>
        <button className="sort-button" onClick={cycleSortBy}>
          Urutkan: {sortLabel} <ChevronDown size={14} />
        </button>
      </div>
      {loading ? (
        <div className="budget-loading">Memuat target tabungan...</div>
      ) : sortedGoals.length > 0 ? (
        <div className="goal-grid">
          {sortedGoals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onDeposit={() => openDeposit(goal)} 
              onDetail={() => notify(`Detail alokasi: ${goal.name}`)} 
            />
          ))}
        </div>
      ) : (
        <div className="budget-empty">
          <p>Belum ada target tabungan yang dibuat.</p>
          <p>Klik tombol &quot;Buat Target Baru&quot; untuk membuat target tabungan pertama Anda.</p>
        </div>
      )}
    </section>
    <div className="saving-lower">
      <section className="simulator-card">
        <div className="saving-card-heading">
          <div>
            <h3><SlidersHorizontal size={18} /> Simulator Tabungan Fleksibel</h3>
            <p>Eksplorasi percepatan target dengan menekan pos pengeluaran sekunder.</p>
          </div>
          <span>Simulasi Real-time</span>
        </div>
        <div className="simulator-inner">
          <div className="simulator-value">
            <b>Pindahkan ekstra dari pos hiburan/kopi bulanan:</b>
            <strong>{money(simulated)} / bln</strong>
          </div>
          <input 
            type="range" 
            min="100000" 
            max="1500000" 
            step="50000" 
            value={simulated} 
            onChange={(event) => setSimulated(Number(event.target.value))} 
          />
          <div className="range-labels">
            <span>Rp 100.000</span>
            <span>Rp 750.000</span>
            <span>Rp 1.500.000</span>
          </div>
          <div className="simulator-result">
            <Rocket size={22} />
            <p>
              Dampak Terhadap Target {goals[0]?.name || 'Pertama'}:<br />
              <b>Target tercapai <em>{simulated >= 750000 ? '2 bulan lebih cepat' : 'lebih cepat'}</em>!</b>
            </p>
          </div>
        </div>
        <div className="autodebit-row">
          <span>● Autodebit Cerdas ke Rekening Khusus:</span>
          <span>Terkoneksi PostgreSQL Econary DB</span>
          <button onClick={() => notify('Skema autodebit dibuka.')}>Kelola Skema →</button>
        </div>
      </section>
      <HistoryCard history={history} onView={() => notify('Riwayat setoran lengkap dibuka.')} />
    </div>
    
    {message && <div className="budget-toast">{message}</div>}
    {goalModal && (
      <SavingGoalModal 
        savingGoal={goalModal.id ? goalModal : null} 
        onClose={closeGoalModal} 
        onSuccess={() => { 
          closeGoalModal(); 
          fetchData(); 
          notify('Target tabungan berhasil disimpan.'); 
        }} 
      />
    )}
    {depositGoal && (
      <SavingTransactionModal 
        type="deposit" 
        savingGoal={depositGoal} 
        wallets={wallets} 
        onClose={() => setDepositGoal(null)} 
        onSuccess={() => { 
          setDepositGoal(null); 
          fetchData(); 
          notify('Setoran berhasil disimpan.'); 
        }} 
      />
    )}
  </div>;
}

function LiquidityCard({ goals, totalSaved }) { 
  // Calculate liquidity ratio from REAL goals
  const emergencyGoals = goals.filter(g => 
    g.name?.toLowerCase().includes('darurat') || 
    g.name?.toLowerCase().includes('emergency') ||
    g.description?.toLowerCase().includes('darurat')
  );
  const workGoals = goals.filter(g => 
    g.name?.toLowerCase().includes('laptop') || 
    g.name?.toLowerCase().includes('freelance') ||
    g.name?.toLowerCase().includes('kerja')
  );
  
  const emergencyAmount = emergencyGoals.reduce((sum, g) => sum + Number(g.savedAmount || 0), 0);
  const workAmount = workGoals.reduce((sum, g) => sum + Number(g.savedAmount || 0), 0);
  
  const emergencyRatio = totalSaved > 0 ? Math.round((emergencyAmount / totalSaved) * 100) : 0;
  const workRatio = totalSaved > 0 ? Math.round((workAmount / totalSaved) * 100) : 0;
  
  // Create dynamic conic-gradient based on real ratios
  const ringGradient = totalSaved > 0 
    ? `radial-gradient(closest-side, #f4f1e9 78%, transparent 79% 99%), conic-gradient(#80672d 0 ${emergencyRatio}%, #dedacf ${emergencyRatio}%)`
    : 'radial-gradient(closest-side, #f4f1e9 78%, transparent 79% 99%), conic-gradient(#dedacf 0 100%)';
  
  return (
    <section className="liquidity-card">
      <div className="liquidity-heading">
        <div>
          <small>RASIO SEHAT</small>
          <h3>Kekuatan Likuiditas</h3>
        </div>
        <Shield size={20} />
      </div>
      <div className="liquidity-ring" style={{ background: ringGradient }}>
        <div>
          <b>{emergencyRatio} / {workRatio}</b>
          <small>Rasio Alokasi</small>
        </div>
      </div>
      <div className="ratio-list">
        {emergencyGoals.length > 0 && (
          <p>
            <span>● Darurat &amp; Skripsi</span>
            <b>{money(emergencyAmount)}</b>
          </p>
        )}
        {workGoals.length > 0 && (
          <p>
            <span>● Alat Freelance</span>
            <b>{money(workAmount)}</b>
          </p>
        )}
        {emergencyGoals.length === 0 && workGoals.length === 0 && (
          <p>
            <span>● Total Tabungan</span>
            <b>{money(totalSaved)}</b>
          </p>
        )}
      </div>
    </section>
  ); 
}
function GoalCard({ goal, onDeposit, onDetail }) { 
  const saved = Number(goal.savedAmount || goal.saved || 0); 
  const target = Number(goal.targetAmount || goal.target || 1); 
  const percentage = Math.min(100, (saved / target) * 100); 
  
  // Calculate time remaining from targetDate
  let timeRemaining = 'Belum ditentukan';
  let estimatedDateText = 'Belum ditentukan';
  
  if (goal.targetDate) {
    const targetDate = new Date(goal.targetDate);
    const now = new Date();
    const monthsDiff = Math.round((targetDate - now) / (1000 * 60 * 60 * 24 * 30));
    
    if (monthsDiff > 0) {
      timeRemaining = `${monthsDiff} Bulan lagi`;
    } else if (monthsDiff === 0) {
      timeRemaining = 'Bulan ini';
    } else {
      timeRemaining = 'Sudah lewat';
    }
    
    estimatedDateText = format(targetDate, 'MMMM yyyy', { locale: id });
  }
  
  // Determine tone based on percentage
  let tone = 'green';
  if (percentage >= 85) {
    tone = 'green';
  } else if (percentage >= 50) {
    tone = 'gold';
  } else {
    tone = 'gold';
  }
  
  return (
    <article className="goal-card">
      <div className="goal-card-top">
        <div className="goal-icon">{goal.icon || '◎'}</div>
        <div className="goal-name">
          <div>
            <span>{goal.badge || 'Target Finansial'}</span>
            <span className="status-tag">● {goal.status || 'Aktif'}</span>
          </div>
          <h4>{goal.name}</h4>
          <p>{goal.description || 'Target finansial pribadi'}</p>
        </div>
      </div>
      <div className="goal-amount">
        <strong>{money(saved)}</strong>
        <b>{percentage.toFixed(1)}%</b>
      </div>
      <div className="goal-track">
        <i className={tone} style={{ width: `${percentage}%` }} />
      </div>
      <div className="goal-sub">
        <span>Terkumpul</span>
        <span>Target: {money(target)}</span>
      </div>
      <div className="goal-details">
        <p>
          <CalendarDays size={14} /> Estimasi Tercapai <b>{estimatedDateText}</b>
        </p>
        <p>
          <Clock3 size={14} /> Waktu Tersisa <b>{timeRemaining}</b>
        </p>
        <p>
          <Landmark size={14} /> Kantong Simpanan <b>{goal.method || goal.wallet?.name || 'Dompet Utama'}</b>
        </p>
      </div>
      <div className="goal-actions">
        <button onClick={onDetail}>Detail Alokasi</button>
        <button onClick={onDeposit}>
          <Plus size={14} /> Setor
        </button>
      </div>
    </article>
  ); 
}
function HistoryCard({ history, onView }) { 
  // Use REAL history data only - NO fallback
  const rows = history.length > 0 
    ? history.slice(0, 3).map((tx) => ({ 
        name: tx.wallet?.name || 'Dompet Tabungan', 
        note: tx.note || 'Setoran target', 
        amount: Number(tx.amount), 
        date: format(new Date(tx.date), 'dd MMM yyyy', { locale: id })
      })) 
    : [];
  
  const monthTotal = history.reduce((sum, tx) => {
    const txDate = new Date(tx.date);
    const now = new Date();
    if (txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()) {
      return sum + Number(tx.amount || 0);
    }
    return sum;
  }, 0);
  
  return (
    <section className="history-card">
      <div className="saving-card-heading">
        <h3>
          <Clock3 size={18} /> Histori Setoran<br />Terakhir
        </h3>
        <button onClick={onView}>Lihat<br />Semua</button>
      </div>
      {rows.length > 0 ? (
        <>
          <div className="history-list">
            {rows.map((row, index) => (
              <div className="history-item" key={`${row.name}-${index}`}>
                <span>
                  {index === 1 ? <CreditCard size={17} /> : <Landmark size={17} />}
                </span>
                <div>
                  <b>{row.name}</b>
                  <small>{row.note}</small>
                </div>
                <strong>
                  +{money(row.amount)}
                  <small>{row.date}</small>
                </strong>
              </div>
            ))}
          </div>
          <div className="history-total">
            <span><CheckCircle size={15} /> Terverifikasi Otomatis</span>
            <b>Total Bulan Ini: +{money(monthTotal)}</b>
          </div>
        </>
      ) : (
        <div className="history-list">
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            <p>Belum ada histori setoran.</p>
            <p>Mulai setor ke target tabungan Anda.</p>
          </div>
        </div>
      )}
    </section>
  ); 
}
