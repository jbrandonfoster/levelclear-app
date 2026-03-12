import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.communityPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            currentDay: true,
            email: true,
          },
        },
        likes: {
          select: { id: true },
        },
        comments: {
          select: { id: true },
        },
      },
      take: 50,
    });

    const transformedPosts = posts.map((post) => ({
      id: post.id,
      userId: post.userId,
      userName: post.user.name,
      userImage: post.user.image,
      userDay: post.user.currentDay,
      isCreator: post.user.email === 'jbrandonfoster@levelclear.com',
      content: post.content,
      likes: post.likes.length,
      comments: post.comments.length,
      createdAt: post.createdAt.toISOString(),
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Community GET error:', error);
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

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Content must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Award points for posting
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalPoints: { increment: 15 },
      },
    });

    const post = await prisma.communityPost.create({
      data: {
        userId: session.user.id,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            currentDay: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        id: post.id,
        userId: post.userId,
        userName: post.user.name,
        userImage: post.user.image,
        userDay: post.user.currentDay,
        isCreator: post.user.email === 'jbrandonfoster@levelclear.com',
        content: post.content,
        likes: 0,
        comments: 0,
        createdAt: post.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Community POST error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
