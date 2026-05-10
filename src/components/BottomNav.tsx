'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid2X2, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { useApp } from '@/lib/context';

export default function BottomNav() {
  const pathname = usePathname();
  const { getCartCount } = useApp();
  const cartCount = getCartCount();

  const navItems = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/categories', label: 'Categories', icon: Grid2X2 },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/orders', label: 'Orders', icon: ClipboardList },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== '/home' && pathname.startsWith(href));
        return (
          <Link key={href} href={href} className={`nav-item ${isActive ? 'active' : ''}`}>
            <div style={{ position: 'relative' }}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {href === '/cart' && cartCount > 0 && (
                <span className="nav-badge">{cartCount}</span>
              )}
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
