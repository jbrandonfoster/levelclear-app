'use client';

import { useState } from 'react';
import { classroomLevels, getLevelContent } from '@/lib/classroom-data';
import { SectionCard } from '@/components/SectionCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons';

export default function ClassroomPage() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  if (selectedLevel !== null) {
    const level = getLevelContent(selectedLevel);
    if (!level) return null;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => setSelectedLevel(null)}
          className="flex items-center gap-2 text-accent-gold hover:text-accent-gold-light mb-8 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Levels
        </button>

        {/* Level Header */}
        <div className="mb-8">
          <div className="text-sm text-gray-400 mb-2">
            Level {level.levelNumber} of {classroomLevels.length}
          </div>
          <h1 className="text-4xl font-bold mb-2">{level.title}</h1>
          <p className="text-lg text-gray-300">{level.subtitle}</p>
        </div>

        {/* Level Content */}
        <div className="space-y-4 mb-8">
          {level.sections.map((section, idx) => (
            <SectionCard
              key={idx}
              title={section.title}
              content={section.content}
              highlighted={idx === 0}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {selectedLevel > 1 && (
            <button
              onClick={() => setSelectedLevel(selectedLevel - 1)}
              className="btn-secondary flex items-center gap-2"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Previous Level
            </button>
          )}
          {selectedLevel < classroomLevels.length && (
            <button
              onClick={() => setSelectedLevel(selectedLevel + 1)}
              className="btn-secondary flex items-center gap-2 ml-auto"
            >
              Next Level
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">The Classroom</h1>
        <p className="text-gray-300">
          Deep dives into the real challenges of building an alcohol-free life.
          Available from Day 1.
        </p>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 gap-4">
        {classroomLevels.map((level) => (
          <button
            key={level.levelNumber}
            onClick={() => setSelectedLevel(level.levelNumber)}
            className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-accent-gold transition-all text-left hover:translate-x-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-accent-gold text-sm font-semibold mb-1">
                  Level {level.levelNumber}
                </div>
                <h3 className="text-xl font-bold mb-2">{level.title}</h3>
                <p className="text-gray-400 text-sm">{level.subtitle}</p>
              </div>
              <ChevronRightIcon className="w-6 h-6 text-accent-gold flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="mt-12 bg-dark-card border border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-accent-gold mb-3">
          All Levels Unlocked
        </h3>
        <p className="text-gray-300">
          You don't need to be on a specific day to explore any level. Each
          level tackles a different aspect of this journey, from identity and
          motivation to the body's physical transformation.
        </p>
      </div>
    </div>
  );
}
