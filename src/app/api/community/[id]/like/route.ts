import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

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

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: postId,
          },
        },
      });

      return NextResponse.json({ liked: false });
    } else {
      // Like
      await prisma.postLike.create({
        data: {
          userId: session.user.id,
          postId: postId,
        },
      });

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
