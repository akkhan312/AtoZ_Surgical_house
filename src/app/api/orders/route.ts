import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/auth';

// GET /api/orders — get current user's orders
export async function GET(req: NextRequest) {
  const { error, user } = requireAuth(req);
  if (error) return error;

  try {
    await dbConnect();
    const orders = await Order.find({ userId: user!.userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders — place a new order
export async function POST(req: NextRequest) {
  const { error, user } = requireAuth(req);
  if (error) return error;

  try {
    await dbConnect();
    const body = await req.json();
    const { items, total, shippingAddress, paymentMethod } = body;

    if (!items?.length || !total) {
      return NextResponse.json({ error: 'Items and total are required' }, { status: 400 });
    }

    // Ensure each item has required fields
    const cleanItems = items.map((item: any) => ({
      productId: item.productId || '',
      name: item.name || 'Product',
      price: item.price || 0,
      qty: item.qty || 1,
      image: item.image || '',
    }));

    const order = await Order.create({
      userId: user!.userId,
      items: cleanItems,
      total,
      shippingAddress: shippingAddress || 'New York, NY 10001',
      paymentMethod: paymentMethod || 'Credit Card',
      estimatedArrival: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
