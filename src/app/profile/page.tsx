'use client';
import Link from 'next/link';
import { FiShoppingBag, FiHeart, FiBell, FiMapPin, FiCreditCard, FiHelpCircle, FiLogOut, FiEdit2, FiChevronRight, FiSettings } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { useApp } from '@/lib/context';
import { useRouter } from 'next/navigation';

const MENU = [
  { href: '/orders',   icon: FiShoppingBag, label: 'My Orders' },
  { href: '/wishlist', icon: FiHeart,        label: 'Wishlist' },
  { href: '#',         icon: FiBell,         label: 'Notifications' },
];

const SETTINGS = [
  { href: '#', icon: FiMapPin,     label: 'Addresses' },
  { href: '#', icon: FiCreditCard, label: 'Payment Methods' },
  { href: '#', icon: FiHelpCircle, label: 'Support' },
];

export default function ProfilePage() {
  const { user, logout } = useApp();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        {/* Avatar */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 flex flex-col items-center text-center mb-6 shadow-lg">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <MdOutlineLocalHospital size={48} className="text-white" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <FiEdit2 size={13} className="text-blue-600" />
            </button>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">{user?.name || 'Guest User'}</h1>
          <p className="text-blue-100 text-sm mb-4">{user?.email || 'Sign in to your account'}</p>
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full">
            <FiSettings size={12} /> PREMIUM MEMBER
          </span>
        </div>

        {/* Account Activity */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Account Activity</p>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5 shadow-sm">
          {MENU.map(({ href, icon: Icon, label }, i) => (
            <Link key={label} href={href} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-50' : ''}`}>
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center"><Icon size={18} className="text-blue-600" /></div>
              <span className="flex-1 font-semibold text-gray-800 text-sm">{label}</span>
              <FiChevronRight size={16} className="text-gray-300" />
            </Link>
          ))}
        </div>

        {/* Settings */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Settings &amp; Security</p>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6 shadow-sm">
          {SETTINGS.map(({ href, icon: Icon, label }, i) => (
            <Link key={label} href={href} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-50' : ''}`}>
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center"><Icon size={18} className="text-blue-600" /></div>
              <span className="flex-1 font-semibold text-gray-800 text-sm">{label}</span>
              <FiChevronRight size={16} className="text-gray-300" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-red-200 rounded-2xl text-red-500 font-bold text-sm hover:bg-red-50 transition-colors shadow-sm mb-6">
          <FiLogOut size={18} /> Sign Out
        </button>

        <p className="text-center text-xs text-gray-400">Atoz Surgical House — v2.4.1</p>
      </div>
    </div>
  );
}
