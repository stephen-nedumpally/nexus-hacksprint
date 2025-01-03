"use client";

import { Card } from "./card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  imageUrl: string;
  progress?: {
    current: number;
    total: number;
    daysLeft?: number;
  };
  organization?: {
    name: string;
    verified?: boolean;
  };
  className?: string;
}

export function FeatureCard({
  title,
  description,
  imageUrl,
  progress,
  organization,
  className,
}: FeatureCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className={cn("overflow-hidden border-none bg-black/50", className)}>
      <div className="relative h-48 w-full bg-gray-900 rounded-t-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-opacity duration-300 rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          onError={() => setImageError(true)}
          style={{ opacity: imageError ? 0 : 1 }}
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500 rounded-t-lg">
            <span>Image not available</span>
          </div>
        )}
      </div>
      <div className="p-6">
        {organization && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm text-primary flex items-center gap-1">
              {organization.name}
              {organization.verified && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
        {progress && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                {progress.current} of {progress.total} spots
              </span>
              {progress.daysLeft && (
                <span>{progress.daysLeft} days left</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
