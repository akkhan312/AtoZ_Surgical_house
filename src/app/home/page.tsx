'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMapPin, FiBell, FiStar, FiPlus, FiShoppingCart, FiHeart, FiRotateCcw, FiActivity, FiScissors, FiDroplet, FiHome, FiShield, FiCpu, FiTool } from 'react-icons/fi';
import { MdOutlineBiotech, MdOutlineLocalHospital } from 'react-icons/md';
import { useApp } from '@/lib/context';

const BANNER_SLIDES = [
  { title: 'Premium Surgical Equipment Delivered Fast', sub: 'Trusted by 10,000+ healthcare professionals', bg: 'from-blue-700 to-blue-500', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=220&h=160&fit=crop' },
  { title: 'New Arrivals: Diagnostic Kits & Monitors', sub: 'ISO certified. Clinically validated.', bg: 'from-emerald-700 to-emerald-500', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=220&h=160&fit=crop' },
  { title: 'Bulk Order Discounts up to 30% Off', sub: 'For clinics, hospitals & healthcare centers', bg: 'from-violet-700 to-violet-500', img: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=220&h=160&fit=crop' },
];

const CATEGORIES = [
  { icon: <FiActivity size={22} />, label: 'Diagnostic', id: 'diagnostic' },
  { icon: <FiScissors size={22} />, label: 'Surgical', id: 'surgical' },
  { icon: <MdOutlineLocalHospital size={22} />, label: 'Patient Care', id: 'patient-care' },
  { icon: <FiDroplet size={22} />, label: 'Diabetes', id: 'diabetes' },
  { icon: <FiHome size={22} />, label: 'Furniture', id: 'furniture' },
  { icon: <FiShield size={22} />, label: 'Protective', id: 'protective' },
  { icon: <MdOutlineBiotech size={22} />, label: 'Lab', id: 'surgical' },
  { icon: <FiCpu size={22} />, label: 'Monitors', id: 'diagnostic' },
];

export default function HomePage() {
  const [idx, setIdx] = useState(0);
  const [tab, setTab] = useState<'best' | 'new'>('best');
  const { addToCart, toggleWishlist, isWishlisted, products, loadProducts, loadingProducts } = useApp();

  useEffect(() => {
    loadProducts({ limit: '8' });
    fetch('/api/seed').catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % BANNER_SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const featured = tab === 'best' ? products.slice(0, 4) : products.slice(3, 7);
  const buyAgain = products[6] || null;
  const slide = BANNER_SLIDES[idx];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <MdOutlineLocalHospital size={26} className="text-blue-600" />
          <span className="text-lg font-black text-gray-900">Atoz <span className="text-blue-600">Surgical</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/cart">
            <button className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <FiShoppingCart size={20} />
            </button>
          </Link>
          <button className="relative w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
            <FiBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
          <FiMapPin size={14} className="text-blue-600" />
          <span>Deliver to <strong className="text-gray-900">New York, 10001</strong></span>
        </div>

        {/* Banner */}
        <div className={`bg-gradient-to-r ${slide.bg} rounded-2xl p-6 flex items-center justify-between mb-8 relative overflow-hidden min-h-[140px]`}>
          <div className="z-10 max-w-[60%]">
            <h2 className="text-white font-black text-xl md:text-2xl leading-tight mb-2">{slide.title}</h2>
            <p className="text-white/80 text-sm">{slide.sub}</p>
          </div>
          <img src={slide.img} alt="" className="w-28 h-24 md:w-36 md:h-28 object-cover rounded-xl opacity-90 shrink-0" />
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {BANNER_SLIDES.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`} />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
            <Link href="/categories" className="text-blue-600 font-semibold text-sm hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <Link key={i} href={`/categories/${cat.id}`} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                  {cat.icon}
                </div>
                <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black text-gray-900">Doctors Choice</h2>
            <div className="flex bg-gray-100 rounded-full p-1 gap-1">
              {(['best', 'new'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tab === t ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t === 'best' ? 'Best Selling' : 'New Arrivals'}
                </button>
              ))}
            </div>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="skeleton bg-gray-200 rounded-2xl h-64" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((p: any) => (
                <Link href={`/products/${p._id}`} key={p._id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
                  <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button
                      onClick={e => { e.preventDefault(); toggleWishlist(p._id); }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <FiHeart size={14} className={isWishlisted(p._id) ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
                    </button>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-1">
                      <FiStar size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-gray-700">{p.rating}</span>
                      <span className="text-xs text-gray-400">({p.reviewCount})</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{p.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-blue-600">${p.price?.toFixed(2)}</span>
                      <button onClick={e => { e.preventDefault(); addToCart(p._id); }}
                        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors">
                        <FiPlus size={15} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Buy Again */}
        {buyAgain && (
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Buy Again</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
              <img src={buyAgain.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{buyAgain.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 mb-1">Previously ordered</p>
                <span className="text-base font-black text-blue-600">${buyAgain.price?.toFixed(2)}</span>
              </div>
              <button onClick={() => addToCart(buyAgain._id)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 transition-colors">
                <FiRotateCcw size={13} /> Reorder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
