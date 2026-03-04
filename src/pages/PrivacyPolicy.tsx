
import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    return (
        <AppLayout>
            <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6 text-foreground">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose dark:prose-invert max-w-none space-y-4">
                        <section>
                            <h2 className="text-xl font-semibold">1. Introduction</h2>
                            <p>
                                Insightful Habits ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you use our mobile application and related services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Account Information:</strong> When you create an account, we collect your name and email address.</li>
                                <li><strong>Habit Data:</strong> We collect the habits you create, your progress logs, streaks, and categories.</li>
                                <li><strong>Usage Data:</strong> We may collect anonymous data about how you interact with our app to improve our services.</li>
                                <li><strong>Profile Information:</strong> Optional data such as your date of birth, wake-up time, and bed time if provided.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
                            <p>We use your information to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Provide, maintain, and improve our services.</li>
                                <li>Process your habit tracking data and generate insights.</li>
                                <li>Send you technical notices and support messages.</li>
                                <li>Respond to your comments and questions.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">4. Data Storage and Security</h2>
                            <p>
                                Your data is stored securely using Supabase (a secure backend-as-a-service). We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">5. User Rights and Account Deletion</h2>
                            <p>
                                You have the right to access, correct, or delete your personal information. You can delete your account and all associated data directly within the app by navigating to <strong>Profile &gt; Account Settings &gt; Delete Account</strong>. This action is irreversible and immediately wipes your data from our servers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">6. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at support@insightfulhabits.com.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
}
