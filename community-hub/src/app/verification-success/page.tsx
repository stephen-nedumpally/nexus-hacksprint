'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function VerificationSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/startups');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <CheckCircle className="w-24 h-24 text-lime-400 mx-auto mb-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Verification Complete!
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Thank you for completing the verification process. You now have full
              access to all platform features.
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => router.push('/startups')}
                className="bg-lime-400 text-black hover:bg-lime-400/90"
              >
                Continue to Startups
              </Button>
              <p className="text-sm text-gray-500">
                You will be automatically redirected in a few seconds...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
