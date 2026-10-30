'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Leaf } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }

      // Redirect ke login dengan pesan sukses
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Green Gradient with Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4A7C59] via-[#5A8B68] to-[#6B9A77] p-12 flex-col justify-between relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-1 text-white z-10">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#4A7C59]" />
          </div>
          <span className="font-bold text-xl">Econary</span>
        </div>

        {/* Main Content */}
        <div className="z-10 text-center">
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

        </div>

      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-1 mb-8">
            <div className="w-10 h-10 bg-[#4A7C59] rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Econary</span>
          </div>

          {/* Header with Tabs */}
          <div className="flex gap-4 mb-8">
            <Link 
              href="/login"
              className="pb-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700"
            >
              Masuk
            </Link>
            <Link 
              href="/register"
              className="pb-2 border-b-2 border-[#4A7C59] text-gray-900 font-medium"
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
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NAMA LENGKAP
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#F5F5F0] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] text-gray-900 placeholder-gray-400"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KATA SANDI
              </label>
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KONFIRMASI KATA SANDI
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-[#F5F5F0] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A7C59] hover:bg-[#3d6449] text-white font-semibold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : 'Daftar Akun'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
