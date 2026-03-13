import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

async function sendSignupNotification(userName: string, userEmail: string) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Level Clear <onboarding@resend.dev>',
        to: 'jfoster@jbrandonfoster.com',
        subject: `New Level Clear Signup: ${userName}`,
        html: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #1a1a1a; color: #ffffff; border-radius: 8px;">
            <h2 style="color: #c9a84c; margin: 0 0 24px 0; font-size: 20px;">New Member Joined Level Clear</h2>
            <p style="color: #d4d4d4; line-height: 1.6; margin: 0 0 8px 0;"><strong style="color: #ffffff;">Name:</strong> ${userName}</p>
            <p style="color: #d4d4d4; line-height: 1.6; margin: 0 0 8px 0;"><strong style="color: #ffffff;">Email:</strong> ${userEmail}</p>
            <p style="color: #d4d4d4; line-height: 1.6; margin: 0 0 0 0;"><strong style="color: #ffffff;">Signed up:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
            <hr style="border: none; border-top: 1px solid #333; margin: 24px 0;" />
            <p style="color: #888; font-size: 13px; margin: 0;">Level Clear Signup Notification</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Resend email error:', errorData);
    }
  } catch (err) {
    // Don't block signup if email fails
    console.error('Failed to send signup notification:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        currentDay: 1,
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
    });

    // Send notification email (non-blocking)
    sendSignupNotification(user.name || email.split('@')[0], user.email);

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
