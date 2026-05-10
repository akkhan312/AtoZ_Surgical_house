'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiShare2, FiHeart, FiStar, FiShoppingCart, FiZap, FiCheckCircle, FiPackage, FiBattery, FiMonitor, FiDatabase, FiSmartphone, FiDroplet, FiShield, FiLayers, FiUsers, FiTool, FiThermometer, FiLink, FiClock } from 'react-icons/fi';
import { useApp } from '@/lib/context';

const specIcon: Record<string, any> = {
  battery: FiBattery, monitor: FiMonitor, memory: FiDatabase, clock: FiClock,
  headphones: FiMonitor, shield: FiShield, zap: FiZap, award: FiCheckCircle,
  package: FiPackage, check: FiCheckCircle, star: FiStar, database: FiDatabase,
  smartphone: FiSmartphone, droplet: FiDroplet, layers: FiLayers, move: FiTool,
  circle: FiLink, link: FiLink, users: FiUsers, box: FiPackage, tool: FiTool,
  thermometer: FiThermometer,
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const { addToCart, toggleWishlist, isWishlisted } = useApp();

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(d => setProduct(d.product));
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="page-spinner" />
    </div>
  );

  const wishlisted = isWishlisted(product._id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/categories" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <FiArrowLeft size={16} /> Back
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-400 truncate">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Image */}
          <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm aspect-square md:aspect-auto md:h-96">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <button onClick={() => toggleWishlist(product._id)}
              className={`absolute top-4 right-4 w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform ${wishlisted ? 'text-red-500' : 'text-gray-400'}`}>
              <FiHeart size={20} className={wishlisted ? 'fill-red-500' : ''} />
            </button>
            <button className="absolute top-4 left-4 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:bg-white transition-colors">
              <FiShare2 size={16} />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full">
                  <FiCheckCircle size={12} /> In Stock
                </span>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-600">${product.price?.toFixed(2)}</p>
                  {product.originalPrice && <p className="text-sm text-gray-400 line-through">${product.originalPrice?.toFixed(2)}</p>}
                </div>
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-500 text-sm mb-4">{product.subtitle}</p>
              <div className="flex items-center gap-2 mb-6">
                <FiStar size={16} className="text-amber-400 fill-amber-400" />
                <span className="font-bold text-gray-800">{product.rating}</span>
                <span className="text-gray-400 text-sm">({product.reviewCount} reviews)</span>
              </div>

              {/* Specs */}
              {product.specifications?.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {product.specifications.map((spec: any, i: number) => {
                    const Icon = specIcon[spec.icon] || FiPackage;
                    return (
                      <div key={i} className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <Icon size={16} className="text-blue-600 shrink-0" />
                        <span className="text-xs font-semibold text-gray-700">{spec.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button onClick={() => addToCart(product._id)}
                className="flex-1 h-13 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                <FiShoppingCart size={18} /> Add to Cart
              </button>
              <Link href="/cart" className="flex-1" onClick={() => addToCart(product._id)}>
                <button className="w-full h-13 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                  <FiZap size={18} /> Buy Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Description & How To Use */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          {product.howToUse?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">How to Use</h2>
              <div className="space-y-3">
                {product.howToUse.map((step: string, i: number) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <FiStar size={16} className="text-amber-400 fill-amber-400" />
                <span className="font-bold text-gray-800">{product.rating}</span>
                <span className="text-gray-400 text-sm">({product.reviewCount})</span>
              </div>
            </div>
            <div className="divide-y divide-gray-50 space-y-4">
              {product.reviews.map((r: any, i: number) => (
                <div key={i} className="pt-4 first:pt-0">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900">{r.name}</span>
                    <span className="text-xs text-gray-400">{r.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
