'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiArrowLeft, FiMapPin, FiCreditCard, FiCheckCircle, FiShield,
  FiTruck, FiAlertCircle, FiUser, FiPhone, FiMail, FiHome
} from 'react-icons/fi';
import { useApp } from '@/lib/context';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: FiCreditCard, desc: 'Visa, Mastercard, Amex' },
  { id: 'cod', label: 'Cash on Delivery', icon: FiTruck, desc: 'Pay when you receive' },
  { id: 'bank', label: 'Bank Transfer', icon: FiHome, desc: 'Direct bank payment' },
];

export default function CheckoutPage() {
  const { cart, products, getCartTotal, placeOrder, user, loadProducts } = useApp();
  const router = useRouter();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  const [payment, setPayment] = useState('card');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [step, setStep] = useState(1); // 1 = address, 2 = payment, 3 = review

  useEffect(() => { loadProducts(); }, []);

  const cartItems = cart.map(item => ({
    ...item,
    product: products.find((p: any) => p._id === item.productId || p.id === item.productId),
  })).filter(i => i.product);

  const sub = getCartTotal();
  const tax = sub * 0.05;
  const shipping = sub > 100 ? 0 : 9.99;
  const total = sub + tax + shipping;

  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;

  const handlePlaceOrder = async () => {
    setError('');
    if (!user) { router.push('/login'); return; }
    if (!address.fullName || !address.phone || !address.email || !address.street || !address.city || !address.state || !address.zip || !address.country) {
      setError('Please fill in all required fields');
      setStep(1);
      return;
    }
    setPlacing(true);
    const paymentLabel = PAYMENT_METHODS.find(m => m.id === payment)?.label || 'Credit Card';
    const result = await placeOrder(fullAddress, paymentLabel);
    setPlacing(false);
    if (result.success) {
      setOrderSuccess(result.order);
    } else {
      setError(result.error || 'Failed to place order');
    }
  };

  const ua = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setAddress(p => ({ ...p, [key]: e.target.value }));
  const uc = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setCardInfo(p => ({ ...p, [key]: e.target.value }));

  // Success screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-1">Thank you for your purchase.</p>
          <p className="text-sm font-bold text-blue-600 mb-2">{orderSuccess.orderId}</p>
          <p className="text-xs text-gray-400 mb-6">Estimated delivery: {orderSuccess.estimatedArrival}</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 text-sm">
            <p className="font-semibold text-gray-700 mb-1">Shipping to:</p>
            <p className="text-gray-500">{fullAddress}</p>
            <p className="font-semibold text-gray-700 mt-3 mb-1">Payment:</p>
            <p className="text-gray-500 capitalize">{PAYMENT_METHODS.find(m => m.id === payment)?.label}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/orders" className="flex-1">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">Track Order</button>
            </Link>
            <Link href="/home" className="flex-1">
              <button className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-3 rounded-xl transition-colors text-sm">Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</p>
          <Link href="/home"><button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl mt-4">Browse Products</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/cart" className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FiArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['Shipping', 'Payment', 'Review'].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <button onClick={() => setStep(i + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${step >= i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i + 1}
              </button>
              <span className={`text-sm font-semibold hidden sm:block ${step >= i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-6">
            <FiAlertCircle size={16} /> {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6"><FiMapPin size={18} className="text-blue-600" /> Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                        <FiUser size={16} className="text-gray-400" />
                        <input value={address.fullName} onChange={ua('fullName')} placeholder="John Doe" className="flex-1 text-sm bg-transparent outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                        <FiPhone size={16} className="text-gray-400" />
                        <input value={address.phone} onChange={ua('phone')} placeholder="+966 5XX XXX XXXX" className="flex-1 text-sm bg-transparent outline-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                      <FiMail size={16} className="text-gray-400" />
                      <input value={address.email} onChange={ua('email')} placeholder="john@example.com" className="flex-1 text-sm bg-transparent outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Street Address <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                      <FiHome size={16} className="text-gray-400" />
                      <input value={address.street} onChange={ua('street')} placeholder="123 Main Street, Apt 4B" className="flex-1 text-sm bg-transparent outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">City <span className="text-red-500">*</span></label>
                      <input value={address.city} onChange={ua('city')} placeholder="New York" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">State <span className="text-red-500">*</span></label>
                      <input value={address.state} onChange={ua('state')} placeholder="NY" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">ZIP Code <span className="text-red-500">*</span></label>
                      <input value={address.zip} onChange={ua('zip')} placeholder="10001" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Country <span className="text-red-500">*</span></label>
                    <input value={address.country} onChange={ua('country')} placeholder="Saudi Arabia" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>
                <button onClick={() => {
                  if (!address.fullName || !address.phone || !address.email || !address.street || !address.city || !address.state || !address.zip || !address.country) {
                    setError('Please fill in all required fields'); return;
                  }
                  setError(''); setStep(2);
                }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm mt-6">
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6"><FiCreditCard size={18} className="text-blue-600" /> Payment Method</h2>

                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.id} onClick={() => setPayment(m.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${payment === m.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payment === m.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <m.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{m.label}</p>
                        <p className="text-xs text-gray-500">{m.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === m.id ? 'border-blue-600' : 'border-gray-300'}`}>
                        {payment === m.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                      </div>
                    </button>
                  ))}
                </div>

                {payment === 'card' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Card Number</label>
                      <input value={cardInfo.number} onChange={uc('number')} placeholder="1234 5678 9012 3456" maxLength={19}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Name on Card</label>
                      <input value={cardInfo.name} onChange={uc('name')} placeholder="John Doe"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Expiry</label>
                        <input value={cardInfo.expiry} onChange={uc('expiry')} placeholder="MM/YY" maxLength={5}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">CVV</label>
                        <input value={cardInfo.cvv} onChange={uc('cvv')} placeholder="123" maxLength={4} type="password"
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-3.5 rounded-xl transition-colors text-sm">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Address review */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><FiMapPin size={16} className="text-blue-600" /> Shipping</h3>
                    <button onClick={() => setStep(1)} className="text-blue-600 text-xs font-bold">Edit</button>
                  </div>
                  <p className="text-sm text-gray-700 font-semibold">{address.fullName}</p>
                  <p className="text-sm text-gray-500">{address.street}</p>
                  <p className="text-sm text-gray-500">{address.city}, {address.state} {address.zip}</p>
                  <p className="text-sm text-gray-500">{address.phone}</p>
                </div>

                {/* Payment review */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><FiCreditCard size={16} className="text-blue-600" /> Payment</h3>
                    <button onClick={() => setStep(2)} className="text-blue-600 text-xs font-bold">Edit</button>
                  </div>
                  <p className="text-sm text-gray-700 font-semibold">{PAYMENT_METHODS.find(m => m.id === payment)?.label}</p>
                  {payment === 'card' && cardInfo.number && (
                    <p className="text-sm text-gray-500">**** **** **** {cardInfo.number.slice(-4)}</p>
                  )}
                </div>

                {/* Items review */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Items ({cartItems.length})</h3>
                  <div className="space-y-3">
                    {cartItems.map(({ productId, quantity, product: p }: any) => (
                      <div key={productId} className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-50" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                          <p className="text-xs text-gray-500">Qty: {quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-900">${(p.price * quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security note */}
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <FiShield size={20} className="text-emerald-600 shrink-0" />
                  <p className="text-sm text-emerald-700">Your payment information is encrypted and secure.</p>
                </div>

                <button onClick={handlePlaceOrder} disabled={placing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  {placing ? <span className="spinner" /> : <><FiShield size={16} /> Place Order — ${total.toFixed(2)}</>}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-24">
              <p className="font-bold text-gray-900 mb-4">Order Summary</p>
              <div className="space-y-2 text-sm mb-4">
                {cartItems.map(({ productId, quantity, product: p }: any) => (
                  <div key={productId} className="flex justify-between text-gray-600">
                    <span className="truncate max-w-[60%]">{p.name} × {quantity}</span>
                    <span className="font-semibold">${(p.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">${sub.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax (5%)</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : ''}`}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-xl text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
              {sub < 100 && (
                <p className="text-xs text-gray-400 mt-3 text-center">Add ${(100 - sub).toFixed(2)} more for free shipping</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
