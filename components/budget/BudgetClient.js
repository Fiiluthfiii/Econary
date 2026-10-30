'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bell, CalendarDays, Check, ChevronRight, CircleCheck, Copy, Lightbulb, Plus, Settings2, Sparkles, WalletCards } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import BudgetModal from './BudgetModal';

const money = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

export default function BudgetClient({ userId, userName: initialUserName }) {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalBudget, setModalBudget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState(initialUserName || 'User');

  // Calculate totals from real budget data
  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget * 100).toFixed(1) : 0;
  const remainingPercentage = totalBudget > 0 ? (remaining / totalBudget * 100).toFixed(1) : 0;
  
  // Calculate days remaining in month
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysRemaining = Math.max(0, lastDayOfMonth.getDate() - now.getDate());
  
  // Daily budget calculations
  const avgDailySpent = totalSpent / (lastDayOfMonth.getDate() - daysRemaining);
  const safeDailyLimit = daysRemaining > 0 ? remaining / daysRemaining : 0;
  const reload = async () => {
    try {
      const [budgetResponse, categoryResponse, userResponse] = await Promise.all([
        fetch('/api/budgets'), 
        fetch('/api/categories'),
        fetch('/api/user/profile')
      ]);
      const budgetData = await budgetResponse.json(); 
      const categoryData = await categoryResponse.json();
      const userData = await userResponse.json();
      
      setBudgets(Array.isArray(budgetData) ? budgetData : budgetData.budgets || []);
      setCategories(categoryData.categories || []);
      setUserName(userData.user?.name || 'User');
    } catch (error) { 
      console.error('Gagal memuat anggaran:', error); 
    } finally { 
      setLoading(false); 
    }
  };
  useEffect(() => { reload(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => { setModalBudget(null); setModalOpen(true); };
  const showMessage = (text) => { setMessage(text); window.setTimeout(() => setMessage(''), 2600); };
  const copyPrevious = () => showMessage('Rancangan bulan lalu siap digunakan sebagai acuan.');
  const applyRecommendation = () => showMessage('Rekomendasi penghematan berhasil diterapkan.');
  
  // Find warning budgets (>70%)
  const warningBudgets = budgets.filter(b => b.amount > 0 && (b.spent / b.amount) >= 0.7);
  const criticalBudget = warningBudgets.find(b => (b.spent / b.amount) >= 0.85) || warningBudgets[0];

  return <div className="finverse-page budget-page">
    <header className="finverse-topbar budget-topbar">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="greeting">Halo, {userName}!</h1>
          <span className="sync-pill">● PostgreSQL Synced</span>
        </div>
        <p className="date-line">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}</p>
      </div>
      <div className="header-actions">
        <button className="finverse-primary-button" onClick={() => showMessage('Silakan gunakan tombol Atur Pos Anggaran Baru untuk membuat anggaran.')}>
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

    <section className="budget-hero">
      <div className="budget-hero-copy">
        <div className="hero-badges">
          <span>● {totalSpent <= totalBudget * 0.7 ? 'Sehat & Terkendali' : totalSpent <= totalBudget ? 'Perlu Perhatian' : 'Terlampaui'}</span>
          <span><CalendarDays size={13} /> {daysRemaining} Hari Tersisa Periode {format(now, 'MMMM', { locale: id })}</span>
        </div>
        <h2>Perencanaan Anggaran<br />&amp; Pos</h2>
        <p>Kelola pagu bulanan dan batasi pengeluaran secara proaktif untuk<br className="desktop-only" /> mengamankan tabungan serta kesehatan arus kas Anda.</p>
      </div>
      <div className="hero-actions">
        <button className="soft-action" onClick={copyPrevious}>
          <Copy size={15} /> Salin dari Bulan Lalu
        </button>
        <button className="finverse-primary-button" onClick={openNew}>
          <Plus size={16} /> Atur Pos Anggaran Baru
        </button>
      </div>
    </section>

    <div className="budget-summary">
      <SummaryCard 
        label="PAGU ANGGARAN TOTAL" 
        value={money(totalBudget)} 
        sub={`Target baseline Bulan ${format(now, 'MMMM yyyy', { locale: id })}`}
        percentage={totalBudget > 0 ? 100 : 0} 
        tone="green" 
        icon={<WalletCards size={16} />} 
      />
      <SummaryCard 
        label="TOTAL REALISASI TERPAKAI" 
        value={money(totalSpent)} 
        extra={`${spentPercentage}%`}
        sub={`Kecepatan rata-rata ${money(avgDailySpent)} / hari`}
        percentage={parseFloat(spentPercentage)} 
        tone="gold" 
        icon={<Sparkles size={16} />} 
      />
      <SummaryCard 
        label="SISA ANGGARAN AMAN" 
        value={money(remaining)} 
        extra={`${remainingPercentage}%`}
        sub={`Batas harian aman: ${money(safeDailyLimit)} / hari`}
        percentage={parseFloat(remainingPercentage)} 
        tone="green" 
        icon={<CircleCheck size={16} />} 
      />
    </div>

    <div className="budget-content">
      <section className="budget-list-section">
        <div className="section-heading">
            <h3><Settings2 size={18} /> Alokasi Pagu {budgets.length} Kategori</h3>
          <span>{budgets.length} Pos Terdaftar</span>
        </div>
        {loading ? (
          <div className="budget-loading">Memuat data anggaran...</div>
        ) : budgets.length > 0 ? (
          budgets.map((budget) => {
            const ratio = budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 1000) / 10 : 0;
            const remaining = Math.max(0, budget.amount - budget.spent);
            const dailyRemaining = daysRemaining > 0 ? remaining / daysRemaining : 0;
            
            // Determine status and tone
            let status, tone;
            if (ratio >= 85) {
              status = `Mendekati Batas (${Math.round(ratio)}%)`;
              tone = 'warning';
            } else if (ratio >= 70) {
              status = 'Perhatian';
              tone = 'neutral';
            } else if (ratio >= 50) {
              status = 'Aman';
              tone = 'safe';
            } else {
              status = 'Hemat';
              tone = 'safe';
            }
            
            return (
              <BudgetRow 
                key={budget.id} 
                budget={budget}
                ratio={ratio}
                remaining={remaining}
                dailyRemaining={dailyRemaining}
                status={status}
                tone={tone}
                onAdjust={() => {
                  setModalBudget(budget);
                  setModalOpen(true);
                }}
              />
            );
          })
        ) : (
          <div
            className="empty-state"
            role="button"
            tabIndex={0}
            onClick={openNew}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') openNew();
            }}
            style={{ padding: '40px', textAlign: 'center', background: '#fef3c7', borderRadius: '12px', cursor: 'pointer' }}
          >
            <p style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold', color: '#92400e' }}>
              Belum ada anggaran untuk bulan ini
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>
              Klik tombol <strong>&quot;Atur Pos Anggaran Baru&quot;</strong> untuk membuat anggaran pertama Anda
            </p>
          </div>
        )}
      </section>
      <aside className="budget-insights">
        {criticalBudget ? (
          <section className="warning-card">
            <div className="insight-heading">
              <div className="warning-icon"><AlertTriangle size={18} /></div>
              <div>
                <small>PERINGARAN OTOMATIS<br />(EARLY WARNING)</small>
                <b>Pos {criticalBudget.category?.name}<br />Mendekati Batas</b>
              </div>
            </div>
            <p>
              Pengeluaran pos {criticalBudget.category?.name} telah menyentuh {Math.round((criticalBudget.spent / criticalBudget.amount) * 100)}% dari batas bulanan. 
              Dengan {daysRemaining} hari tersisa, disarankan untuk menghemat pengeluaran kategori ini.
            </p>
            <div className="warning-meta">
              <span>
                Sisa budget: <b>{money(Math.max(0, criticalBudget.amount - criticalBudget.spent))}</b>
              </span>
              <button onClick={() => showMessage('Detail transaksi kategori ini dibuka.')}>
                Detail Transaksi <ChevronRight size={13} />
              </button>
            </div>
          </section>
        ) : budgets.length > 0 && (
          <section className="warning-card" style={{ background: '#d1fae5' }}>
            <div className="insight-heading">
              <div className="warning-icon" style={{ background: '#10b981' }}>
                <CircleCheck size={18} />
              </div>
              <div>
                <small>STATUS BUDGET</small>
                <b>Semua Pos<br />Terkendali</b>
              </div>
            </div>
            <p>
              Selamat! Semua kategori anggaran Anda masih dalam batas aman. 
              Pertahankan pola pengeluaran ini hingga akhir bulan.
            </p>
          </section>
        )}
        <section className="persona-card">
          <div className="insight-title">
            <h3><Sparkles size={17} /> Aturan Budget Persona</h3>
            <span>FREELANCER<br />/ MHS</span>
          </div>
          <p>Rekomendasi formula adaptif berbasis pendapatan non-tetap untuk menjaga likuiditas di masa transisi semester.</p>
          <div className="persona-rules">
            <p><b>Primer (50%)</b><strong>{money(totalBudget * 0.5)}</strong></p>
            <p><b>Keinginan (30%)</b><strong>{money(totalBudget * 0.3)}</strong></p>
            <p><b>Tabungan (20%)</b><strong>{money(totalBudget * 0.2)}</strong></p>
          </div>
          {remaining > 0 && (
            <div className="ai-note">
              <b>◎ Optimasi Cerdas Econary AI</b>
              <p>
                Sisa anggaran {money(remaining)} memungkinkan Anda memindahkan {money(Math.min(remaining * 0.2, remaining))} langsung ke Target Tabungan Dana Darurat Freelance.
              </p>
              <button onClick={applyRecommendation}>
                <Sparkles size={14} /> Terapkan Rekomendasi Penghematan AI
              </button>
            </div>
          )}
        </section>
        <section className="tips-card"><h3><Lightbulb size={18} /> Tips Penghematan Pekan Terakhir</h3><ul><li>Manfaatkan makanan beku atau masak bersama rekan kos untuk menekan pos Makanan.</li><li>Tunda aktivasi langganan software hiburan berbayar hingga tanggal 1 bulan depan.</li></ul></section></aside>
    </div>
    {message && <div className="budget-toast">{message}</div>}
    {modalOpen && <BudgetModal budget={modalBudget} categories={categories} onClose={() => setModalOpen(false)} onSuccess={() => { setModalOpen(false); reload(); showMessage('Anggaran berhasil disimpan.'); }} />}
  </div>;
}

