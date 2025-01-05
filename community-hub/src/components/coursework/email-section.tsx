'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import type { EmailData } from '@/lib/types/email';
import { EmailCard } from './email-card';

interface EmailSectionProps {
  title: string;
  emails: EmailData[];
  color: string;
  onEmailClick: (email: EmailData) => void;
}

export function EmailSection({ title, emails, color, onEmailClick }: EmailSectionProps) {
  if (emails.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className={`w-1 h-6 bg-${color}-500 rounded-full`} />
        <h2 className="text-lg font-semibold">
          {title}
          <span className="ml-2 text-sm text-muted-foreground">
            ({emails.length})
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emails.map((email) => (
          <EmailCard
            key={email.id}
            email={email}
            onClick={() => onEmailClick(email)}
          />
        ))}
      </div>
    </section>
  );
}
