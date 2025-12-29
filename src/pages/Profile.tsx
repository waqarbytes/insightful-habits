import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Target, Flame, TrendingUp, Settings, Bell, Moon, LogOut } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useHabits } from '@/context/HabitContext';
import { StreakIndicator } from '@/components/habits/StreakIndicator';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Profile() {
  const { user, logout, getAllHabitsWithStats, getCompletionRate, getTotalStreak, habits, logs } = useHabits();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const habitsWithStats = getAllHabitsWithStats();
  const completionRate = getCompletionRate();
  const streak = getTotalStreak();
  const totalLogsCount = logs.length;

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {user?.joinedAt ? format(new Date(user.joinedAt), 'MMMM yyyy') : 'recently'}</span>
                </div>
              </div>

              <StreakIndicator streak={streak} size="lg" />
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="card-elevated p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{habits.length}</p>
              <p className="text-sm text-muted-foreground">Active Habits</p>
            </div>

            <div className="card-elevated p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Flame className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalLogsCount}</p>
              <p className="text-sm text-muted-foreground">Total Logs</p>
            </div>

            <div className="card-elevated p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">{Math.round(completionRate)}%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Account Settings</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive reminders for your habits</p>
                    </div>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Use dark theme</p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => toast({ title: "No changes to discard" })}>
                  Cancel
                </Button>
                <Button className="btn-gradient" onClick={handleSaveSettings}>
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-elevated p-6 border-destructive/30"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">Sign out of your account</p>
                <p className="text-sm text-muted-foreground">
                  You'll need to sign in again to access your habits
                </p>
              </div>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
