import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        dayCompletions: true,
        journalEntries: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      currentDay: user.currentDay,
      totalPoints: user.totalPoints,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      dayCompletions: user.dayCompletions,
      journalEntries: user.journalEntries,
    });
  } catch (error) {
    console.error('Challenge GET error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, dayNumber, journalContent } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'completeDay') {
      // Check if this day is already completed
      const existingCompletion = await prisma.dayCompletion.findUnique({
        where: {
          userId_dayNumber: {
            userId: session.user.id,
            dayNumber: dayNumber,
          },
        },
      });

      if (!existingCompletion) {
        // Award points for completing a day
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            totalPoints: { increment: 25 },
            currentStreak: { increment: 1 },
            currentDay: dayNumber + 1,
          },
        });

        // Create day completion record
        await prisma.dayCompletion.create({
          data: {
            userId: session.user.id,
            dayNumber: dayNumber,
            completed: true,
            completedAt: new Date(),
          },
        });
      }
    }

    if (action === 'journalEntry' && journalContent) {
      // Check if journal entry already exists BEFORE upserting
      const existingJournal = await prisma.journalEntry.findUnique({
        where: {
          userId_dayNumber: {
            userId: session.user.id,
            dayNumber: dayNumber,
          },
        },
      });

      // Save or update journal entry
      await prisma.journalEntry.upsert({
        where: {
          userId_dayNumber: {
            userId: session.user.id,
            dayNumber: dayNumber,
          },
        },
        create: {
          userId: session.user.id,
          dayNumber: dayNumber,
          content: journalContent,
        },
        update: {
          content: journalContent,
        },
      });

      // Award 10 bonus points only for first-time journal entry
      if (!existingJournal) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            totalPoints: { increment: 10 },
          },
        });
      }
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return NextResponse.json({
      currentDay: updatedUser?.currentDay,
      totalPoints: updatedUser?.totalPoints,
      currentStreak: updatedUser?.currentStreak,
    });
  } catch (error) {
    console.error('Challenge POST error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
