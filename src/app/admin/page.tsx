'use client';
import { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingBag, FiUsers, FiActivity, FiTrendingUp } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', { credentials: 'include' })
      .then(r => r.json()).then(d => { if(d.stats) setStats(d.stats); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="page-spinner" /></div>;

  const STATS_CARDS = [
    { title: 'Total Revenue', value: `$${stats?.revenue?.toFixed(2) || '0.00'}`, icon: FiDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Orders', value: stats?.orders || 0, icon: FiShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Active Users', value: stats?.users || 0, icon: FiUsers, color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Products', value: stats?.products || 0, icon: FiActivity, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STATS_CARDS.map(s => (
          <div key={s.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg}`}>
                <s.icon size={22} className={s.color} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <FiTrendingUp size={12} /> +12%
              </span>
            </div>
            <p className="text-sm font-bold text-gray-500 mb-1">{s.title}</p>
            <p className="text-3xl font-black text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((o: any) => (
                <tr key={o._id} className="border-b border-gray-50 last:border-0">
                  <td className="py-4 font-bold text-gray-900">{o.orderId}</td>
                  <td className="py-4 text-gray-600">{o.userId?.name || 'Guest'}</td>
                  <td className="py-4 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 font-bold text-blue-600">${o.total?.toFixed(2)}</td>
                  <td className="py-4">
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full capitalize">{o.status}</span>
                  </td>
                </tr>
              ))}
              {!stats?.recentOrders?.length && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
