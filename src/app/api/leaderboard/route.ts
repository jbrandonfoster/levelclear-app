import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        totalPoints: true,
        currentStreak: true,
        currentDay: true,
      },
      orderBy: {
        totalPoints: 'desc',
      },
      take: 100,
    });

    const leaderboard = users.map((user, idx) => ({
      id: user.id,
      name: user.name || 'Anonymous',
      image: user.image,
      points: user.totalPoints,
      streak: user.currentStreak,
      currentDay: user.currentDay,
      rank: idx + 1,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
