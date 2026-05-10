'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiPackage, FiShoppingCart, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { useApp } from '@/lib/context';

const MENU = [
  { href: '/admin', icon: FiHome, label: 'Dashboard' },
  { href: '/admin/products', icon: FiPackage, label: 'Products' },
  { href: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
  { href: '/admin/users', icon: FiUsers, label: 'Users' },
  { href: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useApp();
  const router = useRouter();

  // Admin login page renders without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Not logged in or not admin → redirect to admin login
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="text-center">
          <MdOutlineLocalHospital size={48} className="text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h1>
          <p className="text-gray-500 mb-6">Please sign in with an admin account to continue.</p>
          <Link href="/admin/login" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block">
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col fixed h-screen z-10">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 mb-8">
            <MdOutlineLocalHospital size={28} className="text-blue-600" />
            <span className="text-lg font-black text-gray-900">Atoz <span className="text-blue-600">Admin</span></span>
          </Link>

          <nav className="space-y-1.5">
            {MENU.map(m => {
              const active = pathname === m.href;
              return (
                <Link key={m.label} href={m.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <m.icon size={18} /> {m.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiUsers size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); router.push('/admin/login'); }}
            className="flex items-center gap-3 text-gray-500 hover:text-red-500 font-semibold text-sm w-full transition-colors">
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative min-h-screen">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
