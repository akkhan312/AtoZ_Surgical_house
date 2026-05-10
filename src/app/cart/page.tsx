'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiTrash2, FiTag, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';
import { useApp } from '@/lib/context';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, getCartTotal, products, placeOrder, user, loadProducts } = useApp();

  useEffect(() => { loadProducts(); }, []);
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const sub = getCartTotal();
  const tax = sub * 0.05;
  const disc = applied ? sub * 0.1 : 0;
  const total = sub + tax - disc;

  const cartItems = cart.map(item => ({
    ...item,
    product: products.find((p: any) => p._id === item.productId || p.id === item.productId),
  })).filter(i => i.product);

  const handleCheckout = async () => {
    setError('');
    if (!user) { router.push('/login'); return; }
    setPlacing(true);
    const result = await placeOrder();
    setPlacing(false);
    if (result.success) {
      setOrderSuccess(result.order);
    } else {
      setError(result.error || 'Failed to place order');
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-2">Your order has been placed successfully.</p>
          <p className="text-sm font-bold text-blue-600 mb-6">{orderSuccess.orderId}</p>
          <div className="flex gap-3">
            <Link href="/orders" className="flex-1">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">View Orders</button>
            </Link>
            <Link href="/home" className="flex-1">
              <button className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-3 rounded-xl transition-colors text-sm">Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/home" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FiArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">My Cart</h1>
          <span className="ml-auto text-sm font-semibold text-gray-400">{cart.length} items</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <FiShoppingCart size={64} className="text-gray-200 mb-4" />
            <p className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</p>
            <p className="text-gray-400 mb-6">Add some products to get started</p>
            <Link href="/home"><button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">Browse Products</button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Items */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {cartItems.map(({ productId, quantity, product: p }: any) => (
                <div key={productId} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-start shadow-sm">
                  <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover shrink-0 bg-gray-50" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.subtitle}</p>
                      </div>
                      <button onClick={() => removeFromCart(productId)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0 p-1">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-black text-blue-600">${p.price?.toFixed(2)}</span>
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateQty(productId, -1)} className="w-9 h-9 flex items-center justify-center text-lg font-medium text-gray-500 hover:bg-gray-100 transition-colors">−</button>
                        <span className="w-10 text-center text-sm font-bold border-x border-gray-200">{quantity}</span>
                        <button onClick={() => updateQty(productId, 1)} className="w-9 h-9 flex items-center justify-center text-lg font-medium text-gray-500 hover:bg-gray-100 transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex flex-col gap-4">
              {/* Coupon */}
              <div className="bg-blue-50 border border-dashed border-blue-200 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FiTag size={18} className="text-blue-600" />
                  <div>
                    <p className="font-bold text-sm text-gray-900">Apply Coupon</p>
                    <p className="text-xs text-gray-500">Save up to 20% on your order</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter code" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400" />
                  <button onClick={() => { if (coupon) setApplied(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors">
                    {applied ? '✓' : 'Apply'}
                  </button>
                </div>
              </div>

              {/* Summary card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="font-bold text-gray-900 mb-4">Order Summary</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">${sub.toFixed(2)}</span></div>
                  {applied && <div className="flex justify-between text-emerald-600"><span>Discount (10%)</span><span className="font-semibold">-${disc.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-gray-600"><span>Tax (5%)</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-emerald-600"><span>Shipping</span><span className="font-bold">Free</span></div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-black text-gray-900">Total</span>
                    <span className="font-black text-xl text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-medium mt-3">{error}</p>}

                <Link href={user ? '/checkout' : '/login'}>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm mt-5 flex items-center justify-center gap-2">
                    Proceed to Checkout
                  </button>
                </Link>

                {!user && <p className="text-xs text-gray-400 text-center mt-3">You'll need to sign in to checkout</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
