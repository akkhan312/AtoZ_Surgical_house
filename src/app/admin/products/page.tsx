'use client';
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const CATEGORIES = [
  { id: 'diagnostic', name: 'Diagnostic Equipment' },
  { id: 'surgical', name: 'Surgical Instruments' },
  { id: 'patient-care', name: 'Patient Care' },
  { id: 'diabetes', name: 'Diabetes Care' },
  { id: 'furniture', name: 'Medical Furniture' },
  { id: 'protective', name: 'Protective Equipment' },
  { id: 'lab', name: 'Lab Equipment' },
  { id: 'monitors', name: 'Patient Monitors' },
];

const EMPTY_FORM = { name: '', subtitle: '', description: '', price: '', originalPrice: '', image: '', categoryId: 'diagnostic', inStock: true, featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const loadProducts = () => {
    setLoading(true);
    fetch('/api/admin/products', { credentials: 'include' })
      .then(r => r.json()).then(d => { if (d.products) setProducts(d.products); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.category?.toLowerCase().includes(q.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMsg(null);
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p._id);
    setForm({
      name: p.name || '',
      subtitle: p.subtitle || '',
      description: p.description || '',
      price: String(p.price || ''),
      originalPrice: String(p.originalPrice || ''),
      image: p.image || '',
      categoryId: p.categoryId || 'diagnostic',
      inStock: p.inStock !== false,
      featured: p.featured === true,
    });
    setMsg(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSubmitting(true);

    const cat = CATEGORIES.find(c => c.id === form.categoryId);
    const body = {
      ...form,
      category: cat?.name || form.categoryId,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
    };

    try {
      const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: 'error', text: data.error }); return; }
      setMsg({ type: 'success', text: editingId ? 'Product updated!' : 'Product created!' });
      loadProducts();
      setTimeout(() => setShowModal(false), 800);
    } catch { setMsg({ type: 'error', text: 'Network error' }); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) loadProducts();
    else alert('Failed to delete product');
  };

  const u = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-black text-gray-900">Manage Products</h1>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <FiSearch size={16} className="text-gray-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <span className="text-sm font-semibold text-gray-400">{filtered.length} products</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center"><div className="page-spinner mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
              ) : (
                filtered.map((p: any) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-gray-100" alt="" />
                        <div>
                          <p className="font-bold text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{p.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.category}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-600">${p.price?.toFixed(2)}</span>
                      {p.originalPrice && <span className="text-xs text-gray-400 line-through ml-2">${p.originalPrice?.toFixed(2)}</span>}
                    </td>
                    <td className="px-6 py-4">
                      {p.inStock ? (
                        <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full">In Stock</span>
                      ) : (
                        <span className="bg-red-50 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border border-gray-200 rounded-md shadow-sm transition-colors"><FiEdit2 size={14} /></button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded-md shadow-sm transition-colors"><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-black text-gray-900 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>

            {msg && (
              <div className={`flex items-center gap-2 text-sm font-medium rounded-xl px-4 py-3 mb-4 ${msg.type === 'error' ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-emerald-50 border border-emerald-200 text-emerald-600'}`}>
                {msg.type === 'error' ? <FiAlertCircle size={16} /> : <FiCheckCircle size={16} />} {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Product Name *</label>
                <input value={form.name} onChange={u('name')} required placeholder="e.g. Digital BP Monitor"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Subtitle</label>
                <input value={form.subtitle} onChange={u('subtitle')} placeholder="Short description"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={u('description') as any} rows={3} placeholder="Full product description..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Price ($) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={u('price')} required placeholder="49.99"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Original Price ($)</label>
                  <input type="number" step="0.01" value={form.originalPrice} onChange={u('originalPrice')} placeholder="79.99"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Image URL</label>
                <input value={form.image} onChange={u('image')} placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Category *</label>
                <select value={form.categoryId} onChange={u('categoryId')}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.inStock} onChange={u('inStock')} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={u('featured')} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  Featured
                </label>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors mt-2">
                {submitting ? <span className="spinner" /> : editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
