import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    const comments = await prisma.postComment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
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

    const transformedComments = comments.map((comment) => ({
      id: comment.id,
      userId: comment.userId,
      userName: comment.user.name,
      userImage: comment.user.image,
      userDay: comment.user.currentDay,
      isCreator: comment.user.email === 'jbrandonfoster@levelclear.com',
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    }));

    return NextResponse.json(transformedComments);
  } catch (error) {
    console.error('Comments GET error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = params.id;

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > 300) {
      return NextResponse.json(
        { error: 'Comment must be 300 characters or less' },
        { status: 400 }
      );
    }

    const comment = await prisma.postComment.create({
      data: {
        userId: session.user.id,
        postId,
        content: content.trim(),
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
        id: comment.id,
        userId: comment.userId,
        userName: comment.user.name,
        userImage: comment.user.image,
        userDay: comment.user.currentDay,
        isCreator: comment.user.email === 'jbrandonfoster@levelclear.com',
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Comment POST error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
