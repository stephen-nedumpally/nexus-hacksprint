'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionText?: string;
}

export function AuthCheckModal({ isOpen, onClose, actionText }: AuthCheckModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in required</DialogTitle>
          <DialogDescription>
            {actionText ? (
              <>To {actionText}, please sign in or create an account.</>
            ) : (
              <>Please sign in or create an account to continue.</>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: window.location.href })}
          >
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useAuthCheck() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authActionText, setAuthActionText] = useState<string>();

  const checkAuth = (session: any, actionText?: string) => {
    if (!session) {
      setAuthActionText(actionText);
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  return {
    showAuthModal,
    setShowAuthModal,
    authActionText,
    checkAuth,
  };
}
