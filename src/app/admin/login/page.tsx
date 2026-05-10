'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiShield } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { useApp } from '@/lib/context';

export default function AdminLoginPage() {
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
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      setUser(data.user, data.token);
      router.push('/admin');
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-1">
          <MdOutlineLocalHospital size={36} className="text-blue-600" />
          <h1 className="text-2xl font-black text-gray-900">Atoz <span className="text-blue-600">Admin</span></h1>
        </div>
        <div className="flex items-center gap-2 mb-8">
          <FiShield size={14} className="text-amber-500" />
          <p className="text-gray-500 text-sm">Administrator access only</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-5">
            <FiAlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <FiMail size={18} className="text-gray-400 shrink-0" />
            <input type="email" placeholder="Admin email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
          </div>

          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <FiLock size={18} className="text-gray-400 shrink-0" />
            <input type={showPwd ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
            <button type="button" onClick={() => setShowPwd(p => !p)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
              {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-13 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors mt-2">
            {loading ? <span className="spinner" /> : <><FiShield size={16} /> Sign In to Admin Panel</>}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          This area is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}
