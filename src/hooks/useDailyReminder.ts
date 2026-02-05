import { useEffect, useRef } from 'react';
import { useHabits } from '@/context/HabitContext';
import { useTranslation } from 'react-i18next';

export function useDailyReminder() {
    const { profile, habits, getAllHabitsWithStats } = useHabits();
    const { t } = useTranslation();
    const hasNotified = useRef(false);

    useEffect(() => {
        // If notifications are not enabled or user has no habits, do nothing
        if (!profile?.notifications_enabled || habits.length === 0) return;

        // Request permission if needed
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Check if we should notify
        const checkNotification = () => {
            // Don't notify if user declined or has already been notified this session
            if (Notification.permission !== 'granted' || hasNotified.current) return;

            const stats = getAllHabitsWithStats();
            const incompleteCount = stats.filter(h => h.todayValue < h.target).length;

            if (incompleteCount > 0) {
                // Only notify between 9 AM and 9 PM
                const hour = new Date().getHours();
                if (hour >= 9 && hour <= 21) {
                    new Notification(t('app_name'), {
                        body: `You have ${incompleteCount} habits left to smash today! 💪`,
                        icon: '/pwa-192x192.png' // Ensure this exists or use a default
                    });
                    hasNotified.current = true;
                }
            }
        };

        // Check on mount
        checkNotification();

        // Check every hour
        const interval = setInterval(checkNotification, 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, [profile?.notifications_enabled, habits.length, getAllHabitsWithStats, t]);

    return {};
}
