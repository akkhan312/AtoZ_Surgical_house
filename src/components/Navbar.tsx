'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiPackage, FiGrid } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { useApp } from '@/lib/context';

const HIDDEN_ROUTES = ['/', '/onboarding', '/login', '/register'];

export default function Navbar() {
  const pathname = usePathname();
  const { getCartCount } = useApp();
  const cartCount = getCartCount();

  if (HIDDEN_ROUTES.includes(pathname) || pathname.startsWith('/admin')) return null;

  return (
    <nav className="hidden md:block bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 shrink-0">
          <MdOutlineLocalHospital size={32} className="text-blue-600" />
          <span className="text-xl font-black text-gray-900">Atoz <span className="text-blue-600">Surgical</span></span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <FiSearch size={18} className="text-gray-400 shrink-0" />
          <input className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none" placeholder="Search medical equipment..." />
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/categories" className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
            <FiGrid size={18} /> Categories
          </Link>
          <Link href="/wishlist" className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
            <FiHeart size={18} /> Wishlist
          </Link>
          <Link href="/orders" className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
            <FiPackage size={18} /> Orders
          </Link>
          <Link href="/profile" className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
            <FiUser size={18} /> Profile
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
            <FiShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}
