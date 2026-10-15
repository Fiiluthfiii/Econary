'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Leaf } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Green Gradient with Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4A7C59] via-[#5A8B68] to-[#6B9A77] p-12 flex-col justify-between relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-2 text-white z-10">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#4A7C59]" />
          </div>
          <span className="font-bold text-xl">Econary</span>
        </div>

        {/* Main Content */}
        <div className="z-10">
          {/* Badge */}
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <p className="text-white/90 text-sm">🌱 Pusat Kendali Finansial Generasi Baru</p>
          </div>

          {/* Heading */}
          <h1 className="text-white text-5xl font-bold mb-6 leading-tight">
            Kuasai arus kas hari ini.<br />
            Simulasikan versi terbaik<br />
            masa depanmu.
          </h1>

          {/* Description */}
          <p className="text-white/80 text-lg mb-8">
            Platform pintar pelacak anggaran multi-role bagi<br />
            Mahasiswa, Freelancer, dan Karyawan di Indonesia dengan<br />
            visualisasi horizon prediktif real-time.
          </p>

          {/* Chart Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-white/70 text-sm">📊 Simulasi Multiverse Net Worth</div>
              <div className="ml-auto bg-emerald-500/20 text-emerald-300 text-sm px-3 py-1 rounded-full">+38.4%</div>
            </div>
            
            {/* Simple Line Chart */}
            <div className="h-32 mb-4 relative">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path 
                  d="M 0,80 Q 50,60 75,50 T 150,45 T 225,35 T 300,20" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  opacity="0.8"
                />
                <circle cx="280" cy="22" r="4" fill="white"/>
              </svg>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                <p className="text-white/60 text-xs mb-1">Tabungan Dikawal</p>
                <p className="text-white font-semibold text-lg">Rp 12.850.000</p>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                <p className="text-white/60 text-xs mb-1">Alokas Gig Tau</p>
                <p className="text-white font-semibold text-lg">Rp 2.450.000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="flex items-start gap-3 z-10">
          <img 
            src="/api/placeholder/48/48" 
            alt="User" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="text-white/90 text-sm italic mb-2">
              "Finverse mengubah kebiasaannya honor freelance saya menjadi<br />
              kesadaran rencana investasi 5 tahun ke depan."
            </p>
            <p className="text-white/70 text-xs">Rian Ekanopirata — Independent Usix/UI Lead</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#4A7C59] rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Econary</span>
          </div>

          {/* Header with Tabs */}
          <div className="flex gap-4 mb-8">
            <Link 
              href="/login"
              className="pb-2 border-b-2 border-[#4A7C59] text-gray-900 font-medium"
            >
              Masuk
            </Link>
            <Link 
              href="/register"
              className="pb-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700"
            >
              Daftar
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8">Masuk ke Akun Econary</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ALAMAT EMAIL
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-[#F5F5F0] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] text-gray-900 placeholder-gray-400"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  KATA SANDI
                </label>
                <Link href="#" className="text-sm text-[#4A7C59] hover:underline">
                  Lupa Kata Sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-[#F5F5F0] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-[#4A7C59] border-gray-300 rounded focus:ring-[#4A7C59]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Ingat saya selama 30 hari
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A7C59] hover:bg-[#3d6449] text-white font-semibold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : 'Masuk ke Dashboard Finverse'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
