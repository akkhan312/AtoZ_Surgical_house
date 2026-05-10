import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';
import { getTokenFromRequest } from '@/lib/auth';

// GET: All products (admin view — no limit)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const caller = getTokenFromRequest(req);
    if (!caller || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, subtitle, description, price, originalPrice, image, category, categoryId, inStock, featured, specifications, howToUse } = body;

    if (!name || !price || !category || !categoryId) {
      return NextResponse.json({ error: 'Name, price, category, and categoryId are required' }, { status: 400 });
    }

    const product = await Product.create({
      name,
      subtitle: subtitle || '',
      description: description || '',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      image: image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
      category,
      categoryId,
      rating: 0,
      reviewCount: 0,
      inStock: inStock !== false,
      featured: featured === true,
      specifications: specifications || [],
      howToUse: howToUse || [],
      reviews: [],
    });

    return NextResponse.json({ message: 'Product created', product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
