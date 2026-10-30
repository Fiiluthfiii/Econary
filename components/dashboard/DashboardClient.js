'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Download, ArrowDownLeft, ArrowUpRight, WalletCards, ShieldCheck, ChevronRight, Plus, Sparkles, Bell } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/currency';

const colors = ['#c83232', '#4d8061', '#d0a653', '#75a987', '#696256', '#bfc5b7', '#d8d2c3'];
const initials = (name = 'User') => name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();

export default function DashboardClient({ data }) {
  const { 
    totalBalance, 
    income, 
    expenses, 
    transactions = [], 
    categoryExpenses = [], 
    monthlyData = [], 
    userName,
    prevMonthBalance = 0,
    prevMonthIncome = 0,
    prevMonthExpenses = 0
  } = data;
  
  // Calculate real percentages from database
  const balanceChange = prevMonthBalance > 0 
    ? (((totalBalance - prevMonthBalance) / prevMonthBalance) * 100).toFixed(1) 
    : '0.0';
  const balanceChangePositive = Number(balanceChange) >= 0;
  
  const incomeChange = prevMonthIncome > 0
    ? (((income - prevMonthIncome) / prevMonthIncome) * 100).toFixed(1)
    : '0.0';
  const incomeChangePositive = Number(incomeChange) >= 0;
  
  const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : '0.0';
  const savings = income - expenses;
  
  // Calculate projected savings (6 months based on current rate)
  const projectedSavings = savings * 6;
  
  // Calculate what 30% expense reduction would save
  const potentialSavings = (expenses * 0.30) * 6;
  
  const totalCategoryExpense = categoryExpenses.reduce((sum, item) => sum + item.value, 0);
  const averageIncome = monthlyData.length ? monthlyData.reduce((sum, item) => sum + item.income, 0) / monthlyData.length : 0;
  const averageExpense = monthlyData.length ? monthlyData.reduce((sum, item) => sum + item.expense, 0) / monthlyData.length : 0;
  const chartData = monthlyData.map((item) => ({ ...item, incomeMillions: item.income / 1000000, expenseMillions: item.expense / 1000000 }));
  const recentTransactions = transactions.slice(0, 5);
  const monthName = format(new Date(), 'MMMM yyyy', { locale: id });
  const categoryChart = useMemo(() => {
    if (!totalCategoryExpense) return 'conic-gradient(#e8e3d9 0 100%)';
    let cursor = 0;
    const stops = categoryExpenses.slice(0, 7).map((item, index) => { const next = cursor + (item.value / totalCategoryExpense) * 360; const stop = `${colors[index % colors.length]} ${cursor}deg ${next}deg`; cursor = next; return stop; });
    return `conic-gradient(${stops.join(', ')})`;
  }, [categoryExpenses, totalCategoryExpense]);

  return (
    <div className="finverse-page dashboard-page space-y-5">
      <div className="finverse-topbar"><div className="flex flex-wrap items-center gap-3 text-sm text-[#73766e]"><span className="font-semibold text-[#30332f]">Halo, {userName}!</span><span className="hidden sm:inline">|</span><span>{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}</span></div><div className="flex items-center gap-3"><Link href="/dashboard/transactions?action=add" className="finverse-primary-button hidden sm:flex"><Plus size={16} /> Tambah Transaksi</Link><button aria-label="Notifikasi" className="icon-button"><Bell size={18} /></button><div className="avatar">{initials(userName)}</div></div></div>

      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start"><div><h1 className="display-title">Halo, {userName}!<br /><span>👋</span></h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#73766e]">Ringkasan kesehatan finansial, simulasi proyeksi, dan arus kas multi-revenue aktif Anda per {monthName}.</p></div><div className="flex flex-wrap gap-2 xl:justify-end"><Link href="/dashboard/reports" className="finverse-outline-button"><Download size={15} /> Unduh Laporan</Link><Link href="/dashboard/alternate-universe" className="finverse-gold-button"><Sparkles size={15} /> Buka Simulasi Universe</Link><Link href="/dashboard/transactions?action=add" className="finverse-primary-button"><Plus size={15} /> Tambah Transaksi</Link></div></section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          label="Saldo Saat Ini" 
          value={formatCurrency(totalBalance)} 
          icon={<WalletCards size={17} />} 
          tone="green" 
          footer={
            <>
              <span className={balanceChangePositive ? "positive-chip" : "negative-chip"}>
                {balanceChangePositive ? '↗' : '↘'} {balanceChangePositive ? '+' : ''}{balanceChange}%
              </span> 
              <small>vs bulan lalu</small>
            </>
          } 
        />
        <StatCard 
          label="Total Pemasukan" 
          value={formatCurrency(income)} 
          icon={<ArrowDownLeft size={17} />} 
          tone="cream" 
          footer={
            <>
              <span className={incomeChangePositive ? "positive-chip" : "negative-chip"}>
                {incomeChangePositive ? '↗' : '↘'} {incomeChangePositive ? '+' : ''}{incomeChange}%
              </span>
              <small>vs bulan lalu</small>
            </>
          } 
        />
        <StatCard 
          label="Total Pengeluaran" 
          value={formatCurrency(expenses)} 
          icon={<ArrowUpRight size={17} />} 
          tone="red" 
          footer={
            <>
              <small>Saldo: {formatCurrency(Math.max(savings, 0))}</small>
            </>
          } 
          progress={income ? Math.min(expenses / income * 100, 100) : 0} 
        />
        <StatCard 
          label="Rasio Tabungan / Net" 
          value={`${savingsRate}%`} 
          icon={<ShieldCheck size={17} />} 
          tone="cream" 
          ring={`${Math.min(Number(savingsRate), 100)}%`} 
          footer={
            <>
              <b className={Number(savingsRate) >= 50 ? "text-[#4d8061]" : "text-[#c83232]"}>
                {Number(savingsRate) >= 50 ? 'Sehat' : 'Perlu Ditingkatkan'}
              </b>
              <small>(Target: &gt;50%)</small>
            </>
          } 
        />
      </section>

      <section className="universe-banner">
        <div className="timeline-icon">⌁</div>
        <div className="min-w-0 flex-1">
          <span className="timeline-label">ALTERNATE TIMELINE #1</span> 
          <small>Simulasi Prediktif Econary AI</small>
          <p className="mt-2 max-w-xl font-serif text-lg leading-6 md:text-xl">
            Jika Anda memangkas belanja impulsif & kopi kekinian sebesar <u>30%</u>, 
            saldo Anda diproyeksikan bertambah {formatCurrency(potentialSavings)} dalam 6 bulan ke depan!
          </p>
        </div>
        <Link href="/dashboard/alternate-universe" className="finverse-gold-button whitespace-nowrap">
          Jelajahi Universe <ChevronRight size={16} />
        </Link>
      </section>

      <section className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(270px,0.9fr)]"><div className="finverse-card"><div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h2 className="section-title">Arus Kas 6 Bulan Terakhir</h2><p className="section-subtitle">Perbandingan akumulasi pemasukan dan pengeluaran (Jan - Jun 2024)</p></div><div className="chart-legend"><span><i className="dot green-dot" />Pemasukan</span><span><i className="dot red-dot" />Pengeluaran</span><span><i className="dash-dot" />Universe Projection</span></div></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 8, right: 5, bottom: 0, left: -20 }}><CartesianGrid vertical={false} stroke="#ece8df" /><XAxis dataKey="month" tick={{ fontSize: 11, fill: '#74776f' }} axisLine={false} tickLine={false} /><YAxis hide /><Tooltip formatter={(value) => [`Rp ${Number(value).toFixed(2)}jt`, '']} contentStyle={{ border: '1px solid #e7e2d8', borderRadius: 10, fontSize: 12 }} /><Line type="monotone" dataKey="incomeMillions" stroke="#4d8061" strokeWidth={2.5} dot={{ fill: '#4d8061', r: 4 }} /><Line type="monotone" dataKey="expenseMillions" stroke="#c83232" strokeWidth={2.5} dot={{ fill: '#c83232', r: 4 }} /></LineChart></ResponsiveContainer></div><div className="summary-strip"><div><small>Rata-rata Pemasukan</small><b>{formatCurrency(averageIncome)} / bln</b></div><div><small>Rata-rata Pengeluaran</small><b>{formatCurrency(averageExpense)} / bln</b></div><div><small>Proyeksi Tabungan 6 Bulan</small><b className="text-[#4d8061]">{projectedSavings >= 0 ? '+' : ''}{formatCurrency(projectedSavings)}</b></div></div></div><div className="finverse-card"><div className="mb-4 flex items-start justify-between"><div><h2 className="section-title">Kategori<br />Pengeluaran</h2><p className="section-subtitle mt-2">Distribusi pengeluaran berdasarkan 7 kategori</p></div><span className="month-pill">Bulan<br />Ini</span></div><div className="donut" style={{ background: categoryChart }}><div><small>Total</small><b>{formatCurrency(expenses).replace('Rp', '').trim()}</b></div></div><div className="mt-4 space-y-2">{categoryExpenses.slice(0, 7).map((category, index) => <div className="category-row" key={`${category.name}-${index}`}><span><i className="dot" style={{ background: colors[index % colors.length] }} />{category.name}</span><b>{totalCategoryExpense ? Math.round(category.value / totalCategoryExpense * 100) : 0}% ({formatCurrency(category.value)})</b></div>)}</div></div></section>

      <section className="finverse-card overflow-hidden"><div className="mb-4 flex items-center justify-between"><div><h2 className="section-title">Riwayat Transaksi Terbaru</h2><p className="section-subtitle">5 aktivitas terakhir yang tercatat mutakhir pada akun Econary Anda</p></div><Link href="/dashboard/transactions" className="green-link">Lihat Semua Riwayat <ChevronRight size={15} /></Link></div><div className="transaction-table"><div className="transaction-head"><span>Transaksi & Catatan</span><span>Kategori</span><span>Metode Pembayaran</span><span>Tanggal & Waktu</span><span className="text-right">Nominal Transaksi</span></div>{recentTransactions.map((transaction) => { const expense = transaction.type === 'expense'; return <div className="transaction-row" key={transaction.id}><div className="transaction-name"><div className={`transaction-icon ${expense ? 'expense-icon' : 'income-icon'}`}>{transaction.category?.icon || (expense ? '🍽️' : '▣')}</div><div><b>{transaction.note || transaction.category?.name}</b><small>{transaction.wallet?.name || 'Wallet'}</small></div></div><span className="category-badge">{transaction.category?.name || 'Umum'}</span><span className="muted-cell">{transaction.wallet?.name || 'Transfer'}</span><span className="muted-cell">{format(new Date(transaction.date), 'dd MMM yyyy, HH:mm', { locale: id })}</span><b className={`amount ${expense ? 'negative' : 'positive'}`}>{expense ? '-' : '+'}{formatCurrency(transaction.amount)}</b></div> })}</div>{recentTransactions.length === 0 && <p className="empty-state">Belum ada transaksi bulan ini.</p>}</section>
      <div className="status-bar"><span>◉ Seluruh mutasi otomatis divalidasi dengan enkripsi SHA-256 dan terhubung ke PostgreSQL Econary.</span><span>Status Node: <b>Online</b> | Latency: 24ms</span></div>
    </div>
  );
}

function StatCard({ label, value, icon, tone, footer, progress, ring }) {
  return <div className="stat-card"><div className="flex items-start justify-between"><div><span className="stat-label">{label}</span><h3 className="stat-value">{value}</h3></div><span className={`stat-icon ${tone}`}>{icon}</span>{ring && <span className="mini-ring" style={{ '--ring': ring }}>{ring}</span>}</div><div className="stat-footer">{footer}</div>{progress !== undefined && <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>}</div>;
}