function SummaryCard({ label, value, extra, sub, percentage, tone, icon }) { 
  // Fix: when percentage is 0, undefined, or NaN, show 0% width
  const safePercentage = (percentage && !isNaN(percentage)) ? percentage : 0;
  return <article className="budget-stat"><div className="stat-top"><span>{label}</span><i className={tone}>{icon}</i></div><h3 className={tone === 'green' && label.includes('SISA') ? 'positive' : ''}>{value} {extra && <small>{extra}</small>}</h3><p>{sub}</p><div className={`stat-progress ${tone}`}><i style={{ width: `${safePercentage}%` }} /></div></article>; 
}
function BudgetRow({ budget, ratio, remaining, dailyRemaining, status, tone, onAdjust }) { 
  return (
    <article className="budget-row">
      <div className={`budget-row-icon ${tone}`}>
        {budget.category?.icon || '💰'}
      </div>
      <div className="budget-row-main">
        <div className="budget-row-head">
          <div>
            <h4>
              {budget.category?.name || 'Kategori'} 
              <span className={`status-pill ${tone}`}>{status}</span>
            </h4>
            <p>Pagu {money(budget.amount)} • Terpakai {money(budget.spent)}</p>
          </div>
          <div className="quota">
            <small>SISA KUOTA</small>
            <b>{money(remaining)}</b>
            <button onClick={onAdjust}>
              Sesuaikan <Settings2 size={12} />
            </button>
          </div>
        </div>
        <div className="row-track">
          <i className={tone} style={{ width: `${Math.min(ratio, 100)}%` }} />
        </div>
        <div className="row-footer">
          <span>Sisa harian: {money(dailyRemaining)} / hari</span>
          <b>{ratio}% terpakai</b>
        </div>
      </div>
    </article>
  );
}
