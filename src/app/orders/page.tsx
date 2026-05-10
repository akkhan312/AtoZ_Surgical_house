'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiFilter, FiPackage, FiTruck, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useApp } from '@/lib/context';

const STATUS: Record<string, { label: string; cls: string; icon: any }> = {
  pending:          { label: 'Pending',          cls: 'bg-amber-50 text-amber-600',   icon: FiClock },
  processing:       { label: 'Processing',       cls: 'bg-blue-50 text-blue-600',     icon: FiPackage },
  shipped:          { label: 'Shipped',          cls: 'bg-violet-50 text-violet-600', icon: FiTruck },
  out_for_delivery: { label: 'Out for Delivery', cls: 'bg-blue-50 text-blue-600',     icon: FiTruck },
  delivered:        { label: 'Delivered',        cls: 'bg-emerald-50 text-emerald-600', icon: FiCheckCircle },
  cancelled:        { label: 'Cancelled',        cls: 'bg-red-50 text-red-500',       icon: FiPackage },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/orders', { credentials: 'include' })
      .then(r => r.json()).then(d => { if (d.orders) setOrders(d.orders); }).finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o =>
    o.orderId?.toLowerCase().includes(q.toLowerCase()) ||
    o.items?.some((i: any) => i.name?.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-5">My Orders</h1>

        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-3 mb-6 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <FiSearch size={18} className="text-gray-400 shrink-0" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search orders..." className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
          <FiFilter size={18} className="text-blue-600 shrink-0" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="page-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <FiPackage size={56} className="text-gray-200 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-800 mb-2">No orders yet</p>
            <p className="text-gray-400 mb-6 text-sm">Your orders will appear here after checkout</p>
            <Link href="/home"><button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">Shop Now</button></Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((order: any) => {
              const s = STATUS[order.status] || STATUS.pending;
              const Icon = s.icon;
              return (
                <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="flex justify-between items-center px-5 py-4 bg-gray-50 border-b border-dashed border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{order.orderId}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.placedAt}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${s.cls}`}>
                      <Icon size={11} /> {s.label}
                    </span>
                  </div>
                  <div className="px-5 py-4 space-y-2">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600"><strong className="text-gray-900">{item.qty}×</strong> {item.name}</span>
                        <span className="font-semibold text-gray-900">${item.price?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center px-5 py-4 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-lg font-black text-blue-600">${order.total?.toFixed(2)}</p>
                    </div>
                    <Link href={`/orders/${order._id}`}>
                      <button className="inline-flex items-center gap-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors">
                        <FiTruck size={14} /> Track Order
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
