import { LayoutDashboard, Target, BarChart3, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { path: '/habits', icon: Target, label: 'Habits' },
    { path: '/analytics', icon: BarChart3, label: 'Stats' },
    { path: '/profile', icon: User, label: 'Profile' },
];

export function MobileNav() {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50 pb-safe">
            <nav className="flex items-center justify-around h-16 px-2">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => cn(
                            'flex flex-col items-center justify-center w-full h-full gap-1 text-xs transition-colors relative',
                            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="relative">
                                    <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobile-nav-indicator"
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </div>
                                <span className="font-medium">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
