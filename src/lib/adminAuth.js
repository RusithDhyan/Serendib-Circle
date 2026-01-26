import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { connectDB } from './mongodb';
import User from '@/models/User';

export async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 };
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  if (!user || (user.role !== 'moderator' && user.role !== 'admin' && user.role !== 'supervisor' && user.role !== 'manager' && user.role !== 'owner')) {
    return { error: 'Access denied. Admin privileges required.', status: 403 };
  }

  return { user, session };
}
