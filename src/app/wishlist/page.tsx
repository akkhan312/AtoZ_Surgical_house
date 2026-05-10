'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiSearch, FiHeart, FiStar, FiShoppingCart, FiInfo } from 'react-icons/fi';
import { useApp } from '@/lib/context';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, products } = useApp();
  const [query, setQuery] = useState('');

  const wishProducts = wishlist.map(id => products.find((p: any) => p._id === id || p.id === id)).filter(Boolean) as any[];

  const filtered = wishProducts.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/home" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FiArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">My Wishlist</h1>
          <span className="ml-auto text-sm font-semibold text-gray-400">{wishlist.length} items</span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-3 mb-6 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <FiSearch size={18} className="text-gray-400 shrink-0" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search saved items..." className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
        </div>

        {wishProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <FiHeart size={64} className="text-gray-200 mb-4" />
            <p className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</p>
            <p className="text-gray-400 mb-6">Save items you want to buy later</p>
            <Link href="/home"><button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">Browse Products</button></Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((p: any) => (
              <div key={p._id || p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="flex p-4 gap-4">
                  <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover bg-gray-50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{p.category?.split(' ')[0]}</span>
                      <button onClick={() => toggleWishlist(p._id || p.id)} className="text-red-500 shrink-0"><FiHeart size={16} className="fill-red-500" /></button>
                    </div>
                    <p className="text-sm font-bold text-gray-900 leading-tight mt-1 mb-1.5">{p.name}</p>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FiStar size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-gray-700">{p.rating}</span>
                      <span className="text-xs text-gray-400">({p.reviewCount})</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-black text-blue-600">${p.price?.toFixed(2)}</span>
                      {p.originalPrice && <span className="text-xs text-gray-400 line-through">${p.originalPrice?.toFixed(2)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex border-t border-gray-100">
                  <button onClick={() => toggleWishlist(p._id || p.id)}
                    className="flex-1 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 border-r border-gray-100 transition-colors">
                    Remove
                  </button>
                  <button onClick={() => { addToCart(p._id || p.id); toggleWishlist(p._id || p.id); }}
                    className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors">
                    <FiShoppingCart size={14} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}

            {/* Price Drop Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 mt-2">
              <FiInfo size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-900 mb-1">Price Drop Alert!</p>
                <p className="text-sm text-blue-600 leading-relaxed">Items in your wishlist may have dropped in price. Add to cart now to save!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
