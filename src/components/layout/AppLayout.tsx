import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useHabits } from '@/context/HabitContext';
import { Navigate } from 'react-router-dom';
import { ModeToggle } from '../mode-toggle';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useHabits();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden md:flex h-screen sticky top-0">
        <Sidebar />
      </div>

      <main className="flex-1 w-full overflow-x-hidden relative pb-16 md:pb-0">
        <div className="absolute top-4 right-4 z-50">
          <ModeToggle />
        </div>
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
