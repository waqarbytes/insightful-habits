import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Target, Flame, TrendingUp, Settings, Bell, LogOut, Camera, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useHabits } from '@/context/HabitContext';
import { StreakIndicator } from '@/components/habits/StreakIndicator';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const { user, profile, logout, getAllHabitsWithStats, getCompletionRate, getTotalStreak, habits, logs, uploadAvatar, updateProfile, deleteAccount } = useHabits();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const habitsWithStats = getAllHabitsWithStats();
  const completionRate = getCompletionRate();
  const streak = getTotalStreak();
  const totalLogsCount = logs.length;

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast({
          title: "Permission denied",
          description: "Please enable notifications in your browser settings",
          variant: "destructive",
        });
        return;
      }
    }

    updateProfile({ notifications_enabled: checked });
    toast({
      title: checked ? "Notifications enabled" : "Notifications disabled",
      description: checked ? "We'll remind you to track your habits" : "You won't receive daily reminders",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: t('profile.settings_saved'),
      description: t('profile.settings_saved_desc'),
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: t('profile.invalid_file_type'),
        description: t('profile.invalid_file_type_desc'),
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast({
        title: t('profile.file_too_large'),
        description: t('profile.file_too_large_desc'),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const { error } = await uploadAvatar(file);
    setIsUploading(false);

    if (error) {
      toast({
        title: t('profile.upload_failed'),
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: t('profile.profile_updated'),
        description: t('profile.profile_updated_desc'),
      });
    }
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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t('profile.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('profile.subtitle')}
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
              <div
                className="relative group w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center overflow-visible cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name || "User"} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>

                {/* Loading State */}
                {isUploading && (
                  <div className="absolute inset-0 bg-background/80 rounded-2xl flex items-center justify-center z-10">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{profile?.name || user?.email?.split('@')[0]}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{t('profile.joined')} {user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'recently'}</span>
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
              <p className="text-sm text-muted-foreground">{t('profile.active_habits')}</p>
            </div>

            <div className="card-elevated p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Flame className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalLogsCount}</p>
              <p className="text-sm text-muted-foreground">{t('profile.total_logs')}</p>
            </div>

            <div className="card-elevated p-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">{Math.round(completionRate)}%</p>
              <p className="text-sm text-muted-foreground">{t('profile.success_rate')}</p>
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
              <h3 className="text-lg font-semibold text-foreground">{t('profile.account_settings')}</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('profile.name')}</Label>
                  <Input id="name" defaultValue={profile?.name || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.email')}</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                {/* Language Switcher */}
                <LanguageSwitcher />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{t('profile.notifications')}</p>
                      <p className="text-sm text-muted-foreground">{t('profile.notifications_desc')}</p>
                    </div>
                  </div>
                  <Switch
                    checked={profile?.notifications_enabled || false}
                    onCheckedChange={handleNotificationToggle}
                  />
                </div>

              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => toast({ title: "No changes to discard" })}>
                {t('profile.cancel')}
              </Button>
              <Button className="btn-gradient" onClick={handleSaveSettings}>
                {t('profile.save_changes')}
              </Button>
            </div>

          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-elevated p-6 border-destructive/30"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('profile.danger_zone')}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">{t('profile.sign_out_title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('profile.sign_out_desc')}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        const { error } = await deleteAccount();
                        if (error) {
                          toast({
                            title: "Error deleting account",
                            description: error,
                            variant: "destructive",
                          });
                        }
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        </div>
      </div >
    </AppLayout >
  );
}
