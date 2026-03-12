'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { LogOutIcon } from '@/components/Icons';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  image?: string;
  currentDay: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

const badges = [
  { id: 'day-1', name: 'Day 1', description: 'Took the first step', unlockDay: 1 },
  { id: 'week-1', name: 'One Week', description: 'Seven days of clarity', unlockDay: 7 },
  { id: 'week-2', name: 'Two Weeks', description: 'The pattern is shifting', unlockDay: 14 },
  { id: 'valley', name: 'The Valley', description: 'Survived the hardest part', unlockDay: 30 },
  { id: 'shift', name: 'The Shift', description: 'Feeling the change', unlockDay: 45 },
  { id: 'sixty', name: '60 Days', description: 'Foundation is set', unlockDay: 60 },
  { id: 'forever', name: '+1 Forever', description: 'One more day, every day', unlockDay: 61 },
  { id: 'level-7', name: 'Level 7', description: 'Completed the homecoming', unlockDay: 999 },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-400">Profile not found</p>
        </div>
      </div>
    );
  }

  const earnedBadges = badges.filter((b) => b.unlockDay <= profile.currentDay);
  const lockedBadges = badges.filter((b) => b.unlockDay > profile.currentDay);

  const memberDate = new Date(profile.createdAt);
  const memberSince = memberDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="text-center mb-12">
        <Avatar name={profile.name || 'User'} size="lg" />
        <h1 className="text-3xl font-bold mt-4 mb-1">
          {profile.name || 'User'}
        </h1>
        <p className="text-gray-400 mb-4">{profile.email}</p>
        <p className="text-sm text-gray-500">Member since {memberSince}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-accent-gold mb-2">
            {profile.totalPoints}
          </div>
          <p className="text-gray-400 text-sm">Total Points</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-accent-gold mb-2">
            {profile.currentStreak}
          </div>
          <p className="text-gray-400 text-sm">Current Streak</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-accent-gold mb-2">
            {profile.longestStreak}
          </div>
          <p className="text-gray-400 text-sm">Best Streak</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-accent-gold mb-2">
            {profile.currentDay}
          </div>
          <p className="text-gray-400 text-sm">Current Day</p>
        </div>
      </div>

      {/* Current Phase */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-accent-gold">Current Phase</h2>
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          {profile.currentDay <= 15 ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">THE DECISION</h3>
              <p className="text-gray-300 text-sm">
                The foundation begins. Every choice you make now is an act of
                self-respect.
              </p>
            </div>
          ) : profile.currentDay <= 30 ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">THE VALLEY</h3>
              <p className="text-gray-300 text-sm">
                The hardest part. This is where most people go back. But you're
                still here.
              </p>
            </div>
          ) : profile.currentDay <= 45 ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">THE SHIFT</h3>
              <p className="text-gray-300 text-sm">
                You feel it changing. Sleep is better. Clarity is back. The fog
                is lifting.
              </p>
            </div>
          ) : profile.currentDay <= 60 ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">THE FOUNDATION</h3>
              <p className="text-gray-300 text-sm">
                You're not white-knuckling anymore. This is becoming who you
                are.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">PLUS ONE</h3>
              <p className="text-gray-300 text-sm">
                It's always just one more day. And you're choosing it.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-accent-gold">Badges</h2>

        {earnedBadges.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Earned</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {earnedBadges.map((badge) => (
                <Badge
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  earned={true}
                />
              ))}
            </div>
          </div>
        )}

        {lockedBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Locked</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {lockedBadges.map((badge) => (
                <Badge
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  earned={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full btn-secondary flex items-center justify-center gap-2 mb-8"
      >
        <LogOutIcon className="w-5 h-5" />
        Sign Out
      </button>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm pb-8">
        <p>Built for jbrandonfoster.com</p>
      </div>
    </div>
  );
}
