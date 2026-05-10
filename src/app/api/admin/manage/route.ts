import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { getTokenFromRequest } from '@/lib/auth';

// POST: Add a new admin (only existing admins can do this)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const caller = getTokenFromRequest(req);

    if (!caller || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
    });

    return NextResponse.json({
      message: 'Admin added successfully',
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove an admin
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const caller = getTokenFromRequest(req);

    if (!caller || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get('id');

    if (!targetId) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    if (targetId === caller.userId) {
      return NextResponse.json({ error: 'You cannot remove yourself' }, { status: 400 });
    }

    await User.findByIdAndDelete(targetId);
    return NextResponse.json({ message: 'Admin removed successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
