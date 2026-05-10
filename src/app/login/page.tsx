'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { useApp } from '@/lib/context';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useApp();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form), credentials: 'include' });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      setUser(data.user, data.token);
      router.push('/home');
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-2">
          <MdOutlineLocalHospital size={36} className="text-blue-600" />
          <h1 className="text-2xl font-black text-gray-900">Atoz <span className="text-blue-600">Surgical</span></h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Welcome back — sign in to your account</p>

        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-5">
            <FiAlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <FiMail size={18} className="text-gray-400 shrink-0" />
            <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
          </div>

          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <FiLock size={18} className="text-gray-400 shrink-0" />
            <input type={showPwd ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
            <button type="button" onClick={() => setShowPwd(p => !p)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
              {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-13 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors mt-2">
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
