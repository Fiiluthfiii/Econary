'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  ArrowLeftRight, 
  FolderOpen, 
  PiggyBank, 
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  Target,
  Calculator
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { usePreferences } from '@/components/providers/PreferencesProvider';

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language, updateTrigger } = usePreferences();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);


  const navigation = [
    { name: 'Dasbor Keuangan', href: '/dashboard', icon: Home },
    { name: 'Riwayat Transaksi', href: '/dashboard/transactions', icon: ArrowLeftRight },
    { name: 'Dompet', href: '/dashboard/wallets', icon: Wallet },
    { name: 'Kategori', href: '/dashboard/categories', icon: FolderOpen },
    { name: 'Perencanaan Anggaran', href: '/dashboard/budget', icon: Calculator },
    { name: 'Target Tabungan', href: '/dashboard/saving-goals', icon: Target },
    { name: 'Alternate Universe', href: '/dashboard/alternate-universe', icon: BarChart3 },
    { name: 'Pengaturan Akun', href: '/dashboard/settings', icon: Settings },
  ];



  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] dark:bg-slate-950">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 
        bg-[#f4f1e9]
        dark:from-slate-900 dark:via-slate-900 dark:to-slate-800
        transform transition-transform duration-300 ease-in-out
        border-r border-[#ece9e2] dark:border-slate-700/50
        shadow-sm
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        
        <div className="h-full flex flex-col relative z-10">
          {/* Logo */}
          <div className="h-24 flex flex-col justify-center px-6 relative border-b border-[#eeeae2]">
            <Link href="/dashboard" className="group">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="font-serif text-xl font-bold text-[#4d8061] group-hover:text-green-600 transition-colors">Econary</h1>
                  <p className="text-[10px] tracking-[.13em] text-gray-500">PERSONAL</p>
                </div>
              </div>
              <p className="text-[10px] tracking-[.16em] text-gray-500">FINANCE &amp; AU</p>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            <ul className="space-y-1.5">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.name} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        group relative flex items-center space-x-3 px-3 py-2.5 rounded-full transition-all duration-200 text-sm
                        ${isActive 
                          ? 'bg-[#4d8061] text-white shadow-sm' 
                          : 'text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? '' : ''}`} />
                      <span className={`${isActive ? 'font-semibold' : 'font-normal'}`}>
                        {item.name}
                      </span>
                      
                      {/* Active indicator dot */}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom User Profile */}
          <div className="m-3 rounded-2xl border border-[#e3dfd6] bg-[#f4f1e9] p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#61785e] text-xs font-bold text-white">
                {session?.user?.name ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{session?.user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">Freelancer / Mahasiswa</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 lg:hidden">
          <div className="h-full flex items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-700 dark:text-slate-300"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Econary</span>
            <div className="w-6" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
