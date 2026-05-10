'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiAlertCircle } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { useApp } from '@/lib/context';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useApp();
  const router = useRouter();

  const u = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password, phone: form.phone }), credentials: 'include' });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); return; }
      setUser(data.user, data.token);
      router.push('/home');
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const fields = [
    { key: 'name',     icon: FiUser,  type: 'text',     placeholder: 'Full name' },
    { key: 'email',    icon: FiMail,  type: 'email',    placeholder: 'Email address' },
    { key: 'phone',    icon: FiPhone, type: 'tel',      placeholder: 'Phone number (optional)', required: false },
    { key: 'password', icon: FiLock,  type: showPwd ? 'text' : 'password', placeholder: 'Password', toggle: true },
    { key: 'confirm',  icon: FiLock,  type: 'password', placeholder: 'Confirm password' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        <div className="flex items-center gap-2.5 mb-2">
          <MdOutlineLocalHospital size={36} className="text-blue-600" />
          <h1 className="text-2xl font-black text-gray-900">Atoz <span className="text-blue-600">Surgical</span></h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Create your account to get started</p>

        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-5">
            <FiAlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.key} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <f.icon size={18} className="text-gray-400 shrink-0" />
              <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={u(f.key)} required={f.required !== false} className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
              {f.toggle && (
                <button type="button" onClick={() => setShowPwd(p => !p)} className="text-gray-400 hover:text-gray-600 shrink-0">
                  {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              )}
            </div>
          ))}

          <button type="submit" disabled={loading}
            className="w-full h-13 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors mt-2">
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
