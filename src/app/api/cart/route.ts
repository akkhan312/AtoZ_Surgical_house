import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Cart from '@/models/Cart';
import { requireAuth } from '@/lib/auth';

// GET /api/cart — get current user's cart
export async function GET(req: NextRequest) {
  const { error, user } = requireAuth(req);
  if (error) return error;

  try {
    await dbConnect();
    const cart = await Cart.findOne({ userId: user!.userId }).lean();
    return NextResponse.json({ cart: cart || { items: [] } });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart — sync full cart
export async function POST(req: NextRequest) {
  const { error, user } = requireAuth(req);
  if (error) return error;

  try {
    await dbConnect();
    const { items } = await req.json();
    const cart = await Cart.findOneAndUpdate(
      { userId: user!.userId },
      { items },
      { new: true, upsert: true }
    ).lean();
    return NextResponse.json({ cart });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// PATCH /api/cart — add/update single item
export async function PATCH(req: NextRequest) {
  const { error, user } = requireAuth(req);
  if (error) return error;

  try {
    await dbConnect();
    const { productId, qty, price, name, image } = await req.json();

    let cart = await Cart.findOne({ userId: user!.userId });
    if (!cart) {
      cart = new Cart({ userId: user!.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((i: any) => i.productId === productId);
    if (qty <= 0) {
      if (itemIndex > -1) cart.items.splice(itemIndex, 1);
    } else if (itemIndex > -1) {
      cart.items[itemIndex].qty = qty;
    } else {
      cart.items.push({ productId, qty, price, name, image });
    }

    await cart.save();
    return NextResponse.json({ cart });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/cart — clear entire cart
export async function DELETE(req: NextRequest) {
  const { error, user } = requireAuth(req);
  if (error) return error;

  try {
    await dbConnect();
    await Cart.findOneAndDelete({ userId: user!.userId });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
