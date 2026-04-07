'use client';

import BackgroundPaths from '@/components/ui/BackgroundPaths';

export default function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="md:ml-64 pb-24 md:pb-8 min-h-screen">
      <BackgroundPaths className="md:left-64 z-0" pathCount={28} />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </main>
  );
}
