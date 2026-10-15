import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test connection
    await prisma.$connect();
    
    // Count users
    const userCount = await prisma.user.count();
    
    // Get demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@pocket.com' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      database: 'Connected',
      userCount,
      demoUser,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
