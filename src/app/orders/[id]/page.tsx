'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiTruck, FiPackage, FiClock, FiPhone, FiMapPin } from 'react-icons/fi';

const STEPS = [
  { key: 'pending',          label: 'Order Placed',      sub: 'Confirmed & Verified', icon: FiCheckCircle },
  { key: 'processing',       label: 'Processing',        sub: 'Quality Checked',      icon: FiPackage },
  { key: 'shipped',          label: 'Shipped',           sub: 'In Transit',           icon: FiTruck },
  { key: 'out_for_delivery', label: 'Out for Delivery',  sub: 'Arriving Soon',        icon: FiTruck },
  { key: 'delivered',        label: 'Delivered',         sub: 'Completed',            icon: FiCheckCircle },
];

const ORDER_STATUS_INDEX: Record<string, number> = {
  pending: 0, processing: 1, shipped: 2, out_for_delivery: 3, delivered: 4,
};

export default function TrackOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setOrder(d.order));
  }, [id]);

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="page-spinner" />
    </div>
  );

  const currentStep = ORDER_STATUS_INDEX[order.status] ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/orders" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FiArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Track Order</h1>
        </div>

        {/* Order ID card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex justify-between items-center mb-5 shadow-sm">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
            <p className="text-2xl font-black text-gray-900">{order.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estimated Arrival</p>
            <p className="text-lg font-bold text-gray-900">{order.estimatedArrival || 'Calculating...'}</p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 mb-5 relative h-48 bg-blue-100 shadow-sm">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=300&fit=crop" alt="Delivery map" className="w-full h-full object-cover opacity-60" />
          <div className="absolute bottom-4 left-4 bg-white py-2.5 px-4 rounded-xl flex items-center gap-3 shadow-lg">
            <div className="bg-blue-50 p-2 rounded-lg"><FiTruck size={18} className="text-blue-600" /></div>
            <div>
              <p className="text-sm font-bold text-gray-900">In Transit</p>
              <p className="text-xs text-gray-500">Logistics Hub — Sector 4</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-white py-2 px-3 rounded-lg flex items-center gap-1.5 shadow-md">
            <FiMapPin size={14} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-600">{order.shippingAddress || 'New York, NY'}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Delivery Progress</p>
          {STEPS.map((step, i) => {
            const isDone = i <= currentStep;
            const isCurrent = i === currentStep;
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex gap-4 relative">
                {i < STEPS.length - 1 && (
                  <div className={`absolute left-[19px] top-[38px] w-0.5 h-11 ${isDone ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-blue-600' : 'bg-gray-100'} ${isCurrent ? 'ring-3 ring-blue-200' : ''}`}>
                  <Icon size={18} className={isDone ? 'text-white' : 'text-gray-400'} />
                </div>
                <div className="flex-1 pb-8">
                  <p className={`text-sm ${isCurrent ? 'font-black' : 'font-semibold'} ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                  <p className={`text-xs ${isDone ? 'text-gray-500' : 'text-gray-300'}`}>{step.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Items */}
        {order.items?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</p>
            <div className="space-y-3">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-50" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty} × ${item.price?.toFixed(2)}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">${(item.qty * item.price)?.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-3 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-black text-blue-600">${order.total?.toFixed(2)}</span>
            </div>
          </div>
        )}

        {showPhone ? (
          <a href="tel:+966509449238" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <FiPhone size={16} /> +966 509 449 238
          </a>
        ) : (
          <button onClick={() => setShowPhone(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <FiPhone size={16} /> Contact Support
          </button>
        )}
      </div>
    </div>
  );
}
