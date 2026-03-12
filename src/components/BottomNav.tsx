'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BookIcon,
  UsersIcon,
  JournalIcon,
  UserIcon,
} from './Icons';

const navItems = [
  {
    href: '/dashboard/challenge',
    label: 'Challenge',
    icon: HomeIcon,
  },
  {
    href: '/dashboard/classroom',
    label: 'Classroom',
    icon: BookIcon,
  },
  {
    href: '/dashboard/community',
    label: 'Community',
    icon: UsersIcon,
  },
  {
    href: '/dashboard/reflections',
    label: 'Journal',
    icon: JournalIcon,
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: UserIcon,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-bg border-t border-dark-border">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive
                    ? 'text-accent-gold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
