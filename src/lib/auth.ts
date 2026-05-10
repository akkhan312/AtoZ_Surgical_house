import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function getTokenFromRequest(req: NextRequest): { userId: string; email: string; role: string } | null {
  try {
    const token = req.cookies.get('auth_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    return decoded;
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest) {
  const user = getTokenFromRequest(req);
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null };
  }
  return { error: null, user };
}
