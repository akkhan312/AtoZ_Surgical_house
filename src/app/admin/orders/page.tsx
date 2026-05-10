'use client';
import { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiEye, FiX, FiMapPin, FiCreditCard, FiUser, FiPackage, FiCalendar, FiDollarSign, FiPhone } from 'react-icons/fi';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  processing: 'bg-blue-50 text-blue-600 border-blue-200',
  shipped: 'bg-violet-50 text-violet-600 border-violet-200',
  out_for_delivery: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
};
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending', processing: 'Processing', shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const loadOrders = () => {
    setLoading(true);
    fetch('/api/admin/orders', { credentials: 'include' })
      .then(r => r.json()).then(d => { if (d.orders) setOrders(d.orders); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const filtered = orders.filter(o => {
    const matchQ = o.orderId?.toLowerCase().includes(q.toLowerCase()) ||
      o.userId?.name?.toLowerCase().includes(q.toLowerCase()) ||
      o.userId?.email?.toLowerCase().includes(q.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchQ && matchStatus;
  });

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include',
    });
    loadOrders();
    setUpdatingId(null);
    if (selectedOrder?._id === id) {
      setSelectedOrder((prev: any) => ({ ...prev, status }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    await fetch(`/api/admin/orders/${id}`, { method: 'DELETE', credentials: 'include' });
    if (selectedOrder?._id === id) setSelectedOrder(null);
    loadOrders();
  };

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + (o.status !== 'cancelled' ? (o.total || 0) : 0), 0);
  const statusCounts: Record<string, number> = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-black text-gray-900">Manage Orders</h1>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm">
            <span className="text-gray-500">Revenue:</span> <span className="font-black text-emerald-600">${totalRevenue.toFixed(2)}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm">
            <span className="text-gray-500">Total:</span> <span className="font-black text-gray-900">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        <button onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filterStatus === 'all' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filterStatus === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
            {STATUS_LABELS[s]} ({statusCounts[s] || 0})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <FiSearch size={16} className="text-gray-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search order ID, customer name or email..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center"><div className="page-spinner mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No orders found.</td></tr>
              ) : (
                filtered.map((o: any) => (
                  <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{o.orderId}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{o.userId?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-500">{o.userId?.email || ''}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-600">{o.items?.length || 0}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">${o.total?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                        disabled={updatingId === o._id}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${STATUS_COLORS[o.status] || STATUS_COLORS.pending}`}>
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedOrder(o)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border border-gray-200 rounded-md shadow-sm transition-colors">
                          <FiEye size={14} />
                        </button>
                        <button onClick={() => handleDelete(o._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded-md shadow-sm transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
              <FiX size={20} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-3xl text-white">
              <p className="text-sm font-medium opacity-80 mb-1">Order Details</p>
              <h2 className="text-2xl font-black">{selectedOrder.orderId}</h2>
              <div className="flex items-center gap-3 mt-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/20`}>
                  {STATUS_LABELS[selectedOrder.status]}
                </span>
                <span className="text-sm opacity-80">{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2"><FiUser size={14} /><span className="text-xs font-bold uppercase tracking-wider">Customer</span></div>
                  <p className="font-bold text-gray-900">{selectedOrder.userId?.name || 'Guest'}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.userId?.email || 'N/A'}</p>
                  {selectedOrder.userId?.phone && <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><FiPhone size={12} /> {selectedOrder.userId.phone}</p>}
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2"><FiMapPin size={14} /><span className="text-xs font-bold uppercase tracking-wider">Shipping</span></div>
                  <p className="font-semibold text-gray-900 text-sm leading-relaxed">{selectedOrder.shippingAddress || 'No address provided'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2"><FiCreditCard size={14} /><span className="text-xs font-bold uppercase tracking-wider">Payment</span></div>
                  <p className="font-bold text-gray-900">{selectedOrder.paymentMethod || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2"><FiCalendar size={14} /><span className="text-xs font-bold uppercase tracking-wider">Est. Arrival</span></div>
                  <p className="font-bold text-gray-900">{selectedOrder.estimatedArrival || 'Calculating...'}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-3"><FiPackage size={14} /><span className="text-xs font-bold uppercase tracking-wider">Items ({selectedOrder.items?.length || 0})</span></div>
                <div className="bg-gray-50 rounded-xl overflow-hidden divide-y divide-gray-200">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-white" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name || 'Product'}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty} × ${item.price?.toFixed(2)}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">${((item.qty || 1) * (item.price || 0)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-2"><FiDollarSign size={18} className="text-blue-600" /><span className="font-bold text-gray-900">Order Total</span></div>
                <span className="text-2xl font-black text-blue-600">${selectedOrder.total?.toFixed(2)}</span>
              </div>

              {/* Update Status */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Update Status</p>
                <div className="grid grid-cols-3 gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => updateStatus(selectedOrder._id, s)}
                      disabled={selectedOrder.status === s}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${selectedOrder.status === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-gray-300' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete */}
              <button onClick={() => handleDelete(selectedOrder._id)}
                className="w-full border border-red-200 text-red-500 hover:bg-red-50 font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                <FiTrash2 size={14} /> Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
