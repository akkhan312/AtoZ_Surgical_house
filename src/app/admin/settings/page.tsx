'use client';
import { useState, useEffect } from 'react';
import { FiUserPlus, FiTrash2, FiShield, FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

export default function AdminSettings() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const loadAdmins = () => {
    fetch('/api/admin/users', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.users) setAdmins(d.users.filter((u: any) => u.role === 'admin'));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAdmins(); }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: 'error', text: data.error }); return; }
      setMsg({ type: 'success', text: 'Admin added successfully!' });
      setForm({ name: '', email: '', password: '' });
      loadAdmins();
      setTimeout(() => setShowModal(false), 1200);
    } catch { setMsg({ type: 'error', text: 'Network error' }); }
    finally { setSubmitting(false); }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Remove admin "${name}"? This action cannot be undone.`)) return;
    const res = await fetch(`/api/admin/manage?id=${id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) { alert(data.error); return; }
    loadAdmins();
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-8">Settings</h1>

      {/* Admin Management Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><FiShield size={18} className="text-amber-500" /> Admin Accounts</h2>
            <p className="text-sm text-gray-500 mt-1">Manage who has access to the admin panel</p>
          </div>
          <button onClick={() => { setShowModal(true); setMsg(null); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
            <FiUserPlus size={16} /> Add Admin
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="flex justify-center py-12"><div className="page-spinner" /></div>
          ) : admins.length === 0 ? (
            <p className="text-center py-12 text-gray-500">No admin accounts found.</p>
          ) : (
            admins.map((a: any) => (
              <div key={a._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <FiShield size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Joined {new Date(a.createdAt).toLocaleDateString()}</span>
                  <button onClick={() => handleRemove(a._id, a.name)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Application Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 mb-1">Version</p>
            <p className="font-bold text-gray-900">2.4.1</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 mb-1">Framework</p>
            <p className="font-bold text-gray-900">Next.js 16</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 mb-1">Database</p>
            <p className="font-bold text-gray-900">MongoDB Atlas</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 mb-1">Styling</p>
            <p className="font-bold text-gray-900">Tailwind CSS</p>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-black text-gray-900 mb-1">Add New Admin</h2>
            <p className="text-sm text-gray-500 mb-6">This person will have full access to the admin panel.</p>

            {msg && (
              <div className={`flex items-center gap-2 text-sm font-medium rounded-xl px-4 py-3 mb-4 ${msg.type === 'error' ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-emerald-50 border border-emerald-200 text-emerald-600'}`}>
                {msg.type === 'error' ? <FiAlertCircle size={16} /> : <FiCheckCircle size={16} />} {msg.text}
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required placeholder="admin@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
                <input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required placeholder="Min 6 characters"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors mt-2">
                {submitting ? <span className="spinner" /> : <><FiUserPlus size={16} /> Add Admin</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
