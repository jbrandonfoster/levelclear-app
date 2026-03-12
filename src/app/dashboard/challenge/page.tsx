'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getDayContent, getCurrentPhase, getOverallPercentComplete } from '@/lib/challenge-data';
import { CheckIcon } from '@/components/Icons';

interface UserData {
  currentDay: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
}

export default function ChallengePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [journal, setJournal] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const currentDay = userData?.currentDay || 1;
  const dayContent = getDayContent(currentDay);
  const phase = getCurrentPhase(currentDay);
  const progress = getOverallPercentComplete(currentDay);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/challenge');
        if (res.ok) {
          const data = await res.json();
          setUserData(data);

          // Find journal entry for current day
          const entry = data.journalEntries.find(
            (j: any) => j.dayNumber === data.currentDay
          );
          if (entry) {
            setJournal(entry.content);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleCompleteDay = async () => {
    if (!session?.user?.id) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'completeDay',
          dayNumber: currentDay,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUserData({
          currentDay: data.currentDay,
          totalPoints: data.totalPoints,
          currentStreak: data.currentStreak,
          longestStreak: userData?.longestStreak || 0,
        });
      }
    } catch (error) {
      console.error('Failed to complete day:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveJournal = async () => {
    if (!session?.user?.id) return;

    setIsSaving(true);
    try {
      await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'journalEntry',
          dayNumber: currentDay,
          journalContent: journal,
        }),
      });
    } catch (error) {
      console.error('Failed to save journal:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!dayContent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-400">Day not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Day <span className="text-accent-gold">{currentDay}</span>
        </h1>
        <p className="text-gray-400 text-lg mb-4">{phase}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-card rounded-lg p-4 border border-dark-border text-center">
            <div className="text-2xl font-bold text-accent-gold">{userData?.totalPoints || 0}</div>
            <p className="text-xs text-gray-400">Points</p>
          </div>
          <div className="bg-dark-card rounded-lg p-4 border border-dark-border text-center">
            <div className="text-2xl font-bold text-accent-gold">{userData?.currentStreak || 0}</div>
            <p className="text-xs text-gray-400">Streak</p>
          </div>
          <div className="bg-dark-card rounded-lg p-4 border border-dark-border text-center">
            <div className="text-2xl font-bold text-accent-gold">{userData?.longestStreak || 0}</div>
            <p className="text-xs text-gray-400">Best</p>
          </div>
        </div>
      </div>

      {/* Day Content */}
      <div className="space-y-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-accent-gold mb-4">
            {dayContent.title}
          </h2>
        </div>

        {/* The Truth */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-accent-gold mb-3">
            The Truth
          </h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {dayContent.truth}
          </p>
        </div>

        {/* The Question */}
        <div className="bg-dark-card border-l-4 border-accent-gold rounded-lg p-6">
          <h3 className="text-lg font-semibold text-accent-gold mb-3">
            The Question
          </h3>
          <p className="text-gray-300">{dayContent.question}</p>
        </div>

        {/* The Move */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-accent-gold mb-3">
            The Move
          </h3>
          <p className="text-gray-300">{dayContent.move}</p>
        </div>
      </div>

      {/* Journal Entry */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-accent-gold mb-4">
          Your Reflection
        </h3>
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder="What resonated with you today? What did you notice?"
          className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold"
          rows={5}
        />
        <button
          onClick={handleSaveJournal}
          disabled={isSaving}
          className="btn-secondary mt-4"
        >
          {isSaving ? 'Saving...' : 'Save Reflection'}
        </button>
      </div>

      {/* Complete Day Button */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <button
          onClick={handleCompleteDay}
          disabled={isSaving}
          className="btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2"
        >
          <CheckIcon className="w-5 h-5" />
          {isSaving ? 'Processing...' : 'Complete Day'}
        </button>
      </div>

      {/* Navigation Hint */}
      {currentDay < 61 && (
        <div className="text-center text-gray-400 text-sm">
          <p>Complete this day to unlock Day {currentDay + 1}.</p>
          <p className="text-xs mt-2 text-gray-500">
            {currentDay >= 60
              ? 'You\'re at the final stretch. Just one more day…'
              : `${61 - currentDay} days until the foundation is set.`}
          </p>
        </div>
      )}

      {currentDay === 61 && (
        <div className="bg-accent-gold/10 border border-accent-gold rounded-lg p-6 text-center">
          <p className="text-accent-gold font-semibold text-lg mb-2">
            🎉 You made it to Day 61
          </p>
          <p className="text-gray-300">
            Now here's the beautiful part. There's no finish line. There's just
            another day. Then another. Then one more.
          </p>
        </div>
      )}
    </div>
  );
}
