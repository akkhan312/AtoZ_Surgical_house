'use client';
import { useEffect, use } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiStar, FiHeart, FiPlus, FiPackage } from 'react-icons/fi';
import { useApp } from '@/lib/context';

export default function CategoryProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart, toggleWishlist, isWishlisted, products, loadProducts, loadingProducts } = useApp();

  useEffect(() => {
    loadProducts({ category: id });
  }, [id]);

  const catProducts = products.filter((p: any) => p.categoryId === id);
  const catName = catProducts[0]?.category || id.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/categories" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FiArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">{catName}</h1>
          <span className="ml-auto text-sm font-semibold text-gray-400">{catProducts.length} products</span>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="skeleton bg-gray-200 rounded-2xl h-64" />)}
          </div>
        ) : catProducts.length === 0 ? (
          <div className="text-center py-24">
            <FiPackage size={56} className="text-gray-200 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-800 mb-2">No products found</p>
            <p className="text-gray-400 text-sm">This category doesn't have any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {catProducts.map((p: any) => (
              <Link href={`/products/${p._id}`} key={p._id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button onClick={e => { e.preventDefault(); toggleWishlist(p._id); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                    <FiHeart size={14} className={isWishlisted(p._id) ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
                  </button>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <FiStar size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{p.rating}</span>
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
    </div>
  );
}
