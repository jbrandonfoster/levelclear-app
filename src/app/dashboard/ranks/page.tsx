'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar } from '@/components/Avatar';

interface LeaderboardUser {
  id: string;
  name: string;
  image?: string;
  points: number;
  streak: number;
  currentDay: number;
  rank: number;
}

export default function RanksPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const currentUserRank = users.find((u) => u.id === session?.user?.id);
  const topThree = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Ranks</h1>
        <p className="text-gray-300">
          Points: Complete Day +25 | Streak Bonus +10 | Post +15 | Level +100
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      ) : (
        <>
          {/* Your Rank Card */}
          {currentUserRank && (
            <div className="bg-dark-card border-2 border-accent-gold rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-accent-gold">
                    #{currentUserRank.rank}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Your Rank</p>
                    <p className="text-gray-400 text-sm">
                      {currentUserRank.points} points
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-accent-gold">
                    {currentUserRank.streak}
                  </p>
                  <p className="text-gray-400 text-sm">day streak</p>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 */}
          {topThree.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-accent-gold">
                Top Performers
              </h2>
              <div className="space-y-2">
                {topThree.map((user, idx) => (
                  <div
                    key={user.id}
                    className={`bg-dark-card border rounded-lg p-4 flex items-center justify-between ${
                      idx === 0
                        ? 'border-accent-gold'
                        : 'border-dark-border'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-400 w-8">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </div>
                      <Avatar name={user.name} size="md" />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          Day {user.currentDay}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent-gold">
                        {user.points}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.streak}d streak
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Leaderboard */}
          {rest.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-accent-gold">
                Leaderboard
              </h2>
              <div className="space-y-2">
                {rest.map((user) => (
                  <div
                    key={user.id}
                    className="bg-dark-card border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-accent-gold transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-gray-600 w-8">
                        #{user.rank}
                      </div>
                      <Avatar name={user.name} size="md" />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          Day {user.currentDay}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent-gold">
                        {user.points}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.streak}d streak
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {users.length === 0 && (
            <div className="text-center py-12 bg-dark-card border border-dark-border rounded-lg">
              <p className="text-gray-400">No users yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
