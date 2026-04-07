import type { ReactNode } from 'react';

interface DashCardProps {
  title: string;
  spaced?: boolean;
  children: ReactNode;
}

export function DashCard({ title, spaced, children }: DashCardProps) {
  const className = spaced ? 'dash-card dash-card--spaced' : 'dash-card';
  return (
    <div className={className}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
