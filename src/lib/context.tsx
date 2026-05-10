'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem { productId: string; quantity: number; }
interface UserType { id: string; name: string; email: string; role?: string; }
interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  user: UserType | null;
  token: string | null;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, delta: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  setUser: (u: UserType | null, token: string | null) => void;
  logout: () => Promise<void>;
  products: any[];
  loadProducts: (params?: Record<string, string>) => Promise<void>;
  loadingProducts: boolean;
  placeOrder: (shippingAddress?: string, paymentMethod?: string) => Promise<{ success: boolean; order?: any; error?: string }>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUserState] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('atoz_cart');
      if (saved) setCart(JSON.parse(saved));
      const savedWishlist = localStorage.getItem('atoz_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      const savedUser = localStorage.getItem('atoz_user');
      const savedToken = localStorage.getItem('atoz_token');
      if (savedUser) setUserState(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
    } catch {}
  }, []);

  // Persist cart and wishlist
  useEffect(() => { localStorage.setItem('atoz_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('atoz_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  const loadProducts = async (params: Record<string, string> = {}) => {
    setLoadingProducts(true);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/products${query ? `?${query}` : ''}`);
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.productId !== productId) return i;
      const newQty = i.quantity + delta;
      return newQty <= 0 ? null : { ...i, quantity: newQty };
    }).filter(Boolean) as CartItem[]);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => {
      const p = products.find((p: any) => p._id === item.productId || p.id === item.productId);
      return sum + (p?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartCount = () => cart.reduce((sum, i) => sum + i.quantity, 0);
  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const setUser = (u: UserType | null, t: string | null) => {
    setUserState(u);
    setToken(t);
    if (u) localStorage.setItem('atoz_user', JSON.stringify(u));
    else localStorage.removeItem('atoz_user');
    if (t) localStorage.setItem('atoz_token', t);
    else localStorage.removeItem('atoz_token');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null, null);
    setCart([]);
  };

  const placeOrder = async (shippingAddress?: string, paymentMethod?: string) => {
    const items = cart.map(item => {
      const p = products.find((p: any) => p._id === item.productId || p.id === item.productId);
      return { productId: item.productId, name: p?.name || 'Unknown', qty: item.quantity, price: p?.price || 0, image: p?.image || '' };
    });
    const total = getCartTotal();

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total, shippingAddress: shippingAddress || 'Default Address', paymentMethod: paymentMethod || 'Credit Card' }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      clearCart();
      return { success: true, order: data.order };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  return (
    <AppContext.Provider value={{
      cart, wishlist, user, token,
      addToCart, removeFromCart, updateQty, getCartTotal, getCartCount, clearCart,
      toggleWishlist, isWishlisted,
      setUser, logout,
      products, loadProducts, loadingProducts,
      placeOrder,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
