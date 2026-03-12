'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getDayContent, getCurrentPhase } from '@/lib/challenge-data';
import { ChevronLeftIcon } from '@/components/Icons';

interface JournalEntry {
  id: string;
  dayNumber: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface DayCompletion {
  dayNumber: number;
  completed: boolean;
  completedAt: string;
}

interface ReflectionDay {
  dayNumber: number;
  title: string;
  phase: string;
  question: string;
  journalContent: string | null;
  completedAt: string | null;
}

export default function ReflectionsPage() {
  const { data: session } = useSession();
  const [reflections, setReflections] = useState<ReflectionDay[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/challenge');
        if (res.ok) {
          const data = await res.json();
          setCurrentDay(data.currentDay);

          // Build reflections from completed days
          const completedDays: ReflectionDay[] = [];

          for (let day = 1; day < data.currentDay; day++) {
            const dayContent = getDayContent(day);
            if (!dayContent) continue;

            const journal = data.journalEntries?.find(
              (j: JournalEntry) => j.dayNumber === day
            );
            const completion = data.dayCompletions?.find(
              (c: DayCompletion) => c.dayNumber === day
            );

            completedDays.push({
              dayNumber: day,
              title: dayContent.title,
              phase: getCurrentPhase(day),
              question: dayContent.question,
              journalContent: journal?.content || null,
              completedAt: completion?.completedAt || null,
            });
          }

          // Show newest first
          setReflections(completedDays.reverse());
        }
      } catch (error) {
        console.error('Failed to fetch reflections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const phaseColor = (phase: string) => {
    switch (phase) {
      case 'THE DECISION':
        return 'text-blue-400';
      case 'THE VALLEY':
        return 'text-red-400';
      case 'THE SHIFT':
        return 'text-green-400';
      case 'THE FOUNDATION':
        return 'text-accent-gold';
      case 'PLUS ONE':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Journal</h1>
        <p className="text-gray-400">
          {reflections.length > 0
            ? `${reflections.length} day${reflections.length !== 1 ? 's' : ''} of reflections`
            : 'Your reflections will appear here as you complete each day.'}
        </p>
      </div>

      {/* Empty state */}
      {reflections.length === 0 && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">&#9998;</div>
          <h3 className="text-lg font-semibold text-accent-gold mb-2">
            No reflections yet
          </h3>
          <p className="text-gray-400 mb-4">
            Complete your first challenge day and write a reflection to see it here.
          </p>
        </div>
      )}

      {/* Timeline */}
      {reflections.length > 0 && (
        <div className="space-y-4">
          {reflections.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;

            return (
              <div
                key={day.dayNumber}
                className="bg-dark-card border border-dark-border rounded-lg overflow-hidden transition-all"
              >
                {/* Day Header — always visible, clickable */}
                <button
                  onClick={() =>
                    setExpandedDay(isExpanded ? null : day.dayNumber)
                  }
                  className="w-full text-left p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-accent-gold font-bold text-lg">
                        Day {day.dayNumber}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full bg-dark-bg ${phaseColor(
                          day.phase
                        )}`}
                      >
                        {day.phase}
                      </span>
                    </div>
                    <h3 className="text-white font-medium truncate">
                      {day.title}
                    </h3>
                    {day.completedAt && (
                      <p className="text-gray-500 text-xs mt-1">
                        {formatDate(day.completedAt)}
                      </p>
                    )}
                    {/* Preview of reflection when collapsed */}
                    {!isExpanded && day.journalContent && (
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                        {day.journalContent}
                      </p>
                    )}
                    {!isExpanded && !day.journalContent && (
                      <p className="text-gray-600 text-sm mt-2 italic">
                        No reflection written
                      </p>
                    )}
                  </div>
                  <ChevronLeftIcon
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-1 transition-transform ${
                      isExpanded ? 'rotate-[-90deg]' : 'rotate-180'
                    }`}
                  />
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-dark-border pt-4">
                    {/* The Question they were asked */}
                    <div>
                      <h4 className="text-xs font-semibold text-accent-gold uppercase tracking-wide mb-2">
                        The Question
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {day.question}
                      </p>
                    </div>

                    {/* Their Reflection */}
                    <div>
                      <h4 className="text-xs font-semibold text-accent-gold uppercase tracking-wide mb-2">
                        Your Reflection
                      </h4>
                      {day.journalContent ? (
                        <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                          <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                            {day.journalContent}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                          <p className="text-gray-600 text-sm italic">
                            You didn't write a reflection for this day.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Journey progress at bottom */}
      {reflections.length > 0 && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-dark-card border border-dark-border rounded-full px-5 py-2">
            <span className="text-accent-gold font-semibold">
              Day {currentDay > 61 ? '61+' : currentDay}
            </span>
            <span className="text-gray-500">of 60+1</span>
          </div>
        </div>
      )}
    </div>
  );
}
